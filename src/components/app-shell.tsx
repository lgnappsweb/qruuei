"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileCode, ShieldAlert, NotebookText, Settings, GanttChartSquare } from "lucide-react";
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
           {/* This is a placeholder for user authentication status in the future.
               // It can be replaced with actual user data from Firebase Auth. */}
          <div className="flex items-center gap-3 p-2">
            <Avatar className="size-8">
              <AvatarImage src="https://picsum.photos/seed/user/40/40" data-ai-hint="user avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold text-foreground">Usuário</span>
                <span className="text-xs text-muted-foreground">usuario@email.com</span>
            </div>
          </div>
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
