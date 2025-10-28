import Link from 'next/link';
import { Search } from 'lucide-react';
import BusinessCard from '@/components/BusinessCard';
import { Input } from '@/components/ui/input';
import { businesses } from '@/lib/data';

export default function Home() {
  return (
    <div className="container mx-auto max-w-3xl py-6 sm:py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary font-headline">Local Hub</h1>
        <p className="text-muted-foreground mt-2 text-lg">Discover the best businesses near you</p>
      </header>

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
