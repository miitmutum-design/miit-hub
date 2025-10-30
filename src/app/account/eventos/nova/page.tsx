
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { ArrowLeft, Calendar, FileText, MapPin, Tag, ImageIcon, Ticket, Building, Link2, DollarSign, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCompany } from '@/contexts/CompanyContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { eventCategories } from '@/lib/data';


export default function CreateNewEventPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { companyProfile } = useCompany();
    
    const [title, setTitle] = useState('');
    const [eventType, setEventType] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [price, setPrice] = useState('');
    const [registrationLink, setRegistrationLink] = useState('');
    const [description, setDescription] = useState('');
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
        if (!title || !eventType || !date || !time || !location || !price || !description) {
            toast({
                variant: 'destructive',
                title: 'Campos obrigatórios',
                description: 'Por favor, preencha todos os campos essenciais para criar o evento.',
            });
            return;
        }

        console.log({ 
            companyId: companyProfile.id,
            title, 
            eventType,
            date,
            time,
            location,
            price,
            registrationLink,
            description, 
            imageUrl 
        });

        toast({
            title: 'Evento Criado!',
            description: 'Seu novo evento foi publicado com sucesso.',
        });

        router.push('/negocio/eventos/ev1');
    };


  return (
    <div className="container mx-auto max-w-lg py-6 sm:py-8">
      <header className="relative mb-8 flex items-center justify-center text-center">
        <Link href="/account/profile/events" className="absolute left-0">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground font-headline">
          Criar Novo Evento
        </h1>
      </header>
      
      <div className="space-y-6">
        <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Building className="w-5 h-5"/>
                Vincular Evento à Empresa
            </label>
            <Input id="company" value={companyProfile.name} disabled className="bg-card border-border/50 h-12" />
        </div>

        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Tag className="w-5 h-5"/>
            Nome do Evento
          </label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Workshop de Marketing Digital" className="bg-card border-border/50 h-12" />
        </div>
        
        <div className="space-y-2">
            <label htmlFor="eventType" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Ticket className="w-5 h-5"/>
                Tipo de Evento
            </label>
            <Select onValueChange={setEventType} value={eventType}>
                <SelectTrigger className="bg-card border-border/50 h-12">
                    <SelectValue placeholder="Selecione o tipo do evento" />
                </SelectTrigger>
                <SelectContent>
                    {eventCategories.map((cat) => (
                        <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5"/>
                Data do Evento
              </label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-card border-border/50 h-12" />
            </div>
            <div className="space-y-2">
              <label htmlFor="time" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-5 h-5"/>
                Hora de Início
              </label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="bg-card border-border/50 h-12" />
            </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <MapPin className="w-5 h-5"/>
            Localização do Evento
          </label>
          <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Endereço completo" className="bg-card border-border/50 h-12" />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <DollarSign className="w-5 h-5"/>
            Preço/Custo
          </label>
          <Input id="price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Ex: Gratuito, R$ 50,00" className="bg-card border-border/50 h-12" />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="registrationLink" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Link2 className="w-5 h-5"/>
            Link de Inscrição/Compra (Opcional)
          </label>
          <Input id="registrationLink" type="url" value={registrationLink} onChange={(e) => setRegistrationLink(e.target.value)} placeholder="https://exemplo.com/ingresso" className="bg-card border-border/50 h-12" />
        </div>

        <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Imagem do Evento (Opcional)
            </label>
            <button
                type="button"
                onClick={handleImageClick}
                className="relative w-full h-40 rounded-lg border-2 border-dashed border-border bg-card flex items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors"
            >
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt="Pré-visualização do Evento"
                        fill
                        className="object-cover rounded-lg"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <Ticket className="h-8 w-8" />
                        <span>Fazer upload da imagem do evento</span>
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
            Descrição do Evento
          </label>
          <Textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Descreva os detalhes do seu evento..." 
            className="bg-card border-border/50 min-h-[120px]"
          />
        </div>

        <div className="pt-8 pb-24">
            <Button
                size="lg"
                className="w-full h-12 text-lg bg-orange-600 hover:bg-orange-700 text-white font-bold"
                onClick={handleSubmit}
            >
                Criar Evento
            </Button>
        </div>

      </div>

    </div>
  );
}
