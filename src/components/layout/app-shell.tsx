'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Clock,
  FileText,
  History,
  LayoutDashboard,
  LogIn,
  LogOut,
  Settings,
  ShieldCheck,
  User,
  UserPlus,
} from 'lucide-react';
import { Logo } from '@/components/icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', requiredRoles: ['admin', 'supervisor', 'employee'] },
  { href: '/attendance', icon: History, label: 'Attendance', requiredRoles: ['admin', 'supervisor', 'employee'] },
  { href: '/reports', icon: FileText, label: 'Reports', requiredRoles: ['admin', 'supervisor'] },
  { href: '/enrollment', icon: UserPlus, label: 'Enrollment', requiredRoles: ['admin', 'supervisor'] },
  { href: '/access-control', icon: ShieldCheck, label: 'Access Control', requiredRoles: ['admin', 'supervisor'] },
  { href: '/shifts', icon: Clock, label: 'Shift Management', requiredRoles: ['admin', 'supervisor'] },
  { href: '/settings', icon: Settings, label: 'Settings', requiredRoles: ['admin'] },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  React.useEffect(() => {
    if (!loading && !user && pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, pathname, router]);

  if (pathname === '/login') {
    return <main className="flex-1 p-4 sm:p-6">{children}</main>;
  }

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const visibleNavItems = navItems.filter(item => user && item.requiredRoles.includes(user.role));

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="icon"
        className="border-sidebar-border"
        variant="sidebar"
      >
        <SidebarHeader className="h-14 justify-center p-0">
          <Link href="/dashboard" className="flex items-center gap-2" prefetch={true}>
            <Logo className="size-7 text-primary" />
            <span
              data-sidebar="brand-name"
              className="text-lg font-semibold tracking-tight"
            >
              UniSync
            </span>
            <span
              data-sidebar="brand-name"
              className="text-lg font-light tracking-tight text-muted-foreground"
            >
              Time
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {visibleNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{
                    children: item.label,
                  }}
                >
                  <Link href={item.href} prefetch={true}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header
          className={cn(
            'flex h-14 items-center gap-4 border-b bg-card/50 px-4 backdrop-blur-sm lg:px-6',
            'sticky top-0 z-30'
          )}
        >
          <SidebarTrigger className="md:hidden" />
          <div className="flex-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.imageUrl} alt={user.name} data-ai-hint="person avatar" />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs capitalize leading-none text-muted-foreground">
                    {user.role}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
