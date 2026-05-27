import { useState, useEffect } from 'react';
import { Plus, Trash2, Download, Printer, Save, FileText, ArrowLeft, ImageIcon } from 'lucide-react';
import { Button, Input, Card, ImageUpload } from '../components/common/UI';
import { cn } from '../lib/utils';
import { Quotation, QuotationItem } from '../types';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { collection, addDoc, serverTimestamp, getDoc, doc, setDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { useTheme } from '../context/ThemeContext';

export default function QuotationGenerator() {
  const { id } = useParams();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [quotation, setQuotation] = useState<Quotation>({
    userId: auth.currentUser?.uid || 'admin',
    quotationNumber: `QT-${Date.now().toString().slice(-6)}`,
    documentTitle: 'Quotation',
    date: new Date().toISOString().split('T')[0],
    companyName: 'NexaSphere It',
    companyAddress: 'IT Tower, Level 4, Digital Zone',
    clientName: '',
    clientAddress: '',
    clientPhone: '',
    items: [{ id: '1', serviceName: '', description: '', price: 0, quantity: 1, total: 0 }],
    totalAmount: 0,
    notes: 'Payment is due within 30 days of issuance.',
    authorizedPerson: '',
  });

  const { settings } = useTheme();

  useEffect(() => {
    if (id) {
      const fetchQuotation = async () => {
        setIsLoading(true);
        try {
          const docSnap = await getDoc(doc(db, 'quotations', id));
          if (docSnap.exists()) {
            const data = docSnap.data() as Quotation;
            setQuotation({
              ...data,
              documentTitle: data.documentTitle || 'Quotation',
              authorizedPerson: data.authorizedPerson || '',
              companyLogo: data.companyLogo || settings.companyLogo || ''
            });
          } else {
            toast.error('Quotation not found');
          }
        } catch (error) {
          console.error('Error fetching quotation:', error);
          toast.error('Failed to load quotation');
        } finally {
          setIsLoading(false);
        }
      };
      fetchQuotation();
    } else {
      setQuotation(prev => ({ ...prev, companyLogo: settings.companyLogo || '' }));
    }
  }, [id, settings.companyLogo]);

  useEffect(() => {
    const total = quotation.items.reduce((acc, item) => acc + item.total, 0);
    setQuotation(prev => ({ ...prev, totalAmount: total }));
  }, [quotation.items]);

  const handleAddItem = () => {
    setQuotation(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { id: Math.random().toString(36).substr(2, 9), serviceName: '', description: '', price: 0, quantity: 1, total: 0 }
      ]
    }));
  };

  const handleRemoveItem = (id: string) => {
    if (quotation.items.length === 1) return;
    setQuotation(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const handleItemChange = (id: string, field: keyof QuotationItem, value: any) => {
    setQuotation(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'price' || field === 'quantity') {
            updatedItem.total = Number(updatedItem.price) * Number(updatedItem.quantity);
          }
          return updatedItem;
        }
        return item;
      })
    }));
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
    const element = document.getElementById('quotation-preview');
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
          const preview = clonedDoc.getElementById('quotation-preview');
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
      pdf.save(`${quotation.documentTitle || 'Quotation'}-${quotation.quotationNumber}.pdf`);
      toast.success('PDF Downloaded!', { id: 'pdf' });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Download failed. Some images/fonts might be blocked.', { id: 'pdf' });
    }
  };

  const handleSave = async () => {
    if (!quotation.clientName) {
      return toast.error('Client name is required');
    }
    
    setIsSaving(true);
    const loadingToast = toast.loading('Saving quotation...');
    
    try {
      if (id) {
        await setDoc(doc(db, 'quotations', id), {
          ...quotation,
          userId: auth.currentUser?.uid,
          updatedAt: serverTimestamp(),
        });
        toast.success('Quotation updated successfully!', { id: loadingToast });
      } else {
        await addDoc(collection(db, 'quotations'), {
          ...quotation,
          userId: auth.currentUser?.uid,
          createdAt: serverTimestamp(),
        });
        toast.success('Quotation saved successfully!', { id: loadingToast });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, 'quotations');
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
          <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onClick={handleDownloadPDF}>
            <Download size={18} />
            PDF
          </Button>
          <Button variant="primary" size="sm" className="flex-1 sm:flex-none" onClick={handleSave} isLoading={isSaving}>
            <Save size={18} />
            Save
          </Button>
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
          <FileText size={15} />
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
          <h2 className="text-xl font-black flex items-center gap-2 border-b pb-4">
            <FileText className="text-zinc-400" />
            Editor
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1 sm:col-span-2">
              <Input 
                label="Document Title" 
                placeholder="Quotation / Estimate / Invoice"
                value={quotation.documentTitle || ''} 
                onChange={e => setQuotation(p => ({...p, documentTitle: e.target.value}))} 
              />
            </div>
            <Input 
              label="Ref Number" 
              value={quotation.quotationNumber || ''} 
              onChange={e => setQuotation(p => ({...p, quotationNumber: e.target.value}))} 
            />
            <Input 
              label="Date" 
              type="date"
              value={quotation.date || ''} 
              onChange={e => setQuotation(p => ({...p, date: e.target.value}))} 
            />
            <div className="col-span-1 sm:col-span-2">
              <ImageUpload 
                label="Company Logo" 
                value={quotation.companyLogo} 
                onChange={logo => setQuotation(p => ({...p, companyLogo: logo}))} 
              />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-100">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Company</h3>
            <Input 
              label="Name" 
              value={quotation.companyName || ''} 
              onChange={e => setQuotation(p => ({...p, companyName: e.target.value}))} 
            />
            <Input 
              label="Address" 
              value={quotation.companyAddress || ''} 
              onChange={e => setQuotation(p => ({...p, companyAddress: e.target.value}))} 
            />
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-100">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Client</h3>
            <Input 
              label="Name" 
              value={quotation.clientName || ''} 
              onChange={e => setQuotation(p => ({...p, clientName: e.target.value}))} 
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Phone" value={quotation.clientPhone || ''} onChange={e => setQuotation(p => ({...p, clientPhone: e.target.value}))} />
              <Input label="Address" value={quotation.clientAddress || ''} onChange={e => setQuotation(p => ({...p, clientAddress: e.target.value}))} />
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Line Items</h3>
              <Button variant="ghost" size="sm" onClick={handleAddItem} className="text-black font-black uppercase tracking-widest">
                <Plus size={16} /> Add Entry
              </Button>
            </div>
            
            <div className="space-y-4">
              {quotation.items.map((item, idx) => (
                <div key={item.id} className="p-5 bg-slate-50 rounded-3xl relative group border border-slate-100/50 shadow-sm">
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="absolute top-4 right-4 p-1.5 text-slate-300 hover:text-black transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="grid grid-cols-1 gap-3 pr-8">
                    <Input placeholder="Service name" value={item.serviceName || ''} onChange={e => handleItemChange(item.id, 'serviceName', e.target.value)} />
                    <Input placeholder="Description" value={item.description || ''} onChange={e => handleItemChange(item.id, 'description', e.target.value)} />
                    <div className="grid grid-cols-2 gap-3">
                      <Input type="number" label="Price" value={item.price ?? 0} onChange={e => handleItemChange(item.id, 'price', e.target.value)} />
                      <Input type="number" label="Qty" value={item.quantity ?? 1} onChange={e => handleItemChange(item.id, 'quantity', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 space-y-4">
            <Input label="Notes" value={quotation.notes || ''} onChange={e => setQuotation(p => ({...p, notes: e.target.value}))} />
            <Input label="Authorized By" value={quotation.authorizedPerson || ''} onChange={e => setQuotation(p => ({...p, authorizedPerson: e.target.value}))} />
          </div>
        </Card>
        </div>

        {/* Preview Column - Colorful in Browser, B&W in Print */}
        <div className={cn("sticky top-8 print:static print:block print:w-full overflow-x-auto lg:overflow-visible", activeTab !== 'preview' && "hidden lg:block")}>
          <style>
            {`
              @media print {
                #quotation-preview {
                  color: #000 !important;
                  background: #fff !important;
                  box-shadow: none !important;
                  border: none !important;
                }
                #quotation-preview * {
                  color: #000 !important;
                  border-color: #000 !important;
                  background-color: transparent !important;
                }
                #quotation-preview .bg-black-print {
                  background-color: #000 !important;
                  color: #fff !important;
                }
                #quotation-preview .grayscale-print {
                  filter: grayscale(100%) contrast(150%) !important;
                }
              }
            `}
          </style>
          <div id="quotation-preview" className="bg-white p-8 md:p-12 shadow-2xl rounded-sm border border-slate-100 font-sans print:shadow-none print:border-none print:p-0 print:m-0 w-full md:w-[210mm] min-h-[297mm] mx-auto flex flex-col" style={{ backgroundColor: '#ffffff' }}>
            
            {/* Top Row: Brand & Status Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start mb-8 pb-6">
              <div className="space-y-3 w-full sm:w-auto mb-6 sm:mb-0">
                {quotation.companyLogo ? (
                  <div className="flex flex-col gap-2">
                    <img src={quotation.companyLogo} alt="Logo" className="max-h-16 w-auto object-contain rounded-md print:grayscale print:contrast-150" crossOrigin="anonymous" />
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 italic">new ideas new success</p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center border-2 border-dashed border-zinc-300" style={{ backgroundColor: `${settings.primaryColor}11`, borderColor: settings.primaryColor }}>
                      <FileText style={{ color: settings.primaryColor }} size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-extrabold uppercase tracking-tighter leading-none" style={{ color: settings.primaryColor }}>{quotation.companyName || 'NexaSphere It'}</h2>
                      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 italic mt-1">new ideas new success</p>
                    </div>
                  </div>
                )}
                <div className="space-y-0.5 mt-2">
                  <h3 className="text-lg font-black tracking-tight" style={{ color: settings.primaryColor }}>{quotation.companyName || 'NexaSphere It'}</h3>
                  <p className="text-[9px] text-slate-400 max-w-[280px] leading-relaxed font-semibold">{quotation.companyAddress || 'IT Tower, Level 4, DBlock B, Chandrima Model Town, House 15, Road 10, Ber badh road, Muhammadpur, Bangladesh, 1207igital Zone'}</p>
                </div>
              </div>
              
              <div className="text-left sm:text-right flex flex-col items-start sm:items-end gap-4 w-full sm:w-auto">
                <h1 className="text-3xl font-extrabold uppercase tracking-wide leading-none" style={{ color: settings.primaryColor }}>
                  {quotation.documentTitle || 'QUOTATION'}
                </h1>
                
                <div className="space-y-3 mt-1">
                  <div className="inline-flex items-center rounded-full px-4 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.1em]" style={{ backgroundColor: `${settings.primaryColor}15`, color: settings.primaryColor }}>
                    <span>REF NO.</span>
                    <span className="ml-1.5 font-black">{quotation.quotationNumber}</span>
                  </div>
                  
                  <div className="flex flex-col items-start sm:items-end leading-none">
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Issue Date</span>
                    <span className="text-xs font-black text-slate-700 mt-1">{quotation.date}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Separator line */}
            <div className="w-full h-[2px] bg-slate-900 mb-8" style={{ backgroundColor: settings.primaryColor }} />

            {/* Middle Section: Client Info and Summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
              {/* Customer Representative Box */}
              <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-4 rounded-full" style={{ backgroundColor: settings.primaryColor }} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">CUSTOMER PARTICIPANT</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-extrabold text-slate-900 tracking-tight uppercase">
                      {quotation.clientName || 'Bill To Party'}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-sm uppercase">
                      {quotation.clientAddress || 'Client Address, City, Country'}
                    </p>
                  </div>
                </div>
                {quotation.clientPhone && (
                  <div className="mt-4 text-xs font-black tracking-wide" style={{ color: settings.primaryColor }}>
                    {quotation.clientPhone}
                  </div>
                )}
              </div>

              {/* Estimated net valuation box */}
              <div className="md:col-span-5 p-6 rounded-2xl flex flex-col justify-between border border-slate-100" style={{ backgroundColor: `${settings.primaryColor}08` }}>
                <div className="space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">ESTIMATED NET</span>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-3xl font-black tracking-tighter" style={{ color: settings.primaryColor }}>
                      Tk {quotation.totalAmount.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-black tracking-wider text-slate-400 font-mono">BDT</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-slate-200/50">
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">VALIDITY: 30 DAYS</span>
                </div>
              </div>
            </div>

            {/* Services Requirements list */}
            <div className="mb-8 flex-1 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="text-white text-[9px] font-black uppercase tracking-[0.15em] bg-black-print" style={{ backgroundColor: settings.primaryColor }}>
                    <th className="py-3 px-5 text-left rounded-l-md">DESCRIPTION OF SERVICES</th>
                    <th className="py-3 px-5 text-center">RATE</th>
                    <th className="py-3 px-5 text-center">QTY</th>
                    <th className="py-3 px-5 text-right rounded-r-md">LINE TOTAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 border-b border-slate-200">
                  {quotation.items.map((item) => (
                    <tr key={item.id} className="text-slate-800">
                      <td className="py-5 px-5 text-left">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.serviceName || 'Service Entry'}</p>
                        {item.description && <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase leading-tight">{item.description}</p>}
                      </td>
                      <td className="py-5 px-5 text-center text-xs font-semibold text-slate-400">Tk {Number(item.price || 0).toLocaleString()}</td>
                      <td className="py-5 px-5 text-center text-xs font-semibold text-slate-400">{item.quantity}</td>
                      <td className="py-5 px-5 text-right text-sm font-black text-slate-900">Tk {Number(item.total || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Middle Divider bar below table */}
            <div className="w-full h-[2px] mb-6" style={{ backgroundColor: settings.primaryColor }} />

            {/* Calculations Subtotal / Grand total row block */}
            <div className="flex flex-col items-end space-y-3 mb-6 pr-5">
              <div className="flex items-center gap-12 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-[0.15em] text-[10px]">SUBTOTAL</span>
                <span className="font-extrabold text-slate-800 tracking-tight">Tk {quotation.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-12 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-[0.15em] text-[10px]">VAT / TAX (0%)</span>
                <span className="font-extrabold text-slate-850 tracking-tight">Tk 0</span>
              </div>
            </div>

            {/* Grand total bar */}
            <div className="p-5 rounded-2xl bg-[#0b1329] text-white flex items-center justify-between mb-10 shadow-sm">
              <span className="font-black uppercase tracking-[0.2em] text-[10px] text-zinc-300">GRAND TOTAL</span>
              <span className="text-xl font-black tracking-tight font-mono">Tk {quotation.totalAmount.toLocaleString()}</span>
            </div>

            {/* Footer Terms & Conditions next to Authorized Representative */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-auto pt-8 border-t border-zinc-100">
              <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">TERMS & CONDITIONS</h3>
                <p className="text-[11px] leading-relaxed font-bold italic text-slate-500 uppercase tracking-tight">
                  {quotation.notes || 'Payment is due within 30 days of issuance.'}
                </p>
              </div>
              <div className="flex flex-col items-end justify-end">
                 <div className="text-right w-full max-w-[220px]">
                    <p className="text-sm font-extrabold uppercase text-slate-850 tracking-tight mb-1">{quotation.authorizedPerson || 'NexaSphere Admin'}</p>
                    <div className="w-full h-0.5 bg-slate-900" style={{ backgroundColor: settings.primaryColor }} />
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] mt-2 text-slate-400">AUTHORIZED SIGNATURE</p>
                 </div>
              </div>
            </div>

            {/* Bottom Credit */}
            <div className="mt-12 text-center pt-6 border-t border-zinc-100 opacity-40">
              <p className="text-[8px] font-extrabold uppercase tracking-[0.4em] text-slate-400">
                GENERATED BY NEXASPHERE IT SOLUTION • INNOVATION & EXCELLENCE
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
