import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Clock,
  Timer,
  Play,
  Pause,
  Receipt,
  Coffee,
  CheckCircle2,
  DollarSign,
  User,
  Phone,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  AlertTriangle,
  Flame,
  Printer
} from 'lucide-react';
import { LoungeTable, OrderItem, Invoice } from '../types';
import { TableVisual3D } from './3d/TableVisual3D';
import { RespawnStore, AVAILABLE_PRODUCTS } from '../services/store';

interface TableDetailPageProps {
  tableId: string;
  onBack: () => void;
  onTableUpdated: () => void;
  onInvoiceCreated: (inv: Invoice) => void;
}

export const TableDetailPage: React.FC<TableDetailPageProps> = ({
  tableId,
  onBack,
  onTableUpdated,
  onInvoiceCreated
}) => {
  const table = RespawnStore.getTableById(tableId);

  // New session state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [sessionMode, setSessionMode] = useState<'open' | 'timer'>('open');
  const [timerMinutes, setTimerMinutes] = useState(60);
  const [isMultiplayer, setIsMultiplayer] = useState(false);

  // Active session controls
  const [nowSec, setNowSec] = useState(Date.now());
  const [showCheckout, setShowCheckout] = useState(false);
  const [discountVal, setDiscountVal] = useState(table?.session?.discount || 0);
  const [cashPaid, setCashPaid] = useState<number>(0);
  const [debtNotes, setDebtNotes] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'drinks' | 'snacks' | 'hookah' | 'accessories'>('all');

  // Real-time second counter
  useEffect(() => {
    const timer = setInterval(() => setNowSec(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!table) {
    return (
      <div className="p-12 text-center glass-panel rounded-3xl space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
        <h2 className="text-xl font-bold text-white font-tajawal">لم يتم العثور على هذه الطاولة</h2>
        <button
          onClick={onBack}
          className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
        >
          ← الرجوع إلى الصالات
        </button>
      </div>
    );
  }

  const isStarting = !table.session;
  const session = table.session;

  // Calculate elapsed time excluding pauses
  let elapsedSeconds = 0;
  if (session) {
    const startMs = new Date(session.startedAt).getTime();
    elapsedSeconds = Math.max(0, Math.floor((nowSec - startMs) / 1000) - (session.totalPausedSeconds || 0));
    if (session.isPaused && session.pausedAt) {
      const pausedMs = new Date(session.pausedAt).getTime();
      const currentPause = Math.floor((nowSec - pausedMs) / 1000);
      elapsedSeconds = Math.max(0, elapsedSeconds - currentPause);
    }
  }

  const formatTimer = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Remaining time for timer mode
  let remainingSeconds = 0;
  let isTimerExpired = false;
  if (session && session.mode === 'timer' && session.targetMinutes) {
    const targetSec = session.targetMinutes * 60;
    remainingSeconds = Math.max(0, targetSec - elapsedSeconds);
    isTimerExpired = elapsedSeconds >= targetSec;
  }

  // Cost calculations
  let timeCost = 0;
  if (session) {
    if (session.mode === 'timer' && session.targetMinutes) {
      timeCost = Math.round((session.targetMinutes / 60) * session.hourlyRate);
    } else {
      timeCost = Math.round((Math.max(60, elapsedSeconds) / 3600) * session.hourlyRate);
    }
  }

  const ordersCost = session ? session.orders.reduce((sum, o) => sum + o.price * o.qty, 0) : 0;
  const subtotal = timeCost + ordersCost;
  const totalDue = Math.max(0, subtotal - discountVal);

  useEffect(() => {
    if (showCheckout) {
      setCashPaid(totalDue);
    }
  }, [showCheckout, totalDue]);

  // Actions
  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    RespawnStore.openTableSession(
      table.id,
      customerName.trim() || 'زبون عام',
      sessionMode,
      timerMinutes,
      isMultiplayer,
      customerPhone.trim()
    );
    onTableUpdated();
  };

  const handleTogglePause = () => {
    RespawnStore.toggleSessionPause(table.id);
    onTableUpdated();
  };

  const handleAddProduct = (prod: OrderItem) => {
    RespawnStore.addOrderToSession(table.id, { ...prod, qty: 1 });
    onTableUpdated();
  };

  const handleUpdateOrderQty = (orderId: string, delta: number) => {
    RespawnStore.updateSessionOrderQty(table.id, orderId, delta);
    onTableUpdated();
  };

  const handleApplyDiscount = (val: number) => {
    const clean = Math.max(0, val);
    setDiscountVal(clean);
    RespawnStore.applySessionDiscount(table.id, clean);
    onTableUpdated();
  };

  const handleConfirmCheckout = () => {
    const paid = Math.min(totalDue, Math.max(0, Number(cashPaid) || 0));
    const debt = Math.max(0, totalDue - paid);
    const method = debt > 0 && paid === 0 ? 'debt' : 'cash';

    const invoice = RespawnStore.closeTableSession(table.id, paid, debt, method, debtNotes);
    if (invoice) {
      onInvoiceCreated(invoice);
    }
    onTableUpdated();
    onBack();
  };

  const handleDeleteTable = () => {
    if (confirm(`هل أنت متأكد من حذف الطاولة "${table.name}" نهائياً؟`)) {
      RespawnStore.deleteTable(table.id);
      onTableUpdated();
      onBack();
    }
  };

  const filteredProducts = AVAILABLE_PRODUCTS.filter(
    (p) => selectedCategory === 'all' || p.category === selectedCategory
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl glass-panel border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center gap-2 border border-white/10 transition-colors cursor-pointer font-tajawal"
          >
            <ArrowRight className="w-4 h-4 text-[#8B7CC7]" />
            الرجوع إلى الصالات والطاولات
          </button>
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
          <div className="text-xs text-[#C9C2E3] font-tajawal hidden sm:block">
            <span>إدارة طاولة: </span>
            <strong className="text-white">{table.name}</strong>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDeleteTable}
            className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold transition-colors flex items-center gap-1.5 font-tajawal cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            حذف الطاولة
          </button>
        </div>
      </div>

      {/* Main Dedicated Workspace */}
      {isStarting ? (
        /* =========================================================================
           1. START SESSION DEDICATED WORKSPACE
           ========================================================================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 3D Visual Centerpiece Showcase */}
          <div className="lg:col-span-5 glass-panel p-8 rounded-3xl border border-white/[0.08] flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8B7CC7] mb-2">
              {table.gameType.toUpperCase()} HARDWARE SPEC
            </span>
            <h2 className="text-2xl font-black text-white font-tajawal mb-1">
              {table.name}
            </h2>
            <p className="text-xs text-neutral-400 font-mono mb-6">
              {table.deviceLabel}
            </p>

            <div className="w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center relative my-4">
              <TableVisual3D gameType={table.gameType} size="hero" isActive={false} />
            </div>

            <div className="w-full pt-6 border-t border-white/[0.08] flex justify-around text-xs font-tajawal text-[#C9C2E3]">
              <div>
                <span className="block text-[10px] text-neutral-400">سعر الفردي:</span>
                <span className="font-mono font-bold text-white text-sm">
                  {table.hourlyRateSingle.toLocaleString()} د.ع / س
                </span>
              </div>
              {table.gameType === 'ps5' && (
                <div>
                  <span className="block text-[10px] text-neutral-400">سعر الجماعي:</span>
                  <span className="font-mono font-bold text-[#8B7CC7] text-sm">
                    {table.hourlyRateMulti.toLocaleString()} د.ع / س
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Form Settings Panel */}
          <div className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-white/[0.08] flex flex-col justify-between">
            <form onSubmit={handleStartSession} className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white font-tajawal mb-1">
                  إعدادات فتح وبدء الجلسة
                </h3>
                <p className="text-xs text-[#C9C2E3]/70 font-tajawal">
                  حدد نمط الحساب، بيانات الزبون، والوقت المطلوب
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#C9C2E3] mb-1.5 flex items-center gap-1.5 font-tajawal">
                    <User className="w-3.5 h-3.5 text-[#8B7CC7]" />
                    اسم الزبون / اللاعب
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="زبون عام (Guest)"
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm font-bold font-tajawal"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#C9C2E3] mb-1.5 flex items-center gap-1.5 font-tajawal">
                    <Phone className="w-3.5 h-3.5 text-[#8B7CC7]" />
                    رقم الهاتف (اختياري)
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="077XXXXXXXX"
                    className="w-full px-4 py-3 rounded-xl glass-input text-sm font-mono"
                  />
                </div>
              </div>

              {/* Mode Selection */}
              <div>
                <label className="block text-xs font-bold text-[#C9C2E3] mb-2 font-tajawal">
                  طريقة احتساب الوقت
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSessionMode('open')}
                    className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                      sessionMode === 'open'
                        ? 'bg-[#5A3B8C]/40 border-[#8B7CC7] text-white shadow-xl shadow-purple-950/50'
                        : 'bg-[#0E0B1D]/40 border-white/[0.08] text-[#C9C2E3]/70 hover:bg-[#2A1E4D]/40'
                    }`}
                  >
                    <div className="font-bold text-sm flex items-center gap-2 font-tajawal text-white">
                      <Clock className="w-4 h-4 text-[#8B7CC7]" />
                      عداد مفتوح (Open Meter)
                    </div>
                    <div className="text-xs text-neutral-400 mt-1.5 font-tajawal">
                      احتساب دقيق بالثواني والدقائق بحسب استهلاك اللاعب
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSessionMode('timer')}
                    className={`p-4 rounded-2xl border text-right transition-all cursor-pointer ${
                      sessionMode === 'timer'
                        ? 'bg-[#5A3B8C]/40 border-[#8B7CC7] text-white shadow-xl shadow-purple-950/50'
                        : 'bg-[#0E0B1D]/40 border-white/[0.08] text-[#C9C2E3]/70 hover:bg-[#2A1E4D]/40'
                    }`}
                  >
                    <div className="font-bold text-sm flex items-center gap-2 font-tajawal text-white">
                      <Timer className="w-4 h-4 text-amber-400" />
                      وقت محدد مسبقاً (Fixed Timer)
                    </div>
                    <div className="text-xs text-neutral-400 mt-1.5 font-tajawal">
                      تحديد وقت محدد (نصف ساعة، ساعة، ساعتين...)
                    </div>
                  </button>
                </div>
              </div>

              {sessionMode === 'timer' && (
                <div className="p-4 rounded-2xl bg-[#0E0B1D]/60 border border-white/[0.06] space-y-2">
                  <label className="block text-xs font-bold text-[#C9C2E3] font-tajawal">
                    اختر مدة العداد التنازلي:
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[30, 45, 60, 90, 120, 180].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setTimerMinutes(mins)}
                        className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                          timerMinutes === mins
                            ? 'bg-amber-400 text-[#0E0B1D] shadow-md shadow-amber-400/20'
                            : 'bg-white/5 text-white border border-white/10 hover:border-amber-400/50'
                        }`}
                      >
                        {mins} دقيقة
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {table.gameType === 'ps5' && (
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0E0B1D]/60 border border-white/[0.06]">
                  <div>
                    <div className="text-xs font-bold text-white font-tajawal">
                      نمط اللعب الجماعي (Multiplayer 2-4 Players)
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                      سعر الجماعي: {table.hourlyRateMulti.toLocaleString()} د.ع / ساعة
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isMultiplayer}
                      onChange={(e) => setIsMultiplayer(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-12 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#8B7CC7]"></div>
                  </label>
                </div>
              )}

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-3 rounded-xl border border-white/10 text-xs font-bold text-[#C9C2E3] hover:bg-white/5 font-tajawal"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#8B7CC7] via-[#5A3B8C] to-[#3A3A52] hover:brightness-110 text-white font-black text-xs tracking-wide shadow-xl shadow-purple-950/70 transition-all flex items-center gap-2 cursor-pointer font-tajawal"
                >
                  <Play className="w-4 h-4 fill-current" />
                  بدء تشغيل الطاولة
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* =========================================================================
           2. DEDICATED ACTIVE SESSION MANAGEMENT WORKSPACE
           ========================================================================= */
        <div className="space-y-6">
          {/* Top Session Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Table Spec & 3D Avatar */}
            <div className="glass-panel p-5 rounded-3xl flex items-center gap-4 border border-[#8B7CC7]/40 bg-gradient-to-br from-[#2A1E4D]/80 to-[#0E0B1D]/90">
              <TableVisual3D gameType={table.gameType} size="md" isActive={!session?.isPaused} />
              <div>
                <span className="text-[10px] font-mono text-[#8B7CC7] uppercase tracking-wider block">
                  {table.gameType.toUpperCase()} STATUS
                </span>
                <h3 className="text-base font-black text-white font-tajawal">
                  {table.name}
                </h3>
                <p className="text-xs text-[#C9C2E3]/80 font-tajawal">
                  الزبون: <strong className="text-white">{session?.customerName}</strong>
                </p>
              </div>
            </div>

            {/* Live Ticking Timer */}
            <div className="glass-panel p-5 rounded-3xl flex flex-col justify-between border border-white/[0.08]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#C9C2E3] flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#8B7CC7]" />
                  الوقت المنقضي
                </span>
                {session?.isPaused && (
                  <span className="text-[9px] bg-amber-400 text-[#0E0B1D] font-bold px-1.5 py-0.5 rounded">
                    موقوف
                  </span>
                )}
              </div>
              <div className="text-3xl sm:text-4xl font-black font-orbitron tracking-wider text-[#8B7CC7] my-1">
                {formatTimer(elapsedSeconds)}
              </div>
              {session?.mode === 'timer' && session.targetMinutes && (
                <div className="text-xs font-mono flex items-center justify-between text-[#C9C2E3]/80 pt-1 border-t border-white/[0.06]">
                  <span>المتبقي:</span>
                  <span className={isTimerExpired ? 'text-rose-400 font-bold' : 'text-amber-300 font-bold'}>
                    {isTimerExpired ? 'انتهى الوقت المحدد!' : formatTimer(remainingSeconds)}
                  </span>
                </div>
              )}
            </div>

            {/* Current Financial Balance */}
            <div className="glass-panel p-5 rounded-3xl flex flex-col justify-between border border-white/[0.08] bg-[#2A1E4D]/40">
              <span className="text-[10px] font-mono text-[#C9C2E3]">
                إجمالي الحساب التراكمي
              </span>
              <div className="text-3xl font-black font-orbitron text-white my-1">
                {totalDue.toLocaleString()} <span className="text-xs text-neutral-400 font-tajawal">د.ع</span>
              </div>
              <div className="text-[11px] text-[#C9C2E3]/80 font-tajawal flex justify-between">
                <span>الوقت: {timeCost.toLocaleString()} د.ع</span>
                <span>الطلبات: {ordersCost.toLocaleString()} د.ع</span>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="glass-panel p-5 rounded-3xl flex flex-col justify-between border border-white/[0.08]">
              <span className="text-[10px] font-mono text-[#C9C2E3]">
                التحكم بالعداد
              </span>
              <div className="space-y-2 mt-2">
                <button
                  onClick={handleTogglePause}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer font-tajawal ${
                    session?.isPaused
                      ? 'bg-emerald-500 text-[#0E0B1D] hover:bg-emerald-400 shadow-md'
                      : 'bg-[#2A1E4D] text-amber-300 border border-amber-400/40 hover:bg-amber-400/20'
                  }`}
                >
                  {session?.isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
                  {session?.isPaused ? 'استئناف تشغيل العداد' : 'إيقاف العداد مؤقتاً'}
                </button>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-[#C9C2E3] font-tajawal shrink-0">خصم:</span>
                  <input
                    type="number"
                    value={discountVal || ''}
                    onChange={(e) => handleApplyDiscount(Number(e.target.value) || 0)}
                    placeholder="0"
                    className="w-full px-2 py-1.5 rounded-lg glass-input text-xs font-mono text-center"
                  />
                  <span className="text-xs text-neutral-400 font-mono">د.ع</span>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Management Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Active Orders on Table */}
            <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-white/[0.08] flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 font-tajawal">
                  <Coffee className="w-4 h-4 text-[#8B7CC7]" />
                  الطلبات المسجلة على هذه الطاولة ({session?.orders.length || 0})
                </h4>

                <div className="space-y-2.5 max-h-72 overflow-y-auto no-scrollbar pr-1">
                  {session?.orders.length === 0 ? (
                    <div className="text-center py-12 text-neutral-500 text-xs font-tajawal border border-dashed border-white/5 rounded-2xl">
                      لا توجد طلبات إضافية على الطاولة حتى الآن.
                      <div className="text-[11px] text-neutral-600 mt-1">اختر من القائمة المجاورة لإضافة المشروبات والسناكات</div>
                    </div>
                  ) : (
                    session?.orders.map((o) => (
                      <div
                        key={o.id}
                        className="p-3 rounded-2xl bg-[#0E0B1D]/80 border border-white/[0.06] flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{o.icon}</span>
                          <div>
                            <div className="font-bold text-white font-tajawal">{o.name}</div>
                            <div className="text-[11px] text-[#8B7CC7] font-mono">
                              {(o.price * o.qty).toLocaleString()} د.ع
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateOrderQty(o.id, -1)}
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-mono font-bold text-white text-sm">
                            {o.qty}
                          </span>
                          <button
                            onClick={() => handleUpdateOrderQty(o.id, 1)}
                            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] mt-4 flex justify-between text-xs font-tajawal">
                <span className="text-[#C9C2E3]">إجمالي قيمة الطلبات:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {ordersCost.toLocaleString()} د.ع
                </span>
              </div>
            </div>

            {/* Right: Quick Menu Product Selector */}
            <div className="lg:col-span-7 glass-panel p-6 rounded-3xl border border-white/[0.08]">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h4 className="text-sm font-bold text-white font-tajawal">
                  إضافة سريعة لمشروبات ومأكولات الصالة
                </h4>

                <div className="flex items-center gap-1">
                  {(['all', 'drinks', 'snacks', 'hookah', 'accessories'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer font-tajawal ${
                        selectedCategory === cat
                          ? 'bg-[#5A3B8C] text-white border border-[#8B7CC7]'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {cat === 'all'
                        ? 'الكل'
                        : cat === 'drinks'
                        ? 'مشروبات'
                        : cat === 'snacks'
                        ? 'وجبات'
                        : cat === 'hookah'
                        ? 'أراجيل'
                        : 'إضافات'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto no-scrollbar pr-1">
                {filteredProducts.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleAddProduct(p)}
                    className="p-3 rounded-2xl bg-[#0E0B1D]/60 hover:bg-[#2A1E4D]/60 border border-white/[0.06] hover:border-[#8B7CC7]/40 text-right transition-all flex flex-col justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl group-hover:scale-110 transition-transform">
                        {p.icon}
                      </span>
                      <span className="text-xs font-bold text-white font-tajawal truncate">
                        {p.name}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-[#8B7CC7] mt-2 font-bold">
                      {p.price.toLocaleString()} د.ع
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Checkout & Settlement Card */}
          {showCheckout ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#2A1E4D] via-[#1A1435] to-[#0E0B1D] border-2 border-[#8B7CC7] space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                <div className="flex items-center gap-3">
                  <Receipt className="w-6 h-6 text-[#8B7CC7]" />
                  <div>
                    <h3 className="font-bold text-base text-white font-tajawal">
                      تأكيد الحساب النهائي وإصدار الفاتورة الرسمية
                    </h3>
                    <p className="text-xs text-[#C9C2E3]/70 font-tajawal">
                      الزبون: {session?.customerName} • الطاولة: {table.name}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#C9C2E3]"
                >
                  إلغاء التحصيل
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-tajawal">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-neutral-400 block mb-1">المبلغ المطلوب بالكامل:</span>
                  <span className="text-2xl font-black font-orbitron text-emerald-400">
                    {totalDue.toLocaleString()} د.ع
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <label className="text-neutral-400 block mb-1">المستلم نقداً كاش:</label>
                  <input
                    type="number"
                    value={cashPaid || ''}
                    onChange={(e) => setCashPaid(Number(e.target.value) || 0)}
                    className="w-full bg-[#0E0B1D] text-white font-mono font-bold text-lg px-3 py-1.5 rounded-xl border border-white/10"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                  <span className="text-neutral-400 block mb-1">المتبقي كدين:</span>
                  <span
                    className={`text-2xl font-black font-orbitron ${
                      totalDue - cashPaid > 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {Math.max(0, totalDue - cashPaid).toLocaleString()} د.ع
                  </span>
                </div>
              </div>

              {totalDue - cashPaid > 0 && (
                <div>
                  <label className="block text-xs font-bold text-rose-300 mb-1.5 font-tajawal">
                    ملاحظات قيد الدين (اسم الزبون أو الهاتف للتواصل):
                  </label>
                  <input
                    type="text"
                    value={debtNotes}
                    onChange={(e) => setDebtNotes(e.target.value)}
                    placeholder="مثال: دين مسائي مع الكابتن أحمد"
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs font-tajawal"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowCheckout(false)}
                  className="px-5 py-3 rounded-xl text-xs font-bold text-[#C9C2E3] hover:bg-white/5 font-tajawal"
                >
                  رجوع
                </button>
                <button
                  onClick={handleConfirmCheckout}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-[#0E0B1D] font-black text-xs font-tajawal tracking-wider shadow-xl shadow-emerald-950/70 hover:brightness-110 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  تأكيد التحصيل وإغلاق الطاولة
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl glass-panel border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-[#C9C2E3]">جاهز للمحاسبة؟</div>
                <div className="text-sm font-bold text-white font-tajawal">
                  المبلغ المطلوب حتى اللحظة: {totalDue.toLocaleString()} د.ع
                </div>
              </div>

              <button
                onClick={() => setShowCheckout(true)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#8B7CC7] to-[#5A3B8C] hover:brightness-110 text-white font-black text-xs tracking-wider shadow-xl shadow-purple-950/70 transition-all flex items-center justify-center gap-2.5 cursor-pointer font-tajawal"
              >
                <Receipt className="w-4 h-4 text-white" />
                محاسبة وإغلاق الطاولة (Checkout)
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
