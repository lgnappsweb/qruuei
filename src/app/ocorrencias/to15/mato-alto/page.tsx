'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Control } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  CardContent,
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
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from '@/lib/utils';

const auxilios = [
    { id: 'PR09', label: 'PR09 - Outros' },
    { id: 'PR13', label: 'PR13 - Canalização/Sinalização' },
    { id: 'PR37', label: 'PR37 - Implantação de Pare e Siga/ Interdição total' },
    { id: 'PR51', label: 'PR51 - Efetuado Registro Fotográfico' },
    { id: 'PR62', label: 'PR62 - Acionamento da Conservação' },
] as const;

const formSchema = z.object({
  // INFORMAÇÕES GERAIS
  rodovia: z.string().optional(),
  ocorrencia: z.string().optional(),
  qth: z.string().optional(),
  sentido: z.string().optional(),

  // DETALHES DO MATO ALTO
  locais: z.array(z.string()).optional(),
  locaisOutros: z.string().optional(),
  tipoVegetacao: z.string().optional(),
  acaoSolicitada: z.array(z.string()).optional(),
  extensaoAproximada: z.string().optional(),

  // OUTRAS INFORMAÇÕES
  vtrApoio: z.boolean().default(false),
  vtrApoioDescricao: z.string().optional(),
  observacoes: z.string().optional(),
  auxilios: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const fillEmptyWithNill = (data: any): any => {
    if (Array.isArray(data)) {
        if (data.length === 0) return 'NILL';
        return data.map(item => fillEmptyWithNill(item));
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

  const occurrenceCode = formTitle.match(/\(([^)]+)\)/)?.[1] || formTitle.split(' ')[0] || "Relatório";

  const handleShare = () => {
    let text = `*${formTitle.toUpperCase()}*\n\n`;

    const sections: { title: string, fields: (keyof FormValues)[] }[] = [
        { title: 'Informações Gerais', fields: ['rodovia', 'ocorrencia', 'qth', 'sentido'] },
        { title: 'Detalhes do Mato Alto', fields: ['locais', 'locaisOutros', 'tipoVegetacao', 'acaoSolicitada', 'extensaoAproximada'] },
        { title: 'Outras Informações', fields: ['vtrApoio', 'vtrApoioDescricao', 'observacoes', 'auxilios'] }
    ];

    sections.forEach(section => {
        let sectionText = '';
        section.fields.forEach(key => {
            const value = data[key];
            if (value !== 'NILL' && value !== '' && (!Array.isArray(value) || value.length > 0)) {
                if ((key === 'locaisOutros' && !data.locais?.includes('Outros')) ||
                    (key === 'vtrApoioDescricao' && !data.vtrApoio)) {
                    return;
                }
                sectionText += `*${formatLabel(key).toUpperCase()}:* ${renderSimpleValue(value)}\n`;
            }
        });
        if(sectionText) {
            text += `*${section.title.toUpperCase()}*\n${sectionText}\n`;
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
          <DialogTitle className="text-3xl font-bold">{`Pré-visualização (${occurrenceCode})`}</DialogTitle>
          <DialogDescription>Confira os dados antes de salvar.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-6 -mr-6 mt-4">
            <div className="space-y-6">
                <Card className="shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
                    <CardHeader><CardTitle>Informações Gerais</CardTitle></CardHeader>
                    <CardContent className="text-xl space-y-4 pt-6">
                        <Field label="rodovia" value={data.rodovia} />
                        <Field label="ocorrencia" value={data.ocorrencia} />
                        <Field label="qth" value={data.qth} />
                        <Field label="sentido" value={data.sentido} />
                    </CardContent>
                </Card>
                 <Card className="shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
                    <CardHeader><CardTitle>Detalhes do Mato Alto</CardTitle></CardHeader>
                    <CardContent className="text-xl space-y-4 pt-6">
                        <Field label="locais" value={data.locais} />
                        {data.locais?.includes('Outros') && <Field label="locaisOutros" value={data.locaisOutros} />}
                        <Field label="tipoVegetacao" value={data.tipoVegetacao} />
                        <Field label="acaoSolicitada" value={data.acaoSolicitada} />
                        <Field label="extensaoAproximada" value={data.extensaoAproximada} />
                    </CardContent>
                </Card>
                <Card className="shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
                    <CardHeader><CardTitle>Outras Informações</CardTitle></CardHeader>
                    <CardContent className="text-xl space-y-4 pt-6">
                        <Field label="vtrApoio" value={data.vtrApoio} />
                        {data.vtrApoio && <Field label="vtrApoioDescricao" value={data.vtrApoioDescricao} />}
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


function CheckboxGroupField({ control, name, label, options }: { control: Control<FormValues>, name: keyof FormValues, label: string, options: { id: string, label: string }[] }) {
    return (
      <FormItem>
        <div className="mb-4">
          <FormLabel className="text-base">{label}</FormLabel>
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
                        className="h-6 w-6"
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


export default function MatoAltoPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [previewData, setPreviewData] = React.useState<FormValues | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rodovia: '',
      ocorrencia: 'TO15',
      qth: '',
      sentido: '',
      locais: [],
      locaisOutros: '',
      tipoVegetacao: '',
      acaoSolicitada: [],
      extensaoAproximada: '',
      vtrApoio: false,
      vtrApoioDescricao: '',
      auxilios: '',
      observacoes: '',
    },
  });

  React.useEffect(() => {
    try {
        const editDataString = localStorage.getItem('editOcorrenciaData');
        if (editDataString) {
            const editData = JSON.parse(editDataString);
            if(editData.formPath === '/ocorrencias/to15/mato-alto') {
                const reportToLoad = editData.fullReport;
                
                Object.keys(reportToLoad).forEach(key => {
                    if (reportToLoad[key] === 'NILL') {
                       reportToLoad[key] = Array.isArray(form.getValues(key as keyof FormValues)) ? [] : '';
                    }
                });

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


  function onSubmit(values: FormValues) {
    const processedValues = fillEmptyWithNill(values);
    setPreviewData(processedValues);
  }

  function handleSave(data: any) {
    try {
        const savedOcorrencias = JSON.parse(localStorage.getItem('ocorrencias_v2') || '[]');
        const formTitle = "MATO ALTO NA FAIXA DE DOMÍNIO (TO15)";

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
            formPath: '/ocorrencias/to15/mato-alto'
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
        <Link href="/ocorrencias/to15">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para seleção
        </Link>
      </Button>

      <div className="space-y-2 text-center">
        <h1 className="font-condensed text-3xl font-bold tracking-tight">
          MATO ALTO NA FAIXA DE DOMÍNIO
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
                      <FormControl>
                        <Input {...field} readOnly className="bg-muted"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
                          <SelectItem value="Ambos">Ambos</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
            <CardHeader><CardTitle>Detalhes do Mato Alto</CardTitle></CardHeader>
            <CardContent className="space-y-6 pt-6">
                <CheckboxGroupField control={form.control} name="locais" label="Locais Afetados" options={[
                    { id: 'Pé de Placas', label: 'Pé de Placas' },
                    { id: 'Defensas Metálicas', label: 'Defensas Metálicas' },
                    { id: 'Pontes', label: 'Pontes' },
                    { id: 'Praças de Pedágio', label: 'Praças de Pedágio' },
                    { id: 'BSO', label: 'BSO' },
                    { id: 'Acostamento', label: 'Acostamento' },
                    { id: 'Canteiro Central', label: 'Canteiro Central' },
                    { id: 'Talude', label: 'Talude' },
                    { id: 'Outros', label: 'Outros' },
                ]}/>
                {form.watch('locais')?.includes('Outros') &&
                    <FormField control={form.control} name="locaisOutros" render={({ field }) => (<FormItem><FormLabel>Outros Locais</FormLabel><FormControl><Input placeholder="Descreva outros locais" {...field} /></FormControl><FormMessage /></FormItem>)}/>
                }
                <FormField
                    control={form.control}
                    name="tipoVegetacao"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tipo de Vegetação Predominante</FormLabel>
                        <FormControl>
                        <Input placeholder="Ex: Grama, arbustos, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <CheckboxGroupField control={form.control} name="acaoSolicitada" label="Ação Solicitada" options={[
                    { id: 'Roçada', label: 'Roçada' },
                    { id: 'Capina', label: 'Capina' },
                    { id: 'Poda', label: 'Poda' },
                    { id: 'Limpeza Geral', label: 'Limpeza Geral' },
                ]}/>
                <FormField
                    control={form.control}
                    name="extensaoAproximada"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Extensão Aproximada</FormLabel>
                        <FormControl>
                        <Input placeholder="Ex: 100 metros, 50m²" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </CardContent>
          </Card>
          
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
                          placeholder="Descreva os auxílios prestados. Ex: PR62"
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
      <PreviewDialog data={previewData} onClose={() => setPreviewData(null)} onSave={handleSave} formTitle="MATO ALTO NA FAIXA DE DOMÍNIO (TO15)" />
    </div>
  );
}
