#!/bin/bash

# Database Setup Script
# This script helps set up the Supabase database for the food delivery backend

set -e

echo "🚀 Food Delivery Backend - Database Setup"
echo "=========================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    cp .env.example .env
    echo "✅ Created .env file. Please update it with your Supabase credentials."
    echo ""
    echo "Required environment variables:"
    echo "  - SUPABASE_URL"
    echo "  - SUPABASE_SERVICE_ROLE_KEY"
    echo "  - SUPABASE_ANON_KEY"
    echo "  - JWT_SECRET"
    echo ""
    read -p "Press Enter after updating .env file to continue..."
fi

# Load environment variables
set -a
source .env
set +a

# Check if required variables are set
if [ -z "$SUPABASE_URL" ] || [ "$SUPABASE_URL" = "your_supabase_project_url" ]; then
    echo "❌ SUPABASE_URL is not set in .env file"
    exit 1
fi

if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ] || [ "$SUPABASE_SERVICE_ROLE_KEY" = "your_supabase_service_role_key" ]; then
    echo "❌ SUPABASE_SERVICE_ROLE_KEY is not set in .env file"
    exit 1
fi

echo "✅ Environment variables loaded"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not found. Installing..."
    npm install -g supabase
    echo "✅ Supabase CLI installed"
else
    echo "✅ Supabase CLI found"
fi

echo ""
echo "📋 Setup Options:"
echo "1. Run migrations via Supabase CLI (recommended)"
echo "2. Generate SQL file for manual execution"
echo "3. Exit"
echo ""
read -p "Select option (1-3): " option

case $option in
    1)
        echo ""
        echo "🔄 Running migrations via Supabase CLI..."
        echo ""
        
        # Extract project ref from SUPABASE_URL
        PROJECT_REF=$(echo $SUPABASE_URL | sed -n 's/.*\/\/\([^.]*\).*/\1/p')
        
        # Check if project is linked, if not initialize and link
        if [ ! -f .supabase/config.toml ]; then
            echo "📦 Initializing Supabase project..."
            supabase init
            
            echo "🔗 Linking to project: $PROJECT_REF"
            echo "   (You may be prompted for your database password)"
            supabase link --project-ref $PROJECT_REF
        fi
        
        # Run migrations
        echo "🚀 Pushing migrations to database..."
        supabase db push
        
        echo ""
        echo "✅ Migrations completed successfully!"
        ;;
        
    2)
        echo ""
        echo "📝 Generating combined SQL file..."
        
        # Create output directory
        mkdir -p output
        
        # Combine all migration files
        cat supabase/migrations/001_initial_schema.sql \
            supabase/migrations/002_indexes.sql \
            supabase/migrations/003_triggers.sql \
            supabase/migrations/004_rls_policies.sql \
            supabase/storage/buckets.sql \
            > output/complete_migration.sql
        
        echo "✅ SQL file generated: output/complete_migration.sql"
        echo ""
        echo "To apply manually:"
        echo "1. Go to your Supabase project dashboard"
        echo "2. Navigate to SQL Editor"
        echo "3. Copy and paste the contents of output/complete_migration.sql"
        echo "4. Run the query"
        ;;
        
    3)
        echo "Exiting..."
        exit 0
        ;;
        
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
read -p "Do you want to seed the database with test data? (y/n): " seed_option

if [ "$seed_option" = "y" ] || [ "$seed_option" = "Y" ]; then
    echo ""
    echo "🌱 Seeding database with test data..."
    
    if command -v supabase &> /dev/null && [ -f .supabase/config.toml ]; then
        supabase db execute --file supabase/seed.sql
        echo "✅ Database seeded successfully!"
    else
        echo "⚠️  Please run the seed.sql file manually via Supabase dashboard"
    fi
fi

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Verify tables are created in Supabase dashboard"
echo "2. Check storage buckets are configured"
echo "3. Test API endpoints"
echo ""
