
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  Building2,
  Home,
  Package,
  Settings,
  Star,
  Ticket,
  Users,
  Shapes,
  Gift,
  LogOut,
  BarChart3,
  HelpCircle,
  CircleDollarSign
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import AdminHeader from '@/components/common/AdminHeader';
import { SheetTitle } from '@/components/ui/sheet';

const navItems = [
  { href: '/admin', icon: BarChart3, label: 'Dashboard' },
  { href: '/admin/empresas', icon: Building2, label: 'Empresas' },
  { href: '/admin/avaliacoes', icon: Star, label: 'Avaliações' },
  { href: '/admin/categorias', icon: Shapes, label: 'Categorias' },
  { href: '/admin/conteudo', icon: Package, label: 'Conteúdo' },
  { href: '/admin/patrocinio', icon: CircleDollarSign, label: 'Patrocínio'},
  { href: '/admin/suporte', icon: HelpCircle, label: 'Suporte' },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    // In a real app, you would invalidate the session on the server
    document.cookie = 'admin-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Sidebar>
            <SidebarHeader>
                 <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src="https://i.pravatar.cc/150?u=admin" alt="Admin" />
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-foreground">Admin</span>
                        <span className="text-xs text-muted-foreground">admin@localhub.com</span>
                    </div>
                 </div>
            </SidebarHeader>
            <SidebarContent className="p-2">
                <SidebarMenu>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                        <SidebarMenuItem key={item.href}>
                            <Link href={item.href}>
                                <SidebarMenuButton isActive={isActive}>
                                    <item.icon className="h-5 w-5" />
                                    <span>{item.label}</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-2">
                <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                    <span>Sair</span>
                </Button>
            </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}
