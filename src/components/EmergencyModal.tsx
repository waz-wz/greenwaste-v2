'use client';

import React from 'react';
import { AlertTriangle, Power, RotateCcw, X, ShieldAlert } from 'lucide-react';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmStop: () => void;
}

export function EmergencyModal({
  isOpen,
  onClose,
  onConfirmStop,
}: EmergencyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-dark-card border-2 border-red-500/80 p-6 shadow-2xl shadow-red-500/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-wider">
              Konfirmasi Emergency Stop
            </h3>
            <p className="text-xs text-red-300 font-mono">
              Prosedur Keamanan Pemutus Daya Fisik IoT
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-6 leading-relaxed">
          Tindakan ini akan <strong>menghentikan seketika</strong> motor conveyor belt,
          mengunci aktuator servo pneumatic ke posisi netral aman, dan mematikan stream
          inferensi otomatis demi keselamatan operasional.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmStop();
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/40 border border-red-400 active:scale-95 transition-all"
          >
            <Power className="w-4 h-4" />
            <span>AKTIFKAN E-STOP</span>
          </button>
        </div>
      </div>
    </div>
  );
}
