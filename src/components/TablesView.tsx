import React, { useState } from 'react';
import {
  Search,
  Plus,
  Clock,
  User,
  Coffee,
  Sparkles,
  Gamepad2
} from 'lucide-react';
import { LoungeTable, GameType } from '../types';
import { TableVisual3D } from './3d/TableVisual3D';

interface TablesViewProps {
  tables: LoungeTable[];
  onSelectTable: (tableId: string) => void;
  onOpenAddTable: () => void;
  branchName: string;
}

export const TablesView: React.FC<TablesViewProps> = ({
  tables,
  onSelectTable,
  onOpenAddTable,
  branchName
}) => {
  const [filterGame, setFilterGame] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTables = tables.filter((t) => {
    const matchGame = filterGame === 'all' || t.gameType === filterGame;
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && t.status === 'active') ||
      (filterStatus === 'available' && t.status === 'available');
    const query = searchQuery.trim().toLowerCase();
    const matchSearch =
      !query ||
      t.name.toLowerCase().includes(query) ||
      t.deviceLabel.toLowerCase().includes(query) ||
      (t.session?.customerName || '').toLowerCase().includes(query);

    return matchGame && matchStatus && matchSearch;
  });

  const activeCount = tables.filter((t) => t.status === 'active').length;
  const availableCount = tables.filter((t) => t.status === 'available').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Fast Metrics */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-panel border border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-[#8B7CC7] uppercase tracking-widest">
              REAL-TIME LOUNGE MESH
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-tajawal mt-1">
            صالات وأجهزة قاعة رسبون
          </h1>
          <p className="text-xs text-[#C9C2E3]/70 font-tajawal mt-0.5">
            الفرع النشط: <strong className="text-white">{branchName}</strong> — اضغط على أي طاولة للانتقال لصفحتها المستقلة
          </p>
        </div>

        {/* Clear Action Button: Add New Table & KPI Counters */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={onOpenAddTable}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#8B7CC7] to-[#5A3B8C] hover:brightness-110 text-white font-black text-xs font-tajawal tracking-wide shadow-lg shadow-purple-950/60 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            إضافة طاولة جديدة (Add New Table)
          </button>

          <div className="px-4 py-2.5 rounded-2xl bg-[#2A1E4D]/60 border border-[#8B7CC7]/40 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
            <div>
              <div className="text-[10px] font-mono text-[#C9C2E3]">مشغولة</div>
              <div className="text-xl font-black font-orbitron text-emerald-400">
                {activeCount}
              </div>
            </div>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-[#2A1E4D]/40 border border-white/10 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-neutral-400" />
            <div>
              <div className="text-[10px] font-mono text-[#C9C2E3]">شاغرة</div>
              <div className="text-xl font-black font-orbitron text-white">
                {availableCount}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl glass-panel border border-white/[0.08]">
        {/* Game Type Filter Segmented Control */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
          {[
            { id: 'all', label: 'كافة الألعاب', icon: '🎮' },
            { id: 'ps5', label: 'PlayStation 5', icon: '🎮' },
            { id: 'billiards', label: 'بليارد', icon: '🎱' },
            { id: 'tennis', label: 'تنس طاولة', icon: '🏓' },
            { id: 'domino', label: 'دومينو وطاولة', icon: '🎲' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterGame(cat.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                filterGame === cat.id
                  ? 'bg-[#5A3B8C] text-white border border-[#8B7CC7] shadow-lg shadow-purple-950/50'
                  : 'text-[#C9C2E3]/70 hover:bg-[#2A1E4D]/40 hover:text-white border border-transparent'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="font-tajawal">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث عن طاولة أو زبون..."
            className="w-full pr-9 pl-4 py-2 rounded-xl glass-input text-xs font-tajawal placeholder-neutral-500"
          />
        </div>
      </div>

      {/* 3D Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredTables.map((table) => {
          const isActive = table.status === 'active';
          const session = table.session;

          let elapsedMin = 0;
          if (session) {
            const startMs = new Date(session.startedAt).getTime();
            const sec = Math.max(0, Math.floor((Date.now() - startMs) / 1000) - (session.totalPausedSeconds || 0));
            elapsedMin = Math.floor(sec / 60);
          }

          return (
            <div
              key={table.id}
              onClick={() => onSelectTable(table.id)}
              className={`group relative rounded-3xl p-5 glass-card border flex flex-col justify-between overflow-hidden cursor-pointer ${
                isActive
                  ? 'border-[#8B7CC7]/60 bg-gradient-to-b from-[#2A1E4D]/70 to-[#0E0B1D]/90 shadow-[0_10px_35px_rgba(90,59,140,0.25)]'
                  : 'border-white/[0.08] hover:border-[#8B7CC7]/40'
              }`}
            >
              {/* Header: Table Number & Status Pill */}
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#5A3B8C]/40 border border-[#C9C2E3]/20 flex items-center justify-center font-orbitron font-black text-sm text-white">
                    #{table.number}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white font-tajawal group-hover:text-[#C9C2E3] transition-colors">
                      {table.name}
                    </h3>
                    <div className="text-[10px] text-neutral-400 font-mono">
                      {table.deviceLabel}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                      : 'bg-neutral-800/60 text-neutral-400 border-neutral-700/60'
                  }`}
                >
                  {isActive ? '● مشغولة' : 'شاغرة'}
                </span>
              </div>

              {/* Centered High-Fidelity 3D Visual Render */}
              <div className="my-2 py-3 flex items-center justify-center relative">
                <TableVisual3D
                  gameType={table.gameType}
                  size="md"
                  isActive={isActive}
                  className="transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Active Session Info or Base Rate */}
              <div className="pt-3 border-t border-white/[0.08] relative z-10">
                {isActive && session ? (
                  <div className="space-y-1.5 text-xs font-tajawal">
                    <div className="flex items-center justify-between text-[#C9C2E3]">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-[#8B7CC7]" />
                        الزبون:
                      </span>
                      <span className="font-bold text-white truncate max-w-[130px]">
                        {session.customerName}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[#C9C2E3]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#8B7CC7]" />
                        المدة الحالية:
                      </span>
                      <span className="font-mono font-bold text-emerald-400">
                        {elapsedMin} دقيقة
                      </span>
                    </div>

                    {session.orders.length > 0 && (
                      <div className="flex items-center justify-between text-[11px] text-[#C9C2E3]/70">
                        <span className="flex items-center gap-1">
                          <Coffee className="w-3 h-3 text-amber-400" />
                          الطلبات:
                        </span>
                        <span className="font-mono">
                          {session.orders.length} أصناف
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs text-[#C9C2E3]/80 font-tajawal">
                    <span>سعر الساعة:</span>
                    <span className="font-mono font-bold text-white">
                      {table.hourlyRateSingle.toLocaleString()} د.ع
                    </span>
                  </div>
                )}

                {/* Direct Action Indicator */}
                <div className="mt-3 pt-2 flex items-center justify-between text-[11px] font-bold text-[#8B7CC7] group-hover:text-white transition-colors font-tajawal">
                  <span>{isActive ? 'إدارة الجلسة والحساب' : 'فتح وبدء جلسة'}</span>
                  <span>← الصفحة المخصصة</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
