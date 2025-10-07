import { NextRequest, NextResponse } from 'next/server';
import { db, getPaginationParams, createPaginatedResponse } from '@/lib/supabase/database';
import { calculateDistance, formatDistanceString } from '@/lib/utils/distance';
import { optionalAuth, requireRole } from '@/lib/middleware/auth';

/**
 * GET /api/restaurants
 * List all restaurants with filtering, sorting, and pagination
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Extract query parameters
    const city = searchParams.get('city');
    const region = searchParams.get('region');
    const cuisineType = searchParams.get('cuisineType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'name';
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get pagination params
    const { from, to } = getPaginationParams({ page, limit });

    // Build query
    let query = db
      .from('restaurants')
      .select('*', { count: 'exact' })
      .eq('status', 'active'); // Only show active restaurants to customers

    // Apply filters
    if (city) {
      query = query.eq('city', city);
    }

    if (region) {
      query = query.eq('region', region);
    }

    if (cuisineType) {
      query = query.contains('cuisine_types', [cuisineType]);
    }

    if (minPrice) {
      query = query.gte('min_order_amount', parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte('min_order_amount', parseFloat(maxPrice));
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply sorting (distance sorting will be done in-memory)
    if (sortBy === 'rating') {
      query = query.order('rating', { ascending: false });
    } else if (sortBy === 'name') {
      query = query.order('name', { ascending: true });
    }

    // Execute query
    const { data: restaurants, error, count } = await query.range(from, to);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to fetch restaurants' } },
        { status: 500 }
      );
    }

    if (!restaurants) {
      return NextResponse.json(
        createPaginatedResponse([], 0, page, limit)
      );
    }

    // Calculate distance if coordinates provided
    const userLat = latitude ? parseFloat(latitude) : null;
    const userLon = longitude ? parseFloat(longitude) : null;

    const restaurantsWithDistance = restaurants.map((restaurant) => {
      let distance = null;
      let distanceKm = null;

      if (userLat && userLon && restaurant.latitude && restaurant.longitude) {
        distanceKm = calculateDistance(
          userLat,
          userLon,
          restaurant.latitude,
          restaurant.longitude
        );
        distance = formatDistanceString(distanceKm);
      }

      return {
        id: restaurant.id,
        name: restaurant.name,
        cuisine: restaurant.cuisine_types?.join(', ') || '',
        distance: distance || 'Distance not available',
        minPrice: restaurant.min_order_amount,
        rating: restaurant.rating,
        logoUrl: restaurant.logo_url,
        coverImageUrl: restaurant.cover_image_url,
        status: restaurant.status,
        _distanceKm: distanceKm, // For sorting
      };
    });

    // Sort by distance if requested and coordinates provided
    let sortedRestaurants = restaurantsWithDistance;
    if (sortBy === 'distance' && userLat && userLon) {
      sortedRestaurants = restaurantsWithDistance.sort((a, b) => {
        if (a._distanceKm === null) return 1;
        if (b._distanceKm === null) return -1;
        return a._distanceKm - b._distanceKm;
      });
    }

    // Remove internal distance field
    const finalRestaurants = sortedRestaurants.map(({ _distanceKm, ...rest }) => rest);

    // Return paginated response
    return NextResponse.json({
      restaurants: finalRestaurants,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

/**
 * POST /api/restaurants
 * Create a new restaurant (restaurant owner only)
 */
export async function POST(req: NextRequest) {
  try {
    // Validate authentication and role
    const user = await requireRole(['restaurant_owner', 'super_admin'])(req);

    const body = await req.json();

    // Validate required fields
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
      minOrderAmount = 24.0,
      latitude,
      longitude,
      logoUrl,
      coverImageUrl,
      openingHours,
    } = body;

    if (!name || !address || !city || !postalCode || !region || !phone || !email) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' } },
        { status: 400 }
      );
    }

    // Check if user already has a restaurant (for restaurant owners)
    if (user.role === 'restaurant_owner') {
      const { data: existingRestaurant } = await db
        .from('restaurants')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (existingRestaurant) {
        return NextResponse.json(
          { error: { code: 'DUPLICATE_ENTRY', message: 'You already have a restaurant registered' } },
          { status: 409 }
        );
      }
    }

    // Create restaurant
    const { data: restaurant, error } = await db
      .from('restaurants')
      .insert({
        owner_id: user.id,
        name,
        description,
        cuisine_types: cuisineTypes,
        address,
        city,
        postal_code: postalCode,
        region,
        latitude,
        longitude,
        phone,
        email,
        min_order_amount: minOrderAmount,
        status: 'pending', // Requires admin approval
        logo_url: logoUrl,
        cover_image_url: coverImageUrl,
        opening_hours: openingHours,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to create restaurant' } },
        { status: 500 }
      );
    }

    return NextResponse.json({ restaurant }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating restaurant:', error);
    
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
