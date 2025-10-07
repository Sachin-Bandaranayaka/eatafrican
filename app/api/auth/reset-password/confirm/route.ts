import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/config';
import { z } from 'zod';

const confirmResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate request body
    const validatedData = confirmResetSchema.parse(body);
    
    // Verify the reset token and get user
    const { data: userData, error: verifyError } = await supabaseAdmin.auth.getUser(
      validatedData.token
    );

    if (verifyError || !userData.user) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid or expired reset token',
          },
        },
        { status: 400 }
      );
    }

    // Update user password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      userData.user.id,
      {
        password: validatedData.password,
      }
    );

    if (updateError) {
      return NextResponse.json(
        {
          error: {
            code: 'PASSWORD_UPDATE_FAILED',
            message: 'Failed to update password',
            details: updateError.message,
          },
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Password has been successfully reset',
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

    console.error('Password reset confirmation error:', error);
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
