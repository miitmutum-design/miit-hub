
'use client';

import React, { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useCompany, mockCompanyProfiles } from '@/contexts/CompanyContext';

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
      const dbKey = accessKeysDB.find((k) => k.key === key);
      if (!dbKey) {
        resolve({ success: false, message: 'Chave de acesso inválida.' });
      } else if (dbKey.isUsed) {
        resolve({ success: false, message: 'Chave de acesso já utilizada.' });
      } else {
        if (dbKey.companyIds.length === 1) {
          // Mark key as used for single company keys
          dbKey.isUsed = true;
          resolve({
            success: true,
            message: 'Chave resgatada com sucesso!',
            companyId: dbKey.companyIds[0],
          });
        } else {
          // For multiple companies, return the list to choose from
          const companies = dbKey.companyIds.map((id) => ({
            id,
            name: mockCompanyProfiles[id as keyof typeof mockCompanyProfiles]
              .name,
          }));
          resolve({
            success: true,
            message: 'Selecione uma empresa.',
            companies,
          });
        }
      }
    }, 1000); // Simulate network delay
  });
};

const finalizeKeyRedemptionMockAPI = (key: string) => {
  const dbKey = accessKeysDB.find((k) => k.key === key);
  if (dbKey) {
    dbKey.isUsed = true;
  }
};

export default function RedeemKeyPage() {
  const { setCompanyProfile } = useCompany();
  const { toast } = useToast();
  const router = useRouter();

  const [isSelectCompanyModalOpen, setIsSelectCompanyModalOpen] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);

  const [accessKey, setAccessKey] = useState('');
  const [companiesToSelect, setCompaniesToSelect] = useState<{ id: string; name: string }[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

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
        variant: 'destructive',
        title: 'Chave Inválida',
        description: 'Por favor, insira uma chave válida de 12 caracteres.',
      });
      return;
    }

    setIsRedeeming(true);
    const result = await redeemAccessKeyMockAPI(accessKey);
    setIsRedeeming(false);

    if (result.success) {
      if (result.companyId) {
        // Single company case
        const newProfile =
          mockCompanyProfiles[result.companyId as keyof typeof mockCompanyProfiles];
        if (newProfile) {
          setCompanyProfile(newProfile);
          setAccessKey('');
          router.push('/account/subscription');
        }
      } else if (result.companies) {
        // Multiple companies case
        setCompaniesToSelect(result.companies);
        setSelectedCompanyId(result.companies[0]?.id || null);
        setIsSelectCompanyModalOpen(true);
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Falha no Resgate',
        description: result.message,
      });
    }
  };

  const handleSelectCompany = () => {
    if (!selectedCompanyId) {
      toast({
        variant: 'destructive',
        title: 'Nenhuma empresa selecionada.',
      });
      return;
    }

    const newProfile =
      mockCompanyProfiles[selectedCompanyId as keyof typeof mockCompanyProfiles];
    if (newProfile) {
      setCompanyProfile(newProfile);
      finalizeKeyRedemptionMockAPI(accessKey); // Mark key as used
      setIsSelectCompanyModalOpen(false);
      setAccessKey('');
      router.push('/account');
    }
  };

  return (
    <>
      <div className="container mx-auto max-w-lg py-6 sm:py-8">
        <header className="relative mb-8 flex items-center justify-center text-center">
          <Link href="/account" className="absolute left-0">
            <Button variant="ghost" size="icon">
              <ArrowLeft />
              <span className="sr-only">Voltar</span>
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground font-headline">
            Perfil Empresarial
          </h1>
        </header>

        <Card className="bg-card border-border/50">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold font-headline">
              Resgatar Chave de Acesso
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground pt-2">
              Insira a chave de 12 caracteres que você recebeu para acessar o painel da sua empresa.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="py-4 space-y-2">
              <Input
                placeholder="XXXX-XXXX-XXXX"
                value={accessKey}
                onChange={handleAccessKeyChange}
                className="h-14 text-2xl tracking-widest text-center bg-input border-border/50"
                maxLength={14}
                disabled={isRedeeming}
              />
              <p className="text-sm text-muted-foreground text-center">
                {accessKey.replace(/-/g, '').length}/12 caracteres
              </p>
            </div>
            <Button
              onClick={handleRedeemKey}
              size="lg"
              className="w-full h-12 text-lg bg-lime-500 hover:bg-lime-600 text-black font-bold"
              disabled={isRedeeming}
            >
              {isRedeeming ? 'Validando...' : 'Resgatar Chave'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Company Selection Modal */}
      <Dialog open={isSelectCompanyModalOpen} onOpenChange={setIsSelectCompanyModalOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold font-headline">
              Selecione sua Empresa
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground pt-2">
              Esta chave de acesso está vinculada a várias empresas. Escolha qual painel você deseja acessar.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <RadioGroup
              value={selectedCompanyId || ''}
              onValueChange={setSelectedCompanyId}
              className="space-y-2"
            >
              {companiesToSelect.map((company) => (
                <Label
                  key={company.id}
                  htmlFor={company.id}
                  className="flex items-center gap-3 p-3 rounded-md border border-border/50 has-[:checked]:border-primary has-[:checked]:bg-primary/10 cursor-pointer"
                >
                  <RadioGroupItem value={company.id} id={company.id} />
                  <span>{company.name}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSelectCompany}
              size="lg"
              className="w-full h-12 text-lg bg-lime-500 hover:bg-lime-600 text-black font-bold"
            >
              Confirmar Empresa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
