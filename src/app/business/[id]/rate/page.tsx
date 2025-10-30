
'use client';

import { useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import { ArrowLeft, Star, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { getBusinessById } from '@/lib/data';
import Link from 'next/link';
import React from 'react';

function StarRating({ rating, setRating }: { rating: number; setRating: (rating: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-10 w-10 cursor-pointer transition-colors ${
            rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/50'
          }`}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );
}

export default function RateBusinessPage() {
  const params = useParams();
  const id = params.id as string;
  
  const business = getBusinessById(id);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!business) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-lg py-6 sm:py-8">
      <header className="relative mb-8 flex items-center justify-center text-center">
        <Link href={`/business/${id}`} className="absolute left-0">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground font-headline">
          Avaliar Empresa
        </h1>
      </header>

      <div className="bg-card p-6 sm:p-8 rounded-lg">
        <div className="flex flex-col items-center text-center">
            <div className="bg-muted p-4 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold font-headline">{business.name}</h2>
        </div>

        <div className="space-y-6 mt-8">
            <div>
                <label className="block text-center text-sm font-medium text-muted-foreground mb-3">Sua Avaliação</label>
                <StarRating rating={rating} setRating={setRating} />
            </div>
             <div>
                <label htmlFor="comment" className="block text-sm font-medium text-muted-foreground mb-2">Comentário (opcional)</label>
                <Textarea
                    id="comment"
                    placeholder="Compartilhe sua experiência..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[120px] bg-input"
                />
            </div>
        </div>
      </div>
      
      <div className="mt-8">
        <Button size="lg" className="w-full h-12 text-lg bg-orange-600 hover:bg-orange-700 text-white font-bold">
            Enviar Avaliação
        </Button>
      </div>

    </div>
  );
}
