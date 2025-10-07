# Food Delivery Platform - Backend

A complete backend system for a food delivery platform built with Next.js 15, Supabase, and TypeScript.

## 🚀 Quick Start

### Database Setup (5 minutes)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

3. **Run setup**:
   ```bash
   npm run setup:db
   ```

4. **Start development**:
   ```bash
   npm run dev
   ```

📖 **Detailed Guide**: See [docs/QUICK_START.md](docs/QUICK_START.md)

## 📚 Documentation

- **[Quick Start Guide](docs/QUICK_START.md)** - Get started in 5 minutes
- **[Database Setup Guide](docs/DATABASE_SETUP.md)** - Comprehensive setup instructions
- **[Infrastructure Summary](docs/INFRASTRUCTURE_SUMMARY.md)** - Architecture overview
- **[Setup Checklist](docs/SETUP_CHECKLIST.md)** - Verification checklist
- **[Task Completion Summary](TASK_1_COMPLETION_SUMMARY.md)** - What was built

## 🏗️ Project Structure

```
├── app/                    # Next.js app directory (frontend)
├── components/             # React components
├── lib/
│   └── supabase/          # Supabase configuration and utilities
│       ├── config.ts      # Client setup
│       ├── database.ts    # Database helpers
│       ├── storage.ts     # File storage
│       ├── types.ts       # TypeScript types
│       └── constants.ts   # Enums and constants
├── supabase/
│   ├── migrations/        # Database migrations
│   ├── storage/           # Storage bucket setup
│   └── seed.sql          # Test data
├── scripts/
│   └── setup-database.sh  # Setup automation
└── docs/                  # Documentation
```

## 🗄️ Database

### Tables (12)
- users, restaurants, menu_items, orders, order_items
- drivers, loyalty_points, loyalty_transactions
- vouchers, favorites, notifications, activity_logs

### Features
- ✅ Row Level Security (RLS)
- ✅ 60+ Performance Indexes
- ✅ Auto-generated IDs and timestamps
- ✅ Multi-language support
- ✅ File storage (4 buckets)

## 🔐 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Row Level Security (RLS)
- Password hashing (bcrypt)
- Secure file uploads

## 🛠️ Tech Stack

- **Runtime**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Validation**: Zod

## 📦 Dependencies

```json
{
  "@supabase/supabase-js": "^2.x",
  "bcryptjs": "^2.x",
  "zod": "^3.x",
  "next": "15.2.4",
  "react": "^19",
  "typescript": "^5"
}
```

## 🚦 Implementation Status

- ✅ **Task 1**: Database infrastructure setup - **COMPLETE**
  - 12 tables with full schema
  - 60+ performance indexes
  - Row Level Security policies
  - 4 storage buckets
  - Complete TypeScript types
  - Comprehensive documentation

- ⏭️ **Task 2**: Core utilities and middleware - NEXT
- ⏭️ **Task 3**: Authentication system
- ⏭️ **Task 4**: Restaurant management APIs
- ⏭️ **Task 5**: Menu management APIs

See [tasks.md](.kiro/specs/food-delivery-backend/tasks.md) for full implementation plan.

## 🧪 Testing

### Test Data (if seeded)
All test accounts use password: `password123`

- **Super Admin**: admin@eatafrican.ch
- **Customer**: customer@example.com
- **Restaurant Owner**: owner@restaurant.com
- **Driver**: driver@delivery.com

### Test Restaurants
- Ethiopian Delight (Basel)
- Kenyan Kitchen (Zürich)

## 📝 Environment Variables

Required:
```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
JWT_SECRET=your_jwt_secret
```

See [.env.example](.env.example) for all variables.

## 🎯 Usage Examples

### Database Queries

```typescript
import { supabaseAdmin, db } from '@/lib/supabase';

// Query users
const { data: users } = await db
  .from('users')
  .select('*')
  .eq('role', 'customer');

// Query restaurants with menu items
const { data: restaurants } = await db
  .from('restaurants')
  .select(`
    *,
    menu_items (*)
  `)
  .eq('status', 'active');
```

### File Uploads

```typescript
import { uploadImage } from '@/lib/supabase';

// Upload restaurant image
const { url, path } = await uploadImage(
  'RESTAURANT_IMAGES',
  file,
  restaurantId
);
```

### Using Constants

```typescript
import { USER_ROLES, ORDER_STATUS } from '@/lib/supabase';

// Check user role
if (user.role === USER_ROLES.RESTAURANT_OWNER) {
  // Restaurant owner logic
}

// Validate order status transition
if (isValidOrderStatusTransition(
  ORDER_STATUS.NEW,
  ORDER_STATUS.CONFIRMED
)) {
  // Update order status
}
```

## 🤝 Contributing

1. Follow the implementation plan in `.kiro/specs/food-delivery-backend/tasks.md`
2. Read the design document in `.kiro/specs/food-delivery-backend/design.md`
3. Check requirements in `.kiro/specs/food-delivery-backend/requirements.md`
4. Use the setup checklist in `docs/SETUP_CHECKLIST.md`

## 🆘 Support

- Check [docs/DATABASE_SETUP.md](docs/DATABASE_SETUP.md) for troubleshooting
- Review Supabase logs in dashboard
- See [docs/SETUP_CHECKLIST.md](docs/SETUP_CHECKLIST.md) for verification
- Read [TASK_1_COMPLETION_SUMMARY.md](TASK_1_COMPLETION_SUMMARY.md) for details

## 📋 Verification

Run these checks to verify setup:

```bash
# Check TypeScript compilation
npx tsc --noEmit

# Verify environment variables
node -e "require('dotenv').config(); console.log('✅ Env loaded')"

# Test database connection (create test file first)
npx tsx test-db-connection.ts
```

## 🎉 What's Next?

After completing Task 1 (Database Infrastructure), proceed to:

**Task 2: Implement core utilities and middleware**
- Zod validation schemas
- Authentication middleware
- Error handling middleware
- Utility functions (distance calculation, formatting)
- Rate limiting middleware

See the [tasks.md](.kiro/specs/food-delivery-backend/tasks.md) file for the complete implementation plan.

---

**Built with ❤️ for the African food delivery community**
