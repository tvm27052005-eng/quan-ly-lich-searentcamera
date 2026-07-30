import React, { useState, useEffect } from 'react';
import { User, X } from 'lucide-react';
import { Customer, CustomerSource } from '../types';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  editingCustomer?: Customer | null;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingCustomer
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [facebook, setFacebook] = useState('');
  const [zalo, setZalo] = useState('');
  const [source, setSource] = useState<CustomerSource>('WALK_IN');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [idCardNumber, setIdCardNumber] = useState('');

  useEffect(() => {
    if (editingCustomer) {
      setName(editingCustomer.name);
      setPhone(editingCustomer.phone);
      setEmail(editingCustomer.email || '');
      setFacebook(editingCustomer.facebook || '');
      setZalo(editingCustomer.zalo || editingCustomer.phone);
      setSource(editingCustomer.source);
      setAddress(editingCustomer.address || '');
      setNotes(editingCustomer.notes || '');
      setIdCardNumber(editingCustomer.idCardNumber || '');
    } else {
      setName('');
      setPhone('');
      setEmail('');
      setFacebook('');
      setZalo('');
      setSource('WALK_IN');
      setAddress('');
      setNotes('');
      setIdCardNumber('');
    }
  }, [editingCustomer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Vui lòng nhập Tên và Số điện thoại');
      return;
    }
    onSubmit({
      id: editingCustomer?.id,
      name,
      phone,
      email,
      facebook,
      zalo: zalo || phone,
      source,
      address,
      notes,
      idCardNumber
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-indigo-600" />
            {editingCustomer ? 'Sửa Hồ Sơ Khách Hàng' : 'Tạo Hồ Sơ Khách Hàng Mới'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Họ và Tên Khách Hàng</label>
            <input
              type="text"
              required
              placeholder="VD: Phạm Minh Tuấn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Số Điện Thoại</label>
              <input
                type="text"
                required
                placeholder="0901234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-indigo-600 font-bold font-mono rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Số CCCD / CMND</label>
              <input
                type="text"
                placeholder="001095012345"
                value={idCardNumber}
                onChange={(e) => setIdCardNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Nguồn Khách Hàng</label>
              <select
                value={source}
                onChange={(e: any) => setSource(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="FACEBOOK">Facebook Ads / Fanpage</option>
                <option value="ZALO">Zalo OA / Tin nhắn</option>
                <option value="REFERRAL">Người quen giới thiệu</option>
                <option value="WALK_IN">Khách vãng lai tại tiệm</option>
                <option value="WEBSITE">Website / Google</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Email (nếu có)</label>
              <input
                type="email"
                placeholder="tuan.pm@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Địa Chỉ Thường Trú</label>
            <input
              type="text"
              placeholder="123 Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Ghi Chú Đặc Điểm Khách Hàng</label>
            <input
              type="text"
              placeholder="VD: Khách studio cưới, cần giữ máy kỹ..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-3 flex justify-end gap-3">
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
              Lưu Khách Hàng
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
