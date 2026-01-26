'use client';

import * as React from 'react';
import NextImage from 'next/image';
import { ImageIcon as ImageIconLucide } from 'lucide-react';

import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';

export default function ImagensPage() {
  const images: ImagePlaceholder[] = PlaceHolderImages;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      <div className="space-y-2">
        <h1 className="font-condensed text-3xl font-bold tracking-tight">
          Galeria de Imagens
        </h1>
        <p className="text-muted-foreground">
          Uma coleção de imagens inspiradoras.
        </p>
      </div>

      <div className="space-y-6 pt-8">
        {images.length === 0 ? (
          <div className="text-center text-muted-foreground py-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
            <ImageIconLucide className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-2xl font-semibold text-foreground">Nenhuma imagem na galeria</h3>
            <p className="text-lg">As imagens da galeria aparecerão aqui.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((image) => (
              <Card key={image.id} className="group relative overflow-hidden shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
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
  );
}
