'use client';
import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Chrome } from 'lucide-react';

export default function LoginPage() {
  const { user, initialising } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSignIn = () => {
    if (!auth) {
        console.error("Auth service is not available.");
        return;
    };
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(error => {
        console.error("Authentication error: ", error);
    });
  };

  if (initialising || user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Redirecionando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <h1 className="text-4xl font-bold">Bem-vindo!</h1>
        <p className="text-muted-foreground mt-4 mb-8">
          Faça login para acessar o painel.
        </p>
        <Button onClick={handleSignIn} size="lg">
          <Chrome className="mr-2" />
          Entrar com Google
        </Button>
    </div>
  );
}
