import React, { useState, useEffect } from 'react';
import { Camera as CameraIcon, X } from 'lucide-react';
import { Camera, CameraCategory } from '../types';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cameraData: any) => void;
  editingCamera?: Camera | null;
}

export const CameraModal: React.FC<CameraModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingCamera
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('Sony');
  const [category, setCategory] = useState<CameraCategory>('CAMERA_BODY');
  const [serialNumber, setSerialNumber] = useState('');
  const [dailyRate, setDailyRate] = useState<number>(350000);
  const [imageUrl, setImageUrl] = useState('');
  const [conditionNotes, setConditionNotes] = useState('');

  useEffect(() => {
    if (editingCamera) {
      setName(editingCamera.name);
      setModel(editingCamera.model);
      setBrand(editingCamera.brand);
      setCategory(editingCamera.category);
      setSerialNumber(editingCamera.serialNumber);
      setDailyRate(editingCamera.dailyRate);
      setImageUrl(editingCamera.imageUrl);
      setConditionNotes(editingCamera.conditionNotes || '');
    } else {
      setName('');
      setModel('');
      setBrand('Sony');
      setCategory('CAMERA_BODY');
      setSerialNumber(`SN-${Math.floor(Math.random() * 899999 + 100000)}`);
      setDailyRate(350000);
      setImageUrl('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80');
      setConditionNotes('');
    }
  }, [editingCamera]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !model || !dailyRate) {
      alert('Vui lòng nhập đầy đủ Tên, Model và Giá thuê');
      return;
    }
    onSubmit({
      id: editingCamera?.id,
      name,
      model,
      brand,
      category,
      serialNumber,
      dailyRate: Number(dailyRate),
      imageUrl,
      conditionNotes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200/90 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CameraIcon className="w-5 h-5 text-indigo-600" />
            {editingCamera ? 'Chỉnh Sửa Thông Tin Thiết Bị' : 'Thêm Thiết Bị Mới Vào Kho'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Tên Thiết Bị / Máy Ảnh</label>
            <input
              type="text"
              required
              placeholder="VD: Sony Alpha A7 IV Body"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Model Chi Tiết</label>
              <input
                type="text"
                required
                placeholder="VD: ILCE-7M4"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Hãng Sản Xuất</label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Sony">Sony</option>
                <option value="Canon">Canon</option>
                <option value="Fujifilm">Fujifilm</option>
                <option value="Nikon">Nikon</option>
                <option value="DJI">DJI</option>
                <option value="Godox">Godox</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Phân Loại</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="CAMERA_BODY">Thân Máy (Body)</option>
                <option value="LENS">Ống Kính (Lens)</option>
                <option value="DRONE">Flycam / Drone</option>
                <option value="LIGHTING">Đèn Studio</option>
                <option value="ACCESSORY">Gimbal & Phụ Kiện</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-bold mb-1">Giá Thuê 1 Ngày (VND)</label>
              <input
                type="number"
                required
                value={dailyRate}
                onChange={(e) => setDailyRate(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-indigo-600 font-black rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Mã Số Serial (Serial Number)</label>
            <input
              type="text"
              value={serialNumber}
              onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 font-mono rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">URL Hình Ảnh</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Ghi Chú Tình Trạng Thiết Bị</label>
            <input
              type="text"
              placeholder="VD: Kèm 2 pin + sạc đôi, sensor sạch đẹp..."
              value={conditionNotes}
              onChange={(e) => setConditionNotes(e.target.value)}
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
              Lưu Thiết Bị
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
