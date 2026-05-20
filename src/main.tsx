// Compatibility hotfix for sandboxed iframe environments where window.fetch has only a getter.
// This prevents libraries like html2canvas from throwing 'Cannot set property fetch' when copying window properties.
(function() {
  function makeFetchWritable(obj: any) {
    if (!obj) return;
    try {
      const desc = Object.getOwnPropertyDescriptor(obj, 'fetch');
      if (desc && !desc.configurable) {
        // If it exists but is already locked, we shouldn't attempt to re-define
        return;
      }

      let originalFetch: any = undefined;
      try {
        if (desc && desc.get) {
          // Avoid calling desc.get with Window.prototype as 'this' context as it triggers Illegal invocation
          if (obj !== Window.prototype) {
            originalFetch = desc.get.call(obj);
          }
        } else if (desc) {
          originalFetch = desc.value;
        }
      } catch (err) {
        // Ignore evaluation errors
      }

      if (!originalFetch) {
        originalFetch = obj.fetch || 
          (typeof window !== 'undefined' ? window.fetch : undefined) || 
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
        enumerable: desc ? desc.enumerable !== false : true
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

  try {
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName: string, options?: ElementCreationOptions): HTMLElement {
      const element = originalCreateElement.call(this, tagName, options);
      if (tagName && tagName.toLowerCase() === 'iframe') {
        const descriptor = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow');
        Object.defineProperty(element, 'contentWindow', {
          get() {
            const win = (descriptor && descriptor.get) ? descriptor.get.call(this) : (element as any).contentWindow;
            if (win && !win.__fetch_patched__) {
              try {
                win.__fetch_patched__ = true;
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
      return element;
    } as any;
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
