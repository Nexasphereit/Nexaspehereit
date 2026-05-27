import { useState, useEffect } from 'react';
import { Download, Printer, Save, Receipt as ReceiptIcon, ArrowLeft, ImageIcon } from 'lucide-react';
import { Button, Input, Card, ImageUpload } from '../components/common/UI';
import { cn } from '../lib/utils';
import { Receipt } from '../types';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { collection, addDoc, serverTimestamp, getDoc, doc, setDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { useTheme } from '../context/ThemeContext';

export default function ReceiptGenerator() {
  const { id } = useParams();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [receipt, setReceipt] = useState<Receipt>({
    userId: auth.currentUser?.uid || 'admin',
    receiptNumber: `REC-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    receivedFrom: '',
    amount: 0,
    paymentMethod: 'Cash',
    purpose: '',
    authorizedPerson: '',
  });

  const { settings } = useTheme();

  useEffect(() => {
    if (id) {
      const fetchReceipt = async () => {
        setIsLoading(true);
        try {
          const docSnap = await getDoc(doc(db, 'receipts', id));
          if (docSnap.exists()) {
            const data = docSnap.data() as Receipt;
            setReceipt({
              ...data,
              authorizedPerson: data.authorizedPerson || '',
              companyLogo: data.companyLogo || settings.companyLogo || ''
            });
          } else {
            toast.error('Receipt not found');
          }
        } catch (error) {
          console.error('Error fetching receipt:', error);
          toast.error('Failed to load receipt');
        } finally {
          setIsLoading(false);
        }
      };
      fetchReceipt();
    } else {
      setReceipt(prev => ({ ...prev, companyLogo: settings.companyLogo || '' }));
    }
  }, [id, settings.companyLogo]);

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
    const element = document.getElementById('receipt-preview');
    if (!element) return;
    try {
      toast.loading('Generating Receipt PDF...', { id: 'pdf' });
      
      const scrollPos = window.scrollY;
      window.scrollTo(0, 0);

      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        logging: true,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          const preview = clonedDoc.getElementById('receipt-preview');
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
      const pdf = new jsPDF('l', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Receipt-${receipt.receiptNumber}.pdf`);
      toast.success('Receipt Downloaded!', { id: 'pdf' });
    } catch (error) {
      console.error('Receipt PDF error:', error);
      toast.error('Download failed. Some images/fonts might be blocked.', { id: 'pdf' });
    }
  };

  const handleSave = async () => {
    if (!receipt.receivedFrom) return toast.error('Received From is required');
    if (receipt.amount <= 0) return toast.error('Amount must be greater than 0');
    
    setIsSaving(true);
    const loadingToast = toast.loading('Creating receipt...');
    try {
      if (id) {
        await setDoc(doc(db, 'receipts', id), {
          ...receipt,
          userId: auth.currentUser?.uid,
          updatedAt: serverTimestamp(),
        });
        toast.success('Receipt updated successfully!', { id: loadingToast });
      } else {
        await addDoc(collection(db, 'receipts'), {
          ...receipt,
          userId: auth.currentUser?.uid,
          createdAt: serverTimestamp(),
        });
        toast.success('Receipt created successfully!', { id: loadingToast });
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      handleFirestoreError(error, id ? OperationType.UPDATE : OperationType.CREATE, 'receipts');
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
    <div className="max-w-5xl mx-auto space-y-6 md:space-y-8 pb-20 px-4 print:p-0 print:m-0">
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
          <ReceiptIcon size={15} />
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
          <header className="flex items-center gap-3 border-b border-slate-100 pb-4">
             <div className="bg-zinc-900 p-2 rounded-lg text-white">
               <ReceiptIcon size={24} />
             </div>
             <h2 className="text-xl font-black uppercase tracking-tight">Editor</h2>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Input label="Receipt #" value={receipt.receiptNumber || ''} readOnly />
            <Input label="Date" type="date" value={receipt.date || ''} onChange={e => setReceipt(p => ({...p, date: e.target.value}))} />
            <Input label="Amount" type="number" placeholder="0.00" value={receipt.amount ?? 0} onChange={e => setReceipt(p => ({...p, amount: Number(e.target.value)}))} />
          </div>

          <div className="pt-2">
            <ImageUpload 
              label="Company Logo" 
              value={receipt.companyLogo} 
              onChange={logo => setReceipt(p => ({...p, companyLogo: logo}))} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
            <Input label="Received From" placeholder="Customer name" value={receipt.receivedFrom || ''} onChange={e => setReceipt(p => ({...p, receivedFrom: e.target.value}))} />
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 italic">Payment Method</label>
              <select 
                 className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl focus:ring-1 focus:ring-black transition-all outline-none text-slate-900 text-sm font-medium h-[52px]"
                 value={receipt.paymentMethod || 'Cash'}
                 onChange={e => setReceipt(p => ({...p, paymentMethod: e.target.value}))}
              >
                <option>Cash</option>
                <option>Bank Transfer</option>
                <option>Check</option>
                <option>Credit Card</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Purpose" placeholder="e.g. Website Development" value={receipt.purpose || ''} onChange={e => setReceipt(p => ({...p, purpose: e.target.value}))} />
            <Input label="Authorized official" placeholder="Signer Name" value={receipt.authorizedPerson || ''} onChange={e => setReceipt(p => ({...p, authorizedPerson: e.target.value}))} />
          </div>
        </Card>
        </div>

        {/* Receipt Preview - Colorful in Browser, B&W in Print */}
        <div className={cn("sticky top-8 print:static print:block print:w-full overflow-x-auto lg:overflow-visible", activeTab !== 'preview' && "hidden lg:block")}>
          <style>
            {`
              @media print {
                #receipt-preview {
                  color: #000 !important;
                  background: #fff !important;
                  box-shadow: none !important;
                  border: none !important;
                }
                #receipt-preview * {
                  color: #000 !important;
                  border-color: #000 !important;
                  background-color: transparent !important;
                }
                #receipt-preview .bg-primary-print {
                  background-color: #000 !important;
                  color: #fff !important;
                }
                .grayscale-print {
                  filter: grayscale(100%) contrast(150%) !important;
                }
              }
            `}
          </style>
          <div id="receipt-preview" className="bg-white p-8 md:p-12 shadow-2xl rounded-sm border border-slate-100 font-sans print:shadow-none print:border-none print:p-0 print:m-0 w-full md:w-[210mm] min-h-[148mm] mx-auto flex flex-col" style={{ backgroundColor: '#ffffff' }}>
            
            <div className="flex flex-col sm:flex-row justify-between items-start mb-12 pb-8 border-b-8" style={{ borderColor: settings.primaryColor }}>
              <div className="flex flex-col gap-6 w-full sm:w-auto">
                {receipt.companyLogo ? (
                  <img src={receipt.companyLogo} alt="Logo" className="max-h-20 w-auto rounded-md grayscale-print" crossOrigin="anonymous" />
                ) : (
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center border-2 border-dashed border-zinc-200" style={{ backgroundColor: `${settings.primaryColor}11`, borderColor: settings.primaryColor }}>
                    <ReceiptIcon style={{ color: settings.primaryColor }} size={24} />
                  </div>
                )}
                <div>
                   <h2 className="text-2xl font-black uppercase tracking-tight leading-none" style={{ color: settings.primaryColor }}>OFFICIAL RECEIPT</h2>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mt-2 italic antialiased">PAYMENT ACKNOWLEDGEMENT</p>
                </div>
              </div>
              <div className="text-left sm:text-right flex flex-col items-start sm:items-end gap-6 w-full sm:w-auto mt-6 sm:mt-0">
                <div className="text-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.4em] bg-primary-print" style={{ backgroundColor: settings.primaryColor }}>
                  DOCUMENT NO
                </div>
                <div className="space-y-4">
                   <div className="flex flex-col items-start sm:items-end">
                      <span className="text-[11px] font-black">#{receipt.receiptNumber}</span>
                   </div>
                   <div className="flex flex-col items-start sm:items-end">
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Issue Date</span>
                      <span className="text-sm font-black">{receipt.date || new Date().toLocaleDateString()}</span>
                   </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12 border-b border-zinc-100 pb-12">
               <div className="col-span-1 md:col-span-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">BILLING INFORMATION</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">RECEIVED FROM</p>
                  <h3 className="text-2xl font-black uppercase border-b-2 inline-block pb-1" style={{ borderColor: settings.primaryColor }}>{receipt.receivedFrom || 'VALUED CUSTOMER'}</h3>
                  <div className="mt-6">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">PAYMENT FOR</p>
                     <p className="text-lg font-bold italic text-slate-700 tracking-tight leading-relaxed">
                       {receipt.purpose || 'PROFESSIONAL SERVICES RENDERED'}
                     </p>
                  </div>
               </div>
               <div className="flex flex-col justify-end items-start md:items-end mt-4 md:mt-0">
                  <div className="bg-slate-50 border-2 p-6 md:p-8 rounded-sm text-left md:text-right w-full" style={{ borderColor: `${settings.primaryColor}22` }}>
                     <p className="text-[9px] font-black tracking-[0.3em] uppercase text-slate-400 mb-2">AMOUNT COLLECTED</p>
                     <h4 className="text-3xl md:text-4xl font-black tracking-tighter italic" style={{ color: settings.primaryColor }}>
                       {receipt.amount.toLocaleString()}
                     </h4>
                  </div>
               </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 md:pt-8">
               <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-4 h-4 border-2 flex items-center justify-center p-0.5" style={{ borderColor: settings.primaryColor }}>
                        <div className="w-full h-full" style={{ backgroundColor: settings.primaryColor }}></div>
                     </div>
                     <p className="text-[11px] font-black uppercase tracking-widest">PAYMENT VERIFIED: {receipt.paymentMethod}</p>
                  </div>
                  <div className="max-w-[400px]">
                     <p className="text-[9px] font-black text-slate-400 mb-2 uppercase tracking-widest italic">Disclaimer</p>
                     <p className="text-[9px] leading-relaxed font-bold text-slate-400 italic uppercase tracking-tighter">
                       THIS IS A DIGITALLY GENERATED RECEIPT. VALID ONLY WHEN ACCOMPANIED BY SUCCESSFUL TRANSACTION RECORD IN OUR LEDGERS. NO MANUAL STAMP NECESSARY.
                     </p>
                  </div>
               </div>
               <div className="text-right sm:text-center w-full md:w-64">
                 <p className="text-sm font-black uppercase mb-1">{receipt.authorizedPerson || 'Authorized Official'}</p>
                 <div className="w-full h-0.5" style={{ backgroundColor: settings.primaryColor }} />
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-2 text-slate-400">Authorized Signature</p>
               </div>
            </div>

            <div className="mt-auto pt-8 border-t border-zinc-100 text-center opacity-30">
               <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.6em] italic" style={{ color: settings.primaryColor }}>TRUSTED SOLUTIONS • NEXASPHERE PROFESSIONAL SYSTEM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
