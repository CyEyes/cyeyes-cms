CREATE TABLE `customer_values` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`title_en` text NOT NULL,
	`title_vi` text NOT NULL,
	`desc_en` text,
	`desc_vi` text,
	`icon` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
