import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
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
import { auth, db } from './lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Login from './pages/Login';
import { GalaxyBackground } from './components/common/GalaxyBackground';
import { Sparkles, Phone, Mail, MapPin } from 'lucide-react';
import MessengerWidget from './components/common/MessengerWidget';

// Nexora Digital agency pages
import NexoraHeader from './components/nexora/NexoraHeader';
import NexoraFooter from './components/nexora/NexoraFooter';
import NexoraHome from './pages/nexora/NexoraHome';
import NexoraAbout from './pages/nexora/NexoraAbout';
import NexoraServices from './pages/nexora/NexoraServices';
import NexoraPortfolio from './pages/nexora/NexoraPortfolio';
import NexoraCaseStudies from './pages/nexora/NexoraCaseStudies';
import NexoraPricing from './pages/nexora/NexoraPricing';
import NexoraBlog from './pages/nexora/NexoraBlog';
import NexoraContact from './pages/nexora/NexoraContact';
import NexoraAdmin from './pages/nexora/NexoraAdmin';
import NexoraPortal from './pages/nexora/NexoraPortal';
import NexoraTerms from './pages/nexora/NexoraTerms';
import NexoraPrivacy from './pages/nexora/NexoraPrivacy';
import NexoraSitemap from './pages/nexora/NexoraSitemap';
import ConsultationModal from './components/nexora/ConsultationModal';

function AppContent() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { settings, redirection, resetRedirection } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // Compute Route Divisions early to prevent loading screens on public pages
  const publicPaths = ['/about', '/services', '/portfolio', '/case-studies', '/pricing', '/blog', '/contact', '/terms', '/privacy', '/sitemap', '/portal'];
  const isPublicRoute = publicPaths.includes(location.pathname) || location.pathname === '/';
  
  const privatePaths = ['/dashboard', '/it-sales', '/quotations', '/cvs', '/receipts', '/history', '/settings', '/admin'];
  const isPrivateRoute = privatePaths.some(p => location.pathname === p || location.pathname.startsWith(p));
  const isLoginPath = location.pathname === '/login';

  const [navProgress, setNavProgress] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  // Trigger browser-native redirection after the epic portal animation
  useEffect(() => {
    if (redirection.active) {
      const timer = setTimeout(() => {
        if (redirection.type === 'call') {
          window.location.href = `tel:${redirection.target.replace(/\s+/g, '')}`;
        } else if (redirection.type === 'mail') {
          window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(redirection.target)}`, '_blank', 'noopener,noreferrer');
        } else if (redirection.type === 'map') {
          window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(redirection.target)}`, '_blank', 'noopener,noreferrer');
        }
        resetRedirection();
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [redirection.active, redirection.type, redirection.target]);

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

  if (loading && (isPrivateRoute || isLoginPath)) {
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

  const isDark = settings.sidebarTheme === 'dark';

  const renderGlobalOverlays = () => (
    <>
      {/* Global Interactive Redirection Portal Overlay */}
      <AnimatePresence>
        {redirection.active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#010107]/95 backdrop-blur-xl z-[100] flex flex-col items-center justify-center p-6 text-center text-white"
          >
            {/* Background cyber grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

            <div className="max-w-md w-full relative space-y-8 z-10 flex flex-col items-center">
              {/* Central high-tech ring animation */}
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* Outermost pulsing halo */}
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.4, 0.1] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  className="absolute inset-[-10px] rounded-full filter blur-md"
                  style={{ backgroundColor: `${settings.primaryColor || '#f43f5e'}22` }}
                />

                {/* Main animated scanner ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute inset-0 border-2 border-dashed rounded-full"
                  style={{ borderColor: settings.primaryColor || '#f43f5e' }}
                />

                {/* Inner counter-rotating indicator */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  className="absolute inset-3 border border-dotted rounded-full opacity-60"
                  style={{ borderColor: settings.primaryColor || '#f43f5e' }}
                />

                {/* Icon mapping */}
                <div 
                  className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg"
                  style={{ 
                    backgroundColor: `${settings.primaryColor || '#f43f5e'}1a`,
                    color: settings.primaryColor || '#f43f5e',
                    border: `1px solid ${settings.primaryColor || '#f43f5e'}33`
                  }}
                >
                  {redirection.type === 'call' && <Phone size={30} className="animate-bounce" />}
                  {redirection.type === 'mail' && <Mail size={30} className="animate-pulse" />}
                  {redirection.type === 'map' && <MapPin size={30} className="animate-bounce" />}
                </div>
              </div>

              {/* Status information panel */}
              <div className="space-y-2">
                <span 
                  className="text-[9px] font-mono font-black uppercase tracking-[0.3em] px-3.5 py-1 rounded-full border"
                  style={{ 
                    color: settings.primaryColor || '#f43f5e',
                    backgroundColor: `${settings.primaryColor || '#f43f5e'}0d`,
                    borderColor: `${settings.primaryColor || '#f43f5e'}33`
                  }}
                >
                  {redirection.type === 'call' && 'CONNECTING TELEPHONY PROTOCOL'}
                  {redirection.type === 'mail' && 'ESTABLISHING COMPOSER INTERFACE'}
                  {redirection.type === 'map' && 'RESOLVING SPATIAL COORDINATES'}
                </span>

                <h3 className="text-xl font-sans font-black uppercase tracking-tight italic pt-2">
                  {redirection.type === 'call' && `ROUTING TO TELEPHONE CONTROLLER`}
                  {redirection.type === 'mail' && `OPENING SEAMLESS GMAIL COMPOSER`}
                  {redirection.type === 'map' && `PINPOINTING MAP LOCATION`}
                </h3>

                <p className="text-[11px] font-semibold text-slate-400 font-mono italic max-w-sm">
                  {redirection.type === 'call' && `Forwarding analog dialer handoff sequence to: ${redirection.target}...`}
                  {redirection.type === 'mail' && `Pre-loading email message container for: ${redirection.target}...`}
                  {redirection.type === 'map' && `Calibrating global coordinate vectors for: ${redirection.target}...`}
                </p>
              </div>

              {/* Glowing animated progress line */}
              <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden border border-white/[0.03]">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="h-full rounded-full"
                  style={{ 
                    backgroundColor: settings.primaryColor || '#f43f5e',
                    boxShadow: `0 0 12px ${settings.primaryColor || '#f43f5e'}`
                  }}
                />
              </div>

              {/* Secure status code */}
              <span className="text-[8px] font-mono font-black tracking-widest text-slate-500 uppercase flex items-center gap-1.5 justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                SECURE HANDOFF RE-ROUTE STATUS: ONLINE
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Page Transition Loader */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#02020a]/90 backdrop-blur-md z-[90] flex flex-col items-center justify-center pointer-events-none text-white text-center"
          >
            {/* Spinning halos with current primary brand color */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="absolute inset-0 border-t-2 border-r-2 border-transparent rounded-full shadow-lg"
                style={{ borderTopColor: settings.primaryColor }}
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
                className="absolute inset-2 border-b-2 border-l-2 border-transparent rounded-full opacity-40 shadow-inner"
                style={{ borderBottomColor: settings.primaryColor }}
              />
              <Sparkles style={{ color: settings.primaryColor }} size={24} className="animate-pulse" />
            </div>
            
            <motion.div 
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="mt-6 space-y-1"
            >
              <h2 className="text-sm font-black uppercase tracking-[0.25em]" style={{ color: settings.primaryColor }}>
                {settings.companyName || 'NexaSphere'}
              </h2>
              <div className="text-[9px] font-mono tracking-widest text-slate-500 uppercase">
                Synchronizing secure core layout...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  // Check login routes
  if (isLoginPath || (isPrivateRoute && !user)) {
    return (
      <div className="min-h-screen bg-[#02020a] text-white flex flex-col justify-between">
        <NexoraHeader />
        <div className="flex-1 pt-16 flex items-center justify-center">
          <div className="w-full max-w-md relative z-10 p-6">
            <Login onLogin={(u) => {
              setUser(u);
            }} />
          </div>
        </div>
        <NexoraFooter />
        <MessengerWidget />
        <Toaster position="bottom-right" />
        <ConsultationModal />
        {renderGlobalOverlays()}
      </div>
    );
  }

  // PUBLIC AGENCY WEBSITE WRAPPER (Nexora Digital)
  if (isPublicRoute || (!isPrivateRoute && !isLoginPath)) {
    return (
      <div className={cn("min-h-screen flex flex-col justify-between transition-colors duration-300 relative overflow-hidden bg-[#02020a] text-white font-sans")}>
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
        <NexoraHeader />
        
        <main className="flex-1 relative z-10 w-full pt-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15, filter: 'blur(3px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(3px)' }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              <Routes>
                <Route path="/" element={<NexoraHome />} />
                <Route path="/about" element={<NexoraAbout />} />
                <Route path="/services" element={<NexoraServices />} />
                <Route path="/portfolio" element={<NexoraPortfolio />} />
                <Route path="/case-studies" element={<NexoraCaseStudies />} />
                <Route path="/pricing" element={<NexoraPricing />} />
                <Route path="/blog" element={<NexoraBlog />} />
                <Route path="/portal" element={<NexoraPortal />} />
                <Route path="/contact" element={<NexoraContact />} />
                <Route path="/admin" element={<NexoraAdmin />} />
                <Route path="/terms" element={<NexoraTerms />} />
                <Route path="/privacy" element={<NexoraPrivacy />} />
                <Route path="/sitemap" element={<NexoraSitemap />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
        
        <NexoraFooter />
        <MessengerWidget />
        <Toaster position="bottom-right" />
        <ConsultationModal />
        {renderGlobalOverlays()}
      </div>
    );
  }

  // PRIVATE WORKSPACE DESKTOP LAYOUT (NexaSphere)
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
      <main className={cn("flex-1 md:ml-[280px] pt-14 pb-24 px-4 md:p-8 transition-all relative z-10", isDark ? 'bg-transparent' : 'bg-slate-50')}>
        {/* Animated Page Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15, filter: 'blur(3px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -12, filter: 'blur(3px)' }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/it-sales" element={user ? <ITSalesDashboard /> : <Navigate to="/dashboard" replace />} />
              <Route path="/quotations/:id?" element={<QuotationGenerator />} />
              <Route path="/cvs/:id?" element={<CVGenerator />} />
              <Route path="/receipts/:id?" element={<ReceiptGenerator />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={(user?.role === 'admin') ? <Settings /> : <Navigate to="/dashboard" replace />} />
              <Route path="/admin" element={(user?.role === 'admin') ? <NexoraAdmin /> : <Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Toaster position="bottom-right" />
      <ConsultationModal />
      {renderGlobalOverlays()}
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
