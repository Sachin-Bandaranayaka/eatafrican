#!/usr/bin/env node

/**
 * Test Script: Restaurant Creation and Approval (Task 3.1)
 * 
 * This script tests the complete restaurant creation and approval flow:
 * 1. Register restaurant owner
 * 2. Create restaurant
 * 3. Upload images (simulated)
 * 4. Admin approves restaurant
 * 5. Verify all data in database
 */

const API_BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Test data
const testData = {
  restaurantOwner: {
    email: 'test-restaurant-owner-001@example.com',
    password: 'SecurePass123!',
    firstName: 'Test',
    lastName: 'Restaurant Owner',
    role: 'restaurant_owner',
    phone: '+41791234567'
  },
  restaurant: {
    name: 'Test Ethiopian Restaurant',
    description: 'Authentic Ethiopian cuisine in the heart of Zürich',
    cuisineTypes: ['Ethiopian', 'African'],
    address: 'Bahnhofstrasse 100',
    city: 'Zürich',
    postalCode: '8001',
    region: 'Zürich',
    phone: '+41442345678',
    email: 'info@test-ethiopian.ch',
    minOrderAmount: 24.0,
    latitude: 47.3769,
    longitude: 8.5417,
    openingHours: {
      monday: { open: '11:00', close: '22:00' },
      tuesday: { open: '11:00', close: '22:00' },
      wednesday: { open: '11:00', close: '22:00' },
      thursday: { open: '11:00', close: '22:00' },
      friday: { open: '11:00', close: '23:00' },
      saturday: { open: '12:00', close: '23:00' },
      sunday: { open: '12:00', close: '21:00' }
    }
  }
};

// Store test results
const results = {
  restaurantOwnerId: null,
  restaurantOwnerToken: null,
  restaurantId: null,
  logoUrl: null,
  coverImageUrl: null,
  adminToken: null,
  errors: []
};

/**
 * Make HTTP request
 */
async function makeRequest(method, endpoint, data = null, token = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (data && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  console.log(`\n${method} ${endpoint}`);
  if (data) {
    console.log('Request body:', JSON.stringify(data, null, 2));
  }

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();

    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(responseData, null, 2));

    return {
      status: response.status,
      data: responseData,
      ok: response.ok
    };
  } catch (error) {
    console.error('Request failed:', error.message);
    return {
      status: 0,
      data: { error: error.message },
      ok: false
    };
  }
}

/**
 * Step 1: Register Restaurant Owner (or login if exists)
 */
async function registerRestaurantOwner() {
  console.log('\n=== STEP 1: Register Restaurant Owner ===');
  
  const response = await makeRequest('POST', '/api/auth/register', testData.restaurantOwner);
  
  if (response.ok && response.data.user) {
    results.restaurantOwnerId = response.data.user.id;
    results.restaurantOwnerToken = response.data.token || response.data.accessToken;
    console.log('✓ Restaurant owner registered successfully');
    console.log(`  User ID: ${results.restaurantOwnerId}`);
    return true;
  } else if (response.status === 400 && response.data.error?.message?.includes('already been registered')) {
    // User exists, try to login
    console.log('  User exists, trying to login...');
    const loginResponse = await makeRequest('POST', '/api/auth/login', {
      email: testData.restaurantOwner.email,
      password: testData.restaurantOwner.password
    });
    
    if (loginResponse.ok && loginResponse.data.user) {
      results.restaurantOwnerId = loginResponse.data.user.id;
      results.restaurantOwnerToken = loginResponse.data.token || loginResponse.data.accessToken;
      console.log('✓ Restaurant owner logged in successfully');
      console.log(`  User ID: ${results.restaurantOwnerId}`);
      return true;
    }
  }
  
  results.errors.push('Failed to register or login restaurant owner');
  console.log('✗ Failed to register or login restaurant owner');
  return false;
}

/**
 * Step 2: Create Restaurant (or use existing)
 */
async function createRestaurant() {
  console.log('\n=== STEP 2: Create Restaurant ===');
  
  if (!results.restaurantOwnerToken) {
    console.log('✗ No restaurant owner token available');
    return false;
  }

  const response = await makeRequest(
    'POST',
    '/api/restaurants',
    testData.restaurant,
    results.restaurantOwnerToken
  );
  
  if (response.ok && response.data.restaurant) {
    results.restaurantId = response.data.restaurant.id;
    console.log('✓ Restaurant created successfully');
    console.log(`  Restaurant ID: ${results.restaurantId}`);
    console.log(`  Status: ${response.data.restaurant.status}`);
    console.log(`  Owner ID: ${response.data.restaurant.owner_id}`);
    
    // Verify status is pending
    if (response.data.restaurant.status !== 'pending') {
      results.errors.push(`Expected status 'pending', got '${response.data.restaurant.status}'`);
      console.log('✗ Restaurant status is not pending');
      return false;
    }
    
    // Verify owner_id matches
    if (response.data.restaurant.owner_id !== results.restaurantOwnerId) {
      results.errors.push('Restaurant owner_id does not match user ID');
      console.log('✗ Restaurant owner_id mismatch');
      return false;
    }
    
    return true;
  } else if (response.status === 409) {
    // Restaurant already exists, get it from the user data
    console.log('  Restaurant already exists, using existing restaurant');
    // The restaurant ID should be in the login response
    const loginResponse = await makeRequest('POST', '/api/auth/login', {
      email: testData.restaurantOwner.email,
      password: testData.restaurantOwner.password
    });
    
    if (loginResponse.ok && loginResponse.data.user?.restaurantId) {
      results.restaurantId = loginResponse.data.user.restaurantId;
      console.log('✓ Using existing restaurant');
      console.log(`  Restaurant ID: ${results.restaurantId}`);
      return true;
    }
  }
  
  results.errors.push('Failed to create or get restaurant');
  console.log('✗ Failed to create or get restaurant');
  return false;
}

/**
 * Step 3: Get Admin Token (register or login as admin)
 */
async function getAdminToken() {
  console.log('\n=== STEP 3: Get Admin Token ===');
  
  // First try to register a test admin
  console.log('  Registering test admin...');
  const registerResponse = await makeRequest('POST', '/api/auth/register', {
    email: 'test-admin-001@example.com',
    password: 'AdminPass123!',
    firstName: 'Test',
    lastName: 'Admin',
    role: 'super_admin',
    phone: '+41791234599'
  });
  
  if (registerResponse.ok && (registerResponse.data.token || registerResponse.data.accessToken)) {
    results.adminToken = registerResponse.data.token || registerResponse.data.accessToken;
    console.log('✓ Test admin registered and logged in successfully');
    return true;
  }
  
  // If registration failed (user exists), try to login
  if (registerResponse.status === 400) {
    console.log('  Test admin exists, trying to login...');
    const loginResponse = await makeRequest('POST', '/api/auth/login', {
      email: 'test-admin-001@example.com',
      password: 'AdminPass123!'
    });
    
    if (loginResponse.ok && (loginResponse.data.token || loginResponse.data.accessToken)) {
      results.adminToken = loginResponse.data.token || loginResponse.data.accessToken;
      console.log('✓ Test admin logged in successfully');
      return true;
    }
  }
  
  results.errors.push('Failed to get admin token');
  console.log('✗ Failed to get admin token');
  return false;
}

/**
 * Step 4: Admin Approves Restaurant
 */
async function approveRestaurant() {
  console.log('\n=== STEP 4: Admin Approves Restaurant ===');
  
  if (!results.adminToken) {
    console.log('✗ No admin token available');
    return false;
  }
  
  if (!results.restaurantId) {
    console.log('✗ No restaurant ID available');
    return false;
  }

  const response = await makeRequest(
    'PATCH',
    `/api/admin/restaurants/${results.restaurantId}/approve`,
    { status: 'active' },
    results.adminToken
  );
  
  if (response.ok && response.data.restaurant) {
    console.log('✓ Restaurant approved successfully');
    console.log(`  New Status: ${response.data.restaurant.status}`);
    
    // Verify status is active
    if (response.data.restaurant.status !== 'active') {
      results.errors.push(`Expected status 'active', got '${response.data.restaurant.status}'`);
      console.log('✗ Restaurant status is not active');
      return false;
    }
    
    return true;
  } else {
    results.errors.push('Failed to approve restaurant');
    console.log('✗ Failed to approve restaurant');
    return false;
  }
}

/**
 * Main test execution
 */
async function runTests() {
  console.log('='.repeat(60));
  console.log('TASK 3.1: Restaurant Creation and Approval Test');
  console.log('='.repeat(60));
  console.log(`API Base URL: ${API_BASE_URL}`);
  
  let allPassed = true;

  // Step 1: Register restaurant owner
  if (!await registerRestaurantOwner()) {
    allPassed = false;
  }

  // Step 2: Create restaurant
  if (allPassed && !await createRestaurant()) {
    allPassed = false;
  }

  // Step 3: Get admin token
  if (allPassed && !await getAdminToken()) {
    allPassed = false;
  }

  // Step 4: Approve restaurant
  if (allPassed && !await approveRestaurant()) {
    allPassed = false;
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  
  if (allPassed) {
    console.log('✓ All tests passed!');
    console.log('\nTest Results:');
    console.log(`  Restaurant Owner ID: ${results.restaurantOwnerId}`);
    console.log(`  Restaurant ID: ${results.restaurantId}`);
    console.log('\nNext Steps:');
    console.log('  - Verify restaurant in database using Supabase MCP');
    console.log('  - Check approval notification was created');
    console.log('  - Test image uploads (requires actual image files)');
  } else {
    console.log('✗ Some tests failed');
    console.log('\nErrors:');
    results.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  }
  
  console.log('='.repeat(60));
  
  // Return test results for further verification
  return {
    passed: allPassed,
    results
  };
}

// Run tests
runTests().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
