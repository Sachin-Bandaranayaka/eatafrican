#!/usr/bin/env node

/**
 * Test script for order creation with payment integration
 * Tests the updated order flow that supports Stripe payment intents
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function testOrderCreationWithPayment() {
  console.log('🧪 Testing Order Creation with Payment Integration\n');

  try {
    // Step 1: Create a payment intent first
    console.log('Step 1: Creating payment intent...');
    const paymentIntentResponse = await fetch(`${BASE_URL}/api/checkout/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 50.00, // CHF 50.00
        currency: 'chf',
        customerEmail: 'test@example.com',
      }),
    });

    if (!paymentIntentResponse.ok) {
      const error = await paymentIntentResponse.json();
      console.error('❌ Payment intent creation failed:', error);
      return;
    }

    const paymentIntentData = await paymentIntentResponse.json();
    console.log('✅ Payment intent created:', paymentIntentData.paymentIntentId);

    // Step 2: Create order with payment intent ID
    console.log('\nStep 2: Creating order with payment intent...');
    const orderResponse = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        restaurantId: '00000000-0000-0000-0000-000000000001', // Replace with actual restaurant ID
        customerEmail: 'test@example.com',
        customerPhone: '+41791234567',
        customerFirstName: 'Test',
        customerLastName: 'User',
        items: [
          {
            menuItemId: '00000000-0000-0000-0000-000000000001', // Replace with actual menu item ID
            quantity: 2,
            specialInstructions: 'Extra spicy',
          },
        ],
        deliveryAddress: 'Teststrasse 123',
        deliveryCity: 'Basel',
        deliveryPostalCode: '4000',
        deliveryLatitude: 47.5596,
        deliveryLongitude: 7.5886,
        scheduledDeliveryTime: new Date(Date.now() + 3600000).toISOString(),
        paymentIntentId: paymentIntentData.paymentIntentId, // Link to payment intent
      }),
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.json();
      console.error('❌ Order creation failed:', error);
      return;
    }

    const orderData = await orderResponse.json();
    console.log('✅ Order created successfully:');
    console.log('   Order ID:', orderData.order.id);
    console.log('   Order Number:', orderData.order.orderNumber);
    console.log('   Payment Status:', orderData.order.paymentStatus);
    console.log('   Total Amount:', `CHF ${orderData.order.totalAmount.toFixed(2)}`);

    // Step 3: Simulate payment confirmation (update order)
    console.log('\nStep 3: Simulating payment confirmation...');
    const updateResponse = await fetch(`${BASE_URL}/api/orders`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: orderData.order.id,
        paymentIntentId: paymentIntentData.paymentIntentId,
        paymentStatus: 'completed',
      }),
    });

    if (!updateResponse.ok) {
      const error = await updateResponse.json();
      console.error('❌ Order update failed:', error);
      return;
    }

    const updatedOrderData = await updateResponse.json();
    console.log('✅ Order updated after payment:');
    console.log('   Order Status:', updatedOrderData.order.status);
    console.log('   Payment Status:', updatedOrderData.order.paymentStatus);
    console.log('   Payment Reference:', updatedOrderData.order.paymentReference);

    console.log('\n✅ All tests passed! Order creation with payment integration works correctly.');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

async function testOrderCreationWithoutPayment() {
  console.log('\n🧪 Testing Order Creation without Payment (Legacy Flow)\n');

  try {
    const orderResponse = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        restaurantId: '00000000-0000-0000-0000-000000000001',
        customerEmail: 'test@example.com',
        customerPhone: '+41791234567',
        customerFirstName: 'Test',
        customerLastName: 'User',
        items: [
          {
            menuItemId: '00000000-0000-0000-0000-000000000001',
            quantity: 1,
          },
        ],
        deliveryAddress: 'Teststrasse 123',
        deliveryCity: 'Basel',
        deliveryPostalCode: '4000',
        scheduledDeliveryTime: new Date(Date.now() + 3600000).toISOString(),
        // No paymentIntentId - legacy flow
      }),
    });

    if (!orderResponse.ok) {
      const error = await orderResponse.json();
      console.error('❌ Order creation failed:', error);
      return;
    }

    const orderData = await orderResponse.json();
    console.log('✅ Order created without payment intent:');
    console.log('   Order ID:', orderData.order.id);
    console.log('   Payment Status:', orderData.order.paymentStatus);
    console.log('   (Should be "pending" for legacy flow)');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run tests
console.log('='.repeat(60));
console.log('Order Creation with Payment Integration Test Suite');
console.log('='.repeat(60));
console.log();

testOrderCreationWithPayment()
  .then(() => testOrderCreationWithoutPayment())
  .then(() => {
    console.log('\n' + '='.repeat(60));
    console.log('Test suite completed');
    console.log('='.repeat(60));
  });
