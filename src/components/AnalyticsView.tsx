import React from 'react';
import { BarChart3, TrendingUp, PieChart as PieIcon, Award, DollarSign, Camera } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Camera as CameraType, Customer } from '../types';
import { formatVND } from '../utils/formatters';

interface AnalyticsViewProps {
  cameras: CameraType[];
  customers: Customer[];
}

const monthlyData = [
  { month: 'Tháng 1', revenue: 24500000, expense: 8000000, profit: 16500000 },
  { month: 'Tháng 2', revenue: 31200000, expense: 9500000, profit: 21700000 },
  { month: 'Tháng 3', revenue: 28900000, expense: 7200000, profit: 21700000 },
  { month: 'Tháng 4', revenue: 36800000, expense: 11000000, profit: 25800000 },
  { month: 'Tháng 5', revenue: 42000000, expense: 12500000, profit: 29500000 },
  { month: 'Tháng 6', revenue: 39500000, expense: 10000000, profit: 29500000 },
  { month: 'Tháng 7', revenue: 48000000, expense: 13000000, profit: 35000000 }
];

const channelData = [
  { name: 'Facebook Ads', value: 45, color: '#3b82f6' },
  { name: 'Zalo / Bạn bè', value: 30, color: '#06b6d4' },
  { name: 'Người quen giới thiệu', value: 15, color: '#10b981' },
  { name: 'Khách vãng lai', value: 10, color: '#f59e0b' }
];

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ cameras, customers }) => {
  const topCameras = [...cameras].sort((a, b) => b.totalRentalsCount - a.totalRentalsCount).slice(0, 5);
  const topCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="border-b border-slate-100 pb-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <h1 className="text-xl font-bold text-slate-900">Báo Cáo Phân Tích Hiệu Quả Kinh Doanh</h1>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Thống kê doanh thu theo tháng, top máy cho thuê tốt nhất, kênh kiếm khách và bảng xếp hạng khách hàng.
        </p>
      </div>

      {/* Chart Row 1: Monthly Revenue vs Profit */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            Doanh Thu & Lợi Nhuận Theo Tháng (VNĐ)
          </h2>
          <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200/60">
            Tăng trưởng trung bình: +15%/tháng
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.8} />
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={10} tickFormatter={(v) => `${v / 1000000}M`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(val: any) => [formatVND(Number(val)), '']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="revenue" name="Doanh Thu" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              <Bar dataKey="profit" name="Lợi Nhuận Ròng" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart Row 2: Top Cameras & Acquisition Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Most Rented Cameras */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
            <Camera className="w-4 h-4 text-indigo-600" />
            Top 5 Thiết Bị Được Thuê Nhiều Nhất
          </h2>

          <div className="space-y-3">
            {topCameras.map((cam, idx) => (
              <div key={cam.id} className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center ${
                    idx === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="text-xs font-extrabold text-slate-900 line-clamp-1">{cam.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{cam.brand} • {cam.model}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-indigo-600">{cam.totalRentalsCount} lượt</span>
                  <span className="text-[10px] text-slate-400 block">{formatVND(cam.dailyRate)}/ngày</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Acquisition Channel Breakdown */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2">
            <PieIcon className="w-4 h-4 text-indigo-600" />
            Tỷ Lệ Nguồn Khách Hàng (Channel Sources)
          </h2>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: any) => [`${val}%`, 'Tỷ lệ']} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
