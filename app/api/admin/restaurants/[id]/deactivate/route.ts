import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import { db } from '@/lib/supabase/database';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireRole(['super_admin'])(req);
    const { id: restaurantId } = await params;

    // Fetch restaurant with owner information
    const { data: restaurant, error: fetchError } = await db
      .from('restaurants')
      .select(`
        id,
        name,
        status,
        owner:users!restaurants_owner_id_fkey (
          id,
          email,
          first_name,
          last_name,
          language
        )
      `)
      .eq('id', restaurantId)
      .single();

    if (fetchError || !restaurant) {
      return NextResponse.json(
        { error: { code: 'RESOURCE_NOT_FOUND', message: 'Restaurant not found' } },
        { status: 404 }
      );
    }

    // Update restaurant status to inactive
    const { data: updatedRestaurant, error: updateError } = await db
      .from('restaurants')
      .update({
        status: 'inactive',
        updated_at: new Date().toISOString(),
      })
      .eq('id', restaurantId)
      .select()
      .single();

    if (updateError) {
      console.error('Error deactivating restaurant:', updateError);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to deactivate restaurant' } },
        { status: 500 }
      );
    }

    // Create activity log entry
    await db.from('activity_logs').insert({
      user_id: user.id,
      entity_type: 'restaurant',
      entity_id: restaurantId,
      action: 'restaurant_deactivated',
      details: {
        previousStatus: restaurant.status,
        newStatus: 'inactive',
        restaurantName: restaurant.name,
      },
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
    });

    // Create notification for restaurant owner
    const owner = Array.isArray(restaurant.owner) ? restaurant.owner[0] : restaurant.owner;
    await db.from('notifications').insert({
      user_id: owner.id,
      type: 'account',
      title: 'Restaurant Deactivated',
      message: `Your restaurant "${restaurant.name}" has been deactivated by an administrator.`,
      data: {
        restaurantId: restaurantId,
        status: 'inactive',
      },
    });

    return NextResponse.json({
      restaurant: {
        id: updatedRestaurant.id,
        name: updatedRestaurant.name,
        status: updatedRestaurant.status,
        updatedAt: updatedRestaurant.updated_at,
      },
    });
  } catch (error: any) {
    console.error('Restaurant deactivation error:', error);

    if (error.name === 'AuthError') {
      return NextResponse.json(
        { error: { code: 'AUTH_UNAUTHORIZED', message: error.message } },
        { status: error.statusCode || 401 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
