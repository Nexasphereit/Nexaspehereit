import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Rocket, ShieldAlert, ArrowLeft, Orbit, Compass, Sparkles } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';
import { useTheme } from '../../context/ThemeContext';

export default function NexasphereNotFound() {
  const navigate = useNavigate();
  const { settings } = useTheme();
  const primaryColor = settings?.primaryColor || '#f43f5e';

  useSEO({
    title: '404 - Coordinate Lost in Code Orbit | NexaSphere IT',
    description: 'This page is lost in deep space orbit. Re-routing your connection back to the NexaSphere IT homepage to safely resume exploration of our elite marketing services.',
    keywords: '404 page, route not found, lost in space, NexaSphere IT, digital marketing Dhaka sitemap',
    canonical: 'https://nexasphere.it/404',
    ogTitle: '404 - Coordinate Lost in Space | NexaSphere IT',
    ogDescription: 'Uh oh! We were unable to resolve this destination. Warp back to safety with the NexaSphere telemetry portal.',
    lang: 'en'
  });

  return (
    <div className="min-h-[85vh] relative flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Dynamic Ambient Background Cosmic Gradients */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full filter blur-[120px] opacity-15 animate-pulse pointer-events-none" style={{ backgroundColor: primaryColor }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-[150px] opacity-20 pointer-events-none" />

      {/* Futuristic Cyber Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />

      {/* Main Content Layout Container */}
      <div className="max-w-2xl w-full z-10 space-y-10 relative">
        
        {/* Animated Main Tech Visual Indicator */}
        <div className="relative flex items-center justify-center mx-auto w-32 h-32">
          {/* Pulsing Outer Halo */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.4, 0.15] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="absolute inset-[-12px] rounded-full filter blur-md"
            style={{ backgroundColor: `${primaryColor}1a` }}
          />

          {/* Orbit Line Spinner */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="absolute inset-0 border border-dashed rounded-full border-slate-700/60 flex items-center justify-center"
          >
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute top-0 -mt-2 w-4 h-4 rounded-full bg-indigo-400 flex items-center justify-center shadow-[0_0_10px_#818cf8]"
            >
              <Orbit size={9} className="text-white animate-spin" />
            </motion.div>
          </motion.div>

          {/* Inner Mirror Teleport Disk */}
          <motion.div 
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-20 h-20 rounded-3xl flex items-center justify-center border bg-[#050510]/80 backdrop-blur-md relative"
            style={{ borderColor: `${primaryColor}33`, boxShadow: `0 0 30px ${primaryColor}15` }}
          >
            <ShieldAlert size={36} style={{ color: primaryColor }} className="animate-pulse" />
            <Sparkles size={14} className="text-indigo-400 absolute top-2 right-2 animate-bounce" />
          </motion.div>
        </div>

        {/* 404 Large Display Typography */}
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center justify-center gap-1.5"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] px-3.5 py-1.5 rounded-full border border-rose-500/10 bg-rose-500/5 text-rose-400 font-bold">
              COORDINATE CRITICAL ERROR
            </span>
          </motion.div>

          <h1 className="text-7xl sm:text-9xl font-black italic tracking-tighter leading-none select-none text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-600">
            404
          </h1>

          <h2 className="text-2xl sm:text-4xl font-sans font-black uppercase tracking-tight italic text-white max-w-lg mx-auto">
            OUT OF ORBIT: PAGE LOST IN DEEP CODE SPACE
          </h2>

          <p className="text-slate-400 font-semibold italic text-xs max-w-md mx-auto leading-relaxed">
            The spatial coordinates you entered don't exist inside our central ecosystem blueprint records. Let's calibrate a telemetry re-routing system immediately.
          </p>
        </div>

        {/* Dynamic Teleport Button linking back to Hompage */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.04, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white flex items-center gap-2.5 shadow-lg group relative overflow-hidden"
            style={{ 
              backgroundColor: primaryColor,
              boxShadow: `0 4px 20px ${primaryColor}40`
            }}
          >
            {/* Glossy hover element */}
            <div className="absolute inset-x-0 top-0 h-[40%] bg-white/15 skew-y-12 transition-all group-hover:skew-y-6" />
            
            <Rocket size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 text-white animate-pulse" />
            RETURN TO HOME BASE
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="px-7 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border border-white/10 text-slate-300 flex items-center gap-2 transition-colors duration-300"
          >
            <ArrowLeft size={14} />
            BACK ONE CELL
          </motion.button>
        </div>

        {/* Security telemetry feedback log footer */}
        <div className="pt-8 border-t border-white/[0.03] max-w-xs mx-auto">
          <div className="flex items-center justify-center gap-2 text-[8px] font-mono text-slate-500 font-bold uppercase tracking-widest">
            <Compass size={11} className="text-slate-600 animate-spin" />
            <span>NEXASPHERE SECURE COMPLIANCE RE-ROUTE: ACTIVE</span>
          </div>
        </div>

      </div>
    </div>
  );
}
