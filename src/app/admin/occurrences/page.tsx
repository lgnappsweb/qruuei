'use client';
import { useFirestore, useCollection } from '@/firebase';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Eye } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Ocorrencia {
  id: string;
  userId: string;
  codOcorrencia: string;
  type: string;
  rodovia: string;
  km: string;
  createdAt: Timestamp;
  status: 'Em Andamento' | 'Finalizada';
  fullReport: any;
}

interface AppUser {
  id: string;
  name: string;
}

const formatLabel = (key: string) => {
  const result = key.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export default function OccurrencesPage() {
    const { data: occurrences, loading: occurrencesLoading } = useCollection<Ocorrencia>('occurrences');
    const { data: users, loading: usersLoading } = useCollection<AppUser>('users');
    const { toast } = useToast();
    const firestore = useFirestore();
    const [statusFilter, setStatusFilter] = useState('all');

    const handleStatusChange = async (occurrenceId: string, status: string) => {
        if (!firestore) return;
        const occurrenceDocRef = doc(firestore, 'occurrences', occurrenceId);
        try {
            await updateDoc(occurrenceDocRef, { status });
            toast({ title: 'Sucesso', description: 'Status da ocorrência atualizado.' });
        } catch (error: any) {
            toast({ variant: 'destructive', title: 'Erro', description: error.message });
        }
    };

    const filteredOccurrences = useMemo(() => {
        if (!occurrences) return [];
        if (statusFilter === 'all') return occurrences;
        return occurrences.filter(o => o.status === statusFilter);
    }, [occurrences, statusFilter]);

    if (occurrencesLoading || usersLoading) {
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
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Gerenciamento de Ocorrências</CardTitle>
                        <CardDescription>Visualize e gerencie todas as ocorrências.</CardDescription>
                    </div>
                    <div className="w-48">
                         <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Filtrar por status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                                <SelectItem value="Finalizada">Finalizada</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Local</TableHead>
                                <TableHead>Operador</TableHead>
                                <TableHead>Data</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOccurrences.length > 0 ? (
                                filteredOccurrences.sort((a,b) => b.createdAt.toMillis() - a.createdAt.toMillis()).map(o => (
                                    <TableRow key={o.id}>
                                        <TableCell>{o.codOcorrencia}</TableCell>
                                        <TableCell>{o.rodovia} - {o.km}</TableCell>
                                        <TableCell>{users?.find(u => u.id === o.userId)?.name ?? 'Desconhecido'}</TableCell>
                                        <TableCell>{o.createdAt.toDate().toLocaleString('pt-BR')}</TableCell>
                                        <TableCell>
                                            <Select value={o.status} onValueChange={(value) => handleStatusChange(o.id, value)}>
                                                <SelectTrigger className="h-10 text-base">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                                                    <SelectItem value="Finalizada">Finalizada</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <Eye className="h-4 w-4"/>
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-4xl h-[80vh]">
                                                    <DialogHeader>
                                                        <DialogTitle>{o.type}</DialogTitle>
                                                    </DialogHeader>
                                                    <ScrollArea className="h-full pr-6 -mr-6 mt-4">
                                                      <div className="space-y-4">
                                                        {Object.entries(o.fullReport).map(([key, value]) => {
                                                            if(value === "NILL" || (Array.isArray(value) && value.length === 0)) return null;

                                                            if (key === 'vehicles' && Array.isArray(value)) {
                                                                return value.map((vehicle: any, index: number) => (
                                                                    <div key={index} className="border p-4 rounded-md">
                                                                        <h4 className="font-bold mb-2">Veículo {index + 1}</h4>
                                                                        {Object.entries(vehicle).map(([vKey, vValue]) => (
                                                                             <p key={vKey}><strong>{formatLabel(vKey)}:</strong> {String(vValue)}</p>
                                                                        ))}
                                                                    </div>
                                                                ))
                                                            }

                                                            return <p key={key}><strong>{formatLabel(key)}:</strong> {Array.isArray(value) ? value.join(', ') : String(value)}</p>
                                                        })}
                                                      </div>
                                                    </ScrollArea>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">Nenhuma ocorrência encontrada.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
