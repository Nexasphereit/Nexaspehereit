import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Rocket, ShieldAlert, ArrowLeft, Orbit, Compass, Terminal as TerminalIcon, ToggleLeft, ToggleRight, Play, Square } from 'lucide-react';
import { useSEO } from '../../hooks/useSEO';
import { useTheme } from '../../context/ThemeContext';

export default function NexasphereNotFound() {
  const navigate = useNavigate();
  const { settings } = useTheme();
  const primaryColor = settings?.primaryColor || '#f43f5e';
  const hasUser = typeof window !== 'undefined' ? !!localStorage.getItem('customUser') : false;

  // Teleport countdown logic
  const [countdown, setCountdown] = useState(12);
  const [isCountdownActive, setIsCountdownActive] = useState(true);

  // Live cyber log state
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'Initializing spatial re-route sequences...',
    'Analyzing telemetry vectors...',
  ]);

  useSEO({
    title: '404 - Space Coordinate Mismatch | NexaSphere IT',
    description: 'This page is lost in deep space orbit. Re-routing your connection back to the NexaSphere IT homepage to safely resume exploration of our elite marketing services.',
    keywords: '404 page, route not found, lost in space, NexaSphere IT, digital marketing Dhaka sitemap',
    canonical: 'https://nexasphere.it/404',
    ogTitle: '404 - Coordinate Lost in Space | NexaSphere IT',
    ogDescription: 'Uh oh! We were unable to resolve this destination. Warp back to safety with the NexaSphere telemetry portal.',
    lang: 'en'
  });

  // Countdown timer logic
  useEffect(() => {
    if (!isCountdownActive) return;
    if (countdown <= 0) {
      navigate(hasUser ? '/dashboard' : '/');
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, isCountdownActive, navigate, hasUser]);

  // Terminal log simulation logic
  useEffect(() => {
    const logPool = [
      'Querying DNS cluster roots... NULL_ENTRY',
      'Establishing fallback tunnel: OK',
      'Injecting backup security credentials...',
      'Mapping client index tracking coordinates...',
      'Port 3000 diagnostics: BOUND_AND_SECURE',
      'Configuring dynamic brand style layers: COMPLETE',
      'Calibrating antimatter thruster array...',
      'Syncing with primary Firebase metadata collection...',
      'NexaSphere automated redirection status: PENDING_CONFIRM',
      'Teleport parameters verified, system ready.',
    ];

    let currentIndex = 0;
    const logInterval = setInterval(() => {
      if (currentIndex < logPool.length) {
        setTerminalLogs((prev) => [...prev, logPool[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 1200);

    return () => clearInterval(logInterval);
  }, []);

  return (
    <div className="min-h-[90vh] relative flex flex-col items-center justify-center p-6 text-center overflow-hidden bg-[#02020a]">
      {/* Immersive Space Cosmic Star Particles */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          animate={{
            y: ['0px', '-600px'],
            opacity: [0, 0.7, 0],
            scale: [1, i % 2 === 0 ? 2 : 1, 1],
          }}
          transition={{
            duration: 8 + (i % 5) * 4,
            repeat: Infinity,
            repeatType: 'loop',
            delay: (i % 8) * 1.5,
            ease: 'linear',
          }}
          style={{
            width: `${(i % 3) + 1}px`,
            height: `${(i % 3) + 1}px`,
            left: `${(i * 4.2) % 100}%`,
            bottom: '-10px',
            filter: 'blur(0.5px)',
          }}
        />
      ))}

      {/* Dynamic Ambient Blur Orbs */}
      <div 
        className="absolute top-1/4 left-1/3 w-80 h-80 rounded-full filter blur-[120px] opacity-15 animate-pulse pointer-events-none" 
        style={{ backgroundColor: primaryColor }} 
      />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-[150px] opacity-20 pointer-events-none" />

      {/* Futuristic Cyber Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-20" />

      {/* Main Content Layout Container */}
      <div className="max-w-2xl w-full z-10 space-y-8 relative py-8">
        
        {/* Animated High-Tech Teleportation Visual */}
        <div className="relative flex items-center justify-center mx-auto w-36 h-36">
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
              className="absolute top-0 -mt-2 w-4.5 h-4.5 rounded-full bg-indigo-400 flex items-center justify-center shadow-[0_0_12px_#818cf8]"
            >
              <Orbit size={10} className="text-white animate-spin" />
            </motion.div>
          </motion.div>

          {/* Secondary Reverse Orbit */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
            className="absolute inset-4 border border-dotted rounded-full border-indigo-500/30 flex items-center justify-center"
          />

          {/* Inner Mirror Teleport Disk with Floating Icon */}
          <motion.div 
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-22 h-22 rounded-3xl flex flex-col items-center justify-center border bg-[#050510]/90 backdrop-blur-md relative"
            style={{ borderColor: `${primaryColor}33`, boxShadow: `0 0 30px ${primaryColor}15` }}
          >
            <ShieldAlert size={38} style={{ color: primaryColor }} className="animate-pulse" />
            
            {/* Dynamic mini timer countdown bubble inside circle */}
            {isCountdownActive && (
              <span className="absolute -bottom-1.5 px-2 py-0.5 rounded-full text-[9px] font-mono font-black text-white bg-slate-900 border border-slate-800">
                {countdown}s
              </span>
            )}
            
            <Orbit size={14} className="text-indigo-400 absolute top-2 right-2 animate-bounce" />
          </motion.div>
        </div>

        {/* 404 Large Display Typography */}
        <div className="space-y-3">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex items-center justify-center gap-1.5"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] px-3.5 py-1.5 rounded-full border border-rose-500/10 bg-rose-500/5 text-rose-400 font-bold">
              SYS_CRITICAL_EXCEPTION: PAGE_NOT_FOUND
            </span>
          </motion.div>

          <h1 className="text-8xl sm:text-9xl font-black italic tracking-tighter leading-none select-none text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-600">
            404
          </h1>

          <h2 className="text-2xl sm:text-4xl font-sans font-black uppercase tracking-tight italic text-white max-w-lg mx-auto leading-none">
            PAGE OUT OF COGNITIVE BOUNDS
          </h2>

          <p className="text-slate-400 font-semibold italic text-xs max-w-md mx-auto leading-relaxed">
            The target coordinates you entered don't exist under active sitemap indexes. Direct connection collapsed, warp propulsion required.
          </p>
        </div>

        {/* Live Terminal Log Component */}
        <div className="bg-[#03030d]/80 rounded-2xl border border-white/[0.05] p-4 text-left font-mono text-[10px] space-y-1.5 shadow-xl max-w-md mx-auto relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/[0.05] pb-2 mb-2 text-slate-500 font-bold">
            <span className="flex items-center gap-1.5 text-[8px] tracking-wider uppercase">
              <TerminalIcon size={12} className="text-indigo-400" />
              NexaSphere Diagnostics Console v3.15
            </span>
            <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 animate-pulse border border-emerald-500/20 shadow-sm font-black">
              LIVE DIAGNOSTIC
            </span>
          </div>
          <div className="h-28 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-white/10 select-none pr-1">
            {terminalLogs.map((log, idx) => (
              <div key={idx} className="flex gap-2">
                <span className="text-slate-600 text-[8px]">[{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                <span className={log.includes('COMPLETE') || log.includes('OK') || log.includes('bound') || log.includes('COMPLETE') ? 'text-emerald-400' : 'text-slate-300'}>
                  {log}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-3 bg-indigo-500 animate-[pulse_0.8s_infinite]" />
            </div>
          </div>
        </div>

        {/* Automatic Rerouting Notice Bar */}
        {isCountdownActive && (
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-300 select-none">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>Auto teleport initializing in <strong style={{ color: primaryColor }}>{countdown}s</strong>...</span>
          </div>
        )}

        {/* Dynamic Controls Linking back to Homepage */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.04, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(hasUser ? '/dashboard' : '/')}
            className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-white flex items-center gap-2.5 shadow-lg group relative overflow-hidden w-full sm:w-auto"
            style={{ 
              backgroundColor: primaryColor,
              boxShadow: `0 4px 25px ${primaryColor}45`
            }}
          >
            {/* Glossy hover element */}
            <div className="absolute inset-x-0 top-0 h-[40%] bg-white/15 skew-y-12 transition-all group-hover:skew-y-6" />
            
            <Rocket size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 text-white animate-pulse" />
            {hasUser ? 'TELEPORT TO DASHBOARD' : 'TELEPORT TO HOME BASE'}
          </motion.button>

          {/* Action to Pause Automatic Teleport */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCountdownActive(!isCountdownActive)}
            className="px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border border-white/10 text-slate-300 flex items-center justify-center gap-2 transition-colors duration-300 w-full sm:w-auto hover:bg-white/[0.04]"
          >
            {isCountdownActive ? (
              <>
                <Square size={14} className="text-rose-400" />
                PAUSE AUTO WARP
              </>
            ) : (
              <>
                <Play size={14} className="text-emerald-400 animate-pulse" />
                RESUME AUTO WARP
              </>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border border-white/10 text-slate-400 flex items-center justify-center gap-1.5 transition-colors duration-300 w-full sm:w-auto hover:bg-white/[0.04]"
          >
            <ArrowLeft size={13} />
            BACK ONE CELL
          </motion.button>
        </div>

        {/* Security telemetry feedback status footer */}
        <div className="pt-6 border-t border-white/[0.03] max-w-sm mx-auto">
          <div className="flex items-center justify-center gap-2 text-[8px] font-mono text-slate-500 font-bold uppercase tracking-widest">
            <Compass size={11} className="text-slate-600 animate-spin" />
            <span>NEXASPHERE SECURE LOGICAL ROUTING ENVELOPE: ONLINE</span>
          </div>
        </div>

      </div>
    </div>
  );
}

