import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/database';
import { requireAuth } from '@/lib/middleware/auth';

/**
 * GET /api/restaurants/[id]/orders
 * Get all orders for a specific restaurant
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: restaurantId } = await params;
    
    console.log('[Restaurant Orders API] Fetching orders for restaurant:', restaurantId);
    
    // Require authentication
    const user = await requireAuth()(req);
    console.log('[Restaurant Orders API] Authenticated user:', { id: user.id, role: user.role, restaurantId: user.restaurantId });

    // Verify user is the restaurant owner or super admin
    if (user.role !== 'super_admin' && user.role !== 'restaurant_owner') {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_UNAUTHORIZED',
            message: 'Only restaurant owners can view restaurant orders',
          },
        },
        { status: 403 }
      );
    }

    // If restaurant owner, verify they own this restaurant
    if (user.role === 'restaurant_owner') {
      const { data: restaurant } = await db
        .from('restaurants')
        .select('owner_id')
        .eq('id', restaurantId)
        .single();

      if (!restaurant || restaurant.owner_id !== user.id) {
        return NextResponse.json(
          {
            error: {
              code: 'AUTH_UNAUTHORIZED',
              message: 'You do not have permission to view orders for this restaurant',
            },
          },
          { status: 403 }
        );
      }
    }

    // Fetch orders for this restaurant
    const { data: orders, error: ordersError } = await db
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          menu_item_id,
          name,
          price,
          quantity,
          subtotal,
          special_instructions
        )
      `)
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to fetch orders',
          },
        },
        { status: 500 }
      );
    }

    // Format the response
    const formattedOrders = orders?.map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      paymentStatus: order.payment_status,
      totalAmount: order.total_amount,
      subtotal: order.subtotal,
      deliveryFee: order.delivery_fee,
      taxAmount: order.tax_amount,
      deliveryAddress: order.delivery_address,
      deliveryCity: order.delivery_city,
      deliveryPostalCode: order.delivery_postal_code,
      deliveryInstructions: order.delivery_instructions,
      scheduledDeliveryTime: order.scheduled_delivery_time,
      actualDeliveryTime: order.actual_delivery_time,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      items: order.order_items?.map((item: any) => ({
        id: item.id,
        menuItemId: item.menu_item_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal,
        specialInstructions: item.special_instructions,
      })) || [],
    })) || [];

    return NextResponse.json({
      orders: formattedOrders,
      total: formattedOrders.length,
    });
  } catch (error: any) {
    console.error('Restaurant orders fetch error:', error);

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
