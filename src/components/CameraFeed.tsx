'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Video, AlertCircle, RefreshCw } from 'lucide-react';
import { DetectionEvent } from '@/types';
import { WASTE_CATEGORIES } from '@/constants/wasteConfig';
import { WasteIcon } from './WasteIcon';
import { cn } from '@/lib/utils';

interface CameraFeedProps {
  currentDetection: DetectionEvent | null;
  isEmergencyStopped: boolean;
  conveyorSpeed: number;
}

export function CameraFeed({
  currentDetection,
  isEmergencyStopped,
  conveyorSpeed,
}: CameraFeedProps) {
  const [sourceMode, setSourceMode] = useState<'sim' | 'webcam'>('sim');
  const [webcamError, setWebcamError] = useState<string | null>(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const categoryMeta = currentDetection
    ? WASTE_CATEGORIES[currentDetection.category]
    : null;

  // Handle webcam stream start/stop
  useEffect(() => {
    if (sourceMode === 'webcam') {
      startWebcam();
    } else {
      stopWebcam();
    }

    return () => {
      stopWebcam();
    };
  }, [sourceMode]);

  const startWebcam = async () => {
    setWebcamError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser tidak mendukung akses kamera.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setIsWebcamActive(true);
    } catch (err: any) {
      console.error('Gagal mengakses kamera laptop:', err);
      setWebcamError(err.message || 'Izin kamera ditolak atau kamera tidak ditemukan.');
      setIsWebcamActive(false);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-lg">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-white">Monitoring Kamera</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">YOLOv8 AI</span>
        </div>

        {/* Source Toggle: Simulasi vs Kamera Laptop */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
          <button
            type="button"
            onClick={() => setSourceMode('sim')}
            className={cn(
              'px-2 py-1 rounded-md text-[11px] font-medium transition-all',
              sourceMode === 'sim'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            )}
          >
            Simulasi IoT
          </button>
          <button
            type="button"
            onClick={() => setSourceMode('webcam')}
            className={cn(
              'flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-all',
              sourceMode === 'webcam'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            )}
          >
            <Video className="w-3 h-3" />
            <span>Kamera Laptop</span>
          </button>
        </div>
      </div>

      {/* 16:9 Viewport */}
      <div className="relative w-full aspect-video bg-[#080d16] overflow-hidden select-none">
        {sourceMode === 'webcam' ? (
          /* Live Webcam View */
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={cn(
                'w-full h-full object-cover',
                !isWebcamActive && 'hidden'
              )}
            />

            {/* Webcam Error / Permission fallback */}
            {webcamError && (
              <div className="p-4 text-center text-xs text-rose-300 max-w-xs flex flex-col items-center">
                <AlertCircle className="w-8 h-8 text-rose-400 mb-2" />
                <p className="font-semibold">{webcamError}</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Pastikan browser memiliki izin mengakses webcam Anda.
                </p>
                <button
                  onClick={startWebcam}
                  className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium"
                >
                  <RefreshCw className="w-3 h-3" />
                  Coba Lagi
                </button>
              </div>
            )}

            {!webcamError && !isWebcamActive && (
              <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                Menghubungkan ke kamera laptop...
              </div>
            )}
          </div>
        ) : (
          /* Simulated Conveyor View */
          <div className="absolute inset-0 flex flex-col justify-between">
            <div className="h-4 bg-slate-800/40 border-b border-slate-800" />

            <div className="relative flex-1 flex items-center justify-center">
              <div className="w-full h-32 bg-slate-900/60 border-y border-slate-800/80 relative flex items-center justify-center">
                {/* Conveyor animation */}
                <div
                  className={cn(
                    'absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,transparent_85%,rgba(255,255,255,0.03)_85%,rgba(255,255,255,0.03)_100%)] bg-[length:40px_100%]',
                    conveyorSpeed > 0 && !isEmergencyStopped && 'animate-conveyor'
                  )}
                />

                <span className="text-slate-700 font-mono text-xs font-semibold tracking-widest pointer-events-none">
                  {conveyorSpeed > 0 ? 'CONVEYOR FLOW ➔➔➔' : 'CONVEYOR STOPPED'}
                </span>

                {/* Simulated Object Silhouette */}
                {currentDetection && !isEmergencyStopped && (
                  <div
                    className="absolute transition-all duration-300 ease-out flex items-center justify-center"
                    style={{
                      left: `${currentDetection.bbox.x}%`,
                      top: `${currentDetection.bbox.y}%`,
                      width: `${currentDetection.bbox.width}%`,
                      height: `${currentDetection.bbox.height}%`,
                    }}
                  >
                    <div
                      className="w-4/5 h-4/5 rounded-xl flex items-center justify-center transition-all"
                      style={{
                        backgroundColor: `${categoryMeta?.color}20`,
                        border: `1.5px dashed ${categoryMeta?.color}70`,
                      }}
                    >
                      <WasteIcon
                        category={currentDetection.category}
                        className="w-7 h-7"
                        style={{ color: categoryMeta?.color }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="h-4 bg-slate-800/40 border-t border-slate-800" />
          </div>
        )}

        {/* Real-Time Bounding Box Overlay (Active on both webcam and simulation) */}
        {currentDetection && !isEmergencyStopped && (
          <div
            className="absolute transition-all duration-300 ease-out pointer-events-none"
            style={{
              left: `${currentDetection.bbox.x}%`,
              top: `${currentDetection.bbox.y}%`,
              width: `${currentDetection.bbox.width}%`,
              height: `${currentDetection.bbox.height}%`,
            }}
          >
            <div
              className="w-full h-full relative rounded-lg border-2 transition-all shadow-md"
              style={{
                borderColor: categoryMeta?.color || '#06b6d4',
              }}
            >
              {/* Floating Label Badge (No weight) */}
              <div
                className="absolute -top-7 left-0 flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold text-white shadow-md whitespace-nowrap"
                style={{
                  backgroundColor: categoryMeta?.color || '#06b6d4',
                }}
              >
                <WasteIcon
                  category={currentDetection.category}
                  className="w-3.5 h-3.5 text-white"
                />
                <span>
                  {currentDetection.category} • {currentDetection.confidence}%
                </span>
              </div>

              {/* Item name pill underneath (without weight) */}
              <div className="absolute -bottom-6 left-0 px-2 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] text-slate-200 whitespace-nowrap shadow-sm">
                {currentDetection.itemName}
              </div>
            </div>
          </div>
        )}

        {/* Emergency Stop Overlay */}
        {isEmergencyStopped && (
          <div className="absolute inset-0 bg-red-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-20">
            <AlertCircle className="w-10 h-10 text-red-400 mb-2" />
            <h3 className="text-lg font-bold text-white uppercase tracking-wide">
              EMERGENCY STOP AKTIF
            </h3>
            <p className="text-xs text-red-200 max-w-sm mt-1">
              Conveyor dan pemilahan otomatis dinonaktifkan demi keamanan.
            </p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>Mode Sumber:</span>
          <strong className="text-white">
            {sourceMode === 'webcam' ? 'Kamera Laptop (Live)' : 'Simulasi IoT Conveyor'}
          </strong>
        </div>

        <div className="flex items-center gap-1.5">
          <span>Objek Terdeteksi:</span>
          {currentDetection && !isEmergencyStopped ? (
            <span
              className="font-semibold px-2 py-0.5 rounded text-[11px]"
              style={{
                backgroundColor: `${categoryMeta?.color}20`,
                color: categoryMeta?.hexLight || categoryMeta?.color,
              }}
            >
              {currentDetection.category} ({currentDetection.confidence}%)
            </span>
          ) : (
            <span className="text-slate-500 italic">Menunggu item...</span>
          )}
        </div>
      </div>
    </div>
  );
}
