-- ================================================
-- 顺风搭 (ShunFengDa) 数据库初始化脚本
-- 版本: 1.0.0
-- ================================================

CREATE DATABASE IF NOT EXISTS rideshare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE rideshare;

-- ------------------------------------------------
-- 用户表
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `role` enum('passenger','driver','admin') NOT NULL DEFAULT 'passenger',
  `isDriver` tinyint(1) NOT NULL DEFAULT 0,
  `driverVerified` tinyint(1) NOT NULL DEFAULT 0,
  `idCard` varchar(20) DEFAULT NULL,
  `carModel` varchar(100) DEFAULT NULL,
  `carPlate` varchar(20) DEFAULT NULL,
  `carColor` varchar(20) DEFAULT NULL,
  `rating` decimal(3,1) NOT NULL DEFAULT 5.0,
  `tripCount` int NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_users_phone` (`phone`),
  KEY `IDX_users_role` (`role`),
  KEY `IDX_users_isDriver` (`isDriver`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------
-- 行程表
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS `trips` (
  `id` varchar(36) NOT NULL,
  `driverId` varchar(36) NOT NULL,
  `from` varchar(100) NOT NULL,
  `to` varchar(100) NOT NULL,
  `date` date NOT NULL,
  `time` varchar(5) NOT NULL,
  `seats` int NOT NULL,
  `availableSeats` int NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `note` varchar(500) DEFAULT NULL,
  `status` enum('open','full','cancelled','completed') NOT NULL DEFAULT 'open',
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_trips_driverId` (`driverId`),
  KEY `IDX_trips_status` (`status`),
  KEY `IDX_trips_date` (`date`),
  CONSTRAINT `FK_trips_driver` FOREIGN KEY (`driverId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------
-- 预订表
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS `bookings` (
  `id` varchar(36) NOT NULL,
  `tripId` varchar(36) NOT NULL,
  `passengerId` varchar(36) NOT NULL,
  `status` enum('pending','confirmed','cancelled') NOT NULL DEFAULT 'confirmed',
  `seats` int NOT NULL DEFAULT 1,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_bookings_tripId` (`tripId`),
  KEY `IDX_bookings_passengerId` (`passengerId`),
  CONSTRAINT `FK_bookings_trip` FOREIGN KEY (`tripId`) REFERENCES `trips` (`id`),
  CONSTRAINT `FK_bookings_passenger` FOREIGN KEY (`passengerId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------
-- 聊天会话表
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS `chats` (
  `id` varchar(36) NOT NULL,
  `tripId` varchar(36) DEFAULT NULL,
  `lastMessageId` varchar(36) DEFAULT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_chats_tripId` (`tripId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------
-- 会话参与者关联表
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS `chat_participants` (
  `chatId` varchar(36) NOT NULL,
  `userId` varchar(36) NOT NULL,
  PRIMARY KEY (`chatId`, `userId`),
  KEY `IDX_chat_participants_userId` (`userId`),
  CONSTRAINT `FK_chat_participants_chat` FOREIGN KEY (`chatId`) REFERENCES `chats` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_chat_participants_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------
-- 消息表
-- ------------------------------------------------
CREATE TABLE IF NOT EXISTS `messages` (
  `id` varchar(36) NOT NULL,
  `chatId` varchar(36) NOT NULL,
  `senderId` varchar(36) NOT NULL,
  `content` text NOT NULL,
  `type` varchar(20) NOT NULL DEFAULT 'text',
  `isRead` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `IDX_messages_chatId` (`chatId`),
  KEY `IDX_messages_senderId` (`senderId`),
  CONSTRAINT `FK_messages_chat` FOREIGN KEY (`chatId`) REFERENCES `chats` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_messages_sender` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================
-- 初始数据
-- ================================================

-- 管理员账号 (密码: admin123456)
INSERT IGNORE INTO `users` (`id`, `name`, `phone`, `password`, `role`, `isDriver`, `driverVerified`, `isActive`)
VALUES (
  'admin-00000000-0000-0000-0000-000000000001',
  '超级管理员',
  '10000000000',
  '$2a$10$79sa.730PDtQsnM7EVyskup0aqhKZtFUgUysXQ7Lxgh/HwwCWE44W',
  'admin',
  0,
  0,
  1
);

-- 演示车主 (密码: 123456)
INSERT IGNORE INTO `users` (`id`, `name`, `phone`, `password`, `role`, `isDriver`, `driverVerified`,
  `idCard`, `carModel`, `carPlate`, `carColor`, `rating`, `tripCount`, `isActive`)
VALUES (
  'user-00000000-0000-0000-0000-000000000001',
  '张明',
  '13800138001',
  '$2a$10$oHcOVJ8PhYKXZXbPictx1u3suTVeFhUwFiXv0szaUYKtohK68zCCi',
  'driver',
  1,
  1,
  '110101199001011234',
  '特斯拉 Model 3',
  '沪A88888',
  '白色',
  4.9,
  126,
  1
);

-- 演示乘客 (密码: 123456)
INSERT IGNORE INTO `users` (`id`, `name`, `phone`, `password`, `role`, `isDriver`, `driverVerified`,
  `rating`, `tripCount`, `isActive`)
VALUES (
  'user-00000000-0000-0000-0000-000000000003',
  '王强',
  '13700137003',
  '$2a$10$oHcOVJ8PhYKXZXbPictx1u3suTVeFhUwFiXv0szaUYKtohK68zCCi',
  'passenger',
  0,
  0,
  4.7,
  23,
  1
);

-- 演示行程
INSERT IGNORE INTO `trips` (`id`, `driverId`, `from`, `to`, `date`, `time`, `seats`, `availableSeats`, `price`, `note`, `status`)
VALUES
  ('trip-00000000-0000-0000-0000-000000000001', 'user-00000000-0000-0000-0000-000000000001',
   '上海虹桥站', '杭州西站', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '08:30', 3, 2, 80.00, '准时出发，不抽烟，行程约2小时', 'open'),
  ('trip-00000000-0000-0000-0000-000000000002', 'user-00000000-0000-0000-0000-000000000001',
   '南京南站', '上海虹桥', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '10:00', 3, 3, 120.00, '高速直达', 'open');
