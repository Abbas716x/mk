/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Menu,
  Clock,
  CheckCircle2,
  Building2,
  Shield,
  ArrowRight,
  LogOut,
  Plus
} from 'lucide-react';
import { UserSession, LoungeTable, Invoice } from './types';
import { RespawnStore } from './services/store';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { LoginModal } from './components/LoginModal';
import { Sidebar } from './components/Sidebar';
import { TablesView } from './components/TablesView';
import { TableDetailPage } from './components/TableDetailPage';
import { AddTablePage } from './components/AddTablePage';
import { SuperAdminPage } from './components/SuperAdminPage';
import { InvoicesView } from './components/InvoicesView';
import { DebtsView } from './components/DebtsView';
import { InventoryView } from './components/InventoryView';
import { AuditView } from './components/AuditView';

type ViewMode = 'branch-portal' | 'table-detail' | 'add-table' | 'super-admin';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => RespawnStore.getCurrentUser());
  const [activeBranchId, setActiveBranchId] = useState<string>(() => RespawnStore.getActiveBranchId());
  const [activeTab, setActiveTab] = useState<string>('tables');
  const [viewMode, setViewMode] = useState<ViewMode>('branch-portal');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Live state tracking
  const [tables, setTables] = useState<LoungeTable[]>(() => RespawnStore.getTables(activeBranchId));
  const [branches, setBranches] = useState(() => RespawnStore.getBranches());
  const [invoices, setInvoices] = useState(() => RespawnStore.getInvoices(activeBranchId));
  const [debts, setDebts] = useState(() => RespawnStore.getDebts(activeBranchId));
  const [auditLogs, setAuditLogs] = useState(() => RespawnStore.getAuditLogs(activeBranchId));

  // Toast notification state
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'warn' } | null>(null);

  // Time Clock
  const [currentTime, setCurrentTime] = useState<string>('');

  // Check URL extension / hash for dedicated admin routing
  useEffect(() => {
    const checkRoute = () => {
      if (
        window.location.pathname.includes('/admin') ||
        window.location.hash === '#admin' ||
        window.location.search.includes('admin')
      ) {
        setViewMode('super-admin');
      }
    };
    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    return () => window.removeEventListener('hashchange', checkRoute);
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string, type: 'success' | 'info' | 'warn' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const refreshData = () => {
    setTables(RespawnStore.getTables(activeBranchId));
    setBranches(RespawnStore.getBranches());
    setInvoices(RespawnStore.getInvoices(activeBranchId));
    setDebts(RespawnStore.getDebts(activeBranchId));
    setAuditLogs(RespawnStore.getAuditLogs(activeBranchId));
  };

  // Real-time synchronization
  useEffect(() => {
    const unsubscribe = RespawnStore.subscribe(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, [activeBranchId]);

  const handleSwitchBranch = (branchId: string) => {
    setActiveBranchId(branchId);
    RespawnStore.setActiveBranchId(branchId);
    setTables(RespawnStore.getTables(branchId));
    setInvoices(RespawnStore.getInvoices(branchId));
    setDebts(RespawnStore.getDebts(branchId));
    setAuditLogs(RespawnStore.getAuditLogs(branchId));
    const target = branches.find((b) => b.id === branchId);
    showToast(`تم التبديل إلى: ${target?.name || branchId}`, 'info');
  };

  const handleLogout = () => {
    RespawnStore.setCurrentUser(null);
    setCurrentUser(null);
    setViewMode('branch-portal');
  };

  const handleOpenTableDetail = (tableId: string) => {
    setSelectedTableId(tableId);
    setViewMode('table-detail'); // Dedicated full page! Zero modal popup!
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAddTable = () => {
    setViewMode('add-table'); // Dedicated full page!
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  return (
    <div className="relative min-h-screen text-white bg-[#0E0B1D] overflow-x-hidden font-tajawal selection:bg-[#8B7CC7]/40 selection:text-white">
      {/* Pristine 3D Spatial Interactive Background (Floating Discs & Stones) */}
      <BackgroundCanvas />

      {/* Mandatory Login Wall if not authenticated */}
      {!currentUser && (
        <LoginModal
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            if (user.role === 'SUPER_ADMIN') {
              if (window.location.hash === '#admin' || window.location.pathname.includes('/admin')) {
                setViewMode('super-admin');
              } else {
                setViewMode('branch-portal');
              }
            } else {
              setViewMode('branch-portal');
              setActiveBranchId(user.assignedBranch);
            }
            refreshData();
            showToast(`مرحباً بك، ${user.name}! تم فتح الخزنة المشفرة بنجاح`, 'success');
          }}
          defaultAdminMode={window.location.hash === '#admin'}
        />
      )}

      {/* Real-time Toast Notifications */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-2.5 text-xs font-bold font-tajawal ${
              toast.type === 'success'
                ? 'bg-[#2A1E4D]/95 text-[#C9C2E3] border-[#8B7CC7]/40 shadow-purple-950/80'
                : toast.type === 'warn'
                ? 'bg-amber-950/95 text-amber-300 border-amber-500/40'
                : 'bg-[#2A1E4D]/95 text-cyan-300 border-cyan-500/40'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#8B7CC7]" />
            <span>{toast.msg}</span>
          </div>
        </div>
      )}

      {/* Main Authenticated Experience */}
      {currentUser && (
        <div className="relative z-10 flex min-h-screen">
          {/* Dedicated Super Admin Portal View (Completely Separated File / Route) */}
          {viewMode === 'super-admin' ? (
            <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
              <SuperAdminPage
                currentUser={currentUser}
                onLogout={handleLogout}
                onBackToBranch={() => {
                  setViewMode('branch-portal');
                  window.location.hash = '';
                }}
                onRefresh={refreshData}
              />
            </div>
          ) : (
            /* Dedicated Branch Workspace View */
            <>
              {/* Frosted Glass Sidebar */}
              <Sidebar
                activeTab={activeTab}
                setActiveTab={(tab) => {
                  setActiveTab(tab);
                  setViewMode('branch-portal');
                }}
                currentUser={currentUser}
                onLogout={handleLogout}
                branches={branches}
                activeBranchId={activeBranchId}
                onSwitchBranch={handleSwitchBranch}
                onOpenAddTable={handleOpenAddTable}
                onOpenAdminPortal={() => {
                  setViewMode('super-admin');
                  window.location.hash = '#admin';
                }}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
              />

              {/* Main Workspace Frame */}
              <div className="flex-1 flex flex-col lg:mr-72 min-w-0 transition-all duration-300">
                {/* Top Bar Header */}
                <header className="sticky top-0 z-30 h-16 bg-[#0E0B1D]/80 backdrop-blur-2xl border-b border-white/[0.08] px-4 sm:px-8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsSidebarOpen(true)}
                      className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10"
                    >
                      <Menu className="w-5 h-5" />
                    </button>

                    <div className="hidden sm:flex items-center gap-2 text-xs text-[#C9C2E3] font-tajawal">
                      <span>قاعة رسبون</span>
                      <span>/</span>
                      <span className="text-[#8B7CC7] font-bold">{currentBranch?.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Add Table Quick Button in Header */}
                    <button
                      onClick={handleOpenAddTable}
                      className="hidden sm:flex px-3.5 py-1.5 rounded-xl bg-[#5A3B8C]/40 hover:bg-[#5A3B8C]/70 text-[#C9C2E3] border border-[#8B7CC7]/40 text-xs font-bold font-tajawal items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#8B7CC7]" />
                      + إضافة طاولة
                    </button>

                    {/* RTDB Indicator */}
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-[#2A1E4D]/50 border border-[#8B7CC7]/30 text-emerald-400 text-xs font-mono">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>RTDB: ACTIVE</span>
                    </div>

                    {/* Clock */}
                    <div className="px-3 py-1 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-[#C9C2E3] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#8B7CC7]" />
                      <span>{currentTime || '--:--:--'}</span>
                    </div>
                  </div>
                </header>

                {/* Sub-Views Router */}
                <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto pb-20">
                  {/* Full Dedicated Table Page (NO modal!) */}
                  {viewMode === 'table-detail' && selectedTableId && (
                    <TableDetailPage
                      tableId={selectedTableId}
                      onBack={() => setViewMode('branch-portal')}
                      onTableUpdated={refreshData}
                      onInvoiceCreated={(invoice) => {
                        showToast(`تم إغلاق الحساب وإصدار الفاتورة [${invoice.id}] بنجاح`, 'success');
                      }}
                    />
                  )}

                  {/* Full Dedicated Add Table Page */}
                  {viewMode === 'add-table' && (
                    <AddTablePage
                      branchId={activeBranchId}
                      onBack={() => setViewMode('branch-portal')}
                      onTableAdded={() => {
                        refreshData();
                        showToast('تمت إضافة وتفعيل الطاولة الجديدة بنجاح', 'success');
                      }}
                    />
                  )}

                  {/* Standard Branch Portal Tabs */}
                  {viewMode === 'branch-portal' && (
                    <>
                      {activeTab === 'tables' && (
                        <TablesView
                          tables={tables}
                          onSelectTable={handleOpenTableDetail}
                          onOpenAddTable={handleOpenAddTable}
                          branchName={currentBranch?.name || ''}
                        />
                      )}

                      {activeTab === 'invoices' && (
                        <InvoicesView
                          invoices={invoices}
                          branchName={currentBranch?.name || ''}
                        />
                      )}

                      {activeTab === 'debts' && (
                        <DebtsView
                          debts={debts}
                          onRefresh={refreshData}
                          branchName={currentBranch?.name || ''}
                        />
                      )}

                      {activeTab === 'inventory' && <InventoryView />}

                      {activeTab === 'audit' && (
                        <AuditView logs={auditLogs} branchName={currentBranch?.name || ''} />
                      )}
                    </>
                  )}
                </main>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
