import React from 'react';
import { motion } from 'motion/react';
import { Palette, Type, RefreshCcw, Save, Moon, Sun, Building2 } from 'lucide-react';
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

const FONTS = [
  { name: 'Modern Sans', id: 'font-sans' },
  { name: 'Classic Serif', id: 'font-serif' },
  { name: 'Technical Mono', id: 'font-mono' },
];

const Settings = () => {
  const { settings, updateSettings, toggleDarkMode } = useTheme();

  const handleReset = () => {
    updateSettings({
      primaryColor: '#000000',
      fontFamily: 'font-sans',
      sidebarTheme: 'light',
      companyLogo: '',
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
        {/* Brand Assets */}
        <Card className={cn("p-6 md:p-8", isDark && "bg-slate-900 border-slate-800")}>
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className={cn("p-2 rounded-lg", isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500")}>
              <Building2 size={20} />
            </div>
            <h2 className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>Brand Assets</h2>
          </div>
          
          <ImageUpload 
            label="Default Company Logo" 
            value={settings.companyLogo}
            onChange={(logo) => updateSettings({ companyLogo: logo })}
            className="w-full"
          />
          <p className="text-[10px] text-slate-400 mt-2 font-medium italic">* This logo will be used as default for all your documents.</p>
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
                      settings.sidebarColor === color ? "border-slate-900 scale-110" : "border-transparent"
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

        {/* Typography */}
        <Card className={cn("p-6 md:p-8", isDark && "bg-slate-900 border-slate-800")}>
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <div className={cn("p-2 rounded-lg", isDark ? "bg-indigo-950 text-indigo-400" : "bg-indigo-50 text-indigo-600")}>
              <Type size={20} />
            </div>
            <h2 className={cn("text-lg font-bold", isDark ? "text-white" : "text-slate-900")}>Typography</h2>
          </div>

          <div className="space-y-4">
            {FONTS.map((font) => (
              <button
                key={font.id}
                onClick={() => updateSettings({ fontFamily: font.id })}
                className={cn(
                  "w-full p-4 md:p-6 rounded-2xl border transition-all text-left flex items-center justify-between",
                  settings.fontFamily === font.id 
                    ? `border-primary bg-primary/10` 
                    : isDark ? "border-slate-800 hover:border-slate-700 hover:bg-slate-900" : "border-slate-100 hover:border-slate-200"
                )}
                style={settings.fontFamily === font.id ? { borderColor: settings.primaryColor, backgroundColor: `${settings.primaryColor}11` } : {}}
              >
                <div>
                   <p className={cn("text-base md:text-lg font-bold", font.id, isDark ? "text-white" : "text-slate-900")}>{font.name}</p>
                   <p className="text-[10px] md:text-xs text-slate-500 mt-1">The quick brown fox jumps over the lazy dog</p>
                </div>
                {settings.fontFamily === font.id && (
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-white shrink-0" style={{ backgroundColor: settings.primaryColor }}>
                    <Save size={12} />
                  </div>
                )}
              </button>
            ))}
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
