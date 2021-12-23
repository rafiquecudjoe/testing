-- CreateTable
CREATE TABLE `praises` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `team_id` VARCHAR(255),
    `team_domain` VARCHAR(255),
    `channel_id` VARCHAR(255),
    `channel_name` VARCHAR(255),
    `user_id` VARCHAR(255),
    `user_name` VARCHAR(255),
    `command` VARCHAR(255),
    `text` VARCHAR(255),
    `api_app_id` VARCHAR(255),
    `response_url` VARCHAR(255),
    `trigger_id` VARCHAR(255),
    `created_at` INTEGER,
    `updated_at` INTEGER,
    `score` FLOAT,
    `magnitude` FLOAT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(0),
    `name` VARCHAR(255),
    `count` INTEGER,
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `slack_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `team_id` VARCHAR(255),
    `name` VARCHAR(255),
    `real_name` VARCHAR(255),
    `phone` VARCHAR(255),
    `created_at` DATETIME(0) NOT NULL,
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
