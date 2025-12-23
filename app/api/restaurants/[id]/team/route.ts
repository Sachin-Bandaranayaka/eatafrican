import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';

// GET - Fetch team members
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { data, error } = await supabaseAdmin
            .from('restaurant_team_members')
            .select(`
                *,
                user:users!restaurant_team_members_user_id_fkey(id, email, first_name, last_name)
            `)
            .eq('restaurant_id', params.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const members = (data || []).map(m => ({
            id: m.id,
            userId: m.user_id,
            role: m.role,
            status: m.status,
            user: {
                email: m.user?.email,
                firstName: m.user?.first_name,
                lastName: m.user?.last_name
            },
            createdAt: m.created_at
        }));

        return NextResponse.json({ members });
    } catch (error: any) {
        console.error('Error fetching team members:', error);
        return NextResponse.json(
            { error: { message: error.message || 'Failed to fetch team members' } },
            { status: 500 }
        );
    }
}

// POST - Invite team member
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json();
        const { email, role } = body;

        if (!email || !role) {
            return NextResponse.json(
                { error: { message: 'Email and role are required' } },
                { status: 400 }
            );
        }

        // Find user by email
        const { data: user, error: userError } = await supabaseAdmin
            .from('users')
            .select('id')
            .eq('email', email.toLowerCase())
            .single();

        if (userError || !user) {
            return NextResponse.json(
                { error: { message: 'User not found. They must register first.' } },
                { status: 404 }
            );
        }

        // Check if already a team member
        const { data: existing } = await supabaseAdmin
            .from('restaurant_team_members')
            .select('id')
            .eq('restaurant_id', params.id)
            .eq('user_id', user.id)
            .single();

        if (existing) {
            return NextResponse.json(
                { error: { message: 'User is already a team member' } },
                { status: 400 }
            );
        }

        // Get inviter from auth header
        const authHeader = request.headers.get('authorization');
        let inviterId = null;
        if (authHeader) {
            // Extract user ID from token (simplified - in production use proper JWT verification)
            const userStr = request.headers.get('x-user-id');
            inviterId = userStr;
        }

        // Create team member
        const { data, error } = await supabaseAdmin
            .from('restaurant_team_members')
            .insert({
                restaurant_id: params.id,
                user_id: user.id,
                role,
                status: 'pending',
                invited_by: inviterId
            })
            .select()
            .single();

        if (error) throw error;

        // TODO: Send invitation email

        return NextResponse.json({ member: data }, { status: 201 });
    } catch (error: any) {
        console.error('Error inviting team member:', error);
        return NextResponse.json(
            { error: { message: error.message || 'Failed to invite team member' } },
            { status: 500 }
        );
    }
}
