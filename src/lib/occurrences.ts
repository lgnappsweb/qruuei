import * as React from 'react';
import { 
  Megaphone, Route, Truck, PawPrint, Car, HardHat, Shield, 
  HeartPulse, Search, Heart, User, Siren, Shovel, Droplet, Anchor, Wrench,
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
  )
);
TireIcon.displayName = 'TireIcon';

const TractorIcon = (props: LucideProps) => (
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
  React.createElement('path', { d: 'M12 2v3' }),
  React.createElement('path', { d: 'M4 12V8h5l2-2h3l2 2h4v4' }),
  React.createElement('path', { d: 'M4 12h16' }),
  React.createElement('circle', { cx: '6', cy: '16', r: '2' }),
  React.createElement('circle', { cx: '18', cy: '16', r: '4' }),
  React.createElement('path', { d: 'M8 16h8' })
  )
);
TractorIcon.displayName = 'TractorIcon';


export type Occurrence = {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  cardColor: string;
};

export const occurrences: Occurrence[] = [
  { id: '1', title: 'QUD RESGATE', icon: Ambulance, color: 'bg-red-200', cardColor: 'bg-red-100 dark:bg-red-800' },
  { id: '2', title: 'QUD OPERAÇÃO', icon: Siren, color: 'bg-blue-200', cardColor: 'bg-blue-100 dark:bg-blue-800' },
  { id: '3', title: 'TRAÇADO DE PISTA', icon: Route, color: 'bg-green-200', cardColor: 'bg-green-100 dark:bg-green-800' },
  { id: '4', title: 'TO 01', icon: Truck, color: 'bg-yellow-200', cardColor: 'bg-yellow-100 dark:bg-yellow-800' },
  { id: '5', title: 'TO 02', icon: Flame, color: 'bg-orange-200', cardColor: 'bg-orange-100 dark:bg-orange-800' },
  { id: '6', title: 'TO 03', icon: PawPrint, color: 'bg-purple-200', cardColor: 'bg-purple-100 dark:bg-purple-800' },
  { id: '7', title: 'TO 04', icon: Car, color: 'bg-pink-200', cardColor: 'bg-pink-100 dark:bg-pink-800' },
  { id: '8', title: 'TO 05', icon: Flame, color: 'bg-rose-200', cardColor: 'bg-rose-100 dark:bg-rose-800' },
  { id: '9', title: 'TO 06', icon: Truck, color: 'bg-teal-200', cardColor: 'bg-teal-100 dark:bg-teal-800' },
  { id: '10', title: 'TO 07', icon: TireIcon, color: 'bg-cyan-200', cardColor: 'bg-cyan-100 dark:bg-cyan-800' },
  { id: '11', title: 'TO 09', icon: HardHat, color: 'bg-amber-200', cardColor: 'bg-amber-100 dark:bg-amber-800' },
  { id: '12', title: 'TO 11', icon: Shield, color: 'bg-sky-200', cardColor: 'bg-sky-100 dark:bg-sky-800' },
  { id: '13', title: 'TO 12', icon: HeartPulse, color: 'bg-indigo-200', cardColor: 'bg-indigo-100 dark:bg-indigo-800' },
  { id: '14', title: 'TO 15', icon: Search, color: 'bg-violet-200', cardColor: 'bg-violet-100 dark:bg-violet-800' },
  { id: '15', title: 'TO 16', icon: Heart, color: 'bg-lime-200', cardColor: 'bg-lime-100 dark:bg-lime-800' },
  { id: '16', title: 'TO 17', icon: User, color: 'bg-emerald-200', cardColor: 'bg-emerald-100 dark:bg-emerald-800' },
  { id: '17', title: 'TO 19', icon: Siren, color: 'bg-fuchsia-200', cardColor: 'bg-fuchsia-100 dark:bg-fuchsia-800' },
  { id: '18', title: 'TO 32', icon: TractorIcon, color: 'bg-stone-300', cardColor: 'bg-stone-200 dark:bg-stone-800' },
  { id: '19', title: 'TO 33', icon: Shovel, color: 'bg-slate-300', cardColor: 'bg-slate-200 dark:bg-slate-800' },
  { id: '20', title: 'TO 34', icon: Target, color: 'bg-gray-300', cardColor: 'bg-gray-200 dark:bg-gray-800' },
  { id: '21', title: 'TO 35', icon: Droplet, color: 'bg-zinc-300', cardColor: 'bg-zinc-200 dark:bg-zinc-800' },
  { id: '22', title: 'TO 37', icon: Signpost, color: 'bg-neutral-300', cardColor: 'bg-neutral-200 dark:bg-neutral-800' },
  { id: '23', title: 'TO 38', icon: Megaphone, color: 'bg-red-300', cardColor: 'bg-red-200 dark:bg-red-800' },
  { id: '24', title: 'TO 39', icon: Anchor, color: 'bg-blue-300', cardColor: 'bg-blue-200 dark:bg-blue-800' },
  { id: '25', title: 'TO 50', icon: Wrench, color: 'bg-green-300', cardColor: 'bg-green-200 dark:bg-green-800' },
];
