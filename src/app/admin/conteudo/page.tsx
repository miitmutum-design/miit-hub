'use client';
import { Package } from 'lucide-react';
import AdminHeader from '@/components/common/AdminHeader';

export default function AdminConteudoPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <AdminHeader title="Gerenciar Conteúdo" />
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
                <Package className="h-16 w-16 text-muted-foreground" />
                <h3 className="text-2xl font-bold tracking-tight">
                    Módulo de Conteúdo
                </h3>
                <p className="text-sm text-muted-foreground">
                    A funcionalidade para moderar ofertas e eventos será implementada aqui.
                </p>
            </div>
        </div>
    </main>
  );
}
