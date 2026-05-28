import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Scale, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NexoraTerms() {
  const [termsData, setTermsData] = useState({
    termsTitle: "Terms of Service & Collaboration",
    termsBody: "Standard Agency SLA. Services are provided on a monthly retainer basis. All metric parameters must be approved prior to onboarding. Cancellation requires a 30-day written notice to the executive partner designated."
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
            termsTitle: fetched.termsTitle || "Terms of Service & Collaboration",
            termsBody: fetched.termsBody || "Standard Agency SLA. Services are provided on a monthly retainer basis. All metric parameters must be approved prior to onboarding. Cancellation requires a 30-day written notice to the executive partner designated."
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
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-indigo-600/5 rounded-full filter blur-3xl pointer-events-none" />

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
            <Scale size={14} className="text-red-500 animate-pulse" />
            <span className="text-[10px] font-mono font-black text-red-400 tracking-widest uppercase">Nexora Digital Legal Panel</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-sans font-black tracking-tighter uppercase italic text-white">
            {termsData.termsTitle}
          </h1>

          <p className="text-xs text-slate-400 font-semibold italic max-w-2xl leading-relaxed">
            Please review the legal codes, compliance policies, and executive frameworks of collaboration governing Nexora Digital services, SaaS dashboards, and connected platforms.
          </p>
        </div>

        {/* Term Body Box */}
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
              {termsData.termsBody}
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-red-500" />
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest font-black">
                VERIFIED NEXORA LEGAL SLA STAMP
              </span>
            </div>
            <Link 
              to="/privacy"
              className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 uppercase tracking-widest font-black inline-flex items-center gap-2"
            >
              Examine Privacy Disclosures <ArrowRight size={12} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
