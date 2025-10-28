'use client';

import { User, CreditCard, Settings, LogOut, ChevronRight } from "lucide-react";
import Header from "@/components/common/Header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from 'react';

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
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header title="Minha Conta" />
      <div className="container py-6 space-y-4">
        
        {/* User Info Card */}
        <div className="flex items-center bg-card p-4 rounded-lg">
            <Avatar className="h-16 w-16 mr-4">
                <AvatarFallback>UD</AvatarFallback>
            </Avatar>
            <div>
                <h2 className="text-xl font-bold font-headline">Usuário Demo</h2>
                <p className="text-muted-foreground">demo@example.com</p>
            </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-3">
          <AccountItem href="/account/profile" icon={User} title="Meu Perfil" subtitle="Editar informações pessoais" />
          <AccountItem icon={CreditCard} title="Assinatura" subtitle="Gerenciar plano e pagamentos" />
          <AccountItem icon={Settings} title="Configurações" subtitle="Preferências do aplicativo" />
          <AccountItem icon={LogOut} title="Sair" subtitle="Encerrar sessão" isDestructive />
        </div>

        {/* Business CTA */}
        <div className="bg-gradient-to-br from-green-900/40 via-green-800/30 to-card p-6 rounded-lg mt-8 text-center">
            <h3 className="text-2xl font-bold font-headline text-white">Empresa?</h3>
            <p className="text-muted-foreground mt-2 mb-4">Cadastre seu negócio e alcance mais clientes</p>
            <Button size="lg" className="w-full h-12 text-lg bg-orange-600 hover:bg-orange-700 text-white font-bold">
                Criar Perfil Empresarial
            </Button>
        </div>
      </div>
    </div>
  );
}
