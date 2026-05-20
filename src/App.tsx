import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'motion/react';
import Sidebar from './components/common/Sidebar';
import Dashboard from './pages/Dashboard';
import QuotationGenerator from './pages/QuotationGenerator';
import CVGenerator from './pages/CVGenerator';
import ReceiptGenerator from './pages/ReceiptGenerator';
import MenuGenerator from './pages/MenuGenerator';
import History from './pages/History';
import Settings from './pages/Settings';
import ITSalesDashboard from './pages/ITSalesDashboard';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { cn } from './lib/utils';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import Login from './pages/Login';
import { GalaxyBackground } from './components/common/GalaxyBackground';

function AppContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { settings } = useTheme();

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <Router>
      <div className={cn("flex min-h-screen transition-colors duration-300 relative overflow-hidden", settings.fontFamily, settings.sidebarTheme === 'dark' ? 'bg-[#02020a] text-white' : 'bg-slate-50 text-slate-900')}>
        {settings.sidebarTheme === 'dark' && <GalaxyBackground />}
        <Sidebar />
        <main className={cn("flex-1 md:ml-[280px] pt-20 pb-24 px-4 md:p-8 transition-all relative z-10", settings.sidebarTheme === 'dark' ? 'bg-transparent' : 'bg-slate-50')}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/it-sales" element={<ITSalesDashboard />} />
              <Route path="/quotations/:id?" element={<QuotationGenerator />} />
              <Route path="/cvs/:id?" element={<CVGenerator />} />
              <Route path="/receipts/:id?" element={<ReceiptGenerator />} />
              <Route path="/history" element={<History />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </motion.div>
        </main>
        <Toaster position="bottom-right" />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
