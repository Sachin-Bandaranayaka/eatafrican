#!/usr/bin/env tsx
/**
 * Seed Supabase Auth Users
 *
 * Creates users in Supabase Auth AND ensures matching rows exist in the
 * custom `users` table. The login API first authenticates via Supabase Auth,
 * then fetches the profile from `users` by the Auth UUID — both must exist.
 *
 * Usage:
 *   npx tsx scripts/seed-auth-users.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PASSWORD = 'password123';

// Users to seed — role & profile info for the custom users table
const users = [
  { email: 'admin@eatafrican.ch', role: 'super_admin', first_name: 'Admin', last_name: 'User', phone: '+41791234567', language: 'en' },
  { email: 'customer@example.com', role: 'customer', first_name: 'John', last_name: 'Doe', phone: '+41791234568', language: 'en' },
  { email: 'customer2@example.com', role: 'customer', first_name: 'Sarah', last_name: 'Smith', phone: '+41791234571', language: 'de' },
  { email: 'customer3@example.com', role: 'customer', first_name: 'Pierre', last_name: 'Dubois', phone: '+41791234572', language: 'fr' },
  { email: 'customer4@example.com', role: 'customer', first_name: 'Marco', last_name: 'Rossi', phone: '+41791234573', language: 'it' },
  { email: 'owner1@restaurant.com', role: 'restaurant_owner', first_name: 'Maria', last_name: 'Garcia', phone: '+41791234569', language: 'de' },
  { email: 'owner2@restaurant.com', role: 'restaurant_owner', first_name: 'Kwame', last_name: 'Mensah', phone: '+41791234574', language: 'en' },
  { email: 'owner3@restaurant.com', role: 'restaurant_owner', first_name: 'Amara', last_name: 'Okafor', phone: '+41791234575', language: 'en' },
  { email: 'owner4@restaurant.com', role: 'restaurant_owner', first_name: 'Fatima', last_name: 'Diallo', phone: '+41791234576', language: 'fr' },
  { email: 'driver1@delivery.com', role: 'driver', first_name: 'Ahmed', last_name: 'Hassan', phone: '+41791234570', language: 'fr' },
  { email: 'driver2@delivery.com', role: 'driver', first_name: 'Kofi', last_name: 'Agyeman', phone: '+41791234577', language: 'en' },
  { email: 'driver3@delivery.com', role: 'driver', first_name: 'Yusuf', last_name: 'Ali', phone: '+41791234578', language: 'de' },
  { email: 'driver4@delivery.com', role: 'driver', first_name: 'Chidi', last_name: 'Nwosu', phone: '+41791234579', language: 'en' },
];

async function getOrCreateAuthUser(email: string, password: string, meta: { first_name: string; last_name: string }) {
  // First, check if the user already exists by listing users
  const { data: listData } = await supabase.auth.admin.listUsers();
  const existing = listData?.users?.find(u => u.email === email);

  if (existing) {
    return { id: existing.id, created: false };
  }

  // Create the user
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { first_name: meta.first_name, last_name: meta.last_name },
  });

  if (error) {
    throw error;
  }

  return { id: data.user.id, created: true };
}

async function seedAuthUsers() {
  console.log('🌱 Seeding Supabase Auth users + custom users table...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const user of users) {
    try {
      // 1. Create or find the Supabase Auth user
      const { id: authId, created } = await getOrCreateAuthUser(user.email, PASSWORD, {
        first_name: user.first_name,
        last_name: user.last_name,
      });

      const label = created ? '✅ Created auth' : '⏭️  Auth exists';
      console.log(`${label}: ${user.email} (id: ${authId})`);

      // 2. Upsert a row in the custom `users` table with the AUTH UUID
      const { error: upsertErr } = await supabase.from('users').upsert(
        {
          id: authId,
          email: user.email,
          password_hash: '(managed by supabase auth)',
          role: user.role,
          first_name: user.first_name,
          last_name: user.last_name,
          phone: user.phone,
          language: user.language,
          status: 'active',
        },
        { onConflict: 'email' }
      );

      if (upsertErr) {
        console.log(`   ⚠️  Could not upsert users row: ${upsertErr.message}`);
      } else {
        console.log(`   🔗 users table synced (id: ${authId})`);
      }

      successCount++;
    } catch (err: any) {
      console.error(`❌ ${user.email}: ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Done: ${successCount} succeeded, ${errorCount} failed`);
  console.log('\n🔑 All users can log in with password: password123');
  console.log('\nCustomer accounts:');
  console.log('  - customer@example.com');
  console.log('  - customer2@example.com');
  console.log('  - customer3@example.com');
  console.log('  - customer4@example.com');
}

seedAuthUsers().catch(console.error);
