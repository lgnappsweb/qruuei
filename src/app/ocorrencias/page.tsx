'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft, Edit, Share2 } from 'lucide-react';
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

interface Ocorrencia {
  id: string;
  codOcorrencia: string;
  type: string;
  rodovia: string;
  km: string;
  timestamp: string;
  status: 'Em Andamento' | 'Finalizada';
  fullReport: any;
  numeroOcorrencia?: string;
  formPath: string;
}

const formatLabel = (key: string) => {
  const result = key.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export default function OcorrenciasPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [ocorrencias, setOcorrencias] = React.useState<Ocorrencia[]>([]);
  const [expandedCards, setExpandedCards] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    try {
      const savedOcorrencias = localStorage.getItem('ocorrencias_v2');
      if (savedOcorrencias) {
        setOcorrencias(JSON.parse(savedOcorrencias));
      }
    } catch (error) {
      console.error("Failed to parse ocorrencias from localStorage", error);
    }
  }, []);

  const toggleCardExpansion = (id: string) => {
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
  
  const updateLocalStorage = (updatedOcorrencias: Ocorrencia[]) => {
      setOcorrencias(updatedOcorrencias);
      localStorage.setItem('ocorrencias_v2', JSON.stringify(updatedOcorrencias));
  }

  const handleDelete = (id: string) => {
    const updatedOcorrencias = ocorrencias.filter(o => o.id !== id);
    updateLocalStorage(updatedOcorrencias);
    toast({
      title: "Ocorrência apagada",
      description: "A ocorrência foi removida da lista.",
    });
  };

  const handleEdit = (ocorrencia: Ocorrencia) => {
    if(ocorrencia.formPath) {
        localStorage.setItem('editOcorrenciaData', JSON.stringify(ocorrencia));
        router.push(ocorrencia.formPath);
    } else {
        toast({
            variant: "destructive",
            title: "Não foi possível editar",
            description: "O formulário para esta ocorrência não foi encontrado.",
        });
    }
  };

  const handleShare = (ocorrencia: Ocorrencia) => {
    let text = `*RELATÓRIO DE OCORRÊNCIA: ${ocorrencia.type.toUpperCase()}*\n\n`;
    if (ocorrencia.numeroOcorrencia && ocorrencia.numeroOcorrencia !== 'NILL') {
      text += `*NÚMERO DA OCORRÊNCIA:* ${ocorrencia.numeroOcorrencia.toUpperCase()}\n\n`;
    }

    const renderValue = (value: any): string => {
      if (typeof value === 'boolean') return value ? 'SIM' : 'NÃO';
      if (Array.isArray(value)) return value.join(', ').toUpperCase();
      return String(value).toUpperCase();
    }
    
    const processSection = (data: any, sectionTitle?: string) => {
      let sectionText = '';
      for (const [key, value] of Object.entries(data)) {
        if (['id', 'formPath', 'vehicles', 'numeroOcorrencia'].includes(key) || value === null || value === undefined || (Array.isArray(value) && value.length === 0) || String(value).trim() === '' || value === 'NILL' ) continue;
        sectionText += `*${formatLabel(key).toUpperCase()}:* ${renderValue(value)}\n`;
      }
      if (sectionText) {
          if(sectionTitle) text += `*${sectionTitle.toUpperCase()}*\n`;
          text += sectionText + '\n';
      }
    };
    
    processSection(ocorrencia.fullReport);
    
    if (Array.isArray(ocorrencia.fullReport.vehicles) && ocorrencia.fullReport.vehicles.length > 0) {
      ocorrencia.fullReport.vehicles.forEach((vehicle: any, index: number) => {
        processSection(vehicle, `DADOS DO VEÍCULO ${index + 1}`);
      });
    }

    const encodedText = encodeURIComponent(text.trim());
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`);
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
            <Card key={ocorrencia.id} className="flex flex-col">
              <div onClick={() => toggleCardExpansion(ocorrencia.id)} className="cursor-pointer flex-grow">
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
              </div>

              {isExpanded && (
                <div className="flex flex-col">
                  <CardContent className="border-t pt-4">
                      <div className="space-y-2 text-sm text-muted-foreground max-h-60 overflow-y-auto">
                         <h4 className="font-semibold text-base text-foreground mb-2">Relatório Completo:</h4>
                            {Object.entries(ocorrencia.fullReport).map(([key, value]) => {
                                if (['id', 'formPath', 'vehicles'].includes(key) || value === null || value === undefined || value === 'NILL' || (Array.isArray(value) && value.length === 0)) return null;

                                return <p key={key}><span className="font-semibold text-foreground">{formatLabel(key)}:</span> {Array.isArray(value) ? value.join(', ') : String(value)}</p>
                            })}
                            {Array.isArray(ocorrencia.fullReport.vehicles) && ocorrencia.fullReport.vehicles.map((vehicle: any, index: number) => (
                                <div key={index} className="pt-2 mt-2 border-t">
                                    <h5 className="font-semibold text-foreground">Veículo {index + 1}</h5>
                                    {Object.entries(vehicle).map(([key, value]) => (
                                        (value && value !== 'NILL') && <p key={key}><span className="font-semibold text-foreground">{formatLabel(key)}:</span> {String(value)}</p>
                                    ))}
                                </div>
                            ))}
                      </div>
                  </CardContent>
                  <CardFooter className="flex gap-2 border-t pt-4 mt-auto">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(ocorrencia)}>
                      <Edit className="mr-2 h-4 w-4"/> Editar
                    </Button>
                     <Button variant="default" size="sm" onClick={() => handleShare(ocorrencia)} className="bg-green-600 hover:bg-green-700">
                      <Share2 className="mr-2 h-4 w-4"/> Compartilhar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" className="shrink-0 ml-auto">
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
                          <AlertDialogAction onClick={() => handleDelete(ocorrencia.id)}>
                            Apagar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </div>
              )}
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
