'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { useUser, useAuth, useFirestore, useCollection, useDoc } from "@/firebase";
import { signOut, updateProfile } from "firebase/auth";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Sun, Moon, Laptop, ArrowLeft, Notebook, BookMarked, MessageSquare, UserCog, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';


interface Message {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  read: boolean;
}

interface AppUser {
    role: 'admin' | 'supervisor' | 'operator';
}

export default function AjustesPage() {
  const { user, initialising } = useUser();
  const { data: userData } = useDoc<AppUser>(user ? `users/${user.uid}` : null);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const { theme, setTheme } = useTheme();
  
  const [selectedTheme, setSelectedTheme] = useState<string | undefined>();
  
  const [mounted, setMounted] = useState(false);
  const { data: messages, loading: messagesLoading } = useCollection<Message>(user ? `users/${user.uid}/messages` : null);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    if(messages) {
        setUnreadMessages(messages.filter(m => !m.read).length);
    }
  }, [messages]);

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
    <div className="space-y-8 max-w-2xl mx-auto">
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
      
      {(userData?.role === 'supervisor' || userData?.role === 'admin') && (
        <Card className="shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserCog className="h-6 w-6" /> PAINEL DO SUPERVISOR</CardTitle>
                <CardDescription>Acesse o painel de supervisor.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="w-full sm:w-auto">
                    <Link href="/supervisor">
                        Acessar Painel
                    </Link>
                </Button>
            </CardContent>
        </Card>
      )}
      
      {userData?.role === 'admin' && (
        <Card className="shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-6 w-6" /> PAINEL DO ADMINISTRADOR</CardTitle>
                <CardDescription>Acesse o painel de administrador.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild className="w-full sm:w-auto">
                    <Link href="/admin">
                        Acessar Painel
                    </Link>
                </Button>
            </CardContent>
        </Card>
      )}

      <Card className="shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-6 w-6" />
            Recados
            {unreadMessages > 0 && (
                <span className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {unreadMessages}
                </span>
            )}
          </CardTitle>
          <CardDescription>Mensagens importantes para você.</CardDescription>
        </CardHeader>
        <CardContent>
            {messagesLoading ? (
                <p>Carregando recados...</p>
            ) : messages && messages.length > 0 ? (
                <Accordion type="single" collapsible className="w-full">
                    {messages.sort((a,b) => b.createdAt.toMillis() - a.createdAt.toMillis()).map((message) => (
                        <AccordionItem value={message.id} key={message.id}>
                            <AccordionTrigger>{message.title}</AccordionTrigger>
                            <AccordionContent>
                                <p className="text-muted-foreground whitespace-pre-wrap">{message.content}</p>
                                <p className="text-xs text-muted-foreground mt-4">
                                    {`Recebido em ${format(message.createdAt.toDate(), "dd/MM/yy, HH:mm", { locale: ptBR })}`}
                                </p>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            ) : (
                <p className="text-muted-foreground">Nenhum recado no momento.</p>
            )}
        </CardContent>
      </Card>

      <Dialog>
        <DialogTrigger asChild>
            <Card className="shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10 cursor-pointer">
                <CardHeader className="p-6 text-left">
                    <CardTitle className="flex items-center gap-2"><BookMarked className="h-6 w-6" /> POLÍTICAS DO SGI</CardTitle>
                    <CardDescription>Sistema de Gestão Integrada</CardDescription>
                </CardHeader>
            </Card>
        </DialogTrigger>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
          <DialogHeader className="pr-12">
            <DialogTitle className="text-2xl">POLÍTICAS DO SISTEMA DE GESTÃO INTEGRADA</DialogTitle>
          </DialogHeader>
          <ScrollArea className="flex-1 pr-6 -mr-6 mt-4">
              <div className="space-y-6 text-muted-foreground">
                  <p>A Política do Sistema de Gestão Integrada da Way Brasil é definida pela integração dos seus Sistemas de Gestão e pela harmonização das políticas específicas. Todas as políticas foram desenvolvidas pela alta direção, que comprometimento. A comunicação e publicização são realizadas de forma clara e compreensível a todas as partes interessadas, clientes e comunidade em geral. Elas estão disponíveis no manual do motorista, na página da internet e afixadas em pontos estratégicos das instalações da empresa.</p>
                  
                  <div>
                      <h3 className="font-semibold text-foreground mb-2 text-lg">Satisfação do Usuário</h3>
                      <p>A Way Brasil tem sua conduta pautada nos compromissos contratuais e regulamentares, e visa promover a satisfação do usuário da Rodovia, sempre em busca da melhoria contínua dos processos e da qualidade dos serviços prestados.</p>
                  </div>
                  
                  <div>
                      <h3 className="font-semibold text-foreground mb-2 text-lg">Segurança Ocupacional e Viária</h3>
                      <p>A alta direção objetiva e se compromete com o cumprimento dos requisitos legais e com a redução de mortes e lesões graves. Essas práticas serão apoiadas através de programas de treinamentos efetivos e eficientes, com o desenvolvimento de planos anuais para melhoria contínua, além da aplicação das lições aprendidas no tratamento das não conformidades e investigação de acidentes.</p>
                  </div>

                  <div>
                      <h3 className="font-semibold text-foreground mb-2 text-lg">Gestão Responsável</h3>
                      <p>Alcançar a solidez administrativa, econômica, operacional, segurança de dados e compliance e preservação da imagem da Concessionária com objetivo de assegurar o atendimento às expectativas de seus públicos interessados.</p>
                  </div>

                  <div>
                      <h3 className="font-semibold text-foreground mb-2 text-lg">Socioambiental e Sustentabilidade</h3>
                      <p>Nos comprometemos a adotar práticas de gestão socioambiental responsáveis, considerando as melhores práticas globais e aos requisitos legais aplicáveis. Reconhecemos a urgência das mudanças climáticas e a importância da defesa dos direitos humanos como pilares fundamentais para um futuro sustentável. Defendemos a equidade, a inclusão e o respeito à dignidade humana, promovendo o bem-estar e a justiça social para todas as comunidades impactadas por nossas ações. Nossa abordagem visa equilibrar crescimento econômico, proteção ambiental e avanço social.</p>
                  </div>
                  
                  <div>
                      <h3 className="font-semibold text-foreground mb-2 text-lg">Qualidade</h3>
                      <p>Comprometimento com a gestão dos processos das atividades, realização de revisões periódicas, para sua melhoria contínua e garantir a perpetuidade do negócio, além da manutenção do foco na satisfação de todos.</p>
                  </div>
                  
                  <div>
                      <h3 className="font-semibold text-foreground mb-2 text-lg">Reconhecimento e Valorização das Pessoas</h3>
                      <p>Promover a qualificação e a conscientização dos colaboradores e demais envolvidos, de modo a motivar desenvolvimento de competências para atuação responsável e adequada.</p>
                  </div>
              </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Card className="shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
        <CardHeader>
          <CardTitle>Conta</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex justify-start items-center gap-x-4 text-muted-foreground">
              <h1 className="font-condensed text-lg font-black tracking-tighter">
                  QRU
              </h1>
              <div className="h-6 flex justify-center gap-x-px overflow-hidden -my-1">
                  <div className="w-px h-full bg-current"></div>
                  <div
                    className="w-px h-[calc(100%+20px)] animate-road-dashes-about"
                  ></div>
              </div>
              <h1 className="font-condensed text-lg font-black tracking-tighter">
                  UEI v1.0.0
              </h1>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="w-full sm:w-auto">
            <LogOut className="mr-2 h-4 w-4" />
            Sair da conta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
