'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown, ArrowLeft } from 'lucide-react';
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
import { cn } from '@/lib/utils';

const initialOcorrencias = [
  {
    id: '1',
    type: 'QUD RESGATE',
    rodovia: 'BR-158',
    km: '123+400',
    timestamp: '26/07/2024 10:30',
    status: 'Finalizada' as 'Finalizada' | 'Em Andamento',
    codOcorrencia: 'AC01',
    details: 'Vítima com ferimentos leves, transportada ao hospital local. Veículo removido da pista. Equipe Bravo-01 no local.',
    fullReport: {
      'DADOS OPERACIONAIS': {
        'Equipe': 'Bravo-01',
        'Médico Regulador': 'Dr. Carlos',
        'Nº Ocorrência': '2024-00123',
        'Horários': 'Acionamento: 10:30, Chegada no Local: 10:45, Saída do Local: 11:15, Chegada no Hospital: 11:30'
      },
      'DADOS CADASTRAIS DO USUÁRIO': {
        'Nome': 'João da Silva',
        'Idade': '35',
        'Sexo': 'Masculino',
        'Telefone': '(67) 99999-1234',
        'Acompanhante': 'Maria Souza (esposa)'
      },
      'EVENTO E CINEMÁTICA': {
        'Tipo de Evento': 'Trauma - Acidente Automobilístico',
        'Detalhes': 'Colisão frontal entre carro e moto.',
        'Condição Inicial': 'Vítima (motociclista) ao solo, consciente.'
      },
      'AVALIAÇÃO E PROCEDIMENTOS': {
        'Avaliação Primária': 'Vias aéreas pérvias, ventilação presente, pulso filiforme, hemorragia em membro inferior direito contida.',
        'Glasgow': '14 (Ocular: 4, Verbal: 4, Motora: 6)',
        'Sinais Vitais': 'PA: 110x70 mmHg, FC: 110 bpm, FR: 22 rpm, SatO2: 95%',
        'Procedimentos': 'Imobilização com colar cervical e prancha rígida, curativo compressivo em MID, acesso venoso em MSE.'
      },
      'DESFECHO': {
        'Conduta': 'Removido a Unidade Hospitalar',
        'Hospital': 'Santa Casa de Cassilândia',
        'Código': 'Vermelho',
        'Observações': 'Vítima agitada, refere dor intensa em MID. Estável durante transporte.'
      }
    }
  },
  {
    id: '2',
    type: 'VEÍCULO ABANDONADO',
    rodovia: 'MS-306',
    km: '55+000',
    timestamp: '26/07/2024 11:15',
    status: 'Em Andamento' as 'Finalizada' | 'Em Andamento',
    codOcorrencia: 'TO01',
    details: 'Veículo Fiat Uno, placa ABC-1234, no acostamento sem sinalização. Contatado proprietário, aguardando remoção.'
  },
  {
    id: '3',
    type: 'ANIMAL NA RODOVIA',
    rodovia: 'MS-112',
    km: '21+200',
    timestamp: '26/07/2024 09:00',
    status: 'Finalizada' as 'Finalizada' | 'Em Andamento',
    codOcorrencia: 'TO03',
    details: 'Capivara na pista. Animal foi afugentado para a mata adjacente. Trânsito normalizado.'
  },
  {
    id: '4',
    type: 'INCÊNDIO EM VEÍCULO',
    rodovia: 'BR-158',
    km: '88+900',
    timestamp: '25/07/2024 18:45',
    status: 'Finalizada' as 'Finalizada' | 'Em Andamento',
    codOcorrencia: 'TO05',
    details: 'Caminhão com carga de grãos pegou fogo no acostamento. Incêndio controlado pelo Corpo de Bombeiros. Pista liberada.'
  },
];

export default function OcorrenciasPage() {
  const { toast } = useToast();
  const [ocorrencias, setOcorrencias] = React.useState(initialOcorrencias);
  const [expandedCards, setExpandedCards] = React.useState<Set<string>>(new Set());

  const handleVerDetalhes = (id: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
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
       <Button asChild variant="ghost" className="pl-0">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o início
        </Link>
      </Button>
      <div className="space-y-2 text-center">
        <h1 className="font-condensed text-3xl font-bold tracking-tight">
          HISTÓRICO DE OCORRÊNCIAS
        </h1>
        <p className="text-muted-foreground">
          Visualize as ocorrências registradas.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ocorrencias.map((ocorrencia) => {
           const isExpanded = expandedCards.has(ocorrencia.id);
           return (
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

              {isExpanded && (
                <CardContent className="border-t pt-4">
                    {/* @ts-ignore */}
                    {ocorrencia.fullReport ? (
                        <div className="space-y-4">
                            {/* @ts-ignore */}
                            {Object.entries(ocorrencia.fullReport).map(([sectionTitle, sectionDetails]) => (
                                <div key={sectionTitle}>
                                    <h4 className="font-semibold mb-2 text-lg">{sectionTitle}</h4>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        {/* @ts-ignore */}
                                        {Object.entries(sectionDetails).map(([key, value]) => (
                                            <p key={key}>
                                                <span className="font-semibold text-foreground">{key}:</span> {String(value)}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2">
                           <h4 className="font-semibold mb-2">Detalhes:</h4>
                           <p className="text-sm text-muted-foreground">
                            {ocorrencia.details}
                          </p>
                        </div>
                    )}
                </CardContent>
              )}

              <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm" className="w-full" onClick={() => handleVerDetalhes(ocorrencia.id)}>
                  Ver Detalhes
                  <ChevronDown className={cn("h-5 w-5 ml-2 transition-transform", isExpanded && "rotate-180")} />
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
          )
        })}
         {ocorrencias.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-12">
            Nenhuma ocorrência registrada ainda.
          </div>
        )}
      </div>
    </div>
  );
}
