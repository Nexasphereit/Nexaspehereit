import React, { useState, useEffect } from 'react';
import { 
  signInAnonymously,
  signInWithEmailAndPassword,
  User,
  signOut
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

      // 1. Memory fallback for first-time use or local offline sandbox
      if (normalizedInput === 'admin' && cleanPassword === 'admin') {
        matchedUser = {
          id: 'admin',
          uid: 'admin',
          name: 'Main Administrator',
          email: 'admin@nexasphere.it',
          role: 'admin',
          commissionPercentage: 10
        };
      } else {
        // Query database users collection
        const qId = query(collection(db, 'users'), where('id', '==', normalizedInput));
        const qSnap = await getDocs(qId);
        
        let foundDoc = qSnap.docs.find(d => d.data().password === cleanPassword);
        
        // If not found by custom ID, try searching by email string
        if (!foundDoc) {
          const qEmail = query(collection(db, 'users'), where('email', '==', normalizedInput));
          const qEmailSnap = await getDocs(qEmail);
          foundDoc = qEmailSnap.docs.find(d => d.data().password === cleanPassword);
        }

        if (foundDoc) {
          matchedUser = { id: foundDoc.id, ...foundDoc.data() };
        }
      }

      if (matchedUser) {
        // We have a successful credentials match!
        // Sync custom user in browser memory
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
        
        // Refresh routing context safely
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } else {
        // Try Logging in via standard Firebase Auth Email & Password (for direct Firebase administrators)
        try {
          const userCredential = await signInWithEmailAndPassword(auth, userIdInput, passwordInput);
          const user = userCredential.user;
          
          // Look up or default their metadata
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const dbData = userDoc.exists() ? userDoc.data() : {};
          
          const firebaseProfile = {
            id: user.uid,
            uid: user.uid,
            name: dbData.name || user.displayName || 'Head Office User',
            email: user.email || 'office@nexasphere.it',
            role: dbData.role || 'admin',
            commissionPercentage: dbData.commissionPercentage || 10
          };

          localStorage.setItem('customUser', JSON.stringify(firebaseProfile));
          toast.success(`Welcome back, ${firebaseProfile.name}!`);
          onLogin(firebaseProfile);
          setTimeout(() => {
            window.location.reload();
          }, 300);
        } catch (fbAuthError) {
          toast.error("Invalid credentials. Please double-check your custom User ID and password!");
        }
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
