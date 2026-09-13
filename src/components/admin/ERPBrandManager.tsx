import React, { useState, useRef } from 'react';
import { useERP } from '../../context/ERPContext';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Sliders,
  Eye,
  Trash2,
  ExternalLink,
  Shield,
  Layers,
  HelpCircle,
} from 'lucide-react';

export const ERPBrandManager: React.FC = () => {
  const { businessProfile, updateBusinessProfile } = useERP();

  // Local working state
  const [logoUrl, setLogoUrl] = useState(businessProfile?.logoUrl || '');
  const [useSeparateFooterLogo, setUseSeparateFooterLogo] = useState(
    Boolean(businessProfile?.footerLogoUrl && businessProfile.footerLogoUrl !== businessProfile.logoUrl)
  );
  const [footerLogoUrl, setFooterLogoUrl] = useState(businessProfile?.footerLogoUrl || '');
  const [companyName, setCompanyName] = useState(businessProfile?.companyName || 'NASISI KNITWEAR & GRAPHICS LTD');
  const [slogan, setSlogan] = useState(businessProfile?.slogan || 'We stitch it, You wear it, We print it, you represent.');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(
    businessProfile?.watermarkOpacity !== undefined ? businessProfile.watermarkOpacity : 0.08
  );

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFooter, setIsUploadingFooter] = useState(false);

  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const footerFileInputRef = useRef<HTMLInputElement>(null);

  // Handle local image file upload (PNG, SVG, JPG, WebP) -> Base64 data URL
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    target: 'logo' | 'footer'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 4MB for localStorage resilience)
    if (file.size > 4 * 1024 * 1024) {
      alert('Selected image exceeds 4MB limit. Please upload a smaller file or use a web image URL.');
      return;
    }

    const reader = new FileReader();
    if (target === 'logo') setIsUploadingLogo(true);
    else setIsUploadingFooter(true);

    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (target === 'logo') {
        setLogoUrl(dataUrl);
        setIsUploadingLogo(false);
      } else {
        setFooterLogoUrl(dataUrl);
        setIsUploadingFooter(false);
      }
    };
    reader.onerror = () => {
      alert('Failed to read image file.');
      if (target === 'logo') setIsUploadingLogo(false);
      else setIsUploadingFooter(false);
    };
    reader.readAsDataURL(file);
  };

  // Preset sample logos for instant testing
  const sampleLogos = [
    {
      name: 'Modern Gold Crest',
      url: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Athletic / Apparel Emblem',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    },
    {
      name: 'Abstract Monogram',
      url: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=300&auto=format&fit=crop&q=80',
    },
  ];

  // Save changes to ERPContext (and persistent storage)
  const handleSave = () => {
    const finalFooterLogo = useSeparateFooterLogo ? footerLogoUrl.trim() : logoUrl.trim();

    updateBusinessProfile({
      logoUrl: logoUrl.trim(),
      footerLogoUrl: finalFooterLogo,
      companyName: companyName.trim(),
      slogan: slogan.trim(),
      watermarkOpacity: Number(watermarkOpacity),
    });

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3500);
  };

  // Reset to default platform vector crest
  const handleResetToDefault = () => {
    if (window.confirm('Reset brand logos to the default NASISI Monogram Crest?')) {
      setLogoUrl('');
      setFooterLogoUrl('');
      setUseSeparateFooterLogo(false);
      setWatermarkOpacity(0.08);
      updateBusinessProfile({
        logoUrl: '',
        footerLogoUrl: '',
        watermarkOpacity: 0.08,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const activeTitleLogo = logoUrl.trim();
  const activeFooterLogo = (useSeparateFooterLogo ? footerLogoUrl.trim() : logoUrl.trim()) || activeTitleLogo;

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header & Save Action */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#06163c] text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-['Outfit']">
                Brand & Platform Logo Atelier
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Change the platform logo displayed in the header, the footer, and watermarked behind storefront titles.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Restore Default Crest</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#06163c] to-blue-900 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Saved & Live Everywhere!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Save Live Brand Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Success: Platform logo updated. It is now active in the header, behind the title, and in the footer!</span>
          </div>
          <span className="text-[10px] text-emerald-700 bg-white/70 px-2 py-0.5 rounded">Synced to Storefront</span>
        </div>
      )}

      {/* Main Grid: Left Controls, Right Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Logo Inputs & Configuration (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: Main Platform Logo */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#06163c] flex items-center justify-center text-xs font-black">
                  1
                </span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base font-['Outfit']">
                  Platform Logo (Header & Watermark)
                </h3>
              </div>
              {logoUrl && (
                <button
                  type="button"
                  onClick={() => setLogoUrl('')}
                  className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Logo</span>
                </button>
              )}
            </div>

            <p className="text-xs text-slate-500">
              Paste an image URL (PNG, SVG, JPG) or upload directly from your device. This logo appears in the top navigation header and is watermarked behind the Catalog title.
            </p>

            {/* Input URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">Logo Image URL</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://example.com/brand-logo.png"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:border-[#06163c] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#06163c]/10 text-slate-900 font-mono"
                  />
                </div>
                
                {/* Device File Upload Button */}
                <input
                  type="file"
                  ref={logoFileInputRef}
                  onChange={(e) => handleFileUpload(e, 'logo')}
                  accept="image/png, image/jpeg, image/svg+xml, image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => logoFileInputRef.current?.click()}
                  disabled={isUploadingLogo}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Upload className="w-4 h-4 text-slate-600" />
                  <span>{isUploadingLogo ? 'Loading...' : 'Upload File'}</span>
                </button>
              </div>
            </div>

            {/* Quick Sample Logos */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Test with sample apparel logos:
              </span>
              <div className="flex flex-wrap gap-2">
                {sampleLogos.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLogoUrl(s.url)}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-[#06163c] hover:border-blue-200 border border-slate-200 text-slate-600 font-semibold transition-colors cursor-pointer"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Footer Logo Configuration */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#06163c] flex items-center justify-center text-xs font-black">
                  2
                </span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base font-['Outfit']">
                  Footer Logo & Watermark
                </h3>
              </div>
            </div>

            <div className="space-y-3">
              {/* Checkbox toggle: same as platform logo or separate */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={!useSeparateFooterLogo}
                  onChange={(e) => {
                    setUseSeparateFooterLogo(!e.target.checked);
                    if (e.target.checked) {
                      setFooterLogoUrl('');
                    }
                  }}
                  className="w-4 h-4 rounded text-[#06163c] focus:ring-blue-500 border-slate-300"
                />
                <span className="text-xs sm:text-sm font-semibold text-slate-800">
                  Use same logo as main platform logo for footer
                </span>
              </label>

              {useSeparateFooterLogo && (
                <div className="pt-3 border-t border-slate-100 space-y-2 animate-fadeIn">
                  <label className="text-xs font-bold text-slate-700 block">Separate Footer Logo URL</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="url"
                        placeholder="https://example.com/footer-logo.png"
                        value={footerLogoUrl}
                        onChange={(e) => setFooterLogoUrl(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 focus:border-[#06163c] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#06163c]/10 text-slate-900 font-mono"
                      />
                    </div>

                    <input
                      type="file"
                      ref={footerFileInputRef}
                      onChange={(e) => handleFileUpload(e, 'footer')}
                      accept="image/png, image/jpeg, image/svg+xml, image/webp"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => footerFileInputRef.current?.click()}
                      disabled={isUploadingFooter}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                    >
                      <Upload className="w-4 h-4 text-slate-600" />
                      <span>{isUploadingFooter ? 'Loading...' : 'Upload File'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    If specified, this logo will be used in the footer brand section and as the watermark behind the footer.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Watermark Opacity & Typography */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#06163c] flex items-center justify-center text-xs font-black">
                3
              </span>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base font-['Outfit']">
                Watermark Visibility & Brand Copy
              </h3>
            </div>

            {/* Opacity Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Watermark Opacity behind Title & Footer
                </label>
                <span className="text-xs font-mono font-bold text-[#06163c] bg-blue-50 px-2 py-0.5 rounded">
                  {Math.round(watermarkOpacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.03"
                max="0.25"
                step="0.01"
                value={watermarkOpacity}
                onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#06163c]"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                <button type="button" onClick={() => setWatermarkOpacity(0.05)} className="hover:text-slate-700">Subtle (5%)</button>
                <button type="button" onClick={() => setWatermarkOpacity(0.08)} className="hover:text-slate-700 font-bold text-[#06163c]">Standard (8%)</button>
                <button type="button" onClick={() => setWatermarkOpacity(0.14)} className="hover:text-slate-700">Prominent (14%)</button>
                <button type="button" onClick={() => setWatermarkOpacity(0.20)} className="hover:text-slate-700">Bold (20%)</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Company Display Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">Official Slogan / Motto</label>
                <input
                  type="text"
                  value={slogan}
                  onChange={(e) => setSlogan(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Mockup Previews (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-xl border border-slate-800 space-y-6 sticky top-20">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Live Visual Simulation
                </h4>
              </div>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded-full">
                Real-Time Preview
              </span>
            </div>

            {/* Preview 1: Header Bar Simulation */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block">1. Navigation Header Bar</span>
              <div className="bg-[#06163c] p-3.5 rounded-xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {activeTitleLogo ? (
                    <img
                      src={activeTitleLogo}
                      alt="Logo Preview"
                      className="w-9 h-9 object-contain rounded-lg drop-shadow"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-xl bg-white text-[#06163c] flex items-center justify-center font-black">
                      <span className="font-extrabold text-sm">N</span>
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-1.5 leading-none">
                      <span className="text-white font-black text-sm tracking-tight">NASISI</span>
                      <span className="bg-white/20 text-cyan-200 font-bold text-[9px] px-1 py-0.5 rounded">KNITWEAR</span>
                    </div>
                    <span className="text-[9px] text-blue-200 truncate block max-w-[170px] mt-0.5">{slogan}</span>
                  </div>
                </div>
                <div className="text-[10px] text-blue-200/80 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                  Header Look
                </div>
              </div>
            </div>

            {/* Preview 2: Behind the Title Simulation */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block">2. Behind the Catalog Title (Watermark)</span>
              <div className="bg-white text-slate-900 p-5 rounded-xl border border-slate-200 relative overflow-hidden text-center flex flex-col items-center justify-center min-h-[140px]">
                {/* The Logo Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                  {activeTitleLogo ? (
                    <img
                      src={activeTitleLogo}
                      alt=""
                      className="w-36 h-36 object-contain pointer-events-none"
                      style={{ opacity: watermarkOpacity }}
                    />
                  ) : (
                    <svg
                      viewBox="0 0 100 100"
                      className="w-36 h-36 text-[#06163c]"
                      style={{ opacity: watermarkOpacity }}
                      fill="none"
                    >
                      <rect x="15" y="15" width="70" height="70" rx="20" stroke="currentColor" strokeWidth="6" strokeDasharray="6 4" />
                      <path d="M32 68 L32 32 L50 54 L50 32 L68 68 L68 32" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>

                <div className="relative z-10">
                  <span className="text-[9px] font-black uppercase tracking-wider text-blue-900 bg-blue-50 px-2 py-0.5 rounded-full mb-1 inline-block border border-blue-200/60">
                    {companyName}
                  </span>
                  <h5 className="text-base font-black text-slate-900 tracking-tight font-['Outfit'] leading-tight">
                    Bespoke Knitwear & Apparel Catalog
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-1 max-w-xs">{slogan}</p>
                </div>
              </div>
            </div>

            {/* Preview 3: Footer Simulation */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block">3. In the Footer (Logo & Watermark)</span>
              <div className="bg-slate-950 text-slate-200 p-4 rounded-xl border border-slate-800 relative overflow-hidden">
                {/* Watermark in corner */}
                <div className="absolute right-0 bottom-0 pointer-events-none select-none z-0">
                  {activeFooterLogo ? (
                    <img
                      src={activeFooterLogo}
                      alt=""
                      className="w-28 h-28 object-contain translate-x-4 translate-y-4"
                      style={{ opacity: watermarkOpacity }}
                    />
                  ) : (
                    <svg
                      viewBox="0 0 100 100"
                      className="w-28 h-28 text-white translate-x-4 translate-y-4"
                      style={{ opacity: watermarkOpacity }}
                      fill="none"
                    >
                      <rect x="15" y="15" width="70" height="70" rx="20" stroke="currentColor" strokeWidth="6" strokeDasharray="6 4" />
                      <path d="M32 68 L32 32 L50 54 L50 32 L68 68 L68 32" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>

                <div className="relative z-10 flex items-center gap-2.5">
                  {activeFooterLogo ? (
                    <img
                      src={activeFooterLogo}
                      alt="Footer Logo"
                      className="w-8 h-8 object-contain rounded-md"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-white text-[#06163c] flex items-center justify-center font-black">
                      <span className="font-extrabold text-xs">N</span>
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-black text-white block">NASISI KNITWEAR</span>
                    <span className="text-[10px] text-slate-400 block">Factory & Atelier Footer</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Save CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSave}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all hover:scale-102 active:scale-98 shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Save and Apply Brand Settings</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
