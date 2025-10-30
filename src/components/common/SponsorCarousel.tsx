
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { sponsors } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import type { Sponsor } from '@/lib/data';

const shuffleArray = (array: Sponsor[]) => {
  let currentIndex = array.length,  randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};


const SponsorCarousel: React.FC = () => {
    const [shuffledSponsors, setShuffledSponsors] = useState<Sponsor[]>([]);

    useEffect(() => {
        setShuffledSponsors(shuffleArray([...sponsors]));
    }, []);

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
    
    const sponsorList = [...shuffledSponsors, ...shuffledSponsors];

    return (
        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-2 animate-marquee hover:[animation-play-state:paused]">
                {sponsorList.map((sponsor, index) => {
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
                         <li key={`${sponsor.id}-${index}`} className="flex-[0_0_auto] w-28">
                             {isClickable ? (
                                <Link href={`/business/${sponsor.businessId}`} className="block h-full">
                                    {cardContent}
                                </Link>
                             ) : (
                                <div>{cardContent}</div>
                             )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default SponsorCarousel;
