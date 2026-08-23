import React, { useState } from 'react';
import { X, Ruler, Layers, Sparkles, Check, Info, ShieldAlert } from 'lucide-react';

interface SizeAndFabricGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeAndFabricGuide: React.FC<SizeAndFabricGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'sizes' | 'fabrics' | 'care'>('sizes');
  const [sizeCategory, setSizeCategory] = useState<'school_junior' | 'adult'>('school_junior');

  const juniorSizes = [
    { size: 'Age 3-4 (XS Junior)', chest: '22" - 24"', waist: '20" - 21"', length: '16"', height: '98 - 104 cm' },
    { size: 'Age 5-6 (S Junior)', chest: '24" - 26"', waist: '22" - 23"', length: '18"', height: '110 - 116 cm' },
    { size: 'Age 7-8 (M Junior)', chest: '26" - 28"', waist: '23" - 24"', length: '20"', height: '122 - 128 cm' },
    { size: 'Age 9-10 (L Junior)', chest: '28" - 30"', waist: '24" - 25"', length: '22"', height: '134 - 140 cm' },
    { size: 'Age 11-12 (XL Junior)', chest: '30" - 32"', waist: '25" - 26"', length: '24"', height: '146 - 152 cm' },
    { size: 'Age 13-14 (Youth S)', chest: '32" - 34"', waist: '26" - 28"', length: '26"', height: '158 - 164 cm' },
  ];

  const adultSizes = [
    { size: 'Small (S)', chest: '36" - 38"', waist: '30" - 32"', neck: '14.5"', length: '28"' },
    { size: 'Medium (M)', chest: '39" - 41"', waist: '32" - 34"', neck: '15.5"', length: '29"' },
    { size: 'Large (L)', chest: '42" - 44"', waist: '35" - 37"', neck: '16.5"', length: '30"' },
    { size: 'X-Large (XL)', chest: '45" - 47"', waist: '38" - 40"', neck: '17.5"', length: '31"' },
    { size: '2X-Large (2XL)', chest: '48" - 50"', waist: '41" - 43"', neck: '18.5"', length: '32"' },
    { size: '3X-Large (3XL)', chest: '51" - 54"', waist: '44" - 47"', neck: '19.5"', length: '33"' },
    { size: '4XL / 5XL (Custom)', chest: '55"+', waist: '48"+', neck: '20.5"+', length: '34"' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#032345] flex items-center justify-center font-bold">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
                Size Chart & Technical Fabric Guide
              </h3>
              <span className="text-xs text-slate-500">
                Official specifications for NASISI uniform tailoring & knitwear
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50 gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('sizes')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'sizes'
                ? 'border-[#032345] text-[#032345]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            📏 Sizing Charts
          </button>
          <button
            onClick={() => setActiveTab('fabrics')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'fabrics'
                ? 'border-[#032345] text-[#032345]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🧵 Fabric Compositions
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`py-3 border-b-2 transition-colors ${
              activeTab === 'care'
                ? 'border-[#032345] text-[#032345]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            🧼 Wash & Embroidery Care
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'sizes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Sizing Group:
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setSizeCategory('school_junior')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      sizeCategory === 'school_junior'
                        ? 'bg-[#032345] text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    School & Junior (Ages 3-14)
                  </button>
                  <button
                    onClick={() => setSizeCategory('adult')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold ${
                      sizeCategory === 'adult'
                        ? 'bg-[#032345] text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Adult & Senior (S to 5XL)
                  </button>
                </div>
              </div>

              {sizeCategory === 'school_junior' ? (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 font-bold text-slate-700">
                      <tr>
                        <th className="p-3">Junior Size / Age</th>
                        <th className="p-3">To Fit Chest</th>
                        <th className="p-3">To Fit Waist</th>
                        <th className="p-3">Garment Length</th>
                        <th className="p-3">Child Height</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {juniorSizes.map((row) => (
                        <tr key={row.size} className="hover:bg-blue-50/50">
                          <td className="p-3 font-bold text-slate-900">{row.size}</td>
                          <td className="p-3 text-slate-600">{row.chest}</td>
                          <td className="p-3 text-slate-600">{row.waist}</td>
                          <td className="p-3 text-slate-600">{row.length}</td>
                          <td className="p-3 text-[#032345] font-semibold">{row.height}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-100 font-bold text-slate-700">
                      <tr>
                        <th className="p-3">Adult Size</th>
                        <th className="p-3">Chest (Inches)</th>
                        <th className="p-3">Waist (Inches)</th>
                        <th className="p-3">Shirt Collar</th>
                        <th className="p-3">Garment Length</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {adultSizes.map((row) => (
                        <tr key={row.size} className="hover:bg-blue-50/50">
                          <td className="p-3 font-bold text-slate-900">{row.size}</td>
                          <td className="p-3 text-slate-600">{row.chest}</td>
                          <td className="p-3 text-slate-600">{row.waist}</td>
                          <td className="p-3 text-slate-600">{row.neck}</td>
                          <td className="p-3 text-[#032345] font-semibold">{row.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p className="text-[11px] text-slate-500 italic">
                * Note: If in between sizes, we recommend selecting one size up for school uniforms to accommodate natural student growth throughout the academic year.
              </p>
            </div>
          )}

          {activeTab === 'fabrics' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-sm text-[#032345]">
                    1. Heavyweight Poly-Cotton Pique (220 GSM)
                  </h4>
                  <p className="text-slate-600">
                    65% combed ring-spun cotton and 35% high-tenacity polyester. Combines the soft breathability of natural cotton with the anti-shrink and color retention of polyester.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-sm text-[#032345]">
                    2. Anti-Pill Acrylic / Cotton Knit (320 GSM)
                  </h4>
                  <p className="text-slate-600">
                    Specifically formulated with low-pill long acrylic staple fibers. Provides exceptional warmth without fuzz balls or sagging collars after repeated laundering.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-sm text-[#032345]">
                    3. Pro-Flex 4-Way Scrub Twill (200 GSM)
                  </h4>
                  <p className="text-slate-600">
                    72% Poly, 21% Rayon, 7% Spandex with anti-microbial silver-ion finish. Fluid-resistant, ultra-flexible, and wrinkle-free for 12-hour hospital shifts.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-slate-900 text-sm text-[#032345]">
                    4. Poly-Viscose Blazer Twill with Teflon Shield
                  </h4>
                  <p className="text-slate-600">
                    65% Poly, 35% Viscose. Treated with Teflon fabric protector to repel liquid spills, ink stains, and dust, maintaining sharp creases.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 space-y-2">
                <h4 className="font-bold text-[#032345] text-sm">
                  Recommended Washing & Care Instructions:
                </h4>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li><strong>Embroidered Garments:</strong> Wash inside-out in cold or warm water (up to 40°C). Avoid chlorine bleach.</li>
                  <li><strong>Screen Printed Apparel:</strong> Wash inside-out. Do not iron directly on printed graphics; iron on reverse side.</li>
                  <li><strong>Knit Sweaters & Cardigans:</strong> Machine wash on gentle wool cycle. Flat dry to preserve original knit shape.</li>
                  <li><strong>Blazers:</strong> Machine washable on delicate cycle or dry clean. Hang immediately after wash to prevent creasing.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#032345] text-white text-xs font-bold rounded-xl hover:bg-[#021a34]"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
