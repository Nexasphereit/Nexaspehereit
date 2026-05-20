import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Connectivity check as per Firebase skill
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

testConnection();

// Direct custom credentials support to enable offline login and customized roles
const getCustomUserFromStorage = () => {
  const saved = localStorage.getItem('customUser');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        uid: parsed.id || parsed.uid || 'exec-custom',
        email: parsed.email || parsed.userId || `${parsed.id || 'exec-custom'}@nexasphere.it`,
        displayName: parsed.name || parsed.displayName || 'Sales Executive',
        role: parsed.role || 'executive',
        commissionPercentage: parsed.commissionPercentage ?? 0,
        emailVerified: true,
        isDemoUser: true
      };
    } catch {
      return null;
    }
  }
  return null;
};

// Overwrite auth.currentUser's getter so it returns our logged-in custom profile
try {
  const originalAuth = auth;
  Object.defineProperty(originalAuth, 'currentUser', {
    get: () => {
      const custom = getCustomUserFromStorage();
      if (custom) return custom;
      
      // Fallback: we try to read standard Firebase currentUser
      try {
        const proto = Object.getPrototypeOf(originalAuth);
        const desc = Object.getOwnPropertyDescriptor(proto, 'currentUser');
        if (desc && desc.get) {
          return desc.get.call(originalAuth);
        }
      } catch {
        // Safe ignore
      }
      return null;
    },
    set: (v) => {
      // Allow writing or delegate to original setter to prevent throwing in strict mode
      try {
        const proto = Object.getPrototypeOf(originalAuth);
        const desc = Object.getOwnPropertyDescriptor(proto, 'currentUser');
        if (desc && desc.set) {
          desc.set.call(originalAuth, v);
        }
      } catch {
        // Safe ignore
      }
    },
    configurable: true
  });
} catch (e) {
  console.warn("Failed to attach customized auth.currentUser proxy:", e);
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

