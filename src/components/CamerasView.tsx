import React, { useState } from 'react';
import { Camera as CameraIcon, Plus, Search, Filter, Wrench, CheckCircle2, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { Camera, CameraCategory, CameraStatus } from '../types';
import { formatVND } from '../utils/formatters';

interface CamerasViewProps {
  cameras: Camera[];
  onOpenAddModal: () => void;
  onEditCamera: (camera: Camera) => void;
  onToggleMaintenance: (cameraId: string, currentStatus: CameraStatus) => void;
}

export const CamerasView: React.FC<CamerasViewProps> = ({
  cameras,
  onOpenAddModal,
  onEditCamera,
  onToggleMaintenance
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCameras = cameras.filter((c) => {
    const matchesCategory = categoryFilter === 'ALL' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesQuery =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.serialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesQuery;
  });

  const getCategoryName = (cat: CameraCategory) => {
    switch (cat) {
      case 'CAMERA_BODY': return 'Thân Máy (Body)';
      case 'LENS': return 'Ống Kính (Lens)';
      case 'DRONE': return 'Flycam / Drone';
      case 'LIGHTING': return 'Đèn & Studio';
      case 'ACCESSORY': return 'Gimbal & Phụ Kiện';
      default: return cat;
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <CameraIcon className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">Quản Lý Kho Thiết Bị & Máy Ảnh</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tổng cộng {cameras.length} thiết bị cao cấp trong kho cửa hàng.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-indigo-100 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Thêm Thiết Bị Mới</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {[
            { id: 'ALL', label: 'Tất Cả Kho' },
            { id: 'CAMERA_BODY', label: 'Thân Máy' },
            { id: 'LENS', label: 'Ống Kính' },
            { id: 'DRONE', label: 'Flycam' },
            { id: 'LIGHTING', label: 'Đèn Studio' },
            { id: 'ACCESSORY', label: 'Phụ Kiện' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                categoryFilter === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input & Status Filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-56">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm tên máy, model, mã SN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 text-xs text-slate-700 font-bold rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">Mọi trạng thái</option>
            <option value="AVAILABLE">Sẵn sàng</option>
            <option value="RENTED">Đang cho thuê</option>
            <option value="MAINTENANCE">Đang bảo trì</option>
          </select>
        </div>
      </div>

      {/* Camera Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredCameras.map((camera) => (
          <div
            key={camera.id}
            className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden hover:border-indigo-300 transition-all flex flex-col justify-between shadow-xs hover:shadow-md group"
          >
            {/* Image & Status Badge */}
            <div className="relative h-44 bg-slate-100 overflow-hidden">
              <img
                src={camera.imageUrl}
                alt={camera.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2.5 py-1 text-[10px] font-black rounded-full shadow-xs ${
                    camera.status === 'AVAILABLE'
                      ? 'bg-emerald-500 text-white'
                      : camera.status === 'RENTED'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {camera.status === 'AVAILABLE'
                    ? 'Sẵn Sàng'
                    : camera.status === 'RENTED'
                    ? 'Đang Thuê'
                    : 'Bảo Trì'}
                </span>
              </div>
              <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-[10px] font-mono text-white px-2 py-0.5 rounded font-bold">
                {camera.serialNumber}
              </div>
            </div>

            {/* Info Body */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-indigo-600">
                  {camera.brand} • {getCategoryName(camera.category)}
                </div>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-1 mt-0.5" title={camera.name}>
                  {camera.name}
                </h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">Model: {camera.model}</p>
                <p className="text-[11px] text-slate-600 line-clamp-2 mt-2 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-200/80">
                  {camera.conditionNotes || 'Tình trạng hoạt động tốt'}
                </p>
              </div>

              {/* Price & Rentals count */}
              <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Giá thuê / ngày</span>
                  <span className="text-sm font-black text-indigo-600">{formatVND(camera.dailyRate)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Lượt thuê</span>
                  <span className="text-xs font-bold text-slate-800">{camera.totalRentalsCount} lần</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onEditCamera(camera)}
                  className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Sửa</span>
                </button>
                <button
                  onClick={() => onToggleMaintenance(camera.id, camera.status)}
                  className={`p-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                    camera.status === 'MAINTENANCE'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                      : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                  }`}
                  title={camera.status === 'MAINTENANCE' ? 'Hoàn tất bảo trì' : 'Chuyển sang bảo trì'}
                >
                  <Wrench className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
