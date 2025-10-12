import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/database';
import { requireDriverAccess } from '@/lib/middleware/auth';
import { AuthError } from '@/lib/middleware/auth';

/**
 * GET /api/drivers/[id]/orders
 * Fetch all orders assigned to driver with filtering
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: driverId } = await params;

    // Validate user has permission to view driver orders
    const user = await requireDriverAccess(req, driverId);

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(100, parseInt(searchParams.get('limit') || '20'));

    // Build query
    let query = db
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        delivery_address,
        delivery_city,
        delivery_postal_code,
        scheduled_delivery_time,
        actual_delivery_time,
        subtotal,
        delivery_fee,
        discount_amount,
        total_amount,
        created_at,
        updated_at,
        restaurants!orders_restaurant_id_fkey (
          id,
          name,
          address,
          city,
          phone
        )
      `, { count: 'exact' })
      .eq('driver_id', driverId)
      .order('created_at', { ascending: false });

    // Apply filters
    if (status) {
      // Handle multiple statuses separated by comma
      const statuses = status.split(',').map(s => s.trim());
      if (statuses.length === 1) {
        query = query.eq('status', statuses[0]);
      } else {
        query = query.in('status', statuses);
      }
    }

    if (startDate) {
      query = query.gte('created_at', new Date(startDate).toISOString());
    }

    if (endDate) {
      query = query.lte('created_at', new Date(endDate).toISOString());
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Execute query
    const { data: orders, error: ordersError, count } = await query;

    if (ordersError) {
      console.error('Error fetching driver orders:', ordersError);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to fetch driver orders',
            details: ordersError.message,
          },
        },
        { status: 500 }
      );
    }

    // Calculate earnings statistics
    const deliveredOrders = (orders || []).filter(o => o.status === 'delivered');
    const totalEarnings = deliveredOrders.reduce(
      (sum, order) => sum + parseFloat(order.delivery_fee || '0'),
      0
    );
    const totalDeliveries = deliveredOrders.length;

    // Calculate earnings for all orders (including in-progress)
    const allOrdersEarnings = (orders || []).reduce(
      (sum, order) => sum + parseFloat(order.delivery_fee || '0'),
      0
    );

    // Format response
    const formattedOrders = (orders || []).map(order => {
      const restaurant = Array.isArray(order.restaurants) ? order.restaurants[0] : order.restaurants;
      
      return {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        restaurant: restaurant ? {
          id: restaurant.id,
          name: restaurant.name,
          address: restaurant.address,
          city: restaurant.city,
          phone: restaurant.phone,
        } : undefined,
        deliveryAddress: order.delivery_address,
        deliveryCity: order.delivery_city,
        deliveryPostalCode: order.delivery_postal_code,
        scheduledDeliveryTime: order.scheduled_delivery_time,
        actualDeliveryTime: order.actual_delivery_time,
        subtotal: parseFloat(order.subtotal || 0),
        deliveryFee: parseFloat(order.delivery_fee || 0),
        discountAmount: parseFloat(order.discount_amount || 0),
        totalAmount: parseFloat(order.total_amount || 0),
        createdAt: order.created_at,
        updatedAt: order.updated_at,
      };
    });

    const totalPages = Math.ceil((count || 0) / limit);

    return NextResponse.json(
      {
        orders: formattedOrders,
        statistics: {
          totalDeliveries,
          totalEarnings: parseFloat(totalEarnings.toFixed(2)),
          averageEarningsPerDelivery: totalDeliveries > 0 
            ? parseFloat((totalEarnings / totalDeliveries).toFixed(2))
            : 0,
          pendingEarnings: parseFloat((allOrdersEarnings - totalEarnings).toFixed(2)),
        },
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages,
          hasMore: page < totalPages,
        },
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

    console.error('Unexpected error in GET /api/drivers/[id]/orders:', error);
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
