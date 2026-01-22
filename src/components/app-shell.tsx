"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileCode, ShieldAlert, NotebookText, Settings, GanttChartSquare, User as UserIcon } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarInset,
  SidebarMenuButton,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useUser } from "@/firebase";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/codigos", label: "Códigos", icon: FileCode },
  { href: "/ocorrencias", label: "Ocorrências", icon: ShieldAlert },
  { href: "/notas", label: "Notas", icon: NotebookText },
  { href: "/ajustes", label: "Ajustes", icon: Settings },
];

function SidebarNavLink({ item }: { item: (typeof navItems)[0] }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;

  const linkContent = (
    <>
      <item.icon className="shrink-0" />
      <span className="truncate">{item.label}</span>
    </>
  );
  
  return (
    <SidebarMenuButton asChild size="default" isActive={isActive} tooltip={item.label}>
      <Link href={item.href}>
        {linkContent}
      </Link>
    </SidebarMenuButton>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, initialising } = useUser();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-3 p-2">
            <GanttChartSquare className="w-7 h-7 text-primary shrink-0" />
            <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">QRU</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarNavLink item={item} />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           {initialising ? (
            <div className="flex items-center gap-3 p-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex flex-col gap-1 group-data-[collapsible=icon]:hidden">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-3 p-2">
              <Avatar className="size-8">
                <AvatarImage src={user.photoURL ?? `https://picsum.photos/seed/${user.uid}/40/40`} data-ai-hint="user avatar" />
                <AvatarFallback>{user.email?.[0].toUpperCase() ?? 'U'}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden overflow-hidden">
                  <span className="text-sm font-semibold text-foreground truncate">{user.displayName ?? 'Usuário'}</span>
                  <span className="text-xs text-muted-foreground truncate">{user.email}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-2">
              <Avatar className="size-8">
                <AvatarFallback>
                  <UserIcon className="size-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                  <span className="text-sm font-semibold text-foreground">Anônimo</span>
                  <Button asChild size="sm" variant="link" className="p-0 h-auto justify-start text-primary">
                    <Link href="/login">Fazer Login</Link>
                  </Button>
              </div>
            </div>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
