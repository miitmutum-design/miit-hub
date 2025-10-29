'use client';

import { ArrowLeft, Rss, Gift, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useCompany } from '@/contexts/CompanyContext';

const NotificationItem = ({ icon: Icon, title, description, id, checked, onCheckedChange }: { icon: React.ElementType, title: string, description: string, id: string, checked: boolean, onCheckedChange: (checked: boolean) => void }) => {
    return (
        <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
                <Icon className="w-6 h-6 text-primary" />
                <div>
                    <h3 className="font-semibold text-foreground">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>
            <Switch
                id={id}
                checked={checked}
                onCheckedChange={onCheckedChange}
            />
        </div>
    );
};

export default function NotificationSettingsPage() {
    const { companyProfile, updateNotificationSettings } = useCompany();
    const { notificationSettings } = companyProfile;

    const handleSettingChange = (id: keyof typeof notificationSettings) => (checked: boolean) => {
        updateNotificationSettings({ [id]: checked });
    };

    return (
        <div className="container mx-auto max-w-lg py-6 sm:py-8">
            <header className="relative mb-8 flex items-center justify-center text-center">
                <Link href="/account/profile/config" className="absolute left-0">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft />
                        <span className="sr-only">Voltar</span>
                    </Button>
                </Link>
                <h1 className="text-xl font-bold text-foreground font-headline">
                    Notificações
                </h1>
            </header>

            <Card className="bg-card">
                <CardContent className="p-0">
                    <div className="p-2 space-y-1">
                        <NotificationItem
                            icon={Rss}
                            title="Novas Empresas"
                            description="Receba alertas de novos cadastros"
                            id="newBusiness"
                            checked={notificationSettings.newBusiness}
                            onCheckedChange={handleSettingChange('newBusiness')}
                        />
                        <Separator />
                        <NotificationItem
                            icon={Gift}
                            title="Ofertas"
                            description="Receba alertas de novas promoções"
                            id="offers"
                            checked={notificationSettings.offers}
                            onCheckedChange={handleSettingChange('offers')}
                        />
                        <Separator />
                        <NotificationItem
                            icon={Calendar}
                            title="Eventos"
                            description="Receba alertas sobre novos eventos"
                            id="events"
                            checked={notificationSettings.events}
                            onCheckedChange={handleSettingChange('events')}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
