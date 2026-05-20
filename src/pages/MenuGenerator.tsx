import { useState, useEffect } from 'react';
import { Plus, Trash2, Download, Printer, Save, Utensils, ArrowLeft } from 'lucide-react';
import { Button, Input, Card, ImageUpload } from '../components/common/UI';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

import { collection, addDoc, serverTimestamp, getDoc, doc, setDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
}

interface MenuData {
  userId: string;
  title: string;
  subtitle: string;
  items: MenuItem[];
  logo?: string;
  footerText?: string;
}

export default function MenuGenerator() {
  const { id } = useParams();
  const { settings } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [menu, setMenu] = useState<MenuData>({
    userId: auth.currentUser?.uid || 'admin',
    title: 'Gourmet Selection',
    subtitle: 'Exquisite Dining Experience',
    items: [
      { id: '1', name: 'Signature Dish', description: 'Our chef\'s special creation with secret ingredients.', price: '25.00', category: 'Main Course' },
      { id: '2', name: 'Fresh Salad', description: 'Seasonal greens with balsamic vinaigrette.', price: '12.00', category: 'Starters' }
    ],
    footerText: 'Enjoy your meal!',
    logo: settings.companyLogo || ''
  });

  useEffect(() => {
    if (id) {
      const fetchMenu = async () => {
        setIsLoading(true);
        try {
          const docSnap = await getDoc(doc(db, 'menus', id));
          if (docSnap.exists()) {
            setMenu(docSnap.data() as MenuData);
          } else {
            toast.error('Menu not found');
          }
        } catch (error) {
          console.error('Error fetching menu:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMenu();
    }
  }, [id]);

  const handleAddItem = () => {
    setMenu(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { id: Math.random().toString(36).substr(2, 9), name: '', description: '', price: '', category: 'General' }
      ]
    }));
  };

  const handleRemoveItem = (id: string) => {
    setMenu(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
  };

  const handleItemChange = (id: string, field: keyof MenuItem, value: string) => {
    setMenu(prev => ({
      ...prev,
      items: prev.items.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('menu-preview');
    if (!element) return;
    try {
      toast.loading('Generating PDF...', { id: 'pdf' });
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        onclone: (clonedDoc) => {
          const preview = clonedDoc.getElementById('menu-preview');
          if (preview) {
            preview.style.backgroundColor = '#ffffff';
            preview.style.color = '#000000';
            const all = preview.getElementsByTagName('*');
            for (let i = 0; i < all.length; i++) {
              const el = all[i] as HTMLElement;
              el.style.color = '#000000';
              el.style.borderColor = '#000000';
              if (el.classList.contains('bg-primary')) {
                el.style.backgroundColor = '#000000';
                el.style.color = '#ffffff';
              }
            }
          }
        }
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
      pdf.save(`Menu-${menu.title}.pdf`);
      toast.success('Downloaded!', { id: 'pdf' });
    } catch (e) {
      toast.error('Failed to generate PDF', { id: 'pdf' });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (id) {
        await setDoc(doc(db, 'menus', id), { ...menu, updatedAt: serverTimestamp() });
      } else {
        await addDoc(collection(db, 'menus'), { ...menu, createdAt: serverTimestamp() });
      }
      toast.success('Menu saved!');
    } catch (e) {
      handleFirestoreError(e, id ? OperationType.UPDATE : OperationType.CREATE, 'menus');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black"></div></div>;

  const categories = Array.from(new Set(menu.items.map(item => item.category)));

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 print:p-0 print:m-0">
      <div className="flex items-center justify-between gap-4 flex-wrap print:hidden">
        <Link to="/" className="flex items-center gap-2 text-slate-500 hover:text-black">
          <ArrowLeft size={20} />
          <span className="font-bold">Dashboard</span>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.print()}><Printer size={18} /> Print</Button>
          <Button variant="outline" size="sm" onClick={handleDownloadPDF}><Download size={18} /> PDF</Button>
          <Button variant="primary" size="sm" onClick={handleSave} isLoading={isSaving}><Save size={18} /> Save</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start print:block">
        <Card className="space-y-6 print:hidden">
          <h2 className="text-xl font-black uppercase flex items-center gap-2">
            <Utensils size={24} style={{ color: settings.primaryColor }} />
            Menu Editor
          </h2>
          <div className="space-y-4">
            <ImageUpload 
              label="Menu Logo" 
              value={menu.logo || settings.companyLogo} 
              onChange={logo => setMenu(p => ({ ...p, logo }))} 
            />
            <Input label="Title" value={menu.title} onChange={e => setMenu(p => ({ ...p, title: e.target.value }))} />
            <Input label="Subtitle" value={menu.subtitle} onChange={e => setMenu(p => ({ ...p, subtitle: e.target.value }))} />
          </div>

          <div className="space-y-4 pt-6 border-t font-sans">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Items</h3>
              <Button variant="ghost" size="sm" onClick={handleAddItem}><Plus size={16} /> Add Item</Button>
            </div>
            <div className="space-y-4">
              {menu.items.map(item => (
                <div key={item.id} className="p-4 bg-slate-50 rounded-2xl relative space-y-3">
                  <button className="absolute top-2 right-2 text-slate-300 hover:text-red-500" onClick={() => handleRemoveItem(item.id)}>
                    <Trash2 size={16} />
                  </button>
                  <Input placeholder="Category" value={item.category} onChange={e => handleItemChange(item.id, 'category', e.target.value)} className="text-xs" />
                  <Input placeholder="Item Name" value={item.name} onChange={e => handleItemChange(item.id, 'name', e.target.value)} />
                  <Input placeholder="Price" value={item.price} onChange={e => handleItemChange(item.id, 'price', e.target.value)} />
                  <textarea 
                    placeholder="Description"
                    className="w-full p-3 rounded-xl bg-white border-none outline-none text-sm h-20"
                    value={item.description}
                    onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
          <Input label="Footer Text" value={menu.footerText} onChange={e => setMenu(p => ({ ...p, footerText: e.target.value }))} />
        </Card>

        <div className="sticky top-8 overflow-x-auto print:static print:block print:w-full">
          <div id="menu-preview" className="bg-white w-[210mm] min-h-[297mm] mx-auto p-12 flex flex-col font-serif shadow-2xl border border-slate-100 print:shadow-none print:border-none">
             <div className="text-center space-y-4 mb-12">
               { (menu.logo || settings.companyLogo) && (
                 <img src={menu.logo || settings.companyLogo} alt="Logo" className="max-h-24 mx-auto mb-4" />
               )}
               <h1 className="text-5xl font-black uppercase tracking-tighter" style={{ color: settings.primaryColor }}>{menu.title}</h1>
               <p className="text-xl uppercase tracking-[0.2em] opacity-50">{menu.subtitle}</p>
               <div className="w-16 h-1 mx-auto" style={{ backgroundColor: settings.primaryColor }}></div>
             </div>

             <div className="flex-1 space-y-12">
               {categories.map(cat => (
                 <div key={cat} className="space-y-6">
                   <h2 className="text-2xl font-black uppercase text-center border-b-2 pb-2 tracking-widest" style={{ color: settings.primaryColor, borderColor: `${settings.primaryColor}22` }}>{cat}</h2>
                   <div className="grid grid-cols-1 gap-8">
                     {menu.items.filter(i => i.category === cat).map(item => (
                       <div key={item.id} className="flex justify-between items-start gap-4">
                         <div className="space-y-1">
                           <h3 className="text-lg font-bold uppercase">{item.name}</h3>
                           <p className="text-sm italic text-slate-500">{item.description}</p>
                         </div>
                         <span className="text-lg font-black" style={{ color: settings.primaryColor }}>${item.price}</span>
                       </div>
                     ))}
                   </div>
                 </div>
               ))}
             </div>

             <div className="mt-auto pt-16 text-center italic text-slate-400">
                <p className="text-sm">{menu.footerText}</p>
                <div className="mt-8 text-[10px] font-sans uppercase tracking-[0.4em] opacity-20">NexaSphere Dining System</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
