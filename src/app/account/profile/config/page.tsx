
'use client';

import { useState } from 'react';
import { ArrowLeft, Bell, FileText, Globe, Star, Calendar, Gift, HelpCircle, CircleDollarSign, BarChart3, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";
import { useCompany } from '@/contexts/CompanyContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const ConfigItem = ({ icon: Icon, title, description, hasSwitch = false, href, onClick, disabled = false }: { icon: React.ElementType, title: string, description: string, hasSwitch?: boolean, href?: string, onClick?: () => void, disabled?: boolean }) => {
    const content = (
        <div className={cn(
            "flex items-center justify-between p-4",
            disabled && "opacity-50 pointer-events-none"
        )}>
            <div className="flex items-center gap-4">
                <Icon className={cn("w-6 h-6 text-primary", disabled && "text-muted-foreground")} />
                <div>
                    <h3 className={cn("font-semibold text-foreground", disabled && "text-muted-foreground")}>{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>
            {hasSwitch && <Switch />}
        </div>
    );
    
    const wrapperClasses = "block group rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-all duration-300 hover:shadow-lg hover:shadow-lime-400/20 hover:border-lime-400/50 border border-transparent";

    if (onClick && !href) { // Changed this to prioritize onClick when no href is provided
        return (
            <button onClick={onClick} className={cn(wrapperClasses, "w-full text-left", disabled && 'cursor-not-allowed hover:shadow-none hover:border-transparent')}>
                {content}
            </button>
        )
    }

    if (href && !disabled) {
        return (
            <Link href={href} className={wrapperClasses}>
                {content}
            </Link>
        );
    }

    return (
        <div className={cn(wrapperClasses, "cursor-not-allowed")}>
            {content}
        </div>
    );
};

export default function ConsumerConfigPage() {
  const { toast } = useToast();
  const { companyProfile } = useCompany();
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const isGoldPlan = companyProfile.plan === 'Gold';

  const handleFeatureClick = (featureName: string) => {
    toast({
      title: "Funcionalidade em Breve",
      description: `A tela para "${featureName}" ainda não foi implementada.`,
    });
  };

  const handleMiitMaxClick = () => {
    if (!isGoldPlan) {
      setIsUpgradeModalOpen(true);
    }
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
                <ConfigItem icon={Gift} title="Ofertas" description="Cadastrar Ofertas" href="/account/profile/offers" />
                <Separator />
                <ConfigItem icon={Calendar} title="Eventos" description="Cadastrar os meus Eventos" href="/account/profile/events" />
                <Separator />
                <ConfigItem icon={Star} title="Avaliações" description="Ver avaliações recebidas" href="/account/avaliacoes-empresa" />
                <Separator />
                <ConfigItem icon={CircleDollarSign} title="Patrocínio" description="Impulsionar meu negócio" href="/account/patrocinio" />
                <Separator />
                <ConfigItem icon={BarChart3} title="Analytics" description="Ver métricas de desempenho" href="/account/analytics" />
                <Separator />
                 <ConfigItem 
                    icon={Trophy} 
                    title="MiiT Max" 
                    description="Veja seu Ranking e Desempenho" 
                    href={isGoldPlan ? "/account/miit-max" : undefined}
                    onClick={handleMiitMaxClick}
                    disabled={!isGoldPlan}
                />
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
                <ConfigItem icon={HelpCircle} title="Suporte" description="Ajuda e perguntas frequentes" href="/account/suporte" />
                <Separator />
                <ConfigItem icon={FileText} title="Termos de Uso" description="Visualizar os termos de serviço" href="/account/profile/config/terms-of-use" />
            </div>
        </CardContent>
      </Card>

      {/* Upgrade Modal */}
      <Dialog open={isUpgradeModalOpen} onOpenChange={setIsUpgradeModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold font-headline">Acesso Exclusivo Gold</DialogTitle>
                <DialogDescription className="text-center text-muted-foreground pt-2">
                    Assine o Plano Gold para ter acesso ao Ranking MiiT Max e competir pelo topo!
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-center pt-4">
                <Link href="/account/subscription" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full bg-lime-500 hover:bg-lime-600 text-black font-bold">
                        Fazer Upgrade Agora
                    </Button>
                </Link>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
