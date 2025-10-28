import { ArrowLeft, Clock, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const offers = [
  {
    id: '1',
    companyId: '3',
    businessName: 'Flor de Lótus Móveis',
    title: '50% OFF em Sofás',
    validUntil: '31/12',
    discount: '50%',
  },
  {
    id: '2',
    companyId: '4',
    businessName: 'Bellinha Kids',
    title: 'Compre 2 Leve 3',
    validUntil: '25/12',
    discount: '33%',
  },
  {
    id: '3',
    companyId: '1',
    businessName: 'Clínica Acolher Life',
    title: 'Consulta por R$ 80',
    validUntil: '15/01',
    discount: '40%',
  },
];

export default function OffersPage() {
  return (
    <div className="container mx-auto max-w-3xl py-6 sm:py-8">
      <header className="relative mb-8 flex items-center justify-center text-center">
        <Link href="/" className="absolute left-0">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-primary font-headline">
          Ofertas Especiais
        </h1>
      </header>

      <section className="space-y-4">
        {offers.map((offer) => (
          <Link key={offer.id} href={`/negocio/offers/${offer.id}`} className="block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
            <Card className="overflow-hidden bg-card border-border/50 transition-all duration-300 hover:border-primary/70 hover:shadow-lg hover:shadow-primary/20">
              <CardHeader className="p-0 relative h-32 bg-gradient-to-br from-green-900/40 via-green-800/20 to-card">
                 <div className="absolute top-3 right-3">
                   <Badge className="bg-lime-400 text-lime-900 font-bold hover:bg-lime-400/90 text-sm">
                     {offer.discount}
                   </Badge>
                 </div>
                 <div className="absolute top-8 left-1/2 -translate-x-1/2">
                  <Gift className="h-16 w-16 text-yellow-400 drop-shadow-lg" strokeWidth={1.5} />
                 </div>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                  <p className="text-sm text-muted-foreground">{offer.businessName}</p>
                  <h3 className="text-xl font-bold text-foreground font-headline">{offer.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-1">
                      <Clock className="h-4 w-4" />
                      <span>Válido até {offer.validUntil}</span>
                  </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
