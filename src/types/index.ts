export type WasteCategory =
  | 'Kaca'
  | 'Kardus'
  | 'Kertas'
  | 'Logam'
  | 'Organik'
  | 'Plastik';

export type BinAlertStatus = 'Aman' | 'Hampir Penuh' | 'Penuh!';

export type SystemMode = 'AUTO' | 'MANUAL';

export interface BoundingBox {
  x: number;      // percentage (0-100)
  y: number;      // percentage (0-100)
  width: number;  // percentage (0-100)
  height: number; // percentage (0-100)
}

export interface DetectionEvent {
  id: string;
  category: WasteCategory;
  englishName: string;
  confidence: number; // 0 - 100
  timestamp: string;
  bbox: BoundingBox;
  itemName: string;
}

export interface BinStatus {
  id: WasteCategory;
  name: string;
  englishName: string;
  iconName: string;
  capacityPercent: number; // 0 - 100
  itemCount: number;
  maxItems: number;
  status: BinAlertStatus;
  color: string;
  bgRgba: string;
  borderColor: string;
}

export type ActuatorState =
  | 'Standby'
  | 'Diverting to Bin: Kaca'
  | 'Diverting to Bin: Kardus'
  | 'Diverting to Bin: Kertas'
  | 'Diverting to Bin: Logam'
  | 'Diverting to Bin: Organik'
  | 'Diverting to Bin: Plastik'
  | 'Idle'
  | 'Emergency Stopped';

export interface ActuatorInfo {
  state: ActuatorState;
  activeTargetBin: WasteCategory | null;
  servoAngle: number; // -75 to 75 deg
  conveyorSpeed: number; // cm/s
  lastActionTimestamp: string;
  cycleCount: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  category: WasteCategory;
  confidence: number;
  targetBin: string;
  status: 'Sorted' | 'Diverted' | 'Manual Override';
  itemName: string;
}

export interface SystemTelemetry {
  isOnline: boolean;
  latencyMs: number;
  fps: number;
  mode: SystemMode;
  isEmergencyStopped: boolean;
  totalSortedToday: number;
  throughputPerHour: number;
  dominantCategory: WasteCategory;
  dominantPercentage: number;
  uptimeSeconds: number;
}
