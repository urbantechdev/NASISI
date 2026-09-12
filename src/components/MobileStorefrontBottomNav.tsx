import React from 'react';
import {
  LayoutGrid,
  Layers,
  SlidersHorizontal,
  Ruler,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import { QuoteItem } from '../types';

interface MobileStorefrontBottomNavProps {
  quoteItems: QuoteItem[];
  onOpenQuoteModal: () => void;
  onOpenCustomizer: () => void;
  onOpenSizeGuide: () => void;
}

export const MobileStorefrontBottomNav: React.FC<MobileStorefrontBottomNavProps> = ({
  quoteItems,
  onOpenQuoteModal,
  onOpenCustomizer,
  onOpenSizeGuide,
}) => {
  const totalItemsCount = quoteItems.reduce((sum, item) => sum + item.totalQuantity, 0);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Mobile Storefront Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden select-none bg-white/95 backdrop-blur-lg border-t border-slate-200/50 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)]"
    >
      {/* Top Edge: Single Wave Curve Design with Glowing Smoke Blue Mist Effect */}
      <div className="absolute bottom-full left-0 right-0 pointer-events-none overflow-visible z-20 -mb-[1px]">
        {/* Layer 1: Ambient Glowing Smoke Blue & Deep Dark Mist Auras */}
        <div className="absolute -bottom-4 inset-x-0 h-14 bg-gradient-to-r from-blue-950/20 via-sky-600/30 to-blue-950/20 blur-2xl opacity-95 pointer-events-none" />
        <div className="absolute -bottom-1 inset-x-0 h-10 bg-gradient-to-r from-sky-400/35 via-blue-500/45 to-cyan-400/35 blur-xl opacity-90" />
        <div className="absolute bottom-0 left-[10%] w-[40%] h-8 bg-gradient-to-r from-cyan-400/40 via-sky-300/45 to-blue-500/35 rounded-full blur-lg opacity-90 animate-smoke-1" />
        <div className="absolute bottom-1 right-[8%] w-[45%] h-9 bg-gradient-to-r from-blue-600/35 via-sky-400/35 to-indigo-500/30 rounded-full blur-xl opacity-85 animate-smoke-2" />
        <div className="absolute bottom-0.5 left-[42%] w-[25%] h-7 bg-cyan-400/40 rounded-full blur-md opacity-85 animate-smoke-3" />

        {/* Layer 2: Single Wave SVG Line with Luminous Smoke Blue Stroke & Drop Shadow */}
        <svg
          viewBox="0 0 1440 56"
          fill="none"
          preserveAspectRatio="none"
          className="w-full h-7 sm:h-9 block filter drop-shadow-[0_-5px_12px_rgba(14,165,233,0.6)] drop-shadow-[0_-2px_5px_rgba(37,99,235,0.75)]"
        >
          <defs>
            <linearGradient id="mobileStorefrontWaveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#0ea5e9" stopOpacity="1" />
              <stop offset="50%" stopColor="#2563eb" stopOpacity="1" />
              <stop offset="75%" stopColor="#06b6d4" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="mobileStorefrontWaveFill" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>
          </defs>
          {/* Wave Body fill seamlessly blending into the nav background */}
          <path
            d="M 0,16 C 400,56 1040,6 1440,44 L 1440,56 L 0,56 Z"
            fill="url(#mobileStorefrontWaveFill)"
          />
          {/* Glowing Single Wave Crest Line */}
          <path
            d="M 0,16 C 400,56 1040,6 1440,44"
            stroke="url(#mobileStorefrontWaveGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* 5 Navigation Items Layout with Elevated Center Icon on Top */}
      <div className="relative z-30 grid grid-cols-5 items-center px-2 py-1.5 pb-2">
        {/* 1. Catalog / Home */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={() => scrollToSection('catalog')}
          className="flex flex-col items-center justify-center py-1 text-slate-600 hover:text-[#06163c] transition-colors"
        >
          <LayoutGrid className="w-5 h-5 text-slate-700" />
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">Catalog</span>
        </motion.button>

        {/* 2. Categories / Explorer */}
        <motion.button
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 450, damping: 25 }}
          type="button"
          onClick={() => scrollToSection('catalog')}
          className="group flex flex-col items-center justify-center py-1 text-slate-600 hover:text-[#06163c] transition-colors cursor-pointer"
        >
          <Layers className="w-5 h-5 text-slate-700 group-hover:text-[#06163c] group-hover:scale-115 group-hover:rotate-6 transition-all duration-200" />
          <span className="text-[10px] font-bold mt-0.5 tracking-tight group-hover:text-[#06163c] transition-colors">Categories</span>
        </motion.button>

        {/* 3. Center Icon - 3D Customizer / Mockup Studio (PERCHED ON TOP OF NAV DOCK) */}
        <div className="relative z-50 flex flex-col items-center justify-center -mt-10 sm:-mt-12">
          {/* Glowing Aura Ring Behind Center Icon */}
          <div className="absolute inset-0 -m-2.5 bg-gradient-to-tr from-cyan-400 via-sky-500 to-blue-600 rounded-full blur-lg opacity-90 animate-pulse pointer-events-none" />
          
          <motion.button
            whileHover={{ scale: 1.12, y: -4 }}
            whileTap={{ scale: 0.92 }}
            type="button"
            onClick={onOpenCustomizer}
            className="relative w-15 h-15 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#06163c] via-[#023e7d] to-[#0ea5e9] text-white flex flex-col items-center justify-center shadow-[0_12px_28px_rgba(14,165,233,0.65)] border-[3.5px] border-white focus:outline-none ring-4 ring-sky-400/40 cursor-pointer"
            aria-label="Open Uniform Customizer Studio"
          >
            <SlidersHorizontal className="w-6 h-6 text-white" />
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 absolute top-2 right-2 animate-bounce" />
          </motion.button>
          <span className="text-[10px] font-black text-[#06163c] mt-1 tracking-tight drop-shadow-sm bg-white/90 px-2 py-0.5 rounded-full border border-slate-200/60 shadow-2xs">
            Studio
          </span>
        </div>

        {/* 4. Size & Fabric Guide */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={onOpenSizeGuide}
          className="flex flex-col items-center justify-center py-1 text-slate-600 hover:text-[#06163c] transition-colors"
        >
          <Ruler className="w-5 h-5 text-slate-700" />
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">Size Guide</span>
        </motion.button>

        {/* 5. Quote Cart / Estimator */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={onOpenQuoteModal}
          className="relative flex flex-col items-center justify-center py-1 text-slate-600 hover:text-[#06163c] transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-slate-700" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-xs">
                {totalItemsCount > 99 ? '99+' : totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight">Quote</span>
        </motion.button>
      </div>
    </nav>
  );
};
