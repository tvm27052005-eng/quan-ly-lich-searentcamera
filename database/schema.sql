-- Schema cho Hệ thống Quản lý Cho Thuê Camera (MySQL)
CREATE DATABASE IF NOT EXISTS `camera_rental_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `camera_rental_db`;

-- Bảng Nhân viên / Người dùng
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL,
  avatar TEXT,
  phone VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng Thiết bị / Camera
CREATE TABLE IF NOT EXISTS cameras (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  model VARCHAR(255) NOT NULL,
  brand VARCHAR(100) NOT NULL,
  category VARCHAR(100) NOT NULL,
  serialNumber VARCHAR(100),
  dailyRate DECIMAL(15,2) NOT NULL DEFAULT 0,
  status VARCHAR(50) NOT NULL DEFAULT 'AVAILABLE',
  imageUrl TEXT,
  conditionNotes TEXT,
  totalRentalsCount INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng Khách hàng
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  facebook VARCHAR(255),
  zalo VARCHAR(255),
  source VARCHAR(50) DEFAULT 'WALK_IN',
  idCardNumber VARCHAR(100),
  address TEXT,
  notes TEXT,
  totalSpent DECIMAL(15,2) DEFAULT 0,
  rentalCount INT DEFAULT 0,
  createdAt VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng Đơn thuê
CREATE TABLE IF NOT EXISTS rentals (
  id VARCHAR(50) PRIMARY KEY,
  orderCode VARCHAR(100) NOT NULL UNIQUE,
  customerId VARCHAR(50) NOT NULL,
  customerName VARCHAR(255) NOT NULL,
  customerPhone VARCHAR(50) NOT NULL,
  items JSON NOT NULL,
  startDate VARCHAR(20) NOT NULL,
  endDate VARCHAR(20) NOT NULL,
  shift VARCHAR(50) DEFAULT 'FULL_DAY',
  depositAmount DECIMAL(15,2) DEFAULT 0,
  totalAmount DECIMAL(15,2) DEFAULT 0,
  paidAmount DECIMAL(15,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  staffId VARCHAR(50),
  staffName VARCHAR(255),
  notes TEXT,
  createdAt VARCHAR(50),
  returnedAt VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng Giao dịch thu chi
CREATE TABLE IF NOT EXISTS transactions (
  id VARCHAR(50) PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  type VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  amount DECIMAL(15,2) DEFAULT 0,
  description TEXT,
  rentalOrderId VARCHAR(50),
  createdById VARCHAR(50),
  createdByName VARCHAR(255),
  date VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng Thông báo
CREATE TABLE IF NOT EXISTS notifications (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'INFO',
  timestamp VARCHAR(50),
  readStatus TINYINT(1) DEFAULT 0,
  rentalId VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
