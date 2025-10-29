
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { ArrowLeft, Calendar, FileText, Percent, Tag, ImageIcon, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CreateNewOfferPage() {
    const { toast } = useToast();
    const router = useRouter();
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [discount, setDiscount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const imageInputRef = useRef<HTMLInputElement>(null);

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

    const handleSubmit = () => {
        if (!title || !description || !discount || !startDate || !endDate) {
            toast({
                variant: 'destructive',
                title: 'Campos obrigatórios',
                description: 'Por favor, preencha todos os campos para criar a oferta.',
            });
            return;
        }

        // Here you would typically send the data to your backend
        console.log({ title, description, discount, startDate, endDate, imageUrl });

        toast({
            title: 'Oferta Criada!',
            description: 'Sua nova oferta foi publicada com sucesso.',
        });

        router.push('/account/ofertas/historico');
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
          <label htmlFor="title" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Tag className="w-5 h-5"/>
            Título da Oferta
          </label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: 20% OFF em todo o site" className="bg-card border-border/50 h-12" />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <FileText className="w-5 h-5"/>
            Descrição
          </label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva os detalhes da sua promoção..." className="bg-card border-border/50 min-h-[120px]" />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="discount" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Percent className="w-5 h-5"/>
            Valor do Desconto
          </label>
          <Input id="discount" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="Ex: 20% ou R$50" className="bg-card border-border/50 h-12" />
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
      </div>
      
       <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-t-border/50 sm:static sm:bg-transparent sm:border-t-0 sm:p-0 sm:mt-8">
            <Button
                size="lg"
                className="w-full h-12 text-lg bg-orange-600 hover:bg-orange-700 text-white font-bold"
                onClick={handleSubmit}
            >
                Criar Nova Oferta
            </Button>
      </div>

    </div>
  );
}
