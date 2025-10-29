
'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Rss, Gift, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useCompany } from '@/contexts/CompanyContext';
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import type { NotificationSettings } from '@/contexts/CompanyContext';

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
    const { companyProfile, setCompanyProfile } = useCompany();
    const { toast } = useToast();

    const defaultSettings: NotificationSettings = { newBusiness: false, offers: false, events: false };

    const [originalSettings, setOriginalSettings] = useState<NotificationSettings>(companyProfile.notificationSettings || defaultSettings);
    const [currentSettings, setCurrentSettings] = useState<NotificationSettings>(companyProfile.notificationSettings || defaultSettings);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (companyProfile.notificationSettings) {
            setOriginalSettings(companyProfile.notificationSettings);
            setCurrentSettings(companyProfile.notificationSettings);
        }
    }, [companyProfile.notificationSettings]);

    useEffect(() => {
        const changes = JSON.stringify(currentSettings) !== JSON.stringify(originalSettings);
        setHasChanges(changes);
    }, [currentSettings, originalSettings]);

    const handleSettingChange = (id: keyof NotificationSettings) => (checked: boolean) => {
        setCurrentSettings(prev => ({ ...prev, [id]: checked }));
    };

    const handleSaveChanges = () => {
        if (!hasChanges) return;

        setCompanyProfile(prev => ({
            ...prev,
            notificationSettings: currentSettings
        }));

        setOriginalSettings(currentSettings); // Update the original state to the new saved state
        setHasChanges(false);

        toast({
            title: "Sucesso!",
            description: "Suas preferências de notificação foram salvas.",
        });
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
                            checked={currentSettings.newBusiness}
                            onCheckedChange={handleSettingChange('newBusiness')}
                        />
                        <Separator />
                        <NotificationItem
                            icon={Gift}
                            title="Ofertas"
                            description="Receba alertas de novas promoções"
                            id="offers"
                            checked={currentSettings.offers}
                            onCheckedChange={handleSettingChange('offers')}
                        />
                        <Separator />
                        <NotificationItem
                            icon={Calendar}
                            title="Eventos"
                            description="Receba alertas sobre novos eventos"
                            id="events"
                            checked={currentSettings.events}
                            onCheckedChange={handleSettingChange('events')}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="mt-8">
                <Button
                    size="lg"
                    className={cn(
                        "w-full h-12 text-lg font-bold transition-colors",
                        hasChanges
                            ? "bg-lime-400 hover:bg-lime-500 text-black"
                            : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                    onClick={handleSaveChanges}
                    disabled={!hasChanges}
                >
                    Salvar Preferências
                </Button>
            </div>
        </div>
    );
}
