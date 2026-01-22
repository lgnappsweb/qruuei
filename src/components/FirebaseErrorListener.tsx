'use client';
import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
    const { toast } = useToast();

    useEffect(() => {
        const handleError = (error: FirestorePermissionError) => {
            console.error(error); // Also log to console for dev
            toast({
                variant: 'destructive',
                title: 'Erro de Permissão no Firestore',
                description: 'Verifique as regras de segurança e a sua autenticação.',
            });
            // In a real app, you might throw this error to an error boundary
            // For this dev environment, we will throw it to show the Next.js overlay
            throw error;
        };

        errorEmitter.on('permission-error', handleError);

        return () => {
            errorEmitter.off('permission-error', handleError);
        };
    }, [toast]);

    return null; // This component does not render anything
}
