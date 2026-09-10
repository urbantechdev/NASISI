import React from 'react';
import { ShieldCheck, Award, Zap, Sparkles, RefreshCw, Layers, CheckCircle2, HeartHandshake } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Anti-Pill & Wash-Tested Fabrics',
      description: 'Our knitwear and woven blends undergo vigorous wash & rub tests to ensure zero shrinking, zero pilling, and long-lasting fabric structure for active students and busy staff.',
    },
    {
      icon: Award,
      title: 'Exact Pantone Color Calibration',
      description: 'We match your institution’s exact brand and school colors across knitwear, embroidery threads, and screen print inks so your identity remains uniform year after year.',
    },
    {
      icon: Zap,
      title: 'Rapid 5-10 Day Turnaround',
      description: 'With modern multi-head embroidery machines and automated screen printing presses in our workshop, we deliver bulk school and business orders on strict deadlines.',
    },
    {
      icon: HeartHandshake,
      title: 'Free Artwork Proofs & Physical Sampling',
      description: 'Before mass production, we provide free digital vector proofs and physical sample swatches for your procurement committee or school board to inspect.',
    },
    {
      icon: Layers,
      title: 'Tailored Sizing From Age 3 to 5XL',
      description: 'Complete size flexibility with reinforced stitching on high-stress seams (elbows, plackets, crotch, pockets) built specifically for durability.',
    },
    {
      icon: RefreshCw,
      title: 'Guaranteed Year-Round Re-orders',
      description: 'We store your digitized embroidery files and print screens forever. Need an extra 10 blazers for new student admissions mid-term? We produce them with zero setup delay.',
    },
  ];

  return (
    <section id="about" className="py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#06163c] text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The NASISI Quality Guarantee</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-['Outfit',sans-serif] tracking-tight">
            Why Schools & Businesses Trust NASISI
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            We are dedicated craftsmen passionate about textiles, precision stitchwork, and crisp graphics. Here is what sets our factory apart.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 hover:-translate-y-1.5 transition-all duration-300 space-y-3 cursor-default"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#06163c] flex items-center justify-center font-bold transition-all duration-300 group-hover:bg-[#06163c] group-hover:text-white group-hover:scale-110 group-hover:shadow-md">
                  <Icon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 font-['Outfit',sans-serif] group-hover:text-blue-900 transition-colors">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Banner with brand motto */}
        <div className="mt-12 p-6 sm:p-8 bg-gradient-to-r from-[#020a1c] via-[#06163c] to-[#030e28] text-white rounded-3xl shadow-2xl border border-blue-900/50 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-1 text-center md:text-left relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-200">
              Our Core Promise
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold font-['Outfit',sans-serif]">
              "We stitch it, You wear it, We print it, you represent."
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Schedule a visit to our workshop or request our uniform fabric sample pack delivered directly to your school administration office.
            </p>
          </div>
          
          <a
            href="#contact"
            className="btn-shimmer-sweep group flex-shrink-0 px-6 py-3.5 bg-white text-[#06163c] font-black text-xs rounded-xl shadow-lg hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            Request Free Fabric Sample Kit
          </a>
        </div>

      </div>
    </section>
  );
};
