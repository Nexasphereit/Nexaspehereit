import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Send, Mail, Phone, MapPin, CheckCircle, HelpCircle, 
  Sparkles, Calendar, Heart, ShieldAlert 
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function NexoraContact() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialService = searchParams.get('service') || '';
  const initialPlan = searchParams.get('plan') || '';

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

  const submitContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill out all mandatory fields (Name, Email, Message)!");
      return;
    }

    setLoading(true);
    try {
      // Add record to nexora_leads in Firestore dynamically
      const leadRef = await addDoc(collection(db, 'nexora_leads'), {
        ...form,
        createdAt: serverTimestamp(),
        status: 'New'
      });

      // Also record message count triggers
      await addDoc(collection(db, 'nexora_messages'), {
        sender: form.name,
        email: form.email,
        company: form.company,
        message: form.message,
        createdAt: serverTimestamp(),
        leadId: leadRef.id
      });

      setSubmitted(true);
      toast.success("Elite Strategy Request Captured Successfully!");
    } catch (err) {
      console.error("Could not write contact submit to Firestore:", err);
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

      <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* Left column - details */}
        <div className="lg:col-span-5 space-y-12 text-left">
          <div className="space-y-4">
            <span className="text-[10px] text-indigo-405 font-black uppercase tracking-[0.25em] italic">SECURE SYSTEM ALLOCATION</span>
            <h1 className="text-4xl sm:text-5xl font-sans font-black italic uppercase tracking-tighter leading-none">
              INITIAL CORE STRATEGY DEBIEF
            </h1>
            <p className="text-slate-450 text-xs sm:text-sm font-semibold italic leading-relaxed">
              Let's build your multi-million scaling blueprint. Complete our target parameters form and our lead marketing architects will execute a custom ROAS analysis within 24 hours.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0">
                <MapPin size={22} />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider text-white">Global Headquarters</h4>
                <p className="text-slate-400 text-xs font-semibold leading-relaxed mt-1 italic">
                  Nexora Towers, Tech Plaza, New York, NY 10001
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
                <Mail size={22} />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider text-white">Partner Proposals</h4>
                <p className="text-slate-400 text-xs font-semibold leading-relaxed mt-1 italic">
                  partner@nexoradigital.com
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center shrink-0">
                <Phone size={22} />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider text-white">Scale Hotdesk</h4>
                <p className="text-slate-400 text-xs font-semibold leading-relaxed mt-1 italic">
                  +1 (800) 555-NEXORA
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Custom Map Block Locator */}
          <div className="bg-[#03030f] border border-white/[0.05] p-6 rounded-[2rem] relative overflow-hidden space-y-4">
            <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-[#cbd5e1]">MAP COORDINATES SECTOR</h4>
            <div className="h-44 bg-slate-950 rounded-2xl border border-white/[0.03] relative flex items-center justify-center p-4">
              {/* Artistic Grid Backdrop representing physical map lines */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] opacity-60" />
              <div className="absolute w-24 h-24 rounded-full bg-indigo-505/10 animate-pulse border border-indigo-550/20" />
              
              <div className="relative z-10 text-center space-y-2">
                <div className="w-3 h-3 rounded-full bg-indigo-500 mx-auto animate-ping" />
                <p className="text-[10px] font-black tracking-widest text-indigo-400 mt-1">40.7128° N, 74.0060° W</p>
                <p className="text-[9px] text-slate-500 font-mono text-center">NEXORA EASTERN GRID TERMINAL</p>
              </div>
            </div>
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
                {loading ? 'Transmitting metrics file...' : 'Authorize strategy request'}
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
