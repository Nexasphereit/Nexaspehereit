import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUpRight, BarChart3, Star, Filter, Sparkles, Eye, 
  MessageSquare, LayoutGrid, X, Trash, Layers, Activity 
} from 'lucide-react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';

export default function NexoraPortfolio() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [pagesConfig, setPagesConfig] = useState({
    portfolioCapsule: 'OUR HISTORIC GROWTH STORY',
    portfolioTitle: 'VERIFIED BRAND ACHIEVEMENTS',
    portfolioSubtitle: 'See how we turned confusion into high performance. Click any card below to launch the verified customer story and campaign metrics.'
  });

  // Static core campaigns
  const coreProjects = [
    {
      id: "proj-1",
      title: "Dhaka Fashion Hub",
      cat: "Social Design",
      roas: "4.5x CTR Gain",
      before: "0.8% Click rate",
      after: "4.3% Click rate",
      feedback: "NexaSphere completely handled our custom post layout templates. The new grid color themes and gorgeous ad banners make our products look ultra premium.",
      client: "Nusrat Jahan, Owner",
      description: "Custom social media post designs, banner typography, and brand catalog templates."
    },
    {
      id: "proj-2",
      title: "Rokomari Growth Campaign",
      cat: "Paid Ads",
      roas: "6.8x Sales Scale",
      before: "৳৪৮,০০০ per week",
      after: "৳৩,২০,০০০ per week",
      feedback: "Their Facebook & TikTok direct response campaigns changed our business. Their audio-aligned visual video hooks delivered a massive flow of automated leads.",
      client: "Sumit Saha, Campaign Lead",
      description: "Facebook Ads, viral TikTok video hooks, and CBO multi-tier acquisition funnels."
    },
    {
      id: "proj-3",
      title: "Chaldal Grocery SEO",
      cat: "SEO & Code",
      roas: "5.2x Organic Boost",
      before: "3,200 search visitors",
      after: "21,500 search visitors",
      feedback: "Our page now ranks at the absolute top of major Google Search queries. They completely rebuilt our layout for responsive mobile speeds.",
      client: "Shafiqul Alam, Director",
      description: "Google SEO services, structured schemas, semantic indexing, and fast Website Development."
    },
    {
      id: "proj-4",
      title: "Seba Care Brand Ads",
      cat: "Paid Ads",
      roas: "7.1x Click Growth",
      before: "৳১,২০,০০০ spent with low sales",
      after: "৳৮,৫০,০০০ revenue captured",
      feedback: "Unrivaled direct-response strategy. Their Google Ads Display network integration and customer audience setups converted confused traffic into real orders.",
      client: "Imran Hasan, Director",
      description: "Google Ads, Google Merchant display setups, and targeted Facebook ads."
    }
  ];

  useEffect(() => {
    const fetchProjectsAndConfigs = async () => {
      try {
        const snap = await getDocs(collection(db, 'nexora_portfolio'));
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDbProjects(list);

        // Fetch custom pages configuration
        const pDoc = await getDoc(doc(db, 'nexora_config', 'pages_config'));
        if (pDoc.exists()) {
          setPagesConfig(p => ({ ...p, ...pDoc.data() }));
        } else {
          const backupPages = localStorage.getItem('nexora_pages_backup');
          if (backupPages) setPagesConfig(JSON.parse(backupPages));
        }
      } catch (e) {
        console.warn("Could not load backend portfolio/configs in Portfolio Page:", e);
        const backupPages = localStorage.getItem('nexora_pages_backup');
        if (backupPages) setPagesConfig(JSON.parse(backupPages));
      } finally {
        setLoading(false);
      }
    };
    fetchProjectsAndConfigs();
  }, []);

  // Merge static with dynamic database assets
  const allProjects = [...coreProjects, ...dbProjects];
  
  const filteredProjects = activeFilter === 'All' 
    ? allProjects 
    : allProjects.filter(p => p.cat === activeFilter);

  return (
    <div className="min-h-screen bg-[#02020a] text-white pt-24 pb-20 relative overflow-hidden font-sans">
      {/* Decorative Blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
        {/* Intro */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] text-pink-400 font-black uppercase tracking-[0.25em] italic">{pagesConfig.portfolioCapsule}</span>
          <h1 className="text-4xl sm:text-5xl font-sans font-black italic uppercase tracking-tighter">
            {pagesConfig.portfolioTitle}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-semibold italic">
            {pagesConfig.portfolioSubtitle}
          </p>
        </section>

        {/* Filter Toolbar */}
        <section className="flex flex-wrap items-center justify-center gap-3">
          {['All', 'Paid Ads', 'Social Design', 'SEO & Code'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2.5 rounded-2xl text-xs uppercase font-black tracking-widest transition-all ${
                activeFilter === filter 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'bg-white/[0.03] text-slate-400 border border-white/[0.05] hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </section>

        {/* Portfolio Stagger Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((p: any) => (
            <motion.div
              layout
              key={p.id}
              onClick={() => setSelectedProject(p)}
              className="bg-slate-950/60 hover:bg-slate-950/95 border border-white/[0.05] hover:border-indigo-500/35 rounded-[2.5rem] p-8 cursor-pointer transition-all flex flex-col justify-between group relative overflow-hidden h-[340px]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-black uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded text-indigo-400">
                    {p.cat}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-black italic">
                    <Activity size={12} className="animate-pulse" />
                    {p.roas}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase italic tracking-tight text-white group-hover:text-indigo-400 transition-all flex items-center gap-2">
                    {p.title}
                    <Eye size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 ml-1 shrink-0" />
                  </h3>
                  <p className="text-slate-450 text-xs font-semibold italic max-w-sm truncate">
                    {p.description || "Active growth retainer program with analytics."}
                  </p>
                </div>

                {/* Before / After results comparative blocks */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/[0.03]">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">Initial State</p>
                    <p className="text-xs font-extrabold text-slate-400 line-through mt-0.5">{p.before || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-emerald-500">Scaled State</p>
                    <p className="text-xs font-extrabold text-[#10b981] mt-0.5">{p.after || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-auto text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">
                CLICK TO LAUNCH FEEDBACK SUMMARY
              </div>
            </motion.div>
          ))}
        </section>
      </div>

      {/* PORTFOLIO ACCORDION PREVIEW POPUP MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 px-6"
            />
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-slate-950 border border-indigo-500/25 p-8 rounded-[2.5rem] z-50 text-left space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">{selectedProject.cat}</span>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl font-black italic uppercase text-white">{selectedProject.title}</h3>
                <p className="text-slate-400 text-xs font-semibold italic">{selectedProject.description}</p>
              </div>

              {/* Verified results */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl text-center">
                <div>
                  <p className="text-[8px] text-slate-500 font-black uppercase tracking-wider">Before</p>
                  <p className="text-xs font-black text-rose-500 mt-1 line-through">{selectedProject.before}</p>
                </div>
                <div>
                  <p className="text-[8px] text-emerald-500 font-black uppercase tracking-wider">ROAS Level</p>
                  <p className="text-xs font-black text-emerald-400 mt-1">{selectedProject.roas}</p>
                </div>
                <div>
                  <p className="text-[8px] text-emerald-500 font-black uppercase tracking-wider">Revenue Exit</p>
                  <p className="text-xs font-black text-emerald-400 mt-1">{selectedProject.after}</p>
                </div>
              </div>

              {/* Client commentary */}
              <div className="space-y-2 pt-2">
                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">CHANNELS FEEDBACK</h4>
                <div className="p-4 bg-indigo-600/[0.05] border border-indigo-500/10 rounded-2xl relative">
                  <p className="text-xs text-slate-350 italic font-semibold leading-relaxed">
                    "{selectedProject.feedback}"
                  </p>
                  <p className="text-[10px] font-extrabold text-white mt-3 uppercase tracking-tight italic">— {selectedProject.client || "Verified CEO"}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedProject(null)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black py-4 uppercase tracking-widest rounded-2xl transition-all"
              >
                Close Verification Modal
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
