
'use client';

import React, { useState, useEffect, useRef } from 'react';
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
    const carouselRef = useRef<HTMLUListElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setShuffledSponsors(shuffleArray([...sponsors]));
    }, []);
    
    const startScrolling = () => {
        if (intervalRef.current) return;
        intervalRef.current = setInterval(() => {
            if (carouselRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
                
                if (scrollLeft >= scrollWidth / 2) {
                    // When it reaches the end of the first set, reset silently
                    carouselRef.current.style.scrollBehavior = 'auto';
                    carouselRef.current.scrollLeft = 0;
                    carouselRef.current.style.scrollBehavior = 'smooth';
                } else {
                    carouselRef.current.scrollLeft += 1;
                }
            }
        }, 50); // Adjust for speed
    };

    const stopScrolling = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };
    
    const handleInteractionStart = () => {
      stopScrolling();
      if(timeoutRef.current) clearTimeout(timeoutRef.current);
    }
    
    const handleInteractionEnd = () => {
      if(timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        startScrolling();
      }, 3000); // 3-second delay
    }

    useEffect(() => {
        const carouselElement = carouselRef.current;
        if (shuffledSponsors.length > 0 && carouselElement) {
            startScrolling();

            carouselElement.addEventListener('mouseenter', handleInteractionStart);
            carouselElement.addEventListener('mouseleave', handleInteractionEnd);
            carouselElement.addEventListener('touchstart', handleInteractionStart, { passive: true });
            carouselElement.addEventListener('touchend', handleInteractionEnd);
            
            return () => {
                stopScrolling();
                if(timeoutRef.current) clearTimeout(timeoutRef.current);
                carouselElement.removeEventListener('mouseenter', handleInteractionStart);
                carouselElement.removeEventListener('mouseleave', handleInteractionEnd);
                carouselElement.removeEventListener('touchstart', handleInteractionStart);
                carouselElement.removeEventListener('touchend', handleInteractionEnd);
            };
        }
    }, [shuffledSponsors]);


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
    
    const sponsorList = [...shuffledSponsors, ...shuffledSponsors]; // Clone for infinite loop illusion

    return (
        <div className="w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_48px,_black_calc(100%-48px),transparent_100%)]">
            <ul 
                ref={carouselRef}
                className="flex items-center justify-start [&_li]:mx-2 overflow-x-auto scrollbar-hide"
                style={{ scrollBehavior: 'smooth' }}
            >
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
