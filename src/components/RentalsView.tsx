import React, { useState } from 'react';
import { FileText, Search, Filter, Plus, ArrowUpDown, Download, CheckCircle2, AlertCircle, Clock, XCircle, RefreshCw } from 'lucide-react';
import { RentalOrder, RentalStatus } from '../types';
import { formatVND, exportToExcel } from '../utils/formatters';

interface RentalsViewProps {
  rentals: RentalOrder[];
  onSelectRental: (rental: RentalOrder) => void;
  onOpenRentalModal: () => void;
  onUpdateRentalStatus: (rentalId: string, status: RentalStatus) => void;
}

export const RentalsView: React.FC<RentalsViewProps> = ({
  rentals,
  onSelectRental,
  onOpenRentalModal,
  onUpdateRentalStatus
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'NEWEST' | 'AMOUNT_DESC'>('NEWEST');

  // Filter rentals
  const filteredRentals = rentals.filter((rental) => {
    const matchesStatus = statusFilter === 'ALL' || rental.status === statusFilter;
    const matchesQuery =
      rental.orderCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rental.customerPhone.includes(searchQuery) ||
      rental.items.some((i) => i.cameraName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesQuery;
  }).sort((a, b) => {
    if (sortBy === 'AMOUNT_DESC') {
      return b.totalAmount - a.totalAmount;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleExportExcel = () => {
    const exportData = filteredRentals.map((r) => ({
      'Mã Đơn': r.orderCode,
      'Khách Hàng': r.customerName,
      'Số Điện Thoại': r.customerPhone,
      'Thiết Bị': r.items.map((i) => `${i.cameraName} (${i.quantity})`).join(', '),
      'Ngày Thuê': r.startDate,
      'Ngày Trả': r.endDate,
      'Ca Thuê': r.shift,
      'Tiền Cọc (VND)': r.depositAmount,
      'Tổng Tiền (VND)': r.totalAmount,
      'Trạng Thái': r.status,
      'Nhân Viên Tạo': r.staffName,
      'Ngày Tạo': r.createdAt
    }));
    exportToExcel(exportData, `Danh_Sach_Don_Thue_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">Quản Lý Đơn Thuê Máy & Thiết Bị</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng cộng {rentals.length} đơn hàng trong hệ thống. Tìm kiếm, lọc và chuyển trạng thái trả máy.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={onOpenRentalModal}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-2 rounded-xl shadow-md shadow-indigo-100 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Tạo Đơn Thuê Mới</span>
          </button>
        </div>
      </div>

      {/* Filters, Search & Sort Control Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {[
            { id: 'ALL', label: 'Tất Cả' },
            { id: 'ACTIVE', label: 'Đang Thuê' },
            { id: 'PENDING', label: 'Chờ Nhận' },
            { id: 'RETURNED', label: 'Đã Trả' },
            { id: 'OVERDUE', label: 'Quá Hạn' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setStatusFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                statusFilter === f.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200/60'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Mã đơn, tên khách, sđt, tên máy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 text-xs text-slate-700 font-bold rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="NEWEST">Mới nhất trước</option>
            <option value="AMOUNT_DESC">Giá trị cao nhất</option>
          </select>
        </div>
      </div>

      {/* Rentals Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3.5">Mã Đơn</th>
              <th className="p-3.5">Khách Hàng</th>
              <th className="p-3.5">Danh Sách Máy Thuê</th>
              <th className="p-3.5">Thời Gian</th>
              <th className="p-3.5">Tiền Thuê & Cọc</th>
              <th className="p-3.5">Trạng Thái</th>
              <th className="p-3.5">Nhân Viên</th>
              <th className="p-3.5 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredRentals.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                  Không tìm thấy đơn thuê nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              filteredRentals.map((rental) => (
                <tr key={rental.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-indigo-600">{rental.orderCode}</td>
                  <td className="p-3.5">
                    <div className="font-bold text-slate-800">{rental.customerName}</div>
                    <div className="text-[10px] text-slate-400">{rental.customerPhone}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="space-y-1">
                      {rental.items.map((item, idx) => (
                        <div key={idx} className="text-slate-700 font-semibold text-[11px]">
                          • {item.cameraName} x{item.quantity}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-600">
                    <div className="font-semibold">{rental.startDate} → {rental.endDate}</div>
                    <div className="text-[10px] text-indigo-600 font-bold">Ca: {rental.shift}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-extrabold text-slate-900">{formatVND(rental.totalAmount)}</div>
                    <div className="text-[10px] text-slate-400">Cọc: {formatVND(rental.depositAmount)}</div>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full inline-flex items-center gap-1 ${
                        rental.status === 'ACTIVE'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : rental.status === 'RETURNED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : rental.status === 'PENDING'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {rental.status === 'ACTIVE' && <Clock className="w-3 h-3" />}
                      {rental.status === 'RETURNED' && <CheckCircle2 className="w-3 h-3" />}
                      {rental.status === 'OVERDUE' && <AlertCircle className="w-3 h-3" />}
                      <span>
                        {rental.status === 'ACTIVE'
                          ? 'Đang Thuê'
                          : rental.status === 'RETURNED'
                          ? 'Đã Trả Máy'
                          : rental.status === 'PENDING'
                          ? 'Chờ Nhận'
                          : 'Quá Hạn'}
                      </span>
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500 text-[11px] font-medium">{rental.staffName}</td>
                  <td className="p-3.5 text-right space-x-2">
                    {rental.status === 'ACTIVE' && (
                      <button
                        onClick={() => onUpdateRentalStatus(rental.id, 'RETURNED')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg transition-all cursor-pointer shadow-xs"
                        title="Đã nhận lại máy đủ phụ kiện"
                      >
                        Trả Máy
                      </button>
                    )}
                    <button
                      onClick={() => onSelectRental(rental)}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[10px] font-bold rounded-lg border border-slate-200 transition-all cursor-pointer"
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
  );
};
