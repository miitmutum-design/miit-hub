
'use client';
import { useState } from 'react';
import { Building2, Star, Shapes, Clock, CheckCircle, XCircle, DollarSign, CalendarCheck, ShoppingCart, TrendingUp, Info, Video } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import AdminHeader from '@/components/common/AdminHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ReviewsChart from '@/components/admin/ReviewsChart';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from '@/lib/utils';


const pendingCompanies = [
    { name: 'Nova Hamburgueria', category: 'Alimentação' },
    { name: 'Tech Solutions', category: 'Tecnologia' },
    { name: 'Jardim Secreto Flores', category: 'Floricultura' },
];

const categorySuggestions = [
    { name: 'Pet Shop' },
    { name: 'Barbearia' },
    { name: 'Consultoria' },
]

const chartData7d = [
  { day: "Seg", "5-stars": 5, "4-stars": 7, "3-stars": 2, "2-stars": 1, "1-star": 0 },
  { day: "Ter", "5-stars": 8, "4-stars": 6, "3-stars": 3, "2-stars": 2, "1-star": 1 },
  { day: "Qua", "5-stars": 10, "4-stars": 5, "3-stars": 1, "2-stars": 0, "1-star": 0 },
  { day: "Qui", "5-stars": 6, "4-stars": 8, "3-stars": 4, "2-stars": 1, "1-star": 0 },
  { day: "Sex", "5-stars": 12, "4-stars": 9, "3-stars": 3, "2-stars": 1, "1-star": 1 },
  { day: "Sáb", "5-stars": 15, "4-stars": 10, "3-stars": 5, "2-stars": 3, "1-star": 2 },
  { day: "Dom", "5-stars": 18, "4-stars": 12, "3-stars": 6, "2-stars": 4, "1-star": 2 },
];

const chartData30d = [
  { day: "Sem 1", "5-stars": 40, "4-stars": 35, "3-stars": 15, "2-stars": 5, "1-star": 2 },
  { day: "Sem 2", "5-stars": 55, "4-stars": 40, "3-stars": 20, "2-stars": 8, "1-star": 3 },
  { day: "Sem 3", "5-stars": 60, "4-stars": 45, "3-stars": 18, "2-stars": 10, "1-star": 4 },
  { day: "Sem 4", "5-stars": 70, "4-stars": 50, "3-stars": 22, "2-stars": 12, "1-star": 5 },
];

const chartData365d = [
  { day: "Jan", "5-stars": 300, "4-stars": 250, "3-stars": 100, "2-stars": 50, "1-star": 20 },
  { day: "Fev", "5-stars": 320, "4-stars": 260, "3-stars": 110, "2-stars": 55, "1-star": 22 },
  { day: "Mar", "5-stars": 350, "4-stars": 280, "3-stars": 120, "2-stars": 60, "1-star": 25 },
  { day: "Abr", "5-stars": 380, "4-stars": 300, "3-stars": 130, "2-stars": 65, "1-star": 28 },
  { day: "Mai", "5-stars": 400, "4-stars": 320, "3-stars": 140, "2-stars": 70, "1-star": 30 },
  { day: "Jun", "5-stars": 420, "4-stars": 340, "3-stars": 150, "2-stars": 75, "1-star": 32 },
];

type Period = '7d' | '30d' | '365d';


export default function AdminDashboardPage() {
    const [period, setPeriod] = useState<Period>('7d');

    const getChartData = () => {
        switch (period) {
            case '30d': return chartData30d;
            case '365d': return chartData365d;
            default: return chartData7d;
        }
    };
    
    const getChartTitle = () => {
         switch (period) {
            case '30d': return 'Últimos 30 dias';
            case '365d': return 'Últimos 365 dias';
            default: return 'Últimos 7 dias';
        }
    }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <AdminHeader title="Dashboard" />
        
        <Card>
            <CardHeader>
                <CardTitle>Controle de Monetização e Inventário</CardTitle>
                <CardDescription>Monitore a saúde financeira e a capacidade de patrocínio do PWA.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    title={
                        <div className="flex items-center gap-2">
                            Tokens Vendidos (24h)
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="text-lime-400 focus:outline-none">
                                            <Info className="h-4 w-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p className="font-bold">Definição da Métrica</p>
                                        <p>Total de Tokens comprados pelas empresas nos últimos 24 horas. Esta métrica representa a receita bruta potencial de pacotes de Tokens e a demanda imediata por patrocínios.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    }
                    value="1,250"
                    icon={DollarSign}
                    description="Total de tokens comprados."
                />
                <StatCard
                    title={
                        <div className="flex items-center gap-2">
                            Patrocínios Pendentes
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="text-lime-400 focus:outline-none">
                                            <Info className="h-4 w-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p className="font-bold">Definição da Métrica</p>
                                        <p>Total de solicitações de patrocínio (banners ou vídeos) que estão aguardando sua revisão e contato. Elas estão no status PENDENTE na Caixa de Entrada.</p>
                                        <p className="mt-2 text-lime-300">Próxima Ação: Clique em 'Revisar' para ver a lista completa e iniciar o contato.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    }
                    value="5"
                    icon={Clock}
                    description="Solicitações aguardando revisão."
                >
                    <Link href="/admin/patrocinio" className="mt-2 block">
                        <Button size="sm" className="w-full bg-lime-500 hover:bg-lime-600 text-black">Revisar</Button>
                    </Link>
                </StatCard>
                 <StatCard
                    title={
                        <div className="flex items-center gap-2">
                            Conteúdo Patrocinado Ativo
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="text-lime-400 focus:outline-none">
                                            <Info className="h-4 w-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p className="font-bold">Definição da Métrica</p>
                                        <p>Total de Ofertas, Eventos e Vídeos que estão atualmente impulsionados por Tokens e agendados para exibição (vigentes). Esta métrica mede o inventário de conteúdo que está gerando receita.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    }
                    value="18"
                    icon={TrendingUp}
                    description="Ofertas e eventos impulsionados."
                />
            </CardContent>
        </Card>

        <Card>
             <CardHeader>
                <CardTitle>Inventário de Patrocínio</CardTitle>
                <CardDescription>Acompanhe a ocupação dos seus principais espaços de anúncio.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                 <StatCard
                    title={
                        <div className="flex items-center gap-2">
                            Slots Banner Principal (Hoje)
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="text-lime-400 focus:outline-none">
                                            <Info className="h-4 w-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p className="font-bold">Controle de Inventário</p>
                                        <p>Ocupação atual do Carrossel Principal da Home Page. O máximo é 3 vagas. Este número indica quantas vagas estão preenchidas/agendadas para exibição no dia de hoje.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    }
                    value="3/3"
                    icon={ShoppingCart}
                    description="Ocupação do Destaque Total Banner."
                />
                 <StatCard
                    title={
                        <div className="flex items-center gap-2">
                            Slots Vitrine Carrossel (Hoje)
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="text-lime-400 focus:outline-none">
                                            <Info className="h-4 w-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p className="font-bold">Controle de Inventário</p>
                                        <p>Ocupação atual da Vitrine de Rolagem Horizontal na Home Page. O máximo é 8 vagas. Este número indica quantas vagas estão preenchidas/agendadas para exibição no dia de hoje.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    }
                    value="6/8"
                    icon={ShoppingCart}
                    description="Ocupação da Vitrine de Rolagem Horizontal."
                />
                <StatCard
                    title={
                        <div className="flex items-center gap-2">
                            Slots Vitrine Estática (Hoje)
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="text-lime-400 focus:outline-none">
                                            <Info className="h-4 w-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p className="font-bold">Controle de Inventário</p>
                                        <p>Ocupação atual da Vitrine Estática na Home Page. O máximo é 9 vagas. Este número indica quantas vagas estão preenchidas/agendadas para exibição no dia de hoje.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    }
                    value="7/9"
                    icon={ShoppingCart}
                    description="Ocupação da Vitrine de Posição Fixa."
                />
                 <StatCard
                    title={
                        <div className="flex items-center gap-2">
                            Vídeos Exibidos (Hoje)
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="text-lime-400 focus:outline-none">
                                            <Info className="h-4 w-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p className="font-bold">Controle de Inventário de Vídeo</p>
                                        <p>Contagem total de campanhas de Vídeo Promocional agendadas para rodar no dia de hoje. Esta métrica mede o inventário de vídeo ativo por duração (em vez de slots).</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    }
                    value="1"
                    icon={Video}
                    description="Campanhas de vídeo agendadas."
                />
                <StatCard
                    title={
                        <div className="flex items-center gap-2">
                            Próximo Slot Livre
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="text-lime-400 focus:outline-none">
                                            <Info className="h-4 w-4" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p className="font-bold">Controle de Agendamento</p>
                                        <p>A data mais próxima (futura) em que há pelo menos uma vaga disponível para o Patrocínio Principal (Carrossel). Esta métrica é vital para agendar novos pedidos e fechar vendas.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    }
                    value="05/08/2024"
                    icon={CalendarCheck}
                    description="Data mais próxima com vaga no Banner."
                />
            </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-7">
            <Card className="lg:col-span-4">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Tarefas de Moderação
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button className="text-lime-400 focus:outline-none">
                                        <Info className="h-4 w-4" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p className="font-bold">Fluxo de Trabalho do Administrador</p>
                                    <p>Esta seção lista os itens que requerem sua ação imediata (aprovação ou análise), garantindo a qualidade e segurança do conteúdo do PWA.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Empresas para Aprovar</h3>
                             <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="text-lime-400 focus:outline-none">
                                            <Info className="h-3 w-3" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p className="font-bold">Aprovação de Conteúdo</p>
                                        <p>Estas empresas concluíram o cadastro e estão aguardando sua análise. O administrador deve verificar os dados e aprovar para que a loja apareça nos resultados de busca do PWA.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className="space-y-4">
                            {pendingCompanies.map(company => (
                                <div key={company.name} className="flex items-center">
                                    <div>
                                        <p className="text-sm font-medium leading-none">{company.name}</p>
                                        <p className="text-sm text-muted-foreground">{company.category}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <Link href="/admin/empresas">
                                            <Button variant="outline" size="sm">Ver Detalhes</Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="border-t border-border/50 pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Sugestões de Categorias</h3>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="text-lime-400 focus:outline-none">
                                            <Info className="h-3 w-3" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p className="font-bold">Moderação de Taxonomia</p>
                                        <p>Estas são novas categorias sugeridas pelas empresas durante o cadastro. O administrador deve APROVAR (✅) para adicioná-las ao dropdown de categorias principal do PWA, ou REJEITAR (❌) para remover a sugestão.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                         <div className="space-y-3">
                             {categorySuggestions.map(cat => (
                                <div key={cat.name} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                                    <p className="text-sm font-medium">{cat.name}</p>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-green-500 hover:text-green-600">
                                            <CheckCircle className="w-4 h-4"/>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600">
                                            <XCircle className="w-4 h-4"/>
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="lg:col-span-3">
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Visão Geral do Conteúdo
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <button className="text-lime-400 focus:outline-none">
                                        <Info className="h-4 w-4" />
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p className="font-bold">Monitoramento de Engajamento</p>
                                    <p>Este gráfico mostra o Resumo de Avaliações recebidas ao longo dos últimos 7 dias. Ele mede o engajamento direto dos consumidores com o conteúdo das empresas (serviços, produtos e lojas) no PWA.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-8">
                     <div>
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="text-sm font-medium text-muted-foreground">Resumo de Avaliações ({getChartTitle()})</h3>
                           <div className="flex items-center gap-1 rounded-md bg-secondary p-1">
                                <Button size="sm" variant={period === '7d' ? 'soft' : 'ghost'} onClick={() => setPeriod('7d')} className="px-2 py-1 h-auto text-xs">7 Dias</Button>
                                <Button size="sm" variant={period === '30d' ? 'soft' : 'ghost'} onClick={() => setPeriod('30d')} className="px-2 py-1 h-auto text-xs">30 Dias</Button>
                                <Button size="sm" variant={period === '365d' ? 'soft' : 'ghost'} onClick={() => setPeriod('365d')} className="px-2 py-1 h-auto text-xs">365 Dias</Button>
                           </div>
                        </div>
                        <ReviewsChart data={getChartData()} />
                    </div>
                     <div className="border-t border-border/50 pt-6">
                        <div className="flex items-center gap-2 mb-4">
                           <h3 className="text-sm font-medium text-muted-foreground">Status das Ofertas</h3>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <button className="text-lime-400 focus:outline-none">
                                            <Info className="h-3 w-3" />
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                        <p className="font-bold">Controle de Vigência</p>
                                        <p>Vigentes: Total de ofertas ativas e válidas na data de hoje. Expiradas: Total de ofertas cuja data de validade já passou. Esta métrica ajuda a monitorar a longevidade do conteúdo promocional.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className="flex items-center justify-around text-center p-4 bg-muted/50 rounded-md">
                           <div>
                                <p className="text-2xl font-bold text-green-400">125</p>
                                <p className="text-xs text-muted-foreground">Vigentes</p>
                           </div>
                            <div>
                                <p className="text-2xl font-bold text-orange-400">48</p>
                                <p className="text-xs text-muted-foreground">Expiradas</p>
                           </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    </main>
  );
}
