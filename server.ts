import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { createServer as createViteServer } from 'vite';
import { Camera, Customer, DashboardStats, RentalOrder, Transaction, User } from './src/types';
import { initDatabase, pool } from './src/db';
import { INITIAL_CAMERAS, INITIAL_CUSTOMERS, INITIAL_RENTALS, INITIAL_STAFF, INITIAL_TRANSACTIONS } from './src/mockData';

const JWT_SECRET = 'camera_rental_secret_key_2026';
const PORT = 3000;

// Fallback in-memory state if MySQL server is not turned on
let fallbackStaff: User[] = [...INITIAL_STAFF];
let fallbackCameras: Camera[] = [...INITIAL_CAMERAS];
let fallbackCustomers: Customer[] = [...INITIAL_CUSTOMERS];
let fallbackRentals: RentalOrder[] = [...INITIAL_RENTALS];
let fallbackTransactions: Transaction[] = [...INITIAL_TRANSACTIONS];
let fallbackNotifications = [
  {
    id: 'notif_1',
    title: 'Đơn thuê mới',
    message: 'Trần Thị Bình vừa tạo đơn ORD-2026-091 cho khách Vũ Thị Thanh Hương',
    timestamp: '10:20',
    type: 'INFO',
    read: false
  },
  {
    id: 'notif_2',
    title: 'Sắp đến hạn trả',
    message: 'Đơn ORD-2026-090 (DJI Mini 4 Pro) hẹn trả trước 20:00 hôm nay',
    timestamp: '09:00',
    type: 'WARNING',
    read: false
  }
];

// Vietnam Timezone Helpers (GMT+7)
function getVietnamTime(): string {
  return new Date().toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  });
}

function getVietnamDateTimeStr(): string {
  const d = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  const parts = new Intl.DateTimeFormat('en-CA', options).formatToParts(d);
  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const day = parts.find((p) => p.type === 'day')?.value;
  const hour = parts.find((p) => p.type === 'hour')?.value;
  const minute = parts.find((p) => p.type === 'minute')?.value;
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

function getVietnamDateStr(): string {
  const d = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };
  const parts = new Intl.DateTimeFormat('en-CA', options).formatToParts(d);
  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const day = parts.find((p) => p.type === 'day')?.value;
  return `${year}-${month}-${day}`;
}

// Helpers
function formatCamera(row: any): Camera {
  return {
    ...row,
    dailyRate: Number(row.dailyRate),
    totalRentalsCount: Number(row.totalRentalsCount || 0)
  };
}

function formatCustomer(row: any): Customer {
  return {
    ...row,
    totalSpent: Number(row.totalSpent || 0),
    rentalCount: Number(row.rentalCount || 0)
  };
}

function formatRental(row: any): RentalOrder {
  return {
    ...row,
    items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
    depositAmount: Number(row.depositAmount || 0),
    totalAmount: Number(row.totalAmount || 0),
    paidAmount: Number(row.paidAmount || 0)
  };
}

function formatTransaction(row: any): Transaction {
  return {
    ...row,
    amount: Number(row.amount || 0)
  };
}

async function bootstrap() {
  const app = express();
  const server = http.createServer(app);

  let isDbConnected = false;

  // Initialize MySQL Database connection and schemas
  try {
    await initDatabase();
    isDbConnected = true;
    console.log('✅ MySQL Database is initialized and active!');
  } catch (err: any) {
    console.warn('\n----------------------------------------------------------------------');
    console.warn('⚠️  CẢNH BÁO: CHƯA KẾT NỐI ĐƯỢC VỚI MYSQL SERVER!');
    console.warn('👉 Nguyên nhân: MySQL Server (XAMPP / Laragon / MySQL Service) chưa được BẬT (Start).');
    console.warn('👉 Hãy bật MySQL (Start MySQL) trong XAMPP / Laragon rồi chạy lại `npm run dev`.');
    console.warn('👉 Ứng dụng hiện đang tạm thời chạy với dữ liệu bộ nhớ để bạn có thể xem giao diện web.');
    console.warn('----------------------------------------------------------------------\n');
  }

  // Initialize Socket.IO
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
  });

  app.use(express.json());

  // Socket.IO Connection handler
  io.on('connection', async (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);
    try {
      if (pool && isDbConnected) {
        const [camerasRaw]: any = await pool.query('SELECT * FROM cameras ORDER BY id DESC');
        const [rentalsRaw]: any = await pool.query('SELECT * FROM rentals ORDER BY id DESC');
        const [customersRaw]: any = await pool.query('SELECT * FROM customers ORDER BY id DESC');
        const [transactionsRaw]: any = await pool.query('SELECT * FROM transactions ORDER BY id DESC');
        const [notifsRaw]: any = await pool.query('SELECT id, title, message, type, timestamp, (readStatus = 1) as `read` FROM notifications ORDER BY id DESC');

        socket.emit('init_sync', {
          cameras: camerasRaw.map(formatCamera),
          rentals: rentalsRaw.map(formatRental),
          customers: customersRaw.map(formatCustomer),
          transactions: transactionsRaw.map(formatTransaction),
          notifications: notifsRaw.map((n: any) => ({ ...n, read: Boolean(n.read) }))
        });
      } else {
        socket.emit('init_sync', {
          cameras: fallbackCameras,
          rentals: fallbackRentals,
          customers: fallbackCustomers,
          transactions: fallbackTransactions,
          notifications: fallbackNotifications
        });
      }
    } catch (err) {
      console.error('[Socket.IO Sync Error]', err);
    }

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  // Helper to broadcast updates
  const broadcastUpdate = async (eventType: string, payload: any, notifyTitle?: string, notifyMessage?: string) => {
    io.emit(eventType, payload);
    if (notifyTitle && notifyMessage) {
      const notifId = `notif_${Date.now()}`;
      const timestamp = getVietnamTime();
      const newNotif = {
        id: notifId,
        title: notifyTitle,
        message: notifyMessage,
        timestamp,
        type: 'INFO',
        read: false
      };
      if (pool && isDbConnected) {
        try {
          await pool.query(
            `INSERT INTO notifications (id, title, message, type, timestamp, readStatus) VALUES (?, ?, ?, ?, ?, 0)`,
            [newNotif.id, newNotif.title, newNotif.message, newNotif.type, newNotif.timestamp]
          );
        } catch (e) {
          console.error('Failed to save notification to DB', e);
        }
      } else {
        fallbackNotifications.unshift(newNotif);
      }
      io.emit('notification:new', newNotif);
    }
  };

  // Auth Middleware
  const authenticateToken = async (req: Request, res: Response, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    let defaultUser: User = fallbackStaff[0];

    if (pool && isDbConnected) {
      try {
        const [rows]: any = await pool.query('SELECT * FROM users LIMIT 1');
        if (rows && rows.length > 0) {
          defaultUser = rows[0];
        }
      } catch (e) {}
    }

    if (!token) {
      (req as any).user = defaultUser;
      return next();
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      (req as any).user = decoded;
      next();
    } catch (err) {
      (req as any).user = defaultUser;
      next();
    }
  };

  // --- API ROUTES ---

  app.get('/api/health', async (req, res) => {
    let dbStatus = isDbConnected ? 'connected' : 'disconnected (running fallback)';
    res.json({ status: 'ok', database: dbStatus, time: new Date().toISOString() });
  });

  // AUTH API
  app.post('/api/auth/login', async (req, res) => {
    const { email } = req.body;
    if (pool && isDbConnected) {
      try {
        const [users]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (!users || users.length === 0) {
          return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
        }
        const user = users[0];
        const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, {
          expiresIn: '24h'
        });
        return res.json({ token, user });
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      const user = fallbackStaff.find((u) => u.email === email);
      if (!user) {
        return res.status(401).json({ message: 'Email hoặc mật khẩu không chính xác' });
      }
      const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET, {
        expiresIn: '24h'
      });
      return res.json({ token, user });
    }
  });

  app.get('/api/auth/me', authenticateToken, (req, res) => {
    res.json({ user: (req as any).user });
  });

  app.get('/api/users', async (req, res) => {
    if (pool && isDbConnected) {
      try {
        const [users]: any = await pool.query('SELECT * FROM users');
        return res.json(users);
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      res.json(fallbackStaff);
    }
  });

  // CAMERAS API
  app.get('/api/cameras', async (req, res) => {
    const { status, category, search } = req.query;
    if (pool && isDbConnected) {
      try {
        let query = 'SELECT * FROM cameras WHERE 1=1';
        const params: any[] = [];

        if (status && status !== 'ALL') {
          query += ' AND status = ?';
          params.push(status);
        }
        if (category && category !== 'ALL') {
          query += ' AND category = ?';
          params.push(category);
        }
        if (search) {
          query += ' AND (LOWER(name) LIKE ? OR LOWER(model) LIKE ? OR LOWER(brand) LIKE ?)';
          const term = `%${String(search).toLowerCase()}%`;
          params.push(term, term, term);
        }

        query += ' ORDER BY id DESC';

        const [rows]: any = await pool.query(query, params);
        return res.json(rows.map(formatCamera));
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      let result = [...fallbackCameras];
      if (status && status !== 'ALL') result = result.filter((c) => c.status === status);
      if (category && category !== 'ALL') result = result.filter((c) => c.category === category);
      if (search) {
        const q = String(search).toLowerCase();
        result = result.filter((c) => c.name.toLowerCase().includes(q) || c.model.toLowerCase().includes(q) || c.brand.toLowerCase().includes(q));
      }
      res.json(result);
    }
  });

  app.post('/api/cameras', async (req, res) => {
    const { name, model, brand, category, serialNumber, dailyRate, imageUrl, conditionNotes } = req.body;
    if (!name || !model || !dailyRate) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ tên, model và giá thuê' });
    }
    const newCamera: Camera = {
      id: `cam_${Date.now()}`,
      name,
      model,
      brand: brand || 'Khác',
      category: category || 'CAMERA_BODY',
      serialNumber: serialNumber || `SN-${Math.floor(Math.random() * 899999 + 100000)}`,
      dailyRate: Number(dailyRate),
      status: 'AVAILABLE',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
      conditionNotes: conditionNotes || 'Hoạt động tốt',
      totalRentalsCount: 0
    };

    if (pool && isDbConnected) {
      try {
        await pool.query(
          `INSERT INTO cameras (id, name, model, brand, category, serialNumber, dailyRate, status, imageUrl, conditionNotes, totalRentalsCount)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            newCamera.id, newCamera.name, newCamera.model, newCamera.brand, newCamera.category,
            newCamera.serialNumber, newCamera.dailyRate, newCamera.status, newCamera.imageUrl,
            newCamera.conditionNotes, newCamera.totalRentalsCount
          ]
        );

        await broadcastUpdate('camera:created', newCamera, 'Thiết bị mới', `Thêm thiết bị ${newCamera.name} vào kho`);
        return res.status(201).json(newCamera);
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      fallbackCameras.unshift(newCamera);
      await broadcastUpdate('camera:created', newCamera, 'Thiết bị mới', `Thêm thiết bị ${newCamera.name} vào kho`);
      res.status(201).json(newCamera);
    }
  });

  app.put('/api/cameras/:id', async (req, res) => {
    const { id } = req.params;
    if (pool && isDbConnected) {
      try {
        const [existing]: any = await pool.query('SELECT * FROM cameras WHERE id = ?', [id]);
        if (!existing || existing.length === 0) {
          return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
        }

        const current = formatCamera(existing[0]);
        const updated: Camera = { ...current, ...req.body };

        await pool.query(
          `UPDATE cameras SET name=?, model=?, brand=?, category=?, serialNumber=?, dailyRate=?, status=?, imageUrl=?, conditionNotes=?, totalRentalsCount=? WHERE id=?`,
          [
            updated.name, updated.model, updated.brand, updated.category,
            updated.serialNumber, updated.dailyRate, updated.status,
            updated.imageUrl, updated.conditionNotes, updated.totalRentalsCount,
            id
          ]
        );

        await broadcastUpdate('camera:updated', updated, 'Cập nhật thiết bị', `Thiết bị ${updated.name} đã thay đổi thông tin`);
        return res.json(updated);
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      const idx = fallbackCameras.findIndex((c) => c.id === id);
      if (idx === -1) return res.status(404).json({ message: 'Không tìm thấy thiết bị' });
      fallbackCameras[idx] = { ...fallbackCameras[idx], ...req.body };
      await broadcastUpdate('camera:updated', fallbackCameras[idx]);
      res.json(fallbackCameras[idx]);
    }
  });

  app.delete('/api/cameras/:id', async (req, res) => {
    const { id } = req.params;
    if (pool && isDbConnected) {
      try {
        await pool.query('DELETE FROM cameras WHERE id = ?', [id]);
        await broadcastUpdate('camera:deleted', { id });
        return res.json({ message: 'Đã xóa thiết bị thành công' });
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      fallbackCameras = fallbackCameras.filter((c) => c.id !== id);
      await broadcastUpdate('camera:deleted', { id });
      res.json({ message: 'Đã xóa thiết bị thành công' });
    }
  });

  // CUSTOMERS API
  app.get('/api/customers', async (req, res) => {
    const { search } = req.query;
    if (pool && isDbConnected) {
      try {
        let query = 'SELECT * FROM customers WHERE 1=1';
        const params: any[] = [];
        if (search) {
          query += ' AND (LOWER(name) LIKE ? OR phone LIKE ? OR LOWER(email) LIKE ?)';
          const term = `%${String(search).toLowerCase()}%`;
          params.push(term, term, term);
        }
        query += ' ORDER BY id DESC';

        const [rows]: any = await pool.query(query, params);
        return res.json(rows.map(formatCustomer));
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      let result = [...fallbackCustomers];
      if (search) {
        const q = String(search).toLowerCase();
        result = result.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || (c.email && c.email.toLowerCase().includes(q)));
      }
      res.json(result);
    }
  });

  app.post('/api/customers', async (req, res) => {
    const { name, phone, email, facebook, zalo, source, address, notes, idCardNumber } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ message: 'Tên và số điện thoại là bắt buộc' });
    }
    const newCustomer: Customer = {
      id: `cust_${Date.now()}`,
      name,
      phone,
      email: email || '',
      facebook: facebook || '',
      zalo: zalo || phone,
      source: source || 'WALK_IN',
      address: address || '',
      notes: notes || '',
      idCardNumber: idCardNumber || '',
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
            newCustomer.id, newCustomer.name, newCustomer.phone, newCustomer.email,
            newCustomer.facebook, newCustomer.zalo, newCustomer.source,
            newCustomer.idCardNumber, newCustomer.address, newCustomer.notes,
            newCustomer.totalSpent, newCustomer.rentalCount, newCustomer.createdAt
          ]
        );

        await broadcastUpdate('customer:created', newCustomer, 'Khách hàng mới', `Tạo hồ sơ khách hàng ${newCustomer.name}`);
        return res.status(201).json(newCustomer);
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      fallbackCustomers.unshift(newCustomer);
      await broadcastUpdate('customer:created', newCustomer, 'Khách hàng mới', `Tạo hồ sơ khách hàng ${newCustomer.name}`);
      res.status(201).json(newCustomer);
    }
  });

  app.put('/api/customers/:id', async (req, res) => {
    const { id } = req.params;
    if (pool && isDbConnected) {
      try {
        const [existing]: any = await pool.query('SELECT * FROM customers WHERE id = ?', [id]);
        if (!existing || existing.length === 0) {
          return res.status(404).json({ message: 'Khách hàng không tồn tại' });
        }

        const current = formatCustomer(existing[0]);
        const updated: Customer = { ...current, ...req.body };

        await pool.query(
          `UPDATE customers SET name=?, phone=?, email=?, facebook=?, zalo=?, source=?, idCardNumber=?, address=?, notes=?, totalSpent=?, rentalCount=? WHERE id=?`,
          [
            updated.name, updated.phone, updated.email, updated.facebook,
            updated.zalo, updated.source, updated.idCardNumber, updated.address,
            updated.notes, updated.totalSpent, updated.rentalCount, id
          ]
        );

        await broadcastUpdate('customer:updated', updated);
        return res.json(updated);
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      const idx = fallbackCustomers.findIndex((c) => c.id === id);
      if (idx === -1) return res.status(404).json({ message: 'Khách hàng không tồn tại' });
      fallbackCustomers[idx] = { ...fallbackCustomers[idx], ...req.body };
      await broadcastUpdate('customer:updated', fallbackCustomers[idx]);
      res.json(fallbackCustomers[idx]);
    }
  });

  // RENTALS API
  app.get('/api/rentals', async (req, res) => {
    const { status, search } = req.query;
    if (pool && isDbConnected) {
      try {
        let query = 'SELECT * FROM rentals WHERE 1=1';
        const params: any[] = [];
        if (status && status !== 'ALL') {
          query += ' AND status = ?';
          params.push(status);
        }
        if (search) {
          query += ' AND (LOWER(orderCode) LIKE ? OR LOWER(customerName) LIKE ? OR customerPhone LIKE ?)';
          const term = `%${String(search).toLowerCase()}%`;
          params.push(term, term, term);
        }
        query += ' ORDER BY id DESC';

        const [rows]: any = await pool.query(query, params);
        return res.json(rows.map(formatRental));
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      let result = [...fallbackRentals];
      if (status && status !== 'ALL') result = result.filter((r) => r.status === status);
      if (search) {
        const q = String(search).toLowerCase();
        result = result.filter(
          (r) => r.orderCode.toLowerCase().includes(q) || r.customerName.toLowerCase().includes(q) || r.customerPhone.includes(q)
        );
      }
      res.json(result);
    }
  });

  app.post('/api/rentals', authenticateToken, async (req, res) => {
    const { customerId, items, startDate, endDate, shift, depositAmount, totalAmount, paidAmount, notes, staffName } = req.body;

    if (pool && isDbConnected) {
      try {
        const [customers]: any = await pool.query('SELECT * FROM customers WHERE id = ?', [customerId]);
        if (!customers || customers.length === 0) {
          return res.status(400).json({ message: 'Khách hàng không hợp lệ' });
        }
        const customer = formatCustomer(customers[0]);

        const [rentalsCount]: any = await pool.query('SELECT COUNT(*) as count FROM rentals');
        const orderCode = `ORD-2026-${String(rentalsCount[0].count + 92).padStart(3, '0')}`;

        const newRental: RentalOrder = {
          id: `rent_${Date.now()}`,
          orderCode,
          customerId: customer.id,
          customerName: customer.name,
          customerPhone: customer.phone,
          items,
          startDate,
          endDate,
          shift: shift || 'FULL_DAY',
          depositAmount: Number(depositAmount) || 0,
          totalAmount: Number(totalAmount),
          paidAmount: Number(paidAmount) || 0,
          status: 'ACTIVE',
          staffId: (req as any).user?.id || 'usr_01',
          staffName: staffName || (req as any).user?.name || 'Nguyễn Văn Anh',
          notes: notes || '',
          createdAt: getVietnamDateTimeStr()
        };

        await pool.query(
          `INSERT INTO rentals (id, orderCode, customerId, customerName, customerPhone, items, startDate, endDate, shift, depositAmount, totalAmount, paidAmount, status, staffId, staffName, notes, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            newRental.id, newRental.orderCode, newRental.customerId, newRental.customerName, newRental.customerPhone,
            JSON.stringify(newRental.items), newRental.startDate, newRental.endDate, newRental.shift,
            newRental.depositAmount, newRental.totalAmount, newRental.paidAmount, newRental.status,
            newRental.staffId, newRental.staffName, newRental.notes, newRental.createdAt
          ]
        );

        for (const item of items) {
          await pool.query(
            'UPDATE cameras SET status = "RENTED", totalRentalsCount = totalRentalsCount + 1 WHERE id = ?',
            [item.cameraId]
          );
        }

        await pool.query(
          'UPDATE customers SET totalSpent = totalSpent + ?, rentalCount = rentalCount + 1 WHERE id = ?',
          [newRental.totalAmount, customer.id]
        );

        if (newRental.paidAmount > 0) {
          const [trxsCount]: any = await pool.query('SELECT COUNT(*) as count FROM transactions');
          const newTrx: Transaction = {
            id: `trx_${Date.now()}`,
            code: `TRX-2026-${String(trxsCount[0].count + 105).padStart(3, '0')}`,
            type: 'INCOME',
            category: 'RENTAL_PAYMENT',
            amount: newRental.paidAmount,
            description: `Thanh toán đơn thuê ${orderCode} (Khách: ${customer.name})`,
            rentalOrderId: newRental.id,
            createdById: newRental.staffId,
            createdByName: newRental.staffName,
            date: newRental.createdAt
          };

          await pool.query(
            `INSERT INTO transactions (id, code, type, category, amount, description, rentalOrderId, createdById, createdByName, date)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              newTrx.id, newTrx.code, newTrx.type, newTrx.category, newTrx.amount,
              newTrx.description, newTrx.rentalOrderId, newTrx.createdById, newTrx.createdByName, newTrx.date
            ]
          );

          io.emit('transaction:created', newTrx);
        }

        await broadcastUpdate('rental:created', newRental, 'Đơn thuê mới!', `${newRental.staffName} vừa tạo đơn ${orderCode} cho ${customer.name}`);
        return res.status(201).json(newRental);
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      const customer = fallbackCustomers.find((c) => c.id === customerId);
      if (!customer) return res.status(400).json({ message: 'Khách hàng không hợp lệ' });

      const orderCode = `ORD-2026-${String(fallbackRentals.length + 92).padStart(3, '0')}`;
      const newRental: RentalOrder = {
        id: `rent_${Date.now()}`,
        orderCode,
        customerId: customer.id,
        customerName: customer.name,
        customerPhone: customer.phone,
        items,
        startDate,
        endDate,
        shift: shift || 'FULL_DAY',
        depositAmount: Number(depositAmount) || 0,
        totalAmount: Number(totalAmount),
        paidAmount: Number(paidAmount) || 0,
        status: 'ACTIVE',
        staffId: (req as any).user?.id || 'usr_01',
        staffName: staffName || (req as any).user?.name || 'Nguyễn Văn Anh',
        notes: notes || '',
        createdAt: getVietnamDateTimeStr()
      };

      fallbackRentals.unshift(newRental);
      items.forEach((item: any) => {
        const cam = fallbackCameras.find((c) => c.id === item.cameraId);
        if (cam) {
          cam.status = 'RENTED';
          cam.totalRentalsCount += 1;
        }
      });
      customer.totalSpent += newRental.totalAmount;
      customer.rentalCount += 1;

      if (newRental.paidAmount > 0) {
        const newTrx: Transaction = {
          id: `trx_${Date.now()}`,
          code: `TRX-2026-${String(fallbackTransactions.length + 105).padStart(3, '0')}`,
          type: 'INCOME',
          category: 'RENTAL_PAYMENT',
          amount: newRental.paidAmount,
          description: `Thanh toán đơn thuê ${orderCode} (Khách: ${customer.name})`,
          rentalOrderId: newRental.id,
          createdById: newRental.staffId,
          createdByName: newRental.staffName,
          date: newRental.createdAt
        };
        fallbackTransactions.unshift(newTrx);
        io.emit('transaction:created', newTrx);
      }

      await broadcastUpdate('rental:created', newRental, 'Đơn thuê mới!', `${newRental.staffName} vừa tạo đơn ${orderCode} cho ${customer.name}`);
      res.status(201).json(newRental);
    }
  });

  app.put('/api/rentals/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (pool && isDbConnected) {
      try {
        const [existing]: any = await pool.query('SELECT * FROM rentals WHERE id = ?', [id]);
        if (!existing || existing.length === 0) {
          return res.status(404).json({ message: 'Không tìm thấy đơn thuê' });
        }

        const rental = formatRental(existing[0]);
        const prevStatus = rental.status;
        rental.status = status;

        let returnedAtVal: string | null = rental.returnedAt || null;

        if (status === 'RETURNED') {
          returnedAtVal = getVietnamDateTimeStr();
          rental.returnedAt = returnedAtVal;
          for (const item of rental.items) {
            await pool.query('UPDATE cameras SET status = "AVAILABLE" WHERE id = ?', [item.cameraId]);
          }
        }

        await pool.query('UPDATE rentals SET status = ?, returnedAt = ? WHERE id = ?', [status, returnedAtVal, id]);
        await broadcastUpdate('rental:updated', rental, 'Cập nhật trạng thái đơn', `Đơn ${rental.orderCode} đã chuyển từ ${prevStatus} sang ${status}`);
        return res.json(rental);
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      const rental = fallbackRentals.find((r) => r.id === id);
      if (!rental) return res.status(404).json({ message: 'Không tìm thấy đơn thuê' });

      const prevStatus = rental.status;
      rental.status = status;

      if (status === 'RETURNED') {
        rental.returnedAt = getVietnamDateTimeStr();
        rental.items.forEach((item) => {
          const cam = fallbackCameras.find((c) => c.id === item.cameraId);
          if (cam) cam.status = 'AVAILABLE';
        });
      }

      await broadcastUpdate('rental:updated', rental, 'Cập nhật trạng thái đơn', `Đơn ${rental.orderCode} đã chuyển từ ${prevStatus} sang ${status}`);
      res.json(rental);
    }
  });

  // TRANSACTIONS API
  app.get('/api/transactions', async (req, res) => {
    const { type, category } = req.query;
    if (pool && isDbConnected) {
      try {
        let query = 'SELECT * FROM transactions WHERE 1=1';
        const params: any[] = [];
        if (type && type !== 'ALL') {
          query += ' AND type = ?';
          params.push(type);
        }
        if (category && category !== 'ALL') {
          query += ' AND category = ?';
          params.push(category);
        }
        query += ' ORDER BY id DESC';

        const [rows]: any = await pool.query(query, params);
        return res.json(rows.map(formatTransaction));
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      let result = [...fallbackTransactions];
      if (type && type !== 'ALL') result = result.filter((t) => t.type === type);
      if (category && category !== 'ALL') result = result.filter((t) => t.category === category);
      res.json(result);
    }
  });

  app.post('/api/transactions', authenticateToken, async (req, res) => {
    const { type, category, amount, description, createdByName } = req.body;
    if (!amount || !description) {
      return res.status(400).json({ message: 'Vui lòng nhập số tiền và nội dung thu chi' });
    }

    if (pool && isDbConnected) {
      try {
        const [trxsCount]: any = await pool.query('SELECT COUNT(*) as count FROM transactions');
        const newTrx: Transaction = {
          id: `trx_${Date.now()}`,
          code: `TRX-2026-${String(trxsCount[0].count + 105).padStart(3, '0')}`,
          type: type || 'INCOME',
          category: category || 'OTHER',
          amount: Number(amount),
          description,
          createdById: (req as any).user?.id || 'usr_01',
          createdByName: createdByName || (req as any).user?.name || 'Nguyễn Văn Anh',
          date: getVietnamDateTimeStr()
        };

        await pool.query(
          `INSERT INTO transactions (id, code, type, category, amount, description, createdById, createdByName, date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            newTrx.id, newTrx.code, newTrx.type, newTrx.category, newTrx.amount,
            newTrx.description, newTrx.createdById, newTrx.createdByName, newTrx.date
          ]
        );

        await broadcastUpdate('transaction:created', newTrx, 'Phiếu thu/chi mới', `${newTrx.type === 'INCOME' ? 'Thu' : 'Chi'} ${(newTrx.amount).toLocaleString('vi-VN')} đ: ${description}`);
        return res.status(201).json(newTrx);
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      const newTrx: Transaction = {
        id: `trx_${Date.now()}`,
        code: `TRX-2026-${String(fallbackTransactions.length + 105).padStart(3, '0')}`,
        type: type || 'INCOME',
        category: category || 'OTHER',
        amount: Number(amount),
        description,
        createdById: (req as any).user?.id || 'usr_01',
        createdByName: createdByName || (req as any).user?.name || 'Nguyễn Văn Anh',
        date: getVietnamDateTimeStr()
      };
      fallbackTransactions.unshift(newTrx);
      await broadcastUpdate('transaction:created', newTrx, 'Phiếu thu/chi mới', `${newTrx.type === 'INCOME' ? 'Thu' : 'Chi'} ${(newTrx.amount).toLocaleString('vi-VN')} đ: ${description}`);
      res.status(201).json(newTrx);
    }
  });

  // DASHBOARD & ANALYTICS API
  app.get('/api/dashboard/stats', async (req, res) => {
    if (pool && isDbConnected) {
      try {
        const [rentedCamRes]: any = await pool.query('SELECT COUNT(*) as cnt FROM cameras WHERE status = "RENTED"');
        const [availCamRes]: any = await pool.query('SELECT COUNT(*) as cnt FROM cameras WHERE status = "AVAILABLE"');
        const [maintCamRes]: any = await pool.query('SELECT COUNT(*) as cnt FROM cameras WHERE status = "MAINTENANCE"');

        const todayStr = getVietnamDateStr();
        const [todayOrdersRes]: any = await pool.query('SELECT COUNT(*) as cnt FROM rentals WHERE createdAt LIKE ?', [`${todayStr}%`]);
        const [todayRevRes]: any = await pool.query('SELECT COALESCE(SUM(amount), 0) as rev FROM transactions WHERE date LIKE ? AND type = "INCOME"', [`${todayStr}%`]);
        
        const [upcomingRetRes]: any = await pool.query('SELECT COUNT(*) as cnt FROM rentals WHERE status = "ACTIVE" AND endDate = ?', [todayStr]);
        const [overdueRes]: any = await pool.query('SELECT COUNT(*) as cnt FROM rentals WHERE status = "OVERDUE"');
        const [monthlyRevRes]: any = await pool.query('SELECT COALESCE(SUM(amount), 0) as rev FROM transactions WHERE type = "INCOME"');

        const stats: DashboardStats = {
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
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      const todayStr = getVietnamDateStr();
      const stats: DashboardStats = {
        rentedCamerasCount: fallbackCameras.filter((c) => c.status === 'RENTED').length,
        availableCamerasCount: fallbackCameras.filter((c) => c.status === 'AVAILABLE').length,
        maintenanceCamerasCount: fallbackCameras.filter((c) => c.status === 'MAINTENANCE').length,
        todayOrdersCount: fallbackRentals.filter((r) => r.createdAt.startsWith(todayStr)).length,
        todayRevenue: fallbackTransactions.filter((t) => t.date.startsWith(todayStr) && t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0),
        upcomingReturnsCount: fallbackRentals.filter((r) => r.status === 'ACTIVE' && r.endDate === todayStr).length,
        overdueCount: fallbackRentals.filter((r) => r.status === 'OVERDUE').length,
        monthlyRevenue: fallbackTransactions.filter((t) => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0)
      };
      res.json(stats);
    }
  });

  app.get('/api/notifications', async (req, res) => {
    if (pool && isDbConnected) {
      try {
        const [rows]: any = await pool.query('SELECT id, title, message, type, timestamp, (readStatus = 1) as `read` FROM notifications ORDER BY id DESC');
        return res.json(rows.map((n: any) => ({ ...n, read: Boolean(n.read) })));
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      res.json(fallbackNotifications);
    }
  });

  app.post('/api/notifications/read', async (req, res) => {
    if (pool && isDbConnected) {
      try {
        await pool.query('UPDATE notifications SET readStatus = 1');
        return res.json({ message: 'Đã đánh dấu tất cả là đã đọc' });
      } catch (err: any) {
        return res.status(500).json({ message: err.message });
      }
    } else {
      fallbackNotifications.forEach((n) => (n.read = true));
      res.json({ message: 'Đã đánh dấu tất cả là đã đọc' });
    }
  });

  // VITE DEVELOPMENT OR STATIC PRODUCTION
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Camera Rental Manager Backend & Socket.IO server running on http://0.0.0.0:${PORT}`);
  });
}

bootstrap();
