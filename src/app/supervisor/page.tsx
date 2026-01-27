'use client';
import { useUser, useFirestore, useDoc, useCollection } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'operator' | 'supervisor' | 'admin';
  supervisorId?: string;
}

interface Ocorrencia {
  id: string;
  userId: string;
  codOcorrencia: string;
  type: string;
  rodovia: string;
  km: string;
  createdAt: { toDate: () => Date };
}

export default function SupervisorPage() {
    const { user, initialising: userInitialising } = useUser();
    const { data: currentUserData, loading: currentUserLoading } = useDoc<AppUser>(user ? `users/${user.uid}` : null);
    const { data: users, loading: usersLoading } = useCollection<AppUser>('users');
    const { data: ocorrencias, loading: ocorrenciasLoading } = useCollection<Ocorrencia>('occurrences');
    const router = useRouter();
    const { toast } = useToast();
    const firestore = useFirestore();

    const [messageTitle, setMessageTitle] = useState('');
    const [messageContent, setMessageContent] = useState('');
    const [selectedOperator, setSelectedOperator] = useState('');

    useEffect(() => {
        if (!userInitialising && !currentUserLoading) {
            if (!user || (currentUserData?.role !== 'supervisor' && currentUserData?.role !== 'admin')) {
                router.push('/');
            }
        }
    }, [user, userInitialising, currentUserData, currentUserLoading, router]);

     const handleSendMessage = async () => {
        if (!firestore || !selectedOperator || !messageTitle || !messageContent) {
             toast({ variant: 'destructive', title: 'Erro', description: 'Por favor, preencha todos os campos da mensagem.' });
            return;
        }
        const messagesCollectionRef = collection(firestore, 'users', selectedOperator, 'messages');
        try {
            await addDoc(messagesCollectionRef, {
                title: messageTitle,
                content: messageContent,
                createdAt: serverTimestamp(),
                read: false,
                userId: selectedOperator
            });
            toast({ title: 'Sucesso', description: 'Recado enviado para o operador.' });
            setMessageTitle('');
            setMessageContent('');
            setSelectedOperator('');
        } catch (error: any) {
             toast({ variant: 'destructive', title: 'Erro', description: error.message });
        }
    };

    const { operators, supervisedOccurrences } = useMemo(() => {
        if (currentUserLoading || usersLoading || ocorrenciasLoading || !users || !ocorrencias || !currentUserData) {
            return { operators: [], supervisedOccurrences: [] };
        }

        if (currentUserData.role === 'admin') {
            const operators = users.filter(u => u.role === 'operator');
            return { operators, supervisedOccurrences: ocorrencias };
        }

        if (currentUserData.role === 'supervisor') {
            const operators = users.filter(u => u.role === 'operator' && u.supervisorId === user?.uid);
            const operatorIds = operators.map(o => o.id);
            const supervisedOccurrences = ocorrencias.filter(o => operatorIds.includes(o.userId));
            return { operators, supervisedOccurrences };
        }

        return { operators: [], supervisedOccurrences: [] };
    }, [currentUserData, users, ocorrencias, user?.uid, currentUserLoading, usersLoading, ocorrenciasLoading]);
    
    if (userInitialising || currentUserLoading || usersLoading || ocorrenciasLoading) {
        return <div className="flex h-screen items-center justify-center">Carregando...</div>;
    }

    if (currentUserData?.role !== 'supervisor' && currentUserData?.role !== 'admin') {
        return null;
    }
    
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Painel do Supervisor</h1>
            
            <Card>
                <CardHeader>
                    <CardTitle>Enviar Recado para Operador</CardTitle>
                     <CardDescription>
                        {currentUserData.role === 'supervisor' 
                            ? 'Envie recados para os operadores que você supervisiona.' 
                            : 'Envie recados para qualquer operador.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <Select value={selectedOperator} onValueChange={setSelectedOperator}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um operador" />
                        </SelectTrigger>
                        <SelectContent>
                            {operators.map(o => (
                                <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input placeholder="Título do recado" value={messageTitle} onChange={(e) => setMessageTitle(e.target.value)} />
                    <Textarea placeholder="Conteúdo do recado" value={messageContent} onChange={(e) => setMessageContent(e.target.value)} />
                    <Button onClick={handleSendMessage}>Enviar Recado</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Ocorrências Recentes</CardTitle>
                    <CardDescription>
                         {currentUserData.role === 'supervisor' 
                            ? 'Visualize as últimas ocorrências registradas pelos seus operadores.'
                            : 'Visualize as últimas ocorrências de todos os operadores.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Local</TableHead>
                                <TableHead>Operador</TableHead>
                                <TableHead>Data</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {supervisedOccurrences?.sort((a,b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()).slice(0, 10).map(o => (
                                <TableRow key={o.id}>
                                    <TableCell>{o.type}</TableCell>
                                    <TableCell>{o.rodovia} - {o.km}</TableCell>
                                    <TableCell>{users?.find(u => u.id === o.userId)?.name ?? 'Desconhecido'}</TableCell>
                                    <TableCell>{new Date(o.createdAt?.toDate()).toLocaleString('pt-BR')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
