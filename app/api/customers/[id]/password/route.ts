import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';
import bcrypt from 'bcryptjs';

// PUT - Update customer password
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { error: { message: 'Current and new password are required' } },
                { status: 400 }
            );
        }

        if (newPassword.length < 8) {
            return NextResponse.json(
                { error: { message: 'Password must be at least 8 characters' } },
                { status: 400 }
            );
        }

        // Get current user
        const { data: user, error: userError } = await supabaseAdmin
            .from('users')
            .select('id, password_hash')
            .eq('id', params.id)
            .single();

        if (userError || !user) {
            return NextResponse.json(
                { error: { message: 'User not found' } },
                { status: 404 }
            );
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isValidPassword) {
            return NextResponse.json(
                { error: { message: 'Current password is incorrect' } },
                { status: 400 }
            );
        }

        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 12);

        // Update password
        const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({ 
                password_hash: newPasswordHash,
                updated_at: new Date().toISOString()
            })
            .eq('id', params.id);

        if (updateError) throw updateError;

        return NextResponse.json({ success: true, message: 'Password updated successfully' });
    } catch (error: any) {
        console.error('Error updating password:', error);
        return NextResponse.json(
            { error: { message: error.message || 'Failed to update password' } },
            { status: 500 }
        );
    }
}
