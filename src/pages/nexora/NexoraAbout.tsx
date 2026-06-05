import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, Target, Rocket, Heart, Star, Shield, Users, Trophy, Clock, Sparkles, Eye } from 'lucide-react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useSEO } from '../../hooks/useSEO';

export default function NexoraAbout() {
  // High efficiency dynamic SEO hooks integration
  useSEO({
    title: 'About Us | NexaSphere IT - 5 Years of Elite Digital Marketing & SEO Services',
    description: 'Learn about NexaSphere IT (nexasphereit), the best digital marketing agency in Dhaka, Bangladesh. Discover our 5+ years of verified expertise in professional SEO services, high-ROAS Facebook and Instagram ads, and premium visual poster design with 100% transparent metrics.',
    keywords: 'best digital marketing agency Dhaka, professional SEO services Bangladesh, Facebook Ads expert Dhaka, Google Ads management BD, top social media marketing agency Bangladesh, NexaSphere IT team, affordable boosting charges Bangladesh, TikTok marketing specialists BD',
    canonical: 'https://nexasphere.it/about',
    ogTitle: 'About Us | NexaSphere IT - 5 Years of Proven Growth',
    ogDescription: 'We help brands capture consumer attention and scale revenues with data-backed SEO, expert Meta and Google PPC campaigns, and eye-catching graphic design. No raw code confusion—just raw revenue growth.',
    lang: 'en'
  });

  const [aboutConfig, setAboutConfig] = useState(() => {
    const backup = localStorage.getItem('nexora_about_backup');
    if (backup) {
      try {
        return JSON.parse(backup);
      } catch (e) {
        // Fallback to default
      }
    }
    return {
      storyTitle: "5 YEARS OF ELITE DIGITAL MARKETING & REVENUE GROWTH",
      storySubtitle: "At NexaSphere IT, digital marketing is not about complex programming terminology, server setup commands, or app deployment loops. It is the absolute science of capturing consumer attention, mapping psychological buyer behavior, and converting standard web traffic into active revenue.",
      missionTitle: "5+ Years of Empirical Proof",
      missionDesc: "Since 2021, we haven't just run ads or designed assets; we have engineered reliable conversion funnels. By deploying custom tracking pixels, setting up advanced SEM bids, and writing copy that triggers action, we maximize raw revenue.",
      visionTitle: "100% Traceable Marketing Blueprint",
      visionDesc: "We eliminate opaque reports and wasted budgets. Every tracking link, cost breakdown sheet, and real-time lead count is brought to light on your transparent growth dashboard."
    };
  });

  const [team, setTeam] = useState<any[]>(() => {
    const backup = localStorage.getItem('nexora_team_backup');
    if (backup) {
      try {
        return JSON.parse(backup);
      } catch (e) {
        // Fallback to default
      }
    }
    return [
      { name: "Md. Shakhawat Hossain", role: "Founder & Lead Digital Marketer", exp: "Over 5+ years of strategic leadership. Specializes in custom audience segmentation, conversion optimization, and multi-channel scale strategies.", initial: "SH" },
      { name: "Asaduzzaman Tohin", role: "Head of Campaigns & PPC Strategy", exp: "5+ years of target business optimization. Formulates Google search intent bid funnels, native lead systems, and advanced Facebook campaign architectures.", initial: "AT" },
      { name: "Nurnnabi Nobi", role: "Lead Visual Creator & Copywriter", exp: "More than 5 years crafting scroll-stopping digital banners, high-interest viral TikTok video templates, and persuasive copywriting assets.", initial: "NN" }
    ];
  });

  const [milestones, setMilestones] = useState<any[]>(() => {
    const backup = localStorage.getItem('nexora_milestones_backup');
    if (backup) {
      try {
        const list = JSON.parse(backup);
        list.sort((a: any, b: any) => parseInt(a.year || "0") - parseInt(b.year || "0"));
        return list;
      } catch (e) {
        // Fallback to default
      }
    }
    return [
      { year: "2021", title: "Meta & Facebook Ads Setup Mastery", desc: "We started our journey with a relentless focus on custom conversion setups and laser-targeted Facebook Ads. In our first year, we generated exceptional ROAS for over 100 fast-growing local commerce brands in Dhaka." },
      { year: "2022", title: "Global Google SEM & Advanced SEO Engine", desc: "Expanded into high-impact Google Ads management and expert local search engine optimization (SEO) in Bangladesh. We helped clients pull organic traffic by ranking their landing pages on the 1st page of Google." },
      { year: "2023", title: "TikTok Viral Ads & Short-form Video Revolution", desc: "Recognizing the quick shift in video trends, we established Bangladesh's first dedicated team for TikTok ad scriptwriting, viral hook design, and pixel tracking to accelerate instant impulse sales." },
      { year: "2024", title: "Social Media Post Design & High-Converting Copy", desc: "To elevate visual trust, we brought in award-winning digital arts directors. We designed stunning social media brand templates, highly engaging graphics, and persuasive copy that instantly grabs attention." },
      { year: "2025", title: "OMNI-Channel Retail Scale & DTC Domination", desc: "Integrated all major client channels into central dashboard tracking. Managing substantial ad spend and delivering trusted digital marketing support as Dhaka's most authentic growth partner." },
      { year: "2026", title: "5 Years of Fully-Integrated Elite Marketing Services", desc: "Today, we stand as a powerhouse of seasoned specialists. No freshers, no junior handoffs—every business partner's growth campaign is personally steered by senior operators with over 5 years of verified expertise." }
    ];
  });

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        // About Core
        const aDoc = await getDoc(doc(db, 'nexora_config', 'about_core'));
        if (aDoc.exists()) {
          const data = aDoc.data();
          setAboutConfig(data as any);
          localStorage.setItem('nexora_about_backup', JSON.stringify(data));
        } else {
          const localAbout = localStorage.getItem('nexora_about_backup');
          if (localAbout) setAboutConfig(JSON.parse(localAbout));
        }

        // Team
        const teamSnap = await getDocs(collection(db, 'nexora_team'));
        if (!teamSnap.empty) {
          const list = teamSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          setTeam(list);
          localStorage.setItem('nexora_team_backup', JSON.stringify(list));
        } else {
          const localTeam = localStorage.getItem('nexora_team_backup');
          if (localTeam) setTeam(JSON.parse(localTeam));
        }

        // Milestones
        const milestonesSnap = await getDocs(collection(db, 'nexora_milestones'));
        if (!milestonesSnap.empty) {
          const list = milestonesSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
          list.sort((a: any, b: any) => parseInt(a.year || "0") - parseInt(b.year || "0"));
          setMilestones(list);
          localStorage.setItem('nexora_milestones_backup', JSON.stringify(list));
        } else {
          const localMilestones = localStorage.getItem('nexora_milestones_backup');
          if (localMilestones) {
            const list = JSON.parse(localMilestones);
            list.sort((a: any, b: any) => parseInt(a.year || "0") - parseInt(b.year || "0"));
            setMilestones(list);
          }
        }
      } catch (err) {
        const la = localStorage.getItem('nexora_about_backup');
        if (la) setAboutConfig(JSON.parse(la));
        const lt = localStorage.getItem('nexora_team_backup');
        if (lt) setTeam(JSON.parse(lt));
        const lm = localStorage.getItem('nexora_milestones_backup');
        if (lm) setMilestones(JSON.parse(lm));
      }
    };
    fetchAboutData();
  }, []);

  const awards = [
    { title: "Best Boutique Agency 2024", body: "Awarded by Elite Digital Marketing Association." },
    { title: "Top Shopify Scale Architects", body: "Certified and ranked #4 globally for ecommerce ROAS delivery." }
  ];

  return (
    <div className="min-h-screen bg-[#02020a] text-white pt-24 pb-20 relative overflow-hidden font-sans">
      {/* Absolute Ambient Background Lights (Brought to Light Theme) */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-rose-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-purple-550/5 rounded-full filter blur-3xl pointer-events-none animate-pulse duration-5000" />

      {/* Cyber Grid Lines Overlay for Vibe */}
      <div className="absolute inset-x-0 top-0 h-[600px] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none mask-image-gradient" style={{ maskImage: 'linear-gradient(to bottom, black, transparent)' }} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 space-y-24">
        
        {/* Intro Hero with custom 5-Year Badge */}
        <section className="text-center max-w-4xl mx-auto space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-950/40 shadow-lg shadow-pink-500/10 cursor-default"
          >
            <Sparkles size={13} className="text-pink-400 animate-pulse" />
            <span className="text-[10px] text-pink-250 font-black uppercase tracking-[0.2em] italic">
              5 Years of Elite Multi-Channel Scale (Since 2021)
            </span>
          </motion.div>

          <h1 className="text-4xl sm:text-7xl font-sans font-black italic uppercase tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-rose-200">
            {aboutConfig.storyTitle}
          </h1>

          <p className="text-slate-300 text-sm sm:text-lg leading-relaxed font-semibold italic max-w-3xl mx-auto text-center border-l-2 border-indigo-500/20 pl-4 py-1">
            " {aboutConfig.storySubtitle} "
          </p>
        </section>

        {/* BRINGING EVERYTHING TO LIGHT Module - REWRITE INTO DETAILED, TRUSTED DIGITAL MARKETING SCIENTIFIC STORY */}
        <section className="relative bg-gradient-to-r from-[#030312] to-[#08081f] border border-white/[0.06] rounded-[2.5rem] p-8 sm:p-14 overflow-hidden shadow-2xl group hover:border-indigo-500/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-tr-[2.5rem] pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-12 space-y-8">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[10px] font-mono font-black text-rose-500 uppercase tracking-widest">THE REAL DEFINITION OF MARKETING</span>
              </div>
              
              <h2 className="text-3xl sm:text-5xl font-sans font-black italic uppercase tracking-tighter text-white leading-none">
                What is Digital Marketing? <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-indigo-400">Not raw code or hosting servers, it's the exact science of winning customers!</span>
              </h2>
              
              {/* LONG FORM COMPELLING STRATEGY STORY */}
              <div className="space-y-6 text-slate-300 text-sm leading-relaxed font-medium italic">
                <p>
                  Most IT agencies focus solely on abstract developer terminology, Server deployment loops, or server configuration files. At NexaSphere IT, our stance is simple: <strong className="text-white text-base">True Digital Marketing is not a matter of raw web coding or backend hosting.</strong> It is the art of capturing user attention, triggering emotional buying triggers, and winning the high-stakes battle of consumer attention.
                </p>

                <p>
                  When a prospective buyer scrolls down their feed, pauses, and takes immediate conversion action—that is where our five years of deep agency expertise glows. Over these five unbroken years, we have refused lazy promises, bringing every client's advertising metrics into the pure light of absolute transparency.
                </p>

                <p>
                  Through this journey, we have built absolute mastery over every essential vertical of high-ROAS marketing:
                </p>
              </div>

              {/* Spectacular 6-Pillar Deep Grid (SEO, SEM, Google, FB, TikTok, Posts) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                
                {/* Pillar 1: Advanced SEO */}
                <div className="p-6 rounded-3xl bg-[#010106] border border-white/[0.04] space-y-3 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-2.5 text-indigo-400">
                    <span className="font-mono text-xs font-black bg-indigo-500/10 px-2.5 py-1 rounded-md">Pillar 01</span>
                    <h4 className="text-sm font-black uppercase tracking-wider text-white">Advanced Search Engine Optimization (SEO)</h4>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold italic leading-relaxed">
                    Elevate your business visibility with organic ranking. We perform thorough keyword research, custom on-page audits, structured Schema optimization, and high-quality backlink building to rank your brand on the 1st page of Google Search.
                  </p>
                </div>

                {/* Pillar 2: Google SEM & Intent Search */}
                <div className="p-6 rounded-3xl bg-[#010106] border border-white/[0.04] space-y-3 hover:border-pink-500/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-2.5 text-pink-400">
                    <span className="font-mono text-xs font-black bg-pink-500/10 px-2.5 py-1 rounded-md">Pillar 02</span>
                    <h4 className="text-sm font-black uppercase tracking-wider text-white">Google SEM & Search Advertising</h4>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold italic leading-relaxed">
                    Capture active buyer intent when customers query Google for your products. We combine intelligent search bids, copy optimization, and responsive search ads to drive qualified buyers straight to your landing page.
                  </p>
                </div>

                {/* Pillar 3: Facebook & Instagram Ads */}
                <div className="p-6 rounded-3xl bg-[#010106] border border-white/[0.04] space-y-3 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-2.5 text-indigo-400">
                    <span className="font-mono text-xs font-black bg-indigo-500/10 px-2.5 py-1 rounded-md">Pillar 03</span>
                    <h4 className="text-sm font-black uppercase tracking-wider text-white">Meta & FB Ads Funnel Systems</h4>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold italic leading-relaxed">
                    Stop throwing away budgets on basic page boosting. We set up premium Meta pixel tracking, custom lookalike audience funnels, and advanced CBO dynamic testing configurations that consistently skyrocket your ROAS.
                  </p>
                </div>

                {/* Pillar 4: TikTok Ads */}
                <div className="p-6 rounded-3xl bg-[#010106] border border-white/[0.04] space-y-3 hover:border-pink-550/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-2.5 text-pink-450">
                    <span className="font-mono text-xs font-black bg-pink-500/10 px-2.5 py-1 rounded-md">Pillar 04</span>
                    <h4 className="text-sm font-black uppercase tracking-wider text-white">TikTok Short-Form Viral Target</h4>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold italic leading-relaxed">
                    The absolute golden channel for modern viral commerce. We launch highly creative vertical video campaigns, utilizing trending audio, custom hook patterns, and real-time events to spark rapid impulse conversions.
                  </p>
                </div>

                {/* Pillar 5: Creative Social Post Design */}
                <div className="p-6 rounded-3xl bg-[#010106] border border-white/[0.04] space-y-3 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-2.5 text-indigo-400">
                    <span className="font-mono text-xs font-black bg-indigo-500/10 px-2.5 py-1 rounded-md">Pillar 05</span>
                    <h4 className="text-sm font-black uppercase tracking-wider text-white">Creative Social Media Banner Design</h4>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold italic leading-relaxed">
                    A single beautifully crafted poster can close high-ticket sales deals on your behalf. Our professional designers curate flawless color schemes, modern font pairings, and clean layouts that establish premium brand authority.
                  </p>
                </div>

                {/* Pillar 6: High-Conversion Copywriting */}
                <div className="p-6 rounded-3xl bg-[#010106] border border-white/[0.04] space-y-3 hover:border-pink-500/30 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-2.5 text-pink-400">
                    <span className="font-mono text-xs font-black bg-pink-500/10 px-2.5 py-1 rounded-md">Pillar 06</span>
                    <h4 className="text-sm font-black uppercase tracking-wider text-white">High-Converting Ad Copy & Funnels</h4>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold italic leading-relaxed">
                    Words that hook and sell. We craft emotion-driven copy, strategic landing page structures, and compelling click-to-action hooks that leave scroll-fatigued audiences with no choice but to tap and buy.
                  </p>
                </div>

              </div>

              {/* Trust & Transparency Quote block */}
              <div className="pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1">
                  <h5 className="text-sm font-semibold text-white uppercase tracking-wider">A Sacred Guarantee of Unbroken Trust</h5>
                  <p className="text-xs text-slate-400 italic">We account for every single penny of your marketing spend, providing accessible 24/7 campaign tracking dashboards.</p>
                </div>
                <div className="px-6 py-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center gap-2 text-xs font-black uppercase tracking-widest pl-4">
                  <Shield size={16} /> 1-Click Transparency Guaranteed
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Mission and Vision Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-950/65 border border-white/[0.04] p-10 rounded-[2.5rem] relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            <Target className="text-indigo-400 w-10 h-10 mb-6" />
            <h3 className="text-2xl font-black italic uppercase tracking-tight mb-4 text-white">{aboutConfig.missionTitle}</h3>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed font-semibold italic">
              {aboutConfig.missionDesc}
            </p>
          </div>

          <div className="bg-slate-950/65 border border-white/[0.04] p-10 rounded-[2.5rem] relative overflow-hidden group hover:border-purple-500/30 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-550/5 rounded-full blur-2xl pointer-events-none" />
            <Rocket className="text-purple-400 w-10 h-10 mb-6" />
            <h3 className="text-2xl font-black italic uppercase tracking-tight mb-4 text-white">{aboutConfig.visionTitle}</h3>
            <p className="text-slate-350 text-xs sm:text-sm leading-relaxed font-semibold italic">
              {aboutConfig.visionDesc}
            </p>
          </div>
        </section>

        {/* Team Section with 5+ Years Badges & Aesthetic Trim */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] text-purple-400 font-black uppercase tracking-[0.25em] italic">SENIOR ELITE PLANNERS</span>
            <h2 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tighter text-white">THE FIVE-YEAR MASTERS</h2>
            <p className="text-xs text-slate-400 max-w-2xl mx-auto italic font-semibold">
              Every senior architect and lead marketer on our team has been executing high-converting campaigns and SEO strategies for over five years.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((m, idx) => (
              <div 
                key={idx} 
                className="bg-[#03030d] border border-white/[0.05] p-8 rounded-[2.5rem] hover:border-indigo-500/40 hover:shadow-[0_0_30px_rgba(99,102,241,0.12)] transition-all duration-350 flex flex-col items-center text-center group relative overflow-hidden"
              >
                {/* Visual Glass background accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-tr-[2.5rem]" />
                
                {/* 5+ Years Experience Badge */}
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] uppercase font-black tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4 shadow-[0_0_12px_rgba(16,185,129,0.06)]">
                  <Clock size={11} className="animate-pulse" /> 5+ Years Experience
                </div>

                <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-[2px] mb-6 shadow-xl relative overflow-hidden flex items-center justify-center">
                  {m.image ? (
                    <img 
                      src={m.image} 
                      alt={m.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-[1.85rem] group-hover:scale-110 transition-transform duration-350"
                      onError={(e) => {
                        (e.target as any).src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#03030c] rounded-[1.85rem] flex items-center justify-center font-black text-2xl text-white">
                      {m.initial}
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-black uppercase italic tracking-tight text-white mb-1 group-hover:text-indigo-300 transition-colors">
                  {m.name}
                </h3>
                
                <p className="text-[10px] font-mono text-indigo-400 font-extrabold uppercase tracking-widest mb-4">
                  {m.role}
                </p>
                
                <p className="text-slate-400 text-xs font-semibold leading-relaxed italic border-t border-white/[0.04] pt-4 w-full">
                  {m.exp}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline representation (5-Year Chronicle starting in 2021) */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] text-pink-400 font-black uppercase tracking-[0.25em] italic">HISTORICAL VELOCITY</span>
            <h2 className="text-3xl sm:text-5xl font-black italic uppercase tracking-tighter text-white">OUR 5-YEAR CHRONICLE</h2>
          </div>

          <div className="relative max-w-4xl mx-auto space-y-12 before:absolute before:left-4 md:before:left-1/2 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/[0.04]">
            {milestones.map((m, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-stretch gap-6 relative">
                {/* Glowing Marker */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4.5 h-4.5 rounded-full bg-slate-900 border-2 border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)] z-20" />
                
                {/* Left block (Year and Title) */}
                <div className="w-full md:w-1/2 pl-12 md:pl-0 md:pr-12 md:text-right flex flex-col justify-center">
                  <div className="font-mono text-3xl font-black text-pink-500 tracking-tighter">{m.year}</div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-white mt-1 group-hover:text-pink-300 transition-colors">
                    {m.title}
                  </h4>
                </div>

                {/* Right block (Chronology Desc) */}
                <div className="w-full md:w-1/2 pl-12 md:pl-12 flex items-center">
                  <p className="text-xs sm:text-sm font-semibold text-slate-400 italic max-w-sm leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Awards */}
        <section className="bg-[#03030e] border border-white/[0.04] p-8 sm:p-12 rounded-[2.5rem] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-2xl pointer-events-none" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 flex items-center justify-center">
                <Trophy className="text-yellow-500 w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-black uppercase italic tracking-tight text-white">GLOBAL ACCREDITATIONS</h3>
                <p className="text-[9px] text-slate-500 font-mono font-black tracking-widest uppercase mt-0.5">ESTABLISHED TRIUMPHS</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/[0.03]">
            {awards.map((a, i) => (
              <div key={i} className="p-5 bg-white/[0.01] rounded-3xl border border-white/[0.03] hover:border-slate-800 transition-colors">
                <h4 className="text-sm font-bold text-white uppercase italic">{a.title}</h4>
                <p className="text-slate-400 text-xs font-semibold mt-1.5 italic leading-relaxed">{a.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
