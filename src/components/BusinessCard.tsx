import Image from 'next/image';
import { Star, Building2 } from 'lucide-react';
import type { Business } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type BusinessCardProps = {
  business: Business;
};

export default function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 bg-card">
      <CardContent className="p-4 flex items-center gap-4">
        <div className="bg-muted p-4 rounded-lg flex items-center justify-center">
          <Building2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <CardTitle className="text-lg font-bold font-headline mb-1">{business.name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">{business.category}</CardDescription>
          <div className="flex items-center gap-4 text-sm mt-2">
            <Badge variant="secondary">{business.distance}</Badge>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-semibold text-foreground">{business.rating}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
