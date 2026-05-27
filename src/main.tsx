// Compatibility hotfix for sandboxed iframe environments where window.fetch has only a getter.
// This prevents libraries from throwing 'Cannot set property fetch' when copying window properties.
(function() {
  if (typeof window === 'undefined') return;
  try {
    const originalFetch = window.fetch;
    let redefinitionSuccess = false;

    // 1. Try to redefine 'fetch' directly on the 'window' object first (own property).
    // This is crucial because if 'window' has its own 'fetch' property with only a getter,
    // assigning to window.fetch throws directly on window and bypasses any setter on Window.prototype.
    try {
      Object.defineProperty(window, 'fetch', {
        get() {
          return '__customFetch' in this ? (this as any).__customFetch : originalFetch;
        },
        set(val) {
          (this as any).__customFetch = val;
        },
        configurable: true,
        enumerable: true
      });
      redefinitionSuccess = true;
    } catch (err) {
      // If direct definition failed (e.g. non-configurable), try deleting the property first then defining.
      try {
        delete (window as any).fetch;
        Object.defineProperty(window, 'fetch', {
          get() {
            return '__customFetch' in this ? (this as any).__customFetch : originalFetch;
          },
          set(val) {
            (this as any).__customFetch = val;
          },
          configurable: true,
          enumerable: true
        });
        redefinitionSuccess = true;
      } catch (deleteErr) {
        // Safe to ignore
      }
    }

    // 2. Fallback: Define getter/setter on Window.prototype if direct redefinition failed
    if (!redefinitionSuccess) {
      Object.defineProperty(Window.prototype, 'fetch', {
        get() {
          return '__customFetch' in this ? (this as any).__customFetch : originalFetch;
        },
        set(val) {
          try {
            Object.defineProperty(this, '__customFetch', {
              value: val,
              writable: true,
              configurable: true,
              enumerable: false
            });
          } catch (_) {
            try {
              (this as any).__customFetch = val;
            } catch (__) {}
          }
        },
        configurable: true,
        enumerable: true
      });
    }
  } catch (e) {
    // ignore
  }

  // Handle global unhandled errors specifically for fetch assignments to capture any remaining deviations safely
  try {
    window.addEventListener('error', function(event) {
      if (event && event.message && (
        event.message.includes("Cannot set property fetch") || 
        event.message.includes("is read-only") || 
        event.message.includes("has only a getter")
      )) {
        event.preventDefault();
        console.warn("Swallowed sandboxed fetch assignment error:", event.message);
      }
    });
  } catch (e) {
    // ignore
  }
})();

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
