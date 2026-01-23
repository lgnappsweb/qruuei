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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
  } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const auxilios = [
  { id: 'PR01', label: 'PR01 - Atendimento inicial' },
  { id: 'PR13', label: 'PR13 - Canalização/Sinalização' },
  { id: 'PR27', label: 'PR27 - Remoção de veículo' },
  { id: 'PR44', label: 'PR44 - Acionamento de Polícia' },
  { id: 'PR46', label: 'PR46 - Não localizado' },
  { id: 'PR09', label: 'PR09 - Outros' },
] as const;

const tiposPane = [
  { id: 'TP01', label: 'TP01 - Pane Mecânica' },
  { id: 'TP02', label: 'TP02 - Pane Elétrica' },
  { id: 'TP03', label: 'TP03 - Pane Pneu' },
  { id: 'TP04', label: 'TP04 - Pane Seca' },
  { id: 'TP05', label: 'TP05 - Super Aquecimento' },
  { id: 'TP07', label: 'TP07 - Bloqueio por Rastreador' },
] as const;

const formSchema = z.object({
  rodovia: z.string().min(1, 'Selecione a rodovia.'),
  ocorrencia: z.string(),
  tipoPanes: z.array(z.string()).optional(),
  qth: z.string().min(1, 'O QTH é obrigatório.'),
  sentido: z.string().min(1, 'Selecione o sentido.'),
  localArea: z.string().min(1, 'Selecione o local/área.'),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  ano: z.string().optional(),
  cor: z.string().optional(),
  placa: z.string().optional(),
  cidadeEmplacamento: z.string().optional(),
  eixos: z.string().optional(),
  tipoVeiculo: z.string().optional(),
  estadoPneu: z.string().optional(),
  tipoCarga: z.string().optional(),
  qraCondutor: z.string().optional(),
  baixaFrequencia: z.boolean().default(false),
  ocupantes: z.string().optional(),
  auxilios: z.array(z.string()).optional(),
  observacoes: z.string().optional(),
  numeroOcorrencia: z.string().optional(),
});

export default function OcorrenciaTO01Page() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rodovia: '',
      ocorrencia: 'Veículo Abandonado (TO01)',
      tipoPanes: [],
      qth: '',
      sentido: '',
      localArea: '',
      marca: '',
      modelo: '',
      ano: '',
      cor: '',
      placa: '',
      cidadeEmplacamento: '',
      eixos: '',
      tipoVeiculo: '',
      estadoPneu: '',
      tipoCarga: '',
      qraCondutor: '',
      baixaFrequencia: false,
      ocupantes: '',
      auxilios: [],
      observacoes: '',
      numeroOcorrencia: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Formulário Enviado',
      description: 'Ocorrência TO01 registrada com sucesso!',
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
          VEÍCULO ABANDONADO
        </h1>
        <p className="text-muted-foreground">
          Preencha os campos abaixo para registrar a ocorrência.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                 <FormField
                  control={form.control}
                  name="ocorrencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ocorrência</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-muted"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="tipoPanes"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tipos de Pane</FormLabel>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <FormControl>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal h-14 text-xl px-4 py-2">
                                        <div className="truncate">
                                            {field.value?.length
                                                ? tiposPane
                                                    .filter(pane => field.value?.includes(pane.id))
                                                    .map(pane => pane.label)
                                                    .join(', ')
                                                : "Selecione um ou mais tipos de pane (opcional)"}
                                        </div>
                                    </Button>
                                </FormControl>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                {tiposPane.map(item => (
                                    <DropdownMenuCheckboxItem
                                        key={item.id}
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={checked => {
                                            const newValue = checked
                                                ? [...(field.value || []), item.id]
                                                : field.value?.filter(value => value !== item.id);
                                            field.onChange(newValue);
                                        }}
                                        onSelect={e => e.preventDefault()}
                                        className="text-xl"
                                    >
                                        {item.label}
                                    </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <FormDescription>
                            Você pode selecionar múltiplos tipos de pane.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="qth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>QTH (Local)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: KM 15+200" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sentido"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sentido</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o sentido" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Norte">Norte</SelectItem>
                          <SelectItem value="Sul">Sul</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="localArea"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Local/Área</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-row flex-wrap gap-4"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Acostamento" />
                            </FormControl>
                            <FormLabel className="font-normal text-xl">Acostamento</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Faixa de Domínio" />
                            </FormControl>
                            <FormLabel className="font-normal text-xl">Faixa de Domínio</FormLabel>
                          </FormItem>
                           <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="Pista" />
                            </FormControl>
                            <FormLabel className="font-normal text-xl">Pista</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dados do Veículo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 <FormField name="marca" control={form.control} render={({ field }) => (<FormItem><FormLabel>Marca</FormLabel><FormControl><Input placeholder="Ex: Ford" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField name="modelo" control={form.control} render={({ field }) => (<FormItem><FormLabel>Modelo</FormLabel><FormControl><Input placeholder="Ex: Ka" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField name="ano" control={form.control} render={({ field }) => (<FormItem><FormLabel>Ano</FormLabel><FormControl><Input placeholder="Ex: 2020" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField name="cor" control={form.control} render={({ field }) => (<FormItem><FormLabel>Cor</FormLabel><FormControl><Input placeholder="Ex: Preto" {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 <FormField name="placa" control={form.control} render={({ field }) => (<FormItem><FormLabel>Placa</FormLabel><FormControl><Input placeholder="Ex: ABC-1234" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField name="cidadeEmplacamento" control={form.control} render={({ field }) => (<FormItem><FormLabel>Cidade Emplacamento</FormLabel><FormControl><Input placeholder="Ex: Campo Grande" {...field} /></FormControl><FormMessage /></FormItem>)} />
                 <FormField name="eixos" control={form.control} render={({ field }) => (<FormItem><FormLabel>Quantidade de Eixos</FormLabel><FormControl><Input placeholder="Ex: 2" type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                <FormField
                    control={form.control}
                    name="tipoVeiculo"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tipo de Veículo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="moto">Moto</SelectItem>
                                <SelectItem value="carro">Carro</SelectItem>
                                <SelectItem value="caminhonete">Caminhonete</SelectItem>
                                <SelectItem value="caminhao">Caminhão</SelectItem>
                                <SelectItem value="onibus">Ônibus</SelectItem>
                                <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
              </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="estadoPneu"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Estado do Pneu</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-row space-x-4">
                          <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="Bom" /></FormControl><FormLabel className="font-normal text-xl">Bom</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="Razoável" /></FormControl><FormLabel className="font-normal text-xl">Razoável</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="Ruim" /></FormControl><FormLabel className="font-normal text-xl">Ruim</FormLabel></FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0"><FormControl><RadioGroupItem value="Não se aplica" /></FormControl><FormLabel className="font-normal text-xl">N/A</FormLabel></FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField name="tipoCarga" control={form.control} render={({ field }) => (<FormItem><FormLabel>Tipo de Carga</FormLabel><FormControl><Input placeholder="Ex: Soja, vazia, etc." {...field} /></FormControl><FormMessage /></FormItem>)} />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Outras Informações</CardTitle></CardHeader>
            <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField name="qraCondutor" control={form.control} render={({ field }) => (<FormItem><FormLabel>QRA do Condutor(a)</FormLabel><FormControl><Input placeholder="Nome do condutor (se presente)" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField name="ocupantes" control={form.control} render={({ field }) => (<FormItem><FormLabel>Ocupantes</FormLabel><FormControl><Input placeholder="Ex: 0" type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField
                      control={form.control}
                      name="baixaFrequencia"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-start rounded-lg border p-4 mt-8">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-0.5 ml-4">
                            <FormLabel className="text-xl">
                              Baixa Frequência?
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                </div>
                 <FormField
                  control={form.control}
                  name="auxilios"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel>Auxílios/PR</FormLabel>
                        <FormDescription>
                          Selecione os auxílios prestados.
                        </FormDescription>
                      </div>
                      {auxilios.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="auxilios"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-xl">
                                  {item.label}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="observacoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detalhes adicionais sobre a ocorrência."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                <FormField name="numeroOcorrencia" control={form.control} render={({ field }) => (<FormItem><FormLabel>Número da Ocorrência</FormLabel><FormControl><Input placeholder="Nº gerado pelo sistema" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </CardContent>
          </Card>
          
          <Button type="submit" size="lg">Salvar Ocorrência</Button>
        </form>
      </Form>
    </div>
  );
}
