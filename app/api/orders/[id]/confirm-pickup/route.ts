import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/database';
import { requireAuth } from '@/lib/middleware/auth';

/**
 * POST /api/orders/[id]/confirm-pickup
 * Confirm order pickup with restaurant's pickup code
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;

    // Parse request body
    const body = await req.json();
    const { pickupCode } = body;

    if (!pickupCode || typeof pickupCode !== 'string') {
      return NextResponse.json(
        {
          error: 'Pickup code is required',
        },
        { status: 400 }
      );
    }

    // Require authentication
    const user = await requireAuth()(req);

    // Only drivers can confirm pickup
    if (user.role !== 'driver') {
      return NextResponse.json(
        {
          error: 'Only drivers can confirm pickup',
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
    if (order.status !== 'in_transit' && order.status !== 'assigned') {
      return NextResponse.json(
        {
          error: `Cannot confirm pickup for order with status: ${order.status}`,
        },
        { status: 422 }
      );
    }

    // Verify pickup code
    if (order.pickup_code !== pickupCode.trim()) {
      return NextResponse.json(
        {
          error: 'Invalid pickup code',
        },
        { status: 400 }
      );
    }

    // Update order - mark as picked up
    const { data: updatedOrder, error: updateError } = await db
      .from('orders')
      .update({
        pickup_confirmed_at: new Date().toISOString(),
        status: 'in_transit',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError || !updatedOrder) {
      console.error('Order update error:', updateError);
      return NextResponse.json(
        {
          error: 'Failed to confirm pickup',
        },
        { status: 500 }
      );
    }

    // Send notification to customer
    if (order.customer_id) {
      await db.from('notifications').insert({
        user_id: order.customer_id,
        type: 'order_status',
        title: 'Order Picked Up',
        message: `Your order ${order.order_number} has been picked up and is on the way`,
        data: { orderId: order.id, orderNumber: order.order_number, status: 'in_transit' },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Pickup confirmed successfully',
      order: {
        id: updatedOrder.id,
        orderNumber: updatedOrder.order_number,
        status: updatedOrder.status,
        pickupConfirmedAt: updatedOrder.pickup_confirmed_at,
      },
    });
  } catch (error: any) {
    console.error('Confirm pickup error:', error);

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
