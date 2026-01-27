'use client';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { doc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, FileText, Users, ArrowLeft, Trash2, UserPlus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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
    const { data: users, loading: usersLoading } = useCollection<AppUser>('users');
    const { data: ocorrencias, loading: ocorrenciasLoading } = useCollection<Ocorrencia>('occurrences');
    const { toast } = useToast();
    const firestore = useFirestore();

    const [messageTitle, setMessageTitle] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const [selectedSupervisorForMessage, setSelectedSupervisorForMessage] = useState('');

    const [isAddSupervisorDialogOpen, setIsAddSupervisorDialogOpen] = useState(false);
    const [operatorToPromote, setOperatorToPromote] = useState('');
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
            toast({ variant: 'destructive', title: 'Erro', description: 'Selecione um operador para promover.' });
            return;
        }
        const userDocRef = doc(firestore, 'users', operatorToPromote);
        try {
            await updateDoc(userDocRef, { role: 'supervisor' });
            toast({ title: 'Sucesso', description: 'Operador promovido a supervisor.' });
            setIsAddSupervisorDialogOpen(false);
            setOperatorToPromote('');
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erro', description: error.message });
        }
    };

    const handleDeleteSupervisor = async () => {
        if (!firestore || !supervisorToDelete) return;
        
        // Unassign operators from this supervisor
        const operatorsOfSupervisor = users?.filter(u => u.supervisorId === supervisorToDelete.id);
        if (operatorsOfSupervisor) {
            for (const operator of operatorsOfSupervisor) {
                const operatorDocRef = doc(firestore, 'users', operator.id);
                await updateDoc(operatorDocRef, { supervisorId: null });
            }
        }

        // Instead of deleting, demote to operator. It's safer.
        const userDocRef = doc(firestore, 'users', supervisorToDelete.id);
        try {
            await updateDoc(userDocRef, { role: 'operator' });
            toast({ title: 'Sucesso', description: `Supervisor ${supervisorToDelete.name} rebaixado para operador.` });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erro', description: error.message });
        }
        setSupervisorToDelete(null);
    };

    const handleSendMessage = async () => {
        if (!firestore || !selectedSupervisorForMessage || !messageTitle || !messageContent) {
             toast({ variant: 'destructive', title: 'Erro', description: 'Por favor, preencha todos os campos da mensagem.' });
            return;
        }

        const supervisors = users?.filter(u => u.role === 'supervisor') || [];

        const targetUserIds = selectedSupervisorForMessage === 'all_supervisors' 
            ? supervisors.map(s => s.id)
            : [selectedSupervisorForMessage];

        try {
            for (const userId of targetUserIds) {
                const messagesCollectionRef = collection(firestore, 'users', userId, 'messages');
                await addDoc(messagesCollectionRef, {
                    title: messageTitle,
                    content: messageContent,
                    createdAt: serverTimestamp(),
                    read: false,
                    userId: userId
                });
            }

            if (selectedSupervisorForMessage === 'all_supervisors') {
                toast({ title: 'Sucesso', description: 'Recado enviado para todos os supervisores.' });
            } else {
                 toast({ title: 'Sucesso', description: 'Recado enviado para o supervisor.' });
            }
           
            setMessageTitle('');
            setMessageContent('');
            setSelectedSupervisorForMessage('');
        } catch (error: any) {
             toast({ variant: 'destructive', title: 'Erro', description: error.message });
        }
    };

    if (userInitialising || usersLoading || ocorrenciasLoading) {
        return <div className="flex h-screen items-center justify-center">Carregando...</div>;
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
            <Button asChild variant="ghost" className="mb-4 pl-0">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para o Painel do Operador
                </Link>
            </Button>
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
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Gerenciamento de Supervisores</CardTitle>
                        <CardDescription>Adicione, remova e gerencie os supervisores do sistema.</CardDescription>
                    </div>
                    <Dialog open={isAddSupervisorDialogOpen} onOpenChange={setIsAddSupervisorDialogOpen}>
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
                                    Selecione um operador para promovê-lo a supervisor.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <Select value={operatorToPromote} onValueChange={setOperatorToPromote}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um operador" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {operators.map(o => (
                                            <SelectItem key={o.id} value={o.id}>{o.name} ({o.email})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsAddSupervisorDialogOpen(false)}>Cancelar</Button>
                                <Button onClick={handleAddSupervisor}>Promover</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
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
                            {supervisors.map(s => (
                                <TableRow key={s.id}>
                                    <TableCell>{s.name}</TableCell>
                                    <TableCell>{s.email}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id={`status-${s.id}`}
                                                checked={s.status === 'active'}
                                                onCheckedChange={(checked) => handleStatusChange(s.id, checked)}
                                            />
                                            <Label htmlFor={`status-${s.id}`}>{s.status === 'active' ? 'Ativo' : 'Inativo'}</Label>
                                        </div>
                                    </TableCell>
                                     <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => setSupervisorToDelete(s)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
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
                    <CardDescription>Envie recados para supervisores.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Select value={selectedSupervisorForMessage} onValueChange={setSelectedSupervisorForMessage}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um destinatário" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all_supervisors">Todos os Supervisores</SelectItem>
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

            <AlertDialog open={!!supervisorToDelete} onOpenChange={() => setSupervisorToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Ação</AlertDialogTitle>
                        <AlertDialogDescription>
                            Você tem certeza que deseja rebaixar {supervisorToDelete?.name} para a função de operador? Seus operadores atribuídos ficarão sem supervisor.
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
