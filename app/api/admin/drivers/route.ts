import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import { db, getPaginationParams, createPaginatedResponse } from '@/lib/supabase/database';
import { adminDriverQuerySchema } from '@/lib/validation/schemas';

export async function GET(req: NextRequest) {
  try {
    // Validate super admin role
    await requireRole(['super_admin'])(req);

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url);
    const queryParams = {
      status: searchParams.get('status') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
    };

    const validatedParams = adminDriverQuerySchema.parse(queryParams);
    const { page, limit, from, to } = getPaginationParams({
      page: validatedParams.page,
      limit: validatedParams.limit,
    });

    // Build query
    let query = db
      .from('drivers')
      .select(`
        id,
        license_number,
        vehicle_type,
        vehicle_plate,
        pickup_zone,
        status,
        rating,
        total_deliveries,
        total_earnings,
        documents_verified,
        created_at,
        user:users!drivers_user_id_fkey (
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

    // Apply pagination and ordering
    query = query
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data: drivers, error, count } = await query;

    if (error) {
      console.error('Error fetching drivers:', error);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to fetch drivers' } },
        { status: 500 }
      );
    }

    // Format response
    const formattedDrivers = (drivers || []).map(driver => ({
      id: driver.id,
      user: {
        id: driver.user.id,
        firstName: driver.user.first_name,
        lastName: driver.user.last_name,
        email: driver.user.email,
        phone: driver.user.phone,
      },
      licenseNumber: driver.license_number,
      vehicleType: driver.vehicle_type,
      vehiclePlate: driver.vehicle_plate,
      pickupZone: driver.pickup_zone,
      status: driver.status,
      rating: driver.rating,
      totalDeliveries: driver.total_deliveries,
      totalEarnings: driver.total_earnings,
      documentsVerified: driver.documents_verified,
      createdAt: driver.created_at,
    }));

    const response = createPaginatedResponse(
      formattedDrivers,
      count || 0,
      page,
      limit
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Admin drivers listing error:', error);

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
