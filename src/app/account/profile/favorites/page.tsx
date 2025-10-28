'use client';

import { ArrowLeft, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCompany } from '@/contexts/CompanyContext';
import { businesses } from '@/lib/data';
import BusinessListItem from '@/components/BusinessListItem';

export default function FavoritesPage() {
  const { favorites } = useCompany();
  const favoritedBusinesses = businesses.filter(b => favorites.includes(b.id));

  return (
    <div className="container mx-auto max-w-3xl py-6 sm:py-8">
      <header className="relative mb-8 flex items-center justify-center text-center">
        <Link href="/account/profile/config" className="absolute left-0">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground font-headline">
          Empresas Favoritadas
        </h1>
      </header>

      {favoritedBusinesses.length > 0 ? (
        <section>
          <div className="space-y-4">
            {favoritedBusinesses.map((business) => (
              <Link key={business.id} href={`/business/${business.id}`} className="block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
                <BusinessListItem business={business} />
              </Link>
            ))}
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg bg-card">
          <Bookmark className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-semibold font-headline">Nenhum favorito ainda</h2>
          <p className="text-muted-foreground mt-2 max-w-sm">
            Use o ícone de marcador nas páginas das empresas para salvá-las aqui.
          </p>
        </div>
      )}
    </div>
  );
}
