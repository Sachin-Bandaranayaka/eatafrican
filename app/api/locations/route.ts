import { NextResponse } from 'next/server';

// Lazy load to avoid module resolution issues
async function loadDependencies() {
  const { supabaseAdmin } = await import('@/lib/supabase/config');
  return { supabaseAdmin };
}

/**
 * GET /api/locations
 * Get available cuisines and locations from restaurants in the database
 */
export async function GET() {
  try {
    const { supabaseAdmin } = await loadDependencies();

    // Fetch all active restaurants
    const { data: restaurants, error } = await supabaseAdmin
      .from('restaurants')
      .select('cuisine_types, city, region')
      .eq('status', 'active');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to fetch locations' } },
        { status: 500 }
      );
    }

    if (!restaurants || restaurants.length === 0) {
      return NextResponse.json({
        cuisines: [],
        locations: [],
      });
    }

    // Extract unique cuisines
    const cuisineSet = new Set<string>();
    restaurants.forEach((restaurant) => {
      if (restaurant.cuisine_types && Array.isArray(restaurant.cuisine_types)) {
        restaurant.cuisine_types.forEach((cuisine: string) => cuisineSet.add(cuisine));
      }
    });

    // Group cuisines by category
    const cuisineGroups: { [key: string]: string[] } = {
      'ETHIOPIA, ERITREA': [],
      'KENYA': [],
      'NIGERIA, GHANA': [],
      'OTHER': [],
    };

    cuisineSet.forEach((cuisine) => {
      if (cuisine.includes('Ethiopian') || cuisine.includes('Eritrean')) {
        cuisineGroups['ETHIOPIA, ERITREA'].push(cuisine);
      } else if (cuisine.includes('Kenyan')) {
        cuisineGroups['KENYA'].push(cuisine);
      } else if (cuisine.includes('Nigerian') || cuisine.includes('Ghanaian')) {
        cuisineGroups['NIGERIA, GHANA'].push(cuisine);
      } else {
        cuisineGroups['OTHER'].push(cuisine);
      }
    });

    // Remove empty groups and format
    const availableCuisines = Object.entries(cuisineGroups)
      .filter(([_, cuisines]) => cuisines.length > 0)
      .map(([group, cuisines]) => ({
        group,
        cuisines,
      }));

    // Count restaurants by location
    const locationCounts: { [key: string]: number } = {};
    restaurants.forEach((restaurant) => {
      const city = restaurant.city?.toUpperCase();
      if (city) {
        locationCounts[city] = (locationCounts[city] || 0) + 1;
      }
    });

    // Format locations with counts
    const locations = Object.entries(locationCounts)
      .map(([city, count]) => ({
        city,
        count,
      }))
      .sort((a, b) => a.city.localeCompare(b.city));

    return NextResponse.json({
      cuisines: availableCuisines,
      locations,
    });
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

