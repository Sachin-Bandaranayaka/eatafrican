#!/usr/bin/env node

/**
 * Test Script: Menu Item Updates (Task 4.3)
 * 
 * This script tests menu item update functionality:
 * 1. Update menu item price
 * 2. Update menu item availability (quantity)
 * 3. Mark item as out_of_stock
 * 4. Update item description and translations
 * 5. Replace item image
 * 6. Verify changes reflected immediately
 * 7. Test update as different owner (should fail)
 */

const API_BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Use the restaurant and items created in task 4.1
const RESTAURANT_ID = '184110b1-e7a9-45bf-8237-b7137739bf03';
const MENU_ITEM_ID = '04c176c1-00d3-4837-af3a-dacb85848a4e'; // Doro Wat

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
 * Test 1: Update menu item price
 */
async function testUpdatePrice() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 1: Update Menu Item Price');
  console.log('='.repeat(60));
  
  const newPrice = 32.00;
  
  const response = await makeRequest(
    'PATCH',
    `/api/restaurants/${RESTAURANT_ID}/menu/${MENU_ITEM_ID}`,
    { price: newPrice },
    results.owner1Token
  );
  
  if (response.ok && response.data.item) {
    console.log(`✓ Menu item price updated successfully`);
    console.log(`  New Price: Fr. ${response.data.item.price.toFixed(2)}`);
    
    if (response.data.item.price === newPrice) {
      console.log('✓ Price updated correctly');
      
      // Verify change reflected immediately
      const item = await getMenuItem(MENU_ITEM_ID);
      if (item && item.price === newPrice) {
        console.log('✓ Change reflected immediately in database');
        results.passed++;
        return true;
      } else {
        console.log('✗ Change not reflected in database');
        results.errors.push('Price update not reflected in database');
        results.failed++;
        return false;
      }
    } else {
      console.log(`✗ Price mismatch: expected ${newPrice}, got ${response.data.item.price}`);
      results.errors.push('Price not updated correctly');
      results.failed++;
      return false;
    }
  } else {
    console.log('✗ Failed to update menu item price');
    results.errors.push('Price update failed');
    results.failed++;
    return false;
  }
}

/**
 * Test 2: Update menu item quantity
 */
async function testUpdateQuantity() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 2: Update Menu Item Quantity');
  console.log('='.repeat(60));
  
  const newQuantity = 25;
  
  const response = await makeRequest(
    'PATCH',
    `/api/restaurants/${RESTAURANT_ID}/menu/${MENU_ITEM_ID}`,
    { quantity: newQuantity },
    results.owner1Token
  );
  
  if (response.ok && response.data.item) {
    console.log(`✓ Menu item quantity updated successfully`);
    console.log(`  New Quantity: ${response.data.item.quantity}`);
    
    if (response.data.item.quantity === newQuantity) {
      console.log('✓ Quantity updated correctly');
      results.passed++;
      return true;
    } else {
      console.log(`✗ Quantity mismatch: expected ${newQuantity}, got ${response.data.item.quantity}`);
      results.errors.push('Quantity not updated correctly');
      results.failed++;
      return false;
    }
  } else {
    console.log('✗ Failed to update menu item quantity');
    results.errors.push('Quantity update failed');
    results.failed++;
    return false;
  }
}

/**
 * Test 3: Mark item as out_of_stock
 */
async function testMarkOutOfStock() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 3: Mark Item as Out of Stock');
  console.log('='.repeat(60));
  
  // First, set quantity to 0
  const response = await makeRequest(
    'PATCH',
    `/api/restaurants/${RESTAURANT_ID}/menu/${MENU_ITEM_ID}`,
    { quantity: 0 },
    results.owner1Token
  );
  
  if (response.ok && response.data.item) {
    console.log(`✓ Menu item quantity set to 0`);
    console.log(`  Quantity: ${response.data.item.quantity}`);
    console.log(`  Status: ${response.data.item.status}`);
    
    if (response.data.item.quantity === 0) {
      console.log('✓ Item marked as out of stock (quantity = 0)');
      results.passed++;
      return true;
    } else {
      console.log('✗ Quantity not set to 0');
      results.errors.push('Out of stock marking failed');
      results.failed++;
      return false;
    }
  } else {
    console.log('✗ Failed to mark item as out of stock');
    results.errors.push('Out of stock marking failed');
    results.failed++;
    return false;
  }
}

/**
 * Test 4: Update item description and translations
 */
async function testUpdateDescriptionAndTranslations() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 4: Update Description and Translations');
  console.log('='.repeat(60));
  
  const newDescription = 'Updated: Traditional Ethiopian chicken stew with berbere spices';
  const newTranslations = {
    de: {
      name: 'Doro Wat',
      description: 'Aktualisiert: Traditioneller äthiopischer Hühnereintopf'
    },
    fr: {
      name: 'Doro Wat',
      description: 'Mis à jour: Ragoût de poulet éthiopien traditionnel'
    }
  };
  
  const response = await makeRequest(
    'PATCH',
    `/api/restaurants/${RESTAURANT_ID}/menu/${MENU_ITEM_ID}`,
    { 
      description: newDescription,
      translations: newTranslations
    },
    results.owner1Token
  );
  
  if (response.ok && response.data.item) {
    console.log(`✓ Menu item description and translations updated`);
    console.log(`  New Description: ${response.data.item.description}`);
    
    if (response.data.item.description === newDescription) {
      console.log('✓ Description updated correctly');
      
      if (response.data.item.translations && response.data.item.translations.de) {
        console.log('✓ Translations updated correctly');
        console.log(`  German: ${response.data.item.translations.de.description}`);
        results.passed++;
        return true;
      } else {
        console.log('✗ Translations not updated');
        results.errors.push('Translations not updated');
        results.failed++;
        return false;
      }
    } else {
      console.log('✗ Description not updated correctly');
      results.errors.push('Description not updated correctly');
      results.failed++;
      return false;
    }
  } else {
    console.log('✗ Failed to update description and translations');
    results.errors.push('Description/translations update failed');
    results.failed++;
    return false;
  }
}

/**
 * Test 5: Replace item image
 */
async function testReplaceImage() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 5: Replace Item Image');
  console.log('='.repeat(60));
  
  const newImageUrl = 'https://example.com/images/doro-wat-updated.jpg';
  
  const response = await makeRequest(
    'PATCH',
    `/api/restaurants/${RESTAURANT_ID}/menu/${MENU_ITEM_ID}`,
    { imageUrl: newImageUrl },
    results.owner1Token
  );
  
  if (response.ok && response.data.item) {
    console.log(`✓ Menu item image updated successfully`);
    console.log(`  New Image URL: ${response.data.item.imageUrl}`);
    
    if (response.data.item.imageUrl === newImageUrl) {
      console.log('✓ Image URL updated correctly');
      results.passed++;
      return true;
    } else {
      console.log(`✗ Image URL mismatch`);
      results.errors.push('Image URL not updated correctly');
      results.failed++;
      return false;
    }
  } else {
    console.log('✗ Failed to update menu item image');
    results.errors.push('Image update failed');
    results.failed++;
    return false;
  }
}

/**
 * Test 6: Verify changes reflected immediately
 */
async function testVerifyChanges() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 6: Verify All Changes Reflected');
  console.log('='.repeat(60));
  
  const item = await getMenuItem(MENU_ITEM_ID);
  
  if (item) {
    console.log('✓ Menu item retrieved from database');
    console.log(`  Price: Fr. ${item.price.toFixed(2)}`);
    console.log(`  Quantity: ${item.quantity}`);
    console.log(`  Description: ${item.description.substring(0, 50)}...`);
    console.log(`  Image URL: ${item.imageUrl}`);
    
    // Verify all updates are present
    const allUpdatesPresent = 
      item.price === 32.00 &&
      item.quantity === 0 &&
      item.description.startsWith('Updated:') &&
      item.imageUrl.includes('updated');
    
    if (allUpdatesPresent) {
      console.log('✓ All changes reflected correctly in database');
      results.passed++;
      return true;
    } else {
      console.log('✗ Some changes not reflected correctly');
      results.errors.push('Not all changes reflected in database');
      results.failed++;
      return false;
    }
  } else {
    console.log('✗ Failed to retrieve menu item');
    results.errors.push('Failed to verify changes');
    results.failed++;
    return false;
  }
}

/**
 * Test 7: Test update as different owner (should fail)
 */
async function testUpdateAsWrongOwner() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 7: Test Update as Different Owner (Should Fail)');
  console.log('='.repeat(60));
  
  if (!results.owner2Token) {
    console.log('✗ Owner 2 token not available');
    results.failed++;
    return false;
  }
  
  const response = await makeRequest(
    'PATCH',
    `/api/restaurants/${RESTAURANT_ID}/menu/${MENU_ITEM_ID}`,
    { price: 99.99 },
    results.owner2Token
  );
  
  if (!response.ok && (response.status === 401 || response.status === 403)) {
    console.log('✓ Update correctly denied for different owner');
    console.log(`  Status: ${response.status}`);
    console.log(`  Error: ${response.data.error?.message}`);
    results.passed++;
    return true;
  } else if (response.ok) {
    console.log('✗ Update should have been denied but succeeded');
    results.errors.push('Different owner was able to update menu item (security issue)');
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
 * Main test execution
 */
async function runTests() {
  console.log('='.repeat(60));
  console.log('TASK 4.3: Menu Item Updates Test');
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
  await testUpdatePrice();
  await testUpdateQuantity();
  await testMarkOutOfStock();
  await testUpdateDescriptionAndTranslations();
  await testReplaceImage();
  await testVerifyChanges();
  await testUpdateAsWrongOwner();

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
    console.log('  ✓ Update menu item price');
    console.log('  ✓ Update menu item quantity');
    console.log('  ✓ Mark item as out of stock');
    console.log('  ✓ Update description and translations');
    console.log('  ✓ Replace item image');
    console.log('  ✓ Changes reflected immediately');
    console.log('  ✓ Update denied for different owner');
    console.log('\nNext Steps:');
    console.log('  - Test menu item deletion (Task 4.4)');
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
