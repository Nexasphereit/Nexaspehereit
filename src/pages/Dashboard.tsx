import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  UserCircle, 
  Receipt as ReceiptIcon, 
  ArrowRight, 
  Settings as SettingsIcon, 
  History as HistoryIcon, 
  Building2, 
  Sliders, 
  Clock, 
  TrendingUp, 
  Sparkles
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { settings } = useTheme();
  const isDark = settings.sidebarTheme === 'dark';
  const navigate = useNavigate();

  // --- Session Profile States ---
  const loggedInUser = useMemo(() => {
    const saved = localStorage.getItem('customUser');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse customUser:", e);
      }
    }
    return {
      id: 'admin',
      name: 'Main Administrator',
      email: 'admin@nexasphere.it',
      role: 'admin',
      commissionPercentage: 10
    };
  }, []);

  const isUserAdmin = loggedInUser.role === 'admin';

  // Essential functions metadata list
  const essentialFunctions = [
    ...(isUserAdmin ? [{
      id: 'it-sales',
      title: 'IT Sales Workstation',
      desc: 'Orchestrate clients, contracts, active SLA tracking, and real-time message notification broadcasts.',
      path: '/it-sales',
      icon: Building2,
      color: '#3b82f6', // blue
      badge: 'Active pipeline',
      actionText: 'Enter Hub'
    }] : []),
    {
      id: 'quotations',
      title: 'Quotation Suite',
      desc: 'Establish professional multi-currency agency pricing, custom parameters, and detailed quotations.',
      path: '/quotations',
      icon: FileText,
      color: '#ef4444', // red/rose
      badge: 'SLA Prices',
      actionText: 'Draft Quote'
    },
    {
      id: 'cvs',
      title: 'CV / Resume Architect',
      desc: 'Instantly build, customize, and export elegant corporate skill templates and representative resumes.',
      path: '/cvs',
      icon: UserCircle,
      color: '#10b981', // green/emerald
      badge: 'Consultant DB',
      actionText: 'Create Profile'
    },
    {
      id: 'receipts',
      title: 'Money Receipt Logger',
      desc: 'Log and generate legal paper money receipts with custom corporate branding and signatures.',
      path: '/receipts',
      icon: ReceiptIcon,
      color: '#ec4899', // pink
      badge: 'Invoicing Logs',
      actionText: 'Record Billing'
    },
    {
      id: 'history',
      title: 'Operational Audit logs',
      desc: 'Assess chronological tracking records of all generated quotes, resumes, receipts, and operations.',
      path: '/history',
      icon: HistoryIcon,
      color: '#a855f7', // purple
      badge: 'System Audit',
      actionText: 'View History'
    },
    ...(isUserAdmin ? [
      {
        id: 'admin',
        title: 'Website Customizer',
        desc: 'Configure landing pages layout, team lists, custom hero content, pricing structures, and testimonials.',
        path: '/admin',
        icon: Sliders,
        color: '#06b6d4', // cyan
        badge: 'Front-End Customizer',
        actionText: 'Customize Design'
      },
      {
        id: 'settings',
        title: 'Workspace Configuration',
        desc: 'Set company name, logos, primary color accents, theme settings, and global parameters.',
        path: '/settings',
        icon: SettingsIcon,
        color: '#f59e0b', // orange/amber
        badge: 'Core Settings',
        actionText: 'Customize CRM'
      }
    ] : [])
  ];

  return (
    <div className="space-y-8 pb-16 text-slate-350">
      
      {/* 1. BRAND HIGH-END HEADER BARS */}
      <header className={cn(
        "flex flex-col sm:flex-row justify-between items-start sm:items-center rounded-3xl p-6 border gap-4 backdrop-blur-xl transition-all shadow-xl",
        isDark ? "bg-[#03030f]/60 border-white/[0.04]" : "bg-white border-slate-200"
      )}>
        {/* NUGOR TECH Logo badge */}
        <a href="/" className="flex items-center gap-3 hover:opacity-85 transition-all select-none cursor-pointer">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 shadow-md">
            <TrendingUp size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className={cn("text-lg font-black uppercase tracking-tight italic flex items-center gap-1.5", isDark ? "text-white" : "text-slate-900")}>
              {settings.companyName || 'NUGOR TECH'} <span className="text-[10px] bg-red-500/10 text-rose-500 px-2 py-0.5 rounded-full not-italic tracking-normal">WORKSTATION</span>
            </h2>
            <p className="text-[10px] text-slate-500 font-bold italic">Centralized Essential Management Console</p>
          </div>
        </a>

        {/* Dynamic User Banner & Pause Controller info */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className={cn("px-4 py-2.5 rounded-2xl border text-[11px] font-black uppercase tracking-wider", isDark ? "bg-[#040410]/50 border-white/[0.04]" : "bg-slate-50 border-slate-200")}>
            Session Account: <span className="text-rose-500 italic mr-1">{loggedInUser.name}</span> 
            <span className="text-slate-500">({loggedInUser.role})</span>
          </div>
        </div>
      </header>

      {/* 2. SUB-HEADER BREADCRUMB */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
        <div>
          <h1 className={cn("text-2xl sm:text-3xl font-black uppercase italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r", isDark ? "from-white via-white to-slate-500" : "from-slate-900 to-slate-600")}>
            Workspace Hub
          </h1>
          <p className="text-slate-500 text-[10px] sm:text-xs font-bold italic flex items-center gap-1.5 mt-1">
            <span>Corporate Dashboard</span>
            <span className="text-slate-700">/</span>
            <span className="text-rose-500">Core Services</span>
          </p>
        </div>
      </div>

      {/* 4. ESSENTIAL FUNCTIONAL BENTO GRID */}
      <div>
        <div className="text-left mb-6">
          <h3 className={cn("text-md font-extrabold tracking-wide uppercase", isDark ? "text-white" : "text-slate-800")}>
            Core CRM Blueprints
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Select a module below to quickly execute actions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {essentialFunctions.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -4, scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "p-6 rounded-[2rem] border transition-all relative overflow-hidden flex flex-col justify-between text-left group",
                  isDark 
                    ? "bg-[#030312]/60 border-white/[0.04] hover:border-white/[0.1] hover:bg-[#04041a]/80" 
                    : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 shadow-sm"
                )}
              >
                {/* Visual Accent Glow on Hover */}
                <div 
                  className="absolute top-0 right-0 w-32 h-32 rounded-full filter blur-[40px] opacity-10 group-hover:opacity-20 pointer-events-none transition-all"
                  style={{ backgroundColor: item.color }}
                />

                <div className="space-y-4">
                  {/* Top Badge & Icon info */}
                  <div className="flex items-center justify-between">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner"
                      style={{ backgroundColor: `${item.color}15`, color: item.color }}
                    >
                      <Icon size={22} />
                    </div>
                    <span 
                      className="text-[8px] font-mono font-black uppercase tracking-widest px-3 py-1 rounded-full border"
                      style={{ 
                        color: item.color, 
                        borderColor: `${item.color}33`,
                        backgroundColor: `${item.color}0a` 
                      }}
                    >
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-1.5 pt-1">
                    <h4 className={cn("text-md font-extrabold tracking-tight", isDark ? "text-white" : "text-slate-900")}>
                      {item.title}
                    </h4>
                    <p className={cn("text-xs leading-relaxed font-semibold min-h-[3.5rem]", isDark ? "text-slate-400" : "text-slate-500")}>
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Navigation Button */}
                <div className="pt-4 mt-2 border-t border-slate-900/10 dark:border-white/[0.04]">
                  <Link 
                    to={item.path}
                    className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider group-hover:underline cursor-pointer"
                    style={{ color: settings.primaryColor }}
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight size={14} className="transform group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
