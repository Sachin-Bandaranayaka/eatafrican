import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/database';
import { requireAuth } from '@/lib/middleware/auth';

/**
 * POST /api/orders/[id]/confirm-delivery
 * Confirm order delivery with customer's delivery code
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;

    // Parse request body
    const body = await req.json();
    const { deliveryCode } = body;

    if (!deliveryCode || typeof deliveryCode !== 'string') {
      return NextResponse.json(
        {
          error: 'Delivery code is required',
        },
        { status: 400 }
      );
    }

    // Require authentication
    const user = await requireAuth()(req);

    // Only drivers can confirm delivery
    if (user.role !== 'driver') {
      return NextResponse.json(
        {
          error: 'Only drivers can confirm delivery',
        },
        { status: 403 }
      );
    }

    // Fetch current order
    const { data: order, error: orderError } = await db
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        {
          error: 'Order not found',
        },
        { status: 404 }
      );
    }

    // Validate driver is assigned to this order
    if (order.driver_id !== user.driverId) {
      return NextResponse.json(
        {
          error: 'You are not assigned to this order',
        },
        { status: 403 }
      );
    }

    // Validate order status
    if (order.status !== 'in_transit') {
      return NextResponse.json(
        {
          error: `Cannot confirm delivery for order with status: ${order.status}`,
        },
        { status: 422 }
      );
    }

    // Verify delivery code
    if (order.delivery_code !== deliveryCode.trim()) {
      return NextResponse.json(
        {
          error: 'Invalid delivery code',
        },
        { status: 400 }
      );
    }

    // Update order - mark as delivered
    const actualDeliveryTime = new Date().toISOString();
    const { data: updatedOrder, error: updateError } = await db
      .from('orders')
      .update({
        status: 'delivered',
        actual_delivery_time: actualDeliveryTime,
        updated_at: actualDeliveryTime,
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError || !updatedOrder) {
      console.error('Order update error:', updateError);
      return NextResponse.json(
        {
          error: 'Failed to confirm delivery',
        },
        { status: 500 }
      );
    }

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

    // Send notification to customer
    if (order.customer_id) {
      await db.from('notifications').insert({
        user_id: order.customer_id,
        type: 'order_status',
        title: 'Order Delivered',
        message: `Your order ${order.order_number} has been delivered successfully`,
        data: { orderId: order.id, orderNumber: order.order_number, status: 'delivered' },
      });
    }

    // Send notification to restaurant
    const { data: restaurant } = await db
      .from('restaurants')
      .select('owner_id')
      .eq('id', order.restaurant_id)
      .single();

    if (restaurant) {
      await db.from('notifications').insert({
        user_id: restaurant.owner_id,
        type: 'order_status',
        title: 'Order Delivered',
        message: `Order ${order.order_number} has been delivered successfully`,
        data: { orderId: order.id, orderNumber: order.order_number, status: 'delivered' },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Delivery confirmed successfully',
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.order_number,
        status: updatedOrder.status,
        actualDeliveryTime: updatedOrder.actual_delivery_time,
      },
    });
  } catch (error: any) {
    console.error('Confirm delivery error:', error);

    if (error.name === 'AuthError') {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        error: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}
