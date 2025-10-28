import { getBusinessById } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Star, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ReviewAnalysis from './review-analysis';

export default function BusinessPage({ params }: { params: { id: string } }) {
  const business = getBusinessById(params.id);

  if (!business) {
    notFound();
  }

  return (
    <div className="pb-10">
      <div className="relative h-64 w-full">
        <Image
          src={business.image.url}
          alt={`Image of ${business.name}`}
          fill
          className="object-cover"
          data-ai-hint={business.image.hint}
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>

      <div className="container mx-auto max-w-4xl -mt-20 relative z-10">
        <div className="flex flex-col items-center text-center px-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight font-headline text-primary">
            {business.name}
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-2xl">{business.description}</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <Badge variant="default" className="text-sm">{business.category}</Badge>
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{business.distance}</span>
            </div>
            <div className="flex items-center gap-1.5 text-amber-400">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-semibold text-foreground">{business.rating}</span>
            </div>
          </div>
        </div>

        <div className="mt-12">
            <ReviewAnalysis initialReviews={business.reviews} />
        </div>
      </div>
    </div>
  );
}
