import React from 'react';
import { FileText, CheckCircle2, Clock, AlertTriangle, User, Calendar, DollarSign, X, Check } from 'lucide-react';
import { RentalOrder, RentalStatus } from '../types';
import { formatVND } from '../utils/formatters';

interface RentalDetailModalProps {
  rental: RentalOrder | null;
  onClose: () => void;
  onUpdateStatus: (rentalId: string, status: RentalStatus) => void;
}

export const RentalDetailModal: React.FC<RentalDetailModalProps> = ({
  rental,
  onClose,
  onUpdateStatus
}) => {
  if (!rental) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-indigo-600 font-mono">{rental.orderCode}</span>
              <span
                className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                  rental.status === 'ACTIVE'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : rental.status === 'RETURNED'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {rental.status === 'ACTIVE' ? 'Đang Cho Thuê' : rental.status === 'RETURNED' ? 'Đã Trả Máy' : rental.status}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Tạo lúc {rental.createdAt} bởi nhân viên {rental.staffName}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Grid */}
        <div className="space-y-3">
          {/* Khách hàng */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Thẻ Khách Hàng</span>
            <p className="text-sm font-extrabold text-slate-900">{rental.customerName}</p>
            <p className="text-indigo-600 font-bold font-mono">SĐT: {rental.customerPhone}</p>
          </div>

          {/* Danh sách thiết bị */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
            <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Danh Sách Thiết Bị Thích Hợp</span>
            <div className="space-y-1.5 divide-y divide-slate-200/60">
              {rental.items.map((item, idx) => (
                <div key={idx} className="pt-1 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{item.cameraName}</span>
                    <span className="text-[10px] text-slate-500 block font-mono">Model: {item.cameraModel}</span>
                  </div>
                  <span className="font-extrabold text-indigo-600">{formatVND(item.dailyRate)}/ngày</span>
                </div>
              ))}
            </div>
          </div>

          {/* Thời gian & Ca */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Thời Gian Thuê</span>
              <p className="font-bold text-slate-800 text-xs mt-0.5">{rental.startDate} → {rental.endDate}</p>
              <p className="text-[10px] text-indigo-600 font-bold mt-0.5">Ca: {rental.shift}</p>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-400 block font-bold uppercase">Tiền Cọc Giữ Máy</span>
              <p className="font-black text-indigo-600 text-xs mt-0.5">{formatVND(rental.depositAmount)}</p>
            </div>
          </div>

          {/* Tổng tiền & Đã thu */}
          <div className="p-3.5 bg-indigo-50/80 border border-indigo-200/80 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] text-indigo-900 block font-bold uppercase">Tổng Tiền Đơn Hàng</span>
              <span className="text-lg font-black text-indigo-600">{formatVND(rental.totalAmount)}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-emerald-800 block font-bold uppercase">Đã Thu</span>
              <span className="text-sm font-black text-emerald-600">{formatVND(rental.paidAmount)}</span>
            </div>
          </div>

          {rental.notes && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-700 italic">
              Ghi chú: {rental.notes}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          {rental.status === 'ACTIVE' ? (
            <button
              onClick={() => {
                onUpdateStatus(rental.id, 'RETURNED');
                onClose();
              }}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-100 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Xác Nhận Khách Trả Đủ Máy</span>
            </button>
          ) : (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Đã hoàn tất thủ tục đơn này
            </span>
          )}

          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
