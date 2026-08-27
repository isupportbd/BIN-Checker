ALTER TABLE `bin_data` DROP FOREIGN KEY `bin_data_user_id_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `users` ADD `last_login_at` timestamp;--> statement-breakpoint
ALTER TABLE `bin_data` ADD CONSTRAINT `bin_data_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;