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
  { id: 'PR03', label: 'PR03 - Animal apreendido' },
  { id: 'PR04', label: 'PR04 - Retirada de animal morto da pista' },
  { id: 'PR05', label: 'PR05 - Afugentamento de animal' },
  { id: 'PR13', label: 'PR13 - Canalização/Sinalização' },
  { id: 'PR44', label: 'PR44 - Acionamento de Polícia' },
  { id: 'PR51', label: 'PR51 - Efetuado Registro Fotográfico' },
  { id: 'PR56', label: 'PR56 - Enterro de Animal' },
  { id: 'PR33', label: 'PR33 - Reparo em cerca' },
  { id: 'PR62', label: 'PR62 - Acionamento da Conservação' },
  { id: 'PR09', label: 'PR09 - Outros' },
] as const;

const formSchema = z.object({
  // Informações Gerais
  rodovia: z.string().min(1, 'Selecione a rodovia.'),
  ocorrencia: z.string(),
  qth: z.string().min(1, 'O QTH é obrigatório.'),
  sentido: z.string().min(1, 'Selecione o sentido.'),
  localArea: z.string().min(1, 'Selecione o local/área.'),
  animal: z.string().min(1, 'Descreva o tipo de animal.'),
  quantidade: z.string().min(1, 'Informe a quantidade.'),
  situacao: z.string().min(1, 'Selecione a situação do animal.'),

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
  destinacaoAnimal: z.string().optional(),
  qthDestinacao: z.string().optional(),
  vtrApoio: z.boolean().default(false),
  vtrApoioDescricao: z.string().optional(),
  danoPatrimonio: z.boolean().default(false),
  danoPatrimonioDescricao: z.string().optional(),
  observacoes: z.string().optional(),
  auxilios: z.string().optional(),
});

export default function OcorrenciaTO03Page() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rodovia: '',
      ocorrencia: 'Animal na Rodovia (TO03)',
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
      destinacaoAnimal: '',
      qthDestinacao: '',
      vtrApoio: false,
      vtrApoioDescricao: '',
      danoPatrimonio: false,
      danoPatrimonioDescricao: '',
      observacoes: '',
      auxilios: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Formulário Enviado',
      description: 'Ocorrência TO03 registrada com sucesso!',
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de pista" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Pista Simples">Pista Simples</SelectItem>
                        <SelectItem value="Pista Simples com Faixa Adicional">Pista Simples com Faixa Adicional</SelectItem>
                        <SelectItem value="Pista Dupla">Pista Dupla</SelectItem>
                        <SelectItem value="Pista Múltipla">Pista Múltipla</SelectItem>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o perfil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Plano">Plano</SelectItem>
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
                      <FormLabel>Destinação do Animal</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Deixado na mata" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="qthDestinacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>QTH da Destinação</FormLabel>
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
                            placeholder="Ex: Defensas metálicas danificadas..."
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
                          placeholder="Descreva os auxílios prestados. Ex: PR01, PR03"
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
