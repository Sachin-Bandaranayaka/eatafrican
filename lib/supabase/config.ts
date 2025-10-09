import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

if (!supabaseServiceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

if (!supabaseAnonKey) {
  throw new Error('Missing SUPABASE_ANON_KEY environment variable');
}

// Create Supabase client with service role (for server-side operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-my-custom-header': 'service-role',
    },
  },
});

// Create Supabase client with anon key (for client-side operations)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

// Storage bucket names
export const STORAGE_BUCKETS = {
  RESTAURANT_IMAGES: 'restaurant-images',
  MENU_IMAGES: 'menu-images',
  DRIVER_DOCUMENTS: 'driver-documents',
  USER_AVATARS: 'user-avatars',
} as const;

// Database configuration
export const DB_CONFIG = {
  MAX_CONNECTIONS: 10,
  IDLE_TIMEOUT: 30000,
  CONNECTION_TIMEOUT: 2000,
} as const;
