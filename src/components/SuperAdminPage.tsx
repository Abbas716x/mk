import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Shield,
  Trash2,
  Lock,
  Unlock,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle2,
  X,
  ArrowRight,
  LogOut,
  Clock,
  DollarSign
} from 'lucide-react';
import { Branch, AuditLog, UserSession } from '../types';
import { RespawnStore } from '../services/store';

interface SuperAdminPageProps {
  currentUser: UserSession;
  onLogout: () => void;
  onBackToBranch: () => void;
  onRefresh: () => void;
}

export const SuperAdminPage: React.FC<SuperAdminPageProps> = ({
  currentUser,
  onLogout,
  onBackToBranch,
  onRefresh
}) => {
  const [branches, setBranches] = useState<Branch[]>(() => RespawnStore.getBranches());
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchCode, setNewBranchCode] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [newBranchRate, setNewBranchRate] = useState(4500);
  const [newBranchCapacity, setNewBranchCapacity] = useState(25);

  const [selectedBranchFilter, setSelectedBranchFilter] = useState('all');

  const financials = RespawnStore.getBranchFinancials(selectedBranchFilter);
  const auditLogs = RespawnStore.getAuditLogs(selectedBranchFilter);

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName.trim()) return;

    RespawnStore.addBranch(
      newBranchName,
      newBranchCode || `BR-${branches.length + 1}`,
      newBranchAddress || 'بغداد',
      newBranchRate,
      newBranchCapacity
    );

    setBranches(RespawnStore.getBranches());
    setShowAddBranch(false);
    setNewBranchName('');
    setNewBranchCode('');
    setNewBranchAddress('');
    onRefresh();
  };

  const handleDeleteBranch = (b: Branch) => {
    if (confirm(`تحذير شديد: هل أنت متأكد من حذف الفرع "${b.name}" وجميع طاولاته نهائياً من النظام؟`)) {
      RespawnStore.deleteBranch(b.id);
      setBranches(RespawnStore.getBranches());
      onRefresh();
    }
  };

  const handleToggleFreeze = (b: Branch) => {
    const next = b.status === 'frozen' ? 'active' : 'frozen';
    RespawnStore.updateBranchStatus(b.id, next);
    setBranches(RespawnStore.getBranches());
    onRefresh();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Super Admin Top Header */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-[#C9C2E3]/20 bg-gradient-to-r from-[#2A1E4D]/90 via-[#1A1435] to-[#0E0B1D] flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8B7CC7] via-[#5A3B8C] to-[#2A1E4D] border border-white/20 flex items-center justify-center text-3xl shadow-xl shadow-purple-950/80">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white font-orbitron tracking-wider">
                SUPER ADMIN <span className="text-[#8B7CC7]">PORTAL</span>
              </h1>
              <span className="text-[10px] bg-[#8B7CC7]/20 text-[#C9C2E3] border border-[#8B7CC7]/40 px-2.5 py-0.5 rounded-full font-mono font-bold">
                ROOT CONTROL
              </span>
            </div>
            <p className="text-xs text-[#C9C2E3]/80 font-tajawal mt-1">
              الملف والمسار الإداري المنفصل بالكامل — تحكم شامل بالفروع والعمليات والإيرادات
            </p>
          </div>
        </div>

        {/* Clear Action Buttons: Add New Branch + Back */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowAddBranch(true)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#8B7CC7] to-[#5A3B8C] hover:brightness-110 text-white font-black text-xs font-tajawal tracking-wide shadow-xl shadow-purple-950/70 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            إضافة فرع جديد (Add New Branch)
          </button>

          <button
            onClick={onBackToBranch}
            className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs font-tajawal border border-white/10 transition-colors cursor-pointer flex items-center gap-2"
          >
            <ArrowRight className="w-4 h-4 text-[#8B7CC7]" />
            شاشة مشغل الفرع
          </button>

          <button
            onClick={onLogout}
            title="تسجيل الخروج"
            className="p-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Global Financial Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-6 rounded-3xl border border-[#8B7CC7]/30">
          <div className="flex items-center justify-between text-[#C9C2E3] text-xs font-tajawal">
            <span>إجمالي إيراد اليوم</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div className="text-3xl font-black font-orbitron text-emerald-400 my-2">
            {financials.dailyRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400 font-mono">
            IQD • GLOBAL DAILY REVENUE
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-white/[0.08]">
          <div className="flex items-center justify-between text-[#C9C2E3] text-xs font-tajawal">
            <span>إيراد الأمس المؤرشف</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black font-orbitron text-white my-2">
            {financials.yesterdayRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400 font-mono">
            IQD • YESTERDAY ARCHIVE
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-white/[0.08]">
          <div className="flex items-center justify-between text-[#C9C2E3] text-xs font-tajawal">
            <span>الإيراد الشهري التراكمي</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black font-orbitron text-amber-300 my-2">
            {financials.monthlyRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-neutral-400 font-mono">
            IQD • CUMULATIVE REVENUE
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-rose-500/30">
          <div className="flex items-center justify-between text-rose-300 text-xs font-tajawal">
            <span>إجمالي الديون المعلقة</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black font-orbitron text-rose-400 my-2">
            {financials.totalDebts.toLocaleString()}
          </div>
          <div className="text-[11px] text-rose-400/80 font-mono">
            IQD • UNCOLLECTED RECEIVABLES
          </div>
        </div>
      </div>

      {/* Multi-Branch Management Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 font-tajawal">
            <Building2 className="w-5 h-5 text-[#8B7CC7]" />
            إدارة الفروع والصلاحيات المركزية ({branches.length})
          </h2>

          <button
            onClick={() => setShowAddBranch(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B7CC7] to-[#5A3B8C] text-white text-xs font-bold font-tajawal flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            + إضافة فرع جديد
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {branches.map((b) => {
            const bFin = RespawnStore.getBranchFinancials(b.id);
            const isFrozen = b.status === 'frozen';

            return (
              <div
                key={b.id}
                className={`glass-panel p-6 rounded-3xl border flex flex-col justify-between transition-all ${
                  isFrozen
                    ? 'border-rose-500/50 bg-rose-950/25 shadow-lg shadow-rose-950/50'
                    : 'border-white/[0.08] hover:border-[#8B7CC7]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold bg-[#5A3B8C]/50 text-[#C9C2E3] px-2 py-0.5 rounded">
                      {b.code}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        isFrozen
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      }`}
                    >
                      {isFrozen ? '❄️ مجمد إدارياً' : '● نشط ويعمل'}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white font-tajawal mb-1">
                    {b.name}
                  </h3>
                  <p className="text-xs text-neutral-400 font-tajawal mb-4">
                    {b.address}
                  </p>

                  <div className="space-y-2 p-3.5 rounded-2xl bg-[#0E0B1D]/80 border border-white/[0.05] text-xs font-tajawal mb-4">
                    <div className="flex justify-between">
                      <span className="text-[#C9C2E3]">إيراد اليوم:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {bFin.dailyRevenue.toLocaleString()} د.ع
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#C9C2E3]">الطاولات الشاغرة/المشغولة:</span>
                      <span className="font-mono text-white">
                        {bFin.occupiedTablesCount} / {b.tablesCount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#C9C2E3]">سعر الساعة القياسي:</span>
                      <span className="font-mono text-white">
                        {b.defaultHourlyRate.toLocaleString()} د.ع
                      </span>
                    </div>
                  </div>
                </div>

                {/* Operations & Overrides */}
                <div className="pt-3 border-t border-white/[0.08] flex items-center gap-2">
                  <button
                    onClick={() => handleToggleFreeze(b)}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold font-tajawal transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      isFrozen
                        ? 'bg-emerald-500 text-[#0E0B1D] border-emerald-400'
                        : 'bg-[#2A1E4D] text-amber-300 border-amber-400/40 hover:bg-amber-400/20'
                    }`}
                  >
                    {isFrozen ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                    {isFrozen ? 'فك التجميد' : 'تجميد الفرع'}
                  </button>

                  <button
                    onClick={() => handleDeleteBranch(b)}
                    title="حذف الفرع نهائياً"
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit Logs */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/[0.08]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-[#8B7CC7]" />
            <h3 className="font-bold text-base text-white font-tajawal">
              سجل الرقابة العامة الفوري (Central Audit Trail)
            </h3>
          </div>
          <span className="text-xs font-mono text-[#8B7CC7] bg-[#5A3B8C]/20 px-2 py-0.5 rounded border border-[#8B7CC7]/30">
            ENCRYPTED AES-256
          </span>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar font-mono text-xs">
          {auditLogs.slice(0, 20).map((log) => {
            const timeStr = new Date(log.timestamp).toLocaleTimeString('ar-IQ');
            return (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-[#0E0B1D]/70 border border-white/[0.05] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      log.severity === 'critical'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        : log.severity === 'warning'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : log.severity === 'success'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}
                  >
                    {log.action}
                  </span>
                  <span className="text-white font-tajawal text-xs truncate">
                    {log.details}
                  </span>
                </div>
                <div className="text-neutral-400 text-[11px] shrink-0 font-tajawal">
                  <span>{log.branchName} • {timeStr}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add New Branch Modal */}
      {showAddBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
          <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl glass-panel border border-[#8B7CC7]/40 shadow-2xl bg-[#0E0B1D]">
            <button
              onClick={() => setShowAddBranch(false)}
              className="absolute top-4 left-4 w-9 h-9 rounded-xl bg-white/5 text-neutral-400 hover:text-white flex items-center justify-center border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-xl font-black text-white font-tajawal mb-1">
              إضافة فرع جديد لقاعة رسبون
            </h3>
            <p className="text-xs text-[#C9C2E3]/70 font-tajawal mb-6">
              إنشاء نطاق تشغيلي مستقل مع خزنة مشفرة ومزامنة سحابية
            </p>

            <form onSubmit={handleCreateBranch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#C9C2E3] mb-1.5 font-tajawal">
                  اسم الفرع التجاري
                </label>
                <input
                  type="text"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  placeholder="مثال: فرع الجادرية (VIP Arena)"
                  required
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-bold font-tajawal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#C9C2E3] mb-1.5 font-tajawal">
                    رمز الفرع (Code)
                  </label>
                  <input
                    type="text"
                    value={newBranchCode}
                    onChange={(e) => setNewBranchCode(e.target.value)}
                    placeholder="JAD-04"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#C9C2E3] mb-1.5 font-tajawal">
                    سعر الساعة المعتمد (د.ع)
                  </label>
                  <input
                    type="number"
                    value={newBranchRate}
                    onChange={(e) => setNewBranchRate(Number(e.target.value))}
                    step="500"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#C9C2E3] mb-1.5 font-tajawal">
                  عنوان الفرع
                </label>
                <input
                  type="text"
                  value={newBranchAddress}
                  onChange={(e) => setNewBranchAddress(e.target.value)}
                  placeholder="بغداد - الجادرية - قرب جامعة بغداد"
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-tajawal"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setShowAddBranch(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-[#C9C2E3] hover:bg-white/5 font-tajawal"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-[#8B7CC7] to-[#5A3B8C] text-white font-black text-xs font-tajawal shadow-lg hover:brightness-110 transition-all cursor-pointer"
                >
                  ✓ حفظ وتفعيل الفرع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
