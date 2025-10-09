import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import { db } from '@/lib/supabase/database';

export async function DELETE(
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

    // Create activity log entry before deletion
    await db.from('activity_logs').insert({
      user_id: user.id,
      entity_type: 'restaurant',
      entity_id: restaurantId,
      action: 'restaurant_deleted',
      details: {
        restaurantName: restaurant.name,
        previousStatus: restaurant.status,
        deletedBy: user.email,
      },
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
    });

    // Create notification for restaurant owner before deletion
    const owner = Array.isArray(restaurant.owner) ? restaurant.owner[0] : restaurant.owner;
    await db.from('notifications').insert({
      user_id: owner.id,
      type: 'account',
      title: 'Restaurant Deleted',
      message: `Your restaurant "${restaurant.name}" has been permanently deleted by an administrator.`,
      data: {
        restaurantId: restaurantId,
        restaurantName: restaurant.name,
      },
    });

    // Delete the restaurant (cascade will handle related records based on DB constraints)
    const { error: deleteError } = await db
      .from('restaurants')
      .delete()
      .eq('id', restaurantId);

    if (deleteError) {
      console.error('Error deleting restaurant:', deleteError);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to delete restaurant' } },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Restaurant deleted successfully',
      restaurant: {
        id: restaurant.id,
        name: restaurant.name,
      },
    });
  } catch (error: any) {
    console.error('Restaurant deletion error:', error);

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
