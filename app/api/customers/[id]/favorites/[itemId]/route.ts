import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/database';
import { requireCustomerAccess } from '@/lib/middleware/auth';

/**
 * DELETE /api/customers/[id]/favorites/[itemId]
 * Remove a menu item from customer's favorites
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const customerId = params.id;
    const menuItemId = params.itemId;

    // Validate customer access
    await requireCustomerAccess(req, customerId);

    // Check if favorite exists
    const { data: existingFavorite, error: fetchError } = await db
      .from('favorites')
      .select('id')
      .eq('customer_id', customerId)
      .eq('menu_item_id', menuItemId)
      .single();

    if (fetchError || !existingFavorite) {
      return NextResponse.json(
        {
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Favorite not found',
          },
        },
        { status: 404 }
      );
    }

    // Delete the favorite
    const { error: deleteError } = await db
      .from('favorites')
      .delete()
      .eq('customer_id', customerId)
      .eq('menu_item_id', menuItemId);

    if (deleteError) {
      console.error('Favorite deletion error:', deleteError);
      return NextResponse.json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to remove favorite',
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Favorite removed successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Remove favorite error:', error);

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
