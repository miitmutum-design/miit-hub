
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Ticket, User, Shapes, Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCompany } from '@/contexts/CompanyContext';
import { useState } from 'react';
import LoginModal from './LoginModal';


export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { companyProfile } = useCompany();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const isCompany = companyProfile.userType === 'Company';
  const isUserAuthenticated = companyProfile.id !== 'user-demo';

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/categoria', icon: Shapes, label: 'Categorias' },
    { href: '/offers', icon: Ticket, label: 'Ofertas' },
    { 
      href: '/account', 
      icon: isCompany ? Building : User, 
      label: isCompany ? 'Empresa' : 'Conta' 
    },
  ];

  const handleAccountClick = (e: React.MouseEvent, href: string) => {
    if (!isUserAuthenticated && (href === '/account')) {
      e.preventDefault();
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    router.push('/account');
  };

  return (
    <>
      <LoginModal 
        isOpen={isLoginModalOpen}
        onOpenChange={setIsLoginModalOpen}
        onLoginSuccess={handleLoginSuccess}
      />
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-md items-center justify-around px-4">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href) && (item.href !== '/' || pathname === '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleAccountClick(e, item.href)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary focus:text-primary focus:outline-none',
                  isActive && 'text-primary'
                )}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
