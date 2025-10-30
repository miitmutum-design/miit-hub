
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { ArrowLeft, Building, Gift, Calendar, Upload, DollarSign, Sparkles, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useCompany } from '@/contexts/CompanyContext';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';


export default function DestaqueTotalBannerPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { companyProfile } = useCompany();

  const [sponsorshipType, setSponsorshipType] = useState('empresa');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [linkType, setLinkType] = useState('site');

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
    if (!destinationUrl || !bannerImage) {
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
            
            <div className="space-y-4">
                <label className="text-sm font-medium text-muted-foreground">
                    Tipo de Link de Destino
                </label>
                <RadioGroup value={linkType} onValueChange={setLinkType} className="grid grid-cols-3 gap-4">
                    <div>
                        <RadioGroupItem value="whatsapp" id="whatsapp" className="peer sr-only" />
                        <Label htmlFor="whatsapp" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            WhatsApp
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem value="instagram" id="instagram" className="peer sr-only" />
                        <Label htmlFor="instagram" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            Instagram
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem value="site" id="site" className="peer sr-only" />
                        <Label htmlFor="site" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                            Site
                        </Label>
                    </div>
                </RadioGroup>
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
