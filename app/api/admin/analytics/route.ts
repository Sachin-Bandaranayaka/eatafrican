import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get('days') || '30');
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const endDate = new Date();
    
    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - days);

    const db = supabaseAdmin;

    // Fetch current period orders
    const { data: orders, error: ordersError } = await db
      .from('orders')
      .select(`
        id,
        status,
        total_amount,
        delivery_fee,
        created_at,
        restaurant_id
      `)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
    }

    // Fetch previous period orders for comparison
    const { data: previousOrders } = await db
      .from('orders')
      .select('total_amount')
      .gte('created_at', previousStartDate.toISOString())
      .lt('created_at', startDate.toISOString());

    // Calculate revenue
    const totalRevenue = orders?.reduce((sum, order) => sum + parseFloat(order.total_amount || '0'), 0) || 0;
    const previousRevenue = previousOrders?.reduce((sum, order) => sum + parseFloat(order.total_amount || '0'), 0) || 0;
    const revenueChange = previousRevenue > 0 ? Math.round(((totalRevenue - previousRevenue) / previousRevenue) * 100) : 0;

    // Calculate orders
    const totalOrders = orders?.length || 0;
    const previousOrderCount = previousOrders?.length || 0;
    const ordersChange = previousOrderCount > 0 ? Math.round(((totalOrders - previousOrderCount) / previousOrderCount) * 100) : 0;

    // Group orders by status
    const ordersByStatus = orders?.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Revenue by day
    const revenueByDay = orders?.reduce((acc, order) => {
      const date = order.created_at.split('T')[0];
      acc[date] = (acc[date] || 0) + parseFloat(order.total_amount || '0');
      return acc;
    }, {} as Record<string, number>) || {};

    // Orders by day
    const ordersByDay = orders?.reduce((acc, order) => {
      const date = order.created_at.split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    // Get customer stats
    const { count: totalCustomers } = await db
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'customer');

    const monthStart = new Date();
    monthStart.setDate(1);
    const { count: newCustomers } = await db
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'customer')
      .gte('created_at', monthStart.toISOString());

    // Get restaurant stats
    const { count: totalRestaurants } = await db
      .from('restaurants')
      .select('*', { count: 'exact', head: true });

    const { count: activeRestaurants } = await db
      .from('restaurants')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    const { count: pendingRestaurants } = await db
      .from('restaurants')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Top restaurants
    const restaurantOrders = orders?.reduce((acc, order) => {
      if (!order.restaurant_id) return acc;
      if (!acc[order.restaurant_id]) {
        acc[order.restaurant_id] = { orders: 0, revenue: 0 };
      }
      acc[order.restaurant_id].orders++;
      acc[order.restaurant_id].revenue += parseFloat(order.total_amount || '0');
      return acc;
    }, {} as Record<string, { orders: number; revenue: number }>) || {};

    const topRestaurantIds = Object.entries(restaurantOrders)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 5)
      .map(([id]) => id);

    const { data: topRestaurantsData } = await db
      .from('restaurants')
      .select('id, name')
      .in('id', topRestaurantIds.length > 0 ? topRestaurantIds : ['none']);

    const topRestaurants = topRestaurantsData?.map(r => ({
      id: r.id,
      name: r.name,
      orders: restaurantOrders[r.id]?.orders || 0,
      revenue: restaurantOrders[r.id]?.revenue || 0
    })).sort((a, b) => b.revenue - a.revenue) || [];

    // Top items (from order_items)
    const { data: topItemsData } = await db
      .from('order_items')
      .select(`
        menu_item_id,
        name,
        order:orders!inner(created_at, restaurant:restaurants(name))
      `)
      .gte('order.created_at', startDate.toISOString());

    const itemCounts = topItemsData?.reduce((acc, item) => {
      const key = item.menu_item_id || item.name;
      if (!acc[key]) {
        acc[key] = { name: item.name, restaurant: (item.order as any)?.restaurant?.name || 'Unknown', count: 0 };
      }
      acc[key].count++;
      return acc;
    }, {} as Record<string, { name: string; restaurant: string; count: number }>) || {};

    const topItems = Object.entries(itemCounts)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([id, data]) => ({
        id,
        name: data.name,
        restaurant: data.restaurant,
        orders: data.count
      }));

    // Generate date range for charts
    const dateRange: string[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dateRange.push(d.toISOString().split('T')[0]);
    }

    return NextResponse.json({
      revenue: {
        total: totalRevenue,
        change: revenueChange,
        byDay: dateRange.map(date => ({ date, amount: revenueByDay[date] || 0 }))
      },
      orders: {
        total: totalOrders,
        change: ordersChange,
        byStatus: ordersByStatus,
        byDay: dateRange.map(date => ({ date, count: ordersByDay[date] || 0 }))
      },
      customers: {
        total: totalCustomers || 0,
        newThisMonth: newCustomers || 0,
        returning: Math.max(0, (totalCustomers || 0) - (newCustomers || 0))
      },
      restaurants: {
        total: totalRestaurants || 0,
        active: activeRestaurants || 0,
        pending: pendingRestaurants || 0
      },
      topRestaurants,
      topItems
    });
  } catch (error: any) {
    console.error('Analytics error:', error);

    if (error.name === 'AuthError') {
      return NextResponse.json(
        { error: { code: 'AUTH_UNAUTHORIZED', message: error.message } },
        { status: error.statusCode || 401 }
      );
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid query parameters', details: error.errors } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
