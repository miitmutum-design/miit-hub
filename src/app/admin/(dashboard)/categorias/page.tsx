
'use client';
import {
  Shapes,
  PlusCircle,
  MoreHorizontal,
  Pencil,
  Trash2,
  Check,
  X,
  Search
} from 'lucide-react';
import AdminHeader from '@/components/common/AdminHeader';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useMemo } from 'react';
import { categorySuggestions, activeCategories as initialActiveCategories } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

type ActiveCategory = { name: string; count: number };

export default function AdminCategoriasPage() {
    const [activeCategories, setActiveCategories] = useState<ActiveCategory[]>(initialActiveCategories);
    const [suggestions, setSuggestions] = useState(categorySuggestions);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [categoryToEdit, setCategoryToEdit] = useState<ActiveCategory | null>(null);
    const [editedCategoryName, setEditedCategoryName] = useState('');

    const { toast } = useToast();

    const handleApprove = (suggestionName: string) => {
        if (!activeCategories.some(cat => cat.name.toLowerCase() === suggestionName.toLowerCase())) {
            setActiveCategories(prev => [...prev, { name: suggestionName, count: 0 }].sort((a, b) => a.name.localeCompare(b.name)));
        }
        setSuggestions(prev => prev.filter(s => s.name !== suggestionName));
        toast({
            title: 'Categoria Aprovada',
            description: `"${suggestionName}" agora é uma categoria ativa.`,
        });
    };

    const handleReject = (suggestionName: string) => {
        setSuggestions(prev => prev.filter(s => s.name !== suggestionName));
        toast({
            title: 'Sugestão Rejeitada',
            description: `A sugestão "${suggestionName}" foi removida.`,
            variant: 'destructive'
        });
    };
    
    const handleDeleteActive = (categoryName: string) => {
        setActiveCategories(prev => prev.filter(cat => cat.name !== categoryName));
         toast({
            title: 'Categoria Excluída',
            description: `A categoria "${categoryName}" foi removida da lista.`,
            variant: 'destructive'
        });
    };

    const handleAddCategory = () => {
        const trimmedName = newCategoryName.trim();
        if (!trimmedName) {
            toast({ variant: 'destructive', title: 'Nome inválido', description: 'O nome da categoria não pode estar vazio.'});
            return;
        }
        if (activeCategories.some(cat => cat.name.toLowerCase() === trimmedName.toLowerCase())) {
            toast({ variant: 'destructive', title: 'Categoria Duplicada', description: `A categoria "${trimmedName}" já existe.`});
            return;
        }
        setActiveCategories(prev => [...prev, { name: trimmedName, count: 0 }].sort((a, b) => a.name.localeCompare(b.name)));
        toast({ title: 'Categoria Adicionada', description: `"${trimmedName}" foi adicionada com sucesso.`});
        setNewCategoryName('');
        setIsAddModalOpen(false);
    };
    
    const handleEditCategory = () => {
        const trimmedName = editedCategoryName.trim();
        if (!categoryToEdit || !trimmedName) {
            toast({ variant: 'destructive', title: 'Nome inválido', description: 'O nome da categoria não pode estar vazio.'});
            return;
        }
        if (activeCategories.some(cat => cat.name.toLowerCase() === trimmedName.toLowerCase() && cat.name !== categoryToEdit.name)) {
            toast({ variant: 'destructive', title: 'Categoria Duplicada', description: `A categoria "${trimmedName}" já existe.`});
            return;
        }

        setActiveCategories(prev => prev.map(cat => cat.name === categoryToEdit.name ? { ...cat, name: trimmedName } : cat));
        toast({ title: 'Categoria Atualizada', description: 'O nome da categoria foi alterado com sucesso.' });
        setCategoryToEdit(null);
        setEditedCategoryName('');
        setIsEditModalOpen(false);
    }

    const openEditModal = (category: ActiveCategory) => {
        setCategoryToEdit(category);
        setEditedCategoryName(category.name);
        setIsEditModalOpen(true);
    }

    const filteredActiveCategories = useMemo(() => {
        if (!searchQuery) return activeCategories;
        return activeCategories.filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [searchQuery, activeCategories]);


  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <AdminHeader title="Gerenciar Categorias" />
      <div className="grid gap-4 md:grid-cols-2 md:gap-8">
        {suggestions.length > 0 && (
            <Card>
            <CardHeader>
                <CardTitle>Sugestões de Empresas</CardTitle>
                <CardDescription>
                Aprove ou rejeite as categorias sugeridas pelas empresas.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                {suggestions.map((suggestion) => (
                    <div
                    key={suggestion.name}
                    className="flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm"
                    >
                    <span className="font-medium">{suggestion.name}</span>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-green-500 hover:bg-green-500/10 hover:text-green-500" onClick={() => handleApprove(suggestion.name)}>
                            <Check className="h-4 w-4" />
                            <span className="sr-only">Aprovar</span>
                        </Button>
                         <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-500/10 hover:text-red-500" onClick={() => handleReject(suggestion.name)}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">Rejeitar</span>
                        </Button>
                    </div>
                    </div>
                ))}
                </div>
            </CardContent>
            </Card>
        )}

        <Card className={suggestions.length === 0 ? 'md:col-span-2' : ''}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Categorias Ativas</CardTitle>
                <CardDescription>
                Adicione, edite ou remova as categorias principais.
                </CardDescription>
            </div>
             <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                    <Button size="sm" className="gap-1 h-8">
                        <PlusCircle className="h-3.5 w-3.5" />
                        Adicionar Nova
                    </Button>
                </DialogTrigger>
                 <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar Nova Categoria</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="category-name">Nome da Categoria</Label>
                        <Input id="category-name" placeholder="Ex: Restaurante" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancelar</Button>
                        </DialogClose>
                        <Button type="button" onClick={handleAddCategory}>Salvar Categoria</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
             <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar categoria..."
                  className="w-full appearance-none bg-background pl-8 shadow-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            <div className="space-y-2">
                {filteredActiveCategories.map((category) => (
                    <div key={category.name} className="flex items-center justify-between rounded-lg border bg-card p-3 shadow-sm">
                        <div>
                            <span className="font-medium">{category.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">({category.count} empresas)</span>
                        </div>
                        <AlertDialog>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => openEditModal(category)}>
                                        <Pencil className="mr-2 h-4 w-4" />
                                        Editar
                                    </DropdownMenuItem>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive px-2 py-1.5 h-auto font-normal relative items-center rounded-sm flex cursor-default select-none text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Excluir
                                        </Button>
                                    </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                             <AlertDialogContent>
                                <AlertDialogHeader>
                                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Excluir a categoria "{category.name}" afetará as empresas que a utilizam. Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteActive(category.name)} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

       <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Categoria</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Label htmlFor="edit-category-name">Nome da Categoria</Label>
                    <Input id="edit-category-name" value={editedCategoryName} onChange={(e) => setEditedCategoryName(e.target.value)} />
                </div>
                <DialogFooter>
                    <Button type="button" variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                    <Button type="button" onClick={handleEditCategory}>Salvar Alterações</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    </main>
  );
}
