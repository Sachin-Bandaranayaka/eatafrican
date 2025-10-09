# Task 3.1: Test Restaurant Creation and Approval

## Test Execution Report

**Date:** 2025-10-08
**Task:** 3.1 Test restaurant creation and approval
**Status:** In Progress

## Test Steps

### Step 1: Create Restaurant Owner Account

**Objective:** Register a new restaurant owner user for testing

**API Endpoint:** `POST /api/auth/register`

**Test Data:**
```json
{
  "email": "test-restaurant-owner-001@example.com",
  "password": "SecurePass123!",
  "firstName": "Test",
  "lastName": "Restaurant Owner",
  "role": "restaurant_owner",
  "phone": "+41791234567"
}
```

**Expected Result:**
- Status: 201 Created
- Response contains user data with role "restaurant_owner"
- JWT tokens returned
- User record created in database

### Step 2: Create Restaurant with Complete Data

**Objective:** Create a new restaurant as the restaurant owner

**API Endpoint:** `POST /api/restaurants`

**Test Data:**
```json
{
  "name": "Test Ethiopian Restaurant",
  "description": "Authentic Ethiopian cuisine in the heart of Zürich",
  "cuisineTypes": ["Ethiopian", "African"],
  "address": "Bahnhofstrasse 100",
  "city": "Zürich",
  "postalCode": "8001",
  "region": "Zürich",
  "phone": "+41442345678",
  "email": "info@test-ethiopian.ch",
  "minOrderAmount": 24.0,
  "latitude": 47.3769,
  "longitude": 8.5417,
  "openingHours": {
    "monday": { "open": "11:00", "close": "22:00" },
    "tuesday": { "open": "11:00", "close": "22:00" },
    "wednesday": { "open": "11:00", "close": "22:00" },
    "thursday": { "open": "11:00", "close": "22:00" },
    "friday": { "open": "11:00", "close": "23:00" },
    "saturday": { "open": "12:00", "close": "23:00" },
    "sunday": { "open": "12:00", "close": "21:00" }
  }
}
```

**Expected Result:**
- Status: 201 Created
- Restaurant created with status "pending"
- owner_id matches the restaurant owner's user ID
- All fields stored correctly in database

### Step 3: Upload Restaurant Logo

**Objective:** Upload a logo image for the restaurant

**API Endpoint:** `POST /api/uploads`

**Test Data:**
- File: Test image (JPEG/PNG)
- Bucket: RESTAURANT_IMAGES
- Folder: logos

**Expected Result:**
- Status: 201 Created
- Image stored in Supabase Storage
- Public URL returned
- URL is accessible

### Step 4: Upload Restaurant Cover Image

**Objective:** Upload a cover image for the restaurant

**API Endpoint:** `POST /api/uploads`

**Test Data:**
- File: Test image (JPEG/PNG)
- Bucket: RESTAURANT_IMAGES
- Folder: covers

**Expected Result:**
- Status: 201 Created
- Image stored in Supabase Storage
- Public URL returned
- URL is accessible

### Step 5: Update Restaurant with Image URLs

**Objective:** Update the restaurant with the uploaded image URLs

**API Endpoint:** `PATCH /api/restaurants/[id]`

**Test Data:**
```json
{
  "logoUrl": "[URL from Step 3]",
  "coverImageUrl": "[URL from Step 4]"
}
```

**Expected Result:**
- Status: 200 OK
- Restaurant updated with image URLs
- Changes reflected in database

### Step 6: Verify Restaurant in Database

**Objective:** Query the database to verify restaurant data

**Database Query:**
```sql
SELECT 
  id,
  owner_id,
  name,
  status,
  cuisine_types,
  address,
  city,
  region,
  logo_url,
  cover_image_url,
  min_order_amount,
  created_at
FROM restaurants
WHERE name = 'Test Ethiopian Restaurant'
ORDER BY created_at DESC
LIMIT 1;
```

**Expected Result:**
- Restaurant exists in database
- Status is "pending"
- owner_id matches restaurant owner user ID
- All fields match test data
- Image URLs are set correctly

### Step 7: Admin Approves Restaurant

**Objective:** Super admin approves the pending restaurant

**API Endpoint:** `PATCH /api/admin/restaurants/[id]/approve`

**Test Data:**
```json
{
  "status": "active"
}
```

**Expected Result:**
- Status: 200 OK
- Restaurant status changed to "active"
- Activity log entry created
- Notification created for restaurant owner

### Step 8: Verify Approval Notification

**Objective:** Check that approval notification was created

**Database Query:**
```sql
SELECT 
  id,
  user_id,
  type,
  title,
  message,
  data,
  created_at
FROM notifications
WHERE user_id = '[restaurant_owner_id]'
  AND type = 'account'
  AND title = 'Restaurant Approved'
ORDER BY created_at DESC
LIMIT 1;
```

**Expected Result:**
- Notification exists
- Type is "account"
- Title is "Restaurant Approved"
- Message contains restaurant name
- Data contains restaurant ID and status

### Step 9: Verify Restaurant is Active

**Objective:** Confirm restaurant status is now active

**Database Query:**
```sql
SELECT id, name, status, updated_at
FROM restaurants
WHERE id = '[restaurant_id]';
```

**Expected Result:**
- Status is "active"
- updated_at timestamp is recent

## Test Results

### Execution Log

