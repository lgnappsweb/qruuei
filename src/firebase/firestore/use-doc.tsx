"use client";

import { useState, useEffect, useMemo } from 'react';
import {
  doc,
  onSnapshot,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';
import { useFirestore } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

interface UseDocOptions {
  // Define any options here
}

export function useDoc<T = DocumentData>(
  docPath: string,
  options?: UseDocOptions
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const docRef = useMemo(() => {
    if (!firestore) return null;
    return doc(firestore, docPath);
  }, [firestore, docPath]);


  useEffect(() => {
    if (!docRef) {
        if (!firestore) {
            setLoading(false);
        }
        return;
    };

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot: DocumentSnapshot<DocumentData>) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      async (err: FirestoreError) => {
        const permissionError = new FirestorePermissionError({
            path: docPath,
            operation: 'get',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [docRef, docPath]);

  return { data, loading, error };
}
