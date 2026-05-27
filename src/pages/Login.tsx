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

export default function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [userIdInput, setUserIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loading, setLoading] = useState(false);

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
            const foundDoc = qEmailSnap.docs[0];
            
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

        // Trigger Standard Firebase Auth in the background (Anonymous session) to enable Firestore rules
        try {
          await signInAnonymously(auth);
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
          <div className="w-24 h-24 bg-gradient-to-br from-rose-600 to-red-800 rounded-[2.5rem] mx-auto flex items-center justify-center rotate-6 shadow-2xl shadow-rose-900/40 border border-rose-500/30">
            <ShieldAlert size={48} className="text-white" />
          </div>
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
                console.warn("Iframe popup sign-in blocked or failed, falling back to manual email prompt...", popupErr);
              } finally {
                setLoading(false);
              }

              // Fallback for sandboxed preview iframe structures 
              const testGmail = prompt("Enter any Gmail address to log in directly as Admin (Iframe Bypass):", "gwhasu@gmail.com");
              if (testGmail && testGmail.trim()) {
                const cleanGmail = testGmail.trim().toLowerCase();
                if (!cleanGmail.endsWith('.com')) {
                  toast.error("Please enter a valid email address (e.g., yourname@gmail.com)");
                  return;
                }
                setUserIdInput(cleanGmail);
                setPasswordInput("adminBypassPasskey");
                toast.success("Authenticating Gmail as Administrator...");
                // Trigger submit handler by updating inputs and then submitting
                setLoading(true);
                setTimeout(async () => {
                  try {
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
                    toast.success("Welcome back, " + displayName + " (Admin)!");
                    onLogin(matchedUser);
                    setTimeout(() => {
                      window.location.href = '/it-sales';
                    }, 300);
                  } catch (err) {
                    toast.error("An error occurred during quick bypass.");
                    setLoading(false);
                  }
                }, 400);
              }
            }}
            className="w-full bg-slate-900 hover:bg-slate-800 border-none text-slate-100 py-3.5 text-xs uppercase font-black tracking-widest flex items-center justify-center gap-2" 
            variant="outline" 
            size="lg" 
            type="button"
          >
            <span className="text-sm">🔴</span> Sign in as Admin with Google / Gmail
          </Button>

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
