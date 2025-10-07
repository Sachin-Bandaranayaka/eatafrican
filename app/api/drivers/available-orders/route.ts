import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/database';
import { requireRole } from '@/lib/middleware/auth';
import { AuthError } from '@/lib/middleware/auth';

/**
 * GET /api/drivers/available-orders
 * Fetch orders ready for pickup in driver's zone
 */
export async function GET(req: NextRequest) {
  try {
    // Require driver role
    const user = await requireRole(['driver'])(req);

    // Get driver's pickup zone
    const { data: driver, error: driverError } = await db
      .from('drivers')
      .select('pickup_zone, status')
      .eq('user_id', user.id)
      .single();

    if (driverError || !driver) {
      return NextResponse.json(
        {
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Driver profile not found',
          },
        },
        { status: 404 }
      );
    }

    // Check if driver is active
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

    const pickupZone = driver.pickup_zone;

    // Fetch orders ready for pickup in the driver's zone
    const { data: orders, error: ordersError } = await db
      .from('orders')
      .select(`
        id,
        order_number,
        delivery_address,
        delivery_city,
        delivery_postal_code,
        scheduled_delivery_time,
        total_amount,
        delivery_fee,
        created_at,
        restaurants!orders_restaurant_id_fkey (
          id,
          name,
          address,
          city,
          postal_code,
          phone,
          region
        )
      `)
      .eq('status', 'ready_for_pickup')
      .is('driver_id', null);

    if (ordersError) {
      console.error('Error fetching available orders:', ordersError);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to fetch available orders',
            details: ordersError.message,
          },
        },
        { status: 500 }
      );
    }

    // Filter orders by pickup zone (restaurant region matches driver's pickup zone)
    const filteredOrders = (orders || []).filter(
      order => order.restaurants?.region === pickupZone
    );

    // Format response
    const response = filteredOrders.map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      restaurant: {
        id: order.restaurants?.id,
        name: order.restaurants?.name,
        address: order.restaurants?.address,
        city: order.restaurants?.city,
        postalCode: order.restaurants?.postal_code,
        phone: order.restaurants?.phone,
        region: order.restaurants?.region,
      },
      deliveryAddress: order.delivery_address,
      deliveryCity: order.delivery_city,
      deliveryPostalCode: order.delivery_postal_code,
      scheduledDeliveryTime: order.scheduled_delivery_time,
      totalAmount: parseFloat(order.total_amount || 0),
      deliveryFee: parseFloat(order.delivery_fee || 0),
      createdAt: order.created_at,
    }));

    return NextResponse.json(
      {
        orders: response,
        pickupZone,
        total: response.length,
      },
      { status: 200 }
    );
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

    console.error('Unexpected error in GET /api/drivers/available-orders:', error);
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
