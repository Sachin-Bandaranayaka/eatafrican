import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/database';
import { requireRestaurantOwnership } from '@/lib/middleware/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: restaurantId } = await params;

    // Verify user owns this restaurant (or is super admin)
    const user = await requireRestaurantOwnership(req, restaurantId);

    // Fetch orders for this restaurant
    const { data: orders, error: ordersError } = await db
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          menuItem:menu_items(name, price)
        )
      `)
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    return NextResponse.json({ orders: orders || [] });
  } catch (error) {
    console.error('Error in GET /api/restaurants/[id]/orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
