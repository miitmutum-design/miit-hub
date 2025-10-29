
'use client';

import { ArrowLeft, Rss, Gift, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { businesses, businessOffers, businessEvents } from '@/lib/data';
import BusinessListItem from '@/components/BusinessListItem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Mocking "new" items for demonstration
const newBusinesses = businesses.slice(0, 2);
const newOffers = businessOffers.slice(0, 1);
const newEvents = businessEvents.slice(0, 1);

export default function NotificationsPage() {
    const router = useRouter();

  return (
    <div className="container mx-auto max-w-3xl py-6 sm:py-8">
      <header className="relative mb-8 flex items-center justify-center text-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="absolute left-0">
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
        </Button>
        <h1 className="text-2xl font-bold text-primary font-headline">
          Notificações
        </h1>
      </header>

      <section className="space-y-6">
        <div>
            <h2 className="text-xl font-semibold font-headline mb-4 flex items-center gap-2 text-primary">
                <Rss className="w-6 h-6 text-primary"/>
                Novas Empresas
            </h2>
            <div className="space-y-4">
                {newBusinesses.map((business) => (
                <Link key={business.id} href={`/business/${business.id}`} className="block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
                    <BusinessListItem business={business} />
                </Link>
                ))}
            </div>
        </div>
        
        <div>
            <h2 className="text-xl font-semibold font-headline mb-4 flex items-center gap-2 text-primary">
                <Gift className="w-6 h-6 text-yellow-400"/>
                Novas Ofertas
            </h2>
             <div className="space-y-4">
                {newOffers.map(offer => (
                    <Link key={offer.id} href={`/negocio/offers/${offer.id}`} className="block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
                        <Card className="bg-card border-border/50 transition-all duration-300 hover:border-primary/70 hover:shadow-lg hover:shadow-primary/20">
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground">{offer.businessName}</p>
                                <p className="font-bold text-foreground mt-1">{offer.title}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>

        <div>
            <h2 className="text-xl font-semibold font-headline mb-4 flex items-center gap-2 text-primary">
                <Calendar className="w-6 h-6 text-cyan-400"/>
                Novos Eventos
            </h2>
             <div className="space-y-4">
                {newEvents.map(event => (
                    <Link key={event.id} href={`/negocio/eventos/${event.id}`} className="block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
                        <Card className="bg-card border-border/50 transition-all duration-300 hover:border-primary/70 hover:shadow-lg hover:shadow-primary/20">
                            <CardContent className="p-4">
                                <p className="text-sm text-muted-foreground">{event.businessName}</p>
                                <p className="font-bold text-foreground mt-1">{event.title}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>

      </section>
    </div>
  );
}
