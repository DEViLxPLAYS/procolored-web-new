const fs = require('fs');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

async function checkField(field) {
  const dummyOrder = {
    order_number: `T-${Date.now().toString().slice(-4)}`,
    customer_name: 'Test Test',
    customer_email: `t${Date.now()}@e.com`,
    customer_phone: '1234567890',
    shipping_address: '123 Test St',
    billing_address: '123 Test St',
    items: [],
    subtotal: 0,
    shipping_cost: 0,
    discount_amount: 0,
    discount_code: null,
    total_amount: 0,
    currency: 'PKR',
    status: 'pending',
    payment_status: 'unpaid',
    payment_method: 'card',
    customer_ip: '127.0.0.1',
    customer_country: 'Pakistan',
    customer_city: 'Lahore'
  };
  
  // Set the field to a 15-character string
  dummyOrder[field] = '123456789012345';
  
  const { error } = await supabase.from('orders').insert(dummyOrder);
  return { field, error: error ? error.message : null };
}

async function testAll() {
  const fields = [
    'customer_name',
    'customer_email',
    'customer_phone',
    'shipping_address',
    'billing_address',
    'discount_code',
    'currency',
    'status',
    'payment_status',
    'payment_method',
    'customer_ip',
    'customer_country',
    'customer_city'
  ];
  
  const results = [];
  for (const f of fields) {
    if (f === 'status' || f === 'payment_status') continue; // Enum constraints might fail first
    results.push(await checkField(f));
  }
  fs.writeFileSync('output.json', JSON.stringify(results, null, 2));
}
testAll();
