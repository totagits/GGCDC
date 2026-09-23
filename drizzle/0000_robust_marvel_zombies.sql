CREATE TABLE `record_events` (
	`id` text PRIMARY KEY NOT NULL,
	`record_id` text NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`note` text,
	`at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `events_record_idx` ON `record_events` (`record_id`);--> statement-breakpoint
CREATE TABLE `record_links` (
	`id` text PRIMARY KEY NOT NULL,
	`source_id` text NOT NULL,
	`target_id` text NOT NULL,
	`relation` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `links_source_idx` ON `record_links` (`source_id`);--> statement-breakpoint
CREATE INDEX `links_target_idx` ON `record_links` (`target_id`);--> statement-breakpoint
CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`module` text NOT NULL,
	`title` text NOT NULL,
	`status` text DEFAULT 'Draft' NOT NULL,
	`county` text,
	`community` text,
	`owner` text,
	`due_date` text,
	`summary` text,
	`details` text DEFAULT '{}' NOT NULL,
	`created_by` text NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `records_module_idx` ON `records` (`module`);--> statement-breakpoint
CREATE INDEX `records_status_idx` ON `records` (`status`);