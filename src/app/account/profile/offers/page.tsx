
'use client';

import { ArrowLeft, Gift, History, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

const ActionCard = ({ icon: Icon, title, description, href }: { icon: React.ElementType, title: string, description: string, href: string }) => (
    <Link href={href}>
        <Card className="bg-card border-border/50 transition-all duration-300 hover:border-primary/70 hover:shadow-lg hover:shadow-primary/20">
            <CardContent className="p-6 flex items-center gap-6">
                <Icon className="w-10 h-10 text-primary" />
                <div>
                    <h3 className="text-xl font-bold font-headline">{title}</h3>
                    <p className="text-muted-foreground mt-1">{description}</p>
                </div>
            </CardContent>
        </Card>
    </Link>
);


export default function OffersHubPage() {
  const router = useRouter();

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
          Gerenciar Ofertas
        </h1>
      </header>

      <div className="space-y-4">
        <ActionCard 
            icon={PlusCircle}
            title="Criar Nova Oferta"
            description="Cadastre uma nova promoção para seus clientes."
            href="/account/ofertas/nova"
        />
        <ActionCard 
            icon={History}
            title="Histórico de Ofertas"
            description="Visualize suas ofertas ativas e expiradas."
            href="/account/ofertas/historico"
        />
      </div>

    </div>
  );
}
