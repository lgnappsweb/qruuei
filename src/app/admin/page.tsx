'use client';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, FileText, Users, ShieldCheck } from 'lucide-react';
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

interface Ocorrencia {
    id: string;
}

export default function AdminPage() {
    const { user, initialising: userInitialising } = useUser();
    const { data: currentUserData, loading: currentUserLoading } = useDoc<AppUser>(user ? `users/${user.uid}` : null);
    const { data: users, loading: usersLoading } = useCollection<AppUser>('users');
    const { data: ocorrencias, loading: ocorrenciasLoading } = useCollection<Ocorrencia>('occurrences');
    const router = useRouter();
    const { toast } = useToast();
    const firestore = useFirestore();

    const [messageTitle, setMessageTitle] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const [selectedSupervisor, setSelectedSupervisor] = useState('');

    useEffect(() => {
        if (!userInitialising && !currentUserLoading) {
            if (!user || currentUserData?.role !== 'admin') {
                router.push('/');
            }
        }
    }, [user, userInitialising, currentUserData, currentUserLoading, router]);

    const handleRoleChange = async (userId: string, role: string) => {
        if (!firestore) return;
        const userDocRef = doc(firestore, 'users', userId);
        try {
            await updateDoc(userDocRef, { role });
            toast({ title: 'Sucesso', description: `Função do usuário atualizada para ${role}.` });
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
    
    const handleSupervisorChange = async (operatorId: string, supervisorId: string) => {
        if (!firestore) return;
        const userDocRef = doc(firestore, 'users', operatorId);
        try {
            const newSupervisorId = supervisorId === 'unassigned' ? null : supervisorId;
            await updateDoc(userDocRef, { supervisorId: newSupervisorId });
            toast({ title: 'Sucesso', description: `Supervisor atribuído.` });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erro', description: error.message });
        }
    };
    
    const handleSendMessage = async () => {
        if (!firestore || !selectedSupervisor || !messageTitle || !messageContent) {
             toast({ variant: 'destructive', title: 'Erro', description: 'Por favor, preencha todos os campos da mensagem.' });
            return;
        }
        const messagesCollectionRef = collection(firestore, 'users', selectedSupervisor, 'messages');
        try {
            await addDoc(messagesCollectionRef, {
                title: messageTitle,
                content: messageContent,
                createdAt: serverTimestamp(),
                read: false,
                userId: selectedSupervisor
            });
            toast({ title: 'Sucesso', description: 'Recado enviado para o supervisor.' });
            setMessageTitle('');
            setMessageContent('');
            setSelectedSupervisor('');
        } catch (error: any) {
             toast({ variant: 'destructive', title: 'Erro', description: error.message });
        }
    };

    if (userInitialising || currentUserLoading || usersLoading || ocorrenciasLoading) {
        return <div className="flex h-screen items-center justify-center">Carregando...</div>;
    }
    
    if (currentUserData?.role !== 'admin') {
        return null;
    }
    
    const supervisors = users?.filter(u => u.role === 'supervisor') || [];
    const operators = users?.filter(u => u.role === 'operator') || [];

    const stats = {
        operators: operators.length,
        supervisors: supervisors.length,
        occurrences: ocorrencias?.length || 0
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Painel do Administrador</h1>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Operadores</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.operators}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Supervisores</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.supervisors}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ocorrências</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.occurrences}</div>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Gerenciamento de Usuários</CardTitle>
                    <CardDescription>Gerencie as funções, status e vínculos dos usuários do sistema.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Função</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Supervisor</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users?.map(u => (
                                <TableRow key={u.id}>
                                    <TableCell>{u.name}</TableCell>
                                    <TableCell>{u.email}</TableCell>
                                    <TableCell>
                                        <Select value={u.role} onValueChange={(value) => handleRoleChange(u.id, value)}>
                                            <SelectTrigger className="w-[180px]">
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
                                                id={`status-${u.id}`}
                                                checked={u.status === 'active'}
                                                onCheckedChange={(checked) => handleStatusChange(u.id, checked)}
                                            />
                                            <Label htmlFor={`status-${u.id}`}>{u.status === 'active' ? 'Ativo' : 'Inativo'}</Label>
                                        </div>
                                    </TableCell>
                                     <TableCell>
                                        {u.role === 'operator' && (
                                            <Select value={u.supervisorId || 'unassigned'} onValueChange={(value) => handleSupervisorChange(u.id, value)}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Atribuir supervisor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="unassigned">Nenhum</SelectItem>
                                                    {supervisors.map(s => (
                                                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Comunicação Institucional</CardTitle>
                    <CardDescription>Envie recados para todos os supervisores.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Select value={selectedSupervisor} onValueChange={setSelectedSupervisor}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um supervisor" />
                        </SelectTrigger>
                        <SelectContent>
                            {supervisors.map(s => (
                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input placeholder="Título do recado" value={messageTitle} onChange={(e) => setMessageTitle(e.target.value)} />
                    <Textarea placeholder="Conteúdo do recado" value={messageContent} onChange={(e) => setMessageContent(e.target.value)} />
                    <Button onClick={handleSendMessage}>Enviar Recado</Button>
                </CardContent>
            </Card>
        </div>
    );
}
