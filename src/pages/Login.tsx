import React, { useState, useEffect } from 'react';
import { 
  signInAnonymously,
  signInWithEmailAndPassword,
  User,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, setDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { Button, Card } from '../components/common/UI';
import { LogIn, ShieldAlert, KeyRound, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { GalaxyBackground } from '../components/common/GalaxyBackground';
import { useTheme } from '../context/ThemeContext';

export default function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const { settings } = useTheme();
  const [userIdInput, setUserIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [showGmailBypass, setShowGmailBypass] = useState(false);
  const [bypassEmail, setBypassEmail] = useState('');

  // Fetch all Firestore users for sandbox simulation
  useEffect(() => {
    const fetchDbUsers = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
        // Ensure there is at least 'admin'
        if (!list.some(u => u.id === 'admin')) {
          list.unshift({
            id: 'admin',
            name: 'Main Administrator',
            email: 'admin@nexasphere.it',
            role: 'admin',
            password: 'admin',
            commissionPercentage: 10
          });
        }
        setDbUsers(list);
      } catch (e) {
        console.warn("Could not fetch user list for sandbox fallback login:", e);
        setDbUsers([{
          id: 'admin',
          name: 'Main Administrator',
          email: 'admin@nexasphere.it',
          role: 'admin',
          password: 'admin',
          commissionPercentage: 10
        }]);
      }
    };
    fetchDbUsers();
  }, []);

  const handleQuickLogin = async (userObj: any) => {
    setLoading(true);
    try {
      setUserIdInput(userObj.id);
      setPasswordInput(userObj.password || 'admin');
      
      const matchedUser = {
        id: userObj.id,
        uid: userObj.id,
        name: userObj.name,
        email: userObj.email,
        role: userObj.role || 'executive',
        commissionPercentage: userObj.commissionPercentage || 10
      };

      localStorage.setItem('customUser', JSON.stringify(matchedUser));

      try {
        if (!auth.currentUser || auth.currentUser.isAnonymous) {
          await signInAnonymously(auth);
        }
      } catch (_) {}

      toast.success(`Sandbox Access Granted: Logged in as ${userObj.name}!`);
      onLogin(matchedUser);

      setTimeout(() => {
        window.location.href = '/it-sales';
      }, 300);
    } catch (err: any) {
      toast.error(err.message || "Failed to log in.");
    } finally {
      setLoading(false);
    }
  };

  // Automatically seed standard Administrator credentials on startup 
  useEffect(() => {
    const seedDefaultAdmin = async () => {
      try {
        const adminRef = doc(db, 'users', 'admin');
        const adminDoc = await getDoc(adminRef);
        if (!adminDoc.exists()) {
          await setDoc(adminRef, {
            id: 'admin',
            name: 'Main Administrator',
            email: 'admin@nexasphere.it',
            role: 'admin',
            password: 'admin',
            commissionPercentage: 10,
            createdAt: new Date().toISOString()
          });
        }
      } catch (e) {
        console.warn("Auto-seeding Firestore admin record deferred (offline fallback active):", e);
      }
    };
    seedDefaultAdmin();
  }, []);

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userIdInput.trim() || !passwordInput.trim()) {
      toast.error("Please fill in both User ID and password!");
      return;
    }

    setLoading(true);
    const normalizedInput = userIdInput.trim().toLowerCase();
    const cleanPassword = passwordInput.trim();

    try {
      let matchedUser: any = null;

      // 0. Gmail sign-in helper bypass for testing purposes to go directly to admin panel
      if (normalizedInput.endsWith('@gmail.com') || normalizedInput.includes('@gmail.com')) {
        const namePart = normalizedInput.split('@')[0];
        const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        matchedUser = {
          id: 'admin',
          uid: 'admin',
          name: `${displayName} (Testing Admin)`,
          email: normalizedInput,
          role: 'admin',
          commissionPercentage: 15
        };

        // Ensure user is seeded in database as admin
        try {
          await setDoc(doc(db, 'users', 'admin'), {
            id: 'admin',
            name: `${displayName} (Testing Admin)`,
            email: normalizedInput,
            role: 'admin',
            password: cleanPassword,
            commissionPercentage: 15,
            createdAt: new Date().toISOString()
          }, { merge: true });
        } catch (seedErr) {
          console.warn("Seeding Gmail admin failed:", seedErr);
        }
      } else if (normalizedInput === 'admin' && cleanPassword === 'admin') {
        matchedUser = {
          id: 'admin',
          uid: 'admin',
          name: 'Main Administrator',
          email: 'admin@nexasphere.it',
          role: 'admin',
          commissionPercentage: 10
        };

        // Ensure seeded in database
        try {
          await setDoc(doc(db, 'users', 'admin'), {
            id: 'admin',
            name: 'Main Administrator',
            email: 'admin@nexasphere.it',
            role: 'admin',
            password: 'admin',
            commissionPercentage: 10,
            createdAt: new Date().toISOString()
          }, { merge: true });
        } catch (seedErr) {
          console.warn("Seeding admin document deferred:", seedErr);
        }
      } else {
        // Try to fetch precise document ID from Firestore
        try {
          const userRef = doc(db, 'users', normalizedInput);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.password === cleanPassword) {
              matchedUser = { id: userDoc.id, ...data };
            } else {
              throw new Error("Incorrect password for this User ID!");
            }
          } else {
            // Check secondary check by email
            const qEmail = query(collection(db, 'users'), where('email', '==', normalizedInput));
            const qEmailSnap = await getDocs(qEmail);
            let foundDoc = qEmailSnap.docs[0];
            
            // Fallback: Case-insensitive scan of users collection in case the email is stored in a different case
            if (!foundDoc) {
              const allUsersSnap = await getDocs(collection(db, 'users'));
              foundDoc = allUsersSnap.docs.find(d => {
                const mail = d.data().email;
                return mail && typeof mail === 'string' && mail.toLowerCase() === normalizedInput;
              });
            }
            
            if (foundDoc) {
              const data = foundDoc.data();
              if (data.password === cleanPassword) {
                matchedUser = { id: foundDoc.id, ...data };
              } else {
                throw new Error("Incorrect password for this Email!");
              }
            }
          }
        } catch (dbError: any) {
          if (dbError.message && dbError.message.includes("Incorrect password")) {
            throw dbError;
          }
          console.warn("Firestore database checks skipped or failed:", dbError);
        }

        // Standard Firebase Auth (Email/Password) fallback if no user was matched in Firestore
        if (!matchedUser && normalizedInput.includes('@')) {
          try {
            const userCredential = await signInWithEmailAndPassword(auth, normalizedInput, cleanPassword);
            const fbUser = userCredential.user;
            if (fbUser) {
              let dbUser: any = null;
              try {
                const userRef = doc(db, 'users', fbUser.uid);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                  dbUser = userDoc.data();
                } else {
                  // Check secondary check by email
                  const qEmail = query(collection(db, 'users'), where('email', '==', fbUser.email));
                  const qEmailSnap = await getDocs(qEmail);
                  let foundDoc = qEmailSnap.docs[0];
                  if (!foundDoc) {
                    const allUsersSnap = await getDocs(collection(db, 'users'));
                    foundDoc = allUsersSnap.docs.find(d => {
                      const mail = d.data().email;
                      return mail && typeof mail === 'string' && mail.toLowerCase() === (fbUser.email?.toLowerCase() || '');
                    });
                  }
                  if (foundDoc) {
                    dbUser = foundDoc.data();
                  }
                }
              } catch (e) {
                console.warn("Could not retrieve user document for standard Firebase Auth user:", e);
              }

              matchedUser = {
                id: fbUser.uid,
                uid: fbUser.uid,
                name: dbUser?.name || fbUser.displayName || fbUser.email?.split('@')[0] || 'Authenticated User',
                email: fbUser.email,
                role: dbUser?.role || 'executive',
                commissionPercentage: dbUser?.commissionPercentage || 0,
                ...dbUser
              };
            }
          } catch (authErr: any) {
            console.warn("Standard Firebase Auth sign-in failed:", authErr);
            if (authErr && (authErr.code === 'auth/wrong-password' || authErr.code === 'auth/invalid-credential')) {
              throw new Error("Incorrect password for this secure email account!");
            } else if (authErr && authErr.code === 'auth/user-not-found') {
              throw new Error("No registered account found with this email!");
            }
          }
        }
      }

      if (matchedUser) {
        // We have a successful credentials match!
        localStorage.setItem('customUser', JSON.stringify({
          id: matchedUser.id,
          uid: matchedUser.id,
          name: matchedUser.name,
          email: matchedUser.email,
          role: matchedUser.role,
          commissionPercentage: matchedUser.commissionPercentage || 0
        }));

        // Trigger Standard Firebase Auth in the background (Anonymous session) to enable Firestore rules only if not already authenticated
        try {
          if (!auth.currentUser || auth.currentUser.isAnonymous) {
            await signInAnonymously(auth);
          }
        } catch (authError) {
          console.warn("Firebase Auth Anonymous Session skipped (operating in offline fallback):", authError);
        }

        toast.success(`Welcome back, ${matchedUser.name}!`);
        onLogin(matchedUser);
        
        // Refresh routing context safely and redirect directly to admin panel
        setTimeout(() => {
          window.location.href = '/it-sales';
        }, 300);
      } else {
        // Did not match any pre-configured User ID or password
        toast.error("Access Denied: Invalid User ID or password combination.");
      }
    } catch (error: any) {
      console.error("Authentication Process Error:", error);
      toast.error(error.message || "Credential validation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#02020a] p-4 relative overflow-hidden">
      <GalaxyBackground />
      <Card className="max-w-md w-full border-slate-900 bg-slate-950/50 backdrop-blur-3xl shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-600/10 rounded-full -mr-24 -mt-24 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-600/5 rounded-full -ml-16 -mb-16 blur-2xl" />
        
        <div className="text-center space-y-6 relative z-10 px-4 py-6">
          {settings.companyLogo ? (
            <div className="w-24 h-24 rounded-3xl mx-auto flex items-center justify-center shadow-2xl bg-white border border-slate-200 p-3 transition-transform hover:scale-105 duration-300">
              <img src={settings.companyLogo} alt="Company Logo" className="max-w-full max-h-full object-contain" />
            </div>
          ) : (
            <div className="w-24 h-24 bg-gradient-to-br from-rose-600 to-red-800 rounded-[2.5rem] mx-auto flex items-center justify-center rotate-6 shadow-2xl shadow-rose-900/40 border border-rose-500/30">
              <ShieldAlert size={48} className="text-white" />
            </div>
          )}
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em]">SECURE GATEWAY</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">NEXASPHERE <span className="text-rose-600">IT</span></h1>
            <p className="text-slate-500 mt-2 text-[10px] font-bold uppercase tracking-widest">Enterprise Role Authorization Required</p>
          </div>

          <form onSubmit={handleCustomLogin} className="space-y-4 text-left">
            <div className="space-y-1.5">
              <label className="text-[10px] pl-1 font-black uppercase tracking-[0.15em] text-slate-400">User ID / Email</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input 
                  type="text"
                  placeholder="e.g. admin or sarah@nexasphere.it"
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800/80 focus:border-rose-500 text-white rounded-2xl pl-11 pr-4 py-3.5 text-xs font-semibold outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] pl-1 font-black uppercase tracking-[0.15em] text-slate-400">Password</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input 
                  type="password"
                  placeholder="••••••••"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800/80 focus:border-rose-500 text-white rounded-2xl pl-11 pr-4 py-3.5 text-xs font-semibold outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <Button 
              className="w-full bg-rose-600 hover:bg-rose-700 py-3.5 text-xs uppercase font-black tracking-widest shadow-2xl shadow-rose-900/20 mt-2" 
              variant="primary" 
              size="lg" 
              type="submit"
              isLoading={loading}
            >
              <LogIn size={16} className="mr-1.5" />
              Sign in with Credentials
            </Button>
          </form>

          <div className="relative my-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-900/40"></div>
            </div>
            <span className="relative bg-[#02020a] px-3 text-[9px] font-black uppercase tracking-wider text-slate-500">OR TEST GMAIL ACCESS</span>
          </div>

          <Button 
            onClick={async () => {
              setLoading(true);
              try {
                const provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth, provider);
                const u = result.user;
                if (u && u.email) {
                  const namePart = u.email.split('@')[0];
                  const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
                  const matchedUser = {
                    id: 'admin',
                    uid: 'admin',
                    name: `${displayName} (Testing Admin)`,
                    email: u.email,
                    role: 'admin',
                    commissionPercentage: 15
                  };
                  localStorage.setItem('customUser', JSON.stringify(matchedUser));
                  try {
                    await setDoc(doc(db, 'users', 'admin'), {
                      id: 'admin',
                      name: `${displayName} (Testing Admin)`,
                      email: u.email,
                      role: 'admin',
                      password: 'adminBypassPasskey',
                      commissionPercentage: 15,
                      createdAt: new Date().toISOString()
                    }, { merge: true });
                  } catch (e) {
                    console.warn("Saving Google admin info failed:", e);
                  }
                  toast.success(`Welcome back, ${displayName} (Admin)!`);
                  onLogin(matchedUser);
                  setTimeout(() => {
                    window.location.href = '/it-sales';
                  }, 300);
                  return;
                }
              } catch (popupErr: any) {
                console.warn("Iframe popup sign-in blocked or failed, falling back to inline email bypass...", popupErr);
              } finally {
                setLoading(false);
              }

              // Fallback for sandboxed preview iframe structures: trigger beautifully simulated inline form
              setShowGmailBypass(true);
              toast.success("Standard Google login redirected. Enter your testing email below!");
            }}
            className="w-full bg-slate-900 hover:bg-slate-800 border-none text-slate-100 py-3.5 text-xs uppercase font-black tracking-widest flex items-center justify-center gap-2" 
            variant="outline" 
            size="lg" 
            type="button"
          >
            <span className="text-sm">🔴</span> Sign in as Admin with Google / Gmail
          </Button>

          {/* ELEGANT INLINE GMAIL BYPASS INPUT FORM */}
          {showGmailBypass && (
            <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 text-left space-y-3 mt-4">
              <p className="text-[10px] uppercase font-black tracking-widest text-rose-500">Iframe Sandboxed Google Bypass</p>
              <p className="text-[9px] text-slate-400 font-semibold leading-relaxed">
                Your browser blocked the Google authorization popup due to cross-domain container sandboxing. Please enter any Gmail or company email address below to log in directly:
              </p>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input 
                  type="email"
                  placeholder="e.g. gwhasu@gmail.com"
                  value={bypassEmail}
                  onChange={(e) => setBypassEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-rose-500 text-white rounded-xl pl-11 pr-4 py-3 text-xs font-semibold outline-none transition-all placeholder:text-slate-600"
                />
              </div>
              <Button 
                onClick={async () => {
                  if (!bypassEmail.trim() || !bypassEmail.includes('@')) {
                    toast.error("Please enter a valid Gmail address or corporate account!");
                    return;
                  }
                  setLoading(true);
                  const cleanGmail = bypassEmail.trim().toLowerCase();
                  const namePart = cleanGmail.split('@')[0];
                  const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
                  const matchedUser = {
                    id: 'admin',
                    uid: 'admin',
                    name: `${displayName} (Testing Admin)`,
                    email: cleanGmail,
                    role: 'admin',
                    commissionPercentage: 15
                  };
                  localStorage.setItem('customUser', JSON.stringify(matchedUser));
                  try {
                    await signInAnonymously(auth);
                    await setDoc(doc(db, 'users', 'admin'), {
                      id: 'admin',
                      name: `${displayName} (Testing Admin)`,
                      email: cleanGmail,
                      role: 'admin',
                      password: 'adminBypassPasskey',
                      commissionPercentage: 15,
                      createdAt: new Date().toISOString()
                    }, { merge: true });
                  } catch (_) {}
                  toast.success(`Sandbox Authorized! Welcome ${displayName} (Admin).`);
                  onLogin(matchedUser);
                  setTimeout(() => {
                    window.location.href = '/it-sales';
                  }, 300);
                }}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white text-[10px] py-2.5 font-black tracking-widest uppercase rounded-xl"
                type="button"
              >
                Validate and Authorize Client
              </Button>
            </div>
          )}

          {/* DYNAMIC LIST OF AUTHORIZED SANDBOX STAFF PROFILES */}
          {dbUsers.length > 0 && (
            <div className="pt-6 border-t border-slate-900/60 text-left space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">Authorized Staff Credentials</span>
                <span className="text-[8px] bg-slate-900 border border-slate-800 text-rose-500 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">SANDBOX TRACE</span>
              </div>
              <p className="text-[9px] text-slate-500 font-semibold leading-relaxed">
                Tap any pre-configured employee or administrative profile below to bypass and authenticate instantly, or type username/password above (e.g. admin):
              </p>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto pr-1">
                {dbUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u)}
                    className="flex flex-col items-start p-2.5 bg-slate-900/30 border border-slate-900/80 hover:border-rose-500/35 hover:bg-rose-500/5 rounded-xl transition-all text-left group"
                  >
                    <span className="text-xs font-bold text-slate-300 group-hover:text-rose-400 transition-colors truncate w-full">{u.name}</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[8px] px-1.5 py-0.5 rounded-md bg-rose-500/10 text-rose-400 font-extrabold uppercase tracking-widest font-mono">
                        {u.role || 'executive'}
                      </span>
                      <span className="text-[8px] text-slate-600 font-semibold truncate uppercase max-w-[80px]">
                        ID: {u.id}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-900 text-center">
            <p className="text-[8px] text-slate-600 uppercase tracking-[0.25em] font-black">
              Authorized Personnel Only • Seed Admin: admin / admin
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
