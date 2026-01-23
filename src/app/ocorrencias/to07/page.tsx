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

const auxilios = [
  { id: 'PR01', label: 'PR01 - Atendimento inicial' },
  { id: 'PR06', label: 'PR06 - Retirada de material da pista' },
  { id: 'PR09', label: 'PR09 - Outros' },
  { id: 'PR13', label: 'PR13 - Canalização/Sinalização' },
  { id: 'PR22', label: 'PR22 - Limpeza de pista' },
  { id: 'PR37', label: 'PR37 - Implantação de Pare e Siga/ Interdição total' },
  { id: 'PR51', label: 'PR51 - Efetuado Registro Fotográfico' },
  { id: 'PR62', label: 'PR62 - Acionamento da Conservação' },
] as const;

const formSchema = z.object({
  // Informações Gerais
  rodovia: z.string().min(1, 'Selecione a rodovia.'),
  ocorrencia: z.string(),
  qth: z.string().min(1, 'O QTH é obrigatório.'),
  sentido: z.string().min(1, 'Selecione o sentido.'),
  localArea: z.string().min(1, 'Selecione o local/área.'),
  tipoObjeto: z.string().min(1, 'O tipo de objeto é obrigatório.'),
  quantidade: z.string().min(1, 'A quantidade é obrigatória.'),

  // Outras Informações
  destinacaoObjeto: z.string().optional(),
  qthDestinacao: z.string().optional(),
  vtrApoio: z.boolean().default(false),
  vtrApoioDescricao: z.string().optional(),
  observacoes: z.string().optional(),
  auxilios: z.string().optional(),
});

const destinacaoPrOptions = [
  { id: 'PR06', label: 'PR06 - Retirada de material da pista' },
  { id: 'PR13', label: 'PR13 - Canalização/Sinalização' },
];

export default function OcorrenciaTO07Page() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rodovia: '',
      ocorrencia: 'Objeto na Pista (TO07)',
      qth: '',
      sentido: '',
      localArea: '',
      tipoObjeto: '',
      quantidade: '',
      destinacaoObjeto: '',
      qthDestinacao: '',
      vtrApoio: false,
      vtrApoioDescricao: '',
      observacoes: '',
      auxilios: '',
    },
  });

  const destinacaoObjetoValue = form.watch('destinacaoObjeto');

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Formulário Enviado',
      description: 'Ocorrência TO07 registrada com sucesso!',
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
          OBJETO NA PISTA
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
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField
                    control={form.control}
                    name="tipoObjeto"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Objeto</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Pneu, galho, etc." {...field} />
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
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader><CardTitle>Outras Informações</CardTitle></CardHeader>
            <CardContent className="space-y-6 pt-6">
                <FormField
                  control={form.control}
                  name="destinacaoObjeto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Destinação do Objeto (PR)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o PR de destinação" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {destinacaoPrOptions.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {destinacaoObjetoValue === 'PR13' && (
                  <FormField
                    control={form.control}
                    name="qthDestinacao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>QTH da Destinação {destinacaoObjetoValue ? `(${destinacaoObjetoValue})` : ''}</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: KM 20+100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
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
                          placeholder="Descreva os auxílios prestados. Ex: PR06, PR13"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <div className="space-y-2 pt-2">
                        <p className="text-sm font-medium text-foreground">
                          Códigos de referência:
                        </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                          {auxilios.map((item) => (
                            <li key={item.id}>{item.label}</li>
                          ))}
                        </ul>
                      </div>
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
