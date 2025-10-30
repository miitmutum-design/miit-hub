
'use client';

import React, { useState, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import { sponsors } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { Sponsor } from '@/lib/data';

// Fisher-Yates shuffle algorithm to randomize array order
const shuffleArray = (array: Sponsor[]) => {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
};


const SponsorCarousel: React.FC = () => {
    const [emblaRef] = useEmblaCarousel({
        align: 'start',
        containScroll: 'trimSnaps',
    });

    const [shuffledSponsors, setShuffledSponsors] = useState<Sponsor[]>([]);

    useEffect(() => {
        // Shuffle sponsors on initial client-side render
        setShuffledSponsors(shuffleArray([...sponsors]));
    }, []);

    // Display a loading skeleton or nothing until the client-side shuffle is complete
    if (shuffledSponsors.length === 0) {
        return (
            <div className="overflow-hidden">
                <div className="flex gap-3 -ml-4 pl-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="flex-[0_0_auto] w-28">
                            <Card className="h-full bg-card aspect-[3/4] animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3 -ml-4 pl-4">
                {shuffledSponsors.map((sponsor) => {
                    const Icon = sponsor.icon as LucideIcon;
                    const isClickable = sponsor.businessId !== '#';

                    const cardContent = (
                        <Card className={cn(
                            "group h-full overflow-hidden transition-all duration-300 bg-card aspect-[3/4]",
                             isClickable && "cursor-pointer hover:shadow-lg hover:shadow-primary/20 hover:border-lime-400/50 border border-transparent"
                        )}>
                            <CardContent className="flex flex-col items-center justify-center p-4 gap-2 h-full">
                                <div className="bg-primary/10 p-4 rounded-lg">
                                    <Icon className={cn(
                                        "h-7 w-7 text-lime-400 transition-transform group-hover:scale-110",
                                        !isClickable && "text-muted-foreground"
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <p className={cn(
                                        "font-semibold text-sm text-center text-foreground",
                                        !isClickable && "text-muted-foreground"
                                        )}
                                    >
                                        {sponsor.name}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                    
                    return (
                         <div key={sponsor.id} className="flex-[0_0_auto] w-28">
                             {isClickable ? (
                                <Link href={`/business/${sponsor.businessId}`} className="block h-full">
                                    {cardContent}
                                </Link>
                             ) : (
                                <div>{cardContent}</div>
                             )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SponsorCarousel;
