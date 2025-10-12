# Stripe Webhook Setup Guide

This guide explains how to set up and test Stripe webhooks for the payment integration.

## Overview

Webhooks allow Stripe to notify our application about payment events asynchronously. This is crucial for handling payment confirmations reliably, even if the user closes their browser before the payment completes.

## Webhook Endpoint

**URL**: `/api/checkout/webhooks`
**Method**: POST
**Events Handled**:
- `payment_intent.succeeded` - Payment completed successfully
- `payment_intent.payment_failed` - Payment failed
- `payment_intent.canceled` - Payment was canceled

## Local Development Setup

### 1. Install Stripe CLI

```bash
# macOS
brew install stripe/stripe-cli/stripe

# Other platforms
# Download from: https://stripe.com/docs/stripe-cli
```

### 2. Login to Stripe

```bash
stripe login
```

This will open your browser to authenticate with your Stripe account.

### 3. Forward Webhooks to Local Server

```bash
# Start your Next.js development server first
npm run dev

# In a separate terminal, forward webhooks
stripe listen --forward-to localhost:3000/api/checkout/webhooks
```

The CLI will output a webhook signing secret like:
```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx
```

### 4. Add Webhook Secret to Environment

Copy the webhook signing secret and add it to your `.env` file:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**Important**: Restart your Next.js server after adding the secret.

## Testing Webhooks

### Trigger Test Events

With the Stripe CLI listening, you can trigger test events:

```bash
# Test successful payment
stripe trigger payment_intent.succeeded

# Test failed payment
stripe trigger payment_intent.payment_failed

# Test canceled payment
stripe trigger payment_intent.canceled
```

### Monitor Webhook Events

Watch your terminal where `stripe listen` is running. You'll see:
- Incoming webhook events
- HTTP status codes from your endpoint
- Any errors or issues

Also check your Next.js server logs for:
- `[TEST] Webhook received: payment_intent.succeeded`
- Order update confirmations
- Any error messages

### Test with Real Payment Flow

1. Add items to cart
2. Go to checkout
3. Use a test card (e.g., `4242 4242 4242 4242`)
4. Complete payment
5. Watch the webhook CLI for the `payment_intent.succeeded` event
6. Verify the order status updated in the database

## Production Setup

### 1. Register Webhook Endpoint in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your production URL: `https://yourdomain.com/api/checkout/webhooks`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
5. Click "Add endpoint"

### 2. Copy Webhook Signing Secret

After creating the endpoint, Stripe will show you the signing secret. Copy it and add to your production environment variables:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### 3. Verify Webhook Delivery

1. Make a test payment in production
2. Check the webhook logs in Stripe Dashboard
3. Verify the webhook was delivered successfully (200 response)
4. Check your application logs for processing confirmation

## Webhook Security

### Signature Verification

The webhook endpoint automatically verifies that requests come from Stripe by:
1. Checking for the `stripe-signature` header
2. Using the webhook secret to verify the signature
3. Rejecting requests with invalid signatures (400 error)

**Never disable signature verification in production!**

### Best Practices

1. **Always verify signatures** - The endpoint does this automatically
2. **Return 200 quickly** - Process webhooks asynchronously if needed
3. **Handle idempotency** - Stripe may send the same event multiple times
4. **Log everything** - Keep detailed logs for debugging
5. **Monitor failures** - Set up alerts for webhook delivery failures

## Troubleshooting

### Webhook Returns 400 "Missing stripe-signature header"

- Make sure you're using the Stripe CLI or Stripe Dashboard to send webhooks
- Direct HTTP requests won't work without proper signatures

### Webhook Returns 400 "Webhook signature verification failed"

- Check that `STRIPE_WEBHOOK_SECRET` is set correctly
- Make sure you're using the correct secret for your environment (test vs live)
- Restart your server after changing environment variables

### Order Not Updating After Payment

1. Check webhook was received (Stripe CLI or Dashboard logs)
2. Check your application logs for errors
3. Verify the `orderId` is in the payment intent metadata
4. Check database permissions for the orders table

### Webhooks Not Being Received

1. Verify your server is accessible from the internet (for production)
2. Check firewall settings
3. Verify the webhook endpoint URL is correct
4. Check Stripe Dashboard for delivery attempts and errors

## Monitoring

### What to Monitor

1. **Webhook delivery success rate** - Should be >99%
2. **Processing time** - Should be <1 second
3. **Failed order updates** - Should trigger alerts
4. **Duplicate events** - Normal, but track frequency

### Logging

The webhook endpoint logs:
- Event type and test/live mode
- Order ID being updated
- Success/failure of database updates
- Any errors encountered

Example logs:
```
[TEST] Webhook received: payment_intent.succeeded
✓ Payment succeeded for order abc123 (Payment Intent: pi_xxx)
```

## Testing Checklist

- [ ] Stripe CLI installed and authenticated
- [ ] Webhook secret added to `.env`
- [ ] Server restarted after adding secret
- [ ] `stripe listen` running and forwarding to localhost
- [ ] Test event triggered successfully
- [ ] Webhook received and processed (check logs)
- [ ] Order status updated in database
- [ ] Error handling tested (invalid signature, missing orderId)

## Additional Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Testing Webhooks](https://stripe.com/docs/webhooks/test)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)
