"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileCode, ShieldAlert, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Início", icon: Home },
  { href: "/codigos", label: "Códigos", icon: FileCode },
  { href: "/ocorrencias", label: "Ocorrências", icon: ShieldAlert },
  { href: "/ajustes", label: "Ajustes", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const noNavPages = ['/login', '/signup', '/forgot-password'];
  const isAuthPage = isMounted && noNavPages.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className={cn("flex-1 p-4 sm:p-6 lg:p-8", !isAuthPage && "pb-24")}>
        {children}
      </main>
      {!isAuthPage && (
        <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-10 shadow-[0_-8px_16px_-4px_rgba(0,0,0,0.1)] dark:shadow-[0_-8px_16px_-4px_rgba(255,255,255,0.05)]">
          <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
            {navItems.map((item) => {
              const isActive = isMounted && pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 w-full h-full rounded-lg transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-condensed font-bold text-base">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
