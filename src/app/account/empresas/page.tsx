
'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { ArrowLeft, Pencil, Building, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useCompany } from '@/contexts/CompanyContext';
import type { CompanyProfile } from '@/contexts/CompanyContext';
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories } from '@/lib/data';


export default function EditProfilePage() {
  const { companyProfile, setCompanyProfile } = useCompany();
  const { toast } = useToast();
  const router = useRouter();

  const [originalData, setOriginalData] = useState<CompanyProfile>(companyProfile);
  const [formData, setFormData] = useState<CompanyProfile>(companyProfile);
  const [hasChanges, setHasChanges] = useState(false);
  const [showOtherCategory, setShowOtherCategory] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  // Update form if companyProfile from context changes (e.g. after redeeming a key)
  useEffect(() => {
    setOriginalData(companyProfile);
    setFormData(companyProfile);
    if(companyProfile.category && !categories.find(c => c.name === companyProfile.category)) {
      setShowOtherCategory(true);
    }
  }, [companyProfile]);

  // Check for changes between form data and the original data from context
  useEffect(() => {
    const changes = JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasChanges(changes);
  }, [formData, originalData]);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({...prev, [id]: value}));
  };
  
  const handleCategoryChange = (value: string) => {
    if (value === 'Outros') {
      setShowOtherCategory(true);
      setFormData(prev => ({...prev, category: ''}));
    } else {
      setShowOtherCategory(false);
      setFormData(prev => ({...prev, category: value}));
    }
  };

  const handleLogoClick = () => {
    logoInputRef.current?.click();
  };
  
  const handleBackgroundClick = () => {
    backgroundInputRef.current?.click();
  }

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

    // Redirect to the business page
    if(formData.id) {
        router.push(`/business/${formData.id}`);
    }
  };
  
  const MAX_DESC_LENGTH = 360;

  return (
    <div className="min-h-screen bg-background text-foreground pb-40">
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

        <form className="w-full space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col items-center space-y-2">
                <p className="text-sm font-medium text-muted-foreground self-start">
                  Logo da Empresa
                </p>
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
                    type="button"
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
            </div>

            <div className="flex flex-col items-center space-y-2">
                <p className="text-sm font-medium text-muted-foreground self-start">
                    Imagem de Fundo
                </p>
                <button
                    type="button"
                    onClick={handleBackgroundClick}
                    className="relative w-full h-40 rounded-lg border-2 border-dashed border-border bg-card flex items-center justify-center text-muted-foreground hover:border-primary/50 transition-colors"
                >
                    {formData.backgroundUrl ? (
                        <Image
                            src={formData.backgroundUrl}
                            alt="Imagem de Fundo"
                            fill
                            className="object-cover rounded-lg"
                        />
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <ImageIcon className="h-8 w-8" />
                            <span>Fazer upload de imagem de fundo</span>
                        </div>
                    )}
                </button>
                <input
                    type="file"
                    ref={backgroundInputRef}
                    onChange={(e) => handleFileChange(e, 'backgroundUrl')}
                    className="hidden"
                    accept="image/*"
                />
            </div>
            
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
                value={formData.name || ''}
                onChange={handleInputChange}
                className="bg-card border-border/50 h-12"
              />
            </div>
            
            <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium text-muted-foreground">
                    Categoria
                </label>
                <Select onValueChange={handleCategoryChange} value={showOtherCategory ? 'Outros' : formData.category || ''}>
                    <SelectTrigger className="bg-card border-border/50 h-12">
                        <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                        {categories.map((cat) => (
                            <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem>
                        ))}
                        <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            {showOtherCategory && (
                <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium text-muted-foreground">
                        Qual categoria?
                    </label>
                    <Input
                        id="category"
                        type="text"
                        value={formData.category || ''}
                        onChange={handleInputChange}
                        className="bg-card border-border/50 h-12"
                        placeholder='Ex: Restaurante Japonês'
                    />
                </div>
            )}
            
            <div className="space-y-2">
              <label
                htmlFor="address"
                className="text-sm font-medium text-muted-foreground"
              >
                Endereço Completo
              </label>
              <Input
                id="address"
                type="text"
                value={formData.address || ''}
                onChange={handleInputChange}
                className="bg-card border-border/50 h-12"
                placeholder="Rua, Número, Bairro, Cidade, Estado, CEP"
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
                value={formData.email || ''}
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
              </label>misc/inf
              <Input
                id="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={handleInputChange}
                className="bg-card border-border/50 h-12"
              />
            </div>
            
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium text-muted-foreground"
              >
                Sobre
              </label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                className="bg-card border-border/50 min-h-[120px]"
                maxLength={MAX_DESC_LENGTH}
              />
              <p className="text-sm text-right text-muted-foreground">
                {formData.description?.length || 0} / {MAX_DESC_LENGTH}
              </p>
            </div>
        </form>
      </div>

       <div className="fixed bottom-16 md:bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border/50">
          <Button
            size="lg"
            className={cn(
              "w-full max-w-lg mx-auto h-12 text-lg font-bold transition-colors",
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
    </div>
  );
}
