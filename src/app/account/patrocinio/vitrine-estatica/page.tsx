
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { ArrowLeft, Building, Upload, DollarSign, Sparkles, CheckCircle, AlertTriangle, Calendar as CalendarIcon, Loader2, Gift, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useCompany } from '@/contexts/CompanyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Calendar } from "@/components/ui/calendar"
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock function to check for available slots.
const checkAvailability = async (date: Date): Promise<boolean> => {
  const today = new Date();
  if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
    return false;
  }
  return true; 
};

const disabledDates = [
  new Date(),
  new Date(new Date().setDate(new Date().getDate() + 5)),
  new Date(new Date().setDate(new Date().getDate() + 6)),
];


export default function VitrineEstaticaPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { companyProfile } = useCompany();

  const [sponsorshipType, setSponsorshipType] = useState('empresa');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [linkType, setLinkType] = useState('');
  const [tokensToSpend, setTokensToSpend] = useState(0);
  const [bannerName, setBannerName] = useState('');

  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  const [isInstagramModalOpen, setIsInstagramModalOpen] = useState(false);
  const [isSiteModalOpen, setIsSiteModalOpen] = useState(false);

  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [instagramHandle, setInstagramHandle] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);

  const dailyCost = companyProfile.plan === 'Gold' ? 4 : 6;
  const isBalanceSufficient = tokensToSpend <= companyProfile.tokens;
  const sponsorshipDays = tokensToSpend > 0 ? Math.floor(tokensToSpend / dailyCost) : 0;
  const isFormValid = destinationUrl && bannerImage && tokensToSpend > 0 && bannerName.trim() !== '' && isBalanceSufficient;


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

  const sendSponsorshipRequest = () => {
    console.log({
        companyId: companyProfile.id,
        sponsorshipProduct: 'Vitrine Estática',
        campaignIntent: sponsorshipType,
        bannerName,
        destinationUrl,
        bannerImage,
        tokensSpent: tokensToSpend,
        sponsorshipDays: sponsorshipDays,
        startDate: selectedDate || new Date(),
    });

    toast({
        title: "Solicitação Enviada!",
        description: `Sua solicitação para a Vitrine Estática com ${tokensToSpend} tokens foi enviada para análise.`,
    });
    router.push('/account/patrocinio');
  }

  const handleSubmit = async () => {
    if (!isFormValid) {
        toast({
            variant: 'destructive',
            title: "Campos Obrigatórios ou Saldo Insuficiente",
            description: "Verifique se todos os campos estão preenchidos e se seu saldo de tokens é suficiente.",
        });
        return;
    }
    
    setIsSubmitting(true);
    const startDate = selectedDate || new Date();
    const isAvailable = await checkAvailability(startDate);
    setIsSubmitting(false);

    if (isAvailable) {
        sendSponsorshipRequest();
    } else {
        toast({
            variant: "destructive",
            title: "Vagas Esgotadas!",
            description: "Não há vagas para hoje. Por favor, agende uma data futura.",
        });
        setIsCalendarModalOpen(true);
    }
  }

  const handleScheduleAndSubmit = () => {
    if (!selectedDate) {
      toast({ variant: 'destructive', title: 'Nenhuma data selecionada' });
      return;
    }
    setIsCalendarModalOpen(false);
    sendSponsorshipRequest();
  };
  
    const bannerLabels = {
        empresa: { label: 'Nome da Empresa', icon: Building },
        ofertas: { label: 'Nome da Oferta', icon: Gift },
        eventos: { label: 'Nome do Evento', icon: Ticket },
    };

    const { label: bannerNameLabel, icon: BannerIcon } = bannerLabels[sponsorshipType as keyof typeof bannerLabels] || bannerLabels.empresa;

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
          Vitrine Estática
        </h1>
      </header>

      <div className="space-y-6">

        <Card className="bg-card">
            <CardHeader className="p-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-headline">Carteira de Tokens</CardTitle>
            <Link href="/account/subscription">
                <Button variant="outline" size="sm">
                    Recarregar
                </Button>
            </Link>
            </CardHeader>
            <CardContent className="p-6 pt-0">
                <p className="text-sm text-muted-foreground">Seu Saldo Atual</p>
                <p className="text-3xl font-bold text-lime-400">{companyProfile.tokens} Tokens</p>
            </CardContent>
        </Card>

        <div className="text-center">
            <p className="text-muted-foreground">Qual a intenção da sua campanha na vitrine?</p>
        </div>
      
        <div className="w-full">
            <div className="grid grid-cols-3 gap-2 rounded-lg bg-card p-1">
                <Button variant={sponsorshipType === 'empresa' ? 'default' : 'ghost'} onClick={() => setSponsorshipType('empresa')} className="data-[state=active]:bg-lime-900/50 data-[state=active]:text-lime-300 flex-1 justify-center gap-2" data-state={sponsorshipType === 'empresa' ? 'active' : 'inactive'}>
                    <Building className="h-4 w-4"/> Empresa
                </Button>
                <Button variant={sponsorshipType === 'ofertas' ? 'default' : 'ghost'} onClick={() => setSponsorshipType('ofertas')} className="data-[state=active]:bg-lime-900/50 data-[state=active]:text-lime-300 flex-1 justify-center gap-2" data-state={sponsorshipType === 'ofertas' ? 'active' : 'inactive'}>
                    <Gift className="h-4 w-4"/> Oferta
                </Button>
                <Button variant={sponsorshipType === 'eventos' ? 'default' : 'ghost'} onClick={() => setSponsorshipType('eventos')} className="data-[state=active]:bg-lime-900/50 data-[state=active]:text-lime-300 flex-1 justify-center gap-2" data-state={sponsorshipType === 'eventos' ? 'active' : 'inactive'}>
                    <Ticket className="h-4 w-4"/> Evento
                </Button>
            </div>
        </div>
      
        <div className="space-y-2">
            <label htmlFor="bannerName" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BannerIcon className="h-5 w-5"/>
                {bannerNameLabel} <span className="text-red-500">*</span>
            </label>
            <Input 
                id="bannerName"
                type="text"
                value={bannerName}
                onChange={(e) => setBannerName(e.target.value)}
                placeholder="Nome que aparecerá na vitrine"
                className="bg-card border-border/50 h-12"
            />
        </div>

        <div className="space-y-2">
            <label htmlFor="banner-image" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Upload className="h-5 w-5"/>
                Upload de Ícone/Logo (500x500px) <span className="text-red-500">*</span>
            </label>
            <div className="flex justify-center">
                <button
                    type="button"
                    onClick={handleImageClick}
                    className="relative w-40 h-40 rounded-lg border-2 border-dashed border-border bg-card flex items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors"
                >
                    {bannerImage ? (
                        <Image
                            src={bannerImage}
                            alt="Pré-visualização do Banner"
                            fill
                            className="object-cover rounded-lg"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-center p-2">
                            <Upload className="h-8 w-8" />
                            <span className="text-xs">Fazer upload da imagem</span>
                        </div>
                    )}
                </button>
            </div>
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
                Tipo de Link de Destino <span className="text-red-500">*</span>
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

        <div className="space-y-2">
            <label htmlFor="tokensToSpend" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-5 w-5"/>
                Tokens para Impulsionar
            </label>
            <Input 
                id="tokensToSpend"
                type="number"
                value={tokensToSpend === 0 ? '' : tokensToSpend}
                onChange={(e) => setTokensToSpend(parseInt(e.target.value, 10) || 0)}
                placeholder={`Ex: ${dailyCost}`}
                min="1"
                className="bg-card border-border/50 h-12"
            />
            {tokensToSpend > 0 ? (
                <p className="text-sm text-lime-400">
                    Sua vitrine ficará ativa por: <strong>{sponsorshipDays} dia{sponsorshipDays !== 1 ? 's' : ''}</strong>.
                </p>
            ) : (
                <p className="text-sm text-muted-foreground">
                    Custo: {dailyCost} tokens por dia.
                </p>
            )}
            {!isBalanceSufficient && tokensToSpend > 0 && (
                <p className="text-sm text-red-500 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" />
                    Saldo de tokens insuficiente.
                </p>
            )}
        </div>


        <div className="pt-8 pb-24">
            <Button
                size="lg"
                className={cn(
                  "w-full h-12 text-lg font-bold transition-colors",
                  isFormValid
                    ? "bg-lime-500 hover:bg-lime-600 text-black"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
                onClick={handleSubmit}
                disabled={!isFormValid || isSubmitting}
            >
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Sparkles className="mr-2 h-5 w-5"/>}
                {isSubmitting ? 'Verificando...' : 'Solicitar Patrocínio'}
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

      {/* Calendar Modal */}
      <Dialog open={isCalendarModalOpen} onOpenChange={setIsCalendarModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                  <DialogTitle>Agendar Patrocínio</DialogTitle>
                  <DialogDescription>
                      As vagas para a data de hoje estão esgotadas. Por favor, escolha uma data de início futura para sua campanha.
                  </DialogDescription>
              </DialogHeader>
              <div className="py-4 flex justify-center">
                  <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) =>
                          date < new Date(new Date().setDate(new Date().getDate() - 1)) || 
                          disabledDates.some(disabledDate => 
                            date.getFullYear() === disabledDate.getFullYear() &&
                            date.getMonth() === disabledDate.getMonth() &&
                            date.getDate() === disabledDate.getDate()
                          )
                      }
                      initialFocus
                      locale={ptBR}
                  />
              </div>
              <DialogFooter>
                   <Button
                      type="button"
                      onClick={handleScheduleAndSubmit}
                      disabled={!selectedDate}
                      className="w-full bg-lime-500 hover:bg-lime-600 text-black"
                  >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      Agendar para {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : '...'}
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

    </div>
  );
}

    