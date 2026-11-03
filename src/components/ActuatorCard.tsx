'use client';

import React from 'react';
import { Cog, CheckCircle2, AlertOctagon, Gauge } from 'lucide-react';
import { ActuatorInfo, WasteCategory } from '@/types';
import { WASTE_CATEGORIES } from '@/constants/wasteConfig';
import { WasteIcon } from './WasteIcon';
import { cn } from '@/lib/utils';

interface ActuatorCardProps {
  actuator: ActuatorInfo;
  isEmergencyStopped: boolean;
  onSpeedChange: (speed: number) => void;
}

export function ActuatorCard({
  actuator,
  isEmergencyStopped,
  onSpeedChange,
}: ActuatorCardProps) {
  const isDiverting = actuator.state.startsWith('Diverting');
  const targetCategory: WasteCategory | null = actuator.activeTargetBin;
  const targetMeta = targetCategory ? WASTE_CATEGORIES[targetCategory] : null;

  const speedPresets = [0, 15, 25, 40];

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
            <Cog className={cn('w-4 h-4', isDiverting && 'animate-spin text-emerald-400')} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Status Aktuator &amp; Servo</h3>
            <p className="text-xs text-slate-400">Pneumatic Diverter Arm</p>
          </div>
        </div>

        {/* State Badge */}
        <div>
          {isEmergencyStopped ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/30">
              <AlertOctagon className="w-3.5 h-3.5" />
              Emergency Stop
            </span>
          ) : isDiverting && targetCategory && targetMeta ? (
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border animate-pulse"
              style={{
                backgroundColor: `${targetMeta.color}15`,
                borderColor: `${targetMeta.color}50`,
                color: targetMeta.hexLight || targetMeta.color,
              }}
            >
              <WasteIcon category={targetCategory} className="w-3.5 h-3.5" />
              {actuator.state}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {actuator.state}
            </span>
          )}
        </div>
      </div>

      {/* Speed Controller Section */}
      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
            <Gauge className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pengaturan Kecepatan Conveyor</span>
          </div>
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-base font-bold text-white">
              {isEmergencyStopped ? 0 : actuator.conveyorSpeed}
            </span>
            <span className="text-xs text-slate-400">cm/s</span>
          </div>
        </div>

        {/* Slider */}
        <input
          type="range"
          min="0"
          max="50"
          step="5"
          disabled={isEmergencyStopped}
          value={isEmergencyStopped ? 0 : actuator.conveyorSpeed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
        />

        {/* Quick Speed Preset Buttons */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-500">Preset:</span>
          <div className="flex items-center gap-1.5">
            {speedPresets.map((preset) => {
              const isSelected = actuator.conveyorSpeed === preset && !isEmergencyStopped;
              return (
                <button
                  key={preset}
                  type="button"
                  disabled={isEmergencyStopped}
                  onClick={() => onSpeedChange(preset)}
                  className={cn(
                    'px-2 py-0.5 rounded text-[11px] font-mono transition-colors disabled:opacity-40',
                    isSelected
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                  )}
                >
                  {preset === 0 ? 'Stop' : `${preset} cm/s`}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Metrics Row: Angle & Cycles */}
      <div className="grid grid-cols-2 gap-3">
        {/* Sudut Defleksi Servo */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-xs text-slate-400">Sudut Defleksi Servo</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span
              className="text-xl font-bold font-mono"
              style={{
                color: targetMeta ? targetMeta.hexLight || targetMeta.color : '#ffffff',
              }}
            >
              {isEmergencyStopped ? '0' : actuator.servoAngle > 0 ? `+${actuator.servoAngle}` : actuator.servoAngle}°
            </span>
            <span className="text-xs text-slate-500">derajat</span>
          </div>
          <div className="relative w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (Math.abs(actuator.servoAngle) / 75) * 100)}%`,
                backgroundColor: targetMeta ? targetMeta.color : '#10b981',
              }}
            />
          </div>
        </div>

        {/* Total Operasi Pemilahan */}
        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <span className="text-xs text-slate-400">Siklus Pemilahan</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold font-mono text-white">
              {actuator.cycleCount.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500">kali</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Aktif: {actuator.lastActionTimestamp}
          </span>
        </div>
      </div>
    </div>
  );
}
