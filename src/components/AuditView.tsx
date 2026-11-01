import React, { useState } from 'react';
import { ShieldCheck, Search, Lock } from 'lucide-react';
import { AuditLog } from '../types';

interface AuditViewProps {
  logs: AuditLog[];
  branchName: string;
}

export const AuditView: React.FC<AuditViewProps> = ({ logs, branchName }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.user.toLowerCase().includes(q);

    const matchSeverity = severityFilter === 'all' || log.severity === severityFilter;

    return matchSearch && matchSeverity;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#8B7CC7]" />
            <h1 className="text-xl sm:text-2xl font-black text-white font-tajawal">
              سجل الرقابة العامة والتدقيق الأمني
            </h1>
          </div>
          <p className="text-xs text-[#C9C2E3]/70 font-tajawal mt-1">
            توثيق كامل لكافة الحركات المالية، فتح وإغلاق الطاولات، والتعديلات المشفرة — {branchName}
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-[#5A3B8C]/20 border border-[#8B7CC7]/40 text-[#C9C2E3] font-mono text-xs flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#8B7CC7]" />
          <span>AES-256 VAULT AUDIT</span>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="p-3 rounded-2xl glass-panel border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {[
            { id: 'all', label: 'كافة السجلات' },
            { id: 'info', label: 'معلومات عامة' },
            { id: 'success', label: 'عمليات ناجحة' },
            { id: 'warning', label: 'تنبيهات وتجميد' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setSeverityFilter(btn.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer font-tajawal ${
                severityFilter === btn.id
                  ? 'bg-[#5A3B8C] text-white border border-[#8B7CC7]'
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
            placeholder="بحث في السجلات والعمليات..."
            className="w-full pr-9 pl-4 py-2 rounded-xl glass-input text-xs font-tajawal"
          />
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-panel rounded-3xl border border-white/[0.08] overflow-hidden">
        <div className="space-y-2 p-4 max-h-[600px] overflow-y-auto no-scrollbar font-mono text-xs">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-neutral-500 font-tajawal">
              لا توجد سجلات مطابقة.
            </div>
          ) : (
            filteredLogs.map((log) => {
              const timeStr = new Date(log.timestamp).toLocaleString('ar-IQ');

              return (
                <div
                  key={log.id}
                  className="p-3.5 rounded-2xl bg-[#0E0B1D]/70 border border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#2A1E4D]/30 transition-colors"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 ${
                        log.severity === 'critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : log.severity === 'warning'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : log.severity === 'success'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-[#5A3B8C]/40 text-[#C9C2E3] border border-[#8B7CC7]/40'
                      }`}
                    >
                      {log.action}
                    </span>
                    <div>
                      <div className="text-white font-tajawal text-xs">{log.details}</div>
                      <div className="text-[10px] text-neutral-400 font-mono mt-0.5 sm:hidden">
                        المستخدم: {log.user} • {timeStr}
                      </div>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-4 text-neutral-400 text-[11px] shrink-0 font-tajawal">
                    <span className="text-[#C9C2E3]">{log.user}</span>
                    <span>{timeStr}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
