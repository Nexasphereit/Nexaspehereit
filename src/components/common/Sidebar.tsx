import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  UserCircle, 
  Receipt as ReceiptIcon, 
  History, 
  Settings as SettingsIcon, 
  Menu, 
  X,
  LogOut,
  Sun,
  Moon,
  Building2,
  Sparkles
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/src/lib/utils';
import { useTheme } from '../../context/ThemeContext';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Building2, label: 'IT Sales Hub', path: '/it-sales' },
  { icon: FileText, label: 'Quotation', path: '/quotations' },
  { icon: UserCircle, label: 'CV / Resume', path: '/cvs' },
  { icon: ReceiptIcon, label: 'Money Receipt', path: '/receipts' },
  { icon: History, label: 'History', path: '/history' },
  { icon: SettingsIcon, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const { settings, toggleDarkMode } = useTheme();
  const location = useLocation();
  const isDark = settings.sidebarTheme === 'dark';

  useEffect(() => {
    // Set open by default on desktop
    if (window.innerWidth >= 768) {
      setIsOpen(true);
    }
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem('customUser');
    await signOut(auth);
    window.location.reload();
  };

  const isDocCreationActive = ['/quotations', '/cvs', '/receipts'].some(p => location.pathname.startsWith(p));

  const mobileNavItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/' },
    { icon: Building2, label: 'Sales', path: '/it-sales' },
    { isCreateCenter: true },
    { icon: History, label: 'History', path: '/history' },
    { icon: SettingsIcon, label: 'Settings', path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Top Header Bar */}
      <div className={cn(
        "fixed top-0 left-0 right-0 h-14 z-40 md:hidden print:hidden flex items-center justify-between px-6 border-b backdrop-blur-xl transition-all",
        isDark 
          ? "bg-slate-950/40 text-white border-slate-900/60" 
          : "bg-white/90 text-slate-900 border-slate-100"
      )}>
        <div className="flex items-center gap-2">
          {settings.companyLogo ? (
            <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 shadow-md">
              <img src={settings.companyLogo} alt="Logo" className="w-full h-full object-contain bg-white" />
            </div>
          ) : (
            <div 
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-md text-white font-black text-xs"
              style={{ background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.primaryColor}dd)` }}
            >
              N
            </div>
          )}
          <span className="font-extrabold text-sm tracking-tight">
            {settings.companyLogo ? 'Workspace' : 'NexaSphere'}
          </span>
        </div>

        {/* Action Buttons for Top Bar */}
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleDarkMode}
            className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
              isDark ? "bg-slate-900/50 text-yellow-400" : "bg-slate-50 text-orange-500"
            )}
            title="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          
          <NavLink
            to="/settings"
            className={({ isActive }) => cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-all",
              isActive 
                ? "text-white" 
                : isDark ? "bg-slate-900/50 text-slate-400" : "bg-slate-50 text-slate-500"
            )}
            style={({ isActive }) => isActive ? { backgroundColor: settings.primaryColor } : {}}
            title="Settings"
          >
            <SettingsIcon size={16} />
          </NavLink>

          <button 
            onClick={handleLogout}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      {/* Mobile Elevated Bottom Floating Dock Bar */}
      <div className={cn(
        "fixed bottom-4 left-4 right-4 h-16 z-40 md:hidden print:hidden flex items-center justify-around px-2 rounded-full border shadow-[0_16px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_16px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all",
        isDark 
          ? "bg-slate-950/70 border-slate-800/80 text-white" 
          : "bg-white/95 border-slate-100 text-slate-900"
      )}>
        {mobileNavItems.map((item, idx) => {
          if (item.isCreateCenter) {
            return (
              <button
                key="mob-ctr"
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className="w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all relative shrink-0 active:scale-90"
                style={{
                  backgroundColor: isDocCreationActive ? settings.primaryColor : 'transparent',
                  color: isDocCreationActive ? '#ffffff' : (isDark ? '#94a3b8' : '#64748b'),
                  boxShadow: isDocCreationActive ? `0 8px 16px -4px ${settings.primaryColor}88` : 'none',
                  border: isDocCreationActive ? 'none' : '1px dashed currentColor'
                }}
              >
                <Sparkles size={18} className="shrink-0" />
                <span className="text-[7px] font-black uppercase tracking-wider mt-0.5 max-w-full truncate">
                  Create
                </span>
              </button>
            );
          }

          const Icon = item.icon!;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all relative group touch-manipulation",
                isActive 
                  ? "text-white scale-105" 
                  : isDark ? "text-slate-400" : "text-slate-500"
              )}
              style={isActive ? {
                backgroundColor: settings.primaryColor,
                boxShadow: `0 8px 16px -4px ${settings.primaryColor}88`
              } : {}}
            >
              <Icon size={18} className="shrink-0" />
              <span className="text-[7px] font-black uppercase tracking-wider mt-0.5 max-w-full truncate">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>

      {/* Mobile Bottom Tools sliding Drawer */}
      <AnimatePresence>
        {isToolsOpen && (
          <>
            {/* Dark blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsToolsOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
            />
            {/* Bottom Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className={cn(
                "fixed bottom-0 left-0 right-0 rounded-t-[2.5rem] z-50 p-6 pb-28 md:hidden shadow-[0_-12px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_-12px_40px_rgba(0,0,0,0.8)] border-t",
                isDark 
                  ? "bg-slate-950/95 border-slate-800 text-white" 
                  : "bg-white border-slate-100 text-slate-900"
              )}
            >
              {/* Grab bar indicator */}
              <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-6" />

              <div className="text-center mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">
                  Document Suite
                </h3>
                <p className="text-[10px] text-slate-400 font-medium italic mt-1">Select a creator blueprint to get started</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: FileText, label: 'Quotation', path: '/quotations', desc: 'SLA Prices', color: settings.primaryColor },
                  { icon: UserCircle, label: 'Resume / CV', path: '/cvs', desc: 'Profiles', color: '#10b981' },
                  { icon: ReceiptIcon, label: 'Receipt', path: '/receipts', desc: 'Record bills', color: '#ec4899' },
                ].map((tool) => {
                  const ToolIcon = tool.icon;
                  return (
                    <NavLink
                      key={tool.path}
                      to={tool.path}
                      onClick={() => setIsToolsOpen(false)}
                      className={cn(
                        "flex flex-col items-center justify-center p-4 rounded-3xl transition-all border text-left",
                        isDark 
                          ? "bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/80" 
                          : "bg-slate-50/50 border-slate-100 hover:bg-slate-100/50"
                      )}
                    >
                      <div 
                        className="w-11 h-11 rounded-2xl flex items-center justify-center mb-2.5 shadow-sm"
                        style={{ backgroundColor: `${tool.color}15`, color: tool.color }}
                      >
                        <ToolIcon size={20} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-wide text-center truncate w-full">
                        {tool.label === 'Resume / CV' ? 'Resume' : tool.label}
                      </span>
                      <span className="text-[8px] text-slate-400 font-bold truncate w-full text-center mt-1 uppercase tracking-widest">
                        {tool.desc}
                      </span>
                    </NavLink>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar Container - Desktop */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 280 : 80 }}
        className={cn(
          "fixed left-0 top-0 h-screen transition-all z-40 hidden md:flex flex-col border-r shadow-[20px_0_40px_-20px_rgba(0,0,0,0.05)] backdrop-blur-3xl",
          isDark 
            ? "bg-slate-950/35 text-slate-300 border-slate-900/50" 
            : "bg-white text-slate-600 border-slate-100",
          !isOpen && "items-center"
        )}
        style={settings.sidebarColor ? { backgroundColor: isDark ? `${settings.sidebarColor}55` : settings.sidebarColor } : {}}
      >
        <div className={cn("p-6 flex items-center gap-3 border-b", isDark ? "border-slate-900" : "border-slate-50")}>
          {settings.companyLogo ? (
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-lg border-2 border-slate-100">
               <img src={settings.companyLogo} alt="Logo" className="w-full h-full object-contain bg-white" />
            </div>
          ) : (
            <div 
               className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
               style={{ 
                 background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.primaryColor}dd)`,
                 boxShadow: `0 8px 16px -4px ${settings.primaryColor}44`
               }}
            >
               <span className="font-black text-white text-lg">N</span>
            </div>
          )}
          {isOpen && (
            <div className="flex flex-col overflow-hidden">
              <span className={cn("font-black text-xl tracking-tighter truncate leading-none", isDark ? "text-white" : "text-slate-900")}>
                {settings.companyLogo ? 'Workspace' : 'NexaSphere'}
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] mt-1" style={{ color: settings.primaryColor }}>Managed Brand</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest relative group",
                isActive 
                  ? "text-white shadow-lg" 
                  : isDark ? "text-slate-500 hover:text-white hover:bg-slate-900" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50",
                !isOpen && "justify-center px-0"
              )}
              style={({ isActive }) => isActive ? {
                backgroundColor: settings.primaryColor,
                boxShadow: `0 8px 16px -4px ${settings.primaryColor}55`
              } : {}}
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} className={cn("shrink-0 transition-transform group-hover:scale-110", isActive ? "text-white" : isDark ? "group-hover:text-white" : "group-hover:text-slate-900")} />
                  {isOpen && <span className="truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className={cn("p-6 border-t", isDark ? "border-slate-900" : "border-slate-50")}>
          <button 
             onClick={toggleDarkMode}
             className={cn(
               "flex items-center gap-3 px-4 py-3 w-full rounded-2xl transition-all mb-2 font-bold group",
               isDark ? "hover:bg-slate-900 text-slate-400 hover:text-yellow-400" : "hover:bg-slate-50 text-slate-400 hover:text-orange-500",
               !isOpen && "justify-center px-0"
             )}
          >
            {isDark ? <Sun size={20} className="transition-transform group-hover:rotate-45" /> : <Moon size={20} className="transition-transform group-hover:-rotate-12" />}
            {isOpen && <span className="text-sm">{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          {isOpen && (
             <div className={cn("rounded-2xl p-4 mb-4 border backdrop-blur-sm", isDark ? "bg-slate-950/30 border-slate-800/80 shadow-inner" : "bg-slate-50 border-slate-100")}>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: settings.primaryColor }}>User Profile</p>
                <p className={cn("text-xs font-bold truncate", isDark ? "text-slate-300" : "text-slate-900")}>{auth.currentUser?.email}</p>
             </div>
          )}
          <button 
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 px-4 py-3 w-full rounded-2xl transition-all font-bold group",
              isDark ? "hover:bg-red-900/20 hover:text-red-400 text-slate-500" : "hover:bg-red-50 hover:text-red-500 text-slate-400",
              !isOpen && "justify-center px-0"
            )}
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
            {isOpen && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
