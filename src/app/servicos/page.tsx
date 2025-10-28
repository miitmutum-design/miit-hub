import { ArrowLeft, Star, MapPin, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const serviceBusinesses = [
  {
    id: 'serv-1',
    name: 'União Construtora',
    category: 'Serviços',
    rating: 4.8,
    reviews: 156,
    distance: '0.5 km',
  },
  {
    id: 'serv-2',
    name: 'Build Master',
    category: 'Serviços',
    rating: 4.6,
    reviews: 89,
    distance: '1.2 km',
  },
  {
    id: 'serv-3',
    name: 'Construtora Nova Era',
    category: 'Serviços',
    rating: 4.9,
    reviews: 203,
    distance: '2.1 km',
  },
];

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
          <Link key={business.id} href="#" className="block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
            <div className="bg-card p-4 rounded-lg flex items-center gap-4 transition-all duration-300 hover:shadow-md hover:border-primary/50 border border-transparent">
              <div className="relative">
                <div className="bg-muted p-4 rounded-lg flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="absolute -top-1 -left-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-card">
                  24
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg font-headline">{business.name}</h3>
                <p className="text-sm text-muted-foreground">{business.category}</p>
                <div className="flex items-center gap-4 text-sm mt-1 text-muted-foreground">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-semibold text-foreground">{business.rating}</span>
                    <span className="text-muted-foreground">({business.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    <span>{business.distance}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
