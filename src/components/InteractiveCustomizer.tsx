import React, { useState, useRef, useEffect } from 'react';
import { UniformProduct, QuoteItem } from '../types';
import { useERP } from '../context/ERPContext';
import {
  Sparkles,
  SlidersHorizontal,
  Upload,
  RotateCcw,
  Check,
  ShoppingBag,
  Download,
  CheckCircle2,
  Move,
  X,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InteractiveCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: QuoteItem) => void;
  preselectedProduct?: UniformProduct | null;
  preselectedColorHex?: string;
  onOpenQuoteModal?: () => void;
}

const SAMPLE_LOGOS = [
  {
    id: 'sample-crest-1',
    name: 'St. Jude Prep Crest',
    type: 'Academic Crest',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path d="M 50 10 L 85 25 L 85 60 C 85 80, 50 95, 50 95 C 50 95, 15 80, 15 60 L 15 25 Z" fill="#06163c" stroke="#FFFFFF" strokeWidth="3" />
        <circle cx="50" cy="45" r="18" fill="#FFFFFF" />
        <path d="M 50 32 L 54 42 L 64 42 L 56 48 L 59 58 L 50 52 L 41 58 L 44 48 L 36 42 L 46 42 Z" fill="#06163c" />
        <text x="50" y="80" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold" fontFamily="sans-serif">ST. JUDE</text>
      </svg>
    ),
  },
  {
    id: 'sample-crest-2',
    name: 'Oakridge Academy',
    type: 'Monogram Emblem',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="42" fill="#FFFFFF" stroke="#06163c" strokeWidth="4" />
        <circle cx="50" cy="50" r="36" fill="#06163c" />
        <text x="50" y="60" textAnchor="middle" fill="#FFFFFF" fontSize="30" fontWeight="900" fontFamily="serif">OA</text>
      </svg>
    ),
  },
  {
    id: 'sample-crest-3',
    name: 'Apex Logistics & Fleet',
    type: 'Corporate Shield',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <rect x="15" y="20" width="70" height="60" rx="8" fill="#06163c" stroke="#FFFFFF" strokeWidth="2.5" />
        <path d="M 30 55 L 50 35 L 70 55 L 58 55 L 58 70 L 42 70 L 42 55 Z" fill="#FFFFFF" />
        <text x="50" y="30" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" letterSpacing="2">APEX</text>
      </svg>
    ),
  },
  {
    id: 'sample-crest-4',
    name: 'City Premier Clinic',
    type: 'Medical Cross',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="44" fill="#06163c" />
        <rect x="42" y="22" width="16" height="56" rx="4" fill="#FFFFFF" />
        <rect x="22" y="42" width="56" height="16" rx="4" fill="#FFFFFF" />
        <circle cx="50" cy="50" r="6" fill="#06163c" />
      </svg>
    ),
  },
  {
    id: 'sample-crest-5',
    name: 'Grand Bistro Culinary',
    type: 'Hospitality Emblem',
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r="42" fill="#FFFFFF" stroke="#06163c" strokeWidth="3" />
        <path d="M 38 35 C 38 25, 62 25, 62 35 C 68 35, 70 42, 65 48 C 65 55, 35 55, 35 48 C 30 42, 32 35, 38 35 Z" fill="#06163c" />
        <rect x="40" y="55" width="20" height="6" rx="1" fill="#06163c" />
        <text x="50" y="78" textAnchor="middle" fill="#06163c" fontSize="8" fontWeight="bold">BISTRO</text>
      </svg>
    ),
  },
];

const GARMENT_OPTIONS = [
  { id: 'blazer', name: 'School Blazer', productId: 'school-blazer-elite', basePrice: 3800 },
  { id: 'polo', name: 'Pique Polo Shirt', productId: 'school-pique-polo', basePrice: 1450 },
  { id: 'sweater', name: 'V-Neck Knit Sweater', productId: 'school-knit-jumper', basePrice: 2200 },
  { id: 'scrub', name: 'Medical Scrub Top', productId: 'medical-scrub-pro', basePrice: 2850 },
  { id: 'chef', name: 'Chef Jacket', productId: 'chef-jacket-executive', basePrice: 2900 },
  { id: 'vest', name: 'Hi-Vis Safety Vest', productId: 'industrial-hi-vis-vest', basePrice: 950 },
  { id: 'varsity', name: 'Varsity Jacket', productId: 'custom-varsity-jacket', basePrice: 4800 },
  { id: 'hoodie', name: 'Fleece Hoodie', productId: 'heavyweight-pullover-hoodie', basePrice: 2950 },
];

const COLOR_PALETTES = [
  { name: 'Royal Blue', hex: '#06163c', contrastColor: '#FFFFFF' },
  { name: 'Deep Navy', hex: '#0F172A', contrastColor: '#FFFFFF' },
  { name: 'Crisp White', hex: '#F8FAFC', contrastColor: '#06163c' },
  { name: 'Heather Grey', hex: '#94A3B8', contrastColor: '#0F172A' },
  { name: 'Bottle Green', hex: '#14532D', contrastColor: '#FFFFFF' },
  { name: 'Burgundy', hex: '#881337', contrastColor: '#FFFFFF' },
  { name: 'Classic Black', hex: '#18181B', contrastColor: '#FFFFFF' },
];

export const InteractiveCustomizer: React.FC<InteractiveCustomizerProps> = ({
  isOpen,
  onClose,
  onAddToCart,
  preselectedProduct,
  preselectedColorHex,
  onOpenQuoteModal,
}) => {
  const { products, raiseInquiryTicket } = useERP();
  const [selectedGarment, setSelectedGarment] = useState(
    preselectedProduct
      ? GARMENT_OPTIONS.find((g) => g.productId === preselectedProduct.id) || GARMENT_OPTIONS[0]
      : GARMENT_OPTIONS[0]
  );
  const [garmentColor, setGarmentColor] = useState(
    preselectedColorHex
      ? COLOR_PALETTES.find((c) => c.hex === preselectedColorHex) || COLOR_PALETTES[0]
      : COLOR_PALETTES[0]
  );

  const [brandingTechnique, setBrandingTechnique] = useState<'embroidery' | 'screen_print'>('embroidery');
  const [activePlacement, setActivePlacement] = useState<'left_chest' | 'center_chest' | 'full_back' | 'sleeve'>('left_chest');
  const [selectedSampleLogo, setSelectedSampleLogo] = useState(SAMPLE_LOGOS[0]);
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState(100); // 60 to 140
  const [logoOffsetX, setLogoOffsetX] = useState(0); // -15 to 15
  const [logoOffsetY, setLogoOffsetY] = useState(0); // -15 to 15
  const [orderQuantity, setOrderQuantity] = useState(50);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [ticketInfo, setTicketInfo] = useState<{ ticketNumber: string; whatsappUrl: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync preselected product/color if changed from outside
  useEffect(() => {
    if (preselectedProduct) {
      const match = GARMENT_OPTIONS.find((g) => g.productId === preselectedProduct.id);
      if (match) setSelectedGarment(match);
    }
  }, [preselectedProduct]);

  useEffect(() => {
    if (preselectedColorHex) {
      const matchColor = COLOR_PALETTES.find((c) => c.hex === preselectedColorHex);
      if (matchColor) setGarmentColor(matchColor);
    }
  }, [preselectedColorHex]);

  // Lock body scroll when modal is open and handle ESC key
  useEffect(() => {
    if (!isOpen) {
      setAddedSuccess(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Discount calculations
  const getDiscount = (qty: number) => {
    if (qty >= 250) return 0.32;
    if (qty >= 100) return 0.25;
    if (qty >= 50) return 0.18;
    if (qty >= 25) return 0.10;
    return 0;
  };

  const discountRate = getDiscount(orderQuantity);
  const brandingFee = brandingTechnique === 'embroidery' ? 350 : 250;
  const unitCost = Math.round((selectedGarment.basePrice + brandingFee) * (1 - discountRate));
  const totalEstimate = Math.round(unitCost * orderQuantity);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomLogoUrl(url);
    }
  };

  const handleResetPosition = () => {
    setLogoScale(100);
    setLogoOffsetX(0);
    setLogoOffsetY(0);
  };

  const handleSendToCart = () => {
    const matchedProduct =
      (products || []).find((p) => p && p.id === selectedGarment.productId) || (products && products[0]);

    const targetProduct: UniformProduct = matchedProduct || {
      id: selectedGarment.productId || `custom-${Date.now()}`,
      sku: `SKU-CUST-${selectedGarment.id.toUpperCase()}`,
      name: selectedGarment.name,
      category: 'promotional',
      categoryLabel: 'Custom Apparel',
      tagline: 'Crafted via 3D Customizer Studio',
      basePrice: unitCost,
      minOrder: selectedGarment.minOrder,
      availableColors: [
        { name: garmentColor.name, hex: garmentColor.hex, bgClass: 'bg-slate-700' },
      ],
      sizes: ['S', 'M', 'L', 'XL', '2XL'],
      fabric: {
        composition: 'Premium Combed Cotton / Performance Poly',
        weight: '220 GSM',
        features: ['Pre-shrunk', 'Anti-pill', 'Colourfast'],
      },
      customizationOptions: {
        embroidery: true,
        screenPrinting: true,
        wovenPatch: true,
      },
      description: `Custom ${selectedGarment.name} created in 3D Live Mockup Studio.`,
      idealFor: ['Corporate Branding', 'Institutions', 'Teamwear'],
      image: selectedGarment.baseImage,
      published: true,
      stockOnHand: 100,
    };

    const newItem: QuoteItem = {
      id: `mockup-${Date.now()}`,
      product: targetProduct,
      selectedColor: garmentColor.name,
      quantities: {
        'Assorted Batch': orderQuantity,
      },
      totalQuantity: orderQuantity,
      brandingType: brandingTechnique === 'embroidery' ? 'embroidery' : 'screen_printing',
      logoPlacement: [
        activePlacement === 'left_chest'
          ? 'Left Chest'
          : activePlacement === 'center_chest'
          ? 'Center Chest'
          : activePlacement === 'full_back'
          ? 'Full Back'
          : 'Left Sleeve',
      ],
      logoNotes: `Live Mockup Studio Design (${brandingTechnique === 'embroidery' ? '3D High-Stitch Embroidery' : 'Screen Printed'} - ${activePlacement.replace('_', ' ')})`,
      unitPrice: unitCost,
      totalPrice: totalEstimate,
    };

    onAddToCart(newItem);

    // Instantly raise inquiry ticket on the ERP dashboard and WhatsApp
    const raised = raiseInquiryTicket({
      productName: `Custom ${selectedGarment.name}`,
      category: 'customizer_mockup',
      quantity: orderQuantity,
      selectedColor: garmentColor.name,
      brandingType: brandingTechnique === 'embroidery' ? 'embroidery' : 'screen_printing',
      logoPlacement: [
        activePlacement === 'left_chest'
          ? 'Left Chest'
          : activePlacement === 'center_chest'
          ? 'Center Front'
          : activePlacement === 'full_back'
          ? 'Full Back'
          : 'Left Sleeve',
      ],
      unitPrice: unitCost,
      estimatedTotalKsh: totalEstimate,
      notes: `Mockup Studio Design: ${selectedGarment.name} (${garmentColor.name}), Crest: ${customLogoUrl ? 'Custom File Uploaded' : selectedSampleLogo.name}.`,
      customerName: 'Mockup Studio Client',
      phone: '0728102929',
      source: 'interactive_customizer',
    });

    setTicketInfo({
      ticketNumber: raised.ticketNumber,
      whatsappUrl: raised.whatsappUrl,
    });
    setAddedSuccess(true);

    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#06163c', '#38BDF8', '#FFFFFF', '#F59E0B'],
      });
    } catch {
      // ignore
    }
  };

  // Compute CSS position of the logo on the SVG garment
  const getLogoPositionStyles = () => {
    let top = '32%';
    let left = '32%';
    let maxW = '64px';

    if (activePlacement === 'left_chest') {
      top = `${34 + logoOffsetY}%`;
      left = `${62 + logoOffsetX}%`;
      maxW = `${(logoScale / 100) * 58}px`;
    } else if (activePlacement === 'center_chest') {
      top = `${38 + logoOffsetY}%`;
      left = `${50 + logoOffsetX}%`;
      maxW = `${(logoScale / 100) * 110}px`;
    } else if (activePlacement === 'full_back') {
      top = `${36 + logoOffsetY}%`;
      left = `${50 + logoOffsetX}%`;
      maxW = `${(logoScale / 100) * 140}px`;
    } else if (activePlacement === 'sleeve') {
      top = `${36 + logoOffsetY}%`;
      left = `${22 + logoOffsetX}%`;
      maxW = `${(logoScale / 100) * 44}px`;
    }

    return {
      top,
      left,
      maxWidth: maxW,
      transform: 'translate(-50%, -50%)',
    };
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-0 sm:p-5 md:p-8 overflow-hidden sm:overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mockup-modal-title"
    >
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Card */}
      <div className="relative w-full h-full sm:h-auto max-w-6xl bg-white rounded-none sm:rounded-3xl shadow-2xl border-0 sm:border sm:border-slate-200 overflow-hidden z-10 flex flex-col sm:max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 bg-gradient-to-r from-[#020a1c] via-[#06163c] to-[#030e28] text-white border-b border-blue-900/60 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 pr-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/10 flex items-center justify-center text-blue-200 border border-white/10 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
            </div>
            <div className="min-w-0">
              <h2 id="mockup-modal-title" className="text-base sm:text-xl font-bold font-['Outfit',sans-serif] text-white flex items-center gap-2 truncate">
                <span>Live Uniform Mockup Studio</span>
              </h2>
              <p className="text-[11px] sm:text-xs text-blue-200 truncate">
                Test custom crests & instant bulk pricing in real-time
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-1.5 sm:p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors focus:outline-none cursor-pointer shrink-0"
            aria-label="Close Customizer"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          
          {addedSuccess && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-300 text-emerald-950 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-slate-900">
                      Success! Custom {selectedGarment.name} mockup ({orderQuantity} units) added to Quote Cart.
                    </span>
                    {ticketInfo && (
                      <span className="px-2 py-0.5 bg-emerald-200 text-emerald-900 text-[10px] font-black rounded-full uppercase">
                        Ticket #{ticketInfo.ticketNumber} Raised
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Ticket logged directly on ERP dashboard. You can continue directly on WhatsApp or review in cart.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {ticketInfo?.whatsappUrl && (
                  <a
                    href={ticketInfo.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-xs"
                  >
                    <span>WhatsApp (0728102929)</span>
                  </a>
                )}
                {onOpenQuoteModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenQuoteModal();
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-[#06163c] text-white text-xs font-bold hover:bg-[#021a34] transition-colors"
                  >
                    View Quote Cart
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setAddedSuccess(false)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-semibold hover:bg-emerald-200 transition-colors"
                >
                  Keep Designing
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* LEFT: Live Interactive Garment Stage */}
            <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-5 sm:p-6 border border-slate-200 flex flex-col justify-between space-y-4">
              
              {/* Stage Top Bar */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                  <span className="font-bold text-slate-800">
                    {selectedGarment.name} • {garmentColor.name}
                  </span>
                  {(() => {
                    const matchedProd = products.find((p) => p.id === selectedGarment.productId);
                    return matchedProd?.sku ? (
                      <span className="text-[10px] font-mono font-bold text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
                        {matchedProd.sku}
                      </span>
                    ) : null;
                  })()}
                </div>
                <span className="font-bold text-[#06163c] bg-blue-100/70 px-2.5 py-1 rounded-md text-[11px]">
                  {brandingTechnique === 'embroidery' ? '🧵 Industrial Embroidery' : '🖨️ Silkscreen / DTF'}
                </span>
              </div>

              {/* Garment Mockup Canvas */}
              <div className="relative w-full aspect-square max-h-[380px] mx-auto rounded-2xl flex items-center justify-center p-4 bg-white border border-[#D1E0FF] overflow-hidden shadow-[0_10px_28px_rgba(209,224,255,0.45)] select-none">
                
                {/* Dynamic SVG Garment Render */}
                <svg
                  viewBox="0 0 400 400"
                  className="w-full h-full max-h-[340px] drop-shadow-xl transition-all duration-300"
                >
                  <defs>
                    <filter id="garment-shadow" x="-10%" y="-10%" width="130%" height="130%">
                      <feDropShadow dx="0" dy="6" stdDeviation="5" floodOpacity="0.15" />
                    </filter>
                    <linearGradient id="fold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#000000" stopOpacity="0.12" />
                      <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0.12" />
                    </linearGradient>
                  </defs>

                  {/* Garment Silhouette Base */}
                  {selectedGarment.id === 'blazer' ? (
                    <g filter="url(#garment-shadow)">
                      <path
                        d="M 120 70 L 60 110 L 80 230 L 110 210 L 110 360 L 290 360 L 290 210 L 320 230 L 340 110 L 280 70 Z"
                        fill={garmentColor.hex}
                      />
                      <path d="M 140 70 L 200 240 L 150 160 L 120 70 Z" fill="#000000" fillOpacity="0.18" />
                      <path d="M 260 70 L 200 240 L 250 160 L 280 70 Z" fill="#000000" fillOpacity="0.18" />
                      <polygon points="165,70 235,70 200,160" fill="#FFFFFF" />
                      <polygon points="194,100 206,100 204,190 200,200 196,190" fill="#06163c" />
                      <rect x="235" y="160" width="38" height="6" rx="1" fill="#000000" fillOpacity="0.3" />
                      <circle cx="200" cy="275" r="4" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
                      <circle cx="200" cy="315" r="4" fill="#E2E8F0" stroke="#64748B" strokeWidth="1" />
                    </g>
                  ) : selectedGarment.id === 'sweater' ? (
                    <g filter="url(#garment-shadow)">
                      <path
                        d="M 130 65 L 55 120 L 75 260 L 110 240 L 115 365 L 285 365 L 290 240 L 325 260 L 345 120 L 270 65 Z"
                        fill={garmentColor.hex}
                      />
                      <polygon points="150,65 250,65 200,150" fill="#FFFFFF" />
                      <path d="M 148 65 L 200 152 L 252 65 L 242 65 L 200 138 L 158 65 Z" fill="#06163c" />
                      <rect x="115" y="348" width="170" height="17" fill="#000000" fillOpacity="0.15" />
                      <line x1="115" y1="348" x2="285" y2="348" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
                    </g>
                  ) : selectedGarment.id === 'chef' ? (
                    <g filter="url(#garment-shadow)">
                      <path
                        d="M 130 70 L 60 115 L 80 250 L 115 230 L 115 360 L 285 360 L 285 230 L 320 250 L 340 115 L 270 70 Z"
                        fill={garmentColor.hex}
                      />
                      <rect x="160" y="58" width="80" height="18" rx="4" fill={garmentColor.hex} stroke="#000000" strokeOpacity="0.2" />
                      {[130, 170, 210, 250, 290].map((y) => (
                        <g key={y}>
                          <circle cx="175" cy={y} r="4" fill="#06163c" />
                          <circle cx="215" cy={y} r="4" fill="#06163c" />
                        </g>
                      ))}
                    </g>
                  ) : selectedGarment.id === 'vest' ? (
                    <g filter="url(#garment-shadow)">
                      <path
                        d="M 140 70 L 90 95 L 95 190 L 115 190 L 115 360 L 285 360 L 285 190 L 305 190 L 310 95 L 260 70 Z"
                        fill={garmentColor.hex}
                      />
                      <rect x="115" y="210" width="170" height="16" fill="#E2E8F0" stroke="#CBD5E1" />
                      <rect x="115" y="290" width="170" height="16" fill="#E2E8F0" stroke="#CBD5E1" />
                      <rect x="145" y="90" width="16" height="120" fill="#E2E8F0" />
                      <rect x="239" y="90" width="16" height="120" fill="#E2E8F0" />
                    </g>
                  ) : (
                    /* Standard Polo / Tee / Hoodie / Scrub */
                    <g filter="url(#garment-shadow)">
                      <path
                        d="M 130 65 L 50 115 L 75 220 L 112 195 L 112 360 L 288 360 L 288 195 L 325 220 L 350 115 L 270 65 Z"
                        fill={garmentColor.hex}
                      />
                      <path
                        d="M 130 65 L 50 115 L 75 220 L 112 195 L 112 360 L 288 360 L 288 195 L 325 220 L 350 115 L 270 65 Z"
                        fill="url(#fold-grad)"
                      />
                      <polygon points="140,65 170,115 200,68" fill="#FFFFFF" fillOpacity="0.3" stroke="#000000" strokeOpacity="0.1" />
                      <polygon points="260,65 230,115 200,68" fill="#FFFFFF" fillOpacity="0.3" stroke="#000000" strokeOpacity="0.1" />
                      <rect x="192" y="68" width="16" height="60" fill="#000000" fillOpacity="0.08" />
                      <circle cx="200" cy="85" r="2.5" fill="#FFFFFF" />
                      <circle cx="200" cy="105" r="2.5" fill="#FFFFFF" />
                      <line x1="50" y1="115" x2="75" y2="220" stroke="#000000" strokeOpacity="0.1" strokeWidth="1" />
                      <line x1="350" y1="115" x2="325" y2="220" stroke="#000000" strokeOpacity="0.1" strokeWidth="1" />
                    </g>
                  )}
                </svg>

                {/* Placed Interactive Logo / Crest */}
                <div
                  style={getLogoPositionStyles()}
                  className={`absolute transition-all duration-150 pointer-events-none ${
                    brandingTechnique === 'embroidery'
                      ? 'filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
                      : 'filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]'
                  }`}
                >
                  {customLogoUrl ? (
                    <img
                      src={customLogoUrl}
                      alt="Custom Uploaded Crest"
                      className="w-full h-auto max-h-[120px] object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full aspect-square">
                      {selectedSampleLogo.svg}
                    </div>
                  )}

                  {brandingTechnique === 'embroidery' && (
                    <div
                      className="absolute inset-0 opacity-25 pointer-events-none rounded-full"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 3px)',
                      }}
                    />
                  )}
                </div>

                {/* Placement Guide Badge */}
                <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 text-white backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-semibold">
                  {activePlacement.replace('_', ' ').toUpperCase()} • {logoScale}%
                </div>
              </div>

              {/* Logo Fine-Tuning Controls */}
              <div className="bg-white p-3 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Move className="w-3.5 h-3.5 text-[#06163c]" />
                    <span>Logo Scale & Position:</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleResetPosition}
                    className="flex items-center gap-1 text-[11px] text-[#06163c] hover:underline font-semibold"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                      <span>Size Scale:</span>
                      <span className="font-bold text-slate-800">{logoScale}%</span>
                    </div>
                    <input
                      type="range"
                      min="60"
                      max="140"
                      value={logoScale}
                      onChange={(e) => setLogoScale(Number(e.target.value))}
                      className="w-full accent-[#06163c] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                      <span>Position Offset:</span>
                      <span className="font-bold text-slate-800">{logoOffsetX > 0 ? `+${logoOffsetX}` : logoOffsetX}</span>
                    </div>
                    <input
                      type="range"
                      min="-15"
                      max="15"
                      value={logoOffsetX}
                      onChange={(e) => setLogoOffsetX(Number(e.target.value))}
                      className="w-full accent-[#06163c] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT: Garment, Color, Technique & Live Pricing */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* 1. Garment Selector */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  1. Garment Style:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {GARMENT_OPTIONS.map((g) => {
                    const matchedProd = products.find((p) => p.id === g.productId);
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setSelectedGarment(g)}
                        className={`p-2 rounded-xl text-left border transition-all duration-150 hover:scale-[1.02] active:scale-95 cursor-pointer ${
                          selectedGarment.id === g.id
                            ? 'border-[#06163c] bg-blue-50/80 ring-2 ring-blue-500/10 text-[#06163c] font-bold shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="block text-xs font-bold leading-tight truncate">{g.name}</span>
                          {matchedProd?.sku && (
                            <span className="text-[8px] font-mono text-slate-400 font-bold shrink-0">
                              {matchedProd.sku.split('-').slice(-2).join('-')}
                            </span>
                          )}
                        </div>
                        <span className="block text-[10px] text-slate-400 mt-0.5">from Ksh {g.basePrice.toLocaleString()}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Fabric Color Palette */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. Fabric Color: <span className="text-[#06163c] font-extrabold">{garmentColor.name}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PALETTES.map((col) => (
                    <button
                      key={col.name}
                      type="button"
                      onClick={() => setGarmentColor(col)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer ${
                        garmentColor.name === col.name
                          ? 'border-[#06163c] ring-2 ring-blue-500/20 bg-blue-50 text-[#06163c] shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-inner border border-slate-200"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                      {garmentColor.name === col.name && <Check className="w-3 h-3 text-[#06163c]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Branding Method & Placement */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBrandingTechnique('embroidery')}
                    className={`p-2.5 rounded-xl text-left border transition-all duration-150 hover:scale-[1.02] active:scale-95 cursor-pointer ${
                      brandingTechnique === 'embroidery'
                        ? 'border-[#06163c] bg-blue-50/80 text-[#06163c] ring-2 ring-blue-500/10 shadow-xs'
                        : 'border-slate-200 text-slate-700 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="block text-xs font-bold">🧵 Embroidery (+Ksh 350)</span>
                    <span className="block text-[10px] text-slate-500">3D high-density stitch</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBrandingTechnique('screen_print')}
                    className={`p-2.5 rounded-xl text-left border transition-all duration-150 hover:scale-[1.02] active:scale-95 cursor-pointer ${
                      brandingTechnique === 'screen_print'
                        ? 'border-[#06163c] bg-blue-50/80 text-[#06163c] ring-2 ring-blue-500/10 shadow-xs'
                        : 'border-slate-200 text-slate-700 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="block text-xs font-bold">🖨️ Screen Print (+Ksh 250)</span>
                    <span className="block text-[10px] text-slate-500">Vivid durable inks</span>
                  </button>
                </div>

                {/* Placement buttons */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Position Placement:
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'left_chest', label: 'Left Chest' },
                      { id: 'center_chest', label: 'Center Front' },
                      { id: 'full_back', label: 'Full Back' },
                      { id: 'sleeve', label: 'Sleeve' },
                    ].map((pos) => (
                      <button
                        key={pos.id}
                        type="button"
                        onClick={() => setActivePlacement(pos.id as any)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center border transition-all ${
                          activePlacement === pos.id
                            ? 'bg-[#06163c] text-white border-[#06163c] shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Crest sample badge or upload */}
                <div className="pt-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    School Crest / Custom Logo:
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {SAMPLE_LOGOS.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => {
                          setSelectedSampleLogo(sample);
                          setCustomLogoUrl(null);
                        }}
                        className={`flex-shrink-0 w-10 h-10 p-1 rounded-xl border transition-all duration-150 hover:scale-110 active:scale-95 cursor-pointer ${
                          !customLogoUrl && selectedSampleLogo.id === sample.id
                            ? 'border-[#06163c] bg-blue-50 ring-2 ring-blue-500/20 shadow-xs'
                            : 'border-slate-200 bg-white hover:border-slate-400'
                        }`}
                        title={sample.name}
                      >
                        {sample.svg}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-shrink-0 flex items-center justify-center gap-1 w-24 h-10 rounded-xl border border-dashed border-[#06163c] bg-blue-50/50 hover:bg-blue-100 hover:scale-105 active:scale-95 text-[#06163c] text-[10px] font-bold px-2 transition-all duration-150 cursor-pointer"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Upload</span>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*,.svg"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Instant Bulk Pricing Engine & Action */}
              <div className="bg-gradient-to-br from-[#020a1c] via-[#06163c] to-[#030e28] text-white p-5 rounded-2xl shadow-2xl border border-blue-900/50 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
                      Tier Bulk Rate
                    </span>
                    <h3 className="text-lg font-bold font-['Outfit',sans-serif]">
                      {orderQuantity} Garments
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black font-['Outfit',sans-serif]">
                      Ksh {unitCost.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-blue-200 block">/ unit</span>
                  </div>
                </div>

                {/* Tier Quantity Selector */}
                <div className="grid grid-cols-5 gap-1">
                  {[15, 30, 50, 100, 250].map((qty) => (
                    <button
                      key={qty}
                      type="button"
                      onClick={() => setOrderQuantity(qty)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all duration-150 hover:scale-105 active:scale-95 cursor-pointer ${
                        orderQuantity === qty
                          ? 'bg-white text-[#06163c] shadow-md'
                          : 'bg-[#021a34] text-blue-100 hover:bg-[#03264c]'
                      }`}
                    >
                      {qty} pcs
                    </button>
                  ))}
                </div>

                <div className="bg-[#021a34]/70 p-2.5 rounded-xl text-xs flex justify-between items-center">
                  <span className="text-blue-200 text-[11px]">
                    Volume Savings: <span className="text-emerald-300 font-bold">{Math.round(discountRate * 100)}% off</span>
                  </span>
                  <span className="text-white font-bold text-sm">
                    Est. Total: Ksh {totalEstimate.toLocaleString()}
                  </span>
                </div>

                {/* Add to Quote Button */}
                <button
                  type="button"
                  onClick={handleSendToCart}
                  className="btn-shimmer-sweep group w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white text-[#06163c] font-black text-xs sm:text-sm hover:bg-blue-50 shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#06163c] group-hover:scale-115 group-hover:-rotate-12 transition-transform duration-200" />
                  <span>Add Design to Quote Cart (Ksh {totalEstimate.toLocaleString()})</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
