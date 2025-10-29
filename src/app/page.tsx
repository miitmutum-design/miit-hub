
'use client';

import Link from 'next/link';
import BusinessCard from '@/components/BusinessCard';
import { businesses } from '@/lib/data';
import HomeHeader from '@/components/common/HomeHeader';
import { mockCompanyProfiles } from '@/contexts/CompanyContext';
import { isCompanyActuallyOpen } from '@/lib/availability';
import SearchBar from '@/components/common/SearchBar';
import PremiumCarousel from '@/components/common/PremiumCarousel';

export default function Home() {
  
  // This is a mock implementation. In a real app, this data would be fetched
  // and we would need to check the 'isAvailable' status of each company profile.
  const availableBusinesses = businesses.filter(business => {
    // This is a mock join, in a real app this would be a single data source
    const profile = mockCompanyProfiles[business.id as keyof typeof mockCompanyProfiles];
    const fullProfile = { ...business, ...profile };
    return isCompanyActuallyOpen(fullProfile);
  });

  return (
    <div className="container mx-auto max-w-3xl py-6 sm:py-8">
      <HomeHeader />

      <div className="relative mb-6">
        <SearchBar />
      </div>

      <div className="mb-8">
        <PremiumCarousel />
      </div>

      <section>
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
