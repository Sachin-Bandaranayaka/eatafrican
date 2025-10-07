import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import { db, getPaginationParams, createPaginatedResponse } from '@/lib/supabase/database';
import { createVoucherSchema, voucherQuerySchema } from '@/lib/validation/schemas';

export async function GET(req: NextRequest) {
  try {
    // Validate super admin role
    await requireRole(['super_admin'])(req);

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url);
    const queryParams = {
      status: searchParams.get('status') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
    };

    const validatedParams = voucherQuerySchema.parse(queryParams);
    const { page, limit, from, to } = getPaginationParams({
      page: validatedParams.page,
      limit: validatedParams.limit,
    });

    // Build query
    let query = db
      .from('vouchers')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply status filter if provided
    if (validatedParams.status) {
      query = query.eq('status', validatedParams.status);
    }

    // Execute query with pagination
    const { data: vouchers, error, count } = await query.range(from, to);

    if (error) {
      console.error('Error fetching vouchers:', error);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to fetch vouchers' } },
        { status: 500 }
      );
    }

    // Format response
    const formattedVouchers = (vouchers || []).map(voucher => ({
      id: voucher.id,
      code: voucher.code,
      discountType: voucher.discount_type,
      discountValue: voucher.discount_value,
      minOrderAmount: voucher.min_order_amount,
      maxDiscountAmount: voucher.max_discount_amount,
      usageLimit: voucher.usage_limit,
      usageCount: voucher.usage_count,
      validFrom: voucher.valid_from,
      validUntil: voucher.valid_until,
      status: voucher.status,
      createdAt: voucher.created_at,
    }));

    const response = createPaginatedResponse(
      formattedVouchers,
      count || 0,
      page,
      limit
    );

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Vouchers listing error:', error);

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
    const validatedData = createVoucherSchema.parse(body);

    // Check if voucher code already exists
    const { data: existingVoucher } = await db
      .from('vouchers')
      .select('id')
      .eq('code', validatedData.code)
      .single();

    if (existingVoucher) {
      return NextResponse.json(
        { error: { code: 'DUPLICATE_ENTRY', message: 'Voucher code already exists' } },
        { status: 409 }
      );
    }

    // Create voucher
    const { data: newVoucher, error: dbError } = await db
      .from('vouchers')
      .insert({
        code: validatedData.code,
        discount_type: validatedData.discountType,
        discount_value: validatedData.discountValue,
        min_order_amount: validatedData.minOrderAmount,
        max_discount_amount: validatedData.maxDiscountAmount,
        usage_limit: validatedData.usageLimit,
        usage_count: 0,
        valid_from: validatedData.validFrom,
        valid_until: validatedData.validUntil,
        status: validatedData.status || 'active',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Error creating voucher:', dbError);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to create voucher' } },
        { status: 500 }
      );
    }

    // Create activity log entry
    await db.from('activity_logs').insert({
      user_id: currentUser.id,
      entity_type: 'voucher',
      entity_id: newVoucher.id,
      action: 'voucher_created',
      details: {
        code: newVoucher.code,
        discountType: newVoucher.discount_type,
        discountValue: newVoucher.discount_value,
      },
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
    });

    return NextResponse.json(
      {
        voucher: {
          id: newVoucher.id,
          code: newVoucher.code,
          discountType: newVoucher.discount_type,
          discountValue: newVoucher.discount_value,
          minOrderAmount: newVoucher.min_order_amount,
          maxDiscountAmount: newVoucher.max_discount_amount,
          usageLimit: newVoucher.usage_limit,
          usageCount: newVoucher.usage_count,
          validFrom: newVoucher.valid_from,
          validUntil: newVoucher.valid_until,
          status: newVoucher.status,
          createdAt: newVoucher.created_at,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create voucher error:', error);

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
