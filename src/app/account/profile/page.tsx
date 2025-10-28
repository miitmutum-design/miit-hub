'use client';

import { ArrowLeft, User, Pencil, ImagePlus, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

export default function EditProfilePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-lg py-6 sm:py-8">
        <header className="relative mb-8 flex items-center justify-center text-center">
          <Link href="/account" className="absolute left-0">
            <Button variant="ghost" size="icon">
              <ArrowLeft />
              <span className="sr-only">Voltar</span>
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground font-headline">
            Editar Perfil da Empresa
          </h1>
        </header>

        <div className="flex flex-col items-center space-y-8">
          <div className="space-y-6 text-center">
            <div className="relative inline-block">
              <Avatar className="h-32 w-32">
                <AvatarFallback className="bg-card">
                  <Building className="h-16 w-16 text-muted-foreground/50" />
                </AvatarFallback>
              </Avatar>
              <Button size="icon" className="absolute bottom-2 right-2 h-9 w-9 bg-lime-500 hover:bg-lime-600 rounded-full">
                <Pencil className="h-5 w-5 text-black" />
              </Button>
            </div>
             <p className="text-sm font-medium text-muted-foreground">Logo da Empresa</p>
          </div>

          <div className="w-full text-center">
             <Button variant="outline" className="w-full h-12 border-dashed">
                <ImagePlus className="mr-2 h-5 w-5" />
                Upload da Imagem de Fundo
             </Button>
          </div>


          <form className="w-full space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-muted-foreground">
                Nome da Empresa
              </label>
              <Input id="name" type="text" defaultValue="Minha Empresa" className="bg-card border-border/50 h-12" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                Email de Contato
              </label>
              <Input id="email" type="email" defaultValue="contato@minhaempresa.com" className="bg-card border-border/50 h-12" />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-muted-foreground">
                Telefone
              </label>
              <Input id="phone" type="tel" defaultValue="(65) 99999-9999" className="bg-card border-border/50 h-12" />
            </div>

            <div className="pt-4">
              <Button size="lg" className="w-full h-12 text-lg bg-lime-500 hover:bg-lime-600 text-black font-bold">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
