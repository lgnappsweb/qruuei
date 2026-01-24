'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const initialOcorrencias = [
  {
    id: '1',
    type: 'QUD RESGATE',
    rodovia: 'BR-158',
    km: '123+400',
    timestamp: '26/07/2024 10:30',
    status: 'Finalizada' as 'Finalizada' | 'Em Andamento',
    codOcorrencia: 'AC01'
  },
  {
    id: '2',
    type: 'VEÍCULO ABANDONADO',
    rodovia: 'MS-306',
    km: '55+000',
    timestamp: '26/07/2024 11:15',
    status: 'Em Andamento' as 'Finalizada' | 'Em Andamento',
    codOcorrencia: 'TO01'
  },
  {
    id: '3',
    type: 'ANIMAL NA RODOVIA',
    rodovia: 'MS-112',
    km: '21+200',
    timestamp: '26/07/2024 09:00',
    status: 'Finalizada' as 'Finalizada' | 'Em Andamento',
    codOcorrencia: 'TO03'
  },
  {
    id: '4',
    type: 'INCÊNDIO EM VEÍCULO',
    rodovia: 'BR-158',
    km: '88+900',
    timestamp: '25/07/2024 18:45',
    status: 'Finalizada' as 'Finalizada' | 'Em Andamento',
    codOcorrencia: 'TO05'
  },
];

const occurrencePathMap: { [key: string]: string } = {
    'QUD RESGATE': '/ocorrencias/qud-resgate',
    'VEÍCULO ABANDONADO': '/ocorrencias/to01',
    'ANIMAL NA RODOVIA': '/ocorrencias/to03',
    'INCÊNDIO EM VEÍCULO': '/ocorrencias/to05',
};

export default function OcorrenciasPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [ocorrencias, setOcorrencias] = React.useState(initialOcorrencias);

  const handleVerDetalhes = (type: string) => {
    const path = occurrencePathMap[type];
    if (path) {
      router.push(path);
    } else {
      toast({
        variant: "destructive",
        title: "Página não encontrada",
        description: `O formulário para a ocorrência "${type}" não foi encontrado.`,
      });
    }
  };

  const handleApagar = (id: string) => {
    setOcorrencias(ocorrencias.filter(o => o.id !== id));
    toast({
      title: "Ocorrência apagada",
      description: "A ocorrência foi removida da lista.",
    });
  };

  return (
    <div className="space-y-8 pb-24">
      <div className="space-y-2 text-center">
        <h1 className="font-condensed text-3xl font-bold tracking-tight">
          HISTÓRICO DE OCORRÊNCIAS
        </h1>
        <p className="text-muted-foreground">
          Visualize as ocorrências registradas.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ocorrencias.map((ocorrencia) => (
          <Card key={ocorrencia.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{ocorrencia.codOcorrencia}</span>
                <Badge variant={ocorrencia.status === 'Finalizada' ? 'secondary' : 'destructive'}>
                  {ocorrencia.status}
                </Badge>
              </CardTitle>
              <CardDescription>{ocorrencia.type}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-base text-muted-foreground">
                <span className="font-semibold text-foreground">Rodovia:</span> {ocorrencia.rodovia}
              </p>
              <p className="text-base text-muted-foreground">
                <span className="font-semibold text-foreground">KM:</span> {ocorrencia.km}
              </p>
              <p className="text-base text-muted-foreground">
                <span className="font-semibold text-foreground">Data/Hora:</span> {ocorrencia.timestamp}
              </p>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" size="sm" className="w-full" onClick={() => handleVerDetalhes(ocorrencia.type)}>
                Ver Detalhes
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon" className="shrink-0">
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso irá apagar permanentemente
                      a ocorrência da lista.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleApagar(ocorrencia.id)}>
                      Apagar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
         {ocorrencias.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-12">
            Nenhuma ocorrência registrada ainda.
          </div>
        )}
      </div>
    </div>
  );
}
