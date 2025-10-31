
'use client';

import React, { useState, useRef, ChangeEvent, useEffect, useTransition } from 'react';
import { ArrowLeft, Pencil, Building, Image as ImageIcon, Clock, Sparkles, Loader2, Tag, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useCompany, type CompanyProfile, type OperatingHours, mockCompanyProfiles } from '@/contexts/CompanyContext';
import { useToast } from "@/hooks/use-toast";
import { useRouter, useParams } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories } from '@/lib/data';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { generateCompanyBio } from '@/ai/flows/generate-company-bio';
import { generateSearchTerms } from '@/ai/flows/generate-search-terms';
import { TagInput } from '@/components/ui/tag-input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const defaultHours: OperatingHours[] = [
    { day: 'Segunda', isOpen: true, open: '09:00', close: '18:00' },
    { day: 'Terça', isOpen: true, open: '09:00', close: '18:00' },
    { day: 'Quarta', isOpen: true, open: '09:00', close: '18:00' },
    { day: 'Quinta', isOpen: true, open: '09:00', close: '18:00' },
    { day: 'Sexta', isOpen: true, open: '09:00', close: '18:00' },
    { day: 'Sábado', isOpen: false, open: '10:00', close: '16:00' },
    { day: 'Domingo', isOpen: false, open: '10:00', close: '14:00' },
];

export default function AdminEditCompanyPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const companyId = params.id as string;

  const initialProfile: CompanyProfile = mockCompanyProfiles[companyId as keyof typeof mockCompanyProfiles] || {
    id: companyId,
    name: '',
    category: '',
    address: '',
    email: '',
    phone: '',
    logoUrl: null,
    backgroundUrl: null,
    description: '',
    products: [],
    searchTerms: [],
    plan: 'Prata',
    tokens: 0,
    subscriptionEndDate: new Date().toISOString(),
    userType: 'Company',
    availabilityStatus: 'AUTO',
    hoursOfOperation: defaultHours,
  };

  const [formData, setFormData] = useState<CompanyProfile>(initialProfile);
  const [hasChanges, setHasChanges] = useState(false);
  const [showOtherCategory, setShowOtherCategory] = useState(false);
  const [isGeneratingBio, startBioGeneration] = useTransition();
  const [isSaving, setIsSaving] = useState(false);
  
  const logoInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setHasChanges(JSON.stringify(formData) !== JSON.stringify(initialProfile));
  }, [formData, initialProfile]);
  
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({...prev, [id]: value}));
  };
  
  const handleProductsChange = (newProducts: string[]) => {
    setFormData(prev => ({...prev, products: newProducts}));
  }

  const handleCategoryChange = (value: string) => {
    if (value === 'Outros') {
      setShowOtherCategory(true);
      setFormData(prev => ({...prev, category: ''}));
    } else {
      setShowOtherCategory(false);
      setFormData(prev => ({...prev, category: value}));
    }
  };

  const handleOperatingHoursChange = (
    index: number,
    field: keyof OperatingHours,
    value: string | boolean
  ) => {
    const updatedHours = [...(formData.hoursOfOperation || [])];
    const dayToUpdate = { ...updatedHours[index], [field]: value };
    updatedHours[index] = dayToUpdate;
    setFormData(prev => ({ ...prev, hoursOfOperation: updatedHours }));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'backgroundUrl') => {
    const file = event.target.files?.[0];
    if (file) {
      const placeholderUrl = URL.createObjectURL(file);
      setFormData(prev => ({...prev, [field]: placeholderUrl}));
    }
  };

  const handleSaveChanges = async (approve = false) => {
    setIsSaving(true);
    toast({
        title: "Salvando Perfil...",
        description: approve ? "Aprovando e publicando a empresa." : "Salvando alterações como pendente.",
    });

    try {
        console.log("Saving data:", { ...formData, status: approve ? 'Aprovada' : 'Pendente' });
        
        toast({
          title: "Sucesso!",
          description: `Empresa ${approve ? 'aprovada e publicada' : 'salva como pendente'}.`,
        });

        router.push(`/admin/empresas`);
    } catch (error: any) {
        console.error("Error saving profile:", error);
        toast({
            variant: "destructive",
            title: "Falha ao Salvar",
            description: error.message || "Ocorreu um erro ao salvar o perfil.",
        });
    } finally {
        setIsSaving(false);
    }
  };

  const handleDelete = () => {
     console.log("Deleting company:", companyId);
     toast({
        title: "Empresa Excluída",
        description: `A empresa ${formData.name} foi removida.`,
        variant: "destructive"
     });
     router.push('/admin/empresas');
  }

  const MAX_DESC_LENGTH = 360;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto max-w-lg py-6 sm:py-8">
        <header className="relative mb-8 flex items-center justify-between">
          <Link href="/admin/empresas" className="absolute left-0">
            <Button variant="ghost" size="icon">
              <ArrowLeft />
              <span className="sr-only">Voltar</span>
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground font-headline text-center flex-1">
            Editar Perfil da Empresa (Admin)
          </h1>
           <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" className="absolute right-0">
                  <Trash2 />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso excluirá permanentemente a empresa e todos os seus dados.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </header>

        <form className="w-full space-y-6" onSubmit={(e) => e.preventDefault()}>
            {/* ... (form fields are identical to /account/empresas/page.tsx) ... */}
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
                    onClick={() => logoInputRef.current?.click()}
                  >
                    <Pencil className="h-5 w-5 text-black" />
                  </Button>
                  <input type="file" ref={logoInputRef} onChange={(e) => handleFileChange(e, 'logoUrl')} className="hidden" accept="image/*" />
                </div>
            </div>
            
            {/* ... other fields */}

            <div className="flex flex-col items-center space-y-2">
                <p className="text-sm font-medium text-muted-foreground self-start">
                    Imagem de Fundo
                </p>
                <button
                    type="button"
                    onClick={() => backgroundInputRef.current?.click()}
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
                <input type="file" ref={backgroundInputRef} onChange={(e) => handleFileChange(e, 'backgroundUrl')} className="hidden" accept="image/*" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-muted-foreground">Nome da Empresa</label>
              <Input id="name" type="text" value={formData.name || ''} onChange={handleInputChange} className="bg-card border-border/50 h-12" />
            </div>

            <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium text-muted-foreground">Categoria</label>
                <Select onValueChange={handleCategoryChange} value={showOtherCategory ? 'Outros' : formData.category || ''}>
                    <SelectTrigger className="bg-card border-border/50 h-12"><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
                    <SelectContent>
                        {categories.map((cat) => ( <SelectItem key={cat.name} value={cat.name}>{cat.name}</SelectItem> ))}
                        <SelectItem value="Outros">Outros</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            
            {showOtherCategory && (
                <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium text-muted-foreground">Qual categoria?</label>
                    <Input id="category" type="text" value={formData.category || ''} onChange={handleInputChange} className="bg-card border-border/50 h-12" placeholder='Ex: Restaurante Japonês' />
                </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium text-muted-foreground">Endereço Completo</label>
              <Input id="address" type="text" value={formData.address || ''} onChange={handleInputChange} className="bg-card border-border/50 h-12" placeholder="Rua, Número, Bairro, Cidade, Estado, CEP" />
            </div>
            
            <div className="space-y-4">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Clock className="w-5 h-5"/> Horário de Funcionamento</label>
                <div className="bg-card p-4 rounded-lg space-y-4">
                    {formData.hoursOfOperation?.map((day, index) => (
                        <React.Fragment key={day.day}>
                            <div className="grid grid-cols-3 sm:grid-cols-4 items-center gap-4">
                                <div className="col-span-1 sm:col-span-2 flex items-center gap-3">
                                    <Switch id={`is-open-${day.day}`} checked={day.isOpen} onCheckedChange={(checked) => handleOperatingHoursChange(index, 'isOpen', checked)} />
                                    <Label htmlFor={`is-open-${day.day}`} className="font-semibold">{day.day}</Label>
                                </div>
                                <div className="col-span-2 sm:col-span-2 grid grid-cols-2 gap-2">
                                    <Input type="time" value={day.open || ''} onChange={(e) => handleOperatingHoursChange(index, 'open', e.target.value)} disabled={!day.isOpen} className="bg-input border-border/50" />
                                    <Input type="time" value={day.close || ''} onChange={(e) => handleOperatingHoursChange(index, 'close', e.target.value)} disabled={!day.isOpen} className="bg-input border-border/50" />
                                </div>
                            </div>
                            {index < (formData.hoursOfOperation?.length || 0) -1 && <Separator />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-muted-foreground">Telefone (WhatsApp)</label>
              <Input id="phone" type="tel" value={formData.phone || ''} onChange={handleInputChange} className="bg-card border-border/50 h-12" />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-muted-foreground">Email de Contato</label>
              <Input id="email" type="email" value={formData.email || ''} onChange={handleInputChange} className="bg-card border-border/50 h-12" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="instagram" className="text-sm font-medium text-muted-foreground">Instagram</label>
              <Input id="instagram" type="text" value={formData.instagram || ''} onChange={handleInputChange} className="bg-card border-border/50 h-12" placeholder="@seuinstagram"/>
            </div>

            <div className="space-y-2">
              <label htmlFor="websiteUrl" className="text-sm font-medium text-muted-foreground">Site</label>
              <Input id="websiteUrl" type="url" value={formData.websiteUrl || ''} onChange={handleInputChange} className="bg-card border-border/50 h-12" placeholder="https://seusite.com"/>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-muted-foreground">Sobre</label>
              <Textarea id="description" value={formData.description || ''} onChange={handleInputChange} className="bg-card border-border/50 min-h-[120px]" maxLength={MAX_DESC_LENGTH}/>
              <p className="text-sm text-right text-muted-foreground">{(formData.description || '').length} / {MAX_DESC_LENGTH}</p>
            </div>

            <div className="space-y-2">
                <label htmlFor="products" className="text-sm font-medium text-muted-foreground flex items-center gap-2"><Tag className="w-5 h-5"/> Produtos/Serviços (Separe com vírgula)</label>
                <TagInput id="products" value={formData.products} onChange={handleProductsChange} placeholder="Adicione um produto ou serviço..." className="bg-card border-border/50" />
            </div>

             <div className="pt-6 pb-24 grid grid-cols-2 gap-4">
               <Button size="lg" className="w-full h-12 text-lg font-bold" variant="outline" onClick={() => handleSaveChanges(false)} disabled={!hasChanges || isSaving}>
                 {isSaving ? <Loader2 className="animate-spin" /> : 'Salvar como Pendente'}
              </Button>
              <Button size="lg" className="w-full h-12 text-lg font-bold bg-lime-500 hover:bg-lime-600 text-black" onClick={() => handleSaveChanges(true)} disabled={isSaving}>
                 {isSaving ? <Loader2 className="animate-spin" /> : 'Aprovar Empresa'}
              </Button>
            </div>
        </form>
      </div>
    </div>
  );
}
