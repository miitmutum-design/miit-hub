'use client';

import { ArrowLeft, Gift, Ticket, Clock, Badge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCompany } from '@/contexts/CompanyContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function OffersPage() {
  const { claimedOffers } = useCompany();
  const activeOffers = claimedOffers.filter(offer => new Date(offer.validUntil) > new Date());

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

      {activeOffers.length > 0 ? (
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
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg bg-card">
          <Gift className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-semibold font-headline">Nenhuma oferta para você</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            Gere ofertas nas páginas das empresas para que elas apareçam aqui.
          </p>
        </div>
      )}
    </div>
  );
}
