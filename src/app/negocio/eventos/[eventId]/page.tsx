
'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, FileText, Download, QrCode, Ticket, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useCompany } from '@/contexts/CompanyContext';
import { cn } from '@/lib/utils';
import { getEventById, type Event } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import React from 'react';

export default function EventDetailPage() {
  const params = useParams();
  const eventId = params.eventId as string;
  const event = getEventById(eventId);

  const { toast } = useToast();
  const { claimedEvents, claimEvent } = useCompany();

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  
  useEffect(() => {
    if (event) {
        setFormattedDate(new Date(event.date).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' }));
    }
  }, [event]);

  if (!event) {
      notFound();
  }

  const isExpired = new Date(event.date) < new Date();
  
  const timesClaimed = claimedEvents.filter(claimed => claimed.id === event.id).length;
  const isLimitReached = timesClaimed >= event.limitPerUser;


  const handleGenerateTicket = () => {
    if (isExpired || isLimitReached) return;
    claimEvent({
        id: event.id,
        companyId: event.companyId,
        businessName: event.businessName,
        title: event.title,
        date: event.date,
    }, event.limitPerUser);
  };
  
  const handleSaveToWallet = () => {
    toast({
      title: "Salvo com Sucesso!",
      description: "Seu ingresso digital foi salvo na sua carteira.",
    });
    setIsQrModalOpen(false);
  }

  const qrPayload = JSON.stringify({
    businessName: event.businessName,
    eventTitle: event.title,
    date: formattedDate,
    consumerId: 'user-demo-id-12345',
  });

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrPayload)}`;

  return (
    <div className="container mx-auto max-w-lg py-6 sm:py-8">
      <header className="relative mb-8 flex items-center justify-center text-center">
        <Link href={`/business/${event.companyId}`} className="absolute left-0">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground font-headline">
          Detalhes do Evento
        </h1>
      </header>
      
      {isExpired ? (
        <Card className="bg-card border-destructive/50">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h2 className="text-2xl font-semibold font-headline text-destructive">Evento Encerrado</h2>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Este evento já ocorreu. Fique de olho para os próximos!
            </p>
             <Link href={`/business/${event.companyId}`} className="mt-6">
                <Button variant="outline">
                    Ver outros eventos
                </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
      <Card className="overflow-hidden bg-card">
        <CardHeader className="p-0 relative h-40 bg-gradient-to-br from-indigo-900/40 via-blue-800/20 to-card flex items-center justify-center">
           <Ticket className="h-20 w-20 text-cyan-400 drop-shadow-lg" strokeWidth={1.5} />
        </CardHeader>
        <CardContent className="p-6 space-y-6">
            <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
                    {event.businessName}
                </p>
                <h2 className="text-3xl font-bold text-foreground font-headline mt-2">{event.title}</h2>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                <div className="flex items-start gap-4">
                    <Calendar className="h-5 w-5 text-primary mt-1 flex-shrink-0"/>
                    <div>
                        <p className="font-semibold">Data e Hora</p>
                        <p className="text-muted-foreground text-sm">O evento acontecerá em {formattedDate}</p>
                    </div>
                </div>
            </div>

            <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
                <DialogTrigger asChild>
                    <Button 
                      onClick={handleGenerateTicket} 
                      size="lg" 
                      className={cn(
                        "w-full h-12 text-lg font-bold transition-colors",
                        isLimitReached
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : "bg-lime-500 hover:bg-lime-600 text-black"
                      )}
                      disabled={isLimitReached}
                    >
                        {isLimitReached ? (
                          'Limite de ingressos atingido'
                        ) : (
                          <>
                            <QrCode className="mr-2 h-5 w-5"/>
                            Gerar Ingresso
                          </>
                        )}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-card border-border/50">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-bold font-headline">Seu Ingresso Digital</DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground pt-2">
                            Apresente este QR Code na entrada do evento para validar seu ingresso.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 flex flex-col items-center justify-center gap-6">
                        <div className="bg-white p-2 rounded-lg">
                           <Image
                            src={qrCodeUrl}
                            alt="QR Code do Ingresso"
                            width={250}
                            height={250}
                           />
                        </div>
                        <div className="text-center text-sm">
                            <p className="font-bold">{event.businessName}</p>
                            <p>{event.title}</p>
                            <p className="text-muted-foreground">Válido para {formattedDate}</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleSaveToWallet} className="w-full h-12">
                            <Download className="mr-2 h-5 w-5"/>
                            Salvar no Wallet
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><FileText className="h-4 w-4"/> Descrição do Evento</h3>
                <p className="text-sm text-muted-foreground">{event.description}</p>
            </div>

        </CardContent>
      </Card>
      )}
    </div>
  );
}
