import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import { db } from '@/lib/supabase/database';
import { analyticsQuerySchema } from '@/lib/validation/schemas';

export async function GET(req: NextRequest) {
  try {
    // Validate super admin role
    await requireRole(['super_admin'])(req);

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url);
    const queryParams = {
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      region: searchParams.get('region') || undefined,
    };

    if (!queryParams.startDate || !queryParams.endDate) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'startDate and endDate are required' } },
        { status: 400 }
      );
    }

    const validatedParams = analyticsQuerySchema.parse(queryParams);

    // Build base query for orders in date range
    let ordersQuery = db
      .from('orders')
      .select(`
        id,
        status,
        total_amount,
        delivery_fee,
        created_at,
        actual_delivery_time,
        scheduled_delivery_time,
        restaurant:restaurants!orders_restaurant_id_fkey (
          region
        )
      `)
      .gte('created_at', validatedParams.startDate)
      .lte('created_at', validatedParams.endDate);

    if (validatedParams.region) {
      ordersQuery = ordersQuery.eq('restaurants.region', validatedParams.region);
    }

    const { data: orders, error: ordersError } = await ordersQuery;

    if (ordersError) {
      console.error('Error fetching orders for analytics:', ordersError);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to fetch analytics data' } },
        { status: 500 }
      );
    }

    // Calculate total orders and revenue
    const totalOrders = orders?.length || 0;
    const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0;
    const totalDeliveryFees = orders?.reduce((sum, order) => sum + parseFloat(order.delivery_fee), 0) || 0;

    // Calculate platform revenue (assuming 15% commission + delivery fees)
    const platformCommissionRate = 0.15;
    const restaurantRevenue = totalRevenue - totalDeliveryFees;
    const platformRevenue = (restaurantRevenue * platformCommissionRate) + totalDeliveryFees;
    const restaurantEarnings = restaurantRevenue * (1 - platformCommissionRate);

    // Calculate driver earnings (80% of delivery fees)
    const driverEarnings = totalDeliveryFees * 0.8;

    // Get active users count
    const { count: activeCustomers } = await db
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'customer')
      .eq('status', 'active');

    const { count: activeRestaurants } = await db
      .from('restaurants')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: activeDrivers } = await db
      .from('drivers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Calculate average order value
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate average delivery time (for delivered orders)
    const deliveredOrders = orders?.filter(
      order => order.status === 'delivered' && order.actual_delivery_time && order.scheduled_delivery_time
    ) || [];

    const totalDeliveryTime = deliveredOrders.reduce((sum, order) => {
      const scheduled = new Date(order.scheduled_delivery_time).getTime();
      const actual = new Date(order.actual_delivery_time!).getTime();
      return sum + (actual - scheduled);
    }, 0);

    const averageDeliveryTime = deliveredOrders.length > 0
      ? Math.round(totalDeliveryTime / deliveredOrders.length / 60000) // Convert to minutes
      : 0;

    // Group orders by status
    const ordersByStatus = orders?.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Group orders by region
    const ordersByRegion = orders?.reduce((acc, order) => {
      const region = order.restaurant?.region || 'Unknown';
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return NextResponse.json({
      totalOrders,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      platformRevenue: parseFloat(platformRevenue.toFixed(2)),
      restaurantRevenue: parseFloat(restaurantEarnings.toFixed(2)),
      driverEarnings: parseFloat(driverEarnings.toFixed(2)),
      activeCustomers: activeCustomers || 0,
      activeRestaurants: activeRestaurants || 0,
      activeDrivers: activeDrivers || 0,
      averageOrderValue: parseFloat(averageOrderValue.toFixed(2)),
      averageDeliveryTime, // in minutes
      ordersByStatus,
      ordersByRegion,
    });
  } catch (error: any) {
    console.error('Analytics error:', error);

    if (error.name === 'AuthError') {
      return NextResponse.json(
        { error: { code: 'AUTH_UNAUTHORIZED', message: error.message } },
        { status: error.statusCode || 401 }
      );
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid query parameters', details: error.errors } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
