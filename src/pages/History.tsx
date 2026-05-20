import { useState } from 'react';
import { Search, FileText, UserCircle, Receipt as ReceiptIcon, Trash2, ExternalLink, Filter } from 'lucide-react';
import { Button, Input, Card } from '../components/common/UI';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

export default function History() {
  const { settings } = useTheme();
  const [activeTab, setActiveTab] = useState<'All' | 'Quotation' | 'CV' | 'Receipt'>('All');
  const [search, setSearch] = useState('');

  const quotationsRef = collection(db, 'quotations');
  const cvsRef = collection(db, 'cvs');
  const receiptsRef = collection(db, 'receipts');

  const [quotationsSnap] = useCollection(query(quotationsRef, where('userId', '==', auth.currentUser?.uid || ''), orderBy('createdAt', 'desc')));
  const [cvsSnap] = useCollection(query(cvsRef, where('userId', '==', auth.currentUser?.uid || ''), orderBy('createdAt', 'desc')));
  const [receiptsSnap] = useCollection(query(receiptsRef, where('userId', '==', auth.currentUser?.uid || ''), orderBy('createdAt', 'desc')));

  const allDocuments = [
    ...(quotationsSnap?.docs.map(d => ({ id: d.id, type: 'Quotation', title: d.data().quotationNumber, client: d.data().clientName, date: d.data().date || (d.data().createdAt?.toDate().toISOString().split('T')[0] || ''), amount: d.data().totalAmount })) || []),
    ...(cvsSnap?.docs.map(d => ({ id: d.id, type: 'CV', title: d.data().fullName, client: d.data().fullName, date: d.data().createdAt?.toDate().toISOString().split('T')[0] || '', amount: null })) || []),
    ...(receiptsSnap?.docs.map(d => ({ id: d.id, type: 'Receipt', title: d.data().receiptNumber, client: d.data().receivedFrom, date: d.data().date || (d.data().createdAt?.toDate().toISOString().split('T')[0] || ''), amount: d.data().amount })) || []),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredHistory = allDocuments.filter(item => {
    const matchesTab = activeTab === 'All' || item.type === activeTab;
    const matchesSearch = item.title?.toLowerCase().includes(search.toLowerCase()) || 
                          item.client?.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleDelete = async (id: string, type: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    const collectionName = type === 'Quotation' ? 'quotations' : type === 'CV' ? 'cvs' : type === 'Receipt' ? 'receipts' : 'menus';
    try {
      await deleteDoc(doc(db, collectionName, id));
      toast.success('Document deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const getUrl = (type: string, id: string) => {
    switch (type) {
      case 'Quotation': return `/quotations/${id}`;
      case 'CV': return `/cvs/${id}`;
      case 'Receipt': return `/receipts/${id}`;
      default: return '#';
    }
  };

  const isDark = settings.sidebarTheme === 'dark';

  return (
    <div className="space-y-6 md:space-y-8 pb-10 px-4">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className={cn("text-3xl font-black tracking-tight uppercase italic", isDark ? "text-white" : "text-slate-900")}>
            Document <span style={{ color: settings.primaryColor }}>History</span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium italic">Manage and track all generated professional documents.</p>
        </div>
        <div className={cn("flex flex-wrap bg-slate-100 p-1 rounded-2xl border overflow-x-auto no-scrollbar", isDark ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200")}>
          {(['All', 'Quotation', 'CV', 'Receipt'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 md:px-6 py-2 rounded-xl text-xs font-black uppercase transition-all whitespace-nowrap",
                activeTab === tab ? "text-white shadow-lg" : "text-slate-500 hover:text-slate-900"
              )}
              style={activeTab === tab ? { 
                backgroundColor: settings.primaryColor,
                boxShadow: `0 8px 16px -4px ${settings.primaryColor}55`
              } : {}}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      <Card className={cn("border-none shadow-xl", isDark ? "bg-slate-900" : "bg-white")}>
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 font-black" size={18} />
            <Input 
              placeholder="Search by ID or client name..." 
              className="pl-12"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="w-full md:w-auto"><Filter size={18} /> Filters</Button>
        </div>

        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="text-left border-b border-slate-100">
                <th className="pb-4 font-black text-[10px] uppercase tracking-widest text-slate-400 px-4 italic">Document</th>
                <th className="pb-4 font-black text-[10px] uppercase tracking-widest text-slate-400 px-4 italic">Type</th>
                <th className="pb-4 font-black text-[10px] uppercase tracking-widest text-slate-400 px-4 italic">Client / Title</th>
                <th className="pb-4 font-black text-[10px] uppercase tracking-widest text-slate-400 px-4 italic">Date</th>
                <th className="pb-4 font-black text-[10px] uppercase tracking-widest text-slate-400 px-4 italic">Amount</th>
                <th className="pb-4 font-black text-[10px] uppercase tracking-widest text-slate-400 px-4 text-right italic">Actions</th>
              </tr>
            </thead>
            <tbody className={cn("divide-y", isDark ? "divide-slate-800" : "divide-slate-50")}>
              {filteredHistory.map((item) => (
                <tr key={item.id} className={cn("group transition-colors", isDark ? "hover:bg-slate-800/40" : "hover:bg-slate-50/50")}>
                  <td className="py-5 px-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-2 rounded-xl"
                        style={{ 
                          backgroundColor: `${settings.primaryColor}15`,
                          color: settings.primaryColor 
                        }}
                      >
                        {item.type === 'Quotation' && <FileText size={18} />}
                        {item.type === 'CV' && <UserCircle size={18} />}
                        {item.type === 'Receipt' && <ReceiptIcon size={18} />}
                      </div>
                      <span className={cn("font-bold tracking-tight", isDark ? "text-white" : "text-slate-900")}>{item.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 border border-slate-200 px-2 py-0.5 rounded-full">{item.type}</span>
                  </td>
                  <td className={cn("py-4 px-4 text-sm font-semibold truncate max-w-[200px]", isDark ? "text-slate-400" : "text-slate-700")}>{item.client}</td>
                  <td className="py-4 px-4 text-sm text-slate-500 font-medium">{item.date}</td>
                  <td className={cn("py-4 px-4 text-sm font-black italic", isDark ? "text-slate-200" : "text-slate-900")}>
                    {item.amount ? `${item.amount.toLocaleString()}` : '-'}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={getUrl(item.type, item.id)}>
                        <Button variant="ghost" size="icon" className="group-hover:scale-110 transition-transform">
                          <ExternalLink size={18} style={{ color: settings.primaryColor }} />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="hover:text-red-500" onClick={() => handleDelete(item.id, item.type)}>
                        <Trash2 size={18} className="text-slate-400 hover:text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredHistory.length === 0 && (
            <div className="py-20 text-center text-slate-400 italic font-medium">
              No professional documents found matching your search.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
