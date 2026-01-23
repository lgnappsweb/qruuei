import { 
  LifeBuoy, Megaphone, Milestone, Truck, FlameKindling, Users, Car, Cone, HardHat, Shield, 
  HeartPulse, Search, Heart, User, Siren, Link, Ban, Droplet, Trees, Send, Anchor, Wrench,
  Ambulance
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type Occurrence = {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
};

export const occurrences: Occurrence[] = [
  { id: '1', title: 'QUD RESGATE', icon: Ambulance, color: 'bg-rose-500' },
  { id: '2', title: 'QUD OPERAÇÃO', icon: Megaphone, color: 'bg-blue-500' },
  { id: '3', title: 'TRAÇADO DE PISTA', icon: Milestone, color: 'bg-green-500' },
  { id: '4', title: 'TO 01', icon: Truck, color: 'bg-yellow-500' },
  { id: '5', title: 'TO 02', icon: FlameKindling, color: 'bg-indigo-500' },
  { id: '6', title: 'TO 03', icon: Users, color: 'bg-purple-500' },
  { id: '7', title: 'TO 04', icon: Car, color: 'bg-pink-500' },
  { id: '8', title: 'TO 05', icon: Ambulance, color: 'bg-orange-500' },
  { id: '9', title: 'TO 06', icon: Truck, color: 'bg-teal-500' },
  { id: '10', title: 'TO 07', icon: Cone, color: 'bg-cyan-500' },
  { id: '11', title: 'TO 09', icon: HardHat, color: 'bg-red-600' },
  { id: '12', title: 'TO 11', icon: Shield, color: 'bg-sky-500' },
  { id: '13', title: 'TO 12', icon: HeartPulse, color: 'bg-rose-500' },
  { id: '14', title: 'TO 15', icon: Search, color: 'bg-blue-500' },
  { id: '15', title: 'TO 16', icon: Heart, color: 'bg-green-500' },
  { id: '16', title: 'TO 17', icon: User, color: 'bg-yellow-500' },
  { id: '17', title: 'TO 19', icon: Siren, color: 'bg-indigo-500' },
  { id: '18', title: 'TO 33', icon: Link, color: 'bg-purple-500' },
  { id: '19', title: 'TO 34', icon: Ban, color: 'bg-pink-500' },
  { id: '20', title: 'TO 35', icon: Droplet, color: 'bg-orange-500' },
  { id: '21', title: 'TO 37', icon: Trees, color: 'bg-teal-500' },
  { id: '22', title: 'TO 38', icon: Send, color: 'bg-cyan-500' },
  { id: '23', title: 'TO 39', icon: Anchor, color: 'bg-red-600' },
  { id: '24', title: 'TO 50', icon: Wrench, color: 'bg-sky-500' },
];
