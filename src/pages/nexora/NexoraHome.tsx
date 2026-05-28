import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Sparkles, Rocket, Globe, BarChart3, Target, 
  TrendingUp, Award, Check, HelpCircle, MessageSquare, Star, 
  Lock, ArrowUpRight, CheckCircle, ChevronDown, Monitor, Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';

export default function NexoraHome() {
  const [faqs, setFaqs] = useState([
    { q: "What is your typical ROAS (Return on Ad Spend) average?", a: "Across Facebook, Tik Tok, and Google Ads, our corporate average for active campaigns sits at 4.2x ROAS, with high-intent premium Shopify scaling funnels regularly achieving over 6.8x ROAS.", open: true },
    { q: "Do you build the landing pages and sales funnels too?", a: "Yes, we handle the full stack. Our international design team designs high-speed Shopify Stores, custom React funnels, and high-conversion landing pages engineered strictly to maximize lead qualification and purchases.", open: false },
    { q: "How long before we see our first marketing results?", a: "With our specialized Nexora launch protocol, standard PPC and paid social channels go live with optimized creatives within 10-14 days. Major metrics improvements are visible in your custom analytics portal immediately.", open: false },
    { q: "Do you integrate custom CRM or tools like the NexaSphere Suite?", a: "Absolutely! Every Nexora Digital retainer grants lifetime premium access to the integrated NexaSphere workspace—where clients and executive staff can instantly manage Quotations, Money Receipts, and custom Sales tracking in real-time.", open: false }
  ]);

  const [heroConfig, setHeroConfig] = useState({
    floatingCapsule: "NEXORA DIGITAL RENAISSANCE",
    headline: "TRANSFORMING AD CONVERSIONS",
    subGradient: "VIA PRETERNATURAL ROAS",
    subtitle: "World-class performance marketing meets cutting-edge enterprise analytics. We build, optimize, and scale ultra-luxury customer acquisition systems for international brands.",
    ctaPrimary: "Secure Initial Strategy",
    ctaSecondary: "Explore Services",
    featureImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80"
  });

  const [statsConfig, setStatsConfig] = useState({
    stat1_val: 185,
    stat1_suffix: "M+",
    stat1_label: "Verified Revenue Generated",
    stat2_val: 45,
    stat2_suffix: " Active",
    stat2_label: "Global SaaS Accounts",
    stat3_val: 99,
    stat3_suffix: "% ROAS",
    stat3_label: "Average Lead Scale Efficiency"
  });

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'nexora_services'), limit(3)));
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServices(list);
      } catch (e) {
        console.warn("Could not fetch home services:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchConfigsAndFaqs = async () => {
      try {
        // Fetch Hero
        const hDoc = await getDoc(doc(db, 'nexora_config', 'landing_hero'));
        if (hDoc.exists()) {
          setHeroConfig(hDoc.data() as any);
        } else {
          const localHero = localStorage.getItem('nexora_hero_backup');
          if (localHero) setHeroConfig(JSON.parse(localHero));
        }

        // Fetch Stats
        const sDoc = await getDoc(doc(db, 'nexora_config', 'landing_stats'));
        if (sDoc.exists()) {
          setStatsConfig(sDoc.data() as any);
        } else {
          const localStats = localStorage.getItem('nexora_stats_backup');
          if (localStats) setStatsConfig(JSON.parse(localStats));
        }

        // Fetch FAQs
        const faqSnap = await getDocs(collection(db, 'nexora_faqs'));
        if (!faqSnap.empty) {
          const list = faqSnap.docs.map((d, index) => ({ id: d.id, ...d.data(), open: index === 0 }));
          setFaqs(list as any);
        } else {
          const localFaqs = localStorage.getItem('nexora_faqs_backup');
          if (localFaqs) {
            setFaqs(JSON.parse(localFaqs).map((f: any, i: number) => ({ ...f, open: i === 0 })));
          }
        }
      } catch (err) {
        const lh = localStorage.getItem('nexora_hero_backup');
        if (lh) setHeroConfig(JSON.parse(lh));
        const ls = localStorage.getItem('nexora_stats_backup');
        if (ls) setStatsConfig(JSON.parse(ls));
        const lf = localStorage.getItem('nexora_faqs_backup');
        if (lf) setFaqs(JSON.parse(lf).map((f: any, i: number) => ({ ...f, open: i === 0 })));
      }
    };
    fetchConfigsAndFaqs();
  }, []);

  const toggleFaq = (index: number) => {
    setFaqs(p => p.map((f, i) => i === index ? { ...f, open: !f.open } : f));
  };

  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);
  const [counter3, setCounter3] = useState(0);

  useEffect(() => {
    const target1 = statsConfig.stat1_val || 185;
    const target2 = statsConfig.stat2_val || 45;
    const target3 = statsConfig.stat3_val || 99;

    setCounter1(0);
    setCounter2(0);
    setCounter3(0);

    const i1 = setInterval(() => setCounter1(p => p < target1 ? p + Math.ceil(target1 / 40) : target1), 25);
    const i2 = setInterval(() => setCounter2(p => p < target2 ? p + Math.ceil(target2 / 40) : target2), 40);
    const i3 = setInterval(() => setCounter3(p => p < target3 ? p + Math.ceil(target3 / 40) : target3), 30);
    return () => {
      clearInterval(i1);
      clearInterval(i2);
      clearInterval(i3);
    };
  }, [statsConfig]);

  // Standard services default backup if Firestore is not yet populated
  const defaultServices = [
    { title: "Facebook & Social Ads", desc: "Scale revenue via custom creatives and hyper-targeted paid social pipelines.", cat: "Paid Social" },
    { title: "Search Engine Optimization", desc: "Gain massive high-intent organic traffic with modern thematic SEO architecture.", cat: "Organic Growth" },
    { title: "Funnel & Shopify Dev", desc: "World-class visual digital experiences developed to maximize pixel conversions.", cat: "Full Development" }
  ];

  const displayedServices = services.length > 0 ? services : defaultServices;

  return (
    <div className="min-h-screen bg-[#02020a] text-white overflow-hidden relative font-sans pt-14">
      {/* Cinematic Ambient Glow Nodes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-indigo-900/15 via-purple-900/5 to-transparent rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-1/4 w-[600px] h-[600px] bg-pink-500/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-20 lg:pt-36 lg:pb-32 flex flex-col items-center text-center">
        {/* Floating Capsule */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md mb-8 text-indigo-400 text-xs font-black tracking-widest uppercase italic"
        >
          <Sparkles size={12} className="animate-pulse" />
          {heroConfig.floatingCapsule}
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-sans font-black tracking-tighter leading-none mb-8 italic uppercase"
        >
          {heroConfig.headline} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">
            {heroConfig.subGradient}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-slate-400 text-sm sm:text-lg max-w-2xl leading-relaxed mb-12 font-medium italic"
        >
          {heroConfig.subtitle}
        </motion.p>

        {/* Head CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center px-4"
        >
          <Link to="/contact" className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(99, 102, 241, 0.45)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-10 py-4.5 rounded-2xl text-xs uppercase font-black tracking-widest flex items-center justify-center gap-3 cursor-pointer"
            >
              {heroConfig.ctaPrimary}
              <ArrowRight size={16} />
            </motion.button>
          </Link>

          <Link to="/services" className="w-full sm:w-auto">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto text-[#cbd5e1] hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/20 px-10 py-4.5 rounded-2xl text-xs uppercase font-black tracking-widest cursor-pointer transition-all"
            >
              {heroConfig.ctaSecondary}
            </motion.button>
          </Link>
        </motion.div>

        {/* Client trust logo line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 w-full"
        >
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.25em] font-black italic mb-6">TRUSTED BY SEVEN-FIGURE FRANCHISES & INTERNATIONAL BRANDS</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-40 hover:opacity-75 transition-opacity">
            {['Vercel', 'Meta Business', 'Google Premier Partner', 'Shopify Plus', 'Stripe Elite'].map((brand, i) => (
              <span key={i} className="text-sm font-extrabold tracking-widest text-slate-400 capitalize hover:text-indigo-400 transition-colors cursor-help">{brand}</span>
            ))}
          </div>
        </motion.div>

        {/* Customized Feature Image Showcase */}
        {heroConfig.featureImage && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 w-full max-w-4xl mx-auto px-4"
          >
            <div className="relative rounded-[2rem] bg-gradient-to-b from-indigo-500/20 via-purple-500/10 to-transparent p-[1px] shadow-2xl shadow-indigo-500/5 group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 to-pink-500/10 opacity-35 blur-2xl group-hover:opacity-50 transition-all pointer-events-none" />
              <div className="relative bg-slate-950/90 rounded-[2rem] p-3 sm:p-4 overflow-hidden border border-white/[0.05]">
                {/* Simulated Web top tabs style design */}
                <div className="flex items-center gap-2 mb-3 px-2 justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="h-5 w-48 sm:w-80 bg-white/[0.03] rounded-md border border-white/[0.05] text-[8px] text-slate-450 font-mono flex items-center justify-center tracking-tight lowercase">
                    https://console.nexoradigital.com/analytics/growth
                  </div>
                  <div className="w-10" />
                </div>
                <img 
                  src={heroConfig.featureImage} 
                  alt="Nexora Corporate Portfolio Suite" 
                  referrerPolicy="no-referrer"
                  className="w-full h-auto max-h-[480px] object-cover rounded-xl border border-white/[0.05]"
                  onError={(e) => {
                    (e.target as any).src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Floating Interactive Counters Container */}
      <section className="bg-slate-950/60 border-y border-white/[0.04] backdrop-blur-xl relative z-10 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-2">
            <div className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">${counter1}{statsConfig.stat1_suffix}</div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{statsConfig.stat1_label}</p>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{counter2}{statsConfig.stat2_suffix}</div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{statsConfig.stat2_label}</p>
          </div>
          <div className="space-y-2">
            <div className="text-5xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-500">{counter3}{statsConfig.stat3_suffix}</div>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{statsConfig.stat3_label}</p>
          </div>
        </div>
      </section>

      {/* why Choose Us Bento Grid */}
      <section className="max-w-7xl mx-auto px-6 py-28 relative z-10">
        <div className="text-center space-y-3 mb-20">
          <span className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.25em] italic">Why Choose Nexora</span>
          <h2 className="text-3xl sm:text-5xl font-sans font-black uppercase tracking-tighter italic">THE QUANTUM ADVANTAGE</h2>
          <p className="text-slate-550 text-xs font-semibold italic max-w-lg mx-auto">Traditional marketing agencies rely on guesswork. We scale via advanced predictive metrics & automated CRM integration.</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Card 1 */}
          <div className="col-span-12 lg:col-span-7 bg-white/[0.02] border border-white/[0.06] hover:border-indigo-500/35 hover:bg-white/[0.04] p-8 rounded-3xl transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full filter blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
            <TrendingUp size={36} className="text-indigo-400 mb-6" />
            <h3 className="text-xl font-black uppercase tracking-tight italic text-white mb-3">INTELLIGENT AD ATTRIBUTION</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-semibold italic mb-4">
              Our backend tracking platform monitors every campaign hook down to the millisecond, bypassing iOS attribution lag so your scaling decisions are backed by authentic transaction data.
            </p>
            <div className="flex items-center gap-1.5 text-[9px] text-indigo-400 font-bold uppercase tracking-widest mt-auto">
              REAL-TIME INSIGHT ENGINE <ArrowUpRight size={10} />
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-span-12 lg:col-span-5 bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/35 hover:bg-white/[0.04] p-8 rounded-3xl transition-all relative overflow-hidden group">
            <Award size={36} className="text-purple-400 mb-6" />
            <h3 className="text-xl font-black uppercase tracking-tight italic text-white mb-3">HIGH-TICKET QUALIFICATION</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-semibold italic mb-4">
              We separate real buyers from the window shoppers. Our bespoke funnels capture ultra-qualified inquiries, reducing cold sales calls by 68%.
            </p>
            <div className="flex items-center gap-1.5 text-[9px] text-purple-400 font-bold uppercase tracking-widest mt-auto">
              AUTOMATED COMPLIANCE <ArrowUpRight size={10} />
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-span-12 lg:col-span-4 bg-white/[0.02] border border-white/[0.06] hover:border-pink-500/35 hover:bg-white/[0.04] p-8 rounded-3xl transition-all relative overflow-hidden group">
            <Monitor size={36} className="text-pink-400 mb-6" />
            <h3 className="text-xl font-black uppercase tracking-tight italic text-white mb-2">SHOPIFY SCALE Blueprints</h3>
            <p className="text-slate-400 text-xs leading-relaxed font-semibold italic">Our speed-optimized ecommerce designs yield an average conversion velocity spike of 35% within 30 days of launch.</p>
          </div>

          {/* Card 4 */}
          <div className="col-span-12 lg:col-span-8 bg-white/[0.02] border border-white/[0.06] hover:border-indigo-400/35 hover:bg-white/[0.04] p-8 rounded-3xl transition-all relative overflow-hidden group flex flex-col justify-between">
            <div className="flex items-start justify-between gap-6 mb-4">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight italic text-white mb-3">NexaSphere document Suite</h3>
                <p className="text-slate-400 text-xs leading-relaxed font-semibold italic">
                  Every partner unlocked. Access an elite visual back-office containing real-time Quotation, CV/Profile builders, and Money Receipt networks to coordinate billing, team clearances, and transaction histories beautifully.
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <Lock size={20} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {['CRM Control', 'PDF Quotation', 'Receipt Ledger', 'Clearance Ratios'].map(tag => (
                <span key={tag} className="text-[8px] font-mono px-2 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-black uppercase">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview Teaser */}
      <section className="bg-slate-950/20 border-t border-white/[0.03] py-28 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-3">
              <span className="text-[10px] text-indigo-405 font-black uppercase tracking-[0.25em] italic">Scalable Campaigns</span>
              <h2 className="text-3xl sm:text-5xl font-sans font-black uppercase tracking-tighter italic">OUR CORE PILLARS</h2>
            </div>
            <Link to="/services">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5"
              >
                View All 10 Services <ArrowUpRight size={14} />
              </motion.button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayedServices.map((srv: any, idx: number) => (
              <div 
                key={idx}
                className="bg-slate-950/40 border border-white/[0.05] hover:border-indigo-505 hover:bg-slate-950/80 p-8 rounded-[2rem] flex flex-col justify-between min-h-[250px] transition-all group"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 font-black uppercase text-xs">
                    0{idx+1}
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight italic text-white">{srv.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-semibold italic">{srv.desc || srv.description}</p>
                </div>
                <div className="pt-6 font-mono text-[9px] text-slate-500 uppercase tracking-widest mt-auto">
                  {srv.cat || "Campaign Elite"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="max-w-7xl mx-auto px-6 py-28 relative z-10">
        <div className="text-center space-y-3 mb-20">
          <span className="text-[10px] text-rose-400 font-black uppercase tracking-[0.25em] italic">Enterprise Validation</span>
          <h2 className="text-3xl sm:text-5xl font-sans font-black uppercase tracking-tighter italic">WHAT PARTNERS STATE</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              text: "Nexora took our store layout from standard template to high-end SaaS product look. In 30 days of campaign scaling and attribution fix, our ROAS went directly from 1.8x to 5.4x. Deeply impressed.",
              author: "Theron Miller",
              role: "CMO, Horizon Athletics",
              rating: 5
            },
            {
              text: "Having a beautifully unified workspace where we generate bills / PDF Quotations integrated inside the marketing system is a pure game changer. Highly responsive, world-class.",
              author: "Clara Vance",
              role: "Global Scaling Lead, Zenith Corp",
              rating: 5
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-[#03030f]/60 border border-white/[0.05] p-8 rounded-3xl relative h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(item.rating)].map((_, i) => <Star key={i} size={14} className="fill-yellow-500 text-yellow-500" />)}
                </div>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic font-medium">"{item.text}"</p>
              </div>
              <div className="flex items-center gap-3 pt-8 border-t border-white/[0.03] mt-8">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 shrink-0 font-black text-xs flex items-center justify-center text-white">
                  {item.author[0]}
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase italic tracking-tight">{item.author}</p>
                  <p className="text-[9px] text-slate-550 uppercase tracking-widest font-extrabold mt-0.5">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="bg-slate-950/20 border-y border-white/[0.04] py-28 relative z-10">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] text-purple-400 font-black uppercase tracking-[0.25em] italic">Cleared Disclosures</span>
            <h2 className="text-3xl sm:text-4xl font-sans font-black uppercase tracking-tighter italic">COMMON QUERY MATRIX</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="bg-slate-950/80 border border-white/[0.05] rounded-2xl overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className="text-xs sm:text-sm font-extrabold uppercase italic flex items-center gap-2">
                    <HelpCircle size={14} className="text-indigo-400" />
                    {faq.q}
                  </span>
                  <ChevronDown size={16} className={`text-slate-500 transition-transform ${faq.open ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {faq.open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/[0.03]"
                    >
                      <p className="p-6 text-slate-400 text-xs sm:text-sm leading-relaxed font-semibold italic bg-[#03030d]/30">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="max-w-5xl mx-auto px-6 py-28 relative z-10 text-center">
        <div className="bg-gradient-to-br from-indigo-950/70 via-purple-950/20 to-slate-950/80 border border-indigo-500/20 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1),transparent_70%)]" />
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-black italic uppercase tracking-tighter">
              READY TO SCALE YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">
                CAMPAIGNS TO MULTI-MILLIONS?
              </span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-semibold italic">
              Stop bleeding margins on low-performing ads. Collaborate with Nexora's international visual engineering team today to build a high-conversion client acquisition system.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <Link to="/contact" className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="w-full sm:w-auto bg-white text-slate-950 hover:bg-indigo-300 font-sans font-black text-xs uppercase tracking-widest px-10 py-4.5 rounded-2xl transition-all cursor-pointer"
                >
                  Schedule Free ROAS Audit
                </motion.button>
              </Link>
              <Link to="/admin" className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  className="w-full sm:w-auto bg-transparent text-white border border-white/20 hover:bg-white/[0.05] font-sans font-black text-xs uppercase tracking-widest px-10 py-4.5 rounded-2xl transition-all cursor-pointer"
                >
                  Authorize Admin Desk
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
