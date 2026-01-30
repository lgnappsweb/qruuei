"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileCode, ShieldAlert, Settings, Signpost, Grip, X } from "lucide-react";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Início", icon: Home },
  { href: "/codigos", label: "Códigos", icon: FileCode },
  { href: "/ocorrencias", label: "Ocorrências", icon: ShieldAlert },
  { href: "/imagens", label: "Placas", icon: Signpost },
  { href: "/ajustes", label: "Ajustes", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  const noNavPages = ['/login', '/signup', '/forgot-password', '/admin', '/supervisor'];
  const isSpecialPage = noNavPages.some(page => pathname.startsWith(page));

  return (
    <div className="flex flex-col h-svh bg-background overflow-hidden">
      <main
        className={cn(
          "flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto"
        )}
      >
        {children}
      </main>
      {isClient && !isSpecialPage && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="relative flex flex-col items-center gap-3">
             <div
              className={cn(
                'flex flex-col-reverse items-center gap-3 transition-all duration-300 ease-in-out',
                isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
              )}
            >
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Button
                    key={item.href}
                    asChild
                    size="icon"
                    className={cn(
                      'h-14 w-14 rounded-full shadow-lg',
                      isActive ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link href={item.href} title={item.label}>
                      <item.icon className="h-6 w-6" />
                      <span className="sr-only">{item.label}</span>
                    </Link>
                  </Button>
                );
              })}
            </div>
            
            <Button
              size="icon"
              className="h-16 w-16 rounded-full shadow-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
            >
              <X className={cn('h-7 w-7 transition-all duration-300', !isMenuOpen && 'rotate-90 scale-0 opacity-0')} />
              <Grip className={cn('h-7 w-7 absolute transition-all duration-300', isMenuOpen && '-rotate-90 scale-0 opacity-0')} />
              <span className="sr-only">{isMenuOpen ? 'Fechar menu' : 'Abrir menu'}</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
