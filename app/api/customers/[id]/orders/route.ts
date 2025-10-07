import { NextRequest, NextResponse } from 'next/server';
import { db, getPaginationParams, createPaginatedResponse } from '@/lib/supabase/database';
import { requireCustomerAccess } from '@/lib/middleware/auth';
import { orderQuerySchema } from '@/lib/validation/schemas';

/**
 * GET /api/customers/[id]/orders
 * Get all orders for a customer
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = params.id;

    // Validate customer access
    await requireCustomerAccess(req, customerId);

    // Parse and validate query parameters
    const searchParams = Object.fromEntries(req.nextUrl.searchParams);
    const validatedQuery = orderQuerySchema.parse(searchParams);

    // Get pagination params
    const { page, limit, from, to } = getPaginationParams({
      page: validatedQuery.page,
      limit: validatedQuery.limit,
    });

    // Build query
    let query = db
      .from('orders')
      .select('*, restaurants!inner(id, name, address)', { count: 'exact' })
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
      .range(from, to);

    // Apply status filter if provided
    if (validatedQuery.status) {
      query = query.eq('status', validatedQuery.status);
    }

    // Execute query
    const { data: orders, error: ordersError, count } = await query;

    if (ordersError) {
      console.error('Orders fetch error:', ordersError);
      return NextResponse.json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to fetch orders',
          },
        },
        { status: 500 }
      );
    }

    // Format response
    const formattedOrders = orders?.map(order => ({
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      restaurant: {
        id: order.restaurants.id,
        name: order.restaurants.name,
        address: order.restaurants.address,
      },
      totalAmount: order.total_amount,
      scheduledDeliveryTime: order.scheduled_delivery_time,
      actualDeliveryTime: order.actual_delivery_time,
      paymentStatus: order.payment_status,
      createdAt: order.created_at,
    })) || [];

    // Create paginated response
    const response = createPaginatedResponse(
      formattedOrders,
      count || 0,
      page,
      limit
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Customer orders fetch error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
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
