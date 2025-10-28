'use client';

import { ArrowLeft, Bell, FileText, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const ConfigItem = ({ icon: Icon, title, description, hasSwitch = false }: { icon: React.ElementType, title: string, description: string, hasSwitch?: boolean }) => (
    <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
            <Icon className="w-6 h-6 text-primary" />
            <div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
        {hasSwitch && <Switch />}
    </div>
);

export default function ConsumerConfigPage() {
  return (
    <div className="container mx-auto max-w-lg py-6 sm:py-8">
      <header className="relative mb-8 flex items-center justify-center text-center">
        <Link href="/account" className="absolute left-0">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground font-headline">
          Configurações
        </h1>
      </header>

      <Card className="bg-card">
        <CardContent className="p-0">
            <ConfigItem icon={Bell} title="Notificações Push" description="Receber alertas de ofertas" hasSwitch />
            <Separator />
            <ConfigItem icon={Globe} title="Idioma" description="Português (Brasil)" />
            <Separator />
            <ConfigItem icon={FileText} title="Termos de Uso" description="Visualizar os termos de serviço" />
        </CardContent>
      </Card>
    </div>
  );
}
