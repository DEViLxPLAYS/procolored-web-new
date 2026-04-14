-- ============================================================
-- MIGRATION: Payment Gateway Keys + can_manage_keys column
-- Run this in your Supabase SQL Editor (Project: ixbwjdtufstcuonjqfzl)
-- ============================================================

-- Step 1: Add can_manage_keys column to admin_users (if not exists)
ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS can_manage_keys BOOLEAN DEFAULT false;

-- Step 2: Create the payment_gateway_keys table
CREATE TABLE IF NOT EXISTS payment_gateway_keys (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  gateway VARCHAR(50) NOT NULL,          -- 'stripe' | 'paypal'
  key_name VARCHAR(100) NOT NULL,        -- e.g. 'stripe_live_secret_key'
  encrypted_value TEXT NOT NULL,         -- AES-encrypted key value
  iv TEXT NOT NULL,                      -- Initialization vector for decryption
  is_active BOOLEAN DEFAULT true,
  updated_by UUID REFERENCES admin_users(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Enable Row Level Security
ALTER TABLE payment_gateway_keys ENABLE ROW LEVEL SECURITY;

-- Step 4: Deny all public access (service role bypasses this)
CREATE POLICY "No public access" ON payment_gateway_keys FOR ALL USING (false);

-- Step 5: Index for fast gateway lookups
CREATE INDEX IF NOT EXISTS idx_payment_keys_gateway ON payment_gateway_keys(gateway);
CREATE INDEX IF NOT EXISTS idx_payment_keys_active ON payment_gateway_keys(is_active);

-- Step 6: Give super_admin users can_manage_keys = true automatically
UPDATE admin_users
  SET can_manage_keys = true
  WHERE role = 'super_admin';
