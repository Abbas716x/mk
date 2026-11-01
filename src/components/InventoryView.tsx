import React, { useState } from 'react';
import { Coffee, Gamepad2 } from 'lucide-react';
import { AVAILABLE_PRODUCTS } from '../services/store';

export const InventoryView: React.FC = () => {
  const [items, setItems] = useState(AVAILABLE_PRODUCTS);
  const [selectedCat, setSelectedCat] = useState<'all' | 'drinks' | 'snacks' | 'hookah' | 'accessories'>('all');

  const gameRates = [
    { name: 'PlayStation 5 (فردي - لاعب واحد أو لاعبين)', rate: '4,000 د.ع / ساعة', badge: 'PS5 Single' },
    { name: 'PlayStation 5 (جماعي - 4 يدات تورنمنت)', rate: '6,000 د.ع / ساعة', badge: 'PS5 Multi 4P' },
    { name: 'طاولات بليارد احترافية (Diamond 9ft)', rate: '5,000 د.ع / ساعة', badge: 'Billiards' },
    { name: 'تنس الطاولة (Ping Pong ITTF)', rate: '3,500 د.ع / ساعة', badge: 'Table Tennis' },
    { name: 'دومينو وطاولة زهر VIP (Board Games)', rate: '3,000 د.ع / ساعة', badge: 'Domino / Tawla' }
  ];

  const filteredItems = items.filter(
    (i) => selectedCat === 'all' || i.category === selectedCat
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2A1E4D] via-[#5A3B8C] to-[#8B7CC7] border border-white/20 flex items-center justify-center text-xl shadow-lg">
            ☕
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white font-tajawal">
              قائمة أسعار الألعاب ومقهى رسبون (Menu & Rates)
            </h1>
            <p className="text-xs text-[#C9C2E3]/70 font-tajawal mt-0.5">
              أسعار ساعات الأجهزة والطاولات، المشروبات الباردة والساخنة، والوجبات السريعة
            </p>
          </div>
        </div>
      </div>

      {/* Gaming Rates Section */}
      <div>
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2 font-tajawal">
          <Gamepad2 className="w-4 h-4 text-[#8B7CC7]" />
          تسعيرات ساعات الأجهزة والصالات المعتمدة
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gameRates.map((g, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl glass-card border border-white/[0.08] flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-[#8B7CC7] font-bold bg-[#5A3B8C]/20 px-2 py-0.5 rounded border border-[#8B7CC7]/30">
                  {g.badge}
                </span>
                <div className="font-bold text-xs text-white font-tajawal mt-2">
                  {g.name}
                </div>
              </div>
              <div className="text-right font-mono font-black text-emerald-400 text-sm">
                {g.rate}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cafe & Lounge Menu */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2 font-tajawal">
            <Coffee className="w-4 h-4 text-amber-400" />
            أصناف الكافيه والسناك
          </h2>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0E0B1D]/80 border border-white/5">
            {(['all', 'drinks', 'snacks', 'hookah', 'accessories'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer font-tajawal ${
                  selectedCat === cat
                    ? 'bg-[#5A3B8C] text-white border border-[#8B7CC7]'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat === 'all'
                  ? 'الكل'
                  : cat === 'drinks'
                  ? 'مشروبات'
                  : cat === 'snacks'
                  ? 'سناكات'
                  : cat === 'hookah'
                  ? 'أراجيل'
                  : 'إضافات'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl glass-card border border-white/[0.08] flex items-center justify-between hover:border-[#8B7CC7]/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="font-bold text-xs text-white font-tajawal">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono capitalize">
                    {item.category}
                  </div>
                </div>
              </div>

              <div className="font-mono font-black text-emerald-400 text-sm">
                {item.price.toLocaleString()} د.ع
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
