'use client';

import React, { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, KmlLayer } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { kmzLinks } from '@/lib/kmz-links';
import { Map as MapIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
    googleMapsApiKey: "AIzaSyCjCAHA3kUSrwwbgh-WLvgEQaopMBsZ68g"
  });

  const [selectedKmzs, setSelectedKmzs] = useState<string[]>([]);
  
  useEffect(() => {
    // Carrega todas as rotas por padrão ao montar o componente
    setSelectedKmzs(kmzLinks.map(link => link.url));
  }, []);

  if ("AIzaSyCjCAHA3kUSrwwbgh-WLvgEQaopMBsZ68g" === 'SUA_CHAVE_DE_API_AQUI' || "AIzaSyCjCAHA3kUSrwwbgh-WLvgEQaopMBsZ68g" === "") {
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

  const toggleKmz = (url: string) => {
    setSelectedKmzs((prev) =>
      prev.includes(url)
        ? prev.filter((item) => item !== url)
        : [...prev, url]
    );
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <Card className="shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-center font-condensed text-2xl font-bold tracking-tight">MAPA DAS RODOVIAS</CardTitle>
          <CardDescription className="text-center">
            Selecione os trechos para visualizar.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {kmzLinks.map((link) => (
            <Button 
              key={link.name} 
              onClick={() => toggleKmz(link.url)}
              variant={selectedKmzs.includes(link.url) ? "default" : "outline"}
              size="sm"
            >
              {link.name}
            </Button>
          ))}
        </CardContent>
      </Card>
      
      <div className="flex-1 rounded-lg border shadow-xl overflow-hidden">
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
            {selectedKmzs.map((url) => (
              <KmlLayer key={url} url={url} options={{ preserveViewport: false }} />
            ))}
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
             <div className="flex items-center justify-center h-full bg-destructive text-destructive-foreground p-4 text-center">
                Erro ao carregar o mapa. Verifique sua chave de API e as configurações de referenciador.
            </div>
        )}
      </div>
      
       <p className="text-xs text-center text-muted-foreground !mt-2">
          Atenção: A exibição dos mapas KMZ depende das permissões de compartilhamento do Google Drive.
        </p>
    </div>
  );
}
