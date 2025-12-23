import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';

// GET - Fetch all cities (admin)
export async function GET(request: NextRequest) {
    try {
        const { data, error } = await supabaseAdmin
            .from('cities')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;

        const cities = (data || []).map(c => ({
            id: c.id,
            name: c.name,
            displayOrder: c.display_order,
            isActive: c.is_active,
            deliveryZones: c.delivery_zones,
            createdAt: c.created_at
        }));

        return NextResponse.json({ cities });
    } catch (error: any) {
        console.error('Error fetching cities:', error);
        return NextResponse.json(
            { error: { message: error.message || 'Failed to fetch cities' } },
            { status: 500 }
        );
    }
}

// POST - Create city
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, display_order, is_active, delivery_zones } = body;

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
                is_active: is_active !== false,
                delivery_zones: delivery_zones || []
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ city: data }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating city:', error);
        return NextResponse.json(
            { error: { message: error.message || 'Failed to create city' } },
            { status: 500 }
        );
    }
}
