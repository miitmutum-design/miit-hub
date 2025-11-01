
'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { ArrowLeft, Building, Upload, DollarSign, Sparkles, CheckCircle, AlertTriangle, Calendar as CalendarIcon, Loader2, Info, Gift, Ticket as EventTicket, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useCompany } from '@/contexts/CompanyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from "@/components/ui/calendar"
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mock function to check for available slots. In a real app, this would query Firestore.
const checkTodaysAvailability = async (): Promise<number> => {
  // For demonstration, let's assume 1 slot is occupied today, leaving 2 free.
  return await new Promise(resolve => setTimeout(() => resolve(1), 500));
};

const checkFutureDateAvailability = async (date: Date): Promise<boolean> => {
  // For demonstration, let's assume today is always fully booked for this check.
  const today = new Date();
  if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
    return false; // No slots available today
  }
  return true; // Slots available on other days
};

// Mock list of fully booked dates
const disabledDates = [
  new Date(), // Today is booked
  new Date(new Date().setDate(new Date().getDate() + 5)),
  new Date(new Date().setDate(new Date().getDate() + 6)),
];


export default function DestaqueTotalBannerPage() {
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
  
  const [occupiedSlotsToday, setOccupiedSlotsToday] = useState(0);
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);

  const imageInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const fetchTodaysSlots = async () => {
      setIsLoadingSlots(true);
      const slots = await checkTodaysAvailability();
      setOccupiedSlotsToday(slots);
      setIsLoadingSlots(false);
    }
    fetchTodaysSlots();
  }, []);

  const dailyCost = companyProfile.plan === 'Gold' ? 7 : 10;
  const isFormDisabled = companyProfile.tokens < dailyCost;
  const totalSlots = 3;
  const hasAvailableSlotsToday = occupiedSlotsToday < totalSlots;

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

  const handleTokenInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10) || 0;
    setTokensToSpend(value);
  };

  const handleTokenInputBlur = () => {
    if (tokensToSpend === 0) return;
    if (tokensToSpend < dailyCost) {
        setTokensToSpend(dailyCost);
        return;
    }
    const remainder = tokensToSpend % dailyCost;
    if (remainder !== 0) {
        const roundedTokens = Math.ceil(tokensToSpend / dailyCost) * dailyCost;
        setTokensToSpend(roundedTokens);
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

  const sendSponsorshipRequest = (startDate: Date) => {
    console.log({
        companyId: companyProfile.id,
        sponsorshipType,
        bannerName,
        destinationUrl,
        bannerImage,
        tokensSpent: tokensToSpend,
        sponsorshipDays: sponsorshipDays,
        startDate: startDate,
    });

    toast({
        title: "Solicitação Enviada!",
        description: `Sua solicitação de patrocínio com ${tokensToSpend} tokens foi enviada para análise.`,
    });
    router.push('/account/patrocinio');
  }

  const handleSubmitNow = async () => {
    if (!isFormValid || isFormDisabled || !hasAvailableSlotsToday) {
        toast({
            variant: 'destructive',
            title: "Não é possível publicar agora",
            description: "Verifique se o formulário está preenchido, se há saldo de tokens e se há vagas para hoje.",
        });
        return;
    }
    
    setIsSubmitting(true);
    sendSponsorshipRequest(new Date());
    setIsSubmitting(false);
  }

  const handleScheduleClick = () => {
    if (!isFormValid || isFormDisabled) {
      toast({ variant: 'destructive', title: 'Formulário inválido', description: 'Preencha todos os campos e verifique seu saldo.'});
      return;
    }
    setIsCalendarModalOpen(true);
  }

  const handleScheduleAndSubmit = async () => {
    if (!selectedDate) {
      toast({ variant: 'destructive', title: 'Nenhuma data selecionada' });
      return;
    }

    setIsSubmitting(true);
    const isAvailable = await checkFutureDateAvailability(selectedDate);
    setIsSubmitting(false);

    if (isAvailable) {
        sendSponsorshipRequest(selectedDate);
        setIsCalendarModalOpen(false);
    } else {
        toast({
            variant: "destructive",
            title: "Vagas Esgotadas!",
            description: "Não há vagas para a data selecionada. Por favor, escolha outra data.",
        });
    }
  };

  const bannerLabels = {
    empresa: { label: 'Nome da Empresa', icon: Building },
    ofertas: { label: 'Nome da Oferta', icon: Gift },
    eventos: { label: 'Nome do Evento', icon: EventTicket },
  };

  const { label: bannerNameLabel, icon: BannerIcon } = bannerLabels[sponsorshipType as keyof typeof bannerLabels];


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

      <Card className="mb-6 bg-card">
        <CardHeader className="p-4 flex flex-row items-center justify-between">
           <CardTitle className="text-lg font-headline">
              Carteira de Tokens {companyProfile.plan && `(${companyProfile.plan})`}
            </CardTitle>
          <Link href="/account/subscription">
              <Button variant="outline" size="sm">
                  Recarregar
              </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-6 pt-0">
            <p className="text-sm text-muted-foreground">Seu Saldo Atual</p>
            <p className="text-3xl font-bold text-lime-400">{companyProfile.tokens} Tokens</p>
             {isFormDisabled && (
                <div className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4" />
                    Saldo insuficiente para patrocinar. Por favor, recarregue.
                </div>
            )}
        </CardContent>
      </Card>

      <fieldset disabled={isFormDisabled} className="space-y-6 group">
        <div className="text-center group-disabled:opacity-50">
          <p className="text-muted-foreground">Qual a intenção da sua campanha no banner principal?</p>
        </div>
        
        <Tabs defaultValue="empresa" value={sponsorshipType} onValueChange={setSponsorshipType} className="w-full group-disabled:opacity-50">
          <TabsList className="grid w-full grid-cols-3 bg-card mb-6">
              <TabsTrigger value="empresa" className="flex gap-2 data-[state=active]:bg-lime-900/50 data-[state=active]:text-lime-300"><Building className="h-4 w-4"/> Empresa</TabsTrigger>
              <TabsTrigger value="ofertas" className="flex gap-2 data-[state=active]:bg-lime-900/50 data-[state=active]:text-lime-300">Oferta</TabsTrigger>
              <TabsTrigger value="eventos" className="flex gap-2 data-[state=active]:bg-lime-900/50 data-[state=active]:text-lime-300">Evento</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="space-y-6 group-disabled:opacity-50">
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
                  placeholder="Nome que aparecerá no banner"
                  className="bg-card border-border/50 h-12"
                  maxLength={50}
              />
          </div>
          <div className="space-y-2">
              <label htmlFor="banner-image" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Upload className="h-5 w-5"/>
                  Imagem do Banner (16:8) <span className="text-red-500">*</span>
              </label>
              <button
                  type="button"
                  onClick={handleImageClick}
                  className="relative w-full aspect-[2/1] rounded-lg border-2 border-dashed border-border bg-card flex items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors disabled:cursor-not-allowed disabled:hover:border-border"
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
                  Tipo de Link de Destino <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-4">
                  <div onClick={() => !isFormDisabled && setIsWhatsappModalOpen(true)}>
                      <Label htmlFor="whatsapp" className={cn("flex flex-col items-center justify-center rounded-md border-2 p-4 transition-colors", linkType === 'whatsapp' ? 'border-primary bg-primary/10' : 'border-muted bg-popover', !isFormDisabled && "cursor-pointer hover:bg-accent")}>
                          WhatsApp
                          {linkType === 'whatsapp' && <CheckCircle className="w-4 h-4 text-primary mt-1" />}
                      </Label>
                  </div>
                    <div onClick={() => !isFormDisabled && setIsInstagramModalOpen(true)}>
                      <Label htmlFor="instagram" className={cn("flex flex-col items-center justify-center rounded-md border-2 p-4 transition-colors", linkType === 'instagram' ? 'border-primary bg-primary/10' : 'border-muted bg-popover', !isFormDisabled && "cursor-pointer hover:bg-accent")}>
                          Instagram
                          {linkType === 'instagram' && <CheckCircle className="w-4 h-4 text-primary mt-1" />}
                      </Label>
                  </div>
                    <div onClick={() => !isFormDisabled && setIsSiteModalOpen(true)}>
                      <Label htmlFor="site" className={cn("flex flex-col items-center justify-center rounded-md border-2 p-4 transition-colors", linkType === 'site' ? 'border-primary bg-primary/10' : 'border-muted bg-popover', !isFormDisabled && "cursor-pointer hover:bg-accent")}>
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
                  onChange={handleTokenInputChange}
                  onBlur={handleTokenInputBlur}
                  placeholder={`Ex: ${dailyCost}`}
                  min={dailyCost}
                  step={1}
                  className="bg-card border-border/50 h-12"
              />
              {sponsorshipDays > 0 ? (
                  <p className="text-sm text-lime-400">
                      Seu patrocínio ficará ativo por: <strong>{sponsorshipDays} dia{sponsorshipDays !== 1 ? 's' : ''}</strong>.
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
        </div>
        
        <div className="pt-8 pb-24 space-y-4 group-disabled:opacity-50">
            <Label>Escolha de Publicação</Label>
            <div className="grid grid-cols-2 gap-4">
                <Button
                    size="lg"
                    className={cn(
                        "w-full h-12 text-lg font-bold transition-colors",
                        isFormValid && !isFormDisabled && hasAvailableSlotsToday
                        ? "bg-lime-500 hover:bg-lime-600 text-black"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                    onClick={handleSubmitNow}
                    disabled={!isFormValid || isSubmitting || isFormDisabled || !hasAvailableSlotsToday || isLoadingSlots}
                    >
                    {isLoadingSlots ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Sparkles className="mr-2 h-5 w-5"/>}
                    Publicar Agora
                </Button>
                 <Button
                    size="lg"
                    variant="outline"
                    className={cn(
                        "w-full h-12 text-lg font-bold transition-colors",
                         isFormValid && !isFormDisabled ? "border-primary text-primary hover:bg-primary/10" : "cursor-not-allowed"
                    )}
                    onClick={handleScheduleClick}
                    disabled={!isFormValid || isSubmitting || isFormDisabled || isLoadingSlots}
                    >
                    <CalendarIcon className="mr-2 h-5 w-5"/>
                    Agendar
                </Button>
            </div>
             {isLoadingSlots ? (
                <p className="text-xs text-muted-foreground text-center animate-pulse">Verificando vagas...</p>
            ) : hasAvailableSlotsToday ? (
                 <p className="text-xs text-muted-foreground text-center">Vagas disponíveis para hoje!</p>
            ) : (
                 <p className="text-xs text-orange-400 text-center">Vagas para hoje esgotadas. Por favor, agende.</p>
            )}
        </div>
        
      </fieldset>
      
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
                      disabled={!selectedDate || isSubmitting}
                      className="w-full bg-lime-500 hover:bg-lime-600 text-black"
                  >
                      {isSubmitting ? <Loader2 className="animate-spin" /> : <CalendarIcon className="mr-2 h-4 w-4" />}
                      {isSubmitting ? 'Agendando...' : `Agendar para ${selectedDate ? format(selectedDate, 'dd/MM/yyyy') : '...'}`}
                  </Button>
              </DialogFooter>
          </DialogContent>
      </Dialog>

    </div>
  );
}

    