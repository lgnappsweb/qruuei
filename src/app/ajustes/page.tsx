'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useUser, useAuth, useFirestore } from "@/firebase";
import { signOut, updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function AjustesPage() {
  const { user, initialising } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');

  useEffect(() => {
    if (!initialising && !user) {
      router.push('/login');
    }
    if (user?.displayName) {
        setName(user.displayName);
    }
  }, [user, initialising, router]);

  const handleSignOut = () => {
    if (auth) {
      signOut(auth).then(() => {
        router.push('/login');
      });
    }
  };

  const handleProfileUpdate = async () => {
    if (auth?.currentUser && firestore && name.trim() !== '') {
        try {
            await updateProfile(auth.currentUser, { displayName: name });

            const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
            await updateDoc(userDocRef, { name: name });

            toast({
                title: "Perfil atualizado!",
                description: "Seu nome foi atualizado com sucesso.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao atualizar",
                description: error.message,
            });
        }
    }
  };
  
  const handleThemeChange = (checked: boolean) => {
    console.log(checked ? "Dark theme" : "Light theme");
  };

  if (initialising || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Carregando...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-24">
      <div className="space-y-2 text-center">
        <h1 className="font-condensed text-3xl font-bold tracking-tight">
          AJUSTES
        </h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências e informações da conta.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Suas informações de usuário.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="flex items-center gap-4">
             <Avatar className="h-16 w-16">
              <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? 'User'} />
              <AvatarFallback>{name.charAt(0) ?? 'U'}</AvatarFallback>
            </Avatar>
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
          </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleProfileUpdate}>Salvar Alterações</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aparência</CardTitle>
          <CardDescription>Personalize a aparência do aplicativo.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="theme-switch" className="text-lg">
              Tema Escuro
            </Label>
            <Switch
              id="theme-switch"
              checked={true}
              onCheckedChange={handleThemeChange}
              aria-readonly
              disabled
            />
          </div>
           <p className="text-sm text-muted-foreground mt-2">
              A troca de tema ainda não está disponível.
            </p>
        </CardContent>
      </Card>
      
      <Card>
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
      
      <Card>
        <CardHeader>
          <CardTitle>Sobre</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">QRU Prioridade v1.0.0</p>
        </CardContent>
      </Card>
    </div>
  );
}
