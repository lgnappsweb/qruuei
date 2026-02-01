"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileCode, ShieldAlert, Settings, Signpost } from "lucide-react";
import { cn } from "@/lib/utils";
import * as React from "react";

const navItems = [
  { href: "/", label: "Início", icon: Home },
  { href: "/codigos", label: "Códigos", icon: FileCode },
  { href: "/ocorrencias", label: "Ocorrências", icon: ShieldAlert },
  { href: "/imagens", label: "Placas", icon: Signpost },
  { href: "/ajustes", label: "Ajustes", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const noNavPages = ['/login', '/signup', '/forgot-password', '/admin', '/supervisor'];
  const isSpecialPage = noNavPages.some(page => pathname.startsWith(page));

  // For special pages, the whole page can scroll.
  if (isSpecialPage) {
    return (
        <main className="p-4 sm:p-6 lg:p-8 min-h-svh">
            {children}
        </main>
    );
  }

  // For pages with the nav bar, we create a fixed layout.
  return (
    <div className="h-full flex flex-col bg-background">
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      
      <nav className="h-20 bg-card border-t border-border z-10 shadow-[0_-8px_16px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_-8px_16px_-4px_rgba(255,255,255,0.05)]">
        <div className="flex justify-around items-center h-full">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1.5 w-full h-full text-center transition-colors",
                  isActive
                    ? "text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-7 w-7" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
