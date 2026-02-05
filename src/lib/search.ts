import { occurrences } from './occurrences';
import { PlaceHolderImages } from './placeholder-images';
import { mapsMeLinks } from './kmz-links';

export const tiposDeOcorrenciaData = [
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
    { codigo: 'TO50', mensagem: 'Nível De Serviço, Manutenção Frota / Bases', grupo: 'Avarias, Panes' },
];

export const tiposDeAcaoData = [
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

export const tiposDePaneData = [
  { codigo: 'TP01', mensagem: 'Pane Mecânica' },
  { codigo: 'TP02', mensagem: 'Pane Elétrica' },
  { codigo: 'TP03', mensagem: 'Pane Pneu' },
  { codigo: 'TP04', mensagem: 'Pane Seca' },
  { codigo: 'TP05', mensagem: 'Super Aquecimento De Motor' },
  { codigo: 'TP07', mensagem: 'Bloqueio De Veículos Por Rastreador' },
];

export const outrasMensagensData = [
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

export const codigosDeMensagemData = [
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

export const alfabetoFoneticoData = [
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

export const pontosDeApoioData = [
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

export const relacionamentosData = [
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
    providencias: ['PR01', 'PR09', 'PR13', 'PR17', 'PR53'],
    panes: [],
    outras: ['OU02'],
   }
];

export const linksData = [
  {
    title: 'Portal Meu RH',
    href: 'http://portalweb.way112.com.br/web/app/RH/PortalMeuRH/#/login',
  },
  {
    title: 'CheckList',
    href: 'http://checklist.way306.com.br:8091/CheckList/app3_login/',
  }
];

export const placasRegulamentacaoData = [
  { codigo: 'R-1', nome: 'Parada obrigatória (PARE)', significado: 'Obriga o condutor a parar o veículo antes de entrar ou cruzar a via.' },
  { codigo: 'R-2', nome: 'Dê a preferência', significado: 'Obriga o condutor a dar preferência de passagem aos veículos da via prioritária.' },
  { codigo: 'R-3', nome: 'Sentido proibido', significado: 'Proíbe seguir no sentido indicado (ex.: sentido proibido para aquele fluxo).' },
  { codigo: 'R-4a', nome: 'Proibido virar à esquerda', significado: 'Proíbe conversão/virada à esquerda.' },
  { codigo: 'R-4b', nome: 'Proibido virar à direita', significado: 'Proíbe conversão/virada à direita.' },
  { codigo: 'R-5a', nome: 'Proibido retornar à esquerda', significado: 'Proíbe efetuar retorno/volta à esquerda (meia-volta).' },
  { codigo: 'R-5b', nome: 'Proibido retornar à direita', significado: 'Proíbe efetuar retorno/volta à direita.' },
  { codigo: 'R-6a', nome: 'Proibido estacionar', significado: 'Proíbe estacionar no local a partir do ponto sinalizado.' },
  { codigo: 'R-6b', nome: 'Estacionamento regulamentado', significado: 'Indica local/área onde o estacionamento é permitido e regulamentado.' },
  { codigo: 'R-6c', nome: 'Proibido parar e estacionar', significado: 'Proíbe tanto parar quanto estacionar no trecho sinalizado.' },
  { codigo: 'R-7', nome: 'Proibido ultrapassar', significado: 'Proíbe ultrapassagens no trecho sinalizado.' },
  { codigo: 'R-8a', nome: 'Proibido mudar de faixa (esq → dir)', significado: 'Proíbe mudança de faixa/pista no sentido indicado.' },
  { codigo: 'R-8b', nome: 'Proibido mudar de faixa (dir → esq)', significado: 'Proíbe mudança de faixa/pista no sentido indicado.' },
  { codigo: 'R-9', nome: 'Proibido trânsito de caminhões', significado: 'Proíbe a circulação de caminhões na via/trecho sinalizado.' },
  { codigo: 'R-10', nome: 'Proibido trânsito de veículos automotores', significado: 'Proíbe circulação de veículos automotores (indica área sem veículos motorizados).' },
  { codigo: 'R-11', nome: 'Proibido trânsito de veículos de tração animal', significado: 'Proíbe circulação de carroças e veículos de tração animal.' },
  { codigo: 'R-12', nome: 'Proibido trânsito de bicicletas', significado: 'Proíbe circulação de bicicletas no trecho sinalizado.' },
  { codigo: 'R-13', nome: 'Proibido trânsito de tratores e máquinas', significado: 'Proíbe circulação de tratores e máquinas agrícolas/obras.' },
  { codigo: 'R-14', nome: 'Peso bruto total máximo permitido', significado: 'Indica o limite de peso bruto total permitido (ex.: “10 t”).' },
  { codigo: 'R-15', nome: 'Altura máxima permitida', significado: 'Indica a altura máxima permitida do veículo (ex.: “4,0 m”).' },
  { codigo: 'R-16', nome: 'Largura máxima permitida', significado: 'Indica a largura máxima permitida do veículo (ex.: “3,0 m”).' },
  { codigo: 'R-17', nome: 'Peso máximo por eixo', significado: 'Indica o limite de peso por eixo (ex.: “2 t por eixo”).' },
  { codigo: 'R-18', nome: 'Comprimento máximo permitido', significado: 'Indica o comprimento máximo permitido do veículo (ex.: “10 m”).' },
  { codigo: 'R-19', nome: 'Velocidade máxima permitida', significado: 'Regulamenta o limite máximo de velocidade para o trecho (ex.: “80 km/h”).' },
  { codigo: 'R-20', nome: 'Proibido acionar buzina', significado: 'Proíbe o uso de buzina/sinal sonoro (zonas de silêncio: hospitais, escolas etc.).' },
  { codigo: 'R-21', nome: 'Alfândega', significado: 'Indica a presença de repartição alfandegária — parada obrigatória quando exigida.' },
  { codigo: 'R-22', nome: 'Uso obrigatório de corrente', significado: 'Obriga o uso de correntes nas rodas (trechos com neve, gelo ou atoleiro).' },
  { codigo: 'R-23', nome: 'Conserve-se à direita', significado: 'Determina que veículos devam manter-se à direita (mantenha-se à direita).' },
  { codigo: 'R-24a', nome: 'Sentido de circulação da via/pista', significado: 'Indica o sentido de circulação obrigatório naquela faixa/pista.' },
  { codigo: 'R-24b', nome: 'Passagem obrigatória', significado: 'Indica passagem obrigatória na direção da seta (usar o lado indicado).' },
  { codigo: 'R-25a', nome: 'Vire à esquerda', significado: 'Indica obrigatoriedade de virar à esquerda.' },
  { codigo: 'R-25b', nome: 'Vire à direita', significado: 'Indica obrigatoriedade de virar à direita.' },
  { codigo: 'R-25c', nome: 'Siga em frente ou à esquerda', significado: 'Indica que os veículos devem seguir em frente ou virar à esquerda.' },
  { codigo: 'R-25d', nome: 'Siga em frente ou à direita', significado: 'Indica que os veículos devem seguir em frente ou virar à direita.' },
  { codigo: 'R-26', nome: 'Siga em frente', significado: 'Indica obrigação de seguir em frente (proibido virar).' },
  { codigo: 'R-27', nome: 'Ônibus, caminhões e veículos de grande porte mantenham-se à direita', significado: 'Determina que veículos de grande porte permaneçam na faixa da direita.' },
  { codigo: 'R-28', nome: 'Duplo sentido de circulação', significado: 'Indica que a via possui tráfego em ambos os sentidos.' },
  { codigo: 'R-29', nome: 'Proibido trânsito de pedestres', significado: 'Proíbe a circulação de pedestres no trecho/via.' },
  { codigo: 'R-30', nome: 'Pedestre — ande pela esquerda', significado: 'Orientação obrigatória para pedestres andarem pelo lado esquerdo indicado.' },
  { codigo: 'R-31', nome: 'Pedestre — ande pela direita', significado: 'Orientação obrigatória para pedestres andarem pelo lado direito indicado.' },
  { codigo: 'R-32', nome: 'Circulação exclusiva de ônibus', significado: 'Indica faixa/trecho reservado exclusivamente para ônibus.' },
  { codigo: 'R-33', nome: 'Sentido de circulação na rotatória', significado: 'Indica o sentido obrigatório de circulação dentro da rotatória (setas circulares).' },
  { codigo: 'R-34', nome: 'Circulação exclusiva de bicicletas', significado: 'Indica faixa/trecho reservado exclusivamente para bicicletas.' },
  { codigo: 'R-35a', nome: 'Ciclista — transite à esquerda', significado: 'Determina que ciclistas usem o lado esquerdo indicado.' },
  { codigo: 'R-35b', nome: 'Ciclista — transite à direita', significado: 'Determina que ciclistas usem o lado direito indicado.' },
  { codigo: 'R-36a', nome: 'Ciclistas à esquerda, pedestres à direita', significado: 'Separação obrigatória: ciclistas à esquerda e pedestres à direita.' },
  { codigo: 'R-36b', nome: 'Pedestres à esquerda, ciclistas à direita', significado: 'Separação obrigatória: pedestres à esquerda e ciclistas à direita.' },
  { codigo: 'R-37', nome: 'Proibido trânsito de motocicletas, motonetas e ciclomotores', significado: 'Proíbe a circulação desses veículos no trecho.' },
  { codigo: 'R-38', nome: 'Proibido trânsito de ônibus', significado: 'Proíbe a circulação de ônibus na via/trecho.' },
  { codigo: 'R-39', nome: 'Circulação exclusiva de caminhão', significado: 'Indica faixa/trecho reservado exclusivamente para caminhões.' },
  { codigo: 'R-40', nome: 'Trânsito proibido a carros de mão', significado: 'Proíbe a circulação de carros de mão/manípulos manuais na via.' },
  { codigo: 'R-41', nome: 'Início de faixa exclusiva / indicação', significado: 'Placa complementar que indica início de faixa exclusiva para o pictograma mostrado.' },
  { codigo: 'R-42', nome: 'Término de faixa exclusiva / indicação', significado: 'Placa complementar que indica término de faixa exclusiva para o pictograma mostrado.' },
  { codigo: 'R-43', nome: 'Faixa exclusiva (variante)', significado: 'Indicação de faixa exclusiva para veículos representados no pictograma.' },
  { codigo: 'R-44', nome: 'Faixa exclusiva (variante)', significado: 'Indicação de faixa exclusiva (ou combinação) para veículos representados.' },
  { codigo: 'R-45', nome: 'Faixa exclusiva (variante)', significado: 'Outra variação de sinalização de faixa exclusiva (conforme pictograma).' },
  { codigo: 'R-46', nome: 'Pista compartilhada — pedestre e bicicleta', significado: 'Indica compartilhamento de via entre pedestres e bicicletas (orientações de convívio).' },
];

export const placasAdvertenciaData = [
    { codigo: 'A-1a', nome: 'Curva acentuada à esquerda', significado: 'Alerta para curva pronunciada à esquerda; reduzir velocidade.' },
    { codigo: 'A-1b', nome: 'Curva acentuada à direita', significado: 'Alerta para curva pronunciada à direita; reduzir velocidade.' },
    { codigo: 'A-2a', nome: 'Curva à esquerda', significado: 'Alerta para curva suave à esquerda.' },
    { codigo: 'A-2b', nome: 'Curva à direita', significado: 'Alerta para curva suave à direita.' },
    { codigo: 'A-3a', nome: 'Pista sinuosa à esquerda', significado: 'Trecho sinuoso com predominância de curvas para a esquerda.' },
    { codigo: 'A-3b', nome: 'Pista sinuosa à direita', significado: 'Trecho sinuoso com predominância de curvas para a direita.' },
    { codigo: 'A-4a', nome: 'Curva acentuada em “S” à esquerda', significado: 'Sequência de curvas tipo “S”, primeira para a esquerda; reduzir velocidade.' },
    { codigo: 'A-4b', nome: 'Curva acentuada em “S” à direita', significado: 'Sequência de curvas tipo “S”, primeira para a direita; reduzir velocidade.' },
    { codigo: 'A-5a', nome: 'Curva em “S” à esquerda', significado: 'Trecho com duas curvas formando “S”, início à esquerda.' },
    { codigo: 'A-5b', nome: 'Curva em “S” à direita', significado: 'Trecho com duas curvas formando “S”, início à direita.' },
    { codigo: 'A-6', nome: 'Cruzamento de vias', significado: 'Aviso de cruzamento; atenção ao tráfego que cruza a via.' },
    { codigo: 'A-7a', nome: 'Via lateral à esquerda', significado: 'Aviso sobre via lateral entrando pela esquerda.' },
    { codigo: 'A-7b', nome: 'Via lateral à direita', significado: 'Aviso sobre via lateral entrando pela direita.' },
    { codigo: 'A-8', nome: 'Interseção em “T”', significado: 'Indica que a via termina num cruzamento em “T”.' },
    { codigo: 'A-9', nome: 'Bifurcação em “Y”', significado: 'Aviso de divisão da via em duas direções (formato em Y).' },
    { codigo: 'A-10a', nome: 'Entroncamento oblíquo à esquerda', significado: 'Interseção oblíqua com via à esquerda; atenção ao tráfego.' },
    { codigo: 'A-10b', nome: 'Entroncamento oblíquo à direita', significado: 'Interseção oblíqua com via à direita; atenção ao tráfego.' },
    { codigo: 'A-11a', nome: 'Junções sucessivas contrárias (1ª à esquerda)', significado: 'Sequência de junções com a primeira via lateral à esquerda.' },
    { codigo: 'A-11b', nome: 'Junções sucessivas contrárias (1ª à direita)', significado: 'Sequência de junções com a primeira via lateral à direita.' },
    { codigo: 'A-12', nome: 'Interseção em círculo', significado: 'Aviso de rotatória ou interseção circular adiante.' },
    { codigo: 'A-13a', nome: 'Confluência à esquerda', significado: 'Via que se incorpora pela esquerda; cuidado com fluxo que entra.' },
    { codigo: 'A-13b', nome: 'Confluência à direita', significado: 'Via que se incorpora pela direita; cuidado com fluxo que entra.' },
    { codigo: 'A-14', nome: 'Semáforo à frente', significado: 'Aviso de semáforo à frente; prepare-se a reduzir e parar se necessário.' },
    { codigo: 'A-15', nome: 'Parada obrigatória à frente', significado: 'Aviso de placa PARE ou parada obrigatória adiante.' },
    { codigo: 'A-16', nome: 'Bonde / VLT', significado: 'Presença de bonde/VLT; atenção ao veículo sobre trilhos.' },
    { codigo: 'A-17', nome: 'Pista irregular', significado: 'Superfície irregular; reduzir velocidade e atenção.' },
    { codigo: 'A-18', nome: 'Saliência ou lombada', significado: 'Aviso de lombada/saliência para reduzir velocidade.' },
    { codigo: 'A-19', nome: 'Depressão', significado: 'Rebaixo ou depressão no pavimento adiante; atenção.' },
    { codigo: 'A-20a', nome: 'Declive acentuado', significado: 'Trecho com descida pronunciada; reduzir e controlar velocidade.' },
    { codigo: 'A-20b', nome: 'Aclive acentuado', significado: 'Trecho com subida pronunciada; atenção à tração e marchas.' },
    { codigo: 'A-21a', nome: 'Estreitamento de pista ao centro', significado: 'Pista estreita pelo centro; reduzir velocidade e atenção.' },
    { codigo: 'A-21b', nome: 'Estreitamento de pista à esquerda', significado: 'Pista estreita no lado esquerdo.' },
    { codigo: 'A-21c', nome: 'Estreitamento de pista à direita', significado: 'Pista estreita no lado direito.' },
    { codigo: 'A-21d', nome: 'Alargamento de pista à esquerda', significado: 'Pista alarga-se à esquerda; fim de estreitamento.' },
    { codigo: 'A-21e', nome: 'Alargamento de pista à direita', significado: 'Pista alarga-se à direita; fim de estreitamento.' },
    { codigo: 'A-22', nome: 'Ponte estreita', significado: 'Aviso de ponte com largura reduzida; atenção e reduzir velocidade.' },
    { codigo: 'A-23', nome: 'Ponte móvel', significado: 'Ponte móvel adiante; possível interrupção do tráfego.' },
    { codigo: 'A-24', nome: 'Obras', significado: 'Serviços na via; reduzir velocidade e atenção a operários/equipamentos.' },
    { codigo: 'A-25', nome: 'Mão dupla adiante', significado: 'Aviso de trânsito em ambos os sentidos adiante.' },
    { codigo: 'A-26a', nome: 'Sentido único', significado: 'Indica que à frente é sentido único de circulação.' },
    { codigo: 'A-26b', nome: 'Sentido duplo', significado: 'Indica que à frente há trânsito nos dois sentidos.' },
    { codigo: 'A-27', nome: 'Área com desmoronamento', significado: 'Risco de queda de pedras/atoleiro; atenção e reduzir velocidade.' },
    { codigo: 'A-28', nome: 'Pista escorregadia', significado: 'Superfície escorregadia (óleo, chuva); reduzir velocidade.' },
    { codigo: 'A-29', nome: 'Projeção de cascalho', significado: 'Pedrisco ou cascalho projetado por veículos; reduzir velocidade.' },
    { codigo: 'A-30a', nome: 'Trânsito de ciclistas', significado: 'Presença de ciclistas na via; reduzir velocidade e compartilhar espaço.' },
    { codigo: 'A-30b', nome: 'Passagem sinalizada de ciclistas', significado: 'Indica travessia ou faixa específica para ciclistas.' },
    { codigo: 'A-30c', nome: 'Trânsito compartilhado (ciclistas/pedestres)', significado: 'Via ou trecho compartilhado entre pedestres e ciclistas.' },
    { codigo: 'A-31', nome: 'Trânsito de tratores / maquinaria', significado: 'Presença de tratores ou máquinas agrícolas; atenção.' },
    { codigo: 'A-32a', nome: 'Trânsito de pedestres', significado: 'Zona com maior circulação de pedestres; reduzir velocidade.' },
    { codigo: 'A-32b', nome: 'Passagem sinalizada de pedestres', significado: 'Indica faixa de travessia ou passagem para pedestres.' },
    { codigo: 'A-33a', nome: 'Área escolar', significado: 'Aviso de proximidade de escola; reduzir velocidade e atenção.' },
    { codigo: 'A-33b', nome: 'Passagem sinalizada de escolares', significado: 'Indica passagem usada por estudantes; reforçar cuidado.' },
    { codigo: 'A-34', nome: 'Crianças', significado: 'Área com presença de crianças (praças, escolas); atenção redobrada.' },
    { codigo: 'A-35', nome: 'Animais (gado)', significado: 'Possibilidade de animais domésticos na via; reduzir velocidade.' },
    { codigo: 'A-36', nome: 'Animais selvagens', significado: 'Risco de animais silvestres cruzando a via; atenção.' },
    { codigo: 'A-37', nome: 'Altura limitada', significado: 'Limitação de altura no obstáculo à frente (ex.: viaduto).' },
    { codigo: 'A-38', nome: 'Largura limitada', significado: 'Limitação de largura da via/obstáculo adiante.' },
    { codigo: 'A-39', nome: 'Passagem de nível sem barreira', significado: 'Cruzamento ferroviário sem cancelas; reduzir velocidade e olhar ambos os lados.' },
    { codigo: 'A-40', nome: 'Passagem de nível com barreira', significado: 'Cruzamento ferroviário com cancelas à frente.' },
    { codigo: 'A-41', nome: 'Cruz de Santo André', significado: 'Indica o cruzamento com linha férrea; cuidado redobrado.' },
    { codigo: 'A-42a', nome: 'Início de pista dupla', significado: 'Indica início de pista com duas faixas no mesmo sentido.' },
    { codigo: 'A-42b', nome: 'Fim de pista dupla', significado: 'Indica fim da pista dupla (volta a pista simples).' },
    { codigo: 'A-42c', nome: 'Pista dividida', significado: 'Indica que a pista é dividida por canteiro ou divisória.' },
    { codigo: 'A-43', nome: 'Aeroporto', significado: 'Proximidade de aeroporto; possível presença de aeronaves/ruído.' },
    { codigo: 'A-44', nome: 'Vento lateral', significado: 'Trecho sujeito a ventos laterais fortes; atenção ao volante.' },
    { codigo: 'A-45', nome: 'Rua sem saída', significado: 'Indica que a via não tem saída; usar rota alternativa.' },
    { codigo: 'A-46', nome: 'Peso bruto total limitado', significado: 'Limitação do peso bruto total permitido (valor indicado em placa complementar).' },
    { codigo: 'A-47', nome: 'Peso limitado por eixo', significado: 'Limitação de peso por eixo; observar placa complementar.' },
    { codigo: 'A-48', nome: 'Comprimento limitado', significado: 'Limitação de comprimento máximo do veículo (ver placa complementar).' },
    { codigo: 'A-49a', nome: 'Pedestres à esquerda, VLT à direita', significado: 'Indica separação de fluxos: pedestres usam lado esquerdo e VLT à direita.' },
    { codigo: 'A-49b', nome: 'Pedestres à direita, VLT à esquerda', significado: 'Indica separação de fluxos: pedestres usam lado direito e VLT à esquerda.' },
    { codigo: 'A-50a', nome: 'Veículos à esquerda, VLT à direita', significado: 'Indica separação de fluxos: veículos por um lado e VLT pelo outro.' },
    { codigo: 'A-50b', nome: 'Veículos à direita, VLT à esquerda', significado: 'Indica separação de fluxos: veículos por um lado e VLT pelo outro.' },
];

export interface SearchableItem {
    id: string;
    category: string;
    title: string;
    content: string;
    code?: string;
    link: string;
}

const getOccurrenceLink = (occurrenceId: string) => {
    switch (occurrenceId) {
        case '1': return '/ocorrencias/qud-resgate';
        case '2': return '/ocorrencias/qud-operacao';
        case '3': return '/ocorrencias/tracado-de-pista';
        case '4': return '/ocorrencias/to01';
        case '5': return '/ocorrencias/to02';
        case '6': return '/ocorrencias/to03';
        case '7': return '/ocorrencias/to04';
        case '8': return '/ocorrencias/to05';
        case '9': return '/ocorrencias/to06';
        case '10': return '/ocorrencias/to07';
        case '11': return '/ocorrencias/to09';
        case '12': return '/ocorrencias/to11';
        case '13': return '/ocorrencias/to12';
        case '14': return '/ocorrencias/to15';
        case '15': return '/ocorrencias/to16';
        case '16': return '/ocorrencias/to17';
        case '17': return '/ocorrencias/to19';
        case '18': return '/ocorrencias/to32';
        case '19': return '/ocorrencias/to33';
        case '20': return '/ocorrencias/to34';
        case '21': return '/ocorrencias/to35';
        case '22': return '/ocorrencias/to37';
        case '23': return '/ocorrencias/to38';
        case '24': return '/ocorrencias/to39';
        case '25': return '/ocorrencias/to50';
        default: return '/';
    }
};

export const searchableData: SearchableItem[] = [
    ...occurrences.map(item => ({
        id: `occ-${item.id}`,
        category: 'Ocorrência',
        title: item.title,
        content: `Formulário para registrar ocorrência do tipo ${item.title}`,
        code: item.title,
        link: getOccurrenceLink(item.id)
    })),
    ...tiposDeOcorrenciaData.map(item => ({
        id: `codigo-oco-${item.codigo}`,
        category: 'Código de Ocorrência',
        title: item.mensagem,
        content: `Grupo: ${item.grupo}`,
        code: item.codigo,
        link: '/codigos'
    })),
    ...tiposDeAcaoData.map(item => ({
        id: `codigo-acao-${item.codigo}`,
        category: 'Código de Ação/Providência',
        title: item.mensagem,
        content: '',
        code: item.codigo,
        link: '/codigos'
    })),
    ...tiposDePaneData.map(item => ({
        id: `codigo-pane-${item.codigo}`,
        category: 'Código de Pane',
        title: item.mensagem,
        content: '',
        code: item.codigo,
        link: '/codigos'
    })),
    ...outrasMensagensData.map(item => ({
        id: `codigo-outras-${item.codigo}`,
        category: 'Código de Outras Mensagens',
        title: item.mensagem,
        content: '',
        code: item.codigo,
        link: '/codigos'
    })),
    ...codigosDeMensagemData.map(item => ({
        id: `codigo-msg-${item.codigo}`,
        category: 'Código de Mensagem',
        title: item.mensagem,
        content: 'Código Q',
        code: item.codigo,
        link: '/codigos'
    })),
    ...alfabetoFoneticoData.map(item => ({
        id: `codigo-q-${item.letra}`,
        category: 'Código Q (Alfabeto Fonético)',
        title: `${item.palavra} (${item.letra})`,
        content: `Pronúncia: ${item.pronuncia}`,
        code: item.letra,
        link: '/codigos'
    })),
    ...relacionamentosData.map(item => ({
        id: `rel-${item.title.toLowerCase().replace(/\s/g, '-')}`,
        category: 'Relacionamentos',
        title: item.title,
        content: item.description,
        link: '/codigos'
    })),
    ...pontosDeApoioData.map((item, index) => ({
        id: `apoio-${item.ponto.toLowerCase().replace(/[\s/]/g, '-')}-${index}`,
        category: 'Ponto de Apoio',
        title: item.ponto,
        content: `Rodovia ${item.rodovia}, KM ${item.km}, Sentido ${item.sentido}`,
        link: '/codigos'
    })),
    ...linksData.map(item => ({
        id: `link-${item.title.toLowerCase().replace(/\s/g, '-')}`,
        category: 'Link Útil',
        title: item.title,
        content: item.href,
        link: item.href,
    })),
    ...mapsMeLinks.map(item => ({
        id: `link-maps-me-${item.title.toLowerCase().replace(/\s/g, '-')}`,
        category: 'MAPS.ME Link',
        title: item.title,
        content: item.href,
        link: item.href,
    })),
    ...placasRegulamentacaoData.map(item => ({
        id: `placa-reg-${item.codigo}`,
        category: 'Placa de Regulamentação',
        title: item.nome,
        content: item.significado,
        code: item.codigo,
        link: '/imagens'
    })),
    ...placasAdvertenciaData.map(item => ({
        id: `placa-adv-${item.codigo}`,
        category: 'Placa de Advertência',
        title: item.nome,
        content: item.significado,
        code: item.codigo,
        link: '/imagens'
    })),
    ...PlaceHolderImages.filter(img => img.category === 'indicacao').map(item => ({
        id: `placa-ind-${item.id}`,
        category: 'Placa de Indicação',
        title: item.description,
        content: item.imageHint,
        link: '/imagens'
    }))
];
