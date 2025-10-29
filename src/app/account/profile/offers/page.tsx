
'use client';

import { ArrowLeft, Gift, Ticket, Clock, Badge, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCompany } from '@/contexts/CompanyContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function OffersPage() {
  const { claimedOffers } = useCompany();
  const { toast } = useToast();
  const activeOffers = claimedOffers.filter(offer => new Date(offer.validUntil) > new Date());

  const handleCreateOffer = () => {
      toast({
        title: "Funcionalidade em Breve",
        description: `A criação de novas ofertas será implementada em breve.`,
      });
  };


  return (
    <div className="container mx-auto max-w-lg py-6 sm:py-8">
      <header className="relative mb-8 flex items-center justify-center text-center">
        <Link href="/account/profile/config" className="absolute left-0">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground font-headline">
          Minhas Ofertas
        </h1>
      </header>

      <section className="space-y-4">
        {activeOffers.map((offer) => (
          <Link key={offer.id} href={`/negocio/offers/${offer.id}`} className="block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
            <Card className="overflow-hidden bg-card border-border/50 transition-all duration-300 hover:border-primary/70 hover:shadow-lg hover:shadow-primary/20">
              <CardHeader className="p-0 relative h-32 bg-gradient-to-br from-green-900/40 via-green-800/20 to-card">
                 <div className="absolute top-3 right-3">
                   <span className="bg-lime-400 text-lime-900 font-bold text-sm px-3 py-1 rounded-full">
                     {offer.discount}
                   </span>
                 </div>
                 <div className="absolute top-8 left-1/2 -translate-x-1/2">
                  <Gift className="h-16 w-16 text-yellow-400 drop-shadow-lg" strokeWidth={1.5} />
                 </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                  <p className="text-sm text-muted-foreground">{offer.businessName}</p>
                  <h3 className="text-xl font-bold text-foreground font-headline">{offer.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                      <Clock className="h-4 w-4" />
                      <span>Válido até {new Date(offer.validUntil).toLocaleDateString()}</span>
                  </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <div className="fixed bottom-20 left-0 right-0 p-4 bg-background border-t border-border/50 md:static md:bg-transparent md:border-t-0 md:p-0 md:mt-8">
            <Button
            size="lg"
            className="w-full h-12 text-lg bg-orange-600 hover:bg-orange-700 text-white font-bold"
            onClick={handleCreateOffer}
            >
            <PlusCircle className="mr-2 h-5 w-5" />
            Criar Nova Oferta
            </Button>
      </div>
    </div>
  );
}
