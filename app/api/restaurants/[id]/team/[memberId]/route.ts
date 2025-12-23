import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';

// PATCH - Update team member role
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string; memberId: string } }
) {
    try {
        const body = await request.json();
        const { role, status } = body;

        const updateData: any = { updated_at: new Date().toISOString() };
        if (role) updateData.role = role;
        if (status) updateData.status = status;

        const { data, error } = await supabaseAdmin
            .from('restaurant_team_members')
            .update(updateData)
            .eq('id', params.memberId)
            .eq('restaurant_id', params.id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ member: data });
    } catch (error: any) {
        console.error('Error updating team member:', error);
        return NextResponse.json(
            { error: { message: error.message || 'Failed to update team member' } },
            { status: 500 }
        );
    }
}

// DELETE - Remove team member
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string; memberId: string } }
) {
    try {
        const { error } = await supabaseAdmin
            .from('restaurant_team_members')
            .delete()
            .eq('id', params.memberId)
            .eq('restaurant_id', params.id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error removing team member:', error);
        return NextResponse.json(
            { error: { message: error.message || 'Failed to remove team member' } },
            { status: 500 }
        );
    }
}
