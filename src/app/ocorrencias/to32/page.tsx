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
  rodovia: z.string().min(1, 'Selecione a rodovia.'),
  ocorrencia: z.string(),
  qth: z.string().min(1, 'O QTH é obrigatório.'),
  sentido: z.string().min(1, 'Selecione o sentido.'),
  localArea: z.string().min(1, 'Selecione o local/área.'),
  tipoObra: z.string().min(1, 'O tipo de obra é obrigatório.'),
  qraResponsavel: z.string().min(1, 'O QRA do responsável é obrigatório.'),
  baixaFrequencia: z.string().optional(),
  qtrInicio: z.string().optional(),
  qtrTermino: z.string().optional(),
  qthInicio: z.string().optional(),
  qthTermino: z.string().optional(),

  // OUTRAS INFORMAÇÕES
  auxilios: z.string().optional(),
  observacoes: z.string().optional(),
});

export default function OcorrenciaTO32Page() {
  const { toast } = useToast();
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Formulário Enviado',
      description: 'Ocorrência TO32 registrada com sucesso!',
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
          ROÇADA MANUAL / MECANIZADA
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
          
          <Card>
            <CardHeader><CardTitle>Outras Informações</CardTitle></CardHeader>
            <CardContent className="space-y-6 pt-6">
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
            </CardContent>
          </Card>
          
          <Button type="submit" size="lg" className="w-full">Gerar Relatório</Button>
        </form>
      </Form>
    </div>
  );
}
