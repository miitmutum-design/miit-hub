
import { ArrowLeft, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OffersPage() {
  return (
    <div className="container mx-auto max-w-lg py-6 sm:py-8">
      <header className="relative mb-8 flex items-center justify-center text-center">
        <Link href="/account/profile/config" className="absolute left-0">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground font-headline">
          Minhas Ofertas
        </h1>
      </header>

      <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg bg-card">
        <Gift className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-2xl font-semibold font-headline">Nenhuma oferta para você</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          As empresas podem enviar ofertas especiais para clientes engajados.
        </p>
      </div>
    </div>
  );
}
