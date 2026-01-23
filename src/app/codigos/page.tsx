'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';

const codeSections = [
  {
    value: 'item-1',
    title: 'Tipos de Ocorrência',
    content: 'Conteúdo para Tipos de Ocorrência em breve.',
  },
  {
    value: 'item-2',
    title: 'Tipos de Ação/Providência',
    content: 'Conteúdo para Tipos de Ação/Providência em breve.',
  },
  {
    value: 'item-3',
    title: 'Tipos de Pane',
    content: 'Conteúdo para Tipos de Pane em breve.',
  },
  {
    value: 'item-4',
    title: 'Outras Mensagens',
    content: 'Conteúdo para Outras Mensagens em breve.',
  },
  {
    value: 'item-5',
    title: 'Códigos de Mensagem',
    content: 'Conteúdo para Códigos de Mensagem em breve.',
  },
  {
    value: 'item-6',
    title: 'Código Q (Alfabeto Fonético)',
    content: 'Conteúdo para Código Q (Alfabeto Fonético) em breve.',
  },
  {
    value: 'item-7',
    title: 'Relacionamentos',
    content: 'Conteúdo para Relacionamentos em breve.',
  },
];

export default function CodigosPage() {
  return (
    <div className="space-y-8">
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

      <Accordion type="single" collapsible className="w-full">
        {codeSections.map((section) => (
          <AccordionItem key={section.value} value={section.value}>
            <AccordionTrigger className="text-lg font-medium">
              {section.title}
            </AccordionTrigger>
            <AccordionContent>{section.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
