import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Globe, Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { toast as hotToast } from 'react-hot-toast';

export default function NexoraFooter() {
  const [email, setEmail] = useState('');
  const [activeTermsTab, setActiveTermsTab] = useState<'terms' | 'privacy' | null>(null);
  const [termsData, setTermsData] = useState({
    termsTitle: "Terms of Service & Collaboration",
    termsBody: "Standard Agency SLA. Services are provided on a monthly retainer basis. All metric parameters must be approved prior to onboarding. Cancellation requires a 30-day written notice to the executive partner designated.",
    privacyTitle: "Privacy & Encryption Policy",
    privacyBody: "Privacy is paramount. Any tracking metrics, connected analytics keys, Meta pixels, or customized customer databases seeded into NexaSphere are secured on high-authority servers. We never sell, rent, or distribute metrics databases to external agencies."
  });

  useEffect(() => {
    const fetchTermsDoc = async () => {
      try {
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('../../lib/firebase');
        const tDoc = await getDoc(doc(db, 'nexora_config', 'landing_terms'));
        if (tDoc.exists()) {
          setTermsData(tDoc.data() as any);
        } else {
          const backup = localStorage.getItem('nexora_terms_backup');
          if (backup) setTermsData(JSON.parse(backup));
        }
      } catch (e) {
        const backup = localStorage.getItem('nexora_terms_backup');
        if (backup) setTermsData(JSON.parse(backup));
      }
    };
    fetchTermsDoc();
  }, []);

  const submitNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      hotToast.error("Please provide a valid corporate email address!");
      return;
    }
    hotToast.success("Welcome aboard! You have joined Nexora's Elite Growth list.");
    setEmail('');
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#020208] border-t border-white/[0.05] relative pt-20 pb-12 overflow-hidden">
      {/* Decorative Blur BG */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full filter blur-3xl opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
        {/* Brand Block */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[2px] shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-[#03030c] rounded-[10px] flex items-center justify-center">
                <span className="font-sans font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400 text-lg">N</span>
              </div>
            </div>
            <span className="text-white font-black text-lg tracking-tight uppercase italic">
              Nexora <span className="text-indigo-400 font-medium tracking-normal text-xs not-italic">Digital</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed font-semibold italic">
            World-class international marketing agency and advanced SaaS analytics suite. We scale startups and global brands via data-driven high-end performance marketing.
          </p>
          <div className="flex items-center gap-3">
            {['Facebook', 'Twitter', 'LinkedIn', 'Instagram'].map((p) => (
              <a
                key={p}
                href="#"
                onClick={(e) => { e.preventDefault(); hotToast.success(`Visiting ${p} corporate channels!`); }}
                className="w-8 h-8 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] hover:border-indigo-500 transition-colors border border-white/[0.05] flex items-center justify-center text-xs text-slate-400 hover:text-white"
              >
                {p[0]}
              </a>
            ))}
          </div>
        </div>

        {/* Navigation links */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white italic mb-6">HQ Blueprint</h4>
          <ul className="space-y-3">
            {[
              { label: 'Growth Strategies', path: '/' },
              { label: 'Agency Story', path: '/about' },
              { label: 'SLA Pricing Plan', path: '/pricing' },
              { label: 'Corporate Services', path: '/services' },
              { label: 'Visual Portfolio', path: '/portfolio' },
              { label: 'Global Case Studies', path: '/case-studies' },
            ].map((link) => (
              <li key={link.label}>
                <Link to={link.path} className="text-xs text-slate-400 hover:text-indigo-400 hover:translate-x-1 transition-all inline-block font-semibold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white italic mb-6">Global Hub</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-indigo-500 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-400 leading-relaxed font-semibold">
                Nexora Towers, 22nd floor<br />
                Silicon Oasis, Tech Hub Plaza<br />
                New York, NY 10001
              </div>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-indigo-500 shrink-0" />
              <span className="text-xs text-slate-400 font-semibold italic">partner@nexoradigital.com</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-indigo-500 shrink-0" />
              <span className="text-xs text-slate-400 font-semibold">+1 (800) 555-NEXORA</span>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white italic mb-6">Elite Growth Insights</h4>
          <p className="text-xs text-slate-400 leading-relaxed font-semibold italic mb-4">
            Subscribe to receive advanced ROAS breakdowns and quarterly high-performing ad briefs.
          </p>
          <form onSubmit={submitNewsletter} className="relative flex">
            <input
              type="email"
              placeholder="corporate@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/[0.08] text-white rounded-xl py-3 pl-4 pr-12 text-xs font-semibold focus:border-indigo-500 outline-none transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center justify-center mr-0.5"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/[0.05] flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 text-center md:text-left">
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
          &copy; {currentYear} NEXORA DIGITAL. ALL RIGHTS RESERVED. POWERED BY NEXASPHERE ENGINE.
        </p>
        <div className="flex gap-6">
          <Link 
            to="/privacy" 
            className="text-[10px] text-slate-500 hover:text-red-500 transition-colors uppercase tracking-wider font-extrabold cursor-pointer"
          >
            Privacy Policy
          </Link>
          <Link 
            to="/terms" 
            className="text-[10px] text-slate-500 hover:text-red-500 transition-colors uppercase tracking-wider font-extrabold cursor-pointer"
          >
            Terms of Service
          </Link>
        </div>
      </div>

      {/* MODAL / BOTTOM SLIDE-OVER IN STUNNING RED & BLACK FOR TERMS/PRIVACY */}
      <AnimatePresence>
        {activeTermsTab && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010103]/95 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#090202] border border-red-900/40 rounded-[2rem] shadow-[0_0_50px_rgba(239,68,68,0.2)] overflow-hidden z-[9999]"
            >
              {/* Crimson ambient glow inside */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-red-600/10 rounded-full filter blur-3xl pointer-events-none" />

              {/* Modal Header */}
              <div className="p-6 border-b border-red-950/50 bg-[#0e0202] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shrink-0" />
                  <h3 className="font-sans font-black text-sm uppercase tracking-widest text-red-400 italic">
                    {activeTermsTab === 'terms' ? termsData.termsTitle : termsData.privacyTitle}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTermsTab(null)}
                  className="text-[9px] font-mono text-red-500/70 hover:text-red-400 bg-red-950/20 hover:bg-red-950/50 px-3 py-1.5 rounded-xl border border-red-900/30 transition-colors uppercase font-bold tracking-widest cursor-pointer"
                >
                  Close [×]
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 max-h-[55vh] overflow-y-auto space-y-4 font-sans text-xs leading-relaxed text-red-100/80 font-medium italic">
                <p className="whitespace-pre-line bg-[#040101] p-6 rounded-2xl border border-red-950/70 text-red-100/90 leading-relaxed font-mono text-[11px] leading-relaxed">
                  {activeTermsTab === 'terms' ? termsData.termsBody : termsData.privacyBody}
                </p>
                <div className="text-[9px] text-red-600/60 font-mono tracking-widest uppercase text-center pt-2 font-black select-none">
                  SECURED BY NEXORA EXECUTIVE COMPLIANCE FRAMEWORK
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-red-950/50 bg-[#080101] flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTermsTab(null)}
                  className="w-full py-4 text-white hover:text-red-100 bg-red-900 hover:bg-red-800 rounded-xl text-center text-xs uppercase font-sans font-black tracking-widest transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] shadow-red-900/40 cursor-pointer"
                >
                  Acknowledge & Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}
