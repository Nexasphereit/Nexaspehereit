import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type ThemeSettings = {
  primaryColor: string;
  sidebarColor: string;
  fontFamily: string;
  sidebarTheme: 'light' | 'dark';
  companyLogo?: string;
  companyLogoLight?: string;
  companyName?: string;
  companyTagline?: string;
  logoHeight?: number;
  customFonts?: { name: string; id: string; urlName?: string }[];
  currency?: string;
};

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (newSettings: Partial<ThemeSettings>) => void;
  toggleDarkMode: () => void;
  redirection: {
    active: boolean;
    type: 'call' | 'mail' | 'map' | null;
    target: string;
    label?: string;
  };
  triggerRedirection: (type: 'call' | 'mail' | 'map', target: string, label?: string) => void;
  resetRedirection: () => void;
}

const logoSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 650 160'>
  <defs>
    <linearGradient id='logo-red-grad' x1='0%' y1='0%' x2='100%' y2='100%'>
      <stop offset='0%' stop-color='#f43f5e' />
      <stop offset='50%' stop-color='#e11d48' />
      <stop offset='100%' stop-color='#9f1239' />
    </linearGradient>
  </defs>
  <g transform='translate(10, 5)'>
    <path d='M 115,30 L 140,55 L 140,105 L 115,130' fill='none' stroke='url(#logo-red-grad)' stroke-width='11' stroke-linecap='round' stroke-linejoin='round' />
    <path d='M 55,130 L 30,105 L 30,55 L 55,30' fill='none' stroke='url(#logo-red-grad)' stroke-width='11' stroke-linecap='round' stroke-linejoin='round' />
    <path d='M 115,30 L 65,80 L 65,115' fill='none' stroke='url(#logo-red-grad)' stroke-width='11' stroke-linecap='round' stroke-linejoin='round' />
    <path d='M 55,130 L 105,80 L 105,45' fill='none' stroke='url(#logo-red-grad)' stroke-width='11' stroke-linecap='round' stroke-linejoin='round' />
    <circle cx='115' cy='30' r='12' fill='#ffffff' stroke='url(#logo-red-grad)' stroke-width='6' />
    <circle cx='55' cy='130' r='12' fill='#ffffff' stroke='url(#logo-red-grad)' stroke-width='6' />
    <text x='170' y='82' font-family='&quot;Space Grotesk&quot;, &quot;Outfit&quot;, &quot;Inter&quot;, sans-serif' font-size='56' font-weight='800' fill='#000000' letter-spacing='-1'>NexaSphere It</text>
    <text x='172' y='122' font-family='&quot;Alex Brush&quot;, &quot;Playfair Display&quot;, cursive, serif' font-size='32' font-weight='500' fill='#000000' letter-spacing='1'>new ideas, new success</text>
  </g>
</svg>`;

const logoSvgDark = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 650 160'>
  <defs>
    <linearGradient id='logo-red-grad-dark' x1='0%' y1='0%' x2='100%' y2='100%'>
      <stop offset='0%' stop-color='#f43f5e' />
      <stop offset='50%' stop-color='#e11d48' />
      <stop offset='100%' stop-color='#9f1239' />
    </linearGradient>
  </defs>
  <g transform='translate(10, 5)'>
    <path d='M 115,30 L 140,55 L 140,105 L 115,130' fill='none' stroke='url(#logo-red-grad-dark)' stroke-width='11' stroke-linecap='round' stroke-linejoin='round' />
    <path d='M 55,130 L 30,105 L 30,55 L 55,30' fill='none' stroke='url(#logo-red-grad-dark)' stroke-width='11' stroke-linecap='round' stroke-linejoin='round' />
    <path d='M 115,30 L 65,80 L 65,115' fill='none' stroke='url(#logo-red-grad-dark)' stroke-width='11' stroke-linecap='round' stroke-linejoin='round' />
    <path d='M 55,130 L 105,80 L 105,45' fill='none' stroke='url(#logo-red-grad-dark)' stroke-width='11' stroke-linecap='round' stroke-linejoin='round' />
    <circle cx='115' cy='30' r='12' fill='#03030c' stroke='url(#logo-red-grad-dark)' stroke-width='6' />
    <circle cx='55' cy='130' r='12' fill='#03030c' stroke='url(#logo-red-grad-dark)' stroke-width='6' />
    <text x='170' y='82' font-family='&quot;Space Grotesk&quot;, &quot;Outfit&quot;, &quot;Inter&quot;, sans-serif' font-size='56' font-weight='800' fill='#ffffff' letter-spacing='-1'>NexaSphere It</text>
    <text x='172' y='122' font-family='&quot;Alex Brush&quot;, &quot;Playfair Display&quot;, cursive, serif' font-size='32' font-weight='500' fill='#ffffff' letter-spacing='1'>new ideas, new success</text>
  </g>
</svg>`;

const encodeSvgToBase64 = (svg: string) => {
  if (typeof window === 'undefined') return '';
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
};

const defaultLogoDataUri = encodeSvgToBase64(logoSvg);
const defaultLogoLightDataUri = encodeSvgToBase64(logoSvgDark);

const defaultSettings: ThemeSettings = {
  primaryColor: '#e11d48', // Match the red branding color of Nexasphere It
  sidebarColor: '', // Default (use theme defaults)
  fontFamily: 'font-sans',
  sidebarTheme: 'light',
  companyLogo: '',
  companyLogoLight: '',
  companyName: 'NexaSphere It',
  companyTagline: 'new ideas, new success',
  logoHeight: 40,
  currency: 'BDT',
  customFonts: [
    { name: 'Default Sans (Outfit)', id: 'font-sans' },
    { name: 'Lora (Classic Elegant)', id: 'Lora' },
    { name: 'Inter (Sleek Modern)', id: 'Inter' },
    { name: 'Hind Siliguri (Bengali)', id: 'Hind Siliguri' },
    { name: 'Playfair Display (Serif)', id: 'Playfair Display' },
    { name: 'Fira Code (Technical)', id: 'font-mono' },
  ],
};

export const getCurrencySymbol = (code: string | undefined): string => {
  switch (code || 'BDT') {
    case 'BDT': return '৳';
    case 'USD': return '$';
    case 'EUR': return '€';
    case 'GBP': return '£';
    case 'INR': return '₹';
    case 'SAR': return 'SR ';
    case 'AED': return 'Dh ';
    default: return '$';
  }
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
    const saved = typeof window !== 'undefined' ? localStorage.getItem('nexasphere-theme') : null;
    if (saved) {
      try {
        const parsedObject = JSON.parse(saved);
        const parsed = { ...defaultSettings, ...parsedObject };
        
        // Helper to identify and replace outdated branding / Nexora logos
        const isOldBranding = (logoUri: string | undefined): boolean => {
          if (!logoUri) return false;
          // Check for old brand identifiers, default hardcoded red logo or empty-intent resets
          const matches = logoUri.includes('Nexora') || 
                          logoUri.includes('nexora') || 
                          logoUri.includes('logo-blue-grad') ||
                          logoUri.includes('logo-red-grad') ||
                          logoUri === defaultLogoDataUri ||
                          logoUri === defaultLogoLightDataUri;
          return matches;
        };

        if (isOldBranding(parsed.companyLogo)) {
          parsed.companyLogo = '';
        }
        if (isOldBranding(parsed.companyLogoLight)) {
          parsed.companyLogoLight = '';
        }

        // Return updated object to save and sync automatically
        localStorage.setItem('nexasphere-theme', JSON.stringify(parsed));
        return parsed;
      } catch (e) {
        console.error('Failed to parse nexasphere-theme from localStorage', e);
      }
    }
    return defaultSettings;
  });

  const [redirection, setRedirection] = useState<{
    active: boolean;
    type: 'call' | 'mail' | 'map' | null;
    target: string;
    label?: string;
  }>({
    active: false,
    type: null,
    target: '',
    label: ''
  });

  const triggerRedirection = (type: 'call' | 'mail' | 'map', target: string, label?: string) => {
    setRedirection({
      active: true,
      type,
      target,
      label
    });
  };

  const resetRedirection = () => {
    setRedirection({
      active: false,
      type: null,
      target: '',
      label: ''
    });
  };

  const updateSettings = async (newSettings: Partial<ThemeSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('nexasphere-theme', JSON.stringify(updated));
      return updated;
    });
    try {
      await setDoc(doc(db, 'nexora_config', 'theme_settings'), newSettings, { merge: true });
    } catch (e) {
      console.warn("Could not sync settings to Firestore:", e);
    }
  };

  useEffect(() => {
    const fetchGlobalThemeSettings = async () => {
      try {
        const tDoc = await getDoc(doc(db, 'nexora_config', 'theme_settings'));
        if (tDoc.exists()) {
          const cloudData = tDoc.data();
          setSettings(prev => {
            const merged = { ...prev, ...cloudData };
            localStorage.setItem('nexasphere-theme', JSON.stringify(merged));
            return merged;
          });
        }
      } catch (err) {
        console.warn("Global theme settings read deferred:", err);
      }
    };
    fetchGlobalThemeSettings();
  }, []);

  const toggleDarkMode = () => {
    updateSettings({ sidebarTheme: settings.sidebarTheme === 'light' ? 'dark' : 'light' });
  };

  useEffect(() => {
    // Preload elegant cursive-style signature font for corporate logo
    loadGoogleFont('Alex Brush');

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

    // Dynamically update the web browser tab icon (favicon) with active company logo
    if (settings.companyLogo) {
      let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/png';
        document.head.appendChild(link);
      }
      link.href = settings.companyLogo;
    }
  }, [settings]);

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, toggleDarkMode, redirection, triggerRedirection, resetRedirection }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
