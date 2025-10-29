
'use client';

import { useState } from 'react';
import { ArrowLeft, Calendar, FileText, Percent, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function CreateNewOfferPage() {
    const { toast } = useToast();
    const router = useRouter();
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [discount, setDiscount] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

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
        console.log({ title, description, discount, startDate, endDate });

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
      
       <div className="fixed bottom-20 left-0 right-0 p-4 bg-background border-t border-border/50 md:static md:bg-transparent md:border-t-0 md:p-0 md:mt-8">
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
