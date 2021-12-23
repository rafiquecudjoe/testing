/*
  Warnings:

  - You are about to drop the column `expire_date` on the `slack_tokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `slack_tokens` DROP COLUMN `expire_date`,
    ADD COLUMN `app_id` VARCHAR(255),
    ADD COLUMN `bot_user_id` VARCHAR(255),
    ADD COLUMN `code` VARCHAR(255),
    ADD COLUMN `expires_in` INTEGER,
    ADD COLUMN `is_enterprise_install` BOOLEAN DEFAULT false,
    ADD COLUMN `scope` VARCHAR(2000),
    ADD COLUMN `team_id` VARCHAR(255),
    ADD COLUMN `team_name` VARCHAR(255),
    ADD COLUMN `token_type` VARCHAR(255);

-- CreateTable
CREATE TABLE `level_up_progress` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `team_id` VARCHAR(255),
    `stage` VARCHAR(255),
    `start_at` INTEGER,
    `end_at` INTEGER,
    `active_members` VARCHAR(255),
    `created_at` INTEGER,
    `updated_at` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
