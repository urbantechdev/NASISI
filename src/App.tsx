import React, { useState, useEffect } from 'react';
import { UniformProduct, QuoteItem } from './types';
import { UNIFORM_PRODUCTS } from './data/uniformsData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { UniformCatalog } from './components/UniformCatalog';
import { InteractiveCustomizer } from './components/InteractiveCustomizer';
import { Footer } from './components/Footer';
import { UniformModal } from './components/UniformModal';
import { QuoteEstimatorModal } from './components/QuoteEstimatorModal';
import { SizeAndFabricGuide } from './components/SizeAndFabricGuide';

export default function App() {
  // Cart state persisted to localStorage
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('nasisi_quote_items');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    // Default starter item to showcase instant quote readiness
    return [
      {
        id: 'initial-blazer-demo',
        product: UNIFORM_PRODUCTS[0],
        selectedColor: 'Royal Blue',
        quantities: { 'Youth M': 20, 'Adult S': 30 },
        totalQuantity: 50,
        brandingType: 'embroidery',
        logoPlacement: ['Left Chest'],
        logoNotes: 'School Crest Gold Stitching Sample',
        unitPrice: 37.31,
        totalPrice: 1865.5,
      },
    ];
  });

  const [selectedProductForModal, setSelectedProductForModal] = useState<UniformProduct | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCustomizerModalOpen, setIsCustomizerModalOpen] = useState(false);
  const [customizerProduct, setCustomizerProduct] = useState<UniformProduct | null>(null);
  const [customizerColorHex, setCustomizerColorHex] = useState<string | undefined>(undefined);

  useEffect(() => {
    try {
      localStorage.setItem('nasisi_quote_items', JSON.stringify(quoteItems));
    } catch {
      // ignore
    }
  }, [quoteItems]);

  const handleAddToCart = (item: QuoteItem) => {
    setQuoteItems((prev) => [item, ...prev]);
  };

  const handleRemoveItem = (id: string) => {
    setQuoteItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setQuoteItems([]);
  };

  const handleOpenCustomizerWithProduct = (product: UniformProduct, colorHex: string) => {
    setCustomizerProduct(product);
    setCustomizerColorHex(colorHex);
    setIsCustomizerModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header & Sticky Nav */}
      <Navbar
        quoteItems={quoteItems}
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
        onOpenCustomizer={() => setIsCustomizerModalOpen(true)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      <main className="flex-1 pt-24 sm:pt-28 md:pt-32">
        {/* Plain Hero Banner with no text or items */}
        <Hero />

        {/* Uniform Catalog */}
        <UniformCatalog
          onSelectProduct={(product) => setSelectedProductForModal(product)}
          onOpenCustomizerWithProduct={handleOpenCustomizerWithProduct}
        />
      </main>

      {/* Modern Footer */}
      <Footer />

      {/* Modals & Studios */}
      <InteractiveCustomizer
        isOpen={isCustomizerModalOpen}
        onClose={() => setIsCustomizerModalOpen(false)}
        onAddToCart={handleAddToCart}
        preselectedProduct={customizerProduct}
        preselectedColorHex={customizerColorHex}
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
      />

      <UniformModal
        product={selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={handleAddToCart}
        onOpenCustomizerWithProduct={handleOpenCustomizerWithProduct}
      />

      <QuoteEstimatorModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        quoteItems={quoteItems}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      <SizeAndFabricGuide
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  );
}
