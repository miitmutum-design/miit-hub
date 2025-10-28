'use client';

import { ArrowLeft, Calendar, Ticket, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCompany } from '@/contexts/CompanyContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function EventsPage() {
  const { claimedEvents } = useCompany();
  const activeEvents = claimedEvents.filter(event => new Date(event.date) > new Date());

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
          Eventos Salvos
        </h1>
      </header>

      {activeEvents.length > 0 ? (
        <section className="space-y-4">
          {activeEvents.map((event) => (
            <Link key={event.id} href={`/negocio/eventos/${event.id}`} className="block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
              <Card className="overflow-hidden bg-card border-border/50 transition-all duration-300 hover:border-primary/70 hover:shadow-lg hover:shadow-primary/20">
                <CardHeader className="p-0 relative h-32 bg-gradient-to-br from-indigo-900/40 via-blue-800/20 to-card flex items-center justify-center">
                   <Ticket className="h-16 w-16 text-cyan-400 drop-shadow-lg" strokeWidth={1.5} />
                </CardHeader>
                <CardContent className="p-4 space-y-2">
                    <p className="text-sm text-muted-foreground">{event.businessName}</p>
                    <h3 className="text-xl font-bold text-foreground font-headline">{event.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.date).toLocaleDateString('pt-BR', { dateStyle: 'full' })}</span>
                    </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg bg-card">
          <Calendar className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-semibold font-headline">Nenhum evento salvo</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            Você ainda não demonstrou interesse em nenhum evento. Gere um ingresso para que ele apareça aqui.
          </p>
        </div>
      )}
    </div>
  );
}
