import { stripe } from './client';
import Stripe from 'stripe';

export interface CreatePaymentIntentParams {
  amount: number; // in cents
  currency: string;
  orderId?: string;
  customerId?: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

export interface PaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
}

/**
 * Creates a payment intent with Stripe
 * @param params - Payment intent parameters
 * @returns Payment intent result with client secret
 */
export async function createPaymentIntent(
  params: CreatePaymentIntentParams
): Promise<PaymentIntentResult> {
  // Validate amount is positive
  if (params.amount <= 0) {
    throw new Error('Payment amount must be greater than zero');
  }

  // Ensure amount is in cents (integer)
  const amountInCents = Math.round(params.amount);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: params.currency.toLowerCase(),
    receipt_email: params.customerEmail,
    metadata: {
      orderId: params.orderId || '',
      customerId: params.customerId || '',
      ...params.metadata,
    },
    automatic_payment_methods: {
      enabled: true,
    },
  });

  if (!paymentIntent.client_secret) {
    throw new Error('Failed to create payment intent: no client secret returned');
  }

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
}

/**
 * Retrieves a payment intent from Stripe
 * @param paymentIntentId - The Stripe payment intent ID
 * @returns The payment intent object
 */
export async function retrievePaymentIntent(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  if (!paymentIntentId) {
    throw new Error('Payment intent ID is required');
  }

  return await stripe.paymentIntents.retrieve(paymentIntentId);
}
