import React, { useState } from 'react';
import { X, Ruler, Check, Layers, Sparkles, Shirt, Shield, Info } from 'lucide-react';

interface SizeAndFabricGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeAndFabricGuide: React.FC<SizeAndFabricGuideProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'sizes' | 'fabrics' | 'measuring'>('sizes');
  const [categoryTab, setCategoryTab] = useState<'adult_unisex' | 'youth_school' | 'ladies_tailored'>('adult_unisex');

  if (!isOpen) return null;

  return (
    <div
      id="size-guide-modal-overlay"
      className="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-hidden sm:overflow-y-auto animate-fadeIn"
    >
      <div
        id="size-guide-modal-window"
        className="relative w-full sm:max-w-4xl max-h-[100vh] sm:max-h-[92vh] bg-white text-slate-900 sm:rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.5)] border border-slate-200/90 flex flex-col overflow-hidden animate-scaleIn"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 bg-[#06163c] text-white shrink-0 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-cyan-300">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                Official Size & Fabric Technical Guide
              </h3>
              <p className="text-xs text-blue-200/80">
                Precision sizing charts, textile GSM specifications & measurement protocols
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Size Guide"
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-150 hover:rotate-90 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 gap-4 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('sizes')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'sizes'
                ? 'border-[#06163c] text-[#06163c]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Size Dimension Charts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fabrics')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'fabrics'
                ? 'border-[#06163c] text-[#06163c]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Fabric & Textile GSM Specs
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('measuring')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'measuring'
                ? 'border-[#06163c] text-[#06163c]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            How to Measure Your Team
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {activeTab === 'sizes' && (
            <div className="space-y-5">
              {/* Category selector */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setCategoryTab('adult_unisex')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    categoryTab === 'adult_unisex'
                      ? 'bg-[#06163c] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Adult Unisex (Corporate / Medical / Workwear)
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryTab('youth_school')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    categoryTab === 'youth_school'
                      ? 'bg-[#06163c] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Youth & Academic Uniforms
                </button>
                <button
                  type="button"
                  onClick={() => setCategoryTab('ladies_tailored')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    categoryTab === 'ladies_tailored'
                      ? 'bg-[#06163c] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Ladies Tailored Fit
                </button>
              </div>

              {/* Size Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#06163c] text-white text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Size Tag</th>
                      <th className="py-3 px-4">Chest / Bust (in)</th>
                      <th className="py-3 px-4">Waist (in)</th>
                      <th className="py-3 px-4">Collar / Neck (in)</th>
                      <th className="py-3 px-4">Height Range (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {categoryTab === 'adult_unisex' && (
                      <>
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">S (Small)</td>
                          <td className="py-2.5 px-4 text-slate-600">36" - 38"</td>
                          <td className="py-2.5 px-4 text-slate-600">30" - 32"</td>
                          <td className="py-2.5 px-4 text-slate-600">14.5" - 15"</td>
                          <td className="py-2.5 px-4 text-slate-600">165 - 172 cm</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">M (Medium)</td>
                          <td className="py-2.5 px-4 text-slate-600">38" - 40"</td>
                          <td className="py-2.5 px-4 text-slate-600">32" - 34"</td>
                          <td className="py-2.5 px-4 text-slate-600">15.5" - 16"</td>
                          <td className="py-2.5 px-4 text-slate-600">170 - 178 cm</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">L (Large)</td>
                          <td className="py-2.5 px-4 text-slate-600">42" - 44"</td>
                          <td className="py-2.5 px-4 text-slate-600">36" - 38"</td>
                          <td className="py-2.5 px-4 text-slate-600">16.5" - 17"</td>
                          <td className="py-2.5 px-4 text-slate-600">175 - 183 cm</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">XL (Extra Large)</td>
                          <td className="py-2.5 px-4 text-slate-600">46" - 48"</td>
                          <td className="py-2.5 px-4 text-slate-600">40" - 42"</td>
                          <td className="py-2.5 px-4 text-slate-600">17.5" - 18"</td>
                          <td className="py-2.5 px-4 text-slate-600">180 - 190 cm</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">XXL (2XL)</td>
                          <td className="py-2.5 px-4 text-slate-600">50" - 52"</td>
                          <td className="py-2.5 px-4 text-slate-600">44" - 46"</td>
                          <td className="py-2.5 px-4 text-slate-600">18.5" - 19"</td>
                          <td className="py-2.5 px-4 text-slate-600">185 - 195 cm</td>
                        </tr>
                      </>
                    )}
                    {categoryTab === 'youth_school' && (
                      <>
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">Age 4-6 (Size 24-26)</td>
                          <td className="py-2.5 px-4 text-slate-600">24" - 26"</td>
                          <td className="py-2.5 px-4 text-slate-600">22" - 23"</td>
                          <td className="py-2.5 px-4 text-slate-600">11" - 11.5"</td>
                          <td className="py-2.5 px-4 text-slate-600">105 - 116 cm</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">Age 7-9 (Size 28-30)</td>
                          <td className="py-2.5 px-4 text-slate-600">28" - 30"</td>
                          <td className="py-2.5 px-4 text-slate-600">24" - 25"</td>
                          <td className="py-2.5 px-4 text-slate-600">12" - 12.5"</td>
                          <td className="py-2.5 px-4 text-slate-600">122 - 134 cm</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">Age 10-12 (Size 32-34)</td>
                          <td className="py-2.5 px-4 text-slate-600">32" - 34"</td>
                          <td className="py-2.5 px-4 text-slate-600">26" - 27"</td>
                          <td className="py-2.5 px-4 text-slate-600">13" - 13.5"</td>
                          <td className="py-2.5 px-4 text-slate-600">140 - 152 cm</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">Age 13-16 (Size 36-38)</td>
                          <td className="py-2.5 px-4 text-slate-600">36" - 38"</td>
                          <td className="py-2.5 px-4 text-slate-600">28" - 30"</td>
                          <td className="py-2.5 px-4 text-slate-600">14" - 14.5"</td>
                          <td className="py-2.5 px-4 text-slate-600">158 - 170 cm</td>
                        </tr>
                      </>
                    )}
                    {categoryTab === 'ladies_tailored' && (
                      <>
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">UK 8 / XS</td>
                          <td className="py-2.5 px-4 text-slate-600">32" - 33"</td>
                          <td className="py-2.5 px-4 text-slate-600">25" - 26"</td>
                          <td className="py-2.5 px-4 text-slate-600">35" - 36" (Hips)</td>
                          <td className="py-2.5 px-4 text-slate-600">160 - 168 cm</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">UK 10 / S</td>
                          <td className="py-2.5 px-4 text-slate-600">34" - 35"</td>
                          <td className="py-2.5 px-4 text-slate-600">27" - 28"</td>
                          <td className="py-2.5 px-4 text-slate-600">37" - 38" (Hips)</td>
                          <td className="py-2.5 px-4 text-slate-600">162 - 170 cm</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">UK 12 / M</td>
                          <td className="py-2.5 px-4 text-slate-600">36" - 37"</td>
                          <td className="py-2.5 px-4 text-slate-600">29" - 30"</td>
                          <td className="py-2.5 px-4 text-slate-600">39" - 40" (Hips)</td>
                          <td className="py-2.5 px-4 text-slate-600">165 - 172 cm</td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-2.5 px-4 font-bold text-slate-900">UK 14 / L</td>
                          <td className="py-2.5 px-4 text-slate-600">38" - 40"</td>
                          <td className="py-2.5 px-4 text-slate-600">31" - 33"</td>
                          <td className="py-2.5 px-4 text-slate-600">41" - 43" (Hips)</td>
                          <td className="py-2.5 px-4 text-slate-600">168 - 175 cm</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'fabrics' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <Shirt className="w-4 h-4 text-[#06163c]" />
                  <h4 className="text-xs font-bold text-slate-900">Poly-Viscose Suiting (240 GSM)</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Engineered for corporate blazers, trousers, and administrative uniforms. Wrinkle-resistant, breathable drape with anti-static finish.
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="px-2 py-0.5 text-[10px] bg-white border border-slate-200 rounded font-medium">Machine Wash 30°C</span>
                  <span className="px-2 py-0.5 text-[10px] bg-white border border-slate-200 rounded font-medium">Crease Guard</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#06163c]" />
                  <h4 className="text-xs font-bold text-slate-900">Heavy Duty Cotton Twill (280 GSM)</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Used for industrial overalls, engineer boiler suits, and security tactical pants. High tensile strength, double-needle lockstitched.
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="px-2 py-0.5 text-[10px] bg-white border border-slate-200 rounded font-medium">Tear-Resistant</span>
                  <span className="px-2 py-0.5 text-[10px] bg-white border border-slate-200 rounded font-medium">Industrial Washable</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#06163c]" />
                  <h4 className="text-xs font-bold text-slate-900">Antimicrobial Medical Blend (180 GSM)</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  65% Polyester / 35% Cotton medical grade scrub weave. Treated with fluid-repellent coating and silver-ion antimicrobial hygiene barrier.
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="px-2 py-0.5 text-[10px] bg-white border border-slate-200 rounded font-medium">Autoclave Safe</span>
                  <span className="px-2 py-0.5 text-[10px] bg-white border border-slate-200 rounded font-medium">Fade Resistant</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#06163c]" />
                  <h4 className="text-xs font-bold text-slate-900">Combed Piqué Cotton Polo (220 GSM)</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Premium honeycomb knit structure for institutional polo shirts, sports staff, and service staff. Soft hand-feel with reinforced ribbed collar.
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="px-2 py-0.5 text-[10px] bg-white border border-slate-200 rounded font-medium">No-Curl Collar</span>
                  <span className="px-2 py-0.5 text-[10px] bg-white border border-slate-200 rounded font-medium">100% Breathable</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'measuring' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 space-y-1">
                  <strong className="block font-bold text-slate-900">Factory Measurement Protocol:</strong>
                  <p>
                    For institutional bulk orders (50+ staff), Nasisi sends an on-site master tailor with measuring tapes and sample fitting garments directly to your premises anywhere in Kenya.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <span className="font-extrabold text-[#06163c] block">1. Chest / Bust</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Measure around the fullest part of the chest, keeping the tape horizontal under the armpits.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <span className="font-extrabold text-[#06163c] block">2. Waistline</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Measure around the natural waistline where trousers normally sit, allowing one finger breathing room.
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                  <span className="font-extrabold text-[#06163c] block">3. Inseam / Length</span>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Measure from the crotch point down to the ankle bone or desired trouser cuff break.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
