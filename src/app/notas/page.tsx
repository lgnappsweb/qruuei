'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Edit, PlusCircle, Save, Share2, Trash2, X, Notebook } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: Timestamp;
  userId: string;
}

function NotesContent({ user }: { user: User }) {
  const firestore = useFirestore();
  const notesCollectionPath = `users/${user.uid}/notes`;
  const { data: notesData, loading: notesLoading } = useCollection<Note>(notesCollectionPath);

  const [notes, setNotes] = React.useState<Note[]>([]);
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [editingNoteId, setEditingNoteId] = React.useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [noteToDelete, setNoteToDelete] = React.useState<string | null>(null);
  const [expandedNotes, setExpandedNotes] = React.useState<Set<string>>(new Set());
  const { toast } = useToast();
  const formRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (notesData) {
      const sortedNotes = [...notesData].sort((a, b) => {
        const timeA = a.updatedAt?.toMillis() || 0;
        const timeB = b.updatedAt?.toMillis() || 0;
        return timeB - timeA;
      });
      setNotes(sortedNotes);
    }
  }, [notesData]);

  const toggleNoteExpansion = (id: string) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSave = async () => {
    if (!firestore) {
        toast({ variant: "destructive", title: "Erro", description: "Serviço de banco de dados indisponível." });
        return;
    }
    if (!title.trim() && !content.trim()) {
      toast({
        variant: "destructive",
        title: 'Nota vazia',
        description: 'Por favor, preencha o título ou o conteúdo da nota.',
      });
      return;
    }

    try {
      if (editingNoteId) {
        const noteRef = doc(firestore, 'users', user.uid, 'notes', editingNoteId);
        await updateDoc(noteRef, {
          title: title.trim() || `Nota de ${format(new Date(), "dd/MM/yy 'às' HH:mm")}`,
          content: content.trim(),
          updatedAt: serverTimestamp(),
        });
        toast({
          title: 'Nota Atualizada',
          description: 'Sua nota foi atualizada com sucesso.',
        });
      } else {
        const notesCollectionRef = collection(firestore, 'users', user.uid, 'notes');
        await addDoc(notesCollectionRef, {
          title: title.trim() || `Nota de ${format(new Date(), "dd/MM/yy 'às' HH:mm")}`,
          content: content.trim(),
          updatedAt: serverTimestamp(),
          userId: user.uid,
        });
        toast({
          title: 'Nota Salva',
          description: 'Sua nova nota foi salva com sucesso.',
        });
      }
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Erro ao salvar nota",
        description: error.message,
      });
    }

    setTitle('');
    setContent('');
    setEditingNoteId(null);
    setShowCreateForm(false);
  };

  const handleEdit = (note: Note) => {
    setShowCreateForm(false);
    setEditingNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
  };
  
  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setShowCreateForm(false);
    setTitle('');
    setContent('');
  }

  const handleDeleteConfirm = async () => {
    if (noteToDelete && firestore) {
      try {
        const noteRef = doc(firestore, 'users', user.uid, 'notes', noteToDelete);
        await deleteDoc(noteRef);
        toast({
            title: 'Nota Apagada',
            description: 'A nota foi removida permanentemente.',
        });
        setNoteToDelete(null);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao apagar nota",
          description: error.message,
        });
      }
    }
  };

  const handleShare = (note: Note) => {
    const text = `*${note.title}*\n\n${note.content}`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`);
  };

  const handleCreateNewNoteClick = () => {
    setEditingNoteId(null);
    setTitle('');
    setContent('');
    setShowCreateForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
  };

   if (notesLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-24 flex justify-center gap-x-1 overflow-hidden -my-4">
          <div className="w-[6px] h-full bg-foreground"></div>
          <div className="w-[6px] h-[calc(100%+40px)] animate-road-dashes"></div>
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
          Crie, edite e gerencie suas anotações.
        </p>
      </div>

      <div className="text-center">
        <Button onClick={handleCreateNewNoteClick} className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Criar Nova Nota
        </Button>
      </div>

      {(showCreateForm || editingNoteId) && (
        <Card ref={formRef} className="shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {editingNoteId ? 'Editando Nota' : 'Nova Nota'}
              {(showCreateForm || editingNoteId) && (
                <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              )}
            </CardTitle>
            <CardDescription>
              {editingNoteId ? 'Altere os campos e clique em salvar.' : 'Preencha o título e o conteúdo da sua nota.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da nota"
            />
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full"
              placeholder="Digite suas anotações aqui..."
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              {editingNoteId ? 'Salvar Alterações' : 'Salvar Nota'}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="space-y-6 pt-8">
        <h2 className="text-2xl font-bold text-center font-condensed">Minhas Notas</h2>
        {notes.length === 0 ? (
          <div className="text-center text-muted-foreground py-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
            <Notebook className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-2xl font-semibold text-foreground">Nenhuma nota criada</h3>
            <p className="text-lg">Comece a criar novas notas para visualizá-las aqui.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {notes.map((note) => {
                const isExpanded = expandedNotes.has(note.id);
                return (
                <Card key={note.id} onClick={() => toggleNoteExpansion(note.id)} className="cursor-pointer flex flex-col shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
                    <CardHeader>
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <CardTitle className="truncate">{note.title}</CardTitle>
                                {note.updatedAt && (
                                <p className="text-xs text-muted-foreground pt-1">
                                  {`Atualizado em ${format(note.updatedAt.toDate(), "dd/MM/yy, HH:mm", { locale: ptBR })}`}
                                </p>
                                )}
                            </div>
                            {!isExpanded && (
                                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleShare(note)}>
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(note)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => setNoteToDelete(note.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    {isExpanded && (
                      <CardContent className="pt-4 flex-grow">
                        <p className="text-muted-foreground whitespace-pre-wrap">{note.content}</p>
                      </CardContent>
                    )}
                </Card>
                )
            })}
          </div>
        )}
      </div>

      <AlertDialog open={noteToDelete !== null} onOpenChange={(isOpen) => !isOpen && setNoteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá apagar permanentemente a nota.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNoteToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Apagar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function NotasPage() {
  const { user, initialising } = useUser();
  const router = useRouter();

  React.useEffect(() => {
    if (!initialising && !user) {
      router.push('/login');
    }
  }, [user, initialising, router]);

  if (initialising || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-24 flex justify-center gap-x-1 overflow-hidden -my-4">
            <div className="w-[6px] h-full bg-foreground"></div>
            <div className="w-[6px] h-[calc(100%+40px)] animate-road-dashes"></div>
        </div>
      </div>
    );
  }
  
  return <NotesContent user={user} />;
}
