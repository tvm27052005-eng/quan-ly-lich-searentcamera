var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_fs = __toESM(require("fs"), 1);
var import_express = __toESM(require("express"), 1);
var import_http = __toESM(require("http"), 1);
var import_path = __toESM(require("path"), 1);
var import_socket = require("socket.io");
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var import_vite = require("vite");

// src/db.ts
var import_promise = __toESM(require("mysql2/promise"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);

// src/mockData.ts
var INITIAL_STAFF = [
  {
    id: "usr_01",
    name: "Nguy\u1EC5n V\u0103n Anh",
    email: "anh.nguyen@camerarental.vn",
    role: "ADMIN",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phone: "0901234567"
  },
  {
    id: "usr_02",
    name: "Tr\u1EA7n Th\u1ECB B\xECnh",
    email: "binh.tran@camerarental.vn",
    role: "STAFF",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    phone: "0912345678"
  },
  {
    id: "usr_03",
    name: "L\xEA Ho\xE0ng C\u01B0\u1EDDng",
    email: "cuong.le@camerarental.vn",
    role: "STAFF",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    phone: "0923456789"
  }
];
var INITIAL_CAMERAS = [
  {
    id: "cam_01",
    name: "Sony Alpha A7 IV Body",
    model: "ILCE-7M4",
    brand: "Sony",
    category: "CAMERA_BODY",
    serialNumber: "SN-SNY-789012",
    dailyRate: 45e4,
    status: "RENTED",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "M\xE1y m\u1EDBi 98%, sensor s\u1EA1ch, k\xE8m 2 pin x\u1ECBn + s\u1EA1c \u0111\xF4i",
    totalRentalsCount: 28
  },
  {
    id: "cam_02",
    name: "Canon EOS R6 Mark II Body",
    model: "EOS R6 II",
    brand: "Canon",
    category: "CAMERA_BODY",
    serialNumber: "SN-CAN-456789",
    dailyRate: 5e5,
    status: "AVAILABLE",
    imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "M\u1EDBi nh\u1EADp kho, quay 4K60p kh\xF4ng gi\u1EDBi h\u1EA1n, k\xE8m 2 pin LP-E6NH",
    totalRentalsCount: 15
  },
  {
    id: "cam_03",
    name: "Fujifilm X-T5 Silver",
    model: "X-T5",
    brand: "Fujifilm",
    category: "CAMERA_BODY",
    serialNumber: "SN-FUJ-112233",
    dailyRate: 38e4,
    status: "AVAILABLE",
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "M\xE0u b\u1EA1c classic, sensor 40MP, th\xEDch h\u1EE3p ch\u1EE5p c\u01B0\u1EDBi & ch\xE2n dung",
    totalRentalsCount: 32
  },
  {
    id: "cam_04",
    name: "Sony FE 24-70mm f/2.8 GM II",
    model: "SEL2470GM2",
    brand: "Sony",
    category: "LENS",
    serialNumber: "SN-LNS-998877",
    dailyRate: 35e4,
    status: "RENTED",
    imageUrl: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Lens si\xEAu n\xE9t, k\xEDnh trong kh\xF4ng r\u1EC5 tre, filter B+W b\u1EA3o v\u1EC7",
    totalRentalsCount: 42
  },
  {
    id: "cam_05",
    name: "Canon RF 70-200mm f/2.8L IS USM",
    model: "RF70200",
    brand: "Canon",
    category: "LENS",
    serialNumber: "SN-LNS-334455",
    dailyRate: 4e5,
    status: "AVAILABLE",
    imageUrl: "https://images.unsplash.com/photo-1606986628680-45318e858e7f?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "\u1ED0ng k\xEDnh tele \u0111\u1EAFt gi\xE1, nh\u1ECF g\u1ECDn nh\u1EB9, ch\u1ED1ng rung 5 tr\u1EE5c",
    totalRentalsCount: 19
  },
  {
    id: "cam_06",
    name: "DJI Mini 4 Pro Fly More Combo",
    model: "MINI-4-PRO",
    brand: "DJI",
    category: "DRONE",
    serialNumber: "SN-DRN-887766",
    dailyRate: 4e5,
    status: "RENTED",
    imageUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "Bao g\u1ED3m tay c\u1EA7m DJI RC 2 m\xE0n h\xECnh s\xE1ng, 3 pin s\u1EA1c th\xF4ng minh",
    totalRentalsCount: 22
  },
  {
    id: "cam_07",
    name: "Godox SL-200W III LED Video Light",
    model: "SL-200W3",
    brand: "Godox",
    category: "LIGHTING",
    serialNumber: "SN-LGT-556677",
    dailyRate: 2e5,
    status: "AVAILABLE",
    imageUrl: "https://images.unsplash.com/photo-1590291130206-8d591b655938?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "\u0110\xE8n c\xF4ng su\u1EA5t cao studio, k\xE8m softbox 90cm + ch\xE2n \u0111\xE8n inox",
    totalRentalsCount: 18
  },
  {
    id: "cam_08",
    name: "Gimbal DJI RS 3 Pro Combo",
    model: "RS3-PRO",
    brand: "DJI",
    category: "ACCESSORY",
    serialNumber: "SN-GMB-123987",
    dailyRate: 25e4,
    status: "MAINTENANCE",
    imageUrl: "https://images.unsplash.com/photo-1589872337059-3f3997d3106d?w=600&auto=format&fit=crop&q=80",
    conditionNotes: "\u0110ang b\u1EA3o tr\xEC thay \u0111\u1ED9ng c\u01A1 tr\u1EE5c Roll, d\u1EF1 ki\u1EBFn xong ng\xE0y mai",
    totalRentalsCount: 35
  }
];
var INITIAL_CUSTOMERS = [
  {
    id: "cust_01",
    name: "Ph\u1EA1m Minh Tu\u1EA5n",
    phone: "0988123456",
    email: "tuan.pm@gmail.com",
    facebook: "fb.com/tuan.photographer",
    zalo: "0988123456",
    source: "FACEBOOK",
    idCardNumber: "001095012345",
    address: "123 Nguy\u1EC5n Tr\xE3i, Qu\u1EADn 1, TP. H\u1ED3 Ch\xED Minh",
    notes: "Kh\xE1ch VIP studio c\u01B0\u1EDBi, thanh to\xE1n s\xF2ng ph\u1EB3ng, gi\u1EEF m\xE1y r\u1EA5t k\u1EF9",
    totalSpent: 85e5,
    rentalCount: 9,
    createdAt: "2026-01-15"
  },
  {
    id: "cust_02",
    name: "Nguy\u1EC5n Th\u1ECB Ng\u1ECDc Anh",
    phone: "0977234567",
    email: "ngocanh.film@yahoo.com",
    facebook: "fb.com/ngocanh.production",
    zalo: "0977234567",
    source: "ZALO",
    idCardNumber: "001096054321",
    address: "45 L\xEA V\u0103n S\u1EF9, Ph\u01B0\u1EDDng 13, Qu\u1EADn 3, TP. H\u1ED3 Ch\xED Minh",
    notes: "\u0110\u1ED9i quay MV \xE2m nh\u1EA1c, hay thu\xEA th\xEAm Flycam v\xE0 \u0111\xE8n",
    totalSpent: 124e5,
    rentalCount: 14,
    createdAt: "2026-02-01"
  },
  {
    id: "cust_03",
    name: "\u0110\u1EB7ng Qu\u1ED1c Kh\xE1nh",
    phone: "0933456789",
    email: "khanh.dq@outlook.com",
    facebook: "fb.com/khanhdq",
    zalo: "0933456789",
    source: "REFERRAL",
    idCardNumber: "036098001122",
    address: "78 Ho\xE0ng Di\u1EC7u, Ph\u01B0\u1EDDng 10, Ph\xFA Nhu\u1EADn, TP. HCM",
    notes: "\u0110\u01B0\u1EE3c b\u1EA1n Tu\u1EA5n gi\u1EDBi thi\u1EC7u, ch\u1EE5p event s\u1EF1 ki\u1EC7n c\xF4ng ty",
    totalSpent: 36e5,
    rentalCount: 4,
    createdAt: "2026-03-10"
  },
  {
    id: "cust_04",
    name: "V\u0169 Th\u1ECB Thanh H\u01B0\u01A1ng",
    phone: "0909888999",
    email: "huong.vu@gmail.com",
    facebook: "fb.com/huongvu.travel",
    zalo: "0909888999",
    source: "WALK_IN",
    idCardNumber: "079199088776",
    address: "22 Th\u1EA3o \u0110i\u1EC1n, Th\xE0nh ph\u1ED1 Th\u1EE7 \u0110\u1EE9c",
    notes: "Kh\xE1ch v\xE3ng lai thu\xEA m\xE1y \u0111i du l\u1ECBch \u0110\xE0 L\u1EA1t",
    totalSpent: 18e5,
    rentalCount: 2,
    createdAt: "2026-06-20"
  }
];
var INITIAL_RENTALS = [
  {
    id: "rent_01",
    orderCode: "ORD-2026-089",
    customerId: "cust_01",
    customerName: "Ph\u1EA1m Minh Tu\u1EA5n",
    customerPhone: "0988123456",
    items: [
      {
        cameraId: "cam_01",
        cameraName: "Sony Alpha A7 IV Body",
        cameraModel: "ILCE-7M4",
        dailyRate: 45e4,
        quantity: 1
      },
      {
        cameraId: "cam_04",
        cameraName: "Sony FE 24-70mm f/2.8 GM II",
        cameraModel: "SEL2470GM2",
        dailyRate: 35e4,
        quantity: 1
      }
    ],
    startDate: "2026-07-29",
    endDate: "2026-07-31",
    shift: "MULTI_DAY",
    depositAmount: 5e6,
    totalAmount: 16e5,
    paidAmount: 16e5,
    status: "ACTIVE",
    staffId: "usr_01",
    staffName: "Nguy\u1EC5n V\u0103n Anh",
    notes: "Ch\u1EE5p show di\u1EC5n sinh nh\u1EADt doanh nghi\u1EC7p t\u1EA1i Q2",
    createdAt: "2026-07-29 08:30"
  },
  {
    id: "rent_02",
    orderCode: "ORD-2026-090",
    customerId: "cust_02",
    customerName: "Nguy\u1EC5n Th\u1ECB Ng\u1ECDc Anh",
    customerPhone: "0977234567",
    items: [
      {
        cameraId: "cam_06",
        cameraName: "DJI Mini 4 Pro Fly More Combo",
        cameraModel: "MINI-4-PRO",
        dailyRate: 4e5,
        quantity: 1
      }
    ],
    startDate: "2026-07-30",
    endDate: "2026-07-30",
    shift: "FULL_DAY",
    depositAmount: 3e6,
    totalAmount: 4e5,
    paidAmount: 4e5,
    status: "ACTIVE",
    staffId: "usr_02",
    staffName: "Tr\u1EA7n Th\u1ECB B\xECnh",
    notes: "Quay ngo\u1EA1i c\u1EA3nh g\xF3c r\u1ED9ng bi\u1EC3n C\u1EA7n Gi\u1EDD, h\u1EB9n tr\u1EA3 tr\u01B0\u1EDBc 20h t\u1ED1i nay",
    createdAt: "2026-07-30 07:15"
  },
  {
    id: "rent_03",
    orderCode: "ORD-2026-088",
    customerId: "cust_03",
    customerName: "\u0110\u1EB7ng Qu\u1ED1c Kh\xE1nh",
    customerPhone: "0933456789",
    items: [
      {
        cameraId: "cam_02",
        cameraName: "Canon EOS R6 Mark II Body",
        cameraModel: "EOS R6 II",
        dailyRate: 5e5,
        quantity: 1
      },
      {
        cameraId: "cam_05",
        cameraName: "Canon RF 70-200mm f/2.8L IS USM",
        cameraModel: "RF70200",
        dailyRate: 4e5,
        quantity: 1
      }
    ],
    startDate: "2026-07-27",
    endDate: "2026-07-29",
    shift: "MULTI_DAY",
    depositAmount: 6e6,
    totalAmount: 18e5,
    paidAmount: 18e5,
    status: "RETURNED",
    returnedAt: "2026-07-29 18:00",
    staffId: "usr_03",
    staffName: "L\xEA Ho\xE0ng C\u01B0\u1EDDng",
    notes: "\u0110\xE3 ho\xE0n tr\u1EA3 \u0111\u1EE7 ph\u1EE5 ki\u1EC7n, ho\xE0n c\u1ECDc 6 tri\u1EC7u",
    createdAt: "2026-07-27 09:00"
  },
  {
    id: "rent_04",
    orderCode: "ORD-2026-091",
    customerId: "cust_04",
    customerName: "V\u0169 Th\u1ECB Thanh H\u01B0\u01A1ng",
    customerPhone: "0909888999",
    items: [
      {
        cameraId: "cam_03",
        cameraName: "Fujifilm X-T5 Silver",
        cameraModel: "X-T5",
        dailyRate: 38e4,
        quantity: 1
      }
    ],
    startDate: "2026-07-31",
    endDate: "2026-08-02",
    shift: "MULTI_DAY",
    depositAmount: 2e6,
    totalAmount: 76e4,
    paidAmount: 3e5,
    status: "PENDING",
    staffId: "usr_02",
    staffName: "Tr\u1EA7n Th\u1ECB B\xECnh",
    notes: "\u0110\u1EB7t c\u1ECDc gi\u1EEF m\xE1y tr\u01B0\u1EDBc 300k, s\u1EBD nh\u1EADn m\xE1y s\xE1ng mai 8h30",
    createdAt: "2026-07-30 10:20"
  }
];
var INITIAL_TRANSACTIONS = [
  {
    id: "trx_01",
    code: "TRX-2026-101",
    type: "INCOME",
    category: "RENTAL_PAYMENT",
    amount: 16e5,
    description: "Thanh to\xE1n \u0111\u01A1n thu\xEA ORD-2026-089 (Kh\xE1ch: Ph\u1EA1m Minh Tu\u1EA5n)",
    rentalOrderId: "rent_01",
    createdById: "usr_01",
    createdByName: "Nguy\u1EC5n V\u0103n Anh",
    date: "2026-07-29 08:35"
  },
  {
    id: "trx_02",
    code: "TRX-2026-102",
    type: "INCOME",
    category: "RENTAL_PAYMENT",
    amount: 4e5,
    description: "Thanh to\xE1n \u0111\u01A1n ORD-2026-090 (Kh\xE1ch: Nguy\u1EC5n Th\u1ECB Ng\u1ECDc Anh)",
    rentalOrderId: "rent_02",
    createdById: "usr_02",
    createdByName: "Tr\u1EA7n Th\u1ECB B\xECnh",
    date: "2026-07-30 07:20"
  },
  {
    id: "trx_03",
    code: "TRX-2026-103",
    type: "EXPENSE",
    category: "MAINTENANCE_COST",
    amount: 85e4,
    description: "Chi ph\xED lau sensor v\xE0 s\u1EEDa gimbal RS3 Pro t\u1EA1i h\xE3ng",
    createdById: "usr_01",
    createdByName: "Nguy\u1EC5n V\u0103n Anh",
    date: "2026-07-29 14:00"
  },
  {
    id: "trx_04",
    code: "TRX-2026-104",
    type: "INCOME",
    category: "DEPOSIT",
    amount: 3e5,
    description: "C\u1ECDc gi\u1EEF m\xE1y \u0111\u01A1n ORD-2026-091 (Kh\xE1ch: V\u0169 Th\u1ECB Thanh H\u01B0\u01A1ng)",
    rentalOrderId: "rent_04",
    createdById: "usr_02",
    createdByName: "Tr\u1EA7n Th\u1ECB B\xECnh",
    date: "2026-07-30 10:22"
  }
];

// src/db.ts
import_dotenv.default.config();
var DB_HOST = process.env.DB_HOST || "localhost";
var DB_PORT = parseInt(process.env.DB_PORT || "3306", 10);
var DB_USER = process.env.DB_USER || "root";
var DB_PASSWORD = process.env.DB_PASSWORD || "";
var DB_NAME = process.env.DB_NAME || "camera_rental_db";
var pool;
async function initDatabase() {
  try {
    const sslOptions = process.env.NODE_ENV === "production" || DB_HOST !== "localhost" ? { rejectUnauthorized: false } : void 0;
    if (DB_HOST === "localhost" || DB_HOST === "127.0.0.1") {
      try {
        const rootConnection = await import_promise.default.createConnection({
          host: DB_HOST,
          port: DB_PORT,
          user: DB_USER,
          password: DB_PASSWORD
        });
        await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        await rootConnection.end();
      } catch (e) {
      }
    }
    pool = import_promise.default.createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      connectTimeout: 3e4,
      enableKeepAlive: true,
      queueLimit: 0,
      ssl: sslOptions
    });
    const conn = await pool.getConnection();
    conn.release();
    console.log(`[MySQL] Successfully connected to cloud/local database "${DB_NAME}" at ${DB_HOST}:${DB_PORT}`);
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
    await seedInitialData();
  } catch (err) {
    console.error(`[MySQL Error] Failed to initialize MySQL database: ${err.message}`);
    console.error(`\u26A0\uFE0F Make sure MySQL server is running on ${DB_HOST}:${DB_PORT} and credentials in .env are correct.`);
    throw err;
  }
}
async function seedInitialData() {
  const [users] = await pool.query("SELECT COUNT(*) as count FROM users");
  if (users[0].count === 0) {
    for (const u of INITIAL_STAFF) {
      await pool.query(
        "INSERT INTO users (id, name, email, role, avatar, phone) VALUES (?, ?, ?, ?, ?, ?)",
        [u.id, u.name, u.email, u.role, u.avatar, u.phone]
      );
    }
    console.log("[MySQL Seed] Inserted initial staff/users");
  }
  const [cameras] = await pool.query("SELECT COUNT(*) as count FROM cameras");
  if (cameras[0].count === 0) {
    for (const c of INITIAL_CAMERAS) {
      await pool.query(
        `INSERT INTO cameras (id, name, model, brand, category, serialNumber, dailyRate, status, imageUrl, conditionNotes, totalRentalsCount) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [c.id, c.name, c.model, c.brand, c.category, c.serialNumber, c.dailyRate, c.status, c.imageUrl, c.conditionNotes || "", c.totalRentalsCount]
      );
    }
    console.log("[MySQL Seed] Inserted initial cameras");
  }
  const [customers] = await pool.query("SELECT COUNT(*) as count FROM customers");
  if (customers[0].count === 0) {
    for (const cust of INITIAL_CUSTOMERS) {
      await pool.query(
        `INSERT INTO customers (id, name, phone, email, facebook, zalo, source, idCardNumber, address, notes, totalSpent, rentalCount, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          cust.id,
          cust.name,
          cust.phone,
          cust.email || "",
          cust.facebook || "",
          cust.zalo || "",
          cust.source,
          cust.idCardNumber || "",
          cust.address || "",
          cust.notes || "",
          cust.totalSpent,
          cust.rentalCount,
          cust.createdAt
        ]
      );
    }
    console.log("[MySQL Seed] Inserted initial customers");
  }
  const [rentals] = await pool.query("SELECT COUNT(*) as count FROM rentals");
  if (rentals[0].count === 0) {
    for (const r of INITIAL_RENTALS) {
      await pool.query(
        `INSERT INTO rentals (id, orderCode, customerId, customerName, customerPhone, items, startDate, endDate, shift, depositAmount, totalAmount, paidAmount, status, staffId, staffName, notes, createdAt, returnedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          r.id,
          r.orderCode,
          r.customerId,
          r.customerName,
          r.customerPhone,
          JSON.stringify(r.items),
          r.startDate,
          r.endDate,
          r.shift,
          r.depositAmount,
          r.totalAmount,
          r.paidAmount,
          r.status,
          r.staffId,
          r.staffName,
          r.notes || "",
          r.createdAt,
          r.returnedAt || null
        ]
      );
    }
    console.log("[MySQL Seed] Inserted initial rentals");
  }
  const [transactions] = await pool.query("SELECT COUNT(*) as count FROM transactions");
  if (transactions[0].count === 0) {
    for (const t of INITIAL_TRANSACTIONS) {
      await pool.query(
        `INSERT INTO transactions (id, code, type, category, amount, description, rentalOrderId, createdById, createdByName, date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          t.id,
          t.code,
          t.type,
          t.category,
          t.amount,
          t.description,
          t.rentalOrderId || null,
          t.createdById,
          t.createdByName,
          t.date
        ]
      );
    }
    console.log("[MySQL Seed] Inserted initial transactions");
  }
  const [notifications] = await pool.query("SELECT COUNT(*) as count FROM notifications");
  if (notifications[0].count === 0) {
    const initialNotifs = [
      {
        id: "notif_1",
        title: "\u0110\u01A1n thu\xEA m\u1EDBi",
        message: "Tr\u1EA7n Th\u1ECB B\xECnh v\u1EEBa t\u1EA1o \u0111\u01A1n ORD-2026-091 cho kh\xE1ch V\u0169 Th\u1ECB Thanh H\u01B0\u01A1ng",
        timestamp: "10:20",
        type: "INFO",
        readStatus: 0
      },
      {
        id: "notif_2",
        title: "S\u1EAFp \u0111\u1EBFn h\u1EA1n tr\u1EA3",
        message: "\u0110\u01A1n ORD-2026-090 (DJI Mini 4 Pro) h\u1EB9n tr\u1EA3 tr\u01B0\u1EDBc 20:00 h\xF4m nay",
        timestamp: "09:00",
        type: "WARNING",
        readStatus: 0
      }
    ];
    for (const n of initialNotifs) {
      await pool.query(
        `INSERT INTO notifications (id, title, message, type, timestamp, readStatus) VALUES (?, ?, ?, ?, ?, ?)`,
        [n.id, n.title, n.message, n.type, n.timestamp, n.readStatus]
      );
    }
    console.log("[MySQL Seed] Inserted initial notifications");
  }
}

// server.ts
var JWT_SECRET = "camera_rental_secret_key_2026";
var PORT = 3e3;
var DATA_DIR = import_path.default.join(process.cwd(), "data");
var STORE_FILE = import_path.default.join(DATA_DIR, "db_store.json");
if (!import_fs.default.existsSync(DATA_DIR)) {
  try {
    import_fs.default.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
  }
}
var fallbackStaff = [...INITIAL_STAFF];
var fallbackCameras = [...INITIAL_CAMERAS];
var fallbackCustomers = [...INITIAL_CUSTOMERS];
var fallbackRentals = [...INITIAL_RENTALS];
var fallbackTransactions = [...INITIAL_TRANSACTIONS];
var fallbackNotifications = [
  {
    id: "notif_1",
    title: "\u0110\u01A1n thu\xEA m\u1EDBi",
    message: "Tr\u1EA7n Th\u1ECB B\xECnh v\u1EEBa t\u1EA1o \u0111\u01A1n ORD-2026-091 cho kh\xE1ch V\u0169 Th\u1ECB Thanh H\u01B0\u01A1ng",
    timestamp: "10:20",
    type: "INFO",
    read: false
  },
  {
    id: "notif_2",
    title: "S\u1EAFp \u0111\u1EBFn h\u1EA1n tr\u1EA3",
    message: "\u0110\u01A1n ORD-2026-090 (DJI Mini 4 Pro) h\u1EB9n tr\u1EA3 tr\u01B0\u1EDBc 20:00 h\xF4m nay",
    timestamp: "09:00",
    type: "WARNING",
    read: false
  }
];
function loadStoreFromDisk() {
  if (import_fs.default.existsSync(STORE_FILE)) {
    try {
      const raw = import_fs.default.readFileSync(STORE_FILE, "utf-8");
      const data = JSON.parse(raw);
      if (Array.isArray(data.cameras) && data.cameras.length > 0) fallbackCameras = data.cameras;
      if (Array.isArray(data.customers) && data.customers.length > 0) fallbackCustomers = data.customers;
      if (Array.isArray(data.rentals) && data.rentals.length > 0) fallbackRentals = data.rentals;
      if (Array.isArray(data.transactions) && data.transactions.length > 0) fallbackTransactions = data.transactions;
      if (Array.isArray(data.notifications) && data.notifications.length > 0) fallbackNotifications = data.notifications;
      console.log("\u{1F4E6} Successfully loaded persistent store from disk!");
    } catch (e) {
      console.error("Failed to load store from disk", e);
    }
  }
}
function saveStoreToDisk() {
  try {
    const data = {
      cameras: fallbackCameras,
      customers: fallbackCustomers,
      rentals: fallbackRentals,
      transactions: fallbackTransactions,
      notifications: fallbackNotifications
    };
    import_fs.default.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Failed to save store to disk", e);
  }
}
function getVietnamDateObject() {
  const now = /* @__PURE__ */ new Date();
  return new Date(now.getTime() + (7 * 60 + now.getTimezoneOffset()) * 6e4);
}
function getVietnamTime() {
  const vnTime = getVietnamDateObject();
  const hour = String(vnTime.getHours()).padStart(2, "0");
  const minute = String(vnTime.getMinutes()).padStart(2, "0");
  return `${hour}:${minute}`;
}
function getVietnamDateTimeStr() {
  const vnTime = getVietnamDateObject();
  const year = vnTime.getFullYear();
  const month = String(vnTime.getMonth() + 1).padStart(2, "0");
  const day = String(vnTime.getDate()).padStart(2, "0");
  const hour = String(vnTime.getHours()).padStart(2, "0");
  const minute = String(vnTime.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}`;
}
function getVietnamDateStr() {
  const vnTime = getVietnamDateObject();
  const year = vnTime.getFullYear();
  const month = String(vnTime.getMonth() + 1).padStart(2, "0");
  const day = String(vnTime.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function formatCamera(row) {
  return {
    ...row,
    dailyRate: Number(row.dailyRate),
    totalRentalsCount: Number(row.totalRentalsCount || 0)
  };
}
function formatCustomer(row) {
  return {
    ...row,
    totalSpent: Number(row.totalSpent || 0),
    rentalCount: Number(row.rentalCount || 0)
  };
}
function formatRental(row) {
  return {
    ...row,
    items: typeof row.items === "string" ? JSON.parse(row.items) : row.items,
    depositAmount: Number(row.depositAmount || 0),
    totalAmount: Number(row.totalAmount || 0),
    paidAmount: Number(row.paidAmount || 0)
  };
}
function formatTransaction(row) {
  return {
    ...row,
    amount: Number(row.amount || 0)
  };
}
async function bootstrap() {
  loadStoreFromDisk();
  const app = (0, import_express.default)();
  const server = import_http.default.createServer(app);
  let isDbConnected = false;
  try {
    await initDatabase();
    isDbConnected = true;
    console.log("\u2705 MySQL Database is initialized and active!");
  } catch (err) {
    console.warn("\n----------------------------------------------------------------------");
    console.warn("\u26A0\uFE0F  C\u1EA2NH B\xC1O: CH\u01AFA K\u1EBET N\u1ED0I \u0110\u01AF\u1EE2C V\u1EDAI MYSQL SERVER!");
    console.warn("\u{1F449} Nguy\xEAn nh\xE2n: MySQL Server (XAMPP / Laragon / MySQL Service) ch\u01B0a \u0111\u01B0\u1EE3c B\u1EACT (Start).");
    console.warn("\u{1F449} H\xE3y b\u1EADt MySQL (Start MySQL) trong XAMPP / Laragon r\u1ED3i ch\u1EA1y l\u1EA1i `npm run dev`.");
    console.warn("\u{1F449} \u1EE8ng d\u1EE5ng hi\u1EC7n \u0111ang t\u1EA1m th\u1EDDi ch\u1EA1y v\u1EDBi d\u1EEF li\u1EC7u b\u1ED9 nh\u1EDB \u0111\u1EC3 b\u1EA1n c\xF3 th\u1EC3 xem giao di\u1EC7n web.");
    console.warn("----------------------------------------------------------------------\n");
  }
  const io = new import_socket.Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"]
    }
  });
  app.use(import_express.default.json());
  io.on("connection", async (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);
    try {
      if (pool && isDbConnected) {
        const [camerasRaw] = await pool.query("SELECT * FROM cameras ORDER BY id DESC");
        const [rentalsRaw] = await pool.query("SELECT * FROM rentals ORDER BY id DESC");
        const [customersRaw] = await pool.query("SELECT * FROM customers ORDER BY id DESC");
        const [transactionsRaw] = await pool.query("SELECT * FROM transactions ORDER BY id DESC");
        const [notifsRaw] = await pool.query("SELECT id, title, message, type, timestamp, (readStatus = 1) as `read` FROM notifications ORDER BY id DESC");
        socket.emit("init_sync", {
          cameras: camerasRaw.map(formatCamera),
          rentals: rentalsRaw.map(formatRental),
          customers: customersRaw.map(formatCustomer),
          transactions: transactionsRaw.map(formatTransaction),
          notifications: notifsRaw.map((n) => ({ ...n, read: Boolean(n.read) }))
        });
      } else {
        socket.emit("init_sync", {
          cameras: fallbackCameras,
          rentals: fallbackRentals,
          customers: fallbackCustomers,
          transactions: fallbackTransactions,
          notifications: fallbackNotifications
        });
      }
    } catch (err) {
      console.error("[Socket.IO Sync Error]", err);
    }
    socket.on("disconnect", () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });
  const broadcastUpdate = async (eventType, payload, notifyTitle, notifyMessage) => {
    io.emit(eventType, payload);
    if (notifyTitle && notifyMessage) {
      const notifId = `notif_${Date.now()}`;
      const timestamp = getVietnamTime();
      const newNotif = {
        id: notifId,
        title: notifyTitle,
        message: notifyMessage,
        timestamp,
        type: "INFO",
        read: false
      };
      if (pool && isDbConnected) {
        try {
          await pool.query(
            `INSERT INTO notifications (id, title, message, type, timestamp, readStatus) VALUES (?, ?, ?, ?, ?, 0)`,
            [newNotif.id, newNotif.title, newNotif.message, newNotif.type, newNotif.timestamp]
          );
        } catch (e) {
          console.error("Failed to save notification to DB", e);
        }
      } else {
        fallbackNotifications.unshift(newNotif);
      }
      io.emit("notification:new", newNotif);
    }
    saveStoreToDisk();
  };
  const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    let defaultUser = fallbackStaff[0];
    if (pool && isDbConnected) {
      try {
        const [rows] = await pool.query("SELECT * FROM users LIMIT 1");
        if (rows && rows.length > 0) {
          defaultUser = rows[0];
        }
      } catch (e) {
      }
    }
    if (!token) {
      req.user = defaultUser;
      return next();
    }
    try {
      const decoded = import_jsonwebtoken.default.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      req.user = defaultUser;
      next();
    }
  };
  app.get("/api/health", async (req, res) => {
    let dbStatus = isDbConnected ? "connected" : "disconnected (running fallback)";
    res.json({ status: "ok", database: dbStatus, time: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app.post("/api/auth/login", async (req, res) => {
    const { email } = req.body;
    if (pool && isDbConnected) {
      try {
        const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (!users || users.length === 0) {
          return res.status(401).json({ message: "Email ho\u1EB7c m\u1EADt kh\u1EA9u kh\xF4ng ch\xEDnh x\xE1c" });
        }
        const user = users[0];
        const token = import_jsonwebtoken.default.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, {
          expiresIn: "24h"
        });
        return res.json({ token, user });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      const user = fallbackStaff.find((u) => u.email === email);
      if (!user) {
        return res.status(401).json({ message: "Email ho\u1EB7c m\u1EADt kh\u1EA9u kh\xF4ng ch\xEDnh x\xE1c" });
      }
      const token = import_jsonwebtoken.default.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, {
        expiresIn: "24h"
      });
      return res.json({ token, user });
    }
  });
  app.get("/api/auth/me", authenticateToken, (req, res) => {
    res.json({ user: req.user });
  });
  app.get("/api/users", async (req, res) => {
    if (pool && isDbConnected) {
      try {
        const [users] = await pool.query("SELECT * FROM users");
        return res.json(users);
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      res.json(fallbackStaff);
    }
  });
  app.get("/api/cameras", async (req, res) => {
    const { status, category, search } = req.query;
    if (pool && isDbConnected) {
      try {
        let query = "SELECT * FROM cameras WHERE 1=1";
        const params = [];
        if (status && status !== "ALL") {
          query += " AND status = ?";
          params.push(status);
        }
        if (category && category !== "ALL") {
          query += " AND category = ?";
          params.push(category);
        }
        if (search) {
          query += " AND (LOWER(name) LIKE ? OR LOWER(model) LIKE ? OR LOWER(brand) LIKE ?)";
          const term = `%${String(search).toLowerCase()}%`;
          params.push(term, term, term);
        }
        query += " ORDER BY id DESC";
        const [rows] = await pool.query(query, params);
        return res.json(rows.map(formatCamera));
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      let result = [...fallbackCameras];
      if (status && status !== "ALL") result = result.filter((c) => c.status === status);
      if (category && category !== "ALL") result = result.filter((c) => c.category === category);
      if (search) {
        const q = String(search).toLowerCase();
        result = result.filter((c) => c.name.toLowerCase().includes(q) || c.model.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q));
      }
      res.json(result);
    }
  });
  app.post("/api/cameras", async (req, res) => {
    const { name, model, brand, category, serialNumber, dailyRate, imageUrl, conditionNotes } = req.body;
    if (!name || !model || !dailyRate) {
      return res.status(400).json({ message: "Vui l\xF2ng nh\u1EADp \u0111\u1EA7y \u0111\u1EE7 t\xEAn, model v\xE0 gi\xE1 thu\xEA" });
    }
    const newCamera = {
      id: `cam_${Date.now()}`,
      name,
      model,
      brand: brand || "Kh\xE1c",
      category: category || "CAMERA_BODY",
      serialNumber: serialNumber || `SN-${Math.floor(Math.random() * 899999 + 1e5)}`,
      dailyRate: Number(dailyRate),
      status: "AVAILABLE",
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80",
      conditionNotes: conditionNotes || "Ho\u1EA1t \u0111\u1ED9ng t\u1ED1t",
      totalRentalsCount: 0
    };
    if (pool && isDbConnected) {
      try {
        await pool.query(
          `INSERT INTO cameras (id, name, model, brand, category, serialNumber, dailyRate, status, imageUrl, conditionNotes, totalRentalsCount)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            newCamera.id,
            newCamera.name,
            newCamera.model,
            newCamera.brand,
            newCamera.category,
            newCamera.serialNumber,
            newCamera.dailyRate,
            newCamera.status,
            newCamera.imageUrl,
            newCamera.conditionNotes,
            newCamera.totalRentalsCount
          ]
        );
        await broadcastUpdate("camera:created", newCamera, "Thi\u1EBFt b\u1ECB m\u1EDBi", `Th\xEAm thi\u1EBFt b\u1ECB ${newCamera.name} v\xE0o kho`);
        return res.status(201).json(newCamera);
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      fallbackCameras.unshift(newCamera);
      await broadcastUpdate("camera:created", newCamera, "Thi\u1EBFt b\u1ECB m\u1EDBi", `Th\xEAm thi\u1EBFt b\u1ECB ${newCamera.name} v\xE0o kho`);
      res.status(201).json(newCamera);
    }
  });
  app.put("/api/cameras/:id", async (req, res) => {
    const { id } = req.params;
    if (pool && isDbConnected) {
      try {
        const [existing] = await pool.query("SELECT * FROM cameras WHERE id = ?", [id]);
        if (!existing || existing.length === 0) {
          return res.status(404).json({ message: "Kh\xF4ng t\xECm th\u1EA5y thi\u1EBFt b\u1ECB" });
        }
        const current = formatCamera(existing[0]);
        const updated = { ...current, ...req.body };
        await pool.query(
          `UPDATE cameras SET name=?, model=?, brand=?, category=?, serialNumber=?, dailyRate=?, status=?, imageUrl=?, conditionNotes=?, totalRentalsCount=? WHERE id=?`,
          [
            updated.name,
            updated.model,
            updated.brand,
            updated.category,
            updated.serialNumber,
            updated.dailyRate,
            updated.status,
            updated.imageUrl,
            updated.conditionNotes,
            updated.totalRentalsCount,
            id
          ]
        );
        await broadcastUpdate("camera:updated", updated, "C\u1EADp nh\u1EADt thi\u1EBFt b\u1ECB", `Thi\u1EBFt b\u1ECB ${updated.name} \u0111\xE3 thay \u0111\u1ED5i th\xF4ng tin`);
        return res.json(updated);
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      const idx = fallbackCameras.findIndex((c) => c.id === id);
      if (idx === -1) return res.status(404).json({ message: "Kh\xF4ng t\xECm th\u1EA5y thi\u1EBFt b\u1ECB" });
      fallbackCameras[idx] = { ...fallbackCameras[idx], ...req.body };
      await broadcastUpdate("camera:updated", fallbackCameras[idx]);
      res.json(fallbackCameras[idx]);
    }
  });
  app.delete("/api/cameras/:id", async (req, res) => {
    const { id } = req.params;
    if (pool && isDbConnected) {
      try {
        await pool.query("DELETE FROM cameras WHERE id = ?", [id]);
        await broadcastUpdate("camera:deleted", { id });
        return res.json({ message: "\u0110\xE3 x\xF3a thi\u1EBFt b\u1ECB th\xE0nh c\xF4ng" });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      fallbackCameras = fallbackCameras.filter((c) => c.id !== id);
      await broadcastUpdate("camera:deleted", { id });
      res.json({ message: "\u0110\xE3 x\xF3a thi\u1EBFt b\u1ECB th\xE0nh c\xF4ng" });
    }
  });
  app.get("/api/customers", async (req, res) => {
    const { search } = req.query;
    if (pool && isDbConnected) {
      try {
        let query = "SELECT * FROM customers WHERE 1=1";
        const params = [];
        if (search) {
          query += " AND (LOWER(name) LIKE ? OR phone LIKE ? OR LOWER(email) LIKE ?)";
          const term = `%${String(search).toLowerCase()}%`;
          params.push(term, term, term);
        }
        query += " ORDER BY id DESC";
        const [rows] = await pool.query(query, params);
        return res.json(rows.map(formatCustomer));
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      let result = [...fallbackCustomers];
      if (search) {
        const q = String(search).toLowerCase();
        result = result.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email && c.email.toLowerCase().includes(q));
      }
      res.json(result);
    }
  });
  app.post("/api/customers", async (req, res) => {
    const { name, phone, email, facebook, zalo, source, address, notes, idCardNumber } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ message: "T\xEAn v\xE0 s\u1ED1 \u0111i\u1EC7n tho\u1EA1i l\xE0 b\u1EAFt bu\u1ED9c" });
    }
    const newCustomer = {
      id: `cust_${Date.now()}`,
      name,
      phone,
      email: email || "",
      facebook: facebook || "",
      zalo: zalo || phone,
      source: source || "WALK_IN",
      address: address || "",
      notes: notes || "",
      idCardNumber: idCardNumber || "",
      totalSpent: 0,
      rentalCount: 0,
      createdAt: getVietnamDateStr()
    };
    if (pool && isDbConnected) {
      try {
        await pool.query(
          `INSERT INTO customers (id, name, phone, email, facebook, zalo, source, idCardNumber, address, notes, totalSpent, rentalCount, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            newCustomer.id,
            newCustomer.name,
            newCustomer.phone,
            newCustomer.email,
            newCustomer.facebook,
            newCustomer.zalo,
            newCustomer.source,
            newCustomer.idCardNumber,
            newCustomer.address,
            newCustomer.notes,
            newCustomer.totalSpent,
            newCustomer.rentalCount,
            newCustomer.createdAt
          ]
        );
        await broadcastUpdate("customer:created", newCustomer, "Kh\xE1ch h\xE0ng m\u1EDBi", `T\u1EA1o h\u1ED3 s\u01A1 kh\xE1ch h\xE0ng ${newCustomer.name}`);
        return res.status(201).json(newCustomer);
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      fallbackCustomers.unshift(newCustomer);
      await broadcastUpdate("customer:created", newCustomer, "Kh\xE1ch h\xE0ng m\u1EDBi", `T\u1EA1o h\u1ED3 s\u01A1 kh\xE1ch h\xE0ng ${newCustomer.name}`);
      res.status(201).json(newCustomer);
    }
  });
  app.put("/api/customers/:id", async (req, res) => {
    const { id } = req.params;
    if (pool && isDbConnected) {
      try {
        const [existing] = await pool.query("SELECT * FROM customers WHERE id = ?", [id]);
        if (!existing || existing.length === 0) {
          return res.status(404).json({ message: "Kh\xE1ch h\xE0ng kh\xF4ng t\u1ED3n t\u1EA1i" });
        }
        const current = formatCustomer(existing[0]);
        const updated = { ...current, ...req.body };
        await pool.query(
          `UPDATE customers SET name=?, phone=?, email=?, facebook=?, zalo=?, source=?, idCardNumber=?, address=?, notes=?, totalSpent=?, rentalCount=? WHERE id=?`,
          [
            updated.name,
            updated.phone,
            updated.email,
            updated.facebook,
            updated.zalo,
            updated.source,
            updated.idCardNumber,
            updated.address,
            updated.notes,
            updated.totalSpent,
            updated.rentalCount,
            id
          ]
        );
        await broadcastUpdate("customer:updated", updated);
        return res.json(updated);
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      const idx = fallbackCustomers.findIndex((c) => c.id === id);
      if (idx === -1) return res.status(404).json({ message: "Kh\xE1ch h\xE0ng kh\xF4ng t\u1ED3n t\u1EA1i" });
      fallbackCustomers[idx] = { ...fallbackCustomers[idx], ...req.body };
      await broadcastUpdate("customer:updated", fallbackCustomers[idx]);
      res.json(fallbackCustomers[idx]);
    }
  });
  app.get("/api/rentals", async (req, res) => {
    const { status, search } = req.query;
    if (pool && isDbConnected) {
      try {
        let query = "SELECT * FROM rentals WHERE 1=1";
        const params = [];
        if (status && status !== "ALL") {
          query += " AND status = ?";
          params.push(status);
        }
        if (search) {
          query += " AND (LOWER(orderCode) LIKE ? OR LOWER(customerName) LIKE ? OR customerPhone LIKE ?)";
          const term = `%${String(search).toLowerCase()}%`;
          params.push(term, term, term);
        }
        query += " ORDER BY id DESC";
        const [rows] = await pool.query(query, params);
        return res.json(rows.map(formatRental));
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      let result = [...fallbackRentals];
      if (status && status !== "ALL") result = result.filter((r) => r.status === status);
      if (search) {
        const q = String(search).toLowerCase();
        result = result.filter(
          (r) => r.orderCode.toLowerCase().includes(q) || r.customerName.toLowerCase().includes(q) || r.customerPhone.includes(q)
        );
      }
      res.json(result);
    }
  });
  app.post("/api/rentals", authenticateToken, async (req, res) => {
    const { customerId, items, startDate, endDate, shift, depositAmount, totalAmount, paidAmount, notes, staffName } = req.body;
    if (pool && isDbConnected) {
      try {
        const [customers] = await pool.query("SELECT * FROM customers WHERE id = ?", [customerId]);
        if (!customers || customers.length === 0) {
          return res.status(400).json({ message: "Kh\xE1ch h\xE0ng kh\xF4ng h\u1EE3p l\u1EC7" });
        }
        const customer = formatCustomer(customers[0]);
        const [rentalsCount] = await pool.query("SELECT COUNT(*) as count FROM rentals");
        const orderCode = `ORD-2026-${String(rentalsCount[0].count + 92).padStart(3, "0")}`;
        const newRental = {
          id: `rent_${Date.now()}`,
          orderCode,
          customerId: customer.id,
          customerName: customer.name,
          customerPhone: customer.phone,
          items,
          startDate,
          endDate,
          shift: shift || "FULL_DAY",
          depositAmount: Number(depositAmount) || 0,
          totalAmount: Number(totalAmount),
          paidAmount: Number(paidAmount) || 0,
          status: "ACTIVE",
          staffId: req.user?.id || "usr_01",
          staffName: staffName || req.user?.name || "Nguy\u1EC5n V\u0103n Anh",
          notes: notes || "",
          createdAt: getVietnamDateTimeStr()
        };
        await pool.query(
          `INSERT INTO rentals (id, orderCode, customerId, customerName, customerPhone, items, startDate, endDate, shift, depositAmount, totalAmount, paidAmount, status, staffId, staffName, notes, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            newRental.id,
            newRental.orderCode,
            newRental.customerId,
            newRental.customerName,
            newRental.customerPhone,
            JSON.stringify(newRental.items),
            newRental.startDate,
            newRental.endDate,
            newRental.shift,
            newRental.depositAmount,
            newRental.totalAmount,
            newRental.paidAmount,
            newRental.status,
            newRental.staffId,
            newRental.staffName,
            newRental.notes,
            newRental.createdAt
          ]
        );
        for (const item of items) {
          await pool.query(
            'UPDATE cameras SET status = "RENTED", totalRentalsCount = totalRentalsCount + 1 WHERE id = ?',
            [item.cameraId]
          );
        }
        await pool.query(
          "UPDATE customers SET totalSpent = totalSpent + ?, rentalCount = rentalCount + 1 WHERE id = ?",
          [newRental.totalAmount, customer.id]
        );
        if (newRental.paidAmount > 0) {
          const [trxsCount] = await pool.query("SELECT COUNT(*) as count FROM transactions");
          const newTrx = {
            id: `trx_${Date.now()}`,
            code: `TRX-2026-${String(trxsCount[0].count + 105).padStart(3, "0")}`,
            type: "INCOME",
            category: "RENTAL_PAYMENT",
            amount: newRental.paidAmount,
            description: `Thanh to\xE1n \u0111\u01A1n thu\xEA ${orderCode} (Kh\xE1ch: ${customer.name})`,
            rentalOrderId: newRental.id,
            createdById: newRental.staffId,
            createdByName: newRental.staffName,
            date: newRental.createdAt
          };
          await pool.query(
            `INSERT INTO transactions (id, code, type, category, amount, description, rentalOrderId, createdById, createdByName, date)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              newTrx.id,
              newTrx.code,
              newTrx.type,
              newTrx.category,
              newTrx.amount,
              newTrx.description,
              newTrx.rentalOrderId,
              newTrx.createdById,
              newTrx.createdByName,
              newTrx.date
            ]
          );
          io.emit("transaction:created", newTrx);
        }
        await broadcastUpdate("rental:created", newRental, "\u0110\u01A1n thu\xEA m\u1EDBi!", `${newRental.staffName} v\u1EEBa t\u1EA1o \u0111\u01A1n ${orderCode} cho ${customer.name}`);
        return res.status(201).json(newRental);
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      const customer = fallbackCustomers.find((c) => c.id === customerId);
      if (!customer) return res.status(400).json({ message: "Kh\xE1ch h\xE0ng kh\xF4ng h\u1EE3p l\u1EC7" });
      const orderCode = `ORD-2026-${String(fallbackRentals.length + 92).padStart(3, "0")}`;
      const newRental = {
        id: `rent_${Date.now()}`,
        orderCode,
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        items,
        startDate,
        endDate,
        shift: shift || "FULL_DAY",
        depositAmount: Number(depositAmount) || 0,
        totalAmount: Number(totalAmount),
        paidAmount: Number(paidAmount) || 0,
        status: "ACTIVE",
        staffId: req.user?.id || "usr_01",
        staffName: staffName || req.user?.name || "Nguy\u1EC5n V\u0103n Anh",
        notes: notes || "",
        createdAt: getVietnamDateTimeStr()
      };
      fallbackRentals.unshift(newRental);
      items.forEach((item) => {
        const cam = fallbackCameras.find((c) => c.id === item.cameraId);
        if (cam) {
          cam.status = "RENTED";
          cam.totalRentalsCount += 1;
        }
      });
      customer.totalSpent += newRental.totalAmount;
      customer.rentalCount += 1;
      if (newRental.paidAmount > 0) {
        const newTrx = {
          id: `trx_${Date.now()}`,
          code: `TRX-2026-${String(fallbackTransactions.length + 105).padStart(3, "0")}`,
          type: "INCOME",
          category: "RENTAL_PAYMENT",
          amount: newRental.paidAmount,
          description: `Thanh to\xE1n \u0111\u01A1n thu\xEA ${orderCode} (Kh\xE1ch: ${customer.name})`,
          rentalOrderId: newRental.id,
          createdById: newRental.staffId,
          createdByName: newRental.staffName,
          date: newRental.createdAt
        };
        fallbackTransactions.unshift(newTrx);
        io.emit("transaction:created", newTrx);
      }
      await broadcastUpdate("rental:created", newRental, "\u0110\u01A1n thu\xEA m\u1EDBi!", `${newRental.staffName} v\u1EEBa t\u1EA1o \u0111\u01A1n ${orderCode} cho ${customer.name}`);
      res.status(201).json(newRental);
    }
  });
  app.put("/api/rentals/:id/status", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (pool && isDbConnected) {
      try {
        const [existing] = await pool.query("SELECT * FROM rentals WHERE id = ?", [id]);
        if (!existing || existing.length === 0) {
          return res.status(404).json({ message: "Kh\xF4ng t\xECm th\u1EA5y \u0111\u01A1n thu\xEA" });
        }
        const rental = formatRental(existing[0]);
        const prevStatus = rental.status;
        rental.status = status;
        let returnedAtVal = rental.returnedAt || null;
        if (status === "RETURNED") {
          returnedAtVal = getVietnamDateTimeStr();
          rental.returnedAt = returnedAtVal;
          for (const item of rental.items) {
            await pool.query('UPDATE cameras SET status = "AVAILABLE" WHERE id = ?', [item.cameraId]);
          }
        }
        await pool.query("UPDATE rentals SET status = ?, returnedAt = ? WHERE id = ?", [status, returnedAtVal, id]);
        await broadcastUpdate("rental:updated", rental, "C\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i \u0111\u01A1n", `\u0110\u01A1n ${rental.orderCode} \u0111\xE3 chuy\u1EC3n t\u1EEB ${prevStatus} sang ${status}`);
        return res.json(rental);
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      const rental = fallbackRentals.find((r) => r.id === id);
      if (!rental) return res.status(404).json({ message: "Kh\xF4ng t\xECm th\u1EA5y \u0111\u01A1n thu\xEA" });
      const prevStatus = rental.status;
      rental.status = status;
      if (status === "RETURNED") {
        rental.returnedAt = getVietnamDateTimeStr();
        rental.items.forEach((item) => {
          const cam = fallbackCameras.find((c) => c.id === item.cameraId);
          if (cam) cam.status = "AVAILABLE";
        });
      }
      await broadcastUpdate("rental:updated", rental, "C\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i \u0111\u01A1n", `\u0110\u01A1n ${rental.orderCode} \u0111\xE3 chuy\u1EC3n t\u1EEB ${prevStatus} sang ${status}`);
      res.json(rental);
    }
  });
  app.get("/api/transactions", async (req, res) => {
    const { type, category } = req.query;
    if (pool && isDbConnected) {
      try {
        let query = "SELECT * FROM transactions WHERE 1=1";
        const params = [];
        if (type && type !== "ALL") {
          query += " AND type = ?";
          params.push(type);
        }
        if (category && category !== "ALL") {
          query += " AND category = ?";
          params.push(category);
        }
        query += " ORDER BY id DESC";
        const [rows] = await pool.query(query, params);
        return res.json(rows.map(formatTransaction));
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      let result = [...fallbackTransactions];
      if (type && type !== "ALL") result = result.filter((t) => t.type === type);
      if (category && category !== "ALL") result = result.filter((t) => t.category === category);
      res.json(result);
    }
  });
  app.post("/api/transactions", authenticateToken, async (req, res) => {
    const { type, category, amount, description, createdByName } = req.body;
    if (!amount || !description) {
      return res.status(400).json({ message: "Vui l\xF2ng nh\u1EADp s\u1ED1 ti\u1EC1n v\xE0 n\u1ED9i dung thu chi" });
    }
    if (pool && isDbConnected) {
      try {
        const [trxsCount] = await pool.query("SELECT COUNT(*) as count FROM transactions");
        const newTrx = {
          id: `trx_${Date.now()}`,
          code: `TRX-2026-${String(trxsCount[0].count + 105).padStart(3, "0")}`,
          type: type || "INCOME",
          category: category || "OTHER",
          amount: Number(amount),
          description,
          createdById: req.user?.id || "usr_01",
          createdByName: createdByName || req.user?.name || "Nguy\u1EC5n V\u0103n Anh",
          date: getVietnamDateTimeStr()
        };
        await pool.query(
          `INSERT INTO transactions (id, code, type, category, amount, description, createdById, createdByName, date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            newTrx.id,
            newTrx.code,
            newTrx.type,
            newTrx.category,
            newTrx.amount,
            newTrx.description,
            newTrx.createdById,
            newTrx.createdByName,
            newTrx.date
          ]
        );
        await broadcastUpdate("transaction:created", newTrx, "Phi\u1EBFu thu/chi m\u1EDBi", `${newTrx.type === "INCOME" ? "Thu" : "Chi"} ${newTrx.amount.toLocaleString("vi-VN")} \u0111: ${description}`);
        return res.status(201).json(newTrx);
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      const newTrx = {
        id: `trx_${Date.now()}`,
        code: `TRX-2026-${String(fallbackTransactions.length + 105).padStart(3, "0")}`,
        type: type || "INCOME",
        category: category || "OTHER",
        amount: Number(amount),
        description,
        createdById: req.user?.id || "usr_01",
        createdByName: createdByName || req.user?.name || "Nguy\u1EC5n V\u0103n Anh",
        date: getVietnamDateTimeStr()
      };
      fallbackTransactions.unshift(newTrx);
      await broadcastUpdate("transaction:created", newTrx, "Phi\u1EBFu thu/chi m\u1EDBi", `${newTrx.type === "INCOME" ? "Thu" : "Chi"} ${newTrx.amount.toLocaleString("vi-VN")} \u0111: ${description}`);
      res.status(201).json(newTrx);
    }
  });
  app.get("/api/dashboard/stats", async (req, res) => {
    if (pool && isDbConnected) {
      try {
        const [rentedCamRes] = await pool.query('SELECT COUNT(*) as cnt FROM cameras WHERE status = "RENTED"');
        const [availCamRes] = await pool.query('SELECT COUNT(*) as cnt FROM cameras WHERE status = "AVAILABLE"');
        const [maintCamRes] = await pool.query('SELECT COUNT(*) as cnt FROM cameras WHERE status = "MAINTENANCE"');
        const todayStr = getVietnamDateStr();
        const [todayOrdersRes] = await pool.query("SELECT COUNT(*) as cnt FROM rentals WHERE createdAt LIKE ?", [`${todayStr}%`]);
        const [todayRevRes] = await pool.query('SELECT COALESCE(SUM(amount), 0) as rev FROM transactions WHERE date LIKE ? AND type = "INCOME"', [`${todayStr}%`]);
        const [upcomingRetRes] = await pool.query('SELECT COUNT(*) as cnt FROM rentals WHERE status = "ACTIVE" AND endDate = ?', [todayStr]);
        const [overdueRes] = await pool.query('SELECT COUNT(*) as cnt FROM rentals WHERE status = "OVERDUE"');
        const [monthlyRevRes] = await pool.query('SELECT COALESCE(SUM(amount), 0) as rev FROM transactions WHERE type = "INCOME"');
        const stats = {
          rentedCamerasCount: Number(rentedCamRes[0].cnt),
          availableCamerasCount: Number(availCamRes[0].cnt),
          maintenanceCamerasCount: Number(maintCamRes[0].cnt),
          todayOrdersCount: Number(todayOrdersRes[0].cnt),
          todayRevenue: Number(todayRevRes[0].rev),
          upcomingReturnsCount: Number(upcomingRetRes[0].cnt),
          overdueCount: Number(overdueRes[0].cnt),
          monthlyRevenue: Number(monthlyRevRes[0].rev)
        };
        return res.json(stats);
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      const todayStr = getVietnamDateStr();
      const stats = {
        rentedCamerasCount: fallbackCameras.filter((c) => c.status === "RENTED").length,
        availableCamerasCount: fallbackCameras.filter((c) => c.status === "AVAILABLE").length,
        maintenanceCamerasCount: fallbackCameras.filter((c) => c.status === "MAINTENANCE").length,
        todayOrdersCount: fallbackRentals.filter((r) => r.createdAt.startsWith(todayStr)).length,
        todayRevenue: fallbackTransactions.filter((t) => t.date.startsWith(todayStr) && t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0),
        upcomingReturnsCount: fallbackRentals.filter((r) => r.status === "ACTIVE" && r.endDate === todayStr).length,
        overdueCount: fallbackRentals.filter((r) => r.status === "OVERDUE").length,
        monthlyRevenue: fallbackTransactions.filter((t) => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0)
      };
      res.json(stats);
    }
  });
  app.get("/api/notifications", async (req, res) => {
    if (pool && isDbConnected) {
      try {
        const [rows] = await pool.query("SELECT id, title, message, type, timestamp, (readStatus = 1) as `read` FROM notifications ORDER BY id DESC");
        return res.json(rows.map((n) => ({ ...n, read: Boolean(n.read) })));
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      res.json(fallbackNotifications);
    }
  });
  app.post("/api/notifications/read", async (req, res) => {
    if (pool && isDbConnected) {
      try {
        await pool.query("UPDATE notifications SET readStatus = 1");
        return res.json({ message: "\u0110\xE3 \u0111\xE1nh d\u1EA5u t\u1EA5t c\u1EA3 l\xE0 \u0111\xE3 \u0111\u1ECDc" });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      fallbackNotifications.forEach((n) => n.read = true);
      res.json({ message: "\u0110\xE3 \u0111\xE1nh d\u1EA5u t\u1EA5t c\u1EA3 l\xE0 \u0111\xE3 \u0111\u1ECDc" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`\u{1F680} Camera Rental Manager Backend & Socket.IO server running on http://0.0.0.0:${PORT}`);
  });
}
bootstrap();
//# sourceMappingURL=server.cjs.map
