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

const tiposDeAcaoData = [
  { codigo: 'PR01', mensagem: 'Atendimento inicial' },
  { codigo: 'PR02', mensagem: 'Auxílio no combate a incêndio' },
  { codigo: 'PR03', mensagem: 'Animal apreendido' },
  { codigo: 'PR04', mensagem: 'Retirada de animal morto da pista' },
  { codigo: 'PR05', mensagem: 'Afugentamento de animal' },
  { codigo: 'PR06', mensagem: 'Retirada de material da pista' },
  { codigo: 'PR07', mensagem: 'Escolta' },
  { codigo: 'PR08', mensagem: 'Verificação da sinalização de obras' },
  { codigo: 'PR09', mensagem: 'Outros' },
  { codigo: 'PR10', mensagem: 'Embargo de obra' },
  { codigo: 'PR11', mensagem: 'Remoção de vítima para hospital' },
  { codigo: 'PR12', mensagem: 'Sinalização final de fila' },
  { codigo: 'PR13', mensagem: 'Canalização/Sinalização' },
  { codigo: 'PR14', mensagem: 'Tapa buraco' },
  { codigo: 'PR15', mensagem: 'Orientação a andarilho' },
  { codigo: 'PR16', mensagem: 'Remoção de andarilho' },
  { codigo: 'PR17', mensagem: 'Orientação/Informação ao usuário' },
  { codigo: 'PR18', mensagem: 'Recusa de dados' },
  { codigo: 'PR19', mensagem: 'Operação comboio' },
  { codigo: 'PR20', mensagem: 'Atendimento a funcionário' },
  { codigo: 'PR21', mensagem: 'Remoção de carga derramada' },
  { codigo: 'PR22', mensagem: 'Limpeza de pista' },
  { codigo: 'PR23', mensagem: 'Remoção de óleo/outros com serragem' },
  { codigo: 'PR24', mensagem: 'Troca de pneu' },
  { codigo: 'PR25', mensagem: 'Pane solucionada' },
  { codigo: 'PR26', mensagem: 'Transferência de carga' },
  { codigo: 'PR27', mensagem: 'Remoção de veículo' },
  { codigo: 'PR28', mensagem: 'Limpeza na praça' },
  { codigo: 'PR29', mensagem: 'Regularização de Sinalização' },
  { codigo: 'PR30', mensagem: 'Auxílio no transporte do usuário' },
  { codigo: 'PR31', mensagem: 'Remoção de vítima das ferragens' },
  { codigo: 'PR32', mensagem: 'Destombamento de veículo' },
  { codigo: 'PR33', mensagem: 'Reparo em cerca' },
  { codigo: 'PR34', mensagem: 'Remoção de placas / publicidade da faixa' },
  { codigo: 'PR35', mensagem: 'Orientação a lindeiros da faixa de domínio' },
  { codigo: 'PR36', mensagem: 'Notificação a lindeiros da faixa de domínio' },
  { codigo: 'PR37', mensagem: 'Implantação de Pare e Siga/ Interdição total' },
  { codigo: 'PR38', mensagem: 'Transporte de colaborador' },
  { codigo: 'PR39', mensagem: 'Alocação de PMV móvel' },
  { codigo: 'PR40', mensagem: 'Definição de mensagem no PMV móvel' },
  { codigo: 'PR41', mensagem: 'Definição de mensagem no PMV fixo' },
  { codigo: 'PR42', mensagem: 'Envio de SMS/ Aplicativo' },
  { codigo: 'PR43', mensagem: 'Envio de Email' },
  { codigo: 'PR44', mensagem: 'Acionamento de Polícia' },
  { codigo: 'PR45', mensagem: 'Auxílio a usuário p/comprar combustível' },
  { codigo: 'PR46', mensagem: 'Não localizado' },
  { codigo: 'PR47', mensagem: 'Ocorrência não localizada' },
  { codigo: 'PR48', mensagem: 'Orientação/Acompanhamento de Obra' },
  { codigo: 'PR49', mensagem: 'Evento acompanhamento pelo CFTV' },
  { codigo: 'PR50', mensagem: 'Remoção de vítima para P.S' },
  { codigo: 'PR51', mensagem: 'Efetuado Registro Fotográfico' },
  { codigo: 'PR53', mensagem: 'Meios próprios' },
  { codigo: 'PR54', mensagem: 'Aux. com ferram./ Empréstimo ferram.' },
  { codigo: 'PR55', mensagem: 'Desbloqueio de veículo' },
  { codigo: 'PR56', mensagem: 'Enterro de Animal' },
  { codigo: 'PR57', mensagem: 'Atendimento Clínico' },
  { codigo: 'PR58', mensagem: 'Avaliação da Vítima' },
  { codigo: 'PR59', mensagem: 'Aferição de pressão arterial' },
  { codigo: 'PR60', mensagem: 'Subst. de Cancela Praça de Pedágio' },
  { codigo: 'PR61', mensagem: 'Abordagem de vítima' },
  { codigo: 'PR62', mensagem: 'Acionamento da Conservação' },
  { codigo: 'PR63', mensagem: 'Desatolamento de Veículos' },
];

function TiposDeAcaoTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Código</TableHead>
          <TableHead>Mensagem</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tiposDeAcaoData.map((item) => (
          <TableRow key={item.codigo}>
            <TableCell className="font-medium">{item.codigo}</TableCell>
            <TableCell>{item.mensagem}</TableCell>
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
    content: <TiposDeAcaoTable />,
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
