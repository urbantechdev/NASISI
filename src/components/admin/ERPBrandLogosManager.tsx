import React, { useState, useRef } from 'react';
import { useERP } from '../../context/ERPContext';
import { applyBrowserFavicon, DEFAULT_FAVICON_DATA_URI } from '../../utils/favicon';
import { NasisiLogo } from '../NasisiLogo';
import {
  Image as ImageIcon,
  Upload,
  Globe,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Sliders,
  Eye,
  Trash2,
  Bookmark,
  Layers,
  Info,
  Check,
} from 'lucide-react';

// Preset sample logo SVG data URIs for instant 1-click previewing & customization
const PRESET_LOGOS = [
  {
    id: 'gold-crest',
    name: 'Executive Gold & Navy Crest',
    tag: 'Premium / School',
    url: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 80'%3E%3Cdefs%3E%3ClinearGradient id='gold' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23FDE047'/%3E%3Cstop offset='50%25' stop-color='%23EAB308'/%3E%3Cstop offset='100%25' stop-color='%23CA8A04'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='10' y='10' width='60' height='60' rx='14' fill='%23041429' stroke='url(%23gold)' stroke-width='2.5'/%3E%3Cpath d='M25 55 L25 25 L40 45 L40 25 L55 55 L55 25' stroke='url(%23gold)' stroke-width='4.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3Ccircle cx='55' cy='25' r='3.5' fill='%23FDE047'/%3E%3Ctext x='84' y='42' font-family='sans-serif' font-weight='900' font-size='24' fill='%23FFFFFF' letter-spacing='2'%3ENASISI%3C/text%3E%3Ctext x='84' y='60' font-family='sans-serif' font-weight='600' font-size='10' fill='%23EAB308' letter-spacing='3'%3EKNITWEAR %26 GRAPHICS%3C/text%3E%3C/svg%3E`,
  },
  {
    id: 'cyan-minimal',
    name: 'Modern Cyan Textile Emblem',
    tag: 'Modern Minimal',
    url: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 80'%3E%3Cdefs%3E%3ClinearGradient id='cyan' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2338BDF8'/%3E%3Cstop offset='100%25' stop-color='%230284C7'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ccircle cx='40' cy='40' r='28' fill='%230369A1' fill-opacity='0.2' stroke='%2338BDF8' stroke-width='2'/%3E%3Cpath d='M28 52 L28 28 L40 42 L40 28 L52 52 L52 28' stroke='%2338BDF8' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3Ctext x='84' y='42' font-family='sans-serif' font-weight='900' font-size='24' fill='%23FFFFFF' letter-spacing='2'%3ENASISI%3C/text%3E%3Ctext x='84' y='60' font-family='sans-serif' font-weight='600' font-size='10' fill='%237DD3FC' letter-spacing='3'%3EPRECISION APPAREL%3C/text%3E%3C/svg%3E`,
  },
  {
    id: 'monochrome-white',
    name: 'Monochrome Silver White (Footer/Night)',
    tag: 'High Contrast',
    url: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 80'%3E%3Crect x='10' y='12' width='56' height='56' rx='10' fill='%23FFFFFF' fill-opacity='0.1' stroke='%23FFFFFF' stroke-width='2'/%3E%3Cpath d='M24 54 L24 26 L38 43 L38 26 L52 54 L52 26' stroke='%23FFFFFF' stroke-width='4' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3Ctext x='82' y='42' font-family='sans-serif' font-weight='900' font-size='24' fill='%23FFFFFF' letter-spacing='2'%3ENASISI%3C/text%3E%3Ctext x='82' y='58' font-family='sans-serif' font-weight='600' font-size='10' fill='%2394A3B8' letter-spacing='3'%3EKURVE %26 APPAREL%3C/text%3E%3C/svg%3E`,
  },
];

const PRESET_FAVICONS = [
  {
    id: 'default-stitch',
    name: 'Cyan Stitch Monogram (Default)',
    url: DEFAULT_FAVICON_DATA_URI,
  },
  {
    id: 'gold-needle',
    name: 'Golden Needle & Shield',
    url: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='16' fill='%23041429'/%3E%3Cpath d='M18 46 L18 18 L32 38 L32 18 L46 46 L46 18' stroke='%23EAB308' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3Ccircle cx='46' cy='18' r='4' fill='%23FDE047'/%3E%3C/svg%3E`,
  },
  {
    id: 'sapphire-dot',
    name: 'Sapphire Modern Square',
    url: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230284c7'/%3E%3Cpath d='M18 46 L18 18 L32 38 L32 18 L46 46 L46 18' stroke='%23ffffff' stroke-width='6' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3Ccircle cx='46' cy='18' r='3.5' fill='%23ffffff'/%3E%3C/svg%3E`,
  },
];

export const ERPBrandLogosManager: React.FC = () => {
  const { businessProfile, updateBusinessProfile } = useERP();

  // Local working copy for real-time manipulation
  const [logoUrl, setLogoUrl] = useState<string>(businessProfile.logoUrl || '');
  const [faviconUrl, setFaviconUrl] = useState<string>(businessProfile.faviconUrl || '');
  const [footerLogoUrl, setFooterLogoUrl] = useState<string>(businessProfile.footerLogoUrl || '');
  const [logoDisplayMode, setLogoDisplayMode] = useState<'image-only' | 'image-and-text'>(
    businessProfile.logoDisplayMode || 'image-only'
  );

  const [useSameForFooter, setUseSameForFooter] = useState<boolean>(!businessProfile.footerLogoUrl);
  const [saveToast, setSaveToast] = useState(false);
  const [activeTabPreview, setActiveTabPreview] = useState<'dark' | 'light'>('dark');

  const mainLogoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const footerLogoInputRef = useRef<HTMLInputElement>(null);

  // Helper to read uploaded files as Base64 data URLs
  const handleFileUpload = (
    file: File,
    type: 'logo' | 'favicon' | 'footer'
  ) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, SVG, JPG, WebP, or ICO).');
      return;
    }

    // Recommended limit: 4MB
    if (file.size > 4 * 1024 * 1024) {
      alert('Image file size is large (>4MB). Please optimize for faster loading.');
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return;

      if (type === 'logo') {
        setLogoUrl(result);
        // Instantly update context so app changes immediately
        updateBusinessProfile({ ...businessProfile, logoUrl: result });
      } else if (type === 'favicon') {
        setFaviconUrl(result);
        applyBrowserFavicon(result);
        updateBusinessProfile({ ...businessProfile, faviconUrl: result });
      } else if (type === 'footer') {
        setFooterLogoUrl(result);
        setUseSameForFooter(false);
        updateBusinessProfile({ ...businessProfile, footerLogoUrl: result });
      }
      showInstantSavedBadge();
    };
    reader.readAsDataURL(file);
  };

  const showInstantSavedBadge = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
  };

  // Instant apply to entire app & persist
  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalFooter = useSameForFooter ? '' : footerLogoUrl;

    updateBusinessProfile({
      ...businessProfile,
      logoUrl: logoUrl.trim(),
      faviconUrl: faviconUrl.trim(),
      footerLogoUrl: finalFooter.trim(),
      logoDisplayMode,
    });

    applyBrowserFavicon(faviconUrl.trim());
    showInstantSavedBadge();
  };

  // Reset helpers
  const handleResetMainLogo = () => {
    setLogoUrl('');
    updateBusinessProfile({ ...businessProfile, logoUrl: '' });
    showInstantSavedBadge();
  };

  const handleResetFavicon = () => {
    setFaviconUrl('');
    applyBrowserFavicon('');
    updateBusinessProfile({ ...businessProfile, faviconUrl: '' });
    showInstantSavedBadge();
  };

  const handleResetFooterLogo = () => {
    setFooterLogoUrl('');
    setUseSameForFooter(true);
    updateBusinessProfile({ ...businessProfile, footerLogoUrl: '' });
    showInstantSavedBadge();
  };

  const handleResetAllToDefaults = () => {
    if (confirm('Reset logo, favicon, and footer logo back to the original NASISI vector defaults?')) {
      setLogoUrl('');
      setFaviconUrl('');
      setFooterLogoUrl('');
      setUseSameForFooter(true);
      setLogoDisplayMode('image-only');
      updateBusinessProfile({
        ...businessProfile,
        logoUrl: '',
        faviconUrl: '',
        footerLogoUrl: '',
        logoDisplayMode: 'image-only',
      });
      applyBrowserFavicon('');
      showInstantSavedBadge();
    }
  };

  // Copy Main Logo into Favicon
  const handleSyncLogoToFavicon = () => {
    if (!logoUrl) {
      handleResetFavicon();
      return;
    }
    setFaviconUrl(logoUrl);
    applyBrowserFavicon(logoUrl);
    updateBusinessProfile({ ...businessProfile, faviconUrl: logoUrl });
    showInstantSavedBadge();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Banner & Quick Actions */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-[#06163c] rounded-xl border border-blue-200/80">
              <ImageIcon className="w-5 h-5 text-[#06163c]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 font-['Outfit'] flex items-center gap-2">
                <span>Brand Logos & Favicon Setting Area</span>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
                  Instant Live Sync
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update the website header logo, browser tab favicon, and footer brand mark. Changes take effect across storefront and ERP in real-time.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleResetAllToDefaults}
            className="px-3 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-bold rounded-xl border border-slate-200 transition-all inline-flex items-center gap-1.5 cursor-pointer"
            title="Reset all branding back to factory vector marks"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All to Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => handleSaveAll()}
            className="px-4 py-2 bg-[#06163c] hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Save & Publish Live</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {saveToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              Branding changes applied instantly! Header logo, favicon, and footer logos are synchronized across all pages.
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300/80">
            Live
          </span>
        </div>
      )}

      {/* 1. REAL-TIME LIVE PREVIEWS CAROUSEL / PANEL */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Eye className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              Live Preview of Active Brand Assets
            </h3>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 text-[11px]">Preview Canvas:</span>
            <button
              type="button"
              onClick={() => setActiveTabPreview('dark')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                activeTabPreview === 'dark'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Navy Bar (#041429)
            </button>
            <button
              type="button"
              onClick={() => setActiveTabPreview('light')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                activeTabPreview === 'light'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              Clean White Paper
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1A. Header Bar Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
              <span>Main Header Logo Preview</span>
              <span className="text-[10px] text-sky-400 font-mono">Navbar (Top)</span>
            </div>
            <div
              className={`h-36 rounded-2xl border p-4 flex flex-col justify-between overflow-hidden transition-colors ${
                activeTabPreview === 'dark'
                  ? 'bg-[#041429] border-[#0d2342]'
                  : 'bg-white border-slate-200'
              }`}
            >
              {/* Simulated mini header */}
              <div className="flex items-center justify-between opacity-70 pb-2 border-b border-slate-700/40 text-[9px] text-slate-400">
                <span className="font-mono uppercase tracking-widest text-[8px]">● Nairobi Factory Live</span>
                <span className="font-mono">Menu ☰</span>
              </div>
              <div className="flex-1 flex items-center justify-center py-2">
                <NasisiLogo
                  size="lg"
                  variant={activeTabPreview === 'dark' ? 'white' : 'full'}
                  customSrc={logoUrl || undefined}
                />
              </div>
              <div className="text-[9px] text-center text-slate-400 font-mono truncate">
                {logoUrl ? 'Custom Logo Asset Active' : 'Default Vector Monogram Active'}
              </div>
            </div>
          </div>

          {/* 1B. Browser Tab Mockup with Live Favicon */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
              <span>Browser Tab Favicon Preview</span>
              <span className="text-[10px] text-emerald-400 font-mono">Document Head</span>
            </div>
            <div className="h-36 rounded-2xl border border-slate-800 bg-slate-950 p-3.5 flex flex-col justify-between">
              {/* Realistic browser tab bar */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-2 rounded-xl border border-slate-800">
                <div className="w-5 h-5 rounded-md overflow-hidden bg-slate-950 border border-slate-700/80 flex items-center justify-center shrink-0">
                  <img
                    src={faviconUrl || DEFAULT_FAVICON_DATA_URI}
                    alt="Favicon"
                    className="w-4 h-4 object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-slate-200 truncate">
                    {businessProfile.companyName || 'NASISI'} | Knitwear & Graphics
                  </p>
                </div>
                <span className="text-[10px] text-slate-500 hover:text-slate-300 cursor-default px-1">×</span>
              </div>

              {/* Simulated URL Bar */}
              <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800/80 flex items-center gap-2 text-[10px] text-slate-400">
                <span className="text-emerald-500 font-mono">🔒</span>
                <span className="truncate font-mono text-slate-300">https://nasisiuniforms.co.ke/</span>
              </div>

              <div className="text-[9px] text-center text-slate-400 font-mono">
                Favicon updates document &lt;link rel="icon"&gt; in real time
              </div>
            </div>
          </div>

          {/* 1C. Footer Logo Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
              <span>Footer Logo Preview</span>
              <span className="text-[10px] text-purple-400 font-mono">Page Footer</span>
            </div>
            <div
              className={`h-36 rounded-2xl border p-4 flex flex-col justify-between overflow-hidden transition-colors ${
                activeTabPreview === 'dark'
                  ? 'bg-[#041429] border-[#0d2342]'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex-1 flex items-center justify-center py-2">
                <NasisiLogo
                  size="lg"
                  variant={activeTabPreview === 'dark' ? 'white' : 'full'}
                  isFooter={true}
                  customSrc={(useSameForFooter ? logoUrl : footerLogoUrl) || undefined}
                />
              </div>
              <div className="text-[9px] text-center text-slate-400 border-t border-slate-800/60 pt-2 font-mono">
                {useSameForFooter
                  ? 'Mirrors Main Header Logo'
                  : footerLogoUrl
                  ? 'Dedicated Footer Logo Active'
                  : 'Default Vector Logo'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER LOGO CONFIGURATION */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#06163c] flex items-center justify-center font-black text-xs border border-blue-200">
              1
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Main Header Logo
              </h3>
              <p className="text-xs text-slate-500">
                Displayed in the main navigation bar, mobile drawer, and ERP topbar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {logoUrl ? (
              <button
                type="button"
                onClick={handleResetMainLogo}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold px-3 py-1.5 rounded-lg hover:bg-rose-50 border border-rose-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Custom Logo</span>
              </button>
            ) : (
              <span className="text-[11px] font-bold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-200">
                Vector Monogram Active
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Box (Drag & Drop or Click) */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              Upload New Logo Image (PNG, SVG, JPG, WebP)
            </label>
            <div
              onClick={() => mainLogoInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  handleFileUpload(e.dataTransfer.files[0], 'logo');
                }
              }}
              className="border-2 border-dashed border-slate-300 hover:border-[#06163c] hover:bg-blue-50/40 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-50 group-hover:bg-blue-100 text-[#06163c] flex items-center justify-center transition-transform group-hover:scale-110">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Click to browse or drag & drop logo here
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  High-resolution PNG with transparent background or SVG recommended
                </p>
              </div>
              <span className="px-3 py-1 bg-white text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 shadow-2xs">
                Select File from Computer
              </span>
              <input
                ref={mainLogoInputRef}
                type="file"
                accept="image/*,.svg,.png,.jpg,.jpeg,.webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileUpload(e.target.files[0], 'logo');
                  }
                }}
              />
            </div>
          </div>

          {/* Or Enter Image URL & Options */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Or Direct Logo Image URL
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://example.com/logo.png"
                    value={logoUrl}
                    onChange={(e) => {
                      setLogoUrl(e.target.value);
                      updateBusinessProfile({ ...businessProfile, logoUrl: e.target.value });
                    }}
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                {logoUrl && (
                  <button
                    type="button"
                    onClick={handleResetMainLogo}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Accepts hosted images from Cloudinary, Imgur, AWS S3, or direct CDN links.
              </p>
            </div>

            {/* Display Mode Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Logo Presentation Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLogoDisplayMode('image-only');
                    updateBusinessProfile({ ...businessProfile, logoDisplayMode: 'image-only' });
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    logoDisplayMode === 'image-only'
                      ? 'border-[#06163c] bg-blue-50/60 font-bold text-[#06163c]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold">Image Only</div>
                  <div className="text-[10px] text-slate-500">
                    Recommended if your image already includes text
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLogoDisplayMode('image-and-text');
                    updateBusinessProfile({ ...businessProfile, logoDisplayMode: 'image-and-text' });
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                    logoDisplayMode === 'image-and-text'
                      ? 'border-[#06163c] bg-blue-50/60 font-bold text-[#06163c]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold">Image + Brand Name</div>
                  <div className="text-[10px] text-slate-500">
                    Displays uploaded icon beside NASISI text
                  </div>
                </button>
              </div>
            </div>

            {/* One-Click Presets */}
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Ready-to-Use Designer Logo Presets (1-Click Test)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRESET_LOGOS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setLogoUrl(preset.url);
                      updateBusinessProfile({ ...businessProfile, logoUrl: preset.url });
                      showInstantSavedBadge();
                    }}
                    className="p-2 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 rounded-xl text-left text-xs transition-all cursor-pointer"
                  >
                    <div className="font-bold text-slate-800 text-[11px] truncate">{preset.name}</div>
                    <div className="text-[9px] text-slate-500 mt-0.5">{preset.tag}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. BROWSER FAVICON CONFIGURATION */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-xs border border-emerald-200">
              2
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Browser Tab Favicon
              </h3>
              <p className="text-xs text-slate-500">
                Small icon displayed in web browser tabs, bookmarks, and mobile home screen shortcuts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSyncLogoToFavicon}
              className="text-xs text-blue-700 hover:text-blue-800 font-bold px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              title="Copy current main logo as the browser favicon"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Use Main Logo as Favicon</span>
            </button>

            {faviconUrl && (
              <button
                type="button"
                onClick={handleResetFavicon}
                className="text-xs text-rose-600 hover:text-rose-700 font-bold px-3 py-1.5 rounded-lg hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
              >
                Reset Default
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Favicon Upload Dropzone */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              Upload Favicon (Square PNG, SVG, or ICO)
            </label>
            <div
              onClick={() => faviconInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) {
                  handleFileUpload(e.dataTransfer.files[0], 'favicon');
                }
              }}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-600 hover:bg-emerald-50/30 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 group-hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-transform group-hover:scale-110">
                <Bookmark className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Click to browse or drop favicon file
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Square 32×32, 64×64, or 128×128 pixel image recommended
                </p>
              </div>
              <span className="px-3 py-1 bg-white text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 shadow-2xs">
                Select Favicon File
              </span>
              <input
                ref={faviconInputRef}
                type="file"
                accept="image/*,.ico,.png,.svg,.webp"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    handleFileUpload(e.target.files[0], 'favicon');
                  }
                }}
              />
            </div>
          </div>

          {/* Favicon URL & Presets */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Or Direct Favicon URL
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://example.com/favicon.png"
                    value={faviconUrl}
                    onChange={(e) => {
                      setFaviconUrl(e.target.value);
                      applyBrowserFavicon(e.target.value);
                      updateBusinessProfile({ ...businessProfile, faviconUrl: e.target.value });
                    }}
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                {faviconUrl && (
                  <button
                    type="button"
                    onClick={handleResetFavicon}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Curated Favicon Presets */}
            <div>
              <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-slate-700">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Quick Curated Favicon Presets</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {PRESET_FAVICONS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setFaviconUrl(preset.url);
                      applyBrowserFavicon(preset.url);
                      updateBusinessProfile({ ...businessProfile, faviconUrl: preset.url });
                      showInstantSavedBadge();
                    }}
                    className="p-2.5 border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 rounded-xl flex items-center gap-2 text-left text-xs transition-all cursor-pointer"
                  >
                    <img src={preset.url} alt={preset.name} className="w-5 h-5 rounded-sm object-contain" />
                    <span className="font-bold text-slate-800 text-[11px] truncate">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. FOOTER LOGO CONFIGURATION */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center font-black text-xs border border-purple-200">
              3
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-['Outfit']">
                Footer Logo
              </h3>
              <p className="text-xs text-slate-500">
                Appears at the bottom of the page in the dark navy footer bar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!useSameForFooter && (
              <button
                type="button"
                onClick={handleResetFooterLogo}
                className="text-xs text-purple-700 hover:text-purple-800 font-bold px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors cursor-pointer"
              >
                Sync with Header Logo
              </button>
            )}
          </div>
        </div>

        {/* Toggle between "Same as Header" and "Custom Footer Logo" */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold text-slate-900 text-xs block">
              Synchronize with Main Header Logo
            </span>
            <span className="text-[11px] text-slate-500">
              When turned on, the footer automatically displays the primary header logo.
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={useSameForFooter}
              onChange={(e) => {
                const checked = e.target.checked;
                setUseSameForFooter(checked);
                if (checked) {
                  setFooterLogoUrl('');
                  updateBusinessProfile({ ...businessProfile, footerLogoUrl: '' });
                }
              }}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#06163c]"></div>
          </label>
        </div>

        {!useSameForFooter && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2 animate-fadeIn">
            {/* Custom Footer Logo Upload */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Upload Dedicated Footer Logo (e.g. Inverted White Version)
              </label>
              <div
                onClick={() => footerLogoInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) {
                    handleFileUpload(e.dataTransfer.files[0], 'footer');
                  }
                }}
                className="border-2 border-dashed border-slate-300 hover:border-purple-600 hover:bg-purple-50/30 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-50 group-hover:bg-purple-100 text-purple-700 flex items-center justify-center transition-transform group-hover:scale-110">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    Click to browse or drop footer logo
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    White or monochrome graphics look great against the dark footer
                  </p>
                </div>
                <span className="px-3 py-1 bg-white text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 shadow-2xs">
                  Select Footer Logo File
                </span>
                <input
                  ref={footerLogoInputRef}
                  type="file"
                  accept="image/*,.svg,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleFileUpload(e.target.files[0], 'footer');
                    }
                  }}
                />
              </div>
            </div>

            {/* Custom Footer Logo URL & White Preset */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Or Direct Footer Logo URL
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      placeholder="https://example.com/footer-logo-white.png"
                      value={footerLogoUrl}
                      onChange={(e) => {
                        setFooterLogoUrl(e.target.value);
                        updateBusinessProfile({ ...businessProfile, footerLogoUrl: e.target.value });
                      }}
                      className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    />
                  </div>
                  {footerLogoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setFooterLogoUrl('');
                        updateBusinessProfile({ ...businessProfile, footerLogoUrl: '' });
                      }}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* 1-click Inverted White Preset */}
              <div>
                <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-slate-700">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Preset White Footer Logo</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const whiteLogo = PRESET_LOGOS[2].url;
                    setFooterLogoUrl(whiteLogo);
                    updateBusinessProfile({ ...businessProfile, footerLogoUrl: whiteLogo });
                    showInstantSavedBadge();
                  }}
                  className="w-full p-3 border border-purple-200 bg-purple-50/40 hover:bg-purple-100/60 rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer"
                >
                  <div>
                    <span className="font-bold text-purple-950 block">Apply Monochrome Silver-White Logo</span>
                    <span className="text-[10px] text-purple-700">Crisp, professional contrast on dark backgrounds</span>
                  </div>
                  <span className="px-2.5 py-1 bg-white text-purple-900 font-bold text-[11px] rounded-lg border border-purple-200 shadow-2xs">
                    Apply
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Sticky Bottom Action Toolbar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>All logos and favicon are instantly saved to browser storage and loaded dynamically on next visits.</span>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={handleResetAllToDefaults}
            className="px-4 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Reset All
          </button>

          <button
            type="button"
            onClick={() => handleSaveAll()}
            className="px-6 py-2.5 bg-[#06163c] hover:bg-blue-900 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Save & Publish All Logos</span>
          </button>
        </div>
      </div>
    </div>
  );
};
