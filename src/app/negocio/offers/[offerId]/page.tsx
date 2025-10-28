import { ArrowLeft, Clock, Gift, Tag, FileText, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data - in a real app, you'd fetch this based on offerId
const mockOfferDetails = {
    id: '1',
    businessName: 'Flor de Lótus Móveis',
    title: '50% OFF em Sofás Selecionados',
    validUntil: '31/12/2024',
    discount: '50%',
    description: 'Aproveite 50% de desconto em nossa linha de sofás de 3 e 4 lugares. Perfeito para renovar sua sala com estilo e conforto. Promoção não cumulativa e válida enquanto durar o estoque.',
    couponCode: 'SOFANOVO50',
    terms: 'Válido apenas para sofás selecionados. Desconto não aplicável a outros itens. Necessário apresentar o código no caixa.',
};

export default function OfferDetailPage({ params }: { params: { offerId: string } }) {
  const offer = mockOfferDetails; // Using mock data

  return (
    <div className="container mx-auto max-w-lg py-6 sm:py-8">
      <header className="relative mb-8 flex items-center justify-center text-center">
        <Link href="/offers" className="absolute left-0">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground font-headline">
          Oferta Especial
        </h1>
      </header>

      <Card className="overflow-hidden bg-card">
        <CardHeader className="p-0 relative h-40 bg-gradient-to-br from-green-900/40 via-green-800/20 to-card flex items-center justify-center">
           <Gift className="h-20 w-20 text-yellow-400 drop-shadow-lg" strokeWidth={1.5} />
        </CardHeader>
        <CardContent className="p-6 space-y-6">
            <div className="text-center">
                <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
                    <Building className="h-4 w-4"/>
                    {offer.businessName}
                </p>
                <h2 className="text-3xl font-bold text-foreground font-headline mt-2">{offer.title}</h2>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                <div className="flex items-start gap-4">
                    <Clock className="h-5 w-5 text-primary mt-1 flex-shrink-0"/>
                    <div>
                        <p className="font-semibold">Validade</p>
                        <p className="text-muted-foreground text-sm">A promoção é válida até {offer.validUntil}.</p>
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
    </div>
  );
}
