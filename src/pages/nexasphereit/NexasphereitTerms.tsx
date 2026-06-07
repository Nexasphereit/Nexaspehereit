import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Scale, FileText, ArrowRight, Globe, Layers, 
  CreditCard, RefreshCw, UserCheck, Key, Lock, Edit3, 
  Flame, Mail, CheckCircle, HelpCircle, ArrowLeft, Send
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NexasphereitTerms() {
  const [langTab, setLangTab] = useState<'english' | 'bangla' | 'dual'>('dual');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#02020a] text-white pt-28 pb-24 relative overflow-hidden">
      {/* Decorative Cinematic Radial Blurs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/[0.04] rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-red-600/[0.03] rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-600/[0.03] rounded-full filter blur-2xl pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-12">
        
        {/* Breadcrumb Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.03] pb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 group text-xs font-mono text-slate-400 hover:text-indigo-400 uppercase tracking-widest font-black transition-colors"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            <span>HQ Dashboard</span>
          </Link>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 font-extrabold uppercase">
            <span>Core Hub</span>
            <span className="text-slate-700">/</span>
            <span className="text-indigo-400 hover:text-indigo-300 transition-colors">Terms of Service</span>
          </div>
        </div>

        {/* Master Header */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-3 bg-indigo-950/20 border border-indigo-900/30 px-4 py-2 rounded-2xl">
            <Scale size={14} className="text-indigo-400 animate-pulse" />
            <span className="text-[10px] font-mono font-black text-indigo-300 tracking-widest uppercase">
              // NexaSphere IT Legal Protocol
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-black tracking-tight uppercase italic leading-none">
            TERMS & <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 font-black">CONDITIONS</span>
            <div className="text-2xl sm:text-3xl font-sans text-slate-350 tracking-normal not-italic font-black mt-2 font-bengali">
              নিয়ম ও শর্তাবলী
            </div>
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm font-semibold italic max-w-2xl mx-auto leading-relaxed">
            By engaging in business or accessing the software and professional modules of NexaSphere IT, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
          </p>
        </section>

        {/* Version Interactive Language Selector Bar */}
        <div className="flex justify-center">
          <div className="bg-slate-950/80 border border-white/[0.05] p-1.5 rounded-2xl flex items-center gap-2 shadow-2xl backdrop-blur-xl">
            <button
              onClick={() => setLangTab('english')}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
                langTab === 'english'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-450 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              English Version
            </button>
            <button
              onClick={() => setLangTab('bangla')}
              className={`px-5 py-2.5 rounded-xl text-[10px] sm:text-xs font-sans font-bold transition-all cursor-pointer ${
                langTab === 'bangla'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-450 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              বাংলা সংস্করণ
            </button>
            <button
              onClick={() => setLangTab('dual')}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
                langTab === 'dual'
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white shadow-lg shadow-purple-500/20'
                  : 'text-slate-450 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              Dual View (পারস্পরিক ভিউ)
            </button>
          </div>
        </div>

        {/* MAIN LEGAL DOCUMENTS GRID */}
        <AnimatePresence mode="wait">
          <motion.div
            key={langTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* CONDITIONAL RENDER PER TABS */}
            
            {/* 1. DUAL COMPARE TABLE/VIEW */}
            {langTab === 'dual' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                {/* DUAL MAIN - BENGALI SECTION */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-indigo-950 pb-3">
                    <span className="text-[10px] font-mono font-black text-indigo-400 tracking-widest uppercase">SECTION 01: বাংলা সংস্করণ</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  </div>

                  {/* 1. Acceptance of Terms */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-950/30 border border-indigo-900/20 flex items-center justify-center text-indigo-400">
                        <ShieldCheck size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight">শর্তাবলী গ্রহণ</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-medium">
                      NexaSphere IT প্রদত্ত পরিষেবাসমূহ ব্যবহার করে, আপনি এই শর্তাবলীর অধীন হতে সম্মত হচ্ছেন। যদি আপনি এই শর্তাবলীর কোনো অংশের সাথে একমত না হন, তবে আপনি আমাদের পরিষেবা ব্যবহার করতে পারবেন না।
                    </p>
                  </div>

                  {/* 2. Services Offered */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-950/30 border border-purple-900/20 flex items-center justify-center text-purple-400">
                        <Layers size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight">প্রদত্ত পরিষেবা</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-medium">
                      NexaSphere IT বিভিন্ন ধরনের পরিষেবা প্রদান করে, যার মধ্যে রয়েছে—ডিজিটাল মার্কেটিং, ওয়েব ডেভেলপমেন্ট, ভিডিও প্রোডাকশন, ক্রিয়েটিভ সলিউশন, এবং অন্যান্য সম্পর্কিত পরিষেবা (পরবর্তীতে “পরিষেবা” নামে উল্লেখ করা হবে)।
                    </p>
                  </div>

                  {/* 3. Payment */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-950/30 border border-pink-900/20 flex items-center justify-center text-pink-400">
                        <CreditCard size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight">পেমেন্ট নীতি</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-medium">
                      ক্লায়েন্টরা NexaSphere IT কর্তৃক প্রদত্ত প্রস্তাবনা বা চুক্তিতে নির্ধারিত ফি প্রদানে সম্মত থাকবেন। নির্ধারিত সময়সূচি অনুযায়ী পেমেন্ট প্রদান করতে হবে, অন্যথায় পরিষেবা স্থগিত বা বাতিল হতে পারে।
                    </p>
                  </div>

                  {/* 4. Refund Policy */}
                  <div className="bg-[#050207] border border-purple-950/40 hover:border-purple-900/30 p-6 sm:p-8 rounded-[2.5rem] transition-all space-y-6">
                    <div className="flex items-center justify-between border-b border-purple-950/50 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-950/50 border border-purple-900/40 flex items-center justify-center text-purple-400">
                          <RefreshCw size={20} />
                        </div>
                        <h4 className="font-sans font-black text-white text-lg tracking-tight">রিফান্ড নীতি</h4>
                      </div>
                      <span className="text-[8px] font-mono bg-purple-950/60 text-purple-400 border border-purple-900/30 px-3 py-1.5 rounded-full uppercase tracking-wider font-extrabold shadow-lg">REFUND CODES</span>
                    </div>

                    <div className="space-y-4 text-xs font-medium">
                      <div className="space-y-1.5">
                        <span className="text-xs font-black text-purple-400 block">// যোগ্যতা (Eligibility):</span>
                        <p className="text-slate-350 text-xs leading-relaxed">
                          <strong className="text-white font-black italic">পরিষেবা সরবরাহ না করা:</strong> কোনো কারণে NexaSphere IT যদি চুক্তিকৃত পরিষেবা সরবরাহ করতে ব্যর্থ হয়।
                        </p>
                      </div>

                      <div className="space-y-2 border-t border-white/[0.02] pt-3.5">
                        <span className="text-xs font-black text-purple-400 block">// রিফান্ড অনুরোধ (Refund Requests):</span>
                        <p className="text-slate-350 text-xs leading-relaxed">
                          ক্লায়েন্টকে পরিষেবা সম্পন্ন হওয়ার পর <strong className="text-white font-bold">৭-১০ কর্মদিবসের</strong> মধ্যে <a href="mailto:nexasphereit@gmail.com" className="text-purple-400 font-semibold underline hover:text-purple-300">nexasphereit@gmail.com</a> ঠিকানায় লিখিত আকারে রিফান্ড অনুরোধ জমা দিতে হবে।
                        </p>
                        <ul className="grid grid-cols-1 gap-2 pl-4 text-slate-350 list-disc italic text-[11px]">
                          <li>ক্লায়েন্টের নাম ও যোগাযোগের তথ্য</li>
                          <li>পরিষেবার বিবরণ</li>
                          <li>রিফান্ড অনুরোধের কারণের ব্যাখ্যা</li>
                          <li>প্রয়োজন হলে সহায়ক নথিপত্র</li>
                        </ul>
                      </div>

                      <div className="space-y-1.5 border-t border-white/[0.02] pt-3.5">
                        <span className="text-xs font-black text-purple-400 block">// রিফান্ড প্রক্রিয়া (Refund Process):</span>
                        <ul className="space-y-1.5 text-slate-350 text-[11px] list-decimal pl-4 leading-relaxed">
                          <li>রিফান্ড অনুরোধ পাওয়ার পর NexaSphere IT ৩ কর্মদিবসের মধ্যে তা পর্যালোচনা করবে। প্রয়োজনে ক্লায়েন্টের কাছ থেকে অতিরিক্ত তথ্য বা ব্যাখ্যা চাওয়া হতে পারে।</li>
                          <li>রিফান্ড অনুমোদিত হলে, NexaSphere IT মূল পেমেন্ট পদ্ধতির মাধ্যমে ৩ কর্মদিবসের মধ্যে রিফান্ড প্রক্রিয়া সম্পন্ন করবে।</li>
                        </ul>
                      </div>

                      <div className="space-y-1.5 border-t border-white/[0.02] pt-3.5">
                        <span className="text-xs font-black text-rose-455 block">// যেসব পরিষেবা রিফান্ডযোগ্য নয়:</span>
                        <p className="text-rose-200/70 text-[11px] leading-relaxed">
                          কিছু পরিষেবা রিফান্ডযোগ্য নয়, যেমন—কনসালটেশন ফি, অ্যাসেসমেন্ট ফি, ভিডিও প্রোডাকশন চার্জ, মডেল রেমুনারেশন, এবং NexaSphere IT কর্তৃক ক্লায়েন্টের পক্ষ থেকে প্রদত্ত যেকোনো খরচ।
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 5. Client Responsibilities */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-950/30 border border-orange-900/20 flex items-center justify-center text-orange-455">
                        <UserCheck size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight">ক্লায়েন্টের দায়িত্ব</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-medium">
                      পরিষেবার সফল ডেলিভারির জন্য প্রয়োজনীয় তথ্য, অ্যাক্সেস, এবং অনুমোদন প্রদান করার দায়িত্ব ক্লায়েন্টের। ক্লায়েন্টের কারণে সৃষ্ট বিলম্ব প্রকল্পের সময়সূচিতে পরিবর্তন আনতে পারে।
                    </p>
                  </div>

                  {/* 6. Intellectual Property */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-950/30 border border-emerald-900/20 flex items-center justify-center text-emerald-400">
                        <Key size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight">বুদ্ধিবৃত্তিক সম্পত্তি অধিকার</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-medium">
                      পূর্ণ পেমেন্ট সম্পন্ন হলে, NexaSphere IT কর্তৃক সরবরাহিত চূড়ান্ত ডেলিভারেবল-এর মালিকানা ক্লায়েন্টের হবে। NexaSphere IT সম্পন্ন প্রকল্পগুলো প্রমোশনাল উদ্দেশ্যে ব্যবহার করার অধিকার সংরক্ষণ করে।
                    </p>
                  </div>

                  {/* 7. Confidentiality */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-950/30 border border-indigo-900/20 flex items-center justify-center text-indigo-400">
                        <Lock size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight">গোপনীয়তা ও চুক্তি বাতিলকরণ</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-medium">
                      যে কোনো পক্ষ, অন্য পক্ষের দ্বারা বড় ধরনের শর্ত ভঙ্গের ক্ষেত্রে, লিখিত নোটিশের মাধ্যমে চুক্তি বাতিল করতে পারে। বাতিলের সময় পর্যন্ত প্রাপ্ত ফি-এর জন্য ক্লায়েন্ট দায়বদ্ধ থাকবেন।
                    </p>
                  </div>

                  {/* 8. Changes to Terms */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-950/30 border border-blue-900/20 flex items-center justify-center text-blue-400">
                        <Edit3 size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight">শর্তাবলীর পরিবর্তন</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-medium">
                      NexaSphere IT যে কোনো সময় এই শর্তাবলী পরিবর্তন করার অধিকার সংরক্ষণ করে। পরিবর্তন হলে ক্লায়েন্টকে জানানো হবে, এবং পরিষেবার অব্যাহত ব্যবহার পরিবর্তিত শর্তাবলী মেনে নেওয়া হিসেবে গণ্য হবে।
                    </p>
                  </div>
                </div>

                {/* DUAL MAIN - ENGLISH SECTION */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-rose-950 pb-3">
                    <span className="text-[10px] font-mono font-black text-rose-455 tracking-widest uppercase">SECTION 02: English Version</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                  </div>

                  {/* 1. Acceptance of Terms */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-950/30 border border-indigo-900/20 flex items-center justify-center text-indigo-400">
                        <ShieldCheck size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight uppercase italic">Acceptance of Terms</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-semibold italic">
                      By using the services provided by NexaSphere IT, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.
                    </p>
                  </div>

                  {/* 2. Services Offered */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-950/30 border border-purple-900/20 flex items-center justify-center text-purple-400">
                        <Layers size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight uppercase italic">Services Offered</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-semibold italic">
                      NexaSphere IT offers a range of services including but not limited to Digital Marketing, Web Development, Video Production, Creative Solutions, and other related services (hereinafter referred to as “Services”).
                    </p>
                  </div>

                  {/* 3. Payment */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-950/30 border border-pink-900/20 flex items-center justify-center text-pink-400">
                        <CreditCard size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight uppercase italic">Payment Method</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-semibold italic">
                      Clients agree to pay the agreed-upon fees for the Services as specified in the proposal or agreement provided by NexaSphere IT. Payments are due according to the agreed schedule, and failure to make timely payments may result in suspension or termination of services.
                    </p>
                  </div>

                  {/* 4. Refund Policy */}
                  <div className="bg-[#050207] border border-purple-950/40 hover:border-purple-900/30 p-6 sm:p-8 rounded-[2.5rem] transition-all space-y-6">
                    <div className="flex items-center justify-between border-b border-purple-950/50 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-950/50 border border-purple-900/40 flex items-center justify-center text-purple-400">
                          <RefreshCw size={20} />
                        </div>
                        <h4 className="font-sans font-black text-white text-lg tracking-tight uppercase italic">Refund Policy</h4>
                      </div>
                      <span className="text-[8px] font-mono bg-purple-950/60 text-purple-400 border border-purple-900/30 px-3 py-1.5 rounded-full uppercase tracking-wider font-extrabold shadow-lg">REFUND CODES</span>
                    </div>

                    <div className="space-y-4 text-xs font-semibold italic">
                      <div className="space-y-1.5">
                        <span className="text-xs font-black text-purple-400 block uppercase font-mono">// Eligibility:</span>
                        <p className="text-slate-350 text-xs leading-relaxed">
                          <strong className="text-white font-black italic">Service Non-Delivery:</strong> If, for any reason, NexaSphere IT is unable to deliver the agreed-upon services.
                        </p>
                      </div>

                      <div className="space-y-2 border-t border-white/[0.02] pt-3.5">
                        <span className="text-xs font-black text-purple-400 block uppercase font-mono">// Refund Requests:</span>
                        <p className="text-slate-350 text-xs leading-relaxed">
                          Clients must submit refund requests in writing to <a href="mailto:nexasphereit@gmail.com" className="text-purple-400 font-semibold underline hover:text-purple-300 not-italic">nexasphereit@gmail.com</a> within <strong className="text-white font-bold">7-10 business working days</strong> of the completion of the service.
                        </p>
                        <ul className="grid grid-cols-1 gap-2 pl-4 text-slate-350 list-disc italic text-[11px]">
                          <li>Client name and contact information</li>
                          <li>Service details</li>
                          <li>Explanation of the reasons for the refund request</li>
                          <li>Supporting documentation, if applicable</li>
                        </ul>
                      </div>

                      <div className="space-y-1.5 border-t border-white/[0.02] pt-3.5">
                        <span className="text-xs font-black text-purple-400 block uppercase font-mono">// Refund Process:</span>
                        <ul className="space-y-1.5 text-slate-350 text-[11px] list-decimal pl-4 leading-relaxed">
                          <li>Once a refund request is received, NexaSphere IT will review the request within 3 business days. We may request additional information or clarification from the client if needed.</li>
                          <li>If the refund request is approved, NexaSphere IT will process the refund within 3 business days through the original payment method.</li>
                        </ul>
                      </div>

                      <div className="space-y-1.5 border-t border-white/[0.02] pt-3.5">
                        <span className="text-xs font-black text-rose-455 block uppercase font-mono">// Non-Refundable Services:</span>
                        <p className="text-rose-200/70 text-[11px] leading-relaxed">
                          Certain services may be deemed non-refundable. These include, but are not limited to, consultation fees, assessment fees, video production charge, model remuneration and any expenses incurred by NexaSphere IT on behalf of the client.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 5. Client Responsibilities */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-950/30 border border-orange-900/20 flex items-center justify-center text-orange-455">
                        <UserCheck size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight uppercase italic">Client Responsibilities</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-semibold italic">
                      Clients are responsible for providing necessary information, access, and approvals required for the successful delivery of the Services. Delays caused by the client may result in adjustments to project timelines.
                    </p>
                  </div>

                  {/* 6. Intellectual Property */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-950/30 border border-emerald-900/20 flex items-center justify-center text-emerald-400">
                        <Key size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight uppercase italic">Intellectual Property</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-semibold italic">
                      Upon full payment, clients own the rights to the final deliverables provided by NexaSphere IT. NexaSphere IT retains the right to use completed projects for promotional purposes.
                    </p>
                  </div>

                  {/* 7. Confidentiality */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-950/30 border border-indigo-900/20 flex items-center justify-center text-indigo-400">
                        <Lock size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight uppercase italic">Confidentiality & Termination</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-semibold italic">
                      Either party may terminate the agreement with written notice in the event of a material breach by the other party. Upon termination, clients are responsible for fees incurred up to the termination date.
                    </p>
                  </div>

                  {/* 8. Changes to Terms */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-950/30 border border-blue-900/20 flex items-center justify-center text-blue-400">
                        <Edit3 size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight uppercase italic">Changes to Terms</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-semibold italic">
                      NexaSphere IT reserves the right to modify these Terms and Conditions at any time. Clients will be notified of any changes, and continued use of the Services constitutes acceptance of the modified terms.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* 2. ENGLISH ONLY VERSION */}
            {langTab === 'english' && (
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-slate-950/40 border border-white/[0.04] p-8 md:p-12 rounded-[2.5rem] space-y-8">
                  {/* Category Card Loop for Elegance */}
                  {[
                    {
                      no: "01",
                      title: "Acceptance of Terms",
                      desc: "By using the services provided by NexaSphere IT, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services.",
                      icon: ShieldCheck,
                      color: "text-indigo-400"
                    },
                    {
                      no: "02",
                      title: "Services Offered",
                      desc: "NexaSphere IT offers a range of services including but not limited to Digital Marketing, Web Development, Video Production, Creative Solutions, and other related services (hereinafter referred to as “Services”).",
                      icon: Layers,
                      color: "text-purple-400"
                    },
                    {
                      no: "03",
                      title: "Payment",
                      desc: "Clients agree to pay the agreed-upon fees for the Services as specified in the proposal or agreement provided by NexaSphere IT. Payments are due according to the agreed schedule, and failure to make timely payments may result in suspension or termination of services.",
                      icon: CreditCard,
                      color: "text-pink-400"
                    },
                  ].map((s) => (
                    <div key={s.title} className="flex gap-4 md:gap-6 items-start">
                      <div className="font-mono text-xs text-slate-600 font-extrabold pt-2 shrink-0">// {s.no}</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <s.icon size={16} className={s.color} />
                          <h4 className="font-sans font-black text-white text-base tracking-tight uppercase italic">{s.title}</h4>
                        </div>
                        <p className="text-slate-350 text-xs leading-relaxed font-medium">{s.desc}</p>
                      </div>
                    </div>
                  ))}

                  {/* Deep Detailed Refund Block */}
                  <div className="border border-purple-950/60 bg-[#050208] p-8 rounded-[2rem] space-y-6">
                    <div className="flex items-center gap-3 border-b border-purple-950/60 pb-3">
                      <RefreshCw size={18} className="text-purple-400 animate-spin" />
                      <h4 className="font-sans font-black tracking-widest text-xs text-purple-300 uppercase italic">04. REFUND BLUEPRINTS & PARAMETERS</h4>
                    </div>
                    <div className="space-y-4 text-xs font-semibold">
                      <div className="space-y-1">
                        <span className="text-purple-400 font-bold tracking-wider">// Eligibility</span>
                        <p className="text-slate-300">Refunds may be issued under the following circumstances:</p>
                        <p className="text-slate-400 pl-4 border-l border-purple-950 italic">
                          <strong className="text-white font-bold">Service Non-Delivery:</strong> If, for any reason, NexaSphere IT is unable to deliver the agreed-upon services.
                        </p>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-white/[0.02]">
                        <span className="text-purple-400 font-bold tracking-wider">// Refund Requests</span>
                        <p className="text-slate-300">
                          Clients must submit refund requests in writing to <a href="mailto:nexasphereit@gmail.com" className="text-indigo-400 underline font-extrabold hover:text-indigo-300">nexasphereit@gmail.com</a> within <strong className="text-white font-black">7-10 business working days</strong> of the completion of the service.
                        </p>
                        <p className="text-slate-400 text-xs">The refund request must include the following specifications:</p>
                        <ul className="list-disc pl-5 space-y-1 text-slate-400 text-[11px] italic">
                          <li>Client name and contact information</li>
                          <li>Service details</li>
                          <li>Explanation of the reasons for the refund request</li>
                          <li>Supporting documentation, if applicable</li>
                        </ul>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-white/[0.02]">
                        <span className="text-purple-400 font-bold tracking-wider">// Refund Process</span>
                        <ul className="list-decimal pl-5 space-y-1.5 text-slate-300 leading-relaxed text-[11px]">
                          <li>Once a refund request is received, NexaSphere IT will review the request within 3 business days. We may request additional information or clarification from the client if needed.</li>
                          <li>If the refund request is approved, NexaSphere IT will process the refund within 3 business days through the original payment method.</li>
                        </ul>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-white/[0.02]">
                        <span className="text-rose-455 font-bold tracking-wider">// Non-Refundable Services</span>
                        <p className="text-rose-200/60 text-[11px]">
                          Certain services may be deemed non-refundable. These include, but are not limited to, consultation fees, assessment fees, video production charge, model remuneration and any expenses incurred by NexaSphere IT on behalf of the client.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rest of the English categories */}
                  {[
                    {
                      no: "05",
                      title: "Client Responsibilities",
                      desc: "Clients are responsible for providing necessary information, access, and approvals required for the successful delivery of the Services. Delays caused by the client may result in adjustments to project timelines.",
                      icon: UserCheck,
                      color: "text-orange-400"
                    },
                    {
                      no: "06",
                      title: "Intellectual Property",
                      desc: "Upon full payment, clients own the rights to the final deliverables provided by NexaSphere IT. NexaSphere IT retains the right to use completed projects for promotional purposes.",
                      icon: Key,
                      color: "text-emerald-400"
                    },
                    {
                      no: "07",
                      title: "Confidentiality & Termination",
                      desc: "Either party may terminate the agreement with written notice in the event of a material breach by the other party. Upon termination, clients are responsible for fees incurred up to the termination date.",
                      icon: Lock,
                      color: "text-indigo-400"
                    },
                    {
                      no: "08",
                      title: "Changes to Terms",
                      desc: "NexaSphere IT reserves the right to modify these Terms and Conditions at any time. Clients will be notified of any changes, and continued use of the Services constitutes acceptance of the modified terms.",
                      icon: Edit3,
                      color: "text-blue-400"
                    }
                  ].map((s) => (
                    <div key={s.title} className="flex gap-4 md:gap-6 items-start pt-4 border-t border-white/[0.02]">
                      <div className="font-mono text-xs text-slate-600 pt-2 font-extrabold shrink-0">// {s.no}</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <s.icon size={16} className={s.color} />
                          <h4 className="font-sans font-black text-white text-base tracking-tight uppercase italic">{s.title}</h4>
                        </div>
                        <p className="text-slate-350 text-xs leading-relaxed font-semibold italic">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. BENGALI VERSION ONLY */}
            {langTab === 'bangla' && (
              <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-slate-950/40 border border-white/[0.04] p-8 md:p-12 rounded-[2.5rem] space-y-8">
                  {/* Category Card Loop for Elegance in Bangla */}
                  {[
                    {
                      no: "০১",
                      title: "শর্তাবলী গ্রহণ",
                      desc: "NexaSphere IT প্রদত্ত পরিষেবাসমূহ ব্যবহার করে, আপনি এই শর্তাবলীর অধীন হতে সম্মত হচ্ছেন। যদি আপনি এই শর্তাবলীর কোনো অংশের সাথে একমত না হন, তবে আপনি আমাদের পরিষেবা ব্যবহার করতে পারবেন না।",
                      icon: ShieldCheck,
                      color: "text-indigo-400"
                    },
                    {
                      no: "০২",
                      title: "প্রদত্ত পরিষেবা",
                      desc: "NexaSphere IT বিভিন্ন ধরনের পরিষেবা প্রদান করে, যার মধ্যে রয়েছে—ডিজিটাল মার্কেটিং, ওয়েব ডেভেলপমেন্ট, ভিডিও প্রোডাকশন, ক্রিয়েটিভ সলিউশন, এবং অন্যান্য সম্পর্কিত পরিষেবা (পরবর্তীতে “পরিষেবা” নামে উল্লেখ করা হবে)।",
                      icon: Layers,
                      color: "text-purple-400"
                    },
                    {
                      no: "০৩",
                      title: "পেমেন্ট নীতি",
                      desc: "ক্লায়েন্টরা NexaSphere IT কর্তৃক প্রদত্ত প্রস্তাবনা বা চুক্তিতে নির্ধারিত ফি প্রদানে সম্মত থাকবেন। নির্ধারিত সময়সূচি অনুযায়ী পেমেন্ট প্রদান করতে হবে, অন্যথায় পরিষেবা স্থগিত বা বাতিল হতে পারে।",
                      icon: CreditCard,
                      color: "text-pink-400"
                    },
                  ].map((s) => (
                    <div key={s.title} className="flex gap-4 md:gap-6 items-start">
                      <div className="font-mono text-xs text-slate-600 font-extrabold pt-2 shrink-0">// {s.no}</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <s.icon size={16} className={s.color} />
                          <h4 className="font-sans font-black text-white text-base tracking-tight">{s.title}</h4>
                        </div>
                        <p className="text-slate-350 text-xs leading-relaxed font-semibold">{s.desc}</p>
                      </div>
                    </div>
                  ))}

                  {/* Deep Detailed Refund Block in Bangla */}
                  <div className="border border-purple-950/60 bg-[#050208] p-8 rounded-[2rem] space-y-6">
                    <div className="flex items-center gap-3 border-b border-purple-950/60 pb-3">
                      <RefreshCw size={18} className="text-purple-400 animate-spin" />
                      <h4 className="font-sans font-black tracking-widest text-xs text-purple-300 uppercase italic">০৪. রিফান্ড কন্ডিশন ও যোগ্যতা</h4>
                    </div>
                    <div className="space-y-4 text-xs font-semibold">
                      <div className="space-y-1.5">
                        <span className="text-purple-400 font-bold block">// যোগ্যতা (Eligibility):</span>
                        <p className="text-slate-300">নিম্নলিখিত পরিস্থিতিতে রিফান্ড প্রদান করা হতে পারে:</p>
                        <p className="text-slate-400 pl-4 border-l border-purple-950 italic">
                          <strong className="text-white font-bold">পরিষেবা সরবরাহ না করা:</strong> কোনো কারণে NexaSphere IT যদি চুক্তিকৃত পরিষেবা সরবরাহ করতে ব্যর্থ হয়।
                        </p>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-white/[0.02]">
                        <span className="text-purple-400 font-bold block">// রিফান্ড অনুরোধ (Refund Requests):</span>
                        <p className="text-slate-300">
                          ক্লায়েন্টকে পরিষেবা সম্পন্ন হওয়ার পর <strong className="text-white font-bold">৭-১০ কর্মদিবসের</strong> মধ্যে <a href="mailto:nexasphereit@gmail.com" className="text-indigo-400 underline font-semibold hover:text-indigo-300">nexasphereit@gmail.com</a> ঠিকানায় লিখিত আকারে রিফান্ড অনুরোধ জমা দিতে হবে।
                        </p>
                        <p className="text-slate-400 text-xs">রিফান্ড অনুরোধে অবশ্যই নিম্নলিখিত তথ্যগুলো থাকতে হবে:</p>
                        <ul className="list-disc pl-5 space-y-1 text-slate-400 text-[11px] italic">
                          <li>ক্লায়েন্টের নাম ও যোগাযোগের তথ্য</li>
                          <li>পরিষেবার বিবরণ</li>
                          <li>রিফান্ড অনুরোধের কারণের ব্যাখ্যা</li>
                          <li>প্রয়োজন হলে সহায়ক নথিপত্র</li>
                        </ul>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-white/[0.02]">
                        <span className="text-purple-400 font-bold block">// রিফান্ড প্রক্রিয়া (Refund Process):</span>
                        <ul className="list-decimal pl-5 space-y-1.5 text-slate-300 leading-relaxed text-[11px]">
                          <li>রিফান্ড অনুরোধ পাওয়ার পর NexaSphere IT ৩ কর্মদিবসের মধ্যে তা পর্যালোচনা করবে। প্রয়োজনে ক্লায়েন্টের কাছ থেকে অতিরিক্ত তথ্য বা ব্যাখ্যা চাওয়া হতে পারে।</li>
                          <li>রিফান্ড অনুমোদিত হলে, NexaSphere IT মূল পেমেন্ট পদ্ধতির মাধ্যমে ৩ কর্মদিবসের মধ্যে রিফান্ড প্রক্রিয়া সম্পন্ন করবে।</li>
                        </ul>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-white/[0.02]">
                        <span className="text-rose-455 font-bold block">// যেসব পরিষেবা রিফান্ডযোগ্য নয় (Non-Refundable):</span>
                        <p className="text-rose-200/60 text-[11px] leading-relaxed">
                          কিছু পরিষেবা রিফান্ডযোগ্য নয়, যেমন—কনসালটেশন ফি, অ্যাসেসমেন্ট ফি, ভিডিও প্রোডাকশন চার্জ, মডেল রেমুনারেশন, এবং NexaSphere IT কর্তৃক ক্লায়েন্টের পক্ষ থেকে প্রদত্ত যেকোনো খরচ।
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rest of the Bangla categories */}
                  {[
                    {
                      no: "০৫",
                      title: "ক্লায়েন্টের দায়িত্ব",
                      desc: "পরিষেবার সফল ডেলিভারির জন্য প্রয়োজনীয় তথ্য, অ্যাক্সেস, এবং অনুমোদন প্রদান করার দায়িত্ব ক্লায়েন্টের। ক্লায়েন্টের কারণে সৃষ্ট বিলম্ব প্রকল্পের সময়সূচিতে পরিবর্তন আনতে পারে।",
                      icon: UserCheck,
                      color: "text-orange-400"
                    },
                    {
                      no: "০৬",
                      title: "বুদ্ধিবৃত্তিক সম্পত্তি অধিকার",
                      desc: "পূর্ণ পেমেন্ট সম্পন্ন হলে, NexaSphere IT কর্তৃক সরবরাহিত চূড়ান্ত ডেলিভারেবল-এর মালিকানা ক্লায়েন্টের হবে। NexaSphere IT সম্পন্ন প্রকল্পগুলো প্রমোশনাল উদ্দেশ্যে ব্যবহার করার অধিকার সংরক্ষণ করে।",
                      icon: Key,
                      color: "text-emerald-400"
                    },
                    {
                      no: "০৭",
                      title: "গোপনীয়তা ও চুক্তি বাতিলকরণ",
                      desc: "যে কোনো পক্ষ, অন্য পক্ষের দ্বারা বড় ধরনের শর্ত ভঙ্গের ক্ষেত্রে, লিখিত নোটিশের মাধ্যমে চুক্তি বাতিল করতে পারে। বাতিলের সময় পর্যন্ত প্রাপ্ত ফি-এর জন্য ক্লায়েন্ট দায়বদ্ধ থাকবেন।",
                      icon: Lock,
                      color: "text-indigo-400"
                    },
                    {
                      no: "০৮",
                      title: "শর্তাবলীর পরিবর্তন",
                      desc: "NexaSphere IT যে কোনো সময় এই শর্তাবলী পরিবর্তন করার অধিকার সংরক্ষণ করে। পরিবর্তন হলে ক্লায়েন্টকে জানানো হবে, এবং পরিষেবার অব্যাহত ব্যবহার পরিবর্তিত শর্তাবলী মেনে নেওয়া হিসেবে গণ্য হবে।",
                      icon: Edit3,
                      color: "text-blue-400"
                    }
                  ].map((s) => (
                    <div key={s.title} className="flex gap-4 md:gap-6 items-start pt-4 border-t border-white/[0.02]">
                      <div className="font-mono text-xs text-slate-600 pt-2 font-extrabold shrink-0">// {s.no}</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <s.icon size={16} className={s.color} />
                          <h4 className="font-sans font-black text-white text-base tracking-tight">{s.title}</h4>
                        </div>
                        <p className="text-slate-350 text-xs leading-relaxed font-semibold">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* BOTTOM SECTION: BUSINESS RELATION STATEMENT */}
        <section className="bg-slate-950/80 border border-white/[0.04] p-8 md:p-12 rounded-[2.5rem] text-center space-y-6 max-w-4xl mx-auto shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-600/[0.02] rounded-bl-full pointer-events-none" />
          
          <div className="space-y-3">
            <span className="text-[9px] font-mono font-black tracking-widest text-[#ef4444] uppercase block">
              // LEGALLY BINDING ACKNOWLEDGMENT
            </span>
            <p className="text-white text-xs sm:text-sm font-semibold max-w-2xl mx-auto leading-relaxed italic">
              By engaging in business with NexaSphere IT, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
            </p>
            <p className="text-slate-400 text-xs max-w-2xl mx-auto leading-relaxed font-medium font-bengali">
              NexaSphere IT -এর সাথে ব্যবসায়িক সম্পর্ক স্থাপন করে, আপনি স্বীকার করছেন যে আপনি এই শর্তাবলী পড়েছেন, বুঝেছেন এবং মেনে নিয়েছেন।
            </p>
          </div>
        </section>

        {/* ACTION CTA: GROW YOUR BUSINESS SECTION */}
        <section className="bg-gradient-to-br from-indigo-950/30 via-slate-950/80 to-pink-950/20 border border-white/[0.05] p-8 md:p-14 rounded-[3.5rem] relative overflow-hidden shadow-2xl">
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-600/10 rounded-full filter blur-3xl opacity-40 pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-pink-500/10 rounded-full filter blur-3xl opacity-45 pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 bg-pink-950/30 border border-pink-900/30 px-3.5 py-1.5 rounded-full">
              <Flame size={12} className="text-pink-400 animate-pulse" />
              <span className="text-[9px] font-mono font-black text-pink-300 tracking-wider uppercase">SCALING PROTOCOL</span>
            </div>

            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-sans font-black tracking-tighter uppercase italic leading-none max-w-2xl mx-auto">
                Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Scale Your Brand?</span>
              </h2>
              <div className="text-xl sm:text-2xl font-sans text-emerald-400 font-extrabold font-bengali">
                আপনার ব্যবসা বাড়াতে প্রস্তুত?
              </div>
              
              <p className="text-slate-350 text-xs sm:text-sm font-semibold italic max-w-2xl mx-auto leading-relaxed">
                Our suite of expert solutions in web design, web development, SEO, and global digital marketing are engineered specifically to accelerate your organic client acquisition parameters.
              </p>
              <p className="text-slate-400 text-xs sm:text-xs font-semibold max-w-2xl mx-auto leading-relaxed font-bengali italic">
                আমাদের ওয়েব ডিজাইন, ডেভেলপমেন্ট, SEO এবং ডিজিটাল মার্কেটিং-এর বিশেষজ্ঞ সমাধানের মাধ্যমে আমরা আপনাকে ব্যবসায়িক বৃদ্ধি অর্জনে সহায়তা করতে প্রস্তুত।
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/contact" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 to-pink-500 hover:opacity-90 text-white font-sans text-[10px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-purple-500/20 inline-flex items-center justify-center gap-2">
                  Launch Growth Strategy <ArrowRight size={12} />
                </button>
              </Link>
              <a href="mailto:nexasphereit@gmail.com" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-[#03030c] hover:bg-white/[0.04] border border-white/[0.08] text-white font-mono text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer inline-flex items-center justify-center gap-2">
                  <Mail size={12} /> Email Representative
                </button>
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
