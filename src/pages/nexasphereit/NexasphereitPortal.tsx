import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Sparkles, Play, Video, FileText, Award, Calendar, 
  ArrowLeft, Phone, Mail, MapPin, ExternalLink, RefreshCw, 
  Flame, Clock, ShieldCheck, Heart, User, CheckCircle2, ChevronRight
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-hot-toast';

interface PortalUpdate {
  id: string;
  title: string;
  type: 'news' | 'offer' | 'video' | 'video_post' | 'content' | 'achievement';
  content: string;
  mediaUrl?: string;
  videoDuration?: string;
  badgeText?: string;
  dateString: string;
  createdAt?: any;
}

const defaultUpdates: PortalUpdate[] = [
  {
    id: 'mock_news_1',
    title: 'Collaborative Expansion Sealed with Shajgoj Brands',
    type: 'news',
    content: 'We have officially finalized our technical multi-channel cloud engine with Shajgoj. This optimization streamlines their localized cosmetics checkout pipelines, improving total ROAS ratio by 18%. The full campaign pipeline is scheduled for a live daily broadcast shortly.',
    dateString: '2026-06-02',
    badgeText: 'HOT UPDATE',
    mediaUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80'
  } as any,
  {
    id: 'mock_ach_1',
    title: 'Recognized as Top Enterprise Cloud IT Agency in South Asia',
    type: 'achievement',
    content: 'NexaSphere IT has been awarded the prestigious "High-Growth IT System Integrator Award" at the Regional Tech Gala 2026. This monumental achievement goes out to our incredible localized partners—Sikho, Seba, Chaldal, and PriyoShop—for entrusting our engineers with their operations.',
    dateString: '2026-06-01',
    badgeText: 'FUTURE ACHIEVED',
    mediaUrl: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=600&q=80'
  } as any,
  {
    id: 'mock_vid_1',
    title: 'Inside PriyoShop: Replatforming Bangladesh Retail Commerce',
    type: 'video_post',
    content: 'Watch how our unified document automation engine, NexaSphere, drives invoice dispatch efficiency for PriyoShop. In this interview, their lead operations supervisor explains how migrating metadata servers achieved a 35% performance booster.',
    dateString: '2026-05-30',
    badgeText: 'CAMPAIGN REVELATION',
    videoDuration: '4:15',
    mediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'
  } as any,
  {
    id: 'mock_vid_2',
    title: 'Chaldal Grocery Optimization & Smart Routing Demo',
    type: 'video',
    content: 'A detailed 3-minute technical run-through of the real-time routing nodes constructed for Chaldal. Learn how integrating Firestore geo-parameters on our backup server scaled their order fulfillment loops during high-traffic seasons.',
    dateString: '2026-05-28',
    badgeText: 'TECH CORNER',
    videoDuration: '3:02',
    mediaUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=600&q=80'
  } as any,
  {
    id: 'mock_content_1',
    title: 'The Blueprint to Zero-Downtime Migration for BD SaaS Hubs',
    type: 'content',
    content: 'A comprehensive engineering post outlining how to avoid memory leaks and websocket disconnects on sandboxed browser frames. We analyze real case studies from Rokomari and Sheba.xyz to guide full-stack web architectures.',
    dateString: '2026-05-25',
    badgeText: 'WHITE PAPER',
    mediaUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80'
  } as any,
  {
    id: 'mock_offer_1',
    title: 'Exclusive SLA onboarding Campaign Offer',
    type: 'offer',
    content: 'For the next 48 hours, NexaSphere IT has released 3 premium consultation spots with active ad hook templates. Connect with our principal cloud architect to receive a tailored ROAS feasibility chart free of retainer agreements.',
    dateString: '2026-06-02',
    badgeText: 'EXCLUSIVE REMIT',
    mediaUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80'
  } as any
];

export default function NexasphereitPortal() {
  const { settings } = useTheme();
  const navigate = useNavigate();
  const [activePortalTab, setActivePortalTab] = useState<'all' | 'news' | 'offers' | 'videos' | 'achievements' | 'content'>('all');
  const [updates, setUpdates] = useState<PortalUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<PortalUpdate | null>(null);

  // Stats Counters
  const [leadsCount, setLeadsCount] = useState(145);
  const [visitorsCount, setVisitorsCount] = useState(10480);
  const [activeIntegrations, setActiveIntegrations] = useState(6);

  useEffect(() => {
    // Smooth visitor simulator for premium dynamic feel
    const interval = setInterval(() => {
      setVisitorsCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchPortalUpdates = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'nexasphereit_portal_updates'));
      if (!snap.empty) {
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortalUpdate));
        // Sort by dateString descending, or createdAt custom fields
        list.sort((a, b) => b.dateString.localeCompare(a.dateString));
        setUpdates(list);
      } else {
        setUpdates(defaultUpdates);
      }
    } catch (e) {
      console.warn("Could not query live Firestore portal updates, falling back on custom defaults.", e);
      setUpdates(defaultUpdates);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalUpdates();
  }, []);

  // Filter updates by selected category tab
  const filteredUpdates = updates.filter(item => {
    if (activePortalTab === 'all') return true;
    if (activePortalTab === 'news') return item.type === 'news';
    if (activePortalTab === 'offers') return item.type === 'offer';
    if (activePortalTab === 'videos') return item.type === 'video' || item.type === 'video_post';
    if (activePortalTab === 'achievements') return item.type === 'achievement';
    if (activePortalTab === 'content') return item.type === 'content';
    return true;
  });

  return (
    <motion.div 
      initial={{ y: "-100%", opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: "-100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="min-h-screen bg-[#02020a] text-slate-100 relative overflow-hidden font-sans pt-20 pb-16 selection:bg-indigo-500/20"
    >
      {/* Background Cyber Mesh Glows */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-950/25 via-[#0c0926]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-[-100px] w-96 h-96 bg-pink-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-[-100px] w-80 h-80 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Grid cyber patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Portal top title bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-white/[0.06] mb-10">
          <div className="space-y-1.5 text-left">
            <div className="flex items-center gap-2">
              <span className="text-[9px] bg-indigo-550/10 text-indigo-400 font-extrabold px-3 py-1.5 rounded-full border border-indigo-400/25 uppercase tracking-[0.2em] font-mono">
                🔴 NexaSphere It Daily Live Bulletin
              </span>
              <span className="flex items-center gap-1 text-[9.5px] font-mono font-bold text-emerald-450 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full select-none animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> ONLINE STREAM
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase italic text-white flex items-center gap-2">
              Corporate Broadcast <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-indigo-400 to-pink-400">Portal</span>
            </h1>
            <p className="text-slate-455 text-xs font-semibold italic">
              Explore daily optimization news, custom platform offers, technical video posts, and verified team milestones.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchPortalUpdates}
              className="p-3 bg-white/[0.02] border border-white/[0.08] rounded-xl hover:bg-white/[0.06] transition-all text-slate-350 hover:text-white cursor-pointer"
              title="Refresh Bulletin Connection"
            >
              <RefreshCw size={15} className={loading ? "animate-spin text-indigo-400" : ""} />
            </button>
            
            <Link to="/">
              <button className="px-5 py-2.5 border border-white/[0.08] hover:border-white/[0.15] bg-white/[0.02] hover:bg-white/[0.05] rounded-xl font-bold uppercase text-[10px] tracking-widest text-[#cbd5e1] transition-all flex items-center gap-2 cursor-pointer">
                <ArrowLeft size={12} /> Exit Portal
              </button>
            </Link>
          </div>
        </div>

        {/* SPLIT SCREEN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* LEFT SIDE: HOMEPAGE DISPLAYED BEAUTIFULLY (4 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <div className="sticky top-28 space-y-6">
              
              {/* Premium Phone Frame Representation of Homepage Mockup */}
              <div className="bg-[#03030c] border border-white/[0.08] rounded-[2.5rem] p-4 shadow-2xl relative overflow-hidden group">
                
                {/* Visual Glow nodes on phone head and tail */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-5 bg-[#08081a] rounded-b-2xl border-x border-b border-white/[0.06] z-20 flex justify-center items-center">
                  <div className="w-16 h-1 bg-[#1a1a3a] rounded-full" />
                </div>
                
                {/* Background matrix mesh inside mockup */}
                <div className="absolute inset-0 bg-[#020207] -z-10" />
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-red-500/[0.015] rounded-full filter blur-3xl pointer-events-none" />
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500/[0.02] rounded-full filter blur-3xl pointer-events-none" />

                <div className="rounded-[2rem] border border-white/[0.04] bg-[#03030f]/60 backdrop-blur-md overflow-hidden relative text-left">
                  
                  {/* Dynamic interactive indicator floating */}
                  <div className="p-5 space-y-6 pt-8">
                    
                    {/* Header mock */}
                    <div className="flex justify-between items-center border-b border-white/[0.03] pb-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded bg-gradient-to-tr from-rose-500 to-indigo-500 flex items-center justify-center font-black text-[9px]">
                          N
                        </div>
                        <span className="text-[10px] uppercase font-black tracking-wider text-white">NexaSphere IT</span>
                      </div>
                      <span className="text-[8px] px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-indigo-400 font-mono font-bold">
                        AGENCY CONSOLE
                      </span>
                    </div>

                    {/* Hero summary mock */}
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-400/5 border border-indigo-400/10 rounded-full text-indigo-400 text-[8px] uppercase tracking-widest font-black">
                        <Sparkles size={8} className="animate-spin text-yellow-500" /> Leading South Asia Integrator
                      </div>
                      <h3 className="text-xl font-black uppercase italic tracking-tight text-white leading-tight">
                        TRANSFORMING <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-455 to-indigo-455">METRIC EFFICIENCY</span>
                      </h3>
                      <p className="text-slate-455 text-[10px] leading-relaxed font-medium">
                        World-class performance marketing meets cutting-edge enterprise analytics. We build, optimize, and scale ultra-luxury customer acquisition systems for international brands.
                      </p>
                    </div>

                    {/* Action buttons mock */}
                    <div className="flex gap-2">
                      <Link to="/contact" className="flex-1">
                        <button className="w-full py-2 bg-[#e11d48] text-white text-[9px] font-black uppercase tracking-wider rounded-lg transition-all hover:opacity-90 cursor-pointer">
                          Secure strategy
                        </button>
                      </Link>
                      <Link to="/services" className="flex-1">
                        <button className="w-full py-2 bg-white/[0.02] border border-white/[0.08] text-[#cbd5e1] text-[9px] font-black uppercase tracking-wider rounded-lg hover:bg-white/[0.06] transition-all cursor-pointer">
                          Our Blueprints
                        </button>
                      </Link>
                    </div>

                    {/* Integrated Partner Marks listed in prompt */}
                    <div className="space-y-2 pt-2 border-t border-white/[0.03]">
                      <span className="text-[7.5px] text-slate-500 font-black uppercase tracking-widest block font-mono">
                        NATIVE BANGLADESH PORTFOLIO INTEGRATIONS
                      </span>
                      <div className="grid grid-cols-3 gap-1.5 text-center text-[7.5px] font-mono font-black text-slate-400 uppercase italic">
                        <div className="p-1.5 bg-white/[0.01] border border-white/[0.03] rounded-md">Shikho</div>
                        <div className="p-1.5 bg-white/[0.01] border border-white/[0.03] rounded-md">Sheba.xyz</div>
                        <div className="p-1.5 bg-white/[0.01] border border-white/[0.03] rounded-md">Chaldal</div>
                        <div className="p-1.5 bg-white/[0.01] border border-white/[0.03] rounded-md">Shajgoj</div>
                        <div className="p-1.5 bg-white/[0.01] border border-white/[0.03] rounded-md">PriyoShop</div>
                        <div className="p-1.5 bg-white/[0.01] border border-white/[0.03] rounded-md">Khaas Food</div>
                      </div>
                    </div>

                    {/* Mini dynamic statistics list */}
                    <div className="grid grid-cols-3 gap-2 bg-[#040411]/80 border border-white/[0.03] p-3 rounded-xl text-center select-none font-mono">
                      <div>
                        <span className="block text-indigo-400 text-xs font-black">185M+</span>
                        <span className="text-[6.5px] text-slate-500 uppercase font-bold">ROAS Flow</span>
                      </div>
                      <div>
                        <span className="block text-rose-500 text-xs font-black">{visitorsCount}+</span>
                        <span className="text-[6.5px] text-slate-500 uppercase font-bold">Inbound Hits</span>
                      </div>
                      <div>
                        <span className="block text-emerald-450 text-xs font-black">99.7%</span>
                        <span className="text-[6.5px] text-slate-500 uppercase font-bold">SLA Deliver</span>
                      </div>
                    </div>

                    {/* Active nodes */}
                    <div className="space-y-1.5 pt-1 text-[8.5px] text-slate-500 font-semibold font-mono">
                      <div className="flex justify-between items-center bg-white/[0.01] p-1.5 px-2.5 rounded-lg">
                        <span>Database Stream Latency</span>
                        <span className="text-emerald-400 font-bold font-mono">11ms</span>
                      </div>
                      <div className="flex justify-between items-center bg-white/[0.01] p-1.5 px-2.5 rounded-lg">
                        <span>Secured Encryption Channels</span>
                        <span className="text-emerald-400 font-bold font-mono">HTTPS / TLS</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Slogan */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] text-left space-y-1 select-none">
                <span className="text-[8px] text-indigo-400 font-extrabold uppercase font-mono tracking-widest block">NexaSphere It Corporate Motto</span>
                <p className="text-[10px] text-slate-400 leading-relaxed font-semibold italic">
                  "Mathematical rigor over guesswork. Authentic integrations over simulation. Driving scalable client profitability."
                </p>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE: FEED PORTAL LIVE CHANNELS (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* Nav Filters Menu */}
            <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto">
              {[
                { id: 'all', label: 'All Updates', icon: Flame },
                { id: 'news', label: 'Daily News', icon: FileText },
                { id: 'offers', label: 'Corporate Offers', icon: Sparkles },
                { id: 'videos', label: 'Videos Posts', icon: Video },
                { id: 'achievements', label: 'Achievements', icon: Trophy },
                { id: 'content', label: 'Knowledge posts', icon: Award }
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activePortalTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActivePortalTab(tab.id as any);
                      setPlayingVideo(null);
                    }}
                    className={`px-4.5 py-2.5 rounded-xl font-bold uppercase text-[9.5px] tracking-wider transition-all flex items-center gap-1.5 cursor-pointer relative ${
                      isSelected 
                        ? "bg-indigo-550 border border-indigo-400/50 text-white shadow-lg shadow-indigo-550/15 font-extrabold"
                        : "bg-[#060613]/80 border border-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.02]"
                    }`}
                  >
                    <Icon size={12} className={isSelected ? "text-white" : "text-indigo-400"} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Video Player overlay if a video is being played */}
            <AnimatePresence>
              {playingVideo && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-black/90 border border-[#e11d48]/40 overflow-hidden rounded-[2rem] p-6 relative flex flex-col items-center justify-center text-center space-y-4"
                >
                  <button 
                    onClick={() => setPlayingVideo(null)}
                    className="absolute top-4 right-4 text-xs font-bold bg-white/[0.08] hover:bg-white/[0.15] px-3 py-1 rounded-lg uppercase tracking-wider text-slate-350 hover:text-white cursor-pointer"
                  >
                    Close Player
                  </button>
                  
                  {/* Cyber glowing audio video analyzer loop */}
                  <div className="w-full h-44 bg-[#0a0715] rounded-2xl flex flex-col items-center justify-center border border-white/[0.03] relative overflow-hidden p-6 mt-4">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(225,29,72,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(225,29,72,0.015)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20" />
                    
                    <div className="flex gap-1 items-end justify-center h-12 w-40">
                      {[6, 12, 18, 8, 22, 14, 25, 12, 28, 16, 8, 14, 18, 10, 6].map((h, i) => (
                        <motion.div 
                          key={i} 
                          animate={{ height: [8, h, 8] }} 
                          transition={{ repeat: Infinity, duration: 1.2 + (i * 0.05), ease: "easeInOut" }}
                          className="w-1.5 bg-gradient-to-t from-indigo-500 via-rose-500 to-pink-500 rounded-full" 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-[#e11d48] uppercase tracking-[0.2em] font-black mt-4 flex items-center gap-2 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-[#e11d48] animate-ping" /> SECURE STREAMING DATA FEED
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono italic mt-1 select-none">
                      Playing: {playingVideo.title} ({playingVideo.videoDuration || "03:45"})
                    </span>
                  </div>

                  <div className="space-y-1 text-left w-full px-2">
                    <p className="text-[10px] font-mono text-[#e11d48] font-black uppercase tracking-wider">NOW PLAYING STREAM</p>
                    <h4 className="text-sm font-black text-white uppercase italic">{playingVideo.title}</h4>
                    <p className="text-[11px] text-slate-400 italic font-medium leading-relaxed mt-1">"{playingVideo.content}"</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Updates list mapping */}
            <div className="space-y-5">
              {loading ? (
                <div className="py-24 text-center space-y-4">
                  <RefreshCw className="animate-spin text-indigo-400 mx-auto" size={32} />
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest animate-pulse">Syncing dynamic bulletins...</p>
                </div>
              ) : filteredUpdates.length === 0 ? (
                <div className="p-16 text-center border border-dashed border-white/[0.08] rounded-3xl bg-white/[0.01] space-y-4">
                  <div className="w-12 h-12 bg-white/[0.03] border border-white/[0.08] rounded-full flex items-center justify-center text-slate-500 mx-auto">
                    <Award size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-450 tracking-wider">No Bulletin Found</h4>
                    <p className="text-[10.5px] text-slate-500 italic mt-1 max-w-[280px] mx-auto">
                      There are no updates posted in this category yet. Visit the backend Admin screen to populate fresh updates!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4.5 text-left">
                  {filteredUpdates.map((item, idx) => {
                    const isVideoType = item.type === 'video' || item.type === 'video_post';
                    const isAchievement = item.type === 'achievement';
                    const isOffer = item.type === 'offer';
                    const isNews = item.type === 'news';

                    // Dynamic Badges & color palettes
                    let badgeColor = "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
                    if (isAchievement) badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
                    if (isOffer) badgeColor = "bg-rose-500/10 text-rose-455 border-rose-500/20 animate-pulse";
                    if (isVideoType) badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

                    return (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={item.id}
                        className="bg-[#050513]/85 border border-white/[0.04] p-5.5 rounded-3xl relative overflow-hidden hover:border-indigo-500/20 transition-all shadow-md group"
                      >
                        {/* Shimmer gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/[0.015] to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out pointer-events-none" />

                        <div className="flex flex-col md:flex-row gap-5 items-start">
                          
                          {/* Thumbnail if provided, else customizable layout icon */}
                          {item.mediaUrl ? (
                            <div className="w-full md:w-36 h-28 rounded-2xl overflow-hidden relative shrink-0 border border-white/[0.06] bg-slate-950 select-none">
                              <img 
                                src={item.mediaUrl || undefined} 
                                alt={item.title} 
                                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                                referrerPolicy="no-referrer"
                              />
                              {isVideoType && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                  <div className="w-8 h-8 rounded-full bg-[#e11d48] flex items-center justify-center text-white shadow-lg animate-pulse">
                                    <Play size={12} className="fill-current ml-0.5" />
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center shrink-0 text-indigo-400">
                              {isAchievement && <Trophy className="text-amber-400 animate-bounce" size={20} />}
                              {isOffer && <Sparkles className="text-rose-400" size={20} />}
                              {isNews && <FileText size={20} />}
                              {isVideoType && <Video size={20} />}
                            </div>
                          )}

                          {/* Body context */}
                          <div className="flex-1 space-y-2 text-left">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded border ${badgeColor}`}>
                                {item.badgeText || item.type.toUpperCase()}
                              </span>
                              
                              <span className="text-[10px] text-slate-500 font-mono font-bold flex items-center gap-1 leading-none">
                                <Calendar size={10} /> {item.dateString}
                              </span>

                              {isVideoType && item.videoDuration && (
                                <span className="text-[9.5px] font-mono font-bold bg-white/[0.03] text-slate-400 px-2 py-0.5 rounded border border-white/[0.08]">
                                  ⏱️ {item.videoDuration}
                                </span>
                              )}
                            </div>

                            <h3 className="text-md font-black uppercase text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                              {item.title}
                            </h3>

                            <p className="text-slate-400 text-xs italic font-medium leading-relaxed p-3 bg-white/[0.01] rounded-2xl border border-white/[0.02]">
                              "{item.content}"
                            </p>

                            {/* Buttons actions */}
                            <div className="pt-1 flex justify-between items-center text-[10px] font-mono">
                              <span className="text-slate-500 font-bold uppercase tracking-wider">
                                NEXASPHERE COMMUNICATOR
                              </span>

                              {isVideoType ? (
                                <button
                                  onClick={() => {
                                    setPlayingVideo(item);
                                    window.scrollTo({ top: 300, behavior: 'smooth' });
                                    toast.success(`Launching Stream: ${item.title}`);
                                  }}
                                  className="px-3.5 py-1.5 rounded-lg bg-[#e11d48] text-white hover:bg-rose-600 font-black tracking-widest uppercase text-[8.5px] flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-lg shadow-[#e11d48]/15"
                                >
                                  <Play size={10} className="fill-current" /> Play Video Post
                                </button>
                              ) : (
                                <span className="text-slate-500 italic text-[9px] flex items-center gap-1">
                                  Synchronized with backend <CheckCircle2 size={10} className="text-indigo-400" />
                                </span>
                              )}
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </motion.div>
  );
}
