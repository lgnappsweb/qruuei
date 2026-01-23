'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  // ACIDENTE PRÉVIA
  qthExato: z.string().optional(),
  sentidoPrevia: z.string().optional(),
  faixaInterditada: z.string().optional(),
  provavelCinematica: z.array(z.string()).optional(),
  provavelCinematicaOutros: z.string().optional(),
  veiculos: z.array(z.string()).optional(),
  quantidadeVitimasPrevia: z.string().optional(),
  potencialGravidadePrevia: z.array(z.string()).optional(),
  recursosAdicionaisPrevia: z.array(z.string()).optional(),

  // CONFIRMAÇÃO DA PRÉVIA
  cinematica: z.array(z.string()).optional(),
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
  condicoesEspeciais: z.array(z.string()).optional(),
  condicoesEspeciaisOutros: z.string().optional(),
  condicoesSinalizacao: z.string().optional(),
  condicoesSinalizacaoOutros: z.string().optional(),

  // PISTA
  tipoPista: z.string().optional(),
  tracadoPista: z.string().optional(),
  perfilPista: z.string().optional(),
  obrasNaPista: z.string().optional(),
  condicaoPista: z.string().optional(),
  obstaculoCanteiroCentral: z.array(z.string()).optional(),
  obstaculoCanteiroCentralOutros: z.string().optional(),
  obstaculoAcostamento: z.array(z.string()).optional(),
  obstaculoAcostamentoOutros: z.string().optional(),
  obrasNoAcostamento: z.string().optional(),
  estadoConservacao: z.string().optional(),
  intersecoesNaPista: z.string().optional(),
  deficienciaEmObras: z.array(z.string()).optional(),
  deficienciaEmObrasOutros: z.string().optional(),
  obrasDeArte: z.string().optional(),
  local: z.string().optional(),

  // SINALIZAÇÃO
  sinalizacaoVertical: z.string().optional(),
  sinalizacaoHorizontal: z.string().optional(),
  sinalizacaoSemaforo: z.string().optional(),
});

// Helper component for checkbox groups
const CheckboxGroup = ({
  name,
  control,
  items,
  otherFieldName,
  otherLabel = 'Outros',
}: {
  name: any;
  control: any;
  items: { id: string; label: string }[];
  otherFieldName?: any;
  otherLabel?: string;
}) => {
  const fieldValue = control.getValues(name) || [];
  const showOtherField = fieldValue.includes('Outros');
  return (
    <FormItem>
      {items.map((item) => (
        <FormField
          key={item.id}
          control={control}
          name={name}
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value?.includes(item.id)}
                  onCheckedChange={(checked) => {
                    const currentValue = field.value || [];
                    return checked
                      ? field.onChange([...currentValue, item.id])
                      : field.onChange(
                          currentValue?.filter(
                            (value: string) => value !== item.id
                          )
                        );
                  }}
                />
              </FormControl>
              <FormLabel className="font-normal text-base">{item.label}</FormLabel>
            </FormItem>
          )}
        />
      ))}
      {otherFieldName && showOtherField && (
        <FormField
          control={control}
          name={otherFieldName}
          render={({ field }) => (
            <FormItem className="pl-6 pt-2">
              <FormControl>
                <Input {...field} placeholder={otherLabel} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <FormMessage />
    </FormItem>
  );
};

// Helper component for radio groups
const RadioGroupField = ({
  name,
  control,
  items,
  otherFieldName,
  otherLabel = 'Outros',
}: {
  name: any;
  control: any;
  items: { value: string; label: string }[];
  otherFieldName?: any;
  otherLabel?: string;
}) => {
  const showOtherField = control.getValues(name) === 'Outros';
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="space-y-2"
            >
              {items.map((item) => (
                <div
                  key={item.value}
                  className="flex items-center space-x-3 space-y-0"
                >
                  <RadioGroupItem value={item.value} id={`${name}-${item.value}`} />
                  <Label htmlFor={`${name}-${item.value}`} className="font-normal text-base">{item.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          {otherFieldName && showOtherField && (
            <FormField
              control={control}
              name={otherFieldName}
              render={({ field }) => (
                <FormItem className="pt-2">
                  <FormControl>
                    <Input {...field} placeholder={otherLabel} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

// Data for options
const provavelCinematicaItems = [
  { id: 'Colisão', label: 'Colisão' },
  { id: 'Saída de pista', label: 'Saída de pista' },
  { id: 'Capotamento', label: 'Capotamento' },
  { id: 'Tombamento', label: 'Tombamento' },
  { id: 'Atropelamento', label: 'Atropelamento' },
  { id: 'Outros', label: 'Outros' },
];

const veiculosItems = [
  { id: 'AP', label: 'AP' },
  { id: 'MO', label: 'MO' },
  { id: 'CA', label: 'CA' },
  { id: 'CAR', label: 'CAR' },
  { id: 'ON', label: 'ON' },
  { id: 'Utilitária', label: 'Utilitária' },
];

const potencialGravidadePreviaItems = [
  { id: 'Deambulando', label: 'Deambulando' },
  { id: 'Ao solo', label: 'Ao solo' },
  { id: 'Interior do veículo', label: 'Interior do veículo' },
];

const recursosAdicionaisItems = [
  { id: 'Resgate', label: 'Resgate' },
  { id: 'COBOM', label: 'COBOM' },
  { id: 'PMR', label: 'PMR' },
  { id: 'Conserva', label: 'Conserva' },
  { id: 'ENERGISA', label: 'ENERGISA' },
  { id: 'IML', label: 'IML' },
];

const recursosAdicionaisConfirmacaoItems = [
  ...recursosAdicionaisItems,
  { id: 'Outros', label: 'Outros' },
]

const potencialGravidadeAbordagemItems = [
  { id: 'Alerta', label: 'Alerta' },
  { id: 'Deambulando', label: 'Deambulando' },
  { id: 'Verbalizando', label: 'Verbalizando' },
  { id: 'Consciente', label: 'Consciente' },
  { id: 'Orientado', label: 'Orientado' },
  { id: 'Inconsciente', label: 'Inconsciente' },
  { id: 'Encarcerado/Retido', label: 'Encarcerado/Retido' },
];

const condicoesEspeciaisItems = [
    { id: "NILL", label: "NILL" },
    { id: "Fumaça", label: "Fumaça" },
    { id: "Poeira", label: "Poeira" },
    { id: "Lama", label: "Lama" },
    { id: "Óleo", label: "Óleo" },
    { id: "Poça d'água", label: "Poça d'água" },
    { id: "Outros", label: "Outros" },
];

const obstaculoItems = [
    { id: "Não existe", label: "Não existe" },
    { id: "Acostamento", label: "Acostamento" },
    { id: "Barreira", label: "Barreira" },
    { id: "Meio fio", label: "Meio fio" },
    { id: "Defensa metálica", label: "Defensa metálica" },
    { id: "Outros", label: "Outros" },
]

const deficienciaEmObrasItems = [
    { id: "Obstruída", label: "Obstruída" },
    { id: "Interrompida", label: "Interrompida" },
    { id: "Pista estreita", label: "Pista estreita" },
    { id: "Pista fechada", label: "Pista fechada" },
    { id: "Sublevação negativa", label: "Sublevação negativa" },
    { id: "Ondulada", label: "Ondulada" },
    { id: "Não existe", label: "Não existe" },
    { id: "Outros", label: "Outros" },
]

export default function TracadoDePistaPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provavelCinematica: [],
      veiculos: [],
      potencialGravidadePrevia: [],
      recursosAdicionaisPrevia: [],
      cinematica: [],
      potencialGravidadeAbordagem: [],
      recursosAdicionaisConfirmacao: [],
      condicoesEspeciais: [],
      obstaculoCanteiroCentral: [],
      obstaculoAcostamento: [],
      deficienciaEmObras: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Formulário Enviado',
      description: 'Relatório de Traçado de Pista enviado com sucesso!',
    });
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
          TRAÇADO DE PISTA
        </h1>
        <p className="text-muted-foreground">
          Preencha os campos abaixo para registrar a ocorrência.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>ACIDENTE PRÉVIA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <FormField control={form.control} name="qthExato" render={({ field }) => ( <FormItem> <FormLabel>QTH exato</FormLabel> <FormControl> <Input placeholder="Km do acidente" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="sentidoPrevia" render={({ field }) => ( <FormItem> <FormLabel>Sentido</FormLabel> <FormControl> <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4"> <div className="flex items-center space-x-2 space-y-0"> <RadioGroupItem value="Norte" id="sentidoPrevia-norte" /> <Label htmlFor="sentidoPrevia-norte" className="font-normal text-base">Norte</Label> </div> <div className="flex items-center space-x-2 space-y-0"> <RadioGroupItem value="Sul" id="sentidoPrevia-sul" /> <Label htmlFor="sentidoPrevia-sul" className="font-normal text-base">Sul</Label> </div> </RadioGroup> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="faixaInterditada" render={({ field }) => ( <FormItem> <FormLabel>Faixa de rolamento interditada?</FormLabel> <FormControl> <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-wrap gap-x-4 gap-y-2"> <div className="flex items-center space-x-2 space-y-0"> <RadioGroupItem value="Norte e Sul" id="faixa-norte-sul" /> <Label htmlFor="faixa-norte-sul" className="font-normal text-base">Norte e Sul</Label> </div> <div className="flex items-center space-x-2 space-y-0"> <RadioGroupItem value="Norte" id="faixa-norte"/> <Label htmlFor="faixa-norte" className="font-normal text-base">Norte</Label> </div> <div className="flex items-center space-x-2 space-y-0"> <RadioGroupItem value="Sul" id="faixa-sul"/> <Label htmlFor="faixa-sul" className="font-normal text-base">Sul</Label> </div> <div className="flex items-center space-x-2 space-y-0"> <RadioGroupItem value="NILL" id="faixa-nill" /> <Label htmlFor="faixa-nill" className="font-normal text-base">NILL</Label> </div> </RadioGroup> </FormControl> <FormMessage /> </FormItem> )} />
              <FormItem><FormLabel>Provável cinemática</FormLabel><CheckboxGroup name="provavelCinematica" control={form.control} items={provavelCinematicaItems} otherFieldName="provavelCinematicaOutros" /></FormItem>
              <FormItem><FormLabel>Veículos</FormLabel><CheckboxGroup name="veiculos" control={form.control} items={veiculosItems} /></FormItem>
              <FormField control={form.control} name="quantidadeVitimasPrevia" render={({ field }) => ( <FormItem> <FormLabel>Quantidade de vítimas</FormLabel> <FormControl> <Input type="number" placeholder="Nº de vítimas" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormItem><FormLabel>Potencial de gravidade</FormLabel><CheckboxGroup name="potencialGravidadePrevia" control={form.control} items={potencialGravidadePreviaItems} /></FormItem>
              <FormItem><FormLabel>Recursos adicionais (se precisar)</FormLabel><CheckboxGroup name="recursosAdicionaisPrevia" control={form.control} items={recursosAdicionaisItems} /></FormItem>
              <p className="text-sm font-medium text-center text-muted-foreground">&quot;QRX para confirmação da prévia.&quot;</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>CONFIRMAÇÃO DA PRÉVIA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <FormItem><FormLabel>Cinemática</FormLabel><CheckboxGroup name="cinematica" control={form.control} items={provavelCinematicaItems} otherFieldName="cinematicaOutros" /></FormItem>
              <FormField control={form.control} name="energia" render={({ field }) => ( <FormItem> <FormLabel>Energia</FormLabel> <FormControl> <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4"> <div className="flex items-center space-x-2 space-y-0"> <RadioGroupItem value="Baixa" id="energia-baixa" /> <Label htmlFor="energia-baixa" className="font-normal text-base">Baixa</Label> </div> <div className="flex items-center space-x-2 space-y-0"> <RadioGroupItem value="Média" id="energia-media" /> <Label htmlFor="energia-media" className="font-normal text-base">Média</Label> </div> <div className="flex items-center space-x-2 space-y-0"> <RadioGroupItem value="Alta" id="energia-alta" /> <Label htmlFor="energia-alta" className="font-normal text-base">Alta</Label> </div> </RadioGroup> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="avarias" render={({ field }) => ( <FormItem> <FormLabel>Avarias</FormLabel> <FormControl> <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4"> <div className="flex items-center space-x-2 space-y-0"> <RadioGroupItem value="Poucas" id="avarias-poucas" /> <Label htmlFor="avarias-poucas" className="font-normal text-base">Poucas</Label> </div> <div className="flex items-center space-x-2 space-y-0"> <RadioGroupItem value="Moderadas" id="avarias-moderadas" /> <Label htmlFor="avarias-moderadas" className="font-normal text-base">Moderadas</Label> </div> <div className="flex items-center space-x-2 space-y-0"> <RadioGroupItem value="Grandes" id="avarias-grandes" /> <Label htmlFor="avarias-grandes" className="font-normal text-base">Grandes</Label> </div> </RadioGroup> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="posicaoVeiculo" render={({ field }) => ( <FormItem> <FormLabel>Posição do veículo</FormLabel> <FormControl> <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2"> <div className="flex items-center space-x-2 space-y-0"> <RadioGroupItem value="Posição original" id="posicao-original" /> <Label htmlFor="posicao-original" className="font-normal text-base">Posição original</Label> </div> <div className="flex items-center space-x-2 space-y-0"> <RadioGroupItem value="Com os rodados para cima/ ângulo de 180°" id="posicao-rodados-cima" /> <Label htmlFor="posicao-rodados-cima" className="font-normal text-base">Com os rodados para cima/ ângulo de 180°</Label> </div> <div className="flex items-center space-x-2 space-y-0"> <RadioGroupItem value="Lateralizado/ ângulo de 90°" id="posicao-lateralizado" /> <Label htmlFor="posicao-lateralizado" className="font-normal text-base">Lateralizado/ ângulo de 90°</Label> </div> </RadioGroup> </FormControl> <FormMessage /> </FormItem> )} />
              <FormField control={form.control} name="quantidadeVitimasConfirmacao" render={({ field }) => ( <FormItem> <FormLabel>Quantidade de vítimas</FormLabel> <FormControl> <Input type="number" placeholder="Nº de vítimas" {...field} /> </FormControl> <FormMessage /> </FormItem> )} />
              <FormItem><FormLabel>Potencial de gravidade/Abordagem</FormLabel><CheckboxGroup name="potencialGravidadeAbordagem" control={form.control} items={potencialGravidadeAbordagemItems} /></FormItem>
              <FormField control={form.control} name="cod61_62" render={({ field }) => ( <FormItem> <FormLabel>Cód. 61/62?</FormLabel> <FormControl> <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4"> <div className="flex items-center space-x-2 space-y-0"> <RadioGroupItem value="61" id="cod-61"/> <Label htmlFor="cod-61" className="font-normal text-base">61</Label> </div> <div className="flex items-center space-x-2 space-y-0"> <RadioGroupItem value="62" id="cod-62"/> <Label htmlFor="cod-62" className="font-normal text-base">62</Label> </div> <div className="flex items-center space-x-2 space-y-0"> <RadioGroupItem value="NILL" id="cod-nill" /> <Label htmlFor="cod-nill" className="font-normal text-base">NILL</Label> </div> </RadioGroup> </FormControl> <FormMessage /> </FormItem> )} />
              <FormItem><FormLabel>Recursos adicionais (se precisar)</FormLabel><CheckboxGroup name="recursosAdicionaisConfirmacao" control={form.control} items={recursosAdicionaisConfirmacaoItems} otherFieldName="recursosAdicionaisConfirmacaoOutros" /></FormItem>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>CONDIÇÕES</CardTitle></CardHeader>
            <CardContent className="space-y-6 pt-6">
              <FormItem><FormLabel>Condições meteorológicas</FormLabel><RadioGroupField name="condicoesMeteorologicas" control={form.control} items={[{value:"Não identificado", label:"Não identificado"}, {value:"Bom", label:"Bom"}, {value:"Chuva", label:"Chuva"}, {value:"Neblina", label:"Neblina"}, {value:"Garoa", label:"Garoa"}, {value:"Nublado", label:"Nublado"}, {value:"Chuva torrencial", label:"Chuva torrencial"}, {value:"Vento forte", label:"Vento forte"}, {value:"Chuva com ventania", label:"Chuva com ventania"}, {value:"Chuva com granizo", label:"Chuva com granizo"}]} /></FormItem>
              <FormItem><FormLabel>Condição de visibilidade</FormLabel><RadioGroupField name="condicaoVisibilidade" control={form.control} items={[{value:"Boa", label:"Boa"}, {value:"Parcial", label:"Parcial"}, {value:"Ruim", label:"Ruim"}]} /></FormItem>
              <FormItem><FormLabel>Condições especiais</FormLabel><CheckboxGroup name="condicoesEspeciais" control={form.control} items={condicoesEspeciaisItems} otherFieldName="condicoesEspeciaisOutros" /></FormItem>
              <FormItem><FormLabel>Condições de sinalização</FormLabel><RadioGroupField name="condicoesSinalizacao" control={form.control} items={[{value:"Existente e visível", label:"Existente e visível"}, {value:"Existente e encoberta", label:"Existente e encoberta"}, {value:"Inexistente", label:"Inexistente"}, {value:"Outros", label:"Outros"}]} otherFieldName="condicoesSinalizacaoOutros" /></FormItem>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>PISTA</CardTitle></CardHeader>
            <CardContent className="space-y-6 pt-6">
                <FormItem><FormLabel>Tipo de pista</FormLabel><RadioGroupField name="tipoPista" control={form.control} items={[{value:"Dupla", label:"Dupla"}, {value:"Simples", label:"Simples"}, {value:"Multivias", label:"Multivias"}]} /></FormItem>
                <FormItem><FormLabel>Traçado de pista</FormLabel><RadioGroupField name="tracadoPista" control={form.control} items={[{value:"Reta", label:"Reta"}, {value:"Curva acentuada", label:"Curva acentuada"}, {value:"Curva suave", label:"Curva suave"}]} /></FormItem>
                <FormItem><FormLabel>Perfil</FormLabel><RadioGroupField name="perfilPista" control={form.control} items={[{value:"Em nível", label:"Em nível"}, {value:"Aclive", label:"Aclive"}, {value:"Declive", label:"Declive"}]} /></FormItem>
                <FormItem><FormLabel>Obras na pista</FormLabel><RadioGroupField name="obrasNaPista" control={form.control} items={[{value:"Não existe", label:"Não existe"}, {value:"Existe mal sinalizada", label:"Existe mal sinalizada"}, {value:"Existe bem sinalizada", label:"Existe bem sinalizada"}]} /></FormItem>
                <FormItem><FormLabel>Condição de pista</FormLabel><RadioGroupField name="condicaoPista" control={form.control} items={[{value:"Molhada", label:"Molhada"}, {value:"Seca", label:"Seca"}, {value:"Contaminada", label:"Contaminada"}, {value:"Escorregadia", label:"Escorregadia"}]} /></FormItem>
                <FormItem><FormLabel>Obstáculo canteiro central</FormLabel><CheckboxGroup name="obstaculoCanteiroCentral" control={form.control} items={obstaculoItems} otherFieldName="obstaculoCanteiroCentralOutros" /></FormItem>
                <FormItem><FormLabel>Obstáculo acostamento</FormLabel><CheckboxGroup name="obstaculoAcostamento" control={form.control} items={obstaculoItems} otherFieldName="obstaculoAcostamentoOutros" /></FormItem>
                <FormItem><FormLabel>Obras no acostamento</FormLabel><RadioGroupField name="obrasNoAcostamento" control={form.control} items={[{value:"Não existe", label:"Não existe"}, {value:"Existe mal sinalizada", label:"Existe mal sinalizada"}, {value:"Existe bem sinalizada", label:"Existe bem sinalizada"}]} /></FormItem>
                <FormItem><FormLabel>Estado de conservação</FormLabel><RadioGroupField name="estadoConservacao" control={form.control} items={[{value:"Bom", label:"Bom"}, {value:"Ruim", label:"Ruim"}]} /></FormItem>
                <FormItem><FormLabel>Interseções na pista</FormLabel><RadioGroupField name="intersecoesNaPista" control={form.control} items={[{value:"Cruzamento/entroncamento", label:"Cruzamento/entroncamento"}, {value:"Trevo", label:"Trevo"}, {value:"Rotatória", label:"Rotatória"}, {value:"Não existe", label:"Não existe"}]} /></FormItem>
                <FormItem><FormLabel>Deficiência em obras</FormLabel><CheckboxGroup name="deficienciaEmObras" control={form.control} items={deficienciaEmObrasItems} otherFieldName="deficienciaEmObrasOutros" /></FormItem>
                <FormItem><FormLabel>Obras de arte</FormLabel><RadioGroupField name="obrasDeArte" control={form.control} items={[{value:"Ponte", label:"Ponte"}, {value:"Túnel", label:"Túnel"}, {value:"Passagem superior", label:"Passagem superior"}, {value:"Passagem inferior", label:"Passagem inferior"}, {value:"Não existe", label:"Não existe"}]} /></FormItem>
                <FormItem><FormLabel>Local</FormLabel><RadioGroupField name="local" control={form.control} items={[{value:"Canteiro central", label:"Canteiro central"}, {value:"Faixa de domínio", label:"Faixa de domínio"}, {value:"Acostamento norte", label:"Acostamento norte"}, {value:"Acostamento Sul", label:"Acostamento Sul"}, {value:"Faixa de rolamento", label:"Faixa de rolamento"}, {value:"Acostamento", label:"Acostamento"}]} /></FormItem>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>SINALIZAÇÃO</CardTitle></CardHeader>
            <CardContent className="space-y-6 pt-6">
                <FormItem><FormLabel>Sinalização vertical (placas, banners, postes)</FormLabel><RadioGroupField name="sinalizacaoVertical" control={form.control} items={[{value:"Existe", label:"Existe"}, {value:"Não existe", label:"Não existe"}]} /></FormItem>
                <FormItem><FormLabel>Sinalização horizontal (faixa de bordo, faixa segmentada, pintura de pista...)</FormLabel><RadioGroupField name="sinalizacaoHorizontal" control={form.control} items={[{value:"Existe", label:"Existe"}, {value:"Não existe", label:"Não existe"}]} /></FormItem>
                <FormItem><FormLabel>Sinalização semáforo</FormLabel><RadioGroupField name="sinalizacaoSemaforo" control={form.control} items={[{value:"Funciona", label:"Funciona"}, {value:"Não funciona", label:"Não funciona"}, {value:"Funciona com defeito", label:"Funciona com defeito"}, {value:"Inexistente", label:"Inexistente"}]} /></FormItem>
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full">Gerar Relatório</Button>
        </form>
      </Form>
    </div>
  );
}
