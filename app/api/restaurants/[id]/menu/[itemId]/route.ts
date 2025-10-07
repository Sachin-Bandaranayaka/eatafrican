import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/database';
import { requireRestaurantOwnership } from '@/lib/middleware/auth';
import { updateMenuItemSchema } from '@/lib/validation/schemas';

/**
 * PATCH /api/restaurants/[id]/menu/[itemId]
 * Update a menu item (restaurant owner only)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const restaurantId = params.id;
    const itemId = params.itemId;

    // Validate authentication and ownership
    const user = await requireRestaurantOwnership(req, restaurantId);

    const body = await req.json();

    // Validate request body
    const validationResult = updateMenuItemSchema.safeParse(body);

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

    // Verify menu item exists and belongs to the restaurant
    const { data: existingItem, error: fetchError } = await db
      .from('menu_items')
      .select('id, restaurant_id')
      .eq('id', itemId)
      .eq('restaurant_id', restaurantId)
      .single();

    if (fetchError || !existingItem) {
      return NextResponse.json(
        { error: { code: 'RESOURCE_NOT_FOUND', message: 'Menu item not found' } },
        { status: 404 }
      );
    }

    // Build update object with only provided fields
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

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

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (category !== undefined) updateData.category = category;
    if (mealCategory !== undefined) updateData.meal_category = mealCategory;
    if (cuisineType !== undefined) updateData.cuisine_type = cuisineType;
    if (dietaryTags !== undefined) updateData.dietary_tags = dietaryTags;
    if (imageUrl !== undefined) updateData.image_url = imageUrl;
    if (quantity !== undefined) updateData.quantity = quantity;
    if (translations !== undefined) updateData.translations = translations;

    // Update menu item
    const { data: menuItem, error } = await db
      .from('menu_items')
      .update(updateData)
      .eq('id', itemId)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to update menu item' } },
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

    return NextResponse.json({ item });
  } catch (error: any) {
    console.error('Error updating menu item:', error);

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
 * DELETE /api/restaurants/[id]/menu/[itemId]
 * Delete a menu item (restaurant owner only)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const restaurantId = params.id;
    const itemId = params.itemId;

    // Validate authentication and ownership
    const user = await requireRestaurantOwnership(req, restaurantId);

    // Verify menu item exists and belongs to the restaurant
    const { data: existingItem, error: fetchError } = await db
      .from('menu_items')
      .select('id, restaurant_id')
      .eq('id', itemId)
      .eq('restaurant_id', restaurantId)
      .single();

    if (fetchError || !existingItem) {
      return NextResponse.json(
        { error: { code: 'RESOURCE_NOT_FOUND', message: 'Menu item not found' } },
        { status: 404 }
      );
    }

    // Soft delete by setting status to 'inactive'
    // This preserves data for historical orders
    const { error } = await db
      .from('menu_items')
      .update({ 
        status: 'inactive',
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to delete menu item' } },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Menu item deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deleting menu item:', error);

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
