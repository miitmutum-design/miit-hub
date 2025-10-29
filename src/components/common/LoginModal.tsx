
'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCompany } from '@/contexts/CompanyContext';
import { X, Mail, User, Pencil, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';


// Simple SVG for Google Icon
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" {...props}>
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    <path d="M1 1h22v22H1z" fill="none"/>
  </svg>
);


interface LoginModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onLoginSuccess: () => void;
}

export default function LoginModal({ isOpen, onOpenChange, onLoginSuccess }: LoginModalProps) {
  const { setCompanyProfile } = useCompany();
  const { toast } = useToast();
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [showGoogleSimModal, setShowGoogleSimModal] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (showEmailLogin) {
      const isValid = !!(avatarUrl && name.trim() && email.trim() && password.trim());
      setIsFormValid(isValid);
    }
  }, [avatarUrl, name, email, password, showEmailLogin]);

  const handleEmailLogin = () => {
    if (!isFormValid) {
      toast({
        variant: "destructive",
        title: "Campos Incompletos",
        description: "Por favor, preencha todos os campos, incluindo a foto de perfil.",
      });
      return;
    }
    
    setIsAuthenticating(true);
    setTimeout(() => {
        setCompanyProfile({
        id: 'user-logged-in',
        name: name,
        email: email,
        phone: "(11) 91111-2222",
        logoUrl: avatarUrl,
        category: 'Consumer',
        address: 'Rua do Consumidor, 123',
        description: "Usuário autenticado via e-mail.",
        plan: 'Prata', // N/A for consumer
        tokens: 0,
        subscriptionEndDate: new Date().toISOString(),
        userType: 'Consumer',
        availabilityStatus: 'AUTO',
        notificationSettings: { newBusiness: true, offers: true, events: true },
        });
        setIsAuthenticating(false);
        onLoginSuccess();
    }, 1500);
  };
  
  const handleGoogleLogin = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
        setCompanyProfile({
        id: 'user-google-loggedin',
        name: "Usuário Google",
        email: "google.user@example.com",
        phone: "(11) 93333-4444",
        logoUrl: 'https://i.pravatar.cc/150?u=google-user', // Mock avatar
        category: 'Consumer',
        address: 'Avenida Brasil, 456',
        description: "Usuário autenticado via Google.",
        plan: 'Prata', // N/A for consumer
        tokens: 0,
        subscriptionEndDate: new Date().toISOString(),
        userType: 'Consumer',
        availabilityStatus: 'AUTO',
        notificationSettings: { newBusiness: true, offers: true, events: true },
        });
        setIsAuthenticating(false);
        setShowGoogleSimModal(false);
        onLoginSuccess();
    }, 1500);
  }

  const handleAvatarClick = () => {
    avatarInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const placeholderUrl = URL.createObjectURL(file);
      setAvatarUrl(placeholderUrl);
    }
  };

  const resetForm = () => {
      setShowEmailLogin(false);
      setAvatarUrl(null);
      setName('');
      setEmail('');
      setPassword('');
      setIsFormValid(false);
  }

  return (
    <>
    {/* Main Login Modal */}
    <Dialog open={isOpen && !showGoogleSimModal} onOpenChange={(open) => {
      if (isAuthenticating) return;
      onOpenChange(open);
      if (!open) {
        resetForm();
      }
    }}>
      <DialogContent className="sm:max-w-md bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold font-headline">Acesse sua Conta</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground pt-2">
            {showEmailLogin ? 'Crie sua conta para continuar' : 'Para continuar, faça login ou crie uma conta.'}
          </DialogDescription>
        </DialogHeader>

        {showEmailLogin ? (
          // Email Login Form
          <div className="py-4 space-y-4">
            <div className="flex flex-col items-center space-y-2">
                <Label className='mb-2'>Foto de Perfil <span className="text-destructive">*</span></Label>
                <div className="relative inline-block">
                <Avatar className="h-24 w-24 border-2 border-dashed border-border">
                    {avatarUrl ? (
                    <Image
                        src={avatarUrl}
                        alt="Foto do Perfil"
                        fill
                        className="object-cover rounded-full"
                    />
                    ) : (
                    <AvatarFallback className="bg-input">
                        <User className="h-12 w-12 text-muted-foreground/50" />
                    </AvatarFallback>
                    )}
                </Avatar>
                <Button
                    size="icon"
                    type="button"
                    className="absolute bottom-1 right-1 h-8 w-8 bg-lime-500 hover:bg-lime-600 rounded-full"
                    onClick={handleAvatarClick}
                >
                    <Pencil className="h-4 w-4 text-black" />
                </Button>
                <input
                    type="file"
                    ref={avatarInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="name">Nome <span className="text-destructive">*</span></Label>
                <Input id="name" type="text" placeholder="Seu nome completo" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                <Input id="email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Senha <span className="text-destructive">*</span></Label>
                <Input id="password" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <DialogFooter className='pt-4'>
              <Button 
                onClick={handleEmailLogin} 
                size="lg" 
                className={cn(
                  "w-full h-12 text-lg font-bold transition-colors",
                  isFormValid && !isAuthenticating
                    ? "bg-lime-500 hover:bg-lime-600 text-black"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
                disabled={!isFormValid || isAuthenticating}
              >
                {isAuthenticating ? <Loader2 className="animate-spin" /> : 'Criar Conta'}
              </Button>
            </DialogFooter>
             <p className="text-center text-sm">
                <button onClick={() => setShowEmailLogin(false)} className="text-lime-400 hover:underline">
                    &larr; Voltar para outras opções
                </button>
            </p>
          </div>
        ) : (
          // Main Login Options
          <div className="py-4 space-y-4">
            <Button onClick={() => setShowGoogleSimModal(true)} variant="outline" size="lg" className="w-full h-12 text-lg border-border/80">
              <GoogleIcon className="mr-3 h-6 w-6" />
              Continuar com Google
            </Button>
            <Button onClick={() => setShowEmailLogin(true)} variant="outline" size="lg" className="w-full h-12 text-lg border-border/80">
              <Mail className="mr-3 h-6 w-6" />
              Continuar com Email
            </Button>
          </div>
        )}
        
        {!isAuthenticating && (
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Fechar</span>
        </DialogClose>
        )}
      </DialogContent>
    </Dialog>

    {/* Google Simulation Modal */}
    <Dialog open={showGoogleSimModal} onOpenChange={setShowGoogleSimModal}>
        <DialogContent className="sm:max-w-md bg-card border-border/50">
            <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold font-headline flex items-center justify-center gap-3">
                    <GoogleIcon />
                    Confirmação de Autenticação Google
                </DialogTitle>
                <DialogDescription className="text-center text-muted-foreground pt-2">
                    Clique abaixo para autenticar com sua conta e prosseguir.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-4">
                <Button 
                    onClick={handleGoogleLogin} 
                    size="lg" 
                    className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
                    disabled={isAuthenticating}
                >
                    {isAuthenticating ? <Loader2 className="animate-spin" /> : "Confirmar Autenticação"}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
