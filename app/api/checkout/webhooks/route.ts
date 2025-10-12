import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent, isTestModeEvent } from '@/lib/stripe/webhook';
import { db } from '@/lib/supabase/database';
import Stripe from 'stripe';

/**
 * Webhook handler for Stripe payment events
 * Processes payment_intent.succeeded, payment_intent.payment_failed, and payment_intent.canceled events
 */
export async function POST(req: NextRequest) {
  // Get the raw body as text for signature verification
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    console.error('Webhook error: Missing stripe-signature header');
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  try {
    // Verify webhook signature and construct event
    const event = await constructWebhookEvent(payload, signature);

    // Log the event for debugging
    const testMode = isTestModeEvent(event);
    console.log(`[${testMode ? 'TEST' : 'LIVE'}] Webhook received: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;

      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    
    // Return 400 for signature verification failures
    // This prevents Stripe from retrying invalid requests
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}

/**
 * Handles successful payment intent events
 * Updates order status to confirmed and payment status to completed
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId;

  if (!orderId) {
    console.error('Payment intent succeeded but no orderId in metadata:', paymentIntent.id);
    return;
  }

  try {
    // Update order with successful payment information
    const { error } = await db
      .from('orders')
      .update({
        payment_status: 'completed',
        payment_reference: paymentIntent.id,
        payment_method: 'stripe',
        status: 'confirmed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (error) {
      console.error(`Failed to update order ${orderId} after successful payment:`, error);
      // Note: We still return success to Stripe to prevent retries
      // This should trigger an alert for manual reconciliation
    } else {
      console.log(`✓ Payment succeeded for order ${orderId} (Payment Intent: ${paymentIntent.id})`);
    }
  } catch (error) {
    console.error(`Exception updating order ${orderId}:`, error);
  }
}

/**
 * Handles failed payment intent events
 * Updates order payment status to failed
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId;

  if (!orderId) {
    console.error('Payment intent failed but no orderId in metadata:', paymentIntent.id);
    return;
  }

  try {
    // Get the failure reason if available
    const failureMessage = paymentIntent.last_payment_error?.message || 'Payment failed';

    const { error } = await db
      .from('orders')
      .update({
        payment_status: 'failed',
        payment_reference: paymentIntent.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (error) {
      console.error(`Failed to update order ${orderId} after payment failure:`, error);
    } else {
      console.log(`✗ Payment failed for order ${orderId}: ${failureMessage}`);
    }
  } catch (error) {
    console.error(`Exception updating order ${orderId}:`, error);
  }
}

/**
 * Handles canceled payment intent events
 * Updates order status to cancelled and payment status to failed
 */
async function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent) {
  const orderId = paymentIntent.metadata.orderId;

  if (!orderId) {
    console.error('Payment intent canceled but no orderId in metadata:', paymentIntent.id);
    return;
  }

  try {
    const { error } = await db
      .from('orders')
      .update({
        payment_status: 'failed',
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (error) {
      console.error(`Failed to update order ${orderId} after payment cancellation:`, error);
    } else {
      console.log(`⊘ Payment canceled for order ${orderId}`);
    }
  } catch (error) {
    console.error(`Exception updating order ${orderId}:`, error);
  }
}

// Configure Next.js to disable body parsing for this route
// This is required because we need the raw body for webhook signature verification
export const runtime = 'nodejs';
