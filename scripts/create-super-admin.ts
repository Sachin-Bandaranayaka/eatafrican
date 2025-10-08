// Script to create super admin account in Supabase Auth
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createSuperAdmin() {
  console.log('Creating super admin account...');

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: 'admin@eatafrican.ch',
    password: 'password123',
    email_confirm: true,
    user_metadata: {
      first_name: 'Admin',
      last_name: 'User',
    },
  });

  if (authError) {
    console.error('Error creating auth user:', authError);
    return;
  }

  console.log('✅ Super admin created successfully!');
  console.log('Email: admin@eatafrican.ch');
  console.log('Password: password123');
  console.log('ID:', authData.user.id);
}

createSuperAdmin();

