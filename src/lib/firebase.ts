import { initializeApp } from 'firebase/app';
import {
  getAuth, signInAnonymously, onAuthStateChanged,
  type Auth, type User,
} from 'firebase/auth';
import {
  getFirestore, collection, addDoc, query, where, orderBy, limit as fbLimit,
  onSnapshot, type Firestore,
} from 'firebase/firestore';
import type { ScanResult } from '../types';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/**
 * Firebase is optional. If no project is configured (the common case right
 * after cloning this repo), the app transparently falls back to per-device
 * localStorage history in App.tsx instead of throwing.
 */
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let auth: Auth | null = null;
let db: Firestore | null = null;

if (isFirebaseConfigured) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

/** Signs the user in anonymously (per README: "no account required for basic scans") and reports auth state changes. */
export function watchAuthUser(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  signInAnonymously(auth).catch((e) => console.warn('[Firebase] anonymous sign-in failed:', e.message));
  return onAuthStateChanged(auth, callback);
}

export async function saveScanToCloud(result: ScanResult, userId: string) {
  if (!db) return;
  // Matches the schema enforced by firestore.rules / firebase-blueprint.
  await addDoc(collection(db, 'scans'), { ...result, userId });
}

/** Live-subscribes to this user's most recent scans. Returns an unsubscribe function. */
export function subscribeToScanHistory(userId: string, callback: (history: ScanResult[]) => void) {
  if (!db) return () => {};
  // NOTE: if Firestore prompts for a composite index the first time this runs,
  // follow the link in the console error — it's a one-click index creation.
  const q = query(
    collection(db, 'scans'),
    where('userId', '==', userId),
    orderBy('date', 'desc'),
    fbLimit(50)
  );
  return onSnapshot(
    q,
    (snap) => callback(snap.docs.map((d) => d.data() as ScanResult)),
    (err) => console.warn('[Firebase] history subscription error:', err.message)
  );
}
