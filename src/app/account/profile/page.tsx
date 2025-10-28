'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { ArrowLeft, User, Pencil, ImagePlus, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CompanyProfile {
  name: string;
  email: string;
  phone: string;
  logoUrl: string | null;
  backgroundUrl: string | null;
}

const originalData: CompanyProfile = {
  name: "Minha Empresa",
  email: "contato@minhaempresa.com",
  phone: "(65) 99999-9999",
  logoUrl: null,
  backgroundUrl: null,
};


export default function EditProfilePage() {
  const [formData, setFormData] = useState<CompanyProfile>(originalData);
  const [hasChanges, setHasChanges] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const changes = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasChanges(changes);
  }, [formData]);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({...prev, [id]: value}));
  };

  const handleLogoClick = () => {
    logoInputRef.current?.click();
  };

  const handleBackgroundClick = () => {
    backgroundInputRef.current?.click();
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: 'logoUrl' | 'backgroundUrl'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const placeholderUrl = URL.createObjectURL(file);
      setFormData(prev => ({...prev, [field]: placeholderUrl}));
    }
  };
  
  const handleSaveChanges = () => {
    if (!hasChanges) return;
    
    console.log("Salvando alterações...", formData);
    // Aqui viria a lógica para chamar a API PUT /api/companies/:id
    // Ex: await fetch(`/api/companies/123`, { 
    //   method: 'PUT',
    //   body: JSON.stringify(formData)
    // });
    alert("Alterações salvas no console!");

    // Reseta o estado original para o novo estado salvo e desabilita o botão
    Object.assign(originalData, formData);
    setHasChanges(false);
  };

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
              <Avatar className="h-32 w-32 border-2 border-dashed border-border">
                {formData.logoUrl ? (
                  <Image
                    src={formData.logoUrl}
                    alt="Logo da Empresa"
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <AvatarFallback className="bg-card">
                    <Building className="h-16 w-16 text-muted-foreground/50" />
                  </AvatarFallback>
                )}
              </Avatar>
              <Button
                size="icon"
                className="absolute bottom-2 right-2 h-9 w-9 bg-lime-500 hover:bg-lime-600 rounded-full"
                onClick={handleLogoClick}
              >
                <Pencil className="h-5 w-5 text-black" />
              </Button>
              <input
                type="file"
                ref={logoInputRef}
                onChange={(e) => handleFileChange(e, 'logoUrl')}
                className="hidden"
                accept="image/*"
              />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              Logo da Empresa
            </p>
          </div>

          <div className="w-full text-center">
            <Button
              variant="outline"
              className="w-full h-12 border-dashed"
              onClick={handleBackgroundClick}
            >
              <ImagePlus className="mr-2 h-5 w-5" />
              {formData.backgroundUrl ? 'Imagem de Fundo Selecionada' : 'Upload da Imagem de Fundo'}
            </Button>
             <input
                type="file"
                ref={backgroundInputRef}
                onChange={(e) => handleFileChange(e, 'backgroundUrl')}
                className="hidden"
                accept="image/*"
              />
          </div>

          <form className="w-full space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-muted-foreground"
              >
                Nome da Empresa
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-card border-border/50 h-12"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-muted-foreground"
              >
                Email de Contato
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-card border-border/50 h-12"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-muted-foreground"
              >
                Telefone
              </label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="bg-card border-border/50 h-12"
              />
            </div>

            <div className="pt-4">
              <Button
                size="lg"
                className={cn(
                  "w-full h-12 text-lg font-bold transition-colors",
                  hasChanges
                    ? "bg-lime-500 hover:bg-lime-600 text-black"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
                onClick={handleSaveChanges}
                disabled={!hasChanges}
              >
                Salvar Alterações
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
