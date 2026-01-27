'use client';
import { useUser, useFirestore, useCollection } from '@/firebase';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { doc, updateDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Supervisor</TableHead>
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
                                                    id={`status-${o.id}`}
                                                    checked={o.status === 'active'}
                                                    onCheckedChange={(checked) => handleStatusChange(o.id, checked)}
                                                />
                                                <Label htmlFor={`status-${o.id}`}>{o.status === 'active' ? 'Ativo' : 'Inativo'}</Label>
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
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        Nenhum operador encontrado.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
