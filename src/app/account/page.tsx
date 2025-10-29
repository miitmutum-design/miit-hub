
'use client';

import { User, CreditCard, Settings, LogOut, ChevronRight, X, Building, Zap, Power, PowerOff, Sparkles } from "lucide-react";
import Header from "@/components/common/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useState } from 'react';
import { useCompany, CompanyProfile, mockCompanyProfiles, AvailabilityStatus } from "@/contexts/CompanyContext";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";


const AccountItem = ({ icon: Icon, title, subtitle, href = "#", isDestructive = false, onClick, disabled = false }: { icon: React.ElementType, title: string, subtitle: string, href?: string, isDestructive?: boolean, onClick?: () => void, disabled?: boolean }) => {
    const content = (
        <div className={cn(
            "flex items-center bg-card p-4 rounded-lg transition-all duration-300 border border-transparent",
            !disabled && "hover:border-primary/50 hover:shadow-md",
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
    { key: 'ABCD-EFGH-IJKL', isUsed: false, companyIds: ['company-gold', 'company-silver'] },
    { key: '1234-5678-9012', isUsed: true, companyIds: ['company-silver'] },
    { key: 'QWER-TYUI-OPAS', isUsed: false, companyIds: ['company-silver'] },
];

type RedeemResult = {
  success: boolean;
  message: string;
  companyId?: string;
  companies?: { id: string; name: string }[];
};

const redeemAccessKeyMockAPI = (key: string): Promise<RedeemResult> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const dbKey = accessKeysDB.find(k => k.key === key);
            if (!dbKey) {
                resolve({ success: false, message: 'Chave de acesso inválida.' });
            } else if (dbKey.isUsed) {
                resolve({ success: false, message: 'Chave de acesso já utilizada.' });
            } else {
                if (dbKey.companyIds.length === 1) {
                    // Mark key as used for single company keys
                    dbKey.isUsed = true;
                    resolve({ success: true, message: 'Chave resgatada com sucesso!', companyId: dbKey.companyIds[0] });
                } else {
                    // For multiple companies, return the list to choose from
                    const companies = dbKey.companyIds.map(id => ({
                      id,
                      name: mockCompanyProfiles[id as keyof typeof mockCompanyProfiles].name
                    }));
                    resolve({ success: true, message: 'Selecione uma empresa.', companies });
                }
            }
        }, 1000); // Simulate network delay
    });
};

const finalizeKeyRedemptionMockAPI = (key: string) => {
    const dbKey = accessKeysDB.find(k => k.key === key);
    if (dbKey) {
        dbKey.isUsed = true;
    }
}


export default function AccountPage() {
  const { companyProfile, setCompanyProfile, logoutCompany } = useCompany();
  const { toast } = useToast();
  const router = useRouter();
  
  const [isRedeemModalOpen, setIsRedeemModalOpen] = useState(false);
  const [isSelectCompanyModalOpen, setIsSelectCompanyModalOpen] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  
  const [accessKey, setAccessKey] = useState('ABCD-EFGH-IJKL');
  const [companiesToSelect, setCompaniesToSelect] = useState<{id: string, name: string}[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  
  const isCompany = companyProfile.userType === 'Company';
  const profileHref = isCompany ? '/account/empresas' : '/account/profile';
  const settingsHref = isCompany ? '/account/profile/config' : '/account/profile/config';

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

    if (result.success) {
      if (result.companyId) {
        // Single company case
        const newProfile = mockCompanyProfiles[result.companyId as keyof typeof mockCompanyProfiles];
        if (newProfile) {
            setCompanyProfile(newProfile);
            toast({
                title: "Bem-vindo!",
                description: "Chave resgatada com sucesso. Seu painel foi ativado.",
            });
            setIsRedeemModalOpen(false);
            setAccessKey('');
            router.push('/account/subscription');
        }
      } else if (result.companies) {
        // Multiple companies case
        setCompaniesToSelect(result.companies);
        setSelectedCompanyId(result.companies[0]?.id || null);
        setIsRedeemModalOpen(false);
        setIsSelectCompanyModalOpen(true);
      }
    } else {
        toast({
            variant: "destructive",
            title: "Falha no Resgate",
            description: result.message,
        });
    }
  }

  const handleSelectCompany = () => {
    if (!selectedCompanyId) {
        toast({ variant: "destructive", title: "Nenhuma empresa selecionada." });
        return;
    }

    const newProfile = mockCompanyProfiles[selectedCompanyId as keyof typeof mockCompanyProfiles];
    if (newProfile) {
        setCompanyProfile(newProfile);
        finalizeKeyRedemptionMockAPI(accessKey); // Mark key as used
        toast({
            title: "Bem-vindo!",
            description: `Painel para ${newProfile.name} ativado com sucesso.`,
        });
        setIsSelectCompanyModalOpen(false);
        setAccessKey('');
        router.push('/account/subscription');
    }
  };


  const handleLogout = () => {
    logoutCompany();
    toast({
        title: "Sessão encerrada",
        description: "Você saiu do seu perfil de empresa.",
    });
  }

  const handleAvailabilityChange = (status: AvailabilityStatus) => {
    setCompanyProfile(prev => ({ ...prev, availabilityStatus: status }));
    const messages = {
      'OPEN': { title: "Sempre Aberto", description: "Sua empresa aparecerá como 'Aberto' para todos, independente do horário.", duration: 5000 },
      'CLOSED': { title: "Pausado Manualmente", description: "Sua empresa ficará invisível em buscas até que você altere o status.", duration: 5000 },
      'AUTO': { title: "Modo Automático", description: "Sua visibilidade será controlada pelo seu horário de funcionamento cadastrado.", duration: 5000 }
    }
    toast(messages[status]);
  }

  const availabilityOptions = {
    'AUTO': {
      label: 'Automático',
      description: 'Visibilidade baseada no seu horário.',
      icon: Sparkles
    },
    'OPEN': {
      label: 'Sempre Aberto',
      description: 'Forçar visibilidade como "Aberto".',
      icon: Power
    },
    'CLOSED': {
      label: 'Sempre Fechado',
      description: 'Pausar visibilidade manualmente.',
      icon: PowerOff
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
                  <Image src={companyProfile.logoUrl} alt="Logo da Empresa" fill className="object-cover rounded-full" />
                ) : (
                  <AvatarFallback>{isCompany ? <Building/> : companyProfile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                )}
            </Avatar>
            <div>
                <h2 className="text-xl font-bold font-headline">{companyProfile.name}</h2>
                <p className="text-muted-foreground">{companyProfile.email}</p>
            </div>
        </div>

        {/* Availability Switch */}
        {isCompany && (
          <Card className="bg-card">
              <div className="p-4 space-y-4">
                  <Label>
                      <div className="flex items-center gap-3 mb-4">
                         <Zap className="w-6 h-6 text-primary" />
                         <div>
                          <h3 className="font-semibold text-lg">Visibilidade da Empresa</h3>
                          <p className="text-sm text-muted-foreground">
                              Controle manual de como sua empresa aparece para clientes.
                          </p>
                         </div>
                      </div>
                  </Label>
                  <RadioGroup
                    value={companyProfile.availabilityStatus}
                    onValueChange={(value: AvailabilityStatus) => handleAvailabilityChange(value)}
                    className="grid grid-cols-1 gap-2"
                  >
                    {Object.entries(availabilityOptions).map(([key, option]) => (
                       <Label key={key}
                         className={cn(
                          "flex items-center gap-4 rounded-lg border p-3 cursor-pointer transition-colors",
                          companyProfile.availabilityStatus === key 
                            ? "border-primary bg-primary/10" 
                            : "border-border/50 hover:bg-muted/50"
                         )}
                       >
                         <RadioGroupItem value={key} id={key} className="h-5 w-5" />
                         <div className="flex-1">
                           <p className="font-semibold text-foreground">{option.label}</p>
                           <p className="text-xs text-muted-foreground">{option.description}</p>
                         </div>
                         <option.icon className={cn("w-5 h-5",
                          companyProfile.availabilityStatus === key && key === 'OPEN' && 'text-green-500',
                          companyProfile.availabilityStatus === key && key === 'CLOSED' && 'text-orange-500',
                          companyProfile.availabilityStatus === key && key === 'AUTO' && 'text-cyan-400',
                         )} />
                       </Label>
                    ))}
                  </RadioGroup>
              </div>
          </Card>
        )}

        {/* Menu Items */}
        <div className="space-y-3">
          <AccountItem href={profileHref} icon={isCompany ? Building : User} title="Meu Perfil" subtitle="Editar informações pessoais" />
          <AccountItem href={settingsHref} icon={Settings} title="Configurações" subtitle="Preferências do aplicativo" />
          <AccountItem href="/account/subscription" icon={CreditCard} title="Assinatura" subtitle="Gerenciar plano e pagamentos" disabled={!isCompany} />
          <AccountItem onClick={handleLogout} icon={LogOut} title="Sair" subtitle="Encerrar sessão" isDestructive />
        </div>

        {/* Business CTA - Only show if not a company */}
        {!isCompany && (
            <Dialog open={isRedeemModalOpen} onOpenChange={setIsRedeemModalOpen}>
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

       {/* Company Selection Modal */}
      <Dialog open={isSelectCompanyModalOpen} onOpenChange={setIsSelectCompanyModalOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold font-headline">Selecione sua Empresa</DialogTitle>
            <DialogDescription className="text-center text-muted-foreground pt-2">
              Esta chave de acesso está vinculada a várias empresas. Escolha qual painel você deseja acessar.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <RadioGroup value={selectedCompanyId || ''} onValueChange={setSelectedCompanyId} className="space-y-2">
              {companiesToSelect.map(company => (
                <Label key={company.id} htmlFor={company.id} className="flex items-center gap-3 p-3 rounded-md border border-border/50 has-[:checked]:border-primary has-[:checked]:bg-primary/10 cursor-pointer">
                  <RadioGroupItem value={company.id} id={company.id} />
                  <span>{company.name}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button onClick={handleSelectCompany} size="lg" className="w-full h-12 text-lg bg-lime-500 hover:bg-lime-600 text-black font-bold">
              Confirmar Empresa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

    

    

