import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Rocket, LayoutDashboard, ArrowRight, PhoneCall } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { auth } from '../../lib/firebase';
import { cn } from '../../lib/utils';

export default function NexasphereitHeader() {
  const { settings, setConsultationOpen } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Case Studies', path: '/case-studies' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
      scrolled 
        ? "pt-3 px-4 sm:px-6" 
        : "pt-6 px-0"
    )}>
      <div className={cn(
        "max-w-7xl mx-auto px-6 h-18 flex items-center justify-between transition-all duration-500 relative select-none",
        scrolled
          ? "bg-[#02020a]/80 border border-white/[0.08] rounded-2xl backdrop-blur-xl shadow-2xl shadow-indigo-950/15"
          : "bg-transparent border border-transparent border-b-white/[0.02]"
      )}>
        {/* Subtle top edge glow on hover/scroll */}
        {scrolled && (
          <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent blur-[1px] pointer-events-none" />
        )}

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
          {(settings.companyLogoLight || settings.companyLogo) ? (
            <motion.div 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white rounded-xl p-[4px] border border-white/10 shadow-lg flex items-center justify-center overflow-hidden" 
              style={{ height: `${scrolled ? 46 : (settings.logoHeight ? settings.logoHeight * 1.3 : 60)}px`, transition: 'height 0.5s ease' }}
            >
              <img 
                src={(settings.companyLogoLight || settings.companyLogo) || undefined} 
                alt="Logo" 
                className="h-full w-auto object-contain" 
              />
            </motion.div>
          ) : (
            <div className="flex items-center gap-2.5">
              <motion.div 
                whileHover={{ scale: 1.08, rotate: 5 }}
                whileTap={{ scale: 0.92 }}
                className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-650 via-indigo-600 to-purple-500 p-[1.5px] shadow-lg shadow-indigo-500/10 transition-all duration-300"
              >
                <div className="w-full h-full bg-[#03030c] rounded-[10px] flex items-center justify-center">
                  <span className="font-sans font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-indigo-400 to-pink-400 text-md">
                    {(settings.companyName || 'N').charAt(0).toUpperCase()}
                  </span>
                </div>
              </motion.div>
              <div className="flex flex-col">
                <span className="text-white font-black text-md tracking-tight uppercase italic flex items-center gap-1">
                  {settings.companyName || 'NexaSphere IT'}
                </span>
              </div>
            </div>
          )}
        </Link>

        {/* Desktop Nav Links Dock */}
        <nav 
          className="hidden lg:flex items-center gap-1 bg-white/[0.015] border border-white/[0.04] px-1.5 py-1 rounded-xl relative"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {navLinks.map((link, index) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onMouseEnter={() => setHoveredIndex(index)}
                className={cn(
                  "text-[10px] sm:text-[11px] font-black uppercase tracking-[0.16em] transition-colors duration-300 relative px-4 py-2 rounded-lg flex items-center justify-center select-none z-10 cursor-pointer",
                  isActive 
                    ? "text-indigo-400" 
                    : "text-slate-400 hover:text-white"
                )}
              >
                <span>{link.name}</span>
                
                {/* Floating pill background on Hover */}
                {hoveredIndex === index && (
                  <motion.div
                    layoutId="hoveredNavPill"
                    className="absolute inset-0 bg-white/[0.03] border border-white/[0.05] rounded-lg -z-10 shadow-inner"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 26 }}
                  />
                )}
                
                {/* Micro-dot Indicator for Active path */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicatorDot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-[3px] rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-md shadow-indigo-500/50"
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons with Premium hover effects */}
        <div className="hidden lg:flex items-center gap-4">
          <Link to="/login">
            <motion.button
              whileHover={{ 
                scale: 1.03, 
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderColor: "rgba(255, 255, 255, 0.15)",
                color: "#ffffff"
              }}
              whileTap={{ scale: 0.97 }}
              className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] border border-white/[0.06] bg-white/[0.01] px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm select-none"
            >
              Sign In
            </motion.button>
          </Link>

          <motion.button
            onClick={() => setConsultationOpen(true)}
            whileHover={{ 
              scale: 1.03, 
              boxShadow: "0 0 25px rgba(99, 102, 241, 0.3)",
            }}
            whileTap={{ scale: 0.97 }}
            className="text-[10px] font-black uppercase tracking-widest text-white bg-gradient-to-r from-indigo-650 via-purple-650 to-pink-500 px-6 py-2.5 rounded-xl shadow-lg shadow-indigo-500/10 flex items-center gap-2 cursor-pointer relative overflow-hidden group border border-indigo-400/25 select-none"
          >
            {/* Inner glowing light shimmer effect */}
            <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-150%] group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
            <Rocket size={13} className="group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300 text-indigo-200" />
            <span>Free Consultation</span>
          </motion.button>
        </div>

        {/* Mobile Menu Actions */}
        <div className="flex lg:hidden items-center gap-3">
          <button 
            onClick={() => setConsultationOpen(true)}
            className="p-2 text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <PhoneCall size={20} className="active:scale-95 transition-transform" />
          </button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(!isOpen)}
            className="p-2.5 bg-white/[0.02] border border-white/[0.08] text-white rounded-xl hover:bg-white/[0.06] transition-all cursor-pointer"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer with Staggered animations */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="lg:hidden w-full bg-[#02020a]/95 border-b border-white/[0.08] backdrop-blur-2xl overflow-hidden mt-2 rounded-2xl shadow-xl border-x px-2"
          >
            {/* Staggered list container */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
              className="px-6 py-6 flex flex-col gap-4 text-left"
            >
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <motion.div
                    key={link.path}
                    variants={{
                      hidden: { opacity: 0, x: -12 },
                      visible: { opacity: 1, x: 0 }
                    }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-[11px] font-black uppercase tracking-widest py-2 border-b border-white/[0.02] flex items-center justify-between group transition-colors",
                        isActive ? "text-indigo-400" : "text-slate-400 hover:text-white"
                      )}
                    >
                      <span className="flex items-center gap-1.5">
                        {link.name}
                        {link.name === 'Live Bulletin' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        )}
                      </span>
                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-indigo-400" />
                    </Link>
                  </motion.div>
                );
              })}
              
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="flex flex-col gap-3 pt-4 border-t border-white/[0.04]"
              >
                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full">
                  <button className="w-full text-xs font-bold uppercase tracking-widest text-slate-300 bg-white/[0.02] border border-white/[0.08] py-3.5 rounded-xl cursor-pointer active:scale-98 transition-all">
                    Sign In
                  </button>
                </Link>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    setConsultationOpen(true);
                  }}
                  className="w-full text-xs font-black uppercase tracking-widest text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all"
                >
                  <Rocket size={14} />
                  Free Consultation
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
