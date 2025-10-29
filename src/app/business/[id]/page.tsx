'use client';

import { getBusinessById, businessOffers, businessEvents } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import Image from 'next/image';
import { Star, MapPin, Clock, Phone, Utensils, ArrowLeft, Bookmark, Share2, Globe, Info, Gift, Calendar, Ticket, Navigation, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ReviewAnalysis from './review-analysis';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCompany } from '@/contexts/CompanyContext';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';


export default function BusinessPage() {
  const params = useParams();
  const id = params.id as string;
  const business = getBusinessById(id);
  const { toggleFavorite, isFavorited, companyProfile } = useCompany();
  const { toast } = useToast();

  if (!business) {
    notFound();
  }

  // Use companyProfile from context if the ID matches, otherwise use static business data
  const displayData = companyProfile && companyProfile.id === id && companyProfile.userType === 'Company'
    ? { ...business, ...companyProfile }
    : business;
  
  const isBookmarked = isFavorited(displayData.id);
  const activeOffers = businessOffers.filter(offer => new Date(offer.validUntil) > new Date() && offer.companyId === id);
  const activeEvents = businessEvents.filter(event => new Date(event.date) > new Date() && event.companyId === id);

  const handleShare = async () => {
    const shareData = {
      title: displayData.name,
      text: `Confira ${displayData.name}, com nota ${displayData.rating}! Uma ótima opção na categoria ${displayData.category}.`,
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

  const destinationAddress = "Rua Haddock Lobo, 210, Tijuca, Rio de Janeiro, RJ";
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destinationAddress)}`;
  const whatsappUrl = `https://wa.me/${displayData.whatsapp}`;
  
  const formatPhoneNumber = (phone: string) => {
    const cleaned = ('' + phone).replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{5})(\d{4})$/);
    if (match) {
        return `(${match[2]}) ${match[3]}-${match[4]}`;
    }
    return phone;
  };

  const isOpen = true; // Mock status

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
                onClick={() => toggleFavorite(displayData.id)}
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
        ) : (
             <div className="w-full h-full bg-card" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        
        <div className="absolute -bottom-16 left-4">
            <Avatar className="h-32 w-32 border-4 border-background">
                {displayData.logoUrl ? (
                    <Image src={displayData.logoUrl} alt={`Logo de ${displayData.name}`} fill className="object-cover" />
                ) : (
                    <AvatarFallback className="bg-card rounded-none">
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
              {displayData.name}
            </h1>
            <p className="text-muted-foreground mt-1">{displayData.category}</p>
          </div>
          <div className="text-right">
             <div className="inline-flex items-center gap-1.5 bg-orange-600 text-white font-bold py-1 px-3 rounded-lg">
                <Star className="h-4 w-4 fill-white" />
                <span>{displayData.rating}</span>
             </div>
             <p className="text-xs text-muted-foreground mt-1">{displayData.reviews.length * 31} avaliações</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm mb-6">
          <Badge variant="secondary" className="bg-green-600/20 text-green-300 border-none">Aberto agora</Badge>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{displayData.distance}</span>
          </div>
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
                        <p className="text-muted-foreground">Rua das Flores, 123 - Centro</p>
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
                          isOpen && "text-primary"
                        )}>Seg-Sáb: 11h-23h</p>
                    </div>
                </div>
                
                {isOpen ? (
                    <Link href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 cursor-pointer group">
                        <Phone className="h-5 w-5 text-primary mt-1"/>
                        <div>
                            <p className="font-semibold">Whatsapp</p>
                            <p className="text-primary group-hover:underline">{formatPhoneNumber(displayData.whatsapp)}</p>
                        </div>
                    </Link>
                ) : (
                    <div className="flex items-start gap-4 opacity-50">
                        <Phone className="h-5 w-5 text-muted-foreground mt-1"/>
                        <div>
                            <p className="font-semibold">Whatsapp</p>
                            <p className="text-muted-foreground">{formatPhoneNumber(displayData.whatsapp)}</p>
                        </div>
                    </div>
                )}
                
                <div className="flex items-start gap-4">
                    <Globe className="h-5 w-5 text-primary mt-1"/>
                    <div>
                        <p className="font-semibold">Site</p>
                        <Link href={`/webview?url=${encodeURIComponent(displayData.websiteUrl)}`} className="text-primary font-semibold text-sm mt-1 inline-block">Ver o site</Link>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <Info className="h-5 w-5 text-primary mt-1"/>
                    <div>
                        <p className="font-semibold">Sobre</p>
                        <p className="text-muted-foreground text-sm">{displayData.description}</p>
                    </div>
                </div>
            </div>
          </TabsContent>
          
          <TabsContent value="offers">
            {activeOffers.length > 0 ? (
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
             {activeEvents.length > 0 ? (
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
            <ReviewAnalysis initialReviews={displayData.reviews} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
