
'use client';

import { Bell, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompany } from '@/contexts/CompanyContext';
import { useRouter } from 'next/navigation';

export default function HomeHeader() {
  const { hasNotifications, clearNotifications } = useCompany();
  const router = useRouter();

  const handleNotificationClick = () => {
    router.push('/notifications');
    clearNotifications();
  };

  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-3 rounded-full">
            <MapPin className="h-6 w-6 text-primary" />
        </div>
        <div className="text-left">
            <p className="text-muted-foreground text-sm">Sua Localização</p>
            <p className="font-bold text-lg text-foreground">Nova Mutum</p>
        </div>
      </div>
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={handleNotificationClick}
          aria-label="Notifications"
        >
          <Bell className="h-6 w-6" />
        </Button>
        {hasNotifications && (
          <span className="absolute top-1 right-1 flex h-3 w-3 pointer-events-none">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
          </span>
        )}
      </div>
    </header>
  );
}
