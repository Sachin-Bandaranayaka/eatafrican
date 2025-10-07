# Quick Start Guide - Database Setup

Get your database up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Supabase account created
- Supabase project created

## Step-by-Step Setup

### 1. Get Your Supabase Credentials (2 minutes)

1. Go to [supabase.com](https://supabase.com) and sign in
2. Open your project
3. Click **Settings** → **API**
4. Copy these three values:
   - **Project URL**
   - **anon public key**
   - **service_role key** (keep this secret!)

### 2. Configure Environment (1 minute)

```bash
# Copy the example file
cp .env.example .env

# Edit .env and paste your credentials
nano .env  # or use your favorite editor
```

Update these lines:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
SUPABASE_ANON_KEY=your-anon-key-here
JWT_SECRET=change-this-to-a-random-secret
```

### 3. Run Setup Script (2 minutes)

```bash
npm run setup:db
```

Follow the prompts:
- Select option 1 (CLI) or 2 (Manual)
- Choose whether to seed test data

### 4. Verify Setup

Check your Supabase dashboard:
- **Database** → **Tables** - Should see 12 tables
- **Storage** → **Buckets** - Should see 4 buckets

## That's It! 🎉

Your database is ready. Next steps:

1. Review the [Database Setup Guide](./DATABASE_SETUP.md) for details
2. Start implementing API endpoints
3. Test with the seeded data

## Test Accounts (if you seeded data)

All test accounts use password: `password123`

- **Super Admin**: admin@eatafrican.ch
- **Customer**: customer@example.com
- **Restaurant Owner**: owner@restaurant.com
- **Driver**: driver@delivery.com

## Quick Commands

```bash
# View database tables
supabase db list

# Run a SQL query
supabase db execute --sql "SELECT * FROM users LIMIT 5"

# Reset database (WARNING: Deletes all data!)
supabase db reset

# View logs
supabase logs
```

## Need Help?

- 📖 [Full Database Setup Guide](./DATABASE_SETUP.md)
- 🐛 [Troubleshooting Section](./DATABASE_SETUP.md#troubleshooting)
- 💬 Check Supabase logs in dashboard
