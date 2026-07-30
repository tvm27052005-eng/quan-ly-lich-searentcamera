import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Camera, Customer, DashboardStats, RentalOrder, Transaction, User, AppNotification, RentalStatus } from './types';
import { INITIAL_CAMERAS, INITIAL_CUSTOMERS, INITIAL_RENTALS, INITIAL_STAFF, INITIAL_TRANSACTIONS } from './mockData';
import { Header } from './components/Header';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { CalendarView } from './components/CalendarView';
import { RentalsView } from './components/RentalsView';
import { CamerasView } from './components/CamerasView';
import { CustomersView } from './components/CustomersView';
import { TransactionsView } from './components/TransactionsView';
import { AnalyticsView } from './components/AnalyticsView';

import { RentalModal } from './components/RentalModal';
import { CameraModal } from './components/CameraModal';
import { CustomerModal } from './components/CustomerModal';
import { TransactionModal } from './components/TransactionModal';
import { RentalDetailModal } from './components/RentalDetailModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [staffList, setStaffList] = useState<User[]>(INITIAL_STAFF);
  const [currentStaff, setCurrentStaff] = useState<User>(INITIAL_STAFF[0]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('camerarental_auth');
  });
  const [socketConnected, setSocketConnected] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Main entity states
  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [rentals, setRentals] = useState<RentalOrder[]>(INITIAL_RENTALS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Modals visibility
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [editingCamera, setEditingCamera] = useState<Camera | null>(null);

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedRentalForDetail, setSelectedRentalForDetail] = useState<RentalOrder | null>(null);

  const getTodayStr = () => {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
    const y = parts.find((p) => p.type === 'year')?.value;
    const m = parts.find((p) => p.type === 'month')?.value;
    const d = parts.find((p) => p.type === 'day')?.value;
    return `${y}-${m}-${d}`;
  };

  const todayStr = getTodayStr();

  // Compute Dashboard Stats dynamically from current states
  const stats: DashboardStats = {
    rentedCamerasCount: cameras.filter((c) => c.status === 'RENTED').length,
    availableCamerasCount: cameras.filter((c) => c.status === 'AVAILABLE').length,
    maintenanceCamerasCount: cameras.filter((c) => c.status === 'MAINTENANCE').length,
    todayOrdersCount: rentals.filter((r) => r.createdAt.startsWith(todayStr)).length,
    todayRevenue: transactions
      .filter((t) => t.type === 'INCOME' && t.date.startsWith(todayStr))
      .reduce((sum, t) => sum + t.amount, 0),
    upcomingReturnsCount: rentals.filter((r) => r.status === 'ACTIVE' && r.endDate === todayStr).length,
    overdueCount: rentals.filter((r) => r.status === 'OVERDUE').length,
    monthlyRevenue: transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)
  };

  // Socket.IO Sync Initialization
  useEffect(() => {
    const socket: Socket = io();

    socket.on('connect', () => {
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    socket.on('init_sync', (data: any) => {
      if (data.cameras) setCameras(data.cameras);
      if (data.rentals) setRentals(data.rentals);
      if (data.customers) setCustomers(data.customers);
      if (data.transactions) setTransactions(data.transactions);
      if (data.notifications) setNotifications(data.notifications);
    });

    socket.on('rental:created', (newRental: RentalOrder) => {
      setRentals((prev) => [newRental, ...prev.filter((r) => r.id !== newRental.id)]);
    });

    socket.on('rental:updated', (updatedRental: RentalOrder) => {
      setRentals((prev) => prev.map((r) => (r.id === updatedRental.id ? updatedRental : r)));
    });

    socket.on('camera:created', (newCam: Camera) => {
      setCameras((prev) => [newCam, ...prev.filter((c) => c.id !== newCam.id)]);
    });

    socket.on('camera:updated', (updatedCam: Camera) => {
      setCameras((prev) => prev.map((c) => (c.id === updatedCam.id ? updatedCam : c)));
    });

    socket.on('customer:created', (newCust: Customer) => {
      setCustomers((prev) => [newCust, ...prev.filter((c) => c.id !== newCust.id)]);
    });

    socket.on('customer:updated', (updatedCust: Customer) => {
      setCustomers((prev) => prev.map((c) => (c.id === updatedCust.id ? updatedCust : c)));
    });

    socket.on('transaction:created', (newTrx: Transaction) => {
      setTransactions((prev) => [newTrx, ...prev.filter((t) => t.id !== newTrx.id)]);
    });

    socket.on('notification:new', (notif: AppNotification) => {
      setNotifications((prev) => [notif, ...prev]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Fetch initial data via REST API
  useEffect(() => {
    fetch('/api/cameras')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCameras(data);
      })
      .catch(() => {});

    fetch('/api/rentals')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRentals(data);
      })
      .catch(() => {});

    fetch('/api/customers')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCustomers(data);
      })
      .catch(() => {});

    fetch('/api/transactions')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setTransactions(data);
      })
      .catch(() => {});
  }, []);

  // Handlers for API actions
  const handleCreateOrder = async (orderData: any) => {
    try {
      const res = await fetch('/api/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const created = await res.json();
      if (res.ok) {
        setRentals((prev) => [created, ...prev]);
        // Re-fetch cameras to update status
        fetch('/api/cameras')
          .then((r) => r.json())
          .then((data) => setCameras(data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateRentalStatus = async (rentalId: string, status: RentalStatus) => {
    try {
      const res = await fetch(`/api/rentals/${rentalId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const updated = await res.json();
      if (res.ok) {
        setRentals((prev) => prev.map((r) => (r.id === rentalId ? updated : r)));
        fetch('/api/cameras')
          .then((r) => r.json())
          .then((data) => setCameras(data));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCamera = async (cameraData: any) => {
    try {
      if (cameraData.id) {
        // Edit existing camera
        const res = await fetch(`/api/cameras/${cameraData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cameraData)
        });
        const updated = await res.json();
        setCameras((prev) => prev.map((c) => (c.id === cameraData.id ? updated : c)));
      } else {
        // Create new camera
        const res = await fetch('/api/cameras', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cameraData)
        });
        const created = await res.json();
        setCameras((prev) => [created, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleCameraMaintenance = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'MAINTENANCE' ? 'AVAILABLE' : 'MAINTENANCE';
    try {
      const res = await fetch(`/api/cameras/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      const updated = await res.json();
      setCameras((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCustomer = async (custData: any) => {
    try {
      if (custData.id) {
        const res = await fetch(`/api/customers/${custData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(custData)
        });
        const updated = await res.json();
        setCustomers((prev) => prev.map((c) => (c.id === custData.id ? updated : c)));
      } else {
        const res = await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(custData)
        });
        const created = await res.json();
        setCustomers((prev) => [created, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateTransaction = async (trxData: any) => {
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trxData)
      });
      const created = await res.json();
      setTransactions((prev) => [created, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <LoginView
        staffList={staffList}
        onLoginSuccess={(user) => {
          setCurrentStaff(user);
          setIsAuthenticated(true);
          localStorage.setItem('camerarental_auth', user.id);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased selection:bg-indigo-600 selection:text-white flex flex-col justify-between">
      <div>
        {/* Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          staffList={staffList}
          currentStaff={currentStaff}
          onStaffChange={(s) => setCurrentStaff(s)}
          onLogout={() => {
            setIsAuthenticated(false);
            localStorage.removeItem('camerarental_auth');
          }}
          socketConnected={socketConnected}
          notifications={notifications}
          onOpenRentalModal={() => setIsRentalModalOpen(true)}
          onClearNotifications={() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'dashboard' && (
            <DashboardView
              stats={stats}
              cameras={cameras}
              rentals={rentals}
              onSelectRental={(r) => setSelectedRentalForDetail(r)}
              onOpenRentalModal={() => setIsRentalModalOpen(true)}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              rentals={rentals}
              onSelectRental={(r) => setSelectedRentalForDetail(r)}
              onOpenRentalModal={() => setIsRentalModalOpen(true)}
            />
          )}

          {activeTab === 'rentals' && (
            <RentalsView
              rentals={rentals}
              onSelectRental={(r) => setSelectedRentalForDetail(r)}
              onOpenRentalModal={() => setIsRentalModalOpen(true)}
              onUpdateRentalStatus={handleUpdateRentalStatus}
            />
          )}

          {activeTab === 'cameras' && (
            <CamerasView
              cameras={cameras}
              onOpenAddModal={() => {
                setEditingCamera(null);
                setIsCameraModalOpen(true);
              }}
              onEditCamera={(cam) => {
                setEditingCamera(cam);
                setIsCameraModalOpen(true);
              }}
              onToggleMaintenance={handleToggleCameraMaintenance}
            />
          )}

          {activeTab === 'customers' && (
            <CustomersView
              customers={customers}
              rentals={rentals}
              onOpenAddModal={() => {
                setEditingCustomer(null);
                setIsCustomerModalOpen(true);
              }}
              onEditCustomer={(cust) => {
                setEditingCustomer(cust);
                setIsCustomerModalOpen(true);
              }}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionsView
              transactions={transactions}
              onOpenAddModal={() => setIsTransactionModalOpen(true)}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView cameras={cameras} customers={customers} />
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-medium text-slate-600">Camera Rental Manager © 2026 • Tối ưu vận hành cửa hàng cho thuê máy ảnh</span>
          <span className="text-slate-400 font-mono text-[11px]">Clean Architecture • Bento Grid • Socket.IO</span>
        </div>
      </footer>

      {/* MODALS */}
      <RentalModal
        isOpen={isRentalModalOpen}
        onClose={() => setIsRentalModalOpen(false)}
        customers={customers}
        cameras={cameras}
        onSubmitOrder={handleCreateOrder}
        currentStaffName={currentStaff.name}
      />

      <CameraModal
        isOpen={isCameraModalOpen}
        onClose={() => {
          setIsCameraModalOpen(false);
          setEditingCamera(null);
        }}
        onSubmit={handleSaveCamera}
        editingCamera={editingCamera}
      />

      <CustomerModal
        isOpen={isCustomerModalOpen}
        onClose={() => {
          setIsCustomerModalOpen(false);
          setEditingCustomer(null);
        }}
        onSubmit={handleSaveCustomer}
        editingCustomer={editingCustomer}
      />

      <TransactionModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onSubmit={handleCreateTransaction}
        currentStaffName={currentStaff.name}
      />

      <RentalDetailModal
        rental={selectedRentalForDetail}
        onClose={() => setSelectedRentalForDetail(null)}
        onUpdateStatus={handleUpdateRentalStatus}
      />
    </div>
  );
}
