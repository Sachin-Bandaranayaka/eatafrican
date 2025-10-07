import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';
import { registerSchema } from '@/lib/validation/schemas';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = registerSchema.parse(body);
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: validatedData.email,
      password: validatedData.password,
      email_confirm: true, // Auto-confirm email for now
    });

    if (authError || !authData.user) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_REGISTRATION_FAILED',
            message: authError?.message || 'Failed to create user account',
          },
        },
        { status: 400 }
      );
    }

    // Create user record in database
    const { data: userData, error: dbError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id,
        email: validatedData.email,
        role: validatedData.role,
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        phone: validatedData.phone,
        language: validatedData.language || 'en',
        status: 'active',
      })
      .select()
      .single();

    if (dbError || !userData) {
      // Rollback: Delete auth user if database insert fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to create user profile',
            details: dbError?.message,
          },
        },
        { status: 500 }
      );
    }

    // If customer, create loyalty points record
    if (validatedData.role === 'customer') {
      const referralCode = `REF${authData.user.id.substring(0, 8).toUpperCase()}`;
      
      await supabaseAdmin
        .from('loyalty_points')
        .insert({
          customer_id: authData.user.id,
          points_balance: 0,
          lifetime_points: 0,
          referral_code: referralCode,
        });
    }

    // Generate JWT tokens by signing in the user
    const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (signInError || !signInData.session) {
      return NextResponse.json(
        {
          error: {
            code: 'SESSION_ERROR',
            message: 'Failed to create session',
          },
        },
        { status: 500 }
      );
    }

    // Return user data and tokens
    return NextResponse.json(
      {
        user: {
          id: userData.id,
          email: userData.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
          role: userData.role,
        },
        token: signInData.session.access_token,
        refreshToken: signInData.session.refresh_token,
      },
      { status: 201 }
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

    console.error('Registration error:', error);
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
