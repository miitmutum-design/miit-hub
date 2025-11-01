import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import BottomNav from "@/components/common/BottomNav";
import { cn } from '@/lib/utils';
import { CompanyProvider } from '@/contexts/CompanyContext';
import { headers } from 'next/headers';
import React, { Suspense } from 'react';


export const metadata: Metadata = {
  title: 'Local Hub',
  description: 'Your guide to local businesses and offers.',
};

async function LayoutContent({ children }: { children: React.ReactNode }) {
    const headersList = headers();
    const pathname = headersList.get('x-pathname') || '';
    
    const showNav = !pathname.startsWith('/webview') && !pathname.startsWith('/admin');

    return (
        <div className="relative flex min-h-screen w-full flex-col">
            <main className={cn("flex-1", showNav && 'pb-20 md:pb-20')}>{children}</main>
            {showNav && <BottomNav />}
        </div>
    )
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1A1A18" />
      </head>
      <body className="font-body antialiased">
        <CompanyProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <LayoutContent>{children}</LayoutContent>
          </Suspense>
          <Toaster />
        </CompanyProvider>
      </body>
    </html>
  );
}
