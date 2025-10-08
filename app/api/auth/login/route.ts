import { NextRequest, NextResponse } from 'next/server';

// Lazy load heavy dependencies to avoid module resolution issues
async function loadDependencies() {
  const { supabaseAdmin } = await import('@/lib/supabase/config');
  const { loginSchema } = await import('@/lib/validation/schemas');
  const { z } = await import('zod');
  return { supabaseAdmin, loginSchema, z };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { supabaseAdmin, loginSchema, z } = await loadDependencies();
    
    // Validate request body
    const validatedData = loginSchema.parse(body);
    
    // Authenticate user with Supabase Auth
    const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (signInError || !signInData.user || !signInData.session) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        },
        { status: 401 }
      );
    }

    // Fetch user details from database
    const { data: userData, error: dbError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', signInData.user.id)
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

    // Return user data with tokens
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
        token: signInData.session.access_token,
        refreshToken: signInData.session.refresh_token,
      },
      { status: 200 }
    );
  } catch (error: any) {
    // Handle Zod validation errors
    if (error?.name === 'ZodError') {
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

    console.error('Login error:', error);
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
