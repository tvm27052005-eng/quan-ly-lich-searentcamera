import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Camera as CameraIcon, User, DollarSign, X, Check } from 'lucide-react';
import { Camera, Customer, RentalShift } from '../types';
import { formatVND } from '../utils/formatters';

interface RentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
  cameras: Camera[];
  onSubmitOrder: (orderData: any) => void;
  currentStaffName: string;
}

export const RentalModal: React.FC<RentalModalProps> = ({
  isOpen,
  onClose,
  customers,
  cameras,
  onSubmitOrder,
  currentStaffName
}) => {
  if (!isOpen) return null;

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [selectedCameraIds, setSelectedCameraIds] = useState<string[]>([cameras[0]?.id || '']);
  const [startDate, setStartDate] = useState<string>('2026-07-30');
  const [endDate, setEndDate] = useState<string>('2026-07-31');
  const [shift, setShift] = useState<RentalShift>('MULTI_DAY');
  const [depositAmount, setDepositAmount] = useState<number>(2000000);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  // Available cameras only
  const availableCameras = cameras.filter((c) => c.status === 'AVAILABLE');

  // Calculate rental duration in days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  const days = shift === 'MULTI_DAY' ? diffTime : 1;

  // Calculate total price
  const selectedCamerasList = cameras.filter((c) => selectedCameraIds.includes(c.id));
  const totalAmount = selectedCamerasList.reduce((sum, c) => sum + c.dailyRate * days, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || selectedCameraIds.length === 0) {
      alert('Vui lòng chọn khách hàng và ít nhất 1 thiết bị');
      return;
    }

    const items = selectedCamerasList.map((c) => ({
      cameraId: c.id,
      cameraName: c.name,
      cameraModel: c.model,
      dailyRate: c.dailyRate,
      quantity: 1
    }));

    onSubmitOrder({
      customerId: selectedCustomerId,
      items,
      startDate,
      endDate,
      shift,
      depositAmount: Number(depositAmount),
      totalAmount,
      paidAmount: Number(paidAmount) || totalAmount,
      notes,
      staffName: currentStaffName
    });

    onClose();
  };

  const toggleCameraSelection = (id: string) => {
    if (selectedCameraIds.includes(id)) {
      if (selectedCameraIds.length > 1) {
        setSelectedCameraIds(selectedCameraIds.filter((cId) => cId !== id));
      }
    } else {
      setSelectedCameraIds([...selectedCameraIds, id]);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200/90 rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              Tạo Đơn Thuê Máy Ảnh & Thiết Bị Mới
            </h2>
            <p className="text-xs text-slate-500">Nhân viên tạo đơn: <span className="text-indigo-600 font-bold">{currentStaffName}</span></p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* 1. Chọn Khách Hàng */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">1. Chọn Khách Hàng</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} - SĐT: {c.phone} ({c.rentalCount} lượt thuê)
                </option>
              ))}
            </select>
          </div>

          {/* 2. Chọn Thiết Bị Trong Kho (Sẵn Sàng) */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">
              2. Chọn Thiết Bị Thuê (Đã chọn {selectedCameraIds.length} món)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-50 border border-slate-200/80 rounded-xl">
              {cameras.map((cam) => {
                const isSelected = selectedCameraIds.includes(cam.id);
                const isAvailable = cam.status === 'AVAILABLE';

                return (
                  <button
                    key={cam.id}
                    type="button"
                    disabled={!isAvailable && !isSelected}
                    onClick={() => toggleCameraSelection(cam.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-bold shadow-xs'
                        : isAvailable
                        ? 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                        : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <p className="truncate text-[11px] font-bold">{cam.name}</p>
                      <p className="text-[10px] text-slate-500">{formatVND(cam.dailyRate)}/ngày</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Ngày Thuê & Ca Thuê */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Ngày Bắt Đầu</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Ngày Hẹn Trả</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Ca Thuê Máy</label>
              <select
                value={shift}
                onChange={(e: any) => setShift(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="MULTI_DAY">Nhiều ngày ({days} ngày)</option>
                <option value="FULL_DAY">Cả ngày (08:00 - 20:00)</option>
                <option value="MORNING">Ca Sáng (08:00 - 12:00)</option>
                <option value="AFTERNOON">Ca Chiều (13:00 - 17:00)</option>
                <option value="EVENING">Ca Tối (18:00 - 22:00)</option>
              </select>
            </div>
          </div>

          {/* 4. Tiền Cọc & Thanh Toán */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Tiền Cọc Giữ Máy (VND)</label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full bg-white border border-slate-200 text-indigo-700 font-extrabold rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Tổng Tiền Thuê ({days} ngày)</label>
              <div className="text-lg font-black text-indigo-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                {formatVND(totalAmount)}
              </div>
            </div>
          </div>

          {/* Ghi chú */}
          <div>
            <label className="block text-slate-700 font-bold mb-1">Ghi Chú Đơn Thuê</label>
            <input
              type="text"
              placeholder="VD: Khách gửi CCCD bản gốc, lấy thêm 1 thẻ nhớ 64GB..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-100 cursor-pointer"
            >
              Xác Nhận Tạo Đơn Thuê
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
