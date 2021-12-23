/*
  Warnings:

  - The `createdAt` column on the `slackToken` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updatedAt` column on the `slackToken` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE `slackToken` DROP COLUMN `createdAt`,
    ADD COLUMN `createdAt` INTEGER,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `updatedAt` INTEGER;
