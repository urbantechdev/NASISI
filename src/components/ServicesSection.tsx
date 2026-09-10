import React, { useState } from 'react';
import { CORE_SERVICES } from '../data/uniformsData';
import { Sparkles, CheckCircle2, SlidersHorizontal, ArrowRight, ShieldCheck, Zap, Layers, Palette } from 'lucide-react';

interface ServicesSectionProps {
  onOpenQuoteModal: () => void;
  onOpenCustomizer: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onOpenQuoteModal,
  onOpenCustomizer,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const currentService = CORE_SERVICES[activeTab];

  return (
    <section id="services" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#06163c] text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Signature In-House Services</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit',sans-serif] tracking-tight">
            Embroidery, Screen Printing & Custom Knitwear
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            We don't outsource. All stitchwork, screen exposure, dye printing, and knit finishing are handled in-house with commercial-grade precision machines.
          </p>
        </div>

        {/* 3 Main Tab Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
          {CORE_SERVICES.map((srv, idx) => (
            <button
              key={srv.id}
              onClick={() => setActiveTab(idx)}
              className={`p-5 rounded-2xl text-left border transition-all relative overflow-hidden ${
                activeTab === idx
                  ? 'border-[#06163c] bg-blue-50/50 shadow-md ring-2 ring-blue-500/10'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300'
              }`}
            >
              {activeTab === idx && (
                <span className="absolute top-0 left-0 right-0 h-1 bg-[#06163c]" />
              )}
              <div className="flex items-center gap-3 mb-2">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    activeTab === idx
                      ? 'bg-[#06163c] text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif]">
                  {srv.title}
                </h3>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">
                {srv.shortDescription}
              </p>
            </button>
          ))}
        </div>

        {/* Active Service Showcase Card */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Deep Capabilities & Checklist */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#06163c] block mb-1">
                  Service Spotlight #0{activeTab + 1}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
                  {currentService.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {currentService.shortDescription}
                </p>
              </div>

              {/* Key Features List */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Technical Specifications & Capabilities:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentService.bulletPoints.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-[#06163c] flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Garments */}
              <div className="pt-2">
                <span className="text-xs font-semibold text-slate-500 block mb-2">
                  Best Suited For Garments:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentService.idealFabrics.map((fab) => (
                    <span
                      key={fab}
                      className="px-3 py-1 bg-white text-[#06163c] font-bold text-xs rounded-lg border border-blue-200"
                    >
                      {fab}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={onOpenQuoteModal}
                  className="px-5 py-3 text-xs font-bold text-white bg-gradient-to-r from-[#020a1c] via-[#06163c] to-[#030e28] hover:from-[#010612] hover:via-[#040f28] hover:to-[#010612] rounded-xl shadow-md border border-blue-900/40 transition-all cursor-pointer"
                >
                  <span>Request {currentService.title.split(' ')[0]} Quote</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenCustomizer}
                  className="px-5 py-3 text-xs font-bold text-[#06163c] bg-white hover:bg-blue-50 border border-blue-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Preview in Live Mockup</span>
                </button>
              </div>
            </div>

            {/* Right: Realistic visual technique showcase preview */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#06163c]"></div>
                    <span className="text-xs font-bold text-slate-800">
                      {activeTab === 0 ? 'High-Density Digitized Stitching' : activeTab === 1 ? 'High-Opacity Plastisol Printing' : 'Precision Jacquard Knitting'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    ISO Quality Checked
                  </span>
                </div>

                {/* Visual Representation Graphic */}
                <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center p-6 text-center text-white">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:12px_12px]"></div>
                  
                  {activeTab === 0 && (
                    <div className="space-y-2 relative z-10">
                      <div className="w-16 h-16 rounded-full border-4 border-dashed border-blue-400 mx-auto flex items-center justify-center bg-blue-900/60 shadow-lg">
                        <span className="font-extrabold text-lg text-white font-['Outfit']">N</span>
                      </div>
                      <span className="block text-xs font-bold text-blue-200 tracking-wider uppercase">
                        Computerized Multi-Needle Tajima Stitch
                      </span>
                      <span className="block text-[10px] text-slate-300">
                        12,000+ Stitches per crest • High luster metallic thread
                      </span>
                    </div>
                  )}

                  {activeTab === 1 && (
                    <div className="space-y-2 relative z-10">
                      <div className="px-6 py-3 border-2 border-white rounded-xl bg-[#06163c] mx-auto inline-block shadow-lg">
                        <span className="font-black text-xl tracking-widest text-white uppercase font-['Outfit']">
                          NASISI PRINT
                        </span>
                      </div>
                      <span className="block text-xs font-bold text-blue-200 tracking-wider uppercase">
                        Multi-Layer Silk Screen Mesh & DTF
                      </span>
                      <span className="block text-[10px] text-slate-300">
                        High stretch elasticity • Never cracks or peels
                      </span>
                    </div>
                  )}

                  {activeTab === 2 && (
                    <div className="space-y-2 relative z-10">
                      <div className="flex justify-center gap-1.5">
                        <div className="w-3 h-12 bg-[#06163c] rounded"></div>
                        <div className="w-3 h-12 bg-white rounded"></div>
                        <div className="w-3 h-12 bg-[#021a34] rounded"></div>
                        <div className="w-3 h-12 bg-white rounded"></div>
                        <div className="w-3 h-12 bg-[#06163c] rounded"></div>
                      </div>
                      <span className="block text-xs font-bold text-blue-200 tracking-wider uppercase">
                        Bespoke Knit Ribs & Anti-Pill Acrylic
                      </span>
                      <span className="block text-[10px] text-slate-300">
                        Custom jacquard collar tipping matched to school Pantone
                      </span>
                    </div>
                  )}
                </div>

                {/* Quality Guarantees */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-600">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#06163c]" />
                    <span>Industrial Wash Tested (90°C)</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#06163c]" />
                    <span>Free Digital Artwork Proofing</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
