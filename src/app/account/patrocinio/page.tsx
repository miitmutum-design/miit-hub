
'use client';

import { useState } from 'react';
import { ArrowLeft, Send, Sparkles, Star, Grid, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCompany } from '@/contexts/CompanyContext';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';


export default function SponsorshipPage() {
    const { companyProfile } = useCompany();
    const { toast } = useToast();
    const router = useRouter();
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim().length < 10) {
            toast({
                variant: 'destructive',
                title: 'Mensagem muito curta',
                description: 'Por favor, escreva uma mensagem com pelo menos 10 caracteres.',
            });
            return;
        }

        console.log({
            companyId: companyProfile.id,
            companyName: companyProfile.name,
            message: message,
            requestedAt: new Date().toISOString(),
        });
        
        toast({
            title: 'Solicitação Enviada!',
            description: 'Sua solicitação de patrocínio foi enviada. Entraremos em contato em breve.',
        });

        setMessage('');
        router.push('/account/profile/config');
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
          Impulsionar Meu Negócio
        </h1>
      </header>

      <div className="space-y-8">
        <div>
            <h2 className="text-lg font-semibold mb-4 text-center">Nossas Opções de Patrocínio</h2>
            <div className="grid grid-cols-1 gap-4">
                <Link href="/account/patrocinio/destaque-total-banner">
                    <Card className="border-lime-400/50 border-2 bg-lime-900/20 hover:bg-lime-900/40 transition-colors">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lime-400">
                                <Star className="w-6 h-6" />
                                Destaque Total Banner
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                               Garanta sua vaga entre as 3 empresas exibidas no topo da Home Page, em um sistema de rotação justa.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
                 <Link href="/account/patrocinio/vitrine-carrossel">
                    <Card className="border-cyan-400/50 border-2 bg-cyan-900/20 hover:bg-cyan-900/40 transition-colors">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-cyan-400">
                                <Sparkles className="w-6 h-6" />
                                Vitrine de Carrossel
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                               Garanta uma das 8 posições em rotação justa, logo abaixo da busca principal.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
                <Link href="/account/patrocinio/vitrine-estatica">
                    <Card className="border-purple-400/50 border-2 bg-purple-900/20 hover:bg-purple-900/40 transition-colors">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-purple-400">
                                <Grid className="w-6 h-6" />
                                Vitrine Estática
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Posição de destaque na grade de patrocinadores da Home Page. Vagas limitadas a 9 empresas garantindo visibilidade.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </Link>
                 <Link href="/account/patrocinio/video-promocional">
                    <Card className="border-orange-400/50 border-2 bg-orange-900/20 hover:bg-orange-900/40 transition-colors">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-orange-400">
                                <Video className="w-6 h-6" />
                                Vídeo Promocional
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                               Exiba um vídeo promocional na Home Page para engajar clientes.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                 </Link>
            </div>
        </div>

      </div>
    </div>
  );
}

    