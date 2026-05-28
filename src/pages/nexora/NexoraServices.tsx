import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, Globe, BarChart3, Target, Sparkles, Cpu, 
  Monitor, LayoutGrid, Award, Film, Edit, Send, PlusCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';

export default function NexoraServices() {
  const [dbServices, setDbServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Core list of 10 designated agency services
  const coreServices = [
    {
      id: "fb-ads",
      title: "Facebook Ads",
      desc: "Architecting elite high-volume social campaigns, custom tracking configurations, and systematic creative testing formats to output maximum qualified acquisition.",
      features: ["Custom CPA Cap Strategy", "CBO/ABO Scientific Scaling", "UGC Creative Frameworks"],
      cat: "Paid Acquisition",
      color: "#3b82f6"
    },
    {
      id: "google-ads",
      title: "Google Ads & PPC",
      desc: "Maximize high-intent search capture, visual merchant shopping, and Performance Max channels targeted directly at ready-to-purchase prospect cohorts.",
      features: ["Semantic Intent Bidding", "P-Max Campaign Design", "Structured Asset Optimization"],
      cat: "Search Capture",
      color: "#ef4444"
    },
    {
      id: "seo",
      title: "Search Engine Optimization (SEO)",
      desc: "Gain sustained, authority-dripping organic acquisition. We design programmatic semantic articles, technical schemas, and speed optimization audits.",
      features: ["Advanced Crawler Tuning", "Thematic Content Architecture", "Bespoke Backlink Blueprinting"],
      cat: "Organic Placement",
      color: "#10b981"
    },
    {
      id: "smm",
      title: "Social Media Marketing",
      desc: "Maintain constant narrative presence. We structure multi-platform organic calendars, community response systems, and active social profiles built to engage.",
      features: ["Dynamic Feed Aesthetics", "Audience Engagement Matrices", "Viral Pattern Hooks"],
      cat: "Brand Authority",
      color: "#eab308"
    },
    {
      id: "shopify-design",
      title: "Shopify Store Design",
      desc: "Bespoke storefronts styled with high-contrast UI details, speed improvements, and modular shopping mechanics built to double average order value.",
      features: ["AOV Upgrade Cart Sliders", "Ultra-Light Speed Scores", "Conversion-Optimized Layouts"],
      cat: "Digital Storefront",
      color: "#14b8a6"
    },
    {
      id: "web-dev",
      title: "Website Development",
      desc: "Secure, fully typed Next.js and React enterprise sites designed to optimize desktop-to-mobile load intervals and visual interface flows.",
      features: ["Tailwind & TypeScript Core", "Advanced SEO Semantic Nodes", "Custom API Integrations"],
      cat: "Full-Stack Tech",
      color: "#8b5cf6"
    },
    {
      id: "funnel-building",
      title: "Funnel Building",
      desc: "Develop hyper-targeted single product Lander architectures, upsell matrices, checkout redirects, and behavioral abandonment emails.",
      features: ["Click-Through Rate Spikes", "Dynamic 1-Click Upsells", "Continuous Checkout Audits"],
      cat: "Conversion Optimization",
      color: "#ec4899"
    },
    {
      id: "branding",
      title: "Branding & Visual Language",
      desc: "Establish your category supremacy. We construct world-class vector branding, color frameworks, standard typographies, and digital guidelines.",
      features: ["Corporate Identity Guidelines", "Premium Component Outlines", "SVG Icon System Assets"],
      cat: "Creative Blueprint",
      color: "#f97316"
    },
    {
      id: "video-editing",
      title: "Video Editing & Content Ads",
      desc: "Our creative hook editors forge eye-safe viral hooks, sound layouts, and visual texts strictly matched to stop the user scroll immediately.",
      features: ["0-3s Retentive Hook Engineering", "Immersive Audio Soundscapes", "UGC Direct Response Editing"],
      cat: "Creative Production",
      color: "#06b6d4"
    },
    {
      id: "content-marketing",
      title: "Content Marketing",
      desc: "High-value corporate reports, infographics, and technical articles designed to nurture prospects and convert cold searches to premium retainers.",
      features: ["High-Authority Infographics", "Behavioral Email Nurtures", "Lead Magnet E-Books"],
      cat: "Inbound Capture",
      color: "#6366f1"
    }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snap = await getDocs(collection(db, 'nexora_services'));
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDbServices(list);
      } catch (e) {
        console.warn("Could not load backend services in Services Page:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-[#02020a] text-white pt-24 pb-20 relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
        {/* Intro */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] text-indigo-405 font-black uppercase tracking-[0.25em] italic">OUR SCALE MATRIX</span>
          <h1 className="text-4xl sm:text-5xl font-sans font-black italic uppercase tracking-tighter">
            SCALABLE ACQUISITION BLUEPRINTS
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-semibold italic">
            Each service card details our standard metrics parameters. Browse our 10 primary digital capabilities, or configure special bundles below.
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
                <Link to={`/contact?service=${encodeURIComponent(srv.title)}`} className="text-[10px] font-black uppercase tracking-widest text-indigo-400 group-hover:text-white flex items-center gap-1">
                  Enquire Campaign <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
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
