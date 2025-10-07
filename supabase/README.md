# Supabase Database Setup

This directory contains all database migrations and configuration for the food delivery backend.

## Prerequisites

1. Create a Supabase project at https://supabase.com
2. Get your project credentials:
   - Project URL
   - Service Role Key (for server-side operations)
   - Anon Key (for client-side operations)

## Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the following environment variables in `.env`:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   ```

## Database Migration

### Option 1: Using Supabase CLI (Recommended)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. Run migrations:
   ```bash
   supabase db push
   ```

### Option 2: Manual Migration via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration files in order:
   - `migrations/001_initial_schema.sql`
   - `migrations/002_indexes.sql`
   - `migrations/003_triggers.sql`
   - `migrations/004_rls_policies.sql`
   - `storage/buckets.sql`

## Storage Buckets

The following storage buckets will be created:

- `restaurant-images` (public) - Restaurant logos and cover images
- `menu-images` (public) - Menu item images
- `driver-documents` (private) - Driver license and vehicle documents
- `user-avatars` (public) - User profile pictures

## Database Schema

### Tables

1. **users** - User accounts with role-based access
2. **restaurants** - Restaurant profiles and information
3. **menu_items** - Menu items for each restaurant
4. **orders** - Customer orders with delivery details
5. **order_items** - Individual items in each order
6. **drivers** - Delivery driver profiles
7. **loyalty_points** - Customer loyalty points balance
8. **loyalty_transactions** - History of loyalty points earned/redeemed
9. **vouchers** - Discount vouchers and promo codes
10. **favorites** - Customer favorite menu items
11. **notifications** - User notifications
12. **activity_logs** - Audit logs for admin actions

### Indexes

Performance indexes are created for:
- Frequently queried fields (email, status, city, region)
- Foreign key relationships
- Composite indexes for common query patterns
- GIN indexes for array fields (cuisine_types, dietary_tags)

### Row Level Security (RLS)

RLS policies are enabled on all tables to ensure:
- Users can only access their own data
- Restaurant owners can only manage their restaurants
- Drivers can only see their assigned orders
- Super admins have full access to all data

## Testing the Setup

After running migrations, verify the setup:

1. Check that all tables are created:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

2. Check that indexes are created:
   ```sql
   SELECT indexname FROM pg_indexes 
   WHERE schemaname = 'public';
   ```

3. Check that storage buckets are created:
   ```sql
   SELECT * FROM storage.buckets;
   ```

## Troubleshooting

### Migration Errors

If you encounter errors during migration:

1. Check that UUID extension is enabled:
   ```sql
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   ```

2. Verify that you're using the service role key (not anon key) for migrations

3. Check Supabase logs in the dashboard for detailed error messages

### Connection Issues

If you can't connect to the database:

1. Verify environment variables are set correctly
2. Check that your IP is allowed in Supabase project settings
3. Ensure you're using the correct project URL

### Storage Issues

If file uploads fail:

1. Verify storage buckets are created
2. Check storage policies are applied
3. Ensure file size limits are not exceeded
4. Verify file types are allowed

## Next Steps

After setting up the database:

1. Run the seed script to populate test data (if available)
2. Test API endpoints with the database
3. Configure authentication settings in Supabase dashboard
4. Set up email templates for notifications
5. Configure CORS settings for your frontend domain
