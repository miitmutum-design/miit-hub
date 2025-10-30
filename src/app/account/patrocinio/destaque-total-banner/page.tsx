
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { ArrowLeft, Building, Gift, Calendar, Upload, DollarSign, Sparkles, Link as LinkIcon, CheckCircle } from 'lucide-react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';

export default function DestaqueTotalBannerPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { companyProfile } = useCompany();

  const [sponsorshipType, setSponsorshipType] = useState('empresa');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [linkType, setLinkType] = useState('');

  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);

  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [siteUrl, setSiteUrl] = useState('');

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
  
  const handleSaveWhatsapp = () => {
      const cleaned = whatsappNumber.replace(/\D/g, '');
      if (cleaned.length < 10) {
          toast({ variant: 'destructive', title: 'Número Inválido', description: 'Por favor, insira um número de WhatsApp válido com DDD.' });
          return;
      }
      setDestinationUrl(`https://wa.me/55${cleaned}`);
      setLinkType('whatsapp');
      setIsWhatsappModalOpen(false);
      toast({ title: 'Link do WhatsApp Salvo!'});
  }
  
  const handleSaveInstagram = () => {
      const cleaned = instagramHandle.replace('@', '');
      if (!cleaned) {
          toast({ variant: 'destructive', title: 'Usuário Inválido', description: 'Por favor, insira seu nome de usuário do Instagram.' });
          return;
      }
      setDestinationUrl(`https://instagram.com/${cleaned}`);
      setLinkType('instagram');
      setIsInstagramModalOpen(false);
      toast({ title: 'Link do Instagram Salvo!'});
  }

  const handleSaveSite = () => {
       if (!siteUrl.startsWith('http')) {
          toast({ variant: 'destructive', title: 'URL Inválida', description: 'Por favor, insira uma URL completa (ex: https://...).' });
          return;
      }
      setDestinationUrl(siteUrl);
      setLinkType('site');
      setIsSiteModalOpen(false);
      toast({ title: 'Link do Site Salvo!'});
  }


  const handleSubmit = () => {
    if (!destinationUrl || !bannerImage) {
        toast({
            variant: 'destructive',
            title: "Campos Obrigatórios",
            description: "Por favor, configure o link de destino e faça o upload de uma imagem para o banner.",
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
                <div className="grid grid-cols-3 gap-4">
                    <div onClick={() => setIsWhatsappModalOpen(true)}>
                        <Label htmlFor="whatsapp" className={cn("flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer transition-colors", linkType === 'whatsapp' ? 'border-primary bg-primary/10' : 'border-muted bg-popover hover:bg-accent')}>
                            WhatsApp
                            {linkType === 'whatsapp' && <CheckCircle className="w-4 h-4 text-primary mt-1" />}
                        </Label>
                    </div>
                     <div onClick={() => setIsInstagramModalOpen(true)}>
                        <Label htmlFor="instagram" className={cn("flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer transition-colors", linkType === 'instagram' ? 'border-primary bg-primary/10' : 'border-muted bg-popover hover:bg-accent')}>
                            Instagram
                            {linkType === 'instagram' && <CheckCircle className="w-4 h-4 text-primary mt-1" />}
                        </Label>
                    </div>
                     <div onClick={() => setIsSiteModalOpen(true)}>
                        <Label htmlFor="site" className={cn("flex flex-col items-center justify-center rounded-md border-2 p-4 cursor-pointer transition-colors", linkType === 'site' ? 'border-primary bg-primary/10' : 'border-muted bg-popover hover:bg-accent')}>
                            Site
                            {linkType === 'site' && <CheckCircle className="w-4 h-4 text-primary mt-1" />}
                        </Label>
                    </div>
                </div>
            </div>
        </div>

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
      
      {/* WhatsApp Modal */}
      <Dialog open={isWhatsappModalOpen} onOpenChange={setIsWhatsappModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Configurar Link do WhatsApp</DialogTitle>
                <DialogDescription>Insira o número de telefone completo (com DDD) que os clientes usarão para entrar em contato.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Label htmlFor="whatsapp-number">Número do WhatsApp</Label>
                <Input id="whatsapp-number" type="tel" placeholder="(XX) XXXXX-XXXX" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} />
            </div>
            <DialogFooter>
                <Button onClick={handleSaveWhatsapp}>Salvar Link</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Instagram Modal */}
       <Dialog open={isInstagramModalOpen} onOpenChange={setIsInstagramModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Configurar Link do Instagram</DialogTitle>
                <DialogDescription>Insira o seu nome de usuário (handle) do Instagram para direcionar os clientes ao seu perfil.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Label htmlFor="instagram-handle">Usuário do Instagram</Label>
                <Input id="instagram-handle" placeholder="@seuusuario" value={instagramHandle} onChange={e => setInstagramHandle(e.target.value)} />
            </div>
            <DialogFooter>
                <Button onClick={handleSaveInstagram}>Salvar Link</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Site Modal */}
      <Dialog open={isSiteModalOpen} onOpenChange={setIsSiteModalOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Configurar Link do Site</DialogTitle>
                <DialogDescription>Insira a URL completa do seu site, landing page ou link externo.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Label htmlFor="site-url">URL do Site</Label>
                <Input id="site-url" type="url" placeholder="https://seusite.com.br" value={siteUrl} onChange={e => setSiteUrl(e.target.value)} />
            </div>
            <DialogFooter>
                <Button onClick={handleSaveSite}>Salvar Link</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
