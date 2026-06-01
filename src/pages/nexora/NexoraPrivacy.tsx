import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, Lock, FileText, ArrowRight, ArrowLeft, Eye, 
  Database, Share2, ShieldAlert, Cpu, Cookie, Globe, HelpCircle, 
  Phone, Mail, CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NexoraPrivacy() {
  const [langTab, setLangTab] = useState<'english' | 'bangla' | 'dual'>('dual');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#02020a] text-white pt-28 pb-24 relative overflow-hidden">
      {/* Decorative Cinematic Background Highlights */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-600/[0.03] rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/[0.03] rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-purple-600/[0.02] rounded-full filter blur-3xl pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-12">
        
        {/* Navigation Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.03] pb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 group text-xs font-mono text-slate-400 hover:text-emerald-400 uppercase tracking-widest font-black transition-colors"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            <span>HQ Dashboard</span>
          </Link>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 font-extrabold uppercase">
            <span>Security Terminal</span>
            <span className="text-slate-700">/</span>
            <span className="text-emerald-400 hover:text-emerald-300 transition-colors">Privacy Policy</span>
          </div>
        </div>

        {/* Hero Area */}
        <section className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-3 bg-emerald-950/20 border border-emerald-900/30 px-4 py-2 rounded-2xl">
            <ShieldCheck size={14} className="text-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-black text-emerald-300 tracking-widest uppercase">
              // DATA PRIVACY SECURITY BLUEPRINT
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-black tracking-tight uppercase italic leading-none">
            PRIVACY <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 font-black">POLICY</span>
            <div className="text-2xl sm:text-3xl font-sans text-slate-350 tracking-normal not-italic font-black mt-2 font-bengali">
              প্রাইভেসি পলিসি
            </div>
          </h1>

          <p className="text-slate-400 text-xs sm:text-sm font-semibold italic max-w-2xl mx-auto leading-relaxed">
            We are committed to protecting your privacy and ensuring the security of the information you provide to us. Below is our comprehensive operational privacy code.
          </p>
        </section>

        {/* Version Switcher Bar */}
        <div className="flex justify-center">
          <div className="bg-slate-950/80 border border-white/[0.05] p-1.5 rounded-2xl flex items-center gap-2 shadow-2xl backdrop-blur-xl">
            <button
              onClick={() => setLangTab('english')}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
                langTab === 'english'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-slate-450 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              English Version
            </button>
            <button
              onClick={() => setLangTab('bangla')}
              className={`px-5 py-2.5 rounded-xl text-[10px] sm:text-xs font-sans font-bold transition-all cursor-pointer ${
                langTab === 'bangla'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'text-slate-450 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              বাংলা সংস্করণ
            </button>
            <button
              onClick={() => setLangTab('dual')}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${
                langTab === 'dual'
                  ? 'bg-gradient-to-r from-emerald-600 via-indigo-600 to-purple-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'text-slate-450 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              Dual View (পারস্পরিক ভিউ)
            </button>
          </div>
        </div>

        {/* PRIVACY CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={langTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* 1. DUAL COMPARE VIEW */}
            {langTab === 'dual' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                
                {/* LEFT: BENGALI PORTION */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-emerald-950 pb-3">
                    <span className="text-[10px] font-mono font-black text-emerald-400 tracking-widest uppercase">SECTION 01: বাংলা সংস্করণ</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  </div>

                  {/* Introduction (Bangla) */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-950/30 border border-emerald-900/20 flex items-center justify-center text-emerald-400">
                        <Lock size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight">ভূমিকা ও স্বাগতম</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-medium">
                      NexaSphere IT -তে আপনাকে স্বাগতম। আমরা আপনার গোপনীয়তা রক্ষা করতে এবং আপনার দেওয়া তথ্যের নিরাপত্তা নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ। এই প্রাইভেসি পলিসি-তে আমাদের ওয়েবসাইট <a href="https://www.nexasphereit.com" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">www.nexasphereit.com</a>, পরিষেবা, এবং অ্যাপ্লিকেশন (সমষ্টিগতভাবে “পরিষেবা”) ব্যবহারের সময় আপনার তথ্য সংগ্রহ, ব্যবহার এবং প্রকাশ সম্পর্কে আমাদের নীতি বর্ণনা করা হয়েছে।
                    </p>
                  </div>

                  {/* Information We Collect & How We Use It (Bangla) */}
                  <div className="bg-[#050209]/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-6">
                    <div className="flex items-center gap-3 border-b border-emerald-950 pb-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-950/30 border border-purple-900/20 flex items-center justify-center text-purple-400">
                        <Database size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight">আমরা যে তথ্য সংগ্রহ করি এবং আমরা কীভাবে তা ব্যবহার করি</h4>
                    </div>
                    <div className="space-y-4 text-xs font-medium text-slate-350 leading-relaxed">
                      <p>
                        আমরা সেই তথ্য সংগ্রহ করি যা আপনি সরাসরি আমাদের প্রদান করেন—যেমন, যখন আপনি আমাদের সাথে যোগাযোগ করেন, আমাদের নিউজলেটারে সাবস্ক্রাইব করেন, অথবা আমাদের পরিষেবার জন্য নিবন্ধন করেন। আমরা যে ধরনের তথ্য সংগ্রহ করতে পারি তার মধ্যে রয়েছে—আপনার নাম, ইমেইল ঠিকানা, ফোন নম্বর, কোম্পানির বিবরণ, এবং আপনি যে কোনো অন্যান্য তথ্য শেয়ার করতে চান।
                      </p>
                      <p>
                        আমরা স্বয়ংক্রিয়ভাবে কিছু তথ্যও সংগ্রহ করি আমাদের পরিষেবার মাধ্যমে, যেমন—আপনার IP ঠিকানা, ব্রাউজারের ধরন, ডিভাইসের ধরন, operating system, এবং ব্যবহার সংক্রান্ত বিবরণ (যেমন সময় ও দেখা পৃষ্ঠাগুলি)।
                      </p>
                      <div className="pt-2 border-t border-white/[0.02]">
                        <span className="text-xs font-black text-emerald-400 mb-2 block">// আমরা কীভাবে আপনার তথ্য ব্যবহার করি:</span>
                        <ul className="space-y-2 list-none pl-1">
                          <li className="flex gap-2"><span className="text-emerald-400">✓</span> আমাদের পরিষেবা প্রদান, পরিচালনা এবং রক্ষণাবেক্ষণ করা</li>
                          <li className="flex gap-2"><span className="text-emerald-400">১.</span> পরিষেবাকে উন্নত করা, ব্যক্তিগতকরণ এবং সম্প্রসারণ করা</li>
                          <li className="flex gap-2"><span className="text-emerald-400">২.</span> আপনি কীভাবে আমাদের পরিষেবা ব্যবহার করেন তা বোঝা এবং বিশ্লেষণ করা</li>
                          <li className="flex gap-2"><span className="text-emerald-400">৩.</span> নতুন পণ্য, পরিষেবা, ফিচার এবং কার্যকারিতা তৈরি করা</li>
                          <li className="flex gap-2"><span className="text-emerald-400">৪.</span> আপনার সাথে সরাসরি বা আমাদের কোনো পার্টনারের মাধ্যমে যোগাযোগ করা—কাস্টমার সার্ভিস, ওয়েবসাইট সংক্রান্ত আপডেট ও অন্যান্য তথ্য, এবং মার্কেটিং ও প্রোমোশনাল উদ্দেশ্যে</li>
                          <li className="flex gap-2"><span className="text-emerald-400">৫.</span> আপনাকে ইমেইল পাঠানো</li>
                          <li className="flex gap-2"><span className="text-rose-400">৬.</span> প্রতারণা সনাক্ত ও প্রতিরোধ করা</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Sharing Your Information (Bangla) */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-950/30 border border-indigo-900/20 flex items-center justify-center text-indigo-400">
                        <Share2 size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight">আপনার তথ্য শেয়ার করা নির্ধারণ</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-medium">
                      আমরা আপনার ব্যক্তিগতভাবে শনাক্তযোগ্য তথ্য (Personally Identifiable Information) বাইরের কোনো পক্ষের কাছে বিক্রি, বিনিময় বা অন্য কোনোভাবে হস্তান্তর করি না, যদি না আমরা পূর্বেই ব্যবহারকারীদের তা জানাই। এর মধ্যে ওয়েবসাইট হোস্টিং পার্টনার এবং অন্যান্য সহযোগী পক্ষ অন্তর্ভুক্ত নয়—যারা আমাদের ওয়েবসাইট পরিচালনা, ব্যবসা পরিচালনা বা ব্যবহারকারীদের সেবা দেওয়ার ক্ষেত্রে সহায়তা করে—শর্ত থাকে যে তারা এই তথ্য গোপন রাখবে।
                    </p>
                  </div>

                  {/* Security of Your Information (Bangla) */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-950/30 border border-orange-900/20 flex items-center justify-center text-orange-450">
                        <ShieldAlert size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight">আপনার তথ্যের নিরাপত্তা</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-medium">
                      আমরা আপনার ব্যক্তিগত তথ্য সুরক্ষিত রাখতে প্রশাসনিক, প্রযুক্তিগত এবং শারীরিক নিরাপত্তা ব্যবস্থা ব্যবহার করি। যদিও আমরা আপনার তথ্য সুরক্ষার জন্য সর্বোচ্চ চেষ্টা করি, তবুও আমরা এর সম্পূর্ণ নিরাপত্তার নিশ্চয়তা দিতে পারি না।
                    </p>
                  </div>

                  {/* Cookies and Web Beacons (Bangla) */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-950/30 border border-blue-900/20 flex items-center justify-center text-blue-400">
                        <Cookie size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight">কুকিজ এবং ওয়েব বীকনস</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-medium">
                      আমরা আমাদের পরিষেবার কার্যকলাপ পর্যবেক্ষণ ও নির্দিষ্ট কিছু তথ্য সংরক্ষণের জন্য কুকি এবং অনুরূপ ট্র্যাকিং প্রযুক্তি ব্যবহার করি। আপনি চাইলে আপনার ব্রাউজারকে এমনভাবে সেট করতে পারেন যাতে সব কুকি প্রত্যাখ্যান করা হয় অথবা কোনো কুকি পাঠানো হলে তা সম্পর্কে আপনাকে জানানো হয়।
                    </p>
                  </div>

                  {/* Links to Other Websites (Bangla) */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-950/30 border border-teal-900/20 flex items-center justify-center text-teal-400">
                        <Globe size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight">অন্যান্য ওয়েবসাইটের লিঙ্ক</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-medium">
                      আমাদের পরিষেবায় এমন লিঙ্ক থাকতে পারে যা আমাদের দ্বারা পরিচালিত নয়। যদি আপনি কোনো তৃতীয় পক্ষের লিঙ্কে ক্লিক করেন, তাহলে আপনি সেই তৃতীয় পক্ষের ওয়েবসাইটে চলে যাবেন। আমরা আপনাকে দৃঢ়ভাবে পরামর্শ দিই যে আপনি যেকোনো ওয়েবসাইট ভিজিট করার আগে তার প্রাইভেসি পলিসি পর্যালোচনা করুন।
                    </p>
                  </div>

                  {/* Changes to this Privacy Policy (Bangla) */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-400 font-bold">// নীতি সংস্করণ</span>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight">এই প্রাইভেসি পলিসির পরিবর্তন</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-medium">
                      আমরা সময়ে সময়ে আমাদের প্রাইভেসি পলিসি আপডেট করতে পারি। যেকোনো পরিবর্তন হলে আমরা এই পৃষ্ঠায় নতুন প্রাইভেসি পলিসি পোস্ট করে আপনাকে জানাবো। আমরা আপনাকে নিয়মিত এই প্রাইভেসি পলিসি পর্যালোচনা করার জন্য উৎসাহিত করি, যাতে আপনি পরিবর্তন সম্পর্কে অবগত থাকেন। এই প্রাইভেসি পলিসিতে পরিবর্তনগুলি এই পৃষ্ঠায় পোস্ট হওয়ার সাথে সাথেই কার্যকর হবে। যদি আমরা ব্যবহারকারীদের ব্যক্তিগত তথ্য ব্যবহারের ক্ষেত্রে বড় ধরনের পরিবর্তন করি, তাহলে আমরা ওয়েবসাইটের হোমপেজে একটি নোটিশের মাধ্যমে আপনাকে জানাবো।
                    </p>
                  </div>

                  {/* Your Rights (Bangla) */}
                  <div className="bg-[#05020c]/50 border border-purple-950/50 p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <h4 className="font-sans font-black text-purple-300 text-lg tracking-tight">আপনার অধিকারসমূহ (Your Rights)</h4>
                    <p className="text-slate-350 text-xs">একজন ব্যবহারকারী হিসেবে, আপনার ব্যক্তিগত ডেটা সম্পর্কিত কিছু অধিকার রয়েছে, যেমন—</p>
                    <ul className="space-y-1.5 list-none text-xs text-slate-300 pl-1 font-semibold">
                      <li className="flex gap-2"><span className="text-purple-400">১.</span> আপনার সম্পর্কে আমাদের কাছে থাকা তথ্য অ্যাক্সেস করা, আপডেট করা বা মুছে ফেলার অধিকার</li>
                      <li className="flex gap-2"><span className="text-purple-400">২.</span> সংশোধনের অধিকার</li>
                      <li className="flex gap-2"><span className="text-purple-400">৩.</span> আপত্তি জানানোর অধিকার</li>
                      <li className="flex gap-2"><span className="text-purple-400">৪.</span> ব্যবহারে সীমাবদ্ধতার অধিকার</li>
                      <li className="flex gap-2"><span className="text-purple-400">৫.</span> ডেটা পোর্টেবিলিটির অধিকার</li>
                      <li className="flex gap-2"><span className="text-purple-400">৬.</span> সম্মতি প্রত্যাহারের অধিকার</li>
                    </ul>
                    <p className="text-slate-400 text-[10px] italic pt-2 border-t border-white/[0.02]">
                      দয়া করে মনে রাখবেন, এই অধিকারগুলো সম্পূর্ণ নিরঙ্কুশ নয় এবং আমাদের বৈধ স্বার্থ ও নিয়ন্ত্রক প্রয়োজনীয়তার ওপর নির্ভরশীল হতে পারে।
                    </p>
                  </div>

                  {/* Consent & Contact (Bangla) */}
                  <div className="bg-slate-950/40 border border-white/[0.03] p-6 sm:p-8 rounded-[2rem] space-y-4">
                    <h4 className="font-sans font-black text-rose-400 text-lg tracking-tight">সম্মতি ও আমাদের সাথে সংযোগ</h4>
                    <p className="text-slate-350 text-xs font-semibold">
                      আমাদের পরিষেবা ব্যবহার করে, আপনি এই নীতিমালা অনুযায়ী তথ্য সংগ্রহ ও ব্যবহারে সম্মতি দিচ্ছেন। যদি আপনি এই নীতিমালার শর্তের সাথে একমত না হন, তবে অনুগ্রহ করে আমাদের পরিষেবা ব্যবহার করবেন না।
                    </p>
                    <div className="pt-4 border-t border-white/[0.03] space-y-2">
                      <span className="text-xs font-black tracking-widest uppercase text-emerald-400 font-mono">যোগাযোগ করুন:</span>
                      <p className="text-white text-xs font-mono font-bold flex items-center gap-2">
                        <Phone size={12} className="text-emerald-400" />
                        01976 981940, 01410 981940
                      </p>
                    </div>
                  </div>

                </div>

                {/* RIGHT: ENGLISH PORTION */}
                <div className="space-y-6 animate-fadeIn delay-100">
                  <div className="flex items-center gap-3 border-b border-indigo-950 pb-3">
                    <span className="text-[10px] font-mono font-black text-indigo-400 tracking-widest uppercase">SECTION 02: English Edition</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                  </div>

                  {/* Introduction (English) */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-950/30 border border-emerald-900/20 flex items-center justify-center text-emerald-400">
                        <Lock size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight uppercase italic font-mono">Introduction</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-semibold italic">
                      Welcome to Nexasphere IT . We are committed to protecting your privacy and ensuring the security of the information you provide to us. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information through the use of our website <a href="https://www.nexasphereit.com" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline">www.nexasphereit.com</a>, services, and applications (collectively, “Services”).
                    </p>
                  </div>

                  {/* Information We Collect & How We Use It (English) */}
                  <div className="bg-[#050209]/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-6">
                    <div className="flex items-center gap-3 border-b border-indigo-950 pb-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-950/30 border border-purple-900/20 flex items-center justify-center text-purple-400">
                        <Database size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight uppercase italic font-mono">Information & Use</h4>
                    </div>
                    <div className="space-y-4 text-xs font-semibold italic text-slate-350 leading-relaxed">
                      <p>
                        We collect information that you provide directly to us, such as when you contact us, subscribe to our newsletter, or register for our services. The types of information we may collect include your name, email address, phone number, company details, and any other information you choose to provide.
                      </p>
                      <p>
                        We also automatically collect certain information through our Services, such as your IP address, browser type, device type, operating system, and usage details (such as time and pages visited).
                      </p>
                      <div className="pt-2 border-t border-white/[0.02]">
                        <span className="text-xs font-black text-emerald-400 mb-2 block uppercase font-mono">// How We Use Your Information:</span>
                        <ul className="space-y-2 list-none pl-1">
                          <li className="flex gap-2"><span className="text-emerald-400">✓</span> Provide, operate, and maintain our Services</li>
                          <li className="flex gap-2"><span className="text-emerald-400">1.</span> Improve, personalize, and expand our Services</li>
                          <li className="flex gap-2"><span className="text-emerald-400">2.</span> Understand and analyze how you use our Services</li>
                          <li className="flex gap-2"><span className="text-emerald-400">3.</span> Develop new products, services, features, and functionality</li>
                          <li className="flex gap-2"><span className="text-emerald-400">4.</span> Communicate with you for customer service, updates, marketing, and promotional purposes</li>
                          <li className="flex gap-2"><span className="text-emerald-400">5.</span> Send you emails</li>
                          <li className="flex gap-2"><span className="text-rose-400">6.</span> Find and prevent fraud</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Sharing Your Information (English) */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-950/30 border border-indigo-900/20 flex items-center justify-center text-indigo-400">
                        <Share2 size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight uppercase italic font-mono">Sharing Your Information</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-semibold italic">
                      We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
                    </p>
                  </div>

                  {/* Security of Your Information (English) */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-950/30 border border-orange-900/20 flex items-center justify-center text-orange-450">
                        <ShieldAlert size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight uppercase italic font-mono">Information Security</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-semibold italic">
                      We use administrative, technical, and physical security measures to help protect your personal information. While we strive to protect your information, we cannot guarantee its absolute security.
                    </p>
                  </div>

                  {/* Cookies and Web Beacons (English) */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-950/30 border border-blue-900/20 flex items-center justify-center text-blue-400">
                        <Cookie size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight uppercase italic font-mono">Cookies & Web Beacons</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-semibold italic">
                      We use cookies and similar tracking technologies to track the activity on our Services and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                    </p>
                  </div>

                  {/* Links to Other Websites (English) */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-950/30 border border-teal-900/20 flex items-center justify-center text-teal-400">
                        <Globe size={20} />
                      </div>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight uppercase italic font-mono">External Website Links</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-semibold italic">
                      Our Services may contain links to other websites not operated by us. If you click a third party link, you will be directed to that third party’s site. We strongly advise you to review the Privacy Policy of every site you visit.
                    </p>
                  </div>

                  {/* Changes to this Privacy Policy (English) */}
                  <div className="bg-slate-950/40 border border-white/[0.03] hover:border-white/[0.06] p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-400 font-bold uppercase font-mono">// Update Protocol</span>
                      <h4 className="font-sans font-black text-white text-lg tracking-tight uppercase italic font-mono">Changes to Privacy Policy</h4>
                    </div>
                    <p className="text-slate-350 text-xs leading-relaxed font-semibold italic">
                      We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We encourage you to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page. If we make material changes to how we treat our users’ personal information, we will notify you through a notice on the website’s homepage.
                    </p>
                  </div>

                  {/* Your Rights (English) */}
                  <div className="bg-[#05020c]/50 border border-purple-950/50 p-6 sm:p-8 rounded-[2rem] transition-all space-y-4">
                    <h4 className="font-sans font-black text-purple-300 text-lg tracking-tight uppercase italic font-mono">Your Rights</h4>
                    <p className="text-slate-350 text-xs font-semibold italic">As a user, you have certain rights regarding your personal data, including:</p>
                    <ul className="space-y-1.5 list-none text-xs text-slate-300 pl-1 font-semibold italic">
                      <li className="flex gap-2"><span className="text-purple-400">1.</span> Access, update or delete the information we have on you.</li>
                      <li className="flex gap-2"><span className="text-purple-400">2.</span> The right of rectification.</li>
                      <li className="flex gap-2"><span className="text-purple-400">3.</span> The right to object.</li>
                      <li className="flex gap-2"><span className="text-purple-400">4.</span> The right of restriction.</li>
                      <li className="flex gap-2"><span className="text-purple-400">5.</span> The right to data portability.</li>
                      <li className="flex gap-2"><span className="text-purple-400">6.</span> The right to withdraw consent.</li>
                    </ul>
                    <p className="text-slate-400 text-[10px] italic pt-2 border-t border-white/[0.02]">
                      Please note that these rights are not absolute and may be subject to our own legitimate interests and regulatory requirements.
                    </p>
                  </div>

                  {/* Consent & Contact (English) */}
                  <div className="bg-slate-950/40 border border-white/[0.03] p-6 sm:p-8 rounded-[2rem] space-y-4">
                    <h4 className="font-sans font-black text-rose-400 text-lg tracking-tight uppercase italic font-mono">Consent & Inquiry Channels</h4>
                    <p className="text-slate-350 text-xs font-semibold italic">
                      By using our Services, you consent to the collection and use of information in accordance with this policy. If you do not agree with the terms of this policy, please do not use our Services.
                    </p>
                    <div className="pt-4 border-t border-white/[0.03] space-y-2">
                      <span className="text-xs font-black tracking-widest uppercase text-emerald-400 font-mono">Contact Support:</span>
                      <p className="text-white text-xs font-mono font-bold flex items-center gap-2">
                        <Phone size={12} className="text-emerald-400" />
                        01976 981940, 01410 981940
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 2. ENGLISH ONLY VIEW */}
            {langTab === 'english' && (
              <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
                <div className="bg-slate-950/40 border border-white/[0.04] p-8 md:p-12 rounded-[2.5rem] space-y-8">
                  
                  {/* Category Loop */}
                  {[
                    {
                      no: "01",
                      title: "Introduction",
                      desc: "Welcome to Nexasphere IT . We are committed to protecting your privacy and ensuring the security of the information you provide to us. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information through the use of our website www.nexasphereit.com, services, and applications (collectively, “Services”).",
                      icon: Lock,
                      color: "text-emerald-400"
                    },
                    {
                      no: "02",
                      title: "Information We Collect & How We Use It",
                      desc: "We collect information that you provide directly to us, such as when you contact us, subscribe to our newsletter, or register for our services. The types of information we may collect include your name, email address, phone number, company details, and any other information you choose to provide. We also automatically collect certain information through our Services, such as your IP address, browser type, device type, operating system, and usage details (such as time and pages visited).",
                      icon: Database,
                      color: "text-purple-400"
                    }
                  ].map((s) => (
                    <div key={s.title} className="flex gap-4 md:gap-6 items-start">
                      <div className="font-mono text-xs text-slate-600 font-extrabold pt-2 shrink-0">// {s.no}</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <s.icon size={16} className={s.color} />
                          <h4 className="font-sans font-black text-white text-base tracking-tight uppercase italic">{s.title}</h4>
                        </div>
                        <p className="text-slate-350 text-xs leading-relaxed font-semibold italic">{s.desc}</p>
                      </div>
                    </div>
                  ))}

                  {/* English Use Details Block */}
                  <div className="border border-emerald-950 bg-[#050208] p-6 sm:p-8 rounded-[2rem] space-y-4">
                    <span className="text-emerald-400 font-black tracking-widest text-[10px] uppercase font-mono">// Core Usage Parameters</span>
                    <p className="text-slate-300 text-xs italic">The information we collect is used in various ways, including to:</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs italic font-semibold text-slate-350">
                      <li className="flex gap-2"><span className="text-emerald-400">1.</span> Provide, operate, and maintain our Services</li>
                      <li className="flex gap-2"><span className="text-emerald-400">2.</span> Improve, personalize, and expand our Services</li>
                      <li className="flex gap-2"><span className="text-emerald-400">3.</span> Understand and analyze how you use our Services</li>
                      <li className="flex gap-2"><span className="text-emerald-400">4.</span> Develop new products, services, features, and functionality</li>
                      <li className="flex gap-2"><span className="text-emerald-400">5.</span> Communicate with you, either directly or through partners, for support & updates</li>
                      <li className="flex gap-2"><span className="text-emerald-400">6.</span> Send you emails</li>
                      <li className="flex gap-2"><span className="text-rose-400">7.</span> Find and prevent fraud</li>
                    </ul>
                  </div>

                  {/* Rest Categories */}
                  {[
                    {
                      no: "03",
                      title: "Sharing Your Information",
                      desc: "We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.",
                      icon: Share2,
                      color: "text-indigo-400"
                    },
                    {
                      no: "04",
                      title: "Security of Your Information",
                      desc: "We use administrative, technical, and physical security measures to help protect your personal information. While we strive to protect your information, we cannot guarantee its absolute security.",
                      icon: ShieldAlert,
                      color: "text-orange-400"
                    },
                    {
                      no: "05",
                      title: "Cookies and Web Beacons",
                      desc: "We use cookies and similar tracking technologies to track the activity on our Services and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.",
                      icon: Cookie,
                      color: "text-blue-400"
                    },
                    {
                      no: "06",
                      title: "Links to Other Sites",
                      desc: "Our Services may contain links to other websites not operated by us. If you click a third party link, you will be directed to that third party’s site. We strongly advise you to review the Privacy Policy of every site you visit.",
                      icon: Globe,
                      color: "text-teal-400"
                    },
                    {
                      no: "07",
                      title: "Changes to This Privacy Policy",
                      desc: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We encourage you to review this Privacy Policy periodically for any changes.",
                      icon: FileText,
                      color: "text-rose-400"
                    }
                  ].map((s) => (
                    <div key={s.title} className="flex gap-4 md:gap-6 items-start pt-6 border-t border-white/[0.02]">
                      <div className="font-mono text-xs text-slate-600 font-extrabold pt-2 shrink-0">// {s.no}</div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <s.icon size={16} className={s.color} />
                          <h4 className="font-sans font-black text-white text-base tracking-tight uppercase italic">{s.title}</h4>
                        </div>
                        <p className="text-slate-350 text-xs leading-relaxed font-semibold italic">{s.desc}</p>
                      </div>
                    </div>
                  ))}

                  {/* Rest Categories Box 2 */}
                  <div className="bg-[#05020c]/50 p-6 sm:p-8 rounded-[2rem] border border-indigo-950 space-y-4">
                    <h4 className="font-sans font-black text-purple-300 text-lg uppercase italic font-mono">// Your Rights & Data Consent</h4>
                    <p className="text-slate-350 text-xs italic">
                      As a user, you have certain rights regarding your personal data: (1) Access, update, or deletion; (2) Rectification; (3) Objection; (4) Restriction; (5) Data Portability; (6) Withdraw Consent. Note that these are not absolute.
                    </p>
                    <p className="text-slate-350 text-xs italic border-t border-white/[0.04] pt-4">
                      By using our Services, you consent to the collection and use of information in accordance with this policy. If you do not agree with the terms, please do not use our Services.
                    </p>
                    <div className="pt-2">
                      <span className="text-emerald-400 font-bold block">// Contact Inquiry Support:</span>
                      <p className="text-white font-mono text-xs font-semibold">📞 01976 981940, 01410 981940</p>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 3. BENGALI ONLY VIEW */}
            {langTab === 'bangla' && (
              <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
                <div className="bg-slate-950/40 border border-white/[0.04] p-8 md:p-12 rounded-[2.5rem] space-y-8">
                  
                  {/* Category Loop Bangla */}
                  {[
                    {
                      no: "০১",
                      title: "ভূমিকা ও স্বাগতম",
                      desc: "Nexasphere IT -তে আপনাকে স্বাগতম। আমরা আপনার গোপনীয়তা রক্ষা করতে এবং আপনার দেওয়া তথ্যের নিরাপত্তা নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ। এই প্রাইভেসি পলিসি-তে আমাদের ওয়েবসাইট www.nexasphereit.com, পরিষেবা, এবং অ্যাপ্লিকেশন (সমষ্টিগতভাবে “পরিষেবা”) ব্যবহারের সময় আপনার তথ্য সংগ্রহ, ব্যবহার এবং প্রকাশ সম্পর্কে আমাদের নীতি বর্ণনা করা হয়েছে।",
                      icon: Lock,
                      color: "text-emerald-400"
                    },
                    {
                      no: "০২",
                      title: "আমরা যে তথ্য সংগ্রহ করি",
                      desc: "আমরা সেই তথ্য সংগ্রহ করি যা আপনি সরাসরি আমাদের প্রদান করেন—যেমন, যখন আপনি আমাদের সাথে যোগাযোগ করেন, আমাদের নিউজলেটারে সাবস্ক্রাইব করেন, অথবা আমাদের পরিষেবার জন্য নিবন্ধন করেন। আমরা যে ধরনের তথ্য সংগ্রহ করতে পারি তার মধ্যে রয়েছে—আপনার নাম, ইমেইল ঠিকানা, ফোন নম্বর, কোম্পানির বিবরণ, এবং আপনি যে কোনো অন্যান্য তথ্য শেয়ার করতে চান। আমরা স্বয়ংক্রিয়ভাবে কিছু তথ্য도 সংগ্রহ করি আমাদের পরিষেবার মাধ্যমে, যেমন—আপনার IP ঠিকানা, ব্রাউজারের ধরন, ডিভাইসের ধরন, operating system, এবং ব্যবহার সংক্রান্ত বিবরণ (যেমন সময় ও দেখা পৃষ্ঠাগুলি)।",
                      icon: Database,
                      color: "text-purple-400"
                    }
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

                  {/* Bangla Use Details Block */}
                  <div className="border border-emerald-950 bg-[#050208] p-6 sm:p-8 rounded-[2rem] space-y-4">
                    <span className="text-emerald-400 font-extrabold text-xs block">// আমরা কীভাবে আপনার তথ্য ব্যবহার করি</span>
                    <p className="text-slate-300 text-xs">আমরা যে তথ্য সংগ্রহ করি তা বিভিন্নভাবে ব্যবহার করা হয়, যেমন—</p>
                    <ul className="space-y-2 text-xs font-semibold text-slate-350">
                      <li className="flex gap-2"><span className="text-emerald-400">✓</span> আমাদের পরিষেবা প্রদান, পরিচালনা এবং রক্ষণাবেক্ষণ করা</li>
                      <li className="flex gap-2"><span className="text-emerald-400">১.</span> পরিষেবাকে উন্নত করা, ব্যক্তিগতকরণ এবং সম্প্রসারণ করা</li>
                      <li className="flex gap-2"><span className="text-emerald-400">২.</span> আপনি কীভাবে আমাদের পরিষেবা ব্যবহার করেন তা বোঝা এবং বিশ্লেষণ করা</li>
                      <li className="flex gap-2"><span className="text-emerald-400">৩.</span> নতুন পণ্য, পরিষেবা, ফিচার এবং কার্যকারিতা তৈরি করা</li>
                      <li className="flex gap-2"><span className="text-emerald-400">৪.</span> আপনার সাথে সরাসরি বা আমাদের পার্টনারদের মাধ্যমে যোগাযোগ করা</li>
                      <li className="flex gap-2"><span className="text-emerald-400">৫.</span> আপনাকে ইমেইল পাঠানো</li>
                      <li className="flex gap-2"><span className="text-rose-400">৬.</span> প্রতারণা সনাক্ত ও প্রতিরোধ করা</li>
                    </ul>
                  </div>

                  {/* Rest Categories Bangla */}
                  {[
                    {
                      no: "০৩",
                      title: "আপনার তথ্য শেয়ার করা",
                      desc: "আমরা আপনার ব্যক্তিগতভাবে শনাক্তযোগ্য তথ্য (Personally Identifiable Information) বাইরের কোনো পক্ষের কাছে বিক্রি, বিনিময় বা অন্য কোনোভাবে হস্তান্তর করি না, যদি না আমরা পূর্বেই ব্যবহারকারীদের তা জানাই। এর মধ্যে ওয়েবসাইট হোস্টিং পার্টনার এবং অন্যান্য সহযোগী পক্ষ অন্তর্ভুক্ত নয়—যারা আমাদের ওয়েবসাইট পরিচালনা, ব্যবসা পরিচালনা বা ব্যবহারকারীদের সেবা দেওয়ার ক্ষেত্রে সহায়তা করে—শর্ত থাকে যে তারা এই তথ্য গোপন রাখবে।",
                      icon: Share2,
                      color: "text-indigo-400"
                    },
                    {
                      no: "০৪",
                      title: "আপনার তথ্যের নিরাপত্তা",
                      desc: "আমরা আপনার ব্যক্তিগত তথ্য সুরক্ষিত রাখতে প্রশাসনিক, প্রযুক্তিগত এবং শারীরিক নিরাপত্তা ব্যবস্থা ব্যবহার করি। যদিও আমরা আপনার তথ্য সুরক্ষার জন্য সর্বোচ্চ চেষ্টা করি, তবুও আমরা এর সম্পূর্ণ নিরাপত্তার নিশ্চয়তা দিতে পারি না।",
                      icon: ShieldAlert,
                      color: "text-orange-400"
                    },
                    {
                      no: "০৫",
                      title: "কুকিজ এবং ওয়েব বীকনস",
                      desc: "আমরা আমাদের পরিষেবার কার্যকলাপ পর্যবেক্ষণ ও নির্দিষ্ট কিছু তথ্য সংরক্ষণের জন্য কুকি এবং অনুরূপ ট্র্যাকিং প্রযুক্তি ব্যবহার করি। আপনি চাইলে আপনার ব্রাউজারকে এমনভাবে সেট করতে পারেন যাতে সব কুকি প্রত্যাখ্যান করা হয় অথবা কোনো কুকি পাঠানো হলে তা সম্পর্কে আপনাকে জানানো হয়।",
                      icon: Cookie,
                      color: "text-blue-400"
                    },
                    {
                      no: "০৬",
                      title: "অন্যান্য ওয়েবসাইটের লিঙ্ক",
                      desc: "আমাদের পরিষেবায় এমন লিঙ্ক থাকতে পারে যা আমাদের দ্বারা পরিচালিত নয়। যদি আপনি কোনো তৃতীয় পক্ষের লিঙ্কে ক্লিক করেন, তাহলে আপনি সেই তৃতীয় পক্ষের ওয়েবসাইটে চলে যাবেন। আমরা আপনাকে দৃঢ়ভাবে পরামর্শ দিই যে আপনি যেকোনো ওয়েবসাইট ভিজিট করার আগে তার প্রাইভেসি পলিসি পর্যালোচনা করুন।",
                      icon: Globe,
                      color: "text-teal-400"
                    },
                    {
                      no: "০৭",
                      title: "এই প্রাইভেসি পলিসির পরিবর্তন",
                      desc: "আমরা সময়ে সময়ে আমাদের প্রাইভেসি পলিসি আপডেট করতে পারি। যেকোনো পরিবর্তন হলে আমরা এই পৃষ্ঠায় নতুন প্রাইভেসি পলিসি পোস্ট করে আপনাকে জানাবো। আমরা আপনাকে নিয়মিত এই প্রাইভেসি পলিসি পর্যালোচনা করার জন্য উৎসাহিত করি, যাতে আপনি পরিবর্তন সম্পর্কে অবগত থাকেন। এই প্রাইভেসি পলিসিতে পরিবর্তনগুলি এই পৃষ্ঠায় পোস্ট হওয়ার সাথে সাথেই কার্যকর হবে। যদি আমরা ব্যবহারকারীদের ব্যক্তিগত তথ্য ব্যবহারের ক্ষেত্রে বড় ধরনের পরিবর্তন করি, তাহলে আমরা ওয়েবসাইটের হোমপেজে একটি নোটিশের মাধ্যমে আপনাকে জানাবো।",
                      icon: FileText,
                      color: "text-rose-400"
                    }
                  ].map((s) => (
                    <div key={s.title} className="flex gap-4 md:gap-6 items-start pt-6 border-t border-white/[0.02]">
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

                  {/* Rights and Contact Bangla */}
                  <div className="bg-[#05020c]/50 p-6 sm:p-8 rounded-[2rem] border border-indigo-950 space-y-4">
                    <h4 className="font-sans font-black text-purple-300 text-lg">// আপনার অধিকার এবং সম্মতি</h4>
                    <p className="text-slate-350 text-xs">
                      একজন ব্যবহারকারী হিসেবে, আপনার ব্যক্তিগত ডেটা সম্পর্কিত কিছু অধিকার রয়েছে: ১. অ্যাক্সেস বা মুছে ফেলার অধিকার, ২. সংশোধনের অধিকার, ৩. আপত্তি জানানোর অধিকার, ৪. ব্যবহারে সীমাবদ্ধতা, ৫. পোর্টেবিলিটি, ৬. সম্মতি প্রত্যাহারের অধিকার।
                    </p>
                    <p className="text-slate-350 text-xs border-t border-white/[0.04] pt-4">
                      আমাদের পরিষেবা ব্যবহার করে, আপনি এই নীতিমালা অনুযায়ী তথ্য সংগ্রহ ও ব্যবহারে সম্মতি দিচ্ছেন। যদি আপনি এই নীতিমালার শর্তের সাথে একমত না হন, তবে অনুগ্রহ করে আমাদের পরিষেবা ব্যবহার করবেন না।
                    </p>
                    <div className="pt-2">
                      <span className="text-emerald-400 font-bold block">// যোগাযোগ করুন:</span>
                      <p className="text-white font-mono text-xs font-semibold">📞 01976 981940, 01410 981940</p>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Action Link back to terms */}
        <div className="text-center pt-6">
          <Link 
            to="/terms"
            className="text-xs font-mono text-emerald-400 hover:text-emerald-300 uppercase tracking-widest font-black inline-flex items-center gap-2 group border border-emerald-900/30 px-6 py-4 rounded-2xl bg-emerald-950/10 hover:bg-emerald-950/20 transition-all shadow-xl"
          >
            <span>Examine Terms of Service Overview</span>
            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}

