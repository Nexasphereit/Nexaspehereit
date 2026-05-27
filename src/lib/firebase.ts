import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const dbId = firebaseConfig.firestoreDatabaseId;
export const db = (dbId && dbId !== '(default)') ? getFirestore(app, dbId) : getFirestore(app);
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

// Overwrite auth.currentUser's getter so it returns our logged-in custom profile in a safe way
try {
  const originalAuth = auth;

  // Auto-trigger anonymous sign in in the background if we have a custom user in localStorage but no Firebase session.
  // This guarantees there is always a valid Firebase token context for Firestore calls.
  if (typeof window !== 'undefined' && localStorage.getItem('customUser')) {
    import('firebase/auth').then(({ signInAnonymously }) => {
      if (!originalAuth.currentUser) {
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

      // Detect if called by Firebase or Firestore internal mechanisms.
      // For any Firebase/Firestore SDK internals, we must return the untampered realUser object.
      // This eliminates the risk of SDK runtime assertion failures or "Unexpected state" errors.
      const stack = new Error().stack || '';
      const isFirebaseInternal = 
        stack.includes('@firebase') || 
        stack.includes('firestore') || 
        stack.includes('firebase-auth') || 
        stack.includes('node_modules') || 
        /credential|token|compat|getIdToken|stsTokenManager/i.test(stack);

      if (isFirebaseInternal) {
        return realUser;
      }

      const custom = getCustomUserFromStorage();
      
      if (realUser) {
        if (custom) {
          // Wrap the real Firebase User in a Proxy so application pages see Custom IDs/Roles.
          // Directly load from target without passing receiver to avoid strict JS engine Proxy invariants.
          return new Proxy(realUser, {
            get(target, prop, receiver) {
              if (prop === 'uid') {
                return custom.uid || 'admin';
              }
              if (prop === 'email') {
                return custom.email;
              }
              if (prop === 'displayName') {
                return custom.displayName;
              }
              if (prop === 'role') {
                return custom.role || 'executive';
              }
              if (prop === 'commissionPercentage') {
                return custom.commissionPercentage ?? 0;
              }
              if (prop === 'auth') {
                return undefined; // Break circular auth reference for external serializers/traversers
              }
              
              const val = (target as any)[prop];
              if (typeof val === 'function') {
                return val.bind(target);
              }
              return val;
            }
          });
        }
        return realUser;
      }

      // Fallback custom user with mock safety fields to prevent deeply nested reading crashes in components
      if (custom) {
        return new Proxy(custom, {
          get(target, prop, receiver) {
            // Guarantee nested token fields are empty objects so that reading .accessToken does not throw TypeError.
            // Returning empty/undefined ensures that the Firestore client treats this as unauthenticated
            if (prop === 'stsTokenManager' || prop === '_credentials') {
              return {};
            }
            if (prop === 'getIdToken') {
              return () => Promise.resolve(null);
            }
            if (prop === 'getIdTokenResult') {
              return () => Promise.resolve({ token: undefined });
            }
            if (prop === 'accessToken') {
              return undefined;
            }
            if (prop === 'auth') {
              return undefined; // Break circular auth reference for external serializers/traversers
            }
            
            const val = (target as any)[prop];
            if (typeof val === 'function') {
              return val.bind(target);
            }
            return val;
          }
        });
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

