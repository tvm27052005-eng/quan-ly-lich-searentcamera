export type UserRole = 'ADMIN' | 'STAFF';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  phone: string;
}

export type CameraStatus = 'AVAILABLE' | 'RENTED' | 'MAINTENANCE';
export type CameraCategory = 'CAMERA_BODY' | 'LENS' | 'DRONE' | 'LIGHTING' | 'ACCESSORY';

export interface Camera {
  id: string;
  name: string;
  model: string;
  brand: string;
  category: CameraCategory;
  serialNumber: string;
  dailyRate: number; // VND per day
  status: CameraStatus;
  imageUrl: string;
  conditionNotes?: string;
  totalRentalsCount: number;
}

export type CustomerSource = 'FACEBOOK' | 'ZALO' | 'REFERRAL' | 'WALK_IN' | 'WEBSITE';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  facebook?: string;
  zalo?: string;
  source: CustomerSource;
  idCardNumber?: string;
  address?: string;
  notes?: string;
  totalSpent: number;
  rentalCount: number;
  createdAt: string;
}

export type RentalStatus = 'PENDING' | 'ACTIVE' | 'RETURNED' | 'OVERDUE' | 'CANCELLED';
export type RentalShift = 'MORNING' | 'AFTERNOON' | 'EVENING' | 'FULL_DAY' | 'MULTI_DAY';

export interface RentalItem {
  cameraId: string;
  cameraName: string;
  cameraModel: string;
  dailyRate: number;
  quantity: number;
}

export interface RentalOrder {
  id: string;
  orderCode: string; // e.g., ORD-2026-001
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: RentalItem[];
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  shift: RentalShift;
  depositAmount: number;
  totalAmount: number;
  paidAmount: number;
  status: RentalStatus;
  staffId: string;
  staffName: string;
  notes?: string;
  createdAt: string;
  returnedAt?: string;
}

export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionCategory = 'RENTAL_PAYMENT' | 'DEPOSIT' | 'MAINTENANCE_COST' | 'SALARY' | 'EQUIPMENT_PURCHASE' | 'UTILITIES' | 'OTHER';

export interface Transaction {
  id: string;
  code: string; // e.g., TRX-001
  type: TransactionType;
  category: TransactionCategory;
  amount: number;
  description: string;
  rentalOrderId?: string;
  createdById: string;
  createdByName: string;
  date: string; // YYYY-MM-DD HH:mm
}

export interface DashboardStats {
  rentedCamerasCount: number;
  availableCamerasCount: number;
  maintenanceCamerasCount: number;
  todayOrdersCount: number;
  todayRevenue: number;
  upcomingReturnsCount: number;
  overdueCount: number;
  monthlyRevenue: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  timestamp: string;
  read: boolean;
  rentalId?: string;
}
