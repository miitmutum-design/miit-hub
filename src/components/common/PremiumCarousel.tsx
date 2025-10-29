
'use client';

import React, { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Ad = {
  id: number;
  imageUrl: string;
  imageHint: string;
  title: string;
  subtitle: string;
  link: string;
  linkType: 'internal' | 'external';
};

const mockAds: Ad[] = [
  // {
  //   id: 1,
  //   imageUrl: 'https://picsum.photos/seed/ad1/1200/600',
  //   imageHint: 'modern restaurant',
  //   title: 'Restaurante Sabor Divino',
  //   subtitle: 'Nova filial no centro!',
  //   link: 'https://www.google.com/maps/search/?api=1&query=Restaurante+Sabor+Divino',
  //   linkType: 'external',
  // },
  // {
  //   id: 2,
  //   imageUrl: 'https://picsum.photos/seed/ad2/1200/600',
  //   imageHint: 'clothing store',
  //   title: 'Estilo & Cia',
  //   subtitle: 'Coleção de inverno com 30% OFF',
  //   link: '/business/6', // Example internal link to a business
  //   linkType: 'internal',
  // },
  // {
  //   id: 3,
  //   imageUrl: 'https://picsum.photos/seed/ad3/1200/600',
  //   imageHint: 'tech gadget',
  //   title: 'TechNova',
  //   subtitle: 'Os melhores gadgets estão aqui',
  //   link: 'https://tech-nova-example.com',
  //   linkType: 'internal', // This will use the WebView
  // },
];

const fallbackAd = {
  id: 0,
  imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxhbmFseXRpY3N8ZW58MHx8fHwxNzYxNjg3NTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  imageHint: 'analytics dashboard',
  title: 'Anuncie Aqui',
  subtitle: 'Alcance milhares de clientes',
  link: '/account', // Link to account/subscription page for companies
  linkType: 'internal' as const,
};

const PremiumCarousel: React.FC = () => {
  const adsToShow = mockAds.length > 0 ? mockAds : [fallbackAd];
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: adsToShow.length > 1 }, [
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  ]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const getHref = (ad: Ad) => {
    if (ad.linkType === 'internal' && !ad.link.startsWith('/')) {
        return `/webview?url=${encodeURIComponent(ad.link)}`;
    }
    return ad.link;
  }

  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {adsToShow.map((ad) => (
            <div key={ad.id} className="relative flex-[0_0_100%] aspect-[16/8]">
              <Link href={getHref(ad)} target={ad.linkType === 'external' ? '_blank' : '_self'}>
                <Image
                  src={ad.imageUrl}
                  alt={ad.title}
                  fill
                  className="object-cover"
                  data-ai-hint={ad.imageHint}
                />
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-4 text-center">
                  <h3 className="text-3xl font-bold font-headline">{ad.title}</h3>
                  <p className="mt-1 text-lg">{ad.subtitle}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      
      {adsToShow.length > 1 && (
        <>
        <Button
          variant="ghost"
          size="icon"
          onClick={scrollPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={scrollNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
        </>
      )}
    </div>
  );
};

export default PremiumCarousel;
