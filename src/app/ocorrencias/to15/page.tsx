'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { ArrowLeft, PlusCircle } from 'lucide-react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const veiculoSchema = z.object({
    marca: z.string().min(1, "Marca é obrigatória."),
    modelo: z.string().min(1, "Modelo é obrigatório."),
    ano: z.string().min(4, "Ano inválido.").max(4, "Ano inválido."),
    cor: z.string().min(1, "Cor é obrigatória."),
    placa: z.string().min(1, "Placa é obrigatória."),
    cidadeEmplacamento: z.string().min(1, "Cidade é obrigatória."),
    vindoDe: z.string().min(1, "Origem é obrigatória."),
    indoPara: z.string().min(1, "Destino é obrigatório."),
    eixos: z.string({ required_error: "Selecione a quantidade de eixos." }),
    tipoVeiculo: z.string({ required_error: "Selecione o tipo de veículo." }),
    estadoPneu: z.string({ required_error: "Selecione o estado do pneu." }),
    tipoCarga: z.string(),
    qraCondutor: z.string().min(1, "Nome do condutor é obrigatório."),
    baixaFrequencia: z.string(),
    ocupantes: z.string(),
  });

const formSchema = z.object({
  rodovia: z.string({ required_error: "Selecione a rodovia." }),
  tipoPane: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Você precisa selecionar pelo menos um tipo de pane.',
  }),
  qth: z.string().min(1, "O local é obrigatório."),
  sentido: z.string({ required_error: "Selecione o sentido." }),
  localArea: z.string({ required_error: "Selecione o local/área." }),
  veiculos: z.array(veiculoSchema),
  auxiliosPr: z.string(),
  informeVtrApoio: z.boolean(),
  observacoes: z.string(),
});

export default function OcorrenciaFormPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipoPane: [],
      veiculos: [{
        marca: '', modelo: '', ano: '', cor: '', placa: '', cidadeEmplacamento: '', vindoDe: '', indoPara: '', tipoCarga: '', qraCondutor: '', baixaFrequencia: '', ocupantes: ''
      }],
      auxiliosPr: '',
      informeVtrApoio: false,
      observacoes: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const tipoPaneOptions = [
    { id: 'TP01', label: 'TP01' }, { id: 'TP02', label: 'TP02' }, { id: 'TP03', label: 'TP03' },
    { id: 'TP04', label: 'TP04' }, { id: 'TP05', label: 'TP05' }, { id: 'TP07', label: 'TP07' },
    { id: 'NILL', label: 'NILL' },
  ];
  
  const eixosOptions = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'Outro'];
  
  const tipoVeiculoOptions = [
      {value: "MO", label: "MO"}, {value: "AP", label: "AP"}, {value: "UTILITARIA", label: "UTILITÁRIA"}, {value: "CA", label: "CA"},
      {value: "ON", label: "ON"}, {value: "CAR", label: "CAR"}, {value: "CA/ ROMEU E JULIETA", label: "CA/ ROMEU E JULIETA"}, {value: "CARRETA/TRANSPI.BOGUE", label: "CARRETA/TRANSPI.BOGUE"},
  ];

  return (
    <div className="space-y-8 pb-24 max-w-2xl mx-auto">
      <Button asChild variant="ghost" className="pl-0">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o início
        </Link>
      </Button>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-condensed tracking-tight">
          PANE SOBRE FAIXA DE ROLAMENTO
        </h1>
        <p className="text-muted-foreground">
          Preencha os campos abaixo e envie o relatório completo.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <div className="space-y-6">
            <h2 className="text-xl font-bold font-condensed tracking-tight">INFORMAÇÕES GERAIS</h2>
            <Separator />
            <FormField control={form.control} name="rodovia" render={({ field }) => ( <FormItem className="space-y-3"> <FormLabel>RODOVIA</FormLabel> <FormControl> <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1"> <FormItem className="flex items-center space-x-3 space-y-0"> <FormControl><RadioGroupItem value="MS-112" /></FormControl> <FormLabel className="font-normal">MS-112</FormLabel> </FormItem> <FormItem className="flex items-center space-x-3 space-y-0"> <FormControl><RadioGroupItem value="BR-158" /></FormControl> <FormLabel className="font-normal">BR-158</FormLabel> </FormItem> <FormItem className="flex items-center space-x-3 space-y-0"> <FormControl><RadioGroupItem value="MS-306" /></FormControl> <FormLabel className="font-normal">MS-306</FormLabel> </FormItem> </RadioGroup> </FormControl> <FormMessage /> </FormItem> )}/>
            <FormItem> <FormLabel>OCORRÊNCIA</FormLabel> <p className="text-sm text-muted-foreground pt-2">TO-06</p> </FormItem>
            <FormField control={form.control} name="tipoPane" render={({ field }) => ( <FormItem> <FormLabel>TIPO DE PANE</FormLabel> <div className="space-y-2 pt-2"> {tipoPaneOptions.map((item) => ( <FormItem key={item.id} className="flex flex-row items-center space-x-3 space-y-0"> <FormControl> <Checkbox checked={field.value?.includes(item.id)} onCheckedChange={(checked) => { return checked ? field.onChange([...field.value, item.id]) : field.onChange(field.value?.filter((value) => value !== item.id)) }} /> </FormControl> <FormLabel className="font-normal">{item.label}</FormLabel> </FormItem>))} </div> <FormMessage /> </FormItem>)}/>
            <FormField control={form.control} name="qth" render={({ field }) => ( <FormItem> <FormLabel>QTH (LOCAL)</FormLabel> <FormControl> <Input placeholder="Ex: km 123 da MS-306" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="sentido" render={({ field }) => ( <FormItem className="space-y-3"> <FormLabel>SENTIDO</FormLabel> <FormControl> <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1"> <FormItem className="flex items-center space-x-3 space-y-0"> <FormControl><RadioGroupItem value="NORTE" /></FormControl> <FormLabel className="font-normal">NORTE</FormLabel> </FormItem> <FormItem className="flex items-center space-x-3 space-y-0"> <FormControl><RadioGroupItem value="SUL" /></FormControl> <FormLabel className="font-normal">SUL</FormLabel> </FormItem> <FormItem className="flex items-center space-x-3 space-y-0"> <FormControl><RadioGroupItem value="NORTE E SUL" /></FormControl> <FormLabel className="font-normal">NORTE E SUL</FormLabel> </FormItem> </RadioGroup> </FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="localArea" render={({ field }) => ( <FormItem className="space-y-3"> <FormLabel>LOCAL/ÁREA</FormLabel> <FormControl> <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1"> <FormItem className="flex items-center space-x-3 space-y-0"> <FormControl><RadioGroupItem value="FAIXA DE ROLAMENTO" /></FormControl> <FormLabel className="font-normal">FAIXA DE ROLAMENTO</FormLabel> </FormItem> <FormItem className="flex items-center space-x-3 space-y-0"> <FormControl><RadioGroupItem value="TERCEIRA FAIXA" /></FormControl> <FormLabel className="font-normal">TERCEIRA FAIXA</FormLabel> </FormItem> <FormItem className="flex items-center space-x-3 space-y-0"> <FormControl><RadioGroupItem value="FAIXA DE ROLAMENTO/ACOSTAMENTO" /></FormControl> <FormLabel className="font-normal">FAIXA DE ROLAMENTO/ACOSTAMENTO</FormLabel> </FormItem> <FormItem className="flex items-center space-x-3 space-y-0"> <FormControl><RadioGroupItem value="TERCEIRA FAIXA/ACOSTAMENTO" /></FormControl> <FormLabel className="font-normal">TERCEIRA FAIXA/ACOSTAMENTO</FormLabel> </FormItem> </RadioGroup> </FormControl> <FormMessage /> </FormItem> )}/>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold font-condensed tracking-tight">DADOS DO VEÍCULO 1</h2>
            <Separator />
            <div className="space-y-4">
             <FormField control={form.control} name="veiculos.0.marca" render={({ field }) => ( <FormItem> <FormLabel>MARCA</FormLabel> <FormControl> <Input placeholder="Ex: Vw" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
             <FormField control={form.control} name="veiculos.0.modelo" render={({ field }) => ( <FormItem> <FormLabel>MODELO</FormLabel> <FormControl> <Input placeholder="Ex: Gol" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
             <FormField control={form.control} name="veiculos.0.ano" render={({ field }) => ( <FormItem> <FormLabel>ANO</FormLabel> <FormControl> <Input placeholder="Ex: 2020" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
             <FormField control={form.control} name="veiculos.0.cor" render={({ field }) => ( <FormItem> <FormLabel>COR</FormLabel> <FormControl> <Input placeholder="Ex: Branco" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
             <FormField control={form.control} name="veiculos.0.placa" render={({ field }) => ( <FormItem> <FormLabel>PLACA</FormLabel> <FormControl> <Input placeholder="Ex: ABC-1234" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
             <FormField control={form.control} name="veiculos.0.cidadeEmplacamento" render={({ field }) => ( <FormItem> <FormLabel>CIDADE EMPLACAMENTO</FormLabel> <FormControl> <Input placeholder="Ex: São Paulo" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
             <FormField control={form.control} name="veiculos.0.vindoDe" render={({ field }) => ( <FormItem> <FormLabel>VINDO DE</FormLabel> <FormControl> <Input placeholder="Ex: Rio de Janeiro" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
             <FormField control={form.control} name="veiculos.0.indoPara" render={({ field }) => ( <FormItem> <FormLabel>INDO PARA</FormLabel> <FormControl> <Input placeholder="Ex: Belo Horizonte" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="veiculos.0.eixos" render={({ field }) => ( <FormItem> <FormLabel>QUANTIDADE DE EIXOS</FormLabel> <FormControl> <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-5 gap-2 pt-2"> {eixosOptions.map(val => ( <FormItem key={val} className="flex items-center space-x-2 space-y-0"> <FormControl><RadioGroupItem value={val} /></FormControl> <FormLabel className="font-normal">{val}</FormLabel> </FormItem>))} </RadioGroup> </FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="veiculos.0.tipoVeiculo" render={({ field }) => ( <FormItem> <FormLabel>TIPO DE VEÍCULO</FormLabel> <FormControl> <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1 pt-2"> {tipoVeiculoOptions.map(item => ( <FormItem key={item.value} className="flex items-center space-x-3 space-y-0"> <FormControl><RadioGroupItem value={item.value} /></FormControl> <FormLabel className="font-normal">{item.label}</FormLabel> </FormItem>))} </RadioGroup> </FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="veiculos.0.estadoPneu" render={({ field }) => ( <FormItem> <FormLabel>ESTADO DO PNEU</FormLabel> <FormControl> <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1 pt-2"> <FormItem className="flex items-center space-x-3 space-y-0"> <FormControl><RadioGroupItem value="BOM" /></FormControl> <FormLabel className="font-normal">BOM</FormLabel> </FormItem> <FormItem className="flex items-center space-x-3 space-y-0"> <FormControl><RadioGroupItem value="REGULAR" /></FormControl> <FormLabel className="font-normal">REGULAR</FormLabel> </FormItem> <FormItem className="flex items-center space-x-3 space-y-0"> <FormControl><RadioGroupItem value="RUIM" /></FormControl> <FormLabel className="font-normal">RUIM</FormLabel> </FormItem> </RadioGroup> </FormControl> <FormMessage /> </FormItem> )}/>
             <FormField control={form.control} name="veiculos.0.tipoCarga" render={({ field }) => ( <FormItem> <FormLabel>TIPO DE CARGA</FormLabel> <FormControl> <Input placeholder="Ex: Soja, Vazio" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
            <div> <h3 className="text-base font-bold font-condensed tracking-tight">CONDUTOR</h3> <Separator className="my-2"/> </div>
             <FormField control={form.control} name="veiculos.0.qraCondutor" render={({ field }) => ( <FormItem> <FormLabel>QRA DO CONDUTOR(A)</FormLabel> <FormControl> <Input placeholder="Nome do Condutor" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
             <FormField control={form.control} name="veiculos.0.baixaFrequencia" render={({ field }) => ( <FormItem> <FormLabel>BAIXA FREQUÊNCIA</FormLabel> <FormControl> <Input placeholder="(00) 00000-0000" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
             <FormField control={form.control} name="veiculos.0.ocupantes" render={({ field }) => ( <FormItem> <FormLabel>OCUPANTES</FormLabel> <FormControl> <Input placeholder="Ex: 2 Adultos, 1 Criança" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
            </div>
            <Button type="button" variant="outline" className="w-full"> <PlusCircle className="mr-2 h-4 w-4" /> ADICIONAR VEÍCULO </Button>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold font-condensed tracking-tight">OUTRAS INFORMAÇÕES</h2>
            <Separator />
            <FormField control={form.control} name="auxiliosPr" render={({ field }) => ( <FormItem> <FormLabel>AUXÍLIOS/PR</FormLabel> <FormControl> <Textarea placeholder="Descreva os Auxílios Prestados" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
            <FormField control={form.control} name="informeVtrApoio" render={({ field }) => ( <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow"> <FormControl> <Checkbox checked={field.value} onCheckedChange={field.onChange} /> </FormControl> <div className="space-y-1 leading-none"> <FormLabel> INFORME VTR DE APOIO? </FormLabel> </div> </FormItem> )}/>
            <FormField control={form.control} name="observacoes" render={({ field }) => ( <FormItem> <FormLabel>OBSERVAÇÕES</FormLabel> <FormControl> <Textarea placeholder="Descreva Detalhes Adicionais Sobre a Ocorrência" {...field} /> </FormControl> <FormMessage /> </FormItem> )}/>
          </div>

          <Button type="submit" className="w-full" size="lg">GERAR RELATÓRIO</Button>
        </form>
      </Form>
    </div>
  );
}
