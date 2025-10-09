import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';

// GET - Fetch all active cities
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('cities')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: { message: error.message || 'Failed to fetch cities' } },
      { status: 500 }
    );
  }
}

// POST - Create a new city (Super Admin only)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: { message: 'Unauthorized' } },
        { status: 401 }
      );
    }

    // Check if user is super admin
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userError || userData?.role !== 'super_admin') {
      return NextResponse.json(
        { error: { message: 'Forbidden: Super admin access required' } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, display_order } = body;

    if (!name) {
      return NextResponse.json(
        { error: { message: 'City name is required' } },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('cities')
      .insert({
        name,
        display_order: display_order || 999,
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error creating city:', error);
    return NextResponse.json(
      { error: { message: error.message || 'Failed to create city' } },
      { status: 500 }
    );
  }
}
