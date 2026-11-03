'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  WasteCategory,
  BinStatus,
  DetectionEvent,
  ActuatorInfo,
  SystemTelemetry,
  SystemMode,
} from '@/types';
import { WASTE_CATEGORIES, INITIAL_BINS } from '@/constants/wasteConfig';

const CATEGORY_KEYS: WasteCategory[] = ['Kaca', 'Kardus', 'Kertas', 'Logam', 'Organik', 'Plastik'];

export function useWasteSimulation() {
  const [mode, setMode] = useState<SystemMode>('AUTO');
  const [isEmergencyStopped, setIsEmergencyStopped] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [userConveyorSpeed, setUserConveyorSpeed] = useState<number>(25); // cm/s

  // System telemetry
  const [telemetry, setTelemetry] = useState<SystemTelemetry>({
    isOnline: true,
    latencyMs: 14,
    fps: 29,
    mode: 'AUTO',
    isEmergencyStopped: false,
    totalSortedToday: 514,
    throughputPerHour: 142,
    dominantCategory: 'Plastik',
    dominantPercentage: 36,
    uptimeSeconds: 14520,
  });

  // Bins state
  const [bins, setBins] = useState<BinStatus[]>(INITIAL_BINS);

  // Actuator state
  const [actuator, setActuator] = useState<ActuatorInfo>({
    state: 'Standby',
    activeTargetBin: null,
    servoAngle: 0,
    conveyorSpeed: 25,
    lastActionTimestamp: '10:50:12',
    cycleCount: 514,
  });

  // Real-Time Detection
  const [currentDetection, setCurrentDetection] = useState<DetectionEvent | null>({
    id: 'DET-5142',
    category: 'Plastik',
    englishName: 'Plastic',
    confidence: 96,
    timestamp: '10:50:35',
    bbox: { x: 38, y: 35, width: 24, height: 32 },
    itemName: 'Botol Air Mineral PET 600ml',
  });

  const timeoutActionRef = useRef<NodeJS.Timeout | null>(null);

  // Recalculate dominant category
  const updateDominantCategory = (currentBins: BinStatus[], total: number) => {
    let maxBin = currentBins[0];
    for (const b of currentBins) {
      if (b.itemCount > maxBin.itemCount) {
        maxBin = b;
      }
    }
    const dominantPct = total > 0 ? Math.round((maxBin.itemCount / total) * 100) : 0;
    return {
      dominantCategory: maxBin.id,
      dominantPercentage: dominantPct,
    };
  };

  // Sync conveyor speed to actuator
  useEffect(() => {
    setActuator((prev) => ({
      ...prev,
      conveyorSpeed: isEmergencyStopped ? 0 : userConveyorSpeed,
    }));
  }, [userConveyorSpeed, isEmergencyStopped]);

  // Telemetry jitter (Latency & FPS)
  useEffect(() => {
    if (isEmergencyStopped) return;

    const jitterInterval = setInterval(() => {
      setTelemetry((prev) => ({
        ...prev,
        latencyMs: Math.floor(10 + Math.random() * 8),
        fps: Math.floor(27 + Math.random() * 4),
        uptimeSeconds: prev.uptimeSeconds + 1,
      }));
    }, 1500);

    return () => clearInterval(jitterInterval);
  }, [isEmergencyStopped]);

  // Execute sorting action
  const executeSortingAction = useCallback((category: WasteCategory) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const categoryMeta = WASTE_CATEGORIES[category];
    const targetAngle = categoryMeta.servoTargetAngle;

    // 1. Update Actuator
    setActuator((prev) => ({
      ...prev,
      state: `Diverting to Bin: ${category}`,
      activeTargetBin: category,
      servoAngle: targetAngle,
      lastActionTimestamp: timeStr,
      cycleCount: prev.cycleCount + 1,
    }));

    // 2. Update Bins
    setBins((prevBins) => {
      return prevBins.map((bin) => {
        if (bin.id === category) {
          const nextItems = bin.itemCount + 1;
          const nextCap = Math.min(100, Math.round((nextItems / bin.maxItems) * 100));
          const status = nextCap >= 95 ? 'Penuh!' : nextCap >= 80 ? 'Hampir Penuh' : 'Aman';
          return {
            ...bin,
            itemCount: nextItems,
            capacityPercent: nextCap,
            status,
          };
        }
        return bin;
      });
    });

    // 3. Update Telemetry
    setTelemetry((prev) => {
      const nextTotal = prev.totalSortedToday + 1;
      const dominantInfo = updateDominantCategory(bins, nextTotal);
      return {
        ...prev,
        totalSortedToday: nextTotal,
        dominantCategory: dominantInfo.dominantCategory,
        dominantPercentage: dominantInfo.dominantPercentage,
      };
    });

    // 4. Reset Actuator to Standby
    if (timeoutActionRef.current) clearTimeout(timeoutActionRef.current);
    timeoutActionRef.current = setTimeout(() => {
      setActuator((prev) => ({
        ...prev,
        state: 'Standby',
        activeTargetBin: null,
        servoAngle: 0,
      }));
    }, 1200);
  }, [bins]);

  // Main simulation loop
  useEffect(() => {
    if (mode !== 'AUTO' || isEmergencyStopped || isPaused || userConveyorSpeed <= 0) {
      return;
    }

    // Interval inversely proportional to conveyor speed
    const baseInterval = Math.max(1200, Math.round(75000 / userConveyorSpeed));

    const simInterval = setInterval(() => {
      const weights = [0.12, 0.15, 0.20, 0.10, 0.18, 0.25];
      const randomVal = Math.random();
      let sum = 0;
      let selectedCategory: WasteCategory = 'Plastik';
      for (let i = 0; i < weights.length; i++) {
        sum += weights[i];
        if (randomVal <= sum) {
          selectedCategory = CATEGORY_KEYS[i];
          break;
        }
      }

      const meta = WASTE_CATEGORIES[selectedCategory];
      const randomItem = meta.sampleItems[Math.floor(Math.random() * meta.sampleItems.length)];
      const confidence = Math.floor(90 + Math.random() * 9);
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      const bboxWidth = Math.floor(20 + Math.random() * 8);
      const bboxHeight = Math.floor(25 + Math.random() * 10);
      const bboxX = Math.floor(35 + (Math.random() * 12 - 6));
      const bboxY = Math.floor(34 + (Math.random() * 10 - 5));

      const detection: DetectionEvent = {
        id: `DET-${Math.floor(1000 + Math.random() * 9000)}`,
        category: selectedCategory,
        englishName: meta.englishName,
        confidence,
        timestamp: timeStr,
        bbox: {
          x: bboxX,
          y: bboxY,
          width: bboxWidth,
          height: bboxHeight,
        },
        itemName: randomItem.name,
      };

      setCurrentDetection(detection);

      setTimeout(() => {
        executeSortingAction(detection.category);
      }, 700);
    }, baseInterval);

    return () => clearInterval(simInterval);
  }, [mode, isEmergencyStopped, isPaused, userConveyorSpeed, executeSortingAction]);

  // Mode Toggle
  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === 'AUTO' ? 'MANUAL' : 'AUTO';
      setTelemetry((t) => ({ ...t, mode: next }));
      if (next === 'MANUAL') {
        setActuator((a) => ({ ...a, state: 'Idle', servoAngle: 0 }));
      } else {
        setActuator((a) => ({ ...a, state: 'Standby', servoAngle: 0 }));
      }
      return next;
    });
  };

  // Emergency Stop Trigger
  const triggerEmergencyStop = () => {
    setIsEmergencyStopped(true);
    setTelemetry((prev) => ({ ...prev, isEmergencyStopped: true }));
    setActuator((prev) => ({
      ...prev,
      state: 'Emergency Stopped',
      conveyorSpeed: 0,
      activeTargetBin: null,
    }));
  };

  // Emergency Reset
  const resetEmergencyStop = () => {
    setIsEmergencyStopped(false);
    setTelemetry((prev) => ({ ...prev, isEmergencyStopped: false }));
    setActuator((prev) => ({
      ...prev,
      state: mode === 'AUTO' ? 'Standby' : 'Idle',
      conveyorSpeed: userConveyorSpeed,
      servoAngle: 0,
    }));
  };

  // Manual Bin Action
  const manualTriggerBin = (category: WasteCategory) => {
    if (isEmergencyStopped) return;
    const meta = WASTE_CATEGORIES[category];
    const randomItem = meta.sampleItems[Math.floor(Math.random() * meta.sampleItems.length)];
    const confidence = 99;

    setCurrentDetection({
      id: `MAN-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      englishName: meta.englishName,
      confidence,
      timestamp: new Date().toTimeString().split(' ')[0],
      bbox: { x: 38, y: 35, width: 24, height: 30 },
      itemName: `[Manual] ${randomItem.name}`,
    });

    executeSortingAction(category);
  };

  // Empty Bin
  const emptyBin = (category: WasteCategory) => {
    setBins((prev) =>
      prev.map((b) =>
        b.id === category
          ? {
              ...b,
              capacityPercent: 0,
              itemCount: 0,
              status: 'Aman',
            }
          : b
      )
    );
  };

  return {
    mode,
    toggleMode,
    isEmergencyStopped,
    triggerEmergencyStop,
    resetEmergencyStop,
    isPaused,
    togglePause: () => setIsPaused((p) => !p),
    conveyorSpeed: userConveyorSpeed,
    setConveyorSpeed: setUserConveyorSpeed,
    telemetry,
    bins,
    emptyBin,
    actuator,
    currentDetection,
    manualTriggerBin,
  };
}
