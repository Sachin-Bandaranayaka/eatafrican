import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import { db, getPaginationParams, createPaginatedResponse } from '@/lib/supabase/database';
import { adminRestaurantQuerySchema } from '@/lib/validation/schemas';

export async function GET(req: NextRequest) {
  try {
    // Validate super admin role
    await requireRole(['super_admin'])(req);

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url);
    const queryParams = {
      status: searchParams.get('status') || undefined,
      region: searchParams.get('region') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
    };

    const validatedParams = adminRestaurantQuerySchema.parse(queryParams);
    const { page, limit, from, to } = getPaginationParams({
      page: validatedParams.page,
      limit: validatedParams.limit,
    });

    // Build query
    let query = db
      .from('restaurants')
      .select(`
        *,
        owner:users!restaurants_owner_id_fkey (
          id,
          first_name,
          last_name,
          email,
          phone
        )
      `, { count: 'exact' });

    // Apply filters
    if (validatedParams.status) {
      query = query.eq('status', validatedParams.status);
    }

    if (validatedParams.region) {
      query = query.eq('region', validatedParams.region);
    }

    // Apply pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data: restaurants, error, count } = await query;

    if (error) {
      console.error('Error fetching restaurants:', error);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to fetch restaurants' } },
        { status: 500 }
      );
    }

    // Get total orders for each restaurant
    const restaurantIds = restaurants?.map(r => r.id) || [];
    const { data: orderCounts } = await db
      .from('orders')
      .select('restaurant_id')
      .in('restaurant_id', restaurantIds);

    const orderCountMap = (orderCounts || []).reduce((acc, order) => {
      acc[order.restaurant_id] = (acc[order.restaurant_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Format response
    const formattedRestaurants = (restaurants || []).map(restaurant => ({
      id: restaurant.id,
      name: restaurant.name,
      email: restaurant.email,
      phone: restaurant.phone,
      address: restaurant.address,
      city: restaurant.city,
      postal_code: restaurant.postal_code,
      region: restaurant.region,
      cuisine_types: restaurant.cuisine_types,
      logo_url: restaurant.logo_url,
      cover_image_url: restaurant.cover_image_url,
      owner: {
        id: restaurant.owner.id,
        first_name: restaurant.owner.first_name,
        last_name: restaurant.owner.last_name,
        email: restaurant.owner.email,
        phone: restaurant.owner.phone,
      },
      status: restaurant.status,
      totalOrders: orderCountMap[restaurant.id] || 0,
      created_at: restaurant.created_at,
    }));

    const response = createPaginatedResponse(
      formattedRestaurants,
      count || 0,
      page,
      limit
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Admin restaurants listing error:', error);

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
