import Image from 'next/image';
import { Star } from 'lucide-react';
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
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={business.image.url}
            alt={`Image of ${business.name}`}
            fill
            className="object-cover"
            data-ai-hint={business.image.hint}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-xl font-bold font-headline mb-1">{business.name}</CardTitle>
        <CardDescription className="text-base text-muted-foreground">{business.category}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm">
        <Badge variant="secondary">{business.distance}</Badge>
        <div className="flex items-center gap-1 text-amber-400">
          <Star className="h-4 w-4 fill-current" />
          <span className="font-semibold text-foreground">{business.rating}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
