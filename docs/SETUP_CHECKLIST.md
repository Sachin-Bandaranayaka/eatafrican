# Database Setup Checklist

Use this checklist to verify that your database infrastructure is properly set up.

## Pre-Setup

- [ ] Supabase account created
- [ ] Supabase project created
- [ ] Node.js 18+ installed
- [ ] Project dependencies installed (`npm install`)

## Configuration

- [ ] `.env` file created from `.env.example`
- [ ] `SUPABASE_URL` configured
- [ ] `SUPABASE_SERVICE_ROLE_KEY` configured
- [ ] `SUPABASE_ANON_KEY` configured
- [ ] `JWT_SECRET` set to a secure random value

## Database Schema

### Tables Created
- [ ] `users` table exists
- [ ] `restaurants` table exists
- [ ] `menu_items` table exists
- [ ] `orders` table exists
- [ ] `order_items` table exists
- [ ] `drivers` table exists
- [ ] `loyalty_points` table exists
- [ ] `loyalty_transactions` table exists
- [ ] `vouchers` table exists
- [ ] `favorites` table exists
- [ ] `notifications` table exists
- [ ] `activity_logs` table exists

### Indexes Created
- [ ] User indexes (email, role, status)
- [ ] Restaurant indexes (city, region, status, cuisine_types)
- [ ] Menu item indexes (restaurant_id, category, dietary_tags)
- [ ] Order indexes (customer, restaurant, driver, status)
- [ ] Driver indexes (user_id, status, pickup_zone)
- [ ] Loyalty indexes (customer_id, referral_code)
- [ ] Voucher indexes (code, status)
- [ ] Notification indexes (user_id, type, read)

### Triggers Created
- [ ] `update_updated_at_column` function exists
- [ ] Updated_at triggers on all relevant tables
- [ ] `generate_order_number` function exists
- [ ] Order number trigger on orders table
- [ ] `generate_referral_code` function exists
- [ ] Referral code trigger on loyalty_points table

### Row Level Security
- [ ] RLS enabled on all tables
- [ ] User policies configured
- [ ] Restaurant policies configured
- [ ] Menu item policies configured
- [ ] Order policies configured
- [ ] Driver policies configured
- [ ] Loyalty policies configured
- [ ] Voucher policies configured
- [ ] Notification policies configured

## Storage Buckets

- [ ] `restaurant-images` bucket created (public)
- [ ] `menu-images` bucket created (public)
- [ ] `driver-documents` bucket created (private)
- [ ] `user-avatars` bucket created (public)
- [ ] Storage policies configured for all buckets

## Code Files

### Configuration Files
- [ ] `lib/supabase/config.ts` created
- [ ] `lib/supabase/database.ts` created
- [ ] `lib/supabase/storage.ts` created
- [ ] `lib/supabase/types.ts` created
- [ ] `lib/supabase/constants.ts` created
- [ ] `lib/supabase/index.ts` created

### Migration Files
- [ ] `supabase/migrations/001_initial_schema.sql` created
- [ ] `supabase/migrations/002_indexes.sql` created
- [ ] `supabase/migrations/003_triggers.sql` created
- [ ] `supabase/migrations/004_rls_policies.sql` created
- [ ] `supabase/storage/buckets.sql` created
- [ ] `supabase/seed.sql` created

### Documentation
- [ ] `supabase/README.md` created
- [ ] `docs/DATABASE_SETUP.md` created
- [ ] `docs/QUICK_START.md` created
- [ ] `docs/INFRASTRUCTURE_SUMMARY.md` created
- [ ] `docs/SETUP_CHECKLIST.md` created (this file)

### Scripts
- [ ] `scripts/setup-database.sh` created
- [ ] Script is executable (`chmod +x`)
- [ ] `npm run setup:db` command added to package.json

## Dependencies

- [ ] `@supabase/supabase-js` installed
- [ ] `bcryptjs` installed
- [ ] `@types/bcryptjs` installed (dev dependency)

## Testing

### Database Connection
- [ ] Can connect to Supabase from application
- [ ] Service role key works for server operations
- [ ] Anon key works for client operations

### Tables
- [ ] Can query users table
- [ ] Can query restaurants table
- [ ] Can query menu_items table
- [ ] Can query orders table
- [ ] Can query drivers table

### Storage
- [ ] Can upload to restaurant-images bucket
- [ ] Can upload to menu-images bucket
- [ ] Can retrieve public URLs
- [ ] Storage policies work correctly

### Seed Data (if applied)
- [ ] Test users exist
- [ ] Test restaurants exist
- [ ] Test menu items exist
- [ ] Test orders exist
- [ ] Test driver exists
- [ ] Test loyalty points exist
- [ ] Test vouchers exist

## Verification Queries

Run these in Supabase SQL Editor to verify setup:

```sql
-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check indexes
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Check triggers
SELECT trigger_name, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

-- Check storage buckets
SELECT * FROM storage.buckets;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Count records (if seeded)
SELECT 
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM restaurants) as restaurants,
  (SELECT COUNT(*) FROM menu_items) as menu_items,
  (SELECT COUNT(*) FROM orders) as orders,
  (SELECT COUNT(*) FROM drivers) as drivers;
```

## Common Issues

### ❌ Connection fails
- [ ] Verify SUPABASE_URL is correct
- [ ] Check project is not paused
- [ ] Verify network connectivity

### ❌ Permission errors
- [ ] Using service role key for server operations
- [ ] RLS policies are correct
- [ ] User has proper role assigned

### ❌ Migration fails
- [ ] UUID extension is enabled
- [ ] No conflicting table names
- [ ] Proper order of execution

### ❌ Storage upload fails
- [ ] Bucket exists
- [ ] File type is allowed
- [ ] File size within limits
- [ ] Storage policies configured

## Post-Setup Tasks

- [ ] Review all environment variables
- [ ] Test database connection from application
- [ ] Configure authentication settings in Supabase
- [ ] Set up email templates
- [ ] Configure CORS for frontend domain
- [ ] Review and adjust RLS policies if needed
- [ ] Set up monitoring and alerts
- [ ] Plan backup strategy
- [ ] Document any custom configurations

## Production Readiness

- [ ] Change JWT_SECRET to secure random value
- [ ] Review and tighten RLS policies
- [ ] Set up database backups
- [ ] Configure monitoring
- [ ] Set up error tracking
- [ ] Review rate limiting settings
- [ ] Test with production-like data volume
- [ ] Security audit completed
- [ ] Performance testing completed
- [ ] Documentation reviewed and updated

## Sign-off

- [ ] Database infrastructure setup complete
- [ ] All tests passing
- [ ] Documentation reviewed
- [ ] Ready for API development

**Setup completed by**: ________________  
**Date**: ________________  
**Verified by**: ________________  
**Date**: ________________  

## Notes

Use this section to document any deviations from the standard setup or special configurations:

```
[Add your notes here]
```
