import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';

// PUT - Mark all notifications as read for a user
export async function PUT(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: { message: 'User ID is required' } },
                { status: 400 }
            );
        }

        const { error } = await supabaseAdmin
            .from('notifications')
            .update({ read: true })
            .eq('user_id', userId)
            .eq('read', false);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error marking all notifications as read:', error);
        return NextResponse.json(
            { error: { message: error.message || 'Failed to update notifications' } },
            { status: 500 }
        );
    }
}
