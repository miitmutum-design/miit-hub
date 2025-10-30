
'use client';
import { Building2, Star, Shapes, Clock, CheckCircle, XCircle } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import AdminHeader from '@/components/common/AdminHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ReviewsChart from '@/components/admin/ReviewsChart';


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
        
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <StatCard
                title="Empresas Pendentes"
                value="3"
                icon={Clock}
                description="Aguardando sua aprovação"
            >
                <Link href="/admin/empresas?filter=pending" className="mt-4 block">
                    <Button size="sm" className="w-full">Revisar</Button>
                </Link>
            </StatCard>
            <StatCard
                title="Total de Empresas Ativas"
                value="215"
                icon={Building2}
                description="+2 na última semana"
            />
            <StatCard
                title="Novas Avaliações (24h)"
                value="38"
                icon={Star}
                description="Novos feedbacks para moderar"
            />
            <StatCard
                title="Sugestões de Categorias"
                value="3"
                icon={Shapes}
                description="Categorias sugeridas por empresas"
            />
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-7">
            <Card className="lg:col-span-4">
                 <CardHeader>
                    <CardTitle>Tarefas Pendentes</CardTitle>
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
                                        <Button variant="outline" size="sm">Ver Detalhes</Button>
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
