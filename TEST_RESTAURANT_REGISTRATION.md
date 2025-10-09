# Test Restaurant Registration

## ✅ Backend Connected!

The restaurant registration form is now fully connected to the backend APIs.

## How to Test

1. **Start the dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Navigate to the registration page**:
   - Go to `http://localhost:3000`
   - Scroll to footer and click "PARTNER WITH US"
   - Or go directly to: `http://localhost:3000/partner-restaurant`

3. **Fill out the form**:
   - **Contact Details**:
     - First Name: `John`
     - Last Name: `Doe`
     - Phone: `+41 79 123 4567`
     - Email: `john.doe@myrestaurant.ch` (use a unique email)
     - Password: `SecurePass123`
     - Confirm Password: `SecurePass123`
   
   - **Restaurant Information**:
     - Restaurant Name: `My African Restaurant`
     - City: `Basel`
     - Postal Code: `4000`
     - Street: `Hauptstrasse 123`
   
   - **Cuisine Types**: Check one or more:
     - ☑ Ethiopian
     - ☑ Eritrean
     - ☐ Kenyan
     - ☐ Ghana
     - ☐ Nigeria
   
   - **Other Specialty**: (optional) `Somali`

4. **Submit the form**

5. **Check the results**:
   - You should see a success message
   - The form will create:
     - ✅ A user account with `restaurant_owner` role
     - ✅ A restaurant with `pending` status

## Verify in Database

After submitting, you can verify the data was saved:

```sql
-- Check the new user
SELECT id, email, first_name, last_name, role, created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 1;

-- Check the new restaurant
SELECT id, name, email, city, status, owner_id, cuisine_types, created_at 
FROM restaurants 
ORDER BY created_at DESC 
LIMIT 1;
```

## What Happens Next

1. **Restaurant Status**: The restaurant is created with `pending` status
2. **Admin Approval**: A super admin needs to approve it
3. **Restaurant Goes Live**: After approval, status changes to `active`
4. **Owner Can Login**: The restaurant owner can login with their email/password
5. **Manage Restaurant**: Owner can add menu items, manage orders, etc.

## Test Different Scenarios

### Test 1: Successful Registration
- Use a unique email
- Fill all required fields
- Should succeed ✅

### Test 2: Duplicate Email
- Try to register with the same email again
- Should fail with error: "User already exists" ❌

### Test 3: Password Mismatch
- Enter different passwords in password fields
- Should fail with error: "Passwords do not match" ❌

### Test 4: Short Password
- Enter password less than 8 characters
- Should fail with error: "Password must be at least 8 characters long" ❌

### Test 5: Missing Required Fields
- Leave some required fields empty
- Should fail with error: "Please fill in all required fields" ❌

### Test 6: Multiple Cuisine Types
- Select multiple cuisine types
- Should save all selected types ✅

## Login After Registration

After successful registration, you can login:

1. Go to the main page
2. Click "LOGIN" in the header
3. Use the email and password you registered with
4. You should be logged in as a restaurant owner

## Admin Approval Process

To approve the restaurant (as super admin):

1. Login as super admin: `admin@eatafrican.ch` / `password123`
2. Go to admin dashboard
3. Find the pending restaurant
4. Approve it
5. Restaurant status changes to `active`
6. Restaurant now appears in customer listings

---

**Ready to test!** 🚀
