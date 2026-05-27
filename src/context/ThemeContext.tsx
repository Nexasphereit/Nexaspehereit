import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeSettings = {
  primaryColor: string;
  sidebarColor: string;
  fontFamily: string;
  sidebarTheme: 'light' | 'dark';
  companyLogo?: string;
  customFonts?: { name: string; id: string; urlName?: string }[];
};

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (newSettings: Partial<ThemeSettings>) => void;
  toggleDarkMode: () => void;
}

const defaultSettings: ThemeSettings = {
  primaryColor: '#000000', // Black
  sidebarColor: '', // Default (use theme defaults)
  fontFamily: 'font-sans',
  sidebarTheme: 'light',
  companyLogo: '',
  customFonts: [
    { name: 'Default Sans (Outfit)', id: 'font-sans' },
    { name: 'Lora (Classic Elegant)', id: 'Lora' },
    { name: 'Inter (Sleek Modern)', id: 'Inter' },
    { name: 'Hind Siliguri (Bengali)', id: 'Hind Siliguri' },
    { name: 'Playfair Display (Serif)', id: 'Playfair Display' },
    { name: 'Fira Code (Technical)', id: 'font-mono' },
  ],
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function loadGoogleFont(fontName: string) {
  if (!fontName) return;
  const isPresetClass = ['font-sans', 'font-serif', 'font-mono'].includes(fontName);
  if (isPresetClass) return;
  
  const linkId = `google-font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(linkId)) return;
  
  try {
    const link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700&display=swap`;
    document.head.appendChild(link);
  } catch (e) {
    console.error('Failed to load Google Font:', fontName, e);
  }
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('nexasphere-theme');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('nexasphere-theme', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleDarkMode = () => {
    updateSettings({ sidebarTheme: settings.sidebarTheme === 'light' ? 'dark' : 'light' });
  };

  useEffect(() => {
    // Apply primary color to CSS variable
    document.documentElement.style.setProperty('--primary-brand', settings.primaryColor);
    
    // Create a subtle version of primary color for backgrounds
    const primaryRGB = hexToRgb(settings.primaryColor);
    if (primaryRGB) {
      document.documentElement.style.setProperty('--primary-brand-soft', `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.1)`);
    } else {
      document.documentElement.style.setProperty('--primary-brand-soft', `${settings.primaryColor}11`);
    }

    // Apply sidebar color if set
    if (settings.sidebarColor) {
      document.documentElement.style.setProperty('--sidebar-bg', settings.sidebarColor);
    } else {
      document.documentElement.style.removeProperty('--sidebar-bg');
    }
    if (settings.sidebarTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Apply font to body
    const body = document.body;
    body.classList.remove('font-sans', 'font-serif', 'font-mono');
    
    const font = settings.fontFamily || 'font-sans';
    if (['font-sans', 'font-serif', 'font-mono'].includes(font)) {
      body.classList.add(font);
      document.documentElement.style.removeProperty('--font-sans');
    } else {
      loadGoogleFont(font);
      document.documentElement.style.setProperty('--font-sans', `"${font}", ui-sans-serif, system-ui, sans-serif`);
      body.classList.add('font-sans');
    }
  }, [settings]);

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
