'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import NextImage from 'next/image';
import { ArrowLeft, PlusCircle, Trash2, ImageIcon as ImageIconLucide, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import type { User } from 'firebase/auth';

interface StoredImage {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: Timestamp;
  userId: string;
}

const addImageFormSchema = z.object({
  title: z.string().min(1, { message: 'O título é obrigatório.' }),
  imageUrl: z.string().url({ message: 'Por favor, insira uma URL válida.' }),
});

function ImagesContent({ user }: { user: User }) {
  const firestore = useFirestore();
  const imagesCollectionPath = `users/${user.uid}/images`;
  const { data: imagesData, loading: imagesLoading } = useCollection<StoredImage>(imagesCollectionPath);
  
  const [images, setImages] = React.useState<StoredImage[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [imageToDelete, setImageToDelete] = React.useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof addImageFormSchema>>({
    resolver: zodResolver(addImageFormSchema),
    defaultValues: {
      title: '',
      imageUrl: '',
    },
  });

  React.useEffect(() => {
    if (imagesData) {
      const sortedImages = [...imagesData].sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeB - timeA;
      });
      setImages(sortedImages);
    }
  }, [imagesData]);

  const handleSaveImage = async (values: z.infer<typeof addImageFormSchema>) => {
    if (!firestore) {
      toast({ variant: "destructive", title: "Erro", description: "Serviço de banco de dados indisponível." });
      return;
    }

    try {
      const imagesCollectionRef = collection(firestore, 'users', user.uid, 'images');
      await addDoc(imagesCollectionRef, {
        title: values.title,
        imageUrl: values.imageUrl,
        createdAt: serverTimestamp(),
        userId: user.uid,
      });
      toast({
        title: 'Imagem Salva',
        description: 'Sua nova imagem foi adicionada à galeria.',
      });
      form.reset();
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar imagem",
        description: error.message,
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (imageToDelete && firestore) {
      try {
        const imageRef = doc(firestore, 'users', user.uid, 'images', imageToDelete);
        await deleteDoc(imageRef);
        toast({
          title: 'Imagem Apagada',
          description: 'A imagem foi removida permanentemente.',
        });
        setImageToDelete(null);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro ao apagar imagem",
          description: error.message,
        });
      }
    }
  };

  if (imagesLoading) {
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
    <div className="space-y-8 max-w-7xl mx-auto pb-24">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="font-condensed text-3xl font-bold tracking-tight">
            Galeria de Imagens
          </h1>
          <p className="text-muted-foreground">
            Suas imagens salvas da internet.
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Imagem
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adicionar Nova Imagem</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSaveImage)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Paisagem bonita" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6 pt-8">
        {images.length === 0 ? (
          <div className="text-center text-muted-foreground py-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center">
            <ImageIconLucide className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-2xl font-semibold text-foreground">Nenhuma imagem salva</h3>
            <p className="text-lg">Comece a adicionar imagens para visualizá-las aqui.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((image) => (
              <Card key={image.id} className="group relative overflow-hidden shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
                <CardContent className="p-0 aspect-square">
                  <NextImage
                    src={image.imageUrl}
                    alt={image.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </CardContent>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <CardTitle className="text-lg text-white truncate">{image.title}</CardTitle>
                  <p className="text-xs text-white/80 pt-1">
                    {image.createdAt ? `Adicionada em ${format(image.createdAt.toDate(), "dd/MM/yy", { locale: ptBR })}` : ''}
                  </p>
                </div>
                <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-9 w-9 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); setImageToDelete(image.id); }}>
                    <Trash2 className="h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <AlertDialog open={imageToDelete !== null} onOpenChange={(isOpen) => !isOpen && setImageToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá apagar permanentemente a imagem da sua galeria.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setImageToDelete(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Apagar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


export default function ImagensPage() {
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

  return <ImagesContent user={user} />;
}
