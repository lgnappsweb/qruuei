import * as React from 'react';
import { 
  Megaphone, Route, Truck, PawPrint, Car, HardHat, Shield, 
  HeartPulse, Search, Heart, User, Siren, Shovel, Droplet, Anchor, Wrench,
  Ambulance, Flame, Target, Signpost, HelpCircle
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
};

export const occurrences: Occurrence[] = [
  { id: '1', title: 'QUD RESGATE', icon: Ambulance, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '2', title: 'QUD OPERAÇÃO', icon: Siren, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '3', title: 'TRAÇADO DE PISTA', icon: Route, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '4', title: 'TO 01', icon: HelpCircle, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '5', title: 'TO 02', icon: Flame, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '6', title: 'TO 03', icon: PawPrint, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '7', title: 'TO 04', icon: Car, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '8', title: 'TO 05', icon: Flame, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '9', title: 'TO 06', icon: Truck, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '10', title: 'TO 07', icon: TireIcon, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '11', title: 'TO 09', icon: HardHat, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '12', title: 'TO 11', icon: Shield, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '13', title: 'TO 12', icon: HeartPulse, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '14', title: 'TO 15', icon: Search, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '15', title: 'TO 16', icon: Heart, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '16', title: 'TO 17', icon: User, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '17', title: 'TO 19', icon: Siren, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '18', title: 'TO 32', icon: TractorIcon, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '19', title: 'TO 33', icon: Shovel, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '20', title: 'TO 34', icon: Target, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '21', title: 'TO 35', icon: Droplet, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '22', title: 'TO 37', icon: Signpost, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '23', title: 'TO 38', icon: Megaphone, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '24', title: 'TO 39', icon: Anchor, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
  { id: '25', title: 'TO 50', icon: Wrench, color: 'bg-gradient-to-b from-gray-100 to-gray-400' },
];
