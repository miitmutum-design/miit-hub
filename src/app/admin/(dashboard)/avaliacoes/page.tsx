
'use client';
import {
  ListFilter,
  MoreHorizontal,
  Search,
  Star as StarIcon,
  Trash2,
  Building2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminHeader from '@/components/common/AdminHeader';
import { Button } from '@/components/ui/button';
import { adminReviews } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useState, useMemo } from 'react';

type TabValue = "todas" | "5" | "4" | "3" | "2" | "1";
type SortOrder = "desc" | "asc";

export default function AdminAvaliacoesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<TabValue>('todas');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const filteredAndSortedReviews = useMemo(() => {
        let reviews = [...adminReviews];

        // Filter by rating based on active tab
        if (activeTab !== 'todas') {
            const rating = parseInt(activeTab, 10);
            reviews = reviews.filter(review => review.rating === rating);
        }

        // Filter by search query
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            reviews = reviews.filter(review => 
                review.userName.toLowerCase().includes(lowerCaseQuery) ||
                review.companyName.toLowerCase().includes(lowerCaseQuery) ||
                review.comment.toLowerCase().includes(lowerCaseQuery)
            );
        }

        // Sort by date based on sortOrder
        reviews.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            if (sortOrder === 'desc') {
                return dateB - dateA;
            }
            return dateA - dateB;
        });

        return reviews;
    }, [searchQuery, activeTab, sortOrder]);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <AdminHeader title="Moderar Avaliações" />
      <Tabs defaultValue="todas" onValueChange={(value) => setActiveTab(value as TabValue)}>
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="5">5 estrelas</TabsTrigger>
            <TabsTrigger value="4">4 estrelas</TabsTrigger>
            <TabsTrigger value="3">3 estrelas</TabsTrigger>
            <TabsTrigger value="2">2 estrelas</TabsTrigger>
            <TabsTrigger value="1">1 estrela</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Ordenar
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={sortOrder} onValueChange={(value) => setSortOrder(value as SortOrder)}>
                    <DropdownMenuRadioItem value="desc">Mais Recentes</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="asc">Mais Antigas</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Card className="mt-4">
            <CardHeader>
                <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por empresa, usuário ou comentário..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {filteredAndSortedReviews.map((review) => (
                        <Card key={review.id} className="bg-muted/30">
                            <CardContent className="p-4 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
                                <div className="flex gap-4">
                                    <Avatar>
                                        <AvatarImage src={review.userAvatar} alt={review.userName} />
                                        <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className='flex items-center gap-2'>
                                                <span className="font-semibold">{review.userName}</span>
                                                <span className='text-muted-foreground text-xs'>em</span>
                                                <Link href="#" className="font-semibold text-primary hover:underline text-sm">{review.companyName}</Link>
                                            </div>
                                             <div className="flex items-center gap-1 text-yellow-400">
                                                <StarIcon className="h-4 w-4 fill-current" />
                                                <span className="font-semibold text-foreground">{review.rating.toFixed(1)}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                                        <p className="text-xs text-muted-foreground mt-3">{new Date(review.date).toLocaleDateString('pt-BR', {day: '2-digit', month: '2-digit', year: 'numeric'})}</p>
                                    </div>
                                </div>
                                <div className="flex md:flex-col items-center justify-end md:justify-start gap-2">
                                     <AlertDialog>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                aria-haspopup="true"
                                                size="icon"
                                                variant="ghost"
                                                >
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                <DropdownMenuItem>
                                                    <Building2 className='mr-2'/>
                                                    Ver Empresa
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator/>
                                                 <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive px-2 py-1.5 h-auto font-normal relative items-center rounded-sm flex cursor-default select-none text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                                        <Trash2 className="mr-2"/>
                                                        Excluir
                                                    </Button>
                                                </AlertDialogTrigger>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta ação não pode ser desfeita. Isso excluirá permanentemente a avaliação de "{review.userName}".
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
      </Tabs>
    </main>
  );
}
