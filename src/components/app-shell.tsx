"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileCode, ShieldAlert, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Início", icon: Home },
  { href: "/codigos", label: "Códigos", icon: FileCode },
  { href: "/ocorrencias", label: "Ocorrências", icon: ShieldAlert },
  { href: "/ajustes", label: "Ajustes", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-28">
        {children}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-10">
        <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 text-xs w-full h-full rounded-lg transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
