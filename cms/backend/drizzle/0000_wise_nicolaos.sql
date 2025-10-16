CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`action` text NOT NULL,
	`resource_type` text NOT NULL,
	`resource_id` text,
	`ip_address` text,
	`user_agent` text,
	`details` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `blog_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title_en` text NOT NULL,
	`title_vi` text NOT NULL,
	`content_en` text,
	`content_vi` text,
	`excerpt_en` text,
	`excerpt_vi` text,
	`featured_image` text,
	`author_id` text NOT NULL,
	`category` text,
	`tags` text,
	`status` text DEFAULT 'draft' NOT NULL,
	`published_at` text,
	`seo_title_en` text,
	`seo_title_vi` text,
	`seo_desc_en` text,
	`seo_desc_vi` text,
	`seo_keywords` text,
	`view_count` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` text PRIMARY KEY NOT NULL,
	`company_name` text NOT NULL,
	`logo` text,
	`industry` text,
	`website` text,
	`case_study` text,
	`testimonial` text,
	`show_homepage` integer DEFAULT false NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`filename` text NOT NULL,
	`original_name` text NOT NULL,
	`file_path` text NOT NULL,
	`file_type` text NOT NULL,
	`mime_type` text NOT NULL,
	`file_size` integer NOT NULL,
	`title` text,
	`alt_text` text,
	`description` text,
	`uploaded_by` text NOT NULL,
	`folder` text DEFAULT '/' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name_en` text NOT NULL,
	`name_vi` text NOT NULL,
	`category` text,
	`tagline_en` text,
	`tagline_vi` text,
	`short_desc_en` text,
	`short_desc_vi` text,
	`full_desc_en` text,
	`full_desc_vi` text,
	`features` text,
	`images` text,
	`pricing` text,
	`cta_text_en` text,
	`cta_text_vi` text,
	`cta_link` text,
	`related_products` text,
	`is_active` integer DEFAULT true NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`endpoint` text PRIMARY KEY NOT NULL,
	`max_requests` integer NOT NULL,
	`window_ms` integer NOT NULL,
	`enabled` integer DEFAULT true NOT NULL,
	`description` text,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`description` text,
	`updated_by` text,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`updated_by`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` text PRIMARY KEY NOT NULL,
	`name_en` text NOT NULL,
	`name_vi` text NOT NULL,
	`position_en` text,
	`position_vi` text,
	`position` text,
	`department` text,
	`photo` text,
	`avatar` text,
	`short_bio_en` text,
	`short_bio_vi` text,
	`full_bio_en` text,
	`full_bio_vi` text,
	`bio_en` text,
	`bio_vi` text,
	`email` text,
	`phone` text,
	`social_links` text,
	`expertise` text,
	`linkedin` text,
	`twitter` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `traffic_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`path` text NOT NULL,
	`method` text NOT NULL,
	`status_code` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`referer` text,
	`response_time` integer,
	`user_id` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role` text DEFAULT 'user' NOT NULL,
	`full_name` text NOT NULL,
	`avatar` text,
	`is_active` integer DEFAULT true NOT NULL,
	`last_login` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `blog_posts_slug_unique` ON `blog_posts` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);