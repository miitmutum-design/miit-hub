
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
            <div className="flex gap-4 -ml-4 pl-4">
                {sponsors.map((sponsor) => {
                    const Icon = sponsor.icon as LucideIcon;
                    return (
                        <div key={sponsor.id} className="flex-[0_0_auto] w-2/5 md:w-1/4">
                             <Link href={`/business/${sponsor.businessId}`} className="block h-full">
                                <Card className="group h-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 bg-card">
                                    <CardContent className="flex flex-col items-center justify-center p-4 gap-2">
                                        <div className="bg-primary/10 p-4 rounded-lg">
                                            <Icon className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-semibold text-sm text-center text-foreground">
                                                {sponsor.name}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SponsorCarousel;

