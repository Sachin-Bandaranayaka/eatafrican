import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import { db, getPaginationParams, createPaginatedResponse } from '@/lib/supabase/database';
import { adminOrderQuerySchema } from '@/lib/validation/schemas';

export async function GET(req: NextRequest) {
  try {
    // Validate super admin role
    await requireRole(['super_admin'])(req);

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url);
    const queryParams = {
      status: searchParams.get('status') || undefined,
      region: searchParams.get('region') || undefined,
      startDate: searchParams.get('startDate') || undefined,
      endDate: searchParams.get('endDate') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
    };

    const validatedParams = adminOrderQuerySchema.parse(queryParams);
    const { page, limit, from, to } = getPaginationParams({
      page: validatedParams.page,
      limit: validatedParams.limit,
    });

    // Build query
    let query = db
      .from('orders')
      .select(`
        id,
        order_number,
        status,
        delivery_city,
        total_amount,
        scheduled_delivery_time,
        payment_status,
        payment_method,
        payment_reference,
        created_at,
        restaurant:restaurants!orders_restaurant_id_fkey (
          id,
          name,
          region
        ),
        customer:users!orders_customer_id_fkey (
          id,
          first_name,
          last_name,
          email
        ),
        driver:drivers!orders_driver_id_fkey (
          id,
          user:users!drivers_user_id_fkey (
            first_name,
            last_name
          )
        )
      `, { count: 'exact' });

    // Apply filters
    if (validatedParams.status) {
      query = query.eq('status', validatedParams.status);
    }

    if (validatedParams.region) {
      query = query.eq('restaurants.region', validatedParams.region);
    }

    if (validatedParams.startDate) {
      query = query.gte('created_at', validatedParams.startDate);
    }

    if (validatedParams.endDate) {
      query = query.lte('created_at', validatedParams.endDate);
    }

    // Apply pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data: orders, error, count } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to fetch orders' } },
        { status: 500 }
      );
    }

    // Format response
    const formattedOrders = (orders || []).map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      restaurant: {
        id: order.restaurant.id,
        name: order.restaurant.name,
        region: order.restaurant.region,
      },
      customer: order.customer ? {
        id: order.customer.id,
        firstName: order.customer.first_name,
        lastName: order.customer.last_name,
        email: order.customer.email,
      } : null,
      driver: order.driver ? {
        id: order.driver.id,
        firstName: order.driver.user.first_name,
        lastName: order.driver.user.last_name,
      } : null,
      deliveryCity: order.delivery_city,
      totalAmount: order.total_amount,
      scheduledDeliveryTime: order.scheduled_delivery_time,
      paymentStatus: order.payment_status,
      paymentMethod: order.payment_method,
      paymentReference: order.payment_reference,
      createdAt: order.created_at,
    }));

    // Group orders by region and status for summary
    const ordersByRegion = formattedOrders.reduce((acc, order) => {
      const region = order.restaurant.region;
      if (!acc[region]) {
        acc[region] = 0;
      }
      acc[region] += 1;
      return acc;
    }, {} as Record<string, number>);

    const ordersByStatus = formattedOrders.reduce((acc, order) => {
      if (!acc[order.status]) {
        acc[order.status] = 0;
      }
      acc[order.status] += 1;
      return acc;
    }, {} as Record<string, number>);

    const response = createPaginatedResponse(
      formattedOrders,
      count || 0,
      page,
      limit
    );

    return NextResponse.json({
      ...response,
      summary: {
        ordersByRegion,
        ordersByStatus,
      },
    });
  } catch (error: any) {
    console.error('Admin orders listing error:', error);

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
