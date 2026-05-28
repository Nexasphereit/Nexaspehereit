import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NexoraPrivacy() {
  const [termsData, setTermsData] = useState({
    privacyTitle: "Privacy & Encryption Policy",
    privacyBody: "Privacy is paramount. Any tracking metrics, connected analytics keys, Meta pixels, or customized customer databases seeded into NexaSphere are secured on high-authority servers. We never sell, rent, or distribute metrics databases to external agencies."
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchTermsDoc = async () => {
      try {
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('../../lib/firebase');
        const tDoc = await getDoc(doc(db, 'nexora_config', 'landing_terms'));
        if (tDoc.exists()) {
          const fetched = tDoc.data() as any;
          setTermsData({
            privacyTitle: fetched.privacyTitle || "Privacy & Encryption Policy",
            privacyBody: fetched.privacyBody || "Privacy is paramount. Any tracking metrics, connected analytics keys, Meta pixels, or customized customer databases seeded into NexaSphere are secured on high-authority servers. We never sell, rent, or distribute metrics databases to external agencies."
          });
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

  return (
    <div className="min-h-screen bg-[#02020a] text-white pt-32 pb-24 relative overflow-hidden">
      {/* Cinematic ambient designs */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-indigo-600/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 group text-xs font-mono text-red-500 hover:text-red-400 uppercase tracking-widest font-black mb-8"
        >
          <span>←</span> Back to Hub Headquarters
        </Link>

        {/* Header Hero Title */}
        <div className="space-y-6 mb-12">
          <div className="inline-flex items-center gap-3 bg-red-950/20 border border-red-900/30 px-4 py-2 rounded-2xl">
            <Lock size={14} className="text-red-500 animate-pulse" />
            <span className="text-[10px] font-mono font-black text-red-400 tracking-widest uppercase">Nexora Data Shield Command</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-sans font-black tracking-tighter uppercase italic text-white">
            {termsData.privacyTitle}
          </h1>

          <p className="text-xs text-slate-400 font-semibold italic max-w-2xl leading-relaxed">
            NexaSphere and Nexora Digital metrics engines enforce military-grade encryption keys. Learn what operational markers we log and audit.
          </p>
        </div>

        {/* Privacy Body Box */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-950/50 p-8 md:p-12 border border-white/[0.04] rounded-[2.5rem] shadow-2xl relative overflow-hidden backdrop-blur-xl"
        >
          {/* subtle interior accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/[0.02] rounded-bl-full pointer-events-none" />

          <div className="prose prose-invert max-w-none">
            <p className="whitespace-pre-line text-slate-300 font-mono text-[13px] leading-relaxed tracking-wide bg-[#040101]/40 p-6 rounded-2xl border border-white/[0.02]">
              {termsData.privacyBody}
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-red-500" />
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-black">
                ISO 27001 SECURED DISCLOSURES
              </span>
            </div>
            <Link 
              to="/terms"
              className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 uppercase tracking-widest font-black inline-flex items-center gap-2"
            >
              Examine Terms of Service <ArrowRight size={12} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
