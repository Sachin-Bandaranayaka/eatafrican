import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/middleware/auth';
import { db } from '@/lib/supabase/database';
import { updateVoucherSchema } from '@/lib/validation/schemas';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate super admin role
    await requireRole(['super_admin'])(req);

    const voucherId = params.id;

    // Fetch voucher
    const { data: voucher, error } = await db
      .from('vouchers')
      .select('*')
      .eq('id', voucherId)
      .single();

    if (error || !voucher) {
      return NextResponse.json(
        { error: { code: 'RESOURCE_NOT_FOUND', message: 'Voucher not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      voucher: {
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
      },
    });
  } catch (error: any) {
    console.error('Get voucher error:', error);

    if (error.name === 'AuthError') {
      return NextResponse.json(
        { error: { code: 'AUTH_UNAUTHORIZED', message: error.message } },
        { status: error.statusCode || 401 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate super admin role
    const currentUser = await requireRole(['super_admin'])(req);

    const voucherId = params.id;

    // Check if voucher exists
    const { data: existingVoucher, error: fetchError } = await db
      .from('vouchers')
      .select('*')
      .eq('id', voucherId)
      .single();

    if (fetchError || !existingVoucher) {
      return NextResponse.json(
        { error: { code: 'RESOURCE_NOT_FOUND', message: 'Voucher not found' } },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validatedData = updateVoucherSchema.parse(body);

    // If code is being updated, check for duplicates
    if (validatedData.code && validatedData.code !== existingVoucher.code) {
      const { data: duplicateVoucher } = await db
        .from('vouchers')
        .select('id')
        .eq('code', validatedData.code)
        .neq('id', voucherId)
        .single();

      if (duplicateVoucher) {
        return NextResponse.json(
          { error: { code: 'DUPLICATE_ENTRY', message: 'Voucher code already exists' } },
          { status: 409 }
        );
      }
    }

    // Build update object
    const updateData: any = {};
    if (validatedData.code !== undefined) updateData.code = validatedData.code;
    if (validatedData.discountType !== undefined) updateData.discount_type = validatedData.discountType;
    if (validatedData.discountValue !== undefined) updateData.discount_value = validatedData.discountValue;
    if (validatedData.minOrderAmount !== undefined) updateData.min_order_amount = validatedData.minOrderAmount;
    if (validatedData.maxDiscountAmount !== undefined) updateData.max_discount_amount = validatedData.maxDiscountAmount;
    if (validatedData.usageLimit !== undefined) updateData.usage_limit = validatedData.usageLimit;
    if (validatedData.validFrom !== undefined) updateData.valid_from = validatedData.validFrom;
    if (validatedData.validUntil !== undefined) updateData.valid_until = validatedData.validUntil;
    if (validatedData.status !== undefined) updateData.status = validatedData.status;

    // Update voucher
    const { data: updatedVoucher, error: updateError } = await db
      .from('vouchers')
      .update(updateData)
      .eq('id', voucherId)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating voucher:', updateError);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to update voucher' } },
        { status: 500 }
      );
    }

    // Create activity log entry
    await db.from('activity_logs').insert({
      user_id: currentUser.id,
      entity_type: 'voucher',
      entity_id: voucherId,
      action: 'voucher_updated',
      details: {
        updates: updateData,
      },
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
    });

    return NextResponse.json({
      voucher: {
        id: updatedVoucher.id,
        code: updatedVoucher.code,
        discountType: updatedVoucher.discount_type,
        discountValue: updatedVoucher.discount_value,
        minOrderAmount: updatedVoucher.min_order_amount,
        maxDiscountAmount: updatedVoucher.max_discount_amount,
        usageLimit: updatedVoucher.usage_limit,
        usageCount: updatedVoucher.usage_count,
        validFrom: updatedVoucher.valid_from,
        validUntil: updatedVoucher.valid_until,
        status: updatedVoucher.status,
        createdAt: updatedVoucher.created_at,
      },
    });
  } catch (error: any) {
    console.error('Update voucher error:', error);

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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate super admin role
    const currentUser = await requireRole(['super_admin'])(req);

    const voucherId = params.id;

    // Check if voucher exists
    const { data: existingVoucher, error: fetchError } = await db
      .from('vouchers')
      .select('*')
      .eq('id', voucherId)
      .single();

    if (fetchError || !existingVoucher) {
      return NextResponse.json(
        { error: { code: 'RESOURCE_NOT_FOUND', message: 'Voucher not found' } },
        { status: 404 }
      );
    }

    // Soft delete by setting status to inactive
    const { error: updateError } = await db
      .from('vouchers')
      .update({ status: 'inactive' })
      .eq('id', voucherId);

    if (updateError) {
      console.error('Error deleting voucher:', updateError);
      return NextResponse.json(
        { error: { code: 'DATABASE_ERROR', message: 'Failed to delete voucher' } },
        { status: 500 }
      );
    }

    // Create activity log entry
    await db.from('activity_logs').insert({
      user_id: currentUser.id,
      entity_type: 'voucher',
      entity_id: voucherId,
      action: 'voucher_deleted',
      details: {
        code: existingVoucher.code,
      },
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || undefined,
    });

    return NextResponse.json(
      { message: 'Voucher deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Delete voucher error:', error);

    if (error.name === 'AuthError') {
      return NextResponse.json(
        { error: { code: 'AUTH_UNAUTHORIZED', message: error.message } },
        { status: error.statusCode || 401 }
      );
    }

    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
