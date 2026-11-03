import React from 'react';
import {
  Wine,
  Package,
  FileText,
  Shield,
  Sprout,
  Recycle,
  Trash2,
  LucideProps,
} from 'lucide-react';
import { WasteCategory } from '@/types';

interface WasteIconProps extends LucideProps {
  category?: WasteCategory | string | null;
}

export function WasteIcon({ category, ...props }: WasteIconProps) {
  switch (category) {
    case 'Kaca':
    case 'Wine':
    case 'Glass':
      return <Wine {...props} />;
    case 'Kardus':
    case 'Box':
    case 'Cardboard':
      return <Package {...props} />;
    case 'Kertas':
    case 'FileText':
    case 'Paper':
      return <FileText {...props} />;
    case 'Logam':
    case 'Shield':
    case 'Metal':
      return <Shield {...props} />;
    case 'Organik':
    case 'Sprout':
    case 'Organic':
      return <Sprout {...props} />;
    case 'Plastik':
    case 'Recycle':
    case 'Plastic':
      return <Recycle {...props} />;
    default:
      return <Trash2 {...props} />;
  }
}
