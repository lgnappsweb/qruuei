'use client';
import { useUser, useAuth, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Chrome, KeyRound, Mail, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

export default function LoginPage() {
  const { user, initialising } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    if (!auth || !firestore) {
        console.error("Auth or Firestore service is not available.");
        return;
    };
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      const userDocRef = doc(firestore, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      const adminEmails = ['lgngregorio@icloud.com', 'lgngregorio92@gmail.com'];
      let userRole = 'operator';

      if (user.email && adminEmails.includes(user.email.toLowerCase())) {
          userRole = 'admin';
      } else if (userDocSnap.exists()) {
        userRole = userDocSnap.data().role;
      }
      
      await setDoc(userDocRef, {
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            role: userRole,
        }, { merge: true });

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro de Autenticação",
        description: error.message,
      });
    }
  };

  const handleEmailSignIn = async (values: z.infer<typeof formSchema>) => {
    if (!auth || !firestore) {
      toast({
        variant: "destructive",
        title: "Erro de Serviço",
        description: "Serviço de autenticação indisponível.",
      });
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;

      const userDocRef = doc(firestore, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      const adminEmails = ['lgngregorio@icloud.com', 'lgngregorio92@gmail.com'];
      let userRole = 'operator';

      if (user.email && adminEmails.includes(user.email.toLowerCase())) {
        userRole = 'admin';
      } else if (userDocSnap.exists()) {
        userRole = userDocSnap.data().role;
      }
      
      await setDoc(userDocRef, {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        role: userRole,
      }, { merge: true });

    } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Erro de Autenticação",
          description: "E-mail ou senha incorretos. Por favor, tente novamente.",
        });
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
          <CardTitle className="text-center text-3xl font-bold">Bem-vindo!</CardTitle>
          <CardDescription className="text-center">Faça login para acessar o painel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailSignIn)} className="space-y-4">
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
                          placeholder="Sua senha" 
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
              <Button type="submit" className="w-full">Entrar</Button>
            </form>
          </Form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>

          <Button variant="outline" onClick={handleGoogleSignIn} className="w-full">
            <Chrome className="mr-2 h-5 w-5" />
            Entrar com Google
          </Button>

        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center text-sm">
           <Link href="/forgot-password" passHref>
              <span className="cursor-pointer text-primary hover:underline">Esqueceu sua senha?</span>
            </Link>
            <p className="text-muted-foreground">
              Não tem uma conta?{' '}
              <Link href="/signup" passHref>
                 <span className="cursor-pointer font-semibold text-primary hover:underline">Cadastre-se</span>
              </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
