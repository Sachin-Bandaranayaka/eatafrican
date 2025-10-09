# Restaurant Management Features - Admin Portal

## Overview
Enhanced the admin portal with comprehensive restaurant management capabilities including deactivation, reactivation, and permanent deletion.

## New Features

### 1. Deactivate Restaurant (Soft Delete)
**Endpoint:** `PATCH /api/admin/restaurants/[id]/deactivate`

**What it does:**
- Changes restaurant status to `inactive`
- Hides restaurant from customers
- Preserves all data (menu items, order history, etc.)
- Can be reversed with reactivation
- Sends notification to restaurant owner
- Creates activity log entry

**UI Location:** Active restaurants list → "DEACTIVATE" button

---

### 2. Reactivate Restaurant
**Endpoint:** `PATCH /api/admin/restaurants/[id]/reactivate`

**What it does:**
- Changes restaurant status back to `active`
- Makes restaurant visible to customers again
- Restores full functionality
- Sends notification to restaurant owner
- Creates activity log entry

**UI Location:** Inactive restaurants list → "REACTIVATE" button

---

### 3. Delete Restaurant (Hard Delete)
**Endpoint:** `DELETE /api/admin/restaurants/[id]/delete`

**What it does:**
- Permanently removes restaurant from database
- Deletes all associated data (based on DB cascade rules)
- Cannot be undone
- Requires double confirmation (confirm dialog + name typing)
- Sends notification to restaurant owner before deletion
- Creates activity log entry

**UI Location:** Active/Inactive restaurants list → "DELETE" button

**Safety Features:**
- Two-step confirmation process
- User must type restaurant name to confirm
- Clear warning about permanent deletion

---

## Admin Portal UI Changes

### Status Filter Views
The restaurant list now shows different actions based on the selected status:

1. **NEW REGISTRATION (Pending)**
   - APPROVE button (changes status to `active`)
   - REJECT button (changes status to `suspended`)

2. **ACTIVE**
   - DEACTIVATE button (changes status to `inactive`)
   - DELETE button (permanent deletion)

3. **INACTIVE**
   - REACTIVATE button (changes status to `active`)
   - DELETE button (permanent deletion)

---

## API Endpoints Summary

```typescript
// Existing endpoints
GET    /api/admin/restaurants              // List all restaurants
PATCH  /api/admin/restaurants/[id]/approve // Approve/reject pending

// New endpoints
PATCH  /api/admin/restaurants/[id]/deactivate  // Deactivate active restaurant
PATCH  /api/admin/restaurants/[id]/reactivate  // Reactivate inactive restaurant
DELETE /api/admin/restaurants/[id]/delete      // Permanently delete restaurant
```

---

## Files Modified

### Backend (API Routes)
- ✅ `app/api/admin/restaurants/[id]/deactivate/route.ts` (new)
- ✅ `app/api/admin/restaurants/[id]/reactivate/route.ts` (new)
- ✅ `app/api/admin/restaurants/[id]/delete/route.ts` (new)

### Frontend (Components)
- ✅ `components/superAdmin/restaurant/components/management/RestaurantManagementController-connected.tsx`
  - Added `handleDeactivate()` function
  - Added `handleReactivate()` function
  - Added `handleDelete()` function with double confirmation
  
- ✅ `components/superAdmin/restaurant/components/management/AllRestaurantsView-connected.tsx`
  - Added new props for action handlers
  - Added conditional action buttons based on restaurant status
  - Updated UI to show appropriate actions per status

---

## Security & Notifications

All endpoints:
- ✅ Require super admin authentication
- ✅ Create activity log entries
- ✅ Send notifications to restaurant owners
- ✅ Include IP address tracking
- ✅ Handle errors gracefully
- ✅ **Auto-redirect on token expiration** - If token expires, user is automatically logged out and redirected to login page

---

## Testing

To test these features:

1. **Login as super admin** at `/admin`
2. **Navigate to Restaurant section**
3. **Filter by status** to see different action buttons
4. **Test each action:**
   - Approve a pending restaurant
   - Deactivate an active restaurant
   - Reactivate an inactive restaurant
   - Delete a restaurant (requires name confirmation)

---

## Database Status Values

- `pending` - New registration awaiting approval
- `active` - Approved and operational
- `inactive` - Deactivated by admin (soft delete)
- `suspended` - Rejected by admin

---

## Future Enhancements

Potential additions:
- Bulk operations (deactivate/delete multiple restaurants)
- Scheduled deactivation
- Reason/notes field for deactivation
- Email notifications to restaurant owners
- Restore deleted restaurants (if implementing soft delete instead of hard delete)


---

## Authentication & Session Management

### Automatic Token Expiration Handling

All admin components now automatically handle expired authentication tokens:

**What happens when token expires:**
1. User attempts an action (view dashboard, approve restaurant, etc.)
2. API returns 401 Unauthorized
3. System automatically:
   - Clears all auth tokens from localStorage
   - Clears user data
   - Redirects to `/admin` login page
   - Shows login form

**Components with auto-logout:**
- ✅ Dashboard (`components/superAdmin/dashboard-connected.tsx`)
- ✅ Restaurant Management (`components/superAdmin/restaurant/components/management/RestaurantManagementController-connected.tsx`)
- ✅ All restaurant actions (approve, reject, deactivate, reactivate, delete)

**Benefits:**
- No more confusing error messages
- Seamless user experience
- Automatic cleanup of invalid sessions
- Prevents unauthorized actions with expired tokens

### Auth Helper Utility

Created `lib/utils/auth-helper.ts` with reusable functions:
- `handleAuthError()` - Clears storage and redirects to login
- `getAuthToken()` - Gets token from localStorage
- `isAuthenticated()` - Checks if user is authenticated
- `fetchWithAuth()` - Fetch wrapper with automatic 401 handling

This can be used in other admin components for consistent auth handling.
