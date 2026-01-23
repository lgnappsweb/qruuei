'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const tiposDeOcorrenciaData = [
    { codigo: 'ACO1', mensagem: 'Acidente Com Vítima Fatal', grupo: 'Acidentes' },
    { codigo: 'AC02', mensagem: 'Acidente Com Vitima', grupo: 'Acidentes' },
    { codigo: 'ACO3', mensagem: 'Acidente Sem Vitima', grupo: 'Acidentes' },
    { codigo: 'TO01', mensagem: 'Veículo Abandonado', grupo: 'Incidentes' },
    { codigo: 'TO02', mensagem: 'Incêndio Na Faixa De Domínio / Lindeiro', grupo: 'Incidentes' },
    { codigo: 'TO03', mensagem: 'Animal Na Rodovia', grupo: 'Incidentes' },
    { codigo: 'TO04', mensagem: 'Remoção', grupo: 'Incidentes' },
    { codigo: 'TO05', mensagem: 'Incêndio Em Veículos', grupo: 'Incidentes' },
    { codigo: 'TO06', mensagem: 'Pane Sobre Faixa De Rolamento', grupo: 'Incidentes' },
    { codigo: 'TO07', mensagem: 'Objeto Na Pista', grupo: 'Incidentes' },
    { codigo: 'TO09', mensagem: 'Obras Na Rodovia / Conservação De Rotina', grupo: 'Incidentes' },
    { codigo: 'TO11', mensagem: 'Danos Ao Patrimônio', grupo: 'Incidentes' },
    { codigo: 'TO12', mensagem: 'Atendimento Clinico', grupo: 'Incidentes' },
    { codigo: 'TO15', mensagem: 'Verificação Faixa De Domínio', grupo: 'Incidentes' },
    { codigo: 'TO16', mensagem: 'Atendimento A Funcionário', grupo: 'Todos' },
    { codigo: 'TO17', mensagem: 'Andarilho Na Rodovia', grupo: 'Incidentes' },
    { codigo: 'TO18', mensagem: 'Alagamento', grupo: 'Incidentes' },
    { codigo: 'TO19', mensagem: 'Incidente', grupo: 'Incidentes' },
    { codigo: 'TO20', mensagem: 'Carga Excedente', grupo: 'Avarias, Panes' },
    { codigo: 'TO21', mensagem: 'Alocação Da PMV Móvel', grupo: 'Todos' },
    { codigo: 'TO23', mensagem: 'Usuário Informa', grupo: 'Todos' },
    { codigo: 'TO24', mensagem: 'Evasão De Pedágio', grupo: 'Outros' },
    { codigo: 'TO25', mensagem: 'Derramamento De Carga', grupo: 'Todos' },
    { codigo: 'TO30', mensagem: 'Comunicação Operacional', grupo: 'Incidentes' },
    { codigo: 'TO33', mensagem: 'Veículo Atolado', grupo: 'Incidentes' },
    { codigo: 'TO34', mensagem: 'Buraco Na Rodovia', grupo: 'Avarias, Panes' },
    { codigo: 'TO35', mensagem: 'Óleo Sobre A Pista', grupo: 'Todos' },
    { codigo: 'TO36', mensagem: 'Maquinário Na Rodovia', grupo: 'Monitoramento' },
    { codigo: 'TO37', mensagem: 'Sinalização Vertical', grupo: 'Todos' },
    { codigo: 'TO38', mensagem: 'Placas De Propaganda', grupo: 'Todos' },
    { codigo: 'TO39', mensagem: 'Destombamento De Veículo', grupo: 'Todos' },
    { codigo: 'TO40', mensagem: 'Manifestação', grupo: 'Incidentes' },
    { codigo: 'TO50', mensagem: 'Nível De Serviço, Manutenção Frota / Bases', grupo: 'Avarias, Panes' },
];

function TiposDeOcorrenciaTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Código</TableHead>
          <TableHead>Mensagem</TableHead>
          <TableHead>Grupo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tiposDeOcorrenciaData.map((item) => (
          <TableRow key={item.codigo}>
            <TableCell className="font-medium">{item.codigo}</TableCell>
            <TableCell>{item.mensagem}</TableCell>
            <TableCell>{item.grupo}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const codeSections = [
  {
    value: 'item-1',
    title: 'Tipos de Ocorrência',
    content: <TiposDeOcorrenciaTable />,
  },
  {
    value: 'item-2',
    title: 'Tipos de Ação/Providência',
    content: 'Conteúdo para Tipos de Ação/Providência em breve.',
  },
  {
    value: 'item-3',
    title: 'Tipos de Pane',
    content: 'Conteúdo para Tipos de Pane em breve.',
  },
  {
    value: 'item-4',
    title: 'Outras Mensagens',
    content: 'Conteúdo para Outras Mensagens em breve.',
  },
  {
    value: 'item-5',
    title: 'Códigos de Mensagem',
    content: 'Conteúdo para Códigos de Mensagem em breve.',
  },
  {
    value: 'item-6',
    title: 'Código Q (Alfabeto Fonético)',
    content: 'Conteúdo para Código Q (Alfabeto Fonético) em breve.',
  },
  {
    value: 'item-7',
    title: 'Relacionamentos',
    content: 'Conteúdo para Relacionamentos em breve.',
  },
  {
    value: 'item-8',
    title: 'Pontos de Apoio',
    content: 'Conteúdo para Pontos de Apoio em breve.',
  },
];

export default function CodigosPage() {
  return (
    <div className="space-y-8 pb-24">
      <Button asChild variant="ghost" className="pl-0">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o início
        </Link>
      </Button>

      <div className="space-y-2 text-center">
        <h1 className="font-condensed text-3xl font-bold tracking-tight">
          CÓDIGOS E ABREVIATURAS
        </h1>
        <p className="text-muted-foreground">
          Consulte os códigos e abreviaturas utilizados na comunicação.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {codeSections.map((section) => (
          <AccordionItem key={section.value} value={section.value}>
            <AccordionTrigger className="text-lg font-medium">
              {section.title}
            </AccordionTrigger>
            <AccordionContent>{section.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
