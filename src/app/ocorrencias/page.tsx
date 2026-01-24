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

const initialOcorrencias: any[] = [];

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
