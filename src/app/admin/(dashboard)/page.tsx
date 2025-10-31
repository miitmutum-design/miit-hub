
'use client';
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


export default function AdminDashboardPage() {
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
                                        <p>Total de solicitações de patrocínio que estão aguardando sua revisão e contato. Elas estão no status PENDENTE na Caixa de Entrada.</p>
                                        <p className="mt-2 text-lime-300">Próxima Ação: Clique em 'Revisar' para ver a lista e iniciar o contato.</p>
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
                    <CardTitle>Tarefas de Moderação</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-8">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-4">Empresas para Aprovar</h3>
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
                        <h3 className="text-sm font-medium text-muted-foreground mb-4">Sugestões de Categorias</h3>
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
                    <CardTitle>Visão Geral do Conteúdo</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-8">
                    <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-4">Resumo de Avaliações (Últimos 7 dias)</h3>
                        <ReviewsChart />
                    </div>
                     <div className="border-t border-border/50 pt-6">
                        <h3 className="text-sm font-medium text-muted-foreground mb-4">Status das Ofertas</h3>
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
