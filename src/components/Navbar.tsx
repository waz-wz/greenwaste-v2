'use client';

import React from 'react';
import Image from 'next/image';
import {
  Activity,
  SlidersHorizontal,
  Power,
  RotateCcw,
  Play,
  Pause,
} from 'lucide-react';
import { SystemTelemetry, SystemMode } from '@/types';
import { cn } from '@/lib/utils';

interface NavbarProps {
  telemetry: SystemTelemetry;
  mode: SystemMode;
  onToggleMode: () => void;
  isEmergencyStopped: boolean;
  onEmergencyStop: () => void;
  onResetEmergency: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
}

export function Navbar({
  telemetry,
  mode,
  onToggleMode,
  isEmergencyStopped,
  onEmergencyStop,
  onResetEmergency,
  isPaused,
  onTogglePause,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0d131f]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-emerald-500/10 flex-shrink-0 bg-emerald-500">
            <Image
              src="/logo.jpg"
              alt="GreenWaste Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-tight">
              GreenWaste
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Smart IoT Waste Sorting Dashboard
            </p>
          </div>
        </div>

        {/* Status IoT Metrics */}
        <div className="hidden md:flex items-center gap-2.5 text-xs">
          {/* Live Indicator */}
          <div
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors',
              isEmergencyStopped
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : 'bg-slate-900 border-slate-800 text-slate-300'
            )}
          >
            <span className="relative flex h-2 w-2">
              {!isEmergencyStopped && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={cn(
                  'relative inline-flex rounded-full h-2 w-2',
                  isEmergencyStopped ? 'bg-rose-500' : 'bg-emerald-400'
                )}
              />
            </span>
            <span>{isEmergencyStopped ? 'System Halted' : 'Device Online'}</span>
          </div>

          {/* Latency & FPS */}
          <div className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs">
            <span>
              Latency: <strong className="text-slate-200">{telemetry.latencyMs}ms</strong>
            </span>
            <span className="text-slate-700">•</span>
            <span>
              Camera: <strong className="text-slate-200">{telemetry.fps} FPS</strong>
            </span>
          </div>

          {/* Pause / Play simulation */}
          <button
            onClick={onTogglePause}
            title={isPaused ? 'Lanjutkan Simulasi' : 'Jeda Simulasi'}
            className={cn(
              'p-2 rounded-full border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-colors',
              isPaused && 'text-amber-400 border-amber-500/40 bg-amber-500/10'
            )}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Controls: Mode Toggle & E-Stop */}
        <div className="flex items-center gap-3">
          {/* Simple Mode Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => mode !== 'AUTO' && onToggleMode()}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all',
                mode === 'AUTO'
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Auto</span>
            </button>
            <button
              type="button"
              onClick={() => mode !== 'MANUAL' && onToggleMode()}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all',
                mode === 'MANUAL'
                  ? 'bg-amber-600 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              )}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Manual</span>
            </button>
          </div>

          {/* Emergency Stop Button */}
          {isEmergencyStopped ? (
            <button
              type="button"
              onClick={onResetEmergency}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset E-Stop</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onEmergencyStop}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/20 transition-all active:scale-95"
            >
              <Power className="w-3.5 h-3.5" />
              <span>E-Stop</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
