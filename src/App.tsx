import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/common/Sidebar';
import Dashboard from './pages/Dashboard';
import QuotationGenerator from './pages/QuotationGenerator';
import CVGenerator from './pages/CVGenerator';
import ReceiptGenerator from './pages/ReceiptGenerator';
import History from './pages/History';
import Settings from './pages/Settings';
import ITSalesDashboard from './pages/ITSalesDashboard';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { cn } from './lib/utils';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import Login from './pages/Login';
import { GalaxyBackground } from './components/common/GalaxyBackground';
import { Sparkles } from 'lucide-react';

function AppContent() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useTheme();
  const location = useLocation();

  const [navProgress, setNavProgress] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  // Cinematic top loading bar triggered on page navigation
  useEffect(() => {
    setIsNavigating(true);
    setNavProgress(15);
    
    const t1 = setTimeout(() => setNavProgress(40), 100);
    const t2 = setTimeout(() => setNavProgress(75), 250);
    const t3 = setTimeout(() => setNavProgress(100), 500);
    const t4 = setTimeout(() => {
      setIsNavigating(false);
      setNavProgress(0);
    }, 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [location.pathname]);

  useEffect(() => {
    // Check local storage for persistent custom logged-in user profiles
    const savedCustomUser = localStorage.getItem('customUser');
    if (savedCustomUser) {
      try {
        const parsed = JSON.parse(savedCustomUser);
        setUser(parsed);
        setLoading(false);
        return;
      } catch (e) {
        console.error("Local storage custom user parse error:", e);
      }
    }

    return onAuthStateChanged(auth, (u) => {
      if (u && u.email && (u.email.endsWith('@gmail.com') || u.email.includes('@gmail.com'))) {
        const namePart = u.email.split('@')[0];
        const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        const gmailCustomAdmin = {
          id: 'admin',
          uid: 'admin',
          name: `${displayName} (Testing Admin)`,
          email: u.email,
          role: 'admin',
          commissionPercentage: 15
        };
        localStorage.setItem('customUser', JSON.stringify(gmailCustomAdmin));
        setUser(gmailCustomAdmin);
      } else {
        setUser(u);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050510] relative overflow-hidden">
        {/* Abstract design nodes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full filter blur-3xl animate-pulse delay-1000" />
        
        {/* Custom premium loader visual */}
        <div className="relative flex flex-col items-center gap-8 z-10">
          <div className="relative flex items-center justify-center w-24 h-24">
            {/* Outer custom spinning track */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
              className="absolute inset-0 border-t-2 border-r-2 border-b border-l border-white/10 rounded-full"
              style={{ borderTopColor: settings.primaryColor || '#f43f5e' }}
            />
            {/* Inner dynamic reverse spinning ring */}
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              className="absolute inset-2 border-t border-b border-white/5 rounded-full"
              style={{ borderTopColor: settings.primaryColor || '#f43f5e', opacity: 0.6 }}
            />
            
            {/* Soft pulse glow central node */}
            <motion.div 
              animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.4, 0.9, 0.4] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ 
                backgroundColor: `${settings.primaryColor || '#f43f5e'}1a`,
                color: settings.primaryColor || '#f43f5e',
                boxShadow: `0 0 30px ${settings.primaryColor || '#f43f5e'}33`
              }}
            >
              <Sparkles size={20} className="animate-pulse" />
            </motion.div>
          </div>

          {/* Aesthetic loaded tags */}
          <div className="text-center space-y-1">
            <h2 className="text-md font-black tracking-[0.2em] text-white uppercase italic">
              NEXASPHERE <span style={{ color: settings.primaryColor }}>STUDIO</span>
            </h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest animate-pulse">
              Authenticating cloud credentials...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  const isDark = settings.sidebarTheme === 'dark';

  return (
    <div className={cn("flex min-h-screen transition-colors duration-300 relative overflow-hidden", ['font-sans', 'font-serif', 'font-mono'].includes(settings.fontFamily) ? settings.fontFamily : 'font-sans', isDark ? 'bg-[#02020a] text-white' : 'bg-slate-50 text-slate-900')}>
      {/* Top Loading Progress Bar */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ opacity: 1, width: '0%' }}
            animate={{ width: `${navProgress}%` }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            className="fixed top-0 left-0 h-[3px] z-50 pointer-events-none"
            style={{
              backgroundColor: settings.primaryColor || '#f43f5e',
              boxShadow: `0 2px 12px ${settings.primaryColor || '#f43f5e'}dd`
            }}
          />
        )}
      </AnimatePresence>

      {isDark && <GalaxyBackground />}
      <Sidebar />
      <main className={cn("flex-1 md:ml-[280px] pt-20 pb-24 px-4 md:p-8 transition-all relative z-10", isDark ? 'bg-transparent' : 'bg-slate-50')}>
        {/* Animated Page Transitions using key and location updates */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15, filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(3px)' }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            <Routes location={location}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/it-sales" element={<ITSalesDashboard />} />
              <Route path="/quotations/:id?" element={<QuotationGenerator />} />
              <Route path="/cvs/:id?" element={<CVGenerator />} />
              <Route path="/receipts/:id?" element={<ReceiptGenerator />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}
