
'use client';

import { useState, useMemo } from 'react';
import {
  ListFilter,
  MoreHorizontal,
  Search,
  Trash2,
  Eye,
  Gift,
  Ticket,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { businessOffers, businessEvents } from '@/lib/data';
import { format, parseISO } from 'date-fns';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getOfferById, getEventById } from '@/lib/data';


type StatusFilter = "todos" | "ativo" | "expirado";
type ContentType = 'ofertas' | 'eventos';

const OfferDetailsModal = ({ offerId }: { offerId: string | null }) => {
    if (!offerId) return null;
    const offer = getOfferById(offerId);
    if(!offer) return null;

    return (
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Detalhes da Oferta</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4 text-sm">
                <div><strong>Título:</strong> {offer.title}</div>
                <div><strong>Empresa:</strong> {offer.businessName}</div>
                <div><strong>Descrição:</strong> {offer.description}</div>
                <div><strong>Código:</strong> <Badge>{offer.couponCode}</Badge></div>
                <div><strong>Desconto:</strong> {offer.discount}</div>
                <div><strong>Validade:</strong> {format(new Date(offer.validUntil), 'dd/MM/yyyy')}</div>
                <div><strong>Termos:</strong> {offer.terms}</div>
            </div>
        </DialogContent>
    )
}

const EventDetailsModal = ({ eventId }: { eventId: string | null }) => {
    if (!eventId) return null;
    const event = getEventById(eventId);
    if(!event) return null;

    return (
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle>Detalhes do Evento</DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4 text-sm">
                <div><strong>Título:</strong> {event.title}</div>
                <div><strong>Empresa:</strong> {event.businessName}</div>
                <div><strong>Descrição:</strong> {event.description}</div>
                <div><strong>Data:</strong> {format(parseISO(event.date), 'dd/MM/yyyy HH:mm')}</div>
                <div><strong>Limite por Usuário:</strong> {event.limitPerUser}</div>
            </div>
        </DialogContent>
    )
}


export default function AdminConteudoPage() {
  const [activeTab, setActiveTab] = useState<ContentType>('ofertas');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
  const [offers, setOffers] = useState(businessOffers);
  const [events, setEvents] = useState(businessEvents);
  
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const filteredAndSortedData = useMemo(() => {
    let items = activeTab === 'ofertas' ? [...offers] : [...events];

    // Search filter
    if (searchQuery) {
        items = items.filter(item => 
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.businessName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    // Status filter
    if (statusFilter !== 'todos') {
        items = items.filter(item => {
            const endDate = new Date(activeTab === 'ofertas' ? (item as typeof offers[0]).validUntil : (item as typeof events[0]).date);
            const isActive = endDate >= new Date();
            return statusFilter === 'ativo' ? isActive : !isActive;
        });
    }

    // Sort by end date descending
    items.sort((a, b) => {
        const dateA = new Date(activeTab === 'ofertas' ? (a as typeof offers[0]).validUntil : (a as typeof events[0]).date).getTime();
        const dateB = new Date(activeTab === 'ofertas' ? (b as typeof offers[0]).validUntil : (b as typeof events[0]).date).getTime();
        return dateB - dateA;
    });

    return items;
  }, [searchQuery, activeTab, offers, events, statusFilter]);

  const handleDelete = (id: string, type: ContentType) => {
      if (type === 'ofertas') {
          setOffers(prev => prev.filter(o => o.id !== id));
      } else {
          setEvents(prev => prev.filter(e => e.id !== id));
      }
  }

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <AdminHeader title="Gerenciar Conteúdo" />

      <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedItemId(null)}>
        <Tabs defaultValue="ofertas" onValueChange={(value) => setActiveTab(value as ContentType)} className="w-full">
            <div className="flex items-center">
                <TabsList>
                    <TabsTrigger value="ofertas" className="gap-2"><Gift className="h-4 w-4"/>Ofertas</TabsTrigger>
                    <TabsTrigger value="eventos" className="gap-2"><Ticket className="h-4 w-4"/>Eventos</TabsTrigger>
                </TabsList>
                <div className="ml-auto flex items-center gap-2">
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
                        <DropdownMenuRadioGroup value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                             <DropdownMenuRadioItem value="todos">Todos</DropdownMenuRadioItem>
                             <DropdownMenuRadioItem value="ativo">Ativo</DropdownMenuRadioItem>
                             <DropdownMenuRadioItem value="expirado">Expirado</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            
            <Card className="mt-4">
            <CardHeader>
                <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Buscar por título ou empresa..."
                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                </div>
            </CardHeader>
            <CardContent>
                <TabsContent value="ofertas">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Título da Oferta</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>
                        <span className="sr-only">Ações</span>
                        </TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredAndSortedData.map((item) => {
                        const offer = item as typeof offers[0];
                        const isExpired = new Date(offer.validUntil) < new Date();
                        return (
                            <TableRow key={offer.id}>
                                <TableCell className="font-medium">{offer.title}</TableCell>
                                <TableCell>{offer.businessName}</TableCell>
                                <TableCell>
                                <Badge variant={isExpired ? 'destructive' : 'default'} className={isExpired ? 'bg-orange-600/20 text-orange-400 border-none' : 'bg-lime-500/10 text-lime-300 border-lime-400/20'}>
                                    {isExpired ? 'Expirada' : 'Vigente'}
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
                                            <DialogTrigger asChild>
                                                <DropdownMenuItem onClick={() => setSelectedItemId(offer.id)}><Eye className="mr-2 h-4 w-4" />Visualizar Detalhes</DropdownMenuItem>
                                            </DialogTrigger>
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
                                                Esta ação não pode ser desfeita. Isso excluirá permanentemente a oferta "{offer.title}".
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(offer.id, 'ofertas')} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
                </TabsContent>
                
                <TabsContent value="eventos">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Nome do Evento</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>
                        <span className="sr-only">Ações</span>
                        </TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredAndSortedData.map((item) => {
                        const event = item as typeof events[0];
                        const isPast = new Date(event.date) < new Date();
                        return (
                            <TableRow key={event.id}>
                                <TableCell className="font-medium">{event.title}</TableCell>
                                <TableCell>{event.businessName}</TableCell>
                                <TableCell>
                                  {(() => {
                                    try {
                                      if (!event.date) return "Sem data";

                                      let dateValue;

                                      // 🔹 Case it's a Firestore timestamp
                                      if ((event.date as any).seconds) {
                                        dateValue = new Date((event.date as any).seconds * 1000);
                                      }
                                      // 🔹 Case it's an ISO string (2025-10-27T15:00:00Z)
                                      else if (typeof event.date === "string" && !isNaN(Date.parse(event.date))) {
                                        dateValue = parseISO(event.date);
                                      }
                                      // 🔹 Case it's a BR string (27/10/2025 15:00)
                                      else if (typeof event.date === "string" && event.date.includes("/")) {
                                        const [day, month, yearAndTime] = event.date.split("/");
                                        const [year, time] = yearAndTime.split(" ");
                                        dateValue = new Date(`${year}-${month}-${day}T${time || "00:00"}`);
                                      } 
                                      // 🔹 Case it's already a Date object
                                      else if (event.date instanceof Date) {
                                        dateValue = event.date;
                                      }

                                      if (!dateValue || isNaN(dateValue.getTime())) {
                                        return "Data inválida";
                                      }

                                      return format(dateValue, "dd/MM/yyyy HH:mm");
                                    } catch (err) {
                                      console.warn("Erro ao formatar data:", event.date, err);
                                      return "Data inválida";
                                    }
                                  })()}
                                </TableCell>
                                <TableCell>
                                <Badge variant={isPast ? 'destructive' : 'default'} className={isPast ? 'bg-orange-600/20 text-orange-400 border-none' : 'bg-lime-500/10 text-lime-300 border-lime-400/20'}>
                                    {isPast ? 'Finalizado' : 'Futuro'}
                                </Badge>
                                </TableCell>
                                <TableCell>
                                    <AlertDialog>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost" >
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                            <DialogTrigger asChild>
                                                <DropdownMenuItem onClick={() => setSelectedItemId(event.id)}><Eye className="mr-2 h-4 w-4" />Visualizar Detalhes</DropdownMenuItem>
                                            </DialogTrigger>
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
                                                Esta ação não pode ser desfeita. Isso excluirá permanentemente o evento "{event.title}".
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(event.id, 'eventos')} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
                </TabsContent>
            </CardContent>
            </Card>
        </Tabs>
        
        {activeTab === 'ofertas' && <OfferDetailsModal offerId={selectedItemId} />}
        {activeTab === 'eventos' && <EventDetailsModal eventId={selectedItemId} />}

      </Dialog>
    </main>
  );
}
