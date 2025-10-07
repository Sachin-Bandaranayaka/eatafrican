import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import { db, getPaginationParams, createPaginatedResponse } from '@/lib/supabase/database';
import { createAdminUserSchema, paginationSchema } from '@/lib/validation/schemas';
import { supabaseAdmin } from '@/lib/supabase/config';

export async function GET(req: NextRequest) {
  try {
    // Validate super admin role
    await requireRole(['super_admin'])(req);

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url);
    const queryParams = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
    };

    const validatedParams = paginationSchema.parse(queryParams);
    const { page, limit, from, to } = getPaginationParams({
      page: validatedParams.page,
      limit: validatedParams.limit,
    });

    // Fetch all admin users
    const { data: adminUsers, error, count } = await db
      .from('users')
      .select('*', { count: 'exact' })
      .eq('role', 'super_admin')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching admin users:', error);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to fetch admin users' } },
        { status: 500 }
      );
    }

    // Format response
    const formattedUsers = (adminUsers || []).map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      language: user.language,
      status: user.status,
      createdAt: user.created_at,
    }));

    const response = createPaginatedResponse(
      formattedUsers,
      count || 0,
      page,
      limit
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Admin users listing error:', error);

    if (error.name === 'AuthError') {
      return NextResponse.json(
        { error: { code: 'AUTH_UNAUTHORIZED', message: error.message } },
        { status: error.statusCode || 401 }
      );
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid query parameters', details: error.errors } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Validate super admin role
    const currentUser = await requireRole(['super_admin'])(req);

    // Parse and validate request body
    const body = await req.json();
    const validatedData = createAdminUserSchema.parse(body);

    // Check if user already exists
    const { data: existingUser } = await db
      .from('users')
      .select('id')
      .eq('email', validatedData.email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: { code: 'DUPLICATE_ENTRY', message: 'User with this email already exists' } },
        { status: 409 }
      );
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: validatedData.email,
      password: validatedData.password,
      email_confirm: true,
    });

    if (authError || !authData.user) {
      console.error('Error creating auth user:', authError);
      return NextResponse.json(
        { error: { code: 'AUTH_ERROR', message: 'Failed to create user account' } },
        { status: 500 }
      );
    }

    // Create user record in database
    const { data: newUser, error: dbError } = await db
      .from('users')
      .insert({
        id: authData.user.id,
        email: validatedData.email,
        role: 'super_admin',
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        phone: validatedData.phone,
        language: validatedData.language || 'en',
        status: 'active',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error creating user record:', dbError);
      // Rollback: delete auth user
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to create user record' } },
        { status: 500 }
      );
    }

    // Create activity log entry
    await db.from('activity_logs').insert({
      user_id: currentUser.id,
      entity_type: 'user',
      entity_id: newUser.id,
      action: 'admin_user_created',
      details: {
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
      },
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
    });

    // TODO: Send welcome email with credentials
    // This would be implemented when email service is set up
    // await sendEmail({
    //   to: newUser.email,
    //   subject: 'Admin Account Created',
    //   template: 'admin-welcome',
    //   data: {
    //     firstName: newUser.first_name,
    //     email: newUser.email,
    //     temporaryPassword: validatedData.password,
    //     language: newUser.language,
    //   },
    // });

    return NextResponse.json(
      {
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
          phone: newUser.phone,
          language: newUser.language,
          role: newUser.role,
          status: newUser.status,
          createdAt: newUser.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create admin user error:', error);

    if (error.name === 'AuthError') {
      return NextResponse.json(
        { error: { code: 'AUTH_UNAUTHORIZED', message: error.message } },
        { status: error.statusCode || 401 }
      );
    }

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Invalid request data', details: error.errors } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
