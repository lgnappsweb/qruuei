'use client';
import { useCollection } from '@/firebase';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Users, FileText, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import type { Timestamp } from 'firebase/firestore';

interface AppUser { id: string; }
interface Ocorrencia {
    id: string;
    codOcorrencia: string;
    rodovia: string;
    km: string;
    status: 'Em Andamento' | 'Finalizada';
    createdAt: Timestamp;
}

export default function AdminDashboardPage() {
    const { data: users, loading: usersLoading } = useCollection<AppUser>('users');
    const { data: ocorrencias, loading: ocorrenciasLoading } = useCollection<Ocorrencia>('occurrences');

    if (usersLoading || ocorrenciasLoading) {
        return <div className="flex h-screen items-center justify-center">Carregando...</div>;
    }
    
    const stats = {
        totalUsers: users?.length || 0,
        totalOccurrences: ocorrencias?.length || 0,
        openOccurrences: ocorrencias?.filter(o => o.status === 'Em Andamento').length || 0,
        resolvedOccurrences: ocorrencias?.filter(o => o.status === 'Finalizada').length || 0,
    };

    const recentOccurrences = ocorrencias?.sort((a,b) => b.createdAt.toMillis() - a.createdAt.toMillis()).slice(0, 5) || [];

    return (
        <div className="space-y-8">
            <Button asChild variant="ghost" className="mb-4 pl-0">
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar para a página do operador
                </Link>
            </Button>
            <h1 className="text-3xl font-bold">Painel do Administrador</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Ocorrências</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalOccurrences}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ocorrências Abertas</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.openOccurrences}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ocorrências Resolvidas</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.resolvedOccurrences}</div>
                    </CardContent>
                </Card>
                <Link href="/admin/users">
                    <Card className="cursor-pointer hover:bg-accent transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        </CardContent>
                    </Card>
                </Link>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Ocorrências Recentes</CardTitle>
                    <CardDescription>As 5 ocorrências mais recentes registradas no sistema.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Local</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Data</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentOccurrences.length > 0 ? (
                                recentOccurrences.map(o => (
                                <TableRow key={o.id}>
                                    <TableCell>{o.codOcorrencia}</TableCell>
                                    <TableCell>{o.rodovia} - {o.km}</TableCell>
                                    <TableCell>{o.status}</TableCell>
                                    <TableCell>{o.createdAt.toDate().toLocaleDateString('pt-BR')}</TableCell>
                                </TableRow>
                            ))) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">Nenhuma ocorrência recente.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
                 <CardFooter className="flex justify-end">
                    <Button asChild>
                        <Link href="/admin/occurrences">
                            Ver Todas as Ocorrências
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
