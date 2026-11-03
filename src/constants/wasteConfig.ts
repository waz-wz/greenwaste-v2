import { WasteCategory, BinStatus } from '@/types';

export interface CategoryMetadata {
  id: WasteCategory;
  name: string;
  englishName: string;
  color: string;         // Hex code
  textColor: string;     // Tailwind text class
  bgColor: string;       // Tailwind bg class with opacity
  borderColor: string;   // Tailwind border class
  glowColor: string;     // Tailwind shadow/glow
  hexLight: string;
  servoTargetAngle: number; // Angle for the IoT diverter arm (-75 to +75 deg)
  sampleItems: { name: string }[];
}

export const WASTE_CATEGORIES: Record<WasteCategory, CategoryMetadata> = {
  Kaca: {
    id: 'Kaca',
    name: 'Kaca',
    englishName: 'Glass',
    color: '#06b6d4', // cyan-500
    textColor: 'text-cyan-400',
    bgColor: 'bg-cyan-500/15',
    borderColor: 'border-cyan-500/40',
    glowColor: 'shadow-cyan-500/20',
    hexLight: '#22d3ee',
    servoTargetAngle: -60,
    sampleItems: [
      { name: 'Botol Sirup Kaca' },
      { name: 'Pecahan Gelas Bening' },
      { name: 'Toples Selai Kaca' },
      { name: 'Botol Parfum Kaca' },
    ],
  },
  Kardus: {
    id: 'Kardus',
    name: 'Kardus',
    englishName: 'Cardboard',
    color: '#d97706', // amber-700 / orange-600
    textColor: 'text-amber-500',
    bgColor: 'bg-amber-600/15',
    borderColor: 'border-amber-600/40',
    glowColor: 'shadow-amber-600/20',
    hexLight: '#f59e0b',
    servoTargetAngle: -35,
    sampleItems: [
      { name: 'Kardus Paket E-Commerce' },
      { name: 'Kotak Pizza Bekas' },
      { name: 'Karton Kemasan Makanan' },
      { name: 'Potongan Lembaran Kardus' },
    ],
  },
  Kertas: {
    id: 'Kertas',
    name: 'Kertas',
    englishName: 'Paper',
    color: '#0ea5e9', // sky-500
    textColor: 'text-sky-400',
    bgColor: 'bg-sky-500/15',
    borderColor: 'border-sky-500/40',
    glowColor: 'shadow-sky-500/20',
    hexLight: '#38bdf8',
    servoTargetAngle: -10,
    sampleItems: [
      { name: 'Kertas HVS Bekas Print' },
      { name: 'Majalah / Tabloid Lama' },
      { name: 'Koran Harian Lipat' },
      { name: 'Amplop Surat Cokelat' },
    ],
  },
  Logam: {
    id: 'Logam',
    name: 'Logam',
    englishName: 'Metal',
    color: '#64748b', // slate-500
    textColor: 'text-slate-300',
    bgColor: 'bg-slate-500/20',
    borderColor: 'border-slate-400/40',
    glowColor: 'shadow-slate-400/20',
    hexLight: '#94a3b8',
    servoTargetAngle: 15,
    sampleItems: [
      { name: 'Kaleng Minuman Soda' },
      { name: 'Kaleng Biskuit Logam' },
      { name: 'Tutup Botol Logam' },
      { name: 'Kaleng Sarden Bekas' },
    ],
  },
  Organik: {
    id: 'Organik',
    name: 'Organik',
    englishName: 'Organic',
    color: '#10b981', // emerald-500
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/15',
    borderColor: 'border-emerald-500/40',
    glowColor: 'shadow-emerald-500/20',
    hexLight: '#34d399',
    servoTargetAngle: 40,
    sampleItems: [
      { name: 'Sisa Kulit Pisang' },
      { name: 'Apel / Sisa Buah Busuk' },
      { name: 'Daun & Ranting Kering' },
      { name: 'Ampas Sayur Segar' },
    ],
  },
  Plastik: {
    id: 'Plastik',
    name: 'Plastik',
    englishName: 'Plastic',
    color: '#f59e0b', // amber-500
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-500/15',
    borderColor: 'border-amber-500/40',
    glowColor: 'shadow-amber-500/20',
    hexLight: '#fbbf24',
    servoTargetAngle: 65,
    sampleItems: [
      { name: 'Botol Air Mineral PET 600ml' },
      { name: 'Gelas Cup Plastik Boba' },
      { name: 'Kantong Plastik Kresek' },
      { name: 'Wadah Makanan Mika' },
    ],
  },
};

export const INITIAL_BINS: BinStatus[] = [
  {
    id: 'Kaca',
    name: 'Kaca',
    englishName: 'Glass',
    iconName: 'Wine',
    capacityPercent: 42,
    itemCount: 42,
    maxItems: 100,
    status: 'Aman',
    color: '#06b6d4',
    bgRgba: 'rgba(6, 182, 212, 0.12)',
    borderColor: 'rgba(6, 182, 212, 0.35)',
  },
  {
    id: 'Kardus',
    name: 'Kardus',
    englishName: 'Cardboard',
    iconName: 'Box',
    capacityPercent: 58,
    itemCount: 58,
    maxItems: 100,
    status: 'Aman',
    color: '#d97706',
    bgRgba: 'rgba(217, 119, 6, 0.12)',
    borderColor: 'rgba(217, 119, 6, 0.35)',
  },
  {
    id: 'Kertas',
    name: 'Kertas',
    englishName: 'Paper',
    iconName: 'FileText',
    capacityPercent: 82,
    itemCount: 123,
    maxItems: 150,
    status: 'Hampir Penuh',
    color: '#0ea5e9',
    bgRgba: 'rgba(14, 165, 233, 0.12)',
    borderColor: 'rgba(14, 165, 233, 0.35)',
  },
  {
    id: 'Logam',
    name: 'Logam',
    englishName: 'Metal',
    iconName: 'Shield',
    capacityPercent: 35,
    itemCount: 35,
    maxItems: 100,
    status: 'Aman',
    color: '#64748b',
    bgRgba: 'rgba(100, 116, 139, 0.15)',
    borderColor: 'rgba(100, 116, 139, 0.35)',
  },
  {
    id: 'Organik',
    name: 'Organik',
    englishName: 'Organic',
    iconName: 'Sprout',
    capacityPercent: 48,
    itemCount: 72,
    maxItems: 150,
    status: 'Aman',
    color: '#10b981',
    bgRgba: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  {
    id: 'Plastik',
    name: 'Plastik',
    englishName: 'Plastic',
    iconName: 'Recycle',
    capacityPercent: 92,
    itemCount: 184,
    maxItems: 200,
    status: 'Hampir Penuh',
    color: '#f59e0b',
    bgRgba: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
];
