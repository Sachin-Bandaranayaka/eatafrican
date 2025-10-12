// Test login for debugging JWT issue
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000';

async function testLogin() {
  console.log('Testing login...\n');
  
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'sachinbandaranayakaa505@gmail.com',
      password: 'sachin@123'
    })
  });

  const data = await response.json();
  
  if (response.ok) {
    console.log('✅ Login successful!');
    console.log('User:', data.user);
    console.log('\nToken (first 50 chars):', data.token.substring(0, 50) + '...');
    
    // Decode JWT to see the payload
    const payload = JSON.parse(Buffer.from(data.token.split('.')[1], 'base64').toString());
    console.log('\nJWT Payload:');
    console.log(JSON.stringify(payload, null, 2));
    console.log('\nType of sub field:', typeof payload.sub);
    
    return data.token;
  } else {
    console.log('❌ Login failed:', data);
    return null;
  }
}

async function testDriverEndpoint(token) {
  console.log('\n\nTesting driver endpoint...\n');
  
  const response = await fetch(`${API_BASE}/api/drivers/available-orders`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(data, null, 2));
}

async function run() {
  const token = await testLogin();
  if (token) {
    await testDriverEndpoint(token);
  }
}

run().catch(console.error);
