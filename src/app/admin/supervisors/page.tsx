'use client';
import { useUser, useFirestore, useCollection } from '@/firebase';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { doc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Trash2, UserPlus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'operator' | 'supervisor' | 'admin';
  status: 'active' | 'inactive';
}

export default function SupervisorsPage() {
    const { user, initialising: userInitialising } = useUser();
    const { data: users, loading: usersLoading } = useCollection<AppUser>('users');
    const { toast } = useToast();
    const firestore = useFirestore();
    
    const [isAddSupervisorDialogOpen, setIsAddSupervisorDialogOpen] = useState(false);
    const [operatorToPromote, setOperatorToPromote] = useState('');
    const [newSupervisorName, setNewSupervisorName] = useState('');
    const [supervisorToDelete, setSupervisorToDelete] = useState<AppUser | null>(null);

    const handleStatusChange = async (userId: string, status: boolean) => {
        if (!firestore) return;
        const userDocRef = doc(firestore, 'users', userId);
        try {
            await updateDoc(userDocRef, { status: status ? 'active' : 'inactive' });
            toast({ title: 'Sucesso', description: `Status do usuário atualizado.` });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erro', description: error.message });
        }
    };
    
    const handleAddSupervisor = async () => {
        if (!firestore || !operatorToPromote) {
            toast({ variant: 'destructive', title: 'Erro', description: 'Por favor, selecione um operador.' });
            return;
        }

        const userDocRef = doc(firestore, 'users', operatorToPromote);
        const userToPromoteData = users?.find(u => u.id === operatorToPromote);

        try {
            const updateData: { role: string; name?: string } = { role: 'supervisor' };
            if (newSupervisorName.trim()) {
                updateData.name = newSupervisorName.trim();
            }

            await updateDoc(userDocRef, updateData);
            
            const finalName = newSupervisorName.trim() || userToPromoteData?.name || 'Usuário';

            toast({ title: 'Sucesso', description: `${finalName} promovido a supervisor.` });
            setIsAddSupervisorDialogOpen(false);
            setOperatorToPromote('');
            setNewSupervisorName('');

        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erro ao promover usuário', description: error.message });
        }
    };

    const handleDeleteSupervisor = async () => {
        if (!firestore || !supervisorToDelete) return;

        const userDocRef = doc(firestore, 'users', supervisorToDelete.id);
        try {
            await updateDoc(userDocRef, { role: 'operator' });
            // Remove supervisorId from operators assigned to this supervisor
            const operatorsQuery = query(collection(firestore, 'users'), where('supervisorId', '==', supervisorToDelete.id));
            const querySnapshot = await getDocs(operatorsQuery);
            const batch = [];
            querySnapshot.forEach((operatorDoc) => {
                batch.push(updateDoc(doc(firestore, 'users', operatorDoc.id), { supervisorId: null }));
            });
            await Promise.all(batch);

            toast({ title: 'Sucesso', description: `Supervisor ${supervisorToDelete.name} rebaixado para operador.` });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erro', description: error.message });
        }
        setSupervisorToDelete(null);
    };

    if (userInitialising || usersLoading) {
        return <div className="flex h-screen items-center justify-center">Carregando...</div>;
    }

    const supervisors = users?.filter(u => u.role === 'supervisor') || [];
    const operators = users?.filter(u => u.role === 'operator') || [];

    return (
        <div className="space-y-8">
            <Button asChild variant="ghost" className="mb-4 pl-0">
                <Link href="/admin">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para o Painel do Administrador
                </Link>
            </Button>
            
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Gerenciamento de Supervisores</CardTitle>
                        <CardDescription>Adicione, remova e gerencie os supervisores do sistema.</CardDescription>
                    </div>
                    <Dialog open={isAddSupervisorDialogOpen} onOpenChange={(isOpen) => {
                        setIsAddSupervisorDialogOpen(isOpen);
                        if (!isOpen) {
                            setOperatorToPromote('');
                            setNewSupervisorName('');
                        }
                    }}>
                        <DialogTrigger asChild>
                            <Button>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Adicionar Supervisor
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Adicionar Novo Supervisor</DialogTitle>
                                <DialogDescription>
                                    Selecione um operador para promovê-lo a supervisor. O nome será atualizado se preenchido.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                                <div>
                                    <Label htmlFor="name-promote">Nome do usuário (opcional)</Label>
                                    <Input 
                                        id="name-promote"
                                        placeholder="Nome completo do supervisor" 
                                        value={newSupervisorName} 
                                        onChange={(e) => setNewSupervisorName(e.target.value)} 
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="operator-select">Selecione o Operador</Label>
                                    <Select value={operatorToPromote} onValueChange={setOperatorToPromote}>
                                        <SelectTrigger id="operator-select">
                                            <SelectValue placeholder="Selecione um operador" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {operators.map(o => (
                                                <SelectItem key={o.id} value={o.id}>{o.name} ({o.email})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddSupervisorDialogOpen(false)}>Cancelar</Button>
                                <Button onClick={handleAddSupervisor}>Promover</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    {/* Desktop View */}
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {supervisors.length > 0 ? (
                                    supervisors.map(s => (
                                        <TableRow key={s.id}>
                                            <TableCell>{s.name}</TableCell>
                                            <TableCell>{s.email}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        id={`status-desktop-${s.id}`}
                                                        checked={s.status === 'active'}
                                                        onCheckedChange={(checked) => handleStatusChange(s.id, checked)}
                                                    />
                                                    <Label htmlFor={`status-desktop-${s.id}`}>{s.status === 'active' ? 'Ativo' : 'Inativo'}</Label>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => setSupervisorToDelete(s)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            Nenhum supervisor encontrado.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden">
                         {supervisors.length > 0 ? (
                            <div className="space-y-4">
                            {supervisors.map(s => (
                                <Card key={s.id} className="max-w-lg mx-auto w-full">
                                    <CardHeader>
                                        <CardTitle>{s.name}</CardTitle>
                                        <CardDescription>{s.email}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor={`status-mobile-${s.id}`} className="text-base">Status</Label>
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id={`status-mobile-${s.id}`}
                                                    checked={s.status === 'active'}
                                                    onCheckedChange={(checked) => handleStatusChange(s.id, checked)}
                                                />
                                                <Label htmlFor={`status-mobile-${s.id}`} className="text-base">{s.status === 'active' ? 'Ativo' : 'Inativo'}</Label>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline" size="sm" className="w-full" onClick={() => setSupervisorToDelete(s)}>
                                            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                            <span className="text-destructive">Rebaixar para Operador</span>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-12">Nenhum supervisor encontrado.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
            <AlertDialog open={!!supervisorToDelete} onOpenChange={() => setSupervisorToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Ação</AlertDialogTitle>
                        <AlertDialogDescription>
                           Você tem certeza que deseja rebaixar {supervisorToDelete?.name} para a função de operador? A atribuição de supervisor para os operadores dele será removida.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSupervisorToDelete(null)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteSupervisor}>Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
