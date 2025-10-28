'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCompany } from '@/contexts/CompanyContext';
import { useRouter } from 'next/navigation';

export default function HomeHeader() {
  const { hasNotifications, clearNotifications } = useCompany();
  const router = useRouter();

  const handleNotificationClick = () => {
    // In a real app, this would open a notification modal/page
    // For now, we navigate to a dedicated notifications page
    router.push('/notifications');
    clearNotifications();
  };

  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="text-left">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary font-headline">Local Hub</h1>
        <p className="text-muted-foreground mt-2 text-lg">Discover the best businesses near you</p>
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
