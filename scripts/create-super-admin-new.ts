import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createSuperAdmin() {
  console.log('Creating super admin account...');

  const email = 'admin@eatafrican.ch';
  const password = 'Admin123!';

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: 'Super',
      last_name: 'Admin',
    },
  });

  if (authError) {
    console.error('Error creating auth user:', authError);
    return;
  }

  // Create user record in users table
  const { error: userError } = await supabase.from('users').insert({
    id: authData.user.id,
    email,
    role: 'super_admin',
    first_name: 'Super',
    last_name: 'Admin',
    status: 'active',
  });

  if (userError) {
    console.error('Error creating user record:', userError);
    return;
  }

  console.log('✅ Super admin created successfully!');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('ID:', authData.user.id);
}

createSuperAdmin();
