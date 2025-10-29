
'use client';

import React from 'react';
import Link from 'next/link';
import { sponsors, type Sponsor, businesses } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';
import { mockCompanyProfiles } from '@/contexts/CompanyContext';
import Image from 'next/image';
import { Plus } from 'lucide-react';


const SponsorCard = ({ sponsor }: { sponsor: Sponsor }) => {
    const Icon = sponsor.icon as LucideIcon;

    const getHref = (sponsor: Sponsor) => {
        if (sponsor.linkType === 'internal' && !sponsor.link.startsWith('/')) {
            return `/webview?url=${encodeURIComponent(sponsor.link)}`;
        }
        return sponsor.link;
    }

    let logoUrl: string | null = null;
    if (sponsor.isOccupied && sponsor.link.startsWith('/business/')) {
        const businessId = sponsor.link.split('/')[2];
        const profile = mockCompanyProfiles[businessId as keyof typeof mockCompanyProfiles] || businesses.find(b => b.id === businessId);
        if (profile && 'logoUrl' in profile) {
            logoUrl = profile.logoUrl;
        }
    }


    const content = (
        <Card className="group h-full cursor-pointer overflow-hidden text-center transition-all duration-300 bg-[#1A1A1A] border-transparent hover:border-primary/50">
            <CardContent className="flex flex-col items-center justify-center p-4 gap-3 aspect-square">
                {sponsor.isOccupied ? (
                    <>
                        <div className="relative bg-black/20 p-2 rounded-lg w-16 h-16 flex items-center justify-center">
                            {logoUrl ? (
                                <Image src={logoUrl} alt={`${sponsor.name} logo`} fill className="object-contain rounded-md" />
                            ) : (
                                <Icon className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                            )}
                        </div>
                        <p className="font-semibold text-sm text-white/90 text-center leading-tight">
                            {sponsor.name}
                        </p>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full opacity-60">
                         <Plus className="h-8 w-8 text-lime-400/50" />
                         <p className="font-semibold text-xs text-white/40 mt-2">
                            Slot Disponível
                         </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    if (sponsor.isOccupied) {
        return (
            <Link href={getHref(sponsor)} target={sponsor.linkType === 'external' ? '_blank' : '_self'} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
                {content}
            </Link>
        )
    }

    return <div className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">{content}</div>;
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
