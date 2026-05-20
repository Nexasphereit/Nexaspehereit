// Compatibility hotfix for sandboxed iframe environments where window.fetch has only a getter.
// This prevents libraries like html2canvas from throwing 'Cannot set property fetch' when copying window properties.
(function() {
  function makeFetchWritable(obj: any) {
    if (!obj) return;
    try {
      const desc = Object.getOwnPropertyDescriptor(obj, 'fetch');
      if (desc) {
        if (desc.configurable) {
          const originalFetch = desc.get ? desc.get.call(obj) : (desc.value || obj.fetch);
          let storedFetch = originalFetch;
          Object.defineProperty(obj, 'fetch', {
            get() {
              return storedFetch;
            },
            set(newVal) {
              storedFetch = newVal;
            },
            configurable: true,
            enumerable: desc.enumerable !== false
          });
        }
      } else {
        const originalFetch = obj.fetch;
        let storedFetch = originalFetch;
        try {
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
        } catch (err) {
          // ignore
        }
      }
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
