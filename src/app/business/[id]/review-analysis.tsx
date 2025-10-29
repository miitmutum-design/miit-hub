'use client';

import { useState } from 'react';
import { Star, MessageSquarePlus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import LoginModal from '@/components/common/LoginModal';
import { useCompany } from '@/contexts/CompanyContext';

type Review = {
    id: number;
    name: string;
    date: string;
    rating: number;
    text: string;
    avatar: string;
};

// Mock data for reviews, including new fields
const mockReviews: Review[] = [
    { id: 1, name: 'Maria Silva', date: '20/10/2025 às 14:30', rating: 5, text: 'Excelente comida e atendimento!', avatar: 'MS' },
    { id: 2, name: 'João Santos', date: '19/10/2025 às 19:15', rating: 4, text: 'Muito bom, recomendo!', avatar: 'JS' },
    { id: 3, name: 'Ana Costa', date: '18/10/2025 às 20:00', rating: 5, text: 'O melhor da cidade, sem dúvidas.', avatar: 'AC' },
];


export default function ReviewAnalysis({ initialReviews }: { initialReviews: string[] }) {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    
    const { companyProfile } = useCompany();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    
    const isUserAuthenticated = companyProfile.id !== 'user-demo';

    // We can use initialReviews later if we want to integrate the existing data
    const reviewsToDisplay = mockReviews;

    const handleAddReviewClick = (e: React.MouseEvent) => {
        if (!isUserAuthenticated) {
            e.preventDefault();
            setIsLoginModalOpen(true);
        }
    };

    const handleLoginSuccess = () => {
        setIsLoginModalOpen(false);
        router.push(`/business/${id}/rate`);
    };

    return (
        <div className="space-y-4">
             <LoginModal 
              isOpen={isLoginModalOpen}
              onOpenChange={setIsLoginModalOpen}
              onLoginSuccess={handleLoginSuccess}
            />

            {reviewsToDisplay.map((review) => (
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
            ))}

            <div className="fixed bottom-20 left-0 right-0 p-4 bg-background border-t border-border/50 md:static md:bg-transparent md:border-t-0 md:p-0">
                 <Link href={`/business/${id}/rate`} onClick={handleAddReviewClick} className="w-full">
                    <Button size="lg" className="w-full h-12 text-lg bg-orange-600 hover:bg-orange-700 text-white">
                        <MessageSquarePlus className="mr-2 h-5 w-5" />
                        Adicionar Avaliação
                    </Button>
                 </Link>
            </div>
        </div>
    );
}
