import React, { useState } from 'react';
import { Camera, Shield, User, Lock, LogIn, Check, AlertCircle, Sparkles, KeyRound } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginViewProps {
  staffList: UserType[];
  onLoginSuccess: (user: UserType) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ staffList, onLoginSuccess }) => {
  const [selectedStaff, setSelectedStaff] = useState<UserType>(staffList[0]);
  const [emailOrPhone, setEmailOrPhone] = useState<string>(staffList[0].email);
  const [password, setPassword] = useState<string>('123456');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSelectStaff = (staff: UserType) => {
    setSelectedStaff(staff);
    setEmailOrPhone(staff.email);
    setPassword('123456');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      // Find matching staff or default to selected staff
      const matched = staffList.find(
        (s) => s.email.toLowerCase() === emailOrPhone.toLowerCase() || s.phone === emailOrPhone
      );
      if (matched) {
        onLoginSuccess(matched);
      } else {
        onLoginSuccess(selectedStaff);
      }
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative z-10">
        {/* Header Branding */}
        <div className="bg-slate-900 text-white p-8 text-center relative">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <Camera className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">SEA RENT CAMERA</h1>
          <p className="text-xs text-slate-400 mt-1">Đăng nhập phần mềm quản lý cho thuê thiết bị & camera</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-[11px] text-indigo-300 mt-3">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Hệ thống ca trực </span>
          </div>
        </div>

        {/* Login Body Form */}
        <div className="p-6 space-y-5">
          {/* Staff Quick Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Chọn Nhân Viên Đăng Nhập:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {staffList.map((staff) => {
                const isSelected = selectedStaff.id === staff.id;
                return (
                  <button
                    key={staff.id}
                    type="button"
                    onClick={() => handleSelectStaff(staff)}
                    className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-sm'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                    <img
                      src={staff.avatar}
                      alt={staff.name}
                      className="w-10 h-10 rounded-full object-cover mx-auto mb-1.5 border border-slate-200"
                    />
                    <p className="text-[11px] font-bold leading-tight truncate">{staff.name.split(' ').pop()}</p>
                    <p className="text-[10px] text-slate-500 font-medium">{staff.role === 'ADMIN' ? 'Admin' : 'Nhân viên'}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email / SĐT Nhân Viên</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="nhanvien@camerarental.vn"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700">Mật Khẩu Access</label>
                <span className="text-[10px] text-indigo-600 font-semibold">(Mặc định: 123456)</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>
            </div>

            {/* Account Quick info */}
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-600" />
                <div>
                  <span className="font-bold text-slate-800">{selectedStaff.name}</span>
                  <span className="text-slate-500 block text-[10px]">{selectedStaff.email}</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                selectedStaff.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-200 text-slate-700'
              }`}>
                {selectedStaff.role}
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {isLoading ? (
                <span>Đang xác thực...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Đăng Nhập Vào Hệ Thống</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Footer */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
              <KeyRound className="w-3 h-3 text-slate-400" />
              <span>Chế độ Demo: Bấm vào ảnh nhân viên để chọn tài khoản nhanh</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
