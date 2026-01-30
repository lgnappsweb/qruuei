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

  // Draggable state
  const [position, setPosition] = React.useState({ right: 24, bottom: 24 });
  const fabRef = React.useRef<HTMLDivElement>(null);
  const dragInfoRef = React.useRef({
    isDragging: false,
    hasDragged: false,
    startX: 0,
    startY: 0,
    initialRight: 24,
    initialBottom: 24,
  });


  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('a')) return;

    e.preventDefault();
    e.stopPropagation();

    const dragInfo = dragInfoRef.current;
    dragInfo.isDragging = true;
    dragInfo.hasDragged = false;
    dragInfo.startX = e.clientX;
    dragInfo.startY = e.clientY;
    
    if (fabRef.current) {
        const rect = fabRef.current.getBoundingClientRect();
        dragInfo.initialRight = window.innerWidth - rect.right;
        dragInfo.initialBottom = window.innerHeight - rect.bottom;
    }
    
    (e.target as HTMLElement).setPointerCapture(e.pointerId);

    const handlePointerMove = (moveEvent: PointerEvent) => {
        if (!dragInfo.isDragging) return;

        const dx = moveEvent.clientX - dragInfo.startX;
        const dy = moveEvent.clientY - dragInfo.startY;

        if (!dragInfo.hasDragged && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
            dragInfo.hasDragged = true;
        }

        let newRight = dragInfo.initialRight - dx;
        let newBottom = dragInfo.initialBottom - dy;

        if (fabRef.current) {
            const rect = fabRef.current.getBoundingClientRect();
            newRight = Math.max(0, Math.min(newRight, window.innerWidth - rect.width));
            newBottom = Math.max(0, Math.min(newBottom, window.innerHeight - rect.height));
        }

        setPosition({ right: newRight, bottom: newBottom });
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
        (upEvent.target as HTMLElement).releasePointerCapture(upEvent.pointerId);
        dragInfo.isDragging = false;
        
        if (!dragInfo.hasDragged) {
            setIsMenuOpen((prev) => !prev);
        }

        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };
  
  const noNavPages = ['/login', '/signup', '/forgot-password', '/admin', '/supervisor'];
  const isSpecialPage = noNavPages.some(page => pathname.startsWith(page));

  return (
    <div className="min-h-svh bg-background">
      <main
        className={cn(
          "p-4 sm:p-6 lg:p-8",
          !isSpecialPage && "pb-40"
        )}
      >
        {children}
      </main>
      {isClient && !isSpecialPage && (
        <div 
          ref={fabRef}
          className="fixed z-50 cursor-grab active:cursor-grabbing"
          style={{ 
            right: `${position.right}px`, 
            bottom: `${position.bottom}px`,
            touchAction: 'none'
          }}
          onPointerDown={handlePointerDown}
        >
            <div className="relative flex flex-col items-end">
                <div
                  className={cn(
                    'flex flex-col-reverse items-end gap-3 transition-all duration-300 ease-in-out mb-3',
                    isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  )}
                >
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <div key={item.href} className="flex items-center gap-4">
                        <div className="bg-card text-card-foreground rounded-lg px-4 py-2 shadow-lg border border-primary/50">
                            <span className="font-semibold text-lg">{item.label}</span>
                        </div>
                        <Button
                            asChild
                            size="icon"
                            className={cn(
                            'h-14 w-14 rounded-full shadow-lg',
                            isActive ? 'bg-primary text-primary-foreground' : 'bg-card text-foreground border-2 border-primary/50'
                            )}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Link href={item.href} title={item.label}>
                            <item.icon className="h-6 w-6" />
                            <span className="sr-only">{item.label}</span>
                            </Link>
                        </Button>
                      </div>
                    );
                  })}
                </div>
                
                <Button
                  size="icon"
                  className="h-20 w-20 rounded-full shadow-2xl pointer-events-none"
                  aria-expanded={isMenuOpen}
                  tabIndex={-1}
                >
                  <X className={cn('h-8 w-8 transition-all duration-300', !isMenuOpen && 'rotate-90 scale-0 opacity-0')} />
                  <Grip className={cn('h-8 w-8 absolute transition-all duration-300', isMenuOpen && '-rotate-90 scale-0 opacity-0')} />
                  <span className="sr-only">{isMenuOpen ? 'Fechar menu' : 'Abrir menu'}</span>
                </Button>
            </div>
        </div>
      )}
    </div>
  );
}
