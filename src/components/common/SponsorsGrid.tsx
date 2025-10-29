
'use client';

import React from 'react';
import Link from 'next/link';
import { sponsors, type Sponsor } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

const SponsorCard = ({ sponsor }: { sponsor: Sponsor }) => {
    const Icon = sponsor.icon as LucideIcon;

    const getHref = (sponsor: Sponsor) => {
        if (sponsor.linkType === 'internal' && !sponsor.link.startsWith('/')) {
            return `/webview?url=${encodeURIComponent(sponsor.link)}`;
        }
        return sponsor.link;
    }

    const content = (
        <Card className="group h-full cursor-pointer overflow-hidden text-center transition-all duration-300 bg-[#1A1A1A] border-transparent hover:border-primary/50">
            <CardContent className="flex flex-col items-center justify-center p-4 gap-3 aspect-square">
                {sponsor.isOccupied ? (
                    <>
                        <div className="bg-black/20 p-4 rounded-lg">
                            <Icon className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                        </div>
                        <p className="font-semibold text-sm text-white/90">
                            {sponsor.name}
                        </p>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                         <p className="font-semibold text-sm text-white/40">
                            Anuncie aqui
                         </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    if (sponsor.isOccupied) {
        return (
            <Link href={getHref(sponsor)} target={sponsor.linkType === 'external' ? '_blank' : '_self'}>
                {content}
            </Link>
        )
    }

    return content;
}


const SponsorsGrid: React.FC = () => {
    // Ensure there are always 9 items to render for the grid
    const gridItems = [...sponsors];
    while (gridItems.length < 9) {
        gridItems.push({
            id: `placeholder-${gridItems.length}`,
            name: 'Anuncie aqui',
            isOccupied: false,
            // @ts-ignore
            icon: 'div',
            link: '#',
            linkType: 'internal',
        });
    }

    return (
        <div>
            <h2 className="text-xl font-bold font-headline mb-4">Patrocinadores</h2>
            <div className="grid grid-cols-3 gap-3">
                {gridItems.slice(0, 9).map((sponsor) => (
                    <SponsorCard key={sponsor.id} sponsor={sponsor} />
                ))}
            </div>
        </div>
    );
};

export default SponsorsGrid;
