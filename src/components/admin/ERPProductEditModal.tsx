import React, { useState, useEffect } from 'react';
import { UniformProduct, UniformCategory } from '../../types';
import { useERP } from '../../context/ERPContext';
import { formatKsh } from '../../utils/currency';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Package,
  Layers,
  Tag,
  Check,
  Globe,
  Eye,
  Sliders,
  DollarSign,
  Palette,
  Scissors,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Building2,
} from 'lucide-react';

interface ERPProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: UniformProduct | null;
}

const CATEGORY_OPTIONS: { id: UniformCategory; label: string }[] = [
  { id: 'school', label: 'School Uniforms' },
  { id: 'healthcare', label: 'Healthcare & Scrubs' },
  { id: 'hospitality', label: 'Hospitality & Culinary' },
  { id: 'service', label: 'Corporate & Service Polos' },
  { id: 'workwear', label: 'Workwear & Industrial' },
  { id: 'knitwear', label: 'Custom Knitwear & Fleece' },
];

const PRESET_GARMENT_IMAGES = [
  {
    name: 'Academic Blazer',
    url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'School Polo Shirt',
    url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'V-Neck Knit Sweater',
    url: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Medical Scrubs Set',
    url: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Executive Chef Coat',
    url: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Industrial Hi-Vis Vest',
    url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Heavyweight Fleece Hoodie',
    url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Varsity Bomber Jacket',
    url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Corporate Oxford Shirt',
    url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800',
  },
  {
    name: 'Industrial Boiler Suit',
    url: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&q=80&w=800',
  },
];

const PRESET_COLORS = [
  { name: 'Royal Blue', hex: '#032345', bgClass: 'bg-[#032345]' },
  { name: 'Deep Navy', hex: '#0F172A', bgClass: 'bg-[#0F172A]' },
  { name: 'Crisp White', hex: '#F8FAFC', bgClass: 'bg-[#F8FAFC]' },
  { name: 'Heather Grey', hex: '#94A3B8', bgClass: 'bg-[#94A3B8]' },
  { name: 'Bottle Green', hex: '#14532D', bgClass: 'bg-[#14532D]' },
  { name: 'Maroon / Burgundy', hex: '#881337', bgClass: 'bg-[#881337]' },
  { name: 'Classic Black', hex: '#18181B', bgClass: 'bg-[#18181B]' },
  { name: 'Ceil Sky Blue', hex: '#38BDF8', bgClass: 'bg-[#38BDF8]' },
  { name: 'Teal Scrub Green', hex: '#0D9488', bgClass: 'bg-[#0D9488]' },
  { name: 'Safety Fluorescent Orange', hex: '#EA580C', bgClass: 'bg-[#EA580C]' },
  { name: 'Safety Fluorescent Yellow', hex: '#CA8A04', bgClass: 'bg-[#CA8A04]' },
];

export const ERPProductEditModal: React.FC<ERPProductEditModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { addProduct, updateProduct } = useERP();

  // Form State
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<UniformCategory>('school');
  const [categoryLabel, setCategoryLabel] = useState('School Uniforms');
  const [sku, setSku] = useState('');
  const [basePrice, setBasePrice] = useState<number>(3500);
  const [unitCost, setUnitCost] = useState<number>(2000);
  const [minOrder, setMinOrder] = useState<number>(25);
  const [stockOnHand, setStockOnHand] = useState<number>(100);
  const [stockReserved, setStockReserved] = useState<number>(15);
  const [location, setLocation] = useState('Warehouse Bay A, Rack 2');
  const [supplier, setSupplier] = useState('Nasisi Internal Tailoring Unit');
  const [published, setPublished] = useState<boolean>(true);
  const [badge, setBadge] = useState<string>('');
  const [popular, setPopular] = useState<boolean>(false);
  const [image, setImage] = useState<string>(PRESET_GARMENT_IMAGES[0].url);
  const [description, setDescription] = useState('');

  // Complex specs
  const [colors, setColors] = useState<{ name: string; hex: string; bgClass: string }[]>([
    { name: 'Royal Blue', hex: '#032345', bgClass: 'bg-[#032345]' },
    { name: 'Deep Navy', hex: '#0F172A', bgClass: 'bg-[#0F172A]' },
  ]);

  const [sizes, setSizes] = useState<string[]>([
    'Age 4-5',
    'Age 6-7',
    'Age 8-9',
    'Youth S',
    'Youth M',
    'Youth L',
    'Adult S',
    'Adult M',
    'Adult L',
    'Adult XL',
  ]);

  const [fabricComp, setFabricComp] = useState('65% Polyester, 35% Combed Viscose Suiting');
  const [fabricWeight, setFabricWeight] = useState('280 GSM');
  const [fabricFeatures, setFabricFeatures] = useState<string[]>([
    'Teflon stain-repellent finish',
    'High tensile double-stitch seams',
    'Crease-resistant shape retention',
  ]);

  const [customization, setCustomization] = useState({
    embroidery: true,
    screenPrinting: true,
    wovenPatch: true,
    reflectiveStripes: false,
    heatTransfer: true,
  });

  const [idealFor, setIdealFor] = useState<string[]>([
    'Junior & Senior School Students',
    'Cadet Corps & Prefects',
  ]);

  // Input helpers
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#032345');
  const [newSizeInput, setNewSizeInput] = useState('');
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [newIdealInput, setNewIdealInput] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'pricing'>('details');

  // Populate when editing or reset when creating
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setTagline(productToEdit.tagline);
      setCategory(productToEdit.category);
      setCategoryLabel(productToEdit.categoryLabel);
      setSku(
        productToEdit.sku ||
          `SKU-GAR-${productToEdit.category.substring(0, 3).toUpperCase()}-${Math.floor(
            100 + Math.random() * 900
          )}`
      );
      setBasePrice(productToEdit.basePrice);
      setUnitCost(productToEdit.unitCost || Math.round(productToEdit.basePrice * 0.58));
      setMinOrder(productToEdit.minOrder);
      setStockOnHand(productToEdit.stockOnHand ?? 75);
      setStockReserved(productToEdit.stockReserved ?? 10);
      setLocation(productToEdit.location || 'Warehouse Bay A');
      setSupplier(productToEdit.supplier || 'Nasisi Internal Tailoring Unit');
      setPublished(productToEdit.published !== false);
      setBadge(productToEdit.badge || '');
      setPopular(!!productToEdit.popular);
      setImage(productToEdit.image);
      setDescription(productToEdit.description);
      setColors(productToEdit.availableColors || []);
      setSizes(productToEdit.sizes || []);
      setFabricComp(productToEdit.fabric?.composition || '');
      setFabricWeight(productToEdit.fabric?.weight || '240 GSM');
      setFabricFeatures(productToEdit.fabric?.features || []);
      setCustomization({
        embroidery: !!productToEdit.customizationOptions?.embroidery,
        screenPrinting: !!productToEdit.customizationOptions?.screenPrinting,
        wovenPatch: !!productToEdit.customizationOptions?.wovenPatch,
        reflectiveStripes: !!productToEdit.customizationOptions?.reflectiveStripes,
        heatTransfer: !!productToEdit.customizationOptions?.heatTransfer,
      });
      setIdealFor(productToEdit.idealFor || []);
    } else {
      // Defaults for brand new product
      setName('');
      setTagline('');
      setCategory('school');
      setCategoryLabel('School Uniforms');
      setSku(`SKU-GAR-SCH-${Math.floor(100 + Math.random() * 900)}`);
      setBasePrice(3200);
      setUnitCost(1850);
      setMinOrder(25);
      setStockOnHand(120);
      setStockReserved(10);
      setLocation('Warehouse Rack A-1');
      setSupplier('Nasisi Internal Tailoring Unit');
      setPublished(true);
      setBadge('New Item');
      setPopular(false);
      setImage(PRESET_GARMENT_IMAGES[0].url);
      setDescription(
        'Precision engineered uniform garment manufactured in Kenya with reinforced stress points, anti-shrink dyes, and commercial laundering endurance.'
      );
      setColors([
        { name: 'Royal Blue', hex: '#032345', bgClass: 'bg-[#032345]' },
        { name: 'Deep Navy', hex: '#0F172A', bgClass: 'bg-[#0F172A]' },
      ]);
      setSizes(['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L']);
      setFabricComp('65% Polyester, 35% Viscose');
      setFabricWeight('260 GSM');
      setFabricFeatures([
        'Anti-pill surface finish',
        'Double-stitched seams with bonded poly thread',
        'Colorfast under UV & hot wash cycles',
      ]);
      setCustomization({
        embroidery: true,
        screenPrinting: true,
        wovenPatch: true,
        reflectiveStripes: false,
        heatTransfer: true,
      });
      setIdealFor(['Academic Uniforms', 'School & College Students']);
    }
  }, [productToEdit, isOpen]);

  // Sync category label when category changes
  const handleCategoryChange = (newCat: UniformCategory) => {
    setCategory(newCat);
    const match = CATEGORY_OPTIONS.find((c) => c.id === newCat);
    if (match) setCategoryLabel(match.label);
    if (!productToEdit) {
      setSku(`SKU-GAR-${newCat.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`);
    }
  };

  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setColors((prev) => [
      ...prev,
      { name: newColorName.trim(), hex: newColorHex, bgClass: `bg-[${newColorHex}]` },
    ]);
    setNewColorName('');
  };

  const handleRemoveColor = (idx: number) => {
    setColors((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddSize = () => {
    if (!newSizeInput.trim() || sizes.includes(newSizeInput.trim())) return;
    setSizes((prev) => [...prev, newSizeInput.trim()]);
    setNewSizeInput('');
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setSizes((prev) => prev.filter((s) => s !== sizeToRemove));
  };

  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    setFabricFeatures((prev) => [...prev, newFeatureInput.trim()]);
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFabricFeatures((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleAddIdeal = () => {
    if (!newIdealInput.trim()) return;
    setIdealFor((prev) => [...prev, newIdealInput.trim()]);
    setNewIdealInput('');
  };

  const handleRemoveIdeal = (idx: number) => {
    setIdealFor((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a product name');
      return;
    }

    const payload: UniformProduct = {
      id: productToEdit?.id || `prod-${Date.now()}`,
      name: name.trim(),
      tagline: tagline.trim() || 'Premium Kenyan Manufactured Garment',
      category,
      categoryLabel,
      basePrice: Number(basePrice) || 0,
      minOrder: Number(minOrder) || 1,
      availableColors: colors.length > 0 ? colors : [{ name: 'Navy', hex: '#0F172A', bgClass: 'bg-[#0F172A]' }],
      sizes: sizes.length > 0 ? sizes : ['Standard'],
      fabric: {
        composition: fabricComp || '100% Kenyan Manufactured Poly-Blend',
        weight: fabricWeight || '240 GSM',
        features: fabricFeatures,
      },
      customizationOptions: customization,
      description: description.trim() || `${name} manufactured with industrial-grade stitching.`,
      idealFor,
      image: image || PRESET_GARMENT_IMAGES[0].url,
      badge: badge.trim() || undefined,
      popular: !!popular,
      published: published !== false,
      sku: sku.trim() || `SKU-GAR-${category.toUpperCase()}-101`,
      stockOnHand: Number(stockOnHand) || 0,
      stockReserved: Number(stockReserved) || 0,
      unitCost: Number(unitCost) || 0,
      location: location.trim() || 'Warehouse Main Bay',
      supplier: supplier.trim() || 'Nasisi Internal Tailoring Unit',
    };

    if (productToEdit) {
      updateProduct(productToEdit.id, payload);
    } else {
      addProduct(payload);
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 bg-[#032345] text-white flex items-center justify-between border-b border-blue-950">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center">
                <Package className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h2 className="text-lg font-black font-['Outfit'] tracking-wide">
                  {productToEdit ? `Edit Catalog Garment: ${productToEdit.name}` : 'Create New Platform Garment SKU'}
                </h2>
                <p className="text-xs text-blue-200">
                  Instant real-time sync with storefront catalog, live price engine, and factory inventory.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-3">
            {[
              { id: 'details', label: '1. Basic Info & Images', icon: Tag },
              { id: 'pricing', label: '2. Pricing & Inventory SKU', icon: DollarSign },
              { id: 'specs', label: '3. Sizes, Colors & Fabric Specs', icon: Scissors },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 ${
                    activeTab === tab.id
                      ? 'bg-white text-[#032345] border-[#032345] shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 border-transparent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Body */}
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* TAB 1: DETAILS */}
            {activeTab === 'details' && (
              <div className="space-y-5">
                {/* Publishing Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3.5 h-3.5 rounded-full ${published ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">
                        Storefront Live Visibility: {published ? 'Published & Active' : 'Draft / Hidden'}
                      </span>
                      <span className="text-[11px] text-slate-600">
                        {published
                          ? 'This garment is visible in the public catalog, 3D customizer, and customer quote estimator.'
                          : 'Hidden from public storefront. Visible only to factory administrators in ERP.'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setPublished(!published)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      published
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                    }`}
                  >
                    {published ? '✓ Published (Click to Draft)' : 'Draft (Click to Publish)'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Garment Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tailored Academic Blazer"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Tagline / Subtitle
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Precision structured suiting with crest embroidery"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Platform Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => handleCategoryChange(e.target.value as UniformCategory)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold text-slate-800"
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Ribbon Badge (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Best Seller, Anti-Microbial, New"
                      value={badge}
                      onChange={(e) => setBadge(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Featured / Popular Item
                    </label>
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="checkbox"
                        id="popularCheckbox"
                        checked={popular}
                        onChange={(e) => setPopular(e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor="popularCheckbox" className="text-xs text-slate-700 font-medium cursor-pointer">
                        Pin to Featured Showcase
                      </label>
                    </div>
                  </div>
                </div>

                {/* Garment Image Presets & Custom URL */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Garment Product Image
                  </label>

                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-slate-300 shadow-inner flex-shrink-0 bg-slate-100 relative group">
                      <img
                        src={image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = PRESET_GARMENT_IMAGES[0].url;
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                        Preview
                      </div>
                    </div>

                    <div className="flex-1 space-y-2 w-full">
                      <input
                        type="url"
                        placeholder="Paste image URL (Unsplash, Cloud CDN, or Direct Image Link)..."
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />

                      <span className="text-[11px] text-slate-500 block font-semibold">
                        Or select from curated factory presets:
                      </span>
                      <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                        {PRESET_GARMENT_IMAGES.map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setImage(preset.url)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                              image === preset.url
                                ? 'bg-[#032345] text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Garment Description & Manufacturing Specs
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide a detailed description of the garment cut, tailoring construction, durability, and use cases..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: PRICING & INVENTORY */}
            {activeTab === 'pricing' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start gap-3">
                  <Package className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-950">
                    <span className="font-bold block">Synchronized SKU & ERP Factory Parameters</span>
                    Pricing and stock counts entered here immediately sync with factory inventory valuation, quotation generators, and live M-Pesa billing.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Garment SKU *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BLZ-NAV-YM"
                      value={sku}
                      onChange={(e) => setSku(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Selling Price (Ksh) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Production Cost Basis (Ksh)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={unitCost}
                      onChange={(e) => setUnitCost(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono font-medium text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Min Order Quantity (MOQ)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={minOrder}
                      onChange={(e) => setMinOrder(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Stock on Hand (Units)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={stockOnHand}
                      onChange={(e) => setStockOnHand(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono font-bold text-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Stock Reserved (In Production)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={stockReserved}
                      onChange={(e) => setStockReserved(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-blue-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Warehouse Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Warehouse Shelf A3"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Internal Unit / Supplier
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Nasisi Tailoring Unit"
                      value={supplier}
                      onChange={(e) => setSupplier(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Profit Margin Preview Card */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                      Estimated Gross Unit Margin
                    </span>
                    <span className="text-xl font-black text-emerald-400 font-mono">
                      {formatKsh(Math.max(0, basePrice - unitCost))} (
                      {basePrice > 0 ? Math.round(((basePrice - unitCost) / basePrice) * 100) : 0}%)
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                      Total Warehouse Stock Asset Value
                    </span>
                    <span className="text-lg font-black text-sky-300 font-mono">
                      {formatKsh(stockOnHand * basePrice)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SIZES, COLORS & FABRIC SPECS */}
            {activeTab === 'specs' && (
              <div className="space-y-6">
                {/* Available Color Variants */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Color Swatches & Options
                    </label>
                    <span className="text-[11px] text-slate-500">{colors.length} colors configured</span>
                  </div>

                  {/* Active Colors Chips */}
                  <div className="flex flex-wrap gap-2">
                    {colors.map((col, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 pl-2 pr-1.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-2xs"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(idx)}
                          className="p-1 hover:text-red-600 rounded-md transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Color Form */}
                  <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                    />
                    <input
                      type="text"
                      placeholder="Color name (e.g. Burgundy Red)"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none flex-1 min-w-[150px]"
                    />
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className="px-3 py-1.5 bg-[#032345] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs"
                    >
                      + Add Color
                    </button>

                    {/* Quick Presets */}
                    <div className="w-full flex flex-wrap gap-1 pt-1.5 border-t border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase mr-1">Presets:</span>
                      {PRESET_COLORS.map((pc, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (!colors.some((c) => c.name === pc.name)) {
                              setColors((prev) => [...prev, pc]);
                            }
                          }}
                          className="px-2 py-0.5 text-[10px] rounded bg-white border border-slate-200 hover:bg-blue-50 text-slate-600 flex items-center gap-1"
                        >
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pc.hex }} />
                          {pc.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Available Sizes */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700 uppercase">
                      Available Size Matrix
                    </label>
                    <span className="text-[11px] text-slate-500">{sizes.length} sizes configured</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {sizes.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold flex items-center gap-1.5"
                      >
                        {s}
                        <button
                          type="button"
                          onClick={() => handleRemoveSize(s)}
                          className="hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add custom size (e.g. Size 38R, Age 10-11, 3XL)"
                      value={newSizeInput}
                      onChange={(e) => setNewSizeInput(e.target.value)}
                      className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none flex-1 max-w-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddSize}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs"
                    >
                      + Add Size
                    </button>
                  </div>
                </div>

                {/* Fabric Specifications */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Fabric Composition
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 65% Polyester, 35% Viscose"
                      value={fabricComp}
                      onChange={(e) => setFabricComp(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Fabric GSM / Weight
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 280 GSM"
                      value={fabricWeight}
                      onChange={(e) => setFabricWeight(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                    />
                  </div>
                </div>

                {/* Fabric Features List */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Fabric & Garment Features
                  </label>
                  <div className="space-y-1.5">
                    {fabricFeatures.map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800"
                      >
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{feat}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="text-slate-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add feature (e.g. Anti-shrink, Teflon stain shield)..."
                      value={newFeatureInput}
                      onChange={(e) => setNewFeatureInput(e.target.value)}
                      className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Customization Options Checkboxes */}
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <label className="block text-xs font-bold text-slate-700 uppercase">
                    Supported Branding & Customization Techniques
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { key: 'embroidery', label: 'Tajima Direct Embroidery' },
                      { key: 'screenPrinting', label: 'Screen Printing' },
                      { key: 'wovenPatch', label: 'Woven Crest Patches' },
                      { key: 'reflectiveStripes', label: '3M Reflective Striping' },
                      { key: 'heatTransfer', label: 'Vinyl Heat Transfer' },
                    ].map((opt) => (
                      <label
                        key={opt.key}
                        className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium cursor-pointer transition-all ${
                          (customization as any)[opt.key]
                            ? 'bg-blue-50 border-blue-300 text-blue-950 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={!!(customization as any)[opt.key]}
                          onChange={(e) =>
                            setCustomization((prev) => ({
                              ...prev,
                              [opt.key]: e.target.checked,
                            }))
                          }
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                        />
                        <span>{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Modal Actions Footer */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500">
                Changes take effect instantly in storefront, inventory manager, and documents.
              </span>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#032345] hover:bg-blue-900 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{productToEdit ? 'Update Garment & Sync Inventory' : 'Publish New SKU & Save'}</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
