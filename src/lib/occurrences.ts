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
  { id: '2', title: 'QUD OPERAÇÃO', icon: Shield, color: 'bg-sky-500' },
  { id: '3', title: 'TRAÇADO DE PISTA', icon: Milestone, color: 'bg-amber-500' },
  { id: '4', title: 'ACIDENTE DE TRÂNSITO', icon: Car, color: 'bg-indigo-500' },
  { id: '5', title: 'APOIO MECÂNICO', icon: Wrench, color: 'bg-slate-500' },
  { id: '6', title: 'INCÊNDIO', icon: Flame, color: 'bg-red-600' },
  { id: '7', title: 'APOIO PREDIAL', icon: Building, color: 'bg-orange-500' },
  { id: '8', title: 'RISCO GERAL', icon: AlertTriangle, color: 'bg-yellow-500' },
  { id: '9', title: 'TO 01', icon: Hash, color: 'bg-emerald-500' },
  { id: '10', title: 'TO 02', icon: Hash, color: 'bg-emerald-500' },
  { id: '11', title: 'TO 03', icon: Hash, color: 'bg-emerald-500' },
  { id: '12', title: 'TO 04', icon: Hash, color: 'bg-emerald-500' },
  { id: '13', title: 'TO 05', icon: Hash, color: 'bg-teal-500' },
  { id: '14', title: 'TO 06', icon: Hash, color: 'bg-teal-500' },
  { id: '15', title: 'TO 07', icon: Hash, color: 'bg-teal-500' },
  { id: '16', title: 'TO 08', icon: Hash, color: 'bg-teal-500' },
];
