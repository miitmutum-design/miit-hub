
'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, ExternalLink, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

function WebViewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get('url');

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <ShieldX className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold font-headline">URL Inválida</h2>
        <p className="text-muted-foreground mt-2">A URL para visualização não foi fornecida.</p>
        <Button onClick={() => router.back()} className="mt-6">Voltar</Button>
      </div>
    );
  }

  const decodedUrl = decodeURIComponent(url);

  // Simple validation
  if (!decodedUrl.startsWith('http://') && !decodedUrl.startsWith('https://')) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <ShieldX className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold font-headline">URL Malformada</h2>
        <p className="text-muted-foreground mt-2">A URL fornecida não é válida.</p>
        <Button onClick={() => router.back()} className="mt-6">Voltar</Button>
      </div>
    );
  }
  
  const handleRefresh = () => {
    const iframe = document.getElementById('webview-iframe') as HTMLIFrameElement;
    if (iframe) {
        iframe.src = iframe.src;
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-background">
      <header className="flex h-16 items-center justify-between border-b border-border/50 px-4 flex-shrink-0">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
          <span className="sr-only">Voltar</span>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleRefresh}>
            <RefreshCw />
             <span className="sr-only">Recarregar</span>
          </Button>
          <a href={decodedUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon">
              <ExternalLink />
              <span className="sr-only">Abrir no navegador</span>
            </Button>
          </a>
        </div>
      </header>
      <iframe
        id="webview-iframe"
        src={decodedUrl}
        className="w-full h-full border-none"
        title="WebView"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
}


export default function WebViewPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center h-screen">Carregando...</div>}>
            <WebViewContent />
        </Suspense>
    )
}
