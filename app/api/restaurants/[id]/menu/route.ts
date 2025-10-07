import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/database';
import { optionalAuth, requireRestaurantOwnership } from '@/lib/middleware/auth';
import { menuQuerySchema, createMenuItemSchema } from '@/lib/validation/schemas';

/**
 * GET /api/restaurants/[id]/menu
 * Fetch all menu items for a restaurant with filtering and sorting
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const restaurantId = params.id;
    const { searchParams } = new URL(req.url);

    // Parse and validate query parameters
    const queryResult = menuQuerySchema.safeParse({
      category: searchParams.get('category'),
      dietaryTag: searchParams.get('dietaryTag'),
      sortBy: searchParams.get('sortBy'),
    });

    if (!queryResult.success) {
      return NextResponse.json(
        { 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid query parameters',
            details: queryResult.error.errors 
          } 
        },
        { status: 400 }
      );
    }

    const { category, dietaryTag, sortBy } = queryResult.data;

    // Get user language preference for multilingual content
    const user = await optionalAuth(req);
    const userLanguage = user?.language || 'en';

    // Verify restaurant exists
    const { data: restaurant, error: restaurantError } = await db
      .from('restaurants')
      .select('id')
      .eq('id', restaurantId)
      .single();

    if (restaurantError || !restaurant) {
      return NextResponse.json(
        { error: { code: 'RESOURCE_NOT_FOUND', message: 'Restaurant not found' } },
        { status: 404 }
      );
    }

    // Build query
    let query = db
      .from('menu_items')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('status', 'active'); // Only show active items

    // Apply category filter
    if (category) {
      query = query.eq('category', category);
    }

    // Apply dietary tag filter
    if (dietaryTag) {
      query = query.contains('dietary_tags', [dietaryTag]);
    }

    // Apply sorting
    if (sortBy === 'price') {
      query = query.order('price', { ascending: true });
    } else if (sortBy === 'name') {
      query = query.order('name', { ascending: true });
    } else {
      // Default sorting by category then name
      query = query.order('category', { ascending: true }).order('name', { ascending: true });
    }

    // Execute query
    const { data: menuItems, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to fetch menu items' } },
        { status: 500 }
      );
    }

    // Transform data to match frontend expectations with multilingual support
    const items = (menuItems || []).map((item) => {
      // Get localized content if available
      let name = item.name;
      let description = item.description;

      if (item.translations && item.translations[userLanguage]) {
        name = item.translations[userLanguage].name || item.name;
        description = item.translations[userLanguage].description || item.description;
      }

      return {
        id: item.id,
        name,
        description,
        price: item.price,
        category: item.category,
        mealCategory: item.meal_category,
        cuisineType: item.cuisine_type,
        dietaryTags: item.dietary_tags || [],
        imageUrl: item.image_url,
        galleryUrls: item.gallery_urls || [],
        quantity: item.quantity,
        status: item.status,
      };
    });

    return NextResponse.json({ items });
  } catch (error: any) {
    console.error('Error fetching menu items:', error);

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
 * POST /api/restaurants/[id]/menu
 * Create a new menu item (restaurant owner only)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const restaurantId = params.id;

    // Validate authentication and ownership
    const user = await requireRestaurantOwnership(req, restaurantId);

    const body = await req.json();

    // Validate request body
    const validationResult = createMenuItemSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid menu item data',
            details: validationResult.error.errors,
          },
        },
        { status: 400 }
      );
    }

    const {
      name,
      description,
      price,
      category,
      mealCategory,
      cuisineType,
      dietaryTags,
      imageUrl,
      quantity,
      translations,
    } = validationResult.data;

    // Verify restaurant exists and is owned by user
    const { data: restaurant, error: restaurantError } = await db
      .from('restaurants')
      .select('id, status')
      .eq('id', restaurantId)
      .single();

    if (restaurantError || !restaurant) {
      return NextResponse.json(
        { error: { code: 'RESOURCE_NOT_FOUND', message: 'Restaurant not found' } },
        { status: 404 }
      );
    }

    // Create menu item
    const { data: menuItem, error } = await db
      .from('menu_items')
      .insert({
        restaurant_id: restaurantId,
        name,
        description,
        price,
        category,
        meal_category: mealCategory,
        cuisine_type: cuisineType,
        dietary_tags: dietaryTags,
        image_url: imageUrl,
        gallery_urls: [],
        quantity,
        status: 'active',
        translations,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to create menu item' } },
        { status: 500 }
      );
    }

    // Transform response to match frontend expectations
    const item = {
      id: menuItem.id,
      name: menuItem.name,
      description: menuItem.description,
      price: menuItem.price,
      category: menuItem.category,
      mealCategory: menuItem.meal_category,
      cuisineType: menuItem.cuisine_type,
      dietaryTags: menuItem.dietary_tags || [],
      imageUrl: menuItem.image_url,
      galleryUrls: menuItem.gallery_urls || [],
      quantity: menuItem.quantity,
      status: menuItem.status,
      translations: menuItem.translations,
      createdAt: menuItem.created_at,
      updatedAt: menuItem.updated_at,
    };

    return NextResponse.json({ item }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating menu item:', error);

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
