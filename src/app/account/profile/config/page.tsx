'use client';

import { ArrowLeft, Bell, FileText, Globe, Bookmark, Ticket, Gift, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

const ConfigItem = ({ icon: Icon, title, description, hasSwitch = false, href, onClick }: { icon: React.ElementType, title: string, description: string, hasSwitch?: boolean, href?: string, onClick?: () => void }) => {
    const content = (
        <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
                <Icon className="w-6 h-6 text-primary" />
                <div>
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>
            {hasSwitch && <Switch />}
        </div>
    );
    
    const wrapperClasses = "block group rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-300 hover:shadow-lg hover:shadow-lime-400/20 hover:border-lime-400/50 border border-transparent";

    if (href) {
        return (
            <Link href={href} className={wrapperClasses}>
                {content}
            </Link>
        );
    }
    
    if (onClick) {
        return (
            <button onClick={onClick} className={cn(wrapperClasses, "w-full text-left")}>
                {content}
            </button>
        )
    }

    return (
        <div className={cn(wrapperClasses, "cursor-default")}>
            {content}
        </div>
    );
};

export default function ConsumerConfigPage() {
  const { toast } = useToast();

  const handleFeatureClick = (featureName: string) => {
    toast({
      title: "Funcionalidade em Breve",
      description: `A tela para "${featureName}" ainda não foi implementada.`,
    });
  };

  return (
    <div className="container mx-auto max-w-lg py-6 sm:py-8">
      <header className="relative mb-8 flex items-center justify-center text-center">
        <Link href="/account" className="absolute left-0">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground font-headline">
          Configurações
        </h1>
      </header>

      <Card className="bg-card">
        <CardContent className="p-0">
            <div className="p-2 space-y-1">
                <ConfigItem icon={Gift} title="Minhas Ofertas" description="Ofertas especiais para você" href="/account/profile/offers" />
                <Separator />
                <ConfigItem icon={Calendar} title="Eventos Salvos" description="Eventos que você pretende ir" href="/account/profile/events" />
            </div>
        </CardContent>
      </Card>
      
      <h2 className="text-lg font-semibold font-headline mt-8 mb-4">Geral</h2>
      <Card className="bg-card">
        <CardContent className="p-0">
            <div className="p-2 space-y-1">
                <ConfigItem icon={Bell} title="Notificações Push" description="Receber alertas de ofertas" href="/account/profile/config/notifications" />
                <Separator />
                <ConfigItem icon={Globe} title="Idioma" description="Português (Brasil)" />
                <Separator />
                <ConfigItem icon={FileText} title="Termos de Uso" description="Visualizar os termos de serviço" href="/account/profile/config/terms-of-use" />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
