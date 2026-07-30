import React from 'react';
import { Camera, Calendar, Clock, ArrowUpRight, TrendingUp, AlertTriangle, CheckCircle2, User, ChevronRight, Activity, Plus } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Camera as CameraType, DashboardStats, RentalOrder } from '../types';
import { formatVND } from '../utils/formatters';

interface DashboardViewProps {
  stats: DashboardStats;
  cameras: CameraType[];
  rentals: RentalOrder[];
  onSelectRental: (rental: RentalOrder) => void;
  onOpenRentalModal: () => void;
  setActiveTab: (tab: string) => void;
}

const mockChartData = [
  { day: 'T2 (24/7)', revenue: 3200000, orders: 4 },
  { day: 'T3 (25/7)', revenue: 2800000, orders: 3 },
  { day: 'T4 (26/7)', revenue: 4500000, orders: 6 },
  { day: 'T5 (27/7)', revenue: 3900000, orders: 5 },
  { day: 'T6 (28/7)', revenue: 5600000, orders: 8 },
  { day: 'T7 (29/7)', revenue: 6800000, orders: 9 },
  { day: 'CN (30/7)', revenue: 4800000, orders: 7 },
];

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  cameras,
  rentals,
  onSelectRental,
  onOpenRentalModal,
  setActiveTab
}) => {
  const activeRentals = rentals.filter((r) => r.status === 'ACTIVE' || r.status === 'OVERDUE');
  const totalCameras = cameras.length;
  const availablePercent = totalCameras > 0 ? Math.round((stats.availableCamerasCount / totalCameras) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Bento Grid Top Hero Header */}
      <div className="bg-indigo-900 border border-indigo-800 rounded-2xl p-6 relative overflow-hidden shadow-lg text-white">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">Hệ thống Ca Trực Hôm Nay</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Tổng Quan Hoạt Động Cửa Hàng
            </h1>
            <p className="text-xs text-indigo-200/80 mt-1 max-w-xl leading-relaxed">
              Hệ thống đồng bộ Socket.IO thời gian thực . Cập nhật thiết bị, đơn thuê và doanh thu tức thì.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('calendar')}
              className="flex items-center gap-2 bg-indigo-800/80 hover:bg-indigo-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-indigo-700/60 transition-all cursor-pointer shadow-xs"
            >
              <Calendar className="w-4 h-4 text-indigo-300" />
              <span>Xem Lịch Google Style</span>
            </button>
            <button
              onClick={onOpenRentalModal}
              className="flex items-center gap-2 bg-white hover:bg-slate-100 text-indigo-950 text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3] text-indigo-600" />
              <span>Tạo Đơn Mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Bento Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Máy đang thuê */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:shadow-md transition-all shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Máy Đang Thuê</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{stats.rentedCamerasCount}</span>
            <span className="text-xs font-semibold text-slate-400">/ {totalCameras} máy</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${(stats.rentedCamerasCount / (totalCameras || 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Card 2: Máy trống sẵn sàng */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:shadow-md transition-all shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Máy Trống Sẵn Sàng</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-600 tracking-tight">{stats.availableCamerasCount}</span>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{availablePercent}% kho</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">Đang có sẵn giao ngay cho khách</p>
        </div>

        {/* Card 3: Đơn Hôm Nay */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:shadow-md transition-all shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đơn Hàng Hôm Nay</span>
            <div className="p-2.5 rounded-xl bg-sky-50 text-sky-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{stats.todayOrdersCount}</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +25%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">Cả nhận máy & đặt cọc trước</p>
        </div>

        {/* Card 4: Doanh thu hôm nay */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:shadow-md transition-all shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Doanh Thu Hôm Nay</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-indigo-600 tracking-tight">
            {formatVND(stats.todayRevenue)}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">Tháng này: {formatVND(stats.monthlyRevenue)}</p>
        </div>

        {/* Card 5: Cảnh báo sắp trả / quá hạn */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:shadow-md transition-all shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sắp Trả / Cần Xử Lý</span>
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-600 tracking-tight">
              {stats.upcomingReturnsCount + stats.overdueCount}
            </span>
            <span className="text-xs font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">Hôm nay</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-medium">Cần gọi nhắc khách trả đúng giờ</p>
        </div>
      </div>

      {/* Main Bento Grid: Revenue Chart + Equipment Status Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Area Chart Bento Box */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                Biểu Đồ Doanh Thu Dòng Tiền (7 Ngày Gần Nhất)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Doanh thu thu tiền mặt & chuyển khoản trực tiếp</p>
            </div>
            <span className="px-3 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full">
              +18% so với tuần trước
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} tickFormatter={(val) => `${val / 1000000}M`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(val: any) => [formatVND(Number(val)), 'Doanh thu']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Equipment Status Distribution Bento Box */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-600" />
                Trạng Thái Kho Thiết Bị
              </h2>
              <button
                onClick={() => setActiveTab('cameras')}
                className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-0.5"
              >
                Chi tiết <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {/* Status Row 1: Available */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-700 font-bold">Sẵn Sàng Giao</span>
                </div>
                <span className="text-sm font-black text-emerald-600">{stats.availableCamerasCount} máy</span>
              </div>

              {/* Status Row 2: Rented */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  <span className="text-xs text-slate-700 font-bold">Đang Cho Thuê</span>
                </div>
                <span className="text-sm font-black text-indigo-600">{stats.rentedCamerasCount} máy</span>
              </div>

              {/* Status Row 3: Maintenance */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="text-xs text-slate-700 font-bold">Bảo Trì / Vệ Sinh</span>
                </div>
                <span className="text-sm font-black text-rose-600">{stats.maintenanceCamerasCount} máy</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              💡 <span className="font-bold text-slate-800">Gợi ý kinh doanh:</span> Dòng Body Canon EOS R6 Mark II & Sony A7 IV đang có nhu cầu thuê cao nhất dịp cuối tuần.
            </p>
          </div>
        </div>
      </div>

      {/* Active Orders Section Bento Box */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              Đơn Đang Cho Thuê / Cần Theo Dõi Hiện Tại
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Bao gồm các đơn đang trong thời hạn và cần nhận trả máy</p>
          </div>
          <button
            onClick={() => setActiveTab('rentals')}
            className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
          >
            Xem tất cả đơn <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="pb-3 px-3">Mã Đơn</th>
                <th className="pb-3 px-3">Khách Hàng</th>
                <th className="pb-3 px-3">Thiết Bị Thuê</th>
                <th className="pb-3 px-3">Thời Gian Thuê</th>
                <th className="pb-3 px-3">Tổng Tiền</th>
                <th className="pb-3 px-3">Trạng Thái</th>
                <th className="pb-3 px-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeRentals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                    Không có đơn thuê nào cần xử lý lúc này.
                  </td>
                </tr>
              ) : (
                activeRentals.map((rental) => (
                  <tr key={rental.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-indigo-600">{rental.orderCode}</td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-800">{rental.customerName}</div>
                      <div className="text-[10px] text-slate-400">{rental.customerPhone}</div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-700 font-medium">
                      {rental.items.map((i) => i.cameraName).join(', ')}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">
                      <div className="font-semibold">{rental.startDate} → {rental.endDate}</div>
                      <div className="text-[10px] text-indigo-600 font-bold">Ca: {rental.shift}</div>
                    </td>
                    <td className="py-3.5 px-3 font-extrabold text-slate-900">{formatVND(rental.totalAmount)}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full ${
                          rental.status === 'ACTIVE'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200/80'
                            : rental.status === 'OVERDUE'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200/80 animate-pulse'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                        }`}
                      >
                        {rental.status === 'ACTIVE' ? 'Đang Thuê' : rental.status === 'OVERDUE' ? 'Quá Hạn Trả' : rental.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => onSelectRental(rental)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg border border-slate-200 transition-all cursor-pointer"
                      >
                        Chi Tiết
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
