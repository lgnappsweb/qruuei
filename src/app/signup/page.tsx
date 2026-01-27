'use client';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User as UserIcon, Mail, KeyRound, Eye, EyeOff } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

export default function SignupPage() {
  const { user, initialising } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSignUp = async (values: z.infer<typeof formSchema>) => {
    if (!auth || !firestore) {
      console.error("Auth or Firestore service is not available.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const newUser = userCredential.user;
      if (newUser) {
        await updateProfile(newUser, {
          displayName: values.name,
        });
        
        const userRole = values.email === 'lgngregorio@icloud.com' ? 'admin' : 'operator';

        // Create user document in Firestore
        const userDocRef = doc(firestore, "users", newUser.uid);
        await setDoc(userDocRef, {
          name: values.name,
          email: newUser.email,
          photoURL: newUser.photoURL ?? null,
          role: userRole,
        });
        
        // Force refresh user data
        await newUser.reload();
      }
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você será redirecionado para a página principal.",
      });
      router.push('/');
    } catch (error: any) {
       if (error.code === 'auth/email-already-in-use') {
        toast({
          variant: "destructive",
          title: "Erro ao cadastrar",
          description: "Este endereço de e-mail já está em uso por outra conta.",
        });
       } else {
        toast({
          variant: "destructive",
          title: "Erro ao cadastrar",
          description: error.message,
        });
       }
    }
  };
  
  if (initialising || user) {
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
    <div className="flex items-center justify-center min-h-screen p-4">
       <Card className="w-full max-w-md shadow-xl hover:shadow-2xl shadow-black/20 dark:shadow-lg dark:hover:shadow-xl dark:shadow-white/10">
        <CardHeader>
          <div className="relative flex justify-center items-center h-20 mb-4">
            <div className="z-10 bg-card px-2 sm:px-4 flex items-center justify-center gap-x-12">
              <h1 className="font-condensed text-6xl font-black tracking-tighter text-foreground">
                QRU
              </h1>
              <div className="h-20 flex justify-center gap-x-1 overflow-hidden -my-4">
                <div className="w-[6px] h-full bg-foreground"></div>
                <div
                  className="w-[6px] h-[calc(100%+40px)] animate-road-dashes"
                ></div>
              </div>
              <h1 className="font-condensed text-6xl font-black tracking-tighter text-foreground">
                UEI
              </h1>
            </div>
          </div>
          <CardTitle className="text-center text-3xl font-bold">Crie sua Conta</CardTitle>
          <CardDescription className="text-center">Preencha os campos para se registrar.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSignUp)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="Seu nome completo" {...field} className="pl-10"/>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input placeholder="seu@email.com" {...field} className="pl-10"/>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                     <FormControl>
                       <div className="relative">
                         <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Crie uma senha" 
                            {...field} 
                            className="pl-10 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                            aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
                          >
                            {showPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                          </button>
                       </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                     <FormControl>
                       <div className="relative">
                         <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                         <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="Confirme sua senha" 
                            {...field} 
                            className="pl-10 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                             aria-label={showConfirmPassword ? "Esconder senha" : "Mostrar senha"}
                          >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5 text-muted-foreground" /> : <Eye className="h-5 w-5 text-muted-foreground" />}
                          </button>
                       </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Cadastrar</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center text-sm">
             <p className="text-muted-foreground">
              Já tem uma conta?{' '}
              <Link href="/login" passHref>
                 <span className="cursor-pointer font-semibold text-primary hover:underline">Faça login</span>
              </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
