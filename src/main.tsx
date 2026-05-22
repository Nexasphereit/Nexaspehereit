// Compatibility hotfix for sandboxed iframe environments where window.fetch has only a getter.
// This prevents libraries like html2canvas from throwing 'Cannot set property fetch' when copying window properties.
(function() {
  function makeFetchWritable(obj: any) {
    if (!obj) return;
    try {
      const desc = Object.getOwnPropertyDescriptor(obj, 'fetch');
      if (desc && !desc.configurable) {
        return;
      }

      let originalFetch: any = undefined;
      if (desc && desc.get) {
        try {
          originalFetch = desc.get.call(obj);
        } catch (_) {
          originalFetch = (typeof window !== 'undefined' ? window.fetch : undefined) || 
                          (typeof globalThis !== 'undefined' ? globalThis.fetch : undefined);
        }
      } else if (desc) {
        originalFetch = desc.value;
      } else {
        try {
          originalFetch = obj.fetch;
        } catch (_) {
          originalFetch = (typeof window !== 'undefined' ? window.fetch : undefined) || 
                          (typeof globalThis !== 'undefined' ? globalThis.fetch : undefined);
        }
      }

      if (!originalFetch) {
        originalFetch = (typeof window !== 'undefined' ? window.fetch : undefined) || 
                        (typeof globalThis !== 'undefined' ? globalThis.fetch : undefined);
      }

      let storedFetch = originalFetch;
      Object.defineProperty(obj, 'fetch', {
        get() {
          return storedFetch;
        },
        set(newVal) {
          storedFetch = newVal;
        },
        configurable: true,
        enumerable: true
      });
    } catch (e) {
      // ignore
    }
  }

  try {
    makeFetchWritable(window);
    makeFetchWritable(Window.prototype);
    if (typeof globalThis !== 'undefined') {
      makeFetchWritable(globalThis);
    }
  } catch (e) {
    // ignore
  }

  // Intercept HTMLIFrameElement.prototype.contentWindow directly so that ANY iframe's content window
  // gets its fetch property automatically patched when accessed. This avoids using a Proxy,
  // preventing any native Javascript Proxy target invariant TypeErrors from being thrown.
  try {
    const descriptor = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow');
    if (descriptor && descriptor.get) {
      Object.defineProperty(HTMLIFrameElement.prototype, 'contentWindow', {
        get() {
          const win = descriptor.get.call(this);
          if (win) {
            try {
              makeFetchWritable(win);
              if (win.Window && win.Window.prototype) {
                makeFetchWritable(win.Window.prototype);
              }
            } catch (err) {
              // ignore
            }
          }
          return win;
        },
        configurable: true,
        enumerable: true
      });
    }
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
