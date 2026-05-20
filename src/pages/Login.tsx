import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useState, useEffect } from 'react';
import { Button, Card } from '../components/common/UI';
import { LogIn, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { GalaxyBackground } from '../components/common/GalaxyBackground';

export default function Login({ onLogin }: { onLogin: (user: User) => void }) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      toast.success(`Welcome back, ${result.user.displayName}`);
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please try again.");
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
        
        <div className="text-center space-y-8 relative z-10 px-4 py-6">
          <div className="w-24 h-24 bg-gradient-to-br from-rose-600 to-red-800 rounded-[2.5rem] mx-auto flex items-center justify-center rotate-6 shadow-2xl shadow-rose-900/40 border border-rose-500/30">
            <ShieldAlert size={48} className="text-white" />
          </div>
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.3em]">Secure Gateway</span>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">NEXASPHERE <span className="text-rose-600">IT</span></h1>
            <p className="text-slate-500 mt-4 text-xs font-bold uppercase tracking-widest leading-relaxed">Administrator Authentication Required</p>
          </div>
          <Button 
            className="w-full bg-rose-600 hover:bg-rose-700 py-5 text-sm uppercase font-black tracking-widest shadow-2xl shadow-rose-900/20" 
            variant="primary" 
            size="lg" 
            onClick={handleLogin}
            isLoading={loading}
          >
            <LogIn size={20} className="mr-1" />
            Sign in with Google
          </Button>
          <div className="pt-6 border-t border-slate-900">
            <p className="text-[9px] text-slate-600 uppercase tracking-[0.25em] font-black">
              Authorized Personnel Only
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
