import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, HelpCircle, Award, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function NexoraPricing() {
  const [plans, setPlans] = useState<any[]>([
    {
      name: "Pilot Launch Retainer",
      price: "$2,500",
      period: "monthly",
      desc: "Perfect for venture-backed seed startups targeting clear proof-of-concept metric scaling on a single primary ad platform.",
      features: [
        "Single Ad Platform Scale (FB or GG)",
        "3 UGC Custom Video Hooks Monthly",
        "Direct pixel tracking verification",
        "Weekly performance reports via Slack Dashboard",
        "NexaSphere basic quotation synchronizer"
      ],
      popular: false,
      color: "border-white/[0.05]"
    },
    {
      name: "Enterprise Scaling Engine",
      price: "$5,000",
      period: "monthly",
      desc: "Our most coveted scale package. Built for established businesses seeking category dominance across both search and social.",
      features: [
        "Multi-Platform Scale (Meta + TikTok + Google PPC)",
        "12 Direct-Response UGC Ad Hooks Monthly",
        "1 Custom React or Shopify Lander designed to split-test",
        "Predictive CRM multi-lead score configurations",
        "Full NexaSphere Admin backoffice connectivity",
        "Dedicated marketing architect hotline"
      ],
      popular: true,
      color: "border-indigo-500/40 bg-indigo-950/20 shadow-indigo-500/5"
    },
    {
      name: "Ultimate Category Leader",
      price: "$10,000",
      period: "monthly",
      desc: "Omnichannel brand siege. Absolute focus of our visual engineering team scaling unlimited funnels and operations globally.",
      features: [
        "Unrestricted omnichannel scale channels",
        "Unlimited custom ad creatives & UGC clips on demand",
        "Unlimited split Lander page development",
        "Lifetime Premium NexaSphere Workspace Access",
        "Custom billing integrations & legal SLA frameworks",
        "Priority 1-hour response service level agreement"
      ],
      popular: false,
      color: "border-pink-500/30"
    }
  ]);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const snap = await getDocs(collection(db, 'nexora_pricing_plans'));
        if (!snap.empty) {
          const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPlans(list);
        } else {
          const backup = localStorage.getItem('nexora_pricing_backup');
          if (backup) setPlans(JSON.parse(backup));
        }
      } catch (err) {
        const backup = localStorage.getItem('nexora_pricing_backup');
        if (backup) setPlans(JSON.parse(backup));
      }
    };
    fetchPricing();
  }, []);

  return (
    <div className="min-h-screen bg-[#02020a] text-white pt-24 pb-20 relative overflow-hidden font-sans">
      {/* Background blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
        {/* Intro */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.25em] italic">TRANSPARENT RECOV_ALLOCATIONS</span>
          <h1 className="text-4xl sm:text-5xl font-sans font-black italic uppercase tracking-tighter">
            ELITE SCALE RETAINERS
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-semibold italic">
            Zero hidden fees. Full SLA transparency. Choose the growth blueprint aligned to your seven-figure scaling parameters.
          </p>
        </section>

        {/* Pricing Cards Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-8">
          {plans.map((p, idx) => {
            const listFeatures = typeof p.features === 'string' 
              ? p.features.split(',') 
              : Array.isArray(p.features) 
                ? p.features 
                : [];
            
            return (
              <div 
                key={p.id || idx}
                className={`border rounded-[2.5rem] p-8 flex flex-col justify-between transition-all group relative overflow-hidden ${
                  p.popular 
                    ? 'border-indigo-500/40 bg-indigo-950/20 shadow-indigo-500/5' 
                    : p.color || 'border-white/[0.05]'
                }`}
              >
                {p.popular && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full animate-pulse">
                    MOST POPULAR RETAINER
                  </div>
                )}

                <div className="space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black uppercase italic text-white">{p.name}</h3>
                    <p className="text-slate-400 text-xs font-semibold italic min-h-[60px] leading-relaxed">
                      {p.desc}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1.5 border-b border-white/[0.03] pb-6">
                    <span className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{p.price}</span>
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">/ {p.period}</span>
                  </div>

                  <ul className="space-y-4">
                    {listFeatures.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-3">
                        <ShieldCheck size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-300 font-semibold italic leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 border-t border-white/[0.03] mt-8">
                  <Link to={`/contact?plan=${encodeURIComponent(p.name)}`} className="w-full block">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => toast.success(`Selected Plan: ${p.name}`)}
                      className={`w-full text-xs font-black py-4 uppercase tracking-widest rounded-2xl flex items-center justify-center gap-2 cursor-pointer ${
                        p.popular 
                          ? 'bg-indigo-600 hover:bg-indigo-550 text-white shadow-xl' 
                          : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.05]'
                      }`}
                    >
                      Select Retainer
                      <ArrowRight size={14} />
                    </motion.button>
                  </Link>
                  <p className="text-center text-[8px] text-slate-600 font-black uppercase tracking-wider mt-4">SUBJECT TO SLAS • 30-DAY CANCELLATION PERIOD</p>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}
