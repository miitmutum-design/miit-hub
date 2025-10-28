import { getBusinessById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Star, MapPin, Clock, Phone, Utensils, ArrowLeft, Bookmark, Share2, Globe, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ReviewAnalysis from './review-analysis';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function BusinessPage({ params }: { params: { id: string } }) {
  const business = getBusinessById(params.id);

  if (!business) {
    notFound();
  }

  return (
    <div className="bg-background min-h-screen text-foreground">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4">
        <Link href="/">
            <Button variant="ghost" size="icon" className="bg-black/50 hover:bg-black/70 rounded-full">
                <ArrowLeft />
            </Button>
        </Link>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="bg-black/50 hover:bg-black/70 rounded-full">
                <Bookmark />
            </Button>
            <Button variant="ghost" size="icon" className="bg-black/50 hover:bg-black/70 rounded-full">
                <Share2 />
            </Button>
        </div>
      </header>
      
      {/* Icon */}
      <div className="flex justify-center items-center h-56 w-full bg-card">
        <Utensils className="w-24 h-24 text-muted-foreground/50" />
      </div>

      <div className="p-4 sm:p-6">
        {/* Business Info */}
        <div className="grid grid-cols-3 items-start mb-4">
          <div className="col-span-2">
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              {business.name}
            </h1>
            <p className="text-muted-foreground mt-1">{business.category}</p>
          </div>
          <div className="text-right">
             <div className="inline-flex items-center gap-1.5 bg-orange-600 text-white font-bold py-1 px-3 rounded-lg">
                <Star className="h-4 w-4 fill-white" />
                <span>{business.rating}</span>
             </div>
             <p className="text-xs text-muted-foreground mt-1">{business.reviews.length * 31} avaliações</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm mb-6">
          <Badge variant="secondary" className="bg-green-700/20 text-green-300 border-none">Aberto agora</Badge>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{business.distance}</span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-card mb-6">
            <TabsTrigger value="info">INFORMAÇÕES</TabsTrigger>
            <TabsTrigger value="reviews">AVALIAÇÕES</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info">
            <div className="bg-card p-4 rounded-lg space-y-6">
                <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 text-primary mt-1"/>
                    <div>
                        <p className="font-semibold">Endereço</p>
                        <p className="text-muted-foreground">Rua das Flores, 123 - Centro</p>
                        <Link href="#" className="text-primary font-semibold text-sm mt-1 inline-block">Ver no mapa &rarr;</Link>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <Clock className="h-5 w-5 text-primary mt-1"/>
                    <div>
                        <p className="font-semibold">Horário</p>
                        <p className="text-muted-foreground">Seg-Sáb: 11h-23h</p>
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <Phone className="h-5 w-5 text-primary mt-1"/>
                    <div>
                        <p className="font-semibold">Telefone</p>
                        <p className="text-muted-foreground">(65) 99999-9999</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <Globe className="h-5 w-5 text-primary mt-1"/>
                    <div>
                        <p className="font-semibold">Site</p>
                        <Link href="#" className="text-primary font-semibold text-sm mt-1 inline-block">Ver o site &rarr;</Link>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <Info className="h-5 w-5 text-primary mt-1"/>
                    <div>
                        <p className="font-semibold">Sobre</p>
                        <p className="text-muted-foreground text-sm">{business.description}</p>
                    </div>
                </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <ReviewAnalysis initialReviews={business.reviews} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
