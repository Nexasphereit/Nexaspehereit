import { useState, useEffect } from 'react';
import { Plus, Trash2, Download, Printer, Save, UserCircle, ArrowLeft, Globe, Mail, Phone, MapPin, ImageIcon, Briefcase, GraduationCap } from 'lucide-react';
import { Button, Input, Card, ImageUpload } from '../components/common/UI';
import { cn } from '../lib/utils';
import { CV, Experience, Education } from '../types';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { collection, addDoc, serverTimestamp, getDoc, doc, setDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { useTheme } from '../context/ThemeContext';

export default function CVGenerator() {
  const { id } = useParams();
  const { settings } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [cv, setCv] = useState<CV>({
    userId: auth.currentUser?.uid || 'admin',
    fullName: '',
    profession: '',
    aboutMe: '',
    email: '',
    phone: '',
    address: '',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    languages: [
      { language: 'English', proficiency: 'Proficient' },
      { language: 'Bengali', proficiency: 'Native' }
    ],
    hobbies: ['Reading', 'Cricket'],
    experience: [
      { id: '1', company: '', position: '', startDate: '', endDate: '', description: '' }
    ],
    education: [
      { id: '1', institution: '', degree: '', year: '' }
    ],
    socialLinks: [
      { platform: 'LinkedIn', url: '' },
      { platform: 'GitHub', url: '' }
    ]
  });

  useEffect(() => {
    if (id) {
      const fetchCV = async () => {
        setIsLoading(true);
        try {
          const docSnap = await getDoc(doc(db, 'cvs', id));
          if (docSnap.exists()) {
            const data = docSnap.data() as CV;
            setCv({
              ...data,
              fullName: data.fullName || '',
              profession: data.profession || '',
              aboutMe: data.aboutMe || '',
              email: data.email || '',
              phone: data.phone || '',
              address: data.address || '',
              languages: data.languages || [],
              hobbies: data.hobbies || [],
            });
          } else {
            toast.error('CV not found');
          }
        } catch (error) {
          console.error('Error fetching CV:', error);
          toast.error('Failed to load CV');
        } finally {
          setIsLoading(false);
        }
      };
      fetchCV();
    }
  }, [id]);

  const handleAddField = (type: 'experience' | 'education' | 'skills' | 'socialLinks') => {
    if (type === 'experience') {
      setCv(prev => ({
        ...prev,
        experience: [...prev.experience, { id: Math.random().toString(36).substr(2, 9), company: '', position: '', startDate: '', endDate: '', description: '' }]
      }));
    } else if (type === 'education') {
      setCv(prev => ({
        ...prev,
        education: [...prev.education, { id: Math.random().toString(36).substr(2, 9), institution: '', degree: '', year: '' }]
      }));
    } else if (type === 'skills') {
      setCv(prev => ({ ...prev, skills: [...prev.skills, ''] }));
    } else if (type === 'socialLinks') {
       // already handled in button onClick but for consistency
    }
  };

  const handleAddFieldExtended = (type: 'languages' | 'hobbies') => {
    if (type === 'languages') {
      setCv(prev => ({ ...prev, languages: [...prev.languages, { language: '', proficiency: '' }] }));
    } else if (type === 'hobbies') {
      setCv(prev => ({ ...prev, hobbies: [...prev.hobbies, ''] }));
    }
  };

const resolveOklchColor = (colorStr: string): string => {
  if (!colorStr) return '';
  if (!colorStr.includes('oklch') && !colorStr.includes('oklab')) return colorStr;
  
  try {
    const match = colorStr.match(/(?:oklch|oklab)\s*\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*[\/\s]\s*([\d.]+))?\s*\)/i);
    if (match) {
      const L = parseFloat(match[1]);
      const C = parseFloat(match[2]);
      const H = parseFloat(match[3]);
      const A = match[4] ? parseFloat(match[4]) : 1;
      
      if (L > 0.85) {
        return A < 1 ? `rgba(248, 250, 252, ${A})` : '#f8fafc';
      }
      if (L < 0.3) {
        return A < 1 ? `rgba(15, 23, 42, ${A})` : '#0f172a';
      }
      if (C > 0.05) {
        if (H < 60 || H > 340) {
          return A < 1 ? `rgba(225, 29, 72, ${A})` : '#e11d48';
        }
        if (H >= 200 && H < 300) {
          return A < 1 ? `rgba(79, 70, 229, ${A})` : '#4f46e5';
        }
        if (H >= 100 && H < 160) {
          return A < 1 ? `rgba(16, 185, 129, ${A})` : '#10b981';
        }
      }
      return A < 1 ? `rgba(100, 116, 139, ${A})` : '#64748b';
    }
  } catch (e) {
    console.error('Failed parsing oklch color:', colorStr, e);
  }
  return '#1e293b';
};

  const handleDownloadPDF = async () => {
    const element = document.getElementById('cv-preview');
    if (!element) return;
    
    try {
      toast.loading('Generating PDF...', { id: 'pdf' });
      
      const scrollPos = window.scrollY;
      window.scrollTo(0, 0);

      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const preview = clonedDoc.getElementById('cv-preview');
          if (preview) {
             preview.style.height = 'auto';
             preview.style.overflow = 'visible';
             preview.style.boxShadow = 'none';
             preview.style.border = 'none';

             const allElements = preview.getElementsByTagName('*');
             for (let i = 0; i < allElements.length; i++) {
               const el = allElements[i] as HTMLElement;
               el.style.boxShadow = 'none';
               el.style.filter = 'none';
               el.style.transition = 'none';
               el.style.animation = 'none';

               const computed = clonedDoc.defaultView?.getComputedStyle(el);
               if (computed) {
                 const props = ['color', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor'];
                 props.forEach(p => {
                   const value = (computed as any)[p];
                   if (value && (value.includes('oklch') || value.includes('oklab'))) {
                     (el.style as any)[p] = resolveOklchColor(value);
                   }
                 });
               }
             }
          }
        }
      });
      
      window.scrollTo(0, scrollPos);

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`CV-${cv.fullName.trim().replace(/\s+/g, '_') || 'Professional'}.pdf`);
      toast.success('CV Downloaded!', { id: 'pdf' });
    } catch (error) {
      console.error('CV PDF Generation failed:', error);
      toast.error('Download failed. Some images might be blocked.', { id: 'pdf' });
    }
  };

  const handleSave = async () => {
    if (!cv.fullName) return toast.error('Full name is required');
    setIsSaving(true);
    const loadingToast = toast.loading('Saving CV...');
    try {
      if (id) {
        await setDoc(doc(db, 'cvs', id), {
          ...cv,
          userId: auth.currentUser?.uid,
          updatedAt: serverTimestamp(),
        });
        toast.success('CV updated successfully!', { id: loadingToast });
      } else {
        await addDoc(collection(db, 'cvs'), {
          ...cv,
          userId: auth.currentUser?.uid,
          createdAt: serverTimestamp(),
        });
        toast.success('CV saved successfully!', { id: loadingToast });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, 'cvs');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-20 px-4 print:p-0 print:m-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 print:hidden">
        <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={20} />
          <span className="font-bold">Dashboard</span>
        </Link>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={() => window.print()}>
            <Printer size={18} />
            Print
          </Button>
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={handleDownloadPDF}><Download size={18} />PDF</Button>
          <Button variant="primary" size="sm" className="flex-1 sm:flex-none" onClick={handleSave} isLoading={isSaving}><Save size={18} />Save</Button>
        </div>
      </div>

      {/* Mobile/Tablet Segmented Switch Controls */}
      <div className="flex lg:hidden print:hidden bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-2xl mb-6 border border-slate-200/40 dark:border-slate-800/40 max-w-sm mx-auto shadow-inner">
        <button
          onClick={() => setActiveTab('editor')}
          className={cn(
            "flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 touch-manipulation",
            activeTab === 'editor' 
              ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-extrabold" 
              : "text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white"
          )}
        >
          <UserCircle size={15} />
          Edit Details
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={cn(
            "flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 touch-manipulation",
            activeTab === 'preview' 
              ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-extrabold" 
              : "text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white"
          )}
        >
          <ImageIcon size={15} />
          Live Preview
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start print:block">
        {/* Form Column */}
        <div className={cn("space-y-6 print:hidden", activeTab !== 'editor' && "hidden lg:block")}>
          <Card className="space-y-6 print:hidden shadow-xl rounded-2xl p-6">
          <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-2 border-b pb-4">
            <UserCircle className="text-zinc-400" />
            Editor
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={cv.fullName || ''} onChange={e => setCv(p => ({...p, fullName: e.target.value}))} />
            <Input label="Profession" value={cv.profession || ''} onChange={e => setCv(p => ({...p, profession: e.target.value}))} />
          </div>
          <div className="pt-2">
            <ImageUpload 
              label="Profile Photo" 
              value={cv.profilePhoto} 
              onChange={photo => setCv(p => ({...p, profilePhoto: photo}))} 
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input label="Email" type="email" value={cv.email || ''} onChange={e => setCv(p => ({...p, email: e.target.value}))} />
            <Input label="Phone" value={cv.phone || ''} onChange={e => setCv(p => ({...p, phone: e.target.value}))} />
            <Input label="Address" value={cv.address || ''} onChange={e => setCv(p => ({...p, address: e.target.value}))} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 italic">Summary</label>
            <textarea 
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-3xl focus:ring-1 focus:ring-black transition-all outline-none text-slate-900 h-32 text-sm font-medium"
              value={cv.aboutMe || ''}
              placeholder="Describe your professional career..."
              onChange={e => setCv(p => ({...p, aboutMe: e.target.value}))}
            />
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-black tracking-widest text-slate-400">Experience</h3>
              <Button variant="ghost" size="sm" onClick={() => handleAddField('experience')} className="text-black font-black uppercase tracking-widest"><Plus size={16} /> Add Role</Button>
            </div>
            <div className="space-y-4">
              {cv.experience.map((exp, i) => (
                <div key={exp.id} className="p-6 bg-slate-50 rounded-3xl relative space-y-4 shadow-sm border border-slate-100/50">
                   <button className="absolute top-4 right-4 text-slate-300 hover:text-black transition-colors" onClick={() => setCv(p => ({ ...p, experience: p.experience.filter(e => e.id !== exp.id) }))}> <Trash2 size={16} /> </button>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <Input placeholder="Company" value={exp.company || ''} onChange={e => {
                        const newExp = cv.experience.map(item => item.id === exp.id ? { ...item, company: e.target.value } : item);
                        setCv(prev => ({ ...prev, experience: newExp }));
                     }} />
                     <Input placeholder="Position" value={exp.position || ''} onChange={e => {
                        const newExp = cv.experience.map(item => item.id === exp.id ? { ...item, position: e.target.value } : item);
                        setCv(prev => ({ ...prev, experience: newExp }));
                     }} />
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="Start Date" value={exp.startDate || ''} onChange={e => {
                          const newExp = cv.experience.map(item => item.id === exp.id ? { ...item, startDate: e.target.value } : item);
                          setCv(prev => ({ ...prev, experience: newExp }));
                      }} />
                      <Input placeholder="End Date" value={exp.endDate || ''} onChange={e => {
                          const newExp = cv.experience.map(item => item.id === exp.id ? { ...item, endDate: e.target.value } : item);
                          setCv(prev => ({ ...prev, experience: newExp }));
                      }} />
                   </div>
                   <textarea 
                      placeholder="Key achievements and responsibilities..."
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none text-sm h-24 font-medium focus:ring-1 focus:ring-black"
                      value={exp.description || ''}
                      onChange={e => {
                          const newExp = cv.experience.map(item => item.id === exp.id ? { ...item, description: e.target.value } : item);
                          setCv(prev => ({ ...prev, experience: newExp }));
                      }}
                   />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-black tracking-widest text-slate-400">Social & Languages</h3>
              <Button variant="ghost" size="sm" onClick={() => handleAddFieldExtended('languages')} className="text-black font-black uppercase tracking-widest"><Plus size={16} /> Add Entry</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {cv.languages.map((lang, i) => (
                <div key={i} className="flex gap-2 p-2 bg-slate-50 rounded-2xl border border-slate-100">
                  <Input 
                    placeholder="Lang" 
                    value={lang.language}
                    className="flex-1 text-xs"
                    onChange={e => setCv(p => {
                      const newLangs = [...p.languages];
                      newLangs[i].language = e.target.value;
                      return { ...p, languages: newLangs };
                    })}
                  />
                  <Input 
                    placeholder="Level" 
                    value={lang.proficiency}
                    className="flex-1 text-xs"
                    onChange={e => setCv(p => {
                      const newLangs = [...p.languages];
                      newLangs[i].proficiency = e.target.value;
                      return { ...p, languages: newLangs };
                    })}
                  />
                  <button onClick={() => setCv(p => ({ ...p, languages: p.languages.filter((_, idx) => idx !== i) }))} className="text-slate-300 hover:text-black">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>
        </div>
 
        {/* CV Preview - Colorful in Browser, B&W in Print */}
        <div className={cn("sticky top-8 print:static print:block print:w-full overflow-x-auto lg:overflow-visible", activeTab !== 'preview' && "hidden lg:block")}>
          <style>
            {`
              @media print {
                #cv-preview {
                  box-shadow: none !important;
                  border: none !important;
                  width: 210mm !important;
                }
                #cv-sidebar {
                  background-color: #000 !important;
                  color: #fff !important;
                }
                #cv-sidebar * {
                  color: #fff !important;
                }
                #cv-content {
                  background-color: #fff !important;
                  color: #000 !important;
                }
                #cv-content * {
                  color: #000 !important;
                  border-color: #000 !important;
                }
                #cv-content .accent-bg {
                  background-color: #000 !important;
                }
                .grayscale-print {
                  filter: grayscale(100%) contrast(150%) !important;
                }
              }
            `}
          </style>
          <div id="cv-preview" className="bg-white shadow-2xl rounded-sm border border-slate-100 text-slate-900 font-sans print:shadow-none print:border-none print:p-0 print:m-0 w-full md:w-[210mm] min-h-[297mm] mx-auto flex flex-col md:flex-row overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
            
            {/* SIDEBAR */}
            <div id="cv-sidebar" className="w-full md:w-[34%] text-white p-8 flex flex-col gap-10 shrink-0" style={{ backgroundColor: settings.primaryColor }}>
               {/* Profile Photo */}
               <div className="flex justify-center mt-6">
                 <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/20 p-1.5 bg-white/10 shadow-2xl">
                   {cv.profilePhoto ? (
                     <img src={cv.profilePhoto} alt="Profile" className="w-full h-full object-cover rounded-full grayscale-print" crossOrigin="anonymous" />
                   ) : (
                     <div className="w-full h-full bg-black/20 flex items-center justify-center rounded-full">
                       <UserCircle size={80} className="text-white/20" />
                     </div>
                   )}
                 </div>
               </div>

               <div className="text-center space-y-2">
                 <h2 className="text-3xl font-black tracking-tight uppercase leading-none">{cv.fullName || 'YOUR NAME'}</h2>
                 <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">{cv.profession || 'PROFESSION TITLE'}</p>
               </div>

               <div className="space-y-6">
                 <h3 className="text-xs font-black tracking-[0.15em] border-b border-white/20 pb-2 uppercase text-white/50">Contact</h3>
                 <div className="space-y-4">
                    {[
                      { icon: <Phone size={14} />, label: 'Phone', value: cv.phone || '+00 000 0000' },
                      { icon: <Mail size={14} />, label: 'Email', value: cv.email || 'mail@domain.com' },
                      { icon: <MapPin size={14} />, label: 'Location', value: cv.address || 'City, Country' }
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center shrink-0">
                          {item.icon}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black opacity-100 uppercase tracking-wider">{item.value}</span>
                        </div>
                      </div>
                    ))}
                 </div>
               </div>

               <div className="space-y-6">
                 <h3 className="text-xs font-black tracking-[0.15em] border-b border-white/20 pb-2 uppercase text-white/50">Core Expertise</h3>
                 <div className="space-y-2.5">
                    {cv.skills.map((skill, i) => skill && (
                      <div key={i} className="flex items-center gap-3">
                         <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                         <span className="text-[11px] font-black uppercase tracking-wide">{skill}</span>
                      </div>
                    ))}
                 </div>
               </div>

               <div className="space-y-6">
                 <h3 className="text-xs font-black tracking-[0.15em] border-b border-white/20 pb-2 uppercase text-white/50">Languages</h3>
                 <div className="space-y-3">
                    {cv.languages?.map((lang, i) => lang.language && (
                      <div key={i} className="flex justify-between items-center group">
                         <span className="text-[11px] font-black uppercase">{lang.language}</span>
                         <span className="text-[9px] font-black px-2 py-0.5 bg-black/20 rounded uppercase tracking-tighter text-white/60">{lang.proficiency}</span>
                      </div>
                    ))}
                 </div>
               </div>
            </div>

            {/* CONTENT SIDE */}
            <div id="cv-content" className="flex-1 p-8 md:p-12 py-12 md:py-16 space-y-12 bg-white">
               <section>
                 <div className="flex items-center gap-4 mb-4">
                   <h3 className="text-xl font-black text-black tracking-[0.1em] uppercase">Professional Profile</h3>
                   <div className="h-2 flex-1 accent-bg" style={{ backgroundColor: settings.primaryColor }} />
                 </div>
                 <p className="text-[12px] leading-relaxed text-zinc-800 font-medium whitespace-pre-wrap antialiased">
                   {cv.aboutMe || 'Professional summary describing your key credentials and success stories...'}
                 </p>
               </section>

               <section>
                 <div className="flex items-center gap-4 mb-8">
                   <h3 className="text-xl font-black text-black tracking-[0.1em] uppercase">Executive Experience</h3>
                   <div className="h-2 flex-1 accent-bg" style={{ backgroundColor: settings.primaryColor }} />
                 </div>
                 <div className="space-y-10">
                    {cv.experience.map((exp, index) => (
                      <div key={index} className="relative pl-8 border-l border-zinc-100 space-y-2">
                        <div className="absolute -left-[5px] top-1.5 w-[9px] h-[9px] rounded-full shadow-[0_0_0_4px_white] accent-bg" style={{ backgroundColor: settings.primaryColor }} />
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                          <div>
                            <h4 className="text-[15px] font-black text-black uppercase">{exp.position || 'Professional Title'}</h4>
                            <p className="text-[13px] font-black text-zinc-400 tracking-tight">{exp.company || 'Company Entity'}</p>
                          </div>
                          <span className="text-[9px] font-black text-white px-3 py-1 rounded-sm uppercase tracking-widest accent-bg" style={{ backgroundColor: settings.primaryColor }}>{exp.startDate} • {exp.endDate || 'Present'}</span>
                        </div>
                        <p className="text-[12px] leading-relaxed text-zinc-600 font-medium mt-3 whitespace-pre-wrap">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                 </div>
               </section>

               <section>
                 <div className="flex items-center gap-4 mb-8">
                   <h3 className="text-xl font-black text-black tracking-[0.1em] uppercase">Academic Credentials</h3>
                   <div className="h-2 flex-1 accent-bg" style={{ backgroundColor: settings.primaryColor }} />
                 </div>
                 <div className="grid grid-cols-1 gap-6">
                    {cv.education.map((edu, index) => (
                      <div key={index} className="flex justify-between items-start group">
                        <div className="space-y-0.5">
                           <h4 className="text-[14px] font-black text-black uppercase tracking-tight">{edu.degree || 'Degree Program'}</h4>
                           <p className="text-[12px] font-bold text-zinc-400 italic">{edu.institution || 'Institution Name'}</p>
                        </div>
                        <span className="text-[10px] font-black border-b-[3px] pb-0.5" style={{ borderColor: settings.primaryColor }}>{edu.year}</span>
                      </div>
                    ))}
                 </div>
               </section>

               <div className="mt-auto pt-10 text-right">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-zinc-300">Professional Edition • CV-{new Date().getFullYear()}</p>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
