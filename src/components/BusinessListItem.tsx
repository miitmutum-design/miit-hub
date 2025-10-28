import Link from 'next/link';
import { Star, MapPin, Building2 } from 'lucide-react';
import type { Business } from '@/lib/data';

type BusinessListItemProps = {
  business: Business;
};

export default function BusinessListItem({ business }: BusinessListItemProps) {
  return (
    <div className="bg-card p-4 rounded-lg flex items-center gap-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 border border-transparent">
        <div className="relative">
        <div className="bg-muted p-4 rounded-lg flex items-center justify-center">
            <Building2 className="h-8 w-8 text-muted-foreground" />
        </div>
        </div>
        <div className="flex-1">
        <h3 className="font-bold text-lg font-headline">{business.name}</h3>
        <p className="text-sm text-muted-foreground">{business.category}</p>
        <div className="flex items-center gap-4 text-sm mt-1 text-muted-foreground">
            <div className="flex items-center gap-1 text-amber-400">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-semibold text-foreground">{business.rating}</span>
            <span className="text-muted-foreground">({business.reviews.length * 31})</span>
            </div>
            <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            <span>{business.distance}</span>
            </div>
        </div>
        </div>
    </div>
  );
}
