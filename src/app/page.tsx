
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BusinessCard from '@/components/BusinessCard';
import { businesses, type Business } from '@/lib/data';
import HomeHeader from '@/components/common/HomeHeader';
import { mockCompanyProfiles } from '@/contexts/CompanyContext';
import { isCompanyActuallyOpen } from '@/lib/availability';
import SearchBar from '@/components/common/SearchBar';
import PremiumCarousel from '@/components/common/PremiumCarousel';
import CategoryCarousel from '@/components/common/CategoryCarousel';
import SponsorsGrid from '@/components/common/SponsorsGrid';

export default function Home() {
  const [availableBusinesses, setAvailableBusinesses] = useState<Business[]>([]);

  // This logic now runs only on the client, after hydration, preventing the error.
  useEffect(() => {
    const filtered = businesses.filter(business => {
      // This is a mock join, in a real app this would be a single data source
      const profile = mockCompanyProfiles[business.id as keyof typeof mockCompanyProfiles];
      const fullProfile = { ...business, ...profile };
      return isCompanyActuallyOpen(fullProfile);
    });
    setAvailableBusinesses(filtered);
  }, []);

  return (
    <div className="container mx-auto max-w-3xl pt-6 sm:pt-8 pb-10">
      <HomeHeader />

      <div className="relative mb-6">
        <SearchBar />
      </div>

      <div className="mb-8">
        <PremiumCarousel />
      </div>

      <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold font-headline">Categorias</h2>
              <Link href="/categoria">
                  <span className="text-sm font-semibold text-primary hover:underline">Ver Todas</span>
              </Link>
          </div>
          <CategoryCarousel />
      </section>

      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold font-headline">Patrocinadores</h2>
        </div>
        <SponsorsGrid />
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold font-headline">Aberto Agora</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableBusinesses.map((business) => (
            <Link key={business.id} href={`/business/${business.id}`} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
              <BusinessCard business={business} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
