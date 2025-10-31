
'use client';

import { ArrowLeft, Eye, Phone, Globe, Star, BarChart3, TrendingUp, TrendingDown, Calendar, MapPin, CircleDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useCompany } from '@/contexts/CompanyContext';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line, ResponsiveContainer } from "recharts";

const viewsData = [
  { date: '20/07', views: 58 },
  { date: '21/07', views: 72 },
  { date: '22/07', views: 95 },
  { date: '23/07', views: 110 },
  { date: '24/07', views: 85 },
  { date: '25/07', views: 120 },
  { date: '26/07', views: 135 },
];

const geoData = [
    { name: 'Centro', views: 150 },
    { name: 'Jd. América', views: 95 },
    { name: 'Pq. das Emas', views: 75 },
    { name: 'Jd. Europa', views: 50 },
    { name: 'Outros', views: 80 },
];

const chartConfig = {
  views: { label: "Visualizações", color: "hsl(var(--primary))" },
  geo: { label: "Visualizações", color: "hsl(var(--accent))" },
};

export default function AnalyticsPage() {
    const { companyProfile } = useCompany();

    return (
        <div className="container mx-auto max-w-3xl py-6 sm:py-8">
            <header className="relative mb-8 flex items-center justify-center text-center">
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

            <div className="space-y-6">
                
                {/* KPI Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Vis. do Perfil</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">1,234</div>
                            <p className="text-xs text-muted-foreground">+20.1% no último mês</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Interações</CardTitle>
                            <Phone className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">87</div>
                            <p className="text-xs text-muted-foreground">Cliques em contato</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Avaliações</CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">42</div>
                            <p className="text-xs text-muted-foreground">5 novas esta semana</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
                            <Star className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-primary">4.8</div>
                            <p className="text-xs text-muted-foreground">Baseado em 42 avaliações</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Campaign Performance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary" />
                            Desempenho da Campanha
                        </CardTitle>
                        <CardDescription>Visualizações do seu anúncio na última semana.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <ChartContainer config={chartConfig} className="h-[200px] w-full">
                            <LineChart accessibilityLayer data={viewsData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                                <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={12} />
                                <Tooltip cursor={{ fill: 'hsla(var(--muted))' }} content={<ChartTooltipContent indicator="line" />} />
                                <Line dataKey="views" type="monotone" stroke="hsl(var(--primary))" strokeWidth={2} dot={true} />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                 {/* Token ROI & Status */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <span className="text-lg font-bold text-orange-400">150</span>
                            </div>
                             <div className="flex justify-between items-baseline">
                                <span className="text-sm text-muted-foreground">Cliques Recebidos:</span>
                                <span className="text-lg font-bold text-lime-400">450</span>
                            </div>
                            <p className="text-center text-xs text-muted-foreground pt-2">Eficiência: 3 cliques por token</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                             <CardTitle className="text-base font-medium flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Campanha Ativa
                             </CardTitle>
                        </CardHeader>
                         <CardContent className="space-y-2">
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm text-muted-foreground">Início:</span>
                                <span className="text-base font-semibold">20/07/2024</span>
                            </div>
                             <div className="flex justify-between items-baseline">
                                <span className="text-sm text-muted-foreground">Fim:</span>
                                <span className="text-base font-semibold">04/08/2024</span>
                            </div>
                        </CardContent>
                    </Card>
                 </div>

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
                            <BarChart data={geoData} layout="vertical" margin={{ left: 10, right: 10, top: 0, bottom: 0 }}>
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
