# Driver Registration & Login Guide

## 🚨 Current Status

### ❌ NOT CONNECTED
Both the driver login and registration forms are **NOT connected to the backend**. They are UI mockups only.

---

## 📍 How to Access Driver Portal

### Option 1: From Homepage Header
1. Go to `http://localhost:3000`
2. Click **"DRIVER PORTAL"** button in the header
3. You'll see the driver login screen

### Option 2: Direct Component
- The driver portal is a modal/overlay component
- It's triggered from the main page header
- **No separate route exists** - it's a component overlay

---

## 🔧 What Needs to Be Fixed

### 1. Driver Registration Form
**Location**: `components/driverPortal/auth/register.tsx`

**Current State**: ❌ Not connected
- Form collects data but doesn't send it to API
- Just shows "Thank you" message on submit
- No actual registration happens

**API Endpoint Available**: ✅ `/api/drivers` (POST)

**What the API Expects**:
```json
{
  "userId": "uuid",
  "licenseNumber": "string",
  "vehicleType": "string",
  "vehiclePlate": "string",
  "pickupZone": "Basel" | "Bern" | "Luzern" | "Zürich" | "Olten",
  "profileImageUrl": "url (optional)"
}
```

**Problem**: The registration form collects:
- firstName, lastName, phone, email (user info)
- city, postalCode, street (address)
- pickupLocation (pickup zone)
- drivingLicense, cv (files)

But the API expects:
- userId (must already exist)
- licenseNumber, vehicleType, vehiclePlate
- pickupZone

**Solution Needed**: 
1. First create a user account via `/api/auth/register`
2. Then create driver profile via `/api/drivers`
3. Upload documents to storage
4. Set user role to 'driver'

---

### 2. Driver Login Form
**Location**: `components/driverPortal/auth/login.tsx`

**Current State**: ❌ Not connected
- Form has email/password fields
- Login button just calls `onLoginClick()` prop
- No API call to authenticate

**API Endpoint Available**: ✅ `/api/auth/login` (POST)

**What the API Expects**:
```json
{
  "email": "driver@example.com",
  "password": "password123"
}
```

**What the API Returns**:
```json
{
  "user": {
    "id": "uuid",
    "email": "driver@example.com",
    "role": "driver",
    "firstName": "John",
    "lastName": "Doe"
  },
  "accessToken": "jwt-token",
  "refreshToken": "refresh-token"
}
```

---

## 🔄 Complete Driver Registration Flow (What Should Happen)

### Step 1: User Registration
```
POST /api/auth/register
{
  "email": "driver@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+41791234567",
  "role": "driver"
}
```
**Returns**: User account with userId

### Step 2: Driver Profile Creation
```
POST /api/drivers
{
  "userId": "user-uuid-from-step-1",
  "licenseNumber": "CH-12345",
  "vehicleType": "Car",
  "vehiclePlate": "ZH-123456",
  "pickupZone": "Zürich"
}
```
**Returns**: Driver profile with status: 'pending'

### Step 3: Document Upload (Optional)
```
POST /api/uploads
- Upload driving license photo
- Upload CV
- Upload ID/passport
```

### Step 4: Admin Approval
- Admin reviews driver application
- Admin approves driver
- Driver status changes from 'pending' to 'active'

### Step 5: Driver Can Login
- Driver uses email/password to login
- Gets access to driver portal
- Can see and accept orders

---

## 🎯 Quick Fix: Manual Driver Creation

Since the forms aren't connected, here's how to create a driver manually for testing:

### Method 1: Using Supabase MCP (Recommended)

1. **Create User Account**:
```sql
-- First, create auth user (you'll need to do this via Supabase dashboard or auth API)
-- Then insert into users table
INSERT INTO users (id, email, first_name, last_name, phone, role, status)
VALUES (
  'auth-user-uuid-here',
  'testdriver@example.com',
  'Test',
  'Driver',
  '+41791234567',
  'driver',
  'active'
);
```

2. **Create Driver Profile**:
```sql
INSERT INTO drivers (
  user_id,
  license_number,
  vehicle_type,
  vehicle_plate,
  pickup_zone,
  status,
  rating,
  total_ratings,
  total_deliveries,
  total_earnings,
  documents_verified
)
VALUES (
  'auth-user-uuid-here',
  'CH-12345',
  'Car',
  'ZH-123456',
  'Zürich',
  'active',
  0,
  0,
  0,
  0,
  true
);
```

### Method 2: Using Admin Portal

1. Go to admin portal
2. Navigate to Drivers section
3. Create new driver
4. Approve driver

---

## 🔐 Driver Login Flow (What Should Happen)

### Current (Broken):
```
User clicks LOGIN → onLoginClick() → Shows driver portal
(No authentication, no token, no user data)
```

### Should Be:
```
1. User enters email/password
2. Click LOGIN
3. POST /api/auth/login
4. Receive accessToken + user data
5. Store in localStorage:
   - accessToken
   - refreshToken
   - user (with role: 'driver')
6. Verify role is 'driver'
7. Show driver portal
```

---

## 📋 Files That Need to Be Updated

### 1. `components/driverPortal/auth/login.tsx`
**Changes Needed**:
- Add state for email, password
- Add API call to `/api/auth/login`
- Store tokens in localStorage
- Verify user role is 'driver'
- Show error messages

### 2. `components/driverPortal/auth/register.tsx`
**Changes Needed**:
- Split into two-step process:
  1. User registration
  2. Driver profile creation
- Add API calls
- Handle file uploads
- Show proper success/error messages

### 3. `components/driverPortal.tsx`
**Changes Needed**:
- Check authentication on mount
- Verify user is logged in as driver
- Redirect to login if not authenticated

---

## 🧪 Testing the Driver Flow (Once Fixed)

### Test Registration:
1. Click "DRIVER PORTAL" in header
2. Click "Register Your Driver Account"
3. Fill in all fields
4. Upload documents
5. Submit
6. Check database for new user and driver records
7. Admin approves driver

### Test Login:
1. Click "DRIVER PORTAL" in header
2. Enter email/password
3. Click LOGIN
4. Should see driver dashboard
5. Should see "NEW" orders tab
6. Should be able to accept orders

---

## 🚀 Next Steps

To make the driver portal functional:

1. **Connect Login Form** (Priority: HIGH)
   - Add authentication API call
   - Store tokens
   - Verify driver role

2. **Connect Registration Form** (Priority: HIGH)
   - Implement two-step registration
   - Add file upload functionality
   - Create user + driver profile

3. **Add Authentication Check** (Priority: HIGH)
   - Verify user is logged in
   - Check user role is 'driver'
   - Redirect if not authenticated

4. **Test Complete Flow** (Priority: MEDIUM)
   - Register → Login → Accept Order → Deliver

---

## 💡 Temporary Workaround

For immediate testing, you can:

1. **Create a driver manually in the database** (see Quick Fix above)
2. **Login via the main login** (if it exists and works)
3. **Access driver portal** by clicking the header button
4. The portal will work if you have valid tokens in localStorage

**Required localStorage items**:
```javascript
localStorage.setItem('accessToken', 'your-jwt-token');
localStorage.setItem('user', JSON.stringify({
  id: 'driver-user-id',
  email: 'driver@example.com',
  role: 'driver',
  firstName: 'John',
  lastName: 'Doe'
}));
```

---

## 📞 Summary

**Current State**:
- ❌ Driver registration form: UI only, not connected
- ❌ Driver login form: UI only, not connected
- ✅ Driver portal dashboard: Connected and working
- ✅ Order acceptance API: Working
- ✅ Available orders API: Working

**What Works**:
- If you manually create a driver and set up localStorage, the driver portal functions correctly
- Drivers can see available orders
- Drivers can accept orders
- Order status updates work

**What Doesn't Work**:
- Cannot register as a driver through the UI
- Cannot login as a driver through the UI
- No authentication flow for drivers

**Priority Fix**:
Connect the login form first, then worry about registration later. For testing, create drivers manually.
