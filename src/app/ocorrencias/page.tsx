'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const mockOcorrencias = [
  {
    id: '1',
    type: 'QUD RESGATE',
    rodovia: 'BR-158',
    km: '123+400',
    timestamp: '26/07/2024 10:30',
    status: 'Finalizada' as 'Finalizada' | 'Em Andamento',
    codOcorrencia: 'AC01'
  },
  {
    id: '2',
    type: 'VEÍCULO ABANDONADO',
    rodovia: 'MS-306',
    km: '55+000',
    timestamp: '26/07/2024 11:15',
    status: 'Em Andamento' as 'Finalizada' | 'Em Andamento',
    codOcorrencia: 'TO01'
  },
  {
    id: '3',
    type: 'ANIMAL NA RODOVIA',
    rodovia: 'MS-112',
    km: '21+200',
    timestamp: '26/07/2024 09:00',
    status: 'Finalizada' as 'Finalizada' | 'Em Andamento',
    codOcorrencia: 'TO03'
  },
  {
    id: '4',
    type: 'INCÊNDIO EM VEÍCULO',
    rodovia: 'BR-158',
    km: '88+900',
    timestamp: '25/07/2024 18:45',
    status: 'Finalizada' as 'Finalizada' | 'Em Andamento',
    codOcorrencia: 'TO05'
  },
];


export default function OcorrenciasPage() {
  return (
    <div className="space-y-8 pb-24">
      <div className="space-y-2 text-center">
        <h1 className="font-condensed text-3xl font-bold tracking-tight">
          HISTÓRICO DE OCORRÊNCIAS
        </h1>
        <p className="text-muted-foreground">
          Visualize as ocorrências registradas.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockOcorrencias.map((ocorrencia) => (
          <Card key={ocorrencia.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{ocorrencia.codOcorrencia}</span>
                <Badge variant={ocorrencia.status === 'Finalizada' ? 'secondary' : 'destructive'}>
                  {ocorrencia.status}
                </Badge>
              </CardTitle>
              <CardDescription>{ocorrencia.type}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-base text-muted-foreground">
                <span className="font-semibold text-foreground">Rodovia:</span> {ocorrencia.rodovia}
              </p>
              <p className="text-base text-muted-foreground">
                <span className="font-semibold text-foreground">KM:</span> {ocorrencia.km}
              </p>
              <p className="text-base text-muted-foreground">
                <span className="font-semibold text-foreground">Data/Hora:</span> {ocorrencia.timestamp}
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Ver Detalhes
              </Button>
            </CardFooter>
          </Card>
        ))}
         {mockOcorrencias.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground py-12">
            Nenhuma ocorrência registrada ainda.
          </div>
        )}
      </div>
    </div>
  );
}