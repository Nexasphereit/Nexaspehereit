/// <reference types="vite/client" />
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, setLogLevel } from 'firebase/firestore';
import defaultFirebaseConfig from '../../firebase-applet-config.json';

// Support loading Firebase configurations dynamically from client env keys (VITE_ prefixed) or fall back to default JSON file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultFirebaseConfig.apiKey || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultFirebaseConfig.authDomain || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultFirebaseConfig.projectId || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultFirebaseConfig.storageBucket || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultFirebaseConfig.messagingSenderId || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultFirebaseConfig.appId || "",
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || defaultFirebaseConfig.firestoreDatabaseId || "",
};

const app = initializeApp(firebaseConfig);
setLogLevel('error');
const dbId = firebaseConfig.firestoreDatabaseId;
export const db = (dbId && dbId !== '(default)' && dbId !== "") ? getFirestore(app, dbId) : getFirestore(app);
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
        isDemoUser: true,

        // Custom mocks to fully satisfy Firebase Auth SDK internals & avoid _stopProactiveRefresh crashes
        _stopProactiveRefresh: () => {},
        _startProactiveRefresh: () => {},
        getIdToken: () => Promise.resolve(''),
        getIdTokenResult: () => Promise.resolve({
          token: '',
          authTime: '',
          expirationTime: '',
          signInProvider: '',
          claims: {}
        }),
        reload: () => Promise.resolve(),
        toJSON: () => ({}),
        delete: () => Promise.resolve(),
        phoneNumber: null,
        photoURL: null,
        providerId: 'firebase',
        tenantId: null,
        metadata: {
          creationTime: new Date().toISOString(),
          lastSignInTime: new Date().toISOString()
        }
      };
    } catch {
      return null;
    }
  }
  return null;
};

// Safe helper to grab the raw untampered currentUser from the SDK
export function getRealCurrentUser(): any {
  try {
    const proto = Object.getPrototypeOf(auth);
    const desc = Object.getOwnPropertyDescriptor(proto, 'currentUser');
    return (desc && desc.get) ? desc.get.call(auth) : null;
  } catch {
    return null;
  }
}

// Overwrite auth.currentUser's getter so it returns our logged-in custom profile in a safe way
try {
  const originalAuth = auth;

  // Auto-trigger anonymous sign in in the background if we have a custom user in localStorage but no Firebase session.
  // This guarantees there is always a valid Firebase token context for Firestore calls.
  if (typeof window !== 'undefined' && localStorage.getItem('customUser')) {
    import('firebase/auth').then(({ signInAnonymously }) => {
      if (!getRealCurrentUser()) {
        signInAnonymously(originalAuth).catch(err => {
          console.warn("Auto anonymous sign-in failed:", err);
        });
      }
    });
  }

  Object.defineProperty(originalAuth, 'currentUser', {
    get: () => {
      let realUser: any = null;
      try {
        const proto = Object.getPrototypeOf(originalAuth);
        const desc = Object.getOwnPropertyDescriptor(proto, 'currentUser');
        if (desc && desc.get) {
          realUser = desc.get.call(originalAuth);
        }
      } catch {
        realUser = null;
      }

      if (!realUser) {
        return null;
      }

      const custom = getCustomUserFromStorage();
      if (!custom) {
        return realUser;
      }

      // App properties that our pages might read. Everything else is passed to the real Firebase User instances, ensuring zero-dependency on stack trace sniffing.
      const appProperties = ['uid', 'id', 'email', 'displayName', 'name', 'role', 'commissionPercentage'];

      return new Proxy(realUser, {
        get(target, prop, receiver) {
          const propStr = typeof prop === 'string' ? prop : String(prop);
          const isAppProp = appProperties.includes(propStr);

          if (isAppProp) {
            const cAny = custom as any;
            if (propStr === 'uid' || propStr === 'id') {
              return cAny.uid || 'admin';
            }
            if (propStr === 'email') {
              return cAny.email;
            }
            if (propStr === 'displayName' || propStr === 'name') {
              return cAny.name || cAny.displayName || 'Sales Executive';
            }
            if (propStr === 'role') {
              return cAny.role || 'executive';
            }
            if (propStr === 'commissionPercentage') {
              return cAny.commissionPercentage ?? 0;
            }
          }

          if (propStr === 'auth') {
            return undefined; // Break circular references
          }

          // Fallback to real Firebase User SDK internals securely
          const val = (realUser as any)[prop];
          if (typeof val === 'function') {
            return val.bind(realUser);
          }
          return val;
        }
      });
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

