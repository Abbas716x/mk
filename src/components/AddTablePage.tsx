import React, { useState } from 'react';
import { ArrowRight, Plus, Gamepad2, Sparkles, CheckCircle2 } from 'lucide-react';
import { GameType } from '../types';
import { TableVisual3D } from './3d/TableVisual3D';
import { RespawnStore } from '../services/store';

interface AddTablePageProps {
  branchId: string;
  onBack: () => void;
  onTableAdded: () => void;
}

export const AddTablePage: React.FC<AddTablePageProps> = ({
  branchId,
  onBack,
  onTableAdded
}) => {
  const [name, setName] = useState('');
  const [gameType, setGameType] = useState<GameType>('ps5');
  const [deviceLabel, setDeviceLabel] = useState('PS5 4K 120Hz Studio');
  const [rateSingle, setRateSingle] = useState(4000);
  const [rateMulti, setRateMulti] = useState(6000);

  const handleSelectGameType = (type: GameType) => {
    setGameType(type);
    if (type === 'ps5') {
      setName('محطة PS5 جديدة');
      setDeviceLabel('PlayStation 5 Console 4K');
      setRateSingle(4500);
      setRateMulti(6500);
    } else if (type === 'billiards') {
      setName('طاولة بليارد جديدة');
      setDeviceLabel('Diamond Tournament Grade 9ft');
      setRateSingle(5000);
      setRateMulti(5000);
    } else if (type === 'tennis') {
      setName('طاولة تنس طاولة جديدة');
      setDeviceLabel('ITTF Certified Table Tennis');
      setRateSingle(3500);
      setRateMulti(3500);
    } else if (type === 'domino') {
      setName('طاولة دومينو وطاولة زهر');
      setDeviceLabel('Classic Ivory & Walnut Board');
      setRateSingle(3000);
      setRateMulti(3000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    RespawnStore.addTable(
      branchId,
      name.trim() || 'طاولة جديدة',
      gameType,
      deviceLabel.trim(),
      rateSingle,
      rateMulti
    );
    onTableAdded();
    onBack();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb Bar */}
      <div className="p-5 sm:p-6 rounded-3xl glass-panel border border-white/[0.08] flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs flex items-center gap-2 border border-white/10 transition-colors cursor-pointer font-tajawal"
        >
          <ArrowRight className="w-4 h-4 text-[#8B7CC7]" />
          الرجوع إلى الصالات والطاولات
        </button>
        <span className="text-xs font-mono text-[#8B7CC7]">PROVISION TABLE</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live 3D Preview Box */}
        <div className="lg:col-span-5 glass-panel p-8 rounded-3xl border border-white/[0.08] flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8B7CC7] mb-2">
            3D LIVE PREVIEW
          </span>
          <h2 className="text-2xl font-black text-white font-tajawal mb-1">
            {name || 'طاولة جديدة'}
          </h2>
          <p className="text-xs text-neutral-400 font-mono mb-6">
            {deviceLabel}
          </p>

          <div className="w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center relative my-4">
            <TableVisual3D gameType={gameType} size="hero" isActive={true} />
          </div>

          <div className="text-xs text-[#C9C2E3] font-tajawal">
            نموذج ثلاثي الأبعاد تفاعلي يتحدث تلقائياً حسب نوع اللعبة المختارة
          </div>
        </div>

        {/* Configuration Form */}
        <div className="lg:col-span-7 glass-panel p-8 rounded-3xl border border-white/[0.08]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-white font-tajawal">
                إضافة طاولة أو جهاز جديد
              </h1>
              <p className="text-xs text-[#C9C2E3]/70 font-tajawal mt-1">
                اختر نوع اللعبة والمجسم ثلاثي الأبعاد وحدد أسعار الساعات
              </p>
            </div>

            {/* Game Type Picker */}
            <div>
              <label className="block text-xs font-bold text-[#C9C2E3] mb-2 font-tajawal">
                اختر نوع الطاولة أو اللعبة (Game Type)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: 'ps5', label: 'PlayStation 5', icon: '🎮' },
                  { id: 'billiards', label: 'بليارد احترافي', icon: '🎱' },
                  { id: 'tennis', label: 'تنس طاولة', icon: '🏓' },
                  { id: 'domino', label: 'دومينو وطاولة', icon: '🎲' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectGameType(item.id as GameType)}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      gameType === item.id
                        ? 'bg-[#5A3B8C] border-[#8B7CC7] text-white shadow-xl shadow-purple-950/60'
                        : 'bg-[#0E0B1D]/60 border-white/[0.08] text-[#C9C2E3]/70 hover:bg-[#2A1E4D]/40'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-bold text-xs font-tajawal">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Table Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#C9C2E3] mb-1.5 font-tajawal">
                  اسم الطاولة التجاري
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: محطة PS5 VIP 05"
                  required
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs font-bold font-tajawal"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#C9C2E3] mb-1.5 font-tajawal">
                  وصف الجهاز أو الطاولة
                </label>
                <input
                  type="text"
                  value={deviceLabel}
                  onChange={(e) => setDeviceLabel(e.target.value)}
                  placeholder="مثال: شاشة 65 بوصة 4K 120Hz"
                  className="w-full px-4 py-3 rounded-xl glass-input text-xs font-tajawal"
                />
              </div>
            </div>

            {/* Pricing Rates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#C9C2E3] mb-1.5 font-tajawal">
                  سعر الساعة الفردي (د.ع)
                </label>
                <input
                  type="number"
                  value={rateSingle}
                  onChange={(e) => setRateSingle(Number(e.target.value))}
                  step="500"
                  min="0"
                  required
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm font-mono font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#C9C2E3] mb-1.5 font-tajawal">
                  سعر الساعة الجماعي / 4 يدات (د.ع)
                </label>
                <input
                  type="number"
                  value={rateMulti}
                  onChange={(e) => setRateMulti(Number(e.target.value))}
                  step="500"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl glass-input text-sm font-mono font-bold"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onBack}
                className="px-5 py-3 rounded-xl border border-white/10 text-xs font-bold text-[#C9C2E3] hover:bg-white/5 font-tajawal"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#8B7CC7] via-[#5A3B8C] to-[#3A3A52] hover:brightness-110 text-white font-black text-xs tracking-wider shadow-xl shadow-purple-950/70 transition-all flex items-center gap-2 cursor-pointer font-tajawal"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                حفظ وتفعيل الطاولة في الصالة
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
