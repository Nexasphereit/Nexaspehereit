import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, HelpCircle, Award, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useSEO } from '../../hooks/useSEO';

export default function NexasphereitPricing() {
  // High efficiency dynamic SEO hooks integration
  useSEO({
    title: 'Packages & Pricing Plans | NexaSphere IT Dhaka',
    description: 'Explore affordable digital marketing packages and web development pricing by NexaSphere IT (nexasphereit). Transparent rates for SEO services, Facebook boosting charges in Bangladesh, and Google Ads management.',
    keywords: 'digital marketing cost Bangladesh, Facebook boosting charges BD, website design price Dhaka, affordable SEO services BD, hire digital marketer charge, NexaSphere IT packages rates',
    canonical: 'https://nexasphere.it/pricing',
    ogTitle: 'Transparent Pricing Plans & Bundles | NexaSphere IT',
    ogDescription: 'No hidden setup fees or fine print. Browse our budget-friendly scale plans for local commerce and enterprise search engine optimization campaigns.',
    lang: 'en'
  });

  const [pagesConfig, setPagesConfig] = useState({
    pricingCapsule: 'SIMPLE & TRANSPARENT PRICING',
    pricingTitle: 'CLEAR GROWTH PLANS',
    pricingSubtitle: 'No complex developer jargon or confusing terms. Choose a simple campaign blueprint tailored to scale your brand leads and online sales.'
  });

  const [plans, setPlans] = useState<any[]>([
    {
      name: "Starter Growth Plan",
      price: "৳৫০,০০০",
      period: "monthly",
      desc: "Perfect for local businesses starting their digital marketing journey. We design beautiful social posts and launch your ads.",
      features: [
        "Social Media Post Design (10 premium layouts)",
        "Facebook Ads Setup & Demographics Config",
        "Targeted audience research & testing",
        "1 Fast Sales Landing Page built",
        "Weekly progress review & consulting"
      ],
      popular: false,
      color: "border-white/[0.05]"
    },
    {
      name: "Professional Scaler Plan",
      price: "৳১,৫০,০০০",
      period: "monthly",
      desc: "Perfect for growing brands and e-commerce stores looking to capture massive customer interest across multiple social feeds.",
      features: [
        "Meta Ads scaling (Facebook & Instagram)",
        "TikTok Video Ads directly edited for scroll-stopping hooks",
        "Google Ads & PPC Search campaign design",
        "Full Search Engine Optimization (SEO) audit & strategy",
        "Continuous Multi-Page Website Development",
        "Direct consulting hotline & premium support team"
      ],
      popular: true,
      color: "border-indigo-500/40 bg-indigo-950/20 shadow-indigo-500/5"
    },
    {
      name: "Omni-Channel Leader Plan",
      price: "৳৩,০০,০০০",
      period: "monthly",
      desc: "Ultimate category authority. Unify your social branding and paid performance campaigns for non-stop customer acquisition.",
      features: [
        "Unlimited Custom Social Media Post Designs",
        "All-inclusive Paid Ads (Meta + TikTok + Google Search)",
        "Top-Tier Google SEO ranking & daily indexing reports",
        "Continuous Website updates and high-performance sales funnels",
        "Premium promo video editing & soundscapes",
        "24/7 priority support with your dedicated growth champion"
      ],
      popular: false,
      color: "border-pink-500/30"
    }
  ]);

  useEffect(() => {
    const fetchPricingAndConfigs = async () => {
      try {
        const snap = await getDocs(collection(db, 'nexasphereit_pricing_plans'));
        if (!snap.empty) {
          const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setPlans(list);
        } else {
          const backup = localStorage.getItem('nexasphereit_pricing_backup');
          if (backup) setPlans(JSON.parse(backup));
        }

        // Fetch custom pages values
        const pDoc = await getDoc(doc(db, 'nexasphereit_config', 'pages_config'));
        if (pDoc.exists()) {
          setPagesConfig(p => ({ ...p, ...pDoc.data() }));
        } else {
          const backupPages = localStorage.getItem('nexasphereit_pages_backup');
          if (backupPages) setPagesConfig(JSON.parse(backupPages));
        }
      } catch (err) {
        console.warn("Could not load backend configurations in Pricing Page:", err);
        const backup = localStorage.getItem('nexasphereit_pricing_backup');
        if (backup) setPlans(JSON.parse(backup));
        const backupPages = localStorage.getItem('nexasphereit_pages_backup');
        if (backupPages) setPagesConfig(JSON.parse(backupPages));
      }
    };
    fetchPricingAndConfigs();
  }, []);

  return (
    <div className="min-h-screen bg-[#02020a] text-white pt-24 pb-20 relative overflow-hidden font-sans">
      {/* Background blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
        {/* Intro */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.25em] italic">{pagesConfig.pricingCapsule}</span>
          <h1 className="text-4xl sm:text-5xl font-sans font-black italic uppercase tracking-tighter">
            {pagesConfig.pricingTitle}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-semibold italic">
            {pagesConfig.pricingSubtitle}
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
