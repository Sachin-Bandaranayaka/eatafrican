import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';

export async function POST(req: NextRequest) {
  try {
    // Get the access token from the Authorization header
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_UNAUTHORIZED',
            message: 'No authentication token provided',
          },
        },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Get user from token
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !userData.user) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_INVALID_TOKEN',
            message: 'Invalid authentication token',
          },
        },
        { status: 401 }
      );
    }

    // Sign out the user (invalidates all sessions)
    const { error: signOutError } = await supabaseAdmin.auth.admin.signOut(userData.user.id);

    if (signOutError) {
      console.error('Logout error:', signOutError);
      return NextResponse.json(
        {
          error: {
            code: 'LOGOUT_FAILED',
            message: 'Failed to logout',
            details: signOutError.message,
          },
        },
        { status: 500 }
      );
    }

    // Create response with cleared cookies
    const response = NextResponse.json(
      {
        message: 'Successfully logged out',
      },
      { status: 200 }
    );

    // Clear authentication cookies
    response.cookies.set('sb-access-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    response.cookies.set('sb-refresh-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}
