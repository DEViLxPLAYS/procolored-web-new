-- ========================================
-- ProColored Supabase Database Schema
-- Run this entire script in Supabase SQL Editor
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- Admin Users Table
-- ========================================
CREATE TABLE admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  login_attempts INTEGER DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- Newsletter Subscribers Table
-- ========================================
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  source VARCHAR(50) DEFAULT 'popup',
  country VARCHAR(10),
  city VARCHAR(100),
  ip_address VARCHAR(45),
  is_active BOOLEAN DEFAULT true,
  discount_code VARCHAR(20),
  discount_used BOOLEAN DEFAULT false,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- Orders Table
-- ========================================
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number VARCHAR(20) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  items JSONB NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  shipping_cost DECIMAL(12,2) DEFAULT 0,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  discount_code VARCHAR(20),
  total_amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'PKR',
  status VARCHAR(30) DEFAULT 'pending' CHECK (
    status IN (
      'pending', 'confirmed', 'processing',
      'shipped', 'delivered', 'cancelled', 'refunded'
    )
  ),
  payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (
    payment_status IN ('unpaid', 'paid', 'refunded', 'failed')
  ),
  payment_method VARCHAR(50),
  stripe_payment_intent_id VARCHAR(255),
  customer_ip VARCHAR(45),
  customer_country VARCHAR(10),
  customer_city VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- Checkout Abandonment Table
-- ========================================
CREATE TABLE checkout_abandonments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id VARCHAR(255),
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  cart_items JSONB,
  cart_total DECIMAL(12,2),
  currency VARCHAR(10) DEFAULT 'PKR',
  step_abandoned VARCHAR(50),
  customer_ip VARCHAR(45),
  customer_country VARCHAR(10),
  customer_city VARCHAR(100),
  device_type VARCHAR(20),
  user_agent TEXT,
  abandoned_at TIMESTAMPTZ DEFAULT NOW(),
  recovered BOOLEAN DEFAULT false,
  recovered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- Visitor Analytics Table
-- ========================================
CREATE TABLE visitor_analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id VARCHAR(255),
  ip_address VARCHAR(45),
  country VARCHAR(10),
  country_name VARCHAR(100),
  city VARCHAR(100),
  currency_shown VARCHAR(10),
  device_type VARCHAR(20),
  browser VARCHAR(50),
  page_visited VARCHAR(255),
  referrer VARCHAR(500),
  visited_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- Admin Activity Log Table
-- ========================================
CREATE TABLE admin_activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  admin_id UUID REFERENCES admin_users(id),
  admin_username VARCHAR(50),
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(100),
  resource_id VARCHAR(255),
  details JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========================================
-- Row Level Security — Enable on ALL tables
-- ========================================
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkout_abandonments ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;

-- ========================================
-- RLS Policies — Deny all public access
-- Service role key bypasses RLS (server only)
-- ========================================
CREATE POLICY "No public access" ON admin_users FOR ALL USING (false);
CREATE POLICY "No public access" ON newsletter_subscribers FOR ALL USING (false);
CREATE POLICY "No public access" ON orders FOR ALL USING (false);
CREATE POLICY "No public access" ON checkout_abandonments FOR ALL USING (false);
CREATE POLICY "No public access" ON visitor_analytics FOR ALL USING (false);
CREATE POLICY "No public access" ON admin_activity_logs FOR ALL USING (false);

-- ========================================
-- Indexes for performance
-- ========================================
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_created ON newsletter_subscribers(subscribed_at DESC);
CREATE INDEX idx_abandonment_created ON checkout_abandonments(abandoned_at DESC);
CREATE INDEX idx_analytics_country ON visitor_analytics(country);
CREATE INDEX idx_analytics_visited ON visitor_analytics(visited_at DESC);
