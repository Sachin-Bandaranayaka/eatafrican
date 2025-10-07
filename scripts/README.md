# Database Scripts

This directory contains utility scripts for managing database data, including seeding, exporting, and importing.

## Available Scripts

### 1. Seed Database (`seed-database.ts`)

Seeds the database with sample data for development and testing.

**Usage:**
```bash
npm run seed
# or
ts-node scripts/seed-database.ts
```

**What it does:**
- Reads `supabase/seed.sql`
- Provides instructions for manual seeding via Supabase Dashboard or psql
- Creates comprehensive test data including:
  - 13 users (1 admin, 4 customers, 4 restaurant owners, 4 drivers)
  - 6 restaurants (5 active, 1 pending)
  - 23 menu items
  - 15 orders in various states
  - Loyalty points, vouchers, notifications, and more

**Note:** Since Supabase JS client doesn't support raw SQL execution, you'll need to run the seed file manually using one of these methods:

1. **Supabase Dashboard:**
   - Go to SQL Editor
   - Copy/paste contents of `supabase/seed.sql`
   - Click "Run"

2. **psql command line:**
   ```bash
   psql "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" -f supabase/seed.sql
   ```

3. **Supabase CLI:**
   ```bash
   supabase db reset  # Runs migrations and seed
   ```

### 2. Export Data (`export-data.ts`)

Exports all data from the database to JSON files for backup purposes.

**Usage:**
```bash
npm run export-data
# or
ts-node scripts/export-data.ts
```

**What it does:**
- Creates a timestamped backup directory in `backups/`
- Exports all tables to individual JSON files
- Creates a combined `full-backup.json` file
- Generates metadata file with export statistics

**Output structure:**
```
backups/
└── backup-2025-01-07/
    ├── users.json
    ├── restaurants.json
    ├── menu_items.json
    ├── orders.json
    ├── full-backup.json
    └── metadata.json
```

### 3. Import Data (`import-data.ts`)

Imports data from JSON backup files into the database.

**Usage:**
```bash
npm run import-data backups/backup-2025-01-07
# or
ts-node scripts/import-data.ts backups/backup-2025-01-07
```

**What it does:**
- Reads JSON files from specified backup directory
- Imports data in correct order (respecting foreign key dependencies)
- Uses upsert to avoid duplicate key errors
- Processes data in batches to avoid timeouts
- Provides detailed import statistics

**Import order:**
1. users
2. restaurants
3. menu_items
4. drivers
5. orders
6. order_items
7. loyalty_points
8. loyalty_transactions
9. vouchers
10. favorites
11. notifications
12. activity_logs

## Environment Variables

All scripts require the following environment variables in your `.env` file:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Common Workflows

### Initial Setup
```bash
# 1. Run migrations
supabase db reset

# 2. Seed database (manual via dashboard or psql)
# Copy contents of supabase/seed.sql to SQL Editor
```

### Backup Before Changes
```bash
# Export current data
npm run export-data
```

### Restore from Backup
```bash
# Import data from specific backup
npm run import-data backups/backup-2025-01-07
```

### Reset to Fresh Seed Data
```bash
# 1. Reset database
supabase db reset

# 2. Re-run seed file
# (via dashboard or psql)
```

## Troubleshooting

### "SUPABASE_URL not set" Error
Make sure your `.env` file exists and contains the required variables.

### Foreign Key Constraint Errors
The import script handles dependencies automatically, but if you encounter errors:
- Check that all referenced records exist
- Verify the import order in `IMPORT_ORDER` array
- Consider temporarily disabling foreign key checks (not recommended for production)

### Timeout Errors
The scripts process data in batches. If you still encounter timeouts:
- Reduce the `batchSize` in the import script
- Import tables individually
- Use a direct Postgres connection for large datasets

## Development

To add a new table to export/import:
1. Add table name to `TABLES` array in `export-data.ts`
2. Add table name to `IMPORT_ORDER` array in `import-data.ts` (in correct dependency order)
3. Ensure the table has an `id` column for upsert operations
