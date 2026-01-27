'use client';
import { useFirestore, useCollection } from '@/firebase';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Trash2, UserPlus } from 'lucide-react';
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
}

export default function UsersPage() {
    const { data: users, loading: usersLoading } = useCollection<AppUser>('users');
    const { toast } = useToast();
    const firestore = useFirestore();
    const [userToDelete, setUserToDelete] = useState<AppUser | null>(null);

    const handleRoleChange = async (userId: string, role: string) => {
        if (!firestore) return;
        const userDocRef = doc(firestore, 'users', userId);
        try {
            await updateDoc(userDocRef, { role });
            toast({ title: 'Sucesso', description: `Papel do usuário atualizado para ${role}.` });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erro', description: error.message });
        }
    };

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

    const handleDeleteUser = async () => {
        if (!firestore || !userToDelete) return;
        try {
            await deleteDoc(doc(firestore, 'users', userToDelete.id));
            toast({ title: 'Usuário Excluído', description: `O usuário ${userToDelete.name} foi excluído permanentemente.` });
            setUserToDelete(null);
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erro ao excluir', description: 'Não foi possível excluir o usuário.' });
        }
    };

    if (usersLoading) {
        return <div className="flex h-screen items-center justify-center">Carregando...</div>;
    }

    return (
        <div className="space-y-8">
            <Button asChild variant="ghost" className="mb-4 pl-0">
                <Link href="/admin">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para o Painel do Administrador
                </Link>
            </Button>
            
            <Card>
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Gerenciamento de Usuários</CardTitle>
                        <CardDescription>Gerencie todos os usuários do sistema.</CardDescription>
                    </div>
                     <Button asChild className="w-full md:w-auto">
                        <Link href="/signup">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Criar Novo Usuário
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    {/* Desktop View */}
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Papel</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users && users.length > 0 ? (
                                    users.map(u => (
                                        <TableRow key={u.id}>
                                            <TableCell>{u.name}</TableCell>
                                            <TableCell>{u.email}</TableCell>
                                            <TableCell>
                                                <Select value={u.role} onValueChange={(value) => handleRoleChange(u.id, value)}>
                                                    <SelectTrigger className="h-10 text-base">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="operator">Operador</SelectItem>
                                                        <SelectItem value="supervisor">Supervisor</SelectItem>
                                                        <SelectItem value="admin">Admin</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Switch
                                                        id={`status-desktop-${u.id}`}
                                                        checked={u.status === 'active'}
                                                        onCheckedChange={(checked) => handleStatusChange(u.id, checked)}
                                                    />
                                                    <Label htmlFor={`status-desktop-${u.id}`}>{u.status === 'active' ? 'Ativo' : 'Inativo'}</Label>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" onClick={() => setUserToDelete(u)}>
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            Nenhum usuário encontrado.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden">
                         {users && users.length > 0 ? (
                            <div className="space-y-4">
                            {users.map(u => (
                                <Card key={u.id} className="max-w-lg mx-auto w-full">
                                    <CardHeader>
                                        <CardTitle>{u.name}</CardTitle>
                                        <CardDescription>{u.email}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label className="text-base">Papel</Label>
                                            <Select value={u.role} onValueChange={(value) => handleRoleChange(u.id, value)}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="operator">Operador</SelectItem>
                                                    <SelectItem value="supervisor">Supervisor</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor={`status-mobile-${u.id}`} className="text-base">Status</Label>
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id={`status-mobile-${u.id}`}
                                                    checked={u.status === 'active'}
                                                    onCheckedChange={(checked) => handleStatusChange(u.id, checked)}
                                                />
                                                <Label htmlFor={`status-mobile-${u.id}`} className="text-base">{u.status === 'active' ? 'Ativo' : 'Inativo'}</Label>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <Button variant="outline" size="sm" className="w-full" onClick={() => setUserToDelete(u)}>
                                            <Trash2 className="mr-2 h-4 w-4 text-destructive" />
                                            <span className="text-destructive">Excluir Usuário</span>
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-12">Nenhum usuário encontrado.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
            <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                           Você tem certeza que deseja excluir o usuário {userToDelete?.name}? Esta ação é permanente e não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteUser}>Confirmar</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
