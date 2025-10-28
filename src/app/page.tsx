'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import BusinessCard from '@/components/BusinessCard';
import { Input } from '@/components/ui/input';
import { businesses } from '@/lib/data';
import HomeHeader from '@/components/common/HomeHeader';

export default function Home() {
  return (
    <div className="container mx-auto max-w-3xl py-6 sm:py-8">
      <HomeHeader />

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search coffee shops, bookstores..." className="pl-10 h-12 text-base" />
      </div>

      <section>
        <h2 className="text-2xl font-semibold tracking-tight mb-4 font-headline">Featured Businesses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {businesses.map((business) => (
            <Link key={business.id} href={`/business/${business.id}`} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
              <BusinessCard business={business} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
