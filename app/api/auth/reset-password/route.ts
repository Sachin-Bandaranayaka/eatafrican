import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';
import { resetPasswordSchema } from '@/lib/validation/schemas';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = resetPasswordSchema.parse(body);
    
    // Check if user exists
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('id, email, status')
      .eq('email', validatedData.email)
      .single();

    // Always return success to prevent email enumeration
    // But only send email if user exists and is active
    if (!userError && userData && userData.status === 'active') {
      // Generate password reset link
      const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(
        validatedData.email,
        {
          redirectTo: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password/confirm`,
        }
      );

      if (resetError) {
        console.error('Password reset error:', resetError);
      }
    }

    // Always return success message
    return NextResponse.json(
      {
        message: 'If an account exists with this email, a password reset link has been sent.',
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

    console.error('Password reset request error:', error);
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
