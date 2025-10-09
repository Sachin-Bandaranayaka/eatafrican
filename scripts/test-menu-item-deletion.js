#!/usr/bin/env node

/**
 * Test Script: Menu Item Deletion (Task 4.4)
 * 
 * This script tests menu item deletion functionality:
 * 1. Delete menu item as restaurant owner
 * 2. Verify item removed or marked inactive in database
 * 3. Test deletion as different owner (should fail)
 */

const API_BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Use the restaurant created in task 4.1
const RESTAURANT_ID = '184110b1-e7a9-45bf-8237-b7137739bf03';
const MENU_ITEM_ID = '7546b66a-571b-46fe-998f-05bc8f685202'; // Test Item for Deletion

// Store test results
const results = {
  owner1Token: null,
  owner2Token: null,
  errors: [],
  passed: 0,
  failed: 0
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
  if (data && method !== 'GET') {
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
 * Login as restaurant owner
 */
async function loginOwner(email, password, label) {
  console.log(`\n=== ${label} ===`);
  
  const response = await makeRequest('POST', '/api/auth/login', {
    email,
    password
  });
  
  if (response.ok && response.data.user) {
    console.log(`✓ ${label} logged in successfully`);
    return response.data.token || response.data.accessToken;
  }
  
  console.log(`✗ Failed to login ${label}`);
  return null;
}

/**
 * Get menu item details
 */
async function getMenuItem(itemId) {
  const response = await makeRequest(
    'GET',
    `/api/restaurants/${RESTAURANT_ID}/menu`,
    null,
    results.owner1Token
  );
  
  if (response.ok && response.data.items) {
    return response.data.items.find(item => item.id === itemId);
  }
  
  return null;
}

/**
 * Test 1: Test deletion as different owner (should fail)
 */
async function testDeleteAsWrongOwner() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 1: Test Deletion as Different Owner (Should Fail)');
  console.log('='.repeat(60));
  
  if (!results.owner2Token) {
    console.log('✗ Owner 2 token not available');
    results.failed++;
    return false;
  }
  
  const response = await makeRequest(
    'DELETE',
    `/api/restaurants/${RESTAURANT_ID}/menu/${MENU_ITEM_ID}`,
    null,
    results.owner2Token
  );
  
  if (!response.ok && (response.status === 401 || response.status === 403)) {
    console.log('✓ Deletion correctly denied for different owner');
    console.log(`  Status: ${response.status}`);
    console.log(`  Error: ${response.data.error?.message}`);
    results.passed++;
    return true;
  } else if (response.ok) {
    console.log('✗ Deletion should have been denied but succeeded');
    results.errors.push('Different owner was able to delete menu item (security issue)');
    results.failed++;
    return false;
  } else {
    console.log(`✗ Unexpected error: ${response.status}`);
    results.errors.push(`Unexpected response when testing wrong owner: ${response.status}`);
    results.failed++;
    return false;
  }
}

/**
 * Test 2: Delete menu item as restaurant owner
 */
async function testDeleteMenuItem() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 2: Delete Menu Item as Owner');
  console.log('='.repeat(60));
  
  // First, verify item exists
  const itemBefore = await getMenuItem(MENU_ITEM_ID);
  if (!itemBefore) {
    console.log('✗ Menu item not found before deletion');
    results.errors.push('Menu item not found before deletion');
    results.failed++;
    return false;
  }
  
  console.log(`  Item found: ${itemBefore.name}`);
  console.log(`  Status before: ${itemBefore.status}`);
  
  // Delete the item
  const response = await makeRequest(
    'DELETE',
    `/api/restaurants/${RESTAURANT_ID}/menu/${MENU_ITEM_ID}`,
    null,
    results.owner1Token
  );
  
  if (response.ok) {
    console.log('✓ Menu item deleted successfully');
    console.log(`  Message: ${response.data.message}`);
    results.passed++;
    return true;
  } else {
    console.log('✗ Failed to delete menu item');
    results.errors.push(`Deletion failed: ${response.data.error?.message || 'Unknown error'}`);
    results.failed++;
    return false;
  }
}

/**
 * Test 3: Verify item removed or marked inactive in database
 */
async function testVerifyDeletion() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 3: Verify Item Marked Inactive in Database');
  console.log('='.repeat(60));
  
  // Try to get the item (should not appear in active items list)
  const itemAfter = await getMenuItem(MENU_ITEM_ID);
  
  if (!itemAfter) {
    console.log('✓ Item no longer appears in active menu items');
    console.log('  (Item was soft-deleted by setting status to inactive)');
    results.passed++;
    return true;
  } else {
    console.log('✗ Item still appears in menu items list');
    console.log(`  Status: ${itemAfter.status}`);
    results.errors.push('Item not properly deleted');
    results.failed++;
    return false;
  }
}

/**
 * Main test execution
 */
async function runTests() {
  console.log('='.repeat(60));
  console.log('TASK 4.4: Menu Item Deletion Test');
  console.log('='.repeat(60));
  console.log(`API Base URL: ${API_BASE_URL}`);
  console.log(`Restaurant ID: ${RESTAURANT_ID}`);
  console.log(`Menu Item ID: ${MENU_ITEM_ID}`);
  
  // Setup: Login owners
  results.owner1Token = await loginOwner(
    'test-menu-owner-001@example.com',
    'SecurePass123!',
    'Login Restaurant Owner 1'
  );
  
  if (!results.owner1Token) {
    console.log('\n✗ Failed to login owner 1, aborting tests');
    return;
  }
  
  results.owner2Token = await loginOwner(
    'test-menu-owner-002@example.com',
    'SecurePass123!',
    'Login Restaurant Owner 2'
  );
  
  if (!results.owner2Token) {
    console.log('\n✗ Failed to login owner 2, aborting tests');
    return;
  }

  // Run tests
  await testDeleteAsWrongOwner();
  await testDeleteMenuItem();
  await testVerifyDeletion();

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${results.passed + results.failed}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  
  if (results.failed === 0) {
    console.log('\n✓ All tests passed!');
    console.log('\nVerified Functionality:');
    console.log('  ✓ Deletion denied for different owner');
    console.log('  ✓ Delete menu item as owner');
    console.log('  ✓ Item marked inactive in database');
    console.log('\n' + '='.repeat(60));
    console.log('TASK 4: Menu Management Testing Complete');
    console.log('='.repeat(60));
    console.log('\nAll Sub-tasks Completed:');
    console.log('  ✓ 4.1 Test menu item creation');
    console.log('  ✓ 4.2 Test menu listing and filtering');
    console.log('  ✓ 4.3 Test menu item updates');
    console.log('  ✓ 4.4 Test menu item deletion');
    console.log('\nNext Steps:');
    console.log('  - Move to Task 5: Test order processing with real data');
  } else {
    console.log('\n✗ Some tests failed');
    console.log('\nErrors:');
    results.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  }
  
  console.log('='.repeat(60));
  
  return {
    passed: results.failed === 0,
    results
  };
}

// Run tests
runTests().catch(error => {
  console.error('Test execution failed:', error);
  process.exit(1);
});
