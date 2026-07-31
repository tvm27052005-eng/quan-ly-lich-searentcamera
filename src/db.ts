import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { INITIAL_CAMERAS, INITIAL_CUSTOMERS, INITIAL_RENTALS, INITIAL_STAFF, INITIAL_TRANSACTIONS } from './mockData';

dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'camera_rental_db';

export let pool: mysql.Pool;

export async function initDatabase() {
  try {
    const sslOptions = process.env.NODE_ENV === 'production' || DB_HOST !== 'localhost'
      ? { rejectUnauthorized: false }
      : undefined;

    // Try creating local database if on localhost
    if (DB_HOST === 'localhost' || DB_HOST === '127.0.0.1') {
      try {
        const rootConnection = await mysql.createConnection({
          host: DB_HOST,
          port: DB_PORT,
          user: DB_USER,
          password: DB_PASSWORD
        });

        await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        await rootConnection.end();
      } catch (e) {
        // Ignore local root database creation error if DB already exists or restricted
      }
    }

    // Connect Pool directly to target database with SSL support for Cloud DBs (Aiven, Railway, etc.)
    pool = mysql.createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: sslOptions
    });

    // Verify connection pool works
    const conn = await pool.getConnection();
    conn.release();

    console.log(`[MySQL] Successfully connected to cloud/local database "${DB_NAME}" at ${DB_HOST}:${DB_PORT}`);

    // Create Tables if not exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        role VARCHAR(50) NOT NULL,
        avatar TEXT,
        phone VARCHAR(50)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    await pool.query(`
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
    `);

    await pool.query(`
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
    `);

    await pool.query(`
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
    `);

    await pool.query(`
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
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'INFO',
        timestamp VARCHAR(50),
        readStatus TINYINT(1) DEFAULT 0,
        rentalId VARCHAR(50)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Seed initial data if tables are empty
    await seedInitialData();

  } catch (err: any) {
    console.error(`[MySQL Error] Failed to initialize MySQL database: ${err.message}`);
    console.error(`⚠️ Make sure MySQL server is running on ${DB_HOST}:${DB_PORT} and credentials in .env are correct.`);
    throw err;
  }
}

async function seedInitialData() {
  // Check users
  const [users]: any = await pool.query('SELECT COUNT(*) as count FROM users');
  if (users[0].count === 0) {
    for (const u of INITIAL_STAFF) {
      await pool.query(
        'INSERT INTO users (id, name, email, role, avatar, phone) VALUES (?, ?, ?, ?, ?, ?)',
        [u.id, u.name, u.email, u.role, u.avatar, u.phone]
      );
    }
    console.log('[MySQL Seed] Inserted initial staff/users');
  }

  // Check cameras
  const [cameras]: any = await pool.query('SELECT COUNT(*) as count FROM cameras');
  if (cameras[0].count === 0) {
    for (const c of INITIAL_CAMERAS) {
      await pool.query(
        `INSERT INTO cameras (id, name, model, brand, category, serialNumber, dailyRate, status, imageUrl, conditionNotes, totalRentalsCount) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [c.id, c.name, c.model, c.brand, c.category, c.serialNumber, c.dailyRate, c.status, c.imageUrl, c.conditionNotes || '', c.totalRentalsCount]
      );
    }
    console.log('[MySQL Seed] Inserted initial cameras');
  }

  // Check customers
  const [customers]: any = await pool.query('SELECT COUNT(*) as count FROM customers');
  if (customers[0].count === 0) {
    for (const cust of INITIAL_CUSTOMERS) {
      await pool.query(
        `INSERT INTO customers (id, name, phone, email, facebook, zalo, source, idCardNumber, address, notes, totalSpent, rentalCount, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cust.id, cust.name, cust.phone, cust.email || '', cust.facebook || '', cust.zalo || '',
          cust.source, cust.idCardNumber || '', cust.address || '', cust.notes || '', cust.totalSpent, cust.rentalCount, cust.createdAt
        ]
      );
    }
    console.log('[MySQL Seed] Inserted initial customers');
  }

  // Check rentals
  const [rentals]: any = await pool.query('SELECT COUNT(*) as count FROM rentals');
  if (rentals[0].count === 0) {
    for (const r of INITIAL_RENTALS) {
      await pool.query(
        `INSERT INTO rentals (id, orderCode, customerId, customerName, customerPhone, items, startDate, endDate, shift, depositAmount, totalAmount, paidAmount, status, staffId, staffName, notes, createdAt, returnedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          r.id, r.orderCode, r.customerId, r.customerName, r.customerPhone,
          JSON.stringify(r.items), r.startDate, r.endDate, r.shift,
          r.depositAmount, r.totalAmount, r.paidAmount, r.status,
          r.staffId, r.staffName, r.notes || '', r.createdAt, r.returnedAt || null
        ]
      );
    }
    console.log('[MySQL Seed] Inserted initial rentals');
  }

  // Check transactions
  const [transactions]: any = await pool.query('SELECT COUNT(*) as count FROM transactions');
  if (transactions[0].count === 0) {
    for (const t of INITIAL_TRANSACTIONS) {
      await pool.query(
        `INSERT INTO transactions (id, code, type, category, amount, description, rentalOrderId, createdById, createdByName, date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          t.id, t.code, t.type, t.category, t.amount, t.description,
          t.rentalOrderId || null, t.createdById, t.createdByName, t.date
        ]
      );
    }
    console.log('[MySQL Seed] Inserted initial transactions');
  }

  // Check notifications
  const [notifications]: any = await pool.query('SELECT COUNT(*) as count FROM notifications');
  if (notifications[0].count === 0) {
    const initialNotifs = [
      {
        id: 'notif_1',
        title: 'Đơn thuê mới',
        message: 'Trần Thị Bình vừa tạo đơn ORD-2026-091 cho khách Vũ Thị Thanh Hương',
        timestamp: '10:20',
        type: 'INFO',
        readStatus: 0
      },
      {
        id: 'notif_2',
        title: 'Sắp đến hạn trả',
        message: 'Đơn ORD-2026-090 (DJI Mini 4 Pro) hẹn trả trước 20:00 hôm nay',
        timestamp: '09:00',
        type: 'WARNING',
        readStatus: 0
      }
    ];
    for (const n of initialNotifs) {
      await pool.query(
        `INSERT INTO notifications (id, title, message, type, timestamp, readStatus) VALUES (?, ?, ?, ?, ?, ?)`,
        [n.id, n.title, n.message, n.type, n.timestamp, n.readStatus]
      );
    }
    console.log('[MySQL Seed] Inserted initial notifications');
  }
}
