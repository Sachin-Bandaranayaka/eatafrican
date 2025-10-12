import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';

export async function POST(req: NextRequest) {
  try {
    // Get the access token from the Authorization header
    const authHeader = req.headers.get('authorization');
    
    // Try to sign out if we have a valid token, but don't fail if token is invalid
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);

      // Try to get user from token and sign them out
      try {
        const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);

        if (!userError && userData.user) {
          // Sign out the user (invalidates all sessions)
          await supabaseAdmin.auth.admin.signOut(userData.user.id);
        }
      } catch (tokenError) {
        // Token is invalid/expired, but that's okay for logout
        console.log('Token validation failed during logout (expected if token expired):', tokenError);
      }
    }

    // Always clear cookies and return success, even if token was invalid
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
    
    // Even on error, try to clear cookies
    const response = NextResponse.json(
      {
        message: 'Logged out (with errors)',
      },
      { status: 200 }
    );

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
  }
}
