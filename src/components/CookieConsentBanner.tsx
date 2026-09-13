import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X } from 'lucide-react';

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
      const consent = localStorage.getItem('nasisi_cookie_consent');
      if (!consent) {
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('nasisi_cookie_consent', 'accepted');
    } catch {
      // ignore
    }
    setIsVisible(false);
  };

  const handleDecline = () => {
    try {
      localStorage.setItem('nasisi_cookie_consent', 'essential_only');
    } catch {
      // ignore
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[90] bg-white text-slate-900 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.2)] border border-slate-200/90 p-4.5 animate-slideUp font-['Plus_Jakarta_Sans',sans-serif]"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#06163c] flex items-center justify-center shrink-0">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Your Privacy & Cookie Choices</span>
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            </h4>
            <button
              type="button"
              onClick={handleDecline}
              className="text-slate-400 hover:text-slate-700 p-0.5 transition-colors cursor-pointer"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            We use technical cookies and local storage to preserve your quotation items, 3D customizer configurations, and enterprise session preferences.
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleAccept}
              className="flex-1 py-1.5 px-3 rounded-lg bg-[#06163c] hover:bg-[#081e52] text-white text-xs font-bold transition-colors cursor-pointer text-center"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={handleDecline}
              className="py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Essential Only
            </button>
            <button
              type="button"
              onClick={onOpenCookiePolicy}
              className="text-[11px] text-blue-700 hover:underline font-semibold"
            >
              Policy
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
