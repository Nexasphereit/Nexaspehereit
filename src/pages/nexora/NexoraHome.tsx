import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Sparkles, Rocket, Globe, BarChart3, Target, 
  TrendingUp, Award, CheckCircle, HelpCircle, Star, 
  Lock, ArrowUpRight, ChevronDown, Check, Video, Edit3, Heart, Layout, Code2, ShieldAlert
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, limit, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast as hotToast } from 'react-hot-toast';

export default function NexoraHome() {
  const [faqs, setFaqs] = useState([
    { q: "How long until we see our first website or marketing results?", a: "We launch most beautiful, custom web layouts within 14 to 20 days. Paid advertising campaigns usually start showing traffic and customer activity within the first week of going live.", open: true },
    { q: "Do you design the company logos and brand materials too?", a: "Yes, we handle all creative needs. Our team can design your company logo, official brand color guidelines, social media layouts, and high-quality promo videos.", open: false },
    { q: "Is the design friendly and easy to use on mobile phones?", a: "Absolutely. Every website we create is 100% responsive, which means it works perfectly and looks gorgeous on iPhones, Android devices, tablets, and computers.", open: false },
    { q: "Can we track our marketing work and check orders?", a: "Yes. Every partner gets access to our premium digital portal, where you can view your bills, track your active orders, and see exact sales metrics in real-time.", open: false }
  ]);

  const [heroConfig, setHeroConfig] = useState({
    floatingCapsule: "NEXORA WORLD-CLASS CREATIVE AGENCY",
    headline: "WE BUILD BEAUTIFUL WEBSITES",
    subGradient: "AND GROW YOUR ONLINE BRAND",
    subtitle: "We are a friendly, highly skilled team of programmers, creative designers, and digital marketers. We create high-speed web systems and run social media campaigns to increase your sales.",
    ctaPrimary: "Get Free Consultation",
    ctaSecondary: "View Our Services",
    featureImage: "/src/assets/images/ceo_portrait_1780313994319.png"
  });

  const [pagesConfig, setPagesConfig] = useState({
    heroCtaPrimaryLink: '/contact',
    heroCtaSecondaryLink: '/services'
  });

  const [statsConfig, setStatsConfig] = useState({
    stat1_val: 150,
    stat1_suffix: "+ Brands",
    stat1_label: "Happy Clients Trusted Us",
    stat2_val: 450,
    stat2_suffix: "k+",
    stat2_label: "Leads & Customers Captured",
    stat3_val: 100,
    stat3_suffix: "% Success-Rate",
    stat3_label: "Dedicated Care and Delivery"
  });

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Default expert team list
  const defaultTeam = [
    {
      name: "Asaduzzaman Tohin",
      role: "Founder & Chief Executive Officer",
      dep: "Executive Leadership",
      avatar: "/src/assets/images/ceo_portrait_1780313994319.png",
      bio: "Leads the creative vision, high quality standards, and growth strategy for Nexora."
    },
    {
      name: "Taslema Akter Mou",
      role: "Co-Founder & Chief Operating Officer",
      dep: "Executive Leadership",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=450&q=80",
      bio: "Designs growth blueprints for large corporate accounts and guides our project planning."
    },
    {
      name: "Sani Hosen",
      role: "Business Development Executive",
      dep: "Corporate Growth",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=450&q=80",
      bio: "Partners with national businesses to expand their reach and digital success rate."
    },
    {
      name: "Nurnnabi Nobi",
      role: "Graphics & Motion Lead Artist",
      dep: "Creative Arts",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=450&q=80",
      bio: "Creates gorgeous digital brand identities, corporate logos, and high-converting video promos."
    },
    {
      name: "Hamim Rahman",
      role: "Web Design & Development Lead",
      dep: "Engineering Dept",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&h=450&q=80",
      bio: "Builds high-speed, secure, and gorgeous web portals with modern React systems."
    },
    {
      name: "Sadia Yeasmin Sudha",
      role: "Legal Advisor & Corporate Counsel",
      dep: "Corporate Law",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=450&q=80",
      bio: "Guarantees brand protection, legal safety, and trustful contract terms for all global clients."
    },
    {
      name: "Rony Islam Abid",
      role: "Technical Project Manager",
      dep: "Operations",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=450&q=80",
      bio: "Maintains smooth delivery schedules, coordinates teams, and keeps projects organized."
    },
    {
      name: "Nur Hasan",
      role: "Digital Marketing Expert",
      dep: "Marketing & Growth",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&h=450&q=80",
      bio: "Sets up profitable Meta, Google, and video marketing campaigns that double your client base."
    }
  ];

  const [teamMembers, setTeamMembers] = useState<any[]>(defaultTeam);

  // BD Brands we worked with (Original logos rendered in clean custom SVGs)
  const bdBrands = [
    {
      name: "Rokomari",
      tag: "Online Books & Tech",
      color: "from-emerald-500 to-teal-650",
      logo: (
        <svg className="w-5 h-5 text-emerald-400 fill-current" viewBox="0 0 24 24" referrerPolicy="no-referrer">
          <circle cx="12" cy="12" r="10" className="opacity-15 fill-current" />
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm1-4.07c-.42.41-.75.76-.75 1.57h-1.5c0-1.1.5-1.7 1.05-2.25.33-.3.7-.6.7-1.1 0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5H8.25c0-2.07 1.68-3.75 3.75-3.75s3.75 1.68 3.75 3.75c0 .9-.55 1.48-1 1.93z" />
        </svg>
      )
    },
    {
      name: "Shikho",
      tag: "Hyper Learning",
      color: "from-rose-500 to-red-650",
      logo: (
        <svg className="w-5 h-5 text-red-450 fill-current" viewBox="0 0 24 24" referrerPolicy="no-referrer">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
        </svg>
      )
    },
    {
      name: "Sheba.xyz",
      tag: "Corporate Services",
      color: "from-orange-500 to-amber-600",
      logo: (
        <svg className="w-5 h-5 text-orange-450 fill-none stroke-current stroke-2" viewBox="0 0 24 24" referrerPolicy="no-referrer">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    },
    {
      name: "Shajgoj",
      tag: "Beauty & Lifestyle",
      color: "from-pink-500 to-fuchsia-600",
      logo: (
        <svg className="w-5 h-5 text-pink-400 fill-current" viewBox="0 0 24 24" referrerPolicy="no-referrer">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )
    },
    {
      name: "Chaldal",
      tag: "Online Grocery",
      color: "from-lime-500 to-emerald-600",
      logo: (
        <svg className="w-5 h-5 text-emerald-400 fill-current" viewBox="0 0 24 24" referrerPolicy="no-referrer">
          <path d="M17 18c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zM7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm0-3l1.1-2h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.3-.25.64-.25 1.01 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25z" />
        </svg>
      )
    },
    {
      name: "PriyoShop",
      tag: "Smart Retail Tech",
      color: "from-blue-500 to-indigo-600",
      logo: (
        <svg className="w-5 h-5 text-indigo-400 fill-current" viewBox="0 0 24 24" referrerPolicy="no-referrer">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 12H9v-2h6v2zm0-4H9V10h6v2z" />
        </svg>
      )
    },
    {
      name: "Khaas Food",
      tag: "Organic Pure Food",
      color: "from-teal-500 to-emerald-600",
      logo: (
        <svg className="w-5 h-5 text-teal-400 fill-none stroke-current stroke-2" viewBox="0 0 24 24" referrerPolicy="no-referrer">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      )
    },
    {
      name: "Bongo BD",
      tag: "Watch Entertainment",
      color: "from-sky-500 to-blue-600",
      logo: (
        <svg className="w-5 h-5 text-blue-400 fill-current" viewBox="0 0 24 24" referrerPolicy="no-referrer">
          <path d="M8 5v14l11-7z" />
        </svg>
      )
    }
  ];

  // Customer Reviews
  const reviews = [
    {
      text: "Nexora designed our brand refresh and launched our newest marketing dashboard. The process was extremely simple, the team communicated well, and we got real customers within two weeks!",
      author: "Nusrat Jahan",
      origin: "Founder, Dhaka Fashion Hub",
      rating: 5,
      role: "E-Commerce Director",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80"
    },
    {
      text: "Working with them was the best business choice we made this year. Their simple, beautifully formatted web design gets us positive comments daily. Highly recommended!",
      author: "Shafiqul Alam",
      origin: "Corporate Director, Brand Glo Bangladesh",
      rating: 5,
      role: "Executive Partner",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80"
    },
    {
      text: "They created our online booking site and took the pressure off our marketing campaign. Every document, quotation, and receipt is organized. Simple English, premium results, with clear timelines.",
      author: "Imran Hasan",
      origin: "CEO, Shwapno Tech-Ventures",
      rating: 5,
      role: "Managing Director",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80"
    }
  ];

  const defaultServices = [
    { title: "Beautiful Web Design", desc: "Fast, stylish, and premium websites built with easy controls to capture customers on mobile and computers.", icon: Layout, cat: "Custom Websites" },
    { title: "Digital Ads & Growth", desc: "Profitable marketing campaigns on Facebook, Google, and YouTube to show your brand to millions of buyers.", icon: TrendingUp, cat: "Paid Campaigns" },
    { title: "Motion Graphics & Promo Videos", desc: "Exciting, premium animated promotional videos and reels that make your brand stand out instantly.", icon: Video, cat: "Video Editing" },
    { title: "Branding & Creative Design", desc: "Modern corporate logos, visual graphics, color palettes, and brochures designed to look premium.", icon: Edit3, cat: "Visual Identity" },
    { title: "Search Engine Optimization (SEO)", desc: "Help your business show up at the very top of Google Search results so customers can find you first.", icon: Globe, cat: "Organic Traffic" },
    { title: "Smarter Business Platforms", desc: "Build backend billing tools, inventory systems, and easy custom web consoles tailored to your workplace.", icon: Lock, cat: "Software Systems" }
  ];

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const snap = await getDocs(collection(db, 'nexora_team'));
        if (!snap.empty) {
          const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const formatted = list.map((m: any) => ({
            name: m.name,
            role: m.role,
            dep: m.dep || (m.role.includes("Design") || m.role.includes("Artist") ? "Creative Dept" : m.role.includes("Lead") || m.role.includes("Chief") || m.role.includes("Founder") ? "Executive Leadership" : "Operations"),
            avatar: m.image || m.avatar || "/src/assets/images/ceo_portrait_1780313994319.png",
            bio: m.exp || m.bio || ""
          }));
          setTeamMembers(formatted);
        } else {
          setTeamMembers(defaultTeam);
        }
      } catch (err) {
        console.warn("Offline fallback for team:", err);
        const local = localStorage.getItem('nexora_team_backup');
        if (local) {
          const list = JSON.parse(local);
          const formatted = list.map((m: any) => ({
            name: m.name,
            role: m.role,
            dep: m.dep || (m.role.includes("Design") || m.role.includes("Artist") ? "Creative Dept" : m.role.includes("Lead") || m.role.includes("Chief") || m.role.includes("Founder") ? "Executive Leadership" : "Operations"),
            avatar: m.image || m.avatar || "/src/assets/images/ceo_portrait_1780313994319.png",
            bio: m.exp || m.bio || ""
          }));
          setTeamMembers(formatted);
        } else {
          setTeamMembers(defaultTeam);
        }
      }
    };
    fetchTeam();
    
    const fetchServices = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'nexora_services'), limit(3)));
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServices(list);
      } catch (e) {
        console.warn("Could not fetch home services:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchConfigsAndFaqs = async () => {
      try {
        const hDoc = await getDoc(doc(db, 'nexora_config', 'landing_hero'));
        if (hDoc.exists()) {
          setHeroConfig(p => ({ ...p, ...hDoc.data() }));
        }
        const pDoc = await getDoc(doc(db, 'nexora_config', 'pages_config'));
        if (pDoc.exists()) {
          setPagesConfig(p => ({ ...p, ...pDoc.data() }));
        }
        const sDoc = await getDoc(doc(db, 'nexora_config', 'landing_stats'));
        if (sDoc.exists()) {
          setStatsConfig(s => ({ ...s, ...sDoc.data() }));
        }
        const faqSnap = await getDocs(collection(db, 'nexora_faqs'));
        if (!faqSnap.empty) {
          const list = faqSnap.docs.map((d, index) => ({ id: d.id, ...d.data(), open: index === 0 }));
          setFaqs(list as any);
        }
      } catch (err) {
        console.warn("Fallback to offline state assets.");
      }
    };
    fetchConfigsAndFaqs();
  }, []);

  return (
    <div className="min-h-screen bg-[#02020a] text-white overflow-hidden relative font-sans pt-14 selection:bg-indigo-500/30">
      {/* Space Mesh Glow Backdrops */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] bg-gradient-to-b from-indigo-950/20 via-[#0a071d]/10 to-transparent rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 -right-1/4 w-[600px] h-[600px] bg-pink-500/5 rounded-full filter blur-3xl pointer-events-none" />

      {/* Hero Section Container */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Hero Left side textual details */}
          <div className="lg:col-span-7 flex flex-col text-left space-y-6">
            
            {/* Super premium floating announcement pill */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md text-indigo-400 text-[10px] font-black tracking-widest uppercase italic w-fit select-none"
            >
              <Sparkles size={11} className="text-yellow-400 animate-spin" />
              <span>{heroConfig.floatingCapsule}</span>
            </motion.div>

            {/* Simplistic, clean, premium typography headline */}
            <h1 className="text-4xl sm:text-6xl font-sans font-black tracking-tighter leading-none italic uppercase">
              {heroConfig.headline} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">
                {heroConfig.subGradient}
              </span>
            </h1>

            {/* Simple English description card */}
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl font-medium italic">
              {heroConfig.subtitle}
            </p>

            {/* Micro premium bullet badges */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2 text-xs text-slate-300 font-extrabold pb-4 border-b border-white/[0.05]">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-400" />
                <span>Simple English Process</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-indigo-400" />
                <span>Premium Quality Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-rose-400" />
                <span>Transparent BD Office Info</span>
              </div>
            </div>

            {/* Call to Actions with subtle beautiful hovers */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full pt-2">
              <Link to={pagesConfig.heroCtaPrimaryLink || "/contact"} className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(99, 102, 241, 0.4)" }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-10 py-4.5 rounded-2xl text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-3 cursor-pointer shadow-lg select-none"
                >
                  <span>{heroConfig.ctaPrimary}</span>
                  <ArrowRight size={14} />
                </motion.button>
              </Link>

              <Link to={pagesConfig.heroCtaSecondaryLink || "/services"} className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto text-slate-300 hover:text-white bg-white/[0.01] hover:bg-white/[0.04] border border-white/[0.08] px-10 py-4.5 rounded-2xl text-[11px] font-black uppercase tracking-widest cursor-pointer transition-all select-none"
                >
                  <span>{heroConfig.ctaSecondary}</span>
                </motion.button>
              </Link>
            </div>
          </div>

          {/* Hero Right side - Glassmorphism Portrait of Front Programmer with beautiful marketing visuals */}
          <div className="lg:col-span-5 relative mt-10 lg:mt-0 flex justify-center">
            
            {/* Visual background rings decoration */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-pink-500/10 opacity-30 blur-2xl pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border border-white/[0.03] animate-pulse pointer-events-none" />
            
            {/* Dynamic element: Glowing marketing stats visual panel 1 */}
            <motion.div 
               animate={{ y: [0, -12, 0] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -top-6 -left-6 z-20 p-3 bg-[#0c072b]/95 border border-white/[0.08] backdrop-blur-xl rounded-xl shadow-2xl flex items-center gap-3 select-none pointer-events-none"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <ArrowUpRight size={18} />
              </div>
              <div className="text-left">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Sales Click Rate</p>
                <p className="text-xs font-black italic text-emerald-400">+148% Active</p>
              </div>
            </motion.div>

            {/* Dynamic element: Gimmick floating social media icon circle 2 */}
            <motion.div 
               animate={{ y: [0, 12, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
               className="absolute -bottom-4 -right-4 z-20 p-3 bg-[#0d072c]/95 border border-white/[0.08] backdrop-blur-xl rounded-xl shadow-2xl flex items-center gap-3 select-none pointer-events-none"
            >
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                <Heart size={14} className="fill-current animate-pulse" />
              </div>
              <div className="text-left">
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black">Social Love</p>
                <p className="text-xs font-black italic text-rose-400">450k+ Visitors</p>
              </div>
            </motion.div>

            {/* Central premium programmer picture framework */}
            <div className="relative cursor-pointer group">
              {/* Outer Neon Glow Ring */}
              <div className="absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 group-hover:opacity-60 transition-all duration-700 blur" />
              
              <div className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-[2.5rem] bg-slate-950/90 border border-white/[0.08] overflow-hidden p-3.5">
                {/* Visual computer window interface theme wrapper */}
                <div className="flex items-center gap-1.5 mb-3 px-1.5 justify-between select-none">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  </div>
                  <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-widest">NexaSphere Core Programmer</span>
                </div>

                <div className="w-full h-[calc(100%-25px)] rounded-3xl overflow-hidden relative group">
                  <img 
                    src={heroConfig.featureImage} 
                    alt="Senior Lead Programmer/Engineer" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as any).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=600&q=80";
                    }}
                  />
                  {/* Subtle vignette shade */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Small absolute programmer tag */}
                  <span className="absolute bottom-3 left-4 px-3 py-1 bg-indigo-500 text-white rounded-md text-[8px] font-black tracking-widest uppercase">
                    OUR LEAD PROGRAMMER IN FRAME
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* INFINITE SLIDING MARQUEE SECTION FOR BANGLADESHI BRAND PARTNERS */}
      <section className="bg-slate-950/40 border-y border-white/[0.05] py-10 relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6 mb-4 text-center">
          <p className="text-[10px] text-indigo-405 font-black uppercase tracking-[0.25em] italic">
            OUR BRAND SUCCESS TRACKS
          </p>
          <h2 className="text-lg sm:text-2xl font-sans font-black uppercase tracking-tight text-slate-300 mt-1 italic">
            Trusted by Great Brands of Bangladesh
          </h2>
        </div>

        {/* Sliding Ribbon (Using horizontal loop framework) */}
        <div className="w-full overflow-hidden relative flex py-4 select-none">
          {/* Loop Container 1 */}
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="flex gap-8 whitespace-nowrap min-w-full shrink-0"
          >
            {/* Displaying double list for smooth endless wrap */}
            {[...bdBrands, ...bdBrands].map((brand, idx) => (
              <div 
                key={idx} 
                className="inline-flex items-center gap-3 bg-[#050512] border border-white/[0.04] hover:border-indigo-500/20 px-6 py-3.5 rounded-2xl select-none transition-colors cursor-default"
              >
                {/* Brand Initial Graphic Token */}
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${brand.color} p-[1.5px] shadow-sm shrink-0`}>
                  <div className="w-full h-full bg-[#03030c] rounded-[7px] flex items-center justify-center font-sans font-black text-[11px] text-white">
                    {brand.name[0]}
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-xs font-black tracking-tight text-white uppercase italic">{brand.name}</p>
                  <p className="text-[8px] text-slate-500 uppercase tracking-widest font-extrabold">{brand.tag}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* STATS PROGRESSION ROW */}
      <section className="bg-[#03030f]/20 border-b border-white/[0.03] py-14 relative z-10 select-none">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="space-y-1">
            <div className="text-4xl font-extrabold italic text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-indigo-400">{counter1}{statsConfig.stat1_suffix}</div>
            <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">{statsConfig.stat1_label}</p>
          </div>
          <div className="space-y-1">
            <div className="text-4xl font-extrabold italic text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{counter2}{statsConfig.stat2_suffix}</div>
            <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">{statsConfig.stat2_label}</p>
          </div>
          <div className="space-y-1">
            <div className="text-4xl font-extrabold italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{counter3}{statsConfig.stat3_suffix}</div>
            <p className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest">{statsConfig.stat3_label}</p>
          </div>
        </div>
      </section>

      {/* CORE SIX SERVICES SECTION Grid */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center space-y-3 mb-16">
          <span className="text-[10px] text-rose-500 font-black uppercase tracking-[0.25em] italic">EASY & SYSTEMATIC SERVICES</span>
          <h2 className="text-3xl sm:text-5xl font-sans font-black uppercase tracking-tighter italic">WHAT WE BUILD FOR YOU</h2>
          <p className="text-slate-400 text-xs sm:text-sm font-semibold italic max-w-lg mx-auto">No confusing jargon. Here is a clear list of the exact systems we design and manage to grow your sales.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {defaultServices.map((srv, idx) => {
            const IconComponent = srv.icon;
            return (
              <div 
                key={idx}
                className="bg-white/[0.015] border border-white/[0.05] hover:border-indigo-500/30 hover:bg-white/[0.03] p-8 rounded-3xl flex flex-col justify-between min-h-[250px] transition-all group"
              >
                <div className="space-y-4 text-left">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-450 border border-indigo-500/20 flex items-center justify-center font-black group-hover:scale-105 transition-transform shrink-0">
                    <IconComponent size={20} />
                  </div>
                  <h3 className="text-md sm:text-lg font-black uppercase tracking-tight italic text-white">{srv.title}</h3>
                  <p className="text-slate-405 text-xs leading-relaxed font-semibold italic">{srv.desc}</p>
                </div>
                <div className="pt-6 font-mono text-[9px] text-indigo-400 uppercase tracking-widest select-none flex items-center justify-between">
                  <span>{srv.cat}</span>
                  <ArrowRight size={10} className="group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* THE EXPERT TEAM SECTION WITH TEAM PHOTOS & ROLES */}
      <section className="bg-slate-950/20 border-t border-white/[0.04] py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] text-purple-400 font-black uppercase tracking-[0.25em] italic">Meet Our Expert Team</span>
            <h2 className="text-3xl sm:text-5xl font-sans font-black uppercase tracking-tighter italic">NEXORA BRAIN TRUST</h2>
            <p className="text-slate-450 text-xs sm:text-sm font-semibold italic max-w-lg mx-auto">
              Our incredible team of designers, engineers, and marketers who deliver premium success to your business.
            </p>
          </div>

          {/* Staggered Team Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.name}
                whileHover={{ y: -6 }}
                className="bg-[#040411]/70 border border-white/[0.04] hover:border-purple-500/20 p-4 rounded-[2rem] flex flex-col justify-between group transition-all"
              >
                {/* Photo frame */}
                <div className="w-full h-64 rounded-2xl overflow-hidden relative bg-slate-900 border border-white/[0.05]">
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    onError={(e) => {
                      (e.target as any).src = "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=450&q=80";
                    }}
                  />
                  {/* Department badge overlay */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-[#02020a]/80 backdrop-blur-md rounded-lg text-[8px] font-black uppercase tracking-widest text-[#a5b4fc] border border-white/[0.04]">
                    {member.dep}
                  </span>
                </div>

                {/* Info and roles details */}
                <div className="text-left mt-5 space-y-1.5 px-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black italic uppercase text-white tracking-tight group-hover:text-purple-450 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider italic mt-0.5">
                      {member.role}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-semibold italic mt-2.5">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HIGHLY ATTRACTIVE CUSTOMER REVIEWS SECTION */}
      <section className="bg-slate-950/45 border-y border-white/[0.03] py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] text-rose-500 font-black uppercase tracking-[0.25em] italic">Real Customer Words</span>
            <h2 className="text-3xl sm:text-5xl font-sans font-black uppercase tracking-tighter italic">WHAT OUR CLIENTS SAY</h2>
            
            {/* Dynamic Google Scorecard indicator */}
            <div className="flex items-center justify-center gap-2 pt-2 bg-gradient-to-r from-transparent via-indigo-950/20 to-transparent p-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <span className="text-xs font-black uppercase tracking-wide text-white italic">
                4.9 / 5.0 Google Score (120+ Verified Reviews)
              </span>
            </div>
          </div>

          {/* Customer Reviews Elegant Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {reviews.map((rev, idx) => (
              <div 
                key={idx} 
                className="bg-[#030310]/80 border border-white/[0.05] p-8 rounded-3xl relative h-full flex flex-col justify-between hover:border-rose-500/20 transition-colors"
              >
                {/* Five Stars Indicator */}
                <div className="space-y-4">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className="fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic font-semibold">
                    "{rev.text}"
                  </p>
                </div>

                {/* Client Profile Section */}
                <div className="flex items-center gap-3.5 pt-6 border-t border-white/[0.03] mt-8 select-none">
                  <div className="w-11 h-11 rounded-full overflow-hidden border border-white/10 shrink-0 bg-slate-900">
                    <img 
                      src={rev.avatar} 
                      alt={rev.author} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as any).src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80";
                      }}
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-white uppercase italic tracking-tight">{rev.author}</p>
                    <p className="text-[9px] text-[#818cf8] uppercase tracking-widest font-black mt-0.5">{rev.origin}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COLLATED FAQS SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-24 relative z-10">
        <div className="text-center space-y-3 mb-16">
          <span className="text-[10px] text-purple-400 font-black uppercase tracking-[0.25em] italic">Common Disclosures</span>
          <h2 className="text-3xl sm:text-4xl font-sans font-black uppercase tracking-tighter italic">COMMON QUESTIONS FAQ</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-slate-950/85 border border-white/[0.05] rounded-2xl overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-xs sm:text-sm font-extrabold uppercase italic flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-[10px] font-black shrink-0 font-sans">
                    ?
                  </span>
                  <span>{faq.q}</span>
                </span>
                <ChevronDown size={16} className={`text-slate-500 transition-transform ${faq.open ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {faq.open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/[0.03]"
                  >
                    <p className="p-6 text-slate-400 text-xs sm:text-sm leading-relaxed font-semibold italic bg-[#03030d]/30 text-left">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action Container */}
      <section className="max-w-5xl mx-auto px-6 py-20 relative z-10 text-center">
        <div className="bg-gradient-to-br from-[#070529]/60 via-[#0a052c]/20 to-[#030113]/80 border border-indigo-500/20 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.1),transparent_70%)]" />
          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl sm:text-5xl font-sans font-black italic uppercase tracking-tighter leading-tight text-white">
              READY TO WORK TOGETHER?<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-indigo-450 to-purple-400">
                LET'S TALK ABOUT YOUR PROJECT
              </span>
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-semibold italic">
              Stop losing sales with outdated layouts. Message our friendly Dhaka-based sales team today for a completely free advice session and layout review.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
              <Link to="/contact" className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  className="w-full sm:w-auto bg-white text-slate-950 hover:bg-slate-200 font-sans font-black text-xs uppercase tracking-widest px-10 py-4.5 rounded-2xl transition-all cursor-pointer shadow-md"
                >
                  Schedule Advice Call
                </motion.button>
              </Link>
              <Link to="/admin" className="w-full sm:w-auto">
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  className="w-full sm:w-auto bg-transparent text-white border border-white/20 hover:bg-white/[0.05] font-sans font-black text-xs uppercase tracking-widest px-10 py-4.5 rounded-2xl transition-all cursor-pointer"
                >
                  Authorize admin Desk
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
