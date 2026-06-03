import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Network, Home, Info, ShieldCheck, HelpCircle, FileText, Briefcase, Mail, Cpu, Settings, Calendar, DollarSign, Award, ArrowRight } from 'lucide-react';

export default function NexoraSitemap() {
  const categories = [
    {
      title: "Core Framework Pages",
      icon: Home,
      links: [
        { name: "Executive Homepage", desc: "Main landing portal & expert team showcase", path: "/" },
        { name: "Corporate Chronicle (About)", desc: "Our history, technical guidelines, & core design values", path: "/about" },
        { name: "Services Portfolio", desc: "Full breakdown of our custom engineering and marketing options", path: "/services" },
        { name: "Project Portfolio & Works", desc: "Glimpses into our verified world-class brand creations", path: "/portfolio" },
        { name: "In-Depth Case Studies", desc: "Detailed breakdowns of high-impact ROI systems and architectures", path: "/case-studies" },
        { name: "Strategic Contact Point", desc: "Schedule a secure digital partnership consultation", path: "/contact" }
      ]
    },
    {
      title: "Client & Administrative Portals",
      icon: Cpu,
      links: [
        { name: "Client Workspace Hub", desc: "Central secure portal dashboard", path: "/dashboard" },
        { name: "Pricing Packages", desc: "Clear investment options for brands", path: "/pricing" },
        { name: "IT Sales Controller", desc: "Commission records and real-time sales pipelines", path: "/it-sales" },
        { name: "Collaborator Admin Panel", desc: "Lead database and design assets configurator", path: "/admin" },
        { name: "Secure Login Gateway", desc: "Account security verify portal", path: "/login" }
      ]
    },
    {
      title: "Framework Generators & Tools",
      icon: Settings,
      links: [
        { name: "Active Retainers & History", desc: "View previous billing invoices and campaign records", path: "/history" },
        { name: "Interactive Quotation App", desc: "Auto-generate dynamic PDFs based on customized requirements", path: "/quotations" },
        { name: "Executive Resume (CV) Builder", desc: "Design elegant developer bios and experience assets", path: "/cvs" },
        { name: "Secure Digital Receipt Generator", desc: "Issue verified business receipts for instant local download", path: "/receipts" },
        { name: "Portal Settings Dashboard", desc: "Calibrate font selections, logo uploads, and company details", path: "/settings" }
      ]
    },
    {
      title: "Security & Legal Guidelines",
      icon: ShieldCheck,
      links: [
        { name: "NexaSphere Privacy Policy", desc: "Information security, Meta pixel and metrics database guidelines", path: "/privacy" },
        { name: "Terms of Service Agreement", desc: "SLA retainers, written notice conditions, and digital guidelines", path: "/terms" },
        { name: "Active Sitemap Index", desc: "Current page (complete tree index mapping)", path: "/sitemap" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#02020a] text-white pt-24 pb-20 relative overflow-hidden font-sans selection:bg-rose-500/30">
      {/* Cinematic space backgrounds */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-rose-600/[0.03] rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-indigo-600/[0.03] rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Page Header */}
        <div className="text-center md:text-left border-b border-white/[0.05] pb-10 mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 rounded-full px-4.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-rose-400 italic">
            <Network size={12} className="shrink-0 animate-pulse" />
            NexaSphere System Hierarchy
          </div>
          <h1 className="text-3xl sm:text-5xl font-sans font-black uppercase tracking-tighter italic">
            NEXASPHERE IT <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">SITEMAP</span>
          </h1>
          <p className="text-slate-450 text-xs sm:text-sm font-semibold italic max-w-2xl leading-relaxed">
            The holistic navigation tree mapping primary public marketing routes, advanced workspace administration dashboards, and developer productivity systems.
          </p>
        </div>

        {/* Sitemap Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-white/[0.01] hover:bg-white/[0.02] border border-white/[0.04] hover:border-rose-500/25 rounded-3xl p-6 sm:p-8 transition-colors group relative"
              >
                {/* Visual header */}
                <div className="flex items-center gap-3.5 mb-6 border-b border-white/[0.03] pb-4">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/25 shadow-lg shadow-rose-500/5">
                    <Icon size={18} />
                  </div>
                  <h3 className="text-sm font-sans font-black uppercase tracking-wider text-slate-100">
                    {cat.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  {cat.links.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="flex items-start justify-between p-3.5 rounded-2xl bg-slate-950/20 hover:bg-rose-500/[0.03] border border-white/[0.01] hover:border-rose-500/10 transition-all group/item"
                    >
                      <div className="space-y-1 pr-4">
                        <span className="text-xs font-black text-rose-400 group-hover/item:text-rose-300 transition-colors">
                          {link.name}
                        </span>
                        <p className="text-[11px] text-slate-400 italic leading-relaxed font-semibold">
                          {link.desc}
                        </p>
                      </div>
                      <div className="shrink-0 w-7 h-7 rounded-lg bg-white/[0.02] group-hover/item:bg-rose-500/10 border border-white/[0.04] group-hover/item:border-rose-500/25 flex items-center justify-center text-slate-500 group-hover/item:text-rose-400 transition-all self-center">
                        <ArrowRight size={12} className="transform group-hover/item:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Back to Home CTA */}
        <div className="mt-16 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-sans text-xs font-black uppercase tracking-widest italic px-8 py-4 rounded-xl shadow-lg shadow-rose-600/20 transform hover:-translate-y-0.5 transition-all"
          >
            <Home size={14} />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
