# Testing the Application - Complete Guide

This guide will help you test the authentication flow and verify that your frontend is properly connected to the backend.

## Prerequisites

### 1. Environment Setup ✅
- `.env` file created with Supabase credentials
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` configured

### 2. Database Setup
Before testing, you need to ensure your Supabase database is set up:

#### Option A: Using Supabase Dashboard (Recommended)
1. Go to your Supabase project: https://wvpwwkjufoikbeavyxza.supabase.co
2. Navigate to **SQL Editor**
3. Run the migration files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_indexes.sql`
   - `supabase/migrations/003_triggers.sql`
   - `supabase/migrations/004_rls_policies.sql`
   - `supabase/storage/buckets.sql`
   - (Optional) `supabase/seed.sql` for test data

#### Option B: Using Supabase CLI
```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref wvpwwkjufoikbeavyxza

# Run migrations
supabase db push

# (Optional) Seed test data
supabase db execute -f supabase/seed.sql
```

### 3. Start the Development Server
```bash
npm run dev
```

The app should start at: http://localhost:3000

## Testing Authentication Flow

### Test 1: User Registration

1. **Open the app** at http://localhost:3000
2. **Click on the Login/Account button** (usually in the header)
3. **Click "Create Account"** to switch to registration view
4. **Fill in the registration form:**
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john.doe@example.com`
   - Password: `Test123!@#` (must include uppercase, number, special character)
   - Confirm Password: `Test123!@#`
5. **Click "REGISTER"**

**Expected Results:**
- ✅ Button shows "REGISTERING..." while processing
- ✅ You see "WELCOME" message
- ✅ A confirmation message about email verification
- ✅ No errors displayed

**If you see errors:**
- `"User already exists"` - The email is already registered, try a different email
- `"Password must be..."` - Your password doesn't meet requirements
- `"Passwords do not match"` - Check confirm password field
- `"Network error"` - Check browser console (F12) for details

### Test 2: User Login

1. **Navigate to Login** (close modal and reopen, or click "Already have an account?")
2. **Fill in login form:**
   - Email: `john.doe@example.com` (or use test account below)
   - Password: `Test123!@#`
3. **Click "LOGIN"**

**Expected Results:**
- ✅ Button shows "LOGGING IN..." while processing
- ✅ You see "WELCOME BACK" success message with greetings in multiple African languages
- ✅ Automatically redirected to `/restaurants` page after 2 seconds
- ✅ You remain logged in (check localStorage in browser DevTools)

**Test Accounts (if you seeded the database):**
All test accounts use password: `password123`
- **Customer**: customer@example.com
- **Restaurant Owner**: owner@restaurant.com
- **Driver**: driver@delivery.com
- **Super Admin**: admin@eatafrican.ch

**If you see errors:**
- `"Invalid email or password"` - Check credentials or register first
- `"Your account is inactive"` - Account may be suspended
- `"Network error"` - Check browser console (F12) for API errors

### Test 3: Password Reset

1. **Click "Forgot Password?"** on login form
2. **Enter your email:** `john.doe@example.com`
3. **Click "SUBMIT"**

**Expected Results:**
- ✅ Button shows "SUBMITTING..." while processing
- ✅ You see "Reset Instruction Sent!" message
- ✅ Instructions displayed about checking email

**Note:** Email functionality requires Supabase email configuration. Check Supabase Dashboard → Authentication → Email Templates

### Test 4: Guest Checkout

1. **Click "CONTINUE AS GUEST"** button on login modal
2. **Verify guest success message appears**

**Expected Results:**
- ✅ "WELCOME GUEST" message displayed
- ✅ Can proceed to browse without login

## Debugging Common Issues

### Issue: "Failed to fetch" or Network Error

**Diagnosis:**
```bash
# Check if server is running
curl http://localhost:3000/api/auth/login -X POST -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test"}'
```

**Solutions:**
1. Verify server is running on port 3000
2. Check browser console (F12) → Network tab for exact error
3. Verify `.env` file exists and has correct values
4. Restart the development server

### Issue: "Missing SUPABASE_URL environment variable"

**Solution:**
1. Ensure `.env` file is in the project root
2. Restart the development server after adding .env
3. Verify environment variables are loaded:
   ```javascript
   console.log(process.env.SUPABASE_URL) // Should not be undefined
   ```

### Issue: Authentication works but no redirect

**Diagnosis:**
- Check browser console for errors
- Verify `/restaurants` route exists

**Solution:**
- Update redirect URL in `components/login-modal.tsx` line 118 if needed

### Issue: "User profile not found" after login

**Diagnosis:**
The user was created in Supabase Auth but not in the `users` table.

**Solution:**
This shouldn't happen with proper registration flow, but if it does:
1. Go to Supabase Dashboard → Authentication → Users
2. Delete the problematic user
3. Re-register through the app

## Verifying Database Connection

### Check if tables exist:
1. Go to Supabase Dashboard
2. Navigate to **Table Editor**
3. Verify these tables exist:
   - ✅ users
   - ✅ restaurants
   - ✅ menu_items
   - ✅ orders
   - ✅ order_items
   - ✅ drivers
   - ✅ loyalty_points
   - ✅ vouchers
   - ✅ favorites
   - ✅ notifications
   - ✅ activity_logs

### Check user registration in database:
1. After registering a user, go to **Table Editor → users**
2. Your new user should appear with:
   - email
   - first_name
   - last_name
   - role: 'customer'
   - status: 'active'

## Testing API Endpoints Directly

### Using curl:

```bash
# Test Registration
curl http://localhost:3000/api/auth/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#",
    "firstName": "Test",
    "lastName": "User",
    "role": "customer"
  }'

# Test Login
curl http://localhost:3000/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!@#"
  }'

# Test Password Reset
curl http://localhost:3000/api/auth/reset-password \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

### Using browser DevTools:

```javascript
// Test Registration
fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'Test123!@#',
    firstName: 'Test',
    lastName: 'User',
    role: 'customer'
  })
}).then(r => r.json()).then(console.log)

// Test Login
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'Test123!@#'
  })
}).then(r => r.json()).then(console.log)
```

## Checking localStorage After Login

Open Browser DevTools (F12) → Application/Storage → Local Storage → http://localhost:3000

You should see:
- `auth_token`: JWT access token
- `refresh_token`: JWT refresh token
- `user`: JSON object with user details

## Next Steps After Successful Authentication

1. **Browse Restaurants** - Navigate to `/restaurants` to see restaurant listings
2. **View Restaurant Menu** - Click on a restaurant to see its menu
3. **Add Items to Cart** - Test the cart functionality
4. **Place an Order** - Test the complete checkout flow

## Production Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a secure random value
- [ ] Update `FRONTEND_URL` to your production domain
- [ ] Configure Supabase email templates
- [ ] Set up proper email SMTP (if not using Supabase email)
- [ ] Enable RLS (Row Level Security) policies
- [ ] Test all authentication flows in production
- [ ] Set up monitoring and error tracking
- [ ] Configure CORS for your production domain

## Support

If you encounter issues:

1. **Check server logs** - Look for errors in terminal where `npm run dev` is running
2. **Check browser console** - F12 → Console tab
3. **Check Supabase logs** - Dashboard → Logs
4. **Review API responses** - F12 → Network tab → Click on request → Response

## Summary

Your authentication system is now fully connected:

✅ Frontend login modal → Backend API → Supabase Auth + Database
✅ User registration with validation
✅ User login with JWT tokens
✅ Password reset functionality
✅ Guest checkout option
✅ Error handling and user feedback
✅ Secure password requirements

Happy testing! 🎉

