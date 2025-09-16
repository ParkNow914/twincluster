'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { SidebarNav } from '@/components/layout/sidebar-nav';
import { siteConfig } from '@/config/site';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the current route is an auth route
  const isAuthRoute = pathname.startsWith('/auth');

  // Redirect to login if not authenticated and not on an auth route
  useEffect(() => {
    if (!isLoading && !user && !isAuthRoute) {
      router.push('/auth/login');
    }
  }, [user, isLoading, isAuthRoute, router]);

  // Check if mobile view
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial value
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // If on auth route, just render children
  if (isAuthRoute) {
    return <>{children}</>;
  }

  // If no user but not on auth route, show loading
  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 border-r bg-background transition-transform duration-300 ease-in-out md:translate-x-0',
          {
            'translate-x-0': isSidebarOpen,
            '-translate-x-full': !isSidebarOpen,
          }
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between border-b px-4">
            <div className="flex items-center space-x-2">
              <Icons.logo className="h-6 w-6" />
              <span className="text-lg font-semibold">{siteConfig.name}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <Icons.x className="h-5 w-5" />
              <span className="sr-only">Fechar menu</span>
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <SidebarNav userRole={user.role} />
          </div>

          {/* User Profile */}
          <div className="border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex w-full items-center justify-start space-x-2 p-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.full_name} />
                    <AvatarFallback>
                      {user.full_name ? getInitials(user.full_name) : 'US'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate text-left">
                    <p className="truncate text-sm font-medium">
                      {user.full_name || user.email}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.role}
                    </p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}>
                  <Icons.user className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  <Icons.settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <Icons.logout className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={cn(
          'flex flex-1 flex-col transition-all duration-300 ease-in-out',
          {
            'md:ml-64': isSidebarOpen,
          }
        )}
      >
        {/* Top Navigation */}
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex w-full items-center justify-between px-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Icons.menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
              <h1 className="ml-2 text-lg font-semibold md:ml-0">
                {getPageTitle(pathname)}
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <Button variant="ghost" size="icon">
                <Icons.bell className="h-5 w-5" />
                <span className="sr-only">Notificações</span>
              </Button>
              
              {/* Quick Actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Icons.plus className="h-5 w-5" />
                    <span className="sr-only">Ações rápidas</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Icons.plusCircle className="mr-2 h-4 w-4" />
                    <span>Nova Ordem de Serviço</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icons.userPlus className="mr-2 h-4 w-4" />
                    <span>Novo Cliente</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Icons.packagePlus className="mr-2 h-4 w-4" />
                    <span>Novo Ativo</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// Helper function to get page title based on route
function getPageTitle(pathname: string): string {
  const path = pathname.split('/')[1];
  
  const titles: Record<string, string> = {
    'dashboard': 'Visão Geral',
    'service-orders': 'Ordens de Serviço',
    'assets': 'Ativos',
    'clients': 'Clientes',
    'providers': 'Prestadores',
    'reports': 'Relatórios',
    'settings': 'Configurações',
    'profile': 'Meu Perfil',
  };

  return titles[path] || 'Dashboard';
}
