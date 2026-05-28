import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, BookOpen, Clock, ArrowRight, ArrowUpRight, 
  Send, Sparkles, Filter, ChevronRight, Hash 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'react-hot-toast';

export default function NexoraBlog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [dbBlogs, setDbBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailSub, setEmailSub] = useState('');

  // Core static curated blogs
  const staticBlogs = [
    {
      id: "blog-1",
      title: "The 3-Second Hook Rule for Meta Ads Scaling",
      desc: "An analytical study of over $12M in paid social campaigns, proving why direct response hooks are the only factor driving direct CPA outcomes.",
      cat: "Paid Ads",
      read: "5 mins read",
      date: "May 24, 2026",
      featured: true,
      author: "Julian Sterling"
    },
    {
      id: "blog-2",
      title: "How to Build Speed-Optimized Shopify Product Pages",
      desc: "Step-by-step audit showing how to optimize modern images, clean useless Javascript files, and double layout load velocity thresholds.",
      cat: "Shopify",
      read: "8 mins read",
      date: "May 18, 2026",
      featured: false,
      author: "Dax Thornton"
    },
    {
      id: "blog-3",
      title: "Designing Multi-Platform Retuning Funnel Architectures",
      desc: "Nurture cold traffic before proposing products. Learn how the proper sequence of content assets builds long-term buyer trust.",
      cat: "Funnels",
      read: "11 mins read",
      date: "May 10, 2026",
      featured: false,
      author: "Sienna Martinez"
    }
  ];

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const snap = await getDocs(collection(db, 'nexora_blog'));
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDbBlogs(list);
      } catch (e) {
        console.warn("Could not load backend blogs in Blog Page:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub.trim() || !emailSub.includes('@')) {
      toast.error("Please enter a valid email address!");
      return;
    }
    toast.success("Subscribed! Watch out for our first conversion report on Monday.");
    setEmailSub('');
  };

  const allBlogs = [...staticBlogs, ...dbBlogs];

  // Filters 
  const filteredBlogs = allBlogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'All' || b.cat === activeCategory;
    return matchesSearch && matchesCat;
  });

  const featuredPost = allBlogs.find(b => b.featured) || allBlogs[0];
  const regularPosts = filteredBlogs.filter(b => b.id !== featuredPost?.id);

  return (
    <div className="min-h-screen bg-[#02020a] text-white pt-24 pb-20 relative overflow-hidden font-sans">
      {/* Background Ornaments */}
      <div className="absolute top-1/4 right-[10%] w-[500px] h-[500px] bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-[10%] w-[600px] h-[600px] bg-purple-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
        {/* Intro */}
        <section className="text-center max-w-2xl mx-auto space-y-4">
          <span className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.25em] italic">INSIGHTS MATRIX & MANUALS</span>
          <h1 className="text-4xl sm:text-5xl font-sans font-black italic uppercase tracking-tighter">
            GROWTH EDITORIAL KNOWLEDGE
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-semibold italic">
            Written directly by our executive partners. Subscribe below to receive advanced metrics reports and UGC ad hook concepts.
          </p>
        </section>

        {/* Featured Post Block Hero */}
        {featuredPost && activeCategory === 'All' && !searchQuery && (
          <section className="bg-slate-950/60 border border-indigo-500/20 hover:border-indigo-500/45 rounded-[2.5rem] p-8 lg:p-12 relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-505/5 rounded-full filter blur-3xl" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left relative z-10">
              <div className="lg:col-span-7 space-y-6">
                <span className="text-[8px] font-mono font-black uppercase tracking-[0.25em] px-3 py-1 bg-indigo-500/15 border border-indigo-500/20 rounded-md text-indigo-400 inline-block animate-pulse">FEATURED INSIGHT REPORT</span>
                <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight italic leading-tight text-white">
                  {featuredPost.title}
                </h3>
                <p className="text-slate-450 text-xs sm:text-sm leading-relaxed font-semibold italic">
                  {featuredPost.desc}
                </p>
                <div className="flex items-center gap-6 pt-4 text-[10px] font-mono text-slate-500 font-black uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><Clock size={12} className="text-indigo-400" /> {featuredPost.read || '5 mins'}</span>
                  <span>By {featuredPost.author || 'Sterling Architect'}</span>
                  <span className="bg-white/[0.04] px-2.5 py-1 rounded text-slate-400 border border-white/[0.03]">{featuredPost.cat}</span>
                </div>
              </div>
              <div className="lg:col-span-5 flex justify-end">
                <Link to="/contact">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="bg-white text-slate-950 hover:bg-slate-200 text-xs font-black px-8 py-4 uppercase tracking-widest rounded-2xl flex items-center gap-2"
                  >
                    Discuss Campaign Scaling
                    <ArrowUpRight size={16} />
                  </motion.button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Search and Category Control Bar */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/[0.04] pb-8 pt-4 text-left">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Paid Ads', 'Shopify', 'Funnels'].map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-2 rounded-xl text-[10px] uppercase font-black tracking-widest transition-all ${
                  activeCategory === c 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-[#03030c] text-slate-400 hover:text-white border border-white/[0.03] hover:bg-white/[0.05]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#03030c] border border-white/[0.05] rounded-xl py-3 pl-11 pr-5 text-xs font-semibold focus:border-indigo-500 outline-none text-white placeholder:text-slate-600"
            />
          </div>
        </section>

        {/* Post Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {regularPosts.map((post: any) => (
            <div 
              key={post.id}
              className="bg-slate-950/20 hover:bg-slate-950/85 border border-white/[0.03] hover:border-indigo-500/20 p-8 rounded-[2rem] flex flex-col justify-between min-h-[280px] transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Hash size={10} className="text-indigo-400" /> {post.cat}</span>
                  <span>{post.date || 'Active Audit'}</span>
                </div>
                <h4 className="text-xl font-black uppercase text-white hover:text-indigo-400 transition-colors italic leading-snug">
                  {post.title}
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed font-semibold italic truncate-3-lines">
                  {post.desc || post.description}
                </p>
              </div>

              <div className="pt-6 border-t border-white/[0.03] mt-8 flex items-center justify-between text-[11px] font-mono font-black uppercase tracking-wider text-slate-500">
                <span className="flex items-center gap-1"><Clock size={12} className="text-indigo-400 shrink-0" /> {post.read || '7 mins'}</span>
                <span className="text-[9px] text-indigo-455 group-hover:text-white transition-colors duration-200">
                  Read Report
                </span>
              </div>
            </div>
          ))}

          {regularPosts.length === 0 && (
            <div className="col-span-2 text-center py-16 bg-white/[0.01] border border-white/[0.03] rounded-[2rem]">
              <p className="text-xs text-slate-500 italic font-semibold">No auxiliary research reports matching search keywords.</p>
            </div>
          )}
        </section>

        {/* Newsletter conversion Box */}
        <section className="bg-gradient-to-br from-[#090919] to-[#02020a] border border-white/[0.05] p-10 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left relative z-10">
            <div className="lg:col-span-7 space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400 italic">ELITE RESEARCH UPDATES</h4>
              <h3 className="text-2xl font-black uppercase tracking-tight italic">GET CONVERSION ALGORITHMS ONCE A WEEK</h3>
              <p className="text-slate-450 text-xs font-semibold italic">Subscribe to join over 3,500 startup CMOs receiving quarterly paid social audits and speed codes.</p>
            </div>
            <div className="lg:col-span-5">
              <form onSubmit={handleSub} className="flex relative">
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                  className="w-full bg-[#03030c] border border-white/[0.05] rounded-xl py-3.5 pl-4 pr-12 text-xs font-semibold focus:border-indigo-500 outline-none text-white"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center font-black uppercase text-[10px]"
                >
                  Join
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
