
'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Ticket, Trash2, CheckCircle, XCircle, Pencil, Copy, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
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
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { businessEvents } from '@/lib/data';


// Mock data for events
export const mockEvents = businessEvents;


const EventCard = ({ event, onDelete }: { event: typeof mockEvents[0], onDelete: (id: string) => void }) => {
    const isExpired = new Date(event.date) < new Date();
    const { toast } = useToast();
    const router = useRouter();
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        const date = new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        setFormattedDate(date);
    }, [event.date]);

    const handleDuplicate = () => {
        toast({
            title: "Duplicando Evento...",
            description: "Você será redirecionado para criar um novo evento com base neste."
        });
        setTimeout(() => router.push('/account/eventos/nova'), 1500);
    }

    const handleEdit = () => {
        toast({ title: 'Em breve!', description: 'A funcionalidade de editar eventos será implementada.'})
        // router.push(`/account/eventos/editar/${event.id}`);
    }

    return (
        <Card className="bg-card border-border/50">
            <CardContent className="p-4">
               <div className="flex items-start gap-4">
                 <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                    <Ticket className="w-8 h-8 text-muted-foreground"/>
                 </div>
                <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h3 className="font-bold text-foreground leading-tight">
                               {event.title}
                            </h3>
                             <p className="text-xs text-muted-foreground">{event.description}</p>
                        </div>
                        <Badge variant={isExpired ? 'destructive' : 'default'} className={isExpired ? 'bg-orange-600/20 text-orange-400 border-none' : 'bg-lime-500/10 text-lime-300 border-lime-400/20'}>
                            {isExpired ? 'Encerrado' : 'Agendado'}
                       </Badge>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-y-2 text-sm">
                        <div className="flex items-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                <span>{formattedDate}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isExpired ? (
                                 <Button variant="outline" size="sm" onClick={handleDuplicate}>
                                    <Copy className="w-3.5 h-3.5 mr-1.5"/>
                                    Duplicar
                                </Button>
                            ) : (
                                <Button variant="outline" size="sm" onClick={handleEdit}>
                                    <Pencil className="w-3.5 h-3.5 mr-1.5"/>
                                    Editar
                                </Button>
                            )}

                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                     <Button variant="ghost" size="icon" className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 h-8 w-8">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. Isso excluirá permanentemente o evento.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => onDelete(event.id)} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </div>
               </div>
            </CardContent>
        </Card>
    );
};


export default function EventHistoryPage() {
    const [events, setEvents] = useState(mockEvents);
    const { toast } = useToast();

    const handleDelete = (id: string) => {
        setEvents(prev => prev.filter(event => event.id !== id));
        toast({
            title: "Evento Excluído",
            description: "O evento foi removido do seu histórico."
        });
    };

    const activeEvents = events.filter(o => new Date(o.date) >= new Date());
    const expiredEvents = events.filter(o => new Date(o.date) < new Date());

  return (
    <div className="container mx-auto max-w-lg py-6 sm:py-8">
      <header className="relative mb-4 flex items-center justify-center text-center">
        <Link href="/account/profile/events" className="absolute left-0">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground font-headline">
          Histórico de Eventos
        </h1>
      </header>
      
      <Tabs defaultValue="presente" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-card mb-6">
            <TabsTrigger value="presente">Presente</TabsTrigger>
            <TabsTrigger value="passado">Passado</TabsTrigger>
        </TabsList>
        <TabsContent value="presente">
            <div className="space-y-4">
                {activeEvents.length > 0 ? (
                    activeEvents.map(event => <EventCard key={event.id} event={event} onDelete={handleDelete} />)
                ) : (
                    <div className="text-center p-8 border-2 border-dashed rounded-lg bg-card text-muted-foreground">
                       <CheckCircle className="mx-auto w-12 h-12 mb-4 opacity-50" />
                       <h3 className="font-semibold text-lg text-foreground">Nenhum evento futuro</h3>
                       <p>Não há eventos agendados no momento.</p>
                    </div>
                )}
            </div>
        </TabsContent>
        <TabsContent value="passado">
             <div className="space-y-4">
                {expiredEvents.length > 0 ? (
                    expiredEvents.map(event => <EventCard key={event.id} event={event} onDelete={handleDelete} />)
                ) : (
                    <div className="text-center p-8 border-2 border-dashed rounded-lg bg-card text-muted-foreground">
                        <XCircle className="mx-auto w-12 h-12 mb-4 opacity-50" />
                       <h3 className="font-semibold text-lg text-foreground">Nenhum registro</h3>
                       <p>Nenhum evento encerrado encontrado.</p>
                    </div>
                )}
            </div>
        </TabsContent>
        </Tabs>
    </div>
  );
}
