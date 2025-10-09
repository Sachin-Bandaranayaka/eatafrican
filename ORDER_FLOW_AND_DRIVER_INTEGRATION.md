# Order Flow & Driver Integration Guide

## 🔄 Complete Order Process Flow

### Phase 1: Customer Orders (Status: `new`)
1. Customer browses restaurants
2. Adds items to cart
3. Fills delivery details
4. Places order
5. **Order created with status: `new`**

---

### Phase 2: Restaurant Processing
6. Restaurant owner logs in at `/restaurant-owner`
7. Clicks "Orders" tab to see new orders
8. **Confirms order** → Status: `new` → `confirmed`
9. **Starts preparing** → Status: `confirmed` → `preparing`
10. **Marks as ready** → Status: `preparing` → `ready_for_pickup`
    - ✅ **This makes the order visible to drivers!**

---

### Phase 3: Driver Assignment & Delivery
11. Order with status `ready_for_pickup` appears in driver's "Available Orders"
12. Driver sees order in their portal at `/driver-portal`
13. **Driver accepts order** → Status: `ready_for_pickup` → `assigned`
    - Driver ID is attached to the order
    - Customer gets notification
14. **Driver picks up** → Status: `assigned` → `out_for_delivery`
15. **Driver delivers** → Status: `out_for_delivery` → `delivered`

---

## 🚚 Driver Portal Features

### Location
- **URL**: `/driver-portal` (accessible from header "DRIVER PORTAL" button)
- **Component**: `components/driverPortal.tsx`
- **Orders Component**: `components/driverPortal/OrdersSection-connected.tsx`

### Features
1. **NEW Tab** - Shows available orders (status: `ready_for_pickup`)
   - Displays restaurant location
   - Delivery address
   - Scheduled delivery time
   - Order amount
   - **ACCEPT button** to claim the order

2. **ASSIGNED TO ME Tab** - Shows driver's accepted orders
   - Orders with status: `assigned` or `out_for_delivery`
   - Can view details and manage delivery

3. **ORDER HISTORY Tab** - Shows completed deliveries
   - Orders with status: `delivered`

4. **Pickup Zone Selection**
   - Drivers can set their pickup zone (Basel, Bern, Luzern, Olten, Zürich)
   - Only see orders from restaurants in their zone

5. **Auto-refresh**
   - Orders refresh every 30 seconds automatically

---

## 🔧 Fixes Applied

### 1. Status Naming Consistency ✅
**Problem**: Restaurant owner was setting status to `ready` but driver endpoint expected `ready_for_pickup`

**Fixed in**: `app/restaurant-owner/page.tsx`
- Changed button to set status to `ready_for_pickup`
- Added status badge for `assigned` status
- Added helpful message when marking order as ready

### 2. Restaurant Orders API ✅
**Created**: `app/api/restaurants/[id]/orders/route.ts`
- Fetches all orders for a specific restaurant
- Includes order items and menu item details
- Requires restaurant ownership authentication

---

## 📊 Order Status Flow Chart

```
┌─────────────────────────────────────────────────────────────┐
│                    ORDER STATUS FLOW                         │
└─────────────────────────────────────────────────────────────┘

Customer Places Order
         ↓
    [new] ← System creates order
         ↓
    Restaurant confirms
         ↓
    [confirmed]
         ↓
    Restaurant starts preparing
         ↓
    [preparing]
         ↓
    Restaurant marks ready
         ↓
    [ready_for_pickup] ← Order appears in driver's "NEW" tab
         ↓
    Driver accepts order
         ↓
    [assigned] ← Order moves to driver's "ASSIGNED TO ME" tab
         ↓
    Driver picks up from restaurant
         ↓
    [out_for_delivery]
         ↓
    Driver delivers to customer
         ↓
    [delivered] ← Order moves to driver's "ORDER HISTORY" tab
```

---

## 🎯 Testing the Complete Flow

### Step 1: Place an Order (Customer)
1. Browse restaurants at `http://localhost:3000/restaurants`
2. Select a restaurant and add items to cart
3. Click cart icon → "CONTINUE AS GUEST"
4. Fill delivery details
5. Click "PLACE YOUR ORDER"
6. ✅ Order created with status: `new`

### Step 2: Process Order (Restaurant Owner)
1. Login at `http://localhost:3000/restaurant-owner`
2. Click "Orders" tab
3. See the new order
4. Click "Confirm Order" → Status: `confirmed`
5. Click "Start Preparing" → Status: `preparing`
6. Click "Mark as Ready" → Status: `ready_for_pickup`
7. ✅ Alert: "Order marked as ready! Drivers can now see and accept this order."

### Step 3: Accept & Deliver (Driver)
1. Login at driver portal (click "DRIVER PORTAL" in header)
2. Click "NEW" tab
3. See the available order
4. Click "ACCEPT" button
5. ✅ Order status changes to `assigned`
6. Order moves to "ASSIGNED TO ME" tab
7. Driver can now proceed with pickup and delivery

---

## 🔑 Key API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/orders` | POST | Create new order |
| `/api/orders/[id]/status` | PATCH | Update order status |
| `/api/restaurants/[id]/orders` | GET | Get restaurant's orders |
| `/api/drivers/available-orders` | GET | Get orders ready for pickup |
| `/api/drivers/[id]/orders` | GET | Get driver's assigned orders |
| `/api/drivers/[id]/orders/[orderId]/accept` | POST | Driver accepts order |

---

## 📝 Important Notes

1. **Pickup Zones**: Drivers can only see orders from restaurants in their assigned pickup zone

2. **Order Validation**: The accept endpoint validates:
   - Order status is `ready_for_pickup`
   - Order is not already assigned
   - Restaurant is in driver's pickup zone
   - Driver account is active

3. **Notifications**: When driver accepts order, customer receives notification with driver details

4. **Real-time Updates**: Driver portal auto-refreshes every 30 seconds

5. **Status Transitions**: Each status can only transition to specific next statuses (enforced by API)

---

## 🚀 Next Steps

To complete the driver flow, you may want to add:
1. Driver pickup confirmation screen
2. Driver delivery confirmation screen
3. Real-time order tracking for customers
4. Push notifications for status changes
5. Driver earnings calculation

---

## 🐛 Troubleshooting

**Orders not showing in driver portal?**
- Check order status is `ready_for_pickup`
- Verify restaurant region matches driver's pickup zone
- Check driver is logged in with role 'driver'

**Can't accept order?**
- Verify order hasn't been accepted by another driver
- Check driver account status is 'active'
- Ensure pickup zone matches

**Restaurant can't see orders?**
- Verify restaurant owner is logged in
- Check restaurant ID matches order's restaurant_id
- Refresh the Orders tab
