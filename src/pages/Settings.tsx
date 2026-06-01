import React from 'react';
import { motion } from 'motion/react';
import { Palette, Type, RefreshCcw, Save, Moon, Sun, Building2, Plus, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Card, Button, ImageUpload } from '../components/common/UI';
import { toast } from 'react-hot-toast';
import { cn } from '../lib/utils';

const COLORS = [
  { name: 'Pure Black', value: '#000000' },
  { name: 'Slate Gray', value: '#334155' },
  { name: 'Zinc', value: '#71717a' },
  { name: 'Rose', value: '#e11d48' },
  { name: 'Indigo', value: '#4f46e5' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Sky', value: '#0284c7' },
  { name: 'Purple', value: '#9333ea' },
];

const Settings = () => {
  const { settings, updateSettings, toggleDarkMode } = useTheme();
  
  const [newGoogleFontName, setNewGoogleFontName] = React.useState('');
  const [newGoogleFontLabel, setNewGoogleFontLabel] = React.useState('');

  const defaultFonts = [
    { name: 'Default Sans (Outfit)', id: 'font-sans' },
    { name: 'Lora (Classic Elegant)', id: 'Lora' },
    { name: 'Inter (Sleek Modern)', id: 'Inter' },
    { name: 'Hind Siliguri (Bengali)', id: 'Hind Siliguri' },
    { name: 'Playfair Display (Serif)', id: 'Playfair Display' },
    { name: 'Fira Code (Technical)', id: 'font-mono' },
  ];

  const currentFonts = settings.customFonts || defaultFonts;

  const handleAddCustomFont = () => {
    if (!newGoogleFontName.trim()) {
      toast.error('Please enter a Google Font name');
      return;
    }
    const fontId = newGoogleFontName.trim();
    const label = newGoogleFontLabel.trim() || `${fontId}`;
    
    // Check duplication
    if (currentFonts.some(f => f.id.toLowerCase() === fontId.toLowerCase())) {
      toast.error('This font family is already registered in your settings');
      return;
    }

    const updatedFonts = [...currentFonts, { name: label, id: fontId }];
    updateSettings({ customFonts: updatedFonts, fontFamily: fontId });
    setNewGoogleFontName('');
    setNewGoogleFontLabel('');
    toast.success(`Google Font "${fontId}" successfully registered and set active!`);
  };

  const handleDeleteFont = (fontId: string) => {
    const updatedFonts = currentFonts.filter(f => f.id !== fontId);
    let newActive = settings.fontFamily;
    if (settings.fontFamily === fontId) {
      newActive = 'font-sans';
    }
    updateSettings({ customFonts: updatedFonts, fontFamily: newActive });
    toast.success('Font template removed from customizable menu');
  };

  const handleReset = () => {
    updateSettings({
      primaryColor: '#000000',
      fontFamily: 'font-sans',
      sidebarTheme: 'light',
      companyLogo: '',
      customFonts: defaultFonts,
    });
    toast.success('Settings reset to default');
  };

  const isDark = settings.sidebarTheme === 'dark';

  return (
    <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-10 px-4">
      <header className="space-y-2">
        <h1 className={cn("text-3xl md:text-4xl font-black tracking-tight", isDark ? "text-white" : "text-slate-900")}>App Customization</h1>
        <p className="text-slate-500 text-sm md:text-base">Personalize your Workspace with your brand colors and typography.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Brand Assets & Logo Customizer */}
        <Card className={cn("p-6 md:p-8 md:col-span-2", isDark && "bg-slate-900 border-slate-800")}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/10 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500")}>
                <Building2 size={20} />
              </div>
              <div>
                <h2 className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>Company Branding & Custom Logo Panel</h2>
                <p className="text-xs text-slate-500">Configure public business identity and upload custom SVG/PNG brand artwork.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-6">
            {/* Left Column: inputs & uploader */}
            <div className="md:col-span-6 space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 pl-1">Company Name</label>
                  <input
                    type="text"
                    value={settings.companyName || ''}
                    onChange={(e) => updateSettings({ companyName: e.target.value })}
                    placeholder="e.g. NexaSphere It"
                    className={cn(
                      "w-full px-4 py-3 rounded-2xl text-xs font-bold focus:outline-none border transition-all",
                      isDark 
                        ? "bg-slate-950 border-white/5 text-slate-200 focus:border-indigo-500/50" 
                        : "bg-white border-slate-200 text-slate-950 focus:border-indigo-505"
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 pl-1">Brand Tagline</label>
                  <input
                    type="text"
                    value={settings.companyTagline || ''}
                    onChange={(e) => updateSettings({ companyTagline: e.target.value })}
                    placeholder="e.g. new ideas, new success"
                    className={cn(
                      "w-full px-4 py-3 rounded-2xl text-xs font-bold focus:outline-none border transition-all",
                      isDark 
                        ? "bg-slate-950 border-white/5 text-slate-200 focus:border-indigo-500/50" 
                        : "bg-white border-slate-200 text-slate-950 focus:border-indigo-505"
                    )}
                  />
                </div>
              </div>

              {/* Global Website Currency Selector */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-black tracking-wider text-slate-400 pl-1">Global Website Currency (মুদ্রা নির্বাচন)</label>
                <select
                  value={settings.currency || 'BDT'}
                  onChange={(e) => {
                    updateSettings({ currency: e.target.value });
                    toast.success(`Global website currency set to ${e.target.value}`);
                  }}
                  className={cn(
                    "w-full px-4 py-3 rounded-2xl text-xs font-bold focus:outline-none border transition-all cursor-pointer",
                    isDark 
                      ? "bg-slate-950 border-white/5 text-slate-200 focus:border-indigo-500/50" 
                      : "bg-white border-slate-200 text-slate-950 focus:border-indigo-500"
                  )}
                >
                  <option value="BDT">BDT (৳) - Bangladeshi Taka</option>
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="INR">INR (₹) - Indian Rupee</option>
                  <option value="SAR">SAR (SR) - Saudi Riyal</option>
                  <option value="AED">AED (Dh) - UAE Dirham</option>
                </select>
              </div>

              {/* Logo Uploader */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-wider text-slate-400 pl-1">
                  <span>Custom Logo Upload</span>
                  {settings.companyLogo && (
                    <button
                      onClick={() => {
                        updateSettings({ companyLogo: '', companyLogoLight: '' });
                        toast.success('Custom logo deleted successfully.');
                      }}
                      className="text-[10px] font-extrabold text-rose-500 hover:text-rose-600 transition-colors flex items-center gap-1 bg-rose-500/10 px-2 py-1 rounded-md"
                    >
                      <Trash2 size={11} />
                      Remove Logo
                    </button>
                  )}
                </div>
                
                <ImageUpload 
                  label="Drag logo or click to select" 
                  value={settings.companyLogo}
                  onChange={(logo) => {
                    updateSettings({ companyLogo: logo, companyLogoLight: logo });
                    toast.success('Custom company logo generated and set active!');
                  }}
                  className="w-full"
                />
              </div>

              {/* Render Height Limits */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-400 pl-1">
                  <span>Logo Height Limit</span>
                  <span className="font-mono text-xs font-bold" style={{ color: settings.primaryColor }}>{settings.logoHeight || 40}px</span>
                </div>
                <input
                  type="range"
                  min="24"
                  max="80"
                  value={settings.logoHeight || 40}
                  onChange={(e) => updateSettings({ logoHeight: parseInt(e.target.value) })}
                  className="w-full accent-rose-500 cursor-ew-resize"
                  style={{ accentColor: settings.primaryColor }}
                />
              </div>

            </div>

            {/* Right Column: Dynamic Preview ("Visible Here") and Instruction guide */}
            <div className={cn("p-6 rounded-3xl md:col-span-6 flex flex-col justify-between border", isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200")}>
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 pl-1">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: settings.primaryColor }} />
                  Live Realtime Preview (Visible Here)
                </h3>
                
                {/* Visual Preview Box */}
                <div className="space-y-2">
                  <p className="text-[9px] font-black uppercase tracking-wider text-slate-400 pl-1">Interactive Sidebar Layout</p>
                  <div className={cn("p-4 rounded-2xl border flex items-center gap-3 shadow-md transition-all duration-300", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100")}>
                    {settings.companyLogo ? (
                      <div className="rounded-xl overflow-hidden shadow-sm shrink-0" style={{ height: `${(settings.logoHeight || 40) * 0.85}px` }}>
                        <img src={settings.companyLogo} alt="Logo" className="h-full w-auto object-contain bg-white" />
                      </div>
                    ) : (
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow text-white font-black text-sm"
                        style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.primaryColor}dd)` }}
                      >
                        {(settings.companyName || 'N').charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col overflow-hidden">
                      <span className={cn("font-extrabold text-sm tracking-tight truncate leading-none mb-0.5", isDark ? "text-white" : "text-slate-900")}>
                        {settings.companyName || 'NexaSphere It'}
                      </span>
                      <span className="text-[8px] font-extrabold tracking-widest uppercase truncate" style={{ color: settings.primaryColor }}>
                        {settings.companyTagline || 'new ideas, new success'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Guide for adding it in the backend / config */}
                <div className="space-y-2 pt-3 border-t border-slate-500/10 dark:border-white/5">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 pl-1">Settings Guidelines & Specifications:</h4>
                  <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1.5 pl-4 list-disc font-medium leading-relaxed">
                    <li>
                      <strong>Artwork:</strong> Best results come from transparent <strong>SVG</strong> or <strong>PNG</strong> formats.
                    </li>
                    <li>
                      <strong>Auto-scaling Optimization:</strong> High-res images are automatically converted to clean data-URI strings inside your local sandbox.
                    </li>
                    <li>
                      <strong>Propagation:</strong> Updated assets instantly white-label the Quotation suite, standard receipts, and login interfaces.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action notice */}
              <div className="mt-4 pt-3 border-t border-slate-500/10 dark:border-white/5 flex items-center gap-2">
                <span className="text-[8px] font-bold py-0.5 px-1.5 rounded bg-amber-500/10 text-amber-500 uppercase tracking-widest shrink-0">
                  Dual Presence
                </span>
                <span className="text-[9px] text-slate-400 font-semibold italic">
                  Preview updates in real-time on the left sidebar as well.
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Interface Mode */}
        <Card className={cn("p-6 md:p-8", isDark && "bg-slate-900 border-slate-800")}>
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className={cn("p-2 rounded-lg", isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500")}>
              {isDark ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <h2 className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>Interface Mode</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => updateSettings({ sidebarTheme: 'light' })}
              className={cn(
                "p-4 rounded-2xl border transition-all flex flex-col items-center gap-2",
                !isDark ? "border-indigo-600 bg-indigo-50/50" : "border-slate-800 hover:border-slate-700 bg-slate-900"
              )}
            >
              <Sun size={24} className={!isDark ? "text-indigo-600" : "text-slate-500"} />
              <span className={cn("font-bold text-sm", !isDark ? "text-indigo-900" : "text-slate-400")}>Light Mode</span>
            </button>
            <button
              onClick={() => updateSettings({ sidebarTheme: 'dark' })}
              className={cn(
                "p-4 rounded-2xl border transition-all flex flex-col items-center gap-2",
                isDark ? "border-rose-600 bg-rose-900/20" : "border-slate-100 hover:border-slate-200 bg-slate-50"
              )}
            >
              <Moon size={24} className={isDark ? "text-rose-500" : "text-slate-500"} />
              <span className={cn("font-bold text-sm", isDark ? "text-rose-100" : "text-slate-400")}>Dark Mode</span>
            </button>
          </div>

          <div className="mt-8 space-y-4">
             <h3 className={cn("text-xs font-black uppercase tracking-widest", isDark ? "text-slate-400" : "text-slate-500")}>Menu Color</h3>
             <div className="flex flex-wrap gap-2">
                {['', '#000000', '#1e293b', '#334155', '#e11d48', '#4f46e5'].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateSettings({ sidebarColor: color })}
                    className={cn(
                      "w-8 h-8 rounded-full border-2 transition-all",
                      settings.sidebarColor === color 
                        ? (isDark ? "border-white scale-110 shadow-lg shadow-black/80" : "border-slate-900 scale-110 shadow-lg shadow-slate-200") 
                        : "border-transparent text-transparent hover:scale-105"
                    )}
                    style={{ backgroundColor: color || (isDark ? '#020617' : '#ffffff') }}
                  />
                ))}
             </div>
          </div>
        </Card>

        {/* Brand Color */}
        <Card className={cn("p-6 md:p-8", isDark && "bg-slate-900 border-slate-800")}>
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className={cn("p-2 rounded-lg", isDark ? "bg-rose-950 text-rose-500" : "bg-rose-50 text-rose-600")}>
              <Palette size={20} />
            </div>
            <h2 className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>Brand Color</h2>
          </div>

          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
            {COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => updateSettings({ primaryColor: color.value })}
                className={cn(
                  "aspect-square rounded-2xl border-4 transition-all flex items-center justify-center group relative",
                  settings.primaryColor === color.value ? "scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                )}
                style={{ backgroundColor: color.value, borderColor: settings.primaryColor === color.value ? settings.primaryColor : 'transparent' }}
              >
                {settings.primaryColor === color.value && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                    <Save size={16} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Typography & Customizable Font Manager */}
        <Card className={cn("p-6 md:p-8 md:col-span-2", isDark && "bg-slate-900 border-slate-800")}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800/10 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", isDark ? "bg-indigo-950 text-indigo-400" : "bg-indigo-50 text-indigo-600")}>
                <Type size={20} />
              </div>
              <div>
                <h2 className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>Typography & Font Customizer (ফন্ট নির্বাচন ও সংযোজন)</h2>
                <p className="text-xs text-slate-500">Choose your active website font from the menu or register new Google Fonts on the fly.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Dropdown & Grid Selector */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Dropdown Menu format requested by user */}
              <div className="space-y-2">
                <label className={cn("block text-[11px] font-black uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>
                  Active Font Dropdown List (ফন্ট ড্রপডাউন মেনু)
                </label>
                <div className="relative">
                  <select
                    value={settings.fontFamily}
                    onChange={(e) => updateSettings({ fontFamily: e.target.value })}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border font-bold text-sm focus:outline-none transition-all appearance-none cursor-pointer",
                      isDark 
                        ? "bg-slate-900 border-white/5 text-slate-200 focus:border-indigo-500/50" 
                        : "bg-white border-slate-200 text-slate-950 focus:border-indigo-500"
                    )}
                  >
                    {currentFonts.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({['font-sans', 'font-serif', 'font-mono'].includes(f.id) ? 'Preset System Font' : `Google Font: ${f.id}`})
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-[18px] pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500 w-0 h-0"></div>
                </div>
              </div>

              {/* Grid Layout of Selected Fonts with micro-interaction */}
              <div className="space-y-3">
                <label className={cn("block text-[11px] font-black uppercase tracking-wider", isDark ? "text-slate-400" : "text-slate-500")}>
                  Font List (দ্রুত নির্বাচন ও ব্যবস্থাপনা)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentFonts.map((font) => {
                    const isSelected = settings.fontFamily === font.id;
                    const isPreset = ['font-sans', 'font-serif', 'font-mono'].includes(font.id);
                    return (
                      <div
                        key={font.id}
                        onClick={() => updateSettings({ fontFamily: font.id })}
                        className={cn(
                          "p-4 rounded-2xl border transition-all text-left flex flex-col justify-between relative group cursor-pointer overflow-hidden",
                          isSelected 
                            ? "border-indigo-500 shadow-lg shadow-indigo-500/10" 
                            : isDark ? "border-slate-800 hover:border-slate-700 bg-slate-950/40" : "border-slate-100 hover:border-slate-200 bg-slate-50/50"
                        )}
                        style={isSelected ? { borderColor: settings.primaryColor, backgroundColor: `${settings.primaryColor}11` } : {}}
                      >
                        <div className="flex justify-between items-start w-full relative z-10">
                          <div>
                            <p 
                              className={cn("text-sm md:text-base font-bold", isDark ? "text-white" : "text-slate-900")}
                              style={!isPreset ? { fontFamily: `"${font.id}", sans-serif` } : {}}
                            >
                              {font.name}
                            </p>
                            <p className="text-[9px] text-slate-500 font-mono mt-0.5">ID: {font.id}</p>
                          </div>
                          
                          <div className="flex items-center gap-1.5 ml-2">
                            {isSelected && (
                              <span 
                                className="text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded text-white font-mono shrink-0"
                                style={{ backgroundColor: settings.primaryColor }}
                              >
                                Active
                              </span>
                            )}
                            {!isPreset && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteFont(font.id);
                                }}
                                title="Remove font"
                                className="p-1 rounded hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-all focus:outline-none shrink-0"
                              >
                                <Trash2 size={12} />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Text preview block */}
                        <div className="mt-4 pt-3 border-t border-slate-800/5 dark:border-white/5 relative z-10">
                          <p 
                            className={cn("text-xs text-slate-400 leading-tight tracking-wide truncate font-medium")}
                            style={!isPreset ? { fontFamily: `"${font.id}", sans-serif` } : {}}
                          >
                            {font.id === 'Hind Siliguri' ? 'আমাদের অত্যন্ত সুদৃশ্য এবং আকর্ষণীয় ইন্টারফেস ফন্ট' : 'The quick brown fox jumps over the lazy dog'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Customizer input panel */}
            <div className={cn("p-6 rounded-2xl lg:col-span-5 flex flex-col justify-between border", isDark ? "bg-slate-900/60 border-slate-800" : "bg-slate-50 border-slate-200")}>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Palette size={16} className="text-indigo-400" />
                  <h3 className={cn("text-xs font-black uppercase tracking-widest", isDark ? "text-slate-300" : "text-slate-700")}>
                    Add Custom Google Font
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                  Want another font? Type any official name from Google Fonts (like <span className="text-rose-500 font-mono text-[9px]">Roboto</span>, <span className="text-violet-500 font-mono text-[9px]">Montserrat</span>, <span className="text-amber-500 font-mono text-[9px]">Playpen Sans</span>, <span className="text-emerald-500 font-mono text-[9px]">Arimo</span>). We will load it immediately and make it selectable.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 block pl-1">Google Font Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Montserrat"
                      value={newGoogleFontName}
                      onChange={(e) => setNewGoogleFontName(e.target.value)}
                      className={cn(
                        "w-full px-3 py-2 rounded-xl text-[11px] font-bold outline-none border transition-all",
                        isDark 
                          ? "bg-slate-900 border-white/5 text-slate-200 focus:border-indigo-500" 
                          : "bg-white border-slate-200 text-slate-900 focus:border-indigo-500"
                      )}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 block pl-1">Readable Custom Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Montserrat Accent (Sans)"
                      value={newGoogleFontLabel}
                      onChange={(e) => setNewGoogleFontLabel(e.target.value)}
                      className={cn(
                        "w-full px-3 py-2 rounded-xl text-[11px] font-bold outline-none border transition-all",
                        isDark 
                          ? "bg-slate-900 border-white/5 text-slate-200 focus:border-indigo-500" 
                          : "bg-white border-slate-200 text-slate-900 focus:border-indigo-500"
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800/10 dark:border-white/10 mt-6 md:mt-0">
                <button
                  type="button"
                  onClick={handleAddCustomFont}
                  style={{ backgroundColor: settings.primaryColor }}
                  className="w-full text-white font-extrabold text-[10px] md:text-xs tracking-wider uppercase py-2.5 px-4 rounded-xl shadow-md hover:brightness-110 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
                >
                  <Plus size={14} className="stroke-[3]" />
                  Add Custom Font Option
                </button>
              </div>
            </div>

          </div>
        </Card>

        {/* Reset Defaults */}
        <Card className={cn("p-6 md:p-8 md:col-span-2", isDark && "bg-slate-900 border-slate-800")}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", isDark ? "bg-emerald-950 text-emerald-400" : "bg-emerald-50 text-emerald-600")}>
                <RefreshCcw size={20} />
              </div>
              <div>
                <h2 className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>Reset Defaults</h2>
                <p className="text-xs text-slate-500">Restore application theme settings.</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
              Reset Now
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
