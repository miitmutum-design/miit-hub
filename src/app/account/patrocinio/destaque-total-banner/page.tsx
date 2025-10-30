
'use client';

import { ArrowLeft, Building, Gift, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ActionCard = ({ icon: Icon, title, description, onClick }: { icon: React.ElementType, title: string, description: string, onClick: () => void }) => (
    <div onClick={onClick} className="cursor-pointer">
        <Card className="bg-card border-border/50 transition-all duration-300 hover:border-primary/70 hover:shadow-lg hover:shadow-primary/20">
            <CardContent className="p-6 flex items-center gap-6">
                <Icon className="w-10 h-10 text-primary" />
                <div>
                    <h3 className="text-xl font-bold font-headline">{title}</h3>
                    <p className="text-muted-foreground mt-1">{description}</p>
                </div>
            </CardContent>
        </Card>
    </div>
);

export default function DestaqueTotalBannerPage() {
  const { toast } = useToast();

  const handleSelection = (type: string) => {
    toast({
      title: "Seleção Registrada!",
      description: `Você escolheu promover um(a) ${type}. Em breve, você poderá configurar os detalhes.`,
    });
  };

  return (
    <div className="container mx-auto max-w-lg py-6 sm:py-8">
      <header className="relative mb-8 flex items-center justify-center text-center">
        <Link href="/account/patrocinio" className="absolute left-0">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground font-headline">
          Destaque Total Banner
        </h1>
      </header>

      <div className="text-center mb-8">
        <p className="text-muted-foreground">O que você gostaria de destacar no banner principal?</p>
      </div>
      
      <div className="space-y-4">
        
      </div>
    </div>
  );
}
