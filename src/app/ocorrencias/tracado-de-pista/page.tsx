'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Control } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const formSchema = z.object({
  // PRÉVIA
  rodovia: z.string().min(1, 'Selecione a rodovia.'),
  qthExato: z.string().optional(),
  sentido: z.string().optional(),
  faixaInterditada: z.string().optional(),
  provavelCinematica: z.string().optional(),
  provavelCinematicaOutros: z.string().optional(),
  veiculos: z.array(z.string()).optional(),
  quantidadeVitimas: z.string().optional(),
  potencialGravidadePrevia: z.string().optional(),
  recursosAdicionaisPrevia: z.array(z.string()).optional(),

  // CONFIRMAÇÃO DA PRÉVIA
  cinematica: z.string().optional(),
  cinematicaOutros: z.string().optional(),
  energia: z.string().optional(),
  avarias: z.string().optional(),
  posicaoVeiculo: z.string().optional(),
  quantidadeVitimasConfirmacao: z.string().optional(),
  potencialGravidadeAbordagem: z.array(z.string()).optional(),
  cod61_62: z.string().optional(),
  recursosAdicionaisConfirmacao: z.array(z.string()).optional(),
  recursosAdicionaisConfirmacaoOutros: z.string().optional(),

  // CONDIÇÃO
  condicoesMeteorologicas: z.string().optional(),
  condicaoVisibilidade: z.string().optional(),
  condicoesEspeciais: z.string().optional(),
  condicoesEspeciaisOutros: z.string().optional(),
  condicoesSinalizacao: z.string().optional(),
  condicoesSinalizacaoOutros: z.string().optional(),

  // PISTA
  tipoPista: z.string().optional(),
  tracadoPista: z.string().optional(),
  perfil: z.string().optional(),
  obrasNaPista: z.string().optional(),
  condicaoPista: z.string().optional(),
  obstaculoCanteiroCentral: z.string().optional(),
  obstaculoCanteiroCentralOutros: z.string().optional(),
  obstaculoAcostamento: z.string().optional(),
  obstaculoAcostamentoOutros: z.string().optional(),
  obrasNoAcostamento: z.string().optional(),
  estadoConservacao: z.string().optional(),
  intersecoesPista: z.string().optional(),
  deficienciaObras: z.string().optional(),
  deficienciaObrasOutros: z.string().optional(),
  obrasDeArte: z.string().optional(),
  local: z.string().optional(),
  
  // SINALIZAÇÃO
  sinalizacaoVertical: z.string().optional(),
  sinalizacaoHorizontal: z.string().optional(),
  sinalizacaoSemaforo: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const fillEmptyWithNill = (data: any): any => {
    if (Array.isArray(data)) {
        if (data.length === 0) return 'NILL';
        return data.map(item => fillEmptyWithNill(item));
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
      <div className="flex flex-wrap items-baseline">
          <span className="font-semibold text-muted-foreground mr-2 whitespace-nowrap">{formatLabel(label)}:</span>
          <span className="text-foreground font-mono break-words">{renderSimpleValue(value)}</span>
      </div>
    ) : null
  );

  const sections: { title: string, fields: (keyof FormValues)[] }[] = [
    { title: 'PRÉVIA', fields: ['rodovia', 'qthExato', 'sentido', 'faixaInterditada', 'provavelCinematica', 'provavelCinematicaOutros', 'veiculos', 'quantidadeVitimas', 'potencialGravidadePrevia', 'recursosAdicionaisPrevia'] },
    { title: 'CONFIRMAÇÃO DA PRÉVIA', fields: ['cinematica', 'cinematicaOutros', 'energia', 'avarias', 'posicaoVeiculo', 'quantidadeVitimasConfirmacao', 'potencialGravidadeAbordagem', 'cod61_62', 'recursosAdicionaisConfirmacao', 'recursosAdicionaisConfirmacaoOutros'] },
    { title: 'CONDIÇÃO', fields: ['condicoesMeteorologicas', 'condicaoVisibilidade', 'condicoesEspeciais', 'condicoesEspeciaisOutros', 'condicoesSinalizacao', 'condicoesSinalizacaoOutros'] },
    { title: 'PISTA', fields: ['tipoPista', 'tracadoPista', 'perfil', 'obrasNaPista', 'condicaoPista', 'obstaculoCanteiroCentral', 'obstaculoCanteiroCentralOutros', 'obstaculoAcostamento', 'obstaculoAcostamentoOutros', 'obrasNoAcostamento', 'estadoConservacao', 'intersecoesPista', 'deficienciaObras', 'deficienciaObrasOutros', 'obrasDeArte', 'local'] },
    { title: 'SINALIZAÇÃO', fields: ['sinalizacaoVertical', 'sinalizacaoHorizontal', 'sinalizacaoSemaforo'] },
  ];

  const occurrenceCode = formTitle.match(/\(([^)]+)\)/)?.[1] || formTitle.split(' ')[0] || "Relatório";

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
               <Card className="mt-6 border-2 border-primary shadow-lg bg-primary/10">
                    <CardHeader>
                        <CardTitle className="text-primary text-center text-2xl">NÚMERO DA OCORRÊNCIA</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Input
                            value={numeroOcorrencia}
                            onChange={(e) => setNumeroOcorrencia(e.target.value.toUpperCase())}
                            placeholder="INSIRA O NÚMERO DA OCORRÊNCIA"
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

function RadioGroupField({ control, name, label, options, orientation = 'vertical' }: { control: Control<FormValues>, name: keyof FormValues, label: string, options: { value: string, label: string }[], orientation?: 'vertical' | 'horizontal' }) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className={cn("flex", orientation === 'vertical' ? "flex-col space-y-1" : "flex-wrap gap-x-4 gap-y-2")}
                        >
                            {options.map((option) => (
                                <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value={option.value} />
                                    </FormControl>
                                    <FormLabel className="font-normal text-2xl">
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

function CheckboxGroupField({ control, name, label, options }: { control: Control<FormValues>, name: keyof FormValues, label: string, options: { id: string, label: string }[] }) {
    return (
      <FormItem>
        <div className="mb-4">
          <FormLabel>{label}</FormLabel>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-4">
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
                    <FormLabel className="text-2xl font-normal">
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

const formOptions = {
    sentido: [{ value: 'Norte', label: 'Norte' }, { value: 'Sul', label: 'Sul' }],
    faixaInterditada: [{ value: 'Norte e Sul', label: 'Norte e Sul' }, { value: 'Norte', label: 'Norte' }, { value: 'Sul', label: 'Sul' }, { value: 'NILL', label: 'NILL' }],
    provavelCinematica: [{ value: 'Colisão', label: 'Colisão' }, { value: 'Saída de pista', label: 'Saída de pista' }, { value: 'Capotamento', label: 'Capotamento' }, { value: 'Tombamento', label: 'Tombamento' }, { value: 'Atropelamento', label: 'Atropelamento' }, { value: 'Outros', label: 'Outros' }],
    veiculos: [{ id: 'AP', label: 'AP' }, { id: 'MO', label: 'MO' }, { id: 'CA', label: 'CA' }, { id: 'CAR', label: 'CAR' }, { id: 'ON', label: 'ON' }, { id: 'Utilitária', label: 'Utilitária' }],
    potencialGravidadePrevia: [{ value: 'Deambulando', label: 'Deambulando' }, { value: 'Ao solo', label: 'Ao solo' }, { value: 'Interior do veículo', label: 'Interior do veículo' }],
    recursosAdicionais: [{ id: 'Resgate', label: 'Resgate' }, { id: 'COBOM', label: 'COBOM' }, { id: 'PMR', label: 'PMR' }, { id: 'Conserva', label: 'Conserva' }, { id: 'ENERGISA', label: 'ENERGISA' }, { id: 'IML', label: 'IML' }],
    energia: [{ value: 'Baixa', label: 'Baixa' }, { value: 'Média', label: 'Média' }, { value: 'Alta', label: 'Alta' }],
    avarias: [{ value: 'Poucas', label: 'Poucas' }, { value: 'Moderadas', label: 'Moderadas' }, { value: 'Grandes', label: 'Grandes' }],
    posicaoVeiculo: [{ value: 'Posição original', label: 'Posição original' }, { value: 'Com os rodados para cima/ ângulo de 180°', label: 'Com os rodados para cima/ ângulo de 180°' }, { value: 'Lateralizado/ ângulo de 90°', label: 'Lateralizado/ ângulo de 90°' }],
    potencialGravidadeAbordagem: [{ id: 'Alerta', label: 'Alerta' }, { id: 'Deambulando', label: 'Deambulando' }, { id: 'Verbalizando', label: 'Verbalizando' }, { id: 'Consciente', label: 'Consciente' }, { id: 'Orientado', label: 'Orientado' }, { id: 'Inconsciente', label: 'Inconsciente' }, { id: 'Encarcerado/Retido', label: 'Encarcerado/Retido' }],
    cod61_62: [{ value: '61', label: '61' }, { value: '62', label: '62' }, { value: 'NILL', label: 'NILL' }],
    recursosAdicionaisConfirmacao: [{ id: 'Resgate', label: 'Resgate' }, { id: 'COBOM', label: 'COBOM' }, { id: 'PMR', label: 'PMR' }, { id: 'Conserva', label: 'Conserva' }, { id: 'ENERGISA', label: 'ENERGISA' }, { id: 'IML', label: 'IML' }, { id: 'Outros', label: 'Outros' }],
    condicoesMeteorologicas: [{ value: 'Não identificado', label: 'Não identificado' }, { value: 'Bom', label: 'Bom' }, { value: 'Chuva', label: 'Chuva' }, { value: 'Neblina', label: 'Neblina' }, { value: 'Garoa', label: 'Garoa' }, { value: 'Nublado', label: 'Nublado' }, { value: 'Chuva torrencial', label: 'Chuva torrencial' }, { value: 'Vento forte', label: 'Vento forte' }, { value: 'Chuva com ventania', label: 'Chuva com ventania' }, { value: 'Chuva com granizo', label: 'Chuva com granizo' }],
    condicaoVisibilidade: [{ value: 'Boa', label: 'Boa' }, { value: 'Parcial', label: 'Parcial' }, { value: 'Ruim', label: 'Ruim' }],
    condicoesEspeciais: [{ value: 'NILL', label: 'NILL' }, { value: 'Fumaça', label: 'Fumaça' }, { value: 'Poeira', label: 'Poeira' }, { value: 'Lama', label: 'Lama' }, { value: 'Óleo', label: 'Óleo' }, { value: 'Poça d\'água', label: 'Poça d\'água' }, { value: 'Outros', label: 'Outros' }],
    condicoesSinalizacao: [{ value: 'Existente e visível', label: 'Existente e visível' }, { value: 'Existente e encoberta', label: 'Existente e encoberta' }, { value: 'Inexistente', label: 'Inexistente' }, { value: 'Outros', label: 'Outros' }],
    tipoPista: [{ value: 'Dupla', label: 'Dupla' }, { value: 'Simples', label: 'Simples' }, { value: 'Multivias', label: 'Pista Multivias' }],
    tracadoPista: [{ value: 'Reta', label: 'Reta' }, { value: 'Curva acentuada', label: 'Curva acentuada' }, { value: 'Curva suave', label: 'Curva suave' }],
    perfil: [{ value: 'Em nível', label: 'Em nível' }, { value: 'Aclive', label: 'Aclive' }, { value: 'Declive', label: 'Declive' }],
    obrasNaPista: [{ value: 'Não existe', label: 'Não existe' }, { value: 'Existe mal sinalizada', label: 'Existe mal sinalizada' }, { value: 'Existe bem sinalizada', label: 'Existe bem sinalizada' }],
    condicaoPista: [{ value: 'Molhada', label: 'Molhada' }, { value: 'Seca', label: 'Seca' }, { value: 'Contaminada', label: 'Contaminada' }, { value: 'Escorregadia', label: 'Escorregadia' }],
    obstaculo: [{ value: 'Não existe', label: 'Não existe' }, { value: 'Acostamento', label: 'Acostamento' }, { value: 'Barreira', label: 'Barreira' }, { value: 'Meio fio', label: 'Meio fio' }, { value: 'Defensa metálica', label: 'Defensa metálica' }, { value: 'Outros', label: 'Outros' }],
    obrasNoAcostamento: [{ value: 'Não existe', label: 'Não existe' }, { value: 'Existe mal sinalizada', label: 'Existe mal sinalizada' }, { value: 'Existe bem sinalizada', label: 'Existe bem sinalizada' }],
    estadoConservacao: [{ value: 'Bom', label: 'Bom' }, { value: 'Ruim', label: 'Ruim' }],
    intersecoesPista: [{ value: 'Cruzamento/entroncamento', label: 'Cruzamento/entroncamento' }, { value: 'Trevo', label: 'Trevo' }, { value: 'Rotatória', label: 'Rotatória' }, { value: 'Não existe', label: 'Não existe' }],
    deficienciaObras: [{ value: 'Obstruída', label: 'Obstruída' }, { value: 'Interrompida', label: 'Interrompida' }, { value: 'Pista estreita', label: 'Pista estreita' }, { value: 'Pista fechada', label: 'Pista fechada' }, { value: 'Sublevação negativa', label: 'Sublevação negativa' }, { value: 'Ondulada', label: 'Ondulada' }, { value: 'Não existe', label: 'Não existe' }, { value: 'Outros', label: 'Outros' }],
    obrasDeArte: [{ value: 'Ponte', label: 'Ponte' }, { value: 'Túnel', label: 'Túnel' }, { value: 'Passagem superior', label: 'Passagem superior' }, { value: 'Passagem inferior', label: 'Passagem inferior' }, { value: 'Não existe', label: 'Não existe' }],
    local: [{ value: 'Canteiro central', label: 'Canteiro central' }, { value: 'Faixa de domínio', label: 'Faixa de domínio' }, { value: 'Acostamento norte', label: 'Acostamento norte' }, { value: 'Acostamento Sul', label: 'Acostamento Sul' }, { value: 'Faixa de rolamento', label: 'Faixa de rolamento' }, { value: 'Acostamento', label: 'Acostamento' }],
    sinalizacao: [{ value: 'Existe', label: 'Existe' }, { value: 'Não existe', label: 'Não existe' }],
    sinalizacaoSemaforo: [{ value: 'Funciona', label: 'Funciona' }, { value: 'Não funciona', label: 'Não funciona' }, { value: 'Funciona com defeito', label: 'Funciona com defeito' }, { value: 'Inexistente', label: 'Inexistente' }]
};

export default function TracadoDePistaPage() {
    const { toast } = useToast();
    const [previewData, setPreviewData] = React.useState<FormValues | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rodovia: '',
            veiculos: [],
            recursosAdicionaisPrevia: [],
            potencialGravidadeAbordagem: [],
            recursosAdicionaisConfirmacao: [],
        },
    });

    function onSubmit(values: FormValues) {
        const processedValues = fillEmptyWithNill(values);
        setPreviewData(processedValues);
    }

    function handleSave(data: FormValues) {
        console.log("Saving data:", data);
        toast({
            title: 'Formulário Enviado',
            description: 'Relatório de Traçado de Pista gerado com sucesso!',
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
                    TRAÇADO DE PISTA - ACIDENTE
                </h1>
                <p className="text-muted-foreground">
                  Preencha os campos abaixo para registrar a ocorrência.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <Accordion type="multiple" className="w-full space-y-4" defaultValue={['previa']}>
                        <AccordionItem value="previa" className="border rounded-lg">
                            <AccordionTrigger className="px-6 text-xl">PRÉVIA</AccordionTrigger>
                            <AccordionContent className="px-6 pt-2">
                                <div className="space-y-6">
                                     <FormField
                                      control={form.control}
                                      name="rodovia"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Rodovia</FormLabel>
                                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                              <SelectTrigger>
                                                <SelectValue placeholder="Selecione a rodovia" />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                              <SelectItem value="MS-112">MS-112</SelectItem>
                                              <SelectItem value="BR-158">BR-158</SelectItem>
                                              <SelectItem value="MS-306">MS-306</SelectItem>
                                              <SelectItem value="BR-436">BR-436</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    <FormField control={form.control} name="qthExato" render={({ field }) => (<FormItem><FormLabel>QTH exato</FormLabel><FormControl><Input placeholder="Km do acidente" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <RadioGroupField control={form.control} name="sentido" label="Sentido" options={formOptions.sentido} orientation="horizontal" />
                                    <RadioGroupField control={form.control} name="faixaInterditada" label="Faixa de rolamento interditada?" options={formOptions.faixaInterditada} orientation="horizontal" />
                                    <RadioGroupField control={form.control} name="provavelCinematica" label="Provável cinemática" options={formOptions.provavelCinematica} />
                                    {form.watch('provavelCinematica') === 'Outros' && <FormField control={form.control} name="provavelCinematicaOutros" render={({ field }) => (<FormItem><FormLabel>Descreva</FormLabel><FormControl><Input placeholder="Outra cinemática" {...field} /></FormControl><FormMessage /></FormItem>)} />}
                                    <CheckboxGroupField control={form.control} name="veiculos" label="Veículos" options={formOptions.veiculos} />
                                    <FormField control={form.control} name="quantidadeVitimas" render={({ field }) => (<FormItem><FormLabel>Quantidade de vítimas</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <RadioGroupField control={form.control} name="potencialGravidadePrevia" label="Potencial de gravidade" options={formOptions.potencialGravidadePrevia} />
                                    <CheckboxGroupField control={form.control} name="recursosAdicionaisPrevia" label="Recursos adicionais (se precisar)" options={formOptions.recursosAdicionais} />
                                    <p className="text-center font-bold text-muted-foreground pt-4">"QRX para confirmação da prévia."</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="confirmacao" className="border rounded-lg">
                            <AccordionTrigger className="px-6 text-xl">CONFIRMAÇÃO DA PRÉVIA</AccordionTrigger>
                            <AccordionContent className="px-6 pt-2">
                                <div className="space-y-6">
                                    <RadioGroupField control={form.control} name="cinematica" label="Cinemática" options={formOptions.provavelCinematica} />
                                    {form.watch('cinematica') === 'Outros' && <FormField control={form.control} name="cinematicaOutros" render={({ field }) => (<FormItem><FormLabel>Descreva</FormLabel><FormControl><Input placeholder="Outra cinemática" {...field} /></FormControl><FormMessage /></FormItem>)} />}
                                    <RadioGroupField control={form.control} name="energia" label="Energia" options={formOptions.energia} orientation="horizontal" />
                                    <RadioGroupField control={form.control} name="avarias" label="Avarias" options={formOptions.avarias} orientation="horizontal" />
                                    <RadioGroupField control={form.control} name="posicaoVeiculo" label="Posição do veículo" options={formOptions.posicaoVeiculo} />
                                    <FormField control={form.control} name="quantidadeVitimasConfirmacao" render={({ field }) => (<FormItem><FormLabel>Quantidade de vítimas</FormLabel><FormControl><Input type="number" placeholder="0" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <CheckboxGroupField control={form.control} name="potencialGravidadeAbordagem" label="Potencial de gravidade/Abordagem" options={formOptions.potencialGravidadeAbordagem} />
                                    <RadioGroupField control={form.control} name="cod61_62" label="Cód. 61/62?" options={formOptions.cod61_62} orientation="horizontal" />
                                    <CheckboxGroupField control={form.control} name="recursosAdicionaisConfirmacao" label="Recursos adicionais (se precisar)" options={formOptions.recursosAdicionaisConfirmacao} />
                                    {form.watch('recursosAdicionaisConfirmacao')?.includes('Outros') && <FormField control={form.control} name="recursosAdicionaisConfirmacaoOutros" render={({ field }) => (<FormItem><FormLabel>Descreva</FormLabel><FormControl><Input placeholder="Outros recursos" {...field} /></FormControl><FormMessage /></FormItem>)} />}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="condicao" className="border rounded-lg">
                            <AccordionTrigger className="px-6 text-xl">CONDIÇÃO</AccordionTrigger>
                            <AccordionContent className="px-6 pt-2">
                                <div className="space-y-6">
                                    <RadioGroupField control={form.control} name="condicoesMeteorologicas" label="Condições meteorológicas" options={formOptions.condicoesMeteorologicas} />
                                    <RadioGroupField control={form.control} name="condicaoVisibilidade" label="Condição de visibilidade" options={formOptions.condicaoVisibilidade} orientation="horizontal" />
                                    <RadioGroupField control={form.control} name="condicoesEspeciais" label="Condições especiais" options={formOptions.condicoesEspeciais} />
                                    {form.watch('condicoesEspeciais') === 'Outros' && <FormField control={form.control} name="condicoesEspeciaisOutros" render={({ field }) => (<FormItem><FormLabel>Descreva</FormLabel><FormControl><Input placeholder="Outra condição" {...field} /></FormControl><FormMessage /></FormItem>)} />}
                                    <RadioGroupField control={form.control} name="condicoesSinalizacao" label="Condições de sinalização" options={formOptions.condicoesSinalizacao} />
                                    {form.watch('condicoesSinalizacao') === 'Outros' && <FormField control={form.control} name="condicoesSinalizacaoOutros" render={({ field }) => (<FormItem><FormLabel>Descreva</FormLabel><FormControl><Input placeholder="Outra condição" {...field} /></FormControl><FormMessage /></FormItem>)} />}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="pista" className="border rounded-lg">
                            <AccordionTrigger className="px-6 text-xl">PISTA</AccordionTrigger>
                            <AccordionContent className="px-6 pt-2">
                                <div className="space-y-6">
                                    <RadioGroupField control={form.control} name="tipoPista" label="Tipo de pista" options={formOptions.tipoPista} orientation="horizontal" />
                                    <RadioGroupField control={form.control} name="tracadoPista" label="Traçado de pista" options={formOptions.tracadoPista} orientation="horizontal" />
                                    <RadioGroupField control={form.control} name="perfil" label="Perfil" options={formOptions.perfil} orientation="horizontal" />
                                    <RadioGroupField control={form.control} name="obrasNaPista" label="Obras na pista" options={formOptions.obrasNaPista} />
                                    <RadioGroupField control={form.control} name="condicaoPista" label="Condição de pista" options={formOptions.condicaoPista} orientation="horizontal" />
                                    <RadioGroupField control={form.control} name="obstaculoCanteiroCentral" label="Obstáculo canteiro central" options={formOptions.obstaculo} />
                                    {form.watch('obstaculoCanteiroCentral') === 'Outros' && <FormField control={form.control} name="obstaculoCanteiroCentralOutros" render={({ field }) => (<FormItem><FormLabel>Descreva</FormLabel><FormControl><Input placeholder="Outro obstáculo" {...field} /></FormControl><FormMessage /></FormItem>)} />}
                                    <RadioGroupField control={form.control} name="obstaculoAcostamento" label="Obstáculo acostamento" options={formOptions.obstaculo} />
                                    {form.watch('obstaculoAcostamento') === 'Outros' && <FormField control={form.control} name="obstaculoAcostamentoOutros" render={({ field }) => (<FormItem><FormLabel>Descreva</FormLabel><FormControl><Input placeholder="Outro obstáculo" {...field} /></FormControl><FormMessage /></FormItem>)} />}
                                    <RadioGroupField control={form.control} name="obrasNoAcostamento" label="Obras no acostamento" options={formOptions.obrasNoAcostamento} />
                                    <RadioGroupField control={form.control} name="estadoConservacao" label="Estado de conservação" options={formOptions.estadoConservacao} orientation="horizontal" />
                                    <RadioGroupField control={form.control} name="intersecoesPista" label="Interseções na pista" options={formOptions.intersecoesPista} />
                                    <RadioGroupField control={form.control} name="deficienciaObras" label="Deficiência em obras" options={formOptions.deficienciaObras} />
                                    {form.watch('deficienciaObras') === 'Outros' && <FormField control={form.control} name="deficienciaObrasOutros" render={({ field }) => (<FormItem><FormLabel>Descreva</FormLabel><FormControl><Input placeholder="Outra deficiência" {...field} /></FormControl><FormMessage /></FormItem>)} />}
                                    <RadioGroupField control={form.control} name="obrasDeArte" label="Obras de arte" options={formOptions.obrasDeArte} />
                                    <RadioGroupField control={form.control} name="local" label="Local" options={formOptions.local} />
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="sinalizacao" className="border rounded-lg">
                            <AccordionTrigger className="px-6 text-xl">SINALIZAÇÃO</AccordionTrigger>
                            <AccordionContent className="px-6 pt-2">
                                <div className="space-y-6">
                                    <RadioGroupField control={form.control} name="sinalizacaoVertical" label="Sinalização vertical (placas, banners, postes)" options={formOptions.sinalizacao} orientation="horizontal" />
                                    <RadioGroupField control={form.control} name="sinalizacaoHorizontal" label="Sinalização horizontal (faixa de bordo, faixa segmentada, pintura de pista...)" options={formOptions.sinalizacao} orientation="horizontal" />
                                    <RadioGroupField control={form.control} name="sinalizacaoSemaforo" label="Sinalização semáforo" options={formOptions.sinalizacaoSemaforo} />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    <Button type="submit" size="lg" className="w-full">Gerar Relatório</Button>
                </form>
            </Form>
            <PreviewDialog data={previewData} onClose={() => setPreviewData(null)} onSave={handleSave} formTitle="TRAÇADO DE PISTA" />
        </div>
    );
}
