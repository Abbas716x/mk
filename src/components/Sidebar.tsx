import React from 'react';
import {
  Gamepad2,
  LayoutDashboard,
  Receipt,
  BookOpen,
  Coffee,
  ShieldCheck,
  Building2,
  LogOut,
  Wifi,
  ChevronDown,
  Plus
} from 'lucide-react';
import { UserSession, Branch } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserSession;
  onLogout: () => void;
  branches: Branch[];
  activeBranchId: string;
  onSwitchBranch: (branchId: string) => void;
  onOpenAddTable: () => void;
  onOpenAdminPortal: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  branches,
  activeBranchId,
  onSwitchBranch,
  onOpenAddTable,
  onOpenAdminPortal,
  isOpen,
  onClose
}) => {
  const currentBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  const navItems = [
    {
      id: 'tables',
      label: 'الصالات والطاولات',
      icon: Gamepad2,
      badge: 'LIVE 3D'
    },
    {
      id: 'invoices',
      label: 'الفواتير والمدفوعات',
      icon: Receipt
    },
    {
      id: 'debts',
      label: 'دفتر الديون الذكي',
      icon: BookOpen
    },
    {
      id: 'inventory',
      label: 'المنيو والأسعار',
      icon: Coffee
    },
    {
      id: 'audit',
      label: 'سجل الرقابة والعمليات',
      icon: ShieldCheck
    }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 right-0 z-40 w-72 bg-[#0E0B1D]/90 backdrop-blur-2xl border-l border-white/[0.08] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-5 flex flex-col flex-1 overflow-y-auto no-scrollbar">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 pb-5 mb-5 border-b border-white/[0.08]">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2A1E4D] via-[#5A3B8C] to-[#8B7CC7] border border-white/20 flex items-center justify-center text-xl shadow-lg shadow-purple-950/80">
              🎮
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-black text-lg text-white tracking-wider">
                  RESPAWN
                </span>
                <span className="text-[10px] bg-[#8B7CC7]/20 text-[#C9C2E3] border border-[#8B7CC7]/40 px-1.5 py-0.5 rounded font-mono font-bold">
                  CYBER
                </span>
              </div>
              <div className="text-[11px] text-[#C9C2E3]/70 font-tajawal">
                قاعة رسبون للألعاب والترفيه
              </div>
            </div>
          </div>

          {/* Active Branch Switcher Box */}
          <div className="p-3.5 mb-4 rounded-2xl bg-[#2A1E4D]/40 border border-white/[0.08] shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono tracking-wider text-[#C9C2E3] flex items-center gap-1">
                <Building2 className="w-3 h-3 text-[#8B7CC7]" />
                الفرع الحالي
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                متزامن
              </span>
            </div>

            <div className="relative">
              <select
                value={activeBranchId}
                onChange={(e) => onSwitchBranch(e.target.value)}
                className="w-full bg-[#0E0B1D]/80 text-white text-xs font-bold font-tajawal rounded-xl px-3 py-2 border border-white/[0.08] appearance-none focus:outline-none focus:border-[#8B7CC7] cursor-pointer"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Prominent Action Button: Add New Table */}
          <button
            onClick={() => {
              onOpenAddTable();
              onClose();
            }}
            className="w-full mb-4 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#8B7CC7] to-[#5A3B8C] hover:brightness-110 text-white font-black text-xs font-tajawal tracking-wide shadow-lg shadow-purple-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            إضافة طاولة جديدة (Add Table)
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1.5 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-l from-[#8B7CC7]/30 via-[#5A3B8C]/40 to-transparent text-white border-r-4 border-[#8B7CC7] shadow-lg shadow-purple-950/40'
                      : 'text-[#C9C2E3]/80 hover:bg-[#2A1E4D]/40 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-[#C9C2E3]' : 'text-[#8B7CC7]/60'
                      }`}
                    />
                    <span className="font-tajawal text-[13px]">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-[#C9C2E3] text-[#0E0B1D]'
                          : 'bg-[#5A3B8C]/50 text-[#C9C2E3]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Super Admin Direct Portal Link Button */}
          {currentUser.role === 'SUPER_ADMIN' && (
            <button
              onClick={() => {
                onOpenAdminPortal();
                onClose();
              }}
              className="mt-3 p-3 rounded-2xl bg-gradient-to-r from-[#2A1E4D] to-[#1A1435] border border-[#8B7CC7]/40 hover:border-[#8B7CC7] text-white text-xs font-bold font-tajawal flex items-center justify-between transition-all cursor-pointer shadow-md"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">👑</span>
                <span>لوحة الإدارة المركزية</span>
              </div>
              <span className="text-[10px] font-mono text-[#8B7CC7]">ADMIN →</span>
            </button>
          )}

          {/* Sync Latency Indicator */}
          <div className="mt-4 p-2.5 rounded-xl bg-[#2A1E4D]/30 border border-white/[0.06] text-[11px] font-mono text-[#C9C2E3]/80 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>RTDB: &lt;50ms</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">REALTIME</span>
          </div>
        </div>

        {/* User Footer Panel */}
        <div className="p-4 border-t border-white/[0.08] bg-[#0E0B1D]/95">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#5A3B8C]/60 border border-[#C9C2E3]/20 flex items-center justify-center font-bold text-white text-xs shrink-0">
                {currentUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white font-tajawal truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-[#8B7CC7] font-mono tracking-tight">
                  {currentUser.role}
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="تسجيل الخروج"
              className="p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/30 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
