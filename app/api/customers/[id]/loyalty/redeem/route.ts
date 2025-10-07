import { NextRequest, NextResponse } from 'next/server';
import { db, withTransaction } from '@/lib/supabase/database';
import { requireCustomerAccess } from '@/lib/middleware/auth';
import { redeemLoyaltySchema } from '@/lib/validation/schemas';

/**
 * POST /api/customers/[id]/loyalty/redeem
 * Redeem loyalty points for a discount voucher
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = params.id;

    // Validate customer access
    await requireCustomerAccess(req, customerId);

    // Parse and validate request body
    const body = await req.json();
    const validatedData = redeemLoyaltySchema.parse(body);

    // Map reward types to discount values
    const rewardConfig: Record<string, { points: number; discountType: string; discountValue: number }> = {
      'discount_10': { points: 100, discountType: 'percentage', discountValue: 10 },
      'discount_20': { points: 200, discountType: 'percentage', discountValue: 20 },
      'discount_50': { points: 500, discountType: 'percentage', discountValue: 50 },
    };

    const reward = rewardConfig[validatedData.rewardType];

    if (!reward) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid reward type',
          },
        },
        { status: 400 }
      );
    }

    // Validate points match the reward
    if (validatedData.points !== reward.points) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Points do not match reward type',
          },
        },
        { status: 400 }
      );
    }

    // Fetch customer's loyalty points
    const { data: loyaltyPoints, error: loyaltyError } = await db
      .from('loyalty_points')
      .select('*')
      .eq('customer_id', customerId)
      .single();

    if (loyaltyError || !loyaltyPoints) {
      return NextResponse.json(
        {
          error: {
            code: 'RESOURCE_NOT_FOUND',
            message: 'Loyalty points record not found',
          },
        },
        { status: 404 }
      );
    }

    // Check if customer has sufficient points
    if (loyaltyPoints.points_balance < validatedData.points) {
      return NextResponse.json(
        {
          error: {
            code: 'INSUFFICIENT_POINTS',
            message: `Insufficient points. You have ${loyaltyPoints.points_balance} points but need ${validatedData.points}`,
          },
        },
        { status: 422 }
      );
    }

    // Perform redemption in a transaction
    const result = await withTransaction(async () => {
      // Deduct points from balance
      const newBalance = loyaltyPoints.points_balance - validatedData.points;

      const { error: updateError } = await db
        .from('loyalty_points')
        .update({
          points_balance: newBalance,
          updated_at: new Date().toISOString(),
        })
        .eq('customer_id', customerId);

      if (updateError) {
        throw new Error('Failed to update loyalty points balance');
      }

      // Generate unique voucher code
      const voucherCode = generateVoucherCode();

      // Calculate voucher expiration (30 days from now)
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);

      // Create voucher
      const { data: voucher, error: voucherError } = await db
        .from('vouchers')
        .insert({
          code: voucherCode,
          discount_type: reward.discountType,
          discount_value: reward.discountValue,
          min_order_amount: 0,
          max_discount_amount: null,
          usage_limit: 1,
          usage_count: 0,
          valid_from: new Date().toISOString(),
          valid_until: validUntil.toISOString(),
          status: 'active',
        })
        .select()
        .single();

      if (voucherError) {
        throw new Error('Failed to create voucher');
      }

      // Create loyalty transaction record
      const { error: transactionError } = await db
        .from('loyalty_transactions')
        .insert({
          customer_id: customerId,
          order_id: null,
          transaction_type: 'redeemed',
          points: -validatedData.points,
          description: `Redeemed ${validatedData.points} points for ${reward.discountValue}% discount voucher`,
        });

      if (transactionError) {
        throw new Error('Failed to create loyalty transaction');
      }

      return { voucher, newBalance };
    });

    return NextResponse.json(
      {
        voucher: {
          code: result.voucher.code,
          discountType: result.voucher.discount_type,
          discountValue: result.voucher.discount_value,
          validUntil: result.voucher.valid_until,
        },
        newBalance: result.newBalance,
        message: 'Points redeemed successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Loyalty redemption error:', error);

    if (error.name === 'ZodError') {
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

    if (error.name === 'AuthError') {
      return NextResponse.json(
        {
          error: {
            code: error.statusCode === 403 ? 'AUTH_UNAUTHORIZED' : 'AUTH_TOKEN_EXPIRED',
            message: error.message,
          },
        },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: error.message || 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Generate a unique voucher code
 */
function generateVoucherCode(): string {
  const prefix = 'LOYALTY';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}
