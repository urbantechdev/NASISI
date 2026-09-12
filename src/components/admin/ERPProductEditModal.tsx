import React, { useState, useEffect, useRef } from 'react';
import { UniformProduct, UniformCategory } from '../../types';
import { useERP } from '../../context/ERPContext';
import { formatKsh } from '../../utils/currency';
import { motion, AnimatePresence } from 'motion/react';
import academicSchoolBlazerImg from '../../assets/images/academic_school_blazer_1787666599640.jpg';
import schoolKnitSweaterImg from '../../assets/images/school_knit_sweater_1787666624927.jpg';
import schoolPiquePoloImg from '../../assets/images/school_pique_polo_1787666646059.jpg';
import schoolTracksuitJacketImg from '../../assets/images/school_tracksuit_jacket_1787666665335.jpg';
import medicalScrubSetImg from '../../assets/images/medical_scrub_set_1787666693362.jpg';
import chefJacketExecutiveImg from '../../assets/images/chef_jacket_executive_1787666710074.jpg';
import canvasBaristaApronImg from '../../assets/images/canvas_barista_apron_1787666742156.jpg';
import corporateServicePoloImg from '../../assets/images/corporate_service_polo_1787666794018.jpg';
import highVisSafetyVestImg from '../../assets/images/high_vis_safety_vest_1787666856898.jpg';
import industrialWorkwearOverallImg from '../../assets/images/industrial_workwear_overall_1787666910504.jpg';
import varsityLettermanJacketImg from '../../assets/images/varsity_letterman_jacket_1787666981298.jpg';
import fleecePulloverHoodieImg from '../../assets/images/fleece_pullover_hoodie_1787666996711.jpg';
import schoolBlazerAlternativeImg from '../../assets/images/school_blazer_1787463441853.jpg';
import medicalScrubsAlternativeImg from '../../assets/images/medical_scrubs_1787463454201.jpg';
import varsityJacketAlternativeImg from '../../assets/images/varsity_jacket_1787463467084.jpg';
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
  Upload,
  UploadCloud,
  FileImage,
  Link as LinkIcon,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface ERPProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: UniformProduct | null;
}

const CATEGORY_OPTIONS: { id: UniformCategory; label: string }[] = [
  { id: 'safety_industrial', label: '1. Safety & Industrial Wear' },
  { id: 'corporate', label: '2. Corporate Wear' },
  { id: 'school', label: '3. School & Institutional Uniforms' },
  { id: 'security', label: '4. Security & Staff Uniforms' },
  { id: 'healthcare', label: '5. Medical & Healthcare Wear' },
  { id: 'hospitality', label: '6. Hospitality & Restaurant Wear' },
  { id: 'promotional', label: '7. Promotional & Branding Wear' },
  { id: 'sportswear', label: '8. Sportswear' },
  { id: 'specialized_workwear', label: '9. Specialized Work-wear' },
  // Legacy categories
  { id: 'service', label: 'Service & Corporate (Legacy)' },
  { id: 'workwear', label: 'Workwear & Industrial (Legacy)' },
  { id: 'knitwear', label: 'Custom Knitwear & Fleece (Legacy)' },
];

const PRESET_GARMENT_IMAGES = [
  {
    name: 'High-Vis Safety Vest / Jacket',
    url: highVisSafetyVestImg,
  },
  {
    name: 'Heavy-Duty Workwear Boiler Suit',
    url: industrialWorkwearOverallImg,
  },
  {
    name: 'Tailored Academic Blazer',
    url: academicSchoolBlazerImg,
  },
  {
    name: 'School Knit Sweater',
    url: schoolKnitSweaterImg,
  },
  {
    name: 'Corporate Performance Polo',
    url: corporateServicePoloImg,
  },
  {
    name: 'Pro-Flex Medical Scrubs Set',
    url: medicalScrubSetImg,
  },
  {
    name: 'Executive Master Chef Jacket',
    url: chefJacketExecutiveImg,
  },
  {
    name: 'Bistro Canvas Barista Apron',
    url: canvasBaristaApronImg,
  },
  {
    name: 'School Sports Tracksuit',
    url: schoolTracksuitJacketImg,
  },
  {
    name: 'School Pique Polo',
    url: schoolPiquePoloImg,
  },
  {
    name: 'Custom Varsity Letterman Jacket',
    url: varsityLettermanJacketImg,
  },
  {
    name: 'Heritage Fleece Pullover Hoodie',
    url: fleecePulloverHoodieImg,
  },
  {
    name: 'Tactical Security Uniform',
    url: highVisSafetyVestImg,
  },
  {
    name: 'Doctor Medical Lab Coat',
    url: medicalScrubsAlternativeImg,
  },
  {
    name: 'Sublimated Football Team Jersey',
    url: varsityJacketAlternativeImg,
  },
  {
    name: 'Promotional Round-Neck T-Shirt',
    url: corporateServicePoloImg,
  },
];

const PRESET_COLORS = [
  { name: 'Royal Blue', hex: '#06163c', bgClass: 'bg-[#06163c]' },
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
  const [images, setImages] = useState<string[]>([PRESET_GARMENT_IMAGES[0].url]);
  const [activePreviewIdx, setActivePreviewIdx] = useState<number>(0);
  const [customUrlInput, setCustomUrlInput] = useState<string>('');
  const [imageSourceMode, setImageSourceMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [isImageDragging, setIsImageDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState('');

  // Complex specs
  const [colors, setColors] = useState<{ name: string; hex: string; bgClass: string }[]>([
    { name: 'Royal Blue', hex: '#06163c', bgClass: 'bg-[#06163c]' },
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
  const [newColorHex, setNewColorHex] = useState('#06163c');
  const [newSizeInput, setNewSizeInput] = useState('');
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [newIdealInput, setNewIdealInput] = useState('');
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'pricing'>('details');

  // Populate when editing or reset when creating
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || '');
      setTagline(productToEdit.tagline || '');
      setCategory(productToEdit.category || 'school');
      setCategoryLabel(productToEdit.categoryLabel || 'School Uniforms');
      setSku(
        productToEdit.sku ||
          `SKU-GAR-${(productToEdit.category || 'SCH').substring(0, 3).toUpperCase()}-${Math.floor(
            100 + Math.random() * 900
          )}`
      );
      setBasePrice(productToEdit.basePrice || 0);
      setUnitCost(productToEdit.unitCost || Math.round((productToEdit.basePrice || 0) * 0.58));
      setMinOrder(productToEdit.minOrder || 10);
      setStockOnHand(productToEdit.stockOnHand ?? 75);
      setStockReserved(productToEdit.stockReserved ?? 10);
      setLocation(productToEdit.location || 'Warehouse Bay A');
      setSupplier(productToEdit.supplier || 'Nasisi Internal Tailoring Unit');
      setPublished(productToEdit.published !== false);
      setBadge(productToEdit.badge || '');
      setPopular(!!productToEdit.popular);
      const initialImgs =
        productToEdit.images && productToEdit.images.length > 0
          ? productToEdit.images
          : productToEdit.image
          ? [productToEdit.image]
          : [PRESET_GARMENT_IMAGES[0].url];
      setImages(initialImgs);
      setImage(initialImgs[0]);
      setActivePreviewIdx(0);
      setDescription(productToEdit.description || '');
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
      setCategoryLabel('3. School & Institutional Uniforms');
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
      setImages([PRESET_GARMENT_IMAGES[0].url]);
      setImage(PRESET_GARMENT_IMAGES[0].url);
      setActivePreviewIdx(0);
      setDescription(
        'Precision engineered uniform garment manufactured in Kenya with reinforced stress points, anti-shrink dyes, and commercial laundering endurance.'
      );
      setColors([
        { name: 'Royal Blue', hex: '#06163c', bgClass: 'bg-[#06163c]' },
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

  // Multi-image handlers
  const handleAddImage = (url: string) => {
    if (!url || !url.trim()) return;
    const cleanUrl = url.trim();
    setImages((prev) => {
      if (prev.includes(cleanUrl)) return prev;
      const next = [...prev, cleanUrl];
      return next;
    });
    setCustomUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      if (prev.length <= 1) {
        alert('Each product must have at least 1 image. Please add another image before removing this one.');
        return prev;
      }
      const next = prev.filter((_, i) => i !== index);
      if (activePreviewIdx >= next.length) {
        setActivePreviewIdx(Math.max(0, next.length - 1));
      }
      setImage(next[0]);
      return next;
    });
  };

  const handleSetPrimary = (index: number) => {
    setImages((prev) => {
      if (index === 0 || index >= prev.length) return prev;
      const target = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      const next = [target, ...rest];
      setImage(target);
      setActivePreviewIdx(0);
      return next;
    });
  };

  const handleMultipleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 10MB limit.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setImages((prev) => {
            if (prev.includes(dataUrl)) return prev;
            return [...prev, dataUrl];
          });
        }
      };
      reader.readAsDataURL(file);
    });
    setUploadedFileName(`${files.length} file(s) added to gallery`);
  };

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

    const finalImages = images.length > 0 ? images : [PRESET_GARMENT_IMAGES[0].url];
    const primaryImage = finalImages[0] || PRESET_GARMENT_IMAGES[0].url;

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
      customizationOptions: {
        ...customization,
        customStitching: true,
      },
      description: description.trim() || `${name} manufactured with industrial-grade stitching.`,
      idealFor,
      image: primaryImage,
      images: finalImages,
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-800"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 bg-[#06163c] text-white flex items-center justify-between border-b border-blue-950">
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
                      ? 'bg-white text-[#06163c] border-[#06163c] shadow-xs'
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

                {/* Multi-Image Studio: Multi-File Upload, Custom URLs, and Curated Presets */}
                <div className="space-y-3 pt-2 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Garment Multi-Image Gallery
                        </label>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#06163c] text-white">
                          {images.length} {images.length === 1 ? 'Image' : 'Images'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Add multiple angles (front, back, fabric close-up, on-model). Image #1 is the main storefront cover.
                      </p>
                    </div>

                    <div className="inline-flex p-0.5 bg-slate-200/80 rounded-xl text-[11px] font-semibold self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setImageSourceMode('upload')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                          imageSourceMode === 'upload'
                            ? 'bg-white text-[#06163c] shadow-xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Files</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageSourceMode('url')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                          imageSourceMode === 'url'
                            ? 'bg-white text-[#06163c] shadow-xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>Add URL</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageSourceMode('presets')}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                          imageSourceMode === 'presets'
                            ? 'bg-white text-[#06163c] shadow-xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <FileImage className="w-3.5 h-3.5" />
                        <span>Factory Presets</span>
                      </button>
                    </div>
                  </div>

                  {/* Active Preview Showcase & Thumbnail Strip */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Active Selected Image Preview */}
                    <div className="md:col-span-5 relative bg-slate-900 rounded-2xl overflow-hidden aspect-4/3 flex items-center justify-center border-2 border-slate-200 shadow-inner group">
                      <img
                        src={images[activePreviewIdx] || images[0] || PRESET_GARMENT_IMAGES[0].url}
                        alt={`Garment angle ${activePreviewIdx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = PRESET_GARMENT_IMAGES[0].url;
                        }}
                      />

                      {/* Cover Badge or Make Cover Action */}
                      <div className="absolute top-2.5 left-2.5 z-10">
                        {activePreviewIdx === 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-600 text-white shadow-md">
                            <Star className="w-3 h-3 fill-white" />
                            Primary Storefront Cover
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSetPrimary(activePreviewIdx)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white/95 text-[#06163c] hover:bg-[#06163c] hover:text-white shadow-md transition-all cursor-pointer"
                          >
                            <Star className="w-3 h-3 text-amber-500" />
                            Make Primary Cover
                          </button>
                        )}
                      </div>

                      {/* Counter & Controls */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] font-bold z-10 pointer-events-none">
                        <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm pointer-events-auto">
                          Photo {activePreviewIdx + 1} of {images.length}
                        </span>

                        <div className="flex items-center gap-1 pointer-events-auto">
                          {images.length > 1 && (
                            <>
                              <button
                                type="button"
                                onClick={() =>
                                  setActivePreviewIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))
                                }
                                className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm cursor-pointer"
                                title="Previous photo"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setActivePreviewIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))
                                }
                                className="p-1.5 rounded-lg bg-black/60 hover:bg-black/90 text-white backdrop-blur-sm cursor-pointer"
                                title="Next photo"
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(activePreviewIdx)}
                                className="p-1.5 rounded-lg bg-red-600/80 hover:bg-red-700 text-white backdrop-blur-sm ml-1 cursor-pointer"
                                title="Delete this angle"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right column: Thumbnails strip + Input Source */}
                    <div className="md:col-span-7 space-y-3">
                      {/* Thumbnails grid */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-slate-700 uppercase">
                            Attached Angles ({images.length})
                          </span>
                          <span className="text-[10px] text-slate-500">
                            Click any to preview or delete
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-1 bg-white rounded-xl border border-slate-200">
                          {images.map((imgUrl, idx) => {
                            const isCurrent = activePreviewIdx === idx;
                            const isCover = idx === 0;
                            return (
                              <div
                                key={idx}
                                className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 cursor-pointer transition-all group shrink-0 ${
                                  isCurrent
                                    ? 'border-[#06163c] ring-2 ring-blue-400/40 shadow-md'
                                    : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                                }`}
                                onClick={() => setActivePreviewIdx(idx)}
                              >
                                <img
                                  src={imgUrl}
                                  alt={`Thumb ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = PRESET_GARMENT_IMAGES[0].url;
                                  }}
                                />
                                {isCover && (
                                  <span className="absolute top-1 left-1 px-1 py-0.5 rounded text-[8px] font-extrabold bg-emerald-600 text-white shadow-xs">
                                    Cover
                                  </span>
                                )}
                                {images.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveImage(idx);
                                    }}
                                    className="absolute top-1 right-1 p-1 rounded-md bg-black/70 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Remove this image"
                                  >
                                    <X className="w-2.5 h-2.5" />
                                  </button>
                                )}
                                <span className="absolute bottom-1 right-1 px-1 rounded text-[8px] font-bold bg-black/60 text-white">
                                  #{idx + 1}
                                </span>
                              </div>
                            );
                          })}

                          {/* Quick add trigger button */}
                          <button
                            type="button"
                            onClick={() => {
                              if (imageSourceMode === 'upload') {
                                fileInputRef.current?.click();
                              } else {
                                setImageSourceMode('upload');
                                setTimeout(() => fileInputRef.current?.click(), 50);
                              }
                            }}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-[#06163c] bg-slate-50 hover:bg-blue-50/50 flex flex-col items-center justify-center text-slate-500 hover:text-[#06163c] transition-colors shrink-0"
                            title="Add another photo"
                          >
                            <Plus className="w-5 h-5 mb-0.5" />
                            <span className="text-[9px] font-bold">+ Angle</span>
                          </button>
                        </div>
                      </div>

                      {/* Source Mode 1: Multi-file Upload */}
                      {imageSourceMode === 'upload' && (
                        <div className="space-y-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif"
                            className="hidden"
                            onChange={(e) => {
                              handleMultipleFiles(e.target.files);
                            }}
                          />

                          <div
                            onDragOver={(e) => {
                              e.preventDefault();
                              setIsImageDragging(true);
                            }}
                            onDragLeave={() => setIsImageDragging(false)}
                            onDrop={(e) => {
                              e.preventDefault();
                              setIsImageDragging(false);
                              handleMultipleFiles(e.dataTransfer.files);
                            }}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-xl p-3.5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1 ${
                              isImageDragging
                                ? 'border-[#06163c] bg-blue-100/50 scale-[1.01]'
                                : 'border-slate-300 hover:border-[#06163c] bg-white hover:bg-blue-50/30'
                            }`}
                          >
                            <div className="p-1.5 bg-blue-50 rounded-full text-[#06163c]">
                              <UploadCloud className="w-4 h-4 text-[#06163c]" />
                            </div>
                            <div className="text-xs">
                              <span className="font-bold text-[#06163c]">Upload Multiple Garment Images</span> or drag & drop here
                            </div>
                            <p className="text-[10px] text-slate-500">
                              You can select multiple photos at once (Front, Back, Close-up, Tag). PNG, JPG, WebP up to 10MB each.
                            </p>
                          </div>

                          {uploadedFileName && (
                            <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs">
                              <div className="flex items-center gap-2 truncate">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="font-semibold truncate">{uploadedFileName}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setUploadedFileName('')}
                                className="text-slate-400 hover:text-slate-600 font-bold ml-2"
                              >
                                Dismiss
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Source Mode 2: Direct Image URL */}
                      {imageSourceMode === 'url' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <input
                              type="url"
                              placeholder="Paste high-res image URL (e.g. https://example.com/garment.jpg)"
                              value={customUrlInput}
                              onChange={(e) => setCustomUrlInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddImage(customUrlInput);
                                }
                              }}
                              className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddImage(customUrlInput)}
                              disabled={!customUrlInput.trim()}
                              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#06163c] text-white hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Angle</span>
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-500">
                            Enter any image URL to add an additional viewpoint to this product.
                          </p>
                        </div>
                      )}

                      {/* Source Mode 3: Factory Curated Presets */}
                      {imageSourceMode === 'presets' && (
                        <div className="space-y-2">
                          <span className="text-[11px] text-slate-700 block font-bold">
                            Click to add factory product photography into your gallery:
                          </span>
                          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                            {PRESET_GARMENT_IMAGES.map((preset, idx) => {
                              const alreadyAdded = images.includes(preset.url);
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => handleAddImage(preset.url)}
                                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center gap-1.5 ${
                                    alreadyAdded
                                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold'
                                      : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                                  }`}
                                >
                                  {alreadyAdded ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Plus className="w-3 h-3 text-slate-400" />
                                  )}
                                  <span>{preset.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
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
                      className="px-3 py-1.5 bg-[#06163c] hover:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs"
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
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#06163c] hover:bg-blue-900 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
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
