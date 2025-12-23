import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';

// PUT - Mark notification as read
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { data, error } = await supabaseAdmin
            .from('notifications')
            .update({ read: true })
            .eq('id', params.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ notification: data });
    } catch (error: any) {
        console.error('Error marking notification as read:', error);
        return NextResponse.json(
            { error: { message: error.message || 'Failed to update notification' } },
            { status: 500 }
        );
    }
}
