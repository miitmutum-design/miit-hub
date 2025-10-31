
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, CheckCircle, ChevronDown, ChevronUp, Star, CircleDollarSign, AlertTriangle, Clock, ShieldCheck, Trophy, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCompany } from '@/contexts/CompanyContext';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const plans = {
  Prata: {
    name: 'Prata',
    price: 'R$ 29,90',
    period: '/mês',
    benefits: [
      '1 Oferta por Mês',
      '1 Evento no Ano',
      'Token (R$1 = 1 Token)',
      'Analytics (Acesso ao Dashboard)',
      'Suporte Chat Comunidade',
    ],
    borderColor: 'border-zinc-500/50',
    headerColor: 'bg-zinc-800/30',
    iconColor: 'text-zinc-400 fill-zinc-400',
  },
  Gold: {
    name: 'Gold',
    price: 'R$ 1000,00',
    period: '/ano',
    benefits: [
      'Ofertas Ilimitadas',
      'Eventos Ilimitados',
      'Mais Tokens (R$1 = 3 Tokens)',
      'Analytics (Acesso Completo ao Dashboard)',
      'MiiT Max (Acesso Total ao Ranking e Pódio)',
      'Suporte Prioritário',
    ],
    borderColor: 'border-yellow-400/50',
    headerColor: 'bg-yellow-900/30',
    iconColor: 'text-yellow-400 fill-yellow-400',
  },
};

const tokenPackagesConfig = {
  Prata: [
    { name: 'Bronze', tokens: 30, price: 30, bestValue: false },
    { name: 'Prata', tokens: 50, price: 50, bestValue: true },
    { name: 'Ouro', tokens: 100, price: 100, bestValue: false },
  ],
  Gold: [
    { name: 'Bronze', tokens: 90, price: 30, bestValue: false },
    { name: 'Prata', tokens: 150, price: 50, bestValue: true },
    { name: 'Ouro', tokens: 300, price: 100, bestValue: false },
    { name: 'Platinum', tokens: 1000, price: 300, bestValue: false },
  ],
};

export default function SubscriptionPage() {
  const { companyProfile, setCompanyProfile } = useCompany();
  const { toast } = useToast();

  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  
  const handleUpgrade = (newPlan: 'Prata' | 'Gold') => {
      if (companyProfile.plan === newPlan) return;
      alert(`Simulando upgrade para o plano ${newPlan}...`);
  }

  const handleAddTokens = (tokensToAdd: number, price: number) => {
    alert(`Simulando compra de ${tokensToAdd} Tokens por R$${price.toFixed(2)} via Mercado Pago...`);
    setCompanyProfile(prev => ({
      ...prev,
      tokens: prev.tokens + tokensToAdd
    }));
    toast({
        title: 'Recarga bem-sucedida!',
        description: `${tokensToAdd} tokens foram adicionados à sua carteira.`,
    });
    setIsTokenModalOpen(false);
  }
  
  const benefitsMap = {
      'Analytics (Acesso Completo ao Dashboard)': BarChart3,
      'MiiT Max (Acesso Total ao Ranking e Pódio)': Trophy,
      'Suporte Prioritário': ShieldCheck,
      'Analytics (Acesso ao Dashboard)': BarChart3,
      'Suporte Chat Comunidade': ShieldCheck
  }
  
  const tokenPackages = tokenPackagesConfig[companyProfile.plan] || [];
  const tokenConversionRate = companyProfile.plan === 'Gold' ? 3 : 1;
  const isPlanActive = companyProfile.plan === 'Prata' || companyProfile.plan === 'Gold';

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
          Assinaturas e Planos
        </h1>
      </header>
      
      <div className="space-y-6">
        
        {/* Plan comparison */}
        <div className="space-y-4">
            {Object.values(plans).map(plan => {
                const isCurrentPlan = companyProfile.plan === plan.name;
                const PlanIcon = plan.name === 'Gold' ? Star : ShieldCheck;

                return (
                    <Card key={plan.name} className={cn(
                        "border-2 overflow-hidden bg-card transition-all",
                         isCurrentPlan ? plan.borderColor : 'border-transparent'
                    )}>
                        <CardHeader className={cn("p-4", plan.headerColor)}>
                            <CardTitle className="flex items-center justify-between gap-2 text-2xl font-headline">
                                <div className="flex items-center gap-2">
                                    <PlanIcon className={cn("w-7 h-7", plan.iconColor)} />
                                    Plano {plan.name}
                                </div>
                                {isCurrentPlan && (
                                    <Badge className="bg-lime-500/20 text-lime-300 border-lime-400/30">Plano Atual</Badge>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex items-baseline">
                                <span className="text-3xl font-bold">{plan.price}</span>
                                <span className="text-muted-foreground">{plan.period}</span>
                            </div>
                            <ul className="space-y-2 text-sm">
                                {plan.benefits.map((benefit, index) => {
                                    const Icon = benefitsMap[benefit as keyof typeof benefitsMap] || Check;
                                    return (
                                        <li key={index} className="flex items-center gap-3">
                                            <Icon className="w-4 h-4 text-green-400" />
                                            <span className="text-muted-foreground">{benefit}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                             <Button
                                size="lg"
                                onClick={() => handleUpgrade(plan.name as 'Prata' | 'Gold')}
                                disabled={isCurrentPlan}
                                className={cn(
                                    "w-full h-12 text-lg font-bold transition-colors",
                                    isCurrentPlan ? "bg-muted text-muted-foreground cursor-not-allowed"
                                                  : "bg-lime-500 hover:bg-lime-600 text-black"
                                )}
                            >
                                {isCurrentPlan ? 'Plano Ativo' : 'Fazer Upgrade'}
                            </Button>
                        </CardContent>
                    </Card>
                )
            })}
        </div>


        {/* Token management */}
        <Card className="bg-card">
          <CardHeader className="p-4">
            <CardTitle className="text-xl font-headline">Gestão de Tokens</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Saldo Atual</p>
              <p className="text-4xl font-bold text-lime-400">{companyProfile.tokens}</p>
            </div>
            <Dialog open={isTokenModalOpen} onOpenChange={setIsTokenModalOpen}>
              <DialogTrigger asChild>
                 <Button 
                    className={cn("h-11", isPlanActive ? "bg-orange-600 hover:bg-orange-700" : "bg-muted text-muted-foreground")}
                    disabled={!isPlanActive}
                 >
                  Adicionar Tokens
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-card border-border/50">
                <DialogHeader>
                  <DialogTitle>Recarga de Tokens</DialogTitle>
                  <DialogDescription>
                    Selecione um pacote. Com seu plano {companyProfile.plan}, a taxa de conversão é R$1 = {tokenConversionRate} token(s).
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-3">
                    {tokenPackages.map(pkg => (
                         <Card key={pkg.name} className={cn("overflow-hidden", pkg.bestValue && "border-2 border-lime-400/80")}>
                           <CardContent className="p-4 flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-bold text-lg text-foreground">{pkg.name}</h4>
                                      {pkg.bestValue && <Badge className="bg-lime-400/20 text-lime-300">Melhor Oferta</Badge>}
                                    </div>
                                    <p className="text-lime-400 font-semibold">
                                        {pkg.tokens.toLocaleString('pt-BR')} Tokens
                                    </p>
                                </div>
                                <Button onClick={() => handleAddTokens(pkg.tokens, pkg.price)}>
                                    R$ {pkg.price.toFixed(2)}
                                </Button>
                           </CardContent>
                         </Card>
                    ))}
                </div>
                 <p className='text-xs text-muted-foreground text-center'>Seu plano <span className='font-bold text-primary'>{companyProfile.plan}</span> garante uma conversão de R$1 para {tokenConversionRate === 3 ? '3 tokens' : '1 token'}.</p>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
