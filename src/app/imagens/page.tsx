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

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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


export default function ImagensPage() {
  const allImages: ImagePlaceholder[] = PlaceHolderImages;
  const [selectedImage, setSelectedImage] = React.useState<ImagePlaceholder | null>(null);

  const regulamentacaoImages = allImages.filter(img => img.category === 'regulamentacao');
  
  const advertenciaImages = allImages.filter(img => img.category === 'advertencia');

  const indicacaoImages = allImages.filter(img => img.category === 'indicacao');

  const accordionSections = [
    {
      value: 'item-1',
      title: 'Placas de regulamentação – Placas vermelhas',
      images: regulamentacaoImages,
      content: <PlacasRegulamentacaoTable />,
    },
    {
      value: 'item-2',
      title: 'Advertência',
      images: advertenciaImages,
      content: <p className="text-center text-muted-foreground py-12">Nenhum código nesta categoria ainda.</p>,
    },
    {
      value: 'item-3',
      title: 'Indicação',
      images: indicacaoImages,
      content: <p className="text-center text-muted-foreground py-12">Nenhum código nesta categoria ainda.</p>,
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
