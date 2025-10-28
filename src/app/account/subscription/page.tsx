'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, ChevronDown, ChevronUp, Star, CircleDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

const calculateDaysRemaining = (endDate: string) => {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  if (diff < 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export default function SubscriptionPage() {
  const { companyProfile, setCompanyProfile } = useCompany();
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [isExpired, setIsExpired] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(10);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  useEffect(() => {
    const days = calculateDaysRemaining(companyProfile.subscriptionEndDate);
    setDaysRemaining(days);
    setIsExpired(days <= 0);
  }, [companyProfile.subscriptionEndDate]);

  const handleRenew = () => {
    alert('Simulando pagamento com Mercado Pago...');
    // Mock success
    const newEndDate = new Date();
    if (companyProfile.plan === 'Prata') {
      newEndDate.setDate(newEndDate.getDate() + 30);
      setCompanyProfile(prev => ({
        ...prev,
        subscriptionEndDate: newEndDate.toISOString(),
        tokens: prev.tokens + 3,
      }));
    } else {
      newEndDate.setFullYear(newEndDate.getFullYear() + 1);
      setCompanyProfile(prev => ({
        ...prev,
        subscriptionEndDate: newEndDate.toISOString(),
        tokens: prev.tokens + 200,
      }));
    }
  };
  
  const handleAddTokens = () => {
    alert(`Simulando compra de ${tokenAmount} Tokens via Mercado Pago...`);
    // Mock success
    setCompanyProfile(prev => ({
      ...prev,
      tokens: prev.tokens + tokenAmount
    }));
    setIsTokenModalOpen(false);
    setTokenAmount(10); // Reset
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
     if (value >= 10 && value % 10 === 0) {
      setTokenAmount(value);
    } else if (isNaN(value) || value < 10) {
      setTokenAmount(10);
    }
  };

  const incrementAmount = () => setTokenAmount(prev => prev + 10);
  const decrementAmount = () => setTokenAmount(prev => Math.max(10, prev - 10));

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
          Assinaturas
        </h1>
      </header>
      
      <div className="space-y-6">
        {/* Bloco 1: Plano Contratado */}
        <Card className={cn(
          "border-2 overflow-hidden",
          companyProfile.plan === 'Prata' && 'border-zinc-500/50',
          companyProfile.plan === 'Gold' && 'border-yellow-400/50'
        )}>
          <CardHeader className={cn(
            "p-4",
            companyProfile.plan === 'Prata' && 'bg-zinc-800/30',
            companyProfile.plan === 'Gold' && 'bg-yellow-900/30'
          )}>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-2xl font-headline">
                {companyProfile.plan === 'Gold' ? 
                  <Star className="w-7 h-7 text-yellow-400 fill-yellow-400" /> :
                  <Star className="w-7 h-7 text-zinc-400 fill-zinc-400" />
                }
                Plano {companyProfile.plan}
              </CardTitle>
              {!isExpired && (
                <div className="flex items-center gap-2 text-sm text-green-400">
                  <CheckCircle className="w-4 h-4"/>
                  <span>Ativo</span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
             <div>
                <p className="text-sm text-muted-foreground">Próxima Renovação</p>
                <p className="text-lg font-semibold">{new Date(companyProfile.subscriptionEndDate).toLocaleDateString('pt-BR')}</p>
             </div>
             {companyProfile.plan === 'Prata' && !isExpired && (
                <div>
                  <p className="text-sm text-muted-foreground">Contador Regressivo</p>
                  <p className="text-lg font-semibold">{daysRemaining} dias restantes</p>
                </div>
             )}
            <Button
              size="lg"
              className={cn(
                "w-full h-12 text-lg font-bold transition-colors",
                isExpired
                  ? "bg-lime-500 hover:bg-lime-600 text-black"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
              onClick={handleRenew}
              disabled={!isExpired}
            >
              {isExpired ? 'Pagar / Renovar Plano' : 'Plano Ativo'}
            </Button>
          </CardContent>
        </Card>

        {/* Bloco 2: Gestão de Tokens */}
        <Card className="bg-card">
          <CardHeader className="p-4">
            <CardTitle className="text-xl font-headline">Gestão de Tokens</CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Saldo Atual</p>
              <p className="text-4xl font-bold text-primary">{companyProfile.tokens}</p>
            </div>
            <Dialog open={isTokenModalOpen} onOpenChange={setIsTokenModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-700 h-11">
                  Adicionar Tokens
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Tokens</DialogTitle>
                  <DialogDescription>
                    Selecione a quantidade de tokens para recarregar (múltiplos de R$10,00).
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="token-amount" className="text-right">
                      Tokens
                    </Label>
                    <div className="col-span-3 relative">
                      <Input
                        id="token-amount"
                        type="number"
                        value={tokenAmount}
                        onChange={handleAmountChange}
                        step="10"
                        min="10"
                        className="pr-16 text-center text-lg h-12"
                      />
                       <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col">
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={incrementAmount}><ChevronUp className="w-4 h-4"/></Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={decrementAmount}><ChevronDown className="w-4 h-4"/></Button>
                      </div>
                    </div>
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">
                      Valor
                    </Label>
                     <p className="col-span-3 text-2xl font-bold text-center">R$ {tokenAmount.toFixed(2)}</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={handleAddTokens} className="w-full h-12 bg-orange-600 hover:bg-orange-700">
                    <CircleDollarSign className="mr-2 h-5 w-5"/>
                    Pagar com Mercado Pago
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
