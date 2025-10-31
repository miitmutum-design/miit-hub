
'use client';

import React, { useState, useMemo } from 'react';
import { ArrowLeft, Crown, Star, Eye, Handshake, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCompany } from '@/contexts/CompanyContext';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


type RankingMetric = 'views' | 'interactions' | 'rating';

const mockRankingData = {
  views: [
    { rank: 1, companyId: '1', name: 'União Construtora', logo: "https://storage.googleapis.com/deis-project-d58f4.appspot.com/71e19d7c-3f98-4228-a681-912b7a9775f0.png", score: 1234, unit: 'visitas' },
    { rank: 2, companyId: 'company-gold', name: 'Empresa Gold', logo: null, score: 980, unit: 'visitas' },
    { rank: 3, companyId: '3', name: 'Flor de Lótus Móveis', logo: null, score: 850, unit: 'visitas' },
    { rank: 4, companyId: 'company-silver', name: 'Empresa Prata', logo: null, score: 254, unit: 'visitas' },
    { rank: 5, companyId: '2', name: 'Page Turners', logo: null, score: 210, unit: 'visitas' },
  ],
  interactions: [
    { rank: 1, companyId: 'company-gold', name: 'Empresa Gold', logo: null, score: 87, unit: 'interações' },
    { rank: 2, companyId: '1', name: 'União Construtora', logo: "https://storage.googleapis.com/deis-project-d58f4.appspot.com/71e19d7c-3f98-4228-a681-912b7a9775f0.png", score: 70, unit: 'interações' },
    { rank: 3, companyId: 'company-silver', name: 'Empresa Prata', logo: null, score: 55, unit: 'interações' },
    { rank: 4, companyId: '3', name: 'Flor de Lótus Móveis', logo: null, score: 32, unit: 'interações' },
    { rank: 5, companyId: '4', name: 'Bellinha Kids', logo: null, score: 25, unit: 'interações' },
  ],
  rating: [
    { rank: 1, companyId: 'company-gold', name: 'Empresa Gold', logo: null, score: 4.9, unit: 'estrelas' },
    { rank: 2, companyId: '1', name: 'União Construtora', logo: "https://storage.googleapis.com/deis-project-d58f4.appspot.com/71e19d7c-3f98-4228-a681-912b7a9775f0.png", score: 4.8, unit: 'estrelas' },
    { rank: 3, companyId: 'company-silver', name: 'Empresa Prata', logo: null, score: 4.6, unit: 'estrelas' },
    { rank: 4, companyId: '4', name: 'Bellinha Kids', logo: null, score: 4.5, unit: 'estrelas' },
    { rank: 5, companyId: '2', name: 'Page Turners', logo: null, score: 4.4, unit: 'estrelas' },
  ],
};


const Podium = ({ data, companyId }: { data: (typeof mockRankingData.views)[0][], companyId: string }) => {
    const podiumOrder = [1, 0, 2]; // 2nd, 1st, 3rd
    const podiumData = podiumOrder.map(index => data[index]).filter(Boolean);

    return (
        <div className="flex items-end justify-center gap-4 text-center">
            {podiumData.map((item, index) => {
                const isFirst = item.rank === 1;
                const isSecond = item.rank === 2;
                const isThird = item.rank === 3;
                
                return (
                    <div key={item.companyId} className={cn("flex flex-col items-center", isFirst ? 'order-2' : isSecond ? 'order-1' : 'order-3' )}>
                        <Avatar className={cn("h-16 w-16 border-4",
                          isFirst && "border-yellow-400 h-20 w-20",
                          isSecond && "border-zinc-400",
                          isThird && "border-amber-600"
                        )}>
                            {item.logo && <AvatarImage src={item.logo} alt={item.name} />}
                            <AvatarFallback className="text-xl">{item.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="font-bold text-sm mt-2 truncate max-w-[80px]">{item.name}</p>
                        <div className={cn("font-bold text-lg rounded-full w-10 h-10 flex items-center justify-center border-2 mt-1", 
                            isFirst && "bg-yellow-400/20 text-yellow-300 border-yellow-400",
                            isSecond && "bg-zinc-400/20 text-zinc-300 border-zinc-400",
                            isThird && "bg-amber-600/20 text-amber-500 border-amber-600"
                        )}>
                            {item.rank}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};


export default function MiitMaxPage() {
    const [activeTab, setActiveTab] = useState<RankingMetric>('views');
    const { companyProfile } = useCompany();

    const rankingData = useMemo(() => mockRankingData[activeTab], [activeTab]);
    const topThree = useMemo(() => rankingData.slice(0, 3), [rankingData]);

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
                    MiiT Max: Pódio de Desempenho
                </h1>
            </header>

            <Card className="mb-8 bg-card">
                 <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold font-headline text-primary">Pódio da Semana</CardTitle>
                </CardHeader>
                <CardContent>
                    <Podium data={topThree} companyId={companyProfile.id} />
                </CardContent>
            </Card>

            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as RankingMetric)} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-card mb-6">
                    <TabsTrigger value="views" className="flex items-center gap-2"><Eye className="h-4 w-4"/> Visualizações</TabsTrigger>
                    <TabsTrigger value="interactions" className="flex items-center gap-2"><Handshake className="h-4 w-4"/> Interações</TabsTrigger>
                    <TabsTrigger value="rating" className="flex items-center gap-2"><Star className="h-4 w-4"/> Avaliações</TabsTrigger>
                </TabsList>
                
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-16 text-center">Posição</TableHead>
                                    <TableHead>Empresa</TableHead>
                                    <TableHead className="text-right">Pontuação</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {rankingData.map((item) => (
                                    <TableRow key={item.companyId} className={cn(item.companyId === companyProfile.id && 'bg-lime-900/40')}>
                                        <TableCell className="font-bold text-lg text-center">{item.rank}º</TableCell>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell className="text-right">
                                            <span className="font-bold text-primary">{item.score}</span>
                                            <span className="text-xs text-muted-foreground ml-1">{item.unit}</span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Tabs>

        </div>
    );
}
