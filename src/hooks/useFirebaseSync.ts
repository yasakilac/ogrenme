import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProgressData } from '../types';

const PUSH_DEBOUNCE_MS = 3000;

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'Bu e-posta zaten kayıtlı.',
  'auth/invalid-email': 'Geçersiz e-posta adresi.',
  'auth/weak-password': 'Şifre en az 6 karakter olmalı.',
  'auth/invalid-credential': 'E-posta veya şifre hatalı.',
  'auth/wrong-password': 'E-posta veya şifre hatalı.',
  'auth/user-not-found': 'E-posta veya şifre hatalı.',
  'auth/network-request-failed': 'İnternet bağlantısı yok, tekrar deneyin.'
};

const authErrorMessage = (code: unknown): string =>
  AUTH_ERROR_MESSAGES[String(code)] ?? 'Bir hata oluştu, tekrar deneyin.';

interface UseFirebaseSyncOptions {
  /** Buluttaki ilerleme yerel state'e yüklenirken (girişte, buluta veri varsa) çağrılır. */
  onCloudProgress: (data: UserProgressData) => void;
  /** İlk girişte buluta veri yoksa yerel ilerlemeyi taşımak için okunur. */
  getLocalProgress: () => UserProgressData;
}

export function useFirebaseSync({ onCloudProgress, getLocalProgress }: UseFirebaseSyncOptions) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState('');

  // ponytail: her render'da güncellenen ref'ler; effect tek seferlik (deps: [])
  // abone olduğu için callback'lerin en güncel halini kapatmadan kullanmamızı sağlar.
  const onCloudProgressRef = useRef(onCloudProgress);
  onCloudProgressRef.current = onCloudProgress;
  const getLocalProgressRef = useRef(getLocalProgress);
  getLocalProgressRef.current = getLocalProgress;

  const resolvedUidRef = useRef<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      setAuthLoading(false);
      if (!fbUser || resolvedUidRef.current === fbUser.uid) return;
      resolvedUidRef.current = fbUser.uid;

      try {
        const snap = await getDoc(doc(db, 'users', fbUser.uid));
        const cloudProgress = snap.exists() ? (snap.data().progress as UserProgressData | undefined) : undefined;
        if (cloudProgress) {
          onCloudProgressRef.current(cloudProgress);
        } else {
          await setDoc(doc(db, 'users', fbUser.uid), {
            progress: getLocalProgressRef.current(),
            updatedAt: serverTimestamp()
          });
        }
      } catch (e) {
        console.error('Bulut senkronu başlatılamadı', e);
        setError('Bulut senkronu başlatılamadı. İnternet bağlantınızı kontrol edin.');
      }
    });
    return unsubscribe;
  }, []);

  // Değişen ilerlemeyi debounce ile Firestore'a yaz (write-through).
  const pushProgress = useCallback(
    (data: UserProgressData) => {
      if (!user) return;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        setDoc(doc(db, 'users', user.uid), { progress: data, updatedAt: serverTimestamp() }).catch((e) => {
          console.error('Bulut kaydı başarısız', e);
          setError('Değişiklikler buluta kaydedilemedi. İnternet bağlantınızı kontrol edin.');
        });
      }, PUSH_DEBOUNCE_MS);
    },
    [user]
  );

  const signUp = useCallback(async (email: string, password: string) => {
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setError(authErrorMessage((e as { code?: string })?.code));
      throw e;
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      setError(authErrorMessage((e as { code?: string })?.code));
      throw e;
    }
  }, []);

  const signOutUser = useCallback(async () => {
    resolvedUidRef.current = null;
    setError('');
    await signOut(auth);
  }, []);

  return { user, authLoading, error, setError, signUp, signIn, signOutUser, pushProgress };
}
