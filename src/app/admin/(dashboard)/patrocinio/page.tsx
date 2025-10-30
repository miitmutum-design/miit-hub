
'use client';

import { useState } from 'react';
import {
  File,
  ListFilter,
  MoreHorizontal,
  Search,
  Eye,
  Check,
  Mail,
} from 'lucide-react';
import AdminHeader from '@/components/common/AdminHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const mockSponsorshipRequests = [
    {
        id: 'req1',
        companyId: '1',
        companyName: 'União Construtora',
        message: 'Gostaria de saber mais sobre o plano de Destaque Total no Topo. Temos interesse em anunciar por 3 meses. Quais são os próximos passos?',
        requestedAt: new Date().toISOString(),
        status: 'Pendente'
    },
    {
        id: 'req2',
        companyId: 'company-gold',
        companyName: 'Empresa Gold',
        message: 'Tenho interesse na Vitrine de Patrocinadores. Como funciona a rotação justa?',
        requestedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        status: 'Pendente'
    },
     {
        id: 'req3',
        companyId: '3',
        companyName: 'Flor de Lótus Móveis',
        message: 'Já somos parceiros e queremos renovar nosso destaque no carrossel. Por favor, entrem em contato.',
        requestedAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
        status: 'Contatado'
    }
];


export default function AdminSponsorshipPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = mockSponsorshipRequests.filter(
    (req) =>
      req.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <AdminHeader title="Solicitações de Patrocínio" />
      
      <Card>
        <CardHeader>
             <CardTitle>Caixa de Entrada</CardTitle>
            <CardDescription>
                Gerencie as solicitações de patrocínio enviadas pelas empresas.
            </CardDescription>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por empresa ou mensagem..."
                className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filtro
                    </span>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
                <DropdownMenuItem>Pendentes</DropdownMenuItem>
                <DropdownMenuItem>Contatados</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead className="hidden md:table-cell">Mensagem</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell className="font-medium">{req.companyName}</TableCell>
                  <TableCell className="hidden md:table-cell max-w-sm truncate">{req.message}</TableCell>
                  <TableCell>{format(new Date(req.requestedAt), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>
                    <Badge variant={req.status === 'Pendente' ? 'destructive' : 'default'} className={req.status === 'Pendente' ? 'bg-orange-600/20 text-orange-400 border-none' : 'bg-lime-500/10 text-lime-300 border-lime-400/20'}>
                      {req.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />Ver Detalhes</DropdownMenuItem>
                        <DropdownMenuItem><Mail className="mr-2 h-4 w-4" />Enviar Email</DropdownMenuItem>
                        <DropdownMenuItem><Check className="mr-2 h-4 w-4" />Marcar como Contatado</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
