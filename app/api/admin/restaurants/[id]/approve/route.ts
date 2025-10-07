import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import { db } from '@/lib/supabase/database';
import { approveRestaurantSchema } from '@/lib/validation/schemas';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate super admin role
    const user = await requireRole(['super_admin'])(req);

    const restaurantId = params.id;

    // Parse and validate request body
    const body = await req.json();
    const validatedData = approveRestaurantSchema.parse(body);

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

    // Update restaurant status
    const { data: updatedRestaurant, error: updateError } = await db
      .from('restaurants')
      .update({
        status: validatedData.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', restaurantId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating restaurant status:', updateError);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to update restaurant status' } },
        { status: 500 }
      );
    }

    // Create activity log entry
    await db.from('activity_logs').insert({
      user_id: user.id,
      entity_type: 'restaurant',
      entity_id: restaurantId,
      action: `restaurant_${validatedData.status}`,
      details: {
        previousStatus: restaurant.status,
        newStatus: validatedData.status,
        restaurantName: restaurant.name,
      },
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
    });

    // Create notification for restaurant owner
    const notificationMessage = validatedData.status === 'active'
      ? `Your restaurant "${restaurant.name}" has been approved and is now active!`
      : `Your restaurant "${restaurant.name}" has been ${validatedData.status}.`;

    await db.from('notifications').insert({
      user_id: restaurant.owner.id,
      type: 'account',
      title: validatedData.status === 'active' ? 'Restaurant Approved' : 'Restaurant Status Updated',
      message: notificationMessage,
      data: {
        restaurantId: restaurantId,
        status: validatedData.status,
      },
    });

    // TODO: Send email notification to restaurant owner
    // This would be implemented when email service is set up
    // await sendEmail({
    //   to: restaurant.owner.email,
    //   subject: validatedData.status === 'active' ? 'Restaurant Approved' : 'Restaurant Status Updated',
    //   template: 'restaurant-status-change',
    //   data: {
    //     firstName: restaurant.owner.first_name,
    //     restaurantName: restaurant.name,
    //     status: validatedData.status,
    //     language: restaurant.owner.language,
    //   },
    // });

    return NextResponse.json({
      restaurant: {
        id: updatedRestaurant.id,
        name: updatedRestaurant.name,
        status: updatedRestaurant.status,
        updatedAt: updatedRestaurant.updated_at,
      },
    });
  } catch (error: any) {
    console.error('Restaurant approval error:', error);

    if (error.name === 'AuthError') {
      return NextResponse.json(
        { error: { code: 'AUTH_UNAUTHORIZED', message: error.message } },
        { status: error.statusCode || 401 }
      );
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid request data', details: error.errors } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
