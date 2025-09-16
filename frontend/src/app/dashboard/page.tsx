'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data - replace with API calls in a real application
const mockStats = {
  totalServiceOrders: 124,
  openServiceOrders: 32,
  inProgressServiceOrders: 18,
  completedServiceOrders: 74,
  totalAssets: 89,
  maintenanceDue: 12,
  activeClients: 24,
  activeProviders: 15,
};

const recentActivities = [
  {
    id: 1,
    type: 'service_order',
    title: 'Ordem de Serviço #1234',
    description: 'Manutenção preventiva agendada',
    status: 'in_progress',
    date: new Date('2025-09-15T10:30:00'),
  },
  {
    id: 2,
    type: 'asset',
    title: 'Ativo #4567',
    description: 'Manutenção corretiva necessária',
    status: 'pending',
    date: new Date('2025-09-14T15:45:00'),
  },
  {
    id: 3,
    type: 'service_order',
    title: 'Ordem de Serviço #1233',
    description: 'Manutenção preventiva concluída',
    status: 'completed',
    date: new Date('2025-09-14T09:15:00'),
  },
  {
    id: 4,
    type: 'client',
    title: 'Novo cliente cadastrado',
    description: 'Empresa XYZ',
    status: 'info',
    date: new Date('2025-09-13T14:20:00'),
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(mockStats);
  const [activities, setActivities] = useState(recentActivities);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Bom dia');
    } else if (hour < 18) {
      setGreeting('Boa tarde');
    } else {
      setGreeting('Boa noite');
    }

    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pendente</Badge>;
      case 'in_progress':
        return <Badge variant="info">Em Andamento</Badge>;
      case 'completed':
        return <Badge variant="success">Concluído</Badge>;
      case 'info':
      default:
        return <Badge variant="outline">Informação</Badge>;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'service_order':
        return <Icons.clipboardList className="h-5 w-5 text-muted-foreground" />;
      case 'asset':
        return <Icons.package className="h-5 w-5 text-muted-foreground" />;
      case 'client':
        return <Icons.users className="h-5 w-5 text-muted-foreground" />;
      default:
        return <Icons.activity className="h-5 w-5 text-muted-foreground" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {greeting}, {user?.full_name?.split(' ')[0] || 'Usuário'}
          </h1>
          <p className="text-muted-foreground">
            Aqui está um resumo das atividades recentes e estatísticas.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => router.push('/service-orders/new')}>
            <Icons.plus className="mr-2 h-4 w-4" />
            Nova Ordem de Serviço
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ordens de Serviço</CardTitle>
            <Icons.clipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalServiceOrders}</div>
            <div className="mt-2 flex space-x-2 text-xs text-muted-foreground">
              <span className="text-green-500">+12%</span>
              <span>vs. mês passado</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Icons.clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openServiceOrders}</div>
            <div className="mt-2 flex items-center space-x-1 text-xs text-muted-foreground">
              <Icons.alertCircle className="h-3 w-3 text-yellow-500" />
              <span>{stats.inProgressServiceOrders} em andamento</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <Icons.package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAssets}</div>
            <div className="mt-2 flex items-center space-x-1 text-xs text-muted-foreground">
              <Icons.alertTriangle className="h-3 w-3 text-red-500" />
              <span>{stats.maintenanceDue} precisam de manutenção</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Icons.users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeClients}</div>
            <div className="mt-2 flex items-center space-x-1 text-xs text-muted-foreground">
              <Icons.userPlus className="h-3 w-3 text-green-500" />
              <span>+3 este mês</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activities */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      {getActivityIcon(activity.type)}
                    </div>
                  </div>
                  <div className="ml-4 flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <div className="ml-2 flex-shrink-0">
                        {getStatusBadge(activity.status)}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {format(activity.date, "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="mt-4 w-full">
              Ver todas as atividades
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="justify-start" onClick={() => router.push('/service-orders/new')}>
                <Icons.plusCircle className="mr-2 h-4 w-4" />
                Nova Ordem de Serviço
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => router.push('/assets/new')}>
                <Icons.packagePlus className="mr-2 h-4 w-4" />
                Adicionar Ativo
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => router.push('/clients/new')}>
                <Icons.userPlus className="mr-2 h-4 w-4" />
                Adicionar Cliente
              </Button>
              <Button variant="outline" className="justify-start" onClick={() => router.push('/providers/new')}>
                <Icons.userCog className="mr-2 h-4 w-4" />
                Adicionar Prestador
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Maintenance */}
          <Card>
            <CardHeader>
              <CardTitle>Próximas Manutenções</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Compressor de Ar 01</p>
                    <p className="text-sm text-muted-foreground">Manutenção Preventiva</p>
                    <p className="text-xs text-muted-foreground">Vence em 3 dias</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">
                    Agendar
                  </Button>
                </div>
                <div className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Sistema de Refrigeração</p>
                    <p className="text-sm text-muted-foreground">Troca de Filtros</p>
                    <p className="text-xs text-muted-foreground">Vence em 1 semana</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto">
                    Agendar
                  </Button>
                </div>
              </div>
              <Button variant="ghost" className="mt-4 w-full">
                Ver todas as manutenções
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
