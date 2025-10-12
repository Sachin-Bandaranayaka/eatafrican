#!/usr/bin/env node

/**
 * Payment Intent Creation API Testing Script
 * Tests the /api/checkout/create-payment-intent endpoint
 */

// Load environment variables from .env file
require('dotenv').config();

const API_BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const results = [];

function logTest(result) {
  results.push(result);
  const status = result.passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${result.testName}`);
  console.log(`   ${result.message}`);
  if (result.details) {
    console.log(`   Details:`, JSON.stringify(result.details, null, 2));
  }
  console.log('');
}

async function makeRequest(endpoint, method, body, token) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  return { status: response.status, data };
}

async function testPaymentIntentCreation() {
  console.log('\n=== Payment Intent Creation Tests ===\n');

  // Test 1: Create payment intent with valid data (guest user)
  try {
    const { status, data } = await makeRequest('/api/checkout/create-payment-intent', 'POST', {
      amount: 50.00,
      currency: 'chf',
      customerEmail: 'test@example.com',
    });

    if (status === 200 && data.clientSecret && data.paymentIntentId) {
      logTest({
        testName: 'Create payment intent with valid data (guest user)',
        passed: true,
        message: 'Payment intent created successfully',
        details: {
          hasClientSecret: !!data.clientSecret,
          paymentIntentId: data.paymentIntentId,
        },
      });
    } else {
      logTest({
        testName: 'Create payment intent with valid data (guest user)',
        passed: false,
        message: 'Payment intent creation failed',
        details: { status, data },
      });
    }
  } catch (error) {
    logTest({
      testName: 'Create payment intent with valid data (guest user)',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }

  // Test 2: Create payment intent with order ID
  try {
    const { status, data } = await makeRequest('/api/checkout/create-payment-intent', 'POST', {
      amount: 75.50,
      currency: 'chf',
      orderId: '123e4567-e89b-12d3-a456-426614174000',
      customerEmail: 'customer@example.com',
    });

    if (status === 200 && data.clientSecret && data.paymentIntentId) {
      logTest({
        testName: 'Create payment intent with order ID',
        passed: true,
        message: 'Payment intent created with order ID',
        details: {
          paymentIntentId: data.paymentIntentId,
        },
      });
    } else {
      logTest({
        testName: 'Create payment intent with order ID',
        passed: false,
        message: 'Payment intent creation failed',
        details: { status, data },
      });
    }
  } catch (error) {
    logTest({
      testName: 'Create payment intent with order ID',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }

  // Test 3: Create payment intent with negative amount (should fail)
  try {
    const { status, data } = await makeRequest('/api/checkout/create-payment-intent', 'POST', {
      amount: -10.00,
      currency: 'chf',
    });

    if (status === 400 && data.error && data.error.code === 'VALIDATION_ERROR') {
      logTest({
        testName: 'Create payment intent with negative amount (should fail)',
        passed: true,
        message: 'Negative amount correctly rejected',
        details: { errorCode: data.error.code },
      });
    } else {
      logTest({
        testName: 'Create payment intent with negative amount (should fail)',
        passed: false,
        message: 'Negative amount was not rejected',
        details: { status, data },
      });
    }
  } catch (error) {
    logTest({
      testName: 'Create payment intent with negative amount (should fail)',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }

  // Test 4: Create payment intent with zero amount (should fail)
  try {
    const { status, data } = await makeRequest('/api/checkout/create-payment-intent', 'POST', {
      amount: 0,
      currency: 'chf',
    });

    if (status === 400 && data.error) {
      logTest({
        testName: 'Create payment intent with zero amount (should fail)',
        passed: true,
        message: 'Zero amount correctly rejected',
        details: { errorCode: data.error.code },
      });
    } else {
      logTest({
        testName: 'Create payment intent with zero amount (should fail)',
        passed: false,
        message: 'Zero amount was not rejected',
        details: { status, data },
      });
    }
  } catch (error) {
    logTest({
      testName: 'Create payment intent with zero amount (should fail)',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }

  // Test 5: Create payment intent with excessive amount (should fail)
  try {
    const { status, data } = await makeRequest('/api/checkout/create-payment-intent', 'POST', {
      amount: 150000.00,
      currency: 'chf',
    });

    if (status === 400 && data.error && data.error.code === 'INVALID_AMOUNT') {
      logTest({
        testName: 'Create payment intent with excessive amount (should fail)',
        passed: true,
        message: 'Excessive amount correctly rejected',
        details: { errorCode: data.error.code },
      });
    } else {
      logTest({
        testName: 'Create payment intent with excessive amount (should fail)',
        passed: false,
        message: 'Excessive amount was not rejected',
        details: { status, data },
      });
    }
  } catch (error) {
    logTest({
      testName: 'Create payment intent with excessive amount (should fail)',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }

  // Test 6: Create payment intent with invalid email (should fail)
  try {
    const { status, data } = await makeRequest('/api/checkout/create-payment-intent', 'POST', {
      amount: 25.00,
      currency: 'chf',
      customerEmail: 'invalid-email',
    });

    if (status === 400 && data.error && data.error.code === 'VALIDATION_ERROR') {
      logTest({
        testName: 'Create payment intent with invalid email (should fail)',
        passed: true,
        message: 'Invalid email correctly rejected',
        details: { errorCode: data.error.code },
      });
    } else {
      logTest({
        testName: 'Create payment intent with invalid email (should fail)',
        passed: false,
        message: 'Invalid email was not rejected',
        details: { status, data },
      });
    }
  } catch (error) {
    logTest({
      testName: 'Create payment intent with invalid email (should fail)',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }

  // Test 7: Create payment intent with invalid order ID (should fail)
  try {
    const { status, data } = await makeRequest('/api/checkout/create-payment-intent', 'POST', {
      amount: 30.00,
      currency: 'chf',
      orderId: 'not-a-uuid',
    });

    if (status === 400 && data.error && data.error.code === 'VALIDATION_ERROR') {
      logTest({
        testName: 'Create payment intent with invalid order ID (should fail)',
        passed: true,
        message: 'Invalid order ID correctly rejected',
        details: { errorCode: data.error.code },
      });
    } else {
      logTest({
        testName: 'Create payment intent with invalid order ID (should fail)',
        passed: false,
        message: 'Invalid order ID was not rejected',
        details: { status, data },
      });
    }
  } catch (error) {
    logTest({
      testName: 'Create payment intent with invalid order ID (should fail)',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }

  // Test 8: Create payment intent with custom metadata
  try {
    const { status, data } = await makeRequest('/api/checkout/create-payment-intent', 'POST', {
      amount: 45.00,
      currency: 'chf',
      customerEmail: 'metadata@example.com',
      metadata: {
        customField: 'customValue',
        orderType: 'delivery',
      },
    });

    if (status === 200 && data.clientSecret && data.paymentIntentId) {
      logTest({
        testName: 'Create payment intent with custom metadata',
        passed: true,
        message: 'Payment intent created with custom metadata',
        details: {
          paymentIntentId: data.paymentIntentId,
        },
      });
    } else {
      logTest({
        testName: 'Create payment intent with custom metadata',
        passed: false,
        message: 'Payment intent creation with metadata failed',
        details: { status, data },
      });
    }
  } catch (error) {
    logTest({
      testName: 'Create payment intent with custom metadata',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }

  // Test 9: Create payment intent with different currency
  try {
    const { status, data } = await makeRequest('/api/checkout/create-payment-intent', 'POST', {
      amount: 100.00,
      currency: 'eur',
      customerEmail: 'euro@example.com',
    });

    if (status === 200 && data.clientSecret && data.paymentIntentId) {
      logTest({
        testName: 'Create payment intent with different currency (EUR)',
        passed: true,
        message: 'Payment intent created with EUR currency',
        details: {
          paymentIntentId: data.paymentIntentId,
        },
      });
    } else {
      logTest({
        testName: 'Create payment intent with different currency (EUR)',
        passed: false,
        message: 'Payment intent creation with EUR failed',
        details: { status, data },
      });
    }
  } catch (error) {
    logTest({
      testName: 'Create payment intent with different currency (EUR)',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }

  // Test 10: Create payment intent with decimal amounts
  try {
    const { status, data } = await makeRequest('/api/checkout/create-payment-intent', 'POST', {
      amount: 12.99,
      currency: 'chf',
      customerEmail: 'decimal@example.com',
    });

    if (status === 200 && data.clientSecret && data.paymentIntentId) {
      logTest({
        testName: 'Create payment intent with decimal amounts',
        passed: true,
        message: 'Payment intent created with decimal amount',
        details: {
          paymentIntentId: data.paymentIntentId,
        },
      });
    } else {
      logTest({
        testName: 'Create payment intent with decimal amounts',
        passed: false,
        message: 'Payment intent creation with decimal amount failed',
        details: { status, data },
      });
    }
  } catch (error) {
    logTest({
      testName: 'Create payment intent with decimal amounts',
      passed: false,
      message: `Error: ${error.message}`,
    });
  }
}

async function generateReport() {
  console.log('\n=== TEST SUMMARY ===\n');
  
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => r.passed === false).length;
  const total = results.length;
  
  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${passed} (${((passed / total) * 100).toFixed(1)}%)`);
  console.log(`Failed: ${failed} (${((failed / total) * 100).toFixed(1)}%)`);
  
  if (failed > 0) {
    console.log('\nFailed Tests:');
    results.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.testName}: ${r.message}`);
    });
  }
  
  return { passed, failed, total, results };
}

async function main() {
  console.log('Starting Payment Intent Creation Tests...\n');
  console.log(`API Base URL: ${API_BASE_URL}\n`);

  try {
    await testPaymentIntentCreation();
    
    const summary = await generateReport();
    
    process.exit(summary.failed > 0 ? 1 : 0);
  } catch (error) {
    console.error('Fatal error during testing:', error);
    process.exit(1);
  }
}

main();
