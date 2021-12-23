/*
  Warnings:

  - You are about to drop the `slack_tokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `slack_tokens`;

-- CreateTable
CREATE TABLE `slackToken` (
    `userId` VARCHAR(32) NOT NULL,
    `teamId` VARCHAR(32) NOT NULL,
    `botUserId` VARCHAR(255) NOT NULL,
    `accessToken` VARCHAR(255) NOT NULL,
    `refreshToken` VARCHAR(255) NOT NULL,
    `expiresAt` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `slackToken.userId_teamId_unique`(`userId`, `teamId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
