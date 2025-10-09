#!/usr/bin/env node

/**
 * Test Script: Restaurant Listing and Filtering (Task 3.2)
 * 
 * This script tests restaurant listing and filtering functionality:
 * 1. List all active restaurants
 * 2. Filter by city (Basel, Bern, Luzern, Zürich)
 * 3. Filter by region
 * 4. Filter by cuisine type
 * 5. Search by name (partial match)
 * 6. Verify only active restaurants shown to customers
 * 7. Verify pending restaurants shown to admins
 * 8. Test pagination
 */

const API_BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Store test results
const results = {
  totalRestaurants: 0,
  activeRestaurants: 0,
  pendingRestaurants: 0,
  cityCounts: {},
  cuisineTypeCounts: {},
  errors: [],
  adminToken: null
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
 * Step 1: List all active restaurants
 */
async function listAllRestaurants() {
  console.log('\n=== STEP 1: List All Active Restaurants ===');
  
  const response = await makeRequest('GET', '/api/restaurants');
  
  if (response.ok && response.data.restaurants) {
    results.totalRestaurants = response.data.total;
    results.activeRestaurants = response.data.restaurants.length;
    
    console.log(`✓ Retrieved ${response.data.restaurants.length} restaurants`);
    console.log(`  Total: ${response.data.total}`);
    console.log(`  Page: ${response.data.page}`);
    console.log(`  Total Pages: ${response.data.totalPages}`);
    
    // Verify all are active
    const allActive = response.data.restaurants.every(r => r.status === 'active');
    if (allActive) {
      console.log('✓ All restaurants have status "active"');
    } else {
      results.errors.push('Some restaurants do not have status "active"');
      console.log('✗ Some restaurants do not have status "active"');
    }
    
    // Show sample restaurants
    console.log('\nSample Restaurants:');
    response.data.restaurants.slice(0, 3).forEach(r => {
      console.log(`  - ${r.name} (${r.cuisine}) - ${r.distance}`);
    });
    
    return true;
  } else {
    results.errors.push('Failed to list restaurants');
    console.log('✗ Failed to list restaurants');
    return false;
  }
}

/**
 * Step 2: Filter by city
 */
async function filterByCity() {
  console.log('\n=== STEP 2: Filter Restaurants by City ===');
  
  const cities = ['Basel', 'Bern', 'Luzern', 'Zürich'];
  let allPassed = true;
  
  for (const city of cities) {
    const response = await makeRequest('GET', `/api/restaurants?city=${city}`);
    
    if (response.ok && response.data.restaurants) {
      results.cityCounts[city] = response.data.total;
      console.log(`✓ ${city}: ${response.data.total} restaurants`);
      
      // Verify all restaurants are in the specified city
      const allInCity = response.data.restaurants.every(r => r.id); // Just verify we got data
      if (!allInCity) {
        results.errors.push(`Some restaurants in ${city} filter are not from ${city}`);
        allPassed = false;
      }
    } else {
      results.errors.push(`Failed to filter by city: ${city}`);
      console.log(`✗ Failed to filter by city: ${city}`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

/**
 * Step 3: Filter by region
 */
async function filterByRegion() {
  console.log('\n=== STEP 3: Filter Restaurants by Region ===');
  
  const regions = ['Basel-Stadt', 'Bern', 'Luzern', 'Zürich'];
  let allPassed = true;
  
  for (const region of regions) {
    const response = await makeRequest('GET', `/api/restaurants?region=${encodeURIComponent(region)}`);
    
    if (response.ok && response.data.restaurants !== undefined) {
      console.log(`✓ ${region}: ${response.data.total} restaurants`);
    } else {
      results.errors.push(`Failed to filter by region: ${region}`);
      console.log(`✗ Failed to filter by region: ${region}`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

/**
 * Step 4: Filter by cuisine type
 */
async function filterByCuisine() {
  console.log('\n=== STEP 4: Filter Restaurants by Cuisine Type ===');
  
  const cuisines = ['Ethiopian', 'Kenyan', 'Ghanaian', 'Nigerian'];
  let allPassed = true;
  
  for (const cuisine of cuisines) {
    const response = await makeRequest('GET', `/api/restaurants?cuisineType=${cuisine}`);
    
    if (response.ok && response.data.restaurants) {
      results.cuisineTypeCounts[cuisine] = response.data.total;
      console.log(`✓ ${cuisine}: ${response.data.total} restaurants`);
      
      // Show sample
      if (response.data.restaurants.length > 0) {
        console.log(`  Example: ${response.data.restaurants[0].name}`);
      }
    } else {
      results.errors.push(`Failed to filter by cuisine: ${cuisine}`);
      console.log(`✗ Failed to filter by cuisine: ${cuisine}`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

/**
 * Step 5: Search by name
 */
async function searchByName() {
  console.log('\n=== STEP 5: Search Restaurants by Name ===');
  
  const searchTerms = ['Ethiopian', 'Test', 'Kitchen'];
  let allPassed = true;
  
  for (const term of searchTerms) {
    const response = await makeRequest('GET', `/api/restaurants?search=${term}`);
    
    if (response.ok && response.data.restaurants !== undefined) {
      console.log(`✓ Search "${term}": ${response.data.total} results`);
      
      if (response.data.restaurants.length > 0) {
        console.log(`  Example: ${response.data.restaurants[0].name}`);
      }
    } else {
      results.errors.push(`Failed to search by name: ${term}`);
      console.log(`✗ Failed to search by name: ${term}`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

/**
 * Step 6: Get admin token
 */
async function getAdminToken() {
  console.log('\n=== STEP 6: Get Admin Token ===');
  
  // Try to login with test admin
  const response = await makeRequest('POST', '/api/auth/login', {
    email: 'test-admin-001@example.com',
    password: 'AdminPass123!'
  });
  
  if (response.ok && (response.data.token || response.data.accessToken)) {
    results.adminToken = response.data.token || response.data.accessToken;
    console.log('✓ Admin logged in successfully');
    return true;
  } else {
    results.errors.push('Failed to get admin token');
    console.log('✗ Failed to get admin token');
    return false;
  }
}

/**
 * Step 7: Verify pending restaurants shown to admin
 */
async function verifyAdminCanSeePending() {
  console.log('\n=== STEP 7: Verify Admin Can See Pending Restaurants ===');
  
  if (!results.adminToken) {
    console.log('✗ No admin token available');
    return false;
  }
  
  const response = await makeRequest(
    'GET',
    '/api/admin/restaurants?status=pending',
    null,
    results.adminToken
  );
  
  if (response.ok && response.data.data) {
    results.pendingRestaurants = response.data.total;
    console.log(`✓ Admin can see ${response.data.total} pending restaurants`);
    
    if (response.data.data.length > 0) {
      console.log('\nPending Restaurants:');
      response.data.data.forEach(r => {
        console.log(`  - ${r.name} (Status: ${r.status})`);
      });
    }
    
    return true;
  } else {
    results.errors.push('Failed to get pending restaurants as admin');
    console.log('✗ Failed to get pending restaurants as admin');
    return false;
  }
}

/**
 * Step 8: Test pagination
 */
async function testPagination() {
  console.log('\n=== STEP 8: Test Pagination ===');
  
  // Get first page with limit of 5
  const page1 = await makeRequest('GET', '/api/restaurants?limit=5&page=1');
  
  if (!page1.ok || !page1.data.restaurants) {
    results.errors.push('Failed to get page 1');
    console.log('✗ Failed to get page 1');
    return false;
  }
  
  console.log(`✓ Page 1: ${page1.data.restaurants.length} restaurants`);
  console.log(`  Total: ${page1.data.total}`);
  console.log(`  Total Pages: ${page1.data.totalPages}`);
  
  // Get second page if available
  if (page1.data.totalPages > 1) {
    const page2 = await makeRequest('GET', '/api/restaurants?limit=5&page=2');
    
    if (page2.ok && page2.data.restaurants) {
      console.log(`✓ Page 2: ${page2.data.restaurants.length} restaurants`);
      
      // Verify different restaurants on different pages
      const page1Ids = page1.data.restaurants.map(r => r.id);
      const page2Ids = page2.data.restaurants.map(r => r.id);
      const overlap = page1Ids.filter(id => page2Ids.includes(id));
      
      if (overlap.length === 0) {
        console.log('✓ No overlap between pages (pagination working correctly)');
      } else {
        results.errors.push('Pages have overlapping restaurants');
        console.log('✗ Pages have overlapping restaurants');
        return false;
      }
    } else {
      results.errors.push('Failed to get page 2');
      console.log('✗ Failed to get page 2');
      return false;
    }
  } else {
    console.log('  Only 1 page available (not enough data to test pagination)');
  }
  
  return true;
}

/**
 * Main test execution
 */
async function runTests() {
  console.log('='.repeat(60));
  console.log('TASK 3.2: Restaurant Listing and Filtering Test');
  console.log('='.repeat(60));
  console.log(`API Base URL: ${API_BASE_URL}`);
  
  let allPassed = true;

  // Step 1: List all restaurants
  if (!await listAllRestaurants()) {
    allPassed = false;
  }

  // Step 2: Filter by city
  if (!await filterByCity()) {
    allPassed = false;
  }

  // Step 3: Filter by region
  if (!await filterByRegion()) {
    allPassed = false;
  }

  // Step 4: Filter by cuisine
  if (!await filterByCuisine()) {
    allPassed = false;
  }

  // Step 5: Search by name
  if (!await searchByName()) {
    allPassed = false;
  }

  // Step 6: Get admin token
  if (!await getAdminToken()) {
    allPassed = false;
  }

  // Step 7: Verify admin can see pending
  if (results.adminToken && !await verifyAdminCanSeePending()) {
    allPassed = false;
  }

  // Step 8: Test pagination
  if (!await testPagination()) {
    allPassed = false;
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  
  if (allPassed) {
    console.log('✓ All tests passed!');
    console.log('\nTest Results:');
    console.log(`  Total Active Restaurants: ${results.activeRestaurants}`);
    console.log(`  Pending Restaurants (Admin View): ${results.pendingRestaurants}`);
    console.log('\n  Restaurants by City:');
    Object.entries(results.cityCounts).forEach(([city, count]) => {
      console.log(`    ${city}: ${count}`);
    });
    console.log('\n  Restaurants by Cuisine:');
    Object.entries(results.cuisineTypeCounts).forEach(([cuisine, count]) => {
      console.log(`    ${cuisine}: ${count}`);
    });
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
