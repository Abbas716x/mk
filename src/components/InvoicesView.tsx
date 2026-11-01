import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Download,
  Printer,
  X
} from 'lucide-react';
import { Invoice } from '../types';

interface InvoicesViewProps {
  invoices: Invoice[];
  branchName: string;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({ invoices, branchName }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      inv.id.toLowerCase().includes(q) ||
      inv.customerName.toLowerCase().includes(q) ||
      inv.tableName.toLowerCase().includes(q)
    );
  });

  const exportCSV = () => {
    const headers = [
      'رقم الفاتورة',
      'الفرع',
      'الطاولة',
      'الزبون',
      'المدة (دقيقة)',
      'كلفة الوقت',
      'كلفة الطلبات',
      'الخصم',
      'المجموع',
      'المسدد',
      'الدين المتبقي',
      'طريقة الدفع',
      'التاريخ'
    ];

    const rows = filteredInvoices.map((i) => [
      i.id,
      i.branchName,
      i.tableName,
      i.customerName,
      i.durationMinutes,
      i.timeCost,
      i.ordersCost,
      i.discount,
      i.total,
      i.paidAmount,
      i.debtAmount,
      i.paymentMethod,
      new Date(i.timestamp).toLocaleString('ar-IQ')
    ]);

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `RESPAWN_Invoices_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header and Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-panel border border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#8B7CC7]" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-tajawal">
              أرشيف الفواتير والمقبوضات
            </h1>
          </div>
          <p className="text-xs text-[#C9C2E3]/70 font-tajawal mt-1">
            سجل التدقيق المالي الموثق لكافة الجلسات المحاسبية — {branchName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="px-5 py-2.5 rounded-2xl bg-[#5A3B8C]/40 hover:bg-[#5A3B8C]/70 border border-[#8B7CC7]/40 text-white text-xs font-bold transition-all flex items-center gap-2 font-tajawal cursor-pointer shadow-md"
          >
            <Download className="w-4 h-4 text-[#C9C2E3]" />
            تصدير تقرير (CSV)
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="p-3 rounded-2xl glass-panel border border-white/[0.08] flex items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث برقم الفاتورة، اسم الزبون، أو الطاولة..."
            className="w-full pr-9 pl-4 py-2 rounded-xl glass-input text-xs font-tajawal"
          />
        </div>
        <div className="text-xs font-mono text-[#C9C2E3]">
          إجمالي الفواتير: <strong className="text-white">{filteredInvoices.length}</strong>
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="glass-panel rounded-3xl border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-right text-xs">
            <thead className="bg-[#2A1E4D]/60 text-[#C9C2E3] font-mono text-[11px] border-b border-white/[0.08]">
              <tr>
                <th className="p-4">رقم الفاتورة</th>
                <th className="p-4">الطاولة والجهاز</th>
                <th className="p-4">الزبون</th>
                <th className="p-4">المدة</th>
                <th className="p-4">كلفة الوقت</th>
                <th className="p-4">الطلبات</th>
                <th className="p-4">الخصم</th>
                <th className="p-4 font-bold text-white">المجموع النهائي</th>
                <th className="p-4">المسدد كاش</th>
                <th className="p-4">الحالة</th>
                <th className="p-4 text-center">إجراء</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05] font-tajawal">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-neutral-500 text-sm">
                    لا توجد فواتير مسجلة في هذا الفرع.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => setSelectedInvoice(inv)}
                    className="hover:bg-[#2A1E4D]/40 transition-colors cursor-pointer"
                  >
                    <td className="p-4 font-mono font-bold text-[#8B7CC7]">
                      {inv.id}
                    </td>
                    <td className="p-4 font-bold text-white">
                      {inv.tableName}
                    </td>
                    <td className="p-4 text-[#C9C2E3]">
                      {inv.customerName}
                    </td>
                    <td className="p-4 font-mono">
                      {inv.durationMinutes} دقيقة
                    </td>
                    <td className="p-4 font-mono">
                      {inv.timeCost.toLocaleString()} د.ع
                    </td>
                    <td className="p-4 font-mono">
                      {inv.ordersCost.toLocaleString()} د.ع
                    </td>
                    <td className="p-4 font-mono text-rose-400">
                      {inv.discount > 0 ? `-${inv.discount.toLocaleString()} د.ع` : '—'}
                    </td>
                    <td className="p-4 font-mono font-black text-white text-sm">
                      {inv.total.toLocaleString()} د.ع
                    </td>
                    <td className="p-4 font-mono text-emerald-400 font-bold">
                      {inv.paidAmount.toLocaleString()} د.ع
                    </td>
                    <td className="p-4">
                      {inv.debtAmount > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          متبقي دين: {inv.debtAmount.toLocaleString()}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          مدفوع بالكامل
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedInvoice(inv);
                        }}
                        className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-[#C9C2E3] transition-colors"
                      >
                        معاينة
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Detail & Print Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
          <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl glass-panel border border-[#C9C2E3]/30 shadow-2xl overflow-hidden bg-[#0E0B1D]/95">
            <button
              onClick={() => setSelectedInvoice(null)}
              className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-white/5 text-neutral-400 hover:text-white flex items-center justify-center border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <div id="printable-receipt" className="space-y-5">
              <div className="text-center pb-4 border-b border-white/[0.08]">
                <div className="font-orbitron font-black text-xl text-white tracking-widest">
                  RESPAWN LOUNGE
                </div>
                <div className="text-xs text-[#C9C2E3] font-tajawal mt-0.5">
                  {selectedInvoice.branchName}
                </div>
                <div className="text-[11px] font-mono text-[#8B7CC7] mt-1 font-bold">
                  إيصال محاسبي: {selectedInvoice.id}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-tajawal p-3 rounded-2xl bg-[#2A1E4D]/40 border border-white/5">
                <div>
                  <span className="text-neutral-400 block text-[10px]">الطاولة:</span>
                  <span className="font-bold text-white">{selectedInvoice.tableName}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">الزبون:</span>
                  <span className="font-bold text-white">{selectedInvoice.customerName}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">مدة اللعب:</span>
                  <span className="font-mono text-white">{selectedInvoice.durationMinutes} دقيقة</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">توقيت الانتهاء:</span>
                  <span className="font-mono text-white text-[11px]">
                    {new Date(selectedInvoice.endedAt).toLocaleTimeString('ar-IQ')}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs font-tajawal">
                <div className="flex justify-between py-1 border-b border-white/[0.05]">
                  <span>كلفة وقت اللعب:</span>
                  <span className="font-mono font-bold text-white">
                    {selectedInvoice.timeCost.toLocaleString()} د.ع
                  </span>
                </div>

                {selectedInvoice.orders.map((o) => (
                  <div key={o.id} className="flex justify-between py-1 border-b border-white/[0.05] text-neutral-300">
                    <span>
                      {o.icon} {o.name} (×{o.qty})
                    </span>
                    <span className="font-mono">
                      {(o.price * o.qty).toLocaleString()} د.ع
                    </span>
                  </div>
                ))}

                {selectedInvoice.discount > 0 && (
                  <div className="flex justify-between py-1 text-rose-400">
                    <span>خصم مطبق:</span>
                    <span className="font-mono font-bold">
                      -{selectedInvoice.discount.toLocaleString()} د.ع
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-2xl bg-[#2A1E4D]/60 border border-[#8B7CC7]/40 space-y-2 font-tajawal">
                <div className="flex justify-between items-center text-sm font-bold text-white">
                  <span>المبلغ الإجمالي:</span>
                  <span className="font-orbitron font-black text-xl text-emerald-400">
                    {selectedInvoice.total.toLocaleString()} د.ع
                  </span>
                </div>

                <div className="flex justify-between items-center text-xs text-[#C9C2E3]">
                  <span>المسدد نقداً:</span>
                  <span className="font-mono font-bold text-white">
                    {selectedInvoice.paidAmount.toLocaleString()} د.ع
                  </span>
                </div>

                {selectedInvoice.debtAmount > 0 && (
                  <div className="flex justify-between items-center text-xs text-rose-400 font-bold">
                    <span>متبقي دين على الزبون:</span>
                    <span className="font-mono">
                      {selectedInvoice.debtAmount.toLocaleString()} د.ع
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handlePrint}
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-[#8B7CC7] to-[#5A3B8C] hover:brightness-110 text-white font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer font-tajawal shadow-lg"
                >
                  <Printer className="w-4 h-4" />
                  طباعة الإيصال الحراري
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold transition-colors cursor-pointer font-tajawal"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
