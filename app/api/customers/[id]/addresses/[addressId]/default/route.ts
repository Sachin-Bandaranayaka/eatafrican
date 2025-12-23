import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';

// PUT - Set address as default
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string; addressId: string } }
) {
    try {
        // Unset all defaults for this customer
        await supabaseAdmin
            .from('customer_addresses')
            .update({ is_default: false })
            .eq('customer_id', params.id);

        // Set the specified address as default
        const { data, error } = await supabaseAdmin
            .from('customer_addresses')
            .update({ is_default: true, updated_at: new Date().toISOString() })
            .eq('id', params.addressId)
            .eq('customer_id', params.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ address: data });
    } catch (error: any) {
        console.error('Error setting default address:', error);
        return NextResponse.json(
            { error: { message: error.message || 'Failed to set default address' } },
            { status: 500 }
        );
    }
}
