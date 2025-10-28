'use client';

import { User, CreditCard, Settings, LogOut, ChevronRight, X } from "lucide-react";
import Header from "@/components/common/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from 'react';
import { useCompany } from "@/contexts/CompanyContext";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const AccountItem = ({ icon: Icon, title, subtitle, href = "#", isDestructive = false }) => (
    <Link href={href} className="block w-full">
        <div className="flex items-center bg-card p-4 rounded-lg transition-colors hover:bg-muted/50">
            <Icon className={`w-6 h-6 mr-4 ${isDestructive ? 'text-orange-500' : 'text-primary'}`} />
            <div className="flex-grow">
                <h3 className={`font-semibold ${isDestructive ? 'text-orange-500' : 'text-foreground'}`}>{title}</h3>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
    </Link>
);


export default function AccountPage() {
  const { companyProfile } = useCompany();
  const [accessKey, setAccessKey] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  
  const handleRedeemKey = () => {
    if (accessKey.replace(/-/g, '').length === 12) {
      alert(`Chave resgatada: ${accessKey}`);
      setIsModalOpen(false);
      setAccessKey('');
    } else {
      alert('Por favor, insira uma chave válida de 12 caracteres.');
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header title="Minha Conta" />
      <div className="container py-6 space-y-4">
        
        {/* User Info Card */}
        <div className="flex items-center bg-card p-4 rounded-lg">
            <Avatar className="h-16 w-16 mr-4">
                {companyProfile.logoUrl ? (
                  <Image src={companyProfile.logoUrl} alt="Logo da Empresa" layout="fill" className="object-cover rounded-full" />
                ) : (
                  <AvatarFallback>UD</AvatarFallback>
                )}
            </Avatar>
            <div>
                <h2 className="text-xl font-bold font-headline">{companyProfile.name}</h2>
                <p className="text-muted-foreground">{companyProfile.email}</p>
            </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          <AccountItem href="/account/profile" icon={User} title="Meu Perfil" subtitle="Editar informações pessoais" />
          <AccountItem href="/account/subscription" icon={CreditCard} title="Assinatura" subtitle="Gerenciar plano e pagamentos" />
          <AccountItem icon={Settings} title="Configurações" subtitle="Preferências do aplicativo" />
          <AccountItem icon={LogOut} title="Sair" subtitle="Encerrar sessão" isDestructive />
        </div>

        {/* Business CTA */}
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
                    />
                    <p className="text-sm text-muted-foreground text-center">{accessKey.replace(/-/g, '').length}/12 caracteres</p>
                </div>
                <DialogFooter>
                    <Button onClick={handleRedeemKey} size="lg" className="w-full h-12 text-lg bg-lime-500 hover:bg-lime-600 text-black font-bold">
                        Resgatar Chave
                    </Button>
                </DialogFooter>
                 <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Fechar</span>
                </DialogClose>
            </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
