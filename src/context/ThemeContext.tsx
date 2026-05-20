import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeSettings = {
  primaryColor: string;
  sidebarColor: string;
  fontFamily: string;
  sidebarTheme: 'light' | 'dark';
  companyLogo?: string;
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
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

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
    body.classList.add(settings.fontFamily);
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
