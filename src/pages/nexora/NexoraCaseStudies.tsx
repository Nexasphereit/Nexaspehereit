import { motion } from 'motion/react';
import { Target, ArrowRight, TrendingUp, Sparkles, ShieldCheck, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NexoraCaseStudies() {
  const cases = [
    {
      title: "Zenith Activewear Hook Scale Study",
      niche: "Direct Social eCommerce",
      problem: "Paid campaigns were stuck at a mediocre 1.8x ROAS due to visual fatigue and inaccurate attribution under iOS 14.5 protocols. CPA was unsustainably climbing closer to $48 per acquisition.",
      strategy: "We built 18 high-impact sound hooks in 4K UGC style. Concurrently, we bypassed traditional attribution pools by implementing our custom offline transaction scoring framework inside NexaSphere's CRM pipeline.",
      revenueInitial: "$12,400 / mo",
      revenueFinal: "$89,500 / mo",
      stats: [
        { label: "Verified ROAS", value: "6.8x", diff: "+270%" },
        { label: "Client CPA Drop", value: "$18.50", diff: "-61.4%" },
        { label: "Add-to-Cart Velocity", value: "+145%", diff: "+145%" }
      ],
      points: [
        "Identified the optimal 3-second hook configuration.",
        "Launched programmatic cart upgrade drawer metrics.",
        "Synced client's dispatch channels to automated invoicing loops."
      ]
    },
    {
      title: "Hyperion Enterprise SaaS Onboarding",
      niche: "B2B Software Scale",
      problem: "Very high traffic with extremely poor query conversion ratios. Prospects abandoned standard quote builders due to long, multi-page layout formats.",
      strategy: "Constructed a seamless 1-page reactive quotation generator featuring pricing slider algorithms. Added interactive compliance checkpoints, giving prospects a detailed downloadable PDF estimate immediately.",
      revenueInitial: "35 Leads / wk",
      revenueFinal: "160 Leads / wk",
      stats: [
        { label: "Conversion Ratios", value: "8.4%", diff: "+480%" },
        { label: "Average AOV Scale", value: "$4,500", diff: "+34%" },
        { label: "Onboarding Lag", value: "4 mins", diff: "-82%" }
      ],
      points: [
        "Injected local storage resume cookies.",
        "Automated PDF quotations output.",
        "Implemented real-time leads notification arrays."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#02020a] text-white pt-24 pb-20 relative overflow-hidden font-sans">
      {/* Background Ornaments */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-20">
        {/* Header Block */}
        <section className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.25em] italic">OUR COMPLETED PROTOCOLS</span>
          <h1 className="text-4xl sm:text-5xl font-sans font-black italic uppercase tracking-tighter">
            DATA-DRIVEN CASE ANALYTICS
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-semibold italic">
            No marketing fluff. Review the formal breakdowns of our major direct social and enterprise SaaS scaling milestones.
          </p>
        </section>

        {/* Case List */}
        <section className="space-y-16">
          {cases.map((c, idx) => (
            <div 
              key={idx}
              className="bg-slate-950/60 border border-white/[0.04] rounded-[2.5rem] p-8 lg:p-12 space-y-10 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/[0.01] rounded-full blur-2xl" />
              
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/[0.03] pb-6">
                <div>
                  <span className="text-[9px] font-mono font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded inline-block mb-3">
                    {c.niche}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black uppercase italic tracking-tight">{c.title}</h3>
                </div>
                <div className="flex gap-4">
                  <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-center">
                    <span className="text-[8px] text-slate-500 font-black uppercase tracking-wider block">PRE-NEXORA</span>
                    <span className="text-xs font-black text-rose-500 line-through mt-0.5">{c.revenueInitial}</span>
                  </div>
                  <div className="bg-indigo-950/50 border border-indigo-505 px-4 py-2 rounded-xl text-center">
                    <span className="text-[8px] text-indigo-405 font-black uppercase tracking-wider block">POST-SCALE</span>
                    <span className="text-xs font-black text-[#10b981] mt-0.5">{c.revenueFinal}</span>
                  </div>
                </div>
              </div>

              {/* Problem vs Strategy layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 text-left">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.18em] text-rose-500 flex items-center gap-1.5Packed">
                    <span>●</span> CLIENT PROBLEM BRIEF
                  </h4>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-semibold italic">
                    {c.problem}
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.18em] text-indigo-400 flex items-center gap-1.5">
                    <span>●</span> SCALING STRATEGY
                  </h4>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-semibold italic">
                    {c.strategy}
                  </p>
                </div>
              </div>

              {/* Interactive Performance Vector Section (Visual SVG curve representing scaling metrics) */}
              <div className="p-6 bg-white/[0.01] border border-white/[0.03] rounded-2xl relative">
                <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[8px] font-mono text-indigo-400 uppercase tracking-widest font-black">
                  <Cpu size={10} className="animate-spin text-indigo-400" />
                  VERIFIED ATTRIBUTION LOGS
                </div>
                <h4 className="text-[10px] font-black uppercase tracking-wider text-white mb-6">TRANSACTION VELOCITY SCALING PATTERN</h4>
                
                {/* Custom Analytical Vector Line */}
                <div className="h-24 w-full relative overflow-hidden flex items-end">
                  <svg className="w-full h-full text-indigo-500/25" viewBox="0 0 1000 100" preserveAspectRatio="none">
                    <path 
                      d="M0,90 Q150,85 300,70 T600,45 T900,10 L1000,5" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeDasharray="4 4"
                    />
                    <path 
                      d="M0,90 Q150,85 300,70 T600,45 T900,10 L1000,5 L1000,100 L0,100 Z" 
                      fill="url(#grad)" 
                      opacity="0.1" 
                    />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4338ca" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>
                  </svg>
                  {/* Floating marker node visual */}
                  <div className="absolute right-[5%] bottom-[85%] w-3 h-3 rounded-full bg-indigo-500 animate-ping" />
                  <div className="absolute right-[5%] bottom-[85%] w-2 h-2 rounded-full bg-indigo-400" />
                </div>
              </div>

              {/* Performance Numeric Board */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/[0.03]">
                {c.stats.map((stat, i) => (
                  <div key={i} className="flex flex-col items-center justify-center p-4 bg-[#03030f]/60 rounded-xl text-center">
                    <span className="text-[8px] text-slate-550 font-black uppercase tracking-widest mb-1">{stat.label}</span>
                    <span className="text-3xl font-black text-white italic">{stat.value}</span>
                    <span className="text-[9px] font-black text-[#10b981] mt-1">{stat.diff} Global</span>
                  </div>
                ))}
              </div>

              {/* Implementation details */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black tracking-[0.2em] uppercase italic text-indigo-400">KEY ACTIONS COMPLETED</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {c.points.map((pt, i) => (
                    <div key={i} className="flex gap-2.5 items-start p-3 bg-white/[0.01] border border-white/[0.03] rounded-xl text-left">
                      <ShieldCheck size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] font-semibold text-slate-400 italic leading-relaxed">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Call to action */}
        <section className="text-center pt-8">
          <Link to="/contact">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-xs font-black uppercase tracking-widest text-[#050511] bg-white hover:bg-slate-200 px-10 py-5 rounded-2xl cursor-pointer"
            >
              Request Custom Audit On My Campaigns
            </motion.button>
          </Link>
        </section>
      </div>
    </div>
  );
}
