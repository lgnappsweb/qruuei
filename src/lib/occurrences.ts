import { 
  HeartPulse, Shield, Milestone, Hash, Car, Wrench, Flame, Building, AlertTriangle, 
  Siren, Ambulance, Biohazard, Skull, Radiation, Tornado, Wind, Waves, Ship, Plane, 
  TowerControl, Factory, Unplug, Trees, MountainSnow 
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Occurrence = {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
};

export const occurrences: Occurrence[] = [
  { id: '1', title: 'QUD RESGATE', icon: HeartPulse, color: 'bg-rose-500' },
  { id: '2', title: 'QUD OPERAÇÃO', icon: Shield, color: 'bg-blue-500' },
  { id: '3', title: 'TRAÇADO DE PISTA', icon: Milestone, color: 'bg-green-500' },
  { id: '4', title: 'Ocorrência 4', icon: Car, color: 'bg-yellow-500' },
  { id: '5', title: 'Ocorrência 5', icon: Wrench, color: 'bg-indigo-500' },
  { id: '6', title: 'Ocorrência 6', icon: Flame, color: 'bg-purple-500' },
  { id: '7', title: 'Ocorrência 7', icon: Building, color: 'bg-pink-500' },
  { id: '8', title: 'Ocorrência 8', icon: AlertTriangle, color: 'bg-orange-500' },
  { id: '9', title: 'Ocorrência 9', icon: Siren, color: 'bg-teal-500' },
  { id: '10', title: 'Ocorrência 10', icon: Ambulance, color: 'bg-cyan-500' },
  { id: '11', title: 'Ocorrência 11', icon: Biohazard, color: 'bg-red-600' },
  { id: '12', title: 'Ocorrência 12', icon: Skull, color: 'bg-sky-500' },
  { id: '13', title: 'Ocorrência 13', icon: Radiation, color: 'bg-rose-500' },
  { id: '14', title: 'Ocorrência 14', icon: Tornado, color: 'bg-blue-500' },
  { id: '15', title: 'Ocorrência 15', icon: Wind, color: 'bg-green-500' },
  { id: '16', title: 'Ocorrência 16', icon: Waves, color: 'bg-yellow-500' },
  { id: '17', title: 'Ocorrência 17', icon: Ship, color: 'bg-indigo-500' },
  { id: '18', title: 'Ocorrência 18', icon: Plane, color: 'bg-purple-500' },
  { id: '19', title: 'Ocorrência 19', icon: TowerControl, color: 'bg-pink-500' },
  { id: '20', title: 'Ocorrência 20', icon: Factory, color: 'bg-orange-500' },
  { id: '21', title: 'Ocorrência 21', icon: Unplug, color: 'bg-teal-500' },
  { id: '22', title: 'Ocorrência 22', icon: Trees, color: 'bg-cyan-500' },
  { id: '23', title: 'Ocorrência 23', icon: MountainSnow, color: 'bg-red-600' },
  { id: '24', title: 'Ocorrência 24', icon: Hash, color: 'bg-sky-500' },
];
