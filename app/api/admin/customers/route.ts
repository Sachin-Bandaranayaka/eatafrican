import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import { db, getPaginationParams, createPaginatedResponse } from '@/lib/supabase/database';
import { adminCustomerQuerySchema } from '@/lib/validation/schemas';

export async function GET(req: NextRequest) {
  try {
    // Validate super admin role
    await requireRole(['super_admin'])(req);

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url);
    const queryParams = {
      search: searchParams.get('search') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
    };

    const validatedParams = adminCustomerQuerySchema.parse(queryParams);
    const { page, limit, from, to } = getPaginationParams({
      page: validatedParams.page,
      limit: validatedParams.limit,
    });

    // Build query
    let query = db
      .from('users')
      .select('*', { count: 'exact' })
      .eq('role', 'customer');

    // Apply search filter
    if (validatedParams.search) {
      const searchTerm = `%${validatedParams.search.toLowerCase()}%`;
      query = query.or(`email.ilike.${searchTerm},first_name.ilike.${searchTerm},last_name.ilike.${searchTerm}`);
    }

    // Apply pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data: customers, error, count } = await query;

    if (error) {
      console.error('Error fetching customers:', error);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to fetch customers' } },
        { status: 500 }
      );
    }

    // Get order statistics for each customer
    const customerIds = customers?.map(c => c.id) || [];
    
    const { data: orderStats } = await db
      .from('orders')
      .select('customer_id, total_amount')
      .in('customer_id', customerIds)
      .not('customer_id', 'is', null);

    const statsMap = (orderStats || []).reduce((acc, order) => {
      if (!acc[order.customer_id]) {
        acc[order.customer_id] = {
          totalOrders: 0,
          totalSpent: 0,
        };
      }
      acc[order.customer_id].totalOrders += 1;
      acc[order.customer_id].totalSpent += parseFloat(order.total_amount);
      return acc;
    }, {} as Record<string, { totalOrders: number; totalSpent: number }>);

    // Get loyalty points for each customer
    const { data: loyaltyData } = await db
      .from('loyalty_points')
      .select('customer_id, points_balance, lifetime_points')
      .in('customer_id', customerIds);

    const loyaltyMap = (loyaltyData || []).reduce((acc, loyalty) => {
      acc[loyalty.customer_id] = {
        pointsBalance: loyalty.points_balance,
        lifetimePoints: loyalty.lifetime_points,
      };
      return acc;
    }, {} as Record<string, { pointsBalance: number; lifetimePoints: number }>);

    // Format response
    const formattedCustomers = (customers || []).map(customer => {
      const stats = statsMap[customer.id] || { totalOrders: 0, totalSpent: 0 };
      const loyalty = loyaltyMap[customer.id] || { pointsBalance: 0, lifetimePoints: 0 };

      return {
        id: customer.id,
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name,
        phone: customer.phone,
        language: customer.language,
        status: customer.status,
        totalOrders: stats.totalOrders,
        totalSpent: stats.totalSpent,
        loyaltyPoints: loyalty.pointsBalance,
        lifetimePoints: loyalty.lifetimePoints,
        createdAt: customer.created_at,
      };
    });

    const response = createPaginatedResponse(
      formattedCustomers,
      count || 0,
      page,
      limit
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Admin customers listing error:', error);

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
