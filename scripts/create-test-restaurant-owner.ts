import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestRestaurantOwner() {
  console.log('Creating test restaurant owner account...');

  const email = 'testowner@eatafrican.ch';
  const password = 'Owner123!';

  // Check if user already exists in auth
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find(u => u.email === email);
  
  if (existingUser) {
    console.log('Auth user already exists, checking users table...');
    
    // Check if user record exists with correct ID
    const { data: userRecord } = await supabase
      .from('users')
      .select('*')
      .eq('id', existingUser.id)
      .single();
    
    if (userRecord) {
      console.log('✅ User already exists and is properly configured!');
      console.log('Email:', email);
      console.log('Password:', password);
      return;
    }
    
    // Delete any mismatched record
    await supabase.from('users').delete().eq('email', email);
    
    // Create correct user record
    const { error: userError } = await supabase.from('users').insert({
      id: existingUser.id,
      email,
      role: 'restaurant_owner',
      first_name: 'Test',
      last_name: 'Owner',
      status: 'active',
    });
    
    if (userError) {
      console.error('Error creating user record:', userError);
      return;
    }
    
    console.log('✅ User record fixed!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('ID:', existingUser.id);
    return;
  }

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: 'Test',
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
    first_name: 'Test',
    last_name: 'Owner',
    status: 'active',
  });

  if (userError) {
    console.error('Error creating user record:', userError);
    return;
  }

  // Check if there's a restaurant to assign
  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('id, name')
    .is('owner_id', null)
    .limit(1);

  if (restaurants && restaurants.length > 0) {
    await supabase
      .from('restaurants')
      .update({ owner_id: authData.user.id })
      .eq('id', restaurants[0].id);
    console.log('✅ Assigned restaurant:', restaurants[0].name);
  }

  console.log('✅ Test restaurant owner created successfully!');
  console.log('Email:', email);
  console.log('Password:', password);
  console.log('ID:', authData.user.id);
}

createTestRestaurantOwner();
