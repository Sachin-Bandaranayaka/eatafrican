# 🍽️ Restaurant Management Workflow Guide

## Your Restaurant Status: PENDING ⏳

Your restaurant "sachin's restaurant" is currently **pending approval**. Here's what you need to do:

---

## 📋 Complete Workflow

### Step 1: Approve Your Restaurant (As Super Admin)

Since there's no admin UI yet, you can approve it via API or directly in the database.

#### Option A: Approve via API (Recommended)

```bash
# Login as super admin first
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@eatafrican.ch",
    "password": "password123"
  }'

# Copy the token from the response, then approve the restaurant
curl -X PATCH http://localhost:3000/api/admin/restaurants/b338d826-1328-4abd-8468-689dcee8dbe5/approve \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "status": "active",
    "notes": "Restaurant approved - all requirements met"
  }'
```

#### Option B: Approve Directly in Database (Quick & Easy)

I can do this for you right now using Supabase MCP!

---

### Step 2: View Your Restaurant on Website

Once approved (status = 'active'), your restaurant will appear:

**Customer View:**
- Go to: `http://localhost:3000/restaurants`
- Filter by city: "test" (your city)
- Your restaurant will appear in the list

**Direct Link:**
- `http://localhost:3000/restaurant/b338d826-1328-4abd-8468-689dcee8dbe5`

---

### Step 3: Login as Restaurant Owner

**Your Login Credentials:**
- Email: `sachinbandaranayaka505@gmail.com`
- Password: (the password you created during registration)

**Where to Login:**
- Go to: `http://localhost:3000`
- Click "LOGIN" in the header
- Enter your credentials

---

### Step 4: Manage Your Restaurant

After logging in as restaurant owner, you can:

#### A. Add Menu Items

**API Endpoint:** `POST /api/restaurants/{restaurantId}/menu`

```bash
curl -X POST http://localhost:3000/api/restaurants/b338d826-1328-4abd-8468-689dcee8dbe5/menu \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Injera with Doro Wat",
    "description": "Traditional Ethiopian dish with spicy chicken stew",
    "price": 28.50,
    "category": "Main Dishes",
    "isAvailable": true,
    "preparationTime": 25,
    "imageUrl": null
  }'
```

#### B. View Your Restaurant Orders

**API Endpoint:** `GET /api/restaurants/{restaurantId}/orders`

```bash
curl -X GET http://localhost:3000/api/restaurants/b338d826-1328-4abd-8468-689dcee8dbe5/orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### C. Update Restaurant Information

**API Endpoint:** `PATCH /api/restaurants/{restaurantId}`

```bash
curl -X PATCH http://localhost:3000/api/restaurants/b338d826-1328-4abd-8468-689dcee8dbe5 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "description": "Authentic Eritrean cuisine in the heart of test city",
    "phone": "+41 79 999 8888",
    "minOrderAmount": 30.00
  }'
```

---

## 🎯 Quick Actions

### I Want To: See My Restaurant on the Website NOW

**Let me approve it for you!** Just say "approve my restaurant" and I'll update the status to 'active' using Supabase MCP.

### I Want To: Add Menu Items

**Two options:**
1. Use the API endpoints above (after getting your auth token)
2. I can help you create a restaurant owner dashboard UI

### I Want To: Manage Orders

**API is ready!** You can:
- View all orders for your restaurant
- Update order status (confirmed, preparing, ready, etc.)
- View order details

---

## 📊 Your Restaurant Details

```
Restaurant ID: b338d826-1328-4abd-8468-689dcee8dbe5
Name: sachin's restaurant
Email: sachinbandaranayaka505@gmail.com
City: test
Postal Code: 3532
Address: test
Status: pending → needs to be 'active'
Cuisine Types: Eritrean
Owner ID: cb1ac2e1-88be-4ea2-a6cc-9aa01a59dbc7
```

---

## 🚀 Next Steps

1. **Approve the restaurant** (I can do this for you)
2. **Add menu items** (so customers can order)
3. **Test the customer flow** (browse, add to cart, checkout)
4. **Receive orders** (via API or dashboard)
5. **Manage orders** (update status, mark as ready)

---

## 🛠️ Missing Features (Can Be Built)

### Restaurant Owner Dashboard UI
Currently, there's no UI for restaurant owners. You can:
- Use API endpoints directly
- Or I can build a restaurant owner dashboard with:
  - Menu management (add/edit/delete items)
  - Order management (view/update orders)
  - Restaurant settings
  - Analytics

### Admin Dashboard UI
Currently, there's no UI for admins. You can:
- Use API endpoints directly
- Or I can build an admin dashboard with:
  - Approve/reject restaurants
  - Approve/reject drivers
  - View all orders
  - Manage users
  - View analytics

---

## 💡 What Would You Like To Do?

1. **Approve your restaurant** → I can do this now
2. **Add menu items** → I can help with API calls or build a UI
3. **Build restaurant owner dashboard** → Full UI for managing your restaurant
4. **Build admin dashboard** → Full UI for admin tasks
5. **Test the customer flow** → Order from your restaurant

Just let me know what you'd like to do next!
