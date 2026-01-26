'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, ArrowLeft, Edit, Share2, ShieldAlert, Route, MapPin, Calendar, Car } from 'lucide-react';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { tiposPane } from '@/lib/tipos-pane';

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

const vehicleFieldOrder = ['marca', 'modelo', 'ano', 'cor', 'placa', 'cidadeEmplacamento', 'eixos', 'tipoVeiculo', 'estadoPneu', 'tipoCarga', 'qraCondutor', 'baixaFrequencia', 'ocupantes'];
const vehicleWithPersonalDataFieldOrder = [...vehicleFieldOrder, 'cpf', 'rg', 'endereco', 'numero', 'bairro', 'cidade'];

const fieldOrders: Record<string, string[]> = {
    '/ocorrencias/to01': ['rodovia', 'ocorrencia', 'tipoPanes', 'qth', 'sentido', 'localArea', '---VEHICLES---', 'vtrApoio', 'vtrApoioDescricao', 'danoPatrimonio', 'danoPatrimonioDescricao', 'observacoes', 'auxilios'],
    '/ocorrencias/to02': ['rodovia', 'ocorrencia', 'qth', 'sentido', 'localArea', 'qthInicio', 'qthTermino', 'proporcaoMetros', 'areaTotal', 'vtrApoio', 'vtrApoioDescricao', 'observacoes', 'auxilios'],
    '/ocorrencias/to03': ['rodovia', 'ocorrencia', 'qth', 'sentido', 'localArea', 'animal', 'quantidade', 'situacao', 'entornoNorte', 'entornoNorteOutros', 'entornoSul', 'entornoSulOutros', 'pista', 'acostamento', 'tracado', 'perfil', 'destinacaoAnimal', 'qthDestinacao', 'vtrApoio', 'vtrApoioDescricao', 'observacoes', 'auxilios'],
    '/ocorrencias/to04': ['rodovia', 'ocorrencia', 'tipoPanes', 'qth', 'sentido', 'localArea', '---VEHICLES---', 'vtrApoio', 'vtrApoioDescricao', 'danoPatrimonio', 'danoPatrimonioDescricao', 'observacoes', 'auxilios'],
    '/ocorrencias/to05': ['rodovia', 'ocorrencia', 'tipoPanes', 'qth', 'sentido', 'localArea', '---VEHICLES---', 'vtrApoio', 'vtrApoioDescricao', 'danoPatrimonio', 'danoPatrimonioDescricao', 'observacoes', 'auxilios'],
    '/ocorrencias/to06': ['rodovia', 'ocorrencia', 'tipoPanes', 'qth', 'sentido', 'localArea', '---VEHICLES---', 'vtrApoio', 'vtrApoioDescricao', 'danoPatrimonio', 'danoPatrimonioDescricao', 'observacoes', 'auxilios'],
    '/ocorrencias/to07': ['rodovia', 'ocorrencia', 'qth', 'sentido', 'localArea', 'tipoObjeto', 'quantidade', 'destinacaoObjeto', 'qthDestinacao', 'vtrApoio', 'vtrApoioDescricao', 'observacoes', 'auxilios'],
    '/ocorrencias/to09': ['rodovia', 'ocorrencia', 'qth', 'sentido', 'localArea', 'tipoObra', 'qraResponsavel', 'baixaFrequencia', 'qtrInicio', 'qtrTermino', 'qthInicio', 'qthTermino', 'auxilios', 'observacoes'],
    '/ocorrencias/to11': ['rodovia', 'ocorrencia', 'tipoPanes', 'qth', 'sentido', 'localArea', '---VEHICLES---', 'vtrApoio', 'vtrApoioDescricao', 'danoPatrimonio', 'danoPatrimonioDescricao', 'observacoes', 'auxilios'],
    '/ocorrencias/to12': ['equipe', 'medicoRegulador', 'data', 'condutor', 'resgatista1', 'resgatista2', 'acionamento', 'chegadaLocal', 'numOcorrencia', 'rodovia', 'km', 'sentido', 'saidaLocal', 'saidaHospital', 'chegadaHospital', 'chegadaBSO', 'nomeUsuario', 'sexo', 'idade', 'dn', 'tel', 'cpf', 'rg', 'endereco', 'acompanhante', 'posicaoVeiculo', 'eventoClinico', 'eventoClinicoOutros', 'condicaoInicial', 'hemorragiaExsanguinante', 'viasAereas', 'viasAereasObstruidasPor', 'ventilacao', 'detalhesVentilacao', 'pulso', 'pele', 'perfusao', 'sangramentoAtivo', 'glasgowInicial', 'pupilas', 'fotorreagentes', 'exposicao', 'hipotermia', 'lesoesAparentes', 'alergias', 'medicamentosEmUso', 'comorbidades', 'ultimaRefeicao', 'sinaisVitaisPA', 'sinaisVitaisFC', 'sinaisVitaisFR', 'sinaisVitaisSatO2', 'sinaisVitaisTAX', 'sinaisVitaisDXT', 'avaliacaoCraniocaudal', 'glasgowOcular', 'glasgowVerbal', 'glasgowMotora', 'imobilizacao', 'pranchamento', 'procedimentos', 'procedimentosOutros', 'rolValores', 'responsavelValores', 'equipamentosRetidos', 'responsavelEquipamentos', 'conduta', 'removidoPorTerceiros', 'removidoHospital', 'medicoReguladorConduta', 'codigoConduta', 'medicoReceptor', 'termoRecusaNome', 'termoRecusaCPF', 'termoRecusaRG', 'termoRecusaEndereco', 'termoRecusaResponsavelPor', 'termoRecusaParentesco', 'termoRecusaTestemunha1', 'termoRecusaTestemunha2', 'materiais', 'relatorioObservacoes'],
    '/ocorrencias/to15/faixa-de-dominio': ['rodovia', 'ocorrencia', 'qth', 'sentido', 'localArea', '---VEHICLES---', 'vtrApoio', 'vtrApoioDescricao', 'danoPatrimonio', 'danoPatrimonioDescricao', 'observacoes', 'auxilios'],
    '/ocorrencias/to16': ['equipe', 'medicoRegulador', 'data', 'condutor', 'resgatista1', 'resgatista2', 'acionamento', 'chegadaLocal', 'numOcorrencia', 'rodovia', 'km', 'sentido', 'saidaLocal', 'saidaHospital', 'chegadaHospital', 'chegadaBSO', 'nomeUsuario', 'sexo', 'idade', 'dn', 'tel', 'cpf', 'rg', 'endereco', 'acompanhante', 'posicaoVeiculo', 'eventoClinico', 'eventoClinicoOutros', 'condicaoInicial', 'hemorragiaExsanguinante', 'viasAereas', 'viasAereasObstruidasPor', 'ventilacao', 'detalhesVentilacao', 'pulso', 'pele', 'perfusao', 'sangramentoAtivo', 'glasgowInicial', 'pupilas', 'fotorreagentes', 'exposicao', 'hipotermia', 'lesoesAparentes', 'alergias', 'medicamentosEmUso', 'comorbidades', 'ultimaRefeicao', 'sinaisVitaisPA', 'sinaisVitaisFC', 'sinaisVitaisFR', 'sinaisVitaisSatO2', 'sinaisVitaisTAX', 'sinaisVitaisDXT', 'avaliacaoCraniocaudal', 'glasgowOcular', 'glasgowVerbal', 'glasgowMotora', 'imobilizacao', 'pranchamento', 'procedimentos', 'procedimentosOutros', 'rolValores', 'responsavelValores', 'equipamentosRetidos', 'responsavelEquipamentos', 'conduta', 'removidoPorTerceiros', 'removidoHospital', 'medicoReguladorConduta', 'codigoConduta', 'medicoReceptor', 'termoRecusaNome', 'termoRecusaCPF', 'termoRecusaRG', 'termoRecusaEndereco', 'termoRecusaResponsavelPor', 'termoRecusaParentesco', 'termoRecusaTestemunha1', 'termoRecusaTestemunha2', 'materiais', 'relatorioObservacoes'],
    '/ocorrencias/to17': ['rodovia', 'ocorrencia', 'qth', 'sentido', 'localArea', 'vtrApoio', 'vtrApoioDescricao', 'observacoes', 'auxilios'],
    '/ocorrencias/to19': ['rodovia', 'ocorrencia', 'tipoPanes', 'qth', 'sentido', 'localArea', '---VEHICLES---', 'vtrApoio', 'vtrApoioDescricao', 'danoPatrimonio', 'danoPatrimonioDescricao', 'observacoes', 'auxilios'],
    '/ocorrencias/to32': ['rodovia', 'ocorrencia', 'qth', 'sentido', 'localArea', 'tipoObra', 'qraResponsavel', 'baixaFrequencia', 'qtrInicio', 'qtrTermino', 'qthInicio', 'qthTermino', 'auxilios', 'observacoes'],
    '/ocorrencias/to33': ['rodovia', 'ocorrencia', 'tipoPanes', 'qth', 'sentido', 'localArea', '---VEHICLES---', 'vtrApoio', 'vtrApoioDescricao', 'danoPatrimonio', 'danoPatrimonioDescricao', 'observacoes', 'auxilios'],
    '/ocorrencias/to34': ['rodovia', 'ocorrencia', 'qth', 'sentido', 'localArea', 'qthInicio', 'qthTermino', 'dimensoes', 'quantidade', 'vtrApoio', 'vtrApoioDescricao', 'observacoes', 'auxilios'],
    '/ocorrencias/to35': ['rodovia', 'ocorrencia', 'qth', 'sentido', 'localArea', 'qthInicio', 'qthTermino', 'extensao', 'vtrApoio', 'vtrApoioDescricao', 'observacoes', 'auxilios'],
    '/ocorrencias/to37': ['rodovia', 'ocorrencia', 'qth', 'sentido', 'localArea', 'tipoPlaca', 'acao', 'nomePlaca', 'quantidade', 'vtrApoio', 'vtrApoioDescricao', 'observacoes', 'auxilios'],
    '/ocorrencias/to38': ['rodovia', 'ocorrencia', 'qth', 'sentido', 'localArea', 'tipoPropaganda', 'tipoPropagandaOutros', 'acao', 'mensagem', 'quantidade', 'vtrApoio', 'vtrApoioDescricao', 'observacoes', 'auxilios'],
    '/ocorrencias/to39': ['rodovia', 'ocorrencia', 'qth', 'sentido', 'localArea', '---VEHICLES---', 'vtrApoio', 'vtrApoioDescricao', 'danoPatrimonio', 'danoPatrimonioDescricao', 'observacoes', 'auxilios'],
    '/ocorrencias/to50': ['rodovia', 'ocorrencia', 'qth', 'sentido', 'localArea', 'tipoServico', 'qraResponsavel', 'baixaFrequencia', 'rg', 'cpf', 'qtrInicio', 'qtrTermino', 'auxilios', 'observacoes'],
    '/ocorrencias/qud-operacao': ['rodovia', 'ocorrencia', 'tipoPanes', 'qth', 'sentido', 'localArea', '---VEHICLES---', 'vtrApoio', 'vtrApoioDescricao', 'danoPatrimonio', 'danoPatrimonioDescricao', 'observacoes', 'auxilios'],
    '/ocorrencias/qud-resgate': ['equipe', 'medicoRegulador', 'data', 'condutor', 'resgatista1', 'resgatista2', 'acionamento', 'chegadaLocal', 'numOcorrencia', 'rodovia', 'km', 'sentido', 'saidaLocal', 'saidaHospital', 'chegadaHospital', 'chegadaBSO', 'nomeUsuario', 'sexo', 'idade', 'dn', 'tel', 'cpf', 'rg', 'endereco', 'acompanhante', 'posicaoVeiculo', 'tipoEvento', 'eventoTrauma', 'eventoTraumaOutros', 'eventoClinico', 'eventoClinicoOutros', 'condicoesSeguranca', 'condicoesSegurancaOutros', 'cinematicaVeiculo', 'cinematicaPlaca', 'condicaoInicial', 'hemorragiaExsanguinante', 'viasAereas', 'viasAereasObstruidasPor', 'ventilacao', 'detalhesVentilacao', 'pulso', 'pele', 'perfusao', 'sangramentoAtivo', 'glasgowInicial', 'pupilas', 'fotorreagentes', 'exposicao', 'hipotermia', 'lesoesAparentes', 'alergias', 'medicamentosEmUso', 'comorbidades', 'ultimaRefeicao', 'sinaisVitaisPA', 'sinaisVitaisFC', 'sinaisVitaisFR', 'sinaisVitaisSatO2', 'sinaisVitaisTAX', 'sinaisVitaisDXT', 'avaliacaoCraniocaudal', 'glasgowOcular', 'glasgowVerbal', 'glasgowMotora', 'imobilizacao', 'pranchamento', 'procedimentos', 'procedimentosOutros', 'rolValores', 'responsavelValores', 'equipamentosRetidos', 'responsavelEquipamentos', 'conduta', 'removidoPorTerceiros', 'removidoHospital', 'medicoReguladorConduta', 'codigoConduta', 'medicoReceptor', 'termoRecusaNome', 'termoRecusaCPF', 'termoRecusaRG', 'termoRecusaEndereco', 'termoRecusaResponsavelPor', 'termoRecusaParentesco', 'termoRecusaTestemunha1', 'termoRecusaTestemunha2', 'materiais', 'relatorioObservacoes'],
    '/ocorrencias/tracado-de-pista': ['rodovia', 'qthExato', 'sentido', 'faixaInterditada', 'provavelCinematica', 'provavelCinematicaOutros', 'veiculos', 'quantidadeVitimas', 'potencialGravidadePrevia', 'recursosAdicionaisPrevia', 'cinematica', 'cinematicaOutros', 'energia', 'avarias', 'posicaoVeiculo', 'quantidadeVitimasConfirmacao', 'potencialGravidadeAbordagem', 'cod61_62', 'recursosAdicionaisConfirmacao', 'recursosAdicionaisConfirmacaoOutros', 'condicoesMeteorologicas', 'condicaoVisibilidade', 'condicoesEspeciais', 'condicoesEspeciaisOutros', 'condicoesSinalizacao', 'condicoesSinalizacaoOutros', 'tipoPista', 'tracadoPista', 'perfil', 'obrasNaPista', 'condicaoPista', 'obstaculoCanteiroCentral', 'obstaculoCanteiroCentralOutros', 'obstaculoAcostamento', 'obstaculoAcostamentoOutros', 'obrasNoAcostamento', 'estadoConservacao', 'intersecoesPista', 'deficienciaObras', 'deficienciaObrasOutros', 'obrasDeArte', 'local', 'sinalizacaoVertical', 'sinalizacaoHorizontal', 'sinalizacaoSemaforo'],
};

const ReportField = ({ fieldKey, value }: { fieldKey: string; value: any; }) => {
  if (value === null || value === undefined || value === 'NILL' || (Array.isArray(value) && value.length === 0) || value === '') {
    return null;
  }

  const renderValue = (val: any) => {
    if (typeof val === 'boolean') {
      return val ? 'SIM' : 'NÃO';
    }
    if (Array.isArray(val)) {
      return val.join(', ').toUpperCase();
    }
    return String(val).toUpperCase();
  };

  return (
    <p>
      <span className="font-semibold text-foreground">{formatLabel(fieldKey)}:</span>{' '}
      {renderValue(value)}
    </p>
  );
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
    let text = `*${ocorrencia.type.toUpperCase()}*\n\n`;
    
    const report = ocorrencia.fullReport;
    const fieldOrder = fieldOrders[ocorrencia.formPath] || Object.keys(report);
    
    const renderValueForShare = (value: any): string => {
        if (typeof value === 'boolean') return value ? 'SIM' : 'NÃO';
        if (Array.isArray(value)) return value.join(', ').toUpperCase();
        return String(value).toUpperCase();
    }
    
    fieldOrder.forEach(key => {
        if (key === '---VEHICLES---') {
            if (Array.isArray(report.vehicles) && report.vehicles.length > 0) {
                const vehicleOrder = ocorrencia.formPath === '/ocorrencias/qud-operacao' || ocorrencia.formPath === '/ocorrencias/to11' || ocorrencia.formPath === '/ocorrencias/to19' ? vehicleWithPersonalDataFieldOrder : vehicleFieldOrder;
                report.vehicles.forEach((vehicle: any, index: number) => {
                    let vehicleText = '';
                    vehicleOrder.forEach(vKey => {
                        const value = vehicle[vKey];
                        if (value != null && value !== '' && value !== 'NILL' && !(Array.isArray(value) && value.length === 0)) {
                            vehicleText += `*${formatLabel(vKey).toUpperCase()}:* ${renderValueForShare(value)}\n`;
                        }
                    });
                    if (vehicleText) {
                        text += `*DADOS DO VEÍCULO ${index + 1}*\n${vehicleText}\n`;
                    }
                });
            }
        } else if (key !== 'vehicles') {
            const value = report[key];
             if (value != null && value !== '' && value !== 'NILL' && !(Array.isArray(value) && value.length === 0)) {
                text += `*${formatLabel(key).toUpperCase()}:* ${renderValueForShare(value)}\n`;
            }
        }
    });

    if (report.numeroOcorrencia && report.numeroOcorrencia !== 'NILL') {
      text += `*NÚMERO DA OCORRÊNCIA:* ${report.numeroOcorrencia.toUpperCase()}\n`;
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

      {ocorrencias.length === 0 ? (
        <div className="col-span-full text-center text-muted-foreground py-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
          <ShieldAlert className="h-12 w-12 mb-4 text-primary" />
          <h3 className="text-2xl font-semibold text-foreground">Nenhuma ocorrência registrada</h3>
          <p className="text-lg">Comece a registrar novas ocorrências para visualizá-las aqui.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ocorrencias.map((ocorrencia) => {
            const isExpanded = expandedCards.has(ocorrencia.id);
            const fieldOrder = fieldOrders[ocorrencia.formPath] || Object.keys(ocorrencia.fullReport);
            const vehicleOrder = ocorrencia.formPath === '/ocorrencias/qud-operacao' || ocorrencia.formPath === '/ocorrencias/to11' || ocorrencia.formPath === '/ocorrencias/to19' ? vehicleWithPersonalDataFieldOrder : vehicleFieldOrder;

            return (
              <Card key={ocorrencia.id} className="flex flex-col shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10 transition-all duration-300">
                <div onClick={() => toggleCardExpansion(ocorrencia.id)} className="cursor-pointer flex-grow">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-lg font-bold">{ocorrencia.codOcorrencia}</CardTitle>
                      <CardDescription className="text-xs">{ocorrencia.type}</CardDescription>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" className="shrink-0" onClick={(e) => e.stopPropagation()}>
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
                  </CardHeader>
                  <CardContent className="space-y-3 pt-2">
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Route className="h-4 w-4 text-primary" />
                          <span><span className="font-semibold text-foreground">Rodovia:</span> {ocorrencia.rodovia}</span>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span><span className="font-semibold text-foreground">KM:</span> {ocorrencia.km}</span>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span><span className="font-semibold text-foreground">Data:</span> {ocorrencia.timestamp}</span>
                      </div>
                  </CardContent>
                </div>

                {isExpanded && (
                  <div className="flex flex-col flex-grow">
                    <CardContent className="border-t pt-4 mt-4 flex-grow">
                        <ScrollArea className="h-96 pr-4">
                           <h4 className="font-semibold text-lg text-foreground mb-4 border-b pb-2">Relatório Completo</h4>
                            {fieldOrder.map(key => {
                                if (key === '---VEHICLES---') {
                                    return Array.isArray(ocorrencia.fullReport.vehicles) && ocorrencia.fullReport.vehicles.map((vehicle: any, index: number) => (
                                        <Card key={index} className="pt-2 mt-4 bg-muted/50 shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2 text-base"><Car className="h-5 w-5"/> Veículo {index + 1}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-1 text-xs">
                                                {vehicleOrder.map(vKey => {
                                                    if (!(vKey in vehicle)) return null;
                                                    return <ReportField key={`${index}-${vKey}`} fieldKey={vKey} value={vehicle[vKey]} />;
                                                })}
                                            </CardContent>
                                        </Card>
                                    ));
                                }

                                if (key === 'vehicles' || !(key in ocorrencia.fullReport)) return null;
                                return <ReportField key={key} fieldKey={key} value={ocorrencia.fullReport[key]} />;
                            })}
                            {ocorrencia.numeroOcorrencia && ocorrencia.numeroOcorrencia !== 'NILL' && (
                                <div className="pt-2 mt-4 border-t">
                                    <p className="font-semibold text-foreground">
                                        Número da Ocorrência:{' '}
                                        <span className="font-mono bg-accent p-1 rounded-md">{String(ocorrencia.numeroOcorrencia).toUpperCase()}</span>
                                    </p>
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="flex gap-2 border-t pt-4 mt-auto">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(ocorrencia)}>
                        <Edit className="mr-2 h-4 w-4"/> Editar
                      </Button>
                       <Button variant="default" size="sm" onClick={() => handleShare(ocorrencia)} className="bg-green-600 hover:bg-green-700" disabled={!ocorrencia.numeroOcorrencia || ocorrencia.numeroOcorrencia === 'NILL'}>
                        <Share2 className="mr-2 h-4 w-4"/> Compartilhar
                      </Button>
                    </CardFooter>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  );
}
