import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent } from '@/lib/stripe/payment-intent';
import { optionalAuth } from '@/lib/middleware/auth';
import { z } from 'zod';

// Validation schema for payment intent creation
const createPaymentIntentSchema = z.object({
  amount: z.number().positive('Amount must be greater than zero'),
  currency: z.string().min(3).max(3).default('chf'),
  orderId: z.string().uuid('Invalid order ID').optional(),
  customerEmail: z.string().email('Invalid email address').optional(),
  metadata: z.record(z.string()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    // Optional authentication - works for both authenticated and guest users
    const user = await optionalAuth(req);
    
    // Parse and validate request body
    const body = await req.json();
    const validatedData = createPaymentIntentSchema.parse(body);

    // Convert amount to cents (Stripe requires smallest currency unit)
    const amountInCents = Math.round(validatedData.amount * 100);

    // Validate amount is reasonable (between 1 cent and 100,000 CHF)
    if (amountInCents < 1 || amountInCents > 10000000) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_AMOUNT',
            message: 'Payment amount must be between 0.01 and 100,000.00',
          },
        },
        { status: 400 }
      );
    }

    // Determine customer email (from user or request)
    const customerEmail = validatedData.customerEmail || user?.email;

    // Create payment intent with Stripe
    const result = await createPaymentIntent({
      amount: amountInCents,
      currency: validatedData.currency.toLowerCase(),
      orderId: validatedData.orderId,
      customerId: user?.id,
      customerEmail,
      metadata: {
        environment: 'test',
        userRole: user?.role || 'guest',
        ...validatedData.metadata,
      },
    });

    // Log payment intent creation for monitoring
    console.log('[Payment Intent Created]', {
      paymentIntentId: result.paymentIntentId,
      amount: validatedData.amount,
      currency: validatedData.currency,
      orderId: validatedData.orderId,
      customerId: user?.id || 'guest',
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      clientSecret: result.clientSecret,
      paymentIntentId: result.paymentIntentId,
    });
  } catch (error: any) {
    console.error('[Payment Intent Error]', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
    });

    // Handle Zod validation errors
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

    // Handle Stripe API errors
    if (error.type === 'StripeError' || error.type?.startsWith('Stripe')) {
      return NextResponse.json(
        {
          error: {
            code: 'STRIPE_ERROR',
            message: error.message || 'Payment service error',
            type: error.type,
          },
        },
        { status: 502 }
      );
    }

    // Handle generic errors
    return NextResponse.json(
      {
        error: {
          code: 'PAYMENT_INTENT_FAILED',
          message: error.message || 'Failed to create payment intent',
        },
      },
      { status: 500 }
    );
  }
}
