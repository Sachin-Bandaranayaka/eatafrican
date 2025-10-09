# Frontend-Backend Integration Plan

## Current Status

### ✅ Already Connected
1. **Authentication System** (`components/login-modal.tsx`)
   - Login, Register, Password Reset
   - Uses `/lib/auth/client.ts`

2. **Restaurant Listing** (`app/restaurants/RestaurantsClient.tsx`)
   - Fetches from `/api/restaurants`
   - Filters by location and cuisine

### ❌ Not Connected (Using Mock/Hardcoded Data)

#### 1. Restaurant Menu Page (`app/restaurant/[id]/page.tsx`)
**Current**: Uses hardcoded `mockRestaurant` and `mockMenuItems`
**Needs**: 
- Fetch restaurant details from `/api/restaurants/[id]`
- Fetch menu items from `/api/restaurants/[id]/menu`
- Implement category filtering (main, snacks, drinks)
- Fetch and display reviews

#### 2. View Menu Component (`components/view-menu.tsx`)
**Current**: Uses hardcoded `meals` array
**Needs**:
- Fetch menu items from API
- Connect "Add to Cart" functionality
- Connect favorites (heart icon)
- Implement filter and sort

#### 3. Cart Component (`components/cart.tsx`)
**Current**: Hardcoded cart items
**Needs**:
- Implement cart state management
- Connect to order creation API `/api/orders`
- Implement voucher validation
- Calculate delivery fees based on address
- Payment integration

#### 4. User Dashboard (`components/userDashboard.tsx`)
**Current**: Hardcoded orders and favorites
**Needs**:
- Fetch user orders from `/api/customers/[id]/orders`
- Fetch favorites from `/api/customers/[id]/favorites`
- Fetch loyalty points from `/api/customers/[id]/loyalty`
- Implement account management
- Connect order tracking

#### 5. Driver Portal (`components/driverPortal.tsx` and related)
**Current**: Likely using mock data
**Needs**:
- Fetch available orders from `/api/drivers/available-orders`
- Accept orders via `/api/drivers/[id]/orders/[orderId]/accept`
- Update order status
- View earnings

#### 6. Restaurant Owner Dashboard (`components/admin/dashboard/`)
**Current**: Needs investigation
**Needs**:
- Fetch restaurant orders
- Manage menu items
- Update restaurant info

#### 7. Super Admin Dashboard (`components/superAdmin/`)
**Current**: Multiple views need connection
**Needs**:
- Connect to all admin APIs
- Restaurant approval
- Driver approval
- Analytics
- Settings management

## Implementation Priority

### Phase 1: Core Customer Experience (HIGH PRIORITY)
1. ✅ Restaurant Menu Page - Connect to backend
2. ✅ Cart System - Implement cart state and order creation
3. ✅ User Dashboard - Orders and favorites

### Phase 2: Service Provider Portals (MEDIUM PRIORITY)
4. Driver Portal - Order management
5. Restaurant Owner Dashboard - Menu and order management

### Phase 3: Admin Features (LOWER PRIORITY)
6. Super Admin Dashboard - Full admin functionality

## Next Steps

1. Create a global cart context/state management
2. Connect restaurant menu page to backend
3. Implement cart functionality with order creation
4. Connect user dashboard to backend APIs
5. Test end-to-end customer flow
