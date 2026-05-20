import { cn } from '@/src/lib/utils';
import React from 'react';
import { useTheme } from '@/src/context/ThemeContext';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const { settings } = useTheme();
    
    const variants = {
      primary: 'text-white transition-all duration-300',
      secondary: 'bg-slate-900 text-white hover:bg-slate-800',
      outline: 'bg-transparent border border-slate-200 hover:border-slate-300 text-slate-700',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
      danger: 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-xl',
      md: 'px-6 py-3 rounded-2xl font-semibold',
      lg: 'px-8 py-4 rounded-2xl text-lg font-bold',
      icon: 'p-3 rounded-xl',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          'inline-flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none hover:brightness-110',
          variants[variant],
          sizes[size],
          className
        )}
        style={variant === 'primary' ? { 
           backgroundColor: settings.primaryColor,
           boxShadow: `0 10px 20px -6px ${settings.primaryColor}55`
        } : {}}
        {...props}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    const { settings } = useTheme();
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="text-[10px] pl-1 font-black uppercase tracking-[0.2em] text-slate-400 italic">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-5 py-3.5 border-none rounded-2xl transition-all outline-none placeholder:text-slate-300 text-sm font-medium',
            settings.sidebarTheme === 'dark' ? 'bg-slate-800/50 text-white' : 'bg-slate-100 text-slate-900',
            error && 'ring-2 ring-red-500/50',
            className
          )}
          style={{ 
             boxShadow: '0 0 0 0px transparent'
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = `0 0 0 2px ${settings.primaryColor}33`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = '0 0 0 0px transparent';
          }}
          {...props}
        />
        {error && <p className="text-[10px] text-red-500 pl-1 font-bold">{error}</p>}
      </div>
    );
  }
);

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const { settings } = useTheme();
  const isDark = settings.sidebarTheme === 'dark';
  return (
    <div className={cn(
      'rounded-3xl border p-8 transition-all duration-300', 
      isDark ? 'bg-slate-950/35 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] text-white' : 'bg-white border-slate-200 shadow-sm',
      className
    )}>
      {children}
    </div>
  );
};

interface ImageUploadProps {
  label: string;
  value?: string;
  onChange: (base64: string) => void;
  className?: string;
}

export const ImageUpload = ({ label, value, onChange, className }: ImageUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const rawBase64 = reader.result as string;
        
        // Setup image element to read width/height and draw on canvas
        const img = new Image();
        img.src = rawBase64;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // Dynamic compression as JPEG at 0.8 quality
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.82);
            onChange(compressedBase64);
          } else {
            onChange(rawBase64);
          }
        };
        img.onerror = () => {
          onChange(rawBase64);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <div 
        className="relative group border-2 border-dashed border-slate-200 rounded-3xl p-4 flex flex-col items-center justify-center gap-3 hover:border-rose-400 hover:bg-rose-50/30 transition-all cursor-pointer min-h-[140px]"
        onClick={() => document.getElementById(`file-upload-${label}`)?.click()}
      >
        {value ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img src={value} alt="Preview" className="max-h-[100px] object-contain rounded-xl shadow-md" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
              <p className="text-white text-xs font-bold">Change Image</p>
            </div>
          </div>
        ) : (
          <>
            <div className="p-3 bg-slate-100 rounded-2xl text-slate-400 group-hover:text-rose-600 group-hover:bg-rose-100 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
            <p className="text-xs text-slate-500 font-medium">Click to upload image</p>
          </>
        )}
        <input 
          id={`file-upload-${label}`}
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
