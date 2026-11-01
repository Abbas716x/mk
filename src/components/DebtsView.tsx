import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  DollarSign,
  Phone,
  X
} from 'lucide-react';
import { DebtRecord } from '../types';
import { RespawnStore } from '../services/store';

interface DebtsViewProps {
  debts: DebtRecord[];
  onRefresh: () => void;
  branchName: string;
}

export const DebtsView: React.FC<DebtsViewProps> = ({ debts, onRefresh, branchName }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('unsettled');
  const [payingDebt, setPayingDebt] = useState<DebtRecord | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const filteredDebts = debts.filter((d) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q || d.customerName.toLowerCase().includes(q) || d.phone.includes(q) || d.tableName.toLowerCase().includes(q);

    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'unsettled' && d.status !== 'settled') ||
      (filterStatus === 'settled' && d.status === 'settled');

    return matchSearch && matchStatus;
  });

  const totalOutstanding = debts
    .filter((d) => d.status !== 'settled')
    .reduce((sum, d) => sum + (d.amount - d.paid), 0);

  const handleOpenPayment = (debt: DebtRecord) => {
    setPayingDebt(debt);
    setPaymentAmount(debt.amount - debt.paid);
  };

  const handleConfirmPayment = () => {
    if (!payingDebt) return;
    const amount = Math.max(0, Number(paymentAmount) || 0);
    if (amount <= 0) return;

    RespawnStore.payDebt(payingDebt.id, amount);
    setPayingDebt(null);
    onRefresh();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header and Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-panel border border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-400" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-tajawal">
              دفتر الديون والمستحقات الآجلة
            </h1>
          </div>
          <p className="text-xs text-[#C9C2E3]/70 font-tajawal mt-1">
            متابعة ذمم الزبائن، تسديدات الأقساط، وتوثيق الحسابات — {branchName}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <div>
            <div className="text-[10px] font-mono text-rose-300">إجمالي الديون المعلقة</div>
            <div className="text-xl font-black font-orbitron text-rose-400">
              {totalOutstanding.toLocaleString()} د.ع
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-2xl glass-panel border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {[
            { id: 'unsettled', label: 'ديون غير مسددة' },
            { id: 'settled', label: 'المسددة بالكامل' },
            { id: 'all', label: 'كافة القيود' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilterStatus(btn.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer font-tajawal ${
                filterStatus === btn.id
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-[#C9C2E3] hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث باسم الزبون أو الهاتف..."
            className="w-full pr-9 pl-4 py-2 rounded-xl glass-input text-xs font-tajawal"
          />
        </div>
      </div>

      {/* Debts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDebts.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-3xl glass-panel text-neutral-500 font-tajawal">
            لا توجد ديون مسجلة في هذا القسم.
          </div>
        ) : (
          filteredDebts.map((debt) => {
            const remaining = Math.max(0, debt.amount - debt.paid);
            const isSettled = debt.status === 'settled';

            return (
              <div
                key={debt.id}
                className={`p-6 rounded-3xl glass-card border flex flex-col justify-between ${
                  isSettled
                    ? 'border-emerald-500/30 opacity-75'
                    : 'border-rose-500/30 shadow-[0_8px_30px_rgba(244,63,94,0.08)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-base text-white font-tajawal">
                      {debt.customerName}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isSettled
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : debt.paid > 0
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {isSettled ? 'مسدد بالكامل' : debt.paid > 0 ? 'مسدد جزئياً' : 'مستحق'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-[#C9C2E3] font-tajawal mb-4">
                    {debt.phone && (
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
                        <Phone className="w-3 h-3 text-[#8B7CC7]" />
                        {debt.phone}
                      </div>
                    )}
                    <div>
                      المصدر: <span className="text-white font-bold">{debt.tableName}</span>
                    </div>
                    {debt.notes && (
                      <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] text-neutral-300">
                        {debt.notes}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-neutral-400">المتبقي:</span>
                    <span
                      className={`text-lg font-black font-orbitron ${
                        isSettled ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {remaining.toLocaleString()} د.ع
                    </span>
                  </div>

                  {!isSettled ? (
                    <button
                      onClick={() => handleOpenPayment(debt)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#8B7CC7] to-[#5A3B8C] hover:brightness-110 text-white font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer font-tajawal shadow-md"
                    >
                      <DollarSign className="w-4 h-4" />
                      تسديد دفعة / إنهاء الدين
                    </button>
                  ) : (
                    <div className="text-center text-xs font-bold text-emerald-400 font-tajawal py-1">
                      ✓ تم تسوية الدين بالكامل
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pay Debt Modal */}
      {payingDebt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
          <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl glass-panel border border-[#C9C2E3]/30 shadow-2xl bg-[#0E0B1D]">
            <button
              onClick={() => setPayingDebt(null)}
              className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-white/5 text-neutral-400 hover:text-white flex items-center justify-center border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white font-tajawal mb-1">
              تسجيل دفعة تسديد للدين
            </h3>
            <p className="text-xs text-[#C9C2E3] font-tajawal mb-4">
              الزبون: <strong className="text-white">{payingDebt.customerName}</strong>
            </p>

            <div className="p-3.5 rounded-2xl bg-[#2A1E4D]/40 border border-white/5 space-y-2 text-xs font-mono mb-4">
              <div className="flex justify-between">
                <span className="text-neutral-400">الدين الأصلي:</span>
                <span className="text-white">{payingDebt.amount.toLocaleString()} د.ع</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">المسدد سابقاً:</span>
                <span className="text-emerald-400">{payingDebt.paid.toLocaleString()} د.ع</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/5 font-bold text-sm">
                <span className="text-rose-300">المتبقي حالياً:</span>
                <span className="text-rose-400">
                  {(payingDebt.amount - payingDebt.paid).toLocaleString()} د.ع
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#C9C2E3] mb-1.5 font-tajawal">
                  المبلغ المراد تسديده الآن (د.ع):
                </label>
                <input
                  type="number"
                  value={paymentAmount || ''}
                  onChange={(e) => setPaymentAmount(Number(e.target.value) || 0)}
                  max={payingDebt.amount - payingDebt.paid}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-base font-mono font-bold"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentAmount(payingDebt.amount - payingDebt.paid)}
                  className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-[#8B7CC7] font-tajawal"
                >
                  تسديد كامل المبلغ
                </button>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setPayingDebt(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#C9C2E3] hover:bg-white/5 font-tajawal"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-[#0E0B1D] font-black text-xs font-tajawal shadow-lg hover:brightness-110 transition-all cursor-pointer"
                >
                  ✓ تأكيد استلام الدفعة
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
