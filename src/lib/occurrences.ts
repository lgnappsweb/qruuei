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
  { id: '4', title: 'TO 01', icon: Hash, color: 'bg-yellow-500' },
  { id: '5', title: 'TO 02', icon: Car, color: 'bg-indigo-500' },
  { id: '6', title: 'TO 03', icon: Wrench, color: 'bg-purple-500' },
  { id: '7', title: 'TO 04', icon: Flame, color: 'bg-pink-500' },
  { id: '8', title: 'TO 05', icon: Building, color: 'bg-orange-500' },
  { id: '9', title: 'TO 06', icon: AlertTriangle, color: 'bg-teal-500' },
  { id: '10', title: 'TO 07', icon: Siren, color: 'bg-cyan-500' },
  { id: '11', title: 'TO 09', icon: Ambulance, color: 'bg-red-600' },
  { id: '12', title: 'TO 11', icon: Biohazard, color: 'bg-sky-500' },
  { id: '13', title: 'TO 12', icon: Skull, color: 'bg-rose-500' },
  { id: '14', title: 'TO 15', icon: Radiation, color: 'bg-blue-500' },
  { id: '15', title: 'TO 16', icon: Tornado, color: 'bg-green-500' },
  { id: '16', title: 'TO 17', icon: Wind, color: 'bg-yellow-500' },
  { id: '17', title: 'TO 19', icon: Waves, color: 'bg-indigo-500' },
  { id: '18', title: 'TO 33', icon: Ship, color: 'bg-purple-500' },
  { id: '19', title: 'TO 34', icon: Plane, color: 'bg-pink-500' },
  { id: '20', title: 'TO 35', icon: TowerControl, color: 'bg-orange-500' },
  { id: '21', title: 'TO 37', icon: Factory, color: 'bg-teal-500' },
  { id: '22', title: 'TO 38', icon: Unplug, color: 'bg-cyan-500' },
  { id: '23', title: 'TO 39', icon: Trees, color: 'bg-red-600' },
  { id: '24', title: 'TO 50', icon: MountainSnow, color: 'bg-sky-500' },
];
