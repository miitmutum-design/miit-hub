
'use client';

import { useState } from 'react';
import { ArrowLeft, Building, Gift, Calendar, Check, Image as ImageIcon, Upload, DollarSign, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCompany } from '@/contexts/CompanyContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { businessOffers, businessEvents } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';


export default function DestaqueTotalBannerPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { companyProfile } = useCompany();

  const [activeTab, setActiveTab] = useState('empresa');

  // Filter offers and events for the current company
  const activeOffers = businessOffers.filter(o => o.companyId === companyProfile.id && new Date(o.validUntil) >= new Date());
  const futureEvents = businessEvents.filter(e => e.companyId === companyProfile.id && new Date(e.date) >= new Date());

  const handleSubmit = () => {
    toast({
        title: "Solicitação Enviada!",
        description: "Sua solicitação de patrocínio foi enviada para análise. Entraremos em contato em breve.",
    });
    router.push('/account/patrocinio');
  }

  const estimatedCost = "R$ 250,00 / mês";


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

      <div className="text-center mb-6">
        <p className="text-muted-foreground">O que você gostaria de destacar no banner principal?</p>
      </div>
      
       <Tabs defaultValue="empresa" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card mb-6">
            <TabsTrigger value="empresa" className="flex gap-2"><Building className="h-4 w-4"/> Empresa</TabsTrigger>
            <TabsTrigger value="ofertas" className="flex gap-2"><Gift className="h-4 w-4"/> Ofertas</TabsTrigger>
            <TabsTrigger value="eventos" className="flex gap-2"><Calendar className="h-4 w-4"/> Eventos</TabsTrigger>
        </TabsList>
        
        <div className="space-y-6">
            <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Empresa Vinculada</label>
                <Input value={companyProfile.name} disabled className="bg-muted/50 border-border/50 h-12" />
            </div>

            <TabsContent value="empresa">
                <div className="space-y-6 animate-in fade-in-50">
                     <div className="space-y-2">
                        <label htmlFor="banner-title" className="text-sm font-medium text-muted-foreground">Texto Principal do Banner</label>
                        <Input id="banner-title" placeholder="Ex: União Construtora" maxLength={50} className="bg-card border-border/50 h-12" />
                        <p className="text-xs text-muted-foreground text-right">50 caracteres máx.</p>
                    </div>
                     <div className="space-y-2">
                        <label htmlFor="banner-subtitle" className="text-sm font-medium text-muted-foreground">Texto Secundário do Banner</label>
                        <Input id="banner-subtitle" placeholder="Ex: Qualidade e Segurança!" maxLength={80} className="bg-card border-border/50 h-12" />
                        <p className="text-xs text-muted-foreground text-right">80 caracteres máx.</p>
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Imagem do Banner (1920x1080px)</label>
                        <Button variant="outline" className="w-full h-24 border-dashed border-2 border-border/50 flex-col gap-2">
                            <Upload className="h-6 w-6"/>
                            Fazer Upload
                        </Button>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="ofertas">
                <div className="space-y-6 animate-in fade-in-50">
                    <div className="space-y-2">
                        <label htmlFor="oferta-select" className="text-sm font-medium text-muted-foreground">Selecionar Oferta</label>
                         <Select>
                            <SelectTrigger className="bg-card border-border/50 h-12">
                                <SelectValue placeholder="Escolha uma oferta vigente..." />
                            </SelectTrigger>
                            <SelectContent>
                                {activeOffers.length > 0 ? activeOffers.map(offer => (
                                    <SelectItem key={offer.id} value={offer.id}>{offer.title}</SelectItem>
                                )) : <div className="p-4 text-sm text-muted-foreground">Nenhuma oferta vigente encontrada.</div>}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="oferta-extra-text" className="text-sm font-medium text-muted-foreground">Texto Promocional Adicional (Opcional)</label>
                        <Textarea id="oferta-extra-text" placeholder="Ex: Últimas unidades!" className="bg-card border-border/50 min-h-24"/>
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="eventos">
                 <div className="space-y-6 animate-in fade-in-50">
                    <div className="space-y-2">
                        <label htmlFor="evento-select" className="text-sm font-medium text-muted-foreground">Selecionar Evento</label>
                        <Select>
                            <SelectTrigger className="bg-card border-border/50 h-12">
                                <SelectValue placeholder="Escolha um evento futuro..." />
                            </SelectTrigger>
                            <SelectContent>
                                {futureEvents.length > 0 ? futureEvents.map(event => (
                                    <SelectItem key={event.id} value={event.id}>{event.title}</SelectItem>
                                )) : <div className="p-4 text-sm text-muted-foreground">Nenhum evento futuro encontrado.</div>}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="evento-extra-text" className="text-sm font-medium text-muted-foreground">Texto Promocional Adicional (Opcional)</label>
                        <Textarea id="evento-extra-text" placeholder="Ex: Ingressos limitados!" className="bg-card border-border/50 min-h-24"/>
                    </div>
                </div>
            </TabsContent>

             <Card className="bg-lime-900/30 border-lime-400/50">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Custo Estimado</p>
                        <p className="text-xl font-bold text-lime-400">{estimatedCost}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-lime-400/80" />
                </CardContent>
            </Card>

            <div className="pt-8 pb-24">
                 <Button
                    size="lg"
                    className="w-full h-12 text-lg font-bold bg-lime-500 hover:bg-lime-600 text-black"
                    onClick={handleSubmit}
                 >
                    <Sparkles className="mr-2 h-5 w-5"/>
                    Solicitar Patrocínio
                </Button>
            </div>
        </div>
      </Tabs>
    </div>
  );
}
