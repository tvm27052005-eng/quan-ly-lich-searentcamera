import React, { useState } from 'react';
import { DollarSign, X } from 'lucide-react';
import { TransactionCategory, TransactionType } from '../types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  currentStaffName: string;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  currentStaffName
}) => {
  if (!isOpen) return null;

  const [type, setType] = useState<TransactionType>('INCOME');
  const [category, setCategory] = useState<TransactionCategory>('RENTAL_PAYMENT');
  const [amount, setAmount] = useState<number>(500000);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description) {
      alert('Vui lòng nhập số tiền và nội dung thu chi');
      return;
    }
    onSubmit({
      type,
      category,
      amount: Number(amount),
      description,
      createdByName: currentStaffName
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200/90 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            Lập Phiếu Thu / Chi Mới
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Loại Phiếu</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setType('INCOME')}
                className={`py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  type === 'INCOME' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Phiếu Thu (+)
              </button>
              <button
                type="button"
                onClick={() => setType('EXPENSE')}
                className={`py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                  type === 'EXPENSE' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Phiếu Chi (-)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Danh Mục Thu Chi</label>
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="RENTAL_PAYMENT">Tiền thuê máy</option>
              <option value="DEPOSIT">Tiền cọc giữ máy</option>
              <option value="MAINTENANCE_COST">Chi phí sửa chữa & bảo trì máy</option>
              <option value="EQUIPMENT_PURCHASE">Mua sắm phụ kiện / máy mới</option>
              <option value="SALARY">Lương nhân viên</option>
              <option value="UTILITIES">Điện, nước, internet tiệm</option>
              <option value="OTHER">Thu chi khác</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Số Tiền (VND)</label>
            <input
              type="number"
              required
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 text-indigo-600 font-black text-base rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Nội Dung Chi Tiết Phiếu</label>
            <textarea
              required
              rows={3}
              placeholder="Ghi rõ lý do thu hoặc chi..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <p className="text-[10px] text-slate-500">Người lập phiếu: <span className="text-indigo-600 font-bold">{currentStaffName}</span></p>

          <div className="pt-2 flex justify-end gap-3">
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
              Lập Phiếu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
