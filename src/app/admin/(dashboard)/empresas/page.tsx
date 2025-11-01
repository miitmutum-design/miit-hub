
'use client';
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Search,
  Copy,
  ArrowRight,
  Loader2,
  RefreshCw,
  Shapes,
  ArrowUpDown,
  CircleDollarSign,
  FileSignature,
  HelpCircle,
  Shield,
  Crown,
  Trash2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import AdminHeader from '@/components/common/AdminHeader';
import { Button } from '@/components/ui/button';
import { adminCompanies as initialAdminCompanies, categories } from '@/lib/data';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';

type CompanyStatus = 'Aprovada' | 'Pendente';
type SortKey = 'name' | 'joinDate';

export default function AdminEmpresasPage() {
  const [adminCompanies, setAdminCompanies] = useState(initialAdminCompanies);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [activeCategories, setActiveCategories] = useState(categories.map(c => c.name));
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'ascending' | 'descending' }>({ key: 'joinDate', direction: 'descending' });


  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isKeyModalOpen) {
      generateAccessKey();
    }
  }, [isKeyModalOpen]);

  const generateAccessKey = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
      let key = '';
      for (let i = 0; i < 12; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      const formattedKey = `${key.slice(0, 4)}-${key.slice(
        4,
        8
      )}-${key.slice(8, 12)}`;
      setAccessKey(formattedKey);
      setIsGenerating(false);
    }, 500);
  };
  
  const handleRegenerateKey = (companyId: string) => {
    const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    let key = '';
    for (let i = 0; i < 12; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const newKey = `${key.slice(0, 4)}-${key.slice(
      4,
      8
    )}-${key.slice(8, 12)}`;

    setAdminCompanies(prevCompanies => 
        prevCompanies.map(c => c.id === companyId ? {...c, accessKey: newKey} : c)
    );

    toast({
        title: "Chave Regenerada!",
        description: `Nova chave de acesso gerada para a empresa.`,
    });
  }

  const copyToClipboard = (keyToCopy: string) => {
    navigator.clipboard.writeText(keyToCopy).then(
      () => {
        toast({
          title: 'Chave Copiada!',
          description: 'A chave de acesso foi copiada para sua área de transferência.',
        });
      },
      (err) => {
        toast({
          variant: 'destructive',
          title: 'Falha ao copiar',
          description: 'Não foi possível copiar a chave.',
        });
      }
    );
  };

  const handleContinueToRegistration = () => {
    const newCompanyId = `new-${Date.now()}`;
    console.log(
      `Creating new company with ID: ${newCompanyId} and key: ${accessKey}`
    );
    setIsKeyModalOpen(false);
    router.push(`/admin/empresas/editar/${newCompanyId}`);
  };

  const handleApprove = (companyId: string) => {
    setAdminCompanies(prev => prev.map(c => c.id === companyId ? { ...c, status: 'Aprovada' as CompanyStatus } : c));
    toast({ title: "Empresa Aprovada!", description: "A empresa agora está visível no aplicativo." });
  };
  
  const handleDelete = (companyId: string) => {
    setAdminCompanies(prev => prev.filter(c => c.id !== companyId));
    toast({ title: "Empresa Excluída", variant: "destructive" });
  };

  const handleAddNewCategory = () => {
    if (newCategoryName.trim() === '') {
        toast({ variant: "destructive", title: "Nome inválido", description: "O nome da categoria não pode estar vazio." });
        return;
    }
    if (!activeCategories.find(cat => cat.toLowerCase() === newCategoryName.toLowerCase())) {
        setActiveCategories(prev => [...prev, newCategoryName]);
        toast({ title: "Categoria Adicionada", description: `"${newCategoryName}" foi adicionada à lista.` });
    }
    setNewCategoryName('');
    setIsAddCategoryModalOpen(false);
  }

  const requestSort = (key: SortKey) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  const handleActivationToggle = (companyId: string, isActive: boolean) => {
      setAdminCompanies(prev => prev.map(c => c.id === companyId ? { ...c, isActive } : c));
      toast({
          title: `Empresa ${isActive ? 'ativada' : 'desativada'}`,
          description: `A visibilidade da empresa no PWA foi atualizada.`
      });
  };

  const filteredCompanies = useMemo(() => {
    return adminCompanies.filter(company => {
        if (categoryFilter === 'Todas') return true;
        return company.category === categoryFilter;
    });
  }, [adminCompanies, categoryFilter]);

  const sortedCompanies = useMemo(() => {
    let sortableItems = [...filteredCompanies];
    if (sortConfig.key) {
        sortableItems.sort((a, b) => {
            if (sortConfig.key === 'name') {
                 if (a.name < b.name) return sortConfig.direction === 'ascending' ? -1 : 1;
                 if (a.name > b.name) return sortConfig.direction === 'ascending' ? 1 : -1;
            } else if (sortConfig.key === 'joinDate') {
                 if (new Date(a.joinDate) < new Date(b.joinDate)) return sortConfig.direction === 'ascending' ? -1 : 1;
                 if (new Date(a.joinDate) > new Date(b.joinDate)) return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    }
    return sortableItems;
  }, [filteredCompanies, sortConfig]);

  const CompaniesTable = ({ companies }: { companies: typeof initialAdminCompanies }) => (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('name')}>
                    Nome da Empresa
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  Categoria
                  <Dialog open={isAddCategoryModalOpen} onOpenChange={setIsAddCategoryModalOpen}>
                      <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 text-lime-400">
                              <PlusCircle className="h-4 w-4" />
                          </Button>
                      </DialogTrigger>
                      <DialogContent>
                          <DialogHeader>
                              <DialogTitle>Adicionar Nova Categoria</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                              <Label htmlFor="category-name">Nome da Categoria</Label>
                              <Input id="category-name" placeholder="Ex: Restaurante" value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
                          </div>
                          <DialogFooter>
                              <DialogClose asChild>
                                  <Button type="button" variant="secondary">Cancelar</Button>
                              </DialogClose>
                              <Button type="button" onClick={handleAddNewCategory}>Salvar Categoria</Button>
                          </DialogFooter>
                      </DialogContent>
                  </Dialog>
                  <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5">
                              <ListFilter className="h-4 w-4" />
                          </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                          <DropdownMenuLabel>Filtrar Categoria</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuCheckboxItem checked={categoryFilter === 'Todas'} onSelect={() => setCategoryFilter('Todas')}>Todas as Categorias</DropdownMenuCheckboxItem>
                          {activeCategories.map(cat => (
                              <DropdownMenuCheckboxItem key={cat} checked={categoryFilter === cat} onSelect={() => setCategoryFilter(cat)}>{cat}</DropdownMenuCheckboxItem>
                          ))}
                      </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => requestSort('joinDate')}>
                    Data de Cadastro
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Chave de Acesso</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ativo no PWA</TableHead>
              <TableHead>
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => {
                const isPaid = company.paymentStatus === 'Plano Prata PAGO' || company.paymentStatus === 'Plano Gold PAGO';
                const isToggleDisabled = company.status === 'Pendente' || isPaid;
                const isToggleOn = isPaid || company.isActive;

                const isPendingApproval = isPaid && company.status === 'Pendente';
                const isPendingPayment = company.status === 'Aprovada' && !isPaid;
                const isColdLead = company.status === 'Pendente' && !isPaid;

              return (
              <TableRow key={company.id}>
                <TableCell className="font-medium">
                  {company.name}
                </TableCell>
                <TableCell>{company.category}</TableCell>
                <TableCell>{company.joinDate}</TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">{company.accessKey}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(company.accessKey)}>
                            <Copy className="h-4 w-4"/>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleRegenerateKey(company.id)}>
                            <RefreshCw className="h-4 w-4 text-lime-400"/>
                        </Button>
                    </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      company.status === 'Aprovada'
                        ? 'default'
                        : 'destructive'
                    }
                    className={
                      company.status === 'Aprovada'
                        ? 'bg-lime-500/20 text-lime-300 border-lime-400/20'
                        : 'bg-orange-600/20 text-orange-400 border-none flex items-center gap-1.5'
                    }
                  >
                    {isPendingApproval && <FileSignature className="h-3 w-3" />}
                    {isPendingPayment && <CircleDollarSign className="h-3 w-3" />}
                    {isColdLead && <HelpCircle className="h-3 w-3" />}
                    {company.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Switch
                        checked={isToggleOn}
                        onCheckedChange={(checked) => handleActivationToggle(company.id, checked)}
                        disabled={isToggleDisabled}
                    />
                    {isPaid && <CircleDollarSign className="h-4 w-4 text-yellow-400" />}
                  </div>
                </TableCell>
                <TableCell>
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
                           <Link href={`/admin/empresas/editar/${company.id}`}><DropdownMenuItem>Ver Detalhes</DropdownMenuItem></Link>
                           {company.status === 'Pendente' && <DropdownMenuItem onClick={() => handleApprove(company.id)}>Aprovar</DropdownMenuItem>}
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive px-2 py-1.5 h-auto font-normal relative items-center rounded-sm flex cursor-default select-none text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Excluir
                            </Button>
                          </AlertDialogTrigger>
                        </DropdownMenuContent>
                      </DropdownMenu>
                       <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta ação não pode ser desfeita. Isso excluirá permanentemente a empresa e todos os seus dados.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(company.id)} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Mostrando <strong>1-{companies.length}</strong> de{' '}
          <strong>{companies.length}</strong> empresas
        </div>
      </CardFooter>
    </Card>
  );
  
  const allTabCompanies = sortedCompanies;
  const approvedCompanies = sortedCompanies.filter(c => c.status === 'Aprovada');
  const pendingCompanies = sortedCompanies.filter(c => c.status === 'Pendente');


  return (
    <>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
        <AdminHeader title="Gerenciar Empresas" />
        <Tabs defaultValue="pendentes">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="aprovadas">Aprovadas</TabsTrigger>
              <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
            </TabsList>
            <div className="ml-auto flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1">
                    <ListFilter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Filtro
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                  <DropdownMenuItem>Ativo</DropdownMenuItem>
                  <DropdownMenuItem>Inativo</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="sm" variant="outline" className="h-8 gap-1">
                <File className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-rap">
                  Exportar
                </span>
              </Button>
              <Dialog open={isKeyModalOpen} onOpenChange={setIsKeyModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add Empresa
                    </span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Gerar Chave de Acesso</DialogTitle>
                    <DialogDescription>
                      Copie esta chave e envie para a empresa. Ela usará esta chave para acessar o painel pela primeira vez.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <label
                      htmlFor="access-key"
                      className="text-sm font-medium text-muted-foreground"
                    >
                      Chave de Acesso
                    </label>
                    <div className="relative mt-2">
                      <Input
                        id="access-key"
                        readOnly
                        value={isGenerating ? 'Gerando...' : accessKey}
                        className="h-12 pr-12 text-center text-lg tracking-widest"
                      />
                      {isGenerating ? (
                        <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin" />
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 h-9 w-9 -translate-y-1/2"
                          onClick={() => copyToClipboard(accessKey)}
                        >
                          <Copy className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleContinueToRegistration}
                      disabled={isGenerating}
                      className="w-full"
                    >
                      Continuar para Cadastro
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <TabsContent value="todas">
            <CompaniesTable companies={allTabCompanies} />
          </TabsContent>
          <TabsContent value="aprovadas">
            <CompaniesTable companies={approvedCompanies} />
          </TabsContent>
          <TabsContent value="pendentes">
            <CompaniesTable companies={pendingCompanies} />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
