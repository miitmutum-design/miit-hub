
'use client';
import { Building2, Star, Shapes, Clock } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import AdminHeader from '@/components/common/AdminHeader';

export default function AdminDashboardPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <AdminHeader title="Dashboard" />
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <StatCard
                title="Empresas Pendentes"
                value="12"
                icon={Clock}
                description="Empresas aguardando aprovação"
            />
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
                value="4"
                icon={Shapes}
                description="Novas categorias sugeridas"
            />
        </div>
    </main>
  );
}
