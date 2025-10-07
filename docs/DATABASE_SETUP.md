# Database Setup Guide

This guide provides detailed instructions for setting up the Supabase database for the food delivery backend.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Manual Setup](#manual-setup)
4. [Database Schema](#database-schema)
5. [Environment Configuration](#environment-configuration)
6. [Testing the Setup](#testing-the-setup)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before setting up the database, ensure you have:

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Supabase Project**: Create a new project in your Supabase dashboard
3. **Node.js**: Version 18 or higher
4. **npm**: Comes with Node.js

## Quick Start

### Option 1: Automated Setup (Recommended)

1. **Run the setup script**:
   ```bash
   npm run setup:db
   ```
   
   Or directly:
   ```bash
   ./scripts/setup-database.sh
   ```

2. **Follow the prompts** to:
   - Configure environment variables
   - Run migrations
   - Seed test data (optional)

### Option 2: Manual Setup

Follow the [Manual Setup](#manual-setup) section below.

## Manual Setup

### Step 1: Get Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (for client-side operations)
   - **service_role key** (for server-side operations)

### Step 2: Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SUPABASE_ANON_KEY=your-anon-key
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   ```

### Step 3: Run Database Migrations

#### Option A: Using Supabase CLI

1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```
   
   Find your project ref in the Supabase dashboard URL:
   `https://app.supabase.com/project/[project-ref]`

4. **Run migrations**:
   ```bash
   supabase db push
   ```

#### Option B: Manual Execution via Dashboard

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Execute the following files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_indexes.sql`
   - `supabase/migrations/003_triggers.sql`
   - `supabase/migrations/004_rls_policies.sql`
   - `supabase/storage/buckets.sql`

### Step 4: Seed Test Data (Optional)

To populate the database with test data for development:

1. **Via Supabase CLI**:
   ```bash
   supabase db execute --file supabase/seed.sql
   ```

2. **Via Dashboard**:
   - Open SQL Editor
   - Copy contents of `supabase/seed.sql`
   - Execute the query

## Database Schema

### Tables Overview

| Table | Description | Key Features |
|-------|-------------|--------------|
| `users` | User accounts | Role-based access (customer, restaurant_owner, driver, super_admin) |
| `restaurants` | Restaurant profiles | Multi-cuisine support, geolocation, opening hours |
| `menu_items` | Menu items | Multi-language support, dietary tags, categories |
| `orders` | Customer orders | Complete order lifecycle tracking |
| `order_items` | Order line items | Snapshot of items at order time |
| `drivers` | Delivery drivers | Zone-based assignment, earnings tracking |
| `loyalty_points` | Customer loyalty | Points balance, referral codes |
| `loyalty_transactions` | Loyalty history | Earned, redeemed, referral bonuses |
| `vouchers` | Discount codes | Percentage or fixed amount discounts |
| `favorites` | Customer favorites | Quick access to preferred items |
| `notifications` | User notifications | Order updates, promotions, system messages |
| `activity_logs` | Audit trail | Admin actions, status changes |

### Storage Buckets

| Bucket | Access | Purpose |
|--------|--------|---------|
| `restaurant-images` | Public | Restaurant logos and cover images |
| `menu-images` | Public | Menu item photos |
| `driver-documents` | Private | Driver licenses and vehicle documents |
| `user-avatars` | Public | User profile pictures |

### Key Relationships

```
users (1) ──→ (N) restaurants (owner_id)
users (1) ──→ (1) drivers (user_id)
users (1) ──→ (N) orders (customer_id)
restaurants (1) ──→ (N) menu_items
restaurants (1) ──→ (N) orders
orders (1) ──→ (N) order_items
drivers (1) ──→ (N) orders (driver_id)
users (1) ──→ (1) loyalty_points
users (1) ──→ (N) loyalty_transactions
users (1) ──→ (N) favorites
users (1) ──→ (N) notifications
```

## Environment Configuration

### Required Variables

```env
# Supabase Configuration
SUPABASE_URL=                    # Your Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=       # Service role key (server-side)
SUPABASE_ANON_KEY=               # Anon key (client-side)

# JWT Configuration
JWT_SECRET=                      # Secret for JWT token signing
JWT_EXPIRES_IN=24h              # Access token expiration
JWT_REFRESH_EXPIRES_IN=7d       # Refresh token expiration
```

### Optional Variables

```env
# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000     # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880           # 5MB in bytes
ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp

# Delivery Configuration
DEFAULT_DELIVERY_RADIUS=10      # km
DEFAULT_DELIVERY_FEE=2.99       # CHF
```

## Testing the Setup

### 1. Verify Tables

Run this query in Supabase SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

Expected tables:
- activity_logs
- drivers
- favorites
- loyalty_points
- loyalty_transactions
- menu_items
- notifications
- order_items
- orders
- restaurants
- users
- vouchers

### 2. Verify Indexes

```sql
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
```

### 3. Verify Storage Buckets

```sql
SELECT * FROM storage.buckets;
```

Expected buckets:
- restaurant-images
- menu-images
- driver-documents
- user-avatars

### 4. Test Data (if seeded)

```sql
-- Check users
SELECT email, role FROM users;

-- Check restaurants
SELECT name, city, status FROM restaurants;

-- Check menu items
SELECT name, price, category FROM menu_items LIMIT 5;
```

### 5. Test API Connection

Create a test file `test-db-connection.ts`:

```typescript
import { supabaseAdmin } from './lib/supabase/config';

async function testConnection() {
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) throw error;
    
    console.log('✅ Database connection successful!');
    console.log('User count:', data);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testConnection();
```

Run with:
```bash
npx tsx test-db-connection.ts
```

## Troubleshooting

### Issue: "Missing environment variables"

**Solution**: Ensure all required variables are set in `.env`:
```bash
# Check if variables are loaded
node -e "require('dotenv').config(); console.log(process.env.SUPABASE_URL)"
```

### Issue: "Connection timeout"

**Possible causes**:
1. Incorrect Supabase URL
2. Network/firewall issues
3. Supabase project paused (free tier)

**Solution**:
- Verify URL in Supabase dashboard
- Check project status
- Ensure project is not paused

### Issue: "Permission denied" errors

**Possible causes**:
1. Using anon key instead of service role key
2. RLS policies blocking access

**Solution**:
- Use service role key for server-side operations
- Check RLS policies in Supabase dashboard

### Issue: "Table already exists" during migration

**Solution**:
- Drop existing tables if safe to do so
- Or skip to next migration file

```sql
-- Drop all tables (WARNING: This deletes all data!)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

### Issue: "Storage bucket creation failed"

**Solution**:
1. Check if buckets already exist
2. Manually create via Supabase dashboard:
   - Go to **Storage**
   - Click **New bucket**
   - Set name and public/private access

### Issue: "Row Level Security blocking queries"

**Solution**:
- Use service role key which bypasses RLS
- Or adjust RLS policies for your use case

### Issue: "Seed data insertion fails"

**Possible causes**:
1. Duplicate IDs
2. Foreign key constraints

**Solution**:
- Clear existing data first
- Or modify seed.sql to use different IDs

## Next Steps

After successful setup:

1. ✅ **Verify all tables and indexes are created**
2. ✅ **Test database connection from your application**
3. ✅ **Configure authentication settings in Supabase dashboard**
4. ✅ **Set up email templates for notifications**
5. ✅ **Configure CORS for your frontend domain**
6. ✅ **Start implementing API endpoints**

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

## Support

If you encounter issues not covered in this guide:

1. Check Supabase logs in the dashboard
2. Review error messages carefully
3. Consult Supabase documentation
4. Check project status and quotas
