-- CreateTable
CREATE TABLE `slack_tokens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(255),
    `access_token` VARCHAR(2000),
    `refresh_token` VARCHAR(2000),
    `created_at` INTEGER,
    `updated_at` INTEGER,
    `expire_date` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
