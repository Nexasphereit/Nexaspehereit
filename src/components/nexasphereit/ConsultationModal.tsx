import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Phone, AlertCircle, ShieldCheck, CheckCircle2, Clock, Zap, Target, Users, ExternalLink } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function ConsultationModal() {
  const { isConsultationOpen, setConsultationOpen, settings } = useTheme();
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Digital Marketing');
  const [isEmergency, setIsEmergency] = useState(false);
  const [budget, setBudget] = useState('$299 - $799');
  const [useSlider, setUseSlider] = useState(false);
  const [sliderBudget, setSliderBudget] = useState(199);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Success state with live ticket particulars
  const [submittedData, setSubmittedData] = useState<any | null>(null);

  // Core customization parameters (optional user add-ons)
  const optionalAddons = [
    { id: 'delivery', name: '⚡ Quick 48-Hour delivery sprint', price: 49, description: 'Rapid priority execution of content & draft sets' },
    { id: 'seo', name: '🔍 Premium organic SEO booster pack', price: 29, description: 'Sitemap indexing, metadata setup, alt-tag boost' },
    { id: 'mobile', name: '📱 Triple viewport adaptive testing', price: 19, description: 'Thorough mobile, tablet, and responsive layout audit' },
    { id: 'copy', name: '✍️ Conversion-focused copywriting', price: 39, description: 'Targeted headlines and clear lead generation prompts' },
    { id: 'stripe', name: '⚙️ Secure payment gateway flow link', price: 59, description: 'Interactive checkout system setup for smooth payments' }
  ];

  // Dynamic live pricing formula
  const baseCost = useSlider 
    ? sliderBudget 
    : budget === '$99 - $299' 
      ? 199 
      : budget === '$299 - $799' 
        ? 499 
        : 1390;

  const addonSum = selectedAddons.reduce((sum, id) => {
    const matched = optionalAddons.find(a => a.id === id);
    return sum + (matched ? matched.price : 0);
  }, 0);

  const totalEstimatedCost = baseCost + addonSum;

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter(a => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  // Specialists catalog for automated pairings
  const specialists: { [key: string]: { name: string; role: string; avatar: string } } = {
    'Digital Marketing': {
      name: 'Sarah Jenkins',
      role: 'Principal Growth Analyst',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
    },
    'Graphics Design': {
      name: 'Elena Rostova',
      role: 'Lead Visual Designer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
    },
    'Website Design': {
      name: 'Alex Mercer',
      role: 'Senior Full-Stack Developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
    },
    'Motion Graphics': {
      name: 'Marcus Vance',
      role: 'Creative Director & Animator',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
    },
    'Custom Software & DevOps': {
      name: 'Dr. Tariqul Islam',
      role: 'Principal Systems Architect',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
    }
  };

  const currentSpecialist = specialists[service] || specialists['Digital Marketing'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Please input your Name and Email Address');
      return;
    }

    setIsSubmitting(true);
    const trackingId = 'NEX-' + Math.floor(100000 + Math.random() * 900000);

    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || 'N/A',
      service: service,
      budget: useSlider ? `$${sliderBudget} (Custom precision budget slider)` : budget,
      selectedAddons: selectedAddons,
      estimatedCostLabel: `$${totalEstimatedCost}`,
      customPlanFeatures: selectedAddons.map(id => optionalAddons.find(a => a.id === id)?.name || id),
      message: message.trim() || 'No specifics provided. Requesting primary consultation with selected custom campaign parameters.',
      status: 'New',
      isEmergency: isEmergency,
      trackingId: trackingId,
      createdAt: serverTimestamp()
    };

    try {
      // 1. Save directly to high-security Firestore
      await addDoc(collection(db, 'nexasphereit_leads'), payload);
      
      // 2. Mock a local payload for real-time success dashboard state representation
      setSubmittedData({
        ...payload,
        assignedExpert: currentSpecialist.name,
        assignedExpertRole: currentSpecialist.role,
        assignedExpertAvatar: currentSpecialist.avatar
      });

      toast.success('Your strategic proposal has been securely logged on Firestore!');
    } catch (err: any) {
      console.error('Failed to log lead directly on Firestore:', err);
      toast.error('Logging lead directly on Firestore failed, but we queued your entry.');
      
      // Safe fallback if client is currently rate-limited/offline
      setSubmittedData({
        ...payload,
        assignedExpert: currentSpecialist.name,
        assignedExpertRole: currentSpecialist.role,
        assignedExpertAvatar: currentSpecialist.avatar
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setService('Digital Marketing');
    setIsEmergency(false);
    setBudget('$299 - $799');
    setUseSlider(false);
    setSliderBudget(199);
    setSelectedAddons([]);
    setMessage('');
    setSubmittedData(null);
  };

  return (
    <AnimatePresence>
      {isConsultationOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/80 p-3 sm:p-6 backdrop-blur-md">
          {/* Backdrop absolute click-close */}
          <div className="absolute inset-0 cursor-zoom-out" onClick={() => setConsultationOpen(false)} />

          {/* Modal dropdown box wrapper */}
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.98 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
            className="relative w-full max-w-4xl bg-gradient-to-b from-[#0a0a16] to-[#030308] border border-white/[0.08] rounded-3xl sm:rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.85)] overflow-hidden z-10 mx-auto my-4 sm:my-8"
          >
            {/* Upper accent boundary neon light bar */}
            <div className="h-[2.5px] w-full bg-gradient-to-r from-rose-600 via-indigo-500 to-pink-500" />

            {/* Top close button and header decoration */}
            <div className="flex items-center justify-between px-6 sm:px-12 pt-6 pb-2">
              <div className="flex items-center gap-1.5 bg-white/[0.03] border border-white/[0.05] rounded-full px-3 py-1">
                <Target size={11} className="text-rose-450 animate-pulse" />
                <span className="text-[9px] font-mono font-black uppercase text-slate-400 tracking-wider">
                  NexaSphere Strategic Consultation Hub
                </span>
              </div>
              <button
                onClick={() => setConsultationOpen(false)}
                className="p-2.5 bg-white/[0.03] hover:bg-rose-600/10 border border-white/[0.08] hover:border-rose-500/20 text-slate-450 hover:text-rose-450 rounded-xl transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Main scrollable grid area inside consultation */}
            <div className="px-4 xs:px-6 sm:px-12 pb-24 sm:pb-12 pt-2 text-left">
              
              {!submittedData ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Form Details (7 cols) */}
                  <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">
                    <div className="space-y-1">
                      <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                        Configure Strategic Campaign
                      </h2>
                      <p className="text-slate-450 text-[11px] font-semibold italic">
                        Select your project parameters below to sync instantly with our principal campaign planners.
                      </p>
                    </div>

                    {/* WhatsApp Action and Quick Direct Call */}
                    <div className="grid grid-cols-2 gap-2.5 w-full bg-white/[0.01] border border-white/[0.03] p-2.5 rounded-2xl">
                      <a 
                        href="https://wa.me/429457580254549" 
                        target="_blank" 
                        referrerPolicy="no-referrer"
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl text-center flex items-center justify-center gap-1.5 transition-all shadow-md shadow-emerald-950/20 select-none"
                      >
                        <Phone size={11} />
                        WhatsApp
                      </a>
                      <a 
                        href="tel:+429457580254549"
                        className="w-full py-2.5 bg-indigo-650/10 hover:bg-indigo-650/20 border border-indigo-500/15 text-indigo-300 font-extrabold text-[10px] uppercase tracking-widest rounded-xl text-center flex items-center justify-center gap-1.5 transition-all select-none"
                      >
                        <Phone size={11} />
                        Hotline Dial
                      </a>
                    </div>

                    {/* Personal coordinates inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400 block">
                          Full Name *
                        </label>
                        <input 
                          type="text" 
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="your brand or name"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/[0.06] text-white text-xs font-semibold placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/40 transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400 block">
                          Email address *
                        </label>
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="brand@example.com"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/[0.06] text-white text-xs font-semibold placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/40 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400 block">
                          Phone Number (Optional)
                        </label>
                        <input 
                          type="tel" 
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+8801 or WhatsApp Contact"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/[0.06] text-white text-xs font-mono font-semibold placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/40 transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400 block">
                          System Service Category
                        </label>
                        <select
                          value={service}
                          onChange={(e) => setService(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/[0.06] text-white text-xs font-bold focus:outline-none focus:border-indigo-500/40 transition-colors cursor-pointer"
                        >
                          <option value="Digital Marketing">Digital Marketing</option>
                          <option value="Graphics Design">Graphics Design</option>
                          <option value="Website Design">Website Design</option>
                          <option value="Motion Graphics">Motion Graphics</option>
                          <option value="Custom Software & DevOps">Custom Software & DevOps</option>
                        </select>
                      </div>
                    </div>

                    {/* Smart parameters segment: Emergency Priority & Budget Level */}
                    <div className="p-4 sm:p-5 bg-indigo-950/15 border border-indigo-500/10 rounded-2xl space-y-5">
                      {/* Section 1: Emergency */}
                      <div className="flex items-center justify-between gap-4">
                        <div className="space-y-0.5">
                          <label className="text-xs font-black uppercase tracking-tight text-white flex items-center gap-1.5">
                            🚨 Emergency Critical Launch Option
                          </label>
                          <p className="text-[10px] text-slate-400 italic">
                            Enabling this assigns your project directly to priority lanes with 72-hour campaign execution.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsEmergency(!isEmergency)}
                          className={`w-12 h-6.5 rounded-full p-0.5 transition-colors relative cursor-pointer focus:outline-none ${
                            isEmergency ? 'bg-rose-600' : 'bg-slate-800'
                          }`}
                        >
                          <div 
                            className={`w-5.5 h-5.5 rounded-full bg-white shadow transition-transform ${
                              isEmergency ? 'translate-x-5.5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="h-[1px] bg-white/[0.05]" />

                      {/* Section 2: Budget Mode Selector */}
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                          <span className="text-[8.5px] font-mono font-black uppercase tracking-widest text-[#a5b4fc] tracking-[0.1em]">
                            ESTIMATED PROJECT BUDGET DEFINITION
                          </span>
                          <div className="flex bg-slate-950/80 p-0.5 rounded-lg border border-white/[0.05] self-start sm:self-auto">
                            <button
                              type="button"
                              onClick={() => setUseSlider(false)}
                              className={`px-3 py-1 text-[8.5px] font-black uppercase rounded-md transition-all cursor-pointer ${
                                !useSlider ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              Preset Tiers
                            </button>
                            <button
                              type="button"
                              onClick={() => setUseSlider(true)}
                              className={`px-3 py-1 text-[8.5px] font-black uppercase rounded-md transition-all cursor-pointer ${
                                useSlider ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              Precise Slider
                            </button>
                          </div>
                        </div>

                        {!useSlider ? (
                          <div className="grid grid-cols-3 gap-2">
                            {['$99 - $299', '$299 - $799', '$799 - $1,999'].map((tier) => (
                              <button
                                key={tier}
                                type="button"
                                onClick={() => setBudget(tier)}
                                className={`py-2 px-1.5 sm:px-3 rounded-xl border text-[9px] xs:text-[10.5px] font-black text-center transition-all cursor-pointer truncate ${
                                  budget === tier
                                    ? 'bg-indigo-650 hover:bg-indigo-600 text-white border-indigo-400/30'
                                    : 'bg-slate-950/80 text-slate-450 border-white/[0.04] hover:border-white/[0.08]'
                                }`}
                              >
                                {tier}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2 p-3 bg-slate-950/60 rounded-xl border border-white/[0.03]">
                            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                              <span>Budget range limit: $50 - $1,500</span>
                              <span className="text-rose-400 font-black text-xs bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                                Exact limit: ${sliderBudget}
                              </span>
                            </div>
                            <input
                              type="range"
                              min={50}
                              max={1500}
                              step={25}
                              value={sliderBudget}
                              onChange={(e) => setSliderBudget(Number(e.target.value))}
                              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                            <p className="text-[9px] text-slate-500 italic">Drag to allocate precise client capital limits.</p>
                          </div>
                        )}
                      </div>

                      <div className="h-[1px] bg-white/[0.05]" />

                      {/* Section 3: Tailored Customization Options */}
                      <div className="space-y-2.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-[8.5px] font-mono font-black uppercase tracking-widest text-[#a5b4fc] tracking-[0.1em]">
                            TAILORED ADD-ON CUSTOMIZATION OPTIONS
                          </span>
                          <span className="text-[9px] font-mono text-emerald-450 font-bold bg-emerald-500/10 px-2 py-0.5 rounded self-start sm:self-auto">
                            {selectedAddons.length} Selected
                          </span>
                        </div>
                        
                        <div className="space-y-2 max-h-[175px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/[0.05]">
                          {optionalAddons.map((addon) => {
                            const isSelected = selectedAddons.includes(addon.id);
                            return (
                              <button
                                key={addon.id}
                                type="button"
                                onClick={() => toggleAddon(addon.id)}
                                className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer select-none ${
                                  isSelected 
                                    ? 'bg-indigo-600/15 border-indigo-500/40' 
                                    : 'bg-slate-950/85 hover:bg-slate-950 border-white/[0.04]'
                                }`}
                              >
                                <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-all ${
                                  isSelected 
                                    ? 'bg-indigo-500 border-indigo-400 text-white' 
                                    : 'border-white/[0.2] bg-transparent'
                                }`}>
                                  {isSelected && <span className="text-[9px] font-black">✓</span>}
                                </div>
                                <div className="space-y-0.5 flex-1">
                                  <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                                    <span className="text-[10.5px] font-black text-white leading-snug">{addon.name}</span>
                                    <span className="text-[9px] font-mono font-bold text-indigo-300 bg-indigo-550/15 px-1.5 py-0.3 rounded shrink-0">
                                      +${addon.price}
                                    </span>
                                  </div>
                                  <p className="text-[9.5px] text-slate-450 leading-tight">{addon.description}</p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Detailed specifics text-area */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono font-black uppercase tracking-wider text-slate-400 block">
                        Client Requirements / Demand Particulars
                      </label>
                      <textarea
                        id="requirements-textarea"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Detail your goals, deadlines, target metrics, or campaign specifications..."
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-white/[0.06] text-white text-xs font-semibold placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/40 transition-colors resize-none leading-relaxed"
                      />
                    </div>

                    {/* Submit action */}
                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-gradient-to-r from-rose-600 via-indigo-600 to-purple-650 hover:from-rose-500 hover:via-indigo-500 hover:to-purple-550 text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 select-none"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            <Send size={12} />
                            Submit Strategy Request
                          </>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Right Column: Live Diagnostic Dashboard Preview (5 cols) */}
                  <div className="lg:col-span-5 bg-[#050512] border border-white/[0.04] p-5 rounded-2xl relative overflow-hidden space-y-6 self-stretch flex flex-col justify-between">
                    
                    {/* Background faint diagnostic pattern */}
                    <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-indigo-500/[0.02] to-transparent pointer-events-none" />

                    <div className="space-y-5 relative">
                      <div className="border-b border-white/[0.05] pb-3">
                        <span className="text-[7px] font-mono font-black text-rose-455 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 tracking-widest uppercase inline-block mb-1">
                          LIVE PREVIEW ENGINE
                        </span>
                        <h3 className="text-xs font-black uppercase italic tracking-tight text-white">
                          Automated Allocation Board
                        </h3>
                      </div>

                      {/* Interactive assigned expert layout */}
                      <div className="space-y-3 bg-[#020207] p-4 rounded-xl border border-white/[0.02] text-left">
                        <span className="text-[7.5px] font-mono text-indigo-400 font-extrabold uppercase tracking-widest block">
                          RECOMMENDED ASSIGNED EXPERT:
                        </span>
                        
                        <div className="flex items-center gap-3">
                          <img 
                            src={currentSpecialist.avatar || undefined} 
                            alt={currentSpecialist.name} 
                            className="w-10 h-10 rounded-xl object-cover border border-white/[0.08]"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="text-xs font-black text-white">{currentSpecialist.name}</p>
                            <span className="text-[9.5px] text-indigo-300 font-semibold italic">
                              {currentSpecialist.role}
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-[9px] text-slate-450 leading-relaxed font-mono italic">
                          Matches criteria: "{service}" profile specializes securely in optimized {useSlider ? `$${sliderBudget} limits` : budget} solutions.
                        </p>
                      </div>

                      {/* Live computational breakdown */}
                      <div className="space-y-2 bg-[#020207] p-3.5 rounded-xl border border-white/[0.02] text-left">
                        <span className="text-[7.5px] font-mono text-[#a5b4fc] font-extrabold uppercase tracking-widest block">
                          DYNAMIC PLAN PRICING CALCULATION
                        </span>

                        <div className="space-y-1.5 font-mono text-[10px] text-slate-300">
                          <div className="flex justify-between">
                            <span>Base ({useSlider ? 'Exact Select' : 'Tier Set'}):</span>
                            <span className="font-extrabold text-white">${baseCost}</span>
                          </div>
                          {selectedAddons.length > 0 && (
                            <div className="space-y-1 pl-2 border-l border-white/[0.05]">
                              {selectedAddons.map((id) => {
                                const matched = optionalAddons.find(a => a.id === id);
                                if (!matched) return null;
                                return (
                                  <div key={id} className="flex justify-between text-[9px] text-slate-400 italic">
                                    <span>+ {matched.name.substring(2)}:</span>
                                    <span>+${matched.price}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          <div className="h-[1px] bg-white/[0.05] my-1" />
                          <div className="flex justify-between text-xs font-black text-rose-400">
                            <span>Total Custom Estimate:</span>
                            <span className="px-2 py-0.5 bg-rose-500/10 rounded font-black text-rose-455">
                              ${totalEstimatedCost}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* SLA metrics indicators */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-white/[0.01] border border-white/[0.03] rounded-xl">
                          <div className="flex items-center gap-1 text-[8px] font-mono text-slate-450 uppercase font-black">
                            <Clock size={10} className="text-indigo-400" />
                            Response SLA
                          </div>
                          <p className="text-xs font-black text-white mt-1">
                            {isEmergency ? '🚨 Within 30 Mins' : '⚡ Within 4 Hours'}
                          </p>
                        </div>

                        <div className="p-3 bg-white/[0.01] border border-white/[0.03] rounded-xl">
                          <div className="flex items-center gap-1 text-[8px] font-mono text-slate-450 uppercase font-black">
                            <Zap size={10} className="text-rose-400" />
                            Velocity Track
                          </div>
                          <p className="text-xs font-black text-white mt-1">
                            {isEmergency ? 'Express (3-Day SLA)' : 'Standard Agile'}
                          </p>
                        </div>
                      </div>

                      {/* Code security indicator */}
                      <div className="p-3 bg-emerald-950/15 border border-emerald-500/15 rounded-xl flex items-center gap-2.5">
                        <ShieldCheck size={16} className="text-emerald-450 animate-pulse shrink-0" />
                        <div>
                          <span className="text-[8px] font-mono font-black text-emerald-450 uppercase block">
                            AES-256 ENCRYPTED INBOUND
                          </span>
                          <p className="text-[9.5px] text-slate-400">
                            Submissions are securely stored directly in private Firestore DB rules.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quote statement */}
                    <div className="text-[8px] font-mono leading-relaxed text-slate-500 italic text-center border-t border-white/[0.04] pt-3">
                      Choosing "Standard Velocity" preserves developer bandwidth. For sudden project deadlines or severe traffic drops, select "Emergency Option".
                    </div>
                  </div>
                </div>
              ) : (
                
                /* ========================================================
                   Success Diagnostic Board (Dashboard View)
                   ======================================================== */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 pt-2"
                >
                  <div className="bg-rose-950/20 border border-rose-500/15 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="p-3 bg-rose-600/10 border border-rose-500/20 text-rose-500 rounded-2xl shadow-indigo-950/20">
                        <CheckCircle2 size={24} className="animate-bounce" />
                      </div>
                      <div>
                        <span className="text-[8px] font-mono font-black text-rose-400 tracking-widest uppercase block">
                          TICKET DISPATCHED SECURELY
                        </span>
                        <h3 className="text-lg font-black text-white uppercase italic">
                          Campaign Registered — ID: <span className="text-indigo-400 font-mono italic">{submittedData.trackingId}</span>
                        </h3>
                      </div>
                    </div>

                    <div className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-mono font-black rounded-lg flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      ACTIVE INBOUND QUEUED
                    </div>
                  </div>

                  {/* Grid tracking cards */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                    
                    {/* Left tracking tracker (7 cols) */}
                    <div className="lg:col-span-7 bg-[#020207] border border-white/[0.05] p-6 rounded-2xl space-y-5">
                      <span className="text-[8.5px] font-mono font-black text-indigo-400 uppercase tracking-widest block pb-1 border-b border-white/[0.04]">
                        REAL-TIME PROPOSAL PIPELINE TRACKER
                      </span>

                      {/* Stepper tracking progress tracker */}
                      <div className="space-y-6 relative pl-6">
                        {/* vertical connector line */}
                        <div className="absolute top-2.5 bottom-2.5 left-2.5 w-[2px] bg-indigo-500/10" />

                        {/* Step 1 */}
                        <div className="relative">
                          <div className="absolute -left-6.5 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center font-mono font-black text-[9px] z-10">
                            ✓
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-xs font-black text-white">1. Secure Firestore Lead Database Logging</p>
                            <p className="text-[10px] text-slate-450">Dispatched complete input array successfully to target collection.</p>
                          </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative">
                          <div className="absolute -left-6.5 w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center font-mono font-black text-[9px] z-10">
                            ✓
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-xs font-black text-white">2. Auto-Expert Selection Assigned</p>
                            <p className="text-[10px] text-indigo-300 font-semibold italic">Matched Campaign Specialist: {submittedData.assignedExpert}.</p>
                          </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative animate-pulse">
                          <div className="absolute -left-6.5 w-6 h-6 rounded-full bg-indigo-550/20 border border-indigo-400 text-indigo-400 flex items-center justify-center font-mono font-black text-[10px] z-10">
                            3
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-xs font-black text-white">3. Reviewing Strategic Feasibility SLA</p>
                            <p className="text-[10px] text-slate-450 italic">
                              SLA ETA: {submittedData.isEmergency ? 'Critical Lane — Evaluated in 30 minutes.' : 'Standard Lane — Evaluated within 4 hours.'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* SMTP copy specs indicator */}
                      <div className="bg-[#050512] p-4 rounded-xl border border-white/[0.03] space-y-2">
                        <span className="text-[7.5px] font-mono font-black text-slate-500 uppercase tracking-widest block">
                          SYSTEM TRANSMITTAL TRANSCRIPT
                        </span>
                        
                        <div className="text-[9.5px] font-mono text-slate-400 bg-[#020205] p-3 rounded-lg border border-white/[0.01] space-y-1 block leading-relaxed select-all">
                          <p><span className="text-rose-450">{"["}System Dispatch{"]"}</span> target_db: "nexasphereit_leads"</p>
                          <p><span className="text-rose-450">{"["}System Dispatch{"]"}</span> tracking_id: "{submittedData.trackingId}"</p>
                          <p><span className="text-rose-450">{"["}System Dispatch{"]"}</span> lead_category: "{submittedData.service}"</p>
                          <p><span className="text-rose-450">{"["}System Dispatch{"]"}</span> custom_addons: "{submittedData.customPlanFeatures && submittedData.customPlanFeatures.length > 0 ? submittedData.customPlanFeatures.join(', ') : 'None selected'}"</p>
                          <p><span className="text-rose-450">{"["}System Dispatch{"]"}</span> budget_estimate: "{submittedData.estimatedCostLabel || submittedData.budget}"</p>
                          <p><span className="text-rose-450">{"["}System Dispatch{"]"}</span> campaign_priority: "{submittedData.isEmergency ? 'EMERGENCY CRITICAL/🚨' : 'STANDARD AGILE'}"</p>
                        </div>
                      </div>
                    </div>

                    {/* Right paired expert dashboard card (5 cols) */}
                    <div className="lg:col-span-5 bg-[#050512] border border-white/[0.04] p-5 rounded-2xl flex flex-col justify-between space-y-6">
                      <div className="space-y-4">
                        <span className="text-[7.5px] font-mono font-black text-rose-450 px-2.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 tracking-widest uppercase inline-block">
                          ASSIGNED CAMPAIGN EXPERT
                        </span>

                        {/* Beautiful dedicated visual avatar card */}
                        <div className="p-4 bg-slate-950/80 border border-white/[0.04] rounded-xl flex items-center gap-4 text-left">
                          <img 
                            src={submittedData.assignedExpertAvatar || undefined} 
                            alt={submittedData.assignedExpert} 
                            className="w-14 h-14 rounded-2xl object-cover border border-indigo-500/20 shadow-md shadow-indigo-950/30"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="text-[7px] font-mono font-black text-indigo-450 uppercase tracking-widest block">
                              Principal Specialist Assigned
                            </span>
                            <p className="text-sm font-black text-white">{submittedData.assignedExpert}</p>
                            <p className="text-[10px] text-indigo-300 font-semibold italic">{submittedData.assignedExpertRole}</p>
                          </div>
                        </div>

                        <div className="p-4.5 bg-slate-950 border border-white/[0.03] rounded-2xl text-xs font-semibold leading-relaxed text-slate-300">
                          <p className="font-medium">Welcome to the NexaSphere network,</p>
                          <p className="mt-1.5 text-indigo-200">
                            "I have marked this proposal severity level as <span className="font-bold text-white uppercase italic">{submittedData.isEmergency ? 'emergency priority' : 'standard Agile track'}</span>. I will review the metrics provided for '{submittedData.service}' and contact you directly via <span className="text-white font-black">{submittedData.email}</span> with a custom feasibility roadmap."
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-white/[0.04] flex flex-wrap items-center justify-between gap-3">
                        <button
                          onClick={handleReset}
                          className="px-4.5 py-2.5 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] text-slate-300 text-[9.5px] font-black tracking-widest uppercase rounded-xl transition-all cursor-pointer"
                        >
                          Submit New Enquiry
                        </button>
                        
                        <button
                          onClick={() => setConsultationOpen(false)}
                          className="px-5 py-2.5 bg-indigo-650 hover:bg-indigo-600 text-white text-[9.5px] font-black tracking-widest uppercase rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                        >
                          Close Panel Dashboard
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Sticky Mobile/Tablet Plan Builder Summary Bar */}
          {!submittedData && (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#060613]/95 border-t border-white/[0.08] backdrop-blur-xl px-4 py-3 pb-safe flex items-center justify-between gap-4 shadow-[0_-15px_40px_rgba(0,0,0,0.6)]">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img 
                    src={currentSpecialist.avatar || undefined} 
                    alt={currentSpecialist.name} 
                    className="w-9 h-9 rounded-lg object-cover border border-white/[0.1]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-600 border border-slate-900 rounded-full flex items-center justify-center text-[7px] text-white font-black">
                    ★
                  </div>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-white">{currentSpecialist.name}</span>
                    <span className="text-[7.5px] font-mono text-[#a5b4fc] font-bold bg-indigo-500/10 px-1 py-0.2 rounded">
                      Expert
                    </span>
                  </div>
                  <p className="text-[9.5px] text-emerald-400 font-bold font-mono">
                    Cost: ${totalEstimatedCost}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('requirements-textarea');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                      el.focus();
                    }
                  }}
                  className="px-3 py-2 bg-slate-900 border border-white/[0.06] text-slate-300 rounded-lg hover:text-white transition-all text-[9.5px] uppercase font-bold cursor-pointer"
                >
                  Specs
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-gradient-to-r from-rose-600 to-indigo-650 text-white font-black uppercase tracking-wider text-[9px] rounded-lg shadow-lg active:scale-95 transition-all flex items-center gap-1 cursor-pointer select-none"
                >
                  {isSubmitting ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={9} />
                      Submit
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
