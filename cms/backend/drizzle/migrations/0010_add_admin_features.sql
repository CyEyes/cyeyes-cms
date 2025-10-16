-- Migration: Add Admin Features (Profile, 2FA, Site Config, Contact Info)
-- Date: 2025-10-15
-- Version: 0010

-- ============================================
-- TABLE: admin_profiles
-- Purpose: Store admin user 2FA settings and preferences
-- ============================================
CREATE TABLE IF NOT EXISTS admin_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,

  -- 2FA Settings
  two_factor_enabled INTEGER NOT NULL DEFAULT 0,
  two_factor_secret TEXT,
  two_factor_backup_codes TEXT,

  -- Preferences
  preferences TEXT,

  -- Timestamps
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  -- Foreign Keys
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_profiles_user_id ON admin_profiles(user_id);

-- ============================================
-- TABLE: site_config
-- Purpose: Store site branding (logo, favicon, colors)
-- ============================================
CREATE TABLE IF NOT EXISTS site_config (
  id TEXT PRIMARY KEY,

  -- Branding
  site_name TEXT NOT NULL DEFAULT 'CyEyes',
  logo_url TEXT,
  logo_admin_url TEXT,
  favicon_url TEXT,

  -- Colors
  primary_color TEXT NOT NULL DEFAULT '#1e40af',
  secondary_color TEXT NOT NULL DEFAULT '#0d9488',

  -- Meta
  updated_by TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  -- Foreign Keys
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_site_config_updated_by ON site_config(updated_by);

-- ============================================
-- TABLE: contact_info
-- Purpose: Store contact page content (CMS)
-- ============================================
CREATE TABLE IF NOT EXISTS contact_info (
  id TEXT PRIMARY KEY,

  -- Contact Details (Bilingual)
  address_en TEXT,
  address_vi TEXT,
  phone TEXT,
  email TEXT,
  fax TEXT,

  -- Business Hours (JSON)
  business_hours TEXT,

  -- Location
  latitude TEXT,
  longitude TEXT,
  google_maps_embed_url TEXT,

  -- Social Media (JSON)
  social_links TEXT,

  -- Additional Info (Bilingual)
  additional_info_en TEXT,
  additional_info_vi TEXT,

  -- Status
  is_active INTEGER NOT NULL DEFAULT 1,

  -- Meta
  updated_by TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),

  -- Foreign Keys
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_contact_info_is_active ON contact_info(is_active);
CREATE INDEX IF NOT EXISTS idx_contact_info_updated_by ON contact_info(updated_by);

-- ============================================
-- SEED DATA: Initialize with default values
-- ============================================

-- Insert default site_config (single row)
INSERT INTO site_config (
  id,
  site_name,
  logo_url,
  logo_admin_url,
  favicon_url,
  primary_color,
  secondary_color,
  created_at,
  updated_at
) VALUES (
  lower(hex(randomblob(16))),
  'CyEyes',
  '/media/CyEyes2025.1.4.png',
  '/media/CyEyes2025.1.4.png',
  '/favicon.ico',
  '#1e40af',
  '#0d9488',
  datetime('now'),
  datetime('now')
);

-- Insert default contact_info
INSERT INTO contact_info (
  id,
  address_en,
  address_vi,
  phone,
  email,
  business_hours,
  latitude,
  longitude,
  social_links,
  additional_info_en,
  additional_info_vi,
  is_active,
  created_at,
  updated_at
) VALUES (
  lower(hex(randomblob(16))),
  '123 Cybersecurity Street, Tech District',
  '123 Đường An ninh Mạng, Khu Công nghệ',
  '+84 123 456 789',
  'contact@cyeyes.com',
  '{"weekdays":"9:00 AM - 6:00 PM","saturday":"9:00 AM - 12:00 PM","sunday":"Closed","holidays":"Closed"}',
  '10.7769',
  '106.7009',
  '{"facebook":"https://facebook.com/cyeyes","twitter":"https://twitter.com/cyeyes","linkedin":"https://linkedin.com/company/cyeyes"}',
  'Feel free to reach out to us for any cybersecurity inquiries.',
  'Hãy liên hệ với chúng tôi để được tư vấn về an ninh mạng.',
  1,
  datetime('now'),
  datetime('now')
);

-- ============================================
-- TRIGGERS: Auto-update updated_at
-- ============================================

-- Trigger for admin_profiles
CREATE TRIGGER IF NOT EXISTS update_admin_profiles_timestamp
AFTER UPDATE ON admin_profiles
FOR EACH ROW
BEGIN
  UPDATE admin_profiles SET updated_at = datetime('now') WHERE id = OLD.id;
END;

-- Trigger for site_config
CREATE TRIGGER IF NOT EXISTS update_site_config_timestamp
AFTER UPDATE ON site_config
FOR EACH ROW
BEGIN
  UPDATE site_config SET updated_at = datetime('now') WHERE id = OLD.id;
END;

-- Trigger for contact_info
CREATE TRIGGER IF NOT EXISTS update_contact_info_timestamp
AFTER UPDATE ON contact_info
FOR EACH ROW
BEGIN
  UPDATE contact_info SET updated_at = datetime('now') WHERE id = OLD.id;
END;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Verify tables created
-- SELECT name FROM sqlite_master WHERE type='table' AND name IN ('admin_profiles', 'site_config', 'contact_info');

-- Verify seed data
-- SELECT * FROM site_config;
-- SELECT * FROM contact_info;

-- Migration complete!
