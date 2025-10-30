
'use client';

import AdminHeader from '@/components/common/AdminHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    question: 'Como aprovo ou rejeito uma nova empresa?',
    answer:
      "Vá para a seção 'Empresas' no menu lateral. Na aba 'Pendentes', você encontrará a lista de empresas aguardando aprovação. Use os botões na coluna 'Ações' para aprovar ou visualizar os detalhes antes de tomar uma decisão.",
  },
  {
    question: 'Onde posso moderar as avaliações dos usuários?',
    answer:
      "A seção 'Avaliações' é dedicada a isso. Você pode filtrar por nota (ex: 1 estrela) para encontrar rapidamente feedbacks negativos, ler os comentários e decidir se uma avaliação deve ser excluída por violar os termos de uso.",
  },
  {
    question: 'Uma empresa sugeriu uma categoria que não existe. O que eu faço?',
    answer:
      "Na seção 'Categorias', você verá a lista de 'Sugestões de Empresas'. Você pode aprovar a sugestão para adicioná-la à lista de categorias ativas, ou rejeitá-la se não for relevante.",
  },
    {
    question: 'Como posso desativar temporariamente uma empresa sem excluí-la?',
    answer:
      "Na tela 'Empresas', encontre a empresa na lista e use o interruptor (switch) na coluna 'Ativo no PWA'. Desativá-lo tornará a empresa invisível para os usuários, mas manterá todos os seus dados no sistema.",
  },
    {
    question: 'Posso editar as informações de uma empresa após ela ser aprovada?',
    answer:
      "Sim. Na seção 'Empresas', clique em 'Ver Detalhes' na empresa desejada. Isso abrirá uma tela onde você poderá editar todas as informações do perfil, como nome, endereço, categoria, etc.",
  },
];

export default function AdminSuportePage() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <AdminHeader title="Suporte e Ajuda" />
      <Card>
        <CardHeader>
          <CardTitle>Perguntas Frequentes (FAQ)</CardTitle>
          <CardDescription>
            Encontre respostas para as dúvidas mais comuns sobre o gerenciamento
            da plataforma.
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
    </main>
  );
}
