'use client';

import Link from 'next/link';
import { ArrowLeft, Search, HardHat, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const subOccurrences = [
  {
    title: 'Verificação Faixa de Domínio',
    description: 'Relatório padrão para verificação da faixa de domínio.',
    icon: Search,
    href: '/ocorrencias/to15/faixa-de-dominio',
    enabled: true,
  },
  {
    title: 'Formulário 2',
    description: 'Em desenvolvimento.',
    icon: HardHat,
    href: '#',
    enabled: false,
  },
  {
    title: 'Formulário 3',
    description: 'Em desenvolvimento.',
    icon: Shield,
    href: '#',
    enabled: false,
  },
];

export default function OcorrenciaTO15SelectionPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleClick = (item: (typeof subOccurrences)[0]) => {
    if (item.enabled) {
      router.push(item.href);
    } else {
      toast({
        title: 'Em desenvolvimento',
        description: `O formulário "${item.title}" ainda não está disponível.`,
      });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-24">
      <Button asChild variant="ghost" className="pl-0">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o início
        </Link>
      </Button>

      <div className="space-y-2 text-center">
        <h1 className="font-condensed text-3xl font-bold tracking-tight">
          SELECIONE O TIPO DE OCORRÊNCIA (TO15)
        </h1>
        <p className="text-muted-foreground">
          Escolha um dos formulários abaixo para continuar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subOccurrences.map((item) => (
          <Card
            key={item.title}
            onClick={() => handleClick(item)}
            className={`cursor-pointer transition-all ${
              item.enabled
                ? 'hover:border-primary hover:shadow-lg'
                : 'opacity-50 cursor-not-allowed'
            }`}
          >
            <CardHeader className="flex-row items-center gap-4 space-y-0 pb-2">
               <item.icon className="h-8 w-8 text-primary" />
               <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{item.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
