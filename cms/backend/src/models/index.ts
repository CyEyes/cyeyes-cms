import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Helper for timestamps
const timestamp = () => text('created_at').notNull().default(sql`(datetime('now'))`);
const updatedTimestamp = () => text('updated_at').notNull().default(sql`(datetime('now'))`);

// ============================================
// USERS TABLE
// ============================================
export const users = sqliteTable('users', {
  id: text('id').primaryKey(), // UUID
  email: text('email').notNull().unique(),
  password: text('password').notNull(), // bcrypt hash
  role: text('role', { enum: ['user', 'content', 'admin'] }).notNull().default('user'),
  fullName: text('full_name').notNull(),
  avatar: text('avatar'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  lastLogin: text('last_login'),
  createdAt: timestamp(),
  updatedAt: updatedTimestamp(),
});

// ============================================
// BLOG POSTS TABLE
// ============================================
export const blogPosts = sqliteTable('blog_posts', {
  id: text('id').primaryKey(), // UUID
  slug: text('slug').notNull().unique(),

  // Bilingual content
  titleEn: text('title_en').notNull(),
  titleVi: text('title_vi').notNull(),
  contentEn: text('content_en'),
  contentVi: text('content_vi'),
  excerptEn: text('excerpt_en'),
  excerptVi: text('excerpt_vi'),

  featuredImage: text('featured_image'),
  authorId: text('author_id').notNull().references(() => users.id),
  category: text('category'),
  tags: text('tags'), // JSON array

  status: text('status', { enum: ['draft', 'published', 'archived'] }).notNull().default('draft'),
  publishedAt: text('published_at'),

  // SEO
  seoTitleEn: text('seo_title_en'),
  seoTitleVi: text('seo_title_vi'),
  seoDescEn: text('seo_desc_en'),
  seoDescVi: text('seo_desc_vi'),
  seoKeywords: text('seo_keywords'), // JSON array

  viewCount: integer('view_count').notNull().default(0),
  createdAt: timestamp(),
  updatedAt: updatedTimestamp(),
});

// ============================================
// TEAM MEMBERS TABLE
// ============================================
export const teamMembers = sqliteTable('team_members', {
  id: text('id').primaryKey(), // UUID
  nameEn: text('name_en').notNull(),
  nameVi: text('name_vi').notNull(),

  // New bilingual fields
  positionEn: text('position_en'),
  positionVi: text('position_vi'),
  department: text('department'),
  photo: text('photo'),
  shortBioEn: text('short_bio_en'),
  shortBioVi: text('short_bio_vi'),
  fullBioEn: text('full_bio_en'),
  fullBioVi: text('full_bio_vi'),

  // Legacy fields for backward compatibility
  position: text('position'),
  avatar: text('avatar'),
  bioEn: text('bio_en'),
  bioVi: text('bio_vi'),

  email: text('email'),
  phone: text('phone'),

  // New structured social links
  socialLinks: text('social_links'), // JSON: {linkedin, twitter, github}

  // Legacy flat social links
  linkedin: text('linkedin'),
  twitter: text('twitter'),

  expertise: text('expertise'), // JSON array
  displayOrder: integer('display_order').notNull().default(0),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: timestamp(),
  updatedAt: updatedTimestamp(),
});

// ============================================
// CUSTOMERS TABLE
// ============================================
export const customers = sqliteTable('customers', {
  id: text('id').primaryKey(), // UUID
  companyName: text('company_name').notNull(),
  logo: text('logo'),
  industry: text('industry'),
  website: text('website'),

  // Case study as JSON
  caseStudy: text('case_study'), // JSON: {title_en, title_vi, challenge_en, challenge_vi, solution_en, solution_vi, results_en, results_vi, metrics}

  // Testimonial as JSON
  testimonial: text('testimonial'), // JSON: {quote_en, quote_vi, author_name, author_position}

  showHomepage: integer('show_homepage', { mode: 'boolean' }).notNull().default(false),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp(),
  updatedAt: updatedTimestamp(),
});

// ============================================
// PRODUCTS TABLE
// ============================================
export const products = sqliteTable('products', {
  id: text('id').primaryKey(), // UUID
  slug: text('slug').notNull().unique(),

  // Bilingual content
  nameEn: text('name_en').notNull(),
  nameVi: text('name_vi').notNull(),
  category: text('category'),

  taglineEn: text('tagline_en'),
  taglineVi: text('tagline_vi'),

  shortDescEn: text('short_desc_en'),
  shortDescVi: text('short_desc_vi'),
  fullDescEn: text('full_desc_en'),
  fullDescVi: text('full_desc_vi'),

  features: text('features'), // JSON array: [{title_en, title_vi, desc_en, desc_vi}]
  customerValues: text('customer_values'), // JSON array: [{title_en, title_vi, desc_en, desc_vi, icon}]
  images: text('images'), // JSON array of URLs
  pricing: text('pricing'), // JSON: {tiers}

  ctaTextEn: text('cta_text_en'),
  ctaTextVi: text('cta_text_vi'),
  ctaLink: text('cta_link'),

  relatedProducts: text('related_products'), // JSON array of UUIDs

  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp(),
  updatedAt: updatedTimestamp(),
});

// ============================================
// MEDIA TABLE
// ============================================
export const media = sqliteTable('media', {
  id: text('id').primaryKey(), // UUID
  filename: text('filename').notNull(),
  originalName: text('original_name').notNull(),
  filePath: text('file_path').notNull(),
  fileType: text('file_type', { enum: ['image', 'video', 'document'] }).notNull(),
  mimeType: text('mime_type').notNull(),
  fileSize: integer('file_size').notNull(), // bytes

  title: text('title'),
  altText: text('alt_text'),
  description: text('description'),

  uploadedBy: text('uploaded_by').notNull().references(() => users.id),
  folder: text('folder').notNull().default('/'),
  createdAt: timestamp(),
});

// ============================================
// SETTINGS TABLE
// ============================================
export const settings = sqliteTable('settings', {
  key: text('key').primaryKey(),
  value: text('value').notNull(), // JSON
  description: text('description'),
  updatedBy: text('updated_by').references(() => users.id),
  updatedAt: updatedTimestamp(),
});

// ============================================
// RATE LIMITS TABLE
// ============================================
export const rateLimits = sqliteTable('rate_limits', {
  endpoint: text('endpoint').primaryKey(),
  maxRequests: integer('max_requests').notNull(),
  windowMs: integer('window_ms').notNull(), // milliseconds
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  description: text('description'),
  updatedAt: updatedTimestamp(),
});

// ============================================
// AUDIT LOGS TABLE
// ============================================
export const auditLogs = sqliteTable('audit_logs', {
  id: text('id').primaryKey(), // UUID
  userId: text('user_id').references(() => users.id),
  action: text('action').notNull(), // create, update, delete, login, etc.
  resourceType: text('resource_type').notNull(), // blog, team, customer, etc.
  resourceId: text('resource_id'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  details: text('details'), // JSON
  createdAt: timestamp(),
});

// ============================================
// TRAFFIC LOGS TABLE
// ============================================
export const trafficLogs = sqliteTable('traffic_logs', {
  id: text('id').primaryKey(), // UUID
  path: text('path').notNull(),
  method: text('method').notNull(),
  statusCode: integer('status_code').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  referer: text('referer'),
  responseTime: integer('response_time'), // ms
  userId: text('user_id').references(() => users.id),
  createdAt: timestamp(),
});

// ============================================
// ADMIN PROFILES TABLE (2FA & Preferences)
// ============================================
export const adminProfiles = sqliteTable('admin_profiles', {
  id: text('id').primaryKey(), // UUID
  userId: text('user_id').notNull().unique().references(() => users.id),

  // 2FA Settings
  twoFactorEnabled: integer('two_factor_enabled', { mode: 'boolean' }).notNull().default(false),
  twoFactorSecret: text('two_factor_secret'), // Encrypted TOTP secret
  twoFactorBackupCodes: text('two_factor_backup_codes'), // JSON array, encrypted

  // User Preferences
  preferences: text('preferences'), // JSON: {theme, language, notifications}

  createdAt: timestamp(),
  updatedAt: updatedTimestamp(),
});

// ============================================
// SITE CONFIGURATION TABLE (Logo, Favicon, Branding)
// ============================================
export const siteConfig = sqliteTable('site_config', {
  id: text('id').primaryKey(), // UUID

  // Branding
  siteName: text('site_name').notNull().default('CyEyes'),
  logoUrl: text('logo_url'), // Main public logo
  logoAdminUrl: text('logo_admin_url'), // Admin portal logo
  faviconUrl: text('favicon_url'), // Site favicon

  // Colors (for gradient backgrounds)
  primaryColor: text('primary_color').notNull().default('#1e40af'), // accent-blue
  secondaryColor: text('secondary_color').notNull().default('#0d9488'), // accent-teal

  // Meta
  updatedBy: text('updated_by').references(() => users.id),
  createdAt: timestamp(),
  updatedAt: updatedTimestamp(),
});

// ============================================
// CONTACT INFO TABLE (Public contact page content)
// ============================================
export const contactInfo = sqliteTable('contact_info', {
  id: text('id').primaryKey(), // UUID

  // Contact Details (Bilingual)
  addressEn: text('address_en'),
  addressVi: text('address_vi'),
  phone: text('phone'),
  email: text('email'),
  fax: text('fax'),

  // Business Hours (JSON)
  businessHours: text('business_hours'), // JSON: {weekdays, saturday, sunday, holidays}

  // Location
  latitude: text('latitude'), // Store as text for precision
  longitude: text('longitude'),
  googleMapsEmbedUrl: text('google_maps_embed_url'),

  // Social Media (JSON)
  socialLinks: text('social_links'), // JSON: {facebook, twitter, linkedin, github, etc}

  // Additional Info (Bilingual)
  additionalInfoEn: text('additional_info_en'),
  additionalInfoVi: text('additional_info_vi'),

  // Status
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),

  // Meta
  updatedBy: text('updated_by').references(() => users.id),
  createdAt: timestamp(),
  updatedAt: updatedTimestamp(),
});

// ============================================
// MESSAGES TABLE (Contact messages from landing page)
// ============================================
export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(), // UUID

  // Contact Information
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  company: text('company'),

  // Message Content
  subject: text('subject').notNull(),
  message: text('message').notNull(),

  // Metadata
  status: text('status', { enum: ['new', 'read', 'replied', 'archived'] }).notNull().default('new'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),

  // Admin Actions
  notes: text('notes'), // Internal admin notes
  assignedTo: text('assigned_to').references(() => users.id),
  repliedAt: text('replied_at'),
  repliedBy: text('replied_by').references(() => users.id),

  createdAt: timestamp(),
  updatedAt: updatedTimestamp(),
});

// ============================================
// TYPE EXPORTS
// ============================================
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;

export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;

export type Customer = typeof customers.$inferSelect;
export type NewCustomer = typeof customers.$inferInsert;

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;

export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;

export type Setting = typeof settings.$inferSelect;
export type NewSetting = typeof settings.$inferInsert;

export type RateLimit = typeof rateLimits.$inferSelect;
export type NewRateLimit = typeof rateLimits.$inferInsert;

export type AuditLog = typeof auditLogs.$inferSelect;
export type NewAuditLog = typeof auditLogs.$inferInsert;

export type TrafficLog = typeof trafficLogs.$inferSelect;
export type NewTrafficLog = typeof trafficLogs.$inferInsert;

export type AdminProfile = typeof adminProfiles.$inferSelect;
export type NewAdminProfile = typeof adminProfiles.$inferInsert;

export type SiteConfig = typeof siteConfig.$inferSelect;
export type NewSiteConfig = typeof siteConfig.$inferInsert;

export type ContactInfo = typeof contactInfo.$inferSelect;
export type NewContactInfo = typeof contactInfo.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
