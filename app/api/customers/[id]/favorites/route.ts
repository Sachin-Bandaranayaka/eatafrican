import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/database';
import { requireCustomerAccess } from '@/lib/middleware/auth';
import { addFavoriteSchema } from '@/lib/validation/schemas';

/**
 * GET /api/customers/[id]/favorites
 * Get all favorited menu items for a customer
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: customerId } = await params;

    // Validate customer access
    await requireCustomerAccess(req, customerId);

    // Fetch favorites with menu item and restaurant details
    const { data: favorites, error: favoritesError } = await db
      .from('favorites')
      .select(`
        id,
        created_at,
        menu_items!inner(
          id,
          name,
          description,
          price,
          image_url,
          category,
          dietary_tags,
          status,
          restaurants!inner(
            id,
            name,
            address,
            city,
            region
          )
        )
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (favoritesError) {
      console.error('Favorites fetch error:', favoritesError);
      return NextResponse.json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to fetch favorites',
          },
        },
        { status: 500 }
      );
    }

    // Format response to match frontend expectations
    const formattedFavorites = favorites?.map(favorite => ({
      id: favorite.id,
      menuItem: {
        id: favorite.menu_items.id,
        name: favorite.menu_items.name,
        description: favorite.menu_items.description,
        price: favorite.menu_items.price,
        imageUrl: favorite.menu_items.image_url,
        category: favorite.menu_items.category,
        dietaryTags: favorite.menu_items.dietary_tags,
        status: favorite.menu_items.status,
        restaurant: {
          id: favorite.menu_items.restaurants.id,
          name: favorite.menu_items.restaurants.name,
          address: favorite.menu_items.restaurants.address,
          city: favorite.menu_items.restaurants.city,
          region: favorite.menu_items.restaurants.region,
        },
      },
      createdAt: favorite.created_at,
    })) || [];

    return NextResponse.json({ favorites: formattedFavorites });
  } catch (error: any) {
    console.error('Customer favorites fetch error:', error);

    if (error.name === 'AuthError') {
      return NextResponse.json(
        {
          error: {
            code: error.statusCode === 403 ? 'AUTH_UNAUTHORIZED' : 'AUTH_TOKEN_EXPIRED',
            message: error.message,
          },
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/customers/[id]/favorites
 * Add a menu item to customer's favorites
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = params.id;

    // Validate customer access
    await requireCustomerAccess(req, customerId);

    // Parse and validate request body
    const body = await req.json();
    const validatedData = addFavoriteSchema.parse(body);

    // Check if menu item exists
    const { data: menuItem, error: menuItemError } = await db
      .from('menu_items')
      .select('id')
      .eq('id', validatedData.menuItemId)
      .single();

    if (menuItemError || !menuItem) {
      return NextResponse.json(
        {
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Menu item not found',
          },
        },
        { status: 404 }
      );
    }

    // Check if already favorited (prevent duplicates)
    const { data: existingFavorite } = await db
      .from('favorites')
      .select('id')
      .eq('customer_id', customerId)
      .eq('menu_item_id', validatedData.menuItemId)
      .single();

    if (existingFavorite) {
      return NextResponse.json(
        {
          error: {
            code: 'DUPLICATE_ENTRY',
            message: 'Menu item is already in favorites',
          },
        },
        { status: 409 }
      );
    }

    // Add to favorites
    const { data: favorite, error: favoriteError } = await db
      .from('favorites')
      .insert({
        customer_id: customerId,
        menu_item_id: validatedData.menuItemId,
      })
      .select()
      .single();

    if (favoriteError) {
      console.error('Favorite creation error:', favoriteError);
      return NextResponse.json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to add favorite',
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        favorite: {
          id: favorite.id,
          customerId: favorite.customer_id,
          menuItemId: favorite.menu_item_id,
          createdAt: favorite.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Add favorite error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    if (error.name === 'AuthError') {
      return NextResponse.json(
        {
          error: {
            code: error.statusCode === 403 ? 'AUTH_UNAUTHORIZED' : 'AUTH_TOKEN_EXPIRED',
            message: error.message,
          },
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}
