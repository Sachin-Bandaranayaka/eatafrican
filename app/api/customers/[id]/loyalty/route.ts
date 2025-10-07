import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase/database';
import { requireCustomerAccess } from '@/lib/middleware/auth';

/**
 * GET /api/customers/[id]/loyalty
 * Get customer's loyalty points balance, referral code, and transaction history
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = params.id;

    // Validate customer access
    await requireCustomerAccess(req, customerId);

    // Fetch loyalty points record
    const { data: loyaltyPoints, error: loyaltyError } = await db
      .from('loyalty_points')
      .select('*')
      .eq('customer_id', customerId)
      .single();

    // If no loyalty record exists, create one
    if (loyaltyError || !loyaltyPoints) {
      // Generate unique referral code
      const referralCode = `REF${customerId.substring(0, 8).toUpperCase()}`;

      const { data: newLoyalty, error: createError } = await db
        .from('loyalty_points')
        .insert({
          customer_id: customerId,
          points_balance: 0,
          lifetime_points: 0,
          referral_code: referralCode,
        })
        .select()
        .single();

      if (createError) {
        console.error('Loyalty points creation error:', createError);
        return NextResponse.json(
          {
            error: {
              code: 'INTERNAL_ERROR',
              message: 'Failed to initialize loyalty points',
            },
          },
          { status: 500 }
        );
      }

      // Return with empty transactions
      return NextResponse.json({
        pointsBalance: 0,
        lifetimePoints: 0,
        referralCode: referralCode,
        availableRewards: getAvailableRewards(0),
        transactions: [],
      });
    }

    // Fetch loyalty transaction history
    const { data: transactions, error: transactionsError } = await db
      .from('loyalty_transactions')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (transactionsError) {
      console.error('Loyalty transactions fetch error:', transactionsError);
      return NextResponse.json(
        {
          error: {
            code: 'INTERNAL_ERROR',
            message: 'Failed to fetch loyalty transactions',
          },
        },
        { status: 500 }
      );
    }

    // Format transactions
    const formattedTransactions = transactions?.map(transaction => ({
      id: transaction.id,
      type: transaction.transaction_type,
      points: transaction.points,
      description: transaction.description,
      orderId: transaction.order_id,
      createdAt: transaction.created_at,
    })) || [];

    // Get available rewards based on points balance
    const availableRewards = getAvailableRewards(loyaltyPoints.points_balance);

    return NextResponse.json({
      pointsBalance: loyaltyPoints.points_balance,
      lifetimePoints: loyaltyPoints.lifetime_points,
      referralCode: loyaltyPoints.referral_code,
      availableRewards,
      transactions: formattedTransactions,
    });
  } catch (error: any) {
    console.error('Loyalty points fetch error:', error);

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
          message: 'An unexpected error occurred',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * Helper function to get available rewards based on points balance
 */
function getAvailableRewards(pointsBalance: number) {
  const rewards = [
    {
      id: 'discount_10',
      discount: '10% DISCOUNT',
      points: 100,
      discountType: 'percentage',
      discountValue: 10,
    },
    {
      id: 'discount_20',
      discount: '20% DISCOUNT',
      points: 200,
      discountType: 'percentage',
      discountValue: 20,
    },
    {
      id: 'discount_50',
      discount: '50% DISCOUNT',
      points: 500,
      discountType: 'percentage',
      discountValue: 50,
    },
  ];

  // Mark rewards as available or unavailable based on points balance
  return rewards.map(reward => ({
    ...reward,
    available: pointsBalance >= reward.points,
  }));
}
