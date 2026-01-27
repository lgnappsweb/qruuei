'use client';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Briefcase, FileText, Users, ArrowLeft } from 'lucide-react';


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
                <Link href="/admin/operators">
                    <Card className="cursor-pointer hover:bg-accent transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Operadores</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.operators}</div>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/admin/supervisors">
                    <Card className="cursor-pointer hover:bg-accent transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Supervisores</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.supervisors}</div>
                        </CardContent>
                    </Card>
                </Link>
                <Link href="/ocorrencias">
                     <Card className="cursor-pointer hover:bg-accent transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Ocorrências</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.occurrences}</div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
            
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
        </div>
    );
}
