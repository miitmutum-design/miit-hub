
'use client';

import React, { useCallback, useEffect, useState } from 'react';
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
  {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHxhbmFseXRpY3N8ZW58MHx8fHwxNzYxNjg3NTc4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'modern restaurant',
    title: 'União Construtora',
    subtitle: 'Qualidade e Segurança!',
    link: '/business/1',
    linkType: 'internal',
  },
  {
    id: 2,
    imageUrl: 'https://images.unsplash.com/photo-1573612664822-d7d347da7b80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjbG90aGluZyUyMGJvdXRpcXVlfGVufDB8fHx8MTc2MTY2ODQ4NHww&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'clothing store',
    title: 'Flor de Lótus Móveis',
    subtitle: 'Móveis com 30% OFF',
    link: '/business/3', 
    linkType: 'internal',
  },
  {
    id: 3,
    imageUrl: 'https://picsum.photos/seed/ad3/1200/600',
    imageHint: 'tech gadget',
    title: 'Bellinha Kids',
    subtitle: 'Os melhores gadgets estão aqui',
    link: '/business/4', 
    linkType: 'internal',
  },
];

// Fisher-Yates shuffle algorithm
const shuffleArray = (array: Ad[]) => {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
};

const PremiumCarousel: React.FC = () => {
  const [shuffledAds, setShuffledAds] = useState<Ad[]>([]);

  useEffect(() => {
    // Shuffle ads on initial client-side render
    setShuffledAds(shuffleArray([...mockAds]));
  }, []);

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: shuffledAds.length > 1 }, [
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
  
  if (shuffledAds.length === 0) {
    return (
        <div className="relative w-full aspect-[16/8] bg-card rounded-lg animate-pulse"></div>
    );
  }


  return (
    <div className="relative w-full">
      <div className="overflow-hidden rounded-lg" ref={emblaRef}>
        <div className="flex">
          {shuffledAds.map((ad) => (
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
      
      {shuffledAds.length > 1 && (
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
