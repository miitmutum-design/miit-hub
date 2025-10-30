
'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import { sponsors } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';


const SponsorCarousel: React.FC = () => {
    const [emblaRef] = useEmblaCarousel({
        align: 'start',
        containScroll: 'trimSnaps',
    });

    return (
        <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3 -ml-4 pl-4">
                {sponsors.map((sponsor) => {
                    const Icon = sponsor.icon as LucideIcon;
                    const isClickable = sponsor.businessId !== '#';

                    const cardContent = (
                        <Card className={cn(
                            "group h-full overflow-hidden transition-all duration-300 bg-card aspect-[3/4]",
                             isClickable && "cursor-pointer hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50"
                        )}>
                            <CardContent className="flex flex-col items-center justify-center p-4 gap-2 h-full">
                                <div className="bg-primary/10 p-4 rounded-lg">
                                    <Icon className={cn(
                                        "h-7 w-7 text-primary transition-transform group-hover:scale-110",
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
