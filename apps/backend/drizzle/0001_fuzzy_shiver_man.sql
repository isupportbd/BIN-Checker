ALTER TABLE `bin_data` MODIFY COLUMN `user_id` int;--> statement-breakpoint
ALTER TABLE `bin_data` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;