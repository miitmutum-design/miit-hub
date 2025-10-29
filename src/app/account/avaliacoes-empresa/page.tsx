
'use client';

import { ArrowLeft, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useCompany } from '@/contexts/CompanyContext';

type Review = {
    id: number;
    name: string;
    date: string;
    rating: number;
    text: string;
    avatar: string;
};

// Mock data for reviews, assuming these are for the logged-in company
const mockReviews: Review[] = [
    { id: 1, name: 'Maria Silva', date: '20/10/2025 às 14:30', rating: 5, text: 'Excelente comida e atendimento!', avatar: 'MS' },
    { id: 2, name: 'João Santos', date: '19/10/2025 às 19:15', rating: 4, text: 'Muito bom, recomendo!', avatar: 'JS' },
    { id: 3, name: 'Ana Costa', date: '18/10/2025 às 20:00', rating: 5, text: 'O melhor da cidade, sem dúvidas.', avatar: 'AC' },
    { id: 4, name: 'Pedro Almeida', date: '17/10/2025 às 12:00', rating: 3, text: 'O ambiente é bom, mas o serviço foi um pouco lento.', avatar: 'PA' },
];

export default function CompanyReviewsPage() {
    const { companyProfile } = useCompany();

    // In a real app, you would fetch reviews based on companyProfile.id
    const reviewsToDisplay = mockReviews;

    return (
        <div className="container mx-auto max-w-lg py-6 sm:py-8">
            <header className="relative mb-8 flex items-center justify-center text-center">
                <Link href="/account/profile/config" className="absolute left-0">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft />
                        <span className="sr-only">Voltar</span>
                    </Button>
                </Link>
                <h1 className="text-xl font-bold text-foreground font-headline">
                    Avaliações Recebidas
                </h1>
            </header>

            <div className="space-y-4">
                {reviewsToDisplay.length > 0 ? (
                    reviewsToDisplay.map((review) => (
                        <Card key={review.id} className="bg-card border-border/50">
                            <CardContent className="p-4">
                                <div className="flex items-start gap-4">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback>{review.avatar}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-foreground">{review.name}</p>
                                                <p className="text-xs text-muted-foreground">{review.date}</p>
                                            </div>
                                            <div className="inline-flex items-center gap-1.5 bg-orange-600 text-white font-bold py-1 px-2.5 rounded-lg text-sm">
                                                <Star className="h-3.5 w-3.5 fill-white" />
                                                <span>{review.rating}</span>
                                            </div>
                                        </div>
                                        <p className="mt-3 text-foreground/90">{review.text}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border rounded-lg bg-card">
                        <Star className="w-16 h-16 text-muted-foreground/50 mb-4" />
                        <h2 className="text-2xl font-semibold font-headline">Nenhuma avaliação ainda</h2>
                        <p className="text-muted-foreground mt-2 max-w-sm">
                            Quando seus clientes avaliarem sua empresa, as avaliações aparecerão aqui.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
