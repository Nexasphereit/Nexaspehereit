import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, Globe, BarChart3, Target, Sparkles, Cpu, 
  Monitor, LayoutGrid, Award, Film, Edit, Send, PlusCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';
import { useSEO } from '../../hooks/useSEO';

export default function NexoraServices() {
  // High efficiency dynamic SEO hooks integration
  useSEO({
    title: 'Digital Marketing & SEO Services | NexaSphere IT Dhaka',
    description: 'Explore high-performance digital marketing services by NexaSphere IT (nexasphereit). We deliver expert local SEO, target Google PPC, high-ROAS Facebook & TikTok ads, custom landing page development, and creative social poster designs.',
    keywords: 'digital marketing services Bangladesh, local SEO services Dhaka, Facebook advertising agency, Google Ads management BD, social media post design, TikTok marketing agency Bangladesh, landing page design Dhaka, custom ecommerce websites',
    canonical: 'https://nexasphere.it/services',
    ogTitle: 'Digital Marketing & SEO Services | NexaSphere IT Dhaka',
    ogDescription: 'We build high-converting landing pages, scale Meta and Google PPC campaigns, rank search keywords organically, and design professional social media banners designed for revenue.',
    lang: 'en'
  });

  const [dbServices, setDbServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagesConfig, setPagesConfig] = useState({
    servicesCapsule: 'ELITE MARKETING SYSTEMS',
    servicesTitle: 'HIGH-PERFORMANCE DIGITAL ACQUISITION',
    servicesSubtitle: 'Explore our specialized marketing protocols designed to scale your business. We engineer beautifully persuasive social designs, high-yielding paid ad funnels, and organic search strategies that convert visitors into active customers.',
    servicesCtaText: 'Launch Campaign',
    servicesCtaLink: '/contact'
  });

  // Core list of designated agency services focused on Digital Marketing & Creative Growth
  const coreServices = [
    {
      id: "social-design",
      title: "Social Media Post Design",
      desc: "Premium, visually striking graphic layouts, banners, and interactive carousels for Facebook, Instagram, and LinkedIn designed to tell a beautiful brand story and stop scrolling immediately.",
      features: ["Custom Post Templates", "Brand Graphics Mastery", "Engaging Carousel Designs"],
      cat: "Social Presence",
      color: "#ec4899"
    },
    {
      id: "fb-ads",
      title: "Facebook Ads",
      desc: "Architecting elite high-intent social campaigns with precise custom pixel tracking, target lookup setups, and systematic creative testing to double your brand sales.",
      features: ["ROI scaling campaigns", "CBO & ABO configuration", "Audience lookalike funnels"],
      cat: "Paid Campaigns",
      color: "#3b82f6"
    },
    {
      id: "tiktok-ads",
      title: "TikTok Ads & Reels",
      desc: "Drive massive engagement with high-conversion short video layouts, viral hook editing, and gen-z content templates strictly designed to boost product sales.",
      features: ["3-Second Retentive Hook", "In-App Pixel Calibration", "Viral Sound & Trend Sync"],
      cat: "Short Video Growth",
      color: "#06b6d4"
    },
    {
      id: "google-ads",
      title: "Google Ads & PPC Search",
      desc: "Maximize high-intent search acquisition, smart merchant display feeds, and target keywords to position your business directly in front of active buyers.",
      features: ["Semantic Intent Targeting", "Performance Max Setup", "Dynamic Search Optimizers"],
      cat: "Direct Intent Match",
      color: "#ef4444"
    },
    {
      id: "seo",
      title: "SEO Services",
      desc: "Sustained website authority through structured semantic content architecture, technical metadata reviews, and ranking parameters to put you at the top of Google.",
      features: ["High-Authority Keywords", "Speed & Schema Audits", "Programmatic Page Ranks"],
      cat: "Organic Placement",
      color: "#10b981"
    },
    {
      id: "web-dev",
      title: "Website Development",
      desc: "Lightning fast, responsive portfolio sites, sales landing pages, and interactive stores designed with clean code that turn raw visitors into dedicated buyers.",
      features: ["Tailwind & React Engines", "Mobile Responsive Touchpoints", "Speed Optimization 99+"],
      cat: "High-Speed Funnels",
      color: "#8b5cf6"
    }
  ];

  useEffect(() => {
    const fetchServicesAndConfigs = async () => {
      try {
        const snap = await getDocs(collection(db, 'nexora_services'));
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDbServices(list);

        // Fetch custom pages values
        const pDoc = await getDoc(doc(db, 'nexora_config', 'pages_config'));
        if (pDoc.exists()) {
          setPagesConfig(p => ({ ...p, ...pDoc.data() }));
        } else {
          const backupPages = localStorage.getItem('nexora_pages_backup');
          if (backupPages) setPagesConfig(JSON.parse(backupPages));
        }
      } catch (e) {
        console.warn("Could not load backend services/configs in Services Page:", e);
        const backupPages = localStorage.getItem('nexora_pages_backup');
        if (backupPages) setPagesConfig(JSON.parse(backupPages));
      } finally {
        setLoading(false);
      }
    };
    fetchServicesAndConfigs();
  }, []);

  return (
    <div className="min-h-screen bg-[#02020a] text-white pt-24 pb-20 relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
        {/* Intro */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] text-indigo-405 font-black uppercase tracking-[0.25em] italic">{pagesConfig.servicesCapsule}</span>
          <h1 className="text-4xl sm:text-5xl font-sans font-black italic uppercase tracking-tighter">
            {pagesConfig.servicesTitle}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-semibold italic">
            {pagesConfig.servicesSubtitle}
          </p>
        </section>

        {/* 10 Core Services Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coreServices.map((srv, idx) => (
            <div 
              key={srv.id}
              className="bg-slate-950/20 hover:bg-slate-950/85 border border-white/[0.04] hover:border-indigo-500/35 p-8 rounded-[2.5rem] flex flex-col justify-between min-h-[360px] transition-all group relative overflow-hidden"
            >
              {/* Corner Glow based on service theme */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-[0.02] group-hover:opacity-[0.08] blur-xl transition-opacity pointer-events-none"
                style={{ backgroundColor: srv.color }}
              />

              <div className="space-y-6">
                {/* Header tag */}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-black uppercase tracking-widest bg-white/[0.03] border border-white/[0.05] px-2.5 py-1 rounded-md text-slate-400">
                    {srv.cat}
                  </span>
                  <span className="text-[10px] font-black text-slate-600">
                    0{idx+1}
                  </span>
                </div>

                <h3 className="text-xl font-black uppercase italic tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                  {srv.title}
                </h3>

                <p className="text-slate-400 text-xs leading-relaxed font-semibold italic">
                  {srv.desc}
                </p>

                {/* Bullet list of features requested */}
                <ul className="space-y-2 pt-2">
                  {srv.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2 text-[10px] text-slate-350 font-bold uppercase tracking-wider">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" style={{ backgroundColor: srv.color }} />
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-8 border-t border-white/[0.03] mt-8 flex items-center justify-between">
                <Link to={`${pagesConfig.servicesCtaLink || "/contact"}?service=${encodeURIComponent(srv.title)}`} className="text-[10px] font-black uppercase tracking-widest text-indigo-400 group-hover:text-white flex items-center gap-1 font-mono">
                  {pagesConfig.servicesCtaText || "Enquire Campaign"} <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div 
                  className="w-1.5 h-1.5 rounded-full animate-ping shrink-0"
                  style={{ backgroundColor: srv.color }}
                />
              </div>
            </div>
          ))}
        </section>

        {/* ADMIN DYNAMIC SERVICES SECTION */}
        {dbServices.length > 0 && (
          <section className="space-y-12">
            <div className="pt-16 border-t border-white/[0.05]">
              <div className="flex items-center gap-3 mb-3">
                <PlusCircle className="text-rose-500 w-5 h-5 animate-pulse" />
                <span className="text-[10px] text-rose-400 font-mono font-black uppercase tracking-[0.25em]">Custom Backoffice Retainers</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter">CONFIGURED CLIENT BLUEPRINTS</h2>
              <p className="text-slate-550 text-xs font-semibold italic mt-1">These special customized services were seeded directly from the admin panel:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dbServices.map((srv: any) => (
                <div 
                  key={srv.id}
                  className="bg-rose-500/[0.01] hover:bg-rose-500/[0.03] border border-rose-500/10 hover:border-rose-550 p-8 rounded-[2rem] flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono font-black px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 uppercase tracking-widest border border-rose-500/20">Custom Seeding</span>
                      <span className="text-xs font-mono font-bold text-slate-400">{srv.price ? `Price: ${srv.price}` : 'Retainer'}</span>
                    </div>
                    <h3 className="text-lg font-black uppercase italic tracking-tight text-white">{srv.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed font-semibold italic">{srv.desc || srv.description}</p>
                    
                    {srv.featuresList && srv.featuresList.trim() && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {srv.featuresList.split(',').map((f: string, i: number) => (
                          <span key={i} className="text-[8px] bg-white/[0.03] text-slate-350 font-black uppercase tracking-widest px-2 py-1 rounded border border-white/[0.05]">
                            {f.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-white/[0.03] mt-6 flex items-center justify-between">
                    <Link to="/contact" className="text-[10px] font-black uppercase tracking-widest text-rose-400">
                      Enquire Custom Bundle
                    </Link>
                    <span className="text-[8px] uppercase tracking-widest font-black text-rose-500">Live Custom</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
