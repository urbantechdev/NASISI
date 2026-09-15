import React, { ErrorInfo, ReactNode } from 'react';
import { purgeStaleStorage, safeRemoveItem } from '../utils/storage';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends (React.Component as any) {
  state: State;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    const msg = error?.message || String(error);
    if (
      msg.includes('Could not establish connection. Receiving end does not exist') ||
      msg.includes('Receiving end does not exist') ||
      msg.includes('ResizeObserver loop')
    ) {
      return { hasError: false, error: null };
    }
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const msg = error?.message || String(error);
    if (
      msg.includes('Could not establish connection. Receiving end does not exist') ||
      msg.includes('Receiving end does not exist') ||
      msg.includes('ResizeObserver loop')
    ) {
      return;
    }
    console.error('Uncaught application error caught by ErrorBoundary:', error, errorInfo);
  }

  public handleReset = () => {
    try {
      purgeStaleStorage();
      safeRemoveItem('nasisi_erp_products_v4');
      safeRemoveItem('nasisi_view_mode');
    } catch {
      // ignore
    }
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-slate-900 font-sans">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h2 className="text-xl font-bold font-['Outfit'] text-slate-900">
              Something went wrong
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              The application encountered an unexpected issue. Please click below to reset and reload the page.
            </p>
            {this.state.error && (
              <div className="p-3 bg-slate-100 rounded-xl text-[11px] font-mono text-slate-600 text-left overflow-auto max-h-24">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <button
              type="button"
              onClick={this.handleReset}
              className="w-full py-2.5 px-4 bg-[#06163c] hover:bg-[#0a235c] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
