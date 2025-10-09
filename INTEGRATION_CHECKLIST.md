# Integration Checklist ✅

Use this checklist to ensure everything is properly connected and working.

---

## 🔧 Setup (Do This First)

- [ ] Environment variables are set in `.env`
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `JWT_SECRET`

- [ ] Database is seeded with test data
  ```bash
  psql -h your-db-host -U postgres -d postgres -f supabase/seed.sql
  ```

- [ ] Dependencies are installed
  ```bash
  npm install
  ```

- [ ] Development server starts without errors
  ```bash
  npm run dev
  ```

---

## 📝 Code Updates (Replace Old Components)

### 1. Update Cart Component

- [ ] Find all imports of `@/components/cart`
- [ ] Replace with `@/components/cart-connected`
- [ ] Test cart functionality

**Files to check:**
- `app/page.tsx`
- Any component that shows the cart

### 2. Update User Dashboard

- [ ] Find all imports of `@/components/userDashboard`
- [ ] Replace with `@/components/userDashboard-connected`
- [ ] Test dashboard functionality

**Files to check:**
- `app/page.tsx`
- Any component that shows user dashboard

### 3. Update Driver Portal

- [ ] Find imports of `@/components/driverPortal/OrdersSection`
- [ ] Replace with `@/components/driverPortal/OrdersSection-connected`
- [ ] Add `setSelectedOrder` prop
- [ ] Test driver portal

**Files to check:**
- `components/driverPortal.tsx`
- Any component that shows driver orders

---

## 🧪 Testing (Test Each Feature)

### Customer Flow

- [ ] **Browse Restaurants**
  - [ ] Navigate to `/restaurants`
  - [ ] See list of restaurants from database
  - [ ] Filter by location works
  - [ ] Sort options work

- [ ] **View Restaurant Menu**
  - [ ] Click on a restaurant
  - [ ] See menu items
  - [ ] Category tabs work (Main, Snacks, Drinks)
  - [ ] Menu items show correct prices

- [ ] **Add to Cart**
  - [ ] Click "Add to Cart" on menu item
  - [ ] Quantity selector works
  - [ ] Item appears in cart
  - [ ] Cart icon shows item count

- [ ] **Cart Functionality**
  - [ ] Open cart
  - [ ] See added items
  - [ ] Update quantity works
  - [ ] Remove item works
  - [ ] Cart persists after page refresh

- [ ] **Checkout Process**
  - [ ] Fill delivery address (street, city, postal code)
  - [ ] Select delivery time
  - [ ] Enter voucher code (optional)
  - [ ] See correct totals (subtotal + delivery fee)
  - [ ] Click "Place Order"
  - [ ] See success message
  - [ ] Cart is cleared

- [ ] **Order History**
  - [ ] Login as customer
  - [ ] Open user dashboard
  - [ ] Click "ORDERS" tab
  - [ ] See placed orders
  - [ ] Order details are correct

- [ ] **Favorites**
  - [ ] Click "FAVOURITES" tab
  - [ ] See saved favorites (if any)
  - [ ] Add item to cart from favorites
  - [ ] Remove favorite works

- [ ] **Loyalty Points**
  - [ ] Click "LOYALTY POINTS" tab
  - [ ] See current balance
  - [ ] See lifetime points
  - [ ] Redeem points for discount
  - [ ] Get voucher code
  - [ ] Points are deducted

- [ ] **Account Info**
  - [ ] Click "ACCOUNT" tab
  - [ ] See user information
  - [ ] Name, email, phone displayed correctly

### Driver Flow

- [ ] **Login as Driver**
  - [ ] Use driver credentials: `driver@delivery.com` / `password123`
  - [ ] Successfully login
  - [ ] Redirected to driver portal

- [ ] **View Available Orders**
  - [ ] See "NEW" tab with available orders
  - [ ] Order count is correct
  - [ ] Orders show restaurant and delivery info

- [ ] **Accept Order**
  - [ ] Click "ACCEPT" on an order
  - [ ] Order moves to "ASSIGNED TO ME" tab
  - [ ] Order count updates

- [ ] **View Assigned Orders**
  - [ ] Click "ASSIGNED TO ME" tab
  - [ ] See accepted orders
  - [ ] Order details are correct

- [ ] **Order History**
  - [ ] Click "ORDER HISTORY" tab
  - [ ] See completed deliveries
  - [ ] Earnings are shown

- [ ] **Change Pickup Zone**
  - [ ] Click "CHANGE PICK UP ZONE"
  - [ ] Select different zone
  - [ ] Click "SAVE"
  - [ ] Zone updates
  - [ ] Orders filter by new zone

- [ ] **Auto-refresh**
  - [ ] Wait 30 seconds
  - [ ] Orders refresh automatically
  - [ ] New orders appear if available

### Authentication

- [ ] **Register**
  - [ ] Click register
  - [ ] Fill form (name, email, password)
  - [ ] Password validation works
  - [ ] Account created successfully
  - [ ] Redirected after registration

- [ ] **Login**
  - [ ] Enter email and password
  - [ ] Login successful
  - [ ] Token stored in localStorage
  - [ ] User data stored in localStorage

- [ ] **Logout**
  - [ ] Click logout
  - [ ] Token removed
  - [ ] Redirected to home

- [ ] **Password Reset**
  - [ ] Click "Forgot Password"
  - [ ] Enter email
  - [ ] Reset email sent (check console/logs)

---

## 🔍 Technical Checks

### Browser Console

- [ ] No errors in console
- [ ] No warnings about missing dependencies
- [ ] API calls return 200 status
- [ ] No CORS errors

### Network Tab

- [ ] API calls to `/api/restaurants` work
- [ ] API calls to `/api/orders` work
- [ ] API calls to `/api/customers/*` work
- [ ] API calls to `/api/drivers/*` work
- [ ] Authentication headers are sent

### LocalStorage

- [ ] `cart` key exists and contains items
- [ ] `accessToken` exists after login
- [ ] `user` exists after login
- [ ] Data persists after refresh

### Database

- [ ] Orders are created in database
- [ ] Favorites are saved
- [ ] Loyalty points are updated
- [ ] Order status changes are saved

---

## 🐛 Common Issues to Check

- [ ] **Cart not persisting**
  - Check if `CartProvider` is in `client-wrapper.tsx`
  - Check browser localStorage

- [ ] **401 Unauthorized errors**
  - Check if user is logged in
  - Check if token exists in localStorage
  - Check if token is expired

- [ ] **No orders showing**
  - Check if database has orders
  - Check if user ID is correct
  - Check API response in network tab

- [ ] **Driver can't see orders**
  - Check if orders have status 'ready_for_pickup'
  - Check if pickup zone matches
  - Check if driver is logged in

- [ ] **TypeScript errors**
  - Run `npm run build` to check for errors
  - Fix any type errors

---

## 📊 Performance Checks

- [ ] Pages load quickly (< 2 seconds)
- [ ] Images load properly
- [ ] No memory leaks (check browser task manager)
- [ ] Cart operations are instant
- [ ] API calls complete in reasonable time

---

## 🔒 Security Checks

- [ ] Passwords are not visible in network tab
- [ ] Tokens are not exposed in console
- [ ] API endpoints require authentication
- [ ] User can only see their own data
- [ ] Driver can only see orders in their zone

---

## 📱 Mobile Testing (Optional)

- [ ] Test on mobile device or emulator
- [ ] All features work on mobile
- [ ] UI is responsive
- [ ] Touch interactions work
- [ ] Cart works on mobile

---

## 🚀 Production Readiness (Before Deploy)

- [ ] All tests pass
- [ ] No console errors
- [ ] Environment variables set for production
- [ ] Database migrations run on production
- [ ] SSL certificate configured
- [ ] Error monitoring set up (Sentry, etc.)
- [ ] Backup strategy in place

---

## ✅ Final Verification

- [ ] Customer can complete full order flow
- [ ] Driver can accept and complete delivery
- [ ] All data persists correctly
- [ ] No critical bugs
- [ ] Performance is acceptable
- [ ] Security measures in place

---

## 📝 Notes

Use this space to track any issues or observations:

```
Issue 1: [Description]
Solution: [How you fixed it]

Issue 2: [Description]
Solution: [How you fixed it]
```

---

## 🎉 Completion

Once all items are checked:

- [ ] All features tested and working
- [ ] No critical issues remaining
- [ ] Documentation reviewed
- [ ] Ready for production deployment

**Congratulations! Your food delivery platform is fully integrated and ready to use!** 🎊

---

## 📞 Support

If you need help:
1. Check `FINAL_INTEGRATION_GUIDE.md`
2. Review `INTEGRATION_COMPLETE_SUMMARY.md`
3. Check API docs in `README_BACKEND.md`
4. Review troubleshooting section in guides

---

**Last Updated**: [Add date when you complete this checklist]
**Completed By**: [Your name]
**Status**: [ ] In Progress  [ ] Complete
