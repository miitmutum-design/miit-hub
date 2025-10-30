
'use client';

import { useState, useRef, ChangeEvent, useTransition, useEffect } from 'react';
import { ArrowLeft, Calendar, FileText, Percent, Tag, ImageIcon, Gift, Building, Sparkles, Loader2, RefreshCw, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCompany } from '@/contexts/CompanyContext';
import { generateOfferDescription } from '@/ai/flows/generate-offer-description';
import { generateCouponCode } from '@/ai/flows/generate-coupon-code';


export default function CreateNewOfferPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { companyProfile } = useCompany();
    
    const [title, setTitle] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [description, setDescription] = useState('');
    const [discount, setDiscount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [limitPerUser, setLimitPerUser] = useState(1);

    const [isGeneratingDesc, startDescTransition] = useTransition();
    const [isGeneratingCode, startCodeTransition] = useTransition();

    const imageInputRef = useRef<HTMLInputElement>(null);
    const isAiButtonEnabled = title.length >= 10;
    const MAX_DESC_LENGTH = 360;

    const handleImageClick = () => {
        imageInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const placeholderUrl = URL.createObjectURL(file);
            setImageUrl(placeholderUrl);
        }
    };

    const handleGenerateDescription = () => {
        if (!isAiButtonEnabled) {
            toast({
                variant: 'destructive',
                title: 'Informação Insuficiente',
                description: 'Por favor, preencha o título da oferta com pelo menos 10 caracteres.'
            });
            return;
        }

        startDescTransition(async () => {
            try {
                const result = await generateOfferDescription({
                    title,
                    discount,
                    startDate,
                    endDate,
                });
                 if (result && result.description) {
                    setDescription(result.description);
                    toast({
                        title: "Descrição Gerada!",
                        description: "A descrição da sua oferta foi preenchida com o texto da IA."
                    });
                } else {
                     throw new Error("A IA não conseguiu gerar uma descrição.");
                }

            } catch (error: any) {
                 console.error("Error generating offer description:", error);
                toast({
                    variant: "destructive",
                    title: "Falha na Geração",
                    description: error.message || "Ocorreu um erro ao contatar a IA. Tente novamente.",
                });
            }
        });
    }
    
    const handleGenerateCode = () => {
        startCodeTransition(async () => {
            try {
                const result = await generateCouponCode();
                if (result && result.couponCode) {
                    setCouponCode(result.couponCode);
                    toast({
                        title: "Código Gerado!",
                        description: "Um código de cupom exclusivo foi gerado."
                    });
                } else {
                     throw new Error("A IA não conseguiu gerar um código.");
                }
            } catch (error: any) {
                 console.error("Error generating coupon code:", error);
                toast({
                    variant: "destructive",
                    title: "Falha na Geração",
                    description: error.message || "Ocorreu um erro ao gerar o código. Tente novamente.",
                });
            }
        });
    }

    const handleSubmit = () => {
        // Validation Checks
        if (!title || !description || !discount || !startDate || !endDate || !couponCode) {
            toast({
                variant: 'destructive',
                title: 'Campos obrigatórios',
                description: 'Por favor, preencha todos os campos para criar a oferta.',
            });
            return;
        }

        if (couponCode.length < 8 || couponCode.length > 12) {
             toast({
                variant: 'destructive',
                title: 'Código de Cupom Inválido',
                description: 'O código do cupom deve ter entre 8 e 12 caracteres.',
            });
            return;
        }

        if (!/^[A-Z0-9]+$/.test(couponCode)) {
            toast({
                variant: 'destructive',
                title: 'Código de Cupom Inválido',
                description: 'O código do cupom deve conter apenas letras maiúsculas e números.',
            });
            return;
        }
        
        if (new Date(endDate) <= new Date(startDate)) {
            toast({
                variant: 'destructive',
                title: 'Data Inválida',
                description: 'A data de fim deve ser posterior à data de início.',
            });
            return;
        }
        
        if (limitPerUser < 1) {
            toast({
                variant: 'destructive',
                title: 'Limite Inválido',
                description: 'O limite de uso por consumidor deve ser de no mínimo 1.',
            });
            return;
        }

        // Here you would typically send the data to your backend and get an ID back
        console.log({ 
            companyId: companyProfile.id,
            companyName: companyProfile.name,
            title, 
            couponCode,
            limitPerUser,
            description, 
            discount, 
            startDate, 
            endDate, 
            imageUrl 
        });

        toast({
            title: 'Oferta Criada!',
            description: 'Sua nova oferta foi publicada com sucesso.',
        });

        // In a real app, you would get the new offer's ID from the backend.
        // For now, we'll redirect to a mock offer ID '1'.
        router.push('/negocio/offers/1');
    };


  return (
    <div className="container mx-auto max-w-lg py-6 sm:py-8">
      <header className="relative mb-8 flex items-center justify-center text-center">
        <Link href="/account/profile/offers" className="absolute left-0">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground font-headline">
          Criar Nova Oferta
        </h1>
      </header>
      
      <div className="space-y-6">
        <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Building className="w-5 h-5"/>
                Vincular Oferta à Empresa
            </label>
            <Input id="company" value={companyProfile.name} disabled className="bg-card border-border/50 h-12" />
        </div>

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Tag className="w-5 h-5"/>
            Título da Oferta
          </label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: 20% OFF em todo o site" className="bg-card border-border/50 h-12" />
        </div>
        
        <div className="space-y-2">
            <label htmlFor="couponCode" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Tag className="w-5 h-5"/>
                Código do Cupom
            </label>
            <div className="flex gap-2">
                 <Input 
                    id="couponCode" 
                    value={couponCode} 
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                    placeholder="Ex: CUPOM123" 
                    className="bg-card border-border/50 h-12"
                    maxLength={12}
                 />
                 <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 flex-shrink-0 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
                    onClick={handleGenerateCode}
                    disabled={isGeneratingCode}
                 >
                    {isGeneratingCode ? <Loader2 className="animate-spin" /> : <RefreshCw />}
                 </Button>
            </div>
            {couponCode && (
                <p className="text-xs text-muted-foreground text-right">{couponCode.length} / 12 caracteres</p>
            )}
        </div>

        <div className="space-y-2">
            <label htmlFor="limitPerUser" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UserCheck className="w-5 h-5"/>
                Limite de Uso por Consumidor
            </label>
            <Input 
              id="limitPerUser" 
              type="number"
              value={limitPerUser} 
              onChange={(e) => setLimitPerUser(parseInt(e.target.value, 10) || 1)} 
              min={1}
              className="bg-card border-border/50 h-12" 
            />
            <p className="text-xs text-muted-foreground">Defina o número máximo de vezes que um mesmo consumidor poderá resgatar esta oferta.</p>
        </div>

        <div className="space-y-2">
          <label htmlFor="discount" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Percent className="w-5 h-5"/>
            Valor do Desconto
          </label>
          <Input id="discount" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="Ex: 20% ou R$50" className="bg-card border-border/50 h-12" />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5"/>
                Data de Início
              </label>
              <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-card border-border/50 h-12" />
            </div>
            <div className="space-y-2">
              <label htmlFor="endDate" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5"/>
                Data de Fim
              </label>
              <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-card border-border/50 h-12" />
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Imagem da Oferta (Opcional)
            </label>
            <button
                type="button"
                onClick={handleImageClick}
                className="relative w-full h-40 rounded-lg border-2 border-dashed border-border bg-card flex items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors"
            >
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt="Pré-visualização da Oferta"
                        fill
                        className="object-cover rounded-lg"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <Gift className="h-8 w-8" />
                        <span>Fazer upload da imagem da oferta</span>
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
          <label htmlFor="description" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <FileText className="w-5 h-5"/>
            Descrição da Oferta
          </label>
          <Textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Descreva os detalhes da sua promoção ou clique no botão de IA..." 
            className="bg-card border-border/50 min-h-[120px]"
            maxLength={MAX_DESC_LENGTH}
          />
           <div className="flex justify-between items-center">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateDescription}
                    disabled={isGeneratingDesc || !isAiButtonEnabled}
                    className="gap-2 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary disabled:opacity-50"
                >
                    {isGeneratingDesc ? <Loader2 className="animate-spin" /> : <Sparkles />}
                    Gerar com IA
                </Button>
                <p className="text-sm text-right text-muted-foreground">
                    {description.length} / {MAX_DESC_LENGTH}
                </p>
            </div>
        </div>

        <div className="pt-8 pb-24">
            <Button
                size="lg"
                className="w-full h-12 text-lg bg-orange-600 hover:bg-orange-700 text-white font-bold"
                onClick={handleSubmit}
            >
                Criar Nova Oferta
            </Button>
        </div>

      </div>

    </div>
  );
}

    