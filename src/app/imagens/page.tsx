'use client';

import * as React from 'react';
import NextImage from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { placasAdvertenciaData, placasRegulamentacaoData } from '@/lib/search';

function PlacasRegulamentacaoTable({ setSelectedImage, images }: { setSelectedImage: (image: ImagePlaceholder | null) => void, images: ImagePlaceholder[] }) {
  const handleClick = (codigo: string) => {
    const codeNum = parseInt(codigo.substring(2));
    let imageId;
    if (codeNum <= 23) {
      imageId = "placa-regulamentacao-1";
    } else {
      imageId = "placa-regulamentacao-2";
    }
    const image = images.find(img => img.id === imageId);
    if (image) {
      setSelectedImage(image);
    }
  };

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
              <TableRow key={item.codigo} onClick={() => handleClick(item.codigo)} className="cursor-pointer hover:bg-muted">
                <TableCell className="font-medium"><span className="font-mono bg-destructive text-destructive-foreground px-2 py-1 rounded-md">{item.codigo}</span></TableCell>
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
          <Card key={item.codigo} onClick={() => handleClick(item.codigo)} className="cursor-pointer">
            <CardHeader className="p-4">
              <CardTitle className="flex justify-between items-start text-lg">
                <span className="flex-1 pr-2">{item.nome}</span>
                <span className="font-mono text-sm bg-destructive text-destructive-foreground px-2 py-1 rounded-md">{item.codigo}</span>
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

function PlacasAdvertenciaTable({ setSelectedImage, images }: { setSelectedImage: (image: ImagePlaceholder | null) => void, images: ImagePlaceholder[] }) {
  const handleClick = (codigo: string) => {
    const codeNum = parseInt(codigo.match(/\d+/)?.[0] || '0');
    let imageId;

    if (codeNum < 10) {
      imageId = 'placa-advertencia-1';
    } else if (codeNum === 10) {
      imageId = codigo.endsWith('a') ? 'placa-advertencia-1' : 'placa-advertencia-2';
    } else if (codeNum <= 31) {
      imageId = 'placa-advertencia-2';
    } else {
      imageId = 'placa-advertencia-3';
    }
    
    const image = images.find(img => img.id === imageId);
    if (image) {
      setSelectedImage(image);
    }
  };

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
              <TableRow key={item.codigo} onClick={() => handleClick(item.codigo)} className="cursor-pointer hover:bg-muted">
                <TableCell className="font-medium"><span className="font-mono bg-yellow-400 text-black px-2 py-1 rounded-md">{item.codigo}</span></TableCell>
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
          <Card key={item.codigo} onClick={() => handleClick(item.codigo)} className="cursor-pointer">
            <CardHeader className="p-4">
              <CardTitle className="flex justify-between items-start text-lg">
                <span className="flex-1 pr-2">{item.nome}</span>
                <span className="font-mono text-sm bg-yellow-400 text-black px-2 py-1 rounded-md">{item.codigo}</span>
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
      content: <PlacasRegulamentacaoTable setSelectedImage={setSelectedImage} images={allImages} />,
    },
    {
      value: 'item-2',
      title: 'Placas de advertência – Placas amarelas',
      images: advertenciaImages,
      content: <PlacasAdvertenciaTable setSelectedImage={setSelectedImage} images={allImages} />,
    },
    {
      value: 'item-3',
      title: 'Placas de identificação',
      images: [], // Main category won't display images directly now
      content: (
         <div className="space-y-8">
          {indicacaoSubCategories.map((subCategory) => (
            <div key={subCategory.title}>
              <h3 className="text-2xl font-semibold mb-4">{subCategory.title}</h3>
               {subCategory.images.length > 0 ? (
                 <Carousel opts={{ align: "start", loop: true }} className="w-full">
                   <CarouselContent>
                     {subCategory.images.map((image) => (
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
                                 {image.code && (
                                   <span className="font-mono bg-black/50 text-sm px-2 py-1 rounded-md">{image.code}</span>
                                 )}
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
              ) : subCategory.content}
            </div>
          ))}
        </div>
      )
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
        <Button asChild variant="ghost" className="pl-0">
            <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para o início
            </Link>
        </Button>
        <div className="space-y-2 text-center">
          <h1 className="font-condensed text-3xl font-bold tracking-tight">
            Placas de Sinalização
          </h1>
          <p className="text-muted-foreground text-center">
            Consulte as placas de sinalização de trânsito.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {accordionSections.map((section) => (
            <AccordionItem key={section.value} value={section.value} className="rounded-lg border bg-card shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
              <AccordionTrigger className="text-lg font-medium font-condensed px-6 hover:no-underline">
                {section.title}
              </AccordionTrigger>
              <AccordionContent className="px-6">
                 <div className="space-y-8">
                    {section.images.length > 0 && (
                      <Carousel opts={{ align: "start", loop: true, }} className="w-full">
                        <CarouselContent>
                          {section.images.map((image) => (
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
                                        {image.code && (
                                            <span className="font-mono bg-black/50 text-sm px-2 py-1 rounded-md">{image.code}</span>
                                        )}
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
                    )}
                    {section.content}
                 </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      
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
    </div>
  );
}
