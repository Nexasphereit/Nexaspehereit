import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function MessengerWidget() {
  const { settings } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'bot' | 'user'; time: string }>>([
    {
      text: "👋 Hey there! Welcome to NexaSphere IT. Let us know how we can accelerate your tech or design your dream project today!",
      sender: 'bot',
      time: 'Just now'
    },
    {
      text: "Our experts are online. Get a free proposal or strategic consultation instantly.",
      sender: 'bot',
      time: 'Just now'
    }
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Messenger Business URL
  const messengerUrl = "https://m.me/429457580254549";

  // Simulate premium tooltip display delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Append user message
    setMessages(prev => [...prev, { text: userText, sender: 'user', time: now }]);
    setInputValue('');

    // Simulate standard meta-hook direct forwarder after a quick reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: "Connecting to our Live Suite... Opening Messenger/Business inbox for direct priority chat!",
        sender: 'bot',
        time: now
      }]);
      
      // Open messenger after 1 second
      setTimeout(() => {
        window.open(messengerUrl, '_blank', 'noopener,noreferrer');
      }, 800);
    }, 500);
  };

  const handleQuickOption = (optionText: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { text: optionText, sender: 'user', time: now }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        text: `Consultation Option Selected: "${optionText}". Directing to Messenger Business Suite...`,
        sender: 'bot',
        time: now
      }]);
      setTimeout(() => {
        window.open(messengerUrl, '_blank', 'noopener,noreferrer');
      }, 800);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[80] font-sans antialiased text-left">
      <AnimatePresence>
        {/* Floating Tooltip Speech Bubble */}
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.85, y: 10, filter: 'blur(4px)' }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="absolute bottom-20 right-2 w-72 bg-slate-950 border border-indigo-500/30 text-white rounded-2xl p-4 shadow-2xl shadow-indigo-500/15 pointer-events-auto cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-slate-950 border-r border-b border-indigo-500/30 transform rotate-45" />
            <div className="flex items-start gap-2.5">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 mt-0.5">
                <MessageCircle size={14} className="animate-pulse" />
              </span>
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">NexaSphere Live</p>
                <p className="text-xs text-slate-200 mt-1 font-semibold leading-relaxed">
                  Need an elite full-stack system? Contact our principal architect free today!
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Chat Widget Panel */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.9, y: 30, filter: 'blur(6px)' }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="absolute bottom-20 right-0 w-[350px] max-w-[calc(100vw-2rem)] h-[480px] max-h-[75vh] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col z-[85]"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950/40 border-b border-slate-900 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-900/30 border border-indigo-500/20 text-indigo-400">
                    <MessageCircle size={18} />
                  </span>
                  <span className="absolute bottom-0 right-0 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-slate-950" />
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-white leading-none">NexaSphere IT</h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-1.5 flex items-center gap-1.5">
                    <span className="h-1 w-1 rounded-full bg-emerald-500" />
                    Messenger Business Active
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-900">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed font-semibold ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-slate-900/80 text-slate-200 border border-slate-900 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 px-1 font-bold">{msg.time}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Action Area */}
            <div className="p-3 border-t border-slate-900 bg-slate-950 flex flex-col gap-2">
              {/* Quick Reply Actions */}
              <div className="flex flex-wrap gap-1.5 pb-1">
                <button
                  onClick={() => handleQuickOption("💬 Hire Developers")}
                  className="text-[10px] font-bold text-slate-300 hover:text-white bg-slate-905 border border-slate-800 hover:border-indigo-500/30 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  💬 Hire Developers
                </button>
                <button
                  onClick={() => handleQuickOption("📝 Get a Free Proposal")}
                  className="text-[10px] font-bold text-slate-300 hover:text-white bg-slate-905 border border-slate-800 hover:border-indigo-500/30 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
                >
                  📝 Get Free Proposal
                </button>
              </div>

              {/* Direct Messenger Button */}
              <a
                href={messengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/10 active:scale-[0.98] transition-all"
              >
                <MessageCircle size={14} />
                Open Direct Messenger Chat
              </a>

              {/* Message Input */}
              <form onSubmit={handleSend} className="flex gap-2 items-center mt-1">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask a question or type details..."
                  className="flex-1 bg-slate-900 placeholder:text-slate-500 text-xs font-semibold text-white px-3 py-2.5 rounded-xl border border-slate-900 focus:outline-none focus:border-indigo-500/30"
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 hover:text-white hover:border-indigo-500/30 transition-all cursor-pointer"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Sparking Core Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        animate={{
          y: [0, -6, 0]
        }}
        transition={{
          y: {
            repeat: Infinity,
            duration: 3.5,
            ease: "easeInOut"
          }
        }}
        className="relative flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white shadow-2xl shadow-indigo-500/30 focus:outline-none cursor-pointer group"
        style={{
          boxShadow: `0 10px 30px -5px ${settings.primaryColor || '#6366f1'}70`
        }}
      >
        <div className="absolute inset-[-4px] rounded-full bg-gradient-to-tr from-indigo-600 to-pink-500 opacity-40 blur-md group-hover:opacity-60 transition-opacity animate-pulse" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={22} className="stroke-[2.5]" />
            </motion.div>
          ) : (
            <motion.div
              key="message"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle size={22} className="stroke-[2.5]" />
              <span className="absolute -top-1.5 -right-1.5 h-3 w-3 flex">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
