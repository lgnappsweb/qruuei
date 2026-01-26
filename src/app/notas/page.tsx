'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function NotasPage() {
  const [notes, setNotes] = React.useState('');
  const [isEditing, setIsEditing] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    const savedNotes = localStorage.getItem('app_notes');
    if (savedNotes) {
      setNotes(savedNotes);
    } else {
        // If no notes, start in editing mode
        setIsEditing(true);
    }
    setHasLoaded(true);
  }, []);

  const handleSave = () => {
    localStorage.setItem('app_notes', notes);
    setIsEditing(false);
    toast({
      title: 'Notas Salvas',
      description: 'Suas anotações foram salvas com sucesso.',
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  }
  
  if (!hasLoaded) {
     return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-24 flex justify-center gap-x-1 overflow-hidden -my-4">
            <div className="w-[6px] h-full bg-foreground"></div>
            <div
                className="w-[6px] h-[calc(100%+40px)] animate-road-dashes"
            ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-24">
      <Button asChild variant="ghost" className="pl-0">
        <Link href="/ajustes">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Ajustes
        </Link>
      </Button>

      <div className="space-y-2 text-center">
        <h1 className="font-condensed text-3xl font-bold tracking-tight">
          BLOCO DE NOTAS
        </h1>
        <p className="text-muted-foreground">
          Use este espaço para suas anotações rápidas.
        </p>
      </div>

      <Card className="shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Anotações
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            )}
          </CardTitle>
          <CardDescription>
            Suas anotações são salvas localmente no seu dispositivo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={15}
              className="w-full text-lg"
              placeholder="Digite suas anotações aqui..."
            />
          ) : (
            <div className="text-lg min-h-[384px] whitespace-pre-wrap rounded-md border p-4">
              {notes ? (
                <p>{notes}</p>
              ) : (
                <p className="text-muted-foreground">Nenhuma anotação ainda. Clique em editar para começar.</p>
              )}
            </div>
          )}
        </CardContent>
        {isEditing && (
          <CardFooter className="flex justify-end gap-2">
            <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4"/>
                Salvar Notas
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
