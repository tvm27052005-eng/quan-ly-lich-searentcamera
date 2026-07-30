import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Filter, Plus, User } from 'lucide-react';
import { RentalOrder } from '../types';
import { formatVND } from '../utils/formatters';

interface CalendarViewProps {
  rentals: RentalOrder[];
  onSelectRental: (rental: RentalOrder) => void;
  onOpenRentalModal: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  rentals,
  onSelectRental,
  onOpenRentalModal
}) => {
  const [viewMode, setViewMode] = useState<'MONTH' | 'WEEK' | 'DAY'>('MONTH');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 30)); // July 30, 2026

  // Days in July 2026
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const getRentalsForDay = (day: number) => {
    const dayStr = `2026-07-${String(day).padStart(2, '0')}`;
    return rentals.filter((r) => {
      return r.startDate <= dayStr && r.endDate >= dayStr && r.status !== 'CANCELLED';
    });
  };

  const nextMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  const prevMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
      {/* Calendar Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">Lịch Thuê Thiết Bị Google Style</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi trực quan thời gian sử dụng thiết bị theo ngày, tuần và tháng
          </p>
        </div>

        {/* View Switcher & Navigation */}
        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Buttons */}
          <div className="bg-slate-100 p-1 rounded-xl border border-slate-200/80 flex items-center text-xs">
            <button
              onClick={() => setViewMode('MONTH')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                viewMode === 'MONTH' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tháng
            </button>
            <button
              onClick={() => setViewMode('WEEK')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                viewMode === 'WEEK' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tuần
            </button>
            <button
              onClick={() => setViewMode('DAY')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                viewMode === 'DAY' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Ngày
            </button>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-extrabold text-slate-800 min-w-32 text-center">
              Tháng 07, 2026
            </span>
            <button
              onClick={nextMonth}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenRentalModal}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md shadow-indigo-100 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Thêm Lịch Thuê</span>
          </button>
        </div>
      </div>

      {/* Status Color Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
        <span className="text-slate-500 font-bold">Chú thích màu sắc:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-400" />
          <span className="text-amber-800 font-bold">Đang Thuê (Active)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-400" />
          <span className="text-emerald-800 font-bold">Đã Trả Máy (Returned)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-sky-100 border border-sky-400" />
          <span className="text-sky-800 font-bold">Chờ Nhận Máy (Pending)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-rose-100 border border-rose-400" />
          <span className="text-rose-800 font-bold">Quá Hạn (Overdue)</span>
        </div>
      </div>

      {/* Month View Grid */}
      {viewMode === 'MONTH' && (
        <div className="grid grid-cols-7 gap-2 text-xs">
          {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d) => (
            <div key={d} className="p-2 text-center font-bold text-slate-500 uppercase tracking-wider bg-slate-100 rounded-lg">
              {d}
            </div>
          ))}

          {daysInMonth.map((day) => {
            const dayRentals = getRentalsForDay(day);
            const isToday = day === 30;

            return (
              <div
                key={day}
                className={`min-h-28 p-2 rounded-xl border transition-all flex flex-col justify-between ${
                  isToday
                    ? 'bg-indigo-50/80 border-indigo-300 shadow-xs ring-2 ring-indigo-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-black w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday ? 'bg-indigo-600 text-white' : 'text-slate-700'
                    }`}
                  >
                    {day}
                  </span>
                  {dayRentals.length > 0 && (
                    <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded-md">
                      {dayRentals.length} đơn
                    </span>
                  )}
                </div>

                {/* Rental Events inside cell */}
                <div className="space-y-1 flex-1 overflow-y-auto max-h-20 scrollbar-none">
                  {dayRentals.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => onSelectRental(r)}
                      className={`w-full text-left p-1.5 rounded-lg border text-[10px] transition-all truncate cursor-pointer font-medium ${
                        r.status === 'ACTIVE'
                          ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                          : r.status === 'RETURNED'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                          : r.status === 'PENDING'
                          ? 'bg-sky-50 text-sky-900 border-sky-200 hover:bg-sky-100'
                          : 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      <div className="font-bold truncate">{r.customerName}</div>
                      <div className="text-[9px] opacity-90 truncate">{r.items[0]?.cameraName}</div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Week & Day View fallback view */}
      {viewMode !== 'MONTH' && (
        <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
          <Clock className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-800">
            Chế độ {viewMode === 'WEEK' ? 'Xem Theo Tuần' : 'Xem Theo Ngày'}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Hiển thị chi tiết khung giờ bàn giao & nhận lại máy. Chọn chuyển lại chế độ Tháng để xem tổng thể.
          </p>
          <div className="mt-4 max-w-md mx-auto space-y-2 text-left">
            {rentals.slice(0, 3).map((r) => (
              <div key={r.id} className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center text-xs shadow-xs">
                <div>
                  <p className="font-bold text-indigo-600">{r.orderCode} - {r.customerName}</p>
                  <p className="text-slate-500 text-[11px]">{r.startDate} ({r.shift}) → {r.endDate}</p>
                </div>
                <button
                  onClick={() => onSelectRental(r)}
                  className="px-2.5 py-1 bg-indigo-600 text-white font-bold text-[10px] rounded-lg cursor-pointer"
                >
                  Chi Tiết
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
