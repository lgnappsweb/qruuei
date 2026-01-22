import { HeartPulse, Shield, Milestone, Hash, Car, Wrench, Flame, Building, AlertTriangle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Occurrence = {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
};

export const occurrences: Occurrence[] = [
  { id: '1', title: 'QUD RESGATE', icon: HeartPulse, color: 'bg-rose-500' },
];
