import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/database';
import { optionalAuth, requireRestaurantOwnership } from '@/lib/middleware/auth';

/**
 * GET /api/restaurants/[id]
 * Get restaurant details by ID
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Optional authentication to determine if owner info should be included
    const user = await optionalAuth(req);

    // Fetch restaurant
    const { data: restaurant, error } = await db
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !restaurant) {
      return NextResponse.json(
        { error: { code: 'RESOURCE_NOT_FOUND', message: 'Restaurant not found' } },
        { status: 404 }
      );
    }

    // Build response
    const response: any = {
      id: restaurant.id,
      name: restaurant.name,
      description: restaurant.description,
      cuisineTypes: restaurant.cuisine_types || [],
      address: restaurant.address,
      city: restaurant.city,
      postalCode: restaurant.postal_code,
      region: restaurant.region,
      phone: restaurant.phone,
      email: restaurant.email,
      minOrderAmount: restaurant.min_order_amount,
      rating: restaurant.rating,
      totalRatings: restaurant.total_ratings,
      logoUrl: restaurant.logo_url,
      coverImageUrl: restaurant.cover_image_url,
      openingHours: restaurant.opening_hours || {},
      status: restaurant.status,
      createdAt: restaurant.created_at,
      updatedAt: restaurant.updated_at,
    };

    // Include owner information if user is the owner or super admin
    if (
      user &&
      (user.role === 'super_admin' || 
       (user.role === 'restaurant_owner' && user.restaurantId === id))
    ) {
      const { data: owner } = await db
        .from('users')
        .select('id, email, first_name, last_name, phone')
        .eq('id', restaurant.owner_id)
        .single();

      if (owner) {
        response.owner = {
          id: owner.id,
          email: owner.email,
          firstName: owner.first_name,
          lastName: owner.last_name,
          phone: owner.phone,
        };
      }

      response.ownerId = restaurant.owner_id;
      response.latitude = restaurant.latitude;
      response.longitude = restaurant.longitude;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/restaurants/[id]
 * Update restaurant details (owner or admin only)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate authentication and ownership
    const user = await requireRestaurantOwnership(req, id);

    const body = await req.json();

    // Extract updatable fields
    const {
      name,
      description,
      cuisineTypes,
      address,
      city,
      postalCode,
      region,
      phone,
      email,
      minOrderAmount,
      latitude,
      longitude,
      logoUrl,
      coverImageUrl,
      openingHours,
    } = body;

    // Build update object (only include provided fields)
    const updates: any = {};

    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (cuisineTypes !== undefined) updates.cuisine_types = cuisineTypes;
    if (address !== undefined) updates.address = address;
    if (city !== undefined) updates.city = city;
    if (postalCode !== undefined) updates.postal_code = postalCode;
    if (region !== undefined) updates.region = region;
    if (phone !== undefined) updates.phone = phone;
    if (email !== undefined) updates.email = email;
    if (minOrderAmount !== undefined) updates.min_order_amount = minOrderAmount;
    if (latitude !== undefined) updates.latitude = latitude;
    if (longitude !== undefined) updates.longitude = longitude;
    if (logoUrl !== undefined) updates.logo_url = logoUrl;
    if (coverImageUrl !== undefined) updates.cover_image_url = coverImageUrl;
    if (openingHours !== undefined) updates.opening_hours = openingHours;

    updates.updated_at = new Date().toISOString();

    // Update restaurant
    const { data: restaurant, error } = await db
      .from('restaurants')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to update restaurant' } },
        { status: 500 }
      );
    }

    return NextResponse.json({ restaurant });
  } catch (error: any) {
    console.error('Error updating restaurant:', error);

    if (error.name === 'AuthError') {
      return NextResponse.json(
        { error: { code: 'AUTH_UNAUTHORIZED', message: error.message } },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/restaurants/[id]
 * Delete restaurant (admin only)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Only super admin can delete restaurants
    const user = await requireRestaurantOwnership(req, id);

    if (user.role !== 'super_admin') {
      return NextResponse.json(
        { error: { code: 'AUTH_UNAUTHORIZED', message: 'Only administrators can delete restaurants' } },
        { status: 403 }
      );
    }

    // Delete restaurant (cascade will handle related records)
    const { error } = await db
      .from('restaurants')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to delete restaurant' } },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Restaurant deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting restaurant:', error);

    if (error.name === 'AuthError') {
      return NextResponse.json(
        { error: { code: 'AUTH_UNAUTHORIZED', message: error.message } },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
