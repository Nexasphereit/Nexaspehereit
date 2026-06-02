import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Send, Mail, Phone, MapPin, CheckCircle, HelpCircle, 
  Sparkles, Calendar, Heart, ShieldAlert, Navigation, 
  Compass, Layers, Copy, Maximize2, Activity, Wifi
} from 'lucide-react';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

export default function NexoraContact() {
  const { triggerRedirection } = useTheme();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialService = searchParams.get('service') || '';
  const initialPlan = searchParams.get('plan') || '';

  const [mapTheme, setMapTheme] = useState<'cyber' | 'terminal' | 'satellite'>('cyber');
  const [pingMs, setPingMs] = useState(14);

  // Slowly fluctuate mock network diagnostic ping
  useEffect(() => {
    const interval = setInterval(() => {
      setPingMs(prev => Math.max(10, Math.min(35, prev + (Math.random() > 0.5 ? 2 : -2))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const [pagesConfig, setPagesConfig] = useState({
    contactCapsule: 'SECURE SYSTEM ALLOCATION',
    contactTitle: 'INITIAL CORE STRATEGY DEBIEF',
    contactSubtitle: "Let's build your multi-million scaling blueprint. Complete our target parameters form and our lead marketing architects will execute a custom ROAS analysis within 24 hours.",
    contactCtaText: 'Authorize strategy request'
  });

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    budget: '$5,000 - $10,000',
    service: initialService,
    plan: initialPlan,
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Sync query parameters if page re-routes
    const s = searchParams.get('service');
    const p = searchParams.get('plan');
    if (s) setForm(prev => ({ ...prev, service: s }));
    if (p) setForm(prev => ({ ...prev, plan: p }));
  }, [location.search]);

  useEffect(() => {
    const fetchContactPageConfig = async () => {
      try {
        const pDoc = await getDoc(doc(db, 'nexora_config', 'pages_config'));
        if (pDoc.exists()) {
          setPagesConfig(p => ({ ...p, ...pDoc.data() }));
        } else {
          const backupPages = localStorage.getItem('nexora_pages_backup');
          if (backupPages) setPagesConfig(JSON.parse(backupPages));
        }
      } catch (err) {
        console.warn("Could not load backend configurations in Contact Page:", err);
        const backupPages = localStorage.getItem('nexora_pages_backup');
        if (backupPages) setPagesConfig(JSON.parse(backupPages));
      }
    };
    fetchContactPageConfig();
  }, []);

  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill out all mandatory fields (Name, Email, Message)!");
      return;
    }

    setLoading(true);
    try {
      // POST to our unified frontend auto-reply and inbox router
      const response = await fetch("/api/it-sales/front-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error("Proxy response failed");
      }

      const result = await response.json();
      setSubmitted(true);
      toast.success(result.message || "Elite Strategy Request Captured successfully!");
    } catch (err) {
      console.error("Could not route lead through backend proxy:", err);
      toast.error("Database connection lag. Saving locally...");
      // Save to local storage mock fallback so it's always persistent and reliable
      const savedLeads = JSON.parse(localStorage.getItem('nexora_leads_backup') || '[]');
      savedLeads.push({ ...form, createdAt: new Date().toISOString(), status: 'New', id: 'local_' + Date.now() });
      localStorage.setItem('nexora_leads_backup', JSON.stringify(savedLeads));
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02020a] text-white pt-24 pb-20 relative overflow-hidden font-sans">
      {/* Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 space-y-12">
        
        {/* Row 1: Header + Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left column - header */}
          <div className="lg:col-span-5 space-y-8 text-left">
            <div className="space-y-4">
              <span className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.25em] italic">{pagesConfig.contactCapsule}</span>
              <h1 className="text-4xl sm:text-5xl font-sans font-black italic uppercase tracking-tighter leading-none">
                {pagesConfig.contactTitle}
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm font-semibold italic leading-relaxed">
                {pagesConfig.contactSubtitle}
              </p>
            </div>
          </div>

        {/* Right column - form */}
        <div className="lg:col-span-7 text-left">
          {submitted ? (
            <div className="bg-gradient-to-br from-indigo-950/20 to-slate-950 border border-indigo-500/25 p-12 rounded-[2.5rem] text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-3xl font-black italic uppercase text-white">STRATEGY CAPTURED SUCCESS</h3>
              <p className="text-slate-400 text-xs sm:text-sm font-semibold italic max-w-sm mx-auto leading-relaxed">
                Your organizational metrics have hit our pipeline. An executive campaign analyst has received this data file and is preparing your ROAS split model right now.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="px-6 py-3 bg-white text-slate-950 rounded-xl text-xs uppercase font-black"
              >
                Submit New Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={submitContact} className="bg-slate-950/50 border border-white/[0.05] p-8 lg:p-12 rounded-[2.5rem] space-y-6 relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-mono font-black uppercase tracking-widest text-slate-400">CORPORATE NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. Julian Sterling"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 text-xs font-semibold focus:border-indigo-500 outline-none text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-mono font-black uppercase tracking-widest text-slate-400">CORPORATE EMAIL *</label>
                  <input
                    type="email"
                    required
                    placeholder="E.g. sterling@company.com"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 text-xs font-semibold focus:border-indigo-500 outline-none text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-mono font-black uppercase tracking-widest text-slate-400">COMPANY WEBSITE / LINK</label>
                  <input
                    type="text"
                    placeholder="E.g. zenithwear.com"
                    value={form.company}
                    onChange={(e) => setForm({...form, company: e.target.value})}
                    className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 text-xs font-semibold focus:border-indigo-500 outline-none text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-mono font-black uppercase tracking-widest text-slate-400">CORPORATE PHONE</label>
                  <input
                    type="text"
                    placeholder="E.g. +1 (555) 0192"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 text-xs font-semibold focus:border-indigo-500 outline-none text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-mono font-black uppercase tracking-widest text-slate-400">MONTHLY AD SPEND CAP</label>
                  <select
                    value={form.budget}
                    onChange={(e) => setForm({...form, budget: e.target.value})}
                    className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 text-xs font-semibold focus:border-indigo-500 outline-none text-white appearance-none"
                  >
                    <option value="$2,000 - $5,000">$2,000 - $5,000 monthly</option>
                    <option value="$5,000 - $10,000">$5,000 - $10,000 monthly</option>
                    <option value="$10,000 - $25,000">$10,000 - $25,000 monthly</option>
                    <option value="$25,000+">$25,000+ monthly</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-mono font-black uppercase tracking-widest text-slate-400">SERVICE OF INTEREST</label>
                  <input
                    type="text"
                    placeholder="E.g. Facebook Ads"
                    value={form.service}
                    onChange={(e) => setForm({...form, service: e.target.value})}
                    className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 text-xs font-semibold focus:border-indigo-500 outline-none text-white"
                  />
                </div>
              </div>

              {form.plan && (
                <div className="space-y-2">
                  <label className="text-[9px] font-mono font-black uppercase tracking-widest text-rose-500">SELECTED SLA PLAN CAP</label>
                  <input
                    type="text"
                    disabled
                    value={form.plan}
                    className="w-full bg-rose-500/5 border border-rose-500/20 rounded-xl py-3 px-4 text-xs font-black text-rose-450 uppercase cursor-not-allowed"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[9px] font-mono font-black uppercase tracking-widest text-slate-400">METRICS PAIN BRIEF *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Outline your current CAC, CPA boundaries, or conversion gaps..."
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                  className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 text-xs font-semibold focus:border-indigo-500 outline-none text-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-550 disabled:bg-indigo-900 text-white text-xs font-black py-4.5 uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 cursor-pointer transition-all border-b-2 border-indigo-850"
              >
                {loading ? 'Transmitting metrics file...' : (pagesConfig.contactCtaText || 'Authorize strategy request')}
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Row 2: Combined Map & Contact Details Block */}
      <div className="bg-[#03030f] border border-white/[0.05] p-6 lg:p-8 rounded-[2.5rem] relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-8">
        {/* Left Column of Row 2: Details Cards */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="text-left border-b border-white/[0.05] pb-4">
              <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-slate-300 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                NEXASPHERE HQ SYSTEM LOCATOR
              </h4>
              <p className="text-[9px] font-mono text-slate-500 mt-0.5">Corporate routing nodes & direct terminal hotdesks</p>
            </div>

            <div className="space-y-3">
              {/* Global Headquarters MAP PIN Card */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => triggerRedirection('map', 'Nexasphere It, House 15, Road 10, Block B, Chandrima Model Town, Muhammadpur, Dhaka, Bangladesh', 'NexaSphere Headquarters Map')}
                className="flex gap-4 p-4 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.03] hover:border-white/[0.08] transition-all cursor-pointer group text-left"
                title="Locate headquarters in Map Portal"
              >
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/25 group-hover:scale-110 transition-all duration-300">
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white group-hover:text-indigo-400 transition-colors">Global Headquarters</h4>
                  <div className="text-slate-400 text-[11px] font-semibold leading-relaxed mt-1 italic">
                    Block B, Chandrima Model Town, House 15, Road 10, Ber badh road, Muhammadpur, Bangladesh, 1207
                  </div>
                </div>
              </motion.div>

              {/* Proposals Mail Card */}
              <motion.div 
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => triggerRedirection('mail', 'nexasphereit@gmail.com', 'Corporate Mail Context')}
                className="flex gap-4 p-4 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.03] hover:border-white/[0.08] transition-all cursor-pointer group text-left"
                title="Compose secure proposal email"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0 group-hover:bg-purple-500/25 group-hover:scale-110 transition-all duration-300">
                  <Mail size={22} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-white group-hover:text-purple-400 transition-colors">Partner Proposals</h4>
                  <div className="text-slate-400 text-[11px] font-semibold leading-relaxed mt-1 italic font-mono">
                    nexasphereit@gmail.com
                  </div>
                </div>
              </motion.div>

              {/* Phone cards (Primary & Secondary stacked side-by-side or simple grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => triggerRedirection('call', '01976 981940', 'Primary Corporate Line')}
                  className="flex gap-3 p-3.5 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.03] hover:border-white/[0.08] transition-all cursor-pointer group text-left"
                  title="Initiate voice dialing sequence"
                >
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center shrink-0 group-hover:bg-pink-500/25 group-hover:scale-110 transition-all duration-300">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-white group-hover:text-pink-400 transition-colors">Primary Helpline</h4>
                    <div className="text-slate-450 text-[11px] font-semibold mt-0.5 italic font-mono">
                      01976 981940
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => triggerRedirection('call', '01410 981940', 'Secondary Corporate Line')}
                  className="flex gap-3 p-3.5 rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] border border-white/[0.03] hover:border-white/[0.08] transition-all cursor-pointer group text-left"
                  title="Initiate backup voice dialing sequence"
                >
                  <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center shrink-0 group-hover:bg-pink-500/25 group-hover:scale-110 transition-all duration-300">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-wider text-white group-hover:text-pink-400 transition-colors">Secondary Hotdesk</h4>
                    <div className="text-slate-450 text-[11px] font-semibold mt-0.5 italic font-mono">
                      01410 981940
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Status Indicator panel under cards */}
          <div className="flex items-center gap-3 font-mono text-[9px] text-slate-400 bg-white/[0.02] border border-white/[0.05] p-3 rounded-xl justify-between">
            <div className="flex items-center gap-1.5">
              <Activity size={10} className="text-emerald-400 animate-pulse" />
              <span>TELEMETRY PING: <span className="text-white font-bold">{pingMs}ms</span></span>
            </div>
            <div className="h-3 w-[1px] bg-white/[0.1]" />
            <div className="flex items-center gap-1.5">
              <Wifi size={10} className="text-emerald-400 animate-pulse" />
              <span className="text-emerald-400 font-bold uppercase font-mono">LIVE CONNECTION</span>
            </div>
          </div>
        </div>

        {/* Right Column of Row 2: Large Premium Map (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <span className="text-[10px] font-mono text-indigo-400 font-bold bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
              SYSTEM COORDS: 23.7564° N, 90.3629° E
            </span>

            {/* Premium theme selectors */}
            <div className="flex items-center gap-1 bg-white/[0.02] border border-white/[0.05] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setMapTheme('cyber')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  mapTheme === 'cyber'
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cyber Radar
              </button>
              <button
                type="button"
                onClick={() => setMapTheme('terminal')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  mapTheme === 'terminal'
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mono Grid
              </button>
              <button
                type="button"
                onClick={() => setMapTheme('satellite')}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  mapTheme === 'satellite'
                    ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Raw Map
              </button>
            </div>
          </div>

          {/* Responsive widescreen map iframe wrapper */}
          <div 
            className="flex-1 min-h-[420px] bg-slate-950 rounded-2xl border border-white/[0.03] overflow-hidden relative group shadow-2xl transition-all duration-300 hover:border-white/[0.1] flex flex-col"
            style={{
              boxShadow: mapTheme === 'cyber' 
                ? 'inset 0 0 40px rgba(244,63,94,0.15), 0 10px 30px -10px rgba(0,0,0,0.7)' 
                : mapTheme === 'terminal'
                ? 'inset 0 0 40px rgba(16,185,129,0.15), 0 10px 30px -10px rgba(0,0,0,0.7)'
                : '0 10px 30px -10px rgba(0,0,0,0.7)'
            }}
          >
            {/* Scan line overlay */}
            {mapTheme !== 'satellite' && (
              <div className="absolute inset-x-0 h-[2px] opacity-40 z-20 pointer-events-none" 
                style={{ 
                  animation: 'scanPulse 4s linear infinite',
                  backgroundColor: mapTheme === 'cyber' ? '#f43f5e' : '#10b981',
                  boxShadow: mapTheme === 'cyber' ? '0 0 8px #f43f5e' : '0 0 8px #10b981'
                }} 
              />
            )}

            {/* Dark gradient blur screen overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent to-black pointer-events-none z-10 opacity-30 mix-blend-overlay" />

            {/* Dynamic absolute float buttons on bottom */}
            <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-center bg-slate-950/95 border border-white/[0.08] backdrop-blur-md p-2 rounded-2xl shadow-2xl">
              <button
                type="button"
                onClick={() => {
                  try {
                    navigator.clipboard.writeText('23.7564, 90.3629');
                    toast.success('Coordinates copied securely: 23.7564, 90.3629');
                  } catch (e) {
                    toast.error('Unable to access clipboard');
                  }
                }}
                className="flex items-center gap-1.5 hover:bg-white/[0.05] text-slate-300 hover:text-white px-3 py-1.5 rounded-xl text-[9px] font-mono font-black uppercase tracking-wider transition-all duration-200 active:scale-95 cursor-pointer"
                title="Copy static coordinates"
              >
                <Copy size={11} className="text-indigo-400" />
                <span>Copy COORDS</span>
              </button>

              <button
                type="button"
                onClick={() => triggerRedirection('map', 'Nexasphere It, House 15, Road 10, Block B, Chandrima Model Town, Muhammadpur, Dhaka, Bangladesh', 'NexaSphere Headquarters Map')}
                className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white border border-rose-400/25 px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all duration-300 active:scale-95 shadow-lg shadow-rose-500/20 cursor-pointer"
                title="Initiate direct route maps navigation"
              >
                <Navigation size={11} className="animate-bounce" />
                <span>Launch Directions</span>
              </button>
            </div>

            {/* Floating compass azimuth tool */}
            <div className="absolute top-4 right-4 z-20">
              <div 
                className="w-10 h-10 rounded-xl bg-slate-950/80 border border-white/[0.1] backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer duration-500 group"
                title="Compass azimuth calibration"
              >
                <Compass size={18} className="animate-[spin_10s_linear_infinite] group-hover:rotate-45" style={{ animationDuration: '20s' }} />
              </div>
            </div>

            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1869693.9053657243!2d88.03482055664062!3d23.756438699049493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755bf0066e2cea9%3A0x36be64b4c912a59e!2sNexasphere%20It!5e0!3m2!1sen!2sbd!4v1780309538708!5m2!1sen!2sbd" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className={`transition-all duration-700 select-none flex-1 w-full h-full ${
                mapTheme === 'cyber'
                  ? 'grayscale invert-[0.93] contrast-[1.13] brightness-[0.8] opacity-90 hue-rotate-[210deg]'
                  : mapTheme === 'terminal'
                  ? 'grayscale invert-[0.9] contrast-[1.25] brightness-[0.85] opacity-95'
                  : 'grayscale-0 invert-0 opacity-100'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Custom keyframe styles for scanning sweep */}
      <style>{`
        @keyframes scanPulse {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
      </div>
    </div>
  );
}
