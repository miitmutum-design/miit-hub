
'use client';

import { useState, useMemo } from 'react';
import {
  File,
  ListFilter,
  MoreHorizontal,
  Search,
  Eye,
  Check,
  Mail,
  X,
  Building,
  Link as LinkIcon,
  CircleDollarSign,
  Calendar,
  Image as ImageIcon,
  Loader2,
  AlertTriangle,
  ArrowUpDown,
  Crown,
  Shield,
  Trash2,
  Info,
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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { mockCompanyProfiles } from '@/contexts/CompanyContext';
import { cn } from '@/lib/utils';

const initialSponsorshipRequests = [
    {
        id: 'req1',
        companyId: '1',
        companyName: 'União Construtora',
        companyEmail: 'contato@uniaoconstrutora.com',
        campaignType: 'Destaque Total Banner',
        destinationUrl: 'https://uniaoconstrutora.com.br',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxhbmFseXRpY3N8ZW58MHx8fHwxNzYxNjg3NTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
        tokens: 70,
        durationDays: 7,
        requestedAt: new Date(new Date().setDate(new Date().getDate() - 4)).toISOString(),
        status: 'Pendente'
    },
    {
        id: 'req2',
        companyId: 'company-gold',
        companyName: 'Empresa Gold',
        companyEmail: 'contato@gold.com',
        campaignType: 'Vitrine de Carrossel',
        destinationUrl: 'https://instagram.com/empresagold',
        imageUrl: 'https://i.pravatar.cc/150?u=company-gold',
        tokens: 40,
        durationDays: 5,
        requestedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
        status: 'Pendente'
    },
     {
        id: 'req3',
        companyId: '3',
        companyName: 'Flor de Lótus Móveis',
        companyEmail: 'contato@flordelotus.com',
        campaignType: 'Vídeo Promocional',
        destinationUrl: 'https://wa.me/5521999999993',
        imageUrl: 'https://i.pravatar.cc/150?u=company-lotus',
        tokens: 120,
        durationDays: 10,
        requestedAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
        status: 'Contatado'
    }
];

type SponsorshipRequest = typeof initialSponsorshipRequests[0] & { plan: 'Gold' | 'Prata' | 'Básico' };
type StatusFilter = "todos" | "Pendente" | "Contatado";
type PlanFilter = "todos" | "Gold" | "Prata";
type SortKey = 'requestedAt';


export default function AdminSponsorshipPage() {
  const [requests, setRequests] = useState(initialSponsorshipRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [planFilter, setPlanFilter] = useState<PlanFilter>('todos');
  const [selectedRequest, setSelectedRequest] = useState<SponsorshipRequest | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  
  const { toast } = useToast();

  const [sortConfig, setSortConfig] = useState<{ key: SortKey, direction: 'ascending' | 'descending' }>({ key: 'requestedAt', direction: 'descending' });

  const requestsWithPlan = useMemo(() => {
    return requests.map(req => {
      const profile = mockCompanyProfiles[req.companyId as keyof typeof mockCompanyProfiles];
      return { ...req, plan: profile?.plan || 'Prata' };
    });
  }, [requests]);

  const filteredRequests = useMemo(() => {
    return requestsWithPlan.filter(
      (req) =>
        (req.companyName.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (statusFilter === 'todos' || req.status === statusFilter) &&
        (planFilter === 'todos' || req.plan === planFilter)
    );
  }, [requestsWithPlan, searchQuery, statusFilter, planFilter]);

  const sortedRequests = useMemo(() => {
    let sortableItems = [...filteredRequests];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (new Date(a[sortConfig.key]) < new Date(b[sortConfig.key])) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (new Date(a[sortConfig.key]) > new Date(b[sortConfig.key])) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredRequests, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };


  const handleMarkAsContacted = (requestId: string) => {
    setRequests(prev => 
        prev.map(req => req.id === requestId ? {...req, status: 'Contatado'} : req)
    );
    toast({
        title: "Status Atualizado",
        description: "A solicitação foi marcada como 'Contatado'."
    })
  };
  
  const handleDeleteRequest = (requestId: string) => {
      setRequests(prev => prev.filter(req => req.id !== requestId));
      toast({
          title: "Solicitação Excluída",
          description: "A solicitação foi removida permanentemente.",
      });
  }

  const handleApproveSponsorship = () => {
    if (!selectedRequest) return;
    
    setIsApproving(true);
    
    // Simulate transaction
    setTimeout(() => {
        const companyProfile = mockCompanyProfiles[selectedRequest.companyId as keyof typeof mockCompanyProfiles];

        if (!companyProfile || companyProfile.tokens < selectedRequest.tokens) {
            toast({
                variant: 'destructive',
                title: "ERRO: Tokens Insuficientes",
                description: "O saldo de tokens da empresa é insuficiente. Entre em contato com a loja."
            });
            setIsApproving(false);
            return;
        }

        // 1. Simulate debiting tokens (in a real app, this would be a backend update)
        // For now, we don't update the mock context data from here.

        // 2. Simulate creating schedule and transaction records
        console.log("Creating schedule for:", selectedRequest);
        console.log("Creating transaction record for:", selectedRequest.companyId, "amount:", -selectedRequest.tokens);

        // 3. Remove from local state and close modal
        setRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
        
        setIsApproving(false);
        setIsDetailsModalOpen(false);

        toast({
            title: "Patrocínio Aprovado!",
            description: "Agendamento criado e tokens debitados com sucesso."
        });

    }, 1500);
  }

  const handleSendEmail = () => {
    if (!selectedRequest?.companyEmail || !emailSubject || !emailBody) {
        toast({
            variant: "destructive",
            title: "Campos obrigatórios",
            description: "Por favor, preencha o assunto e a mensagem para continuar.",
        });
        return;
    }

    const mailtoLink = `mailto:${selectedRequest.companyEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;

    toast({
        title: "E-mail pronto para ser enviado!",
        description: "Seu cliente de e-mail deve abrir em breve.",
    });
    
    setEmailSubject('');
    setEmailBody('');
    setIsEmailModalOpen(false);
  }
  
  const openDetailsModal = (req: SponsorshipRequest) => {
      setSelectedRequest(req);
      setIsDetailsModalOpen(true);
  }
  
  const openEmailModal = (req: SponsorshipRequest) => {
      setSelectedRequest(req);
      setIsEmailModalOpen(true);
  }

  const planBadge = (plan: 'Gold' | 'Prata' | 'Básico') => {
      switch(plan) {
          case 'Gold':
              return <Badge className="bg-yellow-400/20 text-yellow-300 border-yellow-500/30 gap-1.5"><Crown className="h-3 w-3"/>{plan}</Badge>;
          case 'Prata':
              return <Badge className="bg-zinc-400/20 text-zinc-300 border-zinc-500/30 gap-1.5"><Shield className="h-3 w-3"/>{plan}</Badge>;
          default:
              return <Badge variant="outline">{plan}</Badge>;
      }
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <AdminHeader title="Solicitações de Patrocínio" />
      
      <Card>
        <CardHeader>
            <div className="flex items-center gap-2">
                <CardTitle>Caixa de Entrada</CardTitle>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-lime-400">
                            <Info className="h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Entenda a Caixa de Entrada</DialogTitle>
                        </DialogHeader>
                        <div className="py-4 space-y-4">
                           <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                                <li><strong>Empresa:</strong> Nome da loja que solicitou o patrocínio e seu Plano de Assinatura (para priorização).</li>
                                <li><strong>Data:</strong> Data de Submissão da Solicitação. Indica há quanto tempo o pedido está aguardando (priorize leads mais antigos).</li>
                                <li><strong>Status:</strong> A fase atual da venda: Pendente (Novo Lead), Contatado (Em Negociação).</li>
                                <li><strong>Ações:</strong> Menu para 'Ver Detalhes' (informações do pedido) ou 'Marcar como Contatado' (próximo passo de vendas).</li>
                           </ul>
                        </div>
                         <DialogFooter>
                            <DialogClose asChild>
                                <Button>Entendi</Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            <CardDescription>
                Gerencie as solicitações de patrocínio enviadas pelas empresas.
            </CardDescription>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por empresa..."
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
                    Status
                    </span>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filtrar por Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                        <DropdownMenuRadioItem value="todos">Todos</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Pendente">Pendentes</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Contatado">Contatados</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Plano
                    </span>
                </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Filtrar por Plano</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={planFilter} onValueChange={(value) => setPlanFilter(value as PlanFilter)}>
                        <DropdownMenuRadioItem value="todos">Todos</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Gold">Gold</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Prata">Prata</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Empresa</TableHead>
                <TableHead className="hidden md:table-cell">Campanha</TableHead>
                <TableHead>
                    <Button variant="ghost" onClick={() => requestSort('requestedAt')}>
                        Data
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRequests.map((req) => {
                const isOld = new Date(req.requestedAt) < new Date(new Date().setDate(new Date().getDate() - 3));
                return (
                    <TableRow 
                        key={req.id}
                        className={cn(isOld && req.status === 'Pendente' && 'bg-red-900/20 hover:bg-red-900/30')}
                    >
                    <TableCell>
                      <div className="font-medium">{req.companyName}</div>
                      {planBadge(req.plan)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{req.campaignType}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            {isOld && req.status === 'Pendente' && <AlertTriangle className="h-4 w-4 text-destructive" />}
                            {format(new Date(req.requestedAt), 'dd/MM/yyyy')}
                        </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant={req.status === 'Pendente' ? 'destructive' : 'default'} className={
                            req.status === 'Pendente' 
                            ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' 
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }>
                        {req.status}
                        </Badge>
                    </TableCell>
                    <TableCell>
                        <AlertDialog>
                            <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => openDetailsModal(req as SponsorshipRequest)}><Eye className="mr-2 h-4 w-4" />Ver Detalhes</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openEmailModal(req as SponsorshipRequest)}><Mail className="mr-2 h-4 w-4" />Enviar Email</DropdownMenuItem>
                                {req.status === 'Pendente' && (
                                    <DropdownMenuItem onClick={() => handleMarkAsContacted(req.id)}><Check className="mr-2 h-4 w-4" />Marcar como Contatado</DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive px-2 py-1.5 h-auto font-normal relative items-center rounded-sm flex cursor-default select-none text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                        <Trash2 className="mr-2 h-4 w-4" />Excluir
                                    </Button>
                                </AlertDialogTrigger>
                            </DropdownMenuContent>
                            </DropdownMenu>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. Isso excluirá permanentemente a solicitação de {req.companyName}.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteRequest(req.id)} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </TableCell>
                    </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    {/* Details Modal */}
    <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border/50">
            <DialogHeader>
                <DialogTitle>Detalhes da Solicitação</DialogTitle>
                <DialogDescription>
                    Revise as informações da solicitação de patrocínio.
                </DialogDescription>
            </DialogHeader>
            {selectedRequest && (
                <div className="py-4 space-y-4 text-sm">
                   <div className="flex items-center gap-3">
                        <ImageIcon className="w-5 h-5 text-muted-foreground"/>
                        <p><strong>Imagem:</strong></p>
                        <Image src={selectedRequest.imageUrl} alt="Banner" width={40} height={40} className="rounded-md object-cover" />
                   </div>
                    <div className="flex items-center gap-3"><Building className="w-5 h-5 text-muted-foreground"/><p><strong>Empresa:</strong> {selectedRequest.companyName}</p></div>
                    <div className="flex items-center gap-3"><p><strong>Campanha:</strong> {selectedRequest.campaignType}</p></div>
                    <div className="flex items-center gap-3"><LinkIcon className="w-5 h-5 text-muted-foreground"/><p className="truncate"><strong>Link:</strong> <a href={selectedRequest.destinationUrl} target="_blank" className="text-primary hover:underline">{selectedRequest.destinationUrl}</a></p></div>
                    <div className="flex items-center gap-3"><CircleDollarSign className="w-5 h-5 text-muted-foreground"/><p><strong>Tokens:</strong> {selectedRequest.tokens}</p></div>
                    <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-muted-foreground"/><p><strong>Duração:</strong> {selectedRequest.durationDays} dias</p></div>
                </div>
            )}
            <DialogFooter>
                <Button variant="secondary" onClick={() => setIsDetailsModalOpen(false)}>Fechar</Button>
                <Button className="bg-lime-500 hover:bg-lime-600 text-black" onClick={handleApproveSponsorship} disabled={isApproving}>
                   {isApproving ? <Loader2 className="animate-spin" /> : 'Aprovar Patrocínio'}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    
    {/* Email Modal */}
    <Dialog open={isEmailModalOpen} onOpenChange={setIsEmailModalOpen}>
        <DialogContent className="sm:max-w-lg bg-card border-border/50">
            <DialogHeader>
                <DialogTitle>Enviar E-mail</DialogTitle>
                 <DialogDescription>
                    Escreva uma mensagem para {selectedRequest?.companyName}.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
                 <div>
                    <Label htmlFor="email-to">Para</Label>
                    <Input id="email-to" value={selectedRequest?.companyEmail || ''} readOnly/>
                </div>
                 <div>
                    <Label htmlFor="email-subject">Assunto</Label>
                    <Input id="email-subject" placeholder="Assunto do E-mail" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
                </div>
                <div>
                    <Label htmlFor="email-body">Mensagem</Label>
                    <Textarea id="email-body" placeholder="Escreva sua mensagem aqui..." className="min-h-[150px]" value={emailBody} onChange={(e) => setEmailBody(e.target.value)} />
                </div>
            </div>
            <DialogFooter>
                 <Button variant="secondary" onClick={() => setIsEmailModalOpen(false)}>Cancelar</Button>
                <Button onClick={handleSendEmail} className="bg-lime-500 hover:bg-lime-600 text-black">
                   <Mail className="mr-2 h-4 w-4"/> Enviar
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </main>
  );
}
