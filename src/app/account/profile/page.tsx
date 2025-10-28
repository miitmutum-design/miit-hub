'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { ArrowLeft, Pencil, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useCompany } from '@/contexts/CompanyContext';
import type { CompanyProfile } from '@/contexts/CompanyContext';
import { useToast } from "@/hooks/use-toast";


export default function EditProfilePage() {
  const { companyProfile, setCompanyProfile } = useCompany();
  const { toast } = useToast();

  const [originalData, setOriginalData] = useState<CompanyProfile>(companyProfile);
  const [formData, setFormData] = useState<CompanyProfile>(companyProfile);
  const [hasChanges, setHasChanges] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Update form if companyProfile from context changes
  useEffect(() => {
    setOriginalData(companyProfile);
    setFormData(companyProfile);
  }, [companyProfile]);

  // Check for changes between form data and the original data from context
  useEffect(() => {
    const changes = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasChanges(changes);
  }, [formData, originalData]);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({...prev, [id]: value}));
  };

  const handleLogoClick = () => {
    logoInputRef.current?.click();
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    field: 'logoUrl'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const placeholderUrl = URL.createObjectURL(file);
      setFormData(prev => ({...prev, [field]: placeholderUrl}));
    }
  };
  
  const handleSaveChanges = () => {
    if (!hasChanges) return;

    // Update the context with the new form data
    setCompanyProfile(formData);
    
    // Update the original data state to match the newly saved data
    setOriginalData(formData);

    // Reset the hasChanges state
    setHasChanges(false);

    toast({
      title: "Sucesso!",
      description: "Seu perfil foi atualizado.",
    });
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
            Editar Perfil Pessoal
          </h1>
        </header>

        <div className="flex flex-col items-center space-y-8">
          <div className="space-y-6 text-center">
            <div className="relative inline-block">
              <Avatar className="h-32 w-32 border-2 border-dashed border-border">
                {formData.logoUrl ? (
                  <Image
                    src={formData.logoUrl}
                    alt="Foto do Perfil"
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <AvatarFallback className="bg-card">
                    <User className="h-16 w-16 text-muted-foreground/50" />
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
              Foto de Perfil
            </p>
          </div>

          <form className="w-full space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium text-muted-foreground"
              >
                Seu Nome
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
                Email
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
