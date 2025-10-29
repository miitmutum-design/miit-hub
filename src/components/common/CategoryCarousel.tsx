
'use client';

import React, { useCallback, useEffect } from 'react';
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

    const sortedCategories = [...categories].sort((a, b) => b.count - a.count);

    const getIconColorClass = (iconName: string) => {
        switch (iconName) {
            case 'Wind':
                return 'text-green-400';
            case 'Store':
                return 'text-blue-400';
            case 'HeartPulse':
                return 'text-red-400';
            case 'Utensils':
                return 'text-orange-400';
            case 'Wrench':
                return 'text-gray-400';
            default:
                return 'text-primary';
        }
    }
     const getIconBgClass = (iconName: string) => {
        switch (iconName) {
            case 'Wind':
                return 'bg-green-400/10';
            case 'Store':
                return 'bg-blue-400/10';
             case 'HeartPulse':
                return 'bg-red-400/10';
            case 'Utensils':
                return 'bg-orange-400/10';
            case 'Wrench':
                return 'bg-gray-400/10';
            default:
                return 'bg-primary/10';
        }
    }


    return (
        <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4 -ml-4 pl-4">
                {sortedCategories.map((category) => {
                    const Icon = category.icon as LucideIcon;
                    const iconName = (Icon as any).displayName || 'default';
                    return (
                        <div key={category.name} className="flex-[0_0_auto] w-2/5 md:w-1/4">
                             <Link href={`/servicos?q=${encodeURIComponent(category.name)}`} className="block h-full">
                                <Card className="group h-full cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 bg-card">
                                    <CardContent className="flex items-center p-4 gap-3">
                                        <div className={cn("p-3 rounded-lg", getIconBgClass(iconName))}>
                                            <Icon className={cn("h-6 w-6 transition-transform group-hover:scale-110", getIconColorClass(iconName))} />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="font-bold text-md font-headline text-foreground">
                                                {category.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
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
