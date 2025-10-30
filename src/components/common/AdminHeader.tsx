import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminHeader({ title }: { title: string }) {
    const router = useRouter();

    const handleLogout = () => {
        // Clear the mock auth cookie
        document.cookie = 'admin-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        router.push('/admin/login');
    };

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <SidebarTrigger className="sm:hidden" />
            <div className="flex items-center justify-between w-full">
                <h1 className="text-xl font-bold tracking-tight text-primary font-headline">
                    {title}
                </h1>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Logout</span>
                </Button>
            </div>
        </header>
    );
}
