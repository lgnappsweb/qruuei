'use client';
import { useUser, useFirestore, useCollection } from '@/firebase';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
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


interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'operator' | 'supervisor' | 'admin';
  status: 'active' | 'inactive';
  supervisorId?: string;
}

export default function OperatorsPage() {
    const { user, initialising: userInitialising } = useUser();
    const { data: users, loading: usersLoading } = useCollection<AppUser>('users');
    const { toast } = useToast();
    const firestore = useFirestore();
    const [operatorToDelete, setOperatorToDelete] = useState<AppUser | null>(null);

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
    
    const handleSupervisorChange = async (operatorId: string, supervisorId: string) => {
        if (!firestore) return;
        const operatorDocRef = doc(firestore, 'users', operatorId);
        try {
            await updateDoc(operatorDocRef, { supervisorId: supervisorId === 'none' ? null : supervisorId });
            toast({ title: 'Sucesso', description: 'Supervisor do operador atualizado.' });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erro', description: error.message });
        }
    };

    const handleDeleteOperator = async () => {
        if (!firestore || !operatorToDelete) return;
        try {
            await deleteDoc(doc(firestore, 'users', operatorToDelete.id));
            toast({ title: 'Operador Excluído', description: `O operador ${operatorToDelete.name} foi excluído permanentemente.` });
            setOperatorToDelete(null);
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erro ao excluir', description: 'Não foi possível excluir o operador.' });
        }
    };

    if (userInitialising || usersLoading) {
        return <div className="flex h-screen items-center justify-center">Carregando...</div>;
    }

    const operators = users?.filter(u => u.role === 'operator') || [];
    const supervisors = users?.filter(u => u.role === 'supervisor') || [];

    return (
        <div className="space-y-8">
            <Button asChild variant="ghost" className="mb-4 pl-0">
                <Link href="/admin">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para o Painel do Administrador
                </Link>
            </Button>
            
            <Card>
                <CardHeader>
                    <CardTitle>Gerenciamento de Operadores</CardTitle>
                    <CardDescription>Gerencie o status e o supervisor de cada operador.</CardDescription>
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
                                    <TableHead>Supervisor</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {operators.length > 0 ? (
                                    operators.map(o => (
                                        <TableRow key={o.id}>
                                            <TableCell>{o.name}</TableCell>
                                            <TableCell>{o.email}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        id={`status-desktop-${o.id}`}
                                                        checked={o.status === 'active'}
                                                        onCheckedChange={(checked) => handleStatusChange(o.id, checked)}
                                                    />
                                                    <Label htmlFor={`status-desktop-${o.id}`}>{o.status === 'active' ? 'Ativo' : 'Inativo'}</Label>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Select 
                                                    value={o.supervisorId || 'none'} 
                                                    onValueChange={(value) => handleSupervisorChange(o.id, value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione um supervisor" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">Nenhum</SelectItem>
                                                        {supervisors.map(s => (
                                                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => setOperatorToDelete(o)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            Nenhum operador encontrado.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile View */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                         {operators.length > 0 ? (
                            operators.map(o => (
                                <Card key={o.id}>
                                    <CardHeader>
                                        <CardTitle>{o.name}</CardTitle>
                                        <CardDescription>{o.email}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor={`status-mobile-${o.id}`} className="text-base">Status</Label>
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id={`status-mobile-${o.id}`}
                                                    checked={o.status === 'active'}
                                                    onCheckedChange={(checked) => handleStatusChange(o.id, checked)}
                                                />
                                                <Label htmlFor={`status-mobile-${o.id}`} className="text-base">{o.status === 'active' ? 'Ativo' : 'Inativo'}</Label>
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-base">Supervisor</Label>
                                            <Select 
                                                value={o.supervisorId || 'none'} 
                                                onValueChange={(value) => handleSupervisorChange(o.id, value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione um supervisor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Nenhum</SelectItem>
                                                    {supervisors.map(s => (
                                                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline" size="sm" className="w-full" onClick={() => setOperatorToDelete(o)}>
                                            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                            <span className="text-destructive">Excluir Operador</span>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground py-12">Nenhum operador encontrado.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
            <AlertDialog open={!!operatorToDelete} onOpenChange={() => setOperatorToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                           Você tem certeza que deseja excluir o operador {operatorToDelete?.name}? Esta ação é permanente e não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setOperatorToDelete(null)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteOperator}>Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
