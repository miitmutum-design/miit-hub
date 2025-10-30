
'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


const faqItems = [
  {
    question: 'Como edito o perfil da minha empresa?',
    answer:
      "No menu 'Conta', clique em 'Meu Perfil'. Lá você poderá editar todas as informações da sua empresa, como nome, endereço, horário de funcionamento, fotos e descrição.",
  },
  {
    question: 'Como crio uma nova oferta ou cupom?',
    answer:
      "Vá para 'Conta' > 'Configurações' > 'Ofertas'. Clique em 'Criar Nova Oferta' e preencha os detalhes como título, valor do desconto, datas de validade e gere um código de cupom. Você também pode usar a IA para gerar descrições atrativas.",
  },
  {
    question: 'Onde vejo as avaliações que minha empresa recebeu?',
    answer:
      "Em 'Conta' > 'Configurações', clique em 'Avaliações'. Todas as avaliações enviadas pelos clientes aparecerão nessa tela para você acompanhar o feedback.",
  },
    {
    question: 'O que são os "Tokens" e como posso usá-los?',
    answer:
      "Tokens são créditos usados para acessar funcionalidades de Inteligência Artificial, como a geração de descrições, termos de busca ou códigos de cupom. Você pode adquirir mais tokens na tela de 'Assinatura'.",
  },
    {
    question: 'Como pauso a visibilidade da minha empresa temporariamente?',
    answer:
      "Na tela principal de 'Minha Conta', você encontrará a seção 'Visibilidade da Empresa'. Selecione a opção 'Sempre Fechado' para pausar manualmente a aparição da sua empresa nas buscas. Para reativar, basta selecionar 'Automático' ou 'Sempre Aberto'.",
  },
];


export default function CompanySupportPage() {
  return (
    <div className="container mx-auto max-w-lg py-6 sm:py-8">
      <header className="relative mb-8 flex items-center justify-center text-center">
        <Link href="/account/profile/config" className="absolute left-0">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground font-headline">
          Suporte
        </h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Perguntas Frequentes (FAQ)</CardTitle>
          <CardDescription>
            Encontre respostas para as dúvidas mais comuns sobre a gestão do seu perfil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
