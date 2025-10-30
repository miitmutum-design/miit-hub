
'use client';

import { useState } from 'react';
import { ArrowLeft, Building, Gift, Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


export default function DestaqueTotalBannerPage() {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleSelection = (type: string) => {
    setSelectedType(type);
    toast({
      title: "Seleção Registrada!",
      description: `Você escolheu promover: ${type}.`,
    });
  };
  
  const selectionOptions = [
      { id: 'empresa', name: 'Empresa', icon: Building },
      { id: 'ofertas', name: 'Ofertas', icon: Gift },
      { id: 'eventos', name: 'Eventos', icon: Calendar },
  ];

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
      
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {selectionOptions.map((option) => {
          const Icon = option.icon;
          return (
            <button
                key={option.id}
                onClick={() => handleSelection(option.name)}
                className={cn(
                    "group rounded-lg border-2 p-4 text-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background",
                    selectedType === option.name 
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                        : "border-border/50 bg-card hover:border-primary/50"
                )}
            >
                <div className="flex flex-col items-center justify-center gap-3">
                    <Icon className={cn(
                        "h-8 w-8 transition-colors",
                        selectedType === option.name ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                    )} />
                    <span className={cn(
                       "font-semibold text-sm sm:text-base",
                        selectedType === option.name ? "text-primary" : "text-foreground"
                    )}>
                        {option.name}
                    </span>
                    {selectedType === option.name && (
                        <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="h-3.5 w-3.5" />
                        </div>
                    )}
                </div>
            </button>
          )
        })}
      </div>
    </div>
  );
}
