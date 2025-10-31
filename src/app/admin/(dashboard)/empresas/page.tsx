
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
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { adminCompanies } from '@/lib/data';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
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

export default function AdminEmpresasPage() {
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isKeyModalOpen) {
      generateAccessKey();
    }
  }, [isKeyModalOpen]);

  const generateAccessKey = () => {
    setIsGenerating(true);
    // In a real app, you'd check for uniqueness in the database.
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(accessKey).then(
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
    // In a real app, this would create a new company document in Firestore
    // with a 'pending' status and associate the generated key with it.
    const newCompanyId = `new-${Date.now()}`;
    console.log(
      `Creating new company with ID: ${newCompanyId} and key: ${accessKey}`
    );
    setIsKeyModalOpen(false);
    router.push(`/admin/empresas/editar/${newCompanyId}`);
  };

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
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
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
                          onClick={copyToClipboard}
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
            <Card>
              <CardHeader>
                <CardTitle>Empresas</CardTitle>
                <CardDescription>
                  Gerencie as empresas cadastradas.
                </CardDescription>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Buscar por nome ou email..."
                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome da Empresa</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ativo no PWA</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
                      <TableHead>
                        <span className="sr-only">Ações</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminCompanies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">
                          {company.name}
                        </TableCell>
                        <TableCell>{company.category}</TableCell>
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
                                : 'bg-orange-600/20 text-orange-400 border-none'
                            }
                          >
                            {company.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Switch defaultChecked={company.isActive} />
                        </TableCell>
                        <TableCell>{company.joinDate}</TableCell>
                        <TableCell>
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
                              <DropdownMenuItem>Aprovar</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Mostrando <strong>1-10</strong> de{' '}
                  <strong>{adminCompanies.length}</strong> empresas
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="pendentes">
            <Card>
              <CardHeader>
                <CardTitle>Empresas Pendentes</CardTitle>
                <CardDescription>
                  Empresas aguardando sua aprovação.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome da Empresa</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
                      <TableHead>
                        <span className="sr-only">Ações</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminCompanies
                      .filter((c) => c.status === 'Pendente')
                      .map((company) => (
                        <TableRow key={company.id}>
                          <TableCell className="font-medium">
                            {company.name}
                          </TableCell>
                          <TableCell>{company.category}</TableCell>
                          <TableCell>{company.joinDate}</TableCell>
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
                                    <Link href={`/admin/empresas/editar/${company.id}`}>
                                      <DropdownMenuItem>Ver Detalhes</DropdownMenuItem>
                                    </Link>
                                    <DropdownMenuItem>Aprovar</DropdownMenuItem>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive px-2 py-1.5 h-auto font-normal relative items-center rounded-sm flex cursor-default select-none text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">Excluir</Button>
                                    </AlertDialogTrigger>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta ação não pode ser desfeita. Isso excluirá permanentemente os dados pendentes de "{company.name}".
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <div className="text-xs text-muted-foreground">
                  Total de{' '}
                  <strong>
                    {adminCompanies.filter((c) => c.status === 'Pendente')
                      .length}
                  </strong>{' '}
                  empresas pendentes.
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
