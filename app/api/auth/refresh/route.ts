import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';
import { z } from 'zod';

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = refreshTokenSchema.parse(body);
    
    // Refresh the session using the refresh token
    const { data: sessionData, error: refreshError } = await supabaseAdmin.auth.refreshSession({
      refresh_token: validatedData.refreshToken,
    });

    if (refreshError || !sessionData.session || !sessionData.user) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_TOKEN_EXPIRED',
            message: 'Invalid or expired refresh token',
          },
        },
        { status: 401 }
      );
    }

    // Fetch user details from database
    const { data: userData, error: dbError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', sessionData.user.id)
      .single();

    if (dbError || !userData) {
      return NextResponse.json(
        {
          error: {
            code: 'USER_NOT_FOUND',
            message: 'User profile not found',
          },
        },
        { status: 404 }
      );
    }

    // Check if user account is active
    if (userData.status !== 'active') {
      return NextResponse.json(
        {
          error: {
            code: 'ACCOUNT_INACTIVE',
            message: 'Your account is inactive or suspended',
          },
        },
        { status: 403 }
      );
    }

    // Fetch additional role-specific data
    let restaurantId: string | undefined;
    let driverId: string | undefined;

    if (userData.role === 'restaurant_owner') {
      const { data: restaurant } = await supabaseAdmin
        .from('restaurants')
        .select('id')
        .eq('owner_id', userData.id)
        .single();
      
      restaurantId = restaurant?.id;
    }

    if (userData.role === 'driver') {
      const { data: driver } = await supabaseAdmin
        .from('drivers')
        .select('id')
        .eq('user_id', userData.id)
        .single();
      
      driverId = driver?.id;
    }

    // Return new tokens and user data
    return NextResponse.json(
      {
        user: {
          id: userData.id,
          email: userData.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
          role: userData.role,
          restaurantId,
          driverId,
        },
        token: sessionData.session.access_token,
        refreshToken: sessionData.session.refresh_token,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            details: error.errors,
          },
        },
        { status: 400 }
      );
    }

    console.error('Token refresh error:', error);
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
