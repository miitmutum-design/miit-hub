'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TermsOfUsePage() {
  return (
    <div 
        className="container mx-auto max-w-lg py-6 sm:py-8"
        onContextMenu={(e) => e.preventDefault()}
    >
      <header className="relative mb-8 flex items-center justify-center text-center">
        <Link href="/account/profile/config" className="absolute left-0">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-foreground font-headline">
          Termos de Uso
        </h1>
      </header>

      <div className="bg-card p-6 rounded-lg max-h-[70vh] overflow-y-auto select-none">
        <div className="space-y-4 text-sm text-muted-foreground">
          <h2 className="text-lg font-semibold text-foreground">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar e usar este aplicativo ("Serviço"), você aceita e concorda em estar vinculado pelos termos e disposições deste acordo. Além disso, ao usar estes serviços particulares, você estará sujeito a quaisquer diretrizes ou regras publicadas aplicáveis a tais serviços.
          </p>

          <h2 className="text-lg font-semibold text-foreground">2. Descrição do Serviço</h2>
          <p>
            O nosso Serviço oferece uma plataforma para descobrir e interagir com negócios locais, incluindo acesso a ofertas e eventos. O Serviço é fornecido "como está" e não assumimos qualquer responsabilidade pela pontualidade, exclusão, falha na entrega ou falha no armazenamento de quaisquer comunicações do usuário ou configurações de personalização.
          </p>

          <h2 className="text-lg font-semibold text-foreground">3. Política de Privacidade</h2>
          <p>
            Os dados de registro e outras informações sobre você estão sujeitos à nossa Política de Privacidade. Você entende que, através do seu uso do Serviço, você consente com a coleta e uso (conforme estabelecido na Política de Privacidade) dessas informações.
          </p>
          
          <h2 className="text-lg font-semibold text-foreground">4. Conduta do Usuário</h2>
          <p>
            Você concorda em não usar o Serviço para: carregar, postar, enviar por e-mail, transmitir ou de outra forma disponibilizar qualquer conteúdo que seja ilegal, prejudicial, ameaçador, abusivo, assediador, tortuoso, difamatório, vulgar, obsceno, calunioso, invasivo da privacidade de outrem, odioso ou racial, etnicamente ou de outra forma censurável.
          </p>

          <h2 className="text-lg font-semibold text-foreground">5. Modificações no Serviço</h2>
          <p>
            Reservamo-nos o direito de, a qualquer momento, modificar ou descontinuar, temporária ou permanentemente, o Serviço (ou qualquer parte dele) com ou sem aviso prévio. Você concorda que não seremos responsáveis perante você ou terceiros por qualquer modificação, suspensão ou descontinuação do Serviço.
          </p>

           <h2 className="text-lg font-semibold text-foreground">6. Direitos de Propriedade Intelectual</h2>
          <p>
            Todo o conteúdo presente neste aplicativo, incluindo, mas não se limitando a, textos, gráficos, logotipos, ícones, imagens, clipes de áudio, downloads digitais, compilações de dados e software, é propriedade exclusiva da nossa empresa ou de seus fornecedores de conteúdo e protegido pelas leis de direitos autorais internacionais. A compilação de todo o conteúdo deste site é propriedade exclusiva da nossa empresa.
          </p>

           <h2 className="text-lg font-semibold text-foreground">7. Limitação de Responsabilidade</h2>
          <p>
            Em nenhuma circunstância seremos responsáveis por quaisquer danos diretos, indiretos, incidentais, especiais, consequenciais ou exemplares, incluindo, mas não se limitando a, danos por perda de lucros, boa vontade, uso, dados ou outras perdas intangíveis, resultantes do uso ou da incapacidade de usar o serviço.
          </p>

          <p className="pt-4 text-center text-xs">
            Última atualização: 25 de Julho de 2024.
          </p>
        </div>
      </div>
    </div>
  );
}
