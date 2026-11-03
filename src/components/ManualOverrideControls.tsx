'use client';

import React from 'react';
import { SlidersHorizontal, Lock, ArrowUpRight } from 'lucide-react';
import { WasteCategory, SystemMode } from '@/types';
import { WASTE_CATEGORIES } from '@/constants/wasteConfig';
import { WasteIcon } from './WasteIcon';
import { cn } from '@/lib/utils';

interface ManualOverrideControlsProps {
  mode: SystemMode;
  isEmergencyStopped: boolean;
  onTriggerBin: (category: WasteCategory) => void;
  activeDivertingBin: WasteCategory | null;
}

const CATEGORIES: WasteCategory[] = [
  'Kaca',
  'Kardus',
  'Kertas',
  'Logam',
  'Organik',
  'Plastik',
];

export function ManualOverrideControls({
  mode,
  isEmergencyStopped,
  onTriggerBin,
  activeDivertingBin,
}: ManualOverrideControlsProps) {
  const isManual = mode === 'MANUAL';
  const isDisabled = !isManual || isEmergencyStopped;

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Manual Override Aktuator</h3>
        </div>

        <span
          className={cn(
            'text-xs font-semibold px-2.5 py-0.5 rounded-full border',
            isManual
              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700'
          )}
        >
          {isManual ? 'Mode Manual Aktif' : 'Terkunci (Auto Mode)'}
        </span>
      </div>

      {/* Info message if locked */}
      {!isManual && (
        <div className="mt-3 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span>
            Aktifkan <strong>Manual</strong> di navbar atas untuk menggerakkan aktuator secara manual.
          </span>
        </div>
      )}

      {/* 6 Action Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3">
        {CATEGORIES.map((category) => {
          const meta = WASTE_CATEGORIES[category];
          const isActive = activeDivertingBin === category;

          return (
            <button
              key={category}
              type="button"
              disabled={isDisabled}
              onClick={() => onTriggerBin(category)}
              style={
                isManual && !isEmergencyStopped
                  ? {
                      borderColor: isActive ? meta.color : `${meta.color}40`,
                    }
                  : undefined
              }
              className={cn(
                'group relative flex items-center justify-between p-3 rounded-xl border text-left transition-all duration-150',
                isDisabled
                  ? 'bg-slate-950/40 border-slate-800/60 opacity-40 cursor-not-allowed text-slate-500'
                  : 'bg-slate-950/70 hover:bg-slate-800/90 active:scale-[0.98] cursor-pointer text-slate-200',
                isActive && 'ring-2 ring-white/20'
              )}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: `${meta.color}20`,
                    color: meta.color,
                  }}
                >
                  <WasteIcon category={category} className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white leading-tight">
                    {meta.name}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {meta.englishName}
                  </span>
                </div>
              </div>

              <ArrowUpRight
                className={cn(
                  'w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5',
                  isManual ? 'text-slate-300' : 'text-slate-600'
                )}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
