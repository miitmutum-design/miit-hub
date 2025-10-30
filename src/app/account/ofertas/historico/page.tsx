
'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Gift, Trash2, CheckCircle, XCircle, Pencil, Copy, Loader2 } from 'lucide-react';
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


// Mock data for offers
export const mockOffers = [
    { id: '1', title: '20% OFF em Cafés', description: 'Qualquer café do cardápio com 20% de desconto.', startDate: '2024-07-01', endDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(), status: 'Vigente', imageUrl: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw2fHxjb2ZmZWUlMjBzaG9wfGVufDB8fHx8MTc2MTYwMDgwOHww&ixlib=rb-4.1.0&q=80&w=1080', discount: '20%' },
    { id: '2', title: 'Compre 1 Leve 2 em Salgados', description: 'Na compra de qualquer salgado, o segundo é por nossa conta.', startDate: '2024-08-01', endDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString(), status: 'Vigente', imageUrl: null, discount: '50%' },
    { id: '3', title: 'Promoção Dia dos Pais', description: 'Traga seu pai e o café dele é de graça.', startDate: '2024-06-10', endDate: '2024-06-16', status: 'Expirada', imageUrl: null, discount: 'R$15' },
    { id: '4', title: 'Desconto de Aniversário', description: '15% de desconto no mês do seu aniversário.', startDate: '2024-01-01', endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(), status: 'Vigente', imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxhbmFseXRpY3N8ZW58MHx8fHwxNzYxNjg3NTc4fDA&ixlib=rb-4.1.0&q=80&w=1080', discount: '15%' },
    { id: '5', title: 'Oferta de Inverno', description: 'Chocolate quente por apenas R$10.', startDate: '2024-05-20', endDate: '2024-07-20', status: 'Expirada', imageUrl: null, discount: 'R$10' },
];


const OfferCard = ({ offer, onDelete }: { offer: typeof mockOffers[0], onDelete: (id: string) => void }) => {
    const isExpired = new Date(offer.endDate) < new Date();
    const { toast } = useToast();
    const router = useRouter();
    const [formattedDates, setFormattedDates] = useState('');

    useEffect(() => {
        const start = new Date(offer.startDate).toLocaleDateString();
        const end = new Date(offer.endDate).toLocaleDateString();
        setFormattedDates(`${start} - ${end}`);
    }, [offer.startDate, offer.endDate]);

    const handleDuplicate = () => {
        toast({
            title: "Duplicando Oferta...",
            description: "Você será redirecionado para criar uma nova oferta com base nesta."
        });
        // In a real app, you would pass the offer data to the creation page
        setTimeout(() => router.push('/account/ofertas/nova'), 1500);
    }

    const handleEdit = () => {
        router.push(`/account/ofertas/editar/${offer.id}`);
    }

    return (
        <Card className="bg-card border-border/50">
            <CardContent className="p-4">
               <div className="flex items-start gap-4">
                 {offer.imageUrl ? (
                    <Image
                        src={offer.imageUrl}
                        alt={offer.title}
                        width={80}
                        height={80}
                        className="rounded-md object-cover aspect-square"
                    />
                ) : (
                    <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                        <Gift className="w-8 h-8 text-muted-foreground"/>
                    </div>
                )}
                <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <h3 className="font-bold text-foreground leading-tight">
                               {offer.title}
                            </h3>
                             <p className="text-xs text-muted-foreground">{offer.description}</p>
                        </div>
                        <Badge variant={isExpired ? 'destructive' : 'default'} className={isExpired ? 'bg-orange-600/20 text-orange-400 border-none' : 'bg-lime-500/10 text-lime-300 border-lime-400/20'}>
                            {isExpired ? 'Expirada' : 'Vigente'}
                       </Badge>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-y-2 text-sm">
                        <div className="flex items-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                <span>{formattedDates}</span>
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
                                        Esta ação não pode ser desfeita. Isso excluirá permanentemente a oferta.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => onDelete(offer.id)} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
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


export default function OfferHistoryPage() {
    const [offers, setOffers] = useState(mockOffers);
    const { toast } = useToast();

    const handleDelete = (id: string) => {
        setOffers(prev => prev.filter(offer => offer.id !== id));
        toast({
            title: "Oferta Excluída",
            description: "A oferta foi removida do seu histórico."
        });
    };

    const activeOffers = offers.filter(o => new Date(o.endDate) >= new Date());
    const expiredOffers = offers.filter(o => new Date(o.endDate) < new Date());

  return (
    <div className="container mx-auto max-w-lg py-6 sm:py-8">
      <header className="relative mb-4 flex items-center justify-center text-center">
        <Link href="/account/profile/offers" className="absolute left-0">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground font-headline">
          Histórico de Ofertas
        </h1>
      </header>
      
      <Tabs defaultValue="presente" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-card mb-6">
            <TabsTrigger value="presente">Presente</TabsTrigger>
            <TabsTrigger value="passado">Passado</TabsTrigger>
        </TabsList>
        <TabsContent value="presente">
            <div className="space-y-4">
                {activeOffers.length > 0 ? (
                    activeOffers.map(offer => <OfferCard key={offer.id} offer={offer} onDelete={handleDelete} />)
                ) : (
                    <div className="text-center p-8 border-2 border-dashed rounded-lg bg-card text-muted-foreground">
                       <CheckCircle className="mx-auto w-12 h-12 mb-4 opacity-50" />
                       <h3 className="font-semibold text-lg text-foreground">Tudo em dia!</h3>
                       <p>Nenhuma oferta vigente no momento.</p>
                    </div>
                )}
            </div>
        </TabsContent>
        <TabsContent value="passado">
             <div className="space-y-4">
                {expiredOffers.length > 0 ? (
                    expiredOffers.map(offer => <OfferCard key={offer.id} offer={offer} onDelete={handleDelete} />)
                ) : (
                    <div className="text-center p-8 border-2 border-dashed rounded-lg bg-card text-muted-foreground">
                        <XCircle className="mx-auto w-12 h-12 mb-4 opacity-50" />
                       <h3 className="font-semibold text-lg text-foreground">Nenhum registro</h3>
                       <p>Nenhuma oferta expirada encontrada.</p>
                    </div>
                )}
            </div>
        </TabsContent>
        </Tabs>
    </div>
  );
}
