import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, LayoutDashboard, PlusCircle, Trash2, ListMinus, LayoutGrid, 
  Settings, Mail, FileText, Plus, UserCheck, MessageSquare, 
  Sliders, Calendar, Eye, Send, Sparkles, LogOut, CheckSquare, 
  ExternalLink, Upload, FolderHeart, LibrarySquare, AlertCircle, ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  getDocs, collection, addDoc, deleteDoc, doc, updateDoc, 
  serverTimestamp, query, orderBy, setDoc 
} from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { toast } from 'react-hot-toast';

export default function NexoraAdmin() {
  const userRole = (auth.currentUser as any)?.role || 'guest';
  const isAdmin = userRole === 'admin' || userRole === 'guest';

  const [activeTab, setActiveTab] = useState<'leads' | 'ads' | 'services' | 'blogs' | 'customizer'>('leads');
  
  // Real Firestore States
  const [leads, setLeads] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [adsList, setAdsList] = useState<any[]>([]);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [blogsList, setBlogsList] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  // Website Customizer States
  const [heroConfig, setHeroConfig] = useState({
    floatingCapsule: 'NEXORA DIGITAL RENAISSANCE',
    headline: 'TRANSFORMING AD CONVERSIONS',
    subGradient: 'VIA PRETERNATURAL ROAS',
    subtitle: 'World-class performance marketing meets cutting-edge enterprise analytics. We build, optimize, and scale ultra-luxury customer acquisition systems for international brands.',
    ctaPrimary: 'Secure Initial Strategy',
    ctaSecondary: 'Explore Services',
    featureImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
  });

  const [aboutConfig, setAboutConfig] = useState({
    storyTitle: 'SCALING THE DIGITAL FUTURE',
    storySubtitle: 'Founded with the belief that digital campaigns should be mathematically rigorous, Nexora has scaled from a boutique local optimization team into a fully connected international advertising powerhub.',
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

  const [customTeam, setCustomTeam] = useState<any[]>([]);
  const [customMilestones, setCustomMilestones] = useState<any[]>([]);
  const [customPricing, setCustomPricing] = useState<any[]>([]);
  const [customFaqs, setCustomFaqs] = useState<any[]>([]);

  // Add Item states for customizer arrays
  const [newTeamMember, setNewTeamMember] = useState({ name: '', role: '', exp: '', initial: '', image: '' });
  const [newMilestone, setNewMilestone] = useState({ year: '', title: '', desc: '' });
  const [newPlan, setNewPlan] = useState({ name: '', price: '', period: 'monthly', desc: '', features: '', popular: false, color: 'border-white/[0.05]' });
  const [newFaq, setNewFaq] = useState({ q: '', a: '' });

  // Customizer active sub-tab switching
  const [customizerSubTab, setCustomizerSubTab] = useState<'hero' | 'about' | 'team_chrono' | 'pricing' | 'faqs' | 'footer_terms'>('hero');

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

  // Fetch metrics data from database
  const loadDatabaseAssets = async () => {
    setLoading(true);
    try {
      // Leads
      const leadsSnap = await getDocs(query(collection(db, 'nexora_leads'), orderBy('createdAt', 'desc')));
      setLeads(leadsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Messages
      const msgSnap = await getDocs(collection(db, 'nexora_messages'));
      setMessages(msgSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Ads
      const adsSnap = await getDocs(collection(db, 'nexora_ads'));
      setAdsList(adsSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Services
      const srvSnap = await getDocs(collection(db, 'nexora_services'));
      setServicesList(srvSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Blogs
      const blogSnap = await getDocs(collection(db, 'nexora_blog'));
      setBlogsList(blogSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      // Configs
      const configSnap = await getDocs(collection(db, 'nexora_config'));
      configSnap.docs.forEach(doc => {
        if (doc.id === 'landing_hero') setHeroConfig(doc.data() as any);
        if (doc.id === 'about_core') setAboutConfig(doc.data() as any);
        if (doc.id === 'landing_stats') setStatsConfig(doc.data() as any);
        if (doc.id === 'landing_terms') setTermsConfig(doc.data() as any);
      });

      // Custom team list
      const teamSnap = await getDocs(collection(db, 'nexora_team'));
      if (!teamSnap.empty) {
        setCustomTeam(teamSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        loadDefaultTeam();
      }

      // Custom milestones timeline
      const milestoneSnap = await getDocs(collection(db, 'nexora_milestones'));
      if (!milestoneSnap.empty) {
        setCustomMilestones(milestoneSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        loadDefaultMilestones();
      }

      // Custom pricing plans
      const pricingSnap = await getDocs(collection(db, 'nexora_pricing_plans'));
      if (!pricingSnap.empty) {
        setCustomPricing(pricingSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        loadDefaultPricing();
      }

      // Custom FAQs
      const faqSnap = await getDocs(collection(db, 'nexora_faqs'));
      if (!faqSnap.empty) {
        setCustomFaqs(faqSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } else {
        loadDefaultFaqs();
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
      { id: 'local_t1', name: "Julian Sterling", role: "Founder & Chief Marketing Architect", exp: "Ex-Google Ads Elite team. Scaled 12+ SaaS products to successful IPO exits.", initial: "JS" },
      { id: 'local_t2', name: "Sienna Martinez", role: "Creative Director & Hook Engineer", exp: "Award-winning visual storyteller. Designs high-impact social frameworks.", initial: "SM" },
      { id: 'local_t3', name: "Dax Thornton", role: "Head of Funnels & Conversion Analytics", exp: "Full-stack Shopify engineer. Passionate about custom React pixel tracking.", initial: "DT" }
    ]);
  };

  const loadDefaultMilestones = () => {
    setCustomMilestones([
      { id: 'local_m1', year: "2021", title: "Nexora Foundation", desc: "Launched in NY with a small team of 3 analysts optimizing local retail campaigns." },
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
      { id: 'local_fq3', q: "How long before we see our first marketing results?", a: "With our specialized Nexora launch protocol, standard PPC and paid social channels go live with optimized creatives within 10-14 days. Major metrics improvements are visible in your custom analytics portal immediately." },
      { id: 'local_fq4', q: "Do you integrate custom CRM or tools like the NexaSphere Suite?", a: "Absolutely! Every Nexora Digital retainer grants lifetime premium access to the integrated NexaSphere workspace—where clients and executive staff can instantly manage Quotations, Money Receipts, and custom Sales tracking in real-time." }
    ]);
  };

  const loadMockAssets = () => {
    const backupLeads = JSON.parse(localStorage.getItem('nexora_leads_backup') || '[]');
    setLeads(backupLeads.length > 0 ? backupLeads : [
      { id: 'l1', name: "Julian Sterling", email: "jules@google.com", company: "Sterling Retail", phone: "+1 555 9182", budget: "$10,000+", service: "Facebook Ads", message: "Need immediate direct-response hook auditing.", status: "New" },
      { id: 'l2', name: "Aria Vance", email: "aria@zenithwear.co", company: "Zenith wear", phone: "+1 202 0192", budget: "$25,000+", service: "Shopify Store Design", message: "Looking for an AOV shopping slider development.", status: "Closed" }
    ]);

    const backupAds = JSON.parse(localStorage.getItem('nexora_ads_backup') || '[]');
    setAdsList(backupAds.length > 0 ? backupAds : [
      { id: 'a1', title: "Summer Hook UGC campaign", desc: "Facebook direct-response dynamic media pack.", platform: "Meta Direct", status: "Active", price: "$150 CPM" }
    ]);

    const backupServs = JSON.parse(localStorage.getItem('nexora_services_backup') || '[]');
    setServicesList(backupServs.length > 0 ? backupServs : [
      { id: 's1', title: "E-Commerce Funnel Scale", price: "$3,500/mo", desc: "Landing page conversion split metrics package.", featuresList: "Cart Drawer Upgrades, React Codes, Split-A/B Analysis" }
    ]);

    const backupBlogs = JSON.parse(localStorage.getItem('nexora_blogs_backup') || '[]');
    setBlogsList(backupBlogs.length > 0 ? backupBlogs : [
      { id: 'b1', title: "Cracking iOS 14.5 paid social parameters", desc: "How to attribute lead metrics behind proxy tokens.", cat: "Paid Ads", read: "9 mins read" }
    ]);

    const backupHero = JSON.parse(localStorage.getItem('nexora_hero_backup') || '{}');
    if (backupHero.headline) setHeroConfig(backupHero);

    const backupAbout = JSON.parse(localStorage.getItem('nexora_about_backup') || '{}');
    if (backupAbout.storyTitle) setAboutConfig(backupAbout);

    const backupStats = JSON.parse(localStorage.getItem('nexora_stats_backup') || '{}');
    if (backupStats.stat1_label) setStatsConfig(backupStats);

    const backupTerms = JSON.parse(localStorage.getItem('nexora_terms_backup') || '{}');
    if (backupTerms.termsTitle) setTermsConfig(backupTerms);

    const backupTeam = JSON.parse(localStorage.getItem('nexora_team_backup') || '[]');
    setCustomTeam(backupTeam.length > 0 ? backupTeam : [
      { id: 'local_t1', name: "Julian Sterling", role: "Founder & Chief Marketing Architect", exp: "Ex-Google Ads Elite team. Scaled 12+ SaaS products to successful IPO exits.", initial: "JS" },
      { id: 'local_t2', name: "Sienna Martinez", role: "Creative Director & Hook Engineer", exp: "Award-winning visual storyteller. Designs high-impact social frameworks.", initial: "SM" },
      { id: 'local_t3', name: "Dax Thornton", role: "Head of Funnels & Conversion Analytics", exp: "Full-stack Shopify engineer. Passionate about custom React pixel tracking.", initial: "DT" }
    ]);

    const backupMilestones = JSON.parse(localStorage.getItem('nexora_milestones_backup') || '[]');
    setCustomMilestones(backupMilestones.length > 0 ? backupMilestones : [
      { id: 'local_m1', year: "2021", title: "Nexora Foundation", desc: "Launched in NY with a small team of 3 analysts optimizing local retail campaigns." },
      { id: 'local_m2', year: "2023", title: "NexaSphere Suite Release", desc: "Introduced integrated back-office PDF creation modules to support enterprise clients." },
      { id: 'local_m3', year: "2025", title: "Global Expand", desc: "Maintained a portfolio of over 45 high-end SaaS accounts tracking $185M+ in revenue." }
    ]);

    const backupPricing = JSON.parse(localStorage.getItem('nexora_pricing_backup') || '[]');
    setCustomPricing(backupPricing.length > 0 ? backupPricing : [
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

    const backupFaqs = JSON.parse(localStorage.getItem('nexora_faqs_backup') || '[]');
    setCustomFaqs(backupFaqs.length > 0 ? backupFaqs : [
      { id: 'local_fq1', q: "What is your typical ROAS (Return on Ad Spend) average?", a: "Across Facebook, Tik Tok, and Google Ads, our corporate average for active campaigns sits at 4.2x ROAS, with high-intent premium Shopify scaling funnels regularly achieving over 6.8x ROAS." },
      { id: 'local_fq2', q: "Do you build the landing pages and sales funnels too?", a: "Yes, we handle the full stack. Our international design team designs high-speed Shopify Stores, custom React funnels, and high-conversion landing pages engineered strictly to maximize lead qualification and purchases." },
      { id: 'local_fq3', q: "How long before we see our first marketing results?", a: "With our specialized Nexora launch protocol, standard PPC and paid social channels go live with optimized creatives within 10-14 days. Major metrics improvements are visible in your custom analytics portal immediately." },
      { id: 'local_fq4', q: "Do you integrate custom CRM or tools like the NexaSphere Suite?", a: "Absolutely! Every Nexora Digital retainer grants lifetime premium access to the integrated NexaSphere workspace—where clients and executive staff can instantly manage Quotations, Money Receipts, and custom Sales tracking in real-time." }
    ]);
  };

  useEffect(() => {
    loadDatabaseAssets();
  }, []);

  // Update a Lead Status
  const updateLeadStatus = async (id: string, newStatus: string) => {
    try {
      if (id.startsWith('local_') || id.length < 5) {
        // Fallback internal write
        const list = leads.map(l => l.id === id ? { ...l, status: newStatus } : l);
        setLeads(list);
        localStorage.setItem('nexora_leads_backup', JSON.stringify(list));
      } else {
        await updateDoc(doc(db, 'nexora_leads', id), { status: newStatus });
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
        localStorage.setItem('nexora_leads_backup', JSON.stringify(list));
      } else {
        await deleteDoc(doc(db, 'nexora_leads', id));
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
        await addDoc(collection(db, 'nexora_ads'), {
          ...ad,
          createdAt: serverTimestamp()
        });
      }
      toast.success(`Successfully uploaded ${multipleAds.length} promotional campaign cards simultaneously!`);
      setMultipleAds([{ title: '', desc: '', platform: 'Meta Direct', status: 'Active', price: '$120 CPM', cta: 'Order Scale' }]);
      loadDatabaseAssets();
    } catch (err) {
      console.warn("No DB connect. Backing up multiple ads locally...");
      const backup = JSON.parse(localStorage.getItem('nexora_ads_backup') || '[]');
      multipleAds.forEach((ad, i) => {
        backup.push({ ...ad, id: 'local_ad_' + Date.now() + '_' + i });
      });
      localStorage.setItem('nexora_ads_backup', JSON.stringify(backup));
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
        localStorage.setItem('nexora_ads_backup', JSON.stringify(list));
      } else {
        await deleteDoc(doc(db, 'nexora_ads', id));
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
      await addDoc(collection(db, 'nexora_services'), {
        ...newService,
        createdAt: serverTimestamp()
      });
      toast.success("Dynamic Corporate Service added successfully!");
      setNewService({ title: '', price: '', desc: '', featuresList: '' });
      loadDatabaseAssets();
    } catch (err) {
      const backup = JSON.parse(localStorage.getItem('nexora_services_backup') || '[]');
      const item = { ...newService, id: 'local_srv_' + Date.now() };
      backup.push(item);
      localStorage.setItem('nexora_services_backup', JSON.stringify(backup));
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
        localStorage.setItem('nexora_services_backup', JSON.stringify(list));
      } else {
        await deleteDoc(doc(db, 'nexora_services', id));
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
      await addDoc(collection(db, 'nexora_blog'), {
        ...newBlog,
        createdAt: serverTimestamp(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      });
      toast.success("New growth editorial post published!");
      setNewBlog({ title: '', desc: '', cat: 'Paid Ads', read: '6 mins read', author: 'Julian Sterling' });
      loadDatabaseAssets();
    } catch (err) {
      const backup = JSON.parse(localStorage.getItem('nexora_blogs_backup') || '[]');
      const item = { ...newBlog, id: 'local_blog_' + Date.now(), date: 'Today' };
      backup.push(item);
      localStorage.setItem('nexora_blogs_backup', JSON.stringify(backup));
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
        localStorage.setItem('nexora_blogs_backup', JSON.stringify(list));
      } else {
        await deleteDoc(doc(db, 'nexora_blog', id));
        toast.success("Blog deleted!");
        loadDatabaseAssets();
      }
    } catch (e) {
      toast.error("Removed locally.");
    }
  };

  // WEBSITE CONTENT EXECUTIVE CUSTOMIZER HANDLERS
  const handleSaveHeroConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'nexora_config', 'landing_hero'), heroConfig);
      localStorage.setItem('nexora_hero_backup', JSON.stringify(heroConfig));
      toast.success("Hero Core parameters saved to Cloud Database!");
    } catch (err) {
      localStorage.setItem('nexora_hero_backup', JSON.stringify(heroConfig));
      toast.success("Hero params updated locally (offline mode).");
    }
  };

  const handleSaveAboutConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'nexora_config', 'about_core'), aboutConfig);
      localStorage.setItem('nexora_about_backup', JSON.stringify(aboutConfig));
      toast.success("About page parameters saved to Cloud Database!");
    } catch (err) {
      localStorage.setItem('nexora_about_backup', JSON.stringify(aboutConfig));
      toast.success("About params updated locally (offline mode).");
    }
  };

  const handleSaveStatsConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'nexora_config', 'landing_stats'), statsConfig);
      localStorage.setItem('nexora_stats_backup', JSON.stringify(statsConfig));
      toast.success("Stats Counters parameters saved to Cloud Database!");
    } catch (err) {
      localStorage.setItem('nexora_stats_backup', JSON.stringify(statsConfig));
      toast.success("Stats Counters updated locally (offline mode).");
    }
  };

  const handleSaveTermsConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await setDoc(doc(db, 'nexora_config', 'landing_terms'), termsConfig);
      localStorage.setItem('nexora_terms_backup', JSON.stringify(termsConfig));
      toast.success("Legal terms & Privacy disclosures saved to Cloud Database!");
    } catch (err) {
      localStorage.setItem('nexora_terms_backup', JSON.stringify(termsConfig));
      toast.success("Legal terms updated locally (offline mode).");
    }
  };

  // Team Member Lists
  const handleAddTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamMember.name.trim() || !newTeamMember.role.trim()) {
      toast.error("Please fill Name and Role!");
      return;
    }
    const initial = newTeamMember.initial || newTeamMember.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const member = { ...newTeamMember, initial };
    
    try {
      const docRef = await addDoc(collection(db, 'nexora_team'), member);
      const added = { id: docRef.id, ...member };
      setCustomTeam([...customTeam, added]);
      setNewTeamMember({ name: '', role: '', exp: '', initial: '', image: '' });
      toast.success("Team member saved to cloud!");
    } catch (err) {
      const id = 'local_team_' + Date.now();
      const added = { id, ...member };
      const backup = [...customTeam, added];
      setCustomTeam(backup);
      localStorage.setItem('nexora_team_backup', JSON.stringify(backup));
      setNewTeamMember({ name: '', role: '', exp: '', initial: '', image: '' });
      toast.success("Team member saved locally!");
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    try {
      if (id.startsWith('local_') || id.length < 5) {
        const list = customTeam.filter(t => t.id !== id);
        setCustomTeam(list);
        localStorage.setItem('nexora_team_backup', JSON.stringify(list));
      } else {
        await deleteDoc(doc(db, 'nexora_team', id));
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
      const docRef = await addDoc(collection(db, 'nexora_milestones'), newMilestone);
      setCustomMilestones([...customMilestones, { id: docRef.id, ...newMilestone }]);
      setNewMilestone({ year: '', title: '', desc: '' });
      toast.success("Milestone chronological block added!");
    } catch (err) {
      const id = 'local_milestones_' + Date.now();
      const added = { id, ...newMilestone };
      const backup = [...customMilestones, added];
      setCustomMilestones(backup);
      localStorage.setItem('nexora_milestones_backup', JSON.stringify(backup));
      setNewMilestone({ year: '', title: '', desc: '' });
      toast.success("Milestone saved locally!");
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    try {
      if (id.startsWith('local_') || id.length < 5) {
        const list = customMilestones.filter(m => m.id !== id);
        setCustomMilestones(list);
        localStorage.setItem('nexora_milestones_backup', JSON.stringify(list));
      } else {
        await deleteDoc(doc(db, 'nexora_milestones', id));
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
      const docRef = await addDoc(collection(db, 'nexora_pricing_plans'), newPlan);
      setCustomPricing([...customPricing, { id: docRef.id, ...newPlan }]);
      setNewPlan({ name: '', price: '', period: 'monthly', desc: '', features: '', popular: false, color: 'border-white/[0.05]' });
      toast.success("SLA pricing retainer published!");
    } catch (err) {
      const id = 'local_pricing_' + Date.now();
      const added = { id, ...newPlan };
      const backup = [...customPricing, added];
      setCustomPricing(backup);
      localStorage.setItem('nexora_pricing_backup', JSON.stringify(backup));
      setNewPlan({ name: '', price: '', period: 'monthly', desc: '', features: '', popular: false, color: 'border-white/[0.05]' });
      toast.success("Pricing plan saved locally!");
    }
  };

  const handleDeletePlan = async (id: string) => {
    try {
      if (id.startsWith('local_') || id.length < 5) {
        const list = customPricing.filter(p => p.id !== id);
        setCustomPricing(list);
        localStorage.setItem('nexora_pricing_backup', JSON.stringify(list));
      } else {
        await deleteDoc(doc(db, 'nexora_pricing_plans', id));
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
      const docRef = await addDoc(collection(db, 'nexora_faqs'), newFaq);
      setCustomFaqs([...customFaqs, { id: docRef.id, ...newFaq }]);
      setNewFaq({ q: '', a: '' });
      toast.success("FAQ accordion item saved!");
    } catch (err) {
      const id = 'local_faqs_' + Date.now();
      const added = { id, ...newFaq };
      const backup = [...customFaqs, added];
      setCustomFaqs(backup);
      localStorage.setItem('nexora_faqs_backup', JSON.stringify(backup));
      setNewFaq({ q: '', a: '' });
      toast.success("FAQ saved locally!");
    }
  };

  const handleDeleteFaq = async (id: string) => {
    try {
      if (id.startsWith('local_') || id.length < 5) {
        const list = customFaqs.filter(f => f.id !== id);
        setCustomFaqs(list);
        localStorage.setItem('nexora_faqs_backup', JSON.stringify(list));
      } else {
        await deleteDoc(doc(db, 'nexora_faqs', id));
        setCustomFaqs(customFaqs.filter(f => f.id !== id));
        toast.success("Deleted FAQ from cloud.");
      }
    } catch(e) {
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
              <Sparkles className="text-indigo-400 animate-spin" size={16} />
              <span className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.25em] italic">NEXORA BACKOFFICE DESK</span>
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
            { id: 'leads', label: 'Leads & Messages Hub', icon: FolderHeart },
            { id: 'ads', label: 'SeedTest Ads (Multiple Rows)', icon: Sliders },
            { id: 'services', label: 'Services Catalogue', icon: LibrarySquare },
            { id: 'blogs', label: 'Blogs Seeder Portal', icon: FileText },
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
                <h3 className="text-lg font-black uppercase italic tracking-tight text-white">PROSPECT SUBMISSIONS LEDGER</h3>
                <p className="text-slate-450 text-[11px] font-semibold italic">These leads and corporate messages were received directly from the front-facing landing page form.</p>
              </div>

              <div className="space-y-4">
                {leads.map((l) => (
                  <div key={l.id} className="p-6 bg-slate-950/80 border border-white/[0.05] rounded-3xl relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-indigo-550/10 text-indigo-400 border border-indigo-550/20">
                          {l.status}
                        </span>
                        <h4 className="text-md font-black uppercase">{l.name}</h4>
                        <span className="text-[10px] font-mono text-slate-500">{l.company}</span>
                      </div>
                      <p className="text-[#94a3b8] text-xs font-semibold italic">Budget: {l.budget} | Phone: {l.phone} | Email: {l.email}</p>
                      <p className="text-slate-300 text-xs italic bg-white/[0.02] p-4.5 rounded-xl border border-white/[0.03] mt-2 font-medium leading-relaxed">
                        "{l.message}"
                      </p>
                    </div>

                    <div className="flex gap-2.5 shrink-0 self-end md:self-center">
                      <button 
                        onClick={() => updateLeadStatus(l.id, l.status === 'New' ? 'Nurtured' : 'Closed')}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-colors"
                      >
                        Shift status
                      </button>
                      <button 
                        onClick={() => handleLeadDelete(l.id)}
                        className="p-2.5 bg-rose-600/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-xl transition-all border border-rose-500/15"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {leads.length === 0 && (
                  <div className="text-center py-12">
                    <AlertCircle className="mx-auto w-8 h-8 text-indigo-400 mb-2 animate-bounce" />
                    <p className="text-xs text-slate-500 italic font-semibold">No prospects added. Try messaging via the contact portal!</p>
                  </div>
                )}
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

          {/* TAB 5: WEBSITE CONTENT EXECUTIVE CUSTOMIZER */}
          {activeTab === 'customizer' && isAdmin && (
            <div className="space-y-8">
              <div className="space-y-2 border-b border-white/[0.05] pb-4">
                <span className="text-[10px] font-mono tracking-[0.25em] text-indigo-400 font-black italic block">NEXORA SYSTEM CONFIGURATION</span>
                <h3 className="text-xl font-black uppercase italic tracking-tight text-white mb-1">FRONTEND WEBSITE EDITOR PANEL</h3>
                <p className="text-slate-450 text-[11px] font-semibold italic">Edit any hero title, metric statistic, FAQs list, pricing retainers or team members displayed across the organization's public landing screens.</p>
              </div>

              {/* Sub-Tabs selectors */}
              <div className="flex flex-wrap gap-2 pt-2 border-b border-white/[0.03] pb-4">
                {[
                  { id: 'hero', label: 'Landing Hero & Stats' },
                  { id: 'about', label: 'About Story & Blocks' },
                  { id: 'team_chrono', label: 'Team & Chronology Timeline' },
                  { id: 'pricing', label: 'SLA Pricing Plan Packages' },
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

              {/* SUBVIEW 3: TEAM & CHRONOLOGY TIMELINE */}
              {customizerSubTab === 'team_chrono' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
                  
                  {/* Team Members List Editor */}
                  <div className="lg:col-span-6 space-y-6">
                    <form onSubmit={handleAddTeamMember} className="bg-slate-950/75 p-6 rounded-[2rem] border border-white/[0.04] space-y-4 text-xs font-semibold">
                      <span className="text-[9px] font-mono font-black uppercase text-indigo-400 block">REGISTER TEAM OFFICER</span>
                      
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

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-455 uppercase font-black font-semibold">BIO INITIAL (OPTIONAL)</label>
                          <input
                            type="text"
                            placeholder="Leave blank for initials auto-gen"
                            value={newTeamMember.initial}
                            onChange={e => setNewTeamMember({ ...newTeamMember, initial: e.target.value })}
                            className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2 px-3 focus:border-indigo-500 outline-none text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[8px] font-mono text-slate-455 uppercase font-black font-semibold">PORTRAIT IMAGE URL (OPTIONAL)</label>
                          <input
                            type="text"
                            placeholder="Paste corporate portrait URL..."
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
                          placeholder="Ex-Google Ads senior specialist. Scaled SaaS metrics..."
                          value={newTeamMember.exp}
                          onChange={e => setNewTeamMember({ ...newTeamMember, exp: e.target.value })}
                          className="w-full bg-[#03030c] border border-white/[0.08] rounded-xl py-2.5 px-3 focus:border-indigo-500 outline-none text-white resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-550 text-white font-sans uppercase text-[9px] font-black tracking-widest rounded-xl transition-all cursor-pointer shadow-lg"
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
                                {t.image ? (
                                  <img src={t.image} alt={t.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                                ) : (
                                  t.initial
                                )}
                              </div>
                              <div>
                                <h6 className="font-extrabold text-white text-xs">{t.name}</h6>
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
