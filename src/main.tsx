// Compatibility hotfix for sandboxed iframe environments where window.fetch has only a getter.
// This prevents libraries like html2canvas from throwing 'Cannot set property fetch' when copying window properties.
(function() {
  try {
    const desc = Object.getOwnPropertyDescriptor(window, 'fetch');
    if (desc && (!desc.configurable || desc.writable === false || !desc.set)) {
      const originalFetch = window.fetch;
      try {
        Object.defineProperty(window, 'fetch', {
          get() {
            return originalFetch;
          },
          set() {
            // No-op setter
          },
          configurable: true,
          enumerable: true
        });
      } catch (e) {
        // Redefining main window may fail if non-configurable, which is fine
      }
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
                const originalFetch = win.fetch;
                Object.defineProperty(win, 'fetch', {
                  get() {
                    return originalFetch;
                  },
                  set() {
                    // No-op setter to avoid throwing when cloning window properties
                  },
                  configurable: true,
                  enumerable: true
                });
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
