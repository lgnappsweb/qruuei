'use client';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { sendPasswordResetEmail } from 'firebase/auth';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
});

export default function ForgotPasswordPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const handlePasswordReset = async (values: z.infer<typeof formSchema>) => {
    if (!auth) {
      console.error("Auth service is not available.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, values.email);
      toast({
        title: "E-mail de redefinição enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar e-mail",
        description: error.message,
      });
    }
  };

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
          <CardTitle className="text-center text-3xl font-bold">Esqueceu sua Senha?</CardTitle>
          <CardDescription className="text-center">Insira seu e-mail para receber um link de redefinição.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePasswordReset)} className="space-y-4">
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
              <Button type="submit" className="w-full">Enviar Link de Redefinição</Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
           <Link href="/login" passHref>
              <span className="cursor-pointer text-primary hover:underline">Voltar para o Login</span>
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
