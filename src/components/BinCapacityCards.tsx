'use client';

import React from 'react';
import { AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';
import { BinStatus, WasteCategory } from '@/types';
import { WASTE_CATEGORIES } from '@/constants/wasteConfig';
import { WasteIcon } from './WasteIcon';
import { cn } from '@/lib/utils';

interface BinCapacityCardsProps {
  bins: BinStatus[];
  onEmptyBin: (category: WasteCategory) => void;
}

export function BinCapacityCards({ bins, onEmptyBin }: BinCapacityCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {bins.map((bin) => {
        const meta = WASTE_CATEGORIES[bin.id];
        const isFull = bin.capacityPercent >= 95;
        const isWarning = bin.capacityPercent >= 80 && !isFull;

        return (
          <div
            key={bin.id}
            className={cn(
              'rounded-2xl bg-slate-900/90 border p-3.5 flex flex-col justify-between transition-all duration-200',
              isFull
                ? 'border-red-500/60 bg-red-950/20'
                : isWarning
                ? 'border-amber-500/50 bg-amber-950/20'
                : 'border-slate-800 hover:border-slate-700'
            )}
          >
            {/* Header: Icon, Name, and Status Badge */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: `${meta.color}20`,
                    color: meta.color,
                  }}
                >
                  <WasteIcon category={bin.id} className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white leading-tight">
                    {bin.name}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {meta.englishName}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div>
                {isFull ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-red-500/20 text-red-300 border border-red-500/40">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    Penuh!
                  </span>
                ) : isWarning ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <AlertTriangle className="w-2.5 h-2.5" />
                    Hampir Penuh
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    Aman
                  </span>
                )}
              </div>
            </div>

            {/* Progress Bar & Volume */}
            <div className="my-3">
              <div className="flex items-baseline justify-between mb-1.5 text-xs">
                <span className="text-slate-400">Level Pengisian</span>
                <span
                  className="font-bold font-mono text-sm"
                  style={{ color: meta.hexLight || meta.color }}
                >
                  {bin.capacityPercent}%
                </span>
              </div>

              {/* Progress Track */}
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${bin.capacityPercent}%`,
                    backgroundColor: meta.color,
                  }}
                />
              </div>
            </div>

            {/* Bottom Row: Item count & Reset button (Tanpa Berat) */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono">
                {bin.itemCount} / {bin.maxItems} item
              </span>

              <button
                type="button"
                onClick={() => onEmptyBin(bin.id)}
                title={`Kosongkan wadah ${bin.name}`}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
