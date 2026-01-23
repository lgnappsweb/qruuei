'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const auxilios = [
  { id: 'PR01', label: 'PR01 - Atendimento inicial' },
  { id: 'PR08', label: 'PR08 - Verificação da sinalização de obras' },
  { id: 'PR09', label: 'PR09 - Outros' },
  { id: 'PR10', label: 'PR10 - Embargo de obra' },
  { id: 'PR13', label: 'PR13 - Canalização/Sinalização' },
  { id: 'PR14', label: 'PR14 - Tapa buraco' },
  { id: 'PR17', label: 'PR17 - Orientação/Informação ao usuário' },
  { id: 'PR18', label: 'PR18 - Recusa de dados' },
  { id: 'PR25', label: 'PR25 - Pane solucionada' },
  { id: 'PR26', label: 'PR26 - Transferência de carga' },
  { id: 'PR28', label: 'PR28 - Limpeza na praça' },
  { id: 'PR29', label: 'PR29 - Regularização de Sinalização' },
  { id: 'PR30', label: 'PR30 - Auxílio no transporte do usuário' },
  { id: 'PR33', label: 'PR33 - Reparo em cerca' },
  { id: 'PR34', label: 'PR34 - Remoção de placas / publicidade da faixa' },
  { id: 'PR35', label: 'PR35 - Orientação a lindeiros da faixa de domínio' },
  { id: 'PR36', label: 'PR36 - Notificação a lindeiros da faixa de domínio' },
  { id: 'PR37', label: 'PR37 - Implantação de Pare e Siga/ Interdição total' },
  { id: 'PR39', label: 'PR39 - Alocação de PMV móvel' },
  { id: 'PR45', label: 'PR45 - Auxílio a usuário p/comprar combustível' },
  { id: 'PR48', label: 'PR48 - Orientação/Acompanhamento de Obra' },
  { id: 'PR51', label: 'PR51 - Efetuado Registro Fotográfico' },
  { id: 'PR53', label: 'PR53 - Meios próprios' },
  { id: 'PR54', label: 'PR54 - Aux. com ferram./ Empréstimo ferram.' },
  { id: 'PR60', label: 'PR60 - Subst. de Cancela Praça de Pedágio' },
  { id: 'PR62', label: 'PR62 - Acionamento da Conservação' },
] as const;

const tiposPane = [
  { id: 'TP01', label: 'TP01 - Pane Mecânica' },
  { id: 'TP02', label: 'TP02 - Pane Elétrica' },
  { id: 'TP03', label: 'TP03 - Pane Pneu' },
  { id: 'TP04', label: 'TP04 - Pane Seca' },
  { id: 'TP05', label: 'TP05 - Super Aquecimento' },
  { id: 'TP07', label: 'TP07 - Bloqueio por Rastreador' },
  { id: 'NILL', label: 'NILL' },
] as const;

const vehicleSchema = z.object({
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
  baixaFrequencia: z.string().optional(),
  ocupantes: z.string().optional(),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  endereco: z.string().optional(),
  numero: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
});

const formSchema = z.object({
  rodovia: z.string().min(1, 'Selecione a rodovia.'),
  ocorrencia: z.string().min(1, "Selecione a ocorrência."),
  tipoPanes: z.array(z.string()).optional(),
  qth: z.string().min(1, 'O QTH é obrigatório.'),
  sentido: z.string().min(1, 'Selecione o sentido.'),
  localArea: z.string().min(1, 'Selecione o local/área.'),
  vehicles: z.array(vehicleSchema).optional(),
  vtrApoio: z.boolean().default(false),
  vtrApoioDescricao: z.string().optional(),
  danoPatrimonio: z.boolean().default(false),
  danoPatrimonioDescricao: z.string().optional(),
  observacoes: z.string().optional(),
  auxilios: z.string().optional(),
});

export default function QudOperacaoPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rodovia: '',
      ocorrencia: 'QUD OPERAÇÃO',
      tipoPanes: [],
      qth: '',
      sentido: '',
      localArea: '',
      vehicles: [],
      vtrApoio: false,
      vtrApoioDescricao: '',
      danoPatrimonio: false,
      danoPatrimonioDescricao: '',
      observacoes: '',
      auxilios: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "vehicles",
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Formulário Enviado',
      description: 'QUD OPERAÇÃO registrada com sucesso!',
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
          QUD OPERAÇÃO
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
                          <SelectItem value="Norte / Sul">Norte / Sul</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="localArea"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local/Área</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o local/área" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Faixa de Rolamento">Faixa de Rolamento</SelectItem>
                        <SelectItem value="Terceira Faixa">Terceira Faixa</SelectItem>
                        <SelectItem value="Acostamento">Acostamento</SelectItem>
                        <SelectItem value="Área de Domínio">Área de Domínio</SelectItem>
                        <SelectItem value="Praça de Pedágio">Praça de Pedágio</SelectItem>
                        <SelectItem value="BSO">BSO</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="space-y-4">
            {fields.map((item, index) => (
              <Card key={item.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Dados do Veículo {index + 1}</CardTitle>
                  <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-5 w-5" />
                    <span className="sr-only">Remover Veículo</span>
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <FormField name={`vehicles.${index}.marca`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Marca</FormLabel><FormControl><Input placeholder="Ex: Vw" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField name={`vehicles.${index}.modelo`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Modelo</FormLabel><FormControl><Input placeholder="Ex: Gol" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField name={`vehicles.${index}.ano`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Ano</FormLabel><FormControl><Input placeholder="Ex: 2020" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField name={`vehicles.${index}.cor`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Cor</FormLabel><FormControl><Input placeholder="Ex: Preto" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField name={`vehicles.${index}.placa`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Placa</FormLabel><FormControl><Input placeholder="Ex: ABC-1234" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField name={`vehicles.${index}.cidadeEmplacamento`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Cidade Emplacamento</FormLabel><FormControl><Input placeholder="Ex: Campo Grande" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField name={`vehicles.${index}.eixos`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Quantidade de Eixos</FormLabel><FormControl><Input placeholder="Ex: 2" type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField
                        control={form.control}
                        name={`vehicles.${index}.tipoVeiculo`}
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
                                    <SelectItem value="mo">MO</SelectItem>
                                    <SelectItem value="ap">AP</SelectItem>
                                    <SelectItem value="ca">CA</SelectItem>
                                    <SelectItem value="on">ON</SelectItem>
                                    <SelectItem value="car">CAR</SelectItem>
                                    <SelectItem value="utilitaria">UTILITÁRIA</SelectItem>
                                    <SelectItem value="romel_e_julieta">ROMEL E JULIETA</SelectItem>
                                    <SelectItem value="carretinha_reboque">CARRETINHA / REBOQUE</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                      control={form.control}
                      name={`vehicles.${index}.estadoPneu`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estado do Pneu</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o estado do pneu" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Bom">Bom</SelectItem>
                              <SelectItem value="Regular">Regular</SelectItem>
                              <SelectItem value="Ruim">Ruim</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField name={`vehicles.${index}.tipoCarga`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Tipo de Carga</FormLabel><FormControl><Input placeholder="Ex: Soja, vazia, etc." {...field} /></FormControl><FormMessage /></FormItem>)} />
                    <FormField name={`vehicles.${index}.qraCondutor`} control={form.control} render={({ field }) => (<FormItem><FormLabel>QRA do Condutor(a)</FormLabel><FormControl><Input placeholder="Nome do condutor (se presente)" {...field} /></FormControl><FormMessage /></FormItem>)} />
                    
                    <FormField
                      control={form.control}
                      name={`vehicles.${index}.baixaFrequencia`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Baixa Frequência</FormLabel>
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
                          <FormDescription>
                            Preencha com o número de telefone para contato.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField name={`vehicles.${index}.ocupantes`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Nº de Ocupantes</FormLabel><FormControl><Input placeholder="Ex: 0" type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                
                    <div className="pt-4">
                        <h4 className="text-lg font-medium mb-4">Dados e Endereço do Condutor</h4>
                        <div className="space-y-6">
                            <FormField
                              name={`vehicles.${index}.cpf`}
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
                              name={`vehicles.${index}.rg`}
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
                            <FormField name={`vehicles.${index}.endereco`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Endereço</FormLabel><FormControl><Input placeholder="Rua, Av, etc." {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField name={`vehicles.${index}.numero`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Nº</FormLabel><FormControl><Input placeholder="123" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField name={`vehicles.${index}.bairro`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Bairro</FormLabel><FormControl><Input placeholder="Centro" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField name={`vehicles.${index}.cidade`} control={form.control} render={({ field }) => (<FormItem><FormLabel>Cidade</FormLabel><FormControl><Input placeholder="Sua cidade" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    </div>
                </CardContent>
              </Card>
            ))}

            <Button
              type="button"
              size="lg"
              className="w-full"
              onClick={() => append({ marca: '', modelo: '', ano: '', cor: '', placa: '', cidadeEmplacamento: '', eixos: '', tipoVeiculo: '', estadoPneu: '', tipoCarga: '', qraCondutor: '', baixaFrequencia: '', ocupantes: '', cpf: '', rg: '', endereco: '', numero: '', bairro: '', cidade: '' })}
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              {fields.length === 0 ? 'Adicionar Veículo' : 'Adicionar Outro Veículo'}
            </Button>
          </div>
          
          <Card>
            <CardHeader><CardTitle>Outras Informações</CardTitle></CardHeader>
            <CardContent className="space-y-6 pt-6">
                <FormField
                    control={form.control}
                    name="vtrApoio"
                    render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                        <FormLabel className="text-base">
                            Houve VTR de apoio?
                        </FormLabel>
                        </div>
                        <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        </FormControl>
                    </FormItem>
                    )}
                />
                {form.watch('vtrApoio') && (
                    <FormField
                    control={form.control}
                    name="vtrApoioDescricao"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Descreva a VTR de apoio</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Ex: VTR-01, Polícia Militar..."
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                )}
                <FormField
                    control={form.control}
                    name="danoPatrimonio"
                    render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                        <FormLabel className="text-base">
                            Houve dano ao Patrimônio?
                        </FormLabel>
                        </div>
                        <FormControl>
                        <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        </FormControl>
                    </FormItem>
                    )}
                />
                {form.watch('danoPatrimonio') && (
                    <FormField
                    control={form.control}
                    name="danoPatrimonioDescricao"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Descreva o dano ao patrimônio</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Ex: Defensas metálicas danificadas, placa de sinalização..."
                            {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                )}
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
                <FormField
                  control={form.control}
                  name="auxilios"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Auxílios/PR</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descreva os auxílios prestados. Ex: PR01, PR13"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <Accordion type="single" collapsible className="w-full pt-2">
                        <AccordionItem value="item-1" className="border-b-0">
                          <AccordionTrigger className="py-0 text-sm font-normal text-muted-foreground hover:no-underline hover:text-primary [&[data-state=open]>svg]:text-primary">
                            Códigos de referência
                          </AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pt-2">
                              {auxilios.map((item) => (
                                <li key={item.id}>{item.label}</li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </CardContent>
          </Card>
          
          <Button type="submit" size="lg" className="w-full">Gerar Relatório</Button>
        </form>
      </Form>
    </div>
  );
}
