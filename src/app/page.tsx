'use client';

import React, { useState } from 'react';
import { useWasteSimulation } from '@/hooks/useWasteSimulation';
import { Navbar } from '@/components/Navbar';
import { CameraFeed } from '@/components/CameraFeed';
import { ActuatorCard } from '@/components/ActuatorCard';
import { ManualOverrideControls } from '@/components/ManualOverrideControls';
import { BinCapacityCards } from '@/components/BinCapacityCards';
import { TelemetrySummaryCard } from '@/components/TelemetrySummaryCard';
import { CompositionCharts } from '@/components/CompositionCharts';
import { EmergencyModal } from '@/components/EmergencyModal';

export default function DashboardPage() {
  const {
    mode,
    toggleMode,
    isEmergencyStopped,
    triggerEmergencyStop,
    resetEmergencyStop,
    isPaused,
    togglePause,
    conveyorSpeed,
    setConveyorSpeed,
    telemetry,
    bins,
    emptyBin,
    actuator,
    currentDetection,
    manualTriggerBin,
  } = useWasteSimulation();

  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0f18] text-slate-100 flex flex-col">
      {/* 1. Header / Navbar with Uploaded Logo */}
      <Navbar
        telemetry={telemetry}
        mode={mode}
        onToggleMode={toggleMode}
        isEmergencyStopped={isEmergencyStopped}
        onEmergencyStop={() => setIsEmergencyModalOpen(true)}
        onResetEmergency={resetEmergencyStop}
        isPaused={isPaused}
        onTogglePause={togglePause}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Grid: Camera & Controls (Left) + Bins & Charts (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Panel Kiri (5 Kolom) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Live Camera View with Laptop Camera Toggle */}
            <CameraFeed
              currentDetection={currentDetection}
              isEmergencyStopped={isEmergencyStopped}
              conveyorSpeed={conveyorSpeed}
            />

            {/* Actuator Status & Speed Control Slider */}
            <ActuatorCard
              actuator={actuator}
              isEmergencyStopped={isEmergencyStopped}
              onSpeedChange={setConveyorSpeed}
            />

            {/* 6 Manual Override Controls */}
            <ManualOverrideControls
              mode={mode}
              isEmergencyStopped={isEmergencyStopped}
              onTriggerBin={manualTriggerBin}
              activeDivertingBin={actuator.activeTargetBin}
            />
          </div>

          {/* Panel Kanan (7 Kolom) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Metrik Ringkasan Hari Ini */}
            <TelemetrySummaryCard telemetry={telemetry} bins={bins} />

            {/* 6 Cards Kapasitas Wadah (Tanpa Berat) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Kapasitas Wadah Sampah</h3>
                  <p className="text-xs text-slate-400">Level pengisian 6 kategori bin</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" /> Aman
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" /> &gt;80%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-400" /> &gt;95%
                  </span>
                </div>
              </div>

              <BinCapacityCards bins={bins} onEmptyBin={emptyBin} />
            </div>

            {/* Komposisi Sampah Terpilah (Recharts) */}
            <CompositionCharts bins={bins} />
          </div>
        </div>
      </main>

      {/* Emergency Stop Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        onConfirmStop={triggerEmergencyStop}
      />

      {/* Simple Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-6 text-center text-xs text-slate-500">
        GreenWaste • Smart Waste Sorting Dashboard &amp; IoT Control System
      </footer>
    </div>
  );
}
