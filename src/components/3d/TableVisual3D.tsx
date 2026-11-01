import React, { useState } from 'react';
import { GameType } from '../../types';

interface TableVisual3DProps {
  gameType: GameType;
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  className?: string;
}

export const TableVisual3D: React.FC<TableVisual3DProps> = ({
  gameType,
  isActive = false,
  size = 'md',
  className = ''
}) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({
      x: -y * 0.08,
      y: x * 0.08
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-40 h-40',
    hero: 'w-64 h-64 sm:w-80 sm:h-80'
  }[size];

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex items-center justify-center transition-transform duration-200 ease-out preserve-3d cursor-pointer ${sizeClasses} ${className}`}
      style={{
        transform: `perspective(850px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
      }}
    >
      {/* Specular Cyber-Purple Glow Aura */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-500 pointer-events-none ${
          isActive
            ? 'opacity-85 bg-[#8B7CC7]/35 scale-110 animate-pulse'
            : 'opacity-25 bg-[#5A3B8C]/20'
        }`}
      />

      {gameType === 'ps5' && <PS5Visual3D isActive={isActive} size={size} />}
      {gameType === 'billiards' && <BilliardsVisual3D isActive={isActive} size={size} />}
      {gameType === 'tennis' && <TableTennisVisual3D isActive={isActive} size={size} />}
      {gameType === 'domino' && <DominoVisual3D isActive={isActive} size={size} />}
    </div>
  );
};

/* =========================================================================
   1. PlayStation 5 Volumetric Cyber-Purple Visual
   ========================================================================= */
const PS5Visual3D: React.FC<{ isActive: boolean; size: string }> = ({ isActive }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      {/* Dynamic Drop Shadow */}
      <div className="absolute bottom-2 w-3/4 h-3.5 bg-black/70 rounded-full blur-md" />

      {/* PS5 Console Body */}
      <div className="relative w-[58%] h-[84%] flex items-center justify-center">
        {/* Outer White Wing Left */}
        <div
          className="absolute -left-1.5 top-0 bottom-0 w-[42%] bg-gradient-to-br from-white via-slate-100 to-slate-300 rounded-t-[36px] rounded-bl-[16px] shadow-lg border-l border-t border-white/60 transform -rotate-[3deg]"
          style={{ clipPath: 'polygon(0% 0%, 100% 5%, 85% 100%, 0% 95%)' }}
        />

        {/* Outer White Wing Right */}
        <div
          className="absolute -right-1.5 top-0 bottom-0 w-[42%] bg-gradient-to-bl from-white via-slate-100 to-slate-300 rounded-t-[36px] rounded-br-[16px] shadow-lg border-r border-t border-white/60 transform rotate-[3deg]"
          style={{ clipPath: 'polygon(0% 5%, 100% 0%, 100% 95%, 15% 100%)' }}
        />

        {/* Inner Obsidian Gloss Core */}
        <div className="relative w-[52%] h-[92%] bg-gradient-to-b from-[#1E1933] via-[#0E0B1D] to-black rounded-t-2xl rounded-b-lg border border-[#5A3B8C]/40 shadow-2xl flex flex-col items-center justify-between py-3 overflow-hidden">
          {/* Luminous LED Vent Accent */}
          <div
            className={`w-[85%] h-1 rounded-full transition-all duration-300 ${
              isActive
                ? 'bg-[#C9C2E3] shadow-[0_0_14px_#8B7CC7]'
                : 'bg-[#5A3B8C] shadow-[0_0_6px_#5A3B8C]'
            }`}
          />

          {/* Disc Drive Slot & Front USB Ports */}
          <div className="flex flex-col items-center gap-1.5 opacity-80">
            <div className="w-1.5 h-3.5 bg-[#2A1E4D] rounded-sm border border-[#5A3B8C]/50" />
            <div className="w-1.5 h-1.5 bg-[#2A1E4D] rounded-full" />
          </div>

          <div className="text-[10px] font-mono tracking-widest text-[#8B7CC7] font-black">
            PS5
          </div>
        </div>

        {/* DualSense Wireless Controller Layered Front */}
        <div
          className={`absolute -bottom-2 -right-3 w-[58%] h-[44%] bg-gradient-to-b from-white via-slate-100 to-slate-200 rounded-2xl shadow-2xl border border-white/80 p-1 flex flex-col justify-between transform rotate-[-8deg] ${
            isActive ? 'shadow-[0_0_18px_rgba(139,124,199,0.5)]' : ''
          }`}
        >
          <div className="flex justify-between items-center px-1">
            <div className="w-2.5 h-2.5 bg-neutral-900 rounded-sm" />
            <div
              className={`w-4 h-2.5 rounded-sm transition-colors duration-300 ${
                isActive ? 'bg-[#8B7CC7] shadow-[0_0_8px_#C9C2E3]' : 'bg-[#2A1E4D]'
              }`}
            />
            <div className="w-2.5 h-2.5 flex flex-wrap gap-0.5 justify-center">
              <span className="w-1 h-1 bg-[#8B7CC7] rounded-full" />
              <span className="w-1 h-1 bg-[#FB7185] rounded-full" />
            </div>
          </div>

          <div className="flex justify-around items-end pt-0.5">
            <div className="w-3.5 h-3.5 bg-neutral-900 rounded-full border border-neutral-700" />
            <div className="w-3.5 h-3.5 bg-neutral-900 rounded-full border border-neutral-700" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   2. Billiard Table Volumetric 3D Visual
   ========================================================================= */
const BilliardsVisual3D: React.FC<{ isActive: boolean; size: string }> = ({ isActive }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      <div className="absolute bottom-2 w-[85%] h-5 bg-black/70 rounded-full blur-md" />

      <div className="relative w-[92%] h-[70%] preserve-3d transform -rotate-x-[15deg]">
        {/* Mahogany Outer Wood Cushion Border */}
        <div className="relative w-full h-full bg-gradient-to-br from-[#3D2554] via-[#241336] to-[#12071C] rounded-xl p-2 border border-[#8B7CC7]/40 shadow-2xl flex items-center justify-center">
          {/* Corner Chrome / Brass Caps */}
          <span className="absolute top-0.5 left-0.5 w-3 h-3 bg-gradient-to-br from-[#C9C2E3] to-[#5A3B8C] rounded-tl-lg shadow-sm" />
          <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-gradient-to-br from-[#C9C2E3] to-[#5A3B8C] rounded-tr-lg shadow-sm" />
          <span className="absolute bottom-0.5 left-0.5 w-3 h-3 bg-gradient-to-br from-[#C9C2E3] to-[#5A3B8C] rounded-bl-lg shadow-sm" />
          <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-gradient-to-br from-[#C9C2E3] to-[#5A3B8C] rounded-br-lg shadow-sm" />

          {/* Tournament Velvet Cloth Surface */}
          <div
            className={`relative w-full h-full rounded-md shadow-inner flex items-center justify-center transition-colors duration-500 overflow-hidden ${
              isActive
                ? 'bg-gradient-to-br from-[#41286B] via-[#2E1A4E] to-[#1B0F2E]'
                : 'bg-gradient-to-br from-[#2D1B4B] via-[#1C1030] to-[#10081C]'
            }`}
          >
            {/* 6 Pockets */}
            <div className="absolute top-0 left-0 w-3 h-3 bg-black rounded-br-full" />
            <div className="absolute top-0 right-0 w-3 h-3 bg-black rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-3 h-3 bg-black rounded-tr-full" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-black rounded-tl-full" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-1.5 bg-black rounded-b-full" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-1.5 bg-black rounded-t-full" />

            {/* Balls Rack Triangle Cluster */}
            <div className="relative flex items-center gap-1 transform scale-95">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-white to-slate-200 shadow-md ml-3 border border-white" />
              <div className="flex flex-col items-center gap-0.5">
                <div className="flex gap-0.5">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 shadow-sm" />
                  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm" />
                  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-rose-500 to-red-700 shadow-sm" />
                </div>
                <div className="flex gap-0.5">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-[#8B7CC7] to-[#5A3B8C] shadow-sm" />
                  <div className="w-2 h-2 rounded-full bg-black border border-white/40 shadow-sm" />
                </div>
                <div className="w-2 h-2 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-sm" />
              </div>
            </div>

            {/* Cue Stick with Wooden Inlay */}
            <div className="absolute -top-3 -right-2 w-[118%] h-1 bg-gradient-to-r from-[#C9C2E3] via-amber-700 to-amber-950 rounded-full shadow-lg transform rotate-[22deg] origin-left pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   3. Table Tennis (Ping Pong) Volumetric 3D Visual
   ========================================================================= */
const TableTennisVisual3D: React.FC<{ isActive: boolean; size: string }> = ({ isActive }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      <div className="absolute bottom-2 w-[85%] h-5 bg-black/70 rounded-full blur-md" />

      <div className="relative w-[92%] h-[70%] preserve-3d">
        <div
          className={`relative w-full h-full rounded-lg border-2 border-white shadow-2xl p-0.5 flex items-center justify-center transition-colors duration-500 ${
            isActive
              ? 'bg-gradient-to-br from-[#4E3182] via-[#351E5C] to-[#1E1038]'
              : 'bg-gradient-to-br from-[#351E5C] via-[#241340] to-[#120822]'
          }`}
        >
          {/* White Center Line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-white/70" />

          {/* Center Vertical Net */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 bg-[#0E0B1D] border-l border-r border-white/60 flex flex-col justify-between py-0.5 shadow-lg z-10">
            <span className="w-full h-[1px] bg-white" />
            <span className="w-full h-[1px] bg-white/40" />
            <span className="w-full h-[1px] bg-white" />
          </div>

          {/* Red Rubber Racket Left */}
          <div className="absolute left-3 top-3 transform -rotate-[25deg] shadow-lg flex items-center">
            <div className="w-5 h-6 bg-gradient-to-br from-rose-500 to-red-700 rounded-full border border-rose-300 shadow-md flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-rose-300 rounded-full opacity-60" />
            </div>
            <div className="w-3 h-1.5 bg-gradient-to-r from-amber-700 to-amber-950 rounded-r-sm -ml-0.5" />
          </div>

          {/* Ping Pong Ball */}
          <div className="absolute right-7 top-4 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-amber-200 via-orange-400 to-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)] border border-white" />

          {/* Black Rubber Racket Right */}
          <div className="absolute right-3 bottom-3 transform rotate-[155deg] shadow-lg flex items-center opacity-90">
            <div className="w-5 h-6 bg-gradient-to-br from-neutral-800 to-black rounded-full border border-neutral-600 shadow-md" />
            <div className="w-3 h-1.5 bg-gradient-to-r from-amber-700 to-amber-950 rounded-r-sm -ml-0.5" />
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   4. Domino & Board Game Volumetric 3D Visual
   ========================================================================= */
const DominoVisual3D: React.FC<{ isActive: boolean; size: string }> = ({ isActive }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center select-none">
      <div className="absolute bottom-2 w-[85%] h-5 bg-black/70 rounded-full blur-md" />

      <div className="relative w-[85%] h-[82%] bg-gradient-to-br from-[#3D2554] via-[#241336] to-[#12071C] rounded-xl p-2 border border-[#8B7CC7]/40 shadow-2xl flex items-center justify-center">
        <div className="relative w-full h-full rounded-lg bg-[#1B122B] border border-[#5A3B8C]/40 p-2 flex items-center justify-center gap-2">
          {/* Ivory Tile 1 */}
          <div
            className={`relative w-7 h-14 bg-gradient-to-b from-[#FAF8F5] via-[#EDE7DE] to-[#D6CEBF] rounded-md shadow-2xl border border-white flex flex-col justify-between p-1 transform -rotate-[12deg] ${
              isActive ? 'shadow-[0_0_14px_rgba(139,124,199,0.5)]' : ''
            }`}
          >
            <div className="grid grid-cols-2 gap-1 p-0.5 justify-items-center">
              <span className="w-1 h-1 bg-neutral-900 rounded-full" />
              <span className="w-1 h-1 bg-neutral-900 rounded-full" />
              <span className="w-1 h-1 bg-neutral-900 rounded-full" />
              <span className="w-1 h-1 bg-neutral-900 rounded-full" />
              <span className="w-1 h-1 bg-neutral-900 rounded-full" />
              <span className="w-1 h-1 bg-neutral-900 rounded-full" />
            </div>

            <div className="w-full h-[1px] bg-neutral-400 flex items-center justify-center my-0.5">
              <span className="w-1 h-1 bg-amber-500 rounded-full" />
            </div>

            <div className="grid grid-cols-2 gap-1 p-0.5 justify-items-center">
              <span className="w-1 h-1 bg-neutral-900 rounded-full" />
              <span className="w-1 h-1 bg-neutral-900 rounded-full" />
              <span className="w-1 h-1 bg-neutral-900 rounded-full" />
              <span className="w-1 h-1 bg-neutral-900 rounded-full" />
            </div>
          </div>

          {/* Ivory Tile 2 */}
          <div className="relative w-7 h-14 bg-gradient-to-b from-[#FAF8F5] via-[#EDE7DE] to-[#D6CEBF] rounded-md shadow-2xl border border-white flex flex-col justify-between p-1 transform rotate-[18deg]">
            <div className="relative h-5 flex items-center justify-center">
              <span className="absolute top-0.5 left-0.5 w-1 h-1 bg-neutral-900 rounded-full" />
              <span className="absolute top-0.5 right-0.5 w-1 h-1 bg-neutral-900 rounded-full" />
              <span className="w-1 h-1 bg-neutral-900 rounded-full" />
              <span className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-neutral-900 rounded-full" />
              <span className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-neutral-900 rounded-full" />
            </div>

            <div className="w-full h-[1px] bg-neutral-400 flex items-center justify-center my-0.5">
              <span className="w-1 h-1 bg-amber-500 rounded-full" />
            </div>

            <div className="relative h-5 flex items-center justify-center">
              <span className="absolute top-0.5 left-0.5 w-1 h-1 bg-neutral-900 rounded-full" />
              <span className="absolute top-0.5 right-0.5 w-1 h-1 bg-neutral-900 rounded-full" />
              <span className="w-1 h-1 bg-neutral-900 rounded-full" />
              <span className="absolute bottom-0.5 left-0.5 w-1 h-1 bg-neutral-900 rounded-full" />
              <span className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-neutral-900 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
