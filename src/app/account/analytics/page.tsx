
'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Eye, Phone, Globe, Star, BarChart3, TrendingUp, TrendingDown, Calendar, MapPin, CircleDollarSign, MousePointerClick, Search, Package, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCompany } from '@/contexts/CompanyContext';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line, ResponsiveContainer } from "recharts";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';


const allData = {
    kpis: { views: 1234, interactions: 87, reviews: 42, avgRating: 4.8 },
    engagement: { offers: 128, events: 62 },
    searchTerms: [
        { term: "restaurante perto de mim", views: 120 },
        { term: "comida italiana", views: 95 },
        { term: "melhor happy hour", views: 80 },
        { term: "almoço executivo", views: 65 },
        { term: "bar com música ao vivo", views: 50 },
    ],
    viewsData: [
        { date: '20/07', views: 58 }, { date: '21/07', views: 72 }, { date: '22/07', views: 95 },
        { date: '23/07', views: 110 }, { date: '24/07', views: 85 }, { date: '25/07', views: 120 },
        { date: '26/07', views: 135 },
    ],
    geoData: [
        { name: 'Centro', views: 150 }, { name: 'Jd. América', views: 95 }, { name: 'Pq. das Emas', views: 75 },
        { name: 'Jd. Europa', views: 50 }, { name: 'Outros', views: 80 },
    ],
    sponsorship: {
        carouselViews: 450,
        gridViews: 784,
        tokensSpent: 150,
        viewsPerToken: 8.2,
    }
};

const sponsoredData = {
    kpis: { views: 980, interactions: 70, reviews: 30, avgRating: 4.9 },
    engagement: { offers: 100, events: 50 },
    searchTerms: [
        { term: "promoção restaurante", views: 110 },
        { term: "happy hour em destaque", views: 85 },
    ],
    viewsData: [
        { date: '20/07', views: 40 }, { date: '21/07', views: 60 }, { date: '22/07', views: 80 },
        { date: '23/07', views: 95 }, { date: '24/07', views: 70 }, { date: '25/07', views: 100 },
        { date: '26/07', views: 115 },
    ],
     geoData: [
        { name: 'Centro', views: 120 }, { name: 'Jd. América', views: 80 }, { name: 'Pq. das Emas', views: 60 },
        { name: 'Jd. Europa', views: 40 }, { name: 'Outros', views: 70 },
    ],
    sponsorship: allData.sponsorship
};

const organicData = {
    kpis: { views: 254, interactions: 17, reviews: 12, avgRating: 4.6 },
    engagement: { offers: 28, events: 12 },
    searchTerms: [
        { term: "restaurante perto de mim", views: 60 },
        { term: "comida italiana endereço", views: 45 },
    ],
    viewsData: [
        { date: '20/07', views: 18 }, { date: '21/07', views: 12 }, { date: '22/07', views: 15 },
        { date: '23/07', views: 15 }, { date: '24/07', views: 15 }, { date: '25/07', views: 20 },
        { date: '26/07', views: 20 },
    ],
    geoData: [
        { name: 'Centro', views: 30 }, { name: 'Jd. América', views: 15 }, { name: 'Pq. das Emas', views: 15 },
        { name: 'Jd. Europa', views: 10 }, { name: 'Outros', views: 10 },
    ],
    sponsorship: null
};


const chartConfig = {
  views: { label: "Visualizações", color: "hsl(var(--primary))" },
  geo: { label: "Visualizações", color: "hsl(var(--accent))" },
};

export default function AnalyticsPage() {
    const { companyProfile } = useCompany();
    const [filter, setFilter] = useState('all');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const data = filter === 'all' ? allData : filter === 'sponsored' ? sponsoredData : organicData;

    return (
        <div className="container mx-auto max-w-3xl py-6 sm:py-8">
            <header className="relative mb-4 flex items-center justify-center text-center">
                <Link href="/account/profile/config" className="absolute left-0">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft />
                        <span className="sr-only">Voltar</span>
                    </Button>
                </Link>
                <h1 className="text-xl font-bold text-foreground font-headline">
                    Métricas de Desempenho
                </h1>
            </header>
            
             <Tabs defaultValue="all" onValueChange={setFilter} className="w-full mb-6">
                <TabsList className="grid w-full grid-cols-3 bg-card">
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="organic">Orgânico</TabsTrigger>
                    <TabsTrigger value="sponsored">Patrocinado</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="space-y-6">
                
                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Vis. do Perfil</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">{isClient ? data.kpis.views.toLocaleString('pt-BR') : data.kpis.views}</div>
                            <p className="text-xs text-muted-foreground">+20.1%</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Interações</CardTitle>
                            <Phone className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">{isClient ? data.kpis.interactions.toLocaleString('pt-BR') : data.kpis.interactions}</div>
                            <p className="text-xs text-muted-foreground">Cliques</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avaliações</CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">{isClient ? data.kpis.reviews.toLocaleString('pt-BR') : data.kpis.reviews}</div>
                            <p className="text-xs text-muted-foreground">+5 esta semana</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">{data.kpis.avgRating}</div>
                            <p className="text-xs text-muted-foreground">de 5</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Engagement */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-medium flex items-center gap-2">
                               <MousePointerClick className="w-4 h-4 text-primary" />
                               Engajamento com Conteúdo
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm text-muted-foreground flex items-center gap-2"><Package className="w-4 h-4"/>Cliques em Ofertas:</span>
                                <span className="text-lg font-bold text-lime-400">{data.engagement.offers}</span>
                            </div>
                             <div className="flex justify-between items-baseline">
                                <span className="text-sm text-muted-foreground flex items-center gap-2"><Ticket className="w-4 h-4"/>Cliques em Eventos:</span>
                                <span className="text-lg font-bold text-lime-400">{data.engagement.events}</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base font-medium flex items-center gap-2">
                               <Search className="w-4 h-4 text-primary" />
                               Termos de Busca Principais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-1">
                            {data.searchTerms.slice(0,2).map((item, index) => (
                                <div key={index} className="flex justify-between items-baseline text-sm">
                                    <span className="text-muted-foreground truncate pr-4">{item.term}</span>
                                    <span className="font-semibold text-lime-400">{item.views}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Campaign Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            Visualizações do Perfil
                        </CardTitle>
                        <CardDescription>Visualizações totais na última semana.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={chartConfig} className="h-[200px] w-full">
                            <LineChart accessibilityLayer data={data.viewsData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                                <Tooltip cursor={{ fill: 'hsla(var(--muted))' }} content={<ChartTooltipContent indicator="line" />} />
                                <Line dataKey="views" type="monotone" stroke="hsl(var(--primary))" strokeWidth={2} dot={true} />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                 {/* Sponsorship Details */}
                 {filter === 'sponsored' && data.sponsorship && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-medium flex items-center gap-2">
                                Visibilidade dos Anúncios
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm text-muted-foreground">Vis. Carrossel Principal:</span>
                                    <span className="text-lg font-bold text-orange-400">{data.sponsorship.carouselViews}</span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm text-muted-foreground">Vis. Vitrine Horizontal:</span>
                                    <span className="text-lg font-bold text-cyan-400">{data.sponsorship.gridViews}</span>
                                </div>
                                <p className="text-center text-xs text-muted-foreground pt-2">Total de {isClient ? (data.sponsorship.carouselViews + data.sponsorship.gridViews).toLocaleString('pt-BR') : (data.sponsorship.carouselViews + data.sponsorship.gridViews)} visualizações</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-medium flex items-center gap-2">
                                    <CircleDollarSign className="w-4 h-4" />
                                    ROI de Tokens
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm text-muted-foreground">Tokens Gastos:</span>
                                    <span className="text-lg font-bold">{data.sponsorship.tokensSpent}</span>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm text-muted-foreground">Vis. por Token:</span>
                                    <span className="text-lg font-bold">~{data.sponsorship.viewsPerToken.toFixed(1)}</span>
                                </div>
                            </CardContent>
                        </Card>
                     </div>
                 )}


                {/* Geo Visualization */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />
                            Origem das Visualizações
                        </CardTitle>
                        <CardDescription>Bairros que mais visualizaram seu perfil.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="h-[200px] w-full">
                            <BarChart data={data.geoData} layout="vertical" margin={{ left: 10, right: 10, top: 0, bottom: 0 }}>
                                <CartesianGrid horizontal={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={80} />
                                <Tooltip cursor={{ fill: 'hsla(var(--muted))' }} content={<ChartTooltipContent />} />
                                <Bar dataKey="views" layout="vertical" fill="hsl(var(--accent))" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
