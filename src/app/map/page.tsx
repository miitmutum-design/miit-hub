'use client';
import { useState } from 'react';
import Image from 'next/image';
import { businesses, type Business } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Star, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPinUser, MapPinBusiness } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function MapPage() {
  const [selectedBusiness, setSelectedBusiness] = useState<Business>(businesses[0]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-background">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1619532559579-2b5a6c115712?w=1920&h=1080&fit=crop&q=80"
          alt="Map of the area"
          fill
          className="object-cover"
          data-ai-hint="dark map"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <header className="absolute top-0 left-0 right-0 z-20 flex items-center p-4 bg-gradient-to-b from-black/70 to-transparent">
        <Link href="/" className="text-primary-foreground/80 hover:text-primary-foreground">
          &lt; View in map
        </Link>
      </header>

      <div className="relative z-10 w-full h-full">
        {businesses.map((business) => (
          <button
            key={business.id}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{
              left: `${business.coordinates?.x}%`,
              top: `${business.coordinates?.y}%`,
            }}
            onClick={() => setSelectedBusiness(business)}
          >
            <MapPinBusiness className="w-8 h-8 drop-shadow-lg" />
          </button>
        ))}

        <div
          className="absolute -translate-x-1/2 -translate-y-full"
          style={{ left: '50%', top: '55%' }}
        >
          <MapPinUser className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
      </div>

      {selectedBusiness && (
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
          <Card className="max-w-md mx-auto bg-card text-card-foreground">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="flex-grow">
                <CardTitle className="text-lg font-bold">{selectedBusiness.name}</CardTitle>
                <p className="text-sm text-primary">{selectedBusiness.category}</p>
                <p className="text-xs text-muted-foreground mt-1">{selectedBusiness.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-amber-400">
                    {[...Array(Math.floor(selectedBusiness.rating))].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                    {selectedBusiness.rating % 1 !== 0 && (
                      <Star className="w-4 h-4 fill-current" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                    )}
                    {[...Array(5 - Math.ceil(selectedBusiness.rating))].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-muted-foreground/50" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">({Math.floor(Math.random() * 200) + 50})</span>
                </div>
              </div>
              <Button size="icon" className="rounded-full w-12 h-12 bg-primary/20 text-primary hover:bg-primary/30 shrink-0">
                <Send className="w-6 h-6" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
