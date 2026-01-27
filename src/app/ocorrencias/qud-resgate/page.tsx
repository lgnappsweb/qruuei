'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Control, useWatch, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PlusCircle, Share2, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

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

const victimSchema = z.object({
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
  tipoEvento: z.enum(["trauma", "clinico"]).optional(),
  eventoTrauma: z.array(z.string()).optional(),
  eventoTraumaOutros: z.string().optional(),
  eventoClinico: z.array(z.string()).optional(),
  eventoClinicoOutros: z.string().optional(),

  // SEGURANÇA E CINEMÁTICA
  condicoesSeguranca: z.array(z.string()).optional(),
  condicoesSegurancaOutros: z.string().optional(),

  // CONDIÇÃO INICIAL
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

  // SEGURANÇA E CINEMÁTICA
  cinematicaVeiculo: z.string().optional(),
  cinematicaPlaca: z.string().optional(),

  victims: z.array(victimSchema),
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

    const handleShare = () => {
      let text = `*${formTitle.toUpperCase()}*\n\n`;
      if (numeroOcorrencia) {
        text += `*NÚMERO DA OCORRÊNCIA:* ${numeroOcorrencia.toUpperCase()}\n\n`;
      }

      const formatSectionForShare = (sectionTitle: string, fields: object) => {
        let sectionText = '';
        for (const [key, value] of Object.entries(fields)) {
            if (value === null || value === undefined || (Array.isArray(value) && value.length === 0) || String(value).trim() === '' || value === 'NILL' ) continue;
            
            // @ts-ignore
            if ((key === 'eventoTraumaOutros' && !data.eventoTrauma?.includes('outros')) || 
                // @ts-ignore
                (key === 'eventoClinicoOutros' && !data.eventoClinico?.includes('outros')) ||
                // @ts-ignore
                (key === 'condicoesSegurancaOutros' && !data.condicoesSeguranca?.includes('outros')) ||
                // @ts-ignore
                (key === 'viasAereasObstruidasPor' && data.viasAereas !== 'obstruidas')) continue;

            const processedValue = renderSimpleValue(value);
            if (processedValue) {
            sectionText += `*${formatLabel(key).toUpperCase()}:* ${processedValue}\n`;
            }
        }
        if (sectionText) {
            text += `*${sectionTitle.toUpperCase()}*\n${sectionText}\n`;
        }
      };

      const generalOperationalFields = {
        equipe: data.equipe,
        medicoRegulador: data.medicoRegulador,
        data: data.data,
        condutor: data.condutor,
        resgatista1: data.resgatista1,
        resgatista2: data.resgatista2,
        acionamento: data.acionamento,
        chegadaLocal: data.chegadaLocal,
        numOcorrencia: data.numOcorrencia,
        rodovia: data.rodovia,
        km: data.km,
        sentido: data.sentido,
        saidaLocal: data.saidaLocal,
        saidaHospital: data.saidaHospital,
        chegadaHospital: data.chegadaHospital,
        chegadaBSO: data.chegadaBSO,
        cinematicaVeiculo: data.cinematicaVeiculo,
        cinematicaPlaca: data.cinematicaPlaca,
      }
      formatSectionForShare('Dados Operacionais', generalOperationalFields);
      
      data.victims.forEach((victim: any, index: number) => {
        text += `\n*--- VÍTIMA ${index + 1} ---*\n`;

        const victimSections = [
            { title: "Dados Cadastrais do Usuário", fields: ['nomeUsuario', 'sexo', 'idade', 'dn', 'tel', 'cpf', 'rg', 'endereco', 'acompanhante', 'posicaoVeiculo']},
            { title: "Evento e Cinemática", fields: ['tipoEvento', 'eventoTrauma', 'eventoTraumaOutros', 'eventoClinico', 'eventoClinicoOutros', 'condicoesSeguranca', 'condicoesSegurancaOutros', 'condicaoInicial']},
            { title: "Avaliação Primária (XABCDE)", fields: ['hemorragiaExsanguinante', 'viasAereas', 'viasAereasObstruidasPor', 'ventilacao', 'detalhesVentilacao', 'pulso', 'pele', 'perfusao', 'sangramentoAtivo', 'glasgowInicial', 'pupilas', 'fotorreagentes', 'exposicao', 'hipotermia', 'lesoesAparentes']},
            { title: "Avaliação Secundária e Sinais Vitais", fields: ['alergias', 'medicamentosEmUso', 'comorbidades', 'ultimaRefeicao', 'sinaisVitaisPA', 'sinaisVitaisFC', 'sinaisVitaisFR', 'sinaisVitaisSatO2', 'sinaisVitaisTAX', 'sinaisVitaisDXT', 'avaliacaoCraniocaudal']},
            { title: "Glasgow e Procedimentos", fields: ['glasgowOcular', 'glasgowVerbal', 'glasgowMotora', 'imobilizacao', 'pranchamento', 'procedimentos', 'procedimentosOutros']},
            { title: "Desfecho e Observações", fields: ['rolValores', 'responsavelValores', 'equipamentosRetidos', 'responsavelEquipamentos', 'conduta', 'removidoPorTerceiros', 'removidoHospital', 'medicoReguladorConduta', 'codigoConduta', 'medicoReceptor', 'relatorioObservacoes']},
        ];

        victimSections.forEach(section => {
            const sectionData = section.fields.reduce((acc, fieldName) => {
                // @ts-ignore
                acc[fieldName] = victim[fieldName];
                return acc;
            }, {} as any);
            formatSectionForShare(section.title, sectionData);
        });

        if (Array.isArray(victim.materiais) && victim.materiais.length > 0) {
            text += '*CONSUMO DE MATERIAIS*\n';
            victim.materiais.forEach((item: any, itemIndex: number) => {
                text += `*Material ${itemIndex + 1}:* ${item.nome.toUpperCase()} - *Qtd:* ${item.quantidade}\n`;
            });
            text += '\n';
        }
      });

      const encodedText = encodeURIComponent(text.trim());
      window.open(`https://api.whatsapp.com/send?text=${encodedText}`);
    };

    return (
        <Dialog open={!!data} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader className="text-center pt-6">
                    <DialogTitle className="text-3xl font-bold">{`Pré-visualização (${occurrenceCode})`}</DialogTitle>
                    <DialogDescription>Confira os dados antes de salvar.</DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-1 pr-6 -mr-6 mt-4">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Dados Operacionais</CardTitle></CardHeader>
                            <CardContent className="pt-6">
                                <div className="text-xl space-y-4">
                                    {Object.keys(formSchema.shape)
                                      .filter(key => key !== 'victims')
                                      .map(key => <Field key={String(key)} label={String(key)} value={data[key]} />)}
                                </div>
                            </CardContent>
                        </Card>

                        {data.victims?.map((victim: any, index: number) => (
                           <Card key={index} className="border-2 mt-4">
                                <CardHeader>
                                    <CardTitle>Vítima {index + 1}: {victim.nomeUsuario || 'Não identificado'}</CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {Object.entries(victim).map(([key, value]) => {
                                        if (key === 'materiais' && Array.isArray(value) && value.length > 0) {
                                            return (
                                                <Card key="materiais" className="mt-4">
                                                     <CardHeader><CardTitle>Consumo de Materiais</CardTitle></CardHeader>
                                                    <CardContent className="pt-6">
                                                        {value.map((item, i) => <MaterialItem key={i} item={item} index={i} />)}
                                                    </CardContent>
                                                </Card>
                                            )
                                        }
                                         if (key === 'materiais') return null;

                                        return <Field key={key} label={key} value={value} />
                                    })}
                                </CardContent>
                           </Card>
                        ))}
                        
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
                <DialogFooter className="mt-4 flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={onClose}>Editar</Button>
                    <Button onClick={handleShare} className="bg-green-600 hover:bg-green-700" disabled={!numeroOcorrencia}>
                        <Share2 className="mr-2 h-5 w-5"/> Compartilhar
                    </Button>
                    <Button onClick={handleSaveClick}>Confirmar e Salvar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


// Reusable components
function CheckboxGroupField({ control, name, label, options }: { control: Control<any>, name: any, label: string, options: { id: string, label: string }[] }) {
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
              name={name}
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
                    <FormLabel className="text-lg font-normal">
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

function RadioGroupField({ control, name, label, options, orientation = 'vertical' }: { control: Control<any>, name: any, label: string, options: { value: string, label: string }[], orientation?: 'vertical' | 'horizontal' }) {
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

function GlasgowScale({ control, index }: { control: Control<FormValues>, index: number }) {
  const ocular = useWatch({ control, name: `victims.${index}.glasgowOcular` });
  const verbal = useWatch({ control, name: `victims.${index}.glasgowVerbal` });
  const motora = useWatch({ control, name: `victims.${index}.glasgowMotora` });

  const total = React.useMemo(() => {
    return (parseInt(ocular || '0') || 0) + (parseInt(verbal || '0') || 0) + (parseInt(motora || '0') || 0);
  }, [ocular, verbal, motora]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Escala de Glasgow</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroupField control={control} name={`victims.${index}.glasgowOcular`} label="Abertura Ocular" options={[
          { value: '4', label: '04 - Espontânea' },
          { value: '3', label: '03 - Estímulo Verbal' },
          { value: '2', label: '02 - Estímulo Doloroso' },
          { value: '1', label: '01 - Ausente' },
        ]} />
        <RadioGroupField control={control} name={`victims.${index}.glasgowVerbal`} label="Resposta Verbal" options={[
          { value: '5', label: '05 - Orientado' },
          { value: '4', label: '04 - Confuso' },
          { value: '3', label: '03 - Palavras Inapropriadas' },
          { value: '2', label: '02 - Sons Incompreensíveis' },
          { value: '1', label: '01 - Ausente' },
        ]} />
        <RadioGroupField control={control} name={`victims.${index}.glasgowMotora`} label="Resposta Motora" options={[
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

const defaultVictimValues = {
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
  tipoEvento: undefined,
  eventoTrauma: [],
  eventoTraumaOutros: '',
  eventoClinico: [],
  eventoClinicoOutros: '',
  condicoesSeguranca: [],
  condicoesSegurancaOutros: '',
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
};

function VictimCard({ index, control, remove, victimCount }: { index: number, control: Control<FormValues>, remove: (index: number) => void, victimCount: number }) {
  const watchConduta = useWatch({ control, name: `victims.${index}.conduta` });
  const { fields: materialFields, append: appendMaterial, remove: removeMaterial } = useFieldArray({
    control,
    name: `victims.${index}.materiais`,
  });

  return (
    <Card key={`victim-${index}`} className="border-primary border-2 mt-6">
        <CardHeader className="flex-row items-center justify-between bg-primary text-primary-foreground">
            <CardTitle>Vítima {index + 1}</CardTitle>
            {victimCount > 1 && (
                <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Remover Vítima</span>
                </Button>
            )}
        </CardHeader>
        <CardContent className="pt-6">
           <Accordion type="multiple" className="w-full space-y-4" defaultValue={[`v${index}-item-2`]}>
                <AccordionItem value={`v${index}-item-2`}>
                    <AccordionTrigger className="text-xl font-bold">DADOS CADASTRAIS DO USUÁRIO</AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                        <FormField control={control} name={`victims.${index}.nomeUsuario`} render={({ field }) => (<FormItem><FormLabel>Nome</FormLabel><FormControl><Input placeholder="Nome completo do usuário" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField control={control} name={`victims.${index}.idade`} render={({ field }) => (<FormItem><FormLabel>Idade</FormLabel><FormControl><Input type="number" placeholder="Ex: 35" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <FormField control={control} name={`victims.${index}.dn`} render={({ field }) => (<FormItem><FormLabel>Data Nasc.</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <RadioGroupField control={control} name={`victims.${index}.sexo`} label="Sexo" options={[{value: 'M', label: 'M'}, {value: 'F', label: 'F'}]} orientation="horizontal" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                            name={`victims.${index}.cpf`}
                            control={control}
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
                            name={`victims.${index}.rg`}
                            control={control}
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
                        control={control}
                        name={`victims.${index}.tel`}
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
                        <FormField control={control} name={`victims.${index}.endereco`} render={({ field }) => (<FormItem><FormLabel>Endereço</FormLabel><FormControl><Input placeholder="Rua, Av, etc." {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={control} name={`victims.${index}.acompanhante`} render={({ field }) => (<FormItem><FormLabel>Acompanhante</FormLabel><FormControl><Input placeholder="Nome do acompanhante" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={control} name={`victims.${index}.posicaoVeiculo`} render={({ field }) => (<FormItem><FormLabel>Posição no Veículo</FormLabel><FormControl><Input placeholder="Ex: Condutor, Passageiro" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value={`v${index}-item-3`}>
                    <AccordionTrigger className="text-xl font-bold">EVENTO</AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                        <RadioGroupField control={control} name={`victims.${index}.tipoEvento`} label="Tipo de Evento" options={[{value: 'trauma', label: 'Trauma'}, {value: 'clinico', label: 'Atendimento Clínico'}]} orientation="horizontal" />
                        
                        {useWatch({ control, name: `victims.${index}.tipoEvento` }) === 'trauma' && (
                            <Card className="bg-background/50">
                                <CardHeader><CardTitle>Trauma</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <CheckboxGroupField control={control} name={`victims.${index}.eventoTrauma`} label="" options={[
                                        { id: 'acidente', label: 'Acidente Automobilístico' },
                                        { id: 'queimadura', label: 'Queimadura' },
                                        { id: 'atropelamento', label: 'Atropelamento' },
                                        { id: 'queda', label: 'Queda de Altura' },
                                        { id: 'outros', label: 'Outros' }
                                    ]}/>
                                     {useWatch({ control, name: `victims.${index}.eventoTrauma` })?.includes('outros') &&
                                        <FormField control={control} name={`victims.${index}.eventoTraumaOutros`} render={({ field }) => (<FormItem><FormLabel>Outros (Trauma)</FormLabel><FormControl><Input placeholder="Descreva o trauma" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                     }
                                </CardContent>
                            </Card>
                        )}
                        {useWatch({ control, name: `victims.${index}.tipoEvento` }) === 'clinico' && (
                            <Card className="bg-background/50">
                                <CardHeader><CardTitle>Atendimento Clínico</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                     <CheckboxGroupField control={control} name={`victims.${index}.eventoClinico`} label="" options={[
                                        { id: 'mal_subito', label: 'Mal Súbito' },
                                        { id: 'intoxicacao', label: 'Intoxicação Exógena' },
                                        { id: 'parto', label: 'Assistência ao Parto' },
                                        { id: 'convulsao', label: 'Convulsão' },
                                        { id: 'psiquiatrico', label: 'Distúrbio Psiquiátrico' },
                                        { id: 'outros', label: 'Outros' }
                                    ]}/>
                                    {useWatch({ control, name: `victims.${index}.eventoClinico` })?.includes('outros') &&
                                        <FormField control={control} name={`victims.${index}.eventoClinicoOutros`} render={({ field }) => (<FormItem><FormLabel>Outros (Clínico)</FormLabel><FormControl><Input placeholder="Descreva o atendimento" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                    }
                                </CardContent>
                            </Card>
                        )}

                        <CheckboxGroupField control={control} name={`victims.${index}.condicoesSeguranca`} label="Condições de Segurança" options={[
                            { id: 'cinto', label: 'Cinto de Segurança' },
                            { id: 'cadeirinha', label: 'Cadeirinha' },
                            { id: 'airbag', label: 'Air Bag' },
                            { id: 'capacete', label: 'Capacete' },
                            { id: 'outros', label: 'Outros' },
                        ]}/>
                        {useWatch({ control, name: `victims.${index}.condicoesSeguranca` })?.includes('outros') &&
                            <FormField control={control} name={`victims.${index}.condicoesSegurancaOutros`} render={({ field }) => (<FormItem><FormLabel>Outras Condições</FormLabel><FormControl><Input placeholder="Descreva outras condições" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        }
                        
                        <CheckboxGroupField control={control} name={`victims.${index}.condicaoInicial`} label="Condição Inicial" options={[
                            { id: 'alerta', label: 'Alerta' },
                            { id: 'deambulando', label: 'Deambulando' },
                            { id: 'verbaliza', label: 'Verbaliza' },
                            { id: 'ao_solo', label: 'Ao Solo' },
                            { id: 'estimulo_doloroso', label: 'Estímulo Doloroso' },
                            { id: 'ejetado', label: 'Ejetado' },
                            { id: 'inconsciente', label: 'Inconsciente' },
                            { id: 'encarcerado', label: 'Encarcerado/Retido' },
                        ]}/>
                    </AccordionContent>
                </AccordionItem>
                
                 <AccordionItem value={`v${index}-item-4`}>
                    <AccordionTrigger className="text-xl font-bold">AVALIAÇÃO PRIMÁRIA (XABCDE)</AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                        <RadioGroupField control={control} name={`victims.${index}.hemorragiaExsanguinante`} label="X - Hemorragia Exsanguinante" options={[{value: 'sim', label: 'Sim'}, {value: 'nao', label: 'Não'}]} orientation="horizontal"/>
                        <FormField control={control} name={`victims.${index}.viasAereas`} render={({ field }) => (<FormItem><FormLabel>A - Vias Aéreas</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="pervias">Pérvias</SelectItem><SelectItem value="obstruidas">Obstruídas Por</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
                        {useWatch({ control, name: `victims.${index}.viasAereas` }) === 'obstruidas' && <FormField control={control} name={`victims.${index}.viasAereasObstruidasPor`} render={({ field }) => (<FormItem><FormLabel>Obstruídas Por</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />}
                        
                        <RadioGroupField control={control} name={`victims.${index}.ventilacao`} label="B - Ventilação" options={[{value: 'presente', label: 'Presente'}, {value: 'ausente', label: 'Ausente'}]} orientation="horizontal"/>
                        <CheckboxGroupField control={control} name={`victims.${index}.detalhesVentilacao`} label="Detalhes da Ventilação" options={[
                            {id: 'simetrica', label: 'Simétrica'}, {id: 'assimetrica', label: 'Assimétrica'}, {id: 'apneia', label: 'Apnéia'},
                            {id: 'eupneia', label: 'Eupneia'}, {id: 'taquipneia', label: 'Taquipneia'}, {id: 'gasping', label: 'Gasping'}
                        ]} />

                        <Card>
                        <CardHeader><CardTitle>C - Circulação e Hemorragias</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <CheckboxGroupField control={control} name={`victims.${index}.pulso`} label="Pulso" options={[{id: 'presente', label: 'Presente'}, {id: 'cheio', label: 'Cheio'}, {id: 'filiforme', label: 'Filiforme'}]} />
                            <CheckboxGroupField control={control} name={`victims.${index}.pele`} label="Pele" options={[{id: 'normal', label: 'Normal'}, {id: 'fria', label: 'Fria'}, {id: 'sudorese', label: 'Sudorese'}]} />
                            <RadioGroupField control={control} name={`victims.${index}.perfusao`} label="Perfusão" options={[{value: '<2seg', label: '< 2 Seg'}, {value: '>=2seg', label: '>= 2 Seg'}]} orientation="horizontal" />
                            <RadioGroupField control={control} name={`victims.${index}.sangramentoAtivo`} label="Sangramento Ativo" options={[{value: 'sim', label: 'Sim'}, {value: 'nao', label: 'Não'}]} orientation="horizontal" />
                        </CardContent>
                        </Card>

                        <Card>
                        <CardHeader><CardTitle>D - Neurológico</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <FormField control={control} name={`victims.${index}.glasgowInicial`} render={({ field }) => (<FormItem><FormLabel>Glasgow (Inicial)</FormLabel><FormControl><Input placeholder="Ex: 15" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            <RadioGroupField control={control} name={`victims.${index}.pupilas`} label="Pupilas" options={[{value: 'isocoricas', label: 'Isocóricas'}, {value: 'anisocoricas', label: 'Anisocóricas'}]} orientation="horizontal"/>
                            <RadioGroupField control={control} name={`victims.${index}.fotorreagentes`} label="Fotorreagentes" options={[{value: 'sim', label: 'Sim'}, {value: 'nao', label: 'Não'}]} orientation="horizontal"/>
                        </CardContent>
                        </Card>

                        <Card>
                        <CardHeader><CardTitle>E - Exposição</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <RadioGroupField control={control} name={`victims.${index}.exposicao`} label="" options={[{value: 'sem_lesoes', label: 'Sem Lesões Aparentes'}, {value: 'lesoes_aparentes', label: 'Lesões Aparentes'}]} />
                            <RadioGroupField control={control} name={`victims.${index}.hipotermia`} label="Hipotermia" options={[{value: 'sim', label: 'Sim'}, {value: 'nao', label: 'Não'}]} orientation="horizontal"/>
                            <FormField control={control} name={`victims.${index}.lesoesAparentes`} render={({ field }) => (<FormItem><FormLabel>Lesões Aparentes e Queixas Principais</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        </CardContent>
                        </Card>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value={`v${index}-item-5`}>
                    <AccordionTrigger className="text-xl font-bold">AVALIAÇÃO SECUNDÁRIA E SINAIS VITAIS</AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                        <Card>
                            <CardHeader><CardTitle>S.A.M.P.L.E.</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <FormField control={control} name={`victims.${index}.alergias`} render={({ field }) => (<FormItem><FormLabel>Alergias</FormLabel><FormControl><Input placeholder="Nega alergias / Dipirona" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={control} name={`victims.${index}.medicamentosEmUso`} render={({ field }) => (<FormItem><FormLabel>Medicamentos em Uso</FormLabel><FormControl><Input placeholder="Nega uso / Losartana" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={control} name={`victims.${index}.comorbidades`} render={({ field }) => (<FormItem><FormLabel>Comorbidades / Gestação</FormLabel><FormControl><Input placeholder="Nega comorbidades / HAS" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={control} name={`victims.${index}.ultimaRefeicao`} render={({ field }) => (<FormItem><FormLabel>Última Refeição / Jejum</FormLabel><FormControl><Input placeholder="Há 2 horas" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader><CardTitle>Sinais Vitais</CardTitle></CardHeader>
                            <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                <FormField control={control} name={`victims.${index}.sinaisVitaisPA`} render={({ field }) => (<FormItem><FormLabel>PA (mmHg)</FormLabel><FormControl><Input placeholder="120x80" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={control} name={`victims.${index}.sinaisVitaisFC`} render={({ field }) => (<FormItem><FormLabel>FC (bpm)</FormLabel><FormControl><Input placeholder="80" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={control} name={`victims.${index}.sinaisVitaisFR`} render={({ field }) => (<FormItem><FormLabel>FR (rpm)</FormLabel><FormControl><Input placeholder="16" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={control} name={`victims.${index}.sinaisVitaisSatO2`} render={({ field }) => (<FormItem><FormLabel>Sat O² (%)</FormLabel><FormControl><Input placeholder="98" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={control} name={`victims.${index}.sinaisVitaisTAX`} render={({ field }) => (<FormItem><FormLabel>TAX (°C)</FormLabel><FormControl><Input placeholder="36.5" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={control} name={`victims.${index}.sinaisVitaisDXT`} render={({ field }) => (<FormItem><FormLabel>DXT (mg/dl)</FormLabel><FormControl><Input placeholder="90" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                            </CardContent>
                        </Card>
                        <FormField control={control} name={`victims.${index}.avaliacaoCraniocaudal`} render={({ field }) => (<FormItem><FormLabel>Avaliação Crânio-Caudal</FormLabel><FormControl><Textarea placeholder="Nenhuma anormalidade encontrada, vítima consciente e orientada." {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    </AccordionContent>
                </AccordionItem>
                 
                <AccordionItem value={`v${index}-item-6`}>
                    <AccordionTrigger className="text-xl font-bold">GLASGOW E PROCEDIMENTOS</AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                        <GlasgowScale control={control} index={index}/>
                        <Card>
                            <CardHeader><CardTitle>Imobilização</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <RadioGroupField control={control} name={`victims.${index}.pranchamento`} label="Pranchamento" options={[
                                    {value: 'decubito', label: 'Decúbito'}, {value: 'em_pe', label: 'Em Pé'}
                                ]}/>
                                <CheckboxGroupField control={control} name={`victims.${index}.imobilizacao`} label="" options={[
                                    {id: 'colar', label: 'Colar Cervical'},
                                    {id: 'ked', label: 'Extricação com KED'},
                                    {id: 'terezarautek', label: 'Extricação com Tereza/Rautek'},
                                    {id: 'desencarceramento', label: 'Desencarceramento'},
                                    {id: 'retirada_capacete', label: 'Retirada de Capacete'},
                                    {id: 'imob_mse', label: 'Imobilização de MSE'},
                                    {id: 'imob_msd', label: 'Imobilização de MSD'},
                                    {id: 'imob_mie', label: 'Imobilização de MIE'},
                                    {id: 'imob_mid', label: 'Imobilização de MID'},
                                    {id: 'imob_pelve', label: 'Imobilização de Pelve'},
                                ]} />
                            </CardContent>
                        </Card>
                        <CheckboxGroupField control={control} name={`victims.${index}.procedimentos`} label="Procedimentos Realizados" options={[
                            {id: 'desobstrucao', label: 'Desobstrução de Vias Aéreas'}, {id: 'canula', label: 'Cânula de Guedel'}, {id: 'oxigenio', label: 'Oxigênio (Máscara/Cateter)'},
                            {id: 'ambu', label: 'Ventilação com AMBU'}, {id: 'dea', label: 'DEA'}, {id: 'rcp', label: 'RCP'},
                            {id: 'torniquete', label: 'Torniquete'}, {id: 'curativo', label: 'Curativo Oclusivo/Compressivo'}, {id: 'sinais_vitais', label: 'Aferição de Sinais Vitais'},
                            {id: 'oximetria', label: 'Oximetria de Pulso'}, {id: 'resgate_altura', label: 'Resgate em Altura'}, {id: 'orientacoes', label: 'Orientações'}
                        ]} />
                        <FormField control={control} name={`victims.${index}.procedimentosOutros`} render={({ field }) => (<FormItem><FormLabel>Outros Procedimentos</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    </AccordionContent>
                </AccordionItem>
                 
                <AccordionItem value={`v${index}-item-7`}>
                    <AccordionTrigger className="text-xl font-bold">DESFECHO E OBSERVAÇÕES</AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                        <RadioGroupField control={control} name={`victims.${index}.conduta`} label="Conduta" options={[
                            {value: 'liberacao', label: 'Liberação no Local c/ Orientações'}, {value: 'recusa_atendimento', label: 'Recusa Atendimento'},
                            {value: 'recusa_remocao', label: 'Recusa Remoção'}, {value: 'removido_terceiros', label: 'Removido por Terceiros'},
                            {value: 'removido_hospital', label: 'Removido a Unidade Hospitalar'}, {value: 'obito_local', label: 'Vítima em Óbito'},
                            {value: 'obito_atendimento', label: 'Óbito Durante Atendimento'},
                        ]} />
                        {useWatch({ control, name: `victims.${index}.conduta` }) === 'removido_terceiros' && (
                            <FormField control={control} name={`victims.${index}.removidoPorTerceiros`} render={({ field }) => (<FormItem><FormLabel>Removido por</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="COBOM">COBOM</SelectItem><SelectItem value="SAMU">SAMU</SelectItem><SelectItem value="OUTROS">Outros</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
                        )}
                        {useWatch({ control, name: `victims.${index}.conduta` }) === 'removido_hospital' && (
                            <FormField control={control} name={`victims.${index}.removidoHospital`} render={({ field }) => (<FormItem><FormLabel>Unidade Hospitalar</FormLabel><FormControl><Input placeholder="Ex: Santa Casa de Misericórdia" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        )}
                        <RadioGroupField control={control} name={`victims.${index}.codigoConduta`} label="Código" options={[
                            {value: 'vermelho', label: 'Vermelho'}, {value: 'amarelo', label: 'Amarelo'},
                            {value: 'verde', label: 'Verde'}, {value: 'azul', label: 'Azul'}, {value: 'preto', label: 'Preto'}
                        ]} orientation="horizontal" />
                        <FormField control={control} name={`victims.${index}.medicoReguladorConduta`} render={({ field }) => (<FormItem><FormLabel>Médico Regulador/Intervencionista</FormLabel><FormControl><Input placeholder="Ex: Dr. Gregory House" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={control} name={`victims.${index}.medicoReceptor`} render={({ field }) => (<FormItem><FormLabel>Médico Receptor</FormLabel><FormControl><Input placeholder="Ex: Dra. Meredith Grey" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle>Consumo de Materiais</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-6">
                                {materialFields.map((item, materialIndex) => (
                                <div key={item.id} className="flex items-end gap-2 p-2 border rounded-lg relative md:gap-4 md:p-4">
                                    <div className="grid grid-cols-1 gap-4 flex-1 md:flex-initial md:w-full">
                                        <FormField
                                            control={control}
                                            name={`victims.${index}.materiais.${materialIndex}.nome`}
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
                                            control={control}
                                            name={`victims.${index}.materiais.${materialIndex}.quantidade`}
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
                                        onClick={() => removeMaterial(materialIndex)}
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
                        <FormField control={control} name={`victims.${index}.relatorioObservacoes`} render={({ field }) => (<FormItem><FormLabel>Relatório/Observações</FormLabel><FormControl><Textarea rows={5} placeholder="Descreva o relatório e observações aqui..." {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={control} name={`victims.${index}.rolValores`} render={({ field }) => (<FormItem><FormLabel>Rol de Valores/Pertences</FormLabel><FormControl><Textarea rows={3} placeholder="Ex: Celular, carteira com documentos e R$ 50,00" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={control} name={`victims.${index}.responsavelValores`} render={({ field }) => (<FormItem><FormLabel>Responsável pelo Recebimento</FormLabel><FormControl><Input placeholder="Nome do responsável" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={control} name={`victims.${index}.equipamentosRetidos`} render={({ field }) => (<FormItem><FormLabel>Equipamentos/Materiais Retidos</FormLabel><FormControl><Textarea rows={3} placeholder="Ex: Colar cervical, prancha rígida..." {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={control} name={`victims.${index}.responsavelEquipamentos`} render={({ field }) => (<FormItem><FormLabel>Responsável pelo Recebimento</FormLabel><FormControl><Input placeholder="Nome do responsável" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    </AccordionContent>
                </AccordionItem>

                {(watchConduta === 'recusa_atendimento' || watchConduta === 'recusa_remocao') && (
                    <AccordionItem value={`v${index}-item-8`}>
                        <AccordionTrigger className="text-xl font-bold text-destructive">TERMO DE RECUSA</AccordionTrigger>
                        <AccordionContent className="space-y-6 pt-4">
                            <Card className="border-destructive">
                                <CardContent className="pt-6 space-y-4">
                                <p className="text-base text-muted-foreground">
                                    EU, <FormField control={control} name={`victims.${index}.termoRecusaNome`} render={({ field }) => (<Input className="inline-block w-auto" placeholder="NOME" {...field} />)} />,
                                    PORTADOR DO CPF <FormField control={control} name={`victims.${index}.termoRecusaCPF`} render={({ field }) => (<Input className="inline-block w-auto" placeholder="CPF" {...field} />)} />
                                    RG: <FormField control={control} name={`victims.${index}.termoRecusaRG`} render={({ field }) => (<Input className="inline-block w-auto" placeholder="RG" {...field} />)} />,
                                    RESIDENTE NO ENDEREÇO: <FormField control={control} name={`victims.${index}.termoRecusaEndereco`} render={({ field }) => (<Input placeholder="Endereço" {...field} />)} />,
                                    EM PLENA CONSCIÊNCIA DOS MEUS ATOS E ORIENTADO PELA EQUIPE DE RESGATE, DECLARO PARA TODOS OS FINS QUE RECUSO O ATENDIMENTO PRÉ - HOSPITALAR DA WAY BRASIL, ASSUMINDO TODA RESPONSABILIDADE POR QUALQUER PREJUÍZO A MINHA SAÚDE E INTEGRIDADE FÍSICA OU A DE
                                    <FormField control={control} name={`victims.${index}.termoRecusaResponsavelPor`} render={({ field }) => (<Input className="inline-block w-auto mx-2" placeholder="NOME" {...field} />)} />
                                    DE QUEM SOU <FormField control={control} name={`victims.${index}.termoRecusaParentesco`} render={({ field }) => (<Input className="inline-block w-auto" placeholder="GRAU DE PARENTESCO" {...field} />)} />, NA CONDIÇÃO DE SEU RESPONSÁVEL.
                                </p>
                                <FormField control={control} name={`victims.${index}.termoRecusaTestemunha1`} render={({ field }) => (<FormItem><FormLabel>Testemunha 1</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <FormField control={control} name={`victims.${index}.termoRecusaTestemunha2`} render={({ field }) => (<FormItem><FormLabel>Testemunha 2</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)}/>
                                <p className="text-center pt-4">_________________________________________</p>
                                <p className="text-center font-semibold">Assinatura da Vítima/Responsável</p>
                                </CardContent>
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                )}
           </Accordion>
        </CardContent>
    </Card>
  );
}


// Main page component
export default function QudResgatePage() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();
  const [previewData, setPreviewData] = React.useState<FormValues | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      cinematicaVeiculo: '',
      cinematicaPlaca: '',
      victims: [defaultVictimValues]
    },
  });

  React.useEffect(() => {
    try {
        const editDataString = localStorage.getItem('editOcorrenciaData');
        if (editDataString) {
            const editData = JSON.parse(editDataString);
            if(editData.formPath === '/ocorrencias/qud-resgate') {
                const reportToLoad = editData.fullReport;
                 Object.keys(reportToLoad).forEach(key => {
                    if (reportToLoad[key] === 'NILL') {
                       reportToLoad[key] = Array.isArray(form.getValues(key as keyof FormValues)) ? [] : '';
                    }
                });

                if(Array.isArray(reportToLoad.victims)) {
                    reportToLoad.victims = reportToLoad.victims.map((victim: any) => {
                        const newVictim = {...victim};
                        Object.keys(newVictim).forEach(key => {
                            if (newVictim[key] === 'NILL') {
                                // @ts-ignore
                                newVictim[key] = Array.isArray(defaultVictimValues[key]) ? [] : '';
                            }
                        });
                        return newVictim;
                    });
                }

                form.reset(reportToLoad);
                setEditingId(editData.id);
                localStorage.removeItem('editOcorrenciaData');
            }
        }
    } catch(e) {
        console.error("Error reading edit data from localStorage", e);
        localStorage.removeItem('editOcorrenciaData');
    }
  }, [form]);

  const { fields: victimFields, append: appendVictim, remove: removeVictim } = useFieldArray({
    control: form.control,
    name: "victims",
  });

  function onSubmit(values: FormValues) {
    const processedValues = fillEmptyWithNill(values);
    setPreviewData(processedValues);
  }

  async function handleSave(data: any) {
    if (!firestore || !user) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Usuário não autenticado ou banco de dados indisponível.' });
        return;
    }

    try {
        const formTitle = 'QUD RESGATE - ATENDIMENTO PRÉ-HOSPITALAR';

        const ocorrenciaData = {
            userId: user.uid,
            codOcorrencia: 'QUD RESGATE',
            type: formTitle,
            rodovia: data.rodovia,
            km: data.km,
            status: 'Finalizada' as const,
            fullReport: data,
            numeroOcorrencia: data.numeroOcorrencia,
            formPath: '/ocorrencias/qud-resgate',
            createdAt: serverTimestamp()
        };

        if (editingId) {
            const docRef = doc(firestore, 'occurrences', editingId);
            await updateDoc(docRef, ocorrenciaData);
            toast({ title: 'Ocorrência Atualizada', description: 'Ocorrência atualizada com sucesso!' });
        } else {
            await addDoc(collection(firestore, 'occurrences'), ocorrenciaData);
            toast({ title: 'Formulário Enviado', description: 'Ocorrência registrada com sucesso!' });
        }
        
        setPreviewData(null);
        router.push('/ocorrencias');

    } catch (e: any) {
        console.error("Could not save to Firestore", e);
        toast({
          variant: "destructive",
          title: 'Erro ao Salvar',
          description: e.message || 'Não foi possível salvar a ocorrência.',
        });
    }
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
          QUD RESGATE - ATENDIMENTO PRÉ-HOSPITALAR
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
                            <FormField control={form.control} name="rodovia" render={({ field }) => (<FormItem><FormLabel>Rodovia</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="MS-112">MS-112</SelectItem><SelectItem value="BR-158">BR-158</SelectItem><SelectItem value="MS-306">MS-306</SelectItem><SelectItem value="BR-436">BR-436</SelectItem></SelectContent></Select><FormMessage /></FormItem>)}/>
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
                         <FormField control={form.control} name="cinematicaVeiculo" render={({ field }) => (<FormItem><FormLabel>Veículo (Cinemática)</FormLabel><FormControl><Input placeholder="Ex: Moto, Carro, Caminhão..." {...field} /></FormControl><FormMessage /></FormItem>)}/>
                        <FormField control={form.control} name="cinematicaPlaca" render={({ field }) => (<FormItem><FormLabel>Placa</FormLabel><FormControl><Input placeholder="Ex: ABC-1234" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {victimFields.map((field, index) => (
              <VictimCard 
                key={field.id}
                index={index}
                control={form.control}
                remove={removeVictim}
                victimCount={victimFields.length}
              />
            ))}

            <Button type="button" size="lg" className="w-full" onClick={() => appendVictim(defaultVictimValues)}>
              <PlusCircle className="mr-2 h-5 w-5" /> Adicionar Vítima
            </Button>
          
          <Button type="submit" size="lg" className="w-full">Gerar Relatório</Button>
        </form>
      </Form>
      <PreviewDialog data={previewData} onClose={() => setPreviewData(null)} onSave={handleSave} formTitle="QUD RESGATE" />
    </div>
  );
}
