"use client";

import { useState, useEffect, useMemo } from 'react';
import {
  collection,
  query,
  onSnapshot,
  Query,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
} from 'firebase/firestore';
import { useFirestore } from '../provider';
import { errorEmitter } from '../error-emitter';
import { FirestorePermissionError } from '../errors';

export function useCollection<T = DocumentData>(
  pathOrQuery: string | Query | null
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const q = useMemo(() => {
    if (!firestore || !pathOrQuery) return null;
    if (typeof pathOrQuery === 'string') {
      return query(collection(firestore, pathOrQuery));
    }
    return pathOrQuery;
  }, [firestore, pathOrQuery]);

  useEffect(() => {
    if (!q) {
      if (!firestore || !pathOrQuery) {
        setLoading(false);
      }
      return;
    };

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const documents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as T[];
        setData(documents);
        setLoading(false);
        setError(null);
      },
      async (err: FirestoreError) => {
        const permissionError = new FirestorePermissionError({
            path: typeof pathOrQuery === 'string' ? pathOrQuery : 'collection query',
            operation: 'list',
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [q, pathOrQuery]);

  return { data, loading, error };
}
