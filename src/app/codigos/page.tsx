'use client';

import * as React from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { ArrowLeft, LinkIcon } from 'lucide-react';
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
import { 
    tiposDeOcorrenciaData,
    tiposDeAcaoData,
    tiposDePaneData,
    outrasMensagensData,
    codigosDeMensagemData,
    alfabetoFoneticoData,
    pontosDeApoioData,
    relacionamentosData,
    linksData
} from '@/lib/search';
import { mapsMeLinks } from '@/lib/kmz-links';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";


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

function LinksTable() {
  return (
    <div className="space-y-4">
      {linksData.map(link => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Card className="hover:bg-accent hover:border-primary/50 transition-colors shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <LinkIcon className="h-5 w-5 text-primary" />
                {link.title}
              </CardTitle>
            </CardHeader>
          </Card>
        </a>
      ))}
    </div>
  );
}

function MapsMeLinksTable() {
  return (
    <div className="space-y-4">
      {mapsMeLinks.map(link => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Card className="hover:bg-accent hover:border-primary/50 transition-colors shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <LinkIcon className="h-5 w-5 text-primary" />
                {link.title}
              </CardTitle>
            </CardHeader>
          </Card>
        </a>
      ))}
    </div>
  );
}

function InstrucoesGuinchoLeve() {
  const [selectedImage, setSelectedImage] = React.useState<ImagePlaceholder | null>(null);
  const guinchoImages = PlaceHolderImages.filter(img => img.category === 'guincho-leve');

  return (
    <div className="space-y-4">
      {guinchoImages.length > 0 ? (
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {guinchoImages.map((image) => (
              <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card
                    className="group relative overflow-hidden bg-muted cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <CardContent className="p-0 aspect-video">
                      <NextImage
                        src={image.imageUrl}
                        alt={image.description}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        data-ai-hint={image.imageHint}
                      />
                    </CardContent>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <CardTitle className="text-lg text-white truncate flex justify-between items-center">
                        <span>{image.description}</span>
                      </CardTitle>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-12" />
          <CarouselNext className="mr-12" />
        </Carousel>
      ) : (
         <Card className="bg-muted/50 border-dashed">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                    <LinkIcon className="h-5 w-5 text-primary" />
                    Aguardando links das imagens
                </CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>
                    Para exibir as imagens diretamente, preciso dos links individuais de cada imagem (com final .jpg, .png, etc.), e não o link da pasta do Google Drive. Assim que você me fornecer os links diretos, eu os adicionarei aqui.
                </CardDescription>
            </CardContent>
         </Card>
      )}

      <Dialog open={!!selectedImage} onOpenChange={(isOpen) => !isOpen && setSelectedImage(null)}>
        <DialogContent className="p-0 max-w-[90vw] sm:max-w-sm w-full">
          {selectedImage && (
            <>
              <DialogHeader className="p-4 pr-12 pb-2">
                <DialogTitle>{selectedImage.description}</DialogTitle>
              </DialogHeader>
              <div className="relative w-full aspect-[9/16]">
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
    </div>
  );
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
    {
      value: 'item-11',
      title: 'Instruções Para Operar Guincho Leve',
      content: <InstrucoesGuinchoLeve />,
    },
    {
      value: 'item-9',
      title: 'Links Úteis',
      content: <LinksTable />,
    },
    {
      value: 'item-10',
      title: 'MAPS.ME',
      content: <MapsMeLinksTable />,
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
