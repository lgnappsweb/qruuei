'use client';

import * as React from 'react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
    { codigo: 'TO13', mensagem: 'Congestionamento', grupo: 'Incidentes' },
    { codigo: 'TO14', mensagem: 'Ocorrência Policial', grupo: 'Incidentes' },
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
    { codigo: 'TO32', mensagem: 'Roçada Manual / Mecanizada', grupo: 'Incidentes' },
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
          <TableRow key={item.codigo} id={item.codigo}>
            <TableCell className="font-medium"><span className="bg-accent font-semibold p-1 px-2 rounded-md">{item.codigo}</span></TableCell>
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
          <TableRow key={item.codigo} id={item.codigo}>
            <TableCell className="font-medium"><span className="bg-accent font-semibold p-1 px-2 rounded-md">{item.codigo}</span></TableCell>
            <TableCell>{item.mensagem}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const tiposDePaneData = [
  { codigo: 'TP01', mensagem: 'Pane Mecânica' },
  { codigo: 'TP02', mensagem: 'Pane Elétrica' },
  { codigo: 'TP03', mensagem: 'Pane Pneu' },
  { codigo: 'TP04', mensagem: 'Pane Seca' },
  { codigo: 'TP05', mensagem: 'Super Aquecimento De Motor' },
  { codigo: 'TP07', mensagem: 'Bloqueio De Veículos Por Rastreador' },
];

function TiposDePaneTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Código</TableHead>
          <TableHead>Mensagem</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tiposDePaneData.map((item) => (
          <TableRow key={item.codigo} id={item.codigo}>
            <TableCell className="font-medium"><span className="bg-accent font-semibold p-1 px-2 rounded-md">{item.codigo}</span></TableCell>
            <TableCell>{item.mensagem}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const outrasMensagensData = [
  { codigo: '61', mensagem: 'Sintoma de embriaguez' },
  { codigo: '62', mensagem: 'Sintomas de entorpecentes ou drogas ilícitas' },
  {
    codigo: '63',
    mensagem: 'PMR - Informação de PMR realizando abordagem no trecho',
  },
  {
    codigo: '64',
    mensagem: 'AGEMS - informação dos agentes da AGEMS no trecho de concessão',
  },
  { codigo: '65', mensagem: 'BRINKS' },
  { codigo: '67', mensagem: 'PMV inoperante' },
  { codigo: '70', mensagem: 'Informações de assalto' },
  { codigo: 'OP08', mensagem: 'Operação Policial' },
  { codigo: 'OU01', mensagem: 'Ocorrência Fora Do Trecho' },
  { codigo: 'OU02', mensagem: 'Outros' },
];

function OutrasMensagensTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Código</TableHead>
          <TableHead>Mensagem</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {outrasMensagensData.map((item) => (
          <TableRow key={item.codigo} id={item.codigo}>
            <TableCell className="font-medium"><span className="bg-accent font-semibold p-1 px-2 rounded-md">{item.codigo}</span></TableCell>
            <TableCell>{item.mensagem}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const codigosDeMensagemData = [
  { codigo: 'QAP', mensagem: 'Na Escuta' },
  { codigo: 'QAR', mensagem: 'Autorização para abandonar a escuta' },
  { codigo: 'QBU', mensagem: 'Agitado, confusão mental, Alucinações' },
  { codigo: 'QRA', mensagem: 'Prefixo da estação / Operador' },
  { codigo: 'QRM', mensagem: 'Interferência de outra estação' },
  { codigo: 'QRV', mensagem: 'Pronto para receber. À disposição' },
  { codigo: 'QRX', mensagem: 'Espere, aguarde' },
  { codigo: 'QRU', mensagem: 'Ocorrência. Evento' },
  { codigo: 'QSA', mensagem: 'Intensidade do Sinal' },
  { codigo: 'QSJ', mensagem: 'Dinheiro, Pagamento, valor' },
  { codigo: 'QSL', mensagem: 'Confirmado, compreendido, Afirmativo' },
  { codigo: 'QSM', mensagem: 'Repetir o último câmbio' },
  { codigo: 'QSO', mensagem: 'Contato entre duas estações, pessoas' },
  { codigo: 'QTA', mensagem: 'Cancelar' },
  { codigo: 'QTC', mensagem: 'Mensagem. Comunicado' },
  { codigo: 'QTH', mensagem: 'Endereço. Localização' },
  { codigo: 'QTI', mensagem: 'A caminho. Destino' },
  { codigo: 'QTO', mensagem: 'Banheiro' },
  { codigo: 'QTR', mensagem: 'HORA CERTA / EXATA' },
  { codigo: 'QUD', mensagem: 'Prioridade na rede' },
  { codigo: 'TKS', mensagem: 'Grato. Obrigado, agradeço' },
];

function CodigosDeMensagemTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Código</TableHead>
          <TableHead>Mensagem</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {codigosDeMensagemData.map((item) => (
          <TableRow key={item.codigo} id={item.codigo}>
            <TableCell className="font-medium"><span className="bg-accent font-semibold p-1 px-2 rounded-md">{item.codigo}</span></TableCell>
            <TableCell>{item.mensagem}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const alfabetoFoneticoData = [
    { letra: 'A', palavra: 'Alpha', pronuncia: 'AL - FA' },
    { letra: 'B', palavra: 'Bravo', pronuncia: 'BRA - VO' },
    { letra: 'C', palavra: 'Charlie', pronuncia: 'CHAR -LIE' },
    { letra: 'D', palavra: 'Delta', pronuncia: 'DEL -TA' },
    { letra: 'E', palavra: 'Echo', pronuncia: 'E - CO' },
    { letra: 'F', palavra: 'Fox', pronuncia: 'FOX - TROT' },
    { letra: 'G', palavra: 'Golf', pronuncia: 'GOL - FE' },
    { letra: 'H', palavra: 'Hotel', pronuncia: 'HO -TEL' },
    { letra: 'I', palavra: 'India', pronuncia: 'IN - DI -A' },
    { letra: 'J', palavra: 'Juliet', pronuncia: 'JU - LI -ETE' },
    { letra: 'K', palavra: 'Kilo', pronuncia: 'KI-LO' },
    { letra: 'L', palavra: 'Lima', pronuncia: 'LI - MA' },
    { letra: 'M', palavra: 'Mike', pronuncia: 'MAI - QUE' },
    { letra: 'N', palavra: 'November', pronuncia: 'NO - VEM - BER' },
    { letra: 'O', palavra: 'Oscar', pronuncia: 'OS - CAR' },
    { letra: 'P', palavra: 'Papa', pronuncia: 'PA - PA' },
    { letra: 'Q', palavra: 'Quebec', pronuncia: 'QUE - BE - QUE' },
    { letra: 'R', palavra: 'Romeo', pronuncia: 'RO - MEU' },
    { letra: 'S', palavra: 'Sierra', pronuncia: 'SI - E - RRA' },
    { letra: 'T', palavra: 'Tango', pronuncia: 'TAN - GO' },
    { letra: 'U', palavra: 'Uniform', pronuncia: 'U - NI- FOR - ME' },
    { letra: 'V', palavra: 'Victor', pronuncia: 'VIC - TOR' },
    { letra: 'W', palavra: 'Whiskey', pronuncia: 'WHIS - KEY' },
    { letra: 'X', palavra: 'X Ray', pronuncia: 'EX - REY' },
    { letra: 'Y', palavra: 'Yankee', pronuncia: 'IAN - QUI' },
    { letra: 'Z', palavra: 'Zulu', pronuncia: 'ZU - LU' },
];

function AlfabetoFoneticoTable() {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[80px]">Letra</TableHead>
                    <TableHead>Palavra</TableHead>
                    <TableHead>Pronúncia</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {alfabetoFoneticoData.map((item) => (
                    <TableRow key={item.letra} id={item.letra}>
                        <TableCell className="font-medium"><span className="bg-accent font-semibold p-1 px-2 rounded-md">{item.letra}</span></TableCell>
                        <TableCell>{item.palavra}</TableCell>
                        <TableCell>{item.pronuncia}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}

const pontosDeApoioData = [
  { ponto: 'POSTO INDEPENDENCIA', rodovia: 'MS 306', km: '217+900', sentido: 'NORTE' },
  { ponto: 'POSTO ESPLANADA', rodovia: 'BR 158', km: '05+000', sentido: 'NORTE' },
  { ponto: 'POSTO 5ª RODA', rodovia: 'BR 158', km: '26+320', sentido: 'SUL' },
  { ponto: 'RESTAURANTE KABANAS', rodovia: 'BR 158', km: '32+020', sentido: 'SUL' },
  { ponto: 'RESTAURANTE FIGUEIRA', rodovia: 'BR 158', km: '34+020', sentido: 'NORTE' },
  { ponto: 'RESTAURANTE EDINHO', rodovia: 'BR 158', km: '35+050', sentido: 'NORTE' },
  { ponto: 'VILA RAIMUNDO', rodovia: 'BR 158', km: '60+040', sentido: 'NORTE' },
  { ponto: 'POSTO TREVÃO', rodovia: 'BR 158', km: '90+340', sentido: 'NORTE' },
  { ponto: 'POSTO GRAMADÃO/ DANIEL', rodovia: 'BR 158', km: '97+260', sentido: 'NORTE' },
  { ponto: 'RESTAURANTE FOGÃO A LENHA', rodovia: 'BR 158', km: '127+600', sentido: 'SUL' },
  { ponto: 'POSTO NOVO MATO GROSSO', rodovia: 'BR 158', km: '141+440', sentido: 'SUL' },
  { ponto: 'RESTAURANTE COPO SUJO', rodovia: 'BR 158', km: '170+000', sentido: 'SUL' },
  { ponto: 'POSTO NOVO MATO GROSSO', rodovia: 'BR 158', km: '195+350', sentido: 'SUL' },
  { ponto: 'POSTO JC', rodovia: 'BR 158', km: '252+000', sentido: 'SUL' },
  { ponto: 'RESTAURANTE CAZUZA', rodovia: 'MS 112', km: '56+020', sentido: 'SUL' },
  { ponto: 'POSTO PASSARELA', rodovia: 'MS 112', km: '107+400', sentido: 'SUL' },
  { ponto: 'POSTO 2000 (CARRO)', rodovia: 'MS 112', km: '113+300', sentido: 'SUL' },
  { ponto: 'RESTAURANTE DO PAULINHO', rodovia: 'MS 112', km: '151+000', sentido: 'NORTE' },
  { ponto: 'RESTAURANTE OASIS', rodovia: 'BR 436', km: '11+900', sentido: 'NORTE' },
  { ponto: 'RESTAURANTE DO BOLA', rodovia: 'BR 436', km: '13+050', sentido: 'SUL' },
  { ponto: 'POSTO MONTE CARLO', rodovia: 'BR 436', km: '21+500', sentido: 'SUL' },
];

function PontosDeApoioTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ponto de Apoio</TableHead>
          <TableHead className="px-1">Rodovia</TableHead>
          <TableHead className="px-1">KM</TableHead>
          <TableHead className="px-1">Sentido</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pontosDeApoioData.map((item, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{item.ponto}</TableCell>
            <TableCell className="px-1">{item.rodovia}</TableCell>
            <TableCell className="px-1">{item.km}</TableCell>
            <TableCell className="px-1">{item.sentido}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

const relacionamentosData = [
  {
    title: 'Acidentes',
    description: 'Envolve colisões, atropelamentos, etc. com ou sem vítimas. (Ocorrências: ACO1, AC02, ACO3)',
    providencias: ['PR01', 'PR11', 'PR12', 'PR13', 'PR22', 'PR26', 'PR27', 'PR31', 'PR32', 'PR37', 'PR44', 'PR50', 'PR51', 'PR58', 'PR61'],
    panes: [],
    outras: ['61', '62'],
  },
  {
    title: 'Panes e Avarias',
    description: 'Problemas mecânicos, elétricos, pneus, falta de combustível, etc. (Ocorrências: TO06, TO33, TO34, TO50)',
    providencias: ['PR01', 'PR13', 'PR24', 'PR25', 'PR27', 'PR45', 'PR51', 'PR53', 'PR54', 'PR55', 'PR63'],
    panes: ['TP01', 'TP02', 'TP03', 'TP04', 'TP05', 'TP07'],
    outras: [],
  },
  {
    title: 'Incidentes na Via',
    description: 'Eventos que afetam o fluxo ou a segurança, como animais, objetos, incêndios, manifestações, etc. (Ocorrências: TO01, TO02, TO03, TO04, TO05, TO07, TO13, TO18, TO25, TO40, TO35)',
    providencias: ['PR01', 'PR02', 'PR03', 'PR04', 'PR05', 'PR06', 'PR12', 'PR13', 'PR19', 'PR21', 'PR22', 'PR23', 'PR27', 'PR32', 'PR33', 'PR37', 'PR44', 'PR51', 'PR56', 'PR62'],
    panes: [],
    outras: [],
  },
  {
    title: 'Obras e Manutenção',
    description: 'Atividades de conservação, reparos, sinalização e fiscalização da faixa de domínio. (Ocorrências: TO09, TO15, TO21, TO32, TO34, TO36, TO37, TO38, TO50)',
    providencias: ['PR08', 'PR10', 'PR13', 'PR14', 'PR28', 'PR29', 'PR33', 'PR34', 'PR35', 'PR36', 'PR37', 'PR39', 'PR48', 'PR51', 'PR60', 'PR62'],
    panes: [],
    outras: [],
  },
    {
    title: 'Atendimento ao Usuário e Colaborador',
    description: 'Apoio clínico, a funcionários ou a andarilhos na rodovia. (Ocorrências: TO12, TO16, TO17)',
    providencias: ['PR01', 'PR15', 'PR16', 'PR17', 'PR20', 'PR30', 'PR38', 'PR51', 'PR57', 'PR58', 'PR59'],
    panes: [],
    outras: [],
  },
  {
    title: 'Ocorrências Policiais e Fiscais',
    description: 'Danos ao patrimônio, evasão, carga excedente ou outras situações que demandem acionamento policial. (Ocorrências: TO11, TO14, TO19, TO20, TO24)',
    providencias: ['PR07', 'PR18', 'PR19', 'PR44', 'PR49', 'PR51'],
    panes: [],
    outras: ['61', '62', '70', 'OP08'],
  },
   {
    title: 'Comunicação Operacional',
    description: 'Registros de comunicação, informações recebidas de usuários e gestão de painéis de mensagem. (Ocorrências: TO21, TO23, TO30)',
    providencias: ['PR17', 'PR39', 'PR40', 'PR41', 'PR42', 'PR43', 'PR46', 'PR47', 'PR49', 'PR51'],
    panes: [],
    outras: ['67', 'OU01'],
  },
   {
    title: 'Providências/Ações Genéricas',
    description: 'Estas são ações que podem ser aplicadas a quase todos os tipos de ocorrência, dependendo da situação.',
    providencias: ['PR01', 'PR09', 'PR13', 'PR17', 'PR51', 'PR53'],
    panes: [],
    outras: ['OU02'],
   }
];


function RelacionamentosContent({ setOpenAccordion }: { setOpenAccordion: (value: string | undefined) => void }) {

  const handleCodeClick = (codeId: string, accordionId: string) => {
    setOpenAccordion(accordionId);

    setTimeout(() => {
      const element = document.getElementById(codeId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('bg-primary/20', 'rounded-lg');
        element.style.transition = 'background-color 0.5s ease-in-out';
        setTimeout(() => {
          element.classList.remove('bg-primary/20', 'rounded-lg');
        }, 2000);
      }
    }, 300); 
  };

  const DescriptionWithLinks = ({ text }: { text: string }) => {
    const regex = /\((Ocorrências: (.*?))\)/;
    const match = text.match(regex);

    if (!match) {
        return <CardDescription>{text}</CardDescription>;
    }

    const preText = text.substring(0, match.index);
    const codesText = match[2];
    const codes = codesText.split(',').map(c => c.trim());
    const postText = text.substring(match.index! + match[0].length);

    return (
        <CardDescription>
            {preText}
            (Ocorrências:{' '}
            {codes.map((code, index) => (
                <React.Fragment key={code}>
                    <button
                        onClick={() => handleCodeClick(code, 'item-1')}
                        className="text-primary bg-accent rounded-md px-2 py-1 hover:bg-primary/20"
                    >
                        {code}
                    </button>
                    {index < codes.length - 1 && ', '}
                </React.Fragment>
            ))}
            ){postText}
        </CardDescription>
    );
  };

  const findItem = (list: {codigo: string, mensagem: string}[], code: string) => {
    return list.find(item => item.codigo === code);
  }

  return (
    <div className="space-y-4">
      {relacionamentosData.map(rel => (
        <Card key={rel.title} className="bg-card/50 border-border shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
          <CardHeader>
            <CardTitle className="text-xl">{rel.title}</CardTitle>
            <DescriptionWithLinks text={rel.description} />
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {rel.providencias && rel.providencias.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-base text-foreground/90">Ações/Providências Comuns</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {rel.providencias.map(code => {
                    const item = findItem(tiposDeAcaoData, code);
                    return item ? (
                      <li key={code} className="text-muted-foreground">
                        <button onClick={() => handleCodeClick(code, 'item-2')} className="text-left hover:underline">
                          <strong className="text-foreground/90 font-semibold"><span className="bg-accent p-1 px-2 rounded-md">{code}</span>:</strong> {item.mensagem}
                        </button>
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            )}
             {rel.panes && rel.panes.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-base text-foreground/90">Tipos de Pane Comuns</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {rel.panes.map(code => {
                    const item = findItem(tiposDePaneData, code);
                    return item ? (
                       <li key={code} className="text-muted-foreground">
                        <button onClick={() => handleCodeClick(code, 'item-3')} className="text-left hover:underline">
                           <strong className="text-foreground/90 font-semibold"><span className="bg-accent p-1 px-2 rounded-md">{code}</span>:</strong> {item.mensagem}
                        </button>
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            )}
             {rel.outras && rel.outras.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-base text-foreground/90">Outras Mensagens Comuns</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {rel.outras.map(code => {
                    const item = findItem(outrasMensagensData, code);
                    return item ? (
                       <li key={code} className="text-muted-foreground">
                        <button onClick={() => handleCodeClick(code, 'item-4')} className="text-left hover:underline">
                           <strong className="text-foreground/90 font-semibold"><span className="bg-accent p-1 px-2 rounded-md">{code}</span>:</strong> {item.mensagem}
                        </button>
                      </li>
                    ) : null;
                  })}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function CodigosPage() {
  const [openAccordion, setOpenAccordion] = React.useState<string>();

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
      content: <TiposDePaneTable />,
    },
    {
      value: 'item-4',
      title: 'Outras Mensagens',
      content: <OutrasMensagensTable />,
    },
    {
      value: 'item-5',
      title: 'Códigos de Mensagem',
      content: <CodigosDeMensagemTable />,
    },
    {
      value: 'item-6',
      title: 'Código Q (Alfabeto Fonético)',
      content: <AlfabetoFoneticoTable />,
    },
    {
      value: 'item-7',
      title: 'Relacionamentos',
      content: <RelacionamentosContent setOpenAccordion={setOpenAccordion} />,
    },
    {
      value: 'item-8',
      title: 'Pontos de Apoio',
      content: <PontosDeApoioTable />,
    },
  ];

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

      <Accordion type="single" collapsible className="w-full space-y-4" value={openAccordion} onValueChange={setOpenAccordion}>
        {codeSections.map((section) => (
          <AccordionItem key={section.value} value={section.value} className="rounded-lg border bg-card shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
            <AccordionTrigger className="text-lg font-medium font-condensed px-6 hover:no-underline">
              {section.title}
            </AccordionTrigger>
            <AccordionContent className="px-6">{section.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
