'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Share2 } from 'lucide-react';
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
  CardContent,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const auxilios = [
    { id: 'PR08', label: 'PR08 - Verificação da sinalização de obras' },
    { id: 'PR10', label: 'PR10 - Embargo de obra' },
    { id: 'PR13', label: 'PR13 - Canalização/Sinalização' },
    { id: 'PR14', label: 'PR14 - Tapa buraco' },
    { id: 'PR28', label: 'PR28 - Limpeza na praça' },
    { id: 'PR29', label: 'PR29 - Regularização de Sinalização' },
    { id: 'PR33', label: 'PR33 - Reparo em cerca' },
    { id: 'PR34', label: 'PR34 - Remoção de placas / publicidade da faixa' },
    { id: 'PR35', label: 'PR35 - Orientação a lindeiros da faixa de domínio' },
    { id: 'PR36', label: 'PR36 - Notificação a lindeiros da faixa de domínio' },
    { id: 'PR37', label: 'PR37 - Implantação de Pare e Siga/ Interdição total' },
    { id: 'PR39', label: 'PR39 - Alocação de PMV móvel' },
    { id: 'PR48', label: 'PR48 - Orientação/Acompanhamento de Obra' },
    { id: 'PR51', label: 'PR51 - Efetuado Registro Fotográfico' },
    { id: 'PR60', label: 'PR60 - Subst. de Cancela Praça de Pedágio' },
    { id: 'PR62', label: 'PR62 - Acionamento da Conservação' },
] as const;

const formSchema = z.object({
  // INFORMAÇÕES GERAIS
  rodovia: z.string().optional(),
  ocorrencia: z.string().optional(),
  qth: z.string().optional(),
  sentido: z.string().optional(),
  localArea: z.string().optional(),
  tipoObra: z.string().optional(),
  qraResponsavel: z.string().optional(),
  baixaFrequencia: z.string().optional(),
  qtrInicio: z.string().optional(),
  qtrTermino: z.string().optional(),
  qthInicio: z.string().optional(),
  qthTermino: z.string().optional(),

  // OUTRAS INFORMAÇÕES
  auxilios: z.string().optional(),
  observacoes: z.string().optional(),
});

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

    const sections: { title: string, fields: (keyof z.infer<typeof formSchema>)[] }[] = [
        { title: 'Informações Gerais', fields: ['rodovia', 'ocorrencia', 'qth', 'sentido', 'localArea', 'tipoObra', 'qraResponsavel', 'baixaFrequencia', 'qtrInicio', 'qtrTermino', 'qthInicio', 'qthTermino'] },
        { title: 'Outras Informações', fields: ['observacoes', 'auxilios'] }
    ];

    sections.forEach(section => {
        let sectionText = '';
        section.fields.forEach(key => {
            // @ts-ignore
            const value = data[key];
            if (value !== 'NILL' && value !== '' && (!Array.isArray(value) || value.length > 0)) {
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
                        <Field label="localArea" value={data.localArea} />
                        <Field label="tipoObra" value={data.tipoObra} />
                        <Field label="qraResponsavel" value={data.qraResponsavel} />
                        <Field label="baixaFrequencia" value={data.baixaFrequencia} />
                        <Field label="qtrInicio" value={data.qtrInicio} />
                        <Field label="qtrTermino" value={data.qtrTermino} />
                        <Field label="qthInicio" value={data.qthInicio} />
                        <Field label="qthTermino" value={data.qthTermino} />
                    </CardContent>
                </Card>
                <Card className="shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
                    <CardHeader><CardTitle>Outras Informações</CardTitle></CardHeader>
                    <CardContent className="text-xl space-y-4 pt-6">
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
          <Button onClick={handleSaveClick}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function OcorrenciaTO32Page() {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();
  const [previewData, setPreviewData] = React.useState<z.infer<typeof formSchema> | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rodovia: '',
      ocorrencia: 'TO32',
      qth: '',
      sentido: '',
      localArea: '',
      tipoObra: '',
      qraResponsavel: '',
      baixaFrequencia: '',
      qtrInicio: '',
      qtrTermino: '',
      qthInicio: '',
      qthTermino: '',
      auxilios: '',
      observacoes: '',
    },
  });

  React.useEffect(() => {
    try {
        const editDataString = localStorage.getItem('editOcorrenciaData');
        if (editDataString) {
            const editData = JSON.parse(editDataString);
            if(editData.formPath === '/ocorrencias/to32') {
                const reportToLoad = editData.fullReport;
                
                Object.keys(reportToLoad).forEach(key => {
                    if (reportToLoad[key] === 'NILL') {
                        reportToLoad[key] = '';
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


  function onSubmit(values: z.infer<typeof formSchema>) {
    const processedValues = fillEmptyWithNill(values);
    setPreviewData(processedValues);
  }

  async function handleSave(data: any) {
    if (!firestore || !user) {
        toast({ variant: 'destructive', title: 'Erro', description: 'Usuário não autenticado ou banco de dados indisponível.' });
        return;
    }

    try {
        const formTitle = "ROÇADA MANUAL / MECANIZADA (TO32)";

        const ocorrenciaData = {
            userId: user.uid,
            codOcorrencia: data.ocorrencia,
            type: formTitle,
            rodovia: data.rodovia,
            km: data.qth,
            status: 'Finalizada' as const,
            fullReport: data,
            numeroOcorrencia: data.numeroOcorrencia,
            formPath: '/ocorrencias/to32',
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
          ROÇADA MANUAL / MECANIZADA
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
                        <SelectItem value="Área de Domínio">Área de Domínio</SelectItem>
                        <SelectItem value="Trevo">Trevo</SelectItem>
                        <SelectItem value="Rotatória">Rotatória</SelectItem>
                        <SelectItem value="Praça de Pedágio">Praça de Pedágio</SelectItem>
                        <SelectItem value="BSO">BSO</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tipoObra"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Obra</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Tapa buraco, roçada, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="qraResponsavel"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>QRA do Responsável</FormLabel>
                        <FormControl>
                        <Input placeholder="Nome do responsável" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="baixaFrequencia"
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
                            Telefone para contato.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <FormField
                    control={form.control}
                    name="qtrInicio"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>QTR de Início</FormLabel>
                        <FormControl>
                        <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="qtrTermino"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>QTR de Término</FormLabel>
                        <FormControl>
                        <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="qthInicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>QTH de Início</FormLabel>
                      <FormControl>
                        <Input placeholder="Km inicial" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="qthTermino"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>QTH de Término</FormLabel>
                      <FormControl>
                        <Input placeholder="Km final" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
            <CardHeader><CardTitle>Outras Informações</CardTitle></CardHeader>
            <CardContent className="space-y-6 pt-6">
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
                          placeholder="Descreva os auxílios prestados. Ex: PR08, PR13"
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
      <PreviewDialog data={previewData} onClose={() => setPreviewData(null)} onSave={handleSave} formTitle="ROÇADA MANUAL / MECANIZADA (TO32)" />
    </div>
  );
}
