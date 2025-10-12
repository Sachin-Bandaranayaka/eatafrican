import { stripe } from './client';
import Stripe from 'stripe';

/**
 * Constructs and verifies a webhook event from Stripe
 * @param payload - The raw request body as string or buffer
 * @param signature - The Stripe signature from the request header
 * @returns The verified Stripe event
 * @throws Error if signature verification fails or webhook secret is missing
 */
export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err: any) {
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }
}

/**
 * Checks if a Stripe event is from test mode
 * @param event - The Stripe event to check
 * @returns True if the event is from test mode, false otherwise
 */
export function isTestModeEvent(event: Stripe.Event): boolean {
  return event.livemode === false;
}
