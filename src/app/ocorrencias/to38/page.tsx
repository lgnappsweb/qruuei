'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as React from 'react';

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

const auxilios = [
  { id: 'PR09', label: 'PR09 - Outros' },
  { id: 'PR34', label: 'PR34 - Remoção de placas / publicidade da faixa' },
  { id: 'PR36', label: 'PR36 - Notificação a lindeiros da faixa de domínio' },
  { id: 'PR51', label: 'PR51 - Efetuado Registro Fotográfico' },
] as const;

const formSchema = z.object({
  // Informações Gerais
  rodovia: z.string().min(1, 'Selecione a rodovia.'),
  ocorrencia: z.string(),
  qth: z.string().min(1, 'O QTH é obrigatório.'),
  sentido: z.string().min(1, 'Selecione o sentido.'),
  localArea: z.string().min(1, 'Selecione o local/área.'),
  
  // Detalhes da Propaganda
  tipoPropaganda: z.string().min(1, "O tipo de propaganda é obrigatório."),
  tipoPropagandaOutros: z.string().optional(),
  acao: z.string().min(1, 'Selecione a ação.'),
  mensagem: z.string().optional(),
  quantidade: z.string().min(1, 'A quantidade é obrigatória.'),

  // Outras Informações
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
  if (!data) return null;

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
      <>
          <div className="font-semibold text-muted-foreground text-left">{formatLabel(label)}:</div>
          <div className="text-foreground break-words font-mono uppercase">{renderSimpleValue(value)}</div>
      </>
    ) : null
  );
  
  const occurrenceCode = formTitle.match(/\(([^)]+)\)/)?.[1] || formTitle.split(' ')[0] || "Relatório";

  return (
    <Dialog open={!!data} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl font-bold">Pré-visualização ({occurrenceCode})</DialogTitle>
          <DialogDescription>Confira os dados antes de salvar.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-6 -mr-6">
            <div className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Informações Gerais</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-4 items-baseline text-xl">
                            <Field label="rodovia" value={data.rodovia} />
                            <Field label="ocorrencia" value={data.ocorrencia} />
                            <Field label="qth" value={data.qth} />
                            <Field label="sentido" value={data.sentido} />
                            <Field label="localArea" value={data.localArea} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Detalhes da Propaganda</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-4 items-baseline text-xl">
                            <Field label="tipoPropaganda" value={data.tipoPropaganda} />
                            {data.tipoPropaganda === 'Outros' && <Field label="tipoPropagandaOutros" value={data.tipoPropagandaOutros} />}
                            <Field label="acao" value={data.acao} />
                            <Field label="mensagem" value={data.mensagem} />
                            <Field label="quantidade" value={data.quantidade} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Outras Informações</CardTitle></CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-4 items-baseline text-xl">
                            <Field label="vtrApoio" value={data.vtrApoio} />
                            {data.vtrApoio && <Field label="vtrApoioDescricao" value={data.vtrApoioDescricao} />}
                            <Field label="observacoes" value={data.observacoes} />
                            <Field label="auxilios" value={data.auxilios} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
        <DialogFooter className="mt-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>Editar</Button>
          <Button onClick={() => onSave(data)}>Confirmar e Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function OcorrenciaTO38Page() {
  const { toast } = useToast();
  const [previewData, setPreviewData] = React.useState<z.infer<typeof formSchema> | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rodovia: '',
      ocorrencia: 'TO38',
      qth: '',
      sentido: '',
      localArea: '',
      tipoPropaganda: '',
      tipoPropagandaOutros: '',
      acao: '',
      mensagem: '',
      quantidade: '1',
      vtrApoio: false,
      vtrApoioDescricao: '',
      observacoes: '',
      auxilios: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const processedValues = fillEmptyWithNill(values);
    setPreviewData(processedValues);
  }

  function handleSave(data: z.infer<typeof formSchema>) {
    console.log("Saving data:", data);
    toast({
      title: 'Formulário Enviado',
      description: 'Ocorrência TO38 registrada com sucesso!',
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
          PLACAS DE PROPAGANDA
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
                        <SelectItem value="Acostamento">Acostamento</SelectItem>
                        <SelectItem value="Área de Domínio">Área de Domínio</SelectItem>
                        <SelectItem value="Rotatória">Rotatória</SelectItem>
                        <SelectItem value="Trevo">Trevo</SelectItem>
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

           <Card>
            <CardHeader>
              <CardTitle>Detalhes da Propaganda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <FormField
                  control={form.control}
                  name="tipoPropaganda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Propaganda</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de propaganda" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Faixa">Faixa</SelectItem>
                          <SelectItem value="Cavalete">Cavalete</SelectItem>
                          <SelectItem value="Outdoor">Outdoor</SelectItem>
                          <SelectItem value="Placa">Placa</SelectItem>
                          <SelectItem value="Lambe-lambe">Lambe-lambe</SelectItem>
                          <SelectItem value="Letreiro">Letreiro</SelectItem>
                          <SelectItem value="Outros">Outros</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch('tipoPropaganda') === 'Outros' && (
                  <FormField
                    control={form.control}
                    name="tipoPropagandaOutros"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descreva o tipo de propaganda</FormLabel>
                        <FormControl>
                          <Input placeholder="Descreva o tipo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="acao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ação Solicitada</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a ação a ser executada" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Retirar">Retirar</SelectItem>
                          <SelectItem value="Notificar">Notificar</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                    control={form.control}
                    name="mensagem"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mensagem da Placa</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Descreva o que está escrito na placa/propaganda" {...field} />
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
            </CardContent>
          </Card>
          
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
                            placeholder="Ex: VTR-01..."
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
                          placeholder="Descreva os auxílios prestados. Ex: PR34"
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
      <PreviewDialog data={previewData} onClose={() => setPreviewData(null)} onSave={handleSave} formTitle="PLACAS DE PROPAGANDA (TO38)" />
    </div>
  );
}
