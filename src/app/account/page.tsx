'use client';

import { User, CreditCard, Settings, LogOut, ChevronRight, X } from "lucide-react";
import Header from "@/components/common/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from 'react';
import { useCompany, CompanyProfile, mockCompanyProfiles } from "@/contexts/CompanyContext";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const AccountItem = ({ icon: Icon, title, subtitle, href = "#", isDestructive = false, onClick, disabled = false }: { icon: React.ElementType, title: string, subtitle: string, href?: string, isDestructive?: boolean, onClick?: () => void, disabled?: boolean }) => {
    const content = (
        <div className={cn(
            "flex items-center bg-card p-4 rounded-lg transition-colors",
            !disabled && "hover:bg-muted/50",
            disabled && "opacity-50 cursor-not-allowed"
        )}>
            <Icon className={`w-6 h-6 mr-4 ${isDestructive ? 'text-orange-500' : 'text-primary'}`} />
            <div className="flex-grow">
                <h3 className={`font-semibold ${isDestructive ? 'text-orange-500' : 'text-foreground'}`}>{title}</h3>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
    );

    if (disabled) {
        return <div>{content}</div>;
    }

    if (onClick) {
        return (
            <button onClick={onClick} className="block w-full text-left">
                {content}
            </button>
        );
    }

    return (
        <Link href={href} className="block w-full">
            {content}
        </Link>
    );
};


// Mock database of access keys
const accessKeysDB = [
    { key: 'ABCD-EFGH-IJKL', isUsed: false, companyId: 'company-gold' },
    { key: '1234-5678-9012', isUsed: true, companyId: 'company-silver' },
    { key: 'QWER-TYUI-OPAS', isUsed: false, companyId: 'company-silver' },
];

const redeemAccessKeyMockAPI = (key: string): Promise<{ success: boolean; message: string; companyId?: string }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const dbKey = accessKeysDB.find(k => k.key === key);
            if (!dbKey) {
                resolve({ success: false, message: 'Chave de acesso inválida.' });
            } else if (dbKey.isUsed) {
                resolve({ success: false, message: 'Chave de acesso já utilizada.' });
            } else {
                // Mark key as used in the mock DB
                dbKey.isUsed = true;
                resolve({ success: true, message: 'Chave resgatada com sucesso!', companyId: dbKey.companyId });
            }
        }, 1000); // Simulate network delay
    });
};


export default function AccountPage() {
  const { companyProfile, setCompanyProfile, logoutCompany } = useCompany();
  const { toast } = useToast();
  const [accessKey, setAccessKey] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  
  const isCompany = companyProfile.id !== 'user-demo';
  const profileHref = isCompany ? '/account/empresas' : '/account/profile';
  const settingsHref = isCompany ? '#' : '/account/profile/config'; // TODO: Add company settings page

  const handleAccessKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/-/g, '').toUpperCase();
    if (rawValue.length > 12) return;

    const formattedValue = rawValue
      .split('')
      .map((char, index) => {
        if (index > 0 && index % 4 === 0) {
          return `-${char}`;
        }
        return char;
      })
      .join('');
    
    setAccessKey(formattedValue);
  };
  
  const handleRedeemKey = async () => {
    if (accessKey.replace(/-/g, '').length !== 12) {
      toast({
        variant: "destructive",
        title: "Chave Inválida",
        description: "Por favor, insira uma chave válida de 12 caracteres.",
      });
      return;
    }
    
    setIsRedeeming(true);
    const result = await redeemAccessKeyMockAPI(accessKey);
    setIsRedeeming(false);

    if (result.success && result.companyId) {
        const newProfile = mockCompanyProfiles[result.companyId as keyof typeof mockCompanyProfiles];
        if (newProfile) {
            setCompanyProfile(newProfile);
            toast({
                title: "Bem-vindo!",
                description: "Chave resgatada com sucesso. Seu painel foi ativado.",
            });
            setIsModalOpen(false);
            setAccessKey('');
        }
    } else {
        toast({
            variant: "destructive",
            title: "Falha no Resgate",
            description: result.message,
        });
    }
  }

  const handleLogout = () => {
    logoutCompany();
    toast({
        title: "Sessão encerrada",
        description: "Você saiu do seu perfil de empresa.",
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header title="Minha Conta" />
      <div className="container py-6 space-y-4">
        
        {/* User Info Card */}
        <div className="flex items-center bg-card p-4 rounded-lg">
            <Avatar className="h-16 w-16 mr-4">
                {companyProfile.logoUrl ? (
                  <Image src={companyProfile.logoUrl} alt="Logo da Empresa" fill className="object-cover rounded-full" />
                ) : (
                  <AvatarFallback>{companyProfile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                )}
            </Avatar>
            <div>
                <h2 className="text-xl font-bold font-headline">{companyProfile.name}</h2>
                <p className="text-muted-foreground">{companyProfile.email}</p>
            </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          <AccountItem href={profileHref} icon={User} title="Meu Perfil" subtitle="Editar informações pessoais" />
          <AccountItem href={settingsHref} icon={Settings} title="Configurações" subtitle="Preferências do aplicativo" disabled={isCompany} />
          <AccountItem href="/account/subscription" icon={CreditCard} title="Assinatura" subtitle="Gerenciar plano e pagamentos" disabled={!isCompany} />
          <AccountItem onClick={handleLogout} icon={LogOut} title="Sair" subtitle="Encerrar sessão" isDestructive />
        </div>

        {/* Business CTA - Only show if not a company */}
        {!isCompany && (
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                    <div className="bg-gradient-to-br from-green-900/40 via-green-800/30 to-card p-6 rounded-lg mt-8 text-center cursor-pointer">
                        <h3 className="text-2xl font-bold font-headline text-white">Empresa?</h3>
                        <p className="text-muted-foreground mt-2 mb-4">Cadastre seu negócio e alcance mais clientes</p>
                        <Button size="lg" className="w-full h-12 text-lg bg-orange-600 hover:bg-orange-700 text-white font-bold pointer-events-none">
                            Criar Perfil Empresarial
                        </Button>
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-card border-border/50">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-bold font-headline">Resgatar Chave de Acesso</DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground pt-2">
                            Insira a chave de 12 caracteres que você recebeu para acessar o painel da sua empresa.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-2">
                        <Input 
                            placeholder="XXXX-XXXX-XXXX" 
                            value={accessKey}
                            onChange={handleAccessKeyChange}
                            className="h-14 text-2xl tracking-widest text-center bg-input border-border/50"
                            maxLength={14}
                            disabled={isRedeeming}
                        />
                        <p className="text-sm text-muted-foreground text-center">{accessKey.replace(/-/g, '').length}/12 caracteres</p>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleRedeemKey} size="lg" className="w-full h-12 text-lg bg-lime-500 hover:bg-lime-600 text-black font-bold" disabled={isRedeeming}>
                            {isRedeeming ? 'Validando...' : 'Resgatar Chave'}
                        </Button>
                    </DialogFooter>
                    <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Fechar</span>
                    </DialogClose>
                </DialogContent>
            </Dialog>
        )}
      </div>
    </div>
  );
}
