
'use client';

import { getBusinessById, businessOffers, businessEvents } from '@/lib/data';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Star, MapPin, Clock, Phone, ArrowLeft, Bookmark, Share2, Globe, Info, Gift, Calendar, Ticket, Navigation, Building, ZapOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ReviewAnalysis from './review-analysis';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCompany } from '@/contexts/CompanyContext';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import type { Business } from '@/lib/data';
import type { CompanyProfile } from '@/contexts/CompanyContext';

// Create a default business structure for placeholder rendering
const defaultBusinessData: Business & Partial<CompanyProfile> = {
  id: 'placeholder',
  name: 'Nome da Empresa',
  category: 'Categoria',
  address: 'Endereço não informado',
  distance: 'N/A',
  rating: 0,
  reviews: [],
  description: 'Nenhuma descrição fornecida.',
  image: { url: '', hint: '' },
  backgroundUrl: null,
  logoUrl: null,
  whatsapp: '00000000000',
  websiteUrl: '',
  isAvailable: true,
};

export default function BusinessPage() {
  const params = useParams();
  const id = params.id as string;
  const { toggleFavorite, isFavorited, companyProfile } = useCompany();
  const { toast } = useToast();

  const businessFromStaticData = getBusinessById(id);

  // Prioritize companyProfile if it's a company and IDs match
  const isViewingOwnProfile = companyProfile && companyProfile.id === id && companyProfile.userType === 'Company';
  
  // Use the available data, or fall back to the default placeholder structure
  const displayData: Partial<CompanyProfile & Business> = isViewingOwnProfile 
    ? companyProfile 
    : (businessFromStaticData || defaultBusinessData);
  
  const isBookmarked = isFavorited(displayData.id || '');
  const activeOffers = businessOffers.filter(offer => new Date(offer.validUntil) > new Date() && offer.companyId === id);
  const activeEvents = businessEvents.filter(event => new Date(event.date) > new Date() && event.companyId === id);

  const handleShare = async () => {
    const shareData = {
      title: displayData.name,
      text: `Confira ${displayData.name}, com nota ${(displayData as any).rating || 'N/A'}! ${'category' in displayData && displayData.category ? `Uma ótima opção na categoria ${displayData.category}.` : ''}`,
      url: window.location.href,
    };

    try {
      if (navigator.share && window.isSecureContext) {
        await navigator.share(shareData);
      } else {
        throw new Error("Web Share API not supported.");
      }
    } catch (error) {
        console.warn("Web Share API failed, falling back to clipboard.", error);
        try {
            await navigator.clipboard.writeText(shareData.url);
            toast({
              title: "Link Copiado!",
              description: "O link da empresa foi copiado para a área de transferência.",
            });
        } catch (copyError) {
            console.error("Failed to copy to clipboard.", copyError);
            toast({
              variant: "destructive",
              title: "Oops!",
              description: "Não foi possível compartilhar ou copiar o link.",
            });
        }
    }
  };

  const address = ('address' in displayData && displayData.address) || 'Endereço não informado';
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  
  const whatsapp = ('whatsapp' in displayData && displayData.whatsapp) || '5521999999999';
  const whatsappUrl = `https://wa.me/${whatsapp}`;
  
  const formatPhoneNumber = (phone: string | undefined) => {
    if (!phone) return "Telefone não informado";
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{5})(\d{4})$/);
    if (match) {
        return `(${match[2]}) ${match[3]}-${match[4]}`;
    }
    return phone;
  };

  const isAvailable = displayData.isAvailable ?? true;
  const reviews = ('reviews' in displayData && displayData.reviews) || [];
  const category = 'category' in displayData ? displayData.category : "Categoria";
  const distance = 'distance' in displayData ? displayData.distance : null;
  const rating = 'rating' in displayData ? displayData.rating : 0;
  const image = ('image' in displayData && displayData.image) ? displayData.image : null;


  return (
    <div className="bg-background min-h-screen text-foreground">
      {/* Header */}
      <div className="relative h-64 w-full">
        <header className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4">
            <Link href="/">
                <Button variant="ghost" size="icon" className="bg-black/50 hover:bg-black/70 rounded-full">
                    <ArrowLeft />
                </Button>
            </Link>
            <div className="flex items-center gap-2">
                <Button 
                variant="ghost" 
                size="icon" 
                className="bg-black/50 hover:bg-black/70 rounded-full"
                onClick={() => toggleFavorite(displayData.id || '')}
                >
                    <Bookmark className={cn(isBookmarked && "fill-current")} />
                </Button>
                <Button variant="ghost" size="icon" className="bg-black/50 hover:bg-black/70 rounded-full" onClick={handleShare}>
                    <Share2 />
                </Button>
            </div>
        </header>

        {displayData.backgroundUrl ? (
             <Image
                src={displayData.backgroundUrl}
                alt={`${displayData.name} background`}
                fill
                className="object-cover"
            />
        ) : image && image.url ? (
             <Image
                src={image.url}
                alt={`${displayData.name} background`}
                fill
                className="object-cover"
                data-ai-hint={image.hint}
             />
        ) : (
             <div className="w-full h-full bg-card" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        
        <div className="absolute -bottom-16 left-4">
            <Avatar className="h-32 w-32 border-4 border-background">
                {displayData.logoUrl ? (
                    <AvatarImage src={displayData.logoUrl} alt={`Logo de ${displayData.name}`} />
                ) : (
                    <AvatarFallback className="bg-card">
                        <Building className="h-16 w-16 text-muted-foreground/50" />
                    </AvatarFallback>
                )}
            </Avatar>
        </div>
      </div>
      
      <div className="p-4 sm:p-6 mt-16">
        {/* Business Info */}
        <div className="grid grid-cols-3 items-start mb-4">
          <div className="col-span-2">
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              {displayData.name || "Nome da Empresa"}
            </h1>
            <p className="text-muted-foreground mt-1">{category}</p>
          </div>
          <div className="text-right">
             {rating > 0 && (
                <>
                <div className="inline-flex items-center gap-1.5 bg-orange-600 text-white font-bold py-1 px-3 rounded-lg">
                    <Star className="h-4 w-4 fill-white" />
                    <span>{rating}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{reviews.length * 31} avaliações</p>
                </>
             )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm mb-6">
          {isAvailable ? (
            <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-none">Aberto agora</Badge>
          ): (
            <Badge variant="destructive" className="bg-orange-600/20 text-orange-400 border-none items-center gap-1.5">
                <ZapOff className="h-3.5 w-3.5"/>
                Fechada no Momento
            </Badge>
          )}
          {distance && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{distance}</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-card mb-6">
            <TabsTrigger value="info">INFO</TabsTrigger>
            <TabsTrigger value="offers">OFERTAS</TabsTrigger>
            <TabsTrigger value="events">EVENTOS</TabsTrigger>
            <TabsTrigger value="reviews">AVALIAÇÕES</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info">
            <div className="bg-card p-4 rounded-lg space-y-6">
                <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-primary mt-1"/>
                    <div>
                        <p className="font-semibold">Endereço</p>
                        <p className="text-muted-foreground">{address}</p>
                        <Link 
                          href={mapsUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-primary font-semibold text-sm mt-1 inline-flex items-center gap-1.5"
                        >
                          <Navigation className="h-4 w-4" />
                          Ver no mapa
                        </Link>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <Clock className="h-5 w-5 text-primary mt-1"/>
                    <div>
                        <p className="font-semibold">Horário</p>
                        <p className={cn(
                          "text-muted-foreground",
                          isAvailable && "text-primary"
                        )}>Seg-Sáb: 11h-23h</p>
                    </div>
                </div>
                
                {isAvailable ? (
                    <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 cursor-pointer group">
                        <Phone className="h-5 w-5 text-primary mt-1"/>
                        <div>
                            <p className="font-semibold">Whatsapp</p>
                            <p className="text-primary group-hover:underline">{formatPhoneNumber(whatsapp)}</p>
                        </div>
                    </Link>
                ) : (
                    <div className="flex items-start gap-4 opacity-50">
                        <Phone className="h-5 w-5 text-muted-foreground mt-1"/>
                        <div>
                            <p className="font-semibold">Whatsapp</p>
                            <p className="text-muted-foreground">{formatPhoneNumber(whatsapp)}</p>
                        </div>
                    </div>
                )}
                
                {('websiteUrl' in displayData && displayData.websiteUrl) && (
                  <div className="flex items-start gap-4">
                      <Globe className="h-5 w-5 text-primary mt-1"/>
                      <div>
                          <p className="font-semibold">Site</p>
                          <Link href={`/webview?url=${encodeURIComponent(displayData.websiteUrl)}`} className="text-primary font-semibold text-sm mt-1 inline-block">Ver o site</Link>
                      </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                    <Info className="h-5 w-5 text-primary mt-1"/>
                    <div>
                        <p className="font-semibold">Sobre</p>
                        <p className="text-muted-foreground text-sm">{displayData.description || "Nenhuma descrição fornecida."}</p>
                    </div>
                </div>
            </div>
          </TabsContent>
          
          <TabsContent value="offers">
            {activeOffers.length > 0 && isAvailable ? (
                <div className="space-y-4">
                {activeOffers.map(offer => (
                    <Link key={offer.id} href={`/negocio/offers/${offer.id}`} className="block">
                        <Card className="bg-card border-border/50">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="bg-primary/10 p-3 rounded-lg">
                                    <Ticket className="h-6 w-6 text-primary"/>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-foreground">{offer.title}</p>
                                    <p className="text-sm text-muted-foreground">Válido até {new Date(offer.validUntil).toLocaleDateString()}</p>
                                </div>
                                <Badge variant="secondary">{offer.discount}</Badge>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg bg-card">
                    <Gift className="w-16 h-16 text-muted-foreground/50 mb-4" />
                    <h2 className="text-2xl font-semibold font-headline">Nenhuma oferta ativa</h2>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                        Esta empresa não tem ofertas disponíveis no momento.
                    </p>
                </div>
            )}
          </TabsContent>

          <TabsContent value="events">
             {activeEvents.length > 0 && isAvailable ? (
                <div className="space-y-4">
                {activeEvents.map(event => (
                    <Link key={event.id} href={`/negocio/eventos/${event.id}`} className="block">
                        <Card className="bg-card border-border/50">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="bg-primary/10 p-3 rounded-lg">
                                    <Calendar className="h-6 w-6 text-primary"/>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-foreground">{event.title}</p>
                                    <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg bg-card">
                    <Calendar className="w-16 h-16 text-muted-foreground/50 mb-4" />
                    <h2 className="text-2xl font-semibold font-headline">Nenhum evento agendado</h2>
                    <p className="text-muted-foreground mt-2 max-w-sm">
                        Esta empresa não tem eventos futuros no momento.
                    </p>
                </div>
            )}
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewAnalysis initialReviews={reviews} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
