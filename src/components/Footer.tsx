import React from 'react';
import { NasisiLogo } from './NasisiLogo';
import { Phone, Mail, MapPin, MessageSquare, ArrowUp, Sparkles, ShieldCheck, Building2 } from 'lucide-react';

interface FooterProps {
  onOpenAdminERP?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdminERP }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="contact" className="bg-[#EBEEF0] text-slate-800 relative">
      {/* Single Wave Curve on the Top Edge of Footer */}
      <div className="w-full overflow-hidden leading-none -mb-[1px] pointer-events-none">
        <svg
          className="w-full h-8 sm:h-12 md:h-16 text-[#032345] block"
          viewBox="0 0 1440 60"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 L1440,60 L1440,25 C1080,5 360,55 0,25 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Brand motto top strip - hidden on mobile */}
      <div className="hidden sm:block bg-[#032345] py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-blue-200 block">
              NASISI KNITWEAR & GRAPHICS
            </span>
            <p className="text-lg sm:text-xl font-extrabold font-['Outfit',sans-serif] tracking-wide text-white">
              "We stitch it. You wear it. We print it. You represent."
            </p>
          </div>
          <a
            href="#catalog"
            className="px-5 py-2.5 bg-white text-[#032345] font-extrabold text-xs rounded-xl shadow hover:bg-blue-50 transition-colors whitespace-nowrap"
          >
            Explore Catalog
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-9">
        {/* On Mobile: Only show Logo and Title. On Desktop/Tablet: Show full 5-column grid */}
        <div className="sm:hidden flex flex-col items-center justify-center text-center space-y-1.5 pb-2">
          <NasisiLogo size="lg" variant="full" />
        </div>

        {/* Desktop / Tablet Grid (Hidden on Mobile) */}
        <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-2.5">
            <NasisiLogo size="lg" variant="full" />
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm pt-1">
              Premier manufacturer and supplier of academic school uniforms, healthcare scrubs, hospitality wear, high-vis industrial gear, and bespoke computerized embroidery for local organizations.
            </p>
            <div className="flex items-center gap-2.5 pt-1 text-xs text-slate-700">
              <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-300 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-[#032345]" />
                <span>Anti-Pill Tested</span>
              </span>
              <span className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-300 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#032345]" />
                <span>Pantone Matched</span>
              </span>
            </div>
          </div>

          {/* Col 3: Uniform Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#032345]">
              Uniform Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li><a href="#catalog" className="hover:text-[#032345] transition-colors">School Blazers & Sweaters</a></li>
              <li><a href="#catalog" className="hover:text-[#032345] transition-colors">Pique Polo Shirts & PE Gear</a></li>
              <li><a href="#catalog" className="hover:text-[#032345] transition-colors">Medical & Clinic Scrubs</a></li>
              <li><a href="#catalog" className="hover:text-[#032345] transition-colors">Chef Coats & Aprons</a></li>
              <li><a href="#catalog" className="hover:text-[#032345] transition-colors">Industrial Workwear & Vests</a></li>
              <li><a href="#catalog" className="hover:text-[#032345] transition-colors">Varsity Jackets & Knitwear</a></li>
            </ul>
          </div>

          {/* Col 4: Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#032345]">
              Core Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li><a href="#catalog" className="hover:text-[#032345] transition-colors">Computerized 3D Embroidery</a></li>
              <li><a href="#catalog" className="hover:text-[#032345] transition-colors">Plastisol & DTF Screen Printing</a></li>
              <li><a href="#catalog" className="hover:text-[#032345] transition-colors">Bespoke Knitwear Weaving</a></li>
              <li><a href="#catalog" className="hover:text-[#032345] transition-colors">Bulk School Deliveries</a></li>
              <li><a href="#contact" className="hover:text-[#032345] transition-colors">School Badge Digitization</a></li>
              <li><a href="#catalog" className="hover:text-[#032345] transition-colors">Institutional Procurement</a></li>
            </ul>
          </div>

            {/* Col 5: Quick Contact */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#032345]">
                Factory Desk
              </h4>
              <div className="space-y-2.5 text-xs text-slate-600 font-medium">
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#032345]" />
                  <a href="tel:0728102929" className="hover:text-[#032345] transition-colors">0728102929 (+254 728 102 929)</a>
                </p>
                <p className="flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  <a
                    href="https://wa.me/254728102929?text=Hello%20NASISI%20Uniforms%2C%20I%20would%20like%20to%20inquire%20about%20uniform%20orders."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 hover:text-emerald-900 font-semibold transition-colors"
                  >
                    WhatsApp (0728102929)
                  </a>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#032345]" />
                  <span>orders@nasisiuniforms.com</span>
                </p>
                <p className="flex items-start gap-2 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#032345] flex-shrink-0 mt-0.5" />
                  <span>Industrial Area Workshop, Unit 4B</span>
                </p>
              </div>
            </div>

        </div>

        {/* Bottom All Rights Reserved and Powered By bar */}
        <div className="mt-2.5 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-300/80 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} NASISI Knitwear and Graphics. All rights reserved.</p>
          
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center sm:justify-end">
            <a
              href="https://urbantechdev.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-[#032345] font-semibold transition-colors hover:underline"
            >
              Powered by Urbantechdev
            </a>
            {onOpenAdminERP && (
              <button
                onClick={onOpenAdminERP}
                className="hidden sm:inline-flex text-emerald-800 hover:text-emerald-950 font-bold items-center gap-1 bg-emerald-100 hover:bg-emerald-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Admin ERP Portal (Ksh)</span>
              </button>
            )}
            <button
              onClick={scrollToTop}
              className="hidden sm:inline-flex p-2 rounded-lg bg-white hover:bg-slate-200 text-[#032345] border border-slate-300 shadow-sm transition-colors"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
