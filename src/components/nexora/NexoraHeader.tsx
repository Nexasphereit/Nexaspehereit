import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Menu, X, Rocket, LayoutDashboard } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { auth } from '../../lib/firebase';
import { cn } from '../../lib/utils';

export default function NexoraHeader() {
  const { settings, toggleDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
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

  const currentUser = auth.currentUser;

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
      scrolled 
        ? "bg-[#02020a]/80 backdrop-blur-xl border-white/[0.05] py-4" 
        : "bg-transparent border-transparent py-6"
    )}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[2px] shadow-lg shadow-purple-500/20 active:scale-95 transition-transform">
            <div className="w-full h-full bg-[#03030c] rounded-[10px] flex items-center justify-center">
              <span className="font-sans font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400 text-lg">N</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black text-lg tracking-tight uppercase italic flex items-center gap-1">
              Nexora <span className="text-indigo-400 font-medium tracking-normal text-xs not-italic bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">Digital</span>
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "text-xs font-bold uppercase tracking-widest transition-all hover:text-indigo-400 relative py-1",
                  isActive ? "text-indigo-400 font-extrabold" : "text-slate-400"
                )}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activePublicHeaderNav"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-505"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-xs font-bold uppercase tracking-widest text-[#94a3b8] hover:text-white bg-white/[0.03] border border-white/[0.08] hover:border-white/20 px-5 py-2.5 rounded-xl transition-all"
            >
              Sign In
            </motion.button>
          </Link>

          <Link to="/admin">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="text-xs font-black uppercase tracking-widest text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-6 py-2.5 rounded-xl shadow-lg flex items-center gap-2"
            >
              <LayoutDashboard size={14} />
              Portal Desk
            </motion.button>
          </Link>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex lg:hidden items-center gap-3">
          <Link to="/admin" className="p-2 text-indigo-400 hover:text-indigo-300">
            <LayoutDashboard size={20} />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 bg-white/[0.03] border border-white/[0.1] text-white rounded-xl hover:bg-white/[0.08] transition-all"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden w-full bg-[#03030d] border-b border-white/[0.08] overflow-hidden"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-sm font-bold uppercase tracking-widest py-1 border-b border-white/[0.03] hover:text-indigo-400 transition-colors",
                    location.pathname === link.path ? "text-indigo-400" : "text-slate-400"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4">
                <Link to="/login" onClick={() => setIsOpen(false)} className="w-full">
                  <button className="w-full text-xs font-bold uppercase tracking-widest text-slate-300 bg-white/[0.03] border border-white/[0.08] py-3.5 rounded-xl">
                    Sign In
                  </button>
                </Link>
                <Link to="/admin" onClick={() => setIsOpen(false)} className="w-full">
                  <button className="w-full text-xs font-black uppercase tracking-widest text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2">
                    <LayoutDashboard size={14} />
                    Portal Area
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
