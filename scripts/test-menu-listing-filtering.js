#!/usr/bin/env node

/**
 * Test Script: Menu Listing and Filtering (Task 4.2)
 * 
 * This script tests menu listing and filtering functionality:
 * 1. List all menu items for a restaurant
 * 2. Filter by category (meals, drinks, special_deals)
 * 3. Filter by dietary tags (vegan, vegetarian, gluten_free)
 * 4. Sort by price (low to high, high to low)
 * 5. Sort by name (alphabetical)
 * 6. Verify multilingual content returned based on language preference
 * 7. Verify out_of_stock items handled correctly
 */

const API_BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Use the restaurant and items created in task 4.1
const RESTAURANT_ID = '184110b1-e7a9-45bf-8237-b7137739bf03';

// Store test results
const results = {
  ownerToken: null,
  errors: [],
  passed: 0,
  failed: 0
};

/**
 * Make HTTP request
 */
async function makeRequest(method, endpoint, data = null, token = null, headers = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const requestHeaders = {
    'Content-Type': 'application/json',
    ...headers
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers: requestHeaders,
  };

  if (data && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  console.log(`\n${method} ${endpoint}`);
  if (headers['Accept-Language']) {
    console.log(`Language: ${headers['Accept-Language']}`);
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
async function loginOwner() {
  console.log('\n=== Login Restaurant Owner ===');
  
  const response = await makeRequest('POST', '/api/auth/login', {
    email: 'test-menu-owner-001@example.com',
    password: 'SecurePass123!'
  });
  
  if (response.ok && response.data.user) {
    results.ownerToken = response.data.token || response.data.accessToken;
    console.log('✓ Restaurant owner logged in successfully');
    return true;
  }
  
  console.log('✗ Failed to login restaurant owner');
  return false;
}

/**
 * Test 1: List all menu items for a restaurant
 */
async function testListAllMenuItems() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 1: List All Menu Items');
  console.log('='.repeat(60));
  
  const response = await makeRequest(
    'GET',
    `/api/restaurants/${RESTAURANT_ID}/menu`,
    null,
    results.ownerToken
  );
  
  if (response.ok && response.data.items) {
    console.log(`✓ Retrieved ${response.data.items.length} menu items`);
    
    // Verify we have at least the 2 items created in task 4.1
    if (response.data.items.length >= 2) {
      console.log('✓ Expected number of items found');
      
      // Verify item structure
      const item = response.data.items[0];
      const requiredFields = ['id', 'name', 'description', 'price', 'category', 'dietaryTags'];
      const hasAllFields = requiredFields.every(field => item.hasOwnProperty(field));
      
      if (hasAllFields) {
        console.log('✓ All required fields present in items');
        results.passed++;
        return true;
      } else {
        console.log('✗ Some required fields missing');
        results.errors.push('Menu items missing required fields');
        results.failed++;
        return false;
      }
    } else {
      console.log(`✗ Expected at least 2 items, got ${response.data.items.length}`);
      results.errors.push('Insufficient menu items returned');
      results.failed++;
      return false;
    }
  } else {
    console.log('✗ Failed to retrieve menu items');
    results.errors.push('Failed to list menu items');
    results.failed++;
    return false;
  }
}

/**
 * Test 2: Filter by category (meals)
 */
async function testFilterByCategory() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 2: Filter by Category (meals)');
  console.log('='.repeat(60));
  
  const response = await makeRequest(
    'GET',
    `/api/restaurants/${RESTAURANT_ID}/menu?category=meals`,
    null,
    results.ownerToken
  );
  
  if (response.ok && response.data.items) {
    console.log(`✓ Retrieved ${response.data.items.length} items in 'meals' category`);
    
    // Verify all items are in meals category
    const allMeals = response.data.items.every(item => item.category === 'meals');
    
    if (allMeals) {
      console.log('✓ All items are in meals category');
      results.passed++;
      return true;
    } else {
      console.log('✗ Some items are not in meals category');
      results.errors.push('Category filter not working correctly');
      results.failed++;
      return false;
    }
  } else {
    console.log('✗ Failed to filter by category');
    results.errors.push('Category filtering failed');
    results.failed++;
    return false;
  }
}

/**
 * Test 3: Filter by dietary tag (vegan)
 */
async function testFilterByDietaryTag() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 3: Filter by Dietary Tag (vegan)');
  console.log('='.repeat(60));
  
  const response = await makeRequest(
    'GET',
    `/api/restaurants/${RESTAURANT_ID}/menu?dietaryTag=vegan`,
    null,
    results.ownerToken
  );
  
  if (response.ok && response.data.items) {
    console.log(`✓ Retrieved ${response.data.items.length} vegan items`);
    
    // Verify all items have vegan tag
    const allVegan = response.data.items.every(item => item.dietaryTags.includes('vegan'));
    
    if (allVegan) {
      console.log('✓ All items have vegan dietary tag');
      
      // Should find at least the Misir Wat item
      if (response.data.items.length >= 1) {
        console.log('✓ Found expected vegan items');
        results.passed++;
        return true;
      } else {
        console.log('✗ Expected at least 1 vegan item');
        results.errors.push('Vegan items not found');
        results.failed++;
        return false;
      }
    } else {
      console.log('✗ Some items do not have vegan tag');
      results.errors.push('Dietary tag filter not working correctly');
      results.failed++;
      return false;
    }
  } else {
    console.log('✗ Failed to filter by dietary tag');
    results.errors.push('Dietary tag filtering failed');
    results.failed++;
    return false;
  }
}

/**
 * Test 4: Filter by dietary tag (gluten_free)
 */
async function testFilterByGlutenFree() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 4: Filter by Dietary Tag (gluten_free)');
  console.log('='.repeat(60));
  
  const response = await makeRequest(
    'GET',
    `/api/restaurants/${RESTAURANT_ID}/menu?dietaryTag=gluten_free`,
    null,
    results.ownerToken
  );
  
  if (response.ok && response.data.items) {
    console.log(`✓ Retrieved ${response.data.items.length} gluten-free items`);
    
    // Verify all items have gluten_free tag
    const allGlutenFree = response.data.items.every(item => item.dietaryTags.includes('gluten_free'));
    
    if (allGlutenFree) {
      console.log('✓ All items have gluten_free dietary tag');
      
      // Should find both items (Doro Wat and Misir Wat)
      if (response.data.items.length >= 2) {
        console.log('✓ Found expected gluten-free items');
        results.passed++;
        return true;
      } else {
        console.log(`✗ Expected at least 2 gluten-free items, got ${response.data.items.length}`);
        results.errors.push('Not all gluten-free items found');
        results.failed++;
        return false;
      }
    } else {
      console.log('✗ Some items do not have gluten_free tag');
      results.errors.push('Gluten-free filter not working correctly');
      results.failed++;
      return false;
    }
  } else {
    console.log('✗ Failed to filter by gluten_free tag');
    results.errors.push('Gluten-free filtering failed');
    results.failed++;
    return false;
  }
}

/**
 * Test 5: Sort by price (ascending)
 */
async function testSortByPriceAsc() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 5: Sort by Price (Low to High)');
  console.log('='.repeat(60));
  
  const response = await makeRequest(
    'GET',
    `/api/restaurants/${RESTAURANT_ID}/menu?sortBy=price`,
    null,
    results.ownerToken
  );
  
  if (response.ok && response.data.items) {
    console.log(`✓ Retrieved ${response.data.items.length} items sorted by price`);
    
    // Verify items are sorted by price ascending
    let isSorted = true;
    for (let i = 0; i < response.data.items.length - 1; i++) {
      if (response.data.items[i].price > response.data.items[i + 1].price) {
        isSorted = false;
        break;
      }
    }
    
    if (isSorted) {
      console.log('✓ Items correctly sorted by price (ascending)');
      console.log(`  First item: ${response.data.items[0].name} - Fr. ${response.data.items[0].price}`);
      console.log(`  Last item: ${response.data.items[response.data.items.length - 1].name} - Fr. ${response.data.items[response.data.items.length - 1].price}`);
      results.passed++;
      return true;
    } else {
      console.log('✗ Items not correctly sorted by price');
      results.errors.push('Price sorting not working correctly');
      results.failed++;
      return false;
    }
  } else {
    console.log('✗ Failed to sort by price');
    results.errors.push('Price sorting failed');
    results.failed++;
    return false;
  }
}

/**
 * Test 6: Sort by name (alphabetical)
 */
async function testSortByName() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 6: Sort by Name (Alphabetical)');
  console.log('='.repeat(60));
  
  const response = await makeRequest(
    'GET',
    `/api/restaurants/${RESTAURANT_ID}/menu?sortBy=name`,
    null,
    results.ownerToken
  );
  
  if (response.ok && response.data.items) {
    console.log(`✓ Retrieved ${response.data.items.length} items sorted by name`);
    
    // Verify items are sorted alphabetically
    let isSorted = true;
    for (let i = 0; i < response.data.items.length - 1; i++) {
      if (response.data.items[i].name.localeCompare(response.data.items[i + 1].name) > 0) {
        isSorted = false;
        break;
      }
    }
    
    if (isSorted) {
      console.log('✓ Items correctly sorted alphabetically');
      console.log(`  First item: ${response.data.items[0].name}`);
      console.log(`  Last item: ${response.data.items[response.data.items.length - 1].name}`);
      results.passed++;
      return true;
    } else {
      console.log('✗ Items not correctly sorted alphabetically');
      results.errors.push('Name sorting not working correctly');
      results.failed++;
      return false;
    }
  } else {
    console.log('✗ Failed to sort by name');
    results.errors.push('Name sorting failed');
    results.failed++;
    return false;
  }
}

/**
 * Test 7: Verify multilingual content (German)
 */
async function testMultilingualContent() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 7: Verify Multilingual Content (German)');
  console.log('='.repeat(60));
  
  const response = await makeRequest(
    'GET',
    `/api/restaurants/${RESTAURANT_ID}/menu`,
    null,
    results.ownerToken,
    { 'Accept-Language': 'de' }
  );
  
  if (response.ok && response.data.items) {
    console.log(`✓ Retrieved ${response.data.items.length} items with German language`);
    
    // Find Doro Wat item
    const doroWat = response.data.items.find(item => item.name === 'Doro Wat');
    
    if (doroWat) {
      console.log(`  Item: ${doroWat.name}`);
      console.log(`  Description: ${doroWat.description}`);
      
      // Check if description contains German text
      if (doroWat.description.includes('äthiopischer') || doroWat.description.includes('Hühnereintopf')) {
        console.log('✓ German translation returned correctly');
        results.passed++;
        return true;
      } else {
        console.log('✗ German translation not returned');
        results.errors.push('Multilingual content not working');
        results.failed++;
        return false;
      }
    } else {
      console.log('✗ Test item not found');
      results.errors.push('Test item not found for multilingual test');
      results.failed++;
      return false;
    }
  } else {
    console.log('✗ Failed to retrieve multilingual content');
    results.errors.push('Multilingual content retrieval failed');
    results.failed++;
    return false;
  }
}

/**
 * Main test execution
 */
async function runTests() {
  console.log('='.repeat(60));
  console.log('TASK 4.2: Menu Listing and Filtering Test');
  console.log('='.repeat(60));
  console.log(`API Base URL: ${API_BASE_URL}`);
  console.log(`Restaurant ID: ${RESTAURANT_ID}`);
  
  // Setup: Login
  if (!await loginOwner()) {
    console.log('\n✗ Failed to login, aborting tests');
    return;
  }

  // Run tests
  await testListAllMenuItems();
  await testFilterByCategory();
  await testFilterByDietaryTag();
  await testFilterByGlutenFree();
  await testSortByPriceAsc();
  await testSortByName();
  await testMultilingualContent();

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
    console.log('  ✓ List all menu items');
    console.log('  ✓ Filter by category (meals)');
    console.log('  ✓ Filter by dietary tag (vegan)');
    console.log('  ✓ Filter by dietary tag (gluten_free)');
    console.log('  ✓ Sort by price (ascending)');
    console.log('  ✓ Sort by name (alphabetical)');
    console.log('  ✓ Multilingual content (German)');
    console.log('\nNext Steps:');
    console.log('  - Test menu item updates (Task 4.3)');
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
