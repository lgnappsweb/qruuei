import * as React from 'react';
import { 
  LifeBuoy, Megaphone, Route, Truck, PawPrint, Car, HardHat, Shield, 
  HeartPulse, Search, Heart, User, Siren, Shovel, Droplet, Send, Anchor, Wrench,
  Ambulance, Flame, Target, Signpost
} from 'lucide-react';
import type { LucideIcon, LucideProps } from 'lucide-react';

const TireIcon = (props: LucideProps) => (
  React.createElement('svg', {
    ...props,
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
  }, 
  React.createElement('circle', { cx: "12", cy: "12", r: "10" }),
  React.createElement('circle', { cx: "12", cy: "12", r: "4" }),
  React.createElement('path', { d: "M12 2v2" }),
  React.createElement('path', { d: "M12 20v2" }),
  React.createElement('path', { d: "m4.93 4.93 1.41 1.41" }),
  React.createElement('path', { d: "m17.66 17.66 1.41 1.41" }),
  React.createElement('path', { d: "M2 12h2" }),
  React.createElement('path', { d: "M20 12h2" }),
  React.createElement('path', { d: "m4.93 19.07 1.41-1.41" }),
  React.createElement('path', { d: "m17.66 6.34 1.41-1.41" })
))


export type Occurrence = {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
};

export const occurrences: Occurrence[] = [
  { id: '1', title: 'QUD RESGATE', icon: Ambulance, color: 'bg-rose-500' },
  { id: '2', title: 'QUD OPERAÇÃO', icon: Siren, color: 'bg-blue-500' },
  { id: '3', title: 'TRAÇADO DE PISTA', icon: Route, color: 'bg-green-500' },
  { id: '4', title: 'TO 01', icon: Truck, color: 'bg-yellow-500' },
  { id: '5', title: 'TO 02', icon: Flame, color: 'bg-indigo-500' },
  { id: '6', title: 'TO 03', icon: PawPrint, color: 'bg-purple-500' },
  { id: '7', title: 'TO 04', icon: Car, color: 'bg-pink-500' },
  { id: '8', title: 'TO 05', icon: Flame, color: 'bg-orange-500' },
  { id: '9', title: 'TO 06', icon: Truck, color: 'bg-teal-500' },
  { id: '10', title: 'TO 07', icon: TireIcon, color: 'bg-cyan-500' },
  { id: '11', title: 'TO 09', icon: HardHat, color: 'bg-red-600' },
  { id: '12', title: 'TO 11', icon: Shield, color: 'bg-sky-500' },
  { id: '13', title: 'TO 12', icon: HeartPulse, color: 'bg-rose-500' },
  { id: '14', title: 'TO 15', icon: Search, color: 'bg-blue-500' },
  { id: '15', title: 'TO 16', icon: Heart, color: 'bg-green-500' },
  { id: '16', title: 'TO 17', icon: User, color: 'bg-yellow-500' },
  { id: '17', title: 'TO 19', icon: Siren, color: 'bg-indigo-500' },
  { id: '18', title: 'TO 33', icon: Shovel, color: 'bg-purple-500' },
  { id: '19', title: 'TO 34', icon: Target, color: 'bg-pink-500' },
  { id: '20', title: 'TO 35', icon: Droplet, color: 'bg-orange-500' },
  { id: '21', title: 'TO 37', icon: Signpost, color: 'bg-teal-500' },
  { id: '22', title: 'TO 38', icon: Megaphone, color: 'bg-cyan-500' },
  { id: '23', 'title': 'TO 39', icon: Anchor, color: 'bg-red-600' },
  { id: '24', title: 'TO 50', icon: Wrench, color: 'bg-sky-500' },
];
