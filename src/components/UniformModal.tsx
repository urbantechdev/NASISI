import React, { useState } from 'react';
import { UniformProduct, QuoteItem } from '../types';
import { X, Check, ShoppingBag, SlidersHorizontal, Sparkles, Shield, Tag, Layers, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface UniformModalProps {
  product: UniformProduct | null;
  onClose: () => void;
  onAddToCart: (item: QuoteItem) => void;
  onOpenCustomizerWithProduct: (product: UniformProduct, colorHex: string) => void;
}

export const UniformModal: React.FC<UniformModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onOpenCustomizerWithProduct,
}) => {
  if (!product) return null;

  const [selectedColor, setSelectedColor] = useState(product.availableColors[0]?.name || '');
  const [brandingType, setBrandingType] = useState<'embroidery' | 'screen_printing' | 'both' | 'blank'>('embroidery');
  const [selectedPlacements, setSelectedPlacements] = useState<string[]>(['Left Chest']);
  const [logoNotes, setLogoNotes] = useState('');
  const [sizeQuantities, setSizeQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    product.sizes.forEach((sz, idx) => {
      initial[sz] = idx === 0 ? product.minOrder : 0;
    });
    return initial;
  });

  const totalUnits: number = (Object.values(sizeQuantities) as number[]).reduce(
    (a: number, b: number) => a + b,
    0
  );

  // Volume discount calculation
  const getDiscountPercent = (qty: number) => {
    if (qty >= 250) return 0.32;
    if (qty >= 100) return 0.25;
    if (qty >= 50) return 0.18;
    if (qty >= 25) return 0.10;
    return 0;
  };

  const discountPercent = getDiscountPercent(totalUnits);
  
  // Additional branding fee estimate in Ksh
  let brandingAddon = 0;
  if (brandingType === 'embroidery') brandingAddon = 350;
  else if (brandingType === 'screen_printing') brandingAddon = 250;
  else if (brandingType === 'both') brandingAddon = 500;

  const unitBase = (product.basePrice + brandingAddon) * (1 - discountPercent);
  const calculatedUnitPrice = Math.round(unitBase);
  const calculatedTotal = Math.round(calculatedUnitPrice * Math.max(totalUnits, 1));

  const handleSizeChange = (size: string, value: number) => {
    const val = Math.max(0, isNaN(value) ? 0 : value);
    setSizeQuantities((prev) => ({
      ...prev,
      [size]: val,
    }));
  };

  const togglePlacement = (placement: string) => {
    setSelectedPlacements((prev) =>
      prev.includes(placement) ? prev.filter((p) => p !== placement) : [...prev, placement]
    );
  };

  const handleAdd = () => {
    if (totalUnits < product.minOrder) {
      alert(`Minimum order quantity for this item is ${product.minOrder} units.`);
      return;
    }

    const newItem: QuoteItem = {
      id: `${product.id}-${Date.now()}`,
      product,
      selectedColor,
      quantities: sizeQuantities,
      totalQuantity: totalUnits,
      brandingType,
      logoPlacement: selectedPlacements,
      logoNotes,
      unitPrice: calculatedUnitPrice,
      totalPrice: calculatedTotal,
    };

    onAddToCart(newItem);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#032345', '#38BDF8', '#FFFFFF'],
      });
    } catch {
      // ignore
    }

    onClose();
  };

  const activeColorHex =
    product.availableColors.find((c) => c.name === selectedColor)?.hex || '#032345';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-blue-100 text-[#032345] rounded-md">
              {product.categoryLabel}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-['Outfit',sans-serif]">
              {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Left: Product Image & Fabric Info */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 aspect-[4/3]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  loading="eager"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-[#032345] text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm">
                    {product.badge}
                  </span>
                )}
                <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm p-2 rounded-lg text-xs flex justify-between items-center shadow-sm">
                  <span className="font-semibold text-slate-700">Min. Order (MOQ):</span>
                  <span className="font-bold text-[#032345]">{product.minOrder} units</span>
                </div>
              </div>

              {/* Fabric Specs */}
              <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-100 space-y-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#032345]">
                  <Layers className="w-4 h-4" />
                  <span>Fabric Specifications</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-700 pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Composition</span>
                    <span className="font-semibold">{product.fabric.composition}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Weight / Density</span>
                    <span className="font-semibold">{product.fabric.weight}</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-blue-100/80">
                  <span className="text-slate-400 block text-[10px] mb-1">Key Performance Features:</span>
                  <div className="flex flex-wrap gap-1">
                    {product.fabric.features.map((feat) => (
                      <span
                        key={feat}
                        className="px-2 py-0.5 bg-white text-slate-700 rounded text-[11px] font-medium border border-blue-200"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Mockup Studio button trigger */}
              <button
                type="button"
                onClick={() => {
                  onOpenCustomizerWithProduct(product, activeColorHex);
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-[#032345] bg-white hover:bg-blue-50 border-2 border-[#032345] shadow-sm transition-all"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Open in Live Mockup Studio</span>
              </button>
            </div>

            {/* Right: Customization, Sizes, and Pricing Options */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
              </div>

              {/* 1. Color Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  1. Select Garment Color: <span className="text-[#032345]">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.availableColors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        selectedColor === color.name
                          ? 'border-[#032345] ring-2 ring-blue-900/20 bg-blue-50/50 text-[#032345] font-bold'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full shadow-inner ${color.bgClass}`}
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                      {selectedColor === color.name && <Check className="w-3.5 h-3.5 text-[#032345]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Branding & Customization Technique */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  2. Choose Logo & Branding Service:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'embroidery', label: 'Embroidery', desc: 'Precision Thread Crest', addon: '+Ksh 350/ea' },
                    { id: 'screen_printing', label: 'Screen Print', desc: 'Durable Silkscreen', addon: '+Ksh 250/ea' },
                    { id: 'both', label: 'Both', desc: 'Embroidery + Print', addon: '+Ksh 500/ea' },
                    { id: 'blank', label: 'Plain / Blank', desc: 'No Logo Added', addon: '+Ksh 0' },
                  ].map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBrandingType(b.id as any)}
                      className={`p-2.5 rounded-xl text-left border transition-all ${
                        brandingType === b.id
                          ? 'border-[#032345] bg-blue-50/70 text-[#032345]'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <span className="block text-xs font-bold">{b.label}</span>
                      <span className="block text-[10px] text-slate-500">{b.desc}</span>
                      <span className="block text-[10px] font-semibold text-[#032345] mt-1">{b.addon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Logo Placement */}
              {brandingType !== 'blank' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Logo Placement Positions:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Left Chest', 'Right Chest', 'Full Back', 'Left Sleeve', 'Back of Neck'].map((loc) => {
                      const isSel = selectedPlacements.includes(loc);
                      return (
                        <button
                          key={loc}
                          type="button"
                          onClick={() => togglePlacement(loc)}
                          className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                            isSel
                              ? 'bg-[#032345] text-white border-[#032345] font-semibold'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {isSel ? '✓ ' : '+ '} {loc}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Sizes & Quantities Matrix */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    3. Specify Quantities per Size:
                  </label>
                  <span className="text-xs font-semibold text-slate-500">
                    Total: <strong className="text-[#032345] font-extrabold">{totalUnits} units</strong>
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {product.sizes.map((sz) => (
                    <div key={sz} className="flex items-center justify-between bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-xs font-semibold text-slate-700">{sz}</span>
                      <input
                        type="number"
                        min="0"
                        value={sizeQuantities[sz] || 0}
                        onChange={(e) => handleSizeChange(sz, parseInt(e.target.value))}
                        className="w-14 text-center text-xs font-bold border border-slate-300 rounded p-1 focus:ring-1 focus:ring-[#032345] focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
                {totalUnits < product.minOrder && (
                  <p className="text-[11px] text-amber-600 font-medium mt-1">
                    ⚠️ Minimum order requirement: {product.minOrder} units (Current: {totalUnits})
                  </p>
                )}
              </div>

              {/* Logo Notes / Instructions */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Branding Notes & School / Org Name (Optional):
                </label>
                <input
                  type="text"
                  placeholder="e.g. St. Jude High School Crest, Gold thread border"
                  value={logoNotes}
                  onChange={(e) => setLogoNotes(e.target.value)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#032345] focus:outline-none"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Modal Sticky Bottom Calculation Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 sticky bottom-0 z-20">
          <div className="flex items-center gap-4">
            <div>
              <span className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                Estimated Unit Price:
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-[#032345] font-['Outfit',sans-serif]">
                  Ksh {calculatedUnitPrice.toLocaleString()}
                </span>
                {discountPercent > 0 && (
                  <span className="text-xs bg-green-100 text-green-800 font-bold px-1.5 py-0.5 rounded">
                    {Math.round(discountPercent * 100)}% Bulk Discount
                  </span>
                )}
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

            <div>
              <span className="block text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                Total Estimate ({totalUnits} pcs):
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
                Ksh {calculatedTotal.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleAdd}
              disabled={totalUnits < product.minOrder}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
                totalUnits >= product.minOrder
                  ? 'bg-[#032345] hover:bg-[#021a34] active:scale-95 cursor-pointer'
                  : 'bg-slate-400 cursor-not-allowed opacity-70'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Quote Request</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
