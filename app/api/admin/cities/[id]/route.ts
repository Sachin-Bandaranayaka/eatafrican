import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';

// GET - Fetch single city
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { data, error } = await supabaseAdmin
            .from('cities')
            .select('*')
            .eq('id', params.id)
            .single();

        if (error) throw error;

        return NextResponse.json({ city: data });
    } catch (error: any) {
        console.error('Error fetching city:', error);
        return NextResponse.json(
            { error: { message: error.message || 'Failed to fetch city' } },
            { status: 500 }
        );
    }
}

// PUT - Update city
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const updateData: any = { updated_at: new Date().toISOString() };

        if (body.name !== undefined) updateData.name = body.name;
        if (body.display_order !== undefined) updateData.display_order = body.display_order;
        if (body.is_active !== undefined) updateData.is_active = body.is_active;
        if (body.delivery_zones !== undefined) updateData.delivery_zones = body.delivery_zones;

        const { data, error } = await supabaseAdmin
            .from('cities')
            .update(updateData)
            .eq('id', params.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ city: data });
    } catch (error: any) {
        console.error('Error updating city:', error);
        return NextResponse.json(
            { error: { message: error.message || 'Failed to update city' } },
            { status: 500 }
        );
    }
}

// DELETE - Delete city
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { error } = await supabaseAdmin
            .from('cities')
            .delete()
            .eq('id', params.id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting city:', error);
        return NextResponse.json(
            { error: { message: error.message || 'Failed to delete city' } },
            { status: 500 }
        );
    }
}
