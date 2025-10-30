
'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Link from 'next/link';
import { categories } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';


const CategoryCarousel: React.FC = () => {
    const [emblaRef] = useEmblaCarousel({
        align: 'start',
        containScroll: 'trimSnaps',
    });

    return (
        <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-3 -ml-4 pl-4">
                {categories.map((category) => {
                    const Icon = category.icon as LucideIcon;
                    return (
                        <div key={category.name} className="flex-[0_0_auto] w-28">
                             <Link href={`/servicos?q=${category.name}`} className="block h-full">
                                <Card className="group h-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 bg-card">
                                    <CardContent className="flex flex-col items-center justify-center p-4 gap-2">
                                        <div className="bg-primary/10 p-4 rounded-lg">
                                            <Icon className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-semibold text-sm text-center text-foreground">
                                                {category.name}
                                            </p>
                                             <p className="text-xs text-muted-foreground text-center">
                                                {category.count} empresas
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

export default CategoryCarousel;
