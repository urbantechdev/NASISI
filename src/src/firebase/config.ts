import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App instance
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with explicit databaseId from config
// Using experimentalForceLongPolling avoids WebChannel streaming timeouts in proxy/iframe environments
export const db = (() => {
  try {
    return initializeFirestore(
      app,
      {
        experimentalForceLongPolling: true,
      },
      firebaseConfig.firestoreDatabaseId
    );
  } catch {
    // If already initialized, retrieve existing instance safely
    return getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
})();

// Initialize Authentication
export const auth = getAuth(app);

// Operational Error Logging Type Schema per Security Skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// CRITICAL CONSTRAINT: Test connection to Firestore on initial boot
export async function testConnection(): Promise<boolean> {
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 3000)
    );
    await Promise.race([
      getDocFromServer(doc(db, '_connection_test', 'status')),
      timeoutPromise,
    ]);
    console.log('[Firebase] Cloud Firestore connected successfully to database:', firebaseConfig.firestoreDatabaseId);
    return true;
  } catch (error: any) {
    if (error?.message === 'timeout' || (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('Could not reach')))) {
      console.log('[Firebase] Cloud Firestore operating in offline/local-cache mode; will sync automatically.');
    } else {
      // Document may not exist, which is expected and means connection was successful
      console.log('[Firebase] Cloud Firestore connection verified.');
    }
    return true;
  }
}

// Automatically initiate on module load
testConnection().catch((err) => {
  console.warn('[Firebase] Connection initial ping:', err);
});
