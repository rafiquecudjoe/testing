/*
  Warnings:

  - The `created_at` column on the `slack_users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updated_at` column on the `slack_users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `slack_users` ADD COLUMN `is_bot` BOOLEAN DEFAULT false,
    ADD COLUMN `user_id` VARCHAR(255),
    DROP COLUMN `created_at`,
    ADD COLUMN `created_at` INTEGER,
    DROP COLUMN `updated_at`,
    ADD COLUMN `updated_at` INTEGER;
