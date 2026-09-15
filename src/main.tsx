import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Guard against benign browser extension message channel rejections (e.g. chrome.runtime disconnects in iframes)
if (typeof window !== 'undefined') {
  const isBenignExtensionError = (err: unknown): boolean => {
    if (!err) return false;
    const msg = typeof err === 'string' ? err : ((err as any)?.message || String(err) || '');
    return (
      msg.includes('Could not establish connection. Receiving end does not exist') ||
      msg.includes('Receiving end does not exist') ||
      msg.includes('ResizeObserver loop') ||
      msg.includes('message channel closed')
    );
  };

  window.addEventListener(
    'unhandledrejection',
    (event: PromiseRejectionEvent) => {
      if (isBenignExtensionError(event.reason)) {
        event.preventDefault();
        event.stopImmediatePropagation?.();
      }
    },
    true
  );

  window.addEventListener(
    'error',
    (event: ErrorEvent) => {
      if (isBenignExtensionError(event.error) || isBenignExtensionError(event.message)) {
        event.preventDefault();
        event.stopImmediatePropagation?.();
      }
    },
    true
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
