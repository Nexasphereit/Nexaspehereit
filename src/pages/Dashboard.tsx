import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, UserCircle, Receipt as ReceiptIcon, ArrowRight, Settings as SettingsIcon, Search, Sparkles, History as HistoryIcon, Building2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

export default function Dashboard() {
  const { settings } = useTheme();
  const isDark = settings.sidebarTheme === 'dark';
  const navigate = useNavigate();
  
  const [quotationsSnap] = useCollection(query(collection(db, 'quotations'), where('userId', '==', auth.currentUser?.uid || '')));
  const [cvsSnap] = useCollection(query(collection(db, 'cvs'), where('userId', '==', auth.currentUser?.uid || '')));
  const [receiptsSnap] = useCollection(query(collection(db, 'receipts'), where('userId', '==', auth.currentUser?.uid || '')));

  const totalDocs = (quotationsSnap?.size || 0) + (cvsSnap?.size || 0) + (receiptsSnap?.size || 0);

  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Close search on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Map documents dynamically
  const documents = [
    ...(quotationsSnap?.docs.map(d => ({
      id: d.id,
      type: 'Quotation',
      title: d.data().quotationNumber || 'Untitled Quotation',
      subtitle: d.data().clientName || 'No Client',
      path: `/quotations/${d.id}`,
      date: d.data().date || (d.data().createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })) || '',
    })) || []),
    ...(cvsSnap?.docs.map(d => ({
      id: d.id,
      type: 'CV / Resume',
      title: d.data().fullName || 'Untitled CV',
      subtitle: d.data().jobTitle || 'No Job Title',
      path: `/cvs/${d.id}`,
      date: (d.data().createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })) || '',
    })) || []),
    ...(receiptsSnap?.docs.map(d => ({
      id: d.id,
      type: 'Money Receipt',
      title: d.data().receiptNumber || 'Untitled Receipt',
      subtitle: d.data().receivedFrom || 'No Beneficiary',
      path: `/receipts/${d.id}`,
      date: d.data().date || (d.data().createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })) || '',
    })) || []),
  ];

  // Static tools & static actions that can also be searched
  const toolItems = [
    { title: 'Quotation Generator', path: '/quotations', desc: 'Create and generate client quotations', icon: <FileText size={16} /> },
    { title: 'Resume Creator / CV', path: '/cvs', desc: 'Build professional resumes / CVs', icon: <UserCircle size={16} /> },
    { title: 'Money Receipt Generator', path: '/receipts', desc: 'Record payments of accounts', icon: <ReceiptIcon size={16} /> },
    { title: 'History & Archive', path: '/history', desc: 'Track and manage generated files', icon: <HistoryIcon size={16} /> },
    { title: 'Settings Panel', path: '/settings', desc: 'Configure themes, styling and logos', icon: <SettingsIcon size={16} /> },
  ];

  // Filter both lists based on query
  const filteredTools = toolItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDocs = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasResults = filteredTools.length > 0 || filteredDocs.length > 0;

  return (
    <div className="space-y-8 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className={cn("text-3xl font-black tracking-tighter italic uppercase", isDark ? "text-white" : "text-slate-900")}>
            NexaSphere <span style={{ color: settings.primaryColor }}>Dashboard</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium italic">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
        
        <div ref={searchContainerRef} className="relative w-full md:w-80 z-20">
          <div className="relative flex items-center">
            <Search className={cn("absolute left-4 w-4 h-4", isDark ? "text-slate-400" : "text-slate-500")} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Search tools & docs..." 
              className={cn(
                "border-none rounded-full pl-11 pr-5 py-2.5 text-sm w-full outline-none ring-2 ring-transparent transition-all font-medium",
                isDark ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-900"
              )}
              onFocusCapture={(e) => {
                e.currentTarget.style.boxShadow = `0 0 0 2px ${settings.primaryColor}`;
              }}
              onBlurCapture={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 0px transparent';
              }}
            />
          </div>

          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  "absolute right-0 mt-3 w-full md:w-[26rem] max-h-[32rem] overflow-y-auto rounded-3xl p-4 shadow-2xl border backdrop-blur-xl z-50 flex flex-col gap-4",
                  isDark 
                    ? "bg-[#02020a]/90 border-white/10 text-white shadow-black/85" 
                    : "bg-white/95 border-slate-200 text-slate-900 shadow-slate-200/50"
                )}
              >
                {/* Tools / Generators matched */}
                {filteredTools.length > 0 && (
                  <div>
                    <h4 className={cn("text-[10px] font-black uppercase tracking-[0.2em] px-2 mb-2 flex items-center gap-1.5", isDark ? "text-slate-400" : "text-slate-500")}>
                      <Sparkles size={10} style={{ color: settings.primaryColor }} />
                      Tools & Sections
                    </h4>
                    <div className="space-y-1">
                      {filteredTools.map((tool, idx) => (
                        <div
                          key={`tool-${idx}`}
                          onClick={() => {
                            navigate(tool.path);
                            setIsFocused(false);
                            setSearchQuery('');
                          }}
                          className={cn(
                            "flex items-center gap-3 p-2.5 rounded-2xl cursor-pointer transition-all",
                            isDark ? "hover:bg-white/[0.06]" : "hover:bg-slate-100"
                          )}
                        >
                          <div 
                            className="p-2 rounded-xl shrink-0"
                            style={{ backgroundColor: `${settings.primaryColor}15`, color: settings.primaryColor }}
                          >
                            {tool.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold leading-none">{tool.title}</p>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5">{tool.desc}</p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Docs matched */}
                {filteredDocs.length > 0 && (
                  <div>
                    <h4 className={cn("text-[10px] font-black uppercase tracking-[0.2em] px-2 mb-2 flex items-center gap-1.5", isDark ? "text-slate-400" : "text-slate-500")}>
                      <FileText size={10} style={{ color: settings.primaryColor }} />
                      Recent Documents
                    </h4>
                    <div className="space-y-1">
                      {filteredDocs.map((doc, idx) => (
                        <div
                          key={`doc-${idx}`}
                          onClick={() => {
                            navigate(doc.path);
                            setIsFocused(false);
                            setSearchQuery('');
                          }}
                          className={cn(
                            "flex items-center justify-between gap-3 p-2.5 rounded-2xl cursor-pointer transition-all",
                            isDark ? "hover:bg-white/[0.06]" : "hover:bg-slate-100"
                          )}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md" style={{ backgroundColor: `${settings.primaryColor}10`, color: settings.primaryColor }}>
                                {doc.type}
                              </span>
                              <p className="text-xs font-bold truncate leading-none">{doc.title}</p>
                            </div>
                            <p className="text-[10px] text-slate-500 truncate mt-1">{doc.subtitle}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-[9px] text-slate-500">{doc.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!hasResults && (
                  <div className="text-center py-6">
                    <p className="text-xs text-slate-500 italic font-medium">No results found for "{searchQuery}"</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6 items-stretch">
        {/* Main Hero Card: Quotation */}
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className={cn(
             "col-span-12 lg:col-span-8 rounded-3xl border shadow-2xl p-8 flex flex-col justify-between group h-full relative overflow-hidden transition-all duration-300 backdrop-blur-xl",
             isDark ? "bg-slate-950/35 border-white/10 shadow-black/30" : "bg-white border-slate-200"
           )}
        >
          <div 
            className="absolute top-0 right-0 w-64 h-64 rounded-full -mr-32 -mt-32 blur-3xl opacity-10" 
            style={{ backgroundColor: settings.primaryColor }}
          />
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-lg"
                style={{ 
                  backgroundColor: `${settings.primaryColor}15`, 
                  color: settings.primaryColor,
                  boxShadow: `0 8px 16px -4px ${settings.primaryColor}33`
                }}
              >
                <FileText size={28} />
              </div>
              <span 
                className="text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border"
                style={{ 
                  color: settings.primaryColor, 
                  backgroundColor: `${settings.primaryColor}05`,
                  borderColor: `${settings.primaryColor}22`
                }}
              >
                Priority Tool
              </span>
            </div>
            <h2 className={cn("text-4xl font-black mb-4 tracking-tighter italic uppercase", isDark ? "text-white" : "text-slate-900")}>
              QUOTATION <span style={{ color: settings.primaryColor }}>GENERATOR</span>
            </h2>
            <p className="text-slate-500 max-w-md leading-relaxed font-medium italic">Create premium, high-converting PDF quotations for your IT clients. Features automated calculations and branding.</p>
          </div>
          
          <div className="flex items-center justify-between mt-12 relative z-10">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={cn(
                  "w-10 h-10 rounded-full border-4 flex items-center justify-center text-xs font-black",
                  isDark ? "border-slate-900" : "border-white",
                  i === 1 && "text-white",
                  i === 4 && (isDark ? "bg-black text-white" : "bg-slate-900 text-white"),
                  i !== 1 && i !== 4 && (isDark ? "bg-slate-800 text-slate-500" : "bg-slate-100 text-slate-400")
                )}
                  style={i === 1 ? { backgroundColor: settings.primaryColor } : {}}>
                  {i === 4 ? `+${totalDocs}` : 'NS'}
                </div>
              ))}
            </div>
            <Link to="/quotations">
              <button 
                className="text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 flex items-center gap-3 hover:brightness-110 shadow-2xl"
                style={{ 
                  backgroundColor: settings.primaryColor,
                  boxShadow: `0 12px 24px -10px ${settings.primaryColor}`
                }}
              >
                Create Quotation
                <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Quick Stats Card */}
        <div className={cn(
          "col-span-12 lg:col-span-4 rounded-3xl p-8 flex flex-col justify-between min-h-[300px] h-full relative overflow-hidden transition-all duration-300 shadow-2xl backdrop-blur-xl",
          isDark ? "bg-slate-950/35 border border-white/10 shadow-black/30" : "bg-black text-white shadow-black/10"
        )}>
          <div 
            className="absolute bottom-0 right-0 w-32 h-32 rounded-full -mr-16 -mb-16 blur-3xl opacity-30" 
            style={{ backgroundColor: settings.primaryColor }}
          />
          <div className="flex justify-between items-center relative z-10">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Global Status</span>
            <div 
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ 
                backgroundColor: settings.primaryColor,
                boxShadow: `0 0 15px ${settings.primaryColor}`
              }}
            ></div>
          </div>
          <div className="relative z-10">
            <div className="text-7xl font-black mb-3 tracking-tighter italic text-white">{totalDocs}</div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-1">Documents Generated</p>
          </div>
          <div className="space-y-4 relative z-10">
             <div className={cn("h-1.5 w-full rounded-full overflow-hidden", isDark ? "bg-slate-900" : "bg-slate-800")}>
                <div 
                  className="h-full transition-all duration-1000" 
                  style={{ 
                    width: `${Math.min(totalDocs * 5, 100)}%`, 
                    backgroundColor: settings.primaryColor,
                    boxShadow: `0 0 10px ${settings.primaryColor}aa`
                  }}
                ></div>
             </div>
             <div className="flex justify-between items-center">
               <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Growth Engine</p>
               <p className="text-[10px] font-black" style={{ color: settings.primaryColor }}>+14.2%</p>
             </div>
          </div>
        </div>

        {/* Tools Section */}
        <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
           {[
             { title: 'IT Sales Hub', icon: <Building2 size={22} />, path: '/it-sales', desc: 'Enterprise Tracking & CRM' },
             { title: 'Resume Creator', icon: <UserCircle size={22} />, path: '/cvs', desc: 'Professional CV Design' },
             { title: 'Money Receipt', icon: <ReceiptIcon size={22} />, path: '/receipts', desc: 'Payment Invoicing' }
           ].map((tool, i) => (
             <Link key={i} to={tool.path} className="flex flex-col group">
               <motion.div 
                 whileHover={{ y: -5 }}
                 className={cn(
                   "p-8 rounded-[2.5rem] border transition-all flex flex-col gap-5 flex-1 relative overflow-hidden",
                   isDark ? "bg-slate-950/35 border-white/10 hover:bg-white/[0.06] hover:border-white/20 hover:shadow-indigo-500/5 shadow-2xl backdrop-blur-xl" : "bg-white border-slate-200 hover:shadow-2xl hover:shadow-black/5"
                 )}
               >
                 <div className="flex items-center justify-between relative z-10">
                    <div 
                      className="p-4 rounded-2xl transition-transform group-hover:scale-110" 
                      style={{ backgroundColor: 'var(--primary-brand-soft)', color: settings.primaryColor }}
                    >
                      {tool.icon}
                    </div>
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center border transition-colors",
                      isDark ? "border-slate-800 group-hover:bg-white group-hover:text-black" : "border-slate-100 group-hover:bg-black group-hover:text-white"
                    )}>
                      <ArrowRight size={18} />
                    </div>
                 </div>
                 <div className="relative z-10">
                   <h3 className={cn("text-xl font-black uppercase tracking-tight italic", isDark ? "text-white" : "text-slate-900")}>{tool.title}</h3>
                   <p className="text-sm text-slate-500 font-medium italic mt-1">{tool.desc}</p>
                 </div>
                 
                 {/* Decor */}
                 <div className={cn(
                   "absolute top-0 right-0 w-32 h-32 rounded-full -mr-16 -mt-16 opacity-30 transition-colors",
                   isDark ? "bg-white/5" : "bg-slate-50"
                 )} />
               </motion.div>
             </Link>
           ))}
        </div>

        {/* Pro Tip Card */}
        <div 
          className="col-span-12 border rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 group"
          style={{ 
            backgroundColor: `${settings.primaryColor}05`,
            borderColor: `${settings.primaryColor}15`
          }}
        >
          <div className="flex items-center gap-6">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg"
              style={{ backgroundColor: settings.primaryColor }}
            >
              <SettingsIcon size={24} className="group-hover:rotate-90 transition-transform duration-500" />
            </div>
            <div>
              <p className={cn("font-black uppercase italic", isDark ? "text-white" : "text-slate-900")}>PRO TIP: PERSONALIZATION</p>
              <p className="text-sm text-slate-500 font-medium italic">Head over to Settings to change your application font and primary theme color!</p>
            </div>
          </div>
          <Link to="/settings" className="w-full md:w-auto">
            <button 
              className="w-full md:w-auto px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border group-hover:shadow-md"
              style={{ 
                color: settings.primaryColor, 
                borderColor: `${settings.primaryColor}33`,
                backgroundColor: isDark ? '#1e293b' : 'white'
              }}
            >
              Configure Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
