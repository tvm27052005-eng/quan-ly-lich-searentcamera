import React, { useState } from 'react';
import { DollarSign, Plus, ArrowUpRight, ArrowDownLeft, Download, Filter, Search, Calendar } from 'lucide-react';
import { Transaction } from '../types';
import { formatVND, exportToExcel } from '../utils/formatters';

interface TransactionsViewProps {
  transactions: Transaction[];
  onOpenAddModal: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  onOpenAddModal
}) => {
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter((t) => {
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
    const matchesQuery =
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.createdByName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesQuery;
  });

  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpense;

  const handleExportExcel = () => {
    const data = filteredTransactions.map((t) => ({
      'Mã Phiếu': t.code,
      'Loại Phiếu': t.type === 'INCOME' ? 'Thu' : 'Chi',
      'Danh Mục': t.category,
      'Số Tiền (VND)': t.amount,
      'Nội Dung Chi Tiết': t.description,
      'Người Lập Phiếu': t.createdByName,
      'Ngày Giờ': t.date
    }));
    exportToExcel(data, `Bao_Cao_Thu_Chi_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">Sổ Sách Thu Chi & Quản Lý Dòng Tiền</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Lập phiếu thu/chi, quản lý doanh thu tiền thuê và chi phí vận hành cửa hàng.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            <span>Xuất Báo Cáo Excel</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4.5 py-2 rounded-xl shadow-md shadow-indigo-100 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Lập Phiếu Thu / Chi</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Tổng Tiền Thu (Inflow)</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">{formatVND(totalIncome)}</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Tổng Tiền Chi (Outflow)</span>
            <span className="text-2xl font-black text-rose-600 mt-1 block">{formatVND(totalExpense)}</span>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Lợi Nhuận Ròng (Net Profit)</span>
            <span className={`text-2xl font-black mt-1 block ${netProfit >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
              {formatVND(netProfit)}
            </span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
        <div className="flex items-center gap-2 text-xs">
          {[
            { id: 'ALL', label: 'Tất Cả Phiếu' },
            { id: 'INCOME', label: 'Phiếu Thu (+)' },
            { id: 'EXPENSE', label: 'Phiếu Chi (-)' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setTypeFilter(f.id as any)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                typeFilter === f.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-200/60 border border-slate-200/60'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo mã, nội dung, người tạo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200/80">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
            <tr>
              <th className="p-3.5">Mã Phiếu</th>
              <th className="p-3.5">Loại Phiếu</th>
              <th className="p-3.5">Nội Dung Thu Chi</th>
              <th className="p-3.5">Số Tiền</th>
              <th className="p-3.5">Người Lập Phiếu</th>
              <th className="p-3.5">Ngày Giờ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredTransactions.map((trx) => (
              <tr key={trx.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-3.5 font-mono font-bold text-indigo-600">{trx.code}</td>
                <td className="p-3.5">
                  <span
                    className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full ${
                      trx.type === 'INCOME'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {trx.type === 'INCOME' ? 'Thu (+)' : 'Chi (-)'}
                  </span>
                </td>
                <td className="p-3.5 text-slate-800 font-bold">{trx.description}</td>
                <td
                  className={`p-3.5 font-black text-sm ${
                    trx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {trx.type === 'INCOME' ? '+' : '-'}{formatVND(trx.amount)}
                </td>
                <td className="p-3.5 text-slate-600 font-medium">{trx.createdByName}</td>
                <td className="p-3.5 text-slate-400 font-mono text-[11px]">{trx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
