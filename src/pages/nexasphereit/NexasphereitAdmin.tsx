import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, LayoutDashboard, PlusCircle, Trash2, ListMinus, LayoutGrid, 
  Settings, Mail, FileText, Plus, UserCheck, MessageSquare, 
  Sliders, Calendar, Eye, Send, Cpu, Bell, LogOut, CheckSquare, 
  ExternalLink, Upload, FolderHeart, LibrarySquare, AlertCircle, ArrowRight,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  getDocs, collection, addDoc, deleteDoc, doc, updateDoc, 
  serverTimestamp, query, orderBy, setDoc, onSnapshot
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import { ImageUpload } from '../../components/common/UI';

const matchSpecialistForService = (serviceName: string) => {
  const s = (serviceName || '').toLowerCase();
  if (s.includes('ad') || s.includes('meta') || s.includes('facebook') || s.includes('tiktok') || s.includes('google') || s.includes('marketing') || s.includes('sales')) {
    return {
      name: "Asaduzzaman Tohin / Nur Hasan",
      role: "Growth Architects & Paid Ad Experts",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=80&h=80&q=80",
      reason: "Meta Blueprint Certified strategy & scalable conversion loops"
    };
  } else if (s.includes('design') || s.includes('graphic') || s.includes('banner') || s.includes('logo') || s.includes('video') || s.includes('post') || s.includes('creative') || s.includes('visual')) {
    return {
      name: "Nurnnabi Nobi",
      role: "Graphics & Motion Lead Artist",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80",
      reason: "Scroll-stopping promotional reels and vector corporate typography"
    };
  } else if (s.includes('seo') || s.includes('code') || s.includes('site') || s.includes('web') || s.includes('developer') || s.includes('funnel') || s.includes('react') || s.includes('shopify')) {
    return {
      name: "Hamim Rahman",
      role: "Web Design & Development Lead",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&h=80&q=80",
      reason: "Next-gen secure web frameworks, analytics pixels & sub-second loads"
    };
  } else {
    return {
      name: "Md. Shakhawat Hossain",
      role: "Founder & CEO",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80",
      reason: "General strategic direction, high quality assurance and oversight"
    };
  }
};

export default function NexasphereitAdmin() {
  const { settings, updateSettings } = useTheme();
  const userRole = (auth.currentUser as any)?.role || 'guest';
  const isAdmin = userRole === 'admin' || userRole === 'guest';

  const [activeTab, setActiveTab] = useState<'leads' | 'inbox' | 'ads' | 'services' | 'blogs' | 'customizer' | 'updates'>('leads');
  const [selectedMailId, setSelectedMailId] = useState<string | null>(null);
  
  // Real Firestore States
  const [leads, setLeads] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [adsList, setAdsList] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [blogsList, setBlogsList] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  // Website Customizer States
  const [heroConfig, setHeroConfig] = useState({
    floatingCapsule: 'NEXASPHERE IT DIGITAL RENAISSANCE',
    headline: 'TRANSFORMING AD CONVERSIONS',
    subGradient: 'VIA PRETERNATURAL ROAS',
    subtitle: 'World-class performance marketing meets cutting-edge enterprise analytics. We build, optimize, and scale ultra-luxury customer acquisition systems for international brands.',
    ctaPrimary: 'Secure Initial Strategy',
    ctaSecondary: 'Explore Services',
    featureImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
  });

  const [aboutConfig, setAboutConfig] = useState({
    storyTitle: 'SCALING THE DIGITAL FUTURE',
    storySubtitle: 'Founded with the belief that digital campaigns should be mathematically rigorous, NexaSphere IT has scaled from a boutique local optimization team into a fully connected international advertising powerhub.',
    missionTitle: 'OUR MISSION BLUEPRINT',
    missionDesc: 'Our absolute objective is to secure unmatched client profitability through bulletproof analytics, preternatural ad copy hook optimization, and high-speed checkout experience builds. We eliminate useless spending to optimize metrics that translate into actual revenue growth.',
    visionTitle: 'OUR ULTIMATE VISION',
    visionDesc: 'We envision a unified ecosystem where performance marketing is fully integrated with administrative utility—bridging CRM data capture directly with elite back-office document automation.'
  });

  const [termsConfig, setTermsConfig] = useState({
    termsTitle: "Terms of Service & Collaboration",
    termsBody: "Standard Agency SLA. Services are provided on a monthly retainer basis. All metric parameters must be approved prior to onboarding. Cancellation requires a 30-day written notice to the executive partner designated.",
    privacyTitle: "Privacy & Encryption Policy",
    privacyBody: "Privacy is paramount. Any tracking metrics, connected analytics keys, Meta pixels, or customized customer databases seeded into NexaSphere are secured on high-authority servers. We never sell, rent, or distribute metrics databases to external agencies."
  });

  const [statsConfig, setStatsConfig] = useState({
    stat1_val: 185,
    stat1_suffix: 'M+',
    stat1_label: 'Verified Revenue Generated',
    stat2_val: 45,
    stat2_suffix: ' Active',
    stat2_label: 'Global SaaS Accounts',
    stat3_val: 99,
    stat3_suffix: '% ROAS',
    stat3_label: 'Average Lead Scale Efficiency'
  });

  const [pagesConfig, setPagesConfig] = useState({
    servicesCapsule: 'OUR SCALE MATRIX',
    servicesTitle: 'SCALABLE ACQUISITION BLUEPRINTS',
    servicesSubtitle: 'Each service card details our standard metrics parameters. Explore our 10 primary digital capabilities, or configure special bundles below.',
    servicesCtaText: 'Secure Retainer Blueprint',
    portfolioCapsule: 'OUR HISTORIC ROAS DELIVERY',
    portfolioTitle: 'VERIFIED BRAND ACHIEVEMENTS',
    portfolioSubtitle: 'See the direct, data-driven transformation results of our campaigns. Tap any card below to launch its client feedback details and case summary.',
    pricingCapsule: 'TRANSPARENT RECOV_ALLOCATIONS',
    pricingTitle: 'ELITE SCALE RETAINERS',
    pricingSubtitle: 'Zero hidden fees. Full SLA transparency. Choose the growth blueprint aligned to your seven-figure scaling parameters.',
    blogCapsule: 'INSIGHTS MATRIX & MANUALS',
    blogTitle: 'GROWTH EDITORIAL KNOWLEDGE',
    blogSubtitle: 'Written directly by our executive partners. Subscribe below to receive advanced metrics reports and UGC ad hook concepts.',
    contactCapsule: 'SECURE SYSTEM ALLOCATION',
    contactTitle: 'INITIAL CORE STRATEGY DEBIEF',
    contactSubtitle: "Let's build your multi-million scaling blueprint. Complete our target parameters form and our lead marketing architects will execute a custom ROAS analysis within 24 hours.",
    contactFormHeading: "TARGET METRICS PARAMETERS FORM",
    contactButtonText: "REQUEST ARCHITECT STRATEGY CODES",
    heroCtaPrimaryLink: '/contact',
    heroCtaSecondaryLink: '/services',
    servicesCtaLink: '/contact'
  });

  const [customTeam, setCustomTeam] = useState<any[]>([]);
  const [ceoProfile, setCeoProfile] = useState({
    name: "Md. Shakhawat Hossain",
    role: "Founder & Chief Executive Officer",
    exp: "Leads the creative vision, high quality standards, and growth strategy for Nexasphere IT.",
    image: "/src/assets/images/shakhawat_portrait_1780314607048.png"
  });
  const [customMilestones, setCustomMilestones] = useState<any[]>([]);
  const [customPricing, setCustomPricing] = useState<any[]>([]);
  const [customFaqs, setCustomFaqs] = useState<any[]>([]);
  const [customReviews, setCustomReviews] = useState<any[]>([]);

  // Add Item states for customizer arrays
  const [newTeamMember, setNewTeamMember] = useState({ name: '', role: '', exp: '', initial: '', image: '' });
  const [newMilestone, setNewMilestone] = useState({ year: '', title: '', desc: '' });
  const [newPlan, setNewPlan] = useState({ name: '', price: '', period: 'monthly', desc: '', features: '', popular: false, color: 'border-white/[0.05]' });
  const [newFaq, setNewFaq] = useState({ q: '', a: '' });
  const [newReview, setNewReview] = useState({ text: '', author: '', role: '', origin: '', platform: 'google', rating: 5, avatar: '' });

  // Customizer active sub-tab switching
  const [customizerSubTab, setCustomizerSubTab] = useState<'identity' | 'hero' | 'about' | 'pages' | 'team_chrono' | 'pricing' | 'reviews' | 'faqs' | 'footer_terms'>('identity');

  // Multiple Ads Creation Form State
  const [multipleAds, setMultipleAds] = useState<any[]>([
    { title: '', desc: '', platform: 'Meta Direct', status: 'Active', price: '$120 CPM', cta: 'Order Scale' }
  ]);

  // Unified Services Form State
  const [newService, setNewService] = useState({
    title: '',
    price: '',
    desc: '',
    featuresList: ''
  });

  // Blog creation State
  const [newBlog, setNewBlog] = useState({
    title: '',
    desc: '',
    cat: 'Paid Ads',
    read: '6 mins read',
    author: 'Julian Sterling'
  });

  // Portal Updates State
  const [portalUpdatesList, setPortalUpdatesList] = useState<any[]>([]);
  const [newPortalUpdate, setNewPortalUpdate] = useState({
    title: '',
    content: '',
    type: 'news',
    mediaUrl: '',
    videoDuration: '3:00',
    badgeText: 'LIVE BROADCAST',
    dateString: new Date().toISOString().split('T')[0]
  });

  // Fetch metrics data from database
  const loadDatabaseAssets = async () => {
    setLoading(true);
    try {
      // Leads
      const leadsSnap = await getDocs(query(collection(db, 'nexasphereit_leads'), orderBy('createdAt', 'desc')));
      setLeads(leadsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Messages
      const msgSnap = await getDocs(collection(db, 'nexasphereit_messages'));
      setMessages(msgSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Ads
      const adsSnap = await getDocs(collection(db, 'nexasphereit_ads'));
      setAdsList(adsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Services
      const srvSnap = await getDocs(collection(db, 'nexasphereit_services'));
      setServicesList(srvSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Blogs
      const blogSnap = await getDocs(collection(db, 'nexasphereit_blog'));
      setBlogsList(blogSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Portal Updates Live Ledger
      try {
        const portalSnap = await getDocs(collection(db, 'nexasphereit_portal_updates'));
        setPortalUpdatesList(portalSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.warn("Could not query Firestore live portal bulletins, showing initial UI lists.", err);
      }

      // Configs
      const configSnap = await getDocs(collection(db, 'nexasphereit_config'));
      configSnap.docs.forEach(doc => {
        if (doc.id === 'landing_hero') setHeroConfig(doc.data() as any);
        if (doc.id === 'about_core') setAboutConfig(doc.data() as any);
        if (doc.id === 'landing_stats') setStatsConfig(doc.data() as any);
        if (doc.id === 'landing_terms') setTermsConfig(doc.data() as any);
        if (doc.id === 'pages_config') setPagesConfig(p => ({ ...p, ...doc.data() }));
      });

      // Custom team list
      const teamSnap = await getDocs(collection(db, 'nexasphereit_team'));
      if (!teamSnap.empty) {
        setCustomTeam(teamSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        loadDefaultTeam();
      }

      // Custom milestones timeline
      const milestoneSnap = await getDocs(collection(db, 'nexasphereit_milestones'));
      if (!milestoneSnap.empty) {
        setCustomMilestones(milestoneSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        loadDefaultMilestones();
      }

      // Custom pricing plans
      const pricingSnap = await getDocs(collection(db, 'nexasphereit_pricing_plans'));
      if (!pricingSnap.empty) {
        setCustomPricing(pricingSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        loadDefaultPricing();
      }

      // Custom FAQs
      const faqSnap = await getDocs(collection(db, 'nexasphereit_faqs'));
      if (!faqSnap.empty) {
        setCustomFaqs(faqSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        loadDefaultFaqs();
      }

      // Custom reviews
      const reviewsSnap = await getDocs(collection(db, 'nexasphereit_reviews'));
      if (!reviewsSnap.empty) {
        setCustomReviews(reviewsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        loadDefaultReviews();
      }

    } catch (e) {
      console.warn("Firestore collection missing. Initializing fallback mock data sets...", e);
      // Auto-load local storage mock backups so the dashboard ALWAYS runs smoothly regardless of security rule status
      loadMockAssets();
    } finally {
      setLoading(false);
    }
  };

  const loadDefaultTeam = () => {
    setCustomTeam([
      {
        id: 'ceo_member',
        name: "Md. Shakhawat Hossain",
        role: "Founder & Chief Executive Officer",
        dep: "Executive Leadership",
        image: "/src/assets/images/shakhawat_portrait_1780314607048.png",
        avatar: "/src/assets/images/shakhawat_portrait_1780314607048.png",
        exp: "Leads the creative vision, high quality standards, and growth strategy for Nexasphere IT.",
        bio: "Leads the creative vision, high quality standards, and growth strategy for Nexasphere IT.",
        initial: "MS",
        isCEO: true
      },
      {
        id: 'local_t2',
        name: "Asaduzzaman Tohin",
        role: "Head of Sales & Strategy",
        dep: "Sales & Client Relations",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=450&q=80",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=450&q=80",
        exp: "Designs growth blueprints for large corporate accounts and guides our project planning.",
        bio: "Designs growth blueprints for large corporate accounts and guides our project planning.",
        initial: "AT"
      },
      {
        id: 'local_t3',
        name: "Sani Hosen",
        role: "Business Development Executive",
        dep: "Corporate Growth",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=450&q=80",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=450&q=80",
        exp: "Partners with national businesses to expand their reach and digital success rate.",
        bio: "Partners with national businesses to expand their reach and digital success rate.",
        initial: "SH"
      },
      {
        id: 'local_t4',
        name: "Nurnnabi Nobi",
        role: "Graphics & Motion Lead Artist",
        dep: "Creative Arts",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=450&q=80",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=450&q=80",
        exp: "Creates gorgeous digital brand identities, corporate logos, and high-converting video promos.",
        bio: "Creates gorgeous digital brand identities, corporate logos, and high-converting video promos.",
        initial: "NN"
      },
      {
        id: 'local_t5',
        name: "Hamim Rahman",
        role: "Web Design & Development Lead",
        dep: "Engineering Dept",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&h=450&q=80",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&h=450&q=80",
        exp: "Builds high-speed, secure, and gorgeous web portals with modern React systems.",
        bio: "Builds high-speed, secure, and gorgeous web portals with modern React systems.",
        initial: "HR"
      },
      {
        id: 'local_t6',
        name: "Sadia Yeasmin Sudha",
        role: "Legal Advisor & Corporate Counsel",
        dep: "Corporate Law",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=450&q=80",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=450&q=80",
        exp: "Guarantees brand protection, legal safety, and trustful contract terms for all global clients.",
        bio: "Guarantees brand protection, legal safety, and trustful contract terms for all global clients.",
        initial: "SS"
      },
      {
        id: 'local_t7',
        name: "Rony Islam Abid",
        role: "Technical Project Manager",
        dep: "Operations",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=450&q=80",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=450&q=80",
        exp: "Maintains smooth delivery schedules, coordinates teams, and keeps projects organized.",
        bio: "Maintains smooth delivery schedules, coordinates teams, and keeps projects organized.",
        initial: "RA"
      },
      {
        id: 'local_t8',
        name: "Nur Hasan",
        role: "Digital Marketing Expert",
        dep: "Marketing & Growth",
        image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&h=450&q=80",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&h=450&q=80",
        exp: "Sets up profitable Meta, Google, and video marketing campaigns that double your client base.",
        bio: "Sets up profitable Meta, Google, and video marketing campaigns that double your client base.",
        initial: "NH"
      }
    ]);
  };

  const loadDefaultMilestones = () => {
    setCustomMilestones([
      { id: 'local_m1', year: "2021", title: "NexaSphere IT Foundation", desc: "Launched with a small team of 3 analysts optimizing local retail campaigns." },
      { id: 'local_m2', year: "2023", title: "NexaSphere Suite Release", desc: "Introduced integrated back-office PDF creation modules to support enterprise clients." },
      { id: 'local_m3', year: "2025", title: "Global Expand", desc: "Maintained a portfolio of over 45 high-end SaaS accounts tracking $185M+ in revenue." }
    ]);
  };

  const loadDefaultPricing = () => {
    setCustomPricing([
      {
        id: 'local_p1',
        name: "Pilot Launch Retainer",
        price: "$2,500",
        period: "monthly",
        desc: "Perfect for venture-backed seed startups targeting clear proof-of-concept metric scaling on a single primary ad platform.",
        features: "Single Ad Platform Scale (FB or GG),3 UGC Custom Video Hooks Monthly,Direct pixel tracking verification,Weekly performance reports via Slack Dashboard,NexaSphere basic quotation synchronizer",
        popular: false,
        color: "border-white/[0.05]"
      },
      {
        id: 'local_p2',
        name: "Enterprise Scaling Engine",
        price: "$5,000",
        period: "monthly",
        desc: "Our most coveted scale package. Built for established businesses seeking category dominance across both search and social.",
        features: "Multi-Platform Scale (Meta + TikTok + Google PPC),12 Direct-Response UGC Ad Hooks Monthly,1 Custom React or Shopify Lander designed to split-test,Predictive CRM multi-lead score configurations,Full NexaSphere Admin backoffice connectivity,Dedicated marketing architect hotline",
        popular: true,
        color: "border-indigo-500/40 bg-indigo-950/20 shadow-indigo-500/5"
      },
      {
        id: 'local_p3',
        name: "Ultimate Category Leader",
        price: "$10,000",
        period: "monthly",
        desc: "Omnichannel brand siege. Absolute focus of our visual engineering team scaling unlimited funnels and operations globally.",
        features: "Unrestricted omnichannel scale channels,Unlimited custom ad creatives & UGC clips on demand,Unlimited split Lander development,Lifetime Premium NexaSphere Workspace Access,Custom billing integrations & legal SLA frameworks,Priority 1-hour response service level agreement",
        popular: false,
        color: "border-pink-500/30"
      }
    ]);
  };

  const loadDefaultFaqs = () => {
    setCustomFaqs([
      { id: 'local_fq1', q: "What is your typical ROAS (Return on Ad Spend) average?", a: "Across Facebook, Tik Tok, and Google Ads, our corporate average for active campaigns sits at 4.2x ROAS, with high-intent premium Shopify scaling funnels regularly achieving over 6.8x ROAS." },
      { id: 'local_fq2', q: "Do you build the landing pages and sales funnels too?", a: "Yes, we handle the full stack. Our international design team designs high-speed Shopify Stores, custom React funnels, and high-conversion landing pages engineered strictly to maximize lead qualification and purchases." },
      { id: 'local_fq3', q: "How long before we see our first marketing results?", a: "With our specialized NexaSphere IT launch protocol, standard PPC and paid social channels go live with optimized creatives within 10-14 days. Major metrics improvements are visible in your custom analytics portal immediately." },
      { id: 'local_fq4', q: "Do you integrate custom CRM or tools like the NexaSphere Suite?", a: "Absolutely! Every NexaSphere IT retainer grants lifetime premium access to the integrated NexaSphere workspace—where clients and executive staff can instantly manage Quotations, Money Receipts, and custom Sales tracking in real-time." }
    ]);
  };

  const loadDefaultReviews = () => {
    setCustomReviews([
      {
        id: 'default_rev1',
        text: "নেক্সাস্ফিয়ার আইটি আমাদের ব্র্যান্ডকে সম্পূর্ণ নতুন রূপ দিয়েছে এবং আমাদের নতুন মার্কেটিং ড্যাশবোর্ড চালু করেছে। পুরো প্রক্রিয়াটি অত্যন্ত সহজ ছিল, তাদের যোগাযোগ ছিল চমৎকার এবং মাত্র ২ সপ্তাহের মধ্যে আমরা বাস্তব ক্রেতা পেতে শুরু করি!",
        author: "নুসরাত জাহান",
        origin: "প্রতিষ্ঠাতা, ঢাকা ফ্যাশন হাব",
        rating: 5,
        role: "ই-কমার্স ডিরেক্টর",
        platform: "google",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80"
      },
      {
        id: 'default_rev2',
        text: "তাদের সাথে কাজ করা এই বছরের আমাদের সেরা ব্যবসায়িক সিদ্ধান্ত ছিল। তাদের ডিজাইন করা চমৎকার ও দৃষ্টিনন্দন ওয়েব ড্যাশবোর্ডটি প্রতিদিন আমাদের গ্রাহকদের কাছ থেকে প্রশংসা কুড়াচ্ছে। আমরা তাদের কাজ অত্যন্ত জোরালোভাবে সাজেস্ট করছি!",
        author: "শফিকুল আলম",
        origin: "কর্পোরেট ডিরেক্টর, ব্র্যান্ড গ্লো বাংলাদেশ",
        rating: 5,
        role: "এক্সিকিউティブ পার্টনার",
        platform: "facebook",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80"
      },
      {
        id: 'default_rev3',
        text: "তারা আমাদের অনলাইন বুকিং পোর্টাল তৈরি করে দিয়েছে এবং আমাদের মার্কেটিং ক্যাম্পেইনের যাবতীয় কাজের চাপ নিজেরা নিয়ে নিয়েছে। প্রতিটি ডকুমেন্ট, কোটেশন এবং বিলিং সিস্টেম অত্যন্ত নিখুঁত ও গোছানো। সহজ যোগাযোগ, সময়মতো ডেলিভারি ও প্রিমিয়াম আউটপুট!",
        author: "ইমরান হাসান",
        origin: "সিইও, স্বপ্ন টেক-ভেঞ্চারস",
        rating: 5,
        role: "ম্যানেজিং ডিরেক্টর",
        platform: "google",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80"
      },
      {
        id: 'default_rev4',
        text: "তাদের ফেসবুক এবং গুগল অ্যাড ক্যাম্পেইনের মাধ্যমে আমাদের সেলস প্রায় ৩ গুণ বৃদ্ধি পেয়েছে! যেকোনো ব্যবসার প্রচারণা বাড়ানোর জন্য তারা আসলেই বিশ্বস্ত ও দক্ষ সহযোগী। ধন্যবাদ নেক্সাস্ফিয়ার আইটি!",
        author: "তানভীর আহমেদ",
        origin: "চিফ এক্সিকিউティブ, রেইমেন্ট বাজার",
        rating: 5,
        role: "ফাউন্ডার ও সিইও",
        platform: "facebook",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80"
      },
      {
        id: 'default_rev5',
        text: "নেক্সাস্ফিয়ার টিমের ডিজাইন সেন্স অসাধারণ! আমাদের নতুন ডিজিটাল প্রোডাক্ট লঞ্চিংয়ের সময় চমৎকার গ্রাফিক্স ও সোশ্যাল মিডিয়া কিটস রেডি করে দিয়েছিল, যা কাস্টমারদের প্রচুর আকৃষ্ট করেছে। তাদের উপস্থাপনা এককথায় অনন্য!",
        author: "মেহজাবিন চৌধুরী",
        origin: "ক্রিয়েটিভ হেড, এলিগ্যান্ট আর্টস বিডি",
        rating: 5,
        role: "মার্কেটিং স্পেশালিস্ট",
        platform: "direct",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80"
      },
      {
        id: 'default_rev6',
        text: "খুব অল্প সময়ে ডাবল রেসপন্সিভ সাইট ডেভেলপমেন্ট এবং নিখুঁত এসইও সেটআপ করে দেওয়ায় আমাদের অর্গানিক ট্রাফিক ৫০% বেড়েছে। তাদের কাজের প্রিমিয়াম কোয়ালিটি এবং কাজের প্রতি দায়বদ্ধতা সতত প্রশংসনীয়!",
        author: "জাহিদুল ইসলাম",
        origin: "টেক টিম লিড, প্রগ্রেসিভ ডিস্ট্রিবিউশন",
        rating: 5,
        role: "অপারেশনস হেড",
        platform: "direct",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80"
      },
      {
        id: 'default_rev7',
        text: "নেক্সাস্ফিয়ার আইটি-র কাস্টমার সাপোর্ট ও গাইডলাইন অসাধারণ। তারা শুধু ওয়েবসাইট বা বিজ্ঞাপন বানিয়েই দায়িত্ব শেষ করে না, পরবর্তীতে সেলস বৃদ্ধি ও কারিগরি সহায়তায় সবসময় পাশে থাকে। তাদের সার্ভিস ১০ এ ১০!",
        author: "ফারিহা রহমান",
        origin: "সহ-প্রতিষ্ঠাতা, লাক্সারি লাইফ বাংলাদেশ",
        rating: 5,
        role: "পার্টনারশিপস ম্যানেজার",
        platform: "google",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80"
      },
      {
        id: 'default_rev8',
        text: "ডিজিটাল প্রেসেন্স ও সোশ্যাল মিডিয়া অপ্টিমাইজেশানের জন্য বাংলাদেশে নেক্সাস্ফিয়ার এর চেয়ে ভালো দ্বিতীয় কোনো অপশন নেই। তাদের স্ট্র্যাটেজিক পরিকল্পনা অত্যন্ত নিখুঁত এবং রিটার্ন অন ইনভেস্টমেন্ট অসাধারণ!",
        author: "আরিয়ান সাইদ",
        origin: "মার্কেটিং ডিরেক্টর, ফুড ট্রেইলস বিডি",
        rating: 5,
        role: "ব্র্যান্ড অ্যাম্বাসেডর",
        platform: "facebook",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&h=200&q=80"
      }
    ]);
  };

  const loadMockAssets = () => {
    const backupLeads = JSON.parse(localStorage.getItem('nexasphereit_leads_backup') || '[]');
    setLeads(backupLeads.length > 0 ? backupLeads : [
      { id: 'l1', name: "Julian Sterling", email: "jules@google.com", company: "Sterling Retail", phone: "+1 555 9182", budget: "$10,000+", service: "Facebook Ads", message: "Need immediate direct-response hook auditing.", status: "New" },
      { id: 'l2', name: "Aria Vance", email: "aria@zenithwear.co", company: "Zenith wear", phone: "+1 202 0192", budget: "$25,000+", service: "Shopify Store Design", message: "Looking for an AOV shopping slider development.", status: "Closed" }
    ]);

    const backupAds = JSON.parse(localStorage.getItem('nexasphereit_ads_backup') || '[]');
    setAdsList(backupAds.length > 0 ? backupAds : [
      { id: 'a1', title: "Summer Hook UGC campaign", desc: "Facebook direct-response dynamic media pack.", platform: "Meta Direct", status: "Active", price: "$150 CPM" }
    ]);

    const backupServs = JSON.parse(localStorage.getItem('nexasphereit_services_backup') || '[]');
    setServicesList(backupServs.length > 0 ? backupServs : [
      { id: 's1', title: "E-Commerce Funnel Scale", price: "$3,500/mo", desc: "Landing page conversion split metrics package.", featuresList: "Cart Drawer Upgrades, React Codes, Split-A/B Analysis" }
    ]);

    const backupBlogs = JSON.parse(localStorage.getItem('nexasphereit_blogs_backup') || '[]');
    setBlogsList(backupBlogs.length > 0 ? backupBlogs : [
      { id: 'b1', title: "Cracking iOS 14.5 paid social parameters", desc: "How to attribute lead metrics behind proxy tokens.", cat: "Paid Ads", read: "9 mins read" }
    ]);

    const backupHero = JSON.parse(localStorage.getItem('nexasphereit_hero_backup') || '{}');
    if (backupHero.headline) setHeroConfig(backupHero);

    const backupAbout = JSON.parse(localStorage.getItem('nexasphereit_about_backup') || '{}');
    if (backupAbout.storyTitle) setAboutConfig(backupAbout);

    const backupStats = JSON.parse(localStorage.getItem('nexasphereit_stats_backup') || '{}');
    if (backupStats.stat1_label) setStatsConfig(backupStats);

    const backupTerms = JSON.parse(localStorage.getItem('nexasphereit_terms_backup') || '{}');
    if (backupTerms.termsTitle) setTermsConfig(backupTerms);

    const backupPages = JSON.parse(localStorage.getItem('nexasphereit_pages_backup') || '{}');
    if (backupPages.servicesTitle) setPagesConfig(p => ({ ...p, ...backupPages }));

    const backupTeam = JSON.parse(localStorage.getItem('nexasphereit_team_backup') || '[]');
    setCustomTeam(backupTeam.length > 0 ? backupTeam : [
      {
        id: 'ceo_member',
        name: "Md. Shakhawat Hossain",
        role: "Founder & Chief Executive Officer",
        dep: "Executive Leadership",
        image: "/src/assets/images/shakhawat_portrait_1780314607048.png",
        avatar: "/src/assets/images/shakhawat_portrait_1780314607048.png",
        exp: "Leads the creative vision, high quality standards, and growth strategy for Nexasphere IT.",
        bio: "Leads the creative vision, high quality standards, and growth strategy for Nexasphere IT.",
        initial: "MS",
        isCEO: true
      },
      {
        id: 'local_t2',
        name: "Asaduzzaman Tohin",
        role: "Head of Sales & Strategy",
        dep: "Sales & Client Relations",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=450&q=80",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=450&q=80",
        exp: "Designs growth blueprints for large corporate accounts and guides our project planning.",
        bio: "Designs growth blueprints for large corporate accounts and guides our project planning.",
        initial: "AT"
      },
      {
        id: 'local_t3',
        name: "Sani Hosen",
        role: "Business Development Executive",
        dep: "Corporate Growth",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=450&q=80",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=450&q=80",
        exp: "Partners with national businesses to expand their reach and digital success rate.",
        bio: "Partners with national businesses to expand their reach and digital success rate.",
        initial: "SH"
      },
      {
        id: 'local_t4',
        name: "Nurnnabi Nobi",
        role: "Graphics & Motion Lead Artist",
        dep: "Creative Arts",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=450&q=80",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=450&q=80",
        exp: "Creates gorgeous digital brand identities, corporate logos, and high-converting video promos.",
        bio: "Creates gorgeous digital brand identities, corporate logos, and high-converting video promos.",
        initial: "NN"
      },
      {
        id: 'local_t5',
        name: "Hamim Rahman",
        role: "Web Design & Development Lead",
        dep: "Engineering Dept",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&h=450&q=80",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&h=450&q=80",
        exp: "Builds high-speed, secure, and gorgeous web portals with modern React systems.",
        bio: "Builds high-speed, secure, and gorgeous web portals with modern React systems.",
        initial: "HR"
      },
      {
        id: 'local_t6',
        name: "Sadia Yeasmin Sudha",
        role: "Legal Advisor & Corporate Counsel",
        dep: "Corporate Law",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=450&q=80",
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&h=450&q=80",
        exp: "Guarantees brand protection, legal safety, and trustful contract terms for all global clients.",
        bio: "Guarantees brand protection, legal safety, and trustful contract terms for all global clients.",
        initial: "SS"
      },
      {
        id: 'local_t7',
        name: "Rony Islam Abid",
        role: "Technical Project Manager",
        dep: "Operations",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=450&q=80",
        avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&h=450&q=80",
        exp: "Maintains smooth delivery schedules, coordinates teams, and keeps projects organized.",
        bio: "Maintains smooth delivery schedules, coordinates teams, and keeps projects organized.",
        initial: "RA"
      },
      {
        id: 'local_t8',
        name: "Nur Hasan",
        role: "Digital Marketing Expert",
        dep: "Marketing & Growth",
        image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&h=450&q=80",
        avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&h=450&q=80",
        exp: "Sets up profitable Meta, Google, and video marketing campaigns that double your client base.",
        bio: "Sets up profitable Meta, Google, and video marketing campaigns that double your client base.",
        initial: "NH"
      }
    ]);

    const backupMilestones = JSON.parse(localStorage.getItem('nexasphereit_milestones_backup') || '[]');
    setCustomMilestones(backupMilestones.length > 0 ? backupMilestones : [
      { id: 'local_m1', year: "2021", title: "NexaSphere IT Foundation", desc: "Launched with a small team of 3 analysts optimizing local retail campaigns." },
      { id: 'local_m2', year: "2023", title: "NexaSphere Suite Release", desc: "Introduced integrated back-office PDF creation modules to support enterprise clients." },
      { id: 'local_m3', year: "2025", title: "Global Expand", desc: "Maintained a portfolio of over 45 high-end SaaS accounts tracking $185M+ in revenue." }
    ]);

    const backupPricing = JSON.parse(localStorage.getItem('nexasphereit_pricing_backup') || '[]');
    setCustomPricing(backupPricing.length > 0 ? backupPricing : [
      {
        id: 'local_p1',
        name: "Pilot Launch Retainer",
        price: "৳২,৫০,০০০",
        period: "monthly",
        desc: "Perfect for venture-backed seed startups targeting clear proof-of-concept metric scaling on a single primary ad platform.",
        features: "Single Ad Platform Scale (FB or GG),3 UGC Custom Video Hooks Monthly,Direct pixel tracking verification,Weekly performance reports via Slack Dashboard,NexaSphere basic quotation synchronizer",
        popular: false,
        color: "border-white/[0.05]"
      },
      {
        id: 'local_p2',
        name: "Enterprise Scaling Engine",
        price: "৳৫,০০,০০০",
        period: "monthly",
        desc: "Our most coveted scale package. Built for established businesses seeking category dominance across both search and social.",
        features: "Multi-Platform Scale (Meta + TikTok + Google PPC),12 Direct-Response UGC Ad Hooks Monthly,1 Custom React or Shopify Lander designed to split-test,Predictive CRM multi-lead score configurations,Full NexaSphere Admin backoffice connectivity,Dedicated marketing architect hotline",
        popular: true,
        color: "border-indigo-500/40 bg-indigo-950/20 shadow-indigo-500/5"
      },
      {
        id: 'local_p3',
        name: "Ultimate Category Leader",
        price: "৳১০,০০,০০০",
        period: "monthly",
        desc: "Omnichannel brand siege. Absolute focus of our visual engineering team scaling unlimited funnels and operations globally.",
        features: "Unrestricted omnichannel scale channels,Unlimited custom ad creatives & UGC clips on demand,Unlimited split Lander development,Lifetime Premium NexaSphere Workspace Access,Custom billing integrations & legal SLA frameworks,Priority 1-hour response service level agreement",
        popular: false,
        color: "border-pink-500/30"
      }
    ]);

    const backupFaqs = JSON.parse(localStorage.getItem('nexasphereit_faqs_backup') || '[]');
    setCustomFaqs(backupFaqs.length > 0 ? backupFaqs : [
      { id: 'local_fq1', q: "What is your typical ROAS (Return on Ad Spend) average?", a: "Across Facebook, Tik Tok, and Google Ads, our corporate average for active campaigns sits at 4.2x ROAS, with high-intent premium Shopify scaling funnels regularly achieving over 6.8x ROAS." },
      { id: 'local_fq2', q: "Do you build the landing pages and sales funnels too?", a: "Yes, we handle the full stack. Our international design team designs high-speed Shopify Stores, custom React funnels, and high-conversion landing pages engineered strictly to maximize lead qualification and purchases." },
      { id: 'local_fq3', q: "How long before we see our first marketing results?", a: "With our specialized NexaSphere IT launch protocol, standard PPC and paid social channels go live with optimized creatives within 10-14 days. Major metrics improvements are visible in your custom analytics portal immediately." },
      { id: 'local_fq4', q: "Do you integrate custom CRM or tools like the NexaSphere Suite?", a: "Absolutely! Every NexaSphere IT retainer grants lifetime premium access to the integrated NexaSphere workspace—where clients and executive staff can instantly manage Quotations, Money Receipts, and custom Sales tracking in real-time." }
    ]);

    const backupReviews = JSON.parse(localStorage.getItem('nexasphereit_reviews_backup') || '[]');
    if (backupReviews.length > 0) {
      setCustomReviews(backupReviews);
    } else {
      loadDefaultReviews();
    }
  };

  useEffect(() => {
    loadDatabaseAssets();
  }, []);

  useEffect(() => {
    const ceo = customTeam.find(t => t.isCEO || t.id === 'ceo_member');
    if (ceo) {
      setCeoProfile({
        name: ceo.name,
        role: ceo.role,
        exp: ceo.exp || ceo.bio || "",
        image: ceo.image || ceo.avatar || "/src/assets/images/shakhawat_portrait_1780314607048.png"
      });
    } else if (heroConfig.featureImage) {
      setCeoProfile(p => ({ ...p, image: heroConfig.featureImage }));
    }
  }, [customTeam, heroConfig]);

  // Update a Lead Status
  const updateLeadStatus = async (id: string, newStatus: string) => {
    try {
      if (id.startsWith('local_') || id.length < 5) {
        // Fallback internal write
        const list = leads.map(l => l.id === id ? { ...l, status: newStatus } : l);
        setLeads(list);
        localStorage.setItem('nexasphereit_leads_backup', JSON.stringify(list));
      } else {
        await updateDoc(doc(db, 'nexasphereit_leads', id), { status: newStatus });
        toast.success(`Updated lead status to: ${newStatus}`);
        loadDatabaseAssets();
      }
    } catch (e) {
      toast.error("Status updated locally.");
    }
  };

  // Delete Lead
  const handleLeadDelete = async (id: string) => {
    try {
      if (id.startsWith('local_') || id.length < 5) {
        const list = leads.filter(l => l.id !== id);
        setLeads(list);
        localStorage.setItem('nexasphereit_leads_backup', JSON.stringify(list));
      } else {
        await deleteDoc(doc(db, 'nexasphereit_leads', id));
        toast.success("Lead file deleted successfully!");
        loadDatabaseAssets();
      }
    } catch (e) {
      toast.error("Discarded locally.");
    }
  };

  // MULTIPLE ADS FUNCTIONS
  const handleAddMoreAdRow = () => {
    setMultipleAds([...multipleAds, { title: '', desc: '', platform: 'Meta Direct', status: 'Active', price: '$120 CPM', cta: 'Order Scale' }]);
  };

  const handleUpdateAdValue = (idx: number, field: string, val: string) => {
    setMultipleAds(multipleAds.map((ad, i) => i === idx ? { ...ad, [field]: val } : ad));
  };

  const handleRemoveAdRow = (idx: number) => {
    if (multipleAds.length === 1) {
      toast.error("Must seed at least 1 promotion!");
      return;
    }
    setMultipleAds(multipleAds.filter((_, i) => i !== idx));
  };

  // Submit Multiple Ads at same time
  const submitAdsCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    const invalid = multipleAds.some(ad => !ad.title.trim() || !ad.desc.trim());
    if (invalid) {
      toast.error("Please provide title and description indicators for all fields!");
      return;
    }

    try {
      for (const ad of multipleAds) {
        await addDoc(collection(db, 'nexasphereit_ads'), {
          ...ad,
          createdAt: serverTimestamp()
        });
      }
      toast.success(`Successfully uploaded ${multipleAds.length} promotional campaign cards simultaneously!`);
      setMultipleAds([{ title: '', desc: '', platform: 'Meta Direct', status: 'Active', price: '$120 CPM', cta: 'Order Scale' }]);
      loadDatabaseAssets();
    } catch (err) {
      console.warn("No DB connect. Backing up multiple ads locally...");
      const backup = JSON.parse(localStorage.getItem('nexasphereit_ads_backup') || '[]');
      multipleAds.forEach((ad, i) => {
        backup.push({ ...ad, id: 'local_ad_' + Date.now() + '_' + i });
      });
      localStorage.setItem('nexasphereit_ads_backup', JSON.stringify(backup));
      setAdsList([...adsList, ...multipleAds.map((ad, i) => ({ ...ad, id: 'loc_' + i }))]);
      toast.success(`Locally logged ${multipleAds.length} promotional cards.`);
      setMultipleAds([{ title: '', desc: '', platform: 'Meta Direct', status: 'Active', price: '$120 CPM', cta: 'Order Scale' }]);
    }
  };

  const deleteAdRecord = async (id: string) => {
    try {
      if (id.startsWith('local_') || id.length < 5) {
        const list = adsList.filter(ad => ad.id !== id);
        setAdsList(list);
        localStorage.setItem('nexasphereit_ads_backup', JSON.stringify(list));
      } else {
        await deleteDoc(doc(db, 'nexasphereit_ads', id));
        toast.success("Ad item deleted.");
        loadDatabaseAssets();
      }
    } catch (e) {
      toast.error("Removed locally.");
    }
  };

  // DYNAMIC SERVICES FUNCTIONS
  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.title.trim() || !newService.desc.trim()) {
      toast.error("Service Title & Description are mandatory parameters!");
      return;
    }

    try {
      await addDoc(collection(db, 'nexasphereit_services'), {
        ...newService,
        createdAt: serverTimestamp()
      });
      toast.success("Dynamic Corporate Service added successfully!");
      setNewService({ title: '', price: '', desc: '', featuresList: '' });
      loadDatabaseAssets();
    } catch (err) {
      const backup = JSON.parse(localStorage.getItem('nexasphereit_services_backup') || '[]');
      const item = { ...newService, id: 'local_srv_' + Date.now() };
      backup.push(item);
      localStorage.setItem('nexasphereit_services_backup', JSON.stringify(backup));
      setServicesList([...servicesList, item]);
      setNewService({ title: '', price: '', desc: '', featuresList: '' });
      toast.success("Service saved locally.");
    }
  };

  const deleteServiceRecord = async (id: string) => {
    try {
      if (id.startsWith('local_') || id.length < 5) {
        const list = servicesList.filter(s => s.id !== id);
        setServicesList(list);
        localStorage.setItem('nexasphereit_services_backup', JSON.stringify(list));
      } else {
        await deleteDoc(doc(db, 'nexasphereit_services', id));
        toast.success("Custom service removed!");
        loadDatabaseAssets();
      }
    } catch (e) {
      toast.error("Removed locally.");
    }
  };

  // DYNAMIC BLOG FUNCTIONS
  const handleAddBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlog.title.trim() || !newBlog.desc.trim()) {
      toast.error("Please supply Title and short description body of post!");
      return;
    }

    try {
      await addDoc(collection(db, 'nexasphereit_blog'), {
        ...newBlog,
        createdAt: serverTimestamp(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
      toast.success("New growth editorial post published!");
      setNewBlog({ title: '', desc: '', cat: 'Paid Ads', read: '6 mins read', author: 'Julian Sterling' });
      loadDatabaseAssets();
    } catch (err) {
      const backup = JSON.parse(localStorage.getItem('nexasphereit_blogs_backup') || '[]');
      const item = { ...newBlog, id: 'local_blog_' + Date.now(), date: 'Today' };
      backup.push(item);
      localStorage.setItem('nexasphereit_blogs_backup', JSON.stringify(backup));
      setBlogsList([...blogsList, item]);
      setNewBlog({ title: '', desc: '', cat: 'Paid Ads', read: '6 mins read', author: 'Julian Sterling' });
      toast.success("Blog saved locally.");
    }
  };

  const deleteBlogRecord = async (id: string) => {
    try {
      if (id.startsWith('local_') || id.length < 5) {
        const list = blogsList.filter(b => b.id !== id);
        setBlogsList(list);
        localStorage.setItem('nexasphereit_blogs_backup', JSON.stringify(list));
      } else {
        await deleteDoc(doc(db, 'nexasphereit_blog', id));
        toast.success("Blog deleted!");
        loadDatabaseAssets();
      }
    } catch (e) {
      toast.error("Removed locally.");
    }
  };

  // DYNAMIC PORTAL UPDATES HANDLERS
  const handleAddPortalUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortalUpdate.title.trim() || !newPortalUpdate.content.trim()) {
      toast.error("Please supply Title and content body!");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, 'nexasphereit_portal_updates'), {
        ...newPortalUpdate,
        createdAt: serverTimestamp()
      });
      toast.success("New corporate bulletin published successfully!");
      setNewPortalUpdate({
        title: '',
        content: '',
        type: 'news',
        mediaUrl: '',
        videoDuration: '3:00',
        badgeText: 'LIVE BROADCAST',
        dateString: new Date().toISOString().split('T')[0]
      });
      loadDatabaseAssets();
    } catch (err: any) {
      toast.error("Error publishing bulletin: " + err.message);
    }
  };

  const handleDeletePortalUpdate = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'nexasphereit_portal_updates', id));
      toast.success("Broadcast bulletin deleted!");
      loadDatabaseAssets();
    } catch (err: any) {
      toast.error("Failed to delete entry: " + err.message);
    }
  };

  // WEBSITE CONTENT EXECUTIVE CUSTOMIZER HANDLERS
  const handleSaveHeroConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'nexasphereit_config', 'landing_hero'), heroConfig);
      localStorage.setItem('nexasphereit_hero_backup', JSON.stringify(heroConfig));
      toast.success("Hero Core parameters saved to Cloud Database!");
    } catch (err) {
      localStorage.setItem('nexasphereit_hero_backup', JSON.stringify(heroConfig));
      toast.success("Hero params updated locally (offline mode).");
    }
  };

  const handleSaveAboutConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'nexasphereit_config', 'about_core'), aboutConfig);
      localStorage.setItem('nexasphereit_about_backup', JSON.stringify(aboutConfig));
      toast.success("About page parameters saved to Cloud Database!");
    } catch (err) {
      localStorage.setItem('nexasphereit_about_backup', JSON.stringify(aboutConfig));
      toast.success("About params updated locally (offline mode).");
    }
  };

  const handleSaveStatsConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'nexasphereit_config', 'landing_stats'), statsConfig);
      localStorage.setItem('nexasphereit_stats_backup', JSON.stringify(statsConfig));
      toast.success("Stats Counters parameters saved to Cloud Database!");
    } catch (err) {
      localStorage.setItem('nexasphereit_stats_backup', JSON.stringify(statsConfig));
      toast.success("Stats Counters updated locally (offline mode).");
    }
  };

  const handleSaveTermsConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'nexasphereit_config', 'landing_terms'), termsConfig);
      localStorage.setItem('nexasphereit_terms_backup', JSON.stringify(termsConfig));
      toast.success("Legal terms & Privacy disclosures saved to Cloud Database!");
    } catch (err) {
      localStorage.setItem('nexasphereit_terms_backup', JSON.stringify(termsConfig));
      toast.success("Legal terms updated locally (offline mode).");
    }
  };

  const handleSavePagesConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'nexasphereit_config', 'pages_config'), pagesConfig);
      localStorage.setItem('nexasphereit_pages_backup', JSON.stringify(pagesConfig));
      toast.success("All inner page titles, custom buttons & anchor links saved to Cloud Database!");
    } catch (err) {
      localStorage.setItem('nexasphereit_pages_backup', JSON.stringify(pagesConfig));
      toast.success("Pages content updated locally (offline mode).");
    }
  };

  // Team Member Lists & Image Processing
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, isCEO: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1.2 * 1024 * 1024) {
        toast.error("Portrait image must be less than 1.2MB for quick cloud storage!");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const b64 = reader.result as string;
        if (isCEO) {
          setCeoProfile(prev => ({ ...prev, image: b64 }));
        } else {
          setNewTeamMember(prev => ({ ...prev, image: b64 }));
        }
        toast.success("Portrait photo loaded and prepared!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCeoProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ceoProfile.name.trim() || !ceoProfile.role.trim()) {
      toast.error("Please fill CEO Name and Role!");
      return;
    }

    const updatedCeo = {
      id: 'ceo_member',
      name: ceoProfile.name,
      role: ceoProfile.role,
      dep: 'Executive Leadership',
      image: ceoProfile.image,
      avatar: ceoProfile.image,
      exp: ceoProfile.exp,
      bio: ceoProfile.exp,
      initial: ceoProfile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      isCEO: true
    };

    // Update in customTeam list instantly
    const teamWithCEO = customTeam.some(t => t.id === 'ceo_member' || t.isCEO)
      ? customTeam.map(t => (t.id === 'ceo_member' || t.isCEO) ? updatedCeo : t)
      : [updatedCeo, ...customTeam];

    setCustomTeam(teamWithCEO);

    // Update heroConfig featureImage also, so that it reflects in the homepage hero banner!
    const updatedHero = { ...heroConfig, featureImage: ceoProfile.image };
    setHeroConfig(updatedHero);

    try {
      await setDoc(doc(db, 'nexasphereit_team', 'ceo_member'), updatedCeo);
      await setDoc(doc(db, 'nexasphereit_config', 'landing_hero'), updatedHero);

      localStorage.setItem('nexasphereit_team_backup', JSON.stringify(teamWithCEO));
      localStorage.setItem('nexasphereit_hero_backup', JSON.stringify(updatedHero));

      toast.success("Executive profile updated globally across the website!");
    } catch (err) {
      localStorage.setItem('nexasphereit_team_backup', JSON.stringify(teamWithCEO));
      localStorage.setItem('nexasphereit_hero_backup', JSON.stringify(updatedHero));
      toast.success("Executive updated locally (offline fallback verified)!");
    }
  };

  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamMember.name.trim() || !newTeamMember.role.trim()) {
      toast.error("Please fill Name and Role!");
      return;
    }
    const initial = newTeamMember.initial || newTeamMember.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    
    // Determine department dynamically based on role text for automatic categorizing in landing pages
    const roleText = newTeamMember.role;
    const dep = roleText.includes("Design") || roleText.includes("Artist") || roleText.includes("Creative")
      ? "Creative Dept"
      : roleText.includes("Lead") || roleText.includes("Chief") || roleText.includes("Founder") || roleText.includes("CEO") || roleText.includes("Executive")
      ? "Executive Leadership"
      : roleText.includes("Sales") || roleText.includes("Account") || roleText.includes("Relations") || roleText.includes("Client")
      ? "Sales & Client Relations"
      : "Operations";

    // Set redundant fields for 100% cross-compatibility between About and Home pages
    const member = { 
      ...newTeamMember, 
      initial, 
      dep,
      avatar: newTeamMember.image, // mirror
      bio: newTeamMember.exp,      // mirror
      isCEO: false
    };
    
    try {
      const docRef = await addDoc(collection(db, 'nexasphereit_team'), member);
      const added = { id: docRef.id, ...member };
      const list = [...customTeam, added];
      setCustomTeam(list);
      localStorage.setItem('nexasphereit_team_backup', JSON.stringify(list));
      setNewTeamMember({ name: '', role: '', exp: '', initial: '', image: '' });
      toast.success("Team member saved to cloud!");
    } catch (err) {
      const id = 'local_team_' + Date.now();
      const added = { id, ...member };
      const backup = [...customTeam, added];
      setCustomTeam(backup);
      localStorage.setItem('nexasphereit_team_backup', JSON.stringify(backup));
      setNewTeamMember({ name: '', role: '', exp: '', initial: '', image: '' });
      toast.success("Team member saved locally!");
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    try {
      if (id.startsWith('local_') || id.length < 5 || id === 'ceo_member') {
        const list = customTeam.filter(t => t.id !== id);
        setCustomTeam(list);
        localStorage.setItem('nexasphereit_team_backup', JSON.stringify(list));
        toast.success("Deleted team member locally.");
      } else {
        await deleteDoc(doc(db, 'nexasphereit_team', id));
        setCustomTeam(customTeam.filter(t => t.id !== id));
        toast.success("Deleted team member from cloud.");
      }
    } catch(e) {
      toast.error("Removed locally.");
    }
  };

  // Milestone lists
  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestone.year || !newMilestone.title) {
      toast.error("Year and Title are required!");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, 'nexasphereit_milestones'), newMilestone);
      setCustomMilestones([...customMilestones, { id: docRef.id, ...newMilestone }]);
      setNewMilestone({ year: '', title: '', desc: '' });
      toast.success("Milestone chronological block added!");
    } catch (err) {
      const id = 'local_milestones_' + Date.now();
      const added = { id, ...newMilestone };
      const backup = [...customMilestones, added];
      setCustomMilestones(backup);
      localStorage.setItem('nexasphereit_milestones_backup', JSON.stringify(backup));
      setNewMilestone({ year: '', title: '', desc: '' });
      toast.success("Milestone saved locally!");
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    try {
      if (id.startsWith('local_') || id.length < 5) {
        const list = customMilestones.filter(m => m.id !== id);
        setCustomMilestones(list);
        localStorage.setItem('nexasphereit_milestones_backup', JSON.stringify(list));
      } else {
        await deleteDoc(doc(db, 'nexasphereit_milestones', id));
        setCustomMilestones(customMilestones.filter(m => m.id !== id));
        toast.success("Deleted milestone from cloud.");
      }
    } catch(e) {
      toast.error("Removed locally.");
    }
  };

  // Pricing retainers
  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.name || !newPlan.price) {
      toast.error("Plan Name and Cost are mandatory!");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, 'nexasphereit_pricing_plans'), newPlan);
      setCustomPricing([...customPricing, { id: docRef.id, ...newPlan }]);
      setNewPlan({ name: '', price: '', period: 'monthly', desc: '', features: '', popular: false, color: 'border-white/[0.05]' });
      toast.success("SLA pricing retainer published!");
    } catch (err) {
      const id = 'local_pricing_' + Date.now();
      const added = { id, ...newPlan };
      const backup = [...customPricing, added];
      setCustomPricing(backup);
      localStorage.setItem('nexasphereit_pricing_backup', JSON.stringify(backup));
      setNewPlan({ name: '', price: '', period: 'monthly', desc: '', features: '', popular: false, color: 'border-white/[0.05]' });
      toast.success("Pricing plan saved locally!");
    }
  };

  const handleDeletePlan = async (id: string) => {
    try {
      if (id.startsWith('local_') || id.length < 5) {
        const list = customPricing.filter(p => p.id !== id);
        setCustomPricing(list);
        localStorage.setItem('nexasphereit_pricing_backup', JSON.stringify(list));
      } else {
        await deleteDoc(doc(db, 'nexasphereit_pricing_plans', id));
        setCustomPricing(customPricing.filter(p => p.id !== id));
        toast.success("Deleted plan from cloud.");
      }
    } catch(e) {
      toast.error("Removed locally.");
    }
  };

  // FAQ Lists
  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaq.q || !newFaq.a) {
      toast.error("Enter both Question and Answer fields!");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, 'nexasphereit_faqs'), newFaq);
      setCustomFaqs([...customFaqs, { id: docRef.id, ...newFaq }]);
      setNewFaq({ q: '', a: '' });
      toast.success("FAQ accordion item saved!");
    } catch (err) {
      const id = 'local_faqs_' + Date.now();
      const added = { id, ...newFaq };
      const backup = [...customFaqs, added];
      setCustomFaqs(backup);
      localStorage.setItem('nexasphereit_faqs_backup', JSON.stringify(backup));
      setNewFaq({ q: '', a: '' });
      toast.success("FAQ saved locally!");
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      if (id.startsWith('local_') || id.length < 5) {
        const list = customFaqs.filter(f => f.id !== id);
        setCustomFaqs(list);
        localStorage.setItem('nexasphereit_faqs_backup', JSON.stringify(list));
      } else {
        await deleteDoc(doc(db, 'nexasphereit_faqs', id));
        setCustomFaqs(customFaqs.filter(f => f.id !== id));
        toast.success("Deleted FAQ from cloud.");
      }
    } catch(e) {
      toast.error("Removed locally.");
    }
  };

  // Custom reviews handlers
  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.text.trim() || !newReview.author.trim() || !newReview.role.trim() || !newReview.origin.trim()) {
      toast.error("Please fill all required review fields!");
      return;
    }
    const payload = {
      text: newReview.text,
      author: newReview.author,
      role: newReview.role,
      origin: newReview.origin,
      platform: newReview.platform,
      rating: Number(newReview.rating || 5),
      avatar: newReview.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80"
    };

    try {
      const docRef = await addDoc(collection(db, 'nexasphereit_reviews'), payload);
      const added = { id: docRef.id, ...payload };
      const updated = [...customReviews, added];
      setCustomReviews(updated);
      localStorage.setItem('nexasphereit_reviews_backup', JSON.stringify(updated));
      setNewReview({ text: '', author: '', role: '', origin: '', platform: 'google', rating: 5, avatar: '' });
      toast.success("Review testimonial saved successfully!");
    } catch (err: any) {
      const id = 'local_rev_' + Date.now();
      const added = { id, ...payload };
      const updated = [...customReviews, added];
      setCustomReviews(updated);
      localStorage.setItem('nexasphereit_reviews_backup', JSON.stringify(updated));
      setNewReview({ text: '', author: '', role: '', origin: '', platform: 'google', rating: 5, avatar: '' });
      toast.success("Review saved locally!");
    }
  };

  const handleDeleteReview = async (id: string) => {
    try {
      if (id.startsWith('local_') || id.startsWith('default_') || id.length < 5) {
        const list = customReviews.filter(r => r.id !== id);
        setCustomReviews(list);
        localStorage.setItem('nexasphereit_reviews_backup', JSON.stringify(list));
        toast.success("Review removed successfully.");
      } else {
        await deleteDoc(doc(db, 'nexasphereit_reviews', id));
        const list = customReviews.filter(r => r.id !== id);
        setCustomReviews(list);
        localStorage.setItem('nexasphereit_reviews_backup', JSON.stringify(list));
        toast.success("Deleted review from cloud.");
      }
    } catch (e) {
      toast.error("Removed locally.");
    }
  };

  return (
    <div className="min-h-screen bg-[#02020a] text-white pt-24 pb-20 relative overflow-hidden font-sans">
      {/* Background Neon Glow Nodes */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-12">
        
        {/* Header Block with Smart Workspace navigation toggles */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/[0.05] pb-8 text-left">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Cpu className="text-indigo-400 animate-pulse" size={16} />
              <span className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.25em] italic">NEXASPHERE BACKOFFICE DESK</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-sans font-black italic uppercase tracking-tighter">PORTAL CONTROL DECK</h1>
          </div>

          {/* Quick jump paths to original IT generators & theme settings */}
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/">
              <button className="px-4 py-2.5 bg-indigo-600/10 hover:bg-indigo-600/20 border border-indigo-500/20 rounded-xl text-[10px] uppercase font-black tracking-widest text-[#a5b4fc] flex items-center gap-1.5 transition-all">
                Workspace Dashboard <ExternalLink size={12} />
              </button>
            </Link>
            <Link to="/quotations">
              <button className="px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] rounded-xl text-[10px] uppercase font-black tracking-widest text-slate-300 flex items-center gap-1.5 transition-all">
                Quotation Builder <ExternalLink size={12} />
              </button>
            </Link>
            <Link to="/cvs">
              <button className="px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] rounded-xl text-[10px] uppercase font-black tracking-widest text-slate-300 flex items-center gap-1.5 transition-all">
                CV Core <ExternalLink size={12} />
              </button>
            </Link>
            <Link to="/receipts">
              <button className="px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.05] rounded-xl text-[10px] uppercase font-black tracking-widest text-slate-300 flex items-center gap-1.5 transition-all">
                Receipts Ledger <ExternalLink size={12} />
              </button>
            </Link>
          </div>
        </div>

        {/* Dashboard Core Analytical Summary Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="bg-slate-950/60 border border-white/[0.05] p-6 rounded-2xl">
            <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest block mb-1">TOTAL ACQUIRED LEADS</span>
            <span className="text-3xl font-black italic text-indigo-400">{leads.length} Files</span>
            <span className="text-[9px] text-emerald-400 font-bold tracking-widest block mt-2">100% SECURE STORAGE</span>
          </div>

          <div className="bg-slate-950/60 border border-white/[0.05] p-6 rounded-2xl">
            <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest block mb-1">PROMOTIONAL ADS SEEDED</span>
            <span className="text-3xl font-black italic text-[#a855f7]">{adsList.length} Campaign Blocks</span>
            <span className="text-[9px] text-[#cbd5e1] font-bold tracking-widest block mt-2">MULTIPLE ENTRANT OK</span>
          </div>

          <div className="bg-slate-950/60 border border-white/[0.05] p-6 rounded-2xl">
            <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest block mb-1">SLA SERVICES SEEDED</span>
            <span className="text-3xl font-black italic text-pink-400">{servicesList.length} Custom Retainers</span>
            <span className="text-[9px] text-[#cbd5e1] font-bold tracking-widest block mt-2">LIVE ON SITE</span>
          </div>

          <div className="bg-slate-950/60 border border-white/[0.05] p-6 rounded-2xl">
            <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest block mb-1">KNOWLEDGE BLOGS</span>
            <span className="text-3xl font-black italic text-[#eab308]">{blogsList.length} Reports</span>
            <span className="text-[9px] text-[#cbd5e1] font-bold tracking-widest block mt-2">SEO INDEX READY</span>
          </div>
        </section>

        {/* Tab Selection Toolbar */}
        <div className="flex border-b border-white/[0.05] gap-4 overflow-x-auto">
          {[
            { id: 'leads', label: 'Order Desk', icon: FolderHeart },
            { id: 'inbox', label: '📧 Gmail Inbox Simulation (gwhasu@gmail.com)', icon: Mail },
            { id: 'ads', label: 'SeedTest Ads', icon: Sliders },
            { id: 'services', label: 'Services Catalogue', icon: LibrarySquare },
            { id: 'blogs', label: 'Blogs Seeder Portal', icon: FileText },
            { id: 'updates', label: 'News & Portal updates', icon: Bell },
            { id: 'customizer', label: 'Website Content Customizer', icon: Settings }
          ].filter(tab => tab.id !== 'customizer' || isAdmin).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-2 text-xs uppercase font-black tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? 'border-indigo-500 text-indigo-400 font-extrabold' 
                    : 'border-transparent text-slate-450 hover:text-white'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Tabs Area */}
        <div className="text-left bg-slate-950/20 border border-white/[0.05] p-6 lg:p-10 rounded-[2.5rem]">
          
          {/* TAB 1: Leads and messaging lists */}
          {activeTab === 'leads' && (
            <div className="space-y-8">
              <div className="space-y-1">
                <h3 className="text-lg font-black uppercase italic tracking-tight text-white">PROSPECT SUBMISSIONS & ORDER DESK</h3>
                <p className="text-slate-450 text-[11px] font-semibold italic">These queries and campaign scopes were received directly from the front landing page contact portal.</p>
              </div>

              <div className="space-y-6">
                {leads.map((l) => {
                  const matchedSpec = matchSpecialistForService(l.service || '');
                  return (
                    <div key={l.id} className="p-6 bg-slate-950/80 border border-white/[0.05] rounded-3xl relative flex flex-col md:flex-row justify-between items-start gap-6 transition-all hover:border-indigo-500/25">
                      <div className="space-y-3 flex-1 text-left">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-[9px] font-mono font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-indigo-550/10 text-indigo-400 border border-indigo-550/20">
                            {l.status}
                          </span>
                          <h4 className="text-md font-black uppercase text-white">{l.name}</h4>
                          {l.company && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.08] text-slate-400">
                              {l.company}
                            </span>
                          )}
                          <span className="text-[10px] font-mono bg-indigo-950/40 text-indigo-300 font-semibold px-2 py-0.5 rounded border border-indigo-500/10">
                            Target: {l.service || "General Strategy"}
                          </span>
                        </div>
                        
                        <p className="text-[#94a3b8] text-xs font-semibold">
                          💰 Campaign Budget: <span className="text-emerald-400 font-black">{l.budget || "Unspecified"}</span> | 📞 Phone: <span className="font-mono text-slate-200">{l.phone || "N/A"}</span> | 📧 Email: <span className="font-mono text-indigo-400">{l.email}</span>
                        </p>
                        
                        <div className="text-slate-300 text-xs italic bg-white/[0.015] p-4 rounded-2xl border border-white/[0.03] leading-relaxed relative">
                          <span className="text-[8px] font-mono font-black text-indigo-500 uppercase tracking-widest block mb-1">CLIENT INQUIRY & DEMAND PARTICULARS:</span>
                          "{l.message}"
                        </div>

                        {/* Automated expert pairing node */}
                        <div className="p-4 bg-indigo-950/25 border border-indigo-500/15 rounded-2xl flex items-center gap-3.5 mt-3">
                          <img 
                            src={matchedSpec.avatar || undefined} 
                            alt={matchedSpec.name} 
                            className="w-10 h-10 object-cover rounded-xl border border-white/[0.1] shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-0.5 text-left">
                            <span className="text-[7.5px] font-mono font-black text-indigo-450 uppercase tracking-widest block">Automated Campaign Assignment (Who can do what?)</span>
                            <p className="text-xs font-black text-white">{matchedSpec.name}</p>
                            <p className="text-[10px] text-indigo-300 font-semibold italic">{matchedSpec.role} — <span className="text-slate-400 font-normal">"{matchedSpec.reason}"</span></p>
                          </div>
                        </div>
                      </div>

                      <div className="flex md:flex-col gap-2.5 shrink-0 self-end md:self-center">
                        <button 
                          onClick={() => updateLeadStatus(l.id, l.status === 'New' ? 'Nurtured' : 'Closed')}
                          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all uppercase cursor-pointer"
                        >
                          Shift status
                        </button>
                        <button 
                          onClick={() => handleLeadDelete(l.id)}
                          className="p-2.5 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-xl transition-all border border-rose-500/15 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {leads.length === 0 && (
                  <div className="text-center py-12 bg-slate-950/50 rounded-3xl border border-dashed border-white/[0.06]">
                    <AlertCircle className="mx-auto w-8 h-8 text-indigo-400 mb-2 animate-bounce" />
                    <p className="text-xs text-slate-450 italic font-semibold">No prospects added yet. Go ahead and submit a strategy form via the contact page!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 1.5: Simulated Gmail inbox for gwhasu@gmail.com */}
          {activeTab === 'inbox' && (
            <div className="space-y-6">
              {/* Inbox simulated header bar */}
              <div className="bg-[#1a050d]/80 border border-red-500/15 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-650/10 border border-red-600/20 text-red-500 rounded-xl">
                    <Mail size={20} />
                  </div>
                  <div className="text-left">
                    <span className="text-[8px] font-mono font-black text-red-400 uppercase tracking-widest block">SECURED TRANSMITTAL FEED</span>
                    <h3 className="text-md font-black text-white">Gmail Admin Hub Sim (<span className="text-red-400">gwhasu@gmail.com</span>)</h3>
                  </div>
                </div>
                <div className="text-xs font-mono font-semibold px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/25 text-emerald-450 flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> SECURE SMTP STREAM
                </div>
              </div>

              {/* simulated email split screen */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[450px]">
                {/* Left Mini-Sidebar (3 cols) */}
                <div className="lg:col-span-3 bg-[#050510]/80 border border-white/[0.04] p-4 rounded-2xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <button className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all cursor-not-allowed">
                      + Compose Message
                    </button>
                    <nav className="space-y-1 text-xs">
                      {[
                        { label: 'Inbox', count: leads.length, active: true },
                        { label: 'Starred', count: 0, active: false },
                        { label: 'Snoozed', count: 0, active: false },
                        { label: 'Sent Alert Transcripts', count: leads.length, active: false },
                        { label: 'Trash', count: 0, active: false }
                      ].map((sub, idx) => (
                        <div 
                          key={idx} 
                          className={`flex justify-between items-center px-3 py-2 rounded-xl font-bold transition-all ${
                            sub.active 
                              ? 'bg-red-650/10 text-red-400 border border-red-500/15' 
                              : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                          }`}
                        >
                          <span className="font-semibold">{sub.label}</span>
                          {sub.count > 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-mono font-black">{sub.count}</span>
                          )}
                        </div>
                      ))}
                    </nav>
                  </div>
                  <div className="p-3 bg-red-600/[0.02] border border-red-500/10 rounded-xl text-center text-[9px] text-slate-500 font-mono italic">
                    All incoming landing leads bypass standard filters and route directly to <span className="text-slate-400">gwhasu@gmail.com</span>.
                  </div>
                </div>

                {/* Center Mailbox list (4 cols) */}
                <div className="lg:col-span-4 bg-[#03030b] border border-white/[0.04] p-3 rounded-2xl flex flex-col space-y-2 overflow-y-auto max-h-[500px]">
                  <span className="text-[8px] font-mono font-black text-slate-500 tracking-wider uppercase block pb-1 border-b border-white/[0.03] text-left">
                    Direct Campaign Mail Ledger
                  </span>

                  {leads.map((l, index) => {
                    const isNew = l.status === 'New';
                    const isSelected = selectedMailId === l.id || (!selectedMailId && index === 0);
                    if (!selectedMailId && index === 0 && !selectedMailId) {
                      // default selection
                    }
                    return (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setSelectedMailId(l.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1 cursor-pointer ${
                          isSelected
                            ? 'bg-red-950/20 border-red-600/30'
                            : isNew
                              ? 'bg-[#0a0715]/90 border-indigo-500/20 hover:border-indigo-500/30'
                              : 'bg-white/[0.015] border-white/[0.04] hover:bg-white/[0.03]'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-white truncate max-w-[120px]">{l.name}</span>
                          <span className="text-[8px] font-mono text-slate-500">Just Now</span>
                        </div>
                        <p className={`text-[10px] truncate ${isNew ? 'text-indigo-300 font-bold' : 'text-slate-400'}`}>
                          {l.service || 'Omni CRM Consulting'}
                        </p>
                        <p className="text-[9.5px] text-slate-500 italic truncate italic max-w-[170px]">
                          "{l.message}"
                        </p>
                        <div className="flex gap-1.5 mt-1">
                          <span className="text-[7.5px] font-mono bg-emerald-500/10 text-emerald-450 border border-emerald-500/20 px-1 py-0.5 rounded">
                            {l.budget}
                          </span>
                        </div>
                      </button>
                    );
                  })}

                  {leads.length === 0 && (
                    <div className="text-center py-12 text-slate-500 italic text-[11px] font-semibold">
                      Your inbox simulation is currently clear.
                    </div>
                  )}
                </div>

                {/* Right Mail detail envelope (5 cols) */}
                <div className="lg:col-span-5 bg-[#050512] border border-white/[0.04] p-5 rounded-2xl flex flex-col justify-between max-h-[500px] overflow-y-auto">
                  {(() => {
                    const activeMail = leads.find(l => l.id === selectedMailId) || leads[0];
                    if (!activeMail) {
                      return (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 text-xs py-12">
                          <Mail className="w-10 h-10 text-slate-650 animate-pulse mb-2" />
                          <p>Select an incoming transmittal envelope from your mailing ledger to see its fully formatted data.</p>
                        </div>
                      );
                    }
                    const matchedSpec = matchSpecialistForService(activeMail.service || '');
                    return (
                      <div className="space-y-5 text-left h-full flex flex-col justify-between">
                        <div className="space-y-4">
                          {/* Subject Header */}
                          <div className="border-b border-white/[0.05] pb-3 space-y-1">
                            <span className="text-[8px] px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full font-mono font-black border border-red-500/20 uppercase tracking-widest inline-block mb-1">
                              LANDING LEAD TRANSCRIPT
                            </span>
                            <h4 className="text-sm font-black text-white uppercase italic tracking-tight">
                              Fwd: [System Inbound Alert] - Strategic Growth requested by {activeMail.name}
                            </h4>
                          </div>

                          {/* Sender/Receiver Meta */}
                          <div className="text-[10px] space-y-1 bg-white/[0.015] p-3 rounded-xl border border-white/[0.03] font-mono leading-relaxed">
                            <p className="text-slate-350 font-semibold"><span className="text-slate-500">From:</span> "{activeMail.name}" &lt;{activeMail.email}&gt;</p>
                            <p className="text-slate-350 font-semibold"><span className="text-slate-500">To:</span> &lt;gwhasu@gmail.com&gt;</p>
                            <p className="text-slate-500"><span className="text-slate-500">Date:</span> Just Now (Transferred via Firestore DB secure webhook)</p>
                          </div>

                          {/* Email Body */}
                          <div className="p-4 bg-slate-950 border border-white/[0.03] rounded-2xl relative space-y-4 text-xs font-semibold leading-relaxed">
                            <p className="text-slate-300 font-medium">Hello Admin Team,</p>
                            <p className="text-indigo-200">A brand new customer inquiry has hit the landing page. Here is the validated payload structure parsed for immediate evaluation:</p>
                            
                            {/* Structured Payload list */}
                            <div className="space-y-1.5 pt-1 text-[11px] border-t border-b border-white/[0.04] py-3 text-left">
                              <div className="grid grid-cols-3 gap-2 py-0.5">
                                <span className="text-slate-500 uppercase font-mono font-bold text-[8.5px]">PROPOSAL NAME:</span>
                                <span className="col-span-2 text-white font-black">{activeMail.name}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 py-0.5">
                                <span className="text-slate-500 uppercase font-mono font-bold text-[8.5px]">COMPANY / BRANDTag:</span>
                                <span className="col-span-2 text-slate-200">{activeMail.company || "Personal Brand / Direct Partner"}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 py-0.5">
                                <span className="text-slate-500 uppercase font-mono font-bold text-[8.5px]">CUSTOM BUDGET:</span>
                                <span className="col-span-2 text-emerald-450 font-black">{activeMail.budget}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 py-0.5">
                                <span className="text-slate-500 uppercase font-mono font-bold text-[8.5px]">PHONE / CHANNELS:</span>
                                <span className="col-span-2 font-mono text-indigo-300">{activeMail.phone || "N/A"}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 py-0.5">
                                <span className="text-slate-500 uppercase font-mono font-bold text-[8.5px]">REQUEST SERVICE:</span>
                                <span className="col-span-2 text-[#cbd5e1]">{activeMail.service || "Growth Pipeline audit"}</span>
                              </div>
                              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.03]">
                                <span className="text-slate-500 uppercase font-mono font-bold text-[8.5px] block">DEMAND SPECS:</span>
                                <p className="col-span-2 text-slate-300 italic font-medium leading-relaxed">
                                  "{activeMail.message}"
                                </p>
                              </div>
                            </div>

                            {/* Specialist block inside email simulation */}
                            <div className="p-3 bg-red-500/[0.02] border border-red-500/10 rounded-xl space-y-1.5">
                              <span className="text-[7.5px] font-mono font-black text-red-400 uppercase tracking-widest block">System Expert Allocator Recommended Assignment</span>
                              <div className="flex items-center gap-3">
                                <img src={matchedSpec.avatar || undefined} alt={matchedSpec.name} className="w-8 h-8 rounded-lg object-cover border border-white/[0.05]" referrerPolicy="no-referrer" />
                                <div>
                                  <p className="text-[11px] font-black text-white">{matchedSpec.name}</p>
                                  <p className="text-[9px] text-[#94a3b8]">{matchedSpec.role}</p>
                                </div>
                              </div>
                              <p className="text-[8.5px] text-slate-500 font-mono italic leading-normal">
                                Match Reason: "{matchedSpec.reason}"
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Mark processed buttons */}
                        <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between">
                          <span className="text-[8.5px] text-slate-500 font-mono">
                            Delivered securely to inbox
                          </span>
                          <button
                            onClick={() => {
                              updateLeadStatus(activeMail.id, activeMail.status === 'New' ? 'Nurtured' : 'Closed');
                              toast.success(`Campaign status shifted to ${activeMail.status === 'New' ? 'Nurtured' : 'Closed'} inside simulation!`);
                            }}
                            className="px-4 py-2 bg-red-650 hover:bg-red-500 text-white text-[9.5px] font-black tracking-widest uppercase rounded-xl transition-all cursor-pointer"
                          >
                            Proceed / Match Assignment
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Multiple dynamic Ads additions row-by-row seeder */}
          {activeTab === 'ads' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-black uppercase italic tracking-tight text-white">MULTIPLE CAMPAIGN AD ADDITION MATRIX</h3>
                  <p className="text-slate-455 text-[11px] font-semibold italic">Stack several ad slots in a single session, preview them, and seed them concurrently to Firestore.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddMoreAdRow}
                  className="px-4 py-2 bg-[#a855f7]/10 hover:bg-[#a855f7]/20 border border-[#a855f7]/20 rounded-xl text-[10px] uppercase font-black tracking-widest text-purple-400 flex items-center gap-1.5 transition-all"
                >
                  <Plus size={14} /> Add Campaign Card Column
                </button>
              </div>

              <form onSubmit={submitAdsCollection} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {multipleAds.map((ad, idx) => (
                    <div 
                      key={idx}
                      className="bg-slate-950/80 border border-purple-500/15 p-6 rounded-[2rem] space-y-4 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-black text-purple-400 uppercase tracking-widest bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">Campaign Column #{idx+1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAdRow(idx)}
                          className="p-1.5 text-slate-500 hover:text-rose-500 rounded hover:bg-white/[0.04]"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="space-y-4 text-xs font-semibold">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono font-black text-slate-450 uppercase">PROMOTION TITLE / NAME *</label>
                          <input
                            type="text"
                            required
                            placeholder="E.g. Summer UGC Creative Hook A"
                            value={ad.title}
                            onChange={(e) => handleUpdateAdValue(idx, 'title', e.target.value)}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2.5 px-3 focus:border-indigo-500 outline-none text-white font-semibold"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] font-mono font-black text-slate-450 uppercase">CREATIVE DESCRIPTION / HOOK DETS *</label>
                          <input
                            type="text"
                            required
                            placeholder="Hook details & split target angles..."
                            value={ad.desc}
                            onChange={(e) => handleUpdateAdValue(idx, 'desc', e.target.value)}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2.5 px-3 focus:border-indigo-500 outline-none text-white"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[8px] font-mono font-black text-slate-450 uppercase">TARGET PLATFORM</label>
                            <select
                              value={ad.platform}
                              onChange={(e) => handleUpdateAdValue(idx, 'platform', e.target.value)}
                              className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white appearance-none"
                            >
                              <option value="Meta Direct">Meta Direct</option>
                              <option value="TikTok Focus">TikTok Focus</option>
                              <option value="Google Search">Google Search</option>
                              <option value="Omni System">Omni System</option>
                            </select>
                          </div>
                          
                          <div className="space-y-1">
                            <label className="text-[8px] font-mono font-black text-slate-450 uppercase">AQUISITION PRICING</label>
                            <input
                              type="text"
                              placeholder="E.g. $150 CPM"
                              value={ad.price}
                              onChange={(e) => handleUpdateAdValue(idx, 'price', e.target.value)}
                              className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white"
                            />
                          </div>
                        </div>

                        {/* Creative Local Preview Block inside input card! */}
                        {ad.title && (
                          <div className="p-3 bg-purple-500/[0.03] border border-purple-500/10 rounded-xl space-y-1">
                            <span className="text-[7px] text-purple-400 font-mono font-black block tracking-wider uppercase">INSTANT CAMPAIGN PREVIEW</span>
                            <div className="text-[10px] font-mono flex justify-between">
                              <span className="font-bold text-white truncate">{ad.title}</span>
                              <span className="text-purple-400">{ad.price}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    type="submit"
                    className="px-10 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl flex items-center gap-2"
                  >
                    Commit Bulk Seeding ({multipleAds.length})
                    <Send size={14} />
                  </motion.button>
                </div>
              </form>

              {/* Display seeded Ads */}
              <div className="space-y-4 pt-8 border-t border-white/[0.05]">
                <h4 className="text-sm font-black uppercase italic text-white flex items-center gap-1.5">
                  <Sliders size={16} className="text-purple-400" /> SEEDED ADS CAMPAIGN LISTINGS
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {adsList.map((ad, idx) => (
                    <div key={ad.id || idx} className="bg-slate-950/60 p-4 rounded-xl border border-white/[0.03] flex justify-between items-center text-xs">
                      <div>
                        <p className="font-black uppercase text-white">{ad.title}</p>
                        <p className="text-[10px] text-slate-500 font-semibold italic mt-0.5">{ad.desc} — {ad.platform} ({ad.price})</p>
                      </div>
                      <button 
                        onClick={() => deleteAdRecord(ad.id)}
                        className="text-rose-500 hover:text-white p-2 hover:bg-rose-600/10 rounded-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Custom Services Catalogue manager */}
          {activeTab === 'services' && (
            <div className="space-y-8">
              <div className="space-y-1">
                <h3 className="text-lg font-black uppercase italic tracking-tight text-white">CATALOGUE MANAGER</h3>
                <p className="text-slate-455 text-[11px] font-semibold italic">Configure auxiliary customer retainers to complement our 10 standard direct channels.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Addition Form */}
                <form onSubmit={handleAddService} className="lg:col-span-6 bg-slate-950/75 p-6 rounded-[2rem] border border-white/[0.04] space-y-4 text-xs font-semibold">
                  <span className="text-[8px] font-mono font-black uppercase tracking-[0.2em] text-pink-500">ADD SEED RETAINER</span>
                  
                  <div className="space-y-1">
                    <label className="text-[8px] font-mono font-black text-slate-450 uppercase">RETAINER SERVICE TITLE *</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Comprehensive Klaviyo Pipeline"
                      value={newService.title}
                      onChange={(e) => setNewService({...newService, title: e.target.value})}
                      className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white placeholder:text-slate-650"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-mono font-black text-slate-455 uppercase font-black">PRICE TAG</label>
                    <input
                      type="text"
                      placeholder="E.g. $4,000 monthly"
                      value={newService.price}
                      onChange={(e) => setNewService({...newService, price: e.target.value})}
                      className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-mono font-black text-slate-455 uppercase font-black font-black">BULLET HIGHLIGHT FEATURES LIST (COMMA SEPARATED)</label>
                    <input
                      type="text"
                      placeholder="E.g. 5-Flow setup, Custom design templates, Weekly scale audits"
                      value={newService.featuresList}
                      onChange={(e) => setNewService({...newService, featuresList: e.target.value})}
                      className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white placeholder:text-slate-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-mono font-black text-slate-455 uppercase font-black">METRIC TRANSFORMATION EXPLANATION *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Describe target objectives and visual hook testing blueprints..."
                      value={newService.desc}
                      onChange={(e) => setNewService({...newService, desc: e.target.value})}
                      className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white resize-none placeholder:text-slate-650"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4.5 bg-pink-600 hover:bg-pink-500 text-white uppercase text-xs font-black tracking-widest rounded-xl transition-all font-sans cursor-pointer"
                  >
                    Commit Retainer Release
                  </button>
                </form>

                {/* Existing Catalog List */}
                <div className="lg:col-span-6 space-y-4">
                  <h4 className="text-xs font-black uppercase text-white font-mono tracking-wider italic">ACTIVE CLIENT-FACING CUSTOM RETAINERS</h4>
                  
                  {servicesList.map((s, idx) => (
                    <div key={s.id || idx} className="p-5 bg-[#03030c] rounded-2xl border border-white/[0.03] space-y-3 relative">
                      <div className="flex items-center justify-between">
                        <h5 className="font-black uppercase text-white">{s.title}</h5>
                        <button 
                          onClick={() => deleteServiceRecord(s.id)}
                          className="text-slate-500 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-slate-400 text-xs italic font-semibold leading-relaxed">"{s.desc}"</p>
                      <p className="text-[10px] text-pink-400 font-mono font-semibold">{s.price || 'SLA Dependent'}</p>
                    </div>
                  ))}

                  {servicesList.length === 0 && (
                    <div className="text-center py-12 border border-dashed border-white/[0.05] rounded-2xl">
                      <p className="text-xs text-slate-500 italic font-semibold">No dynamic services active on customer pricing sheets.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Blogs creation seeder */}
          {activeTab === 'blogs' && (
            <div className="space-y-8">
              <div className="space-y-1">
                <h3 className="text-lg font-black uppercase italic tracking-tight text-white">GROWTH RESEARCH PUBLISHING SEEDER</h3>
                <p className="text-slate-455 text-[11px] font-semibold italic">Draft analytical reports to populate on the public SEO blog hub instantly.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form */}
                <form onSubmit={handleAddBlog} className="lg:col-span-6 bg-slate-950/75 p-6 rounded-[2rem] border border-white/[0.04] space-y-4 text-xs font-semibold">
                  <span className="text-[8px] font-mono font-black uppercase tracking-[0.2em] text-[#eab308]">CREATE RECOG_ARTICLES</span>
                  
                  <div className="space-y-1">
                    <label className="text-[8px] font-mono font-black text-slate-450 uppercase">REPORT HEADER / TITLE *</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Creative hooks stop rate optimization metrics"
                      value={newBlog.title}
                      onChange={(e) => setNewBlog({...newBlog, title: e.target.value})}
                      className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-black text-slate-455 uppercase">CATEGORY SELECT</label>
                      <select
                        value={newBlog.cat}
                        onChange={(e) => setNewBlog({...newBlog, cat: e.target.value})}
                        className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white appearance-none"
                      >
                        <option value="Paid Ads">Paid Ads</option>
                        <option value="Shopify">Shopify</option>
                        <option value="Funnels">Funnels</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-black text-slate-455 uppercase">READING TIME LENGTH</label>
                      <input
                        type="text"
                        placeholder="E.g. 5 mins read"
                        value={newBlog.read}
                        onChange={(e) => setNewBlog({...newBlog, read: e.target.value})}
                        className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-mono font-black text-slate-455 uppercase font-black">ARTICLE STUDY SUMMARY *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Outline core split testing parameters, results, and CAC improvements to provide prospects value..."
                      value={newBlog.desc}
                      onChange={(e) => setNewBlog({...newBlog, desc: e.target.value})}
                      className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4.5 bg-[#eab308] hover:bg-yellow-500 text-slate-950 font-sans uppercase text-xs font-black tracking-widest rounded-xl transition-all cursor-pointer"
                  >
                    Commit Global Publication
                  </button>
                </form>

                {/* Published List */}
                <div className="lg:col-span-6 space-y-4">
                  <h4 className="text-xs font-black uppercase text-white font-mono tracking-wider italic">PUBLISHED RESEARCH PAPERS ({blogsList.length})</h4>
                  
                  {blogsList.map((b, idx) => (
                    <div key={b.id || idx} className="p-4 bg-[#03030c] rounded-2xl border border-white/[0.03] flex justify-between items-start">
                      <div>
                        <h5 className="font-extrabold text-white text-sm">{b.title}</h5>
                        <p className="text-[10px] text-slate-500 italic mt-1 font-semibold">{b.cat} • {b.read}</p>
                      </div>
                      <button 
                        onClick={() => deleteBlogRecord(b.id)}
                        className="text-slate-550 hover:text-rose-500 hover:bg-white/[0.02] p-1.5 rounded transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4.5: CORPORATE PORTAL LIVE BULLETIN UPDATES SEEDER */}
          {activeTab === 'updates' && (
            <div className="space-y-8 animate-fade-in text-xs font-semibold">
              <div className="space-y-1">
                <h3 className="text-lg font-black uppercase italic tracking-tight text-white">NEXASPHERE BULLETIN BOARD SEEDER</h3>
                <p className="text-slate-455 text-[11px] font-semibold italic">Broadcast daily news, video posts, articles, custom offers, or milestones directly to the Customer live portal page.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
                {/* Form */}
                <form onSubmit={handleAddPortalUpdate} className="lg:col-span-6 bg-[#04040d] p-6 rounded-[2rem] border border-white/[0.04] space-y-4 font-semibold">
                  <span className="text-[8px] font-mono font-black uppercase tracking-[0.2em] text-indigo-400">CREATE BULLETIN DISPATCH ROW</span>
                  
                  <div className="space-y-1">
                    <label className="text-[8px] font-mono font-black text-slate-450 uppercase">BULLETIN HEADER / TITLE *</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. Scaled logistics platform metrics alongside Chaldal"
                      value={newPortalUpdate.title}
                      onChange={(e) => setNewPortalUpdate({...newPortalUpdate, title: e.target.value})}
                      className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-black text-slate-455 uppercase">BULLETIN TYPE</label>
                      <select
                        value={newPortalUpdate.type}
                        onChange={(e) => setNewPortalUpdate({...newPortalUpdate, type: e.target.value as any})}
                        className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white appearance-none"
                      >
                        <option value="news">Daily News Bulletin</option>
                        <option value="offer">Marketing Offer</option>
                        <option value="video_post">Video Post</option>
                        <option value="video">Regular Video</option>
                        <option value="content">Content Post</option>
                        <option value="achievement">Future Achievement</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-black text-slate-455 uppercase">BADGE ACCENT</label>
                      <input
                        type="text"
                        placeholder="E.g. HOT, NEW, EXCLUSIVE"
                        value={newPortalUpdate.badgeText}
                        onChange={(e) => setNewPortalUpdate({...newPortalUpdate, badgeText: e.target.value})}
                        className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-black text-slate-455 uppercase font-black">MEDIA THUMBNAIL URL</label>
                      <input
                        type="text"
                        placeholder="E.g. https://images.unsplash.com/..."
                        value={newPortalUpdate.mediaUrl}
                        onChange={(e) => setNewPortalUpdate({...newPortalUpdate, mediaUrl: e.target.value})}
                        className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2.5 px-3 focus:border-indigo-500 outline-none text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-black text-slate-455 uppercase font-black">VIDEO PLAY DURATION</label>
                      <input
                        type="text"
                        placeholder="E.g. 3:45"
                        value={newPortalUpdate.videoDuration}
                        onChange={(e) => setNewPortalUpdate({...newPortalUpdate, videoDuration: e.target.value})}
                        className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2.5 px-3 focus:border-indigo-500 outline-none text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-mono font-black text-slate-455 uppercase font-black font-semibold">CUSTOM DATE STRING</label>
                    <input
                      type="text"
                      required
                      placeholder="E.g. 2026-06-02"
                      value={newPortalUpdate.dateString}
                      onChange={(e) => setNewPortalUpdate({...newPortalUpdate, dateString: e.target.value})}
                      className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-mono font-black text-slate-455 uppercase font-black font-semibold">BULLETIN CONTENT / BODY *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Enter the broadcast message detailed brief..."
                      value={newPortalUpdate.content}
                      onChange={(e) => setNewPortalUpdate({...newPortalUpdate, content: e.target.value})}
                      className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl p-4 focus:border-indigo-500 outline-none text-white font-medium text-xs leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4.5 bg-indigo-600 hover:bg-indigo-550 font-black uppercase tracking-widest text-white rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-indigo-400/20"
                  >
                    <Plus size={14} />
                    Publish Live Broadcast Card
                  </button>
                </form>

                {/* Ledger Listing */}
                <div className="lg:col-span-6 space-y-4">
                  <span className="text-[8px] font-mono font-black uppercase tracking-[0.2em] text-slate-500 block mb-2">
                    ACTIVE LIVE BULLETIN LOG ({portalUpdatesList.length} items)
                  </span>

                  <div className="max-h-[600px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                    {portalUpdatesList.length === 0 ? (
                      <div className="p-8 text-center bg-[#03030c]/80 border border-dashed border-white/[0.05] rounded-2xl text-slate-500 font-semibold italic">
                        No custom bulletins seeded on Firestore yet. Falling back on beautiful default mockups on the portal front-end.
                      </div>
                    ) : (
                      portalUpdatesList.map((item, index) => (
                        <div key={item.id || index} className="p-4.5 bg-[#03030c] rounded-2xl border border-white/[0.03] flex justify-between items-start gap-4 hover:border-indigo-500/10 transition-all">
                          <div className="space-y-1">
                            <span className="inline-block text-[7px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
                              {item.type}
                            </span>
                            <h5 className="font-extrabold text-white text-xs uppercase">{item.title}</h5>
                            <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed font-semibold">"{item.content.substring(0, 140)}..."</p>
                            <p className="text-[9.5px] text-slate-500 font-mono mt-1 font-semibold">{item.dateString} • Badge: {item.badgeText || 'None'}</p>
                          </div>
                          <button 
                            onClick={(e) => { e.preventDefault(); handleDeletePortalUpdate(item.id); }}
                            className="text-slate-550 hover:text-rose-500 hover:bg-white/[0.02] p-1.5 rounded transition-all cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 5: WEBSITE CONTENT EXECUTIVE CUSTOMIZER */}
          {activeTab === 'customizer' && isAdmin && (
            <div className="space-y-8">
              <div className="space-y-2 border-b border-white/[0.05] pb-4">
                <span className="text-[10px] font-mono tracking-[0.25em] text-indigo-400 font-black italic block">NEXASPHERE SYSTEM CONFIGURATION</span>
                <h3 className="text-xl font-black uppercase italic tracking-tight text-white mb-1">FRONTEND WEBSITE EDITOR PANEL</h3>
                <p className="text-slate-450 text-[11px] font-semibold italic">Edit any hero title, metric statistic, FAQs list, pricing retainers or team members displayed across the organization's public landing screens.</p>
              </div>

              {/* Sub-Tabs selectors */}
              <div className="flex flex-wrap gap-2 pt-2 border-b border-white/[0.03] pb-4">
                {[
                  { id: 'identity', label: 'Brand Identity & Logo' },
                  { id: 'hero', label: 'Landing Hero & Stats' },
                  { id: 'about', label: 'About Story & Blocks' },
                  { id: 'pages', label: 'Inner Sections & Button Action CTAs' },
                  { id: 'team_chrono', label: 'Team & Chronology Timeline' },
                  { id: 'pricing', label: 'SLA Pricing Plan Packages' },
                  { id: 'reviews', label: 'Customer Testimonials' },
                  { id: 'faqs', label: 'Client FAQs Accordion' },
                  { id: 'footer_terms', label: 'Footer Terms & Conditions' }
                ].map(sub => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setCustomizerSubTab(sub.id as any)}
                    className={`px-4 py-2 border rounded-xl text-[10px] uppercase font-black tracking-widest cursor-pointer transition-all ${
                      customizerSubTab === sub.id
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg'
                        : 'bg-white/[0.01] hover:bg-white/[0.04] border-white/[0.05] text-slate-400 hover:text-white'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {/* SUBVIEW 0: BRAND IDENTITY & LOGO */}
              {customizerSubTab === 'identity' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                  {/* Identity Form */}
                  <div className="lg:col-span-6 bg-slate-950/75 p-6 rounded-[2rem] border border-white/[0.04] space-y-5 text-xs font-semibold">
                    <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-indigo-400">BRAND IDENTITY & LOGO CONFIGURATION</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono font-black text-slate-400 uppercase">Company Name</label>
                        <input
                          type="text"
                          value={settings.companyName || ''}
                          onChange={(e) => updateSettings({ companyName: e.target.value })}
                          placeholder="e.g. NexaSphere It"
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white text-xs font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-mono font-black text-slate-400 uppercase">Brand Tagline</label>
                        <input
                          type="text"
                          value={settings.companyTagline || ''}
                          onChange={(e) => updateSettings({ companyTagline: e.target.value })}
                          placeholder="e.g. new ideas, new success"
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-black text-slate-400 uppercase">Logo Height Limit (px)</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min="24"
                          max="80"
                          value={settings.logoHeight || 40}
                          onChange={(e) => updateSettings({ logoHeight: parseInt(e.target.value) })}
                          className="flex-1 accent-indigo-500 cursor-ew-resize bg-[#03030c] h-1.5 rounded-lg"
                        />
                        <span className="font-mono text-sm font-bold text-indigo-400 w-12 text-right">{settings.logoHeight || 40}px</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between items-center text-[8px] font-mono font-black text-slate-400 uppercase">
                        <span>Custom SVG / PNG Logo Artwork</span>
                        {settings.companyLogo && (
                          <button
                            type="button"
                            onClick={() => {
                              updateSettings({ companyLogo: '', companyLogoLight: '' });
                              toast.success('Custom logo deleted successfully.');
                            }}
                            className="text-[9px] font-extrabold text-rose-400 hover:text-rose-500 transition-colors flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded"
                          >
                            Remove Logo
                          </button>
                        )}
                      </div>
                      
                      <ImageUpload 
                        label="Upload company logo for front-end header / footer" 
                        value={settings.companyLogo}
                        onChange={(logo) => {
                          updateSettings({ companyLogo: logo, companyLogoLight: logo });
                          toast.success('Custom company logo generated and set active on the front!');
                        }}
                        className="w-full bg-[#03030c] rounded-xl border border-white/[0.05]"
                      />
                    </div>
                  </div>

                  {/* Preview Box */}
                  <div className="lg:col-span-6 p-8 rounded-[2rem] border border-white/[0.04] bg-slate-950/40 flex flex-col justify-between">
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-mono font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 pl-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        FRONT-END NAVBAR LOGO PREVIEW
                      </h3>
                      
                      {/* Visual Header Mockup */}
                      <div className="p-5 rounded-2xl border border-white/[0.05] bg-[#02020a] flex items-center gap-3 shadow-2xl">
                        {settings.companyLogo ? (
                          <div className="bg-white rounded-lg p-0.5" style={{ height: `${settings.logoHeight || 40}px` }}>
                            <img src={settings.companyLogo || undefined} alt="Logo" className="h-full w-auto object-contain" />
                          </div>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-red-600 to-rose-500 p-[2px]">
                              <div className="w-full h-full bg-[#03030c] rounded-[10px] flex items-center justify-center">
                                <span className="font-sans font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500 text-lg">
                                  {(settings.companyName || 'N').charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-white font-black text-sm uppercase tracking-wider">
                                {settings.companyName || 'NexaSphere It'}
                              </span>
                              <span className="text-[8px] font-mono text-slate-500 uppercase">
                                {settings.companyTagline || 'new ideas, new success'}
                              </span>
                            </div>
                          </>
                        )}
                      </div>

                      <div className="space-y-2 pt-4 border-t border-white/[0.05]">
                        <h5 className="text-[9px] font-mono font-black uppercase text-indigo-400">Front-end White-Labeling details</h5>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                          Updating the company logo, name, and tagline instantly re-brands the landing page header, footer, portals, and generated invoices.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBVIEW 1: HERO & STATS */}
              {customizerSubTab === 'hero' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                  {/* Hero Form */}
                  <form onSubmit={handleSaveHeroConfig} className="lg:col-span-6 bg-slate-950/75 p-6 rounded-[2rem] border border-white/[0.04] space-y-4 text-xs font-semibold">
                    <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-indigo-400">HERO SECTION OPTIONS</h4>
                    
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-black text-slate-450 uppercase">FLOATING CAPSULE HIGHLIGHT</label>
                      <input
                        type="text"
                        value={heroConfig.floatingCapsule}
                        onChange={e => setHeroConfig({ ...heroConfig, floatingCapsule: e.target.value })}
                        className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-black text-slate-450 uppercase">HERO MAIN HEADLINE *</label>
                      <input
                        type="text"
                        required
                        value={heroConfig.headline}
                        onChange={e => setHeroConfig({ ...heroConfig, headline: e.target.value })}
                        className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-black text-slate-450 uppercase">GRADIENT SECONDARY TITLE *</label>
                      <input
                        type="text"
                        required
                        value={heroConfig.subGradient}
                        onChange={e => setHeroConfig({ ...heroConfig, subGradient: e.target.value })}
                        className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-black text-slate-450 uppercase">HERO SUBTITLE / PARAGRAPH</label>
                      <textarea
                        rows={3}
                        value={heroConfig.subtitle}
                        onChange={e => setHeroConfig({ ...heroConfig, subtitle: e.target.value })}
                        className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono font-black text-slate-450 uppercase">PRIMARY CTA BUTTON TEXT</label>
                        <input
                          type="text"
                          value={heroConfig.ctaPrimary}
                          onChange={e => setHeroConfig({ ...heroConfig, ctaPrimary: e.target.value })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono font-black text-slate-450 uppercase">SECONDARY CTA BUTTON TEXT</label>
                        <input
                          type="text"
                          value={heroConfig.ctaSecondary}
                          onChange={e => setHeroConfig({ ...heroConfig, ctaSecondary: e.target.value })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono font-black text-slate-450 uppercase">HERO FEATURE MOCKUP IMAGE URL</label>
                      <input
                        type="text"
                        value={heroConfig.featureImage || ''}
                        placeholder="Paste landscape mockup dashboard/image URL..."
                        onChange={e => setHeroConfig({ ...heroConfig, featureImage: e.target.value })}
                        className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4.5 bg-indigo-600 hover:bg-indigo-550 text-white font-sans uppercase text-[10px] font-black tracking-widest rounded-xl transition-all cursor-pointer"
                    >
                      Save Hero core Parameters
                    </button>
                  </form>

                  {/* Stats form */}
                  <form onSubmit={handleSaveStatsConfig} className="lg:col-span-6 bg-slate-950/75 p-6 rounded-[2rem] border border-white/[0.04] space-y-4 text-xs font-semibold h-fit">
                    <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-[#a855f7]">LANDING PAGES METRIC STATS</h4>

                    <div className="space-y-4 border-b border-white/[0.03] pb-4">
                      <h5 className="text-[9px] uppercase font-bold text-slate-405">COUNTER STAT 1</h5>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">VALUE (NUMBER)</label>
                          <input
                            type="number"
                            value={statsConfig.stat1_val}
                            onChange={e => setStatsConfig({ ...statsConfig, stat1_val: parseInt(e.target.value) || 0 })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2  px-3 focus:border-indigo-500 outline-none text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">SUFFIX (TEXT)</label>
                          <input
                            type="text"
                            value={statsConfig.stat1_suffix}
                            onChange={e => setStatsConfig({ ...statsConfig, stat1_suffix: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">PREVIEW</label>
                          <div className="py-2.5 text-indigo-400 font-extrabold italic text-sm">{statsConfig.stat1_val}{statsConfig.stat1_suffix}</div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-450 uppercase">LABEL / VALUE DESCRIPTION</label>
                        <input
                          type="text"
                          value={statsConfig.stat1_label}
                          onChange={e => setStatsConfig({ ...statsConfig, stat1_label: e.target.value })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 border-b border-white/[0.03] pb-4">
                      <h5 className="text-[9px] uppercase font-bold text-slate-405">COUNTER STAT 2</h5>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">VALUE (NUMBER)</label>
                          <input
                            type="number"
                            value={statsConfig.stat2_val}
                            onChange={e => setStatsConfig({ ...statsConfig, stat2_val: parseInt(e.target.value) || 0 })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-455 uppercase">SUFFIX (TEXT)</label>
                          <input
                            type="text"
                            value={statsConfig.stat2_suffix}
                            onChange={e => setStatsConfig({ ...statsConfig, stat2_suffix: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">PREVIEW</label>
                          <div className="py-2.5 text-purple-400 font-extrabold italic text-sm">{statsConfig.stat2_val}{statsConfig.stat2_suffix}</div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-450 uppercase">LABEL / VALUE DESCRIPTION</label>
                        <input
                          type="text"
                          value={statsConfig.stat2_label}
                          onChange={e => setStatsConfig({ ...statsConfig, stat2_label: e.target.value })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h5 className="text-[9px] uppercase font-bold text-slate-405">COUNTER STAT 3</h5>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">VALUE (NUMBER)</label>
                          <input
                            type="number"
                            value={statsConfig.stat3_val}
                            onChange={e => setStatsConfig({ ...statsConfig, stat3_val: parseInt(e.target.value) || 0 })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-455 uppercase">SUFFIX (TEXT)</label>
                          <input
                            type="text"
                            value={statsConfig.stat3_suffix}
                            onChange={e => setStatsConfig({ ...statsConfig, stat3_suffix: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">PREVIEW</label>
                          <div className="py-2.5 text-pink-400 font-extrabold italic text-sm">{statsConfig.stat3_val}{statsConfig.stat3_suffix}</div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-450 uppercase">LABEL / VALUE DESCRIPTION</label>
                        <input
                          type="text"
                          value={statsConfig.stat3_label}
                          onChange={e => setStatsConfig({ ...statsConfig, stat3_label: e.target.value })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4.5 bg-purple-600 hover:bg-purple-550 text-white font-sans uppercase text-[10px] font-black tracking-widest rounded-xl transition-all cursor-pointer shadow-lg"
                    >
                      Save Counters Parameters
                    </button>
                  </form>
                </div>
              )}

              {/* SUBVIEW 2: ABOUT PAGE STORY & BLOCKS */}
              {customizerSubTab === 'about' && (
                <div className="pt-4 max-w-3xl">
                  <form onSubmit={handleSaveAboutConfig} className="bg-slate-950/75 p-6 rounded-[2rem] border border-white/[0.04] space-y-6 text-xs font-semibold">
                    <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-pink-400 block">ABOUT STORY DESCRIPTION CUSTOMIZER</span>
                    
                    <div className="space-y-4 border-b border-white/[0.03] pb-6">
                      <h5 className="text-[10px] font-bold text-white uppercase italic">Section Headline Story</h5>
                      
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-450 uppercase">STORY TITLE</label>
                        <input
                          type="text"
                          value={aboutConfig.storyTitle}
                          onChange={e => setAboutConfig({ ...aboutConfig, storyTitle: e.target.value })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-450 uppercase">STORY DETAIL BODY TEXT</label>
                        <textarea
                          rows={4}
                          value={aboutConfig.storySubtitle}
                          onChange={e => setAboutConfig({ ...aboutConfig, storySubtitle: e.target.value })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white resize-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 border-b border-white/[0.03] pb-6">
                      <h5 className="text-[10px] font-bold text-white uppercase italic">Mission Core Card</h5>
                      
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-455 uppercase">MISSION TITLE</label>
                        <input
                          type="text"
                          value={aboutConfig.missionTitle}
                          onChange={e => setAboutConfig({ ...aboutConfig, missionTitle: e.target.value })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-455 uppercase">MISSION BODY</label>
                        <textarea
                          rows={3}
                          value={aboutConfig.missionDesc}
                          onChange={e => setAboutConfig({ ...aboutConfig, missionDesc: e.target.value })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2.5 px-3 focus:border-indigo-500 outline-none text-white resize-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h5 className="text-[10px] font-bold text-white uppercase italic">Vision Core Card</h5>
                      
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-455 uppercase">VISION TITLE</label>
                        <input
                          type="text"
                          value={aboutConfig.visionTitle}
                          onChange={e => setAboutConfig({ ...aboutConfig, visionTitle: e.target.value })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-455 uppercase">VISION BODY</label>
                        <textarea
                          rows={3}
                          value={aboutConfig.visionDesc}
                          onChange={e => setAboutConfig({ ...aboutConfig, visionDesc: e.target.value })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2.5 px-3 focus:border-indigo-500 outline-none text-white resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4.5 bg-pink-600 hover:bg-pink-550 text-white font-sans uppercase text-[10px] font-black tracking-widest rounded-xl transition-all cursor-pointer shadow-lg"
                    >
                      Save About Story Parameters
                    </button>
                  </form>
                </div>
              )}

              {/* SUBVIEW: INNER PAGES & CTAS CUSTOMIZER */}
              {customizerSubTab === 'pages' && (
                <div className="pt-4 max-w-4xl">
                  <form onSubmit={handleSavePagesConfig} className="bg-slate-950/75 p-8 rounded-[2.5rem] border border-white/[0.04] space-y-8 text-xs font-semibold">
                    <div className="flex items-center gap-3 border-b border-indigo-950/40 pb-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                      <div>
                        <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-indigo-400">
                          INNER PAGES & CTAS CONTENT CUSTOMIZER
                        </h4>
                        <p className="text-[10px] text-slate-500 font-semibold italic mt-0.5">
                          Configure headers, subtitles, capsule tags, and click links across your inner agency pages.
                        </p>
                      </div>
                    </div>

                    {/* SECTION 1: SERVICES PAGE */}
                    <div className="space-y-4 border-b border-white/[0.03] pb-6">
                      <h5 className="text-[11px] font-black tracking-wider text-white uppercase italic text-indigo-400 flex items-center gap-2">
                        <span>//</span> 01. Services Page Settings
                      </h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">SERVICES CAPSULE TAG</label>
                          <input
                            type="text"
                            value={pagesConfig.servicesCapsule}
                            onChange={e => setPagesConfig({ ...pagesConfig, servicesCapsule: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">SERVICES MAIN TITLE</label>
                          <input
                            type="text"
                            value={pagesConfig.servicesTitle}
                            onChange={e => setPagesConfig({ ...pagesConfig, servicesTitle: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white italic uppercase"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-455 uppercase">SERVICES SUB-HEADING DESCRIPTION</label>
                        <textarea
                          rows={2}
                          value={pagesConfig.servicesSubtitle}
                          onChange={e => setPagesConfig({ ...pagesConfig, servicesSubtitle: e.target.value })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2.5 px-3 focus:border-indigo-500 outline-none text-white resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">SERVICES BUTTON LABEL</label>
                          <input
                            type="text"
                            value={pagesConfig.servicesCtaText}
                            onChange={e => setPagesConfig({ ...pagesConfig, servicesCtaText: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">SERVICES BUTTON ACTION LINK (URL path)</label>
                          <input
                            type="text"
                            value={pagesConfig.servicesCtaLink}
                            onChange={e => setPagesConfig({ ...pagesConfig, servicesCtaLink: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: PORTFOLIO PAGE */}
                    <div className="space-y-4 border-b border-white/[0.03] pb-6">
                      <h5 className="text-[11px] font-black tracking-wider text-white uppercase italic text-pink-400 flex items-center gap-2">
                        <span>//</span> 02. Portfolio Page Settings
                      </h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">PORTFOLIO CAPSULE TAG</label>
                          <input
                            type="text"
                            value={pagesConfig.portfolioCapsule}
                            onChange={e => setPagesConfig({ ...pagesConfig, portfolioCapsule: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">PORTFOLIO MAIN TITLE</label>
                          <input
                            type="text"
                            value={pagesConfig.portfolioTitle}
                            onChange={e => setPagesConfig({ ...pagesConfig, portfolioTitle: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white italic uppercase"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-455 uppercase">PORTFOLIO SUB-HEADING DESCRIPTION</label>
                        <textarea
                          rows={2}
                          value={pagesConfig.portfolioSubtitle}
                          onChange={e => setPagesConfig({ ...pagesConfig, portfolioSubtitle: e.target.value })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2.5 px-3 focus:border-indigo-500 outline-none text-white resize-none"
                        />
                      </div>
                    </div>

                    {/* SECTION 3: PRICING PAGE */}
                    <div className="space-y-4 border-b border-white/[0.03] pb-6">
                      <h5 className="text-[11px] font-black tracking-wider text-white uppercase italic text-purple-400 flex items-center gap-2">
                        <span>//</span> 03. Pricing Page Settings
                      </h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">PRICING CAPSULE TAG</label>
                          <input
                            type="text"
                            value={pagesConfig.pricingCapsule}
                            onChange={e => setPagesConfig({ ...pagesConfig, pricingCapsule: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">PRICING MAIN TITLE</label>
                          <input
                            type="text"
                            value={pagesConfig.pricingTitle}
                            onChange={e => setPagesConfig({ ...pagesConfig, pricingTitle: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white italic uppercase"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-455 uppercase">PRICING SUB-HEADING DESCRIPTION</label>
                        <textarea
                          rows={2}
                          value={pagesConfig.pricingSubtitle}
                          onChange={e => setPagesConfig({ ...pagesConfig, pricingSubtitle: e.target.value })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2.5 px-3 focus:border-indigo-500 outline-none text-white resize-none"
                        />
                      </div>
                    </div>

                    {/* SECTION 4: BLOG PAGE */}
                    <div className="space-y-4 border-b border-white/[0.03] pb-6">
                      <h5 className="text-[11px] font-black tracking-wider text-white uppercase italic text-indigo-400 flex items-center gap-2">
                        <span>//</span> 04. Blog Editorial Page Settings
                      </h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">BLOG CAPSULE TAG</label>
                          <input
                            type="text"
                            value={pagesConfig.blogCapsule}
                            onChange={e => setPagesConfig({ ...pagesConfig, blogCapsule: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">BLOG MAIN TITLE</label>
                          <input
                            type="text"
                            value={pagesConfig.blogTitle}
                            onChange={e => setPagesConfig({ ...pagesConfig, blogTitle: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white italic uppercase"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-455 uppercase">BLOG SUB-HEADING DESCRIPTION</label>
                        <textarea
                          rows={2}
                          value={pagesConfig.blogSubtitle}
                          onChange={e => setPagesConfig({ ...pagesConfig, blogSubtitle: e.target.value })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2.5 px-3 focus:border-indigo-500 outline-none text-white resize-none"
                        />
                      </div>
                    </div>

                    {/* SECTION 5: CONTACT PAGE */}
                    <div className="space-y-4 border-b border-white/[0.03] pb-6">
                      <h5 className="text-[11px] font-black tracking-wider text-white uppercase italic text-emerald-400 flex items-center gap-2">
                        <span>//</span> 05. Contact Strategic Page Settings
                      </h5>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">CONTACT CAPSULE TAG</label>
                          <input
                            type="text"
                            value={pagesConfig.contactCapsule}
                            onChange={e => setPagesConfig({ ...pagesConfig, contactCapsule: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-455 uppercase">CONTACT MAIN TITLE</label>
                          <input
                            type="text"
                            value={pagesConfig.contactTitle}
                            onChange={e => setPagesConfig({ ...pagesConfig, contactTitle: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white italic uppercase"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-455 uppercase">CONTACT SUB-HEADING DESCRIPTION</label>
                        <textarea
                          rows={2}
                          value={pagesConfig.contactSubtitle}
                          onChange={e => setPagesConfig({ ...pagesConfig, contactSubtitle: e.target.value })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2.5 px-3 focus:border-indigo-500 outline-none text-white resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">FORM OUTLINE HEADER</label>
                          <input
                            type="text"
                            value={pagesConfig.contactFormHeading}
                            onChange={e => setPagesConfig({ ...pagesConfig, contactFormHeading: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">FORM SUBMIT BUTTON TEXT</label>
                          <input
                            type="text"
                            value={pagesConfig.contactButtonText}
                            onChange={e => setPagesConfig({ ...pagesConfig, contactButtonText: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* SECTION 6: LANDING HERO CTA REDIRECT ROUTING PATHS */}
                    <div className="space-y-4">
                      <h5 className="text-[11px] font-black tracking-wider text-rose-500 uppercase italic flex items-center gap-2">
                        <span>//</span> 06. Navigation Action Routes Link Settings
                      </h5>
                      <p className="text-[9px] text-slate-500 italic">Verify spelling to route users to separate pages within your agency landscape (e.g., /contact, /pricing, /portfolios).</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">HERO PRIMARY CTA DEPARTURE URL</label>
                          <input
                            type="text"
                            value={pagesConfig.heroCtaPrimaryLink}
                            onChange={e => setPagesConfig({ ...pagesConfig, heroCtaPrimaryLink: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">HERO SECONDARY CTA DEPARTURE URL</label>
                          <input
                            type="text"
                            value={pagesConfig.heroCtaSecondaryLink}
                            onChange={e => setPagesConfig({ ...pagesConfig, heroCtaSecondaryLink: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-455 uppercase">SERVICES HERO DIRECT ENTRY URL</label>
                          <input
                            type="text"
                            value={pagesConfig.servicesCtaLink}
                            onChange={e => setPagesConfig({ ...pagesConfig, servicesCtaLink: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 hover:opacity-90 text-white font-sans uppercase text-[10px] font-black tracking-widest rounded-xl transition-all cursor-pointer shadow-lg"
                    >
                      Publish All Inner Pages Content & Link Parameters
                    </button>
                  </form>
                </div>
              )}

              {/* SUBVIEW 3: TEAM & CHRONOLOGY TIMELINE */}
              {customizerSubTab === 'team_chrono' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                  
                  {/* Team Members List Editor */}
                  <div className="lg:col-span-6 space-y-8">
                    
                    {/* 👑 EXECUTIVE LEADERSHIP FORM (GLOBAL SYNC) */}
                    <div className="bg-gradient-to-br from-indigo-950/20 to-slate-950/80 p-6 rounded-[2rem] border border-indigo-500/10 space-y-4 text-xs font-semibold relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-10 -mt-10" />
                      
                      <div className="flex items-center justify-between border-b border-white/[0.04] pb-3">
                        <div>
                          <span className="text-[9px] font-mono font-black uppercase text-indigo-400 block tracking-widest">GLOBAL ADMINISTRATIVE TARGET</span>
                          <h4 className="text-sm font-black font-sans text-white uppercase tracking-tight flex items-center gap-1.5 mt-0.5">
                            👑 Executive Leadership Profile
                          </h4>
                        </div>
                        <span className="text-[8px] px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300 font-mono tracking-widest font-bold">CEO / FOUNDER</span>
                      </div>

                      <form onSubmit={handleSaveCeoProfile} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[8px] font-mono text-slate-450 uppercase">LEADER FULL NAME *</label>
                            <input
                              type="text"
                              required
                              value={ceoProfile.name}
                              onChange={e => setCeoProfile({ ...ceoProfile, name: e.target.value })}
                              className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2.5 px-3 focus:border-indigo-500 outline-none text-white font-bold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-mono text-slate-450 uppercase">DESIGNATION / POSITION *</label>
                            <input
                              type="text"
                              required
                              value={ceoProfile.role}
                              onChange={e => setCeoProfile({ ...ceoProfile, role: e.target.value })}
                              className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2.5 px-3 focus:border-indigo-500 outline-none text-white font-bold"
                            />
                          </div>
                        </div>

                        {/* File Upload Selector */}
                        <div className="p-3 bg-[#020208] border border-white/[0.04] rounded-xl flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/[0.08] overflow-hidden flex items-center justify-center shrink-0 relative group">
                            {ceoProfile.image ? (
                              <img src={ceoProfile.image || undefined} alt="CEO Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] text-slate-500 font-mono">No Pic</span>
                            )}
                          </div>
                          <div className="flex-1 space-y-1.5">
                            <label className="text-[8px] font-mono text-slate-450 uppercase block">Portrait Picture (Base64 File Uploader)</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={e => handleImageFileChange(e, true)}
                                className="hidden"
                                id="ceo-photo-file-picker"
                              />
                              <label
                                htmlFor="ceo-photo-file-picker"
                                className="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-600 text-white text-[9px] font-mono rounded-lg transition-colors cursor-pointer block text-center"
                              >
                                SELECT IMAGE FILE...
                              </label>
                              <span className="text-[8px] font-mono text-slate-500">Max 1.2MB limit</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-455 uppercase font-semibold">Alternatively: Direct Image URL</label>
                          <input
                            type="text"
                            placeholder="Or paste self-hosting portrait URL link..."
                            value={ceoProfile.image}
                            onChange={e => setCeoProfile({ ...ceoProfile, image: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-455 uppercase font-semibold">CEO Biography / Professional Vision Statements</label>
                          <textarea
                            rows={2}
                            required
                            placeholder="Leads creative vision, standards, and customer growth codes..."
                            value={ceoProfile.exp}
                            onChange={e => setCeoProfile({ ...ceoProfile, exp: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white resize-none font-sans"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-3.5 bg-gradient-to-r from-indigo-650 to-indigo-550 hover:from-indigo-600 hover:to-indigo-500 text-white font-sans uppercase text-[9px] font-black tracking-widest rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-500/10 flex items-center justify-center gap-2"
                        >
                          Update Executive Leadership Globally
                        </button>
                      </form>
                    </div>

                    {/* Standard Team Member Register Form */}
                    <form onSubmit={handleAddTeamMember} className="bg-slate-950/75 p-6 rounded-[2rem] border border-white/[0.04] space-y-4 text-xs font-semibold">
                      <span className="text-[9px] font-mono font-black uppercase text-indigo-400 block tracking-widest border-b border-white/[0.03] pb-2">ENROLL NEW TEAM ASSOCIATE / OFFICER</span>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">OFFICER FULL NAME *</label>
                          <input
                            type="text"
                            required
                            placeholder="Julian Sterling"
                            value={newTeamMember.name}
                            onChange={e => setNewTeamMember({ ...newTeamMember, name: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2.5 px-3 focus:border-indigo-500 outline-none text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">ROLE / DESIGNATION *</label>
                          <input
                            type="text"
                            required
                            placeholder="Chief Architect"
                            value={newTeamMember.role}
                            onChange={e => setNewTeamMember({ ...newTeamMember, role: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2.5 px-3 focus:border-indigo-500 outline-none text-white"
                          />
                        </div>
                      </div>

                      {/* File Upload Selector for team member */}
                      <div className="p-3 bg-[#020208] border border-white/[0.04] rounded-xl flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/[0.08] overflow-hidden flex items-center justify-center shrink-0 relative">
                          {newTeamMember.image ? (
                            <img src={newTeamMember.image || undefined} alt="Officer Preview" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[9px] text-slate-500 font-mono">No Pic</span>
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase block">Portrait Picture Upload File</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => handleImageFileChange(e, false)}
                              className="hidden"
                              id="officer-photo-file-picker"
                            />
                            <label
                              htmlFor="officer-photo-file-picker"
                              className="px-3 py-1 bg-white/[0.04] hover:bg-white/[0.08] text-white text-[9px] font-mono border border-white/[0.08] rounded-lg transition-colors cursor-pointer block text-center"
                            >
                              CHOOSE IMAGE FILE...
                            </label>
                            <span className="text-[7.5px] font-mono text-slate-500">Max 1.2MB</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-455 uppercase font-black font-semibold">BIO INITIAL (OPTIONAL)</label>
                          <input
                            type="text"
                            placeholder="Leave blank for auto-gen"
                            value={newTeamMember.initial}
                            onChange={e => setNewTeamMember({ ...newTeamMember, initial: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-455 uppercase font-black font-semibold">PORTRAIT IMAGE URL (OPTIONAL)</label>
                          <input
                            type="text"
                            placeholder="Or paste image URL link..."
                            value={newTeamMember.image || ''}
                            onChange={e => setNewTeamMember({ ...newTeamMember, image: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-455 uppercase font-semibold">EXP / PROFESSIONAL CHRONOLOGY DESCRIPTION</label>
                        <textarea
                          rows={2}
                          placeholder="Experienced growth specialist. Sets up profitable scales..."
                          value={newTeamMember.exp}
                          onChange={e => setNewTeamMember({ ...newTeamMember, exp: e.target.value })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2.5 px-3 focus:border-indigo-500 outline-none text-white resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-550 text-white font-sans uppercase text-[9px] font-black tracking-widest rounded-xl transition-all cursor-pointer shadow-lg"
                      >
                        Enroll Executive Member
                      </button>
                    </form>

                    {/* Team List Preview */}
                    <div className="space-y-3">
                      <h5 className="text-[10px] font-black uppercase text-white tracking-widest font-mono italic">ACTIVE SEEDED TEAM DIRECTORY</h5>
                      <div className="space-y-2">
                        {customTeam.map(t => (
                          <div key={t.id} className="p-4 bg-[#03030c] border border-white/[0.03] rounded-2xl flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-black text-sm border border-indigo-500/20 overflow-hidden shrink-0">
                                {t.image || t.avatar ? (
                                  <img src={(t.image || t.avatar) || undefined} alt={t.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                                ) : (
                                  t.initial
                                )}
                              </div>
                              <div>
                                <h6 className="font-extrabold text-white text-xs flex items-center gap-1.5">
                                  {t.name}
                                  {(t.isCEO || t.id === 'ceo_member') && (
                                    <span className="text-[7.5px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/10 uppercase tracking-widest">CEO</span>
                                  )}
                                </h6>
                                <p className="text-[9px] font-mono text-indigo-400 uppercase tracking-widest font-bold">{t.role}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteTeamMember(t.id)}
                              className="text-slate-500 hover:text-rose-500 transition-colors p-2 cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Chronology Milestones Timeline */}
                  <div className="lg:col-span-6 space-y-6">
                    <form onSubmit={handleAddMilestone} className="bg-slate-950/75 p-6 rounded-[2rem] border border-white/[0.04] space-y-4 text-xs font-semibold">
                      <span className="text-[9px] font-mono font-black uppercase text-pink-500 block">REGISTER VELOCITY CHRONOLOGY MILESTONE</span>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">YEAR *</label>
                          <input
                            type="text"
                            required
                            placeholder="E.g. 2026"
                            value={newMilestone.year}
                            onChange={e => setNewMilestone({ ...newMilestone, year: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white opacity-90"
                          />
                        </div>
                        <div className="space-y-1 col-span-2">
                          <label className="text-[8px] font-mono text-slate-450 uppercase">MILESTONE EVENT HEADER *</label>
                          <input
                            type="text"
                            required
                            placeholder="E.g. Zenith Workspace IPO"
                            value={newMilestone.title}
                            onChange={e => setNewMilestone({ ...newMilestone, title: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-455 uppercase font-black">MILESTONE SUMMARY DESCRIPTION</label>
                        <textarea
                          rows={2}
                          placeholder="Briefly state milestones scaled..."
                          value={newMilestone.desc}
                          onChange={e => setNewMilestone({ ...newMilestone, desc: e.target.value })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2.5 px-3 focus:border-indigo-500 outline-none text-white resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-pink-600 hover:bg-pink-550 text-white font-sans uppercase text-[9px] font-black tracking-widest rounded-xl transition-all cursor-pointer shadow-lg"
                      >
                        Enroll Milestone Chrono Card
                      </button>
                    </form>

                    {/* Timeline Preview */}
                    <div className="space-y-3">
                      <h5 className="text-[10px] font-black uppercase text-white tracking-widest font-mono italic">ACTIVE HISTORIC TIMELINE</h5>
                      <div className="space-y-2">
                        {customMilestones.map(m => (
                          <div key={m.id} className="p-4 bg-[#03030c] border border-white/[0.03] rounded-2xl flex items-center justify-between gap-4">
                            <div>
                              <div className="text-[10px] font-mono text-pink-500 font-black">{m.year}</div>
                              <h6 className="font-extrabold text-white text-xs uppercase mt-0.5">{m.title}</h6>
                              <p className="text-slate-400 text-[10px] italic">{m.desc}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteMilestone(m.id)}
                              className="text-slate-500 hover:text-rose-500 transition-colors p-2 cursor-pointer"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBVIEW 4: SLA PRICING PLAN PACKAGES */}
              {customizerSubTab === 'pricing' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                  {/* Add Plan Form */}
                  <form onSubmit={handleAddPlan} className="lg:col-span-5 bg-slate-950/75 p-6 rounded-[2rem] border border-white/[0.04] space-y-4 text-xs font-semibold h-fit">
                    <span className="text-[9px] font-mono font-black uppercase text-purple-400 block">CREATE PRICING RETAINERS</span>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-450 uppercase">PLAN RETAINER NAME *</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g. Enterprise Scaling Engine"
                        value={newPlan.name}
                        onChange={e => setNewPlan({ ...newPlan, name: e.target.value })}
                        className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2.5 px-3 focus:border-indigo-550 outline-none text-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-450 uppercase">COST / PRICE *</label>
                        <input
                          type="text"
                          required
                          placeholder="E.g. $4,550"
                          value={newPlan.price}
                          onChange={e => setNewPlan({ ...newPlan, price: e.target.value })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2.5 px-3 focus:border-indigo-500 outline-none text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-455 uppercase">BILLING PERIOD</label>
                        <select
                          value={newPlan.period}
                          onChange={e => setNewPlan({ ...newPlan, period: e.target.value })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white appearance-none"
                        >
                          <option value="monthly">monthly</option>
                          <option value="quarterly">quarterly</option>
                          <option value="one-time">one-time</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-455 uppercase font-semibold">PLAN SUMMARY DETAILS</label>
                      <input
                        type="text"
                        placeholder=" Coveted scale package category dominance"
                        value={newPlan.desc}
                        onChange={e => setNewPlan({ ...newPlan, desc: e.target.value })}
                        className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2.5 px-3 focus:border-indigo-550 outline-none text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-455 uppercase font-black">FEATURES CHECKLIST (SEPARATED BY COMMAS) *</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Feature One,Feature Two,Feature Three..."
                        value={newPlan.features}
                        onChange={e => setNewPlan({ ...newPlan, features: e.target.value })}
                        className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2.5 px-3 focus:border-indigo-500 outline-none text-white font-semibold resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="plan_popular"
                        checked={newPlan.popular}
                        onChange={e => setNewPlan({ ...newPlan, popular: e.target.checked })}
                        className="w-4 h-4 rounded border-white/[0.08] bg-[#03030c]"
                      />
                      <label htmlFor="plan_popular" className="text-[10px] font-mono text-slate-400 font-extrabold uppercase select-none">MARK AS POPULAR (ACCENT HIGHLIGHT)</label>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-purple-600 hover:bg-purple-550 text-white font-sans uppercase text-[9px] font-black tracking-widest rounded-xl transition-all cursor-pointer shadow-lg"
                    >
                      Publish Retainer SLA Plan
                    </button>
                  </form>

                  {/* Plans list */}
                  <div className="lg:col-span-7 space-y-4">
                    <h5 className="text-[10px] font-black uppercase text-white tracking-widest font-mono italic">ACTIVE RETAINER PLAN CARDS</h5>
                    <div className="grid grid-cols-1 gap-4">
                      {customPricing.map(p => (
                        <div key={p.id} className="p-6 bg-[#03030c] border border-white/[0.03] rounded-3xl relative flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h6 className="font-extrabold uppercase text-white text-sm">{p.name}</h6>
                              {p.popular && (
                                <span className="bg-gradient-to-r from-indigo-500 to-pink-500 text-[7px] text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">Popular</span>
                              )}
                            </div>
                            <p className="text-slate-400 text-xs italic">"{p.desc}"</p>
                            <div className="text-indigo-400 font-bold font-mono text-xs">{p.price} <span className="text-slate-500">/ {p.period}</span></div>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {(typeof p.features === 'string' ? p.features.split(',') : Array.isArray(p.features) ? p.features : []).map((f: string, i: number) => (
                                <span key={i} className="text-[7px] font-mono bg-white/[0.03] text-slate-400 px-2 py-0.5 rounded border border-white/[0.05]">{f}</span>
                              ))}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeletePlan(p.id)}
                            className="text-slate-500 hover:text-rose-500 transition-colors p-2 cursor-pointer mt-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBVIEW: CUSTOMER TESTIMONIALS */}
              {customizerSubTab === 'reviews' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                  {/* Add Review Form */}
                  <form onSubmit={handleAddReview} className="lg:col-span-5 bg-slate-950/75 p-6 rounded-[2rem] border border-white/[0.04] space-y-4 text-xs font-semibold h-fit">
                    <span className="text-[9px] font-mono font-black uppercase text-pink-500 block">CREATE CUSTOMER TESTIMONIAL</span>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-455 uppercase">CUSTOMER NAME *</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g. নুসরাত জাহান"
                        value={newReview.author}
                        onChange={e => setNewReview({ ...newReview, author: e.target.value })}
                        className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-455 uppercase">DESIGNATION / ROLE *</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g. ই-কমার্স ডিরেক্টর"
                        value={newReview.role}
                        onChange={e => setNewReview({ ...newReview, role: e.target.value })}
                        className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-455 uppercase">COMPANY / ORIGIN *</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g. প্রতিষ্ঠাতা, ঢাকা ফ্যাশন হাব"
                        value={newReview.origin}
                        onChange={e => setNewReview({ ...newReview, origin: e.target.value })}
                        className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-455 uppercase">PLATFORM CHANNEL</label>
                        <select
                          value={newReview.platform}
                          onChange={e => setNewReview({ ...newReview, platform: e.target.value })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white font-semibold"
                        >
                          <option value="google">Google Reviews</option>
                          <option value="facebook">Facebook Reviews</option>
                          <option value="direct">Direct Website Client</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] font-mono text-slate-455 uppercase">STAR RATING</label>
                        <select
                          value={newReview.rating}
                          onChange={e => setNewReview({ ...newReview, rating: Number(e.target.value) })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white font-semibold"
                        >
                          <option value={5}>5 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={3}>3 Stars</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer Photo URL */}
                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-455 uppercase">CUSTOMER PHOTO URL</label>
                      <input
                        type="text"
                        placeholder="E.g. https://images.unsplash.com/..."
                        value={newReview.avatar}
                        onChange={e => setNewReview({ ...newReview, avatar: e.target.value })}
                        className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white font-semibold"
                      />
                      <p className="text-[9px] text-slate-500 italic">Leave empty to use a standard corporate user avatar placeholder.</p>
                    </div>

                    {/* Quick photo presets */}
                    <div className="space-y-1 pb-1">
                      <label className="text-[7.5px] font-mono text-indigo-400 uppercase">QUICK PHOTO PRESETS</label>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {[
                          { name: 'Female 1', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80' },
                          { name: 'Male 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80' },
                          { name: 'Male 2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80' },
                          { name: 'Female 2', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80' }
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setNewReview({ ...newReview, avatar: preset.url })}
                            className="px-2.5 py-1 bg-white/[0.02] border border-white/[0.05] hover:border-indigo-500 rounded text-[9px] hover:text-white transition-all cursor-pointer"
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-455 uppercase">REVIEW STORY CONTENT *</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="ভীষণ দক্ষ ও অত্যন্ত প্রিমিয়াম টিম..."
                        value={newReview.text}
                        onChange={e => setNewReview({ ...newReview, text: e.target.value })}
                        className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-550 outline-none text-white resize-none font-semibold"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-pink-650 hover:bg-pink-600 text-white font-sans uppercase text-[9px] font-black tracking-widest rounded-xl transition-all cursor-pointer shadow-lg active:scale-[0.99]"
                    >
                      Publish Custom Review
                    </button>
                  </form>

                  {/* Reviews list Preview */}
                  <div className="lg:col-span-7 space-y-4">
                    <h5 className="text-[10px] font-black uppercase text-white tracking-widest font-mono italic">ACTIVE CUSTOMER TESTIMONIALS</h5>
                    <div className="space-y-3 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                      {customReviews.length === 0 && (
                        <p className="text-slate-500 italic text-center py-8">No custom reviews created yet. Falling back to default list on the homepage.</p>
                      )}
                      {customReviews.map(r => (
                        <div key={r.id} className="p-4 bg-[#03030c] border border-white/[0.03] rounded-2xl flex justify-between items-start gap-4 hover:border-white/[0.07] transition-all">
                          <div className="flex gap-3">
                            <img
                              src={r.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80"}
                              alt={r.author}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/[0.1]"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h6 className="font-extrabold text-white text-xs">{r.author}</h6>
                                <span className="px-2 py-0.5 rounded text-[8px] font-mono bg-indigo-950/40 text-indigo-300 border border-indigo-900/40 capitalize">
                                  {r.platform || 'direct'}
                                </span>
                              </div>
                              <p className="text-slate-450 text-[9px] font-semibold mt-0.5">{r.role} • {r.origin}</p>
                              <p className="text-slate-300 text-[10px] italic mt-2 leading-relaxed font-medium">"{r.text}"</p>
                              <div className="flex items-center mt-1.5 gap-0.5">
                                {[...Array(r.rating || 5)].map((_, i) => (
                                  <Star key={i} size={10} className="fill-yellow-500 text-yellow-500" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(r.id)}
                            className="text-slate-500 hover:text-rose-500 transition-colors p-2 cursor-pointer shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBVIEW 5: CLIENT FAQS ACCORDION */}
              {customizerSubTab === 'faqs' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                  {/* Add FAQ Form */}
                  <form onSubmit={handleAddFaq} className="lg:col-span-5 bg-slate-950/75 p-6 rounded-[2rem] border border-white/[0.04] space-y-4 text-xs font-semibold h-fit">
                    <span className="text-[9px] font-mono font-black uppercase text-pink-500 block">CREATE ACCORDION WORKBOOK</span>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-455 uppercase">QUESTION HEADER *</label>
                      <input
                        type="text"
                        required
                        placeholder="E.g. What is your typical ROAS average?"
                        value={newFaq.q}
                        onChange={e => setNewFaq({ ...newFaq, q: e.target.value })}
                        className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-500 outline-none text-white font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[8px] font-mono text-slate-455 uppercase">ANSWER BODY STUDY *</label>
                      <textarea
                        rows={4}
                        required
                        placeholder="Across active campaigns, we scale averages securely..."
                        value={newFaq.a}
                        onChange={e => setNewFaq({ ...newFaq, a: e.target.value })}
                        className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-3 px-4 focus:border-indigo-550 outline-none text-white resize-none font-semibold"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 bg-pink-650 hover:bg-pink-600 text-white font-sans uppercase text-[9px] font-black tracking-widest rounded-xl transition-all cursor-pointer shadow-lg animate-pulse"
                    >
                      Publish FAQ Item
                    </button>
                  </form>

                  {/* FAQs list Preview */}
                  <div className="lg:col-span-7 space-y-4">
                    <h5 className="text-[10px] font-black uppercase text-white tracking-widest font-mono italic">ACTIVE FREQUENTLY ASKED QUESTIONS</h5>
                    <div className="space-y-3">
                      {customFaqs.map(f => (
                        <div key={f.id} className="p-4 bg-[#03030c] border border-white/[0.03] rounded-2xl flex justify-between items-start gap-4">
                          <div>
                            <h6 className="font-extrabold text-white text-xs">{f.q}</h6>
                            <p className="text-slate-400 text-[10px] italic mt-1 leading-relaxed">"{f.a}"</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteFaq(f.id)}
                            className="text-slate-500 hover:text-rose-500 transition-colors p-2 cursor-pointer shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* SUBVIEW 6: FOOTER TERMS & CONDITIONS / PRIVACY LAW COMPLIANCE EDITOR */}
              {customizerSubTab === 'footer_terms' && (
                <div className="max-w-4xl pt-4">
                  <form onSubmit={handleSaveTermsConfig} className="bg-slate-950/75 p-8 rounded-[2rem] border border-red-900/25 shadow-2xl space-y-6 text-xs font-semibold">
                    <div className="flex items-center gap-3 border-b border-red-950/40 pb-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                      <div>
                        <h4 className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-red-500">
                          LEGAL & PRIVACY DISCLOSURE SETTINGS
                        </h4>
                        <p className="text-[10px] text-slate-505 font-semibold italic mt-0.5">
                          Configure terms of service SLAs and encryption agreements displayed dynamically in the bottom footer.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Terms section */}
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-455 uppercase">TERMS OF SERVICE MODAL TITLE</label>
                          <input
                            type="text"
                            value={termsConfig.termsTitle}
                            onChange={e => setTermsConfig({ ...termsConfig, termsTitle: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] focus:border-red-500 rounded-xl py-2.5 px-3.5 outline-none text-white font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-455 uppercase">TERMS & SLA MAIN CODES</label>
                          <textarea
                            rows={8}
                            value={termsConfig.termsBody}
                            onChange={e => setTermsConfig({ ...termsConfig, termsBody: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] focus:border-red-500 rounded-xl py-3 px-4 outline-none text-white font-mono text-[11px] leading-relaxed resize-none"
                          />
                        </div>
                      </div>

                      {/* Privacy section */}
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-455 uppercase">PRIVACY DISCLOSURE MODAL TITLE</label>
                          <input
                            type="text"
                            value={termsConfig.privacyTitle}
                            onChange={e => setTermsConfig({ ...termsConfig, privacyTitle: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] focus:border-red-500 rounded-xl py-2.5 px-3.5 outline-none text-white font-medium"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-455 uppercase">DATA ENCRYPTION STATEMENT</label>
                          <textarea
                            rows={8}
                            value={termsConfig.privacyBody}
                            onChange={e => setTermsConfig({ ...termsConfig, privacyBody: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] focus:border-red-500 rounded-xl py-3 px-4 outline-none text-white font-mono text-[11px] leading-relaxed resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4.5 bg-red-900 hover:bg-red-850 text-white font-sans uppercase text-[10px] font-black tracking-widest rounded-xl transition-all cursor-pointer shadow-xl shadow-red-900/30"
                    >
                      Save and Publish Legal Disclosures
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
