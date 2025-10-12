import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/database';
import { requireDriverAccess } from '@/lib/middleware/auth';
import { AuthError } from '@/lib/middleware/auth';

/**
 * POST /api/drivers/[id]/orders/[orderId]/accept
 * Accept an order for delivery
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; orderId: string }> }
) {
  try {
    const { id: driverId, orderId } = await params;

    // Validate user has permission to accept orders as this driver
    const user = await requireDriverAccess(req, driverId);

    // Fetch driver information
    const { data: driver, error: driverError } = await db
      .from('drivers')
      .select('id, user_id, pickup_zone, status')
      .eq('id', driverId)
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

    // Validate driver is active
    if (driver.status !== 'active') {
      return NextResponse.json(
        {
          error: {
            code: 'DRIVER_INACTIVE',
            message: 'Driver account is not active',
          },
        },
        { status: 403 }
      );
    }

    // Fetch order with restaurant information
    const { data: order, error: orderError } = await db
      .from('orders')
      .select(`
        *,
        restaurants!orders_restaurant_id_fkey (
          id,
          name,
          region,
          address,
          city,
          phone
        )
      `)
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

    // Validate order is ready for pickup
    if (order.status !== 'ready_for_pickup') {
      return NextResponse.json(
        {
          error: {
            code: 'ORDER_INVALID_STATUS',
            message: `Order is not ready for pickup. Current status: ${order.status}`,
          },
        },
        { status: 422 }
      );
    }

    // Validate order is not already assigned
    if (order.driver_id) {
      return NextResponse.json(
        {
          error: {
            code: 'ORDER_ALREADY_ASSIGNED',
            message: 'Order is already assigned to another driver',
          },
        },
        { status: 409 }
      );
    }

    // Validate restaurant is in driver's pickup zone
    if (order.restaurants?.region !== driver.pickup_zone) {
      return NextResponse.json(
        {
          error: {
            code: 'PICKUP_ZONE_MISMATCH',
            message: `Order is not in your pickup zone. Order zone: ${order.restaurants?.region}, Your zone: ${driver.pickup_zone}`,
          },
        },
        { status: 422 }
      );
    }

    // Assign order to driver and update status
    const { data: updatedOrder, error: updateError } = await db
      .from('orders')
      .update({
        driver_id: driverId,
        status: 'assigned',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      console.error('Error assigning order to driver:', updateError);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to assign order',
            details: updateError.message,
          },
        },
        { status: 500 }
      );
    }

    // Fetch driver user information for notification
    const { data: driverUser } = await db
      .from('users')
      .select('first_name, last_name, phone')
      .eq('id', driver.user_id)
      .single();

    // Send notification to customer
    if (order.customer_id) {
      await db.from('notifications').insert({
        user_id: order.customer_id,
        type: 'order_status',
        title: 'Driver Assigned',
        message: `Your order #${order.order_number} has been assigned to ${driverUser?.first_name || 'a driver'}`,
        data: {
          orderId: order.id,
          orderNumber: order.order_number,
          driverId: driverId,
          driverName: `${driverUser?.first_name} ${driverUser?.last_name}`,
          driverPhone: driverUser?.phone,
          status: 'assigned',
        },
      });
    }

    // Create activity log
    await db.from('activity_logs').insert({
      user_id: user.id,
      entity_type: 'order',
      entity_id: orderId,
      action: 'order_accepted_by_driver',
      details: {
        driverId,
        orderNumber: order.order_number,
        previousStatus: 'ready_for_pickup',
        newStatus: 'assigned',
      },
    });

    // Format response
    const response = {
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.order_number,
        status: updatedOrder.status,
        driverId: updatedOrder.driver_id,
        restaurant: {
          id: order.restaurants?.id,
          name: order.restaurants?.name,
          address: order.restaurants?.address,
          city: order.restaurants?.city,
          phone: order.restaurants?.phone,
        },
        deliveryAddress: updatedOrder.delivery_address,
        deliveryCity: updatedOrder.delivery_city,
        scheduledDeliveryTime: updatedOrder.scheduled_delivery_time,
        totalAmount: parseFloat(updatedOrder.total_amount || 0),
        deliveryFee: parseFloat(updatedOrder.delivery_fee || 0),
      },
      driver: {
        id: driver.id,
        firstName: driverUser?.first_name,
        lastName: driverUser?.last_name,
        phone: driverUser?.phone,
        vehicleType: driver.pickup_zone,
      },
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_ERROR',
            message: error.message,
          },
        },
        { status: error.statusCode }
      );
    }

    console.error('Unexpected error in POST /api/drivers/[id]/orders/[orderId]/accept:', error);
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
