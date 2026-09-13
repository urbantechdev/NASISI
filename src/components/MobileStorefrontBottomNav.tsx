import React from 'react';
import { QuoteItem } from '../types';
import { Home, Sparkles, ShoppingBag, Ruler, Grid } from 'lucide-react';

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

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden select-none bg-white/95 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.08)]"
    >
      <div className="grid grid-cols-5 items-center px-1 py-1 pb-safe">
        {/* Home */}
        <a
          href="#"
          className="flex flex-col items-center justify-center py-1.5 text-slate-600 hover:text-[#06163c] transition-colors"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Home</span>
        </a>

        {/* Catalog */}
        <a
          href="#catalog"
          className="flex flex-col items-center justify-center py-1.5 text-slate-600 hover:text-[#06163c] transition-colors"
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Catalogue</span>
        </a>

        {/* Center: 3D Studio action */}
        <div className="flex flex-col items-center justify-center -mt-5">
          <button
            type="button"
            onClick={onOpenCustomizer}
            className="w-12 h-12 rounded-full bg-[#06163c] text-white flex items-center justify-center shadow-lg border-2 border-white hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            aria-label="Launch 3D Studio"
          >
            <Sparkles className="w-5 h-5 text-cyan-300" />
          </button>
          <span className="text-[9px] font-black text-[#06163c] uppercase tracking-tight mt-1">3D Studio</span>
        </div>

        {/* Size Guide */}
        <button
          type="button"
          onClick={onOpenSizeGuide}
          className="flex flex-col items-center justify-center py-1.5 text-slate-600 hover:text-[#06163c] transition-colors cursor-pointer"
        >
          <Ruler className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-0.5">Sizes</span>
        </button>

        {/* Cart */}
        <button
          type="button"
          onClick={onOpenQuoteModal}
          className="relative flex flex-col items-center justify-center py-1.5 text-slate-600 hover:text-[#06163c] transition-colors cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-black bg-[#06163c] text-white rounded-full">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-0.5">Quote</span>
        </button>
      </div>
    </nav>
  );
};
