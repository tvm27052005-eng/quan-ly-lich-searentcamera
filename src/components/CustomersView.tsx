import React, { useState } from 'react';
import { Users, Plus, Search, Phone, Mail, Facebook, MessageSquare, MapPin, DollarSign, History, Edit, ExternalLink } from 'lucide-react';
import { Customer, RentalOrder } from '../types';
import { formatVND } from '../utils/formatters';

interface CustomersViewProps {
  customers: Customer[];
  rentals: RentalOrder[];
  onOpenAddModal: () => void;
  onEditCustomer: (customer: Customer) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  rentals,
  onOpenAddModal,
  onEditCustomer
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomerForHistory, setSelectedCustomerForHistory] = useState<Customer | null>(null);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getCustomerRentals = (customerId: string) => {
    return rentals.filter((r) => r.customerId === customerId);
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'FACEBOOK':
        return <span className="px-2.5 py-1 text-[10px] bg-blue-50 text-blue-700 border border-blue-200/80 rounded-full font-bold">Facebook</span>;
      case 'ZALO':
        return <span className="px-2.5 py-1 text-[10px] bg-sky-50 text-sky-700 border border-sky-200/80 rounded-full font-bold">Zalo</span>;
      case 'REFERRAL':
        return <span className="px-2.5 py-1 text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full font-bold">Giới thiệu</span>;
      default:
        return <span className="px-2.5 py-1 text-[10px] bg-amber-50 text-amber-700 border border-amber-200/80 rounded-full font-bold">Khách vãng lai</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">Quản Lý Hồ Sơ Khách Hàng (CRM)</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Lưu trữ thông tin liên hệ, lịch sử thuê máy và tổng doanh thu từng khách hàng.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-2 rounded-xl shadow-md shadow-indigo-100 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Thêm Khách Hàng Mới</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm theo tên khách, số điện thoại, email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Customers Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCustomers.map((cust) => {
          const customerRentals = getCustomerRentals(cust.id);
          return (
            <div
              key={cust.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 hover:border-indigo-300 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">{cust.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-mono font-bold mt-0.5">
                      <Phone className="w-3.5 h-3.5" />
                      <span>{cust.phone}</span>
                    </div>
                  </div>
                  {getSourceBadge(cust.source)}
                </div>

                <div className="space-y-1.5 mt-3 text-xs text-slate-600">
                  {cust.email && (
                    <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{cust.email}</span>
                    </div>
                  )}
                  {cust.address && (
                    <div className="flex items-start gap-2 text-slate-500 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{cust.address}</span>
                    </div>
                  )}
                  {cust.notes && (
                    <p className="text-[11px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200/60 italic font-medium">
                      "{cust.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Stats Footer */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Tổng Chi Tiêu</span>
                  <span className="text-sm font-black text-indigo-600">{formatVND(cust.totalSpent)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Đơn Thuê</span>
                  <span className="text-xs font-bold text-slate-800">{cust.rentalCount} lượt</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setSelectedCustomerForHistory(cust)}
                  className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl border border-indigo-200/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <History className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Lịch Sử ({customerRentals.length})</span>
                </button>
                <button
                  onClick={() => onEditCustomer(cust)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 cursor-pointer"
                  title="Sửa thông tin"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rental History Modal */}
      {selectedCustomerForHistory && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Lịch Sử Thuê: {selectedCustomerForHistory.name}</h3>
                <p className="text-xs text-slate-500">Số ĐT: {selectedCustomerForHistory.phone}</p>
              </div>
              <button
                onClick={() => setSelectedCustomerForHistory(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {getCustomerRentals(selectedCustomerForHistory.id).length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">Khách hàng chưa có lịch sử thuê nào.</p>
              ) : (
                getCustomerRentals(selectedCustomerForHistory.id).map((r) => (
                  <div key={r.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-indigo-600">{r.orderCode}</span>
                      <span className="font-extrabold text-slate-900">{formatVND(r.totalAmount)}</span>
                    </div>
                    <p className="text-slate-700 font-medium">{r.items.map((i) => i.cameraName).join(', ')}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                      <span>{r.startDate} → {r.endDate}</span>
                      <span className="font-bold text-indigo-600">{r.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
