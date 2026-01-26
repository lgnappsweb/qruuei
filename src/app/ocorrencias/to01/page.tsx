'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PlusCircle, Share2, Trash2 } from 'lucide-react';
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
  CardFooter,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const auxilios = [
  { id: 'PR01', label: 'PR01 - Atendimento inicial' },
  { id: 'PR13', label: 'PR13 - Canalização/Sinalização' },
  { id: 'PR27', label: 'PR27 - Remoção de veículo' },
  { id: 'PR44', label: 'PR44 - Acionamento de Polícia' },
  { id: 'PR51', label: 'PR51 - Efetuado Registro Fotográfico' },
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
});

const formSchema = z.object({
  rodovia: z.string().optional(),
  ocorrencia: z.string().optional(),
  tipoPanes: z.array(z.string()).optional(),
  qth: z.string().optional(),
  sentido: z.string().optional(),
  localArea: z.string().optional(),
  vehicles: z.array(vehicleSchema).optional(),
  vtrApoio: z.boolean().default(false),
  vtrApoioDescricao: z.string().optional(),
  danoPatrimonio: z.boolean().default(false),
  danoPatrimonioDescricao: z.string().optional(),
  observacoes: z.string().optional(),
  auxilios: z.string().optional(),
});

const fillEmptyWithNill = (data: any): any => {
    if (Array.isArray(data)) {
        if (data.length === 0) return 'NILL';
        if (typeof data[0] === 'object' && data[0] !== null) {
          return data.map(item => fillEmptyWithNill(item));
        }
        return data;
    }
    if (data && typeof data === 'object') {
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

  const renderSimpleValue = (value: any, key: string): string => {
     if (typeof value === 'boolean') {
      return value ? 'SIM' : 'NÃO';
    }
    if (Array.isArray(value)) {
        if (value.length === 0) return 'NILL';
        if (key === 'tipoPanes') {
          return value.map(p => p.split(' ')[0]).join(', ');
        }
        return value.join(', ').toUpperCase();
    }
    return String(value).toUpperCase();
  }

  const Field = ({ label, value }: { label: string, value: any}) => (
    value !== 'NILL' && value !== '' && (!Array.isArray(value) || value.length > 0) ? (
      <div className="flex flex-col sm:flex-row sm:items-start">
        <div className="font-semibold text-muted-foreground mr-2 whitespace-nowrap">{formatLabel(label)}:</div>
        <div className="text-foreground font-mono break-words uppercase flex-1 text-left">{renderSimpleValue(value, label)}</div>
      </div>
    ) : null
  );

  const occurrenceCode = formTitle.match(/\(([^)]+)\)/)?.[1] || formTitle.split(' ')[0] || "Relatório";

  const handleShare = () => {
    let text = `*${formTitle.toUpperCase()}*\n\n`;

    const report = data;
    const fieldOrder = ['rodovia', 'ocorrencia', 'tipoPanes', 'qth', 'sentido', 'localArea', '---VEHICLES---', 'vtrApoio', 'vtrApoioDescricao', 'danoPatrimonio', 'danoPatrimonioDescricao', 'observacoes', 'auxilios'];
    
    fieldOrder.forEach(key => {
        if (key === '---VEHICLES---') {
            if (Array.isArray(report.vehicles) && report.vehicles.length > 0) {
                const vehicleOrder = ['marca', 'modelo', 'ano', 'cor', 'placa', 'cidadeEmplacamento', 'eixos', 'tipoVeiculo', 'estadoPneu', 'tipoCarga', 'qraCondutor', 'baixaFrequencia', 'ocupantes'];
                report.vehicles.forEach((vehicle: any, index: number) => {
                    let vehicleText = '';
                    vehicleOrder.forEach(vKey => {
                        const value = vehicle[vKey];
                        if (value != null && value !== '' && value !== 'NILL' && !(Array.isArray(value) && value.length === 0)) {
                            vehicleText += `*${formatLabel(vKey).toUpperCase()}:* ${renderSimpleValue(value, vKey)}\n`;
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
                text += `*${formatLabel(key).toUpperCase()}:* ${renderSimpleValue(value, key)}\n`;
            }
        }
    });

    if (numeroOcorrencia) {
      text += `*NÚMERO DA OCORRÊNCIA:* ${numeroOcorrencia.toUpperCase()}\n`;
    }

    const encodedText = encodeURIComponent(text.trim());
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`);
  };

  return (
    <Dialog open={!!data} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="text-center pt-6">
          <DialogTitle className="text-3xl font-bold text-center">{`Pré-visualização (${occurrenceCode})`}</DialogTitle>
          <DialogDescription>Confira os dados antes de salvar.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-6 -mr-6 mt-4">
            <div className="space-y-6">
                <Card className="shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
                    <CardHeader><CardTitle>Informações Gerais</CardTitle></CardHeader>
                    <CardContent className="pt-6 space-y-4 text-xl">
                        <Field label="rodovia" value={data.rodovia} />
                        <Field label="ocorrencia" value={data.ocorrencia} />
                        <Field label="tipoPanes" value={data.tipoPanes} />
                        <Field label="qth" value={data.qth} />
                        <Field label="sentido" value={data.sentido} />
                        <Field label="localArea" value={data.localArea} />
                    </CardContent>
                </Card>

                {Array.isArray(data.vehicles) && data.vehicles.map((vehicle: any, index: number) => (
                    <Card key={index} className="mt-6 shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
                        <CardHeader><CardTitle>Dados do Veículo {index + 1}</CardTitle></CardHeader>
                        <CardContent className="pt-6 space-y-4 text-xl">
                            {Object.entries(vehicle).map(([key, value]) => <Field key={key} label={key} value={value} />)}
                        </CardContent>
                    </Card>
                ))}

                <Card className="mt-6 shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
                    <CardHeader><CardTitle>Outras Informações</CardTitle></CardHeader>
                    <CardContent className="pt-6 space-y-4 text-xl">
                        <Field label="vtrApoio" value={data.vtrApoio} />
                        {data.vtrApoio && <Field label="vtrApoioDescricao" value={data.vtrApoioDescricao} />}
                        <Field label="danoPatrimonio" value={data.danoPatrimonio} />
                        {data.danoPatrimonio && <Field label="danoPatrimonioDescricao" value={data.danoPatrimonioDescricao} />}
                        <Field label="observacoes" value={data.observacoes} />
                        <Field label="auxilios" value={data.auxilios} />
                    </CardContent>
                </Card>

                <Card className="mt-6 border-2 border-primary shadow-lg bg-primary/10 shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
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


export default function OcorrenciaTO01Page() {
  const { toast } = useToast();
  const router = useRouter();
  const [previewData, setPreviewData] = React.useState<z.infer<typeof formSchema> | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [openVehicleItems, setOpenVehicleItems] = React.useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rodovia: '',
      ocorrencia: 'TO01',
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

  React.useEffect(() => {
    try {
        const editDataString = localStorage.getItem('editOcorrenciaData');
        if (editDataString) {
            const editData = JSON.parse(editDataString);
            if(editData.formPath === '/ocorrencias/to01') {
                const reportToLoad = editData.fullReport;
                
                const arrayFields = ['vehicles', 'tipoPanes'];
                const booleanFields = ['vtrApoio', 'danoPatrimonio'];

                Object.keys(reportToLoad).forEach(key => {
                    if (reportToLoad[key] === 'NILL') {
                        if (arrayFields.includes(key)) {
                            reportToLoad[key] = [];
                        } else if (booleanFields.includes(key)) {
                            reportToLoad[key] = false;
                        } else {
                            reportToLoad[key] = '';
                        }
                    }
                });

                if(Array.isArray(reportToLoad.vehicles)) {
                    reportToLoad.vehicles = reportToLoad.vehicles.map((vehicle: any) => {
                        const newVehicle = {...vehicle};
                        Object.keys(newVehicle).forEach(key => {
                            if (newVehicle[key] === 'NILL') {
                                newVehicle[key] = '';
                            }
                        });
                        return newVehicle;
                    });
                     if (reportToLoad.vehicles.length > 0) {
                        setOpenVehicleItems(reportToLoad.vehicles.map((v: any, i: number) => `vehicle-${i}`));
                    }
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    const processedValues = fillEmptyWithNill(values);
    setPreviewData(processedValues);
  }

  function handleSave(data: any) {
    try {
        const savedOcorrencias = JSON.parse(localStorage.getItem('ocorrencias_v2') || '[]');
        const formTitle = "VEÍCULO ABANDONADO (TO01)";

        const ocorrenciaData = {
            id: editingId || new Date().toISOString(),
            codOcorrencia: data.ocorrencia,
            type: formTitle,
            rodovia: data.rodovia,
            km: data.qth,
            timestamp: new Date().toLocaleString('pt-BR'),
            status: 'Finalizada' as const,
            fullReport: data,
            numeroOcorrencia: data.numeroOcorrencia,
            formPath: '/ocorrencias/to01'
        };

        let updatedOcorrencias;
        if (editingId) {
            updatedOcorrencias = savedOcorrencias.map((o: any) => o.id === editingId ? ocorrenciaData : o);
             toast({ title: 'Ocorrência Atualizada', description: 'Ocorrência atualizada com sucesso!' });
        } else {
            updatedOcorrencias = [...savedOcorrencias, ocorrenciaData];
            toast({ title: 'Formulário Enviado', description: 'Ocorrência registrada com sucesso!' });
        }
        
        localStorage.setItem('ocorrencias_v2', JSON.stringify(updatedOcorrencias));
        
        setPreviewData(null);
        router.push('/ocorrencias');

    } catch (e) {
        console.error("Could not save to localStorage", e);
        toast({
          variant: "destructive",
          title: 'Erro ao Salvar',
          description: 'Não foi possível salvar a ocorrência.',
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
          VEÍCULO ABANDONADO
        </h1>
        <p className="text-muted-foreground">
          Preencha os campos abaixo para registrar a ocorrência.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a ocorrência" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TO01">TO01</SelectItem>
                          <SelectItem value="TO01 / TO06">TO01 / TO06</SelectItem>
                        </SelectContent>
                      </Select>
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
                      <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="space-y-4">
             <Accordion type="multiple" className="w-full space-y-4" value={openVehicleItems} onValueChange={setOpenVehicleItems}>
                {fields.map((item, index) => (
                     <AccordionItem value={`vehicle-${index}`} key={item.id} className="border-none">
                        <Card className="shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
                            <AccordionTrigger className="w-full p-6 text-left hover:no-underline">
                                <CardTitle>Dados do Veículo {index + 1}</CardTitle>
                            </AccordionTrigger>
                            <AccordionContent>
                                <CardContent className="space-y-6 pt-2">
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
                                          <Select onValueChange={field.onChange} value={field.value}>
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
                                        <Select onValueChange={field.onChange} value={field.value}>
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
                                </CardContent>
                                <CardFooter>
                                    <Button type="button" variant="destructive" size="sm" onClick={() => remove(index)}>
                                        <Trash2 className="mr-2 h-4 w-4"/>
                                        Remover Veículo
                                    </Button>
                                </CardFooter>
                            </AccordionContent>
                        </Card>
                    </AccordionItem>
                ))}
            </Accordion>
            <Button
              type="button"
              size="lg"
              className="w-full"
              onClick={() => {
                append({ marca: '', modelo: '', ano: '', cor: '', placa: '', cidadeEmplacamento: '', eixos: '', tipoVeiculo: '', estadoPneu: '', tipoCarga: '', qraCondutor: '', baixaFrequencia: '', ocupantes: '' });
                 setOpenVehicleItems(prev => [...prev, `vehicle-${fields.length}`]);
              }}
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              {fields.length === 0 ? 'Adicionar Veículo' : 'Adicionar Outro Veículo'}
            </Button>
          </div>
          
          <Card className="shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
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
      <PreviewDialog data={previewData} onClose={() => setPreviewData(null)} onSave={handleSave} formTitle="VEÍCULO ABANDONADO (TO01)" />
    </div>
  );
}
