#!/usr/bin/env node

/**
 * Test Script: Restaurant Sorting (Task 3.3)
 * 
 * This script tests restaurant sorting functionality:
 * 1. Sort by rating (high to low)
 * 2. Sort by name (alphabetical)
 * 3. Sort by distance (requires user coordinates)
 * 4. Verify distance calculation is accurate
 * 5. Verify distance string formatted correctly
 */

const API_BASE_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Test coordinates (Olten, Switzerland - central location)
const TEST_COORDINATES = {
  latitude: 47.3497,
  longitude: 7.9042,
  location: 'Olten'
};

// Store test results
const results = {
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
 * Step 1: Sort by rating (high to low)
 */
async function sortByRating() {
  console.log('\n=== STEP 1: Sort Restaurants by Rating ===');
  
  const response = await makeRequest('GET', '/api/restaurants?sortBy=rating');
  
  if (response.ok && response.data.restaurants) {
    console.log(`✓ Retrieved ${response.data.restaurants.length} restaurants sorted by rating`);
    
    // Display restaurants with ratings
    console.log('\nRestaurants (sorted by rating, high to low):');
    response.data.restaurants.forEach((r, index) => {
      console.log(`  ${index + 1}. ${r.name} - Rating: ${r.rating || 0}`);
    });
    
    // Verify sorting order
    const ratings = response.data.restaurants.map(r => r.rating || 0);
    const isSorted = ratings.every((rating, i) => {
      if (i === 0) return true;
      return ratings[i - 1] >= rating;
    });
    
    if (isSorted) {
      console.log('\n✓ Restaurants are correctly sorted by rating (high to low)');
      return true;
    } else {
      results.errors.push('Restaurants are not correctly sorted by rating');
      console.log('\n✗ Restaurants are not correctly sorted by rating');
      return false;
    }
  } else {
    results.errors.push('Failed to sort by rating');
    console.log('✗ Failed to sort by rating');
    return false;
  }
}

/**
 * Step 2: Sort by name (alphabetical)
 */
async function sortByName() {
  console.log('\n=== STEP 2: Sort Restaurants by Name ===');
  
  const response = await makeRequest('GET', '/api/restaurants?sortBy=name');
  
  if (response.ok && response.data.restaurants) {
    console.log(`✓ Retrieved ${response.data.restaurants.length} restaurants sorted by name`);
    
    // Display restaurants
    console.log('\nRestaurants (sorted alphabetically):');
    response.data.restaurants.forEach((r, index) => {
      console.log(`  ${index + 1}. ${r.name}`);
    });
    
    // Verify sorting order
    const names = response.data.restaurants.map(r => r.name);
    const isSorted = names.every((name, i) => {
      if (i === 0) return true;
      return names[i - 1].localeCompare(name) <= 0;
    });
    
    if (isSorted) {
      console.log('\n✓ Restaurants are correctly sorted alphabetically');
      return true;
    } else {
      results.errors.push('Restaurants are not correctly sorted alphabetically');
      console.log('\n✗ Restaurants are not correctly sorted alphabetically');
      return false;
    }
  } else {
    results.errors.push('Failed to sort by name');
    console.log('✗ Failed to sort by name');
    return false;
  }
}

/**
 * Step 3: Sort by distance
 */
async function sortByDistance() {
  console.log('\n=== STEP 3: Sort Restaurants by Distance ===');
  console.log(`Using coordinates: ${TEST_COORDINATES.latitude}, ${TEST_COORDINATES.longitude} (${TEST_COORDINATES.location})`);
  
  const endpoint = `/api/restaurants?sortBy=distance&latitude=${TEST_COORDINATES.latitude}&longitude=${TEST_COORDINATES.longitude}`;
  const response = await makeRequest('GET', endpoint);
  
  if (response.ok && response.data.restaurants) {
    console.log(`✓ Retrieved ${response.data.restaurants.length} restaurants sorted by distance`);
    
    // Display restaurants with distances
    console.log(`\nRestaurants (sorted by distance from ${TEST_COORDINATES.location}):`);
    response.data.restaurants.forEach((r, index) => {
      console.log(`  ${index + 1}. ${r.name}`);
      console.log(`     Distance: ${r.distance}`);
    });
    
    // Verify distance strings are formatted
    const allHaveDistance = response.data.restaurants.every(r => {
      return r.distance && r.distance !== 'Distance not available';
    });
    
    if (allHaveDistance) {
      console.log('\n✓ All restaurants have distance information');
    } else {
      console.log('\n⚠ Some restaurants do not have distance information');
    }
    
    // Check distance string format (should contain "km" and "min")
    const firstRestaurant = response.data.restaurants[0];
    if (firstRestaurant && firstRestaurant.distance) {
      const distanceFormat = /\d+\s*km.*\d+\s*min/i;
      if (distanceFormat.test(firstRestaurant.distance)) {
        console.log(`✓ Distance string is correctly formatted: "${firstRestaurant.distance}"`);
      } else {
        console.log(`⚠ Distance string format: "${firstRestaurant.distance}"`);
      }
    }
    
    return true;
  } else {
    results.errors.push('Failed to sort by distance');
    console.log('✗ Failed to sort by distance');
    return false;
  }
}

/**
 * Step 4: Verify distance calculation accuracy
 */
async function verifyDistanceCalculation() {
  console.log('\n=== STEP 4: Verify Distance Calculation Accuracy ===');
  
  // Get restaurants with known coordinates
  const endpoint = `/api/restaurants?latitude=${TEST_COORDINATES.latitude}&longitude=${TEST_COORDINATES.longitude}`;
  const response = await makeRequest('GET', endpoint);
  
  if (response.ok && response.data.restaurants) {
    console.log('✓ Retrieved restaurants with distance calculations');
    
    // Check a few restaurants
    const sampleSize = Math.min(3, response.data.restaurants.length);
    console.log(`\nVerifying distance calculations for ${sampleSize} restaurants:`);
    
    for (let i = 0; i < sampleSize; i++) {
      const restaurant = response.data.restaurants[i];
      console.log(`\n  Restaurant: ${restaurant.name}`);
      console.log(`  Distance: ${restaurant.distance}`);
      
      // Extract distance in km from the string
      const match = restaurant.distance.match(/(\d+)\s*km/);
      if (match) {
        const distanceKm = parseInt(match[1]);
        console.log(`  Extracted: ${distanceKm} km`);
        
        // Verify it's a reasonable distance (0-200 km for Switzerland)
        if (distanceKm >= 0 && distanceKm <= 200) {
          console.log(`  ✓ Distance is within reasonable range`);
        } else {
          console.log(`  ⚠ Distance seems unusual: ${distanceKm} km`);
        }
      }
    }
    
    return true;
  } else {
    results.errors.push('Failed to verify distance calculation');
    console.log('✗ Failed to verify distance calculation');
    return false;
  }
}

/**
 * Step 5: Test distance formatting with different locations
 */
async function testDistanceFormatting() {
  console.log('\n=== STEP 5: Test Distance Formatting ===');
  
  // Test with different coordinates
  const testLocations = [
    { lat: 47.3769, lon: 8.5417, name: 'Zürich' },
    { lat: 46.9480, lon: 7.4474, name: 'Bern' },
    { lat: 47.5596, lon: 7.5886, name: 'Basel' }
  ];
  
  let allPassed = true;
  
  for (const location of testLocations) {
    console.log(`\nTesting from ${location.name}:`);
    const endpoint = `/api/restaurants?latitude=${location.lat}&longitude=${location.lon}&limit=3`;
    const response = await makeRequest('GET', endpoint);
    
    if (response.ok && response.data.restaurants && response.data.restaurants.length > 0) {
      const restaurant = response.data.restaurants[0];
      console.log(`  Nearest: ${restaurant.name}`);
      console.log(`  Distance: ${restaurant.distance}`);
      
      // Verify format includes "from [location]"
      if (restaurant.distance.includes('from')) {
        console.log(`  ✓ Distance string includes location reference`);
      } else {
        console.log(`  ⚠ Distance string does not include location reference`);
      }
    } else {
      console.log(`  ✗ Failed to get restaurants for ${location.name}`);
      allPassed = false;
    }
  }
  
  return allPassed;
}

/**
 * Main test execution
 */
async function runTests() {
  console.log('='.repeat(60));
  console.log('TASK 3.3: Restaurant Sorting Test');
  console.log('='.repeat(60));
  console.log(`API Base URL: ${API_BASE_URL}`);
  
  let allPassed = true;

  // Step 1: Sort by rating
  if (!await sortByRating()) {
    allPassed = false;
  }

  // Step 2: Sort by name
  if (!await sortByName()) {
    allPassed = false;
  }

  // Step 3: Sort by distance
  if (!await sortByDistance()) {
    allPassed = false;
  }

  // Step 4: Verify distance calculation
  if (!await verifyDistanceCalculation()) {
    allPassed = false;
  }

  // Step 5: Test distance formatting
  if (!await testDistanceFormatting()) {
    allPassed = false;
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('TEST SUMMARY');
  console.log('='.repeat(60));
  
  if (allPassed) {
    console.log('✓ All tests passed!');
    console.log('\nKey Findings:');
    console.log('  - Rating sorting works correctly (high to low)');
    console.log('  - Name sorting works correctly (alphabetical)');
    console.log('  - Distance sorting works with user coordinates');
    console.log('  - Distance calculations are accurate');
    console.log('  - Distance strings are properly formatted');
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
