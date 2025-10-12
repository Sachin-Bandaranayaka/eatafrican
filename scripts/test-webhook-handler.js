/**
 * Test script for Stripe webhook handler
 * 
 * This script tests the webhook endpoint by simulating Stripe webhook events.
 * Note: For full testing with signature verification, use the Stripe CLI:
 * 
 * stripe listen --forward-to localhost:3000/api/checkout/webhooks
 * stripe trigger payment_intent.succeeded
 * stripe trigger payment_intent.payment_failed
 * stripe trigger payment_intent.canceled
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Test data
const testOrderId = 'test-order-123';
const testPaymentIntentId = 'pi_test_123456789';

/**
 * Simulates a Stripe webhook event payload
 */
function createWebhookPayload(eventType, paymentIntentData) {
  return {
    id: `evt_${Date.now()}`,
    object: 'event',
    api_version: '2023-10-16',
    created: Math.floor(Date.now() / 1000),
    data: {
      object: paymentIntentData,
    },
    livemode: false,
    pending_webhooks: 1,
    request: {
      id: null,
      idempotency_key: null,
    },
    type: eventType,
  };
}

/**
 * Creates a mock payment intent object
 */
function createPaymentIntent(status, orderId) {
  return {
    id: testPaymentIntentId,
    object: 'payment_intent',
    amount: 5000,
    amount_capturable: 0,
    amount_received: status === 'succeeded' ? 5000 : 0,
    capture_method: 'automatic',
    client_secret: 'pi_test_secret',
    confirmation_method: 'automatic',
    created: Math.floor(Date.now() / 1000),
    currency: 'chf',
    customer: null,
    description: null,
    last_payment_error: status === 'failed' ? {
      code: 'card_declined',
      message: 'Your card was declined.',
      type: 'card_error',
    } : null,
    livemode: false,
    metadata: {
      orderId: orderId,
      environment: 'test',
    },
    next_action: null,
    payment_method: 'pm_test_123',
    payment_method_types: ['card'],
    processing: null,
    receipt_email: null,
    setup_future_usage: null,
    shipping: null,
    status: status,
  };
}

/**
 * Tests the webhook endpoint (without signature verification)
 * Note: This will fail signature verification in the actual endpoint
 */
async function testWebhookEndpoint(eventType, paymentIntentStatus) {
  console.log(`\n🧪 Testing ${eventType} event...`);
  
  const paymentIntent = createPaymentIntent(paymentIntentStatus, testOrderId);
  const payload = createWebhookPayload(eventType, paymentIntent);

  try {
    const response = await fetch(`${BASE_URL}/api/checkout/webhooks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: In real scenario, Stripe adds 'stripe-signature' header
        // Without it, the endpoint will return 400
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, data);

    if (response.status === 400 && data.error?.includes('Missing stripe-signature')) {
      console.log('✓ Expected behavior: Webhook requires signature verification');
      console.log('  Use Stripe CLI for full testing with signatures');
      return true;
    }

    return response.ok;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('='.repeat(60));
  console.log('Stripe Webhook Handler Test Suite');
  console.log('='.repeat(60));
  console.log(`\nTarget URL: ${BASE_URL}/api/checkout/webhooks`);
  console.log(`Test Order ID: ${testOrderId}`);
  
  console.log('\n📝 Note: These tests verify endpoint structure.');
  console.log('   For full signature verification testing, use Stripe CLI:');
  console.log('   $ stripe listen --forward-to localhost:3000/api/checkout/webhooks');
  console.log('   $ stripe trigger payment_intent.succeeded');

  // Test payment_intent.succeeded
  await testWebhookEndpoint('payment_intent.succeeded', 'succeeded');

  // Test payment_intent.payment_failed
  await testWebhookEndpoint('payment_intent.payment_failed', 'failed');

  // Test payment_intent.canceled
  await testWebhookEndpoint('payment_intent.canceled', 'canceled');

  console.log('\n' + '='.repeat(60));
  console.log('Test suite completed');
  console.log('='.repeat(60));
  console.log('\n💡 Next steps:');
  console.log('1. Install Stripe CLI: brew install stripe/stripe-cli/stripe');
  console.log('2. Login: stripe login');
  console.log('3. Forward webhooks: stripe listen --forward-to localhost:3000/api/checkout/webhooks');
  console.log('4. Trigger events: stripe trigger payment_intent.succeeded');
  console.log('5. Check your terminal for webhook logs\n');
}

// Run tests
runTests().catch(console.error);
