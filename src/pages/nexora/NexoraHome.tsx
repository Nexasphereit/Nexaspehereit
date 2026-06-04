import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Sparkles, Rocket, Globe, BarChart3, Target, 
  TrendingUp, Award, CheckCircle, HelpCircle, Star, 
  Lock, ArrowUpRight, ChevronDown, Check, Video, Edit3, Heart, Layout, Code2, ShieldAlert,
  Play, FileText, Calendar, Trophy
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

  const toggleFaq = (index: number) => {
    setFaqs(p => p.map((f, i) => i === index ? { ...f, open: !f.open } : f));
  };

  const [heroConfig, setHeroConfig] = useState(() => {
    const backup = localStorage.getItem('nexora_hero_backup');
    if (backup) {
      try {
        const parsed = JSON.parse(backup);
        // Ensure we force marketing-focused content by default if user hasn't explicitly customized it
        if (parsed.headline && parsed.headline.includes("WEBSITES") && !parsed.headline.includes("MARKETING")) {
          localStorage.removeItem('nexora_hero_backup');
        } else {
          return parsed;
        }
      } catch (e) {
        // Fallback to defaults
      }
    }
    return {
      floatingCapsule: "NEXASPHERE ELITE DIGITAL MARKETING & ACQUISITION HUB",
      headline: "WE GROW YOUR ONLINE BUSINESS",
      subGradient: "WITH STRATEGIC PAID ADS & DESIGN",
      subtitle: "Stop losing valuable buyers to confusing, slow designs. We design highly clickable social media posts, run high-converting Facebook, TikTok, & Google ad campaigns, optimize local search SEO, and build fast sales landing pages that multiply your daily checkouts.",
      ctaPrimary: "Get Free Consultation",
      ctaSecondary: "View Our Services",
      featureImage: "/src/assets/images/shakhawat_portrait_1780314607048.png"
    };
  });

  const [pagesConfig, setPagesConfig] = useState(() => {
    const backup = localStorage.getItem('nexora_pages_backup');
    if (backup) {
      try {
        return JSON.parse(backup);
      } catch (e) {
        // Fallback to defaults
      }
    }
    return {
      heroCtaPrimaryLink: '/contact',
      heroCtaSecondaryLink: '/services'
    };
  });

  const [statsConfig, setStatsConfig] = useState(() => {
    const backup = localStorage.getItem('nexora_stats_backup');
    if (backup) {
      try {
        return JSON.parse(backup);
      } catch (e) {
        // Fallback to defaults
      }
    }
    return {
      stat1_val: 150,
      stat1_suffix: "+ Brands",
      stat1_label: "Happy Clients Trusted Us",
      stat2_val: 450,
      stat2_suffix: "k+",
      stat2_label: "Leads & Customers Captured",
      stat3_val: 100,
      stat3_suffix: "% Success-Rate",
      stat3_label: "Dedicated Care and Delivery"
    };
  });

  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);
  const [counter3, setCounter3] = useState(0);

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [configsLoaded, setConfigsLoaded] = useState(() => {
    return !!localStorage.getItem('nexora_hero_backup');
  });

  const [homeUpdates, setHomeUpdates] = useState<any[]>([]);
  const [updatesLoading, setUpdatesLoading] = useState(true);

  const defaultHomeHighlights = [
    {
      id: 'mock_news_1',
      title: 'Scaling Local Cosmetics Brand with Meta Campaign Design',
      type: 'news',
      content: 'We drafted a high-impact creative framework for a leading local beauty brand, creating 15 customized post designs and high-converting Meta target funnels. Average click-through rates spiked by 4.2x, causing an incremental 35% ROAS increase within the first 14 days of activation.',
      dateString: '2026-06-02',
      badgeText: 'ROAS METRIC BOOSTER',
      mediaUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'mock_ach_1',
      title: 'Voted #1 Results-Driven Digital Growth Team in Dhaka',
      type: 'achievement',
      content: 'NexaSphere has been awarded the "Premium Digital Innovation Award 2026" for our high-converting TikTok campaigns and responsive landing pages. By focusing on direct audience response and beautiful designs instead of complex unneeded developer-only code, we delivered over 450,000 active sales leads to our partners.',
      dateString: '2026-06-01',
      badgeText: 'AGENCY LEADERSHIP',
      mediaUrl: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'mock_vid_1',
      title: 'The Blueprint: Stop User Scrolling Under 3 Seconds',
      type: 'video_post',
      content: 'Watch Asaduzzaman Tohin and Nurnnabi Nobi unpack our exclusive 2026 hook formula. In this walkthrough, we explain how using custom TikTok sound-scaffolded visual edits and structured high-contrast layouts can double instant consumer interest on mobile feeds.',
      dateString: '2026-05-30',
      badgeText: 'CREATIVE MASTERCLASS',
      mediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'
    }
  ];

  // Default expert team list
  const defaultTeam = [
    {
      name: "Md. Shakhawat Hossain",
      role: "Founder & Chief Executive Officer",
      dep: "Executive Leadership",
      avatar: "/src/assets/images/shakhawat_portrait_1780314607048.png",
      bio: "Leads the creative vision, high quality standards, and growth strategy for NexaSphere It."
    },
    {
      name: "Asaduzzaman Tohin",
      role: "Head of Sales & Strategy",
      dep: "Sales & Client Relations",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=450&q=80",
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

  const [teamMembers, setTeamMembers] = useState<any[]>(() => {
    const backup = localStorage.getItem('nexora_team_backup');
    if (backup) {
      try {
        const list = JSON.parse(backup);
        if (Array.isArray(list) && list.length > 0) {
          return list.map((m: any) => ({
            name: m.name,
            role: m.role,
            dep: m.dep || (m.role.includes("Design") || m.role.includes("Artist") ? "Creative Dept" : m.role.includes("Lead") || m.role.includes("Chief") || m.role.includes("Founder") ? "Executive Leadership" : "Operations"),
            avatar: m.image || m.avatar || "/src/assets/images/shakhawat_portrait_1780314607048.png",
            bio: m.exp || m.bio || ""
          }));
        }
      } catch (e) {
        // ignore
      }
    }
    return defaultTeam;
  });

  // BD Brands we worked with (Original logos rendered in clean custom SVGs)
  const bdBrands = [
    {
      name: "Rokomari",
      tag: "Online Books & Tech",
      color: "from-red-500 to-rose-600",
      logo: (
        <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24" referrerPolicy="no-referrer">
          <path d="M4 3a1 1 0 0 1 1-1h13.5a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H5a2 2 0 0 1-2-2V4a1 1 0 0 1 1-1zm2 18h12.5a.5.5 0 0 0 .5-.5V3.5a.5.5 0 0 0-.5-.5H6v18zm2-14h8V5H8v2zm0 4h8V9H8v2zm0 4h5v-2H8v2z" />
        </svg>
      )
    },
    {
      name: "Sikho",
      tag: "Hyper Learning EdTech",
      color: "from-orange-500 to-amber-600",
      logo: (
        <svg className="w-5 h-5 text-orange-450 fill-none stroke-current stroke-2" viewBox="0 0 24 24" referrerPolicy="no-referrer">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      )
    },
    {
      name: "Seba",
      tag: "Sheba.xyz Services",
      color: "from-blue-500 to-cyan-500",
      logo: (
        <svg className="w-5 h-5 text-cyan-450 fill-none stroke-current stroke-2" viewBox="0 0 24 24" referrerPolicy="no-referrer">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: "Shazgo",
      tag: "Shajgoj Beauty Care",
      color: "from-pink-500 to-rose-600",
      logo: (
        <svg className="w-5 h-5 text-pink-400 fill-current" viewBox="0 0 24 24" referrerPolicy="no-referrer">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      )
    },
    {
      name: "Chal Dhal",
      tag: "Chaldal Grocery Delivery",
      color: "from-green-500 to-emerald-600",
      logo: (
        <svg className="w-5 h-5 text-green-450 fill-none stroke-current stroke-2" viewBox="0 0 24 24" referrerPolicy="no-referrer">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 13v4m-2-2h4" />
        </svg>
      )
    },
    {
      name: "Priyo Shop",
      tag: "PriyoShop Smart Retail",
      color: "from-indigo-500 to-blue-600",
      logo: (
        <svg className="w-5 h-5 text-indigo-400 fill-none stroke-current stroke-2" viewBox="0 0 24 24" referrerPolicy="no-referrer">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.29 3.05c-.3.4-.02.95.49.95H19m-11 3a1 1 0 100-2 1 1 0 000 2zm9 0a1 1 0 100-2 1 1 0 000 2z" />
        </svg>
      )
    },
    {
      name: "Khaz Food",
      tag: "Khaas Wholesome Organic",
      color: "from-teal-500 to-emerald-600",
      logo: (
        <svg className="w-5 h-5 text-teal-400 fill-none stroke-current stroke-2" viewBox="0 0 24 24" referrerPolicy="no-referrer">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      )
    },
    {
      name: "Bongo BD",
      tag: "Video Entertainment",
      color: "from-sky-500 to-blue-600",
      logo: (
        <svg className="w-5 h-5 text-sky-400 fill-none stroke-current stroke-2" viewBox="0 0 24 24" referrerPolicy="no-referrer">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  // Customer Reviews
  const reviews = [
    {
      text: "NexaSphere It designed our brand refresh and launched our newest marketing dashboard. The process was extremely simple, the team communicated well, and we got real customers within two weeks!",
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
    { title: "Social Media Post Design", desc: "Striking visual graphic templates, banner layouts, and scroll-stopping carousels custom-made to elevate your social channels.", icon: Edit3, cat: "Social Presence" },
    { title: "Facebook Ads Campaigning", desc: "Precision-engineered target demographics, pixel tracking, and ABO/CBO scaling campaigns to instantly multiply your sales leads.", icon: TrendingUp, cat: "Meta Ad Suites" },
    { title: "TikTok Ads & short Reels", desc: "Short-form direct-response video campaigns, creative hook timings, and trend-focused stories built to capture mobile shoppers.", icon: Video, cat: "Gen-Z Reach" },
    { title: "Google Ads & PPC Search", desc: "Position your brand directly at the top of Google Search query lines when high-intent buyers are looking for you.", icon: Target, cat: "High-Intent Capture" },
    { title: "Search Engine Optimization", desc: "Structured semantic blogging, technical schema layouts, and speed optimization audits to dominate organical page rankings.", icon: Globe, cat: "Organic Traffic" },
    { title: "High-Converting Web Systems", desc: "Fast-loading landing pages, modern sales funnels, and responsive online stores built with standard codes to capture leads.", icon: Layout, cat: "Lead Gen Sites" }
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
            avatar: m.image || m.avatar || "/src/assets/images/shakhawat_portrait_1780314607048.png",
            bio: m.exp || m.bio || ""
          }));
          setTeamMembers(formatted);
          localStorage.setItem('nexora_team_backup', JSON.stringify(list));
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
            avatar: m.image || m.avatar || "/src/assets/images/shakhawat_portrait_1780314607048.png",
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
    const fetchLiveBulletins = async () => {
      try {
        const snap = await getDocs(collection(db, 'nexora_portal_updates'));
        if (!snap.empty) {
          const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          list.sort((a: any, b: any) => b.dateString.localeCompare(a.dateString));
          setHomeUpdates(list.slice(0, 3));
        } else {
          setHomeUpdates(defaultHomeHighlights);
        }
      } catch (err) {
        console.warn("Could not query live Firestore portal updates.", err);
        setHomeUpdates(defaultHomeHighlights);
      } finally {
        setUpdatesLoading(false);
      }
    };
    fetchLiveBulletins();
  }, []);

  useEffect(() => {
    const fetchConfigsAndFaqs = async () => {
      try {
        const hDoc = await getDoc(doc(db, 'nexora_config', 'landing_hero'));
        if (hDoc.exists()) {
          const data = hDoc.data();
          setHeroConfig(p => {
            const updated = { ...p, ...data };
            localStorage.setItem('nexora_hero_backup', JSON.stringify(updated));
            return updated;
          });
        }
        const pDoc = await getDoc(doc(db, 'nexora_config', 'pages_config'));
        if (pDoc.exists()) {
          const data = pDoc.data();
          setPagesConfig(p => {
            const updated = { ...p, ...data };
            localStorage.setItem('nexora_pages_backup', JSON.stringify(updated));
            return updated;
          });
        }
        const sDoc = await getDoc(doc(db, 'nexora_config', 'landing_stats'));
        if (sDoc.exists()) {
          const data = sDoc.data();
          setStatsConfig(s => {
            const updated = { ...s, ...data };
            localStorage.setItem('nexora_stats_backup', JSON.stringify(updated));
            return updated;
          });
        }
        const faqSnap = await getDocs(collection(db, 'nexora_faqs'));
        if (!faqSnap.empty) {
          const list = faqSnap.docs.map((d, index) => ({ id: d.id, ...d.data(), open: index === 0 }));
          setFaqs(list as any);
          localStorage.setItem('nexora_faqs_backup', JSON.stringify(list));
        }
      } catch (err) {
        console.warn("Fallback to offline state assets.");
        const backupHero = localStorage.getItem('nexora_hero_backup');
        if (backupHero) setHeroConfig(JSON.parse(backupHero));
        const backupStats = localStorage.getItem('nexora_stats_backup');
        if (backupStats) setStatsConfig(JSON.parse(backupStats));
        const backupPages = localStorage.getItem('nexora_pages_backup');
        if (backupPages) setPagesConfig(JSON.parse(backupPages));
      } finally {
        setConfigsLoaded(true);
      }
    };
    fetchConfigsAndFaqs();
  }, []);

  useEffect(() => {
    const target1 = statsConfig.stat1_val || 150;
    const target2 = statsConfig.stat2_val || 450;
    const target3 = statsConfig.stat3_val || 100;

    setCounter1(0);
    setCounter2(0);
    setCounter3(0);

    const i1 = setInterval(() => setCounter1(p => p < target1 ? p + Math.ceil(target1 / 30) : target1), 30);
    const i2 = setInterval(() => setCounter2(p => p < target2 ? p + Math.ceil(target2 / 30) : target2), 25);
    const i3 = setInterval(() => setCounter3(p => p < target3 ? p + Math.ceil(target3 / 30) : target3), 35);
    return () => {
      clearInterval(i1);
      clearInterval(i2);
      clearInterval(i3);
    };
  }, [statsConfig]);

  if (!configsLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#010103] relative overflow-hidden">
        {/* Soft elegant pulsing gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#e11d48]/5 rounded-full filter blur-3xl animate-pulse" />
        
        <div className="relative flex flex-col items-center gap-6 z-10 text-center">
          {/* Futuristic modern micro spinner */}
          <div className="relative w-16 h-16">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
              className="absolute inset-0 border-t-2 border-r border-[#e11d48]/40 rounded-full"
              style={{ borderTopColor: '#e11d48' }}
            />
            {/* Pulsing core */}
            <motion.div 
              animate={{ scale: [0.85, 1.05, 0.85] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-3.5 bg-[#e11d48]/10 rounded-full border border-[#e11d48]/20 flex items-center justify-center text-[#e11d48]"
            >
              <Sparkles size={14} className="animate-pulse" />
            </motion.div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-white">
              NEXASPHERE <span className="text-[#e11d48]">IT</span>
            </h3>
            <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest animate-pulse">
              Optimizing active visual parameters...
            </p>
          </div>
        </div>
      </div>
    );
  }

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
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${brand.color} p-[1px] shadow-lg shrink-0 transition-all duration-300 group-hover:scale-110 flex items-center justify-center`}>
                  <div className="w-full h-full bg-[#04040d] rounded-[10px] flex items-center justify-center">
                    {brand.logo}
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

      <section className="bg-[#03030f]/60 py-24 relative border-b border-white/[0.04] z-10 overflow-hidden">
        {/* Decorative ambient glowing backdrops inside */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-red-500/5 rounded-full filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
            <div className="text-left space-y-3">
              <span className="flex items-center gap-1.5 text-[10px] text-rose-500 font-black uppercase tracking-[0.25em] italic">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse inline-block" /> Live Agency Updates
              </span>
              <h2 className="text-3xl sm:text-5xl font-sans font-black uppercase tracking-tighter italic text-white">
                CURRENT <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-indigo-400 to-pink-500">BULLETIN DISPATCH</span>
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm font-semibold italic max-w-xl">
                Stay up to date with the latest client campaigns, technology replatforming, and metrics boosters seeded directly on our active database nodes.
              </p>
            </div>
            <Link to="/portal">
              <motion.button 
                whileHover={{ scale: 1.03, borderColor: "rgba(239, 68, 68, 0.4)" }}
                whileTap={{ scale: 0.97 }}
                className="group px-6 py-3.5 border border-white/[0.08] hover:bg-white/[0.02] text-white rounded-2xl text-[10.5px] font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer transition-all"
              >
                <span>Launch Media Portal</span>
                <ArrowRight size={12} className="group-hover:translate-x-1.5 transition-transform" />
              </motion.button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
            {updatesLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-white/[0.01] border border-white/[0.04] p-6 rounded-3xl h-[320px] flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="h-4 bg-white/5 rounded w-1/3" />
                    <div className="h-6 bg-white/5 rounded w-3/4" />
                    <div className="h-20 bg-white/5 rounded w-full" />
                  </div>
                  <div className="h-8 bg-white/5 rounded w-1/2" />
                </div>
              ))
            ) : homeUpdates.length === 0 ? (
              <div className="md:col-span-2 lg:col-span-3 py-16 text-center border border-dashed border-white/[0.08] rounded-3xl bg-white/[0.01]">
                <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">No Bulletins Loaded</p>
              </div>
            ) : (
              homeUpdates.map((item, idx) => {
                const isVideoType = item.type === 'video' || item.type === 'video_post';
                const isAchievement = item.type === 'achievement';
                const isOffer = item.type === 'offer';

                let badgeColor = "bg-indigo-500/15 text-indigo-400 border-indigo-500/20";
                if (isAchievement) badgeColor = "bg-amber-500/15 text-amber-400 border-amber-500/20";
                if (isOffer) badgeColor = "bg-rose-500/15 text-rose-500 border-rose-500/20 animate-pulse";
                if (isVideoType) badgeColor = "bg-emerald-500/15 text-emerald-400 border-emerald-500/20";

                return (
                  <motion.div
                    key={item.id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                    className="flex flex-col justify-between bg-[#040410]/90 border border-white/[0.04] hover:border-indigo-500/20 p-6 sm:p-7 rounded-[2rem] transition-all relative overflow-hidden group shadow-lg shadow-indigo-950/20"
                  >
                    {/* Shimmer gradient effect on cards */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/[0.01] to-transparent -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-[1200ms] ease-out pointer-events-none" />

                    <div className="space-y-4">
                      {/* Media image preview if available */}
                      {item.mediaUrl && (
                        <div className="w-full h-36 rounded-2xl overflow-hidden border border-white/[0.05] relative bg-slate-950/80 mb-2">
                          <img 
                            src={item.mediaUrl} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
                            referrerPolicy="no-referrer"
                          />
                          {isVideoType && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="w-9 h-9 rounded-full bg-red-650 flex items-center justify-center text-white border border-red-500/30 shadow-lg">
                                <Play size={14} className="fill-current ml-0.5" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded border ${badgeColor}`}>
                          {item.badgeText || item.type.toUpperCase()}
                        </span>
                        <span className="text-[9.5px] text-slate-500 font-mono font-bold flex items-center gap-1">
                          <Calendar size={10} /> {item.dateString}
                        </span>
                      </div>

                      <h3 className="text-md font-black uppercase text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-slate-400 text-xs leading-relaxed font-semibold italic line-clamp-3">
                        "{item.content}"
                      </p>
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/[0.03] flex items-center justify-between">
                      <span className="text-slate-500 font-bold uppercase tracking-wider text-[9px] font-mono">
                        {isVideoType ? "Video Dispatch" : "Live Feed Item"}
                      </span>
                      <Link to="/portal" className="text-indigo-400 hover:text-white font-mono text-[9px] uppercase tracking-widest flex items-center gap-1.5 transition-colors font-extrabold select-none">
                        <span>Explore Portal</span>
                        <ArrowRight size={10} />
                      </Link>
                    </div>
                  </motion.div>
                );
              })
            )}
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
            <h2 className="text-3xl sm:text-5xl font-sans font-black uppercase tracking-tighter italic">NEXASPHERE IT BRAIN TRUST</h2>
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
