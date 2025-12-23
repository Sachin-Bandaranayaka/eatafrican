import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';

// GET - Fetch customer addresses
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { data, error } = await supabaseAdmin
            .from('customer_addresses')
            .select('*')
            .eq('customer_id', params.id)
            .order('is_default', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ addresses: data || [] });
    } catch (error: any) {
        console.error('Error fetching addresses:', error);
        return NextResponse.json(
            { error: { message: error.message || 'Failed to fetch addresses' } },
            { status: 500 }
        );
    }
}

// POST - Create new address
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { label, street, city, postalCode, region, type, isDefault } = body;

        // If setting as default, unset other defaults first
        if (isDefault) {
            await supabaseAdmin
                .from('customer_addresses')
                .update({ is_default: false })
                .eq('customer_id', params.id);
        }

        const { data, error } = await supabaseAdmin
            .from('customer_addresses')
            .insert({
                customer_id: params.id,
                label,
                street,
                city,
                postal_code: postalCode,
                region,
                type: type || 'home',
                is_default: isDefault || false
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ address: data }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating address:', error);
        return NextResponse.json(
            { error: { message: error.message || 'Failed to create address' } },
            { status: 500 }
        );
    }
}
