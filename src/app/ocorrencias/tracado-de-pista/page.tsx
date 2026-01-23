'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TracadoDePistaPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-24">
       <Button asChild variant="ghost" className="pl-0">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o início
        </Link>
      </Button>
      <div className="flex flex-col items-center justify-center text-center pt-12">
        <h1 className="font-condensed text-3xl font-bold tracking-tight">Traçado de Pista</h1>
        <p className="text-muted-foreground mt-4">Este formulário está em construção.</p>
      </div>
    </div>
  );
}
