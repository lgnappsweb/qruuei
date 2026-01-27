'use client';

import * as React from 'react';
import NextImage from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const placasRegulamentacaoData = [
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

function PlacasRegulamentacaoTable() {
  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Código</TableHead>
              <TableHead>Nome (placa)</TableHead>
              <TableHead>Significado (breve)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {placasRegulamentacaoData.map((item) => (
              <TableRow key={item.codigo}>
                <TableCell className="font-medium">{item.codigo}</TableCell>
                <TableCell>{item.nome}</TableCell>
                <TableCell>{item.significado}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {placasRegulamentacaoData.map((item) => (
          <Card key={item.codigo}>
            <CardHeader className="p-4">
              <CardTitle className="flex justify-between items-start text-lg">
                <span className="flex-1 pr-2">{item.nome}</span>
                <span className="font-mono text-sm bg-accent text-accent-foreground px-2 py-1 rounded-md">{item.codigo}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground">{item.significado}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

const placasAdvertenciaData = [
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

function PlacasAdvertenciaTable() {
  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Código</TableHead>
              <TableHead>Nome (placa)</TableHead>
              <TableHead>Significado (breve)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {placasAdvertenciaData.map((item) => (
              <TableRow key={item.codigo}>
                <TableCell className="font-medium">{item.codigo}</TableCell>
                <TableCell>{item.nome}</TableCell>
                <TableCell>{item.significado}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {placasAdvertenciaData.map((item) => (
          <Card key={item.codigo}>
            <CardHeader className="p-4">
              <CardTitle className="flex justify-between items-start text-lg">
                <span className="flex-1 pr-2">{item.nome}</span>
                <span className="font-mono text-sm bg-accent text-accent-foreground px-2 py-1 rounded-md">{item.codigo}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground">{item.significado}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}


export default function ImagensPage() {
  const allImages: ImagePlaceholder[] = PlaceHolderImages;
  const [selectedImage, setSelectedImage] = React.useState<ImagePlaceholder | null>(null);

  const regulamentacaoImages = allImages.filter(img => img.category === 'regulamentacao');
  
  const advertenciaImages = allImages.filter(img => img.category === 'advertencia');

  const indicacaoImages = allImages.filter(img => img.category === 'indicacao');

  const indicacaoSubCategories = [
    {
      title: 'Placas de identificação',
      images: indicacaoImages.filter(img => img.imageHint.includes('identificacao')),
      content: <p className="text-center text-muted-foreground py-12">Nenhum código nesta categoria ainda.</p>
    },
    {
      title: 'Placas de orientação de destino',
      images: indicacaoImages.filter(img => img.imageHint.includes('orientacao')),
      content: <p className="text-center text-muted-foreground py-12">Nenhum código nesta categoria ainda.</p>
    },
    {
      title: 'Placas educativas',
      images: indicacaoImages.filter(img => img.imageHint.includes('educativas')),
      content: <p className="text-center text-muted-foreground py-12">Nenhum código nesta categoria ainda.</p>
    },
    {
      title: 'Placas de serviços auxiliares',
      images: indicacaoImages.filter(img => img.imageHint.includes('servicos')),
      content: <p className="text-center text-muted-foreground py-12">Nenhum código nesta categoria ainda.</p>
    },
    {
      title: 'Placas de atrativos turísticos',
      images: indicacaoImages.filter(img => img.imageHint.includes('atrativos')),
      content: <p className="text-center text-muted-foreground py-12">Nenhum código nesta categoria ainda.</p>
    },
    {
      title: 'Placas de postos de fiscalização',
      images: indicacaoImages.filter(img => img.imageHint.includes('fiscalizacao')),
      content: <p className="text-center text-muted-foreground py-12">Nenhum código nesta categoria ainda.</p>
    },
  ];

  const accordionSections = [
    {
      value: 'item-1',
      title: 'Placas de regulamentação – Placas vermelhas',
      images: regulamentacaoImages,
      content: <PlacasRegulamentacaoTable />,
    },
    {
      value: 'item-2',
      title: 'Placas de advertência – Placas amarelas',
      images: advertenciaImages,
      content: <PlacasAdvertenciaTable />,
    },
    {
      value: 'item-3',
      title: 'Placas de identificação – Placas Azuis',
      images: [], // Main category won't display images directly now
      content: (
         <div className="space-y-8">
          {indicacaoSubCategories.map((subCategory) => (
            <div key={subCategory.title}>
              <h3 className="text-2xl font-semibold mb-4">{subCategory.title}</h3>
               {subCategory.images.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4">
                  {subCategory.images.map((image) => (
                    <Card 
                      key={image.id} 
                      className="group relative overflow-hidden bg-muted cursor-pointer"
                      onClick={() => setSelectedImage(image)}
                    >
                      <CardContent className="p-0 aspect-video">
                        <NextImage
                          src={image.imageUrl}
                          alt={image.description}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-contain transition-transform duration-300 group-hover:scale-105 p-2"
                          data-ai-hint={image.imageHint}
                        />
                      </CardContent>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <CardTitle className="text-lg text-white truncate flex justify-between items-center">
                            <span>{image.description}</span>
                            {image.code && (
                                <span className="font-mono bg-black/50 text-sm px-2 py-1 rounded-md">{image.code}</span>
                            )}
                        </CardTitle>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : subCategory.content}
            </div>
          ))}
        </div>
      )
    },
  ];

  return (
    <>
      <div className="space-y-8 max-w-7xl mx-auto pb-24">
        <div className="space-y-2 text-center">
          <h1 className="font-condensed text-3xl font-bold tracking-tight">
            Placas de Sinalização
          </h1>
          <p className="text-muted-foreground text-center">
            Consulte as placas de sinalização de trânsito.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="item-1">
          {accordionSections.map((section) => (
            <AccordionItem key={section.value} value={section.value} className="rounded-lg border bg-card shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
              <AccordionTrigger className="text-lg font-medium font-condensed px-6 hover:no-underline">
                {section.title}
              </AccordionTrigger>
              <AccordionContent className="px-6">
                 <div className="space-y-8">
                    {section.images.length > 0 && (
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4">
                        {section.images.map((image) => (
                          <Card 
                            key={image.id} 
                            className="group relative overflow-hidden bg-muted cursor-pointer"
                            onClick={() => setSelectedImage(image)}
                          >
                            <CardContent className="p-0 aspect-video">
                              <NextImage
                                src={image.imageUrl}
                                alt={image.description}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-contain transition-transform duration-300 group-hover:scale-105 p-2"
                                data-ai-hint={image.imageHint}
                              />
                            </CardContent>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                              <CardTitle className="text-lg text-white truncate flex justify-between items-center">
                                  <span>{image.description}</span>
                                  {image.code && (
                                      <span className="font-mono bg-black/50 text-sm px-2 py-1 rounded-md">{image.code}</span>
                                  )}
                              </CardTitle>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                    {section.content}
                 </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
        <DialogContent className="max-w-[90vw] max-h-[85vh] p-2">
          {selectedImage && (
            <>
               <DialogHeader>
                <DialogTitle className="sr-only">{selectedImage.description}</DialogTitle>
              </DialogHeader>
              <div className="relative w-full h-[80vh]">
                <NextImage
                  src={selectedImage.imageUrl}
                  alt={selectedImage.description}
                  fill
                  className="object-contain"
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
