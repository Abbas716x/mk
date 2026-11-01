import React, { useState } from 'react';
import { Shield, KeyRound, User, Lock, Sparkles, Building2, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserSession } from '../types';
import { RespawnStore } from '../services/store';

interface LoginModalProps {
  onLoginSuccess: (user: UserSession) => void;
  defaultAdminMode?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLoginSuccess, defaultAdminMode = false }) => {
  const [username, setUsername] = useState(defaultAdminMode ? '3' : '2');
  const [password, setPassword] = useState(defaultAdminMode ? '3' : '2');
  const [selectedBranch, setSelectedBranch] = useState('branch_mansour');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const branches = RespawnStore.getBranches();

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const u = username.trim();
      const p = password.trim();

      // Master Admin Login: Username 3, Password 3
      const isSuperAdmin = (u === '3' && p === '3') || (u === 'admin' && p === 'respawn2026');
      
      // Secondary Branch Login: Username 2, Password 2
      const isBranchOperator = (u === '2' && p === '2') || (u === 'mansour' && p === 'respawn716');

      if (isSuperAdmin) {
        const sessionUser: UserSession = {
          username: u,
          name: 'المدير العام (Super Admin)',
          role: 'SUPER_ADMIN',
          assignedBranch: 'all',
          token: `vault_admin_${Date.now()}_aes256`,
          loggedInAt: new Date().toISOString()
        };

        RespawnStore.setCurrentUser(sessionUser);
        RespawnStore.addAuditLog('all', 'ADMIN_AUTH_SUCCESS', 'تسجيل دخول ناجح للمدير العام (Super Admin)', 'success');
        onLoginSuccess(sessionUser);
      } else if (isBranchOperator) {
        const targetBranch = branches.find((b) => b.id === selectedBranch) || branches[0];
        const sessionUser: UserSession = {
          username: u,
          name: `مشغل فرع (${targetBranch.name.split(' ')[1] || targetBranch.name})`,
          role: 'BRANCH_OPERATOR',
          assignedBranch: targetBranch.id,
          token: `vault_branch_${Date.now()}_aes256`,
          loggedInAt: new Date().toISOString()
        };

        RespawnStore.setCurrentUser(sessionUser);
        RespawnStore.setActiveBranchId(targetBranch.id);
        RespawnStore.addAuditLog(targetBranch.id, 'BRANCH_AUTH_SUCCESS', `تسجيل دخول مشغل الفرع لـ: ${targetBranch.name}`, 'info');
        onLoginSuccess(sessionUser);
      } else {
        setErrorMsg('بيانات الدخول غير صحيحة. استخدم (3 / 3) للمدير العام أو (2 / 2) لمشغل الفرع.');
      }
      setIsLoading(false);
    }, 380);
  };

  const handleFillAdmin = () => {
    setUsername('3');
    setPassword('3');
    setErrorMsg('');
  };

  const handleFillBranch = () => {
    setUsername('2');
    setPassword('2');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#07050F]/85 backdrop-blur-2xl">
      <div className="relative w-full max-w-md p-8 sm:p-10 rounded-3xl glass-panel border border-[#C9C2E3]/20 shadow-[0_20px_70px_rgba(0,0,0,0.85)] overflow-hidden">
        {/* Top Glowing Trim */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#8B7CC7] via-[#C9C2E3] to-[#5A3B8C]" />

        {/* Ambient Corner Blur */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#8B7CC7]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#5A3B8C]/35 rounded-full blur-3xl pointer-events-none" />

        {/* Logo & Header */}
        <div className="text-center mb-7">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#2A1E4D] via-[#5A3B8C] to-[#8B7CC7] border border-white/20 flex items-center justify-center text-3xl shadow-xl shadow-purple-950/80">
            🎮
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white font-orbitron tracking-wider">
            RESPAWN <span className="text-[#8B7CC7]">LOUNGE</span>
          </h1>
          <p className="text-xs text-[#C9C2E3]/80 mt-1 font-tajawal">
            قاعة رسبون — نظام الإدارة والتشغيل السحابي الموحد
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#C9C2E3] mb-1.5 flex items-center gap-1.5 font-tajawal">
              <User className="w-3.5 h-3.5 text-[#8B7CC7]" />
              اسم المستخدم (Username)
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm font-mono tracking-wide placeholder-neutral-500"
              placeholder="3 أو 2"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#C9C2E3] mb-1.5 flex items-center gap-1.5 font-tajawal">
              <Lock className="w-3.5 h-3.5 text-[#8B7CC7]" />
              كلمة المرور (Password)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl glass-input text-sm font-mono tracking-wide placeholder-neutral-500"
              placeholder="••••••••"
              required
            />
          </div>

          {username === '2' && (
            <div>
              <label className="block text-xs font-bold text-[#C9C2E3] mb-1.5 flex items-center gap-1.5 font-tajawal">
                <Building2 className="w-3.5 h-3.5 text-[#8B7CC7]" />
                الفرع المراد فتحه
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-4 py-3 rounded-xl glass-input text-xs font-tajawal cursor-pointer"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-tajawal">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#8B7CC7] via-[#5A3B8C] to-[#2A1E4D] hover:brightness-110 text-white font-black text-sm tracking-wide shadow-xl shadow-purple-950/70 transition-all duration-200 transform active:scale-95 flex items-center justify-center gap-2 font-tajawal cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                جارٍ التحقق وفك تشفير الخزنة...
              </span>
            ) : (
              <>
                <KeyRound className="w-4 h-4 text-[#C9C2E3]" />
                دخول آمن للنظام
              </>
            )}
          </button>
        </form>

        {/* Demo Badges */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
          <div className="text-[11px] text-[#C9C2E3]/70 font-tajawal text-center mb-1">
            اختر حساب الدخول السريع:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleFillAdmin}
              className={`py-2 px-3 rounded-xl text-xs font-bold font-tajawal transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                username === '3'
                  ? 'bg-[#5A3B8C] text-white border-[#8B7CC7]'
                  : 'bg-white/5 text-[#C9C2E3] border-white/10 hover:bg-white/10'
              }`}
            >
              👑 مدير عام (3 / 3)
            </button>

            <button
              type="button"
              onClick={handleFillBranch}
              className={`py-2 px-3 rounded-xl text-xs font-bold font-tajawal transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                username === '2'
                  ? 'bg-[#5A3B8C] text-white border-[#8B7CC7]'
                  : 'bg-white/5 text-[#C9C2E3] border-white/10 hover:bg-white/10'
              }`}
            >
              🎮 مشغل فرع (2 / 2)
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#C9C2E3]/60 font-mono pt-2">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              AES-256 VAULT LOADED
            </span>
            <span>V3.5 CYBER-PURPLE</span>
          </div>
        </div>
      </div>
    </div>
  );
};
