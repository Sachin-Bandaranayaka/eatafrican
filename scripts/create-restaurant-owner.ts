// Script to create restaurant owner account in Supabase Auth
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createRestaurantOwner() {
  console.log('Creating restaurant owner account...');

  const email = 'owner@eatafrican.ch';
  const password = 'Owner123!';

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: 'Restaurant',
      last_name: 'Owner',
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
    role: 'restaurant_owner',
    first_name: 'Restaurant',
    last_name: 'Owner',
    status: 'active',
  });

  if (userError) {
    console.error('Error creating user record:', userError);
    return;
  }

  console.log('✅ Restaurant owner created successfully!');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('ID:', authData.user.id);
}

createRestaurantOwner();
