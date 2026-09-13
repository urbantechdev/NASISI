import React, { useState, useEffect } from 'react';
import {
  Cookie,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  ArrowLeft,
  Printer,
  ChevronRight,
  Database,
  Lock,
  Sparkles,
  Info,
  Check,
  Save,
  RotateCcw,
} from 'lucide-react';
import { updateSEO } from '../utils/seo';

interface CookiePolicyPageProps {
  onBackToStorefront: () => void;
  onNavigateToPrivacy: () => void;
  onNavigateToTerms: () => void;
}

export interface CookiePreferences {
  essential: boolean; // Always true
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export const CookiePolicyPage: React.FC<CookiePolicyPageProps> = ({
  onBackToStorefront,
  onNavigateToPrivacy,
  onNavigateToTerms,
}) => {
  const [activeSection, setActiveSection] = useState<string>('what-are-cookies');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    updateSEO('cookies');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Cookie preferences state loaded from localStorage
  const [preferences, setPreferences] = useState<CookiePreferences>(() => {
    try {
      const saved = localStorage.getItem('nasisi_cookie_preferences');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      essential: true,
      functional: true,
      analytics: true,
      marketing: false,
    };
  });

  const lastUpdated = 'February 2026';
  const effectiveDate = 'January 1, 2026';

  const sections = [
    { id: 'what-are-cookies', title: '1. What Are Cookies & Web Storage?' },
    { id: 'how-we-use', title: '2. How NASISI Uses Cookies' },
    { id: 'cookie-table', title: '3. Technical Breakdown of Stored Data' },
    { id: 'preference-manager', title: '4. Interactive Cookie Preference Center' },
    { id: 'third-party', title: '5. Third-Party Integrations & Fonts' },
    { id: 'browser-controls', title: '6. Managing Cookies in Your Browser' },
    { id: 'contact-cookies', title: '7. Policy Updates & Privacy Inquiries' },
  ];

  const handleSavePreferences = () => {
    try {
      localStorage.setItem('nasisi_cookie_preferences', JSON.stringify(preferences));
      localStorage.setItem('nasisi_cookie_consent_status', 'customized');
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      // ignore
    }
  };

  const handleResetToDefaults = () => {
    const defaults: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: false,
    };
    setPreferences(defaults);
    try {
      localStorage.setItem('nasisi_cookie_preferences', JSON.stringify(defaults));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      // ignore
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Sticky Header */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-[#020a1c] via-[#06163c] to-[#030e28] text-white border-b border-blue-900/60 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToStorefront}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors cursor-pointer border border-white/15"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Storefront</span>
            </button>
            <div className="h-5 w-px bg-white/20 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2 text-xs text-blue-200">
              <span>Legal Center</span>
              <ChevronRight className="w-3 h-3 text-blue-400" />
              <span className="text-white font-semibold">Cookie & Storage Policy</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/15 text-xs">
              <button
                type="button"
                onClick={onNavigateToPrivacy}
                className="px-2.5 py-1 rounded-lg text-blue-200 hover:text-white font-medium transition-colors"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={onNavigateToTerms}
                className="px-2.5 py-1 rounded-lg text-blue-200 hover:text-white font-medium transition-colors"
              >
                Terms of Service
              </button>
              <button
                type="button"
                className="px-2.5 py-1 rounded-lg bg-[#D1E0FF] text-[#06163c] font-bold"
              >
                Cookies
              </button>
            </div>
            <button
              onClick={handlePrint}
              title="Print or Save as PDF"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors border border-white/15 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-[#020a1c] via-[#06163c] to-[#020a1c] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-blue-900/80">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-400/15 border border-blue-300/30 text-blue-200 text-xs font-bold uppercase tracking-wider">
            <Cookie className="w-3.5 h-3.5 text-[#D1E0FF]" />
            <span>Transparency & Client Storage Notice</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-['Outfit',sans-serif]">
            NASISI Cookie & Tracking Policy
          </h1>
          <p className="text-sm sm:text-base text-blue-100/90 max-w-2xl mx-auto leading-relaxed">
            Understanding how we use local storage, session identifiers, and essential cookies to power our 3D Mockup Studio, Cart Quote Estimator, and ERP invoicing.
          </p>
          <div className="pt-2 flex items-center justify-center gap-4 text-xs text-blue-300">
            <span>Last Updated: <strong>{lastUpdated}</strong></span>
            <span>•</span>
            <span>Effective Date: <strong>{effectiveDate}</strong></span>
            <span>•</span>
            <span>Storage Type: <strong>Client LocalStorage & Session</strong></span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar Table of Contents */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Contents
                </span>
                <span className="text-[11px] font-bold text-[#06163c]">7 Key Topics</span>
              </div>

              <nav className="space-y-1">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveSection(sec.id)}
                    className={`block px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      activeSection === sec.id
                        ? 'bg-[#D1E0FF]/30 text-[#06163c] font-bold border-l-4 border-[#06163c] pl-2.5'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="bg-blue-50/70 rounded-xl p-3.5 border border-blue-200/80 text-xs space-y-1.5">
                  <div className="font-bold text-[#06163c] flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#06163c]" />
                    <span>Instant Preference Controls</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    You can toggle functional and analytics storage preferences below with instant persistence.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Main Body */}
          <main className="lg:col-span-8 space-y-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm leading-relaxed text-slate-700">
            
            {/* 1. What are cookies */}
            <section id="what-are-cookies" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  01
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  What Are Cookies & Modern Web Storage?
                </h2>
              </div>
              <p className="text-sm">
                Cookies and modern HTML5 Web Storage (such as <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[#06163c] text-xs">localStorage</code> and <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[#06163c] text-xs">sessionStorage</code>) are compact data packages stored on your browser or device when you interact with our website.
              </p>
              <p className="text-sm">
                They allow the NASISI platform to recognize your browser, remember your active quote cart items, preserve your 3D customizer garment colors, and keep your administrative ERP session securely authenticated across page reloads.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* 2. How we use */}
            <section id="how-we-use" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  02
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  How NASISI Uses Cookies & Storage
                </h2>
              </div>
              <p className="text-sm">
                We categorize all browser data into four transparent functional buckets:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#06163c]">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Strictly Essential Storage</span>
                  </div>
                  <p className="text-slate-600">
                    Mandatory for the site to function properly (e.g. remembering quote items, security tokens, and view modes). These cannot be deactivated.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#06163c]">
                    <Sparkles className="w-3.5 h-3.5 text-[#06163c]" />
                    <span>Functional & Customizer State</span>
                  </div>
                  <p className="text-slate-600">
                    Saves your chosen fabric colors, active 3D stitch views, and quantity breakdowns so you don't lose progress during configuration.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#06163c]">
                    <Database className="w-3.5 h-3.5 text-blue-600" />
                    <span>Performance & Aggregated Analytics</span>
                  </div>
                  <p className="text-slate-600">
                    Measures catalog popularity (e.g. School Blazers vs Medical Scrubs) to optimize manufacturing inventory buffers.
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-[#06163c]">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span>Marketing & Direct Messaging</span>
                  </div>
                  <p className="text-slate-600">
                    Facilitates direct WhatsApp order routing and customized seasonal tender notifications.
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* 3. Technical Table */}
            <section id="cookie-table" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  03
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Technical Breakdown of Stored Keys
                </h2>
              </div>
              <p className="text-sm">
                Here is an exhaustive directory of browser keys utilized by the NASISI digital portal:
              </p>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <th className="p-3">Key Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Purpose</th>
                      <th className="p-3">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-600">
                    <tr>
                      <td className="p-3 font-mono font-bold text-[#06163c]">nasisi_quote_items</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Essential</span></td>
                      <td className="p-3">Stores items in your wholesale quote cart with quantities and branding choices.</td>
                      <td className="p-3">Persistent (Local)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-[#06163c]">nasisi_view_mode</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Essential</span></td>
                      <td className="p-3">Maintains state between Storefront, Admin ERP, and Legal Pages.</td>
                      <td className="p-3">Persistent (Local)</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-[#06163c]">nasisi_cookie_preferences</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">Essential</span></td>
                      <td className="p-3">Remembers your consent selections for cookie categories.</td>
                      <td className="p-3">1 Year</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-[#06163c]">nasisi_erp_invoices</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">Functional</span></td>
                      <td className="p-3">Caches generated Kenyan proforma invoices and receipt matrices locally.</td>
                      <td className="p-3">Persistent</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* 4. Interactive Preference Center */}
            <section id="preference-manager" className="space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-[#D1E0FF] text-[#06163c] flex items-center justify-center font-bold text-xs">
                  04
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Interactive Cookie Preference Center
                </h2>
              </div>
              <p className="text-sm">
                Adjust your tracking and storage settings below. Changes will immediately take effect for this browser.
              </p>

              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-4">
                
                {/* 1. Essential */}
                <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-white border border-slate-200">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Strictly Essential Storage</span>
                      <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide bg-slate-200 text-slate-700 rounded-full">
                        Required
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Required to navigate the catalog, calculate quotes in KSh, and preserve your cart items.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.essential}
                    disabled
                    className="w-5 h-5 accent-[#06163c] rounded cursor-not-allowed mt-1"
                  />
                </div>

                {/* 2. Functional */}
                <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-white border border-slate-200">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Functional & 3D Mockup Studio</span>
                      <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wide bg-blue-100 text-[#06163c] rounded-full">
                        Recommended
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Remembers custom fabric pantones, embroidery crest uploads, and size guide preferences.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.functional}
                    onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                    className="w-5 h-5 accent-[#06163c] rounded cursor-pointer mt-1"
                  />
                </div>

                {/* 3. Analytics */}
                <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-white border border-slate-200">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Performance & Usage Analytics</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Helps our manufacturing line analyze high-demand uniform sizes to prevent stock shortages.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="w-5 h-5 accent-[#06163c] rounded cursor-pointer mt-1"
                  />
                </div>

                {/* 4. Marketing */}
                <div className="flex items-start justify-between gap-4 p-3.5 rounded-xl bg-white border border-slate-200">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">Marketing & Seasonal Intakes</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Enables periodic back-to-school discount alerts and customized institutional tender notifications.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="w-5 h-5 accent-[#06163c] rounded cursor-pointer mt-1"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleResetToDefaults}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-200 hover:bg-slate-300 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset to Defaults</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-[#06163c] bg-[#D1E0FF] hover:bg-[#b8d0ff] shadow-xs border border-blue-200 transition-all active:scale-95 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save My Preferences</span>
                  </button>
                </div>

                {saveSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>Cookie preferences saved successfully!</span>
                  </div>
                )}

              </div>
            </section>

            <hr className="border-slate-100" />

            {/* 5. Third Party */}
            <section id="third-party" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  05
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Third-Party Integrations & Font Delivery
                </h2>
              </div>
              <p className="text-sm">
                Our web platform utilizes external CDNs to deliver crisp typography (Google Fonts: Plus Jakarta Sans & Outfit) and vector iconography. These assets do not collect individual identifiers or track user journeys outside of standard HTTP server logs.
              </p>
            </section>

            <hr className="border-slate-100" />

            {/* 6. Browser Controls */}
            <section id="browser-controls" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  06
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Managing Cookies in Your Web Browser
                </h2>
              </div>
              <p className="text-sm">
                You can block, delete, or manage cookie behavior at any time through your browser settings:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong>Google Chrome:</strong> Settings → Privacy and security → Cookies and other site data.
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong>Apple Safari (iOS / macOS):</strong> Settings → Safari → Advanced → Privacy → Block All Cookies.
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong>Mozilla Firefox:</strong> Settings → Privacy & Security → Enhanced Tracking Protection.
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <strong>Microsoft Edge:</strong> Settings → Cookies and site permissions → Manage and delete cookies.
                </div>
              </div>
            </section>

            <hr className="border-slate-100" />

            {/* 7. Contact */}
            <section id="contact-cookies" className="space-y-3 scroll-mt-24">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-100 text-[#06163c] flex items-center justify-center font-bold text-xs">
                  07
                </span>
                <h2 className="text-lg sm:text-xl font-black text-[#06163c]">
                  Policy Updates & Privacy Inquiries
                </h2>
              </div>
              <p className="text-sm">
                We may periodically revise this Cookie Policy to reflect changes in our manufacturing workflow or Kenyan statutory privacy regulations.
              </p>
              <p className="text-sm">
                If you have questions about how we handle local storage or cookies, please email{' '}
                <a href="mailto:privacy@nasisiuniforms.com" className="text-[#06163c] font-bold underline">
                  privacy@nasisiuniforms.com
                </a>{' '}
                or call our factory helpdesk at <strong>0728102929 (+254 728 102 929)</strong>.
              </p>
            </section>

          </main>
        </div>
      </div>

      {/* Quick Footer for Cookies */}
      <footer className="bg-slate-100 border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} NASISI Knitwear and Graphics. Nairobi, Kenya. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={onNavigateToPrivacy} className="hover:underline text-[#06163c] font-semibold">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={onNavigateToTerms} className="hover:underline text-[#06163c] font-semibold">
              Terms of Service
            </button>
            <span>•</span>
            <button onClick={onBackToStorefront} className="hover:underline text-[#06163c] font-bold">
              Return to Catalog
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
