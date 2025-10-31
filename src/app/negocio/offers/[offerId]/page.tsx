
'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Gift, Tag, FileText, Download, QrCode, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useCompany } from '@/contexts/CompanyContext';
import { cn } from '@/lib/utils';
import LoginModal from '@/components/common/LoginModal';
import { getOfferById, type Offer } from '@/lib/data';
import { notFound, useParams } from 'next/navigation';
import React from 'react';

export default function OfferDetailPage() {
  const params = useParams();
  const offerId = params.offerId as string;
  const offer = getOfferById(offerId); 

  const { toast } = useToast();
  const { companyProfile, claimedOffers, claimOffer } = useCompany();
  
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  const isUserAuthenticated = companyProfile.id !== 'user-demo';

  useEffect(() => {
    if (offer) {
        setFormattedDate(new Date(offer.validUntil).toLocaleDateString('pt-BR'));
    }
  }, [offer]);
  
  if (!offer) {
      notFound();
  }

  const isExpired = new Date(offer.validUntil) < new Date();
  
  const timesClaimed = claimedOffers.filter(claimed => claimed.id === offer.id).length;
  const isLimitReached = timesClaimed >= offer.limitPerUser;


  const handleGenerateOffer = () => {
    if (isExpired || isLimitReached) return;

    if (!isUserAuthenticated) {
      setIsLoginModalOpen(true);
    } else {
      // User is already logged in, proceed to claim
      claimOffer(offer, offer.limitPerUser);
      setIsQrModalOpen(true);
    }
  };
  
  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    // After login, proceed to generate the offer
    claimOffer(offer, offer.limitPerUser);
    setIsQrModalOpen(true);
  }

  const handleSaveToWallet = () => {
    toast({
      title: "Salvo com Sucesso!",
      description: "Sua oferta digital foi salva na sua carteira.",
    });
    setIsQrModalOpen(false);
  }

  const qrPayload = JSON.stringify({
    businessName: offer.businessName,
    offerTitle: offer.title,
    validUntil: formattedDate,
    couponCode: offer.couponCode,
    consumerId: companyProfile.id,
  });

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrPayload)}`;

  return (
    <div className="container mx-auto max-w-lg py-6 sm:py-8">
      <header className="relative mb-8 flex items-center justify-center text-center">
        <Link href={`/business/${offer.companyId}`} className="absolute left-0">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground font-headline">
          Oferta Especial
        </h1>
      </header>
      
      {isExpired ? (
        <Card className="bg-card border-destructive/50">
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
            <h2 className="text-2xl font-semibold font-headline text-destructive">Oferta Expirada</h2>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Esta oferta não está mais disponível. Fique de olho para futuras promoções!
            </p>
             <Link href="/offers" className="mt-6">
                <Button variant="outline">
                    Ver outras ofertas
                </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
      <Card className="overflow-hidden bg-card">
        <CardHeader className="p-0 relative h-40 bg-gradient-to-br from-green-900/40 via-green-800/20 to-card flex items-center justify-center">
           <Gift className="h-20 w-20 text-yellow-400 drop-shadow-lg" strokeWidth={1.5} />
        </CardHeader>
        <CardContent className="p-6 space-y-6">
            <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
                    {offer.businessName}
                </p>
                <h2 className="text-3xl font-bold text-foreground font-headline mt-2">{offer.title}</h2>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                <div className="flex items-start gap-4">
                    <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0"/>
                    <div>
                        <p className="font-semibold">Validade</p>
                        <p className="text-muted-foreground text-sm">A promoção é válida até {formattedDate}</p>
                    </div>
                </div>
                <div className="flex items-start gap-4">
                    <Tag className="h-5 w-5 text-primary mt-1 flex-shrink-0"/>
                    <div>
                        <p className="font-semibold">Código do Cupom</p>
                        <p className="text-muted-foreground text-sm">Use o código abaixo para resgatar:</p>
                        <Badge className="mt-2 text-lg" variant="secondary">{offer.couponCode}</Badge>
                    </div>
                </div>
            </div>

            {/* Login Wall Logic */}
            <LoginModal 
              isOpen={isLoginModalOpen}
              onOpenChange={setIsLoginModalOpen}
              onLoginSuccess={handleLoginSuccess}
            />

            {/* QR Code Modal Trigger */}
            <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
                <DialogTrigger asChild>
                     <Button 
                      onClick={handleGenerateOffer} 
                      size="lg" 
                      className={cn(
                        "w-full h-12 text-lg font-bold transition-colors",
                        isLimitReached
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : "bg-lime-500 hover:bg-lime-600 text-black"
                      )}
                      disabled={isLimitReached}
                    >
                        {isLimitReached ? (
                          'Limite de uso atingido'
                        ) : (
                          <>
                            <QrCode className="mr-2 h-5 w-5"/>
                            Gerar Oferta
                          </>
                        )}
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-card border-border/50">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-bold font-headline">Sua Oferta Digital</DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground pt-2">
                            Apresente este QR Code no estabelecimento para validar sua oferta.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 flex flex-col items-center justify-center gap-6">
                        <div className="bg-white p-2 rounded-lg">
                           <Image
                            src={qrCodeUrl}
                            alt="QR Code da Oferta"
                            width={250}
                            height={250}
                           />
                        </div>
                        <div className="text-center text-sm">
                            <p className="font-bold">{offer.businessName}</p>
                            <p>{offer.title}</p>
                            <p className="text-muted-foreground">Válido até {formattedDate}</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleSaveToWallet} className="w-full h-12">
                            <Download className="mr-2 h-5 w-5"/>
                            Salvar no Wallet
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div>
                <h3 className="font-semibold mb-2">Descrição da Oferta</h3>
                <p className="text-sm text-muted-foreground">{offer.description}</p>
            </div>
            
            <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2"><FileText className="h-4 w-4"/> Termos e Condições</h3>
                <p className="text-xs text-muted-foreground">{offer.terms}</p>
            </div>

        </CardContent>
      </Card>
      )}
    </div>
  );
}
