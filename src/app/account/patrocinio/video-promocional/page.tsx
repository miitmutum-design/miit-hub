
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { ArrowLeft, Upload, DollarSign, Sparkles, AlertTriangle, Calendar as CalendarIcon, Loader2, Video, Film, Text } from 'lucide-react';
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


export default function VideoPromocionalPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { companyProfile } = useCompany();

  const [campaignTitle, setCampaignTitle] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [tokensToSpend, setTokensToSpend] = useState(0);

  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoInputRef = useRef<HTMLInputElement>(null);

  const dailyCost = companyProfile.plan === 'Gold' ? 10 : 12;
  const isFormDisabled = companyProfile.tokens < dailyCost;

  const isBalanceSufficient = tokensToSpend <= companyProfile.tokens;
  const sponsorshipDays = tokensToSpend > 0 ? Math.floor(tokensToSpend / dailyCost) : 0;
  const isFormValid = campaignTitle.trim() !== '' && videoFile && tokensToSpend > 0 && isBalanceSufficient;


  const handleVideoClick = () => {
    videoInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setVideoPreview(previewUrl);
    } else {
      toast({
        variant: 'destructive',
        title: 'Arquivo Inválido',
        description: 'Por favor, selecione um arquivo de vídeo (MP4, MOV, etc.).',
      })
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

  const sendSponsorshipRequest = () => {
    console.log({
        companyId: companyProfile.id,
        sponsorshipProduct: 'Vídeo Promocional',
        campaignTitle,
        videoFileName: videoFile?.name,
        tokensSpent: tokensToSpend,
        sponsorshipDays: sponsorshipDays,
        startDate: selectedDate || new Date(),
    });

    toast({
        title: "Solicitação Enviada!",
        description: `Sua solicitação de Vídeo Promocional com ${tokensToSpend} tokens foi enviada para análise.`,
    });
    router.push('/account/patrocinio');
  }

  const handleSubmit = async () => {
    if (!isFormValid || isFormDisabled) {
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
          Vídeo Promocional
        </h1>
      </header>

      <div className="space-y-6">

        <Card className="bg-card">
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
          <div className="space-y-2 group-disabled:opacity-50">
              <Label htmlFor="campaignTitle" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Text className="h-5 w-5"/>
                  Título da Campanha <span className="text-red-500">*</span>
              </Label>
              <Input 
                  id="campaignTitle"
                  type="text"
                  value={campaignTitle}
                  onChange={(e) => setCampaignTitle(e.target.value)}
                  placeholder="Ex: Promoção de Inverno"
                  className="bg-card border-border/50 h-12"
              />
          </div>

          <div className="space-y-2 group-disabled:opacity-50">
              <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Upload className="h-5 w-5"/>
                  Upload do Vídeo (máx 30s) <span className="text-red-500">*</span>
              </Label>
              <button
                  type="button"
                  onClick={handleVideoClick}
                  className="relative w-full aspect-video rounded-lg border-2 border-dashed border-border bg-card flex items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors disabled:cursor-not-allowed disabled:hover:border-border"
              >
                  {videoPreview ? (
                      <video
                          src={videoPreview}
                          controls={false}
                          className="object-cover w-full h-full rounded-lg"
                      />
                  ) : (
                      <div className="flex flex-col items-center gap-2 text-center p-2">
                          <Film className="h-8 w-8" />
                          <span className="text-sm">Clique para fazer upload do vídeo</span>
                      </div>
                  )}
              </button>
              <input
                  type="file"
                  ref={videoInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="video/*"
              />
              {videoFile && <p className="text-xs text-muted-foreground">Arquivo selecionado: {videoFile.name}</p>}
          </div>
          
          <div className="space-y-2 group-disabled:opacity-50">
              <Label htmlFor="tokensToSpend" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <DollarSign className="h-5 w-5"/>
                  Tokens para Impulsionar
              </Label>
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
                      Seu vídeo ficará ativo por: <strong>{sponsorshipDays} dia{sponsorshipDays !== 1 ? 's' : ''}</strong>.
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
                    isFormValid && !isFormDisabled
                      ? "bg-lime-500 hover:bg-lime-600 text-black"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  )}
                  onClick={handleSubmit}
                  disabled={!isFormValid || isSubmitting || isFormDisabled}
              >
                  {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <Sparkles className="mr-2 h-5 w-5"/>}
                  {isSubmitting ? 'Verificando...' : 'Solicitar Patrocínio'}
              </Button>
          </div>
        </fieldset>
      </div>
      
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
