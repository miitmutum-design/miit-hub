
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';

export default function AdminHeader({ title }: { title: string }) {
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="sm:hidden" />
            <h1 className="text-xl font-bold tracking-tight text-primary font-headline">
                {title}
            </h1>
        </header>
    );
}
