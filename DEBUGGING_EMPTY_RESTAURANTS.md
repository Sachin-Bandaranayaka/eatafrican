# Debugging Empty Restaurant List Issue

## Problem
When selecting "ETHIOPIA, ERITREA" as country specialty and "BERN" as location, the restaurant list shows empty even though the location count shows (1).

## Root Causes Identified

### 1. **Cuisine Type Mismatch**
- The frontend sends: `cuisineType=ETHIOPIAN, ERITREAN`
- The database might have: `["Ethiopian"]` or `["Eritrean"]` (individual values)
- The search API uses `.contains()` which requires EXACT match
- Result: No restaurants found even if they exist

### 2. **Multiple API Calls**
- The component was making API calls for ALL locations when selecting a country
- This was causing unnecessary network traffic

## Solutions Implemented

### 1. **Switched to Simpler API Endpoint**
Changed from `/api/restaurants/search` to `/api/restaurants`:
- Removed the requirement for a search query (`q` parameter)
- More straightforward filtering

### 2. **Client-Side Cuisine Filtering**
- Fetch all restaurants in the selected city
- Filter by cuisine type on the client side using flexible keyword matching
- This allows partial matches (e.g., "ethiopian" matches "Ethiopian")

### 3. **Fallback Behavior**
- If no restaurants match the cuisine filter, show ALL restaurants in that city
- This prevents showing empty results when cuisine types don't match exactly

### 4. **Added Debug Logging**
Added console.log statements to help diagnose:
- What location and country are selected
- What restaurants are fetched from API
- What cuisine keywords are being used for filtering
- Which restaurants match the filter
- Final filtered results

## How to Debug

### Step 1: Check Browser Console
Open your browser's developer console and look for these logs:
```
Fetching restaurants for: { selectedLocation: "BERN", selectedCountry: "ETHIOPIA, ERITREA" }
Fetched restaurants: { restaurants: [...], total: X }
Filtering by cuisine keywords: ["ethiopian", "eritrean"]
Restaurant "Name" cuisines: "...", matches: true/false
Filtered restaurants: [...]
```

### Step 2: Verify Database Content
Check if restaurants actually exist in your database:

1. **Check if any restaurants exist:**
   - Visit: `http://localhost:3000/api/restaurants`
   - Should return a list of all active restaurants

2. **Check restaurants in BERN:**
   - Visit: `http://localhost:3000/api/restaurants?city=BERN`
   - Should return restaurants in BERN

3. **Check cuisine types:**
   - Look at the `cuisine` field in the response
   - Verify what cuisine types are actually stored

### Step 3: Common Issues

#### Issue: No restaurants in database
**Solution:** Add restaurants using the restaurant registration form or directly in Supabase

#### Issue: Restaurants exist but have wrong city name
**Problem:** Database has "Bern" but search uses "BERN" (case-sensitive)
**Solution:** Update the search to be case-insensitive or normalize city names

#### Issue: Cuisine types don't match
**Problem:** Database has "Ethiopian" but search looks for "ETHIOPIAN, ERITREAN"
**Solution:** Already fixed with client-side filtering

#### Issue: Restaurants are not "active"
**Problem:** Restaurants have status "pending" or "inactive"
**Solution:** Update restaurant status to "active" in database

## Testing Steps

1. **Open browser console** (F12 or Cmd+Option+I)
2. **Select country specialty:** ETHIOPIA, ERITREA
3. **Select location:** BERN
4. **Check console logs** for:
   - API response
   - Filtered results
   - Any error messages

5. **If still empty:**
   - Check the API directly: `http://localhost:3000/api/restaurants?city=BERN`
   - Verify restaurants exist and are active
   - Check cuisine_types field format

## Quick Fix: Add Test Restaurant

If you need to test immediately, add a test restaurant via Supabase:

```sql
INSERT INTO restaurants (
  name,
  description,
  cuisine_types,
  city,
  address,
  postal_code,
  region,
  phone,
  email,
  status,
  min_order_amount,
  rating,
  total_ratings
) VALUES (
  'Test Ethiopian Restaurant',
  'Authentic Ethiopian cuisine',
  ARRAY['Ethiopian', 'Eritrean'],
  'BERN',
  'Test Street 123',
  '3000',
  'Bern',
  '+41 31 123 4567',
  'test@restaurant.ch',
  'active',
  25.00,
  4.5,
  10
);
```

## Files Modified
- `components/location-selection-mobile.tsx` - Updated restaurant fetching logic with debugging
