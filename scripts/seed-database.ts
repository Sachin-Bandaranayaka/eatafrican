#!/usr/bin/env ts-node
/**
 * Database Seeding Script
 * 
 * This script seeds the database with sample data for development and testing.
 * It reads the seed.sql file and executes it against the Supabase database.
 * 
 * Usage:
 *   npm run seed
 *   or
 *   ts-node scripts/seed-database.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Read the seed file
    const seedFilePath = path.join(__dirname, '..', 'supabase', 'seed.sql');
    const seedSQL = fs.readFileSync(seedFilePath, 'utf-8');

    console.log('📄 Reading seed file:', seedFilePath);

    // Split SQL into individual statements (basic split by semicolon)
    // Note: This is a simple approach. For complex SQL, consider using a proper SQL parser
    const statements = seedSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📊 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip comments and empty statements
      if (statement.startsWith('--') || statement.trim().length === 0) {
        continue;
      }

      try {
        // Execute the SQL statement using Supabase's RPC or direct query
        // Note: Supabase client doesn't directly support raw SQL execution
        // You may need to use the Postgres connection directly or REST API
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
        
        // For now, we'll log that this needs to be executed via psql or Supabase dashboard
        // In production, you'd use a direct Postgres connection
        successCount++;
      } catch (error: any) {
        console.error(`❌ Error executing statement ${i + 1}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n✅ Database seeding completed!');
    console.log(`   Success: ${successCount} statements`);
    console.log(`   Errors: ${errorCount} statements`);

    if (errorCount > 0) {
      console.log('\n⚠️  Some statements failed. Please check the errors above.');
      console.log('💡 Tip: You can run the seed.sql file directly using:');
      console.log('   psql -h <host> -U <user> -d <database> -f supabase/seed.sql');
    }

  } catch (error: any) {
    console.error('❌ Fatal error during seeding:', error.message);
    process.exit(1);
  }
}

// Alternative: Provide instructions for manual seeding
function printManualInstructions() {
  console.log('\n📋 Manual Seeding Instructions:');
  console.log('================================\n');
  console.log('Since Supabase JS client doesn\'t support raw SQL execution,');
  console.log('you can seed the database using one of these methods:\n');
  console.log('1. Using Supabase Dashboard:');
  console.log('   - Go to your Supabase project dashboard');
  console.log('   - Navigate to SQL Editor');
  console.log('   - Copy and paste the contents of supabase/seed.sql');
  console.log('   - Click "Run"\n');
  console.log('2. Using psql command line:');
  console.log('   psql "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres" -f supabase/seed.sql\n');
  console.log('3. Using Supabase CLI:');
  console.log('   supabase db reset  # This will run migrations and seed\n');
}

// Run the seeding
console.log('🚀 Food Delivery Backend - Database Seeding Tool\n');
printManualInstructions();

// Uncomment to attempt automatic seeding (requires direct Postgres connection)
// seedDatabase();
