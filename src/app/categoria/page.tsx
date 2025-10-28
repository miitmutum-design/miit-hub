import { ArrowLeft, Car, HeartPulse, Home, Laptop, Book, Sparkles, Utensils, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const categories = [
  { name: 'Saúde', count: 12, icon: HeartPulse, href: '/servicos' },
  { name: 'Imobiliária', count: 8, icon: Home, href: '/servicos' },
  { name: 'Alimentação', count: 24, icon: Utensils, href: '/servicos' },
  { name: 'Serviços', count: 18, icon: Wrench, href: '/servicos' },
  { name: 'Educação', count: 7, icon: Book, href: '/servicos' },
  { name: 'Beleza', count: 15, icon: Sparkles, href: '/servicos' },
  { name: 'Automotivo', count: 11, icon: Car, href: '/servicos' },
  { name: 'Tecnologia', count: 9, icon: Laptop, href: '/servicos' },
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto max-w-3xl py-6 sm:py-8">
      <header className="relative mb-8 flex items-center justify-center text-center">
        <Link href="/" className="absolute left-0">
          <Button variant="ghost" size="icon">
            <ArrowLeft />
            <span className="sr-only">Voltar</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-primary font-headline">
          Todas as Categorias
        </h1>
      </header>

      <section>
        <div className="grid grid-cols-2 gap-4">
          {categories.map((category) => (
            <Link key={category.name} href={category.href} className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg">
              <Card
                className="group h-full cursor-pointer overflow-hidden text-center transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50 bg-card"
              >
                <CardContent className="flex flex-col items-center justify-center p-6 gap-3">
                  <div className="bg-primary/10 p-4 rounded-lg">
                      <category.icon className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                  </div>
                  <div className="flex flex-col">
                    <p className="font-bold text-lg font-headline text-foreground">
                      {category.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {category.count} empresas
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
