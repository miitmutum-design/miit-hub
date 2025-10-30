
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { ArrowLeft, Building, Gift, Calendar, Upload, DollarSign, Sparkles, Link as LinkIcon, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCompany } from '@/contexts/CompanyContext';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Image from 'next/image';


export default function DestaqueTotalBannerPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { companyProfile } = useCompany();

  const [sponsorshipType, setSponsorshipType] = useState('empresa');
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    imageInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const placeholderUrl = URL.createObjectURL(file);
      setBannerImage(placeholderUrl);
    }
  };

  const handleSubmit = () => {
    if (!bannerTitle || !bannerSubtitle || !destinationUrl || !bannerImage) {
        toast({
            variant: 'destructive',
            title: "Campos Obrigatórios",
            description: "Por favor, preencha todos os campos do formulário, incluindo a imagem.",
        });
        return;
    }
    
    console.log({
        companyId: companyProfile.id,
        sponsorshipType,
        bannerTitle,
        bannerSubtitle,
        destinationUrl,
        bannerImage,
    });

    toast({
        title: "Solicitação Enviada!",
        description: "Sua solicitação de patrocínio de banner foi enviada para análise. Entraremos em contato em breve.",
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
        <p className="text-muted-foreground">Qual a intenção da sua campanha no banner principal?</p>
      </div>
      
       <Tabs defaultValue="empresa" value={sponsorshipType} onValueChange={setSponsorshipType} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card mb-6">
            <TabsTrigger value="empresa" className="flex gap-2"><Building className="h-4 w-4"/> Empresa</TabsTrigger>
            <TabsTrigger value="ofertas" className="flex gap-2"><Gift className="h-4 w-4"/> Oferta</TabsTrigger>
            <TabsTrigger value="eventos" className="flex gap-2"><Calendar className="h-4 w-4"/> Evento</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="space-y-6">
        {/* Unified Form */}
        <div className="space-y-6">
            <div className="space-y-2">
                <label htmlFor="banner-image" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Upload className="h-5 w-5"/>
                    Imagem do Banner (1920x1080px)
                </label>
                 <button
                    type="button"
                    onClick={handleImageClick}
                    className="relative w-full h-40 rounded-lg border-2 border-dashed border-border bg-card flex items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors"
                >
                    {bannerImage ? (
                        <Image
                            src={bannerImage}
                            alt="Pré-visualização do Banner"
                            fill
                            className="object-cover rounded-lg"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <Upload className="h-8 w-8" />
                            <span>Fazer upload da imagem</span>
                        </div>
                    )}
                </button>
                <input
                    type="file"
                    ref={imageInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="banner-title" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Type className="h-5 w-5"/>
                    Texto Principal do Banner
                </label>
                <Input 
                    id="banner-title" 
                    placeholder="Ex: União Construtora" 
                    maxLength={50} 
                    className="bg-card border-border/50 h-12"
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                />
                <p className="text-xs text-muted-foreground text-right">50 caracteres máx.</p>
            </div>
            
            <div className="space-y-2">
                <label htmlFor="banner-subtitle" className="text-sm font-medium text-muted-foreground">
                    Texto Secundário do Banner (Slogan)
                </label>
                <Input 
                    id="banner-subtitle" 
                    placeholder="Ex: Qualidade e Segurança!" 
                    maxLength={80} 
                    className="bg-card border-border/50 h-12"
                    value={bannerSubtitle}
                    onChange={(e) => setBannerSubtitle(e.target.value)}
                />
                <p className="text-xs text-muted-foreground text-right">80 caracteres máx.</p>
            </div>

            <div className="space-y-2">
                <label htmlFor="destination-url" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <LinkIcon className="h-5 w-5"/>
                    Link de Destino do Banner
                </label>
                <Input 
                    id="destination-url" 
                    placeholder="Cole a URL do seu Site, WhatsApp ou Instagram" 
                    className="bg-card border-border/50 h-12"
                    value={destinationUrl}
                    onChange={(e) => setDestinationUrl(e.target.value)}
                />
            </div>
        </div>

        {/* Cost and Submit Button */}
         <Card className="bg-lime-900/30 border-lime-400/50 mt-8">
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
    </div>
  );
}
