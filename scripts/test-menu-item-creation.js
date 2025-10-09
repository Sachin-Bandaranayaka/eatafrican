#!/usr/bin/env node

/**
 * Test Script: Menu Item Creation (Task 4.1)
 * 
 * This script tests menu item creation with complete data:
 * 1. Register/login restaurant owner
 * 2. Create restaurant (or use existing)
 * 3. Create menu item with dietary tags
 * 4. Add multilingual descriptions (EN, DE, FR, IT)
 * 5. Upload menu item image (simulated)
 * 6. Verify menu item created in database
 * 7. Test creation as different owner (should fail)
 */

const API_BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Test data
const testData = {
  restaurantOwner1: {
    email: 'test-menu-owner-001@example.com',
    password: 'SecurePass123!',
    firstName: 'Menu',
    lastName: 'Owner One',
    role: 'restaurant_owner',
    phone: '+41791234567'
  },
  restaurantOwner2: {
    email: 'test-menu-owner-002@example.com',
    password: 'SecurePass123!',
    firstName: 'Menu',
    lastName: 'Owner Two',
    role: 'restaurant_owner',
    phone: '+41791234568'
  },
  restaurant1: {
    name: 'Test Menu Restaurant 1',
    description: 'Test restaurant for menu item creation',
    cuisineTypes: ['Ethiopian'],
    address: 'Teststrasse 1',
    city: 'Zürich',
    postalCode: '8001',
    region: 'Zürich',
    phone: '+41442345678',
    email: 'menu1@test.ch',
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
  },
  menuItem: {
    name: 'Doro Wat',
    description: 'Traditional Ethiopian chicken stew with berbere spices, served with injera',
    price: 28.50,
    category: 'meals',
    mealCategory: 'Main Course',
    cuisineType: 'Ethiopian',
    dietaryTags: ['gluten_free'],
    imageUrl: 'https://example.com/images/doro-wat.jpg',
    quantity: 50,
    translations: {
      de: {
        name: 'Doro Wat',
        description: 'Traditioneller äthiopischer Hühnereintopf mit Berbere-Gewürzen, serviert mit Injera'
      },
      fr: {
        name: 'Doro Wat',
        description: 'Ragoût de poulet éthiopien traditionnel aux épices berbère, servi avec injera'
      },
      it: {
        name: 'Doro Wat',
        description: 'Stufato di pollo etiope tradizionale con spezie berbere, servito con injera'
      }
    }
  },
  veganMenuItem: {
    name: 'Misir Wat',
    description: 'Spicy red lentil stew with Ethiopian spices',
    price: 22.00,
    category: 'meals',
    mealCategory: 'Main Course',
    cuisineType: 'Ethiopian',
    dietaryTags: ['vegan', 'vegetarian', 'gluten_free'],
    imageUrl: 'https://example.com/images/misir-wat.jpg',
    quantity: 100,
    translations: {
      de: {
        name: 'Misir Wat',
        description: 'Würziger roter Linseneintopf mit äthiopischen Gewürzen'
      },
      fr: {
        name: 'Misir Wat',
        description: 'Ragoût de lentilles rouges épicé aux épices éthiopiennes'
      },
      it: {
        name: 'Misir Wat',
        description: 'Stufato di lenticchie rosse piccante con spezie etiopi'
      }
    }
  }
};

// Store test results
const results = {
  owner1Id: null,
  owner1Token: null,
  owner2Id: null,
  owner2Token: null,
  restaurant1Id: null,
  menuItem1Id: null,
  menuItem2Id: null,
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
 * Register or login user
 */
async function registerOrLogin(userData, label) {
  console.log(`\n=== ${label} ===`);
  
  let response = await makeRequest('POST', '/api/auth/register', userData);
  
  if (response.ok && response.data.user) {
    console.log(`✓ ${label} registered successfully`);
    return {
      userId: response.data.user.id,
      token: response.data.token || response.data.accessToken
    };
  } else if (response.status === 400 && response.data.error?.message?.includes('already been registered')) {
    console.log(`  User exists, trying to login...`);
    response = await makeRequest('POST', '/api/auth/login', {
      email: userData.email,
      password: userData.password
    });
    
    if (response.ok && response.data.user) {
      console.log(`✓ ${label} logged in successfully`);
      return {
        userId: response.data.user.id,
        token: response.data.token || response.data.accessToken
      };
    }
  }
  
  console.log(`✗ Failed to register or login ${label}`);
  return null;
}

/**
 * Create restaurant or get existing
 */
async function createRestaurant(restaurantData, token, label) {
  console.log(`\n=== Create ${label} ===`);
  
  const response = await makeRequest('POST', '/api/restaurants', restaurantData, token);
  
  if (response.ok && response.data.restaurant) {
    console.log(`✓ ${label} created successfully`);
    console.log(`  Restaurant ID: ${response.data.restaurant.id}`);
    return response.data.restaurant.id;
  } else if (response.status === 409 || response.status === 500) {
    console.log(`  ${label} may already exist, trying to get it...`);
    // Try to get restaurant ID from list
    const listResponse = await makeRequest('GET', '/api/restaurants', null, token);
    if (listResponse.ok && listResponse.data.restaurants?.length > 0) {
      const restaurant = listResponse.data.restaurants.find(r => r.name === restaurantData.name);
      if (restaurant) {
        console.log(`✓ Using existing ${label}`);
        console.log(`  Restaurant ID: ${restaurant.id}`);
        return restaurant.id;
      }
    }
  }
  
  console.log(`✗ Failed to create or get ${label}`);
  return null;
}

/**
 * Test 1: Create menu item with complete data
 */
async function testCreateMenuItem() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 1: Create Menu Item with Complete Data');
  console.log('='.repeat(60));
  
  if (!results.owner1Token || !results.restaurant1Id) {
    console.log('✗ Prerequisites not met');
    results.failed++;
    return false;
  }

  const response = await makeRequest(
    'POST',
    `/api/restaurants/${results.restaurant1Id}/menu`,
    testData.menuItem,
    results.owner1Token
  );
  
  if (response.ok && response.data.item) {
    results.menuItem1Id = response.data.item.id;
    console.log('✓ Menu item created successfully');
    console.log(`  Item ID: ${results.menuItem1Id}`);
    console.log(`  Name: ${response.data.item.name}`);
    console.log(`  Price: Fr. ${response.data.item.price.toFixed(2)}`);
    console.log(`  Category: ${response.data.item.category}`);
    console.log(`  Dietary Tags: ${response.data.item.dietaryTags.join(', ')}`);
    
    // Verify all fields
    let allFieldsCorrect = true;
  } else if (response.status === 500) {
    // Item might already exist, try to get it
    console.log('  Item may already exist, trying to get it...');
    const getResponse = await makeRequest(
      'GET',
      `/api/restaurants/${results.restaurant1Id}/menu`,
      null,
      results.owner1Token
    );
    
    if (getResponse.ok && getResponse.data.items) {
      const existingItem = getResponse.data.items.find(item => item.name === testData.menuItem.name);
      if (existingItem) {
        results.menuItem1Id = existingItem.id;
        console.log('✓ Using existing menu item');
        console.log(`  Item ID: ${results.menuItem1Id}`);
        console.log(`  Name: ${existingItem.name}`);
        console.log(`  Price: Fr. ${existingItem.price.toFixed(2)}`);
        console.log(`  Category: ${existingItem.category}`);
        console.log(`  Dietary Tags: ${existingItem.dietaryTags.join(', ')}`);
        
        // Verify all fields
        let allFieldsCorrect = true;
        
        if (existingItem.name !== testData.menuItem.name) {
          console.log(`✗ Name mismatch: expected "${testData.menuItem.name}", got "${existingItem.name}"`);
          allFieldsCorrect = false;
        }
        
        if (existingItem.price !== testData.menuItem.price) {
          console.log(`✗ Price mismatch: expected ${testData.menuItem.price}, got ${existingItem.price}`);
          allFieldsCorrect = false;
        }
        
        if (existingItem.category !== testData.menuItem.category) {
          console.log(`✗ Category mismatch: expected "${testData.menuItem.category}", got "${existingItem.category}"`);
          allFieldsCorrect = false;
        }
        
        if (!existingItem.dietaryTags.includes('gluten_free')) {
          console.log(`✗ Dietary tag 'gluten_free' not found`);
          allFieldsCorrect = false;
        }
        
        if (allFieldsCorrect) {
          console.log('✓ All fields verified correctly');
          results.passed++;
          return true;
        } else {
          results.errors.push('Menu item exists but some fields are incorrect');
          results.failed++;
          return false;
        }
      }
    }
    console.log('✗ Failed to create or get menu item');
    results.errors.push(`Menu item creation failed: ${response.data.error?.message || 'Unknown error'}`);
    results.failed++;
    return false;
  }
  
  // Verify fields for newly created item
  if (response.data.item.name !== testData.menuItem.name) {
    console.log(`✗ Name mismatch: expected "${testData.menuItem.name}", got "${response.data.item.name}"`);
    allFieldsCorrect = false;
  }
  
  if (response.data.item.price !== testData.menuItem.price) {
    console.log(`✗ Price mismatch: expected ${testData.menuItem.price}, got ${response.data.item.price}`);
    allFieldsCorrect = false;
  }
  
  if (response.data.item.category !== testData.menuItem.category) {
    console.log(`✗ Category mismatch: expected "${testData.menuItem.category}", got "${response.data.item.category}"`);
    allFieldsCorrect = false;
  }
  
  if (!response.data.item.dietaryTags.includes('gluten_free')) {
    console.log(`✗ Dietary tag 'gluten_free' not found`);
    allFieldsCorrect = false;
  }
  
  if (!response.data.item.translations) {
    console.log(`✗ Translations not saved`);
    allFieldsCorrect = false;
  } else {
    console.log(`✓ Translations saved for languages: ${Object.keys(response.data.item.translations).join(', ')}`);
  }
  
  if (allFieldsCorrect) {
    console.log('✓ All fields verified correctly');
    results.passed++;
    return true;
  } else {
    results.errors.push('Menu item created but some fields are incorrect');
    results.failed++;
    return false;
  }
}

/**
 * Test 2: Create menu item with multiple dietary tags
 */
async function testCreateVeganMenuItem() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 2: Create Menu Item with Multiple Dietary Tags');
  console.log('='.repeat(60));
  
  if (!results.owner1Token || !results.restaurant1Id) {
    console.log('✗ Prerequisites not met');
    results.failed++;
    return false;
  }

  const response = await makeRequest(
    'POST',
    `/api/restaurants/${results.restaurant1Id}/menu`,
    testData.veganMenuItem,
    results.owner1Token
  );
  
  let item = null;
  
  if (response.ok && response.data.item) {
    item = response.data.item;
    results.menuItem2Id = item.id;
    console.log('✓ Vegan menu item created successfully');
  } else if (response.status === 500) {
    // Item might already exist, try to get it
    console.log('  Item may already exist, trying to get it...');
    const getResponse = await makeRequest(
      'GET',
      `/api/restaurants/${results.restaurant1Id}/menu`,
      null,
      results.owner1Token
    );
    
    if (getResponse.ok && getResponse.data.items) {
      const existingItem = getResponse.data.items.find(i => i.name === testData.veganMenuItem.name);
      if (existingItem) {
        item = existingItem;
        results.menuItem2Id = item.id;
        console.log('✓ Using existing vegan menu item');
      }
    }
  }
  
  if (item) {
    console.log(`  Item ID: ${results.menuItem2Id}`);
    console.log(`  Dietary Tags: ${item.dietaryTags.join(', ')}`);
    
    // Verify all dietary tags
    const expectedTags = ['vegan', 'vegetarian', 'gluten_free'];
    const allTagsPresent = expectedTags.every(tag => item.dietaryTags.includes(tag));
    
    if (allTagsPresent) {
      console.log('✓ All dietary tags verified');
      results.passed++;
      return true;
    } else {
      console.log('✗ Some dietary tags missing');
      results.errors.push('Not all dietary tags were saved');
      results.failed++;
      return false;
    }
  } else {
    console.log('✗ Failed to create or get vegan menu item');
    results.errors.push(`Vegan menu item creation failed: ${response.data.error?.message || 'Unknown error'}`);
    results.failed++;
    return false;
  }
}

/**
 * Test 3: Verify menu item in database
 */
async function testVerifyMenuItemInDatabase() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 3: Verify Menu Item in Database');
  console.log('='.repeat(60));
  
  if (!results.owner1Token || !results.restaurant1Id || !results.menuItem1Id) {
    console.log('✗ Prerequisites not met');
    results.failed++;
    return false;
  }

  // Get menu items for the restaurant
  const response = await makeRequest(
    'GET',
    `/api/restaurants/${results.restaurant1Id}/menu`,
    null,
    results.owner1Token
  );
  
  if (response.ok && response.data.items) {
    console.log(`✓ Retrieved ${response.data.items.length} menu items from database`);
    
    // Find our created item
    const createdItem = response.data.items.find(item => item.id === results.menuItem1Id);
    
    if (createdItem) {
      console.log('✓ Menu item found in database');
      console.log(`  Name: ${createdItem.name}`);
      console.log(`  Price: Fr. ${createdItem.price.toFixed(2)}`);
      console.log(`  Status: ${createdItem.status}`);
      results.passed++;
      return true;
    } else {
      console.log('✗ Menu item not found in database');
      results.errors.push('Created menu item not found in database query');
      results.failed++;
      return false;
    }
  } else {
    console.log('✗ Failed to retrieve menu items from database');
    results.errors.push('Failed to query menu items');
    results.failed++;
    return false;
  }
}

/**
 * Test 4: Test creation as different owner (should fail)
 */
async function testCreateAsWrongOwner() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 4: Test Creation as Different Owner (Should Fail)');
  console.log('='.repeat(60));
  
  if (!results.owner2Token || !results.restaurant1Id) {
    console.log('✗ Prerequisites not met');
    results.failed++;
    return false;
  }

  const response = await makeRequest(
    'POST',
    `/api/restaurants/${results.restaurant1Id}/menu`,
    {
      name: 'Unauthorized Item',
      description: 'This should not be created',
      price: 10.00,
      category: 'meals'
    },
    results.owner2Token
  );
  
  if (!response.ok && (response.status === 401 || response.status === 403)) {
    console.log('✓ Creation correctly denied for different owner');
    console.log(`  Status: ${response.status}`);
    console.log(`  Error: ${response.data.error?.message}`);
    results.passed++;
    return true;
  } else if (response.ok) {
    console.log('✗ Creation should have been denied but succeeded');
    results.errors.push('Different owner was able to create menu item (security issue)');
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
  console.log('TASK 4.1: Menu Item Creation Test');
  console.log('='.repeat(60));
  console.log(`API Base URL: ${API_BASE_URL}`);
  
  // Setup: Register/login owners
  const owner1 = await registerOrLogin(testData.restaurantOwner1, 'Register Restaurant Owner 1');
  if (owner1) {
    results.owner1Id = owner1.userId;
    results.owner1Token = owner1.token;
  } else {
    console.log('\n✗ Failed to setup owner 1, aborting tests');
    return;
  }

  const owner2 = await registerOrLogin(testData.restaurantOwner2, 'Register Restaurant Owner 2');
  if (owner2) {
    results.owner2Id = owner2.userId;
    results.owner2Token = owner2.token;
  } else {
    console.log('\n✗ Failed to setup owner 2, aborting tests');
    return;
  }

  // Setup: Create restaurant
  results.restaurant1Id = await createRestaurant(
    testData.restaurant1,
    results.owner1Token,
    'Restaurant 1'
  );
  
  if (!results.restaurant1Id) {
    console.log('\n✗ Failed to setup restaurant, aborting tests');
    return;
  }

  // Run tests
  await testCreateMenuItem();
  await testCreateVeganMenuItem();
  await testVerifyMenuItemInDatabase();
  await testCreateAsWrongOwner();

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total Tests: ${results.passed + results.failed}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  
  if (results.failed === 0) {
    console.log('\n✓ All tests passed!');
    console.log('\nCreated Resources:');
    console.log(`  Restaurant ID: ${results.restaurant1Id}`);
    console.log(`  Menu Item 1 ID: ${results.menuItem1Id}`);
    console.log(`  Menu Item 2 ID: ${results.menuItem2Id}`);
    console.log('\nNext Steps:');
    console.log('  - Verify menu items in Supabase database');
    console.log('  - Test menu listing and filtering (Task 4.2)');
    console.log('  - Test menu item updates (Task 4.3)');
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
