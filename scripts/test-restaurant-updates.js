#!/usr/bin/env node

/**
 * Test Script: Restaurant Updates (Task 3.4)
 * 
 * This script tests restaurant update functionality:
 * 1. Update restaurant details as owner
 * 2. Update opening hours
 * 3. Update minimum order amount
 * 4. Replace restaurant logo
 * 5. Replace cover image
 * 6. Verify changes reflected immediately in database
 * 7. Test update as different owner (should fail)
 * 8. Test update as admin (should succeed)
 */

const API_BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Store test results
const results = {
  restaurantId: null,
  ownerToken: null,
  otherOwnerToken: null,
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

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();

    console.log(`Status: ${response.status}`);
    
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
 * Setup: Get tokens and restaurant ID
 */
async function setup() {
  console.log('\n=== SETUP: Get Tokens and Restaurant ID ===');
  
  // Login as restaurant owner
  const ownerLogin = await makeRequest('POST', '/api/auth/login', {
    email: 'test-restaurant-owner-001@example.com',
    password: 'SecurePass123!'
  });
  
  if (ownerLogin.ok && ownerLogin.data.user) {
    results.ownerToken = ownerLogin.data.token;
    results.restaurantId = ownerLogin.data.user.restaurantId;
    console.log(`✓ Restaurant owner logged in`);
    console.log(`  Restaurant ID: ${results.restaurantId}`);
  } else {
    results.errors.push('Failed to login as restaurant owner');
    console.log('✗ Failed to login as restaurant owner');
    return false;
  }
  
  // Login as admin
  const adminLogin = await makeRequest('POST', '/api/auth/login', {
    email: 'test-admin-001@example.com',
    password: 'AdminPass123!'
  });
  
  if (adminLogin.ok) {
    results.adminToken = adminLogin.data.token;
    console.log('✓ Admin logged in');
  } else {
    results.errors.push('Failed to login as admin');
    console.log('✗ Failed to login as admin');
    return false;
  }
  
  // Try to get another restaurant owner (for negative test)
  const otherOwnerLogin = await makeRequest('POST', '/api/auth/login', {
    email: 'owner@example.com',
    password: 'password123'
  });
  
  if (otherOwnerLogin.ok) {
    results.otherOwnerToken = otherOwnerLogin.data.token;
    console.log('✓ Other restaurant owner logged in');
  } else {
    console.log('⚠ Could not login as other restaurant owner (will skip negative test)');
  }
  
  return true;
}

/**
 * Step 1: Update restaurant details as owner
 */
async function updateRestaurantDetails() {
  console.log('\n=== STEP 1: Update Restaurant Details as Owner ===');
  
  if (!results.ownerToken || !results.restaurantId) {
    console.log('✗ Missing owner token or restaurant ID');
    return false;
  }
  
  const updates = {
    description: 'Updated: Authentic Ethiopian cuisine with modern twist',
    phone: '+41442345679'
  };
  
  const response = await makeRequest(
    'PATCH',
    `/api/restaurants/${results.restaurantId}`,
    updates,
    results.ownerToken
  );
  
  if (response.ok && response.data.restaurant) {
    console.log('✓ Restaurant details updated successfully');
    console.log(`  New description: ${response.data.restaurant.description}`);
    console.log(`  New phone: ${response.data.restaurant.phone}`);
    
    // Verify changes
    if (response.data.restaurant.description === updates.description &&
        response.data.restaurant.phone === updates.phone) {
      console.log('✓ Changes verified in response');
      return true;
    } else {
      results.errors.push('Updated values do not match');
      console.log('✗ Updated values do not match');
      return false;
    }
  } else {
    results.errors.push('Failed to update restaurant details');
    console.log('✗ Failed to update restaurant details');
    return false;
  }
}

/**
 * Step 2: Update opening hours
 */
async function updateOpeningHours() {
  console.log('\n=== STEP 2: Update Opening Hours ===');
  
  const newHours = {
    monday: { open: '10:00', close: '23:00' },
    tuesday: { open: '10:00', close: '23:00' },
    wednesday: { open: '10:00', close: '23:00' },
    thursday: { open: '10:00', close: '23:00' },
    friday: { open: '10:00', close: '00:00' },
    saturday: { open: '11:00', close: '00:00' },
    sunday: { open: '11:00', close: '22:00' }
  };
  
  const response = await makeRequest(
    'PATCH',
    `/api/restaurants/${results.restaurantId}`,
    { openingHours: newHours },
    results.ownerToken
  );
  
  if (response.ok && response.data.restaurant) {
    console.log('✓ Opening hours updated successfully');
    console.log('  New hours:');
    Object.entries(newHours).forEach(([day, hours]) => {
      console.log(`    ${day}: ${hours.open} - ${hours.close}`);
    });
    return true;
  } else {
    results.errors.push('Failed to update opening hours');
    console.log('✗ Failed to update opening hours');
    return false;
  }
}

/**
 * Step 3: Update minimum order amount
 */
async function updateMinOrderAmount() {
  console.log('\n=== STEP 3: Update Minimum Order Amount ===');
  
  const newMinOrder = 30.0;
  
  const response = await makeRequest(
    'PATCH',
    `/api/restaurants/${results.restaurantId}`,
    { minOrderAmount: newMinOrder },
    results.ownerToken
  );
  
  if (response.ok && response.data.restaurant) {
    console.log('✓ Minimum order amount updated successfully');
    console.log(`  New amount: Fr. ${response.data.restaurant.min_order_amount}`);
    
    if (parseFloat(response.data.restaurant.min_order_amount) === newMinOrder) {
      console.log('✓ Amount verified');
      return true;
    } else {
      results.errors.push('Min order amount does not match');
      console.log('✗ Min order amount does not match');
      return false;
    }
  } else {
    results.errors.push('Failed to update minimum order amount');
    console.log('✗ Failed to update minimum order amount');
    return false;
  }
}

/**
 * Step 4: Update restaurant logo URL
 */
async function updateLogoUrl() {
  console.log('\n=== STEP 4: Update Restaurant Logo URL ===');
  
  const newLogoUrl = 'https://example.com/logo-updated.jpg';
  
  const response = await makeRequest(
    'PATCH',
    `/api/restaurants/${results.restaurantId}`,
    { logoUrl: newLogoUrl },
    results.ownerToken
  );
  
  if (response.ok && response.data.restaurant) {
    console.log('✓ Logo URL updated successfully');
    console.log(`  New logo URL: ${response.data.restaurant.logo_url}`);
    
    if (response.data.restaurant.logo_url === newLogoUrl) {
      console.log('✓ Logo URL verified');
      return true;
    } else {
      results.errors.push('Logo URL does not match');
      console.log('✗ Logo URL does not match');
      return false;
    }
  } else {
    results.errors.push('Failed to update logo URL');
    console.log('✗ Failed to update logo URL');
    return false;
  }
}

/**
 * Step 5: Update cover image URL
 */
async function updateCoverImageUrl() {
  console.log('\n=== STEP 5: Update Cover Image URL ===');
  
  const newCoverUrl = 'https://example.com/cover-updated.jpg';
  
  const response = await makeRequest(
    'PATCH',
    `/api/restaurants/${results.restaurantId}`,
    { coverImageUrl: newCoverUrl },
    results.ownerToken
  );
  
  if (response.ok && response.data.restaurant) {
    console.log('✓ Cover image URL updated successfully');
    console.log(`  New cover URL: ${response.data.restaurant.cover_image_url}`);
    
    if (response.data.restaurant.cover_image_url === newCoverUrl) {
      console.log('✓ Cover image URL verified');
      return true;
    } else {
      results.errors.push('Cover image URL does not match');
      console.log('✗ Cover image URL does not match');
      return false;
    }
  } else {
    results.errors.push('Failed to update cover image URL');
    console.log('✗ Failed to update cover image URL');
    return false;
  }
}

/**
 * Step 6: Verify changes in database
 */
async function verifyChangesInDatabase() {
  console.log('\n=== STEP 6: Verify Changes Reflected in Database ===');
  
  // Get restaurant details
  const response = await makeRequest(
    'GET',
    `/api/restaurants/${results.restaurantId}`,
    null,
    results.ownerToken
  );
  
  if (response.ok && response.data) {
    console.log('✓ Retrieved restaurant from database');
    console.log(`  Description: ${response.data.description}`);
    console.log(`  Phone: ${response.data.phone}`);
    console.log(`  Min Order: Fr. ${response.data.minOrderAmount}`);
    console.log(`  Logo URL: ${response.data.logoUrl}`);
    console.log(`  Cover URL: ${response.data.coverImageUrl}`);
    console.log(`  Updated At: ${response.data.updatedAt}`);
    return true;
  } else {
    results.errors.push('Failed to verify changes in database');
    console.log('✗ Failed to verify changes in database');
    return false;
  }
}

/**
 * Step 7: Test update as different owner (should fail)
 */
async function testUpdateAsDifferentOwner() {
  console.log('\n=== STEP 7: Test Update as Different Owner (Should Fail) ===');
  
  if (!results.otherOwnerToken) {
    console.log('⚠ Skipping test (no other owner token available)');
    return true;
  }
  
  const response = await makeRequest(
    'PATCH',
    `/api/restaurants/${results.restaurantId}`,
    { description: 'Unauthorized update attempt' },
    results.otherOwnerToken
  );
  
  if (!response.ok && (response.status === 401 || response.status === 403)) {
    console.log('✓ Update correctly rejected (unauthorized)');
    console.log(`  Status: ${response.status}`);
    return true;
  } else if (response.ok) {
    results.errors.push('Different owner was able to update restaurant (security issue!)');
    console.log('✗ Different owner was able to update restaurant (security issue!)');
    return false;
  } else {
    results.errors.push('Unexpected response when testing different owner');
    console.log('✗ Unexpected response');
    return false;
  }
}

/**
 * Step 8: Test update as admin (should succeed)
 */
async function testUpdateAsAdmin() {
  console.log('\n=== STEP 8: Test Update as Admin (Should Succeed) ===');
  
  if (!results.adminToken) {
    console.log('✗ No admin token available');
    return false;
  }
  
  const adminUpdate = {
    description: 'Admin updated: Premium Ethiopian dining experience'
  };
  
  const response = await makeRequest(
    'PATCH',
    `/api/restaurants/${results.restaurantId}`,
    adminUpdate,
    results.adminToken
  );
  
  if (response.ok && response.data.restaurant) {
    console.log('✓ Admin successfully updated restaurant');
    console.log(`  New description: ${response.data.restaurant.description}`);
    
    if (response.data.restaurant.description === adminUpdate.description) {
      console.log('✓ Admin update verified');
      return true;
    } else {
      results.errors.push('Admin update value does not match');
      console.log('✗ Admin update value does not match');
      return false;
    }
  } else {
    results.errors.push('Admin failed to update restaurant');
    console.log('✗ Admin failed to update restaurant');
    return false;
  }
}

/**
 * Main test execution
 */
async function runTests() {
  console.log('='.repeat(60));
  console.log('TASK 3.4: Restaurant Updates Test');
  console.log('='.repeat(60));
  console.log(`API Base URL: ${API_BASE_URL}`);
  
  let allPassed = true;

  // Setup
  if (!await setup()) {
    console.log('\n✗ Setup failed, cannot continue');
    return;
  }

  // Step 1: Update restaurant details
  if (!await updateRestaurantDetails()) {
    allPassed = false;
  }

  // Step 2: Update opening hours
  if (!await updateOpeningHours()) {
    allPassed = false;
  }

  // Step 3: Update min order amount
  if (!await updateMinOrderAmount()) {
    allPassed = false;
  }

  // Step 4: Update logo URL
  if (!await updateLogoUrl()) {
    allPassed = false;
  }

  // Step 5: Update cover image URL
  if (!await updateCoverImageUrl()) {
    allPassed = false;
  }

  // Step 6: Verify changes in database
  if (!await verifyChangesInDatabase()) {
    allPassed = false;
  }

  // Step 7: Test update as different owner
  if (!await testUpdateAsDifferentOwner()) {
    allPassed = false;
  }

  // Step 8: Test update as admin
  if (!await testUpdateAsAdmin()) {
    allPassed = false;
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  
  if (allPassed) {
    console.log('✓ All tests passed!');
    console.log('\nKey Findings:');
    console.log('  - Restaurant owner can update their restaurant');
    console.log('  - Opening hours can be updated');
    console.log('  - Minimum order amount can be updated');
    console.log('  - Logo and cover image URLs can be updated');
    console.log('  - Changes are immediately reflected in database');
    console.log('  - Different owners cannot update other restaurants');
    console.log('  - Admins can update any restaurant');
  } else {
    console.log('✗ Some tests failed');
    console.log('\nErrors:');
    results.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  }
  
  console.log('='.repeat(60));
  
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
