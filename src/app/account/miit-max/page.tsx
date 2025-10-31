
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Crown, Star, Eye, Handshake, Trophy, Rocket, Target, Calendar, Filter } from 'lucide-react';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories } from '@/lib/data';


type RankingMetric = 'views' | 'interactions' | 'rating';
type PerformanceType = 'geral' | 'organico' | 'patrocinado';
type Period = 'weekly' | 'monthly' | 'yearly';

const weeklyRating = [
  { rank: 1, companyId: 'company-gold', name: 'Empresa Gold', logo: null, score: 4.9, unit: 'estrelas' },
  { rank: 2, companyId: '1', name: 'União Construtora', logo: "https://storage.googleapis.com/deis-project-d58f4.appspot.com/71e19d7c-3f98-4228-a681-912b7a9775f0.png", score: 4.8, unit: 'estrelas' },
  { rank: 3, companyId: 'company-silver', name: 'Empresa Prata', logo: null, score: 4.6, unit: 'estrelas' },
  { rank: 4, companyId: '4', name: 'Bellinha Kids', logo: null, score: 4.5, unit: 'estrelas' },
  { rank: 5, companyId: '2', name: 'Page Turners', logo: null, score: 4.4, unit: 'estrelas' },
];

const mockRankingData = {
  weekly: {
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
    rating: weeklyRating,
  },
  monthly: {
    views: [
      { rank: 1, companyId: 'company-gold', name: 'Empresa Gold', logo: null, score: 4120, unit: 'visitas' },
      { rank: 2, companyId: '1', name: 'União Construtora', logo: "https://storage.googleapis.com/deis-project-d58f4.appspot.com/71e19d7c-3f98-4228-a681-912b7a9775f0.png", score: 3800, unit: 'visitas' },
      { rank: 3, companyId: '3', name: 'Flor de Lótus Móveis', logo: null, score: 3200, unit: 'visitas' },
      { rank: 4, companyId: '2', name: 'Page Turners', logo: null, score: 900, unit: 'visitas' },
      { rank: 5, companyId: 'company-silver', name: 'Empresa Prata', logo: null, score: 850, unit: 'visitas' },
    ],
    interactions: [
      { rank: 1, companyId: 'company-gold', name: 'Empresa Gold', logo: null, score: 350, unit: 'interações' },
      { rank: 2, companyId: '1', name: 'União Construtora', logo: "https://storage.googleapis.com/deis-project-d58f4.appspot.com/71e19d7c-3f98-4228-a681-912b7a9775f0.png", score: 280, unit: 'interações' },
      { rank: 3, companyId: '3', name: 'Flor de Lótus Móveis', logo: null, score: 150, unit: 'interações' },
      { rank: 4, companyId: 'company-silver', name: 'Empresa Prata', logo: null, score: 120, unit: 'interações' },
      { rank: 5, companyId: '4', name: 'Bellinha Kids', logo: null, score: 95, unit: 'interações' },
    ],
    rating: weeklyRating,
  },
  yearly: {
     views: [
      { rank: 1, companyId: '1', name: 'União Construtora', logo: "https://storage.googleapis.com/deis-project-d58f4.appspot.com/71e19d7c-3f98-4228-a681-912b7a9775f0.png", score: 45000, unit: 'visitas' },
      { rank: 2, companyId: 'company-gold', name: 'Empresa Gold', logo: null, score: 42000, unit: 'visitas' },
      { rank: 3, companyId: '2', name: 'Page Turners', logo: null, score: 25000, unit: 'visitas' },
      { rank: 4, companyId: '3', name: 'Flor de Lótus Móveis', logo: null, score: 22000, unit: 'visitas' },
      { rank: 5, companyId: 'company-silver', name: 'Empresa Prata', logo: null, score: 15000, unit: 'visitas' },
    ],
    interactions: [
      { rank: 1, companyId: '1', name: 'União Construtora', logo: "https://storage.googleapis.com/deis-project-d58f4.appspot.com/71e19d7c-3f98-4228-a681-912b7a9775f0.png", score: 4000, unit: 'interações' },
      { rank: 2, companyId: 'company-gold', name: 'Empresa Gold', logo: null, score: 3800, unit: 'interações' },
      { rank: 3, companyId: '2', name: 'Page Turners', logo: null, score: 2000, unit: 'interações' },
      { rank: 4, companyId: '4', name: 'Bellinha Kids', logo: null, score: 1500, unit: 'interações' },
      { rank: 5, companyId: 'company-silver', name: 'Empresa Prata', logo: null, score: 1200, unit: 'interações' },
    ],
    rating: weeklyRating,
  }
};


const Podium = ({ data, companyId }: { data: (typeof mockRankingData.weekly.views)[0][], companyId: string }) => {
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

const Countdown = () => {
    const [timeLeft, setTimeLeft] = useState<{ dias: number; horas: number; minutos: number } | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const calculateTimeLeft = () => {
            const endOfWeek = new Date();
            endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
            endOfWeek.setHours(23, 59, 59, 999);

            const difference = +endOfWeek - +new Date();
            let newTimeLeft = { dias: 0, horas: 0, minutos: 0 };

            if (difference > 0) {
                newTimeLeft = {
                    dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutos: Math.floor((difference / 1000 / 60) % 60),
                };
            }
            setTimeLeft(newTimeLeft);
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000 * 60);

        return () => clearInterval(timer);
    }, []);

    if (!isClient || !timeLeft) {
        return (
            <div className="flex justify-center items-baseline gap-4 text-center">
                 <div><span className="text-2xl font-bold">-</span><p className="text-xs">dias</p></div>
                 <div><span className="text-2xl font-bold">-</span><p className="text-xs">horas</p></div>
                 <div><span className="text-2xl font-bold">-</span><p className="text-xs">minutos</p></div>
            </div>
        );
    }
    
    return (
        <div className="flex justify-center items-baseline gap-4 text-center">
            {timeLeft.dias > 0 && <div><span className="text-2xl font-bold">{timeLeft.dias}</span><p className="text-xs">dias</p></div>}
            {timeLeft.horas > 0 && <div><span className="text-2xl font-bold">{timeLeft.horas}</span><p className="text-xs">horas</p></div>}
            {timeLeft.minutos > 0 && <div><span className="text-2xl font-bold">{timeLeft.minutos}</span><p className="text-xs">minutos</p></div>}
        </div>
    );
}

const YourPositionCard = ({ companyId, data, performanceType }: { companyId: string, data: (typeof mockRankingData.weekly.views)[0][], performanceType: PerformanceType}) => {
    const yourRank = data.find(item => item.companyId === companyId);
    
    if (!yourRank || yourRank.rank <= 3) return null;
    
    const rankAbove = data.find(item => item.rank === yourRank.rank - 1);
    
    const scoreDifference = rankAbove ? rankAbove.score - yourRank.score : 0;

    const tip = performanceType === 'patrocinado' 
        ? 'Crie uma nova oferta de destaque para atrair mais clientes e aumentar suas interações!'
        : 'Otimize seu perfil! Adicione mais fotos, produtos e peça para seus clientes avaliarem sua empresa.';

    return (
        <Card className="bg-gradient-to-br from-lime-900/30 to-card border-lime-400/30">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5 text-lime-400" />
                    Sua Posição
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p>Você está em <strong>{yourRank.rank}º lugar</strong>. Faltam <strong>{scoreDifference.toLocaleString('pt-BR')} {rankAbove?.unit}</strong> para alcançar a próxima posição.</p>
                <div className="bg-lime-900/50 p-3 rounded-lg text-sm">
                    <p className="font-semibold flex items-center gap-2"><Rocket className="w-4 h-4"/> Dica de Impulsionamento:</p>
                    <p className="text-lime-300/80 mt-1">{tip}</p>
                </div>
            </CardContent>
        </Card>
    );
};


export default function MiitMaxPage() {
    const [metricTab, setMetricTab] = useState<RankingMetric>('views');
    const [performanceType, setPerformanceType] = useState<PerformanceType>('geral');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [period, setPeriod] = useState<Period>('weekly');

    const { companyProfile } = useCompany();

    // In a real app, this logic would be much more complex,
    // involving queries based on the filters.
    const rankingData = useMemo(() => {
        return mockRankingData[period][metricTab];
    }, [period, metricTab]);

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

            <div className="space-y-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Card>
                         <CardHeader>
                             <CardTitle className="text-base flex items-center gap-2">
                                <Filter className="w-4 h-4 text-primary"/>
                                 Filtrar por Categoria
                             </CardTitle>
                         </CardHeader>
                         <CardContent>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas as Categorias</SelectItem>
                                    {categories.map(cat => (
                                        <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                         </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary"/>
                                Fim da Rodada
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <Countdown />
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-card p-1 rounded-lg grid grid-cols-3 gap-1">
                    <Button variant={period === 'weekly' ? 'secondary' : 'ghost'} onClick={() => setPeriod('weekly')} className="data-[state=active]:bg-lime-900/50 data-[state=active]:text-lime-300" data-state={period === 'weekly' ? 'active' : 'inactive'}>Semanal</Button>
                    <Button variant={period === 'monthly' ? 'secondary' : 'ghost'} onClick={() => setPeriod('monthly')} className="data-[state=active]:bg-lime-900/50 data-[state=active]:text-lime-300" data-state={period === 'monthly' ? 'active' : 'inactive'}>Mensal</Button>
                    <Button variant={period === 'yearly' ? 'secondary' : 'ghost'} onClick={() => setPeriod('yearly')} className="data-[state=active]:bg-lime-900/50 data-[state=active]:text-lime-300" data-state={period === 'yearly' ? 'active' : 'inactive'}>Anual</Button>
                </div>
                
                <div className="bg-card p-1 rounded-lg grid grid-cols-3 gap-1">
                    <Button variant={performanceType === 'geral' ? 'secondary' : 'ghost'} onClick={() => setPerformanceType('geral')} className="data-[state=active]:bg-lime-900/50 data-[state=active]:text-lime-300" data-state={performanceType === 'geral' ? 'active' : 'inactive'}>Geral</Button>
                    <Button variant={performanceType === 'organico' ? 'secondary' : 'ghost'} onClick={() => setPerformanceType('organico')} className="data-[state=active]:bg-lime-900/50 data-[state=active]:text-lime-300" data-state={performanceType === 'organico' ? 'active' : 'inactive'}>Orgânico</Button>
                    <Button variant={performanceType === 'patrocinado' ? 'secondary' : 'ghost'} onClick={() => setPerformanceType('patrocinado')} className="data-[state=active]:bg-lime-900/50 data-[state=active]:text-lime-300" data-state={performanceType === 'patrocinado' ? 'active' : 'inactive'}>Patrocinado</Button>
                </div>
            </div>

            <Card className="mb-8 bg-card">
                 <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold font-headline text-primary">Pódio {period === 'weekly' ? 'da Semana' : period === 'monthly' ? 'do Mês' : 'do Ano'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Podium data={topThree} companyId={companyProfile.id} />
                </CardContent>
            </Card>

            <YourPositionCard companyId={companyProfile.id} data={rankingData} performanceType={performanceType} />
            
            <Tabs value={metricTab} onValueChange={(value) => setMetricTab(value as RankingMetric)} className="w-full mt-8">
                <TabsList className="grid w-full grid-cols-3 bg-card mb-6">
                    <TabsTrigger value="views" className="flex items-center gap-2"><Eye className="h-4 w-4"/> Visualizações</TabsTrigger>
                    <TabsTrigger value="interactions" className="flex items-center gap-2"><Handshake className="h-4 w-4"/> Interações</TabsTrigger>
                    <TabsTrigger value="rating" className="flex items-center gap-2"><Star className="h-4 w-4"/> Avaliações</TabsTrigger>
                </TabsList>
                
                <Card>
                    <CardContent className="p-0">
                        {rankingData.length > 0 ? (
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
                        ) : (
                            <div className="text-center p-8 text-muted-foreground">
                                Ainda não há dados suficientes para este período.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </Tabs>

        </div>
    );
}

    