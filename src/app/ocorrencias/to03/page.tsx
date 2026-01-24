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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const auxilios = [
  { id: 'PR03', label: 'PR03 - Animal apreendido' },
  { id: 'PR04', label: 'PR04 - Retirada de animal morto da pista' },
  { id: 'PR05', label: 'PR05 - Afugentamento de animal' },
  { id: 'PR13', label: 'PR13 - Canalização/Sinalização' },
  { id: 'PR51', label: 'PR51 - Efetuado Registro Fotográfico' },
  { id: 'PR56', label: 'PR56 - Enterro de Animal' },
  { id: 'PR33', label: 'PR33 - Reparo em cerca' },
  { id: 'PR62', label: 'PR62 - Acionamento da Conservação' },
  { id: 'PR09', label: 'PR09 - Outros' },
] as const;

const destinacaoPrOptions = [
  { id: 'PR04', label: 'PR04 - Retirada de animal morto da pista' },
  { id: 'PR05', label: 'PR05 - Afugentamento de animal' },
  { id: 'PR13', label: 'PR13 - Canalização/Sinalização' },
  { id: 'PR56', label: 'PR56 - Enterro de Animal' },
];

const formSchema = z.object({
  // Informações Gerais
  rodovia: z.string().optional(),
  ocorrencia: z.string().optional(),
  qth: z.string().optional(),
  sentido: z.string().optional(),
  localArea: z.string().optional(),
  animal: z.string().optional(),
  quantidade: z.string().optional(),
  situacao: z.string().optional(),

  // Características do Entorno
  entornoNorte: z.string().optional(),
  entornoNorteOutros: z.string().optional(),
  entornoSul: z.string().optional(),
  entornoSulOutros: z.string().optional(),

  // Traçado da Pista
  pista: z.string().optional(),
  acostamento: z.string().optional(),
  tracado: z.string().optional(),
  perfil: z.string().optional(),

  // Outras Informações
  destinacaoAnimal: z.array(z.string()).optional(),
  qthDestinacao: z.string().optional(),
  vtrApoio: z.boolean().default(false),
  vtrApoioDescricao: z.string().optional(),
  observacoes: z.string().optional(),
  auxilios: z.string().optional(),
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
        { title: 'Informações Gerais', fields: ['rodovia', 'ocorrencia', 'qth', 'sentido', 'localArea', 'animal', 'quantidade', 'situacao'] },
        { title: 'Características do Entorno', fields: ['entornoNorte', 'entornoNorteOutros', 'entornoSul', 'entornoSulOutros'] },
        { title: 'Traçado da Pista', fields: ['pista', 'acostamento', 'tracado', 'perfil'] },
        { title: 'Outras Informações', fields: ['destinacaoAnimal', 'qthDestinacao', 'vtrApoio', 'vtrApoioDescricao', 'observacoes', 'auxilios'] }
    ];

    sections.forEach(section => {
        let sectionText = '';
        section.fields.forEach(key => {
            // @ts-ignore
            const value = data[key];
             if (value !== 'NILL' && value !== '' && (!Array.isArray(value) || value.length > 0)) {
                if ((key === 'entornoNorteOutros' && data.entornoNorte !== 'Outros') ||
                    (key === 'entornoSulOutros' && data.entornoSul !== 'Outros') ||
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
                <Card>
                    <CardHeader><CardTitle>Informações Gerais</CardTitle></CardHeader>
                    <CardContent className="text-xl space-y-4 pt-6">
                        <Field label="rodovia" value={data.rodovia} />
                        <Field label="ocorrencia" value={data.ocorrencia} />
                        <Field label="qth" value={data.qth} />
                        <Field label="sentido" value={data.sentido} />
                        <Field label="localArea" value={data.localArea} />
                        <Field label="animal" value={data.animal} />
                        <Field label="quantidade" value={data.quantidade} />
                        <Field label="situacao" value={data.situacao} />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Características do Entorno</CardTitle></CardHeader>
                    <CardContent className="text-xl space-y-4 pt-6">
                        <Field label="entornoNorte" value={data.entornoNorte} />
                        {data.entornoNorte === 'Outros' && <Field label="entornoNorteOutros" value={data.entornoNorteOutros} />}
                        <Field label="entornoSul" value={data.entornoSul} />
                        {data.entornoSul === 'Outros' && <Field label="entornoSulOutros" value={data.entornoSulOutros} />}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Traçado da Pista</CardTitle></CardHeader>
                    <CardContent className="text-xl space-y-4 pt-6">
                        <Field label="pista" value={data.pista} />
                        <Field label="acostamento" value={data.acostamento} />
                        <Field label="tracado" value={data.tracado} />
                        <Field label="perfil" value={data.perfil} />
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader><CardTitle>Outras Informações</CardTitle></CardHeader>
                    <CardContent className="text-xl space-y-4 pt-6">
                        <Field label="destinacaoAnimal" value={data.destinacaoAnimal} />
                        <Field label="qthDestinacao" value={data.qthDestinacao} />
                        <Field label="vtrApoio" value={data.vtrApoio} />
                        {data.vtrApoio && <Field label="vtrApoioDescricao" value={data.vtrApoioDescricao} />}
                        <Field label="observacoes" value={data.observacoes} />
                        <Field label="auxilios" value={data.auxilios} />
                    </CardContent>
                </Card>
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


export default function OcorrenciaTO03Page() {
  const { toast } = useToast();
  const router = useRouter();
  const [previewData, setPreviewData] = React.useState<z.infer<typeof formSchema> | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rodovia: '',
      ocorrencia: 'TO03',
      qth: '',
      sentido: '',
      localArea: '',
      animal: '',
      quantidade: '',
      situacao: '',
      entornoNorte: '',
      entornoNorteOutros: '',
      entornoSul: '',
      entornoSulOutros: '',
      pista: '',
      acostamento: '',
      tracado: '',
      perfil: '',
      destinacaoAnimal: [],
      qthDestinacao: '',
      vtrApoio: false,
      vtrApoioDescricao: '',
      observacoes: '',
      auxilios: '',
    },
  });
  
  React.useEffect(() => {
    try {
        const editDataString = localStorage.getItem('editOcorrenciaData');
        if (editDataString) {
            const editData = JSON.parse(editDataString);
            if(editData.formPath === '/ocorrencias/to03') {
                const reportToLoad = editData.fullReport;
                
                Object.keys(reportToLoad).forEach(key => {
                    if (reportToLoad[key] === 'NILL') {
                        reportToLoad[key] = Array.isArray(form.getValues(key as keyof z.infer<typeof formSchema>)) ? [] : '';
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

  const destinacaoAnimalValue = form.watch('destinacaoAnimal') ?? [];

  function onSubmit(values: z.infer<typeof formSchema>) {
    const processedValues = fillEmptyWithNill(values);
    setPreviewData(processedValues);
  }

  function handleSave(data: any) {
    try {
        const savedOcorrencias = JSON.parse(localStorage.getItem('ocorrencias_v2') || '[]');
        const formTitle = "ANIMAL NA RODOVIA (TO03)";

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
            formPath: '/ocorrencias/to03'
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
          ANIMAL NA RODOVIA
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
                          <SelectItem value="Eixo Central">Eixo Central</SelectItem>
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
                        <SelectItem value="Faixa de Bordo">Faixa de Bordo</SelectItem>
                        <SelectItem value="Área de Domínio">Área de Domínio</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="animal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Animal</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Capivara" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="situacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Situação</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a situação" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Ileso">Ileso</SelectItem>
                          <SelectItem value="Ferido">Ferido</SelectItem>
                          <SelectItem value="Fatal">Fatal</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Características do Entorno</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="entornoNorte"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entorno Norte</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o entorno" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Área Urbada">Área Urbada</SelectItem>
                          <SelectItem value="Curso D'Agua">Curso D&apos;Agua</SelectItem>
                          <SelectItem value="Fragmento Nativo">Fragmento Nativo</SelectItem>
                          <SelectItem value="Plantio Agrícola">Plantio Agrícola</SelectItem>
                          <SelectItem value="Pecuária">Pecuária</SelectItem>
                          <SelectItem value="Outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch('entornoNorte') === 'Outros' && (
                  <FormField
                    control={form.control}
                    name="entornoNorteOutros"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descreva o entorno Norte</FormLabel>
                        <FormControl>
                          <Input placeholder="Descreva aqui..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="entornoSul"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entorno Sul</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o entorno" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Área Urbada">Área Urbada</SelectItem>
                          <SelectItem value="Curso D'Agua">Curso D&apos;Agua</SelectItem>
                          <SelectItem value="Fragmento Nativo">Fragmento Nativo</SelectItem>
                          <SelectItem value="Plantio Agrícola">Plantio Agrícola</SelectItem>
                          <SelectItem value="Pecuária">Pecuária</SelectItem>
                          <SelectItem value="Outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch('entornoSul') === 'Outros' && (
                  <FormField
                    control={form.control}
                    name="entornoSulOutros"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descreva o entorno Sul</FormLabel>
                        <FormControl>
                          <Input placeholder="Descreva aqui..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Traçado da Pista</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
               <FormField
                control={form.control}
                name="pista"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pista</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de pista" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pista Simples">Pista Simples</SelectItem>
                        <SelectItem value="Pista Simples com Faixa Adicional">Pista Simples com Faixa Adicional</SelectItem>
                        <SelectItem value="Pista Dupla">Pista Dupla</SelectItem>
                        <SelectItem value="Pista Multivias">Pista Multivias</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="acostamento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Acostamento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de acostamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Com Acostamento Norte/Sul">Com Acostamento Norte/Sul</SelectItem>
                        <SelectItem value="Com Acostamento Norte sem Sul">Com Acostamento Norte sem Sul</SelectItem>
                        <SelectItem value="Com Acostamento Sul sem Norte">Com Acostamento Sul sem Norte</SelectItem>
                        <SelectItem value="Sem Acostamento Norte/Sul">Sem Acostamento Norte/Sul</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tracado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Traçado</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de traçado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Reta">Reta</SelectItem>
                        <SelectItem value="Curva Suave">Curva Suave</SelectItem>
                        <SelectItem value="Curva Fechada">Curva Fechada</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="perfil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Perfil</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o perfil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Em Nível">Em Nível</SelectItem>
                        <SelectItem value="Aclive">Aclive</SelectItem>
                        <SelectItem value="Declive">Declive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Outras Informações</CardTitle></CardHeader>
            <CardContent className="space-y-6 pt-6">
                <FormField
                    control={form.control}
                    name="destinacaoAnimal"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Destinação do Animal (PRs)</FormLabel>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <FormControl>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal h-14 text-xl px-4 py-2">
                                            <div className="truncate">
                                                {field.value?.length
                                                    ? destinacaoPrOptions
                                                        .filter(pr => field.value?.includes(pr.id))
                                                        .map(pr => pr.id)
                                                        .join(', ')
                                                    : "Selecione um ou mais PRs"}
                                            </div>
                                        </Button>
                                    </FormControl>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
                                    {destinacaoPrOptions.map(item => (
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
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                  control={form.control}
                  name="qthDestinacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>QTH da Destinação {destinacaoAnimalValue.length > 0 ? `(${destinacaoAnimalValue.join(', ')})` : ''}</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: KM 20+100" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                            placeholder="Ex: VTR-01, Polícia Militar Ambiental..."
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
                          placeholder="Descreva os auxílios prestados. Ex: PR03, PR04"
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
      <PreviewDialog data={previewData} onClose={() => setPreviewData(null)} onSave={handleSave} formTitle="ANIMAL NA RODOVIA (TO03)" />
    </div>
  );
}
