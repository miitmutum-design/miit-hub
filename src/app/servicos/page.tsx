

'use client';

import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { businesses } from '@/lib/data';
import BusinessListItem from '@/components/BusinessListItem';
import { isCompanyActuallyOpen } from '@/lib/availability';
import { mockCompanyProfiles } from '@/contexts/CompanyContext';
import React from 'react';

const SearchResults = ({ searchParams }: { searchParams: { q?: string } }) => {
  const query = searchParams.q || 'Serviços';

  const formattedQuery = query.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

  const searchedBusinesses = businesses.filter(business => {
      const profile = mockCompanyProfiles[business.id as keyof typeof mockCompanyProfiles];
      const fullProfile = { ...business, ...profile };
      
      if (!isCompanyActuallyOpen(fullProfile)) {
          return false;
      }
      
      const searchTerm = query.toLowerCase();
      const nameMatch = business.name.toLowerCase().includes(searchTerm);
      const categoryMatch = business.category.toLowerCase().includes(searchTerm);

      return nameMatch || categoryMatch;
  });

  return (
    <div className="container mx-auto max-w-3xl py-6 sm:py-8">
      <header className="relative mb-6 flex items-center justify-center text-center">
        <Link href="/" className="absolute left-0">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-primary font-headline">
          Resultados para "{formattedQuery}"
        </h1>
      </header>
      
      <div className="px-4 mb-6">
        <p className="text-sm text-muted-foreground">
          {searchedBusinesses.length} empresas encontradas
        </p>
      </div>

      <section className="space-y-4">
        {searchedBusinesses.length > 0 ? (
          searchedBusinesses.map((business) => (
            <Link key={business.id} href={`/business/${business.id}`} className="block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
               <BusinessListItem business={business} />
            </Link>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">Nenhuma empresa encontrada.</p>
          </div>
        )}
      </section>
    </div>
  );
};

const ServicesPageContent = ({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
    const unwrappedSearchParams = React.use(searchParams);
    return <SearchResults searchParams={unwrappedSearchParams as { q?: string }} />;
}


export default function ServicesPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <ServicesPageContent searchParams={searchParams} />
        </Suspense>
    )
}
