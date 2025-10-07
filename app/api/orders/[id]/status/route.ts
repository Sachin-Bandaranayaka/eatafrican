import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/database';
import { requireAuth } from '@/lib/middleware/auth';
import { updateOrderStatusSchema } from '@/lib/validation/schemas';
import type { OrderStatus } from '@/lib/types';

/**
 * PATCH /api/orders/[id]/status
 * Update order status
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    // Parse and validate request body
    const body = await req.json();
    const validatedData = updateOrderStatusSchema.parse(body);

    // Require authentication
    const user = await requireAuth()(req);

    // Fetch current order
    const { data: order, error: orderError } = await db
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        {
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Order not found',
          },
        },
        { status: 404 }
      );
    }

    // Validate user has permission to update order status
    const canUpdate = await validateStatusUpdatePermission(
      user,
      order,
      validatedData.status
    );

    if (!canUpdate) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_UNAUTHORIZED',
            message: 'You do not have permission to update this order status',
          },
        },
        { status: 403 }
      );
    }

    // Validate status transition
    const isValidTransition = validateStatusTransition(
      order.status,
      validatedData.status
    );

    if (!isValidTransition) {
      return NextResponse.json(
        {
          error: {
            code: 'ORDER_INVALID_STATUS',
            message: `Cannot transition from ${order.status} to ${validatedData.status}`,
          },
        },
        { status: 422 }
      );
    }

    // Prepare update data
    const updateData: any = {
      status: validatedData.status,
      updated_at: new Date().toISOString(),
    };

    // Handle driver assignment
    if (validatedData.status === 'assigned' && validatedData.driverId) {
      // Validate driver exists and is active
      const { data: driver, error: driverError } = await db
        .from('drivers')
        .select('*')
        .eq('id', validatedData.driverId)
        .single();

      if (driverError || !driver) {
        return NextResponse.json(
          {
            error: {
              code: 'RESOURCE_NOT_FOUND',
              message: 'Driver not found',
            },
          },
          { status: 404 }
        );
      }

      if (driver.status !== 'active') {
        return NextResponse.json(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: 'Driver is not active',
            },
          },
          { status: 422 }
        );
      }

      updateData.driver_id = validatedData.driverId;
    }

    // Handle delivery completion
    if (validatedData.status === 'delivered') {
      updateData.actual_delivery_time = validatedData.actualDeliveryTime || new Date().toISOString();

      // Update driver earnings
      if (order.driver_id) {
        const { data: driver } = await db
          .from('drivers')
          .select('total_deliveries, total_earnings')
          .eq('id', order.driver_id)
          .single();

        if (driver) {
          await db
            .from('drivers')
            .update({
              total_deliveries: driver.total_deliveries + 1,
              total_earnings: driver.total_earnings + order.delivery_fee,
            })
            .eq('id', order.driver_id);
        }
      }
    }

    // Update order status
    const { data: updatedOrder, error: updateError } = await db
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single();

    if (updateError || !updatedOrder) {
      console.error('Order update error:', updateError);
      return NextResponse.json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to update order status',
          },
        },
        { status: 500 }
      );
    }

    // Send notifications based on status change
    await sendStatusChangeNotifications(updatedOrder, validatedData.status);

    // Return updated order
    return NextResponse.json({
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.order_number,
        status: updatedOrder.status,
        driverId: updatedOrder.driver_id,
        actualDeliveryTime: updatedOrder.actual_delivery_time,
        updatedAt: updatedOrder.updated_at,
      },
    });
  } catch (error: any) {
    console.error('Order status update error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    if (error.name === 'AuthError') {
      return NextResponse.json(
        {
          error: {
            code: error.statusCode === 403 ? 'AUTH_UNAUTHORIZED' : 'AUTH_TOKEN_EXPIRED',
            message: error.message,
          },
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Validate if user has permission to update order to specific status
 */
async function validateStatusUpdatePermission(
  user: any,
  order: any,
  newStatus: OrderStatus
): Promise<boolean> {
  // Super admin can update any order
  if (user.role === 'super_admin') {
    return true;
  }

  // Restaurant owner can update their restaurant's orders
  if (user.role === 'restaurant_owner' && user.restaurantId === order.restaurant_id) {
    // Restaurant can update to: confirmed, preparing, ready_for_pickup, cancelled
    const allowedStatuses: OrderStatus[] = ['confirmed', 'preparing', 'ready_for_pickup', 'cancelled'];
    return allowedStatuses.includes(newStatus);
  }

  // Driver can update orders assigned to them
  if (user.role === 'driver' && user.driverId === order.driver_id) {
    // Driver can update to: in_transit, delivered
    const allowedStatuses: OrderStatus[] = ['in_transit', 'delivered'];
    return allowedStatuses.includes(newStatus);
  }

  // Driver can also accept orders (assign to themselves)
  if (user.role === 'driver' && newStatus === 'assigned') {
    return true;
  }

  return false;
}

/**
 * Validate status transition is allowed
 */
function validateStatusTransition(
  currentStatus: OrderStatus,
  newStatus: OrderStatus
): boolean {
  const validTransitions: Record<OrderStatus, OrderStatus[]> = {
    new: ['confirmed', 'cancelled'],
    confirmed: ['preparing', 'cancelled'],
    preparing: ['ready_for_pickup', 'cancelled'],
    ready_for_pickup: ['assigned', 'cancelled'],
    assigned: ['in_transit', 'cancelled'],
    in_transit: ['delivered', 'cancelled'],
    delivered: [], // Terminal state
    cancelled: [], // Terminal state
  };

  return validTransitions[currentStatus]?.includes(newStatus) || false;
}

/**
 * Send notifications to relevant parties based on status change
 */
async function sendStatusChangeNotifications(
  order: any,
  newStatus: OrderStatus
): Promise<void> {
  try {
    const notifications: Array<{
      user_id: string;
      type: string;
      title: string;
      message: string;
      data: any;
    }> = [];

    // Notify customer
    if (order.customer_id) {
      const statusMessages: Record<OrderStatus, string> = {
        new: 'Order placed successfully',
        confirmed: 'Your order has been confirmed',
        preparing: 'Your order is being prepared',
        ready_for_pickup: 'Your order is ready for pickup',
        assigned: 'A driver has been assigned to your order',
        in_transit: 'Your order is on the way',
        delivered: 'Your order has been delivered',
        cancelled: 'Your order has been cancelled',
      };

      notifications.push({
        user_id: order.customer_id,
        type: 'order_status',
        title: 'Order Status Update',
        message: statusMessages[newStatus] || 'Order status updated',
        data: { orderId: order.id, orderNumber: order.order_number, status: newStatus },
      });
    }

    // Notify restaurant owner on specific statuses
    if (['assigned', 'delivered', 'cancelled'].includes(newStatus)) {
      const { data: restaurant } = await db
        .from('restaurants')
        .select('owner_id')
        .eq('id', order.restaurant_id)
        .single();

      if (restaurant) {
        const restaurantMessages: Record<string, string> = {
          assigned: 'Driver assigned to order',
          delivered: 'Order delivered successfully',
          cancelled: 'Order cancelled',
        };

        notifications.push({
          user_id: restaurant.owner_id,
          type: 'order_status',
          title: 'Order Update',
          message: `${restaurantMessages[newStatus]} - Order ${order.order_number}`,
          data: { orderId: order.id, orderNumber: order.order_number, status: newStatus },
        });
      }
    }

    // Notify driver when order is ready for pickup
    if (newStatus === 'ready_for_pickup' && order.driver_id) {
      const { data: driver } = await db
        .from('drivers')
        .select('user_id')
        .eq('id', order.driver_id)
        .single();

      if (driver) {
        notifications.push({
          user_id: driver.user_id,
          type: 'order_status',
          title: 'Order Ready for Pickup',
          message: `Order ${order.order_number} is ready for pickup`,
          data: { orderId: order.id, orderNumber: order.order_number, status: newStatus },
        });
      }
    }

    // Insert all notifications
    if (notifications.length > 0) {
      await db.from('notifications').insert(notifications);
    }
  } catch (error) {
    console.error('Failed to send notifications:', error);
    // Don't throw error - notifications are not critical
  }
}
