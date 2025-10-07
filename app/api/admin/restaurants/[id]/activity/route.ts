import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import { db, getPaginationParams, createPaginatedResponse } from '@/lib/supabase/database';
import { handleError } from '@/lib/middleware/error-handler';

/**
 * GET /api/admin/restaurants/[id]/activity
 * Get activity logs for a specific restaurant
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate super admin role
    await requireRole(['super_admin'])(req);

    const restaurantId = params.id;
    const { searchParams } = new URL(req.url);
    
    // Parse pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const { from, to } = getPaginationParams({ page, limit });

    // Verify restaurant exists
    const { data: restaurant, error: restaurantError } = await db
      .from('restaurants')
      .select('id, name')
      .eq('id', restaurantId)
      .single();

    if (restaurantError || !restaurant) {
      return NextResponse.json(
        {
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Restaurant not found',
          },
        },
        { status: 404 }
      );
    }

    // Get total count
    const { count, error: countError } = await db
      .from('activity_logs')
      .select('*', { count: 'exact', head: true })
      .eq('entity_type', 'restaurant')
      .eq('entity_id', restaurantId);

    if (countError) {
      throw countError;
    }

    // Fetch activity logs with user information
    const { data: logs, error: logsError } = await db
      .from('activity_logs')
      .select(`
        id,
        user_id,
        entity_type,
        entity_id,
        action,
        details,
        ip_address,
        user_agent,
        created_at,
        users:user_id (
          id,
          email,
          first_name,
          last_name,
          role
        )
      `)
      .eq('entity_type', 'restaurant')
      .eq('entity_id', restaurantId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (logsError) {
      throw logsError;
    }

    // Format response
    const formattedLogs = logs.map((log: any) => ({
      id: log.id,
      action: log.action,
      details: log.details,
      ipAddress: log.ip_address,
      userAgent: log.user_agent,
      createdAt: log.created_at,
      user: log.users ? {
        id: log.users.id,
        email: log.users.email,
        firstName: log.users.first_name,
        lastName: log.users.last_name,
        role: log.users.role,
      } : null,
    }));

    const response = createPaginatedResponse(
      formattedLogs,
      count || 0,
      page,
      limit
    );

    return NextResponse.json(response);
  } catch (error) {
    return handleError(error);
  }
}
