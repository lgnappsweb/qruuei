'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Control, useWatch, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

// Schema definition
const materialSchema = z.object({
  nome: z.string().min(1, "Nome do material é obrigatório."),
  quantidade: z.string().min(1, "Quantidade é obrigatória."),
});

const formSchema = z.object({
  // DADOS OPERACIONAIS
  equipe: z.string().optional(),
  medicoRegulador: z.string().optional(),
  data: z.string().optional(),
  condutor: z.string().optional(),
  resgatista1: z.string().optional(),
  resgatista2: z.string().optional(),
  acionamento: z.string().optional(),
  chegadaLocal: z.string().optional(),
  numOcorrencia: z.string().optional(),
  rodovia: z.string().optional(),
  km: z.string().optional(),
  sentido: z.string().optional(),
  saidaLocal: z.string().optional(),
  saidaHospital: z.string().optional(),
  chegadaHospital: z.string().optional(),
  chegadaBSO: z.string().optional(),

  // DADOS CADASTRAIS
  nomeUsuario: z.string().optional(),
  sexo: z.string().optional(),
  idade: z.string().optional(),
  dn: z.string().optional(),
  tel: z.string().optional(),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  endereco: z.string().optional(),
  acompanhante: z.string().optional(),
  posicaoVeiculo: z.string().optional(),

  // EVENTO
  eventoClinico: z.array(z.string()).optional(),
  eventoClinicoOutros: z.string().optional(),
  condicaoInicial: z.array(z.string()).optional(),

  // AVALIAÇÃO PRIMÁRIA
  hemorragiaExsanguinante: z.string().optional(),
  viasAereas: z.string().optional(),
  viasAereasObstruidasPor: z.string().optional(),
  ventilacao: z.string().optional(),
  detalhesVentilacao: z.array(z.string()).optional(),
  pulso: z.array(z.string()).optional(),
  pele: z.array(z.string()).optional(),
  perfusao: z.string().optional(),
  sangramentoAtivo: z.string().optional(),
  glasgowInicial: z.string().optional(),
  pupilas: z.string().optional(),
  fotorreagentes: z.string().optional(),
  exposicao: z.string().optional(),
  hipotermia: z.string().optional(),
  lesoesAparentes: z.string().optional(),
  
  // AVALIAÇÃO SECUNDÁRIA
  alergias: z.string().optional(),
  medicamentosEmUso: z.string().optional(),
  comorbidades: z.string().optional(),
  ultimaRefeicao: z.string().optional(),
  sinaisVitaisPA: z.string().optional(),
  sinaisVitaisFC: z.string().optional(),
  sinaisVitaisFR: z.string().optional(),
  sinaisVitaisSatO2: z.string().optional(),
  sinaisVitaisTAX: z.string().optional(),
  sinaisVitaisDXT: z.string().optional(),
  avaliacaoCraniocaudal: z.string().optional(),

  // GLASGOW
  glasgowOcular: z.string().optional(),
  glasgowVerbal: z.string().optional(),
  glasgowMotora: z.string().optional(),
  
  // IMOBILIZAÇÃO
  imobilizacao: z.array(z.string()).optional(),
  pranchamento: z.string().optional(),

  // PROCEDIMENTOS
  procedimentos: z.array(z.string()).optional(),
  procedimentosOutros: z.string().optional(),

  // DESFECHO
  rolValores: z.string().optional(),
  responsavelValores: z.string().optional(),
  equipamentosRetidos: z.string().optional(),
  responsavelEquipamentos: z.string().optional(),
  conduta: z.string().optional(),
  removidoPorTerceiros: z.string().optional(),
  removidoHospital: z.string().optional(),
  medicoReguladorConduta: z.string().optional(),
  codigoConduta: z.string().optional(),
  medicoReceptor: z.string().optional(),
  
  // TERMO DE RECUSA
  termoRecusaNome: z.string().optional(),
  termoRecusaCPF: z.string().optional(),
  termoRecusaRG: z.string().optional(),
  termoRecusaEndereco: z.string().optional(),
  termoRecusaResponsavelPor: z.string().optional(),
  termoRecusaParentesco: z.string().optional(),
  termoRecusaTestemunha1: z.string().optional(),
  termoRecusaTestemunha2: z.string().optional(),
  
  // MATERIAIS E OBSERVAÇÕES
  materiais: z.array(materialSchema).optional(),
  relatorioObservacoes: z.string().optional(),
});
type FormValues = z.infer<typeof formSchema>;

const fillEmptyWithNill = (data: any): any => {
    if (Array.isArray(data)) {
        if (data.length === 0) return 'NILL';
        if (typeof data[0] === 'object' && data[0] !== null) {
          return data.map(item => fillEmptyWithNill(item));
        }
        return data;
    }
    if (data && typeof data === 'object' && Object.keys(data).length > 0) {
        const newObj: {[key: string]: any} = {};
        Object.keys(data).forEach(key => {
            newObj[key] = fillEmptyWithNill(data[key]);
        });
        return newObj;
    }
    if (data === '' || data === undefined || data === null) {
        return 'NILL';
    }
    return data;
};

const PreviewDialog = ({ data, onClose, onSave, formTitle }: { data: any | null; onClose: () => void; onSave: (data: any) => void; formTitle: string; }) => {
    const [numeroOcorrencia, setNumeroOcorrencia] = React.useState('');
    const isMobile = useIsMobile();
    if (!data) return null;

    const handleSaveClick = () => {
        const dataToSave = {
            ...data,
            numeroOcorrencia: numeroOcorrencia || 'NILL',
        };
        onSave(dataToSave);
    };

    const formatLabel = (key: string) => {
        const result = key.replace(/([A-Z])/g, " $1");
        return result.charAt(0).toUpperCase() + result.slice(1);
    };

    const renderSimpleValue = (value: any): string => {
        if (typeof value === 'boolean') {
        return value ? 'SIM' : 'NÃO';
        }
        if (Array.isArray(value)) {
            if (value.length === 0) return 'NILL';
            return value.join(', ').toUpperCase();
        }
        return String(value).toUpperCase();
    }

    const Field = ({ label, value }: { label: string, value: any}) => (
      value !== 'NILL' && value !== '' && (!Array.isArray(value) || value.length > 0) ? (
        <div className="flex flex-col sm:flex-row sm:items-start">
            <div className="font-semibold text-muted-foreground mr-2 whitespace-nowrap">{formatLabel(label)}:</div>
            <div className="text-foreground font-mono break-words uppercase flex-1 text-left">{renderSimpleValue(value)}</div>
        </div>
      ) : null
    );

    const MaterialItem = ({ item, index }: { item: any, index: number }) => (
        <Card key={index} className="mt-4">
            <CardHeader><CardTitle>Material {index + 1}</CardTitle></CardHeader>
            <CardContent className="pt-6">
                <div className="text-xl space-y-4">
                    <Field label="nome" value={item.nome} />
                    <Field label="quantidade" value={item.quantidade} />
                </div>
            </CardContent>
        </Card>
    )

    const occurrenceCode = formTitle.match(/\(([^)]+)\)/)?.[1] || formTitle.split(' ')[0] || "Relatório";

    const sections: {title: string, fields: (keyof FormValues)[]}[] = [
        { title: "Dados Operacionais", fields: ['equipe', 'medicoRegulador', 'data', 'condutor', 'resgatista1', 'resgatista2', 'acionamento', 'chegadaLocal', 'numOcorrencia', 'rodovia', 'km', 'sentido', 'saidaLocal', 'saidaHospital', 'chegadaHospital', 'chegadaBSO']},
        { title: "Dados Cadastrais do Usuário", fields: ['nomeUsuario', 'sexo', 'idade', 'dn', 'tel', 'cpf', 'rg', 'endereco', 'acompanhante', 'posicaoVeiculo']},
        { title: "Evento", fields: ['eventoClinico', 'eventoClinicoOutros', 'condicaoInicial']},
        { title: "Avaliação Primária (XABCDE)", fields: ['hemorragiaExsanguinante', 'viasAereas', 'viasAereasObstruidasPor', 'ventilacao', 'detalhesVentilacao', 'pulso', 'pele', 'perfusao', 'sangramentoAtivo', 'glasgowInicial', 'pupilas', 'fotorreagentes', 'exposicao', 'hipotermia', 'lesoesAparentes']},
        { title: "Avaliação Secundária e Sinais Vitais", fields: ['alergias', 'medicamentosEmUso', 'comorbidades', 'ultimaRefeicao', 'sinaisVitaisPA', 'sinaisVitaisFC', 'sinaisVitaisFR', 'sinaisVitaisSatO2', 'sinaisVitaisTAX', 'sinaisVitaisDXT', 'avaliacaoCraniocaudal']},
        { title: "Glasgow e Procedimentos", fields: ['glasgowOcular', 'glasgowVerbal', 'glasgowMotora', 'imobilizacao', 'pranchamento', 'procedimentos', 'procedimentosOutros']},
        { title: "Desfecho e Observações", fields: ['rolValores', 'responsavelValores', 'equipamentosRetidos', 'responsavelEquipamentos', 'conduta', 'removidoPorTerceiros', 'removidoHospital', 'medicoReguladorConduta', 'codigoConduta', 'medicoReceptor', 'relatorioObservacoes']},
    ];

    const termoRecusaFields: (keyof FormValues)[] = ['termoRecusaNome', 'termoRecusaCPF', 'termoRecusaRG', 'termoRecusaEndereco', 'termoRecusaResponsavelPor', 'termoRecusaParentesco', 'termoRecusaTestemunha1', 'termoRecusaTestemunha2'];

    return (
        <Dialog open={!!data} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader className="text-center pt-6">
                    <DialogTitle className="text-3xl font-bold">{`Pré-visualização (${occurrenceCode})`}</DialogTitle>
                    <DialogDescription>Confira os dados antes de salvar.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 pr-6 -mr-6 mt-4">
                    <div className="space-y-6">
                        {sections.map(section => (
                            <Card key={section.title}>
                                <CardHeader><CardTitle>{section.title}</CardTitle></CardHeader>
                                <CardContent className="pt-6">
                                    <div className="text-xl space-y-4">
                                        {section.fields.map(key => <Field key={String(key)} label={String(key)} value={data[key]} />)}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        { (data.conduta === 'recusa_atendimento' || data.conduta === 'recusa_remocao') &&
                            <Card className="border-destructive">
                                <CardHeader><CardTitle className="text-destructive">Termo de Recusa</CardTitle></CardHeader>
                                <CardContent className="pt-6">
                                    <div className="text-xl space-y-4">
                                        {termoRecusaFields.map(key => <Field key={String(key)} label={String(key)} value={data[key]} />)}
                                    </div>
                                </CardContent>
                            </Card>
                        }

                        {data.materiais && Array.isArray(data.materiais) && data.materiais.length > 0 && (
                            <Card>
                                <CardHeader><CardTitle>Consumo de Materiais</CardTitle></CardHeader>
                                <CardContent className="pt-6">{data.materiais.map((item: any, index: number) => <MaterialItem key={index} item={item} index={index} />)}</CardContent>
                            </Card>
                        )}
                        <Card className="mt-6 border-2 border-primary shadow-lg bg-primary/10">
                            <CardHeader>
                                <CardTitle className="text-white text-center text-2xl">NÚMERO DA OCORRÊNCIA</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Input
                                    value={numeroOcorrencia}
                                    onChange={(e) => setNumeroOcorrencia(e.target.value.toUpperCase())}
                                    placeholder={isMobile ? 'INSIRA O NÚMERO' : 'INSIRA O NÚMERO DA OCORRÊNCIA'}
                                    className="text-center text-2xl font-bold h-16 bg-background border-primary focus-visible:ring-primary"
                                />
                            </CardContent>
                        </Card>
                    </div>
                </ScrollArea>
                <DialogFooter className="mt-4 pt-4 border-t">
                    <Button variant="outline" onClick={onClose}>Editar</Button>
                    <Button onClick={handleSaveClick}>Confirmar e Salvar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Reusable components
function CheckboxGroupField({ control, name, label, options }: { control: Control<FormValues>, name: keyof FormValues, label: string, options: { id: string, label: string }[] }) {
    return (
      <FormItem>
        <div className="mb-4">
          <FormLabel className="text-xl">{label}</FormLabel>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {options.map((item) => (
            <FormField
              key={item.id}
              control={control}
              name={name as any}
              render={({ field }) => {
                const fieldValue = Array.isArray(field.value) ? field.value : [];
                return (
                  <FormItem
                    key={item.id}
                    className="flex flex-row items-center space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        className="h-8 w-8"
                        checked={fieldValue.includes(item.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...fieldValue, item.id])
                            : field.onChange(
                                fieldValue.filter(
                                  (value: string) => value !== item.id
                                )
                              )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal text-lg">
                      {item.label}
                    </FormLabel>
                  </FormItem>
                )
              }}
            />
          ))}
        </div>
        <FormMessage />
      </FormItem>
    );
}

function RadioGroupField({ control, name, label, options, orientation = 'vertical' }: { control: Control<FormValues>, name: keyof FormValues, label: string, options: { value: string, label: string }[], orientation?: 'vertical' | 'horizontal' }) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel className="text-xl">{label}</FormLabel>
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className={cn("flex", orientation === 'vertical' ? "flex-col space-y-2" : "flex-wrap gap-x-6 gap-y-2")}
                        >
                            {options.map((option) => (
                                <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value={option.value} className="h-8 w-8"/>
                                    </FormControl>
                                    <FormLabel className="font-normal text-lg">
                                        {option.label}
                                    </FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}

function GlasgowScale({ control }: { control: Control<FormValues> }) {
  const ocular = useWatch({ control, name: 'glasgowOcular' });
  const verbal = useWatch({ control, name: 'glasgowVerbal' });
  const motora = useWatch({ control, name: 'glasgowMotora' });

  const total = React.useMemo(() => {
    return (parseInt(ocular || '0') || 0) + (parseInt(verbal || '0') || 0) + (parseInt(motora || '0') || 0);
  }, [ocular, verbal, motora]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Escala de Glasgow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroupField control={control} name="glasgowOcular" label="Abertura Ocular" options={[
          { value: '4', label: '04 - Espontânea' },
          { value: '3', label: '03 - Estímulo Verbal' },
          { value: '2', label: '02 - Estímulo Doloroso' },
          { value: '1', label: '01 - Ausente' },
        ]} />
        <RadioGroupField control={control} name="glasgowVerbal" label="Resposta Verbal" options={[
          { value: '5', label: '05 - Orientado' },
          { value: '4', label: '04 - Confuso' },
          { value: '3', label: '03 - Palavras Inapropriadas' },
          { value: '2', label: '02 - Sons Incompreensíveis' },
          { value: '1', label: '01 - Ausente' },
        ]} />
        <RadioGroupField control={control} name="glasgowMotora" label="Resposta Motora" options={[
          { value: '6', label: '06 - Obedece a Comandos' },
          { value: '5', label: '05 - Localiza a Dor' },
          { value: '4', label: '04 - Retira o Membro à Dor' },
          { value: '3', label: '03 - Decorticação (Flexão Anormal)' },
          { value: '2', label: '02 - Descerebração (Extensão Anormal)' },
          { value: '1', label: '01 - Ausente' },
        ]} />
        <div className="flex items-center justify-end space-x-4 pt-4">
            <h3 className="text-xl font-bold">TOTAL:</h3>
            <div className="flex h-14 w-24 items-center justify-center rounded-md border bg-muted text-3xl font-bold">
                {total > 0 ? total : '-'}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main page component
export default function OcorrenciaTO12Page() {
  const { toast } = useToast();
  const [previewData, setPreviewData] = React.useState<FormValues | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Set all default values to empty strings to avoid uncontrolled component error
      rodovia: '',
      km: '',
      sentido: '',
      equipe: '',
      medicoRegulador: '',
      condutor: '',
      resgatista1: '',
      resgatista2: '',
      data: '',
      numOcorrencia: '',
      acionamento: '',
      chegadaLocal: '',
      saidaLocal: '',
      chegadaHospital: '',
      saidaHospital: '',
      chegadaBSO: '',
      nomeUsuario: '',
      idade: '',
      dn: '',
      sexo: '',
      cpf: '',
      rg: '',
      tel: '',
      endereco: '',
      acompanhante: '',
      posicaoVeiculo: '',
      eventoClinico: [],
      eventoClinicoOutros: '',
      condicaoInicial: [],
      hemorragiaExsanguinante: '',
      viasAereas: '',
      viasAereasObstruidasPor: '',
      ventilacao: '',
      detalhesVentilacao: [],
      pulso: [],
      pele: [],
      perfusao: '',
      sangramentoAtivo: '',
      glasgowInicial: '',
      pupilas: '',
      fotorreagentes: '',
      exposicao: '',
      hipotermia: '',
      lesoesAparentes: '',
      alergias: '',
      medicamentosEmUso: '',
      comorbidades: '',
      ultimaRefeicao: '',
      sinaisVitaisPA: '',
      sinaisVitaisFC: '',
      sinaisVitaisFR: '',
      sinaisVitaisSatO2: '',
      sinaisVitaisTAX: '',
      sinaisVitaisDXT: '',
      avaliacaoCraniocaudal: '',
      glasgowOcular: '',
      glasgowVerbal: '',
      glasgowMotora: '',
      imobilizacao: [],
      pranchamento: '',
      procedimentos: [],
      procedimentosOutros: '',
      rolValores: '',
      responsavelValores: '',
      equipamentosRetidos: '',
      responsavelEquipamentos: '',
      conduta: '',
      removidoPorTerceiros: '',
      removidoHospital: '',
      medicoReguladorConduta: '',
      codigoConduta: '',
      medicoReceptor: '',
      termoRecusaNome: '',
      termoRecusaCPF: '',
      termoRecusaRG: '',
      termoRecusaEndereco: '',
      termoRecusaResponsavelPor: '',
      termoRecusaParentesco: '',
      termoRecusaTestemunha1: '',
      termoRecusaTestemunha2: '',
      materiais: [],
      relatorioObservacoes: '',
    },
  });

  const watchConduta = useWatch({ control: form.control, name: 'conduta'});

  const { fields: materialFields, append: appendMaterial, remove: removeMaterial } = useFieldArray({
    control: form.control,
    name: "materiais",
  });

  function onSubmit(values: FormValues) {
    const processedValues = fillEmptyWithNill(values);
    setPreviewData(processedValues);
  }

  function handleSave(data: FormValues) {
    console.log("Saving data:", data);
    toast({
      title: 'Formulário Enviado',
      description: 'Ocorrência TO12 (Atendimento Clínico) registrada com sucesso!',
    });
    setPreviewData(null);
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-24">
      <Button asChild variant="ghost" className="pl-0">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o início
        </Link>
      </Button>

      <div className="space-y-2 text-center">
        <h1 className="font-condensed text-3xl font-bold tracking-tight">
          TO12 - ATENDIMENTO CLÍNICO
        </h1>
        <p className="text-muted-foreground">
          Preencha os campos abaixo para registrar a ocorrência.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Accordion type="multiple" className="w-full space-y-4" defaultValue={['item-1']}>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-xl font-bold">DADOS OPERACIONAIS</AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="rodovia" render={({ field }) => (<FormItem><FormLabel>Rodovia</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="MS-112">MS-112</SelectItem><SelectItem value="BR-158">BR-158</SelectItem><SelectItem value="MS-306">MS-306</SelectItem><SelectItem value="BR-436">BR-436</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="km" render={({ field }) => (<FormItem><FormLabel>KM</FormLabel><FormControl><Input placeholder="Ex: 123+400" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                         </div>
                         <RadioGroupField control={form.control} name="sentido" label="Sentido" options={[{value: 'Norte', label: 'Norte'}, {value: 'Sul', label: 'Sul'}]} orientation="horizontal" />
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField control={form.control} name="equipe" render={({ field }) => (<FormItem><FormLabel>Equipe</FormLabel><FormControl><Input placeholder="Ex: Bravo-01" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="medicoRegulador" render={({ field }) => (<FormItem><FormLabel>Médico Regulador</FormLabel><FormControl><Input placeholder="Ex: Dr. Carlos" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="condutor" render={({ field }) => (<FormItem><FormLabel>Condutor</FormLabel><FormControl><Input placeholder="Ex: João da Silva" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="resgatista1" render={({ field }) => (<FormItem><FormLabel>Resgatista I</FormLabel><FormControl><Input placeholder="Ex: Maria Souza" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="resgatista2" render={({ field }) => (<FormItem><FormLabel>Resgatista II</FormLabel><FormControl><Input placeholder="Ex: Pedro Santos" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="data" render={({ field }) => (<FormItem><FormLabel>Data</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="numOcorrencia" render={({ field }) => (<FormItem><FormLabel>Nº Ocorrência</FormLabel><FormControl><Input placeholder="Ex: 2024-00123" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="acionamento" render={({ field }) => (<FormItem><FormLabel>Acionamento</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="chegadaLocal" render={({ field }) => (<FormItem><FormLabel>Chegada no Local</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="saidaLocal" render={({ field }) => (<FormItem><FormLabel>Saída do Local</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="chegadaHospital" render={({ field }) => (<FormItem><FormLabel>Chegada no Hospital</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                             <FormField control={form.control} name="saidaHospital" render={({ field }) => (<FormItem><FormLabel>Saída do Hospital</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="chegadaBSO" render={({ field }) => (<FormItem><FormLabel>Chegada na BSO/Término</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                         </div>
                    </AccordionContent>
                </AccordionItem>

                 <AccordionItem value="item-2">
                    <AccordionTrigger className="text-xl font-bold">DADOS CADASTRAIS DO USUÁRIO</AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                        <FormField control={form.control} name="nomeUsuario" render={({ field }) => (<FormItem><FormLabel>Nome</FormLabel><FormControl><Input placeholder="Nome completo do usuário" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField control={form.control} name="idade" render={({ field }) => (<FormItem><FormLabel>Idade</FormLabel><FormControl><Input type="number" placeholder="Ex: 35" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={form.control} name="dn" render={({ field }) => (<FormItem><FormLabel>Data Nasc.</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <RadioGroupField control={form.control} name="sexo" label="Sexo" options={[{value: 'M', label: 'M'}, {value: 'F', label: 'F'}]} orientation="horizontal" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              name="cpf"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>CPF</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="000.000.000-00"
                                      {...field}
                                      onChange={(e) => {
                                        const rawValue = e.target.value.replace(/\D/g, '');
                                        let maskedValue = rawValue.substring(0, 11);
                                        if (rawValue.length > 9) {
                                          maskedValue = maskedValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                                        } else if (rawValue.length > 6) {
                                          maskedValue = maskedValue.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
                                        } else if (rawValue.length > 3) {
                                          maskedValue = maskedValue.replace(/(\d{3})(\d{1,3})/, '$1.$2');
                                        }
                                        field.onChange(maskedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              name="rg"
                              control={form.control}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>RG</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="00.000.000-0"
                                      {...field}
                                      onChange={(e) => {
                                        const rawValue = e.target.value.replace(/\D/g, '');
                                        let maskedValue = rawValue.substring(0, 9);
                                        if (rawValue.length > 8) {
                                          maskedValue = maskedValue.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
                                        } else if (rawValue.length > 5) {
                                          maskedValue = maskedValue.replace(/(\d{2})(\d{3})(\d{1,3})/, '$1.$2.$3');
                                        } else if (rawValue.length > 2) {
                                          maskedValue = maskedValue.replace(/(\d{2})(\d{1,3})/, '$1.$2');
                                        }
                                        field.onChange(maskedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                        </div>
                         <FormField
                          control={form.control}
                          name="tel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefone</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="(99) 99999-9999"
                                  {...field}
                                  onChange={(e) => {
                                    let value = e.target.value.replace(/\D/g, "");
                                    value = value.substring(0, 11);
                                    if (value.length > 10) {
                                      value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                                    } else if (value.length > 6) {
                                      value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                                    } else if (value.length > 2) {
                                      value = value.replace(/(\d{2})(\d*)/, '($1) $2');
                                    } else if (value.length > 0) {
                                      value = `(${value}`;
                                    }
                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField control={form.control} name="endereco" render={({ field }) => (<FormItem><FormLabel>Endereço</FormLabel><FormControl><Input placeholder="Rua, Av, etc." {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="acompanhante" render={({ field }) => (<FormItem><FormLabel>Acompanhante</FormLabel><FormControl><Input placeholder="Nome do acompanhante" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="posicaoVeiculo" render={({ field }) => (<FormItem><FormLabel>Posição no Veículo (se aplicável)</FormLabel><FormControl><Input placeholder="Ex: Condutor, Passageiro" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    </AccordionContent>
                </AccordionItem>

                 <AccordionItem value="item-3">
                    <AccordionTrigger className="text-xl font-bold">SOBRE O EVENTO</AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                        <Card className="bg-background/50">
                            <CardHeader><CardTitle>Atendimento Clínico</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                    <CheckboxGroupField control={form.control} name="eventoClinico" label="" options={[
                                    { id: 'mal_subito', label: 'Mal Súbito' },
                                    { id: 'intoxicacao', label: 'Intoxicação Exógena' },
                                    { id: 'parto', label: 'Assistência ao Parto' },
                                    { id: 'convulsao', label: 'Convulsão' },
                                    { id: 'psiquiatrico', label: 'Distúrbio Psiquiátrico' },
                                    { id: 'outros', label: 'Outros' }
                                ]}/>
                                {form.watch('eventoClinico')?.includes('outros') &&
                                    <FormField control={form.control} name="eventoClinicoOutros" render={({ field }) => (<FormItem><FormLabel>Outros (Clínico)</FormLabel><FormControl><Input placeholder="Descreva o atendimento" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                }
                            </CardContent>
                        </Card>
                        <CheckboxGroupField control={form.control} name="condicaoInicial" label="Condição Inicial" options={[
                            { id: 'alerta', label: 'Alerta' },
                            { id: 'deambulando', label: 'Deambulando' },
                            { id: 'verbaliza', label: 'Verbaliza' },
                            { id: 'ao_solo', label: 'Ao Solo' },
                            { id: 'estimulo_doloroso', label: 'Estímulo Doloroso' },
                            { id: 'inconsciente', label: 'Inconsciente' },
                        ]}/>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                    <AccordionTrigger className="text-xl font-bold">AVALIAÇÃO PRIMÁRIA (XABCDE)</AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                        <RadioGroupField control={form.control} name="hemorragiaExsanguinante" label="X - Hemorragia Exsanguinante" options={[{value: 'sim', label: 'Sim'}, {value: 'nao', label: 'Não'}]} orientation="horizontal"/>
                        <FormField control={form.control} name="viasAereas" render={({ field }) => (<FormItem><FormLabel>A - Vias Aéreas</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="pervias">Pérvias</SelectItem><SelectItem value="obstruidas">Obstruídas Por</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
                        {form.watch('viasAereas') === 'obstruidas' && <FormField control={form.control} name="viasAereasObstruidasPor" render={({ field }) => (<FormItem><FormLabel>Obstruídas Por</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />}
                        
                        <RadioGroupField control={form.control} name="ventilacao" label="B - Ventilação" options={[{value: 'presente', label: 'Presente'}, {value: 'ausente', label: 'Ausente'}]} orientation="horizontal"/>
                        <CheckboxGroupField control={form.control} name="detalhesVentilacao" label="Detalhes da Ventilação" options={[
                            {id: 'simetrica', label: 'Simétrica'}, {id: 'assimetrica', label: 'Assimétrica'}, {id: 'apneia', label: 'Apnéia'},
                            {id: 'eupneia', label: 'Eupneia'}, {id: 'taquipneia', label: 'Taquipneia'}, {id: 'gasping', label: 'Gasping'}
                        ]} />

                        <Card>
                          <CardHeader><CardTitle>C - Circulação e Hemorragias</CardTitle></CardHeader>
                          <CardContent className="space-y-4">
                            <CheckboxGroupField control={form.control} name="pulso" label="Pulso" options={[{id: 'presente', label: 'Presente'}, {id: 'cheio', label: 'Cheio'}, {id: 'filiforme', label: 'Filiforme'}]} />
                            <CheckboxGroupField control={form.control} name="pele" label="Pele" options={[{id: 'normal', label: 'Normal'}, {id: 'fria', label: 'Fria'}, {id: 'sudorese', label: 'Sudorese'}]} />
                            <RadioGroupField control={form.control} name="perfusao" label="Perfusão" options={[{value: '<2seg', label: '< 2 Seg'}, {value: '>=2seg', label: '>= 2 Seg'}]} orientation="horizontal" />
                            <RadioGroupField control={form.control} name="sangramentoAtivo" label="Sangramento Ativo" options={[{value: 'sim', label: 'Sim'}, {value: 'nao', label: 'Não'}]} orientation="horizontal" />
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader><CardTitle>D - Neurológico</CardTitle></CardHeader>
                          <CardContent className="space-y-4">
                            <FormField control={form.control} name="glasgowInicial" render={({ field }) => (<FormItem><FormLabel>Glasgow (Inicial)</FormLabel><FormControl><Input placeholder="Ex: 15" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <RadioGroupField control={form.control} name="pupilas" label="Pupilas" options={[{value: 'isocoricas', label: 'Isocóricas'}, {value: 'anisocoricas', label: 'Anisocóricas'}]} orientation="horizontal"/>
                            <RadioGroupField control={form.control} name="fotorreagentes" label="Fotorreagentes" options={[{value: 'sim', label: 'Sim'}, {value: 'nao', label: 'Não'}]} orientation="horizontal"/>
                          </CardContent>
                        </Card>

                        <Card>
                           <CardHeader><CardTitle>E - Exposição</CardTitle></CardHeader>
                           <CardContent className="space-y-4">
                              <RadioGroupField control={form.control} name="exposicao" label="" options={[{value: 'sem_lesoes', label: 'Sem Lesões Aparentes'}, {value: 'lesoes_aparentes', label: 'Lesões Aparentes'}]} />
                              <RadioGroupField control={form.control} name="hipotermia" label="Hipotermia" options={[{value: 'sim', label: 'Sim'}, {value: 'nao', label: 'Não'}]} orientation="horizontal"/>
                              <FormField control={form.control} name="lesoesAparentes" render={({ field }) => (<FormItem><FormLabel>Lesões Aparentes e Queixas Principais</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)}/>
                           </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>

                 <AccordionItem value="item-5">
                    <AccordionTrigger className="text-xl font-bold">AVALIAÇÃO SECUNDÁRIA E SINAIS VITAIS</AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                        <Card>
                            <CardHeader><CardTitle>S.A.M.P.L.E.</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField control={form.control} name="alergias" render={({ field }) => (<FormItem><FormLabel>Alergias</FormLabel><FormControl><Input placeholder="Nega alergias / Dipirona" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name="medicamentosEmUso" render={({ field }) => (<FormItem><FormLabel>Medicamentos em Uso</FormLabel><FormControl><Input placeholder="Nega uso / Losartana" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name="comorbidades" render={({ field }) => (<FormItem><FormLabel>Comorbidades / Gestação</FormLabel><FormControl><Input placeholder="Nega comorbidades / HAS" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name="ultimaRefeicao" render={({ field }) => (<FormItem><FormLabel>Última Refeição / Jejum</FormLabel><FormControl><Input placeholder="Há 2 horas" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Sinais Vitais</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <FormField control={form.control} name="sinaisVitaisPA" render={({ field }) => (<FormItem><FormLabel>PA (mmHg)</FormLabel><FormControl><Input placeholder="120x80" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name="sinaisVitaisFC" render={({ field }) => (<FormItem><FormLabel>FC (bpm)</FormLabel><FormControl><Input placeholder="80" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name="sinaisVitaisFR" render={({ field }) => (<FormItem><FormLabel>FR (rpm)</FormLabel><FormControl><Input placeholder="16" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name="sinaisVitaisSatO2" render={({ field }) => (<FormItem><FormLabel>Sat O² (%)</FormLabel><FormControl><Input placeholder="98" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name="sinaisVitaisTAX" render={({ field }) => (<FormItem><FormLabel>TAX (°C)</FormLabel><FormControl><Input placeholder="36.5" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={form.control} name="sinaisVitaisDXT" render={({ field }) => (<FormItem><FormLabel>DXT (mg/dl)</FormLabel><FormControl><Input placeholder="90" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            </CardContent>
                        </Card>
                        <FormField control={form.control} name="avaliacaoCraniocaudal" render={({ field }) => (<FormItem><FormLabel>Avaliação Crânio-Caudal</FormLabel><FormControl><Textarea placeholder="Ex: Nenhuma anormalidade encontrada." {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    </AccordionContent>
                </AccordionItem>

                 <AccordionItem value="item-6">
                    <AccordionTrigger className="text-xl font-bold">GLASGOW E PROCEDIMENTOS</AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                        <GlasgowScale control={form.control} />
                        <Card>
                            <CardHeader><CardTitle>Imobilização (se aplicável)</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <RadioGroupField control={form.control} name="pranchamento" label="Pranchamento" options={[
                                    {value: 'decubito', label: 'Decúbito'}, {value: 'em_pe', label: 'Em Pé'}
                                ]}/>
                                <CheckboxGroupField control={form.control} name="imobilizacao" label="" options={[
                                    {id: 'colar', label: 'Colar Cervical'},
                                    {id: 'imob_mse', label: 'Imobilização de MSE'},
                                    {id: 'imob_msd', label: 'Imobilização de MSD'},
                                    {id: 'imob_mie', label: 'Imobilização de MIE'},
                                    {id: 'imob_mid', label: 'Imobilização de MID'},
                                    {id: 'imob_pelve', label: 'Imobilização de Pelve'},
                                ]} />
                            </CardContent>
                        </Card>
                         <CheckboxGroupField control={form.control} name="procedimentos" label="Procedimentos Realizados" options={[
                            {id: 'desobstrucao', label: 'Desobstrução de Vias Aéreas'}, {id: 'canula', label: 'Cânula de Guedel'}, {id: 'oxigenio', label: 'Oxigênio (Máscara/Cateter)'},
                            {id: 'ambu', label: 'Ventilação com AMBU'}, {id: 'dea', label: 'DEA'}, {id: 'rcp', label: 'RCP'},
                            {id: 'torniquete', label: 'Torniquete'}, {id: 'curativo', label: 'Curativo Oclusivo/Compressivo'}, {id: 'sinais_vitais', label: 'Aferição de Sinais Vitais'},
                            {id: 'oximetria', label: 'Oximetria de Pulso'}, {id: 'orientacoes', label: 'Orientações'}
                         ]} />
                         <FormField control={form.control} name="procedimentosOutros" render={({ field }) => (<FormItem><FormLabel>Outros Procedimentos</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    </AccordionContent>
                </AccordionItem>

                 <AccordionItem value="item-7">
                    <AccordionTrigger className="text-xl font-bold">DESFECHO E OBSERVAÇÕES</AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                        <RadioGroupField control={form.control} name="conduta" label="Conduta" options={[
                            {value: 'liberacao', label: 'Liberação no Local c/ Orientações'}, {value: 'recusa_atendimento', label: 'Recusa Atendimento'},
                            {value: 'recusa_remocao', label: 'Recusa Remoção'}, {value: 'removido_terceiros', label: 'Removido por Terceiros'},
                            {value: 'removido_hospital', label: 'Removido a Unidade Hospitalar'}, {value: 'obito_local', label: 'Vítima em Óbito'},
                            {value: 'obito_atendimento', label: 'Óbito Durante Atendimento'},
                        ]} />
                        {form.watch('conduta') === 'removido_terceiros' && (
                             <FormField control={form.control} name="removidoPorTerceiros" render={({ field }) => (<FormItem><FormLabel>Removido por</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="COBOM">COBOM</SelectItem><SelectItem value="SAMU">SAMU</SelectItem><SelectItem value="OUTROS">Outros</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
                        )}
                         {form.watch('conduta') === 'removido_hospital' && (
                            <FormField control={form.control} name="removidoHospital" render={({ field }) => (<FormItem><FormLabel>Unidade Hospitalar</FormLabel><FormControl><Input placeholder="Ex: Santa Casa" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                         )}
                        <RadioGroupField control={form.control} name="codigoConduta" label="Código" options={[
                            {value: 'vermelho', label: 'Vermelho'}, {value: 'amarelo', label: 'Amarelo'},
                            {value: 'verde', label: 'Verde'}, {value: 'azul', label: 'Azul'}, {value: 'preto', label: 'Preto'}
                        ]} orientation="horizontal" />
                         <FormField control={form.control} name="medicoReguladorConduta" render={({ field }) => (<FormItem><FormLabel>Médico Regulador/Intervencionista</FormLabel><FormControl><Input placeholder="Ex: Dr. House" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                         <FormField control={form.control} name="medicoReceptor" render={({ field }) => (<FormItem><FormLabel>Médico Receptor</FormLabel><FormControl><Input placeholder="Ex: Dra. Grey" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                         
                         <Card>
                            <CardHeader>
                                <CardTitle>Consumo de Materiais</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                {materialFields.map((item, index) => (
                                <div key={item.id} className="flex items-end gap-2 p-2 border rounded-lg relative md:gap-4 md:p-4">
                                    <div className="grid grid-cols-1 gap-4 flex-1 md:flex-initial md:w-full">
                                        <FormField
                                            control={form.control}
                                            name={`materiais.${index}.nome`}
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Material</FormLabel>
                                                <FormControl>
                                                <Input placeholder="Ex: Gaze" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`materiais.${index}.quantidade`}
                                            render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Quantidade</FormLabel>
                                                <FormControl>
                                                <Input type="number" placeholder="Ex: 10" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => removeMaterial(index)}
                                        className="mb-11"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                        <span className="sr-only">Remover Material</span>
                                    </Button>
                                </div>
                                ))}
                                <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => appendMaterial({ nome: '', quantidade: '' })}
                                >
                                <PlusCircle className="mr-2 h-5 w-5" />
                                Adicionar Material
                                </Button>
                            </CardContent>
                          </Card>
                         <FormField control={form.control} name="relatorioObservacoes" render={({ field }) => (<FormItem><FormLabel>Relatório/Observações</FormLabel><FormControl><Textarea rows={5} placeholder="Descreva o relatório e observações aqui..." {...field} /></FormControl><FormMessage /></FormItem>)}/>
                         <FormField control={form.control} name="rolValores" render={({ field }) => (<FormItem><FormLabel>Rol de Valores/Pertences</FormLabel><FormControl><Textarea rows={3} placeholder="Ex: Celular, carteira, R$ 50,00" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                         <FormField control={form.control} name="responsavelValores" render={({ field }) => (<FormItem><FormLabel>Responsável pelo Recebimento</FormLabel><FormControl><Input placeholder="Nome do responsável" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                         <FormField control={form.control} name="equipamentosRetidos" render={({ field }) => (<FormItem><FormLabel>Equipamentos/Materiais Retidos</FormLabel><FormControl><Textarea rows={3} placeholder="Ex: Colar cervical, prancha rígida" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                         <FormField control={form.control} name="responsavelEquipamentos" render={({ field }) => (<FormItem><FormLabel>Responsável pelo Recebimento</FormLabel><FormControl><Input placeholder="Nome do responsável" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    </AccordionContent>
                 </AccordionItem>

                 {(watchConduta === 'recusa_atendimento' || watchConduta === 'recusa_remocao') && (
                     <AccordionItem value="item-8">
                        <AccordionTrigger className="text-xl font-bold text-destructive">TERMO DE RECUSA</AccordionTrigger>
                        <AccordionContent className="space-y-6 pt-4">
                            <Card className="border-destructive">
                                <CardContent className="pt-6 space-y-4">
                                <p className="text-base text-muted-foreground">
                                    EU, <FormField control={form.control} name="termoRecusaNome" render={({ field }) => (<Input className="inline-block w-auto" placeholder="NOME" {...field} />)} />,
                                    PORTADOR DO CPF <FormField control={form.control} name="termoRecusaCPF" render={({ field }) => (<Input className="inline-block w-auto" placeholder="CPF" {...field} />)} />
                                    RG: <FormField control={form.control} name="termoRecusaRG" render={({ field }) => (<Input className="inline-block w-auto" placeholder="RG" {...field} />)} />,
                                    RESIDENTE NO ENDEREÇO: <FormField control={form.control} name="termoRecusaEndereco" render={({ field }) => (<Input placeholder="Endereço" {...field} />)} />,
                                    EM PLENA CONSCIÊNCIA DOS MEUS ATOS E ORIENTADO PELA EQUIPE DE RESGATE, DECLARO PARA TODOS OS FINS QUE RECUSO O ATENDIMENTO PRÉ - HOSPITALAR DA WAY BRASIL, ASSUMINDO TODA RESPONSABILIDADE POR QUALQUER PREJUÍZO A MINHA SAÚDE E INTEGRIDADE FÍSICA OU A DE
                                    <FormField control={form.control} name="termoRecusaResponsavelPor" render={({ field }) => (<Input className="inline-block w-auto mx-2" placeholder="NOME" {...field} />)} />
                                    DE QUEM SOU <FormField control={form.control} name="termoRecusaParentesco" render={({ field }) => (<Input className="inline-block w-auto" placeholder="GRAU DE PARENTESCO" {...field} />)} />, NA CONDIÇÃO DE SEU RESPONSÁVEL.
                                </p>
                                 <FormField control={form.control} name="termoRecusaTestemunha1" render={({ field }) => (<FormItem><FormLabel>Testemunha 1</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                 <FormField control={form.control} name="termoRecusaTestemunha2" render={({ field }) => (<FormItem><FormLabel>Testemunha 2</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                 <p className="text-center pt-4">_________________________________________</p>
                                 <p className="text-center font-semibold">Assinatura da Vítima/Responsável</p>
                                </CardContent>
                            </Card>
                        </AccordionContent>
                     </AccordionItem>
                 )}

            </Accordion>
          
          <Button type="submit" size="lg" className="w-full">Gerar Relatório</Button>
        </form>
      </Form>
      <PreviewDialog data={previewData} onClose={() => setPreviewData(null)} onSave={handleSave} formTitle="ATENDIMENTO CLÍNICO (TO12)" />
    </div>
  );
}
