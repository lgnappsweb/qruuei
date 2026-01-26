'use client';

import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, KmlLayer } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { kmzLinks } from '@/lib/kmz-links';
import { Map as MapIcon } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: -20.442778,
  lng: -54.646389
};

export default function MapaPage() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const [selectedKmz, setSelectedKmz] = useState<string | null>(null);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <MapIcon className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-4">Chave de API do Google Maps ausente</h2>
        <p className="text-muted-foreground max-w-md">
          Para exibir o mapa, você precisa de uma chave de API do Google Maps.
        </p>
        <div className="text-left bg-muted/50 p-4 rounded-lg mt-6 w-full max-w-lg">
          <p className="text-sm text-foreground font-semibold">Siga estes passos:</p>
          <ol className="list-decimal list-inside text-sm text-muted-foreground mt-2 space-y-1">
            <li>Crie um arquivo chamado <code className="font-mono bg-background p-1 rounded-md">.env.local</code> na pasta principal do projeto.</li>
            <li>Dentro dele, adicione a seguinte linha, substituindo <code className="font-mono bg-background p-1 rounded-md">SUA_CHAVE_DE_API_AQUI</code> pela sua chave:</li>
          </ol>
          <pre className="bg-background p-3 rounded-lg mt-2 text-sm overflow-x-auto">
            <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=SUA_CHAVE_DE_API_AQUI</code>
          </pre>
          <p className="mt-4 text-xs text-muted-foreground">
              Reinicie o servidor de desenvolvimento após criar o arquivo.
          </p>
        </div>
        <Button asChild className="mt-6">
            <a href="https://developers.google.com/maps/documentation/javascript/get-api-key" target="_blank" rel="noopener noreferrer">
                Obter Chave de API
            </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="space-y-2 text-center">
          <h1 className="font-condensed text-3xl font-bold tracking-tight">
          MAPA DAS RODOVIAS
          </h1>
          <p className="text-muted-foreground">
          Selecione um trecho para visualizar no mapa.
          </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {kmzLinks.map((link) => (
          <Button 
            key={link.name} 
            onClick={() => setSelectedKmz(link.url === selectedKmz ? null : link.url)}
            variant={selectedKmz === link.url ? "default" : "outline"}
          >
            {link.name}
          </Button>
        ))}
      </div>
      <div className="flex-1 rounded-lg overflow-hidden shadow-xl border">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={7}
            options={{
                mapTypeControl: false,
                streetViewControl: false,
            }}
          >
            {selectedKmz && <KmlLayer url={selectedKmz} options={{ preserveViewport: false }} />}
          </GoogleMap>
        ) : (
            <div className="flex items-center justify-center h-full bg-muted">
                <div className="h-24 flex justify-center gap-x-1 overflow-hidden -my-4">
                    <div className="w-[6px] h-full bg-foreground"></div>
                    <div
                        className="w-[6px] h-[calc(100%+40px)] animate-road-dashes"
                    ></div>
                </div>
            </div>
        )}
        {loadError && (
             <div className="flex items-center justify-center h-full bg-destructive text-destructive-foreground">
                Erro ao carregar o mapa. Verifique sua chave de API.
            </div>
        )}
      </div>
       <p className="text-xs text-center text-muted-foreground pt-2">
          Atenção: A exibição dos mapas KMZ depende das permissões de compartilhamento do Google Drive.
        </p>
    </div>
  );
}
