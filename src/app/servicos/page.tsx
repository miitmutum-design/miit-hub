'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { businesses } from '@/lib/data';
import BusinessListItem from '@/components/BusinessListItem';

const serviceBusinesses = businesses.filter(b => b.category === 'Serviços' || b.id === '1' || b.id === '2'); // Mocking some services

export default function ServicesPage() {
  return (
    <div className="container mx-auto max-w-3xl py-6 sm:py-8">
      <header className="relative mb-6 flex items-center justify-center text-center">
        <Link href="/categoria" className="absolute left-0">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-primary font-headline">
          Serviços
        </h1>
      </header>
      
      <div className="px-4 mb-6">
        <p className="text-sm text-muted-foreground">
          {serviceBusinesses.length} empresas encontradas
        </p>
      </div>

      <section className="space-y-4">
        {serviceBusinesses.map((business) => (
          <Link key={business.id} href={`/business/${business.id}`} className="block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
             <BusinessListItem business={business} />
          </Link>
        ))}
      </section>
    </div>
  );
}
