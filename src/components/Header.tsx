import React, { useState } from 'react';
import { Camera, Calendar, LayoutDashboard, FileText, Users, DollarSign, BarChart3, Plus, Bell, Radio, UserCheck, Search, Shield, LogOut } from 'lucide-react';
import { User, AppNotification } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  staffList: User[];
  currentStaff: User;
  onStaffChange: (staff: User) => void;
  onLogout: () => void;
  socketConnected: boolean;
  notifications: AppNotification[];
  onOpenRentalModal: () => void;
  onClearNotifications: () => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  staffList,
  currentStaff,
  onStaffChange,
  onLogout,
  socketConnected,
  notifications,
  onOpenRentalModal,
  onClearNotifications,
  searchTerm,
  setSearchTerm
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showStaffMenu, setShowStaffMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Lịch Thuê', icon: Calendar },
    { id: 'rentals', label: 'Đơn Thuê', icon: FileText },
    { id: 'cameras', label: 'Kho Máy', icon: Camera },
    { id: 'customers', label: 'Khách Hàng', icon: Users },
    { id: 'transactions', label: 'Thu Chi', icon: DollarSign },
    { id: 'analytics', label: 'Báo Cáo', icon: BarChart3 }
  ];

  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-40 shadow-xs">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Realtime Status */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 shadow-md shadow-indigo-200 flex items-center justify-center text-white font-bold italic">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900">SEA RENT CAMERA</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-full">
                BENTO v2.5
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span>Hệ thống ca trực </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 text-[11px]">
                <Radio className={`w-3 h-3 ${socketConnected ? 'text-emerald-500 animate-pulse' : 'text-rose-500'}`} />
                <span className={socketConnected ? 'text-emerald-600 font-semibold' : 'text-rose-600 font-semibold'}>
                  {socketConnected ? 'Socket Live' : 'Disconnected'}
                </span>
              </span>
            </p>
          </div>
        </div>

        {/* Global Search & Actions */}
        <div className="flex items-center gap-3 flex-1 max-w-xl justify-end">
          {/* Quick Search */}
          <div className="relative w-full max-w-xs hidden md:block">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm máy, tên khách, sđt, mã đơn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100 border-none rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {/* New Rental Order Button */}
          <button
            onClick={onOpenRentalModal}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md shadow-indigo-100 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tạo Đơn Thuê</span>
          </button>

          {/* Notification Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors relative cursor-pointer"
              title="Thông báo Socket realtime"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden text-xs">
                <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-indigo-600" /> Thông báo Realtime Socket
                  </span>
                  <button
                    onClick={() => {
                      onClearNotifications();
                      setShowNotifications(false);
                    }}
                    className="text-[11px] text-indigo-600 font-semibold hover:underline cursor-pointer"
                  >
                    Đã đọc hết
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-slate-400">Chưa có thông báo mới</div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-indigo-600">{n.title}</span>
                          <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Current Staff Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowStaffMenu(!showStaffMenu)}
              className="flex items-center gap-2 p-1.5 pl-2 pr-3 bg-slate-100 border border-slate-200 rounded-xl hover:border-indigo-400 transition-all cursor-pointer"
            >
              <img src={currentStaff.avatar} alt={currentStaff.name} className="w-6 h-6 rounded-full object-cover border border-indigo-200" />
              <div className="text-left hidden sm:block">
                <p className="text-[11px] font-bold text-slate-800 leading-tight flex items-center gap-1">
                  {currentStaff.name}
                  {currentStaff.role === 'ADMIN' && <Shield className="w-3 h-3 text-indigo-600 inline" />}
                </p>
                <p className="text-[10px] text-slate-500">{currentStaff.role === 'ADMIN' ? 'Chủ quán / Admin' : 'Nhân viên ca'}</p>
              </div>
            </button>

            {/* Staff Menu Dropdown */}
            {showStaffMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-2 text-xs">
                <p className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Chuyển Nhân Viên Đang Thao Tác:
                </p>
                {staffList.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onStaffChange(s);
                      setShowStaffMenu(false);
                    }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                      currentStaff.id === s.id ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <img src={s.avatar} alt={s.name} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <p className="text-xs">{s.name}</p>
                      <p className="text-[10px] text-slate-400">{s.email}</p>
                    </div>
                    {currentStaff.id === s.id && <UserCheck className="w-4 h-4 text-indigo-600 ml-auto" />}
                  </button>
                ))}

                <div className="pt-2 mt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setShowStaffMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-left text-rose-600 hover:bg-rose-50 font-semibold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Đăng Xuất Khỏi Ca Trực</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs Bar */}
      <div className="border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1.5 overflow-x-auto scrollbar-none py-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-200/80 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
