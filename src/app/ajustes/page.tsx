'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useUser, useAuth, useFirestore } from "@/firebase";
import { signOut, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Sun, Moon, Laptop, ArrowLeft, Notebook } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function AjustesPage() {
  const { user, initialising } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const { theme, setTheme } = useTheme();
  
  const [selectedTheme, setSelectedTheme] = useState(theme);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSelectedTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (!initialising && !user) {
      router.push('/login');
    }
    if (user) {
        setName(user.displayName || '');
    }
  }, [user, initialising, router]);

  const handleSaveChanges = async () => {
    if (auth?.currentUser && firestore && name.trim() !== '' && user?.displayName !== name.trim()) {
        try {
            await updateProfile(auth.currentUser, { displayName: name });

            const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
            await updateDoc(userDocRef, { name: name });

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao atualizar o perfil",
                description: error.message,
            });
            return; // Don't proceed if profile update fails
        }
    }

    if (selectedTheme) {
        setTheme(selectedTheme);
    }

    toast({
        title: "Ajustes salvos!",
        description: "Suas preferências foram atualizadas.",
    });

    router.push('/');
  };
  
  const handleSignOut = () => {
    if (auth) {
      signOut(auth).then(() => {
        router.push('/login');
      });
    }
  };
  
  if (initialising || !user || !mounted) {
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
    <div className="space-y-8 max-w-2xl mx-auto pb-24">
       <Button asChild variant="ghost" className="pl-0">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o início
        </Link>
      </Button>
      <div className="space-y-2 text-center">
        <h1 className="font-condensed text-3xl font-bold tracking-tight">
          AJUSTES
        </h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências e informações da conta.
        </p>
      </div>

      <Card className="shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Suas informações de usuário.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="grid gap-4 w-full">
                <div>
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                 <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email ?? ''} disabled />
                </div>
            </div>
        </CardContent>
      </Card>

      <Card className="shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
        <CardHeader>
          <CardTitle>Bloco de Notas</CardTitle>
          <CardDescription>Acesse suas anotações rápidas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/notas">
              <Notebook className="mr-2 h-4 w-4" />
              Abrir Bloco de Notas
            </Link>
          </Button>
        </CardContent>
      </Card>
      
      <Card className="shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
        <CardHeader>
          <CardTitle>Aparência</CardTitle>
          <CardDescription>Personalize a aparência do aplicativo.</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={selectedTheme} 
            onValueChange={setSelectedTheme} 
            className="grid grid-cols-3 gap-4"
          >
            <div>
              <RadioGroupItem value="light" id="light" className="peer sr-only" />
              <Label htmlFor="light" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                <Sun className="h-6 w-6 mb-2" />
                Claro
              </Label>
            </div>
            <div>
              <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
              <Label htmlFor="dark" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                <Moon className="h-6 w-6 mb-2" />
                Escuro
              </Label>
            </div>
            <div>
              <RadioGroupItem value="system" id="system" className="peer sr-only" />
              <Label htmlFor="system" className="flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer">
                <Laptop className="h-6 w-6 mb-2" />
                Sistema
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter>
            <Button onClick={handleSaveChanges}>Salvar Alterações</Button>
        </CardFooter>
      </Card>

      <Card className="shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
        <CardHeader>
          <CardTitle>Sobre</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">QRU Prioridade v1.0.0</p>
        </CardContent>
      </Card>

      <Card className="shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
        <CardHeader>
          <CardTitle>Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={handleSignOut} className="w-full sm:w-auto">
            <LogOut className="mr-2 h-4 w-4" />
            Sair da conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
