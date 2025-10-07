import { NextRequest, NextResponse } from 'next/server';
import { db, getPaginationParams, createPaginatedResponse } from '@/lib/supabase/database';
import { calculateDistance, formatDistanceString } from '@/lib/utils/distance';

/**
 * GET /api/restaurants/search
 * Full-text search on restaurant name and description with filtering and sorting
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Extract query parameters
    const query = searchParams.get('q') || searchParams.get('query');
    const city = searchParams.get('city');
    const region = searchParams.get('region');
    const cuisineType = searchParams.get('cuisineType');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!query) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Search query is required' } },
        { status: 400 }
      );
    }

    // Get pagination params
    const { from, to } = getPaginationParams({ page, limit });

    // Build search query with full-text search
    let dbQuery = db
      .from('restaurants')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`);

    // Apply filters
    if (city) {
      dbQuery = dbQuery.eq('city', city);
    }

    if (region) {
      dbQuery = dbQuery.eq('region', region);
    }

    if (cuisineType) {
      dbQuery = dbQuery.contains('cuisine_types', [cuisineType]);
    }

    if (minPrice) {
      dbQuery = dbQuery.gte('min_order_amount', parseFloat(minPrice));
    }

    if (maxPrice) {
      dbQuery = dbQuery.lte('min_order_amount', parseFloat(maxPrice));
    }

    // Apply sorting (distance and relevance sorting will be done in-memory)
    if (sortBy === 'rating') {
      dbQuery = dbQuery.order('rating', { ascending: false });
    } else if (sortBy === 'name') {
      dbQuery = dbQuery.order('name', { ascending: true });
    } else if (sortBy === 'price') {
      dbQuery = dbQuery.order('min_order_amount', { ascending: true });
    }

    // Execute query
    const { data: restaurants, error, count } = await dbQuery.range(from, to);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to search restaurants' } },
        { status: 500 }
      );
    }

    if (!restaurants || restaurants.length === 0) {
      return NextResponse.json({
        restaurants: [],
        total: 0,
        page,
        totalPages: 0,
        query,
      });
    }

    // Calculate distance if coordinates provided
    const userLat = latitude ? parseFloat(latitude) : null;
    const userLon = longitude ? parseFloat(longitude) : null;

    // Calculate relevance score based on query match
    const restaurantsWithScore = restaurants.map((restaurant) => {
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

      // Calculate relevance score
      const nameLower = restaurant.name.toLowerCase();
      const descLower = (restaurant.description || '').toLowerCase();
      const queryLower = query.toLowerCase();

      let relevanceScore = 0;

      // Exact match in name gets highest score
      if (nameLower === queryLower) {
        relevanceScore = 100;
      } else if (nameLower.startsWith(queryLower)) {
        relevanceScore = 80;
      } else if (nameLower.includes(queryLower)) {
        relevanceScore = 60;
      } else if (descLower.includes(queryLower)) {
        relevanceScore = 40;
      }

      // Boost score for higher ratings
      relevanceScore += restaurant.rating * 5;

      return {
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        cuisine: restaurant.cuisine_types?.join(', ') || '',
        distance: distance || 'Distance not available',
        minPrice: restaurant.min_order_amount,
        rating: restaurant.rating,
        logoUrl: restaurant.logo_url,
        coverImageUrl: restaurant.cover_image_url,
        status: restaurant.status,
        city: restaurant.city,
        region: restaurant.region,
        _distanceKm: distanceKm,
        _relevanceScore: relevanceScore,
      };
    });

    // Sort results
    let sortedRestaurants = restaurantsWithScore;

    if (sortBy === 'distance' && userLat && userLon) {
      sortedRestaurants = restaurantsWithScore.sort((a, b) => {
        if (a._distanceKm === null) return 1;
        if (b._distanceKm === null) return -1;
        return a._distanceKm - b._distanceKm;
      });
    } else if (sortBy === 'relevance') {
      sortedRestaurants = restaurantsWithScore.sort((a, b) => {
        return b._relevanceScore - a._relevanceScore;
      });
    }

    // Remove internal fields
    const finalRestaurants = sortedRestaurants.map(
      ({ _distanceKm, _relevanceScore, ...rest }) => rest
    );

    // Return paginated response
    return NextResponse.json({
      restaurants: finalRestaurants,
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit),
      query,
    });
  } catch (error) {
    console.error('Error searching restaurants:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
