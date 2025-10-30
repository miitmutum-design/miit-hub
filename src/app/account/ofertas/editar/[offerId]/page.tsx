
'use client';

import React from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import { mockOffers } from '@/app/account/ofertas/historico/page';


export default function EditOfferPage() {
  const params = useParams();
  const offerId = params.offerId as string;
  const offer = mockOffers.find(o => o.id === offerId);

  if (!offer) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-lg py-6 sm:py-8">
      <header className="relative mb-8 flex items-center justify-center text-center">
        <Link href="/account/ofertas/historico" className="absolute left-0">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground font-headline">
          Editar Oferta
        </h1>
      </header>
      
      <div className="space-y-6 bg-card p-6 rounded-lg">
        <div className="text-center text-muted-foreground py-10">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <h2 className="mt-4 text-xl font-semibold text-foreground">Carregando Detalhes...</h2>
          <p>A tela de edição para "{offer.title}" está em construção.</p>
        </div>
      </div>
    </div>
  );
}
