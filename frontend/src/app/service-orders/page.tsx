'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock data - replace with API calls in a real application
const mockServiceOrders = [
  {
    id: 'SO-2023-001',
    title: 'Manutenção Preventiva - Compressor de Ar',
    client: 'Empresa ABC Ltda',
    asset: 'Compressor de Ar 01',
    priority: 'high',
    status: 'in_progress',
    assignedTo: 'João Silva',
    createdAt: new Date('2023-09-15T09:30:00'),
    scheduledDate: new Date('2023-09-20T14:00:00'),
  },
  {
    id: 'SO-2023-002',
    title: 'Correia do Motor Desgastada',
    client: 'Indústria XYZ S/A',
    asset: 'Esteira Transportadora 02',
    priority: 'urgent',
    status: 'pending',
    assignedTo: null,
    createdAt: new Date('2023-09-14T15:45:00'),
    scheduledDate: null,
  },
  {
    id: 'SO-2023-003',
    title: 'Troca de Óleo do Motor',
    client: 'Fábrica 123',
    asset: 'Máquina de Corte 05',
    priority: 'medium',
    status: 'completed',
    assignedTo: 'Maria Santos',
    createdAt: new Date('2023-09-12T11:20:00'),
    scheduledDate: new Date('2023-09-12T14:00:00'),
    completedAt: new Date('2023-09-12T16:30:00'),
  },
  {
    id: 'SO-2023-004',
    title: 'Ajuste de Calibração',
    client: 'Indústria ABC',
    asset: 'Balança Industrial',
    priority: 'low',
    status: 'in_progress',
    assignedTo: 'Carlos Oliveira',
    createdAt: new Date('2023-09-10T10:15:00'),
    scheduledDate: new Date('2023-09-18T10:00:00'),
  },
  {
    id: 'SO-2023-005',
    title: 'Vazamento de Óleo',
    client: 'Metalúrgica XYZ',
    asset: 'Prensa Hidráulica 03',
    priority: 'high',
    status: 'pending',
    assignedTo: null,
    createdAt: new Date('2023-09-09T16:30:00'),
    scheduledDate: null,
  },
];

type ServiceOrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
type ServiceOrderPriority = 'low' | 'medium' | 'high' | 'urgent';

interface ServiceOrder {
  id: string;
  title: string;
  client: string;
  asset: string;
  priority: ServiceOrderPriority;
  status: ServiceOrderStatus;
  assignedTo: string | null;
  createdAt: Date;
  scheduledDate: Date | null;
  completedAt?: Date;
}

export default function ServiceOrdersPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ServiceOrderStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<ServiceOrderPriority | 'all'>('all');
  const [serviceOrders, setServiceOrders] = useState<ServiceOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Simulate API call
  useEffect(() => {
    const timer = setTimeout(() => {
      setServiceOrders(mockServiceOrders);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Filter service orders based on search term and filters
  const filteredServiceOrders = serviceOrders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.asset.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Pagination
  const totalPages = Math.ceil(filteredServiceOrders.length / itemsPerPage);
  const paginatedServiceOrders = filteredServiceOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: ServiceOrderStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pendente</Badge>;
      case 'in_progress':
        return <Badge variant="info">Em Andamento</Badge>;
      case 'completed':
        return <Badge variant="success">Concluído</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getPriorityBadge = (priority: ServiceOrderPriority) => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline">Baixa</Badge>;
      case 'medium':
        return <Badge variant="secondary">Média</Badge>;
      case 'high':
        return <Badge variant="warning">Alta</Badge>;
      case 'urgent':
        return <Badge variant="destructive">Urgente</Badge>;
      default:
        return <Badge variant="outline">Não definida</Badge>;
    }
  };

  const handleViewDetails = (id: string) => {
    router.push(`/service-orders/${id}`);
  };

  const handleCreateNew = () => {
    router.push('/service-orders/new');
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between space-y-2 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ordens de Serviço</h1>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todas as ordens de serviço
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Icons.plus className="mr-2 h-4 w-4" />
          Nova Ordem de Serviço
        </Button>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
            <div className="flex-1">
              <Input
                placeholder="Buscar por ID, título, cliente ou ativo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex space-x-2">
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-[200px]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ServiceOrderStatus | 'all')}
              >
                <option value="all">Todos os status</option>
                <option value="pending">Pendente</option>
                <option value="in_progress">Em Andamento</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
              </select>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:w-[200px]"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as ServiceOrderPriority | 'all')}
              >
                <option value="all">Todas as prioridades</option>
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Ativo</TableHead>
                  <TableHead>Prioridade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedServiceOrders.length > 0 ? (
                  paginatedServiceOrders.map((order) => (
                    <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewDetails(order.id)}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{order.title}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{order.client}</TableCell>
                      <TableCell className="max-w-[150px] truncate">{order.asset}</TableCell>
                      <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {order.assignedTo || 'Não atribuído'}
                      </TableCell>
                      <TableCell>
                        {format(order.createdAt, 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(order.id);
                          }}
                        >
                          <Icons.eye className="h-4 w-4" />
                          <span className="sr-only">Ver detalhes</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center">
                      Nenhuma ordem de serviço encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between px-6 py-4">
          <div className="text-sm text-muted-foreground">
            Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredServiceOrders.length)}
            </span>{' '}
            de <span className="font-medium">{filteredServiceOrders.length}</span> ordens de serviço
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Próxima
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
