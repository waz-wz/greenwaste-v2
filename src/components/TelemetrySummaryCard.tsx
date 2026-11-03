'use client';

import React from 'react';
import { Recycle, TrendingUp, Zap } from 'lucide-react';
import { SystemTelemetry, BinStatus } from '@/types';
import { WASTE_CATEGORIES } from '@/constants/wasteConfig';
import { WasteIcon } from './WasteIcon';

interface TelemetrySummaryCardProps {
  telemetry: SystemTelemetry;
  bins: BinStatus[];
}

export function TelemetrySummaryCard({ telemetry, bins }: TelemetrySummaryCardProps) {
  const dominantMeta = WASTE_CATEGORIES[telemetry.dominantCategory];
  const totalBinItems = bins.reduce((acc, curr) => acc + curr.itemCount, 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* 1: Total Sorted */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400">Total Sampah Terpilah</span>
          <div className="flex items-baseline gap-2 mt-1">
            <h3 className="text-2xl font-bold font-mono text-white">
              {telemetry.totalSortedToday.toLocaleString()}
            </h3>
            <span className="text-xs text-emerald-400 font-semibold font-mono flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              Aktif
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono mt-0.5 block">
            {totalBinItems} item tersimpan di wadah
          </span>
        </div>

        <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <Recycle className="w-5 h-5" />
        </div>
      </div>

      {/* 2: Dominant Category */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400">Kategori Dominan</span>
          <div className="flex items-center gap-2 mt-1">
            <h3
              className="text-xl font-bold"
              style={{ color: dominantMeta.hexLight || dominantMeta.color }}
            >
              {telemetry.dominantCategory}
            </h3>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full border"
              style={{
                backgroundColor: `${dominantMeta.color}15`,
                borderColor: `${dominantMeta.color}40`,
                color: dominantMeta.hexLight || dominantMeta.color,
              }}
            >
              {telemetry.dominantPercentage}%
            </span>
          </div>
          <span className="text-xs text-slate-500 mt-0.5 block">
            {dominantMeta.englishName} • Jumlah Terbanyak
          </span>
        </div>

        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{
            backgroundColor: `${dominantMeta.color}15`,
            color: dominantMeta.color,
          }}
        >
          <WasteIcon category={telemetry.dominantCategory} className="w-5 h-5" />
        </div>
      </div>

      {/* 3: Throughput */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-400">Kecepatan Sortir</span>
          <div className="flex items-baseline gap-1 mt-1">
            <h3 className="text-2xl font-bold font-mono text-cyan-400">
              {telemetry.throughputPerHour}
            </h3>
            <span className="text-xs text-slate-400">item/jam</span>
          </div>
          <span className="text-xs text-slate-500 mt-0.5 block">
            Akurasi Inferensi AI ~98%
          </span>
        </div>

        <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
          <Zap className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
