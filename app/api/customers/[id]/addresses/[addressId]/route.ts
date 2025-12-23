import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';

// PUT - Update address
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string; addressId: string } }
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
            .update({
                label,
                street,
                city,
                postal_code: postalCode,
                region,
                type,
                is_default: isDefault,
                updated_at: new Date().toISOString()
            })
            .eq('id', params.addressId)
            .eq('customer_id', params.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ address: data });
    } catch (error: any) {
        console.error('Error updating address:', error);
        return NextResponse.json(
            { error: { message: error.message || 'Failed to update address' } },
            { status: 500 }
        );
    }
}

// DELETE - Delete address
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string; addressId: string } }
) {
    try {
        const { error } = await supabaseAdmin
            .from('customer_addresses')
            .delete()
            .eq('id', params.addressId)
            .eq('customer_id', params.id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting address:', error);
        return NextResponse.json(
            { error: { message: error.message || 'Failed to delete address' } },
            { status: 500 }
        );
    }
}
