'use client';

import * as React from 'react';
import NextImage from 'next/image';
import { ImageIcon as ImageIconLucide } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";


export default function ImagensPage() {
  const allImages: ImagePlaceholder[] = PlaceHolderImages;
  const [selectedImage, setSelectedImage] = React.useState<ImagePlaceholder | null>(null);

  const regulamentacaoImages = allImages.filter(img => 
    img.imageUrl.includes('cursosdetransito.com.br') && !img.imageUrl.includes('placas_adv')
  );
  
  const advertenciaImages = allImages.filter(img => 
      img.imageUrl.includes('placas_adv')
  );

  const otherImages = allImages.filter(img => !img.imageUrl.includes('cursosdetransito.com.br'));

  const accordionSections = [
    {
      value: 'item-1',
      title: 'Placas de Regulamentação',
      images: regulamentacaoImages,
    },
    {
      value: 'item-2',
      title: 'Advertência',
      images: advertenciaImages,
    },
    {
      value: 'item-3',
      title: 'Indicação',
      images: [],
    },
  ];

  return (
    <>
      <div className="space-y-8 max-w-7xl mx-auto pb-24">
        <div className="space-y-2">
          <h1 className="font-condensed text-3xl font-bold tracking-tight">
            Galeria de Imagens
          </h1>
          <p className="text-muted-foreground">
            Uma coleção de imagens inspiradoras.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="item-1">
          {accordionSections.map((section) => (
            <AccordionItem key={section.value} value={section.value} className="rounded-lg border bg-card shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
              <AccordionTrigger className="text-lg font-medium font-condensed px-6 hover:no-underline">
                {section.title}
              </AccordionTrigger>
              <AccordionContent className="px-6">
                 {section.images.length === 0 ? (
                    <div className="text-center text-muted-foreground py-12">
                      <p>Nenhuma imagem nesta categoria.</p>
                    </div>
                  ) : (
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
                            <CardTitle className="text-lg text-white truncate">{image.description}</CardTitle>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="space-y-6 pt-8">
          <h2 className="text-2xl font-bold text-center font-condensed">Outras Imagens</h2>
          {otherImages.length === 0 ? (
            <div className="text-center text-muted-foreground py-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
              <ImageIconLucide className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-2xl font-semibold text-foreground">Nenhuma outra imagem na galeria</h3>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {otherImages.map((image) => (
                <Card 
                  key={image.id} 
                  className="group relative overflow-hidden shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10 cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <CardContent className="p-0 aspect-square">
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
                    <CardTitle className="text-lg text-white truncate">{image.description}</CardTitle>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
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
