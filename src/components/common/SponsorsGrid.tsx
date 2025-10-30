
'use client';

import React from 'react';
import { sponsors } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Plus } from 'lucide-react';

const SponsorsGrid: React.FC = () => {
  const displaySponsors = [...sponsors];
  // Ensure the grid has exactly 9 items
  while (displaySponsors.length < 9) {
    displaySponsors.push({
      id: `empty-${displaySponsors.length}`,
      name: 'Anuncie Aqui',
      icon: Plus, // Use the component directly
      businessId: '#',
    });
  }

  return (
    <div className="grid grid-cols-3 gap-3">
      {displaySponsors.slice(0, 9).map((sponsor) => {
        const Icon = sponsor.icon;
        const isClickable = sponsor.businessId !== '#';

        const cardContent = (
            <Card
              className={cn(
                "group h-full overflow-hidden text-center transition-all duration-300 bg-card aspect-square",
                isClickable && "cursor-pointer hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50"
              )}
            >
              <CardContent className="flex flex-col items-center justify-center p-2 sm:p-4 gap-2 h-full">
                <div className="bg-primary/10 p-3 sm:p-4 rounded-lg">
                  <Icon className={cn("h-6 w-6 sm:h-7 sm:w-7 text-primary transition-transform group-hover:scale-110", !isClickable && "text-muted-foreground")} />
                </div>
                <div className="flex flex-col">
                  <p className={cn("font-semibold text-xs sm:text-sm text-center text-foreground", !isClickable && "text-muted-foreground")}>
                    {sponsor.name}
                  </p>
                </div>
              </CardContent>
            </Card>
        );

        return isClickable ? (
          <Link key={sponsor.id} href={`/business/${sponsor.businessId}`} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
            {cardContent}
          </Link>
        ) : (
          <div key={sponsor.id}>{cardContent}</div>
        );

      })}
    </div>
  );
};

export default SponsorsGrid;
