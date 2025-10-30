
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = () => {
    // Hardcoded credentials for simulation
    if (email === 'admin@app.com' && password === 'senha123') {
      // In a real app, you'd get a token from your auth server
      // Here, we'll set a simple cookie for middleware to check
      document.cookie = 'admin-auth=true; path=/; max-age=86400;'; // Expires in 24 hours
      
      toast({
        title: 'Login bem-sucedido!',
        description: 'Redirecionando para o painel de administrador.',
      });
      router.push('/admin');
    } else {
      toast({
        variant: 'destructive',
        title: 'Falha no Login',
        description: 'Credenciais inválidas. Por favor, tente novamente.',
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="inline-block bg-primary/10 p-3 rounded-full mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
            </div>
          <CardTitle className="text-2xl font-headline">Acesso de Administrador</CardTitle>
          <CardDescription>Faça login para gerenciar o conteúdo do aplicativo.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@app.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <Button onClick={handleLogin} className="w-full mt-6 h-12 bg-lime-500 hover:bg-lime-600 text-black font-bold">
            Entrar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
