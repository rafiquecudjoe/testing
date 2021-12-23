/*
  Warnings:

  - You are about to drop the column `active_members` on the `level_up_progress` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `level_up_progress` table. All the data in the column will be lost.
  - You are about to drop the column `end_at` on the `level_up_progress` table. All the data in the column will be lost.
  - You are about to drop the column `start_at` on the `level_up_progress` table. All the data in the column will be lost.
  - You are about to drop the column `team_id` on the `level_up_progress` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `level_up_progress` table. All the data in the column will be lost.
  - You are about to drop the column `api_app_id` on the `praises` table. All the data in the column will be lost.
  - You are about to drop the column `channel_id` on the `praises` table. All the data in the column will be lost.
  - You are about to drop the column `channel_name` on the `praises` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `praises` table. All the data in the column will be lost.
  - You are about to drop the column `response_url` on the `praises` table. All the data in the column will be lost.
  - You are about to drop the column `team_domain` on the `praises` table. All the data in the column will be lost.
  - You are about to drop the column `team_id` on the `praises` table. All the data in the column will be lost.
  - You are about to drop the column `trigger_id` on the `praises` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `praises` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `praises` table. All the data in the column will be lost.
  - You are about to drop the column `user_name` on the `praises` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `reactions` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `reactions` table. All the data in the column will be lost.
  - You are about to drop the column `access_token` on the `slack_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `app_id` on the `slack_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `bot_user_id` on the `slack_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `slack_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `expires_in` on the `slack_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `is_enterprise_install` on the `slack_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `slack_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `team_id` on the `slack_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `team_name` on the `slack_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `token_type` on the `slack_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `slack_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `slack_tokens` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `slack_users` table. All the data in the column will be lost.
  - You are about to drop the column `is_bot` on the `slack_users` table. All the data in the column will be lost.
  - You are about to drop the column `real_name` on the `slack_users` table. All the data in the column will be lost.
  - You are about to drop the column `team_id` on the `slack_users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `slack_users` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `slack_users` table. All the data in the column will be lost.
  - Added the required column `createdAt` to the `reactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `reactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `level_up_progress` DROP COLUMN `active_members`,
    DROP COLUMN `created_at`,
    DROP COLUMN `end_at`,
    DROP COLUMN `start_at`,
    DROP COLUMN `team_id`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `activeMembers` VARCHAR(255),
    ADD COLUMN `createdAt` INTEGER,
    ADD COLUMN `endAt` INTEGER,
    ADD COLUMN `startAt` INTEGER,
    ADD COLUMN `teamId` VARCHAR(255),
    ADD COLUMN `updatedAt` INTEGER;

-- AlterTable
ALTER TABLE `praises` DROP COLUMN `api_app_id`,
    DROP COLUMN `channel_id`,
    DROP COLUMN `channel_name`,
    DROP COLUMN `created_at`,
    DROP COLUMN `response_url`,
    DROP COLUMN `team_domain`,
    DROP COLUMN `team_id`,
    DROP COLUMN `trigger_id`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `user_id`,
    DROP COLUMN `user_name`,
    ADD COLUMN `apiAppId` VARCHAR(255),
    ADD COLUMN `channelId` VARCHAR(255),
    ADD COLUMN `channelName` VARCHAR(255),
    ADD COLUMN `createdAt` INTEGER,
    ADD COLUMN `responseUrl` VARCHAR(255),
    ADD COLUMN `teamDomain` VARCHAR(255),
    ADD COLUMN `teamId` VARCHAR(255),
    ADD COLUMN `triggerId` VARCHAR(255),
    ADD COLUMN `updatedAt` INTEGER,
    ADD COLUMN `userId` VARCHAR(255),
    ADD COLUMN `userName` VARCHAR(255);

-- AlterTable
ALTER TABLE `reactions` DROP COLUMN `created_at`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `createdAt` DATETIME(0) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(0) NOT NULL;

-- AlterTable
ALTER TABLE `slack_tokens` DROP COLUMN `access_token`,
    DROP COLUMN `app_id`,
    DROP COLUMN `bot_user_id`,
    DROP COLUMN `created_at`,
    DROP COLUMN `expires_in`,
    DROP COLUMN `is_enterprise_install`,
    DROP COLUMN `refresh_token`,
    DROP COLUMN `team_id`,
    DROP COLUMN `team_name`,
    DROP COLUMN `token_type`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `user_id`,
    ADD COLUMN `accessToken` VARCHAR(2000),
    ADD COLUMN `appId` VARCHAR(255),
    ADD COLUMN `botUserId` VARCHAR(255),
    ADD COLUMN `createdAt` INTEGER,
    ADD COLUMN `expiresIn` INTEGER,
    ADD COLUMN `isEnterpriseInstall` BOOLEAN DEFAULT false,
    ADD COLUMN `refreshToken` VARCHAR(2000),
    ADD COLUMN `teamId` VARCHAR(255),
    ADD COLUMN `teamName` VARCHAR(255),
    ADD COLUMN `tokenType` VARCHAR(255),
    ADD COLUMN `updatedAt` INTEGER,
    ADD COLUMN `userId` VARCHAR(255);

-- AlterTable
ALTER TABLE `slack_users` DROP COLUMN `created_at`,
    DROP COLUMN `is_bot`,
    DROP COLUMN `real_name`,
    DROP COLUMN `team_id`,
    DROP COLUMN `updated_at`,
    DROP COLUMN `user_id`,
    ADD COLUMN `createdAt` INTEGER,
    ADD COLUMN `isBot` BOOLEAN DEFAULT false,
    ADD COLUMN `realName` VARCHAR(255),
    ADD COLUMN `teamId` VARCHAR(255),
    ADD COLUMN `updatedAt` INTEGER,
    ADD COLUMN `userId` VARCHAR(255);
