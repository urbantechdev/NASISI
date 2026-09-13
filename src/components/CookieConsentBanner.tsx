import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X, Check, SlidersHorizontal, ArrowRight } from 'lucide-react';

interface CookieConsentBannerProps {
  onOpenCookiePolicy: () => void;
  onOpenPrivacyPolicy: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onOpenCookiePolicy,
  onOpenPrivacyPolicy,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('nasisi_cookie_consent_status');
      if (!consent) {
        // Show banner after a slight delay so it doesn't jarringly block the initial load
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('nasisi_cookie_consent_status', 'accepted_all');
      localStorage.setItem(
        'nasisi_cookie_preferences',
        JSON.stringify({
          essential: true,
          functional: true,
          analytics: true,
          marketing: true,
        })
      );
    } catch {
      // ignore
    }
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    try {
      localStorage.setItem('nasisi_cookie_consent_status', 'rejected_optional');
      localStorage.setItem(
        'nasisi_cookie_preferences',
        JSON.stringify({
          essential: true,
          functional: false,
          analytics: false,
          marketing: false,
        })
      );
    } catch {
      // ignore
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-3 left-3 right-3 sm:left-6 sm:right-auto sm:max-w-md z-50 bg-white text-slate-900 p-4 sm:p-5 rounded-2xl shadow-2xl border border-slate-200/90 backdrop-blur-md animate-fadeIn"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#D1E0FF] text-[#06163c] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
          <Cookie className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#06163c]">
              Cookie & Data Privacy Notice
            </h4>
            <button
              type="button"
              onClick={handleRejectNonEssential}
              className="text-slate-400 hover:text-slate-700 transition-colors p-1"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            We use essential local storage to power our 3D Mockup Studio, preserve quote cart items in KSh, and comply with the Kenya Data Protection Act.
          </p>
          <div className="flex items-center gap-2 pt-0.5 text-[11px]">
            <button
              type="button"
              onClick={onOpenCookiePolicy}
              className="text-[#06163c] hover:underline font-bold"
            >
              Cookie Policy
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={onOpenPrivacyPolicy}
              className="text-[#06163c] hover:underline font-bold"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={handleRejectNonEssential}
          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all text-center border border-slate-200 cursor-pointer"
        >
          Essential Only
        </button>
        <button
          type="button"
          onClick={handleAcceptAll}
          className="px-3 py-2 rounded-xl bg-[#D1E0FF] hover:bg-[#b8d0ff] text-[#06163c] text-xs font-bold shadow-xs transition-all active:scale-95 text-center cursor-pointer flex items-center justify-center gap-1 border border-blue-200"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Accept All</span>
        </button>
      </div>
    </div>
  );
};
