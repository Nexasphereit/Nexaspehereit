import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, Target, Rocket, Heart, Star, Shield, Users, Trophy } from 'lucide-react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export default function NexoraAbout() {
  const [aboutConfig, setAboutConfig] = useState({
    storyTitle: "SCALING THE DIGITAL FUTURE",
    storySubtitle: "Founded with the belief that digital campaigns should be mathematically rigorous, Nexora has scaled from a boutique local optimization team into a fully connected international advertising powerhub.",
    missionTitle: "OUR MISSION BLUEPRINT",
    missionDesc: "Our absolute objective is to secure unmatched client profitability through bulletproof analytics, preternatural ad copy hook optimization, and high-speed checkout experience builds. We eliminate useless spending to optimize metrics that translate into actual revenue growth.",
    visionTitle: "OUR ULTIMATE VISION",
    visionDesc: "We envision a unified ecosystem where performance marketing is fully integrated with administrative utility—bridging CRM data capture directly with elite back-office document automation."
  });

  const [team, setTeam] = useState<any[]>([
    { name: "Julian Sterling", role: "Founder & Chief Marketing Architect", exp: "Ex-Google Ads Elite team. Scaled 12+ SaaS products to successful IPO exits.", initial: "JS" },
    { name: "Sienna Martinez", role: "Creative Director & Hook Engineer", exp: "Award-winning visual storyteller. Designs high-impact social frameworks.", initial: "SM" },
    { name: "Dax Thornton", role: "Head of Funnels & Conversion Analytics", exp: "Full-stack Shopify engineer. Passionate about custom React pixel tracking.", initial: "DT" }
  ]);

  const [milestones, setMilestones] = useState<any[]>([
    { year: "2021", title: "Nexora Foundation", desc: "Launched in NY with a small team of 3 analysts optimizing local retail campaigns." },
    { year: "2023", title: "NexaSphere Suite Release", desc: "Introduced integrated back-office PDF creation modules to support enterprise clients." },
    { year: "2025", title: "Global Expand", desc: "Maintained a portfolio of over 45 high-end SaaS accounts tracking $185M+ in revenue." }
  ]);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        // About Core
        const aDoc = await getDoc(doc(db, 'nexora_config', 'about_core'));
        if (aDoc.exists()) {
          setAboutConfig(aDoc.data() as any);
        } else {
          const localAbout = localStorage.getItem('nexora_about_backup');
          if (localAbout) setAboutConfig(JSON.parse(localAbout));
        }

        // Team
        const teamSnap = await getDocs(collection(db, 'nexora_team'));
        if (!teamSnap.empty) {
          setTeam(teamSnap.docs.map(d => ({ id: d.id, ...d.data() })));
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
      {/* Decorative Blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[550px] bg-purple-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-24">
        {/* Intro */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <span className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.25em] italic">OUR STORY & METRICS</span>
          <h1 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter leading-none">
            {aboutConfig.storyTitle}
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed font-semibold italic">
            {aboutConfig.storySubtitle}
          </p>
        </section>

        {/* Mission and Vision Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-slate-950/65 border border-white/[0.05] p-10 rounded-[2.5rem] relative overflow-hidden group">
            <Target className="text-indigo-400 w-10 h-10 mb-6" />
            <h3 className="text-2xl font-black italic uppercase tracking-tight mb-4">{aboutConfig.missionTitle}</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-semibold italic">
              {aboutConfig.missionDesc}
            </p>
          </div>

          <div className="bg-slate-950/65 border border-white/[0.05] p-10 rounded-[2.5rem] relative overflow-hidden group">
            <Rocket className="text-purple-400 w-10 h-10 mb-6" />
            <h3 className="text-2xl font-black italic uppercase tracking-tight mb-4">{aboutConfig.visionTitle}</h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-semibold italic">
              {aboutConfig.visionDesc}
            </p>
          </div>
        </section>

        {/* Team Section */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] text-purple-400 font-black uppercase tracking-[0.25em] italic">EXECUTIVE ARCHITECTS</span>
            <h2 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter">MEET THE LEADERS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((m, idx) => (
              <div key={idx} className="bg-slate-950/30 border border-white/[0.05] p-8 rounded-[2rem] hover:border-indigo-500/30 transition-all flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-[2px] mb-6 shadow-xl relative overflow-hidden flex items-center justify-center">
                  {m.image ? (
                    <img 
                      src={m.image} 
                      alt={m.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-[22px] group-hover:scale-110 transition-transform duration-350"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#03030c] rounded-[22px] flex items-center justify-center font-black text-xl text-white">
                      {m.initial}
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-black uppercase italic tracking-tight text-white mb-1">{m.name}</h3>
                <p className="text-[10px] font-mono text-indigo-400 font-extrabold uppercase tracking-widest mb-4">{m.role}</p>
                <p className="text-slate-400 text-xs font-semibold italic">{m.exp}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline representation */}
        <section className="space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[10px] text-pink-400 font-black uppercase tracking-[0.25em] italic">HISTORICAL VELOCITY</span>
            <h2 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter">OUR CHRONOLOGY</h2>
          </div>

          <div className="relative max-w-3xl mx-auto space-y-8 before:absolute before:left-4 md:before:left-1/2 before:top-2 before:bottom-2 before:w-[2px] before:bg-white/[0.05]">
            {milestones.map((m, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-stretch gap-6 relative">
                {/* Marker */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-indigo-550 border-4 border-slate-950 z-20" />
                
                {/* Left block */}
                <div className="w-full md:w-1/2 pl-12 md:pl-0 md:pr-12 md:text-right flex flex-col justify-center">
                  <div className="font-mono text-2xl font-black text-pink-500">{m.year}</div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-white mt-1">{m.title}</h4>
                </div>

                {/* Right block */}
                <div className="w-full md:w-1/2 pl-12 md:pl-12 flex items-center">
                  <p className="text-xs font-semibold text-slate-400 italic max-w-sm">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Awards */}
        <section className="bg-slate-950/60 border border-white/[0.05] p-10 rounded-[3rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-2xl" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
            <div className="flex items-center gap-4">
              <Trophy className="text-yellow-500 w-12 h-12" />
              <div>
                <h3 className="text-lg font-black uppercase italic tracking-tight">GLOBAL RECOGNITION</h3>
                <p className="text-[10px] text-slate-500 font-mono font-black tracking-widest uppercase mt-0.5">ACCREDITED AD EXECUTION</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/[0.03]">
            {awards.map((a, i) => (
              <div key={i} className="p-4 bg-white/[0.01] rounded-2xl border border-white/[0.03]">
                <h4 className="text-sm font-bold text-white uppercase italic">{a.title}</h4>
                <p className="text-slate-400 text-xs font-semibold mt-1 italic">{a.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
