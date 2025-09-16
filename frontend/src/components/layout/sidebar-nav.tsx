'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type NavItem = {
  title: string;
  href: string;
  icon: keyof typeof Icons;
  roles?: string[];
  children?: Omit<NavItem, 'icon' | 'roles'>[];
};

const navigation: NavItem[] = [
  {
    title: 'Visão Geral',
    href: '/dashboard',
    icon: 'layoutDashboard',
  },
  {
    title: 'Ordens de Serviço',
    href: '/service-orders',
    icon: 'clipboardList',
    children: [
      { title: 'Todas', href: '/service-orders' },
      { title: 'Abertas', href: '/service-orders?status=open' },
      { title: 'Em Andamento', href: '/service-orders?status=in_progress' },
      { title: 'Concluídas', href: '/service-orders?status=completed' },
      { title: 'Nova Ordem', href: '/service-orders/new' },
    ],
  },
  {
    title: 'Ativos',
    href: '/assets',
    icon: 'package',
    children: [
      { title: 'Todos os Ativos', href: '/assets' },
      { title: 'Por Categoria', href: '/assets/categories' },
      { title: 'Adicionar Ativo', href: '/assets/new' },
    ],
  },
  {
    title: 'Clientes',
    href: '/clients',
    icon: 'users',
    roles: ['admin', 'manager'],
    children: [
      { title: 'Lista de Clientes', href: '/clients' },
      { title: 'Adicionar Cliente', href: '/clients/new' },
    ],
  },
  {
    title: 'Prestadores',
    href: '/providers',
    icon: 'userCog',
    roles: ['admin', 'manager'],
    children: [
      { title: 'Lista de Prestadores', href: '/providers' },
      { title: 'Adicionar Prestador', href: '/providers/new' },
    ],
  },
  {
    title: 'Relatórios',
    href: '/reports',
    icon: 'barChart',
    roles: ['admin', 'manager'],
    children: [
      { title: 'Visão Geral', href: '/reports/overview' },
      { title: 'Ordens de Serviço', href: '/reports/service-orders' },
      { title: 'Ativos', href: '/reports/assets' },
      { title: 'Financeiro', href: '/reports/financial' },
    ],
  },
  {
    title: 'Configurações',
    href: '/settings',
    icon: 'settings',
    roles: ['admin'],
    children: [
      { title: 'Geral', href: '/settings/general' },
      { title: 'Usuários', href: '/settings/users' },
      { title: 'Permissões', href: '/settings/permissions' },
      { title: 'Integrações', href: '/settings/integrations' },
    ],
  },
];

interface SidebarNavProps {
  userRole: string;
  className?: string;
}

export function SidebarNav({ userRole, className, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});

  // Initialize open items based on current path
  React.useEffect(() => {
    const newOpenItems = { ...openItems };
    
    // Find the parent item that contains the current path
    navigation.forEach((item) => {
      if (item.children) {
        const isActive = item.children.some((child) => pathname.startsWith(child.href));
        if (isActive) {
          newOpenItems[item.href] = true;
        }
      }
    });
    
    setOpenItems(newOpenItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Filter navigation items based on user role
  const filteredNav = navigation.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(userRole);
  });

  const toggleItem = (href: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className={cn('space-y-1', className)} {...props}>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-1 p-2">
          {filteredNav.map((item) => {
            const Icon = Icons[item.icon] || Icons.helpCircle;
            const isItemActive = isActive(item.href);
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openItems[item.href] ?? false;

            if (hasChildren) {
              return (
                <Collapsible
                  key={item.href}
                  open={isOpen}
                  onOpenChange={() => toggleItem(item.href)}
                  className="space-y-1"
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant={isItemActive ? 'secondary' : 'ghost'}
                      className={cn(
                        'w-full justify-start',
                        isItemActive && 'bg-accent text-accent-foreground',
                        'group relative flex h-9 items-center px-3 py-6 text-sm font-medium hover:bg-accent hover:text-accent-foreground md:text-sm',
                      )}
                    >
                      <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.title}</span>
                      <Icons.chevronDown
                        className={cn(
                          'ml-auto h-4 w-4 transition-transform duration-200',
                          isOpen ? 'rotate-180' : '',
                        )}
                      />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 space-y-1 pl-9">
                    {item.children?.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          'group flex h-8 w-full items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                          isActive(child.href) && 'bg-accent text-accent-foreground',
                        )}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'group flex h-9 items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
                  isItemActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                )}
              >
                <Icon className="mr-3 h-4 w-4 flex-shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </nav>
  );
}
