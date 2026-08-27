CREATE TABLE `bin_data` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` serial AUTO_INCREMENT,
	`bin_issue_date` varchar(255),
	`circle` varchar(255),
	`bin` varchar(255),
	`name` varchar(255),
	`factory_address` varchar(1000),
	`police_station` varchar(255),
	`district` varchar(255),
	`mobile_number` varchar(100),
	`email` varchar(255),
	`registered_hq_address` varchar(1000),
	`major_area_of_economic_activity` varchar(1000),
	`areas_of_manufacturing` varchar(1000),
	`areas_of_service` varchar(1000),
	`bin_status` varchar(100),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `bin_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`trx_id` varchar(100),
	`is_approved` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `bin_data` ADD CONSTRAINT `bin_data_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;