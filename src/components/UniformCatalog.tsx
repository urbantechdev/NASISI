import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useERP } from '../context/ERPContext';
import { UniformProduct, UniformCategory } from '../types';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  Shirt,
  ChevronRight,
  Check,
  Eye,
  Tag,
  LayoutGrid,
  GraduationCap,
  Stethoscope,
  ChefHat,
  Briefcase,
  HardHat,
  Scissors,
  Shield,
  Trophy,
  Flame,
  Megaphone,
  Layers,
  Image as ImageIcon,
  LucideIcon
} from 'lucide-react';

interface UniformCatalogProps {
  onSelectProduct: (product: UniformProduct) => void;
  onOpenCustomizerWithProduct: (product: UniformProduct, colorHex: string) => void;
}

export const UniformCatalog: React.FC<UniformCatalogProps> = ({
  onSelectProduct,
  onOpenCustomizerWithProduct,
}) => {
  const { products } = useERP();
  const [selectedCategory, setSelectedCategory] = useState<UniformCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Only show published products on storefront catalog
  const liveProducts = useMemo(() => {
    return (products || []).filter((p) => p && p.published !== false);
  }, [products]);

  // Instant typed matches for popup list
  const typedMatches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return liveProducts.filter((product) => {
      if (!product) return false;
      return (
        (product.sku || '').toLowerCase().includes(q) ||
        (product.name || '').toLowerCase().includes(q) ||
        (product.tagline || '').toLowerCase().includes(q) ||
        (product.categoryLabel || '').toLowerCase().includes(q) ||
        (product.fabric?.composition || '').toLowerCase().includes(q) ||
        (product.idealFor || []).some((item) => (item || '').toLowerCase().includes(q))
      );
    }).slice(0, 5);
  }, [liveProducts, searchQuery]);

  // Close search popup if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (typedMatches.length > 0) {
        const target = typedMatches[highlightedIndex] || typedMatches[0];
        onSelectProduct(target);
        setIsSearchFocused(false);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % Math.max(1, typedMatches.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + typedMatches.length) % Math.max(1, typedMatches.length));
    } else if (e.key === 'Escape') {
      setIsSearchFocused(false);
    }
  };

  const categories: { id: UniformCategory; label: string; count: number; icon: LucideIcon }[] = [
    { id: 'all', label: 'All Garments', count: liveProducts.length, icon: LayoutGrid },
    {
      id: 'safety_industrial',
      label: 'Safety & Industrial Wear',
      count: liveProducts.filter((p) => p.category === 'safety_industrial' || p.category === 'workwear').length,
      icon: HardHat,
    },
    {
      id: 'corporate',
      label: 'Corporate Wear',
      count: liveProducts.filter((p) => p.category === 'corporate' || p.category === 'service').length,
      icon: Briefcase,
    },
    {
      id: 'school',
      label: 'School & Institutional',
      count: liveProducts.filter((p) => p.category === 'school').length,
      icon: GraduationCap,
    },
    {
      id: 'security',
      label: 'Security & Staff Uniforms',
      count: liveProducts.filter((p) => p.category === 'security').length,
      icon: Shield,
    },
    {
      id: 'healthcare',
      label: 'Medical & Healthcare',
      count: liveProducts.filter((p) => p.category === 'healthcare').length,
      icon: Stethoscope,
    },
    {
      id: 'hospitality',
      label: 'Hospitality & Restaurant',
      count: liveProducts.filter((p) => p.category === 'hospitality').length,
      icon: ChefHat,
    },
    {
      id: 'promotional',
      label: 'Promotional & Branding',
      count: liveProducts.filter((p) => p.category === 'promotional').length,
      icon: Megaphone,
    },
    {
      id: 'sportswear',
      label: 'Sportswear & Active',
      count: liveProducts.filter((p) => p.category === 'sportswear').length,
      icon: Trophy,
    },
    {
      id: 'specialized_workwear',
      label: 'Specialized Work-wear',
      count: liveProducts.filter((p) => p.category === 'specialized_workwear').length,
      icon: Flame,
    },
  ];

  const filteredProducts = useMemo(() => {
    return liveProducts.filter((product) => {
      if (!product) return false;
      const matchesCategory =
        selectedCategory === 'all' ||
        product.category === selectedCategory ||
        (selectedCategory === 'safety_industrial' && product.category === 'workwear') ||
        (selectedCategory === 'workwear' && product.category === 'safety_industrial') ||
        (selectedCategory === 'corporate' && product.category === 'service') ||
        (selectedCategory === 'service' && product.category === 'corporate');
      const matchesSearch =
        (product.sku || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.tagline || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.fabric?.composition || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.idealFor || []).some((item) => (item || '').toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [liveProducts, selectedCategory, searchQuery]);

  return (
    <section id="catalog" className="py-8 sm:py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Prominent Centered Search Bar Below Hero */}
        <div className="max-w-2xl sm:max-w-3xl mx-auto mb-6 sm:mb-8">
          <div ref={searchContainerRef} className="relative w-full">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
              <input
                type="text"
                placeholder="Search by SKU (e.g. SKU-SCH), uniform name, safety wear, scrubs..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                  setHighlightedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                className="w-full pl-12 pr-24 py-3 sm:py-3.5 text-sm sm:text-base bg-white border border-slate-300 hover:border-slate-400 focus:border-[#06163c] rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#06163c]/10 transition-all shadow-sm hover:shadow-md text-slate-900 placeholder:text-slate-400 font-medium"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchFocused(false);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg px-2.5 py-1 transition-all cursor-pointer font-semibold"
                  >
                    Clear
                  </button>
                ) : (
                  <span className="hidden sm:inline-flex items-center text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-lg font-mono border border-slate-200">
                    ↵ Enter
                  </span>
                )}
              </div>
            </div>

            {/* Instant Search Matches Floating Popup */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 z-50 animate-fadeIn text-left">
                <div className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100 mb-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Instant Matches ({typedMatches.length})
                  </span>
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Press ↵ Enter to open popup
                  </span>
                </div>

                {typedMatches.length === 0 ? (
                  <div className="py-4 text-center text-xs text-slate-500">
                    No matching products found for "{searchQuery}"
                  </div>
                ) : (
                  <div className="space-y-1">
                    {typedMatches.map((product, idx) => {
                      const thumb = (product.images && product.images[0]) || product.image;
                      return (
                        <div
                          key={product.id}
                          onClick={() => {
                            onSelectProduct(product);
                            setIsSearchFocused(false);
                          }}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-150 cursor-pointer hover:translate-x-1 ${
                            highlightedIndex === idx
                              ? 'bg-blue-50/80 border border-blue-200/80 shadow-xs'
                              : 'hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <img
                            src={thumb}
                            alt={product.name}
                            className="w-11 h-11 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0 transition-transform duration-200 hover:scale-105"
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="text-xs font-bold text-slate-900 truncate">
                                {product.name}
                              </h4>
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded shrink-0">
                                {product.sku}
                              </span>
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded shrink-0">
                                {product.categoryLabel}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {product.tagline || ''}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-extrabold text-[#06163c] block font-['Outfit']">
                              Ksh {product.basePrice.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-0.5 justify-end mt-0.5">
                              <Eye className="w-3 h-3" />
                              <span>Open popup</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Category Filter Pills (Centered & Horizontally Scrollable) */}
        <div className="flex items-center justify-start lg:justify-center gap-2.5 overflow-x-auto py-2 px-1 mb-8 sm:mb-10 scrollbar-none">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                id={`category-btn-${cat.id}`}
                whileHover={{ y: -3, scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 24 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`group relative px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2.5 cursor-pointer shrink-0 select-none overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#06163c] to-[#0d2a6b] text-white shadow-[0_8px_20px_rgba(6,22,60,0.25)] ring-2 ring-blue-400/40'
                    : 'bg-white text-slate-600 hover:text-[#06163c] hover:bg-gradient-to-r hover:from-blue-50/90 hover:to-indigo-50/90 border border-slate-200/90 hover:border-blue-400 hover:shadow-[0_6px_18px_rgba(37,99,235,0.12)]'
                }`}
              >
                {/* Subtle sheen highlight on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                {/* Icon with interactive spring tilt and zoom */}
                <span className="relative flex items-center justify-center">
                  <IconComponent
                    className={`w-4 h-4 transition-all duration-300 ease-out group-hover:scale-125 group-hover:rotate-6 ${
                      isSelected
                        ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(103,232,249,0.5)]'
                        : 'text-slate-400 group-hover:text-blue-600'
                    }`}
                  />
                </span>

                {/* Category Label */}
                <span className="relative z-10 transition-colors duration-200">
                  {cat.label}
                </span>

                {/* Count Badge with hover pulse and color transition */}
                <span
                  className={`relative z-10 text-[10px] px-2 py-0.5 rounded-full font-extrabold transition-all duration-300 group-hover:scale-110 ${
                    isSelected
                      ? 'bg-white/20 text-cyan-200 border border-white/20'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-[0_2px_8px_rgba(37,99,235,0.3)]'
                  }`}
                >
                  {cat.count}
                </span>

                {/* Selected bottom indicator accent */}
                {isSelected && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <Shirt className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No uniforms found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn't find any garments matching "{searchQuery}". Try selecting a different category or clearing your search.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-bold text-[#06163c] bg-blue-50 rounded-lg hover:bg-blue-100"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectProduct(product)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectProduct(product);
                    }
                  }}
                  className="group card-ambient-hover relative bg-white rounded-2xl border border-[#D1E0FF] hover:border-blue-400 overflow-hidden shadow-[0_10px_28px_-4px_rgba(209,224,255,0.45),0_4px_14px_rgba(209,224,255,0.22)] hover:shadow-[0_24px_50px_-8px_rgba(6,22,60,0.22),0_12px_28px_rgba(209,224,255,0.5)] flex flex-col active:scale-[0.985] cursor-pointer touch-manipulation focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {/* Image & Badges with Shimmer Hover Reflection */}
                  <div className="relative aspect-[4/3] bg-gradient-to-br from-[#D1E0FF]/30 via-slate-50 to-[#D1E0FF]/15 overflow-hidden shadow-[inset_0_0_24px_rgba(209,224,255,0.25)] border-b border-[#D1E0FF]/40">
                    {/* Subtle light sweep on hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none z-10" />

                    <img
                      src={(product.images && product.images.length > 0) ? product.images[0] : product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-108 group-hover:brightness-[1.03] transition-transform duration-700 ease-out"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    
                    {/* Category Tag & SKU Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                      <span className="bg-white/95 backdrop-blur-sm text-[#06163c] text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
                        {product.categoryLabel}
                      </span>
                      {product.sku && (
                        <span className="bg-[#06163c]/90 backdrop-blur-sm text-blue-100 text-[9px] font-mono font-bold px-2 py-1 rounded-md shadow-sm tracking-tight transition-all duration-300 group-hover:scale-105 border border-white/10">
                          {product.sku}
                        </span>
                      )}
                    </div>

                    {product.badge && (
                      <span className="absolute top-3 right-3 bg-[#06163c] group-hover:bg-blue-900 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded shadow-sm transition-all duration-300 group-hover:scale-105 z-10">
                        {product.badge}
                      </span>
                    )}

                    {/* Multi-angle indicator pill */}
                    {product.images && product.images.length > 1 && (
                      <span className="absolute bottom-2.5 right-2.5 bg-black/65 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 z-10 shadow-xs">
                        <Layers className="w-3 h-3 text-blue-300" />
                        <span>{product.images.length} views</span>
                      </span>
                    )}

                    {/* Quick Customizer Hover Overlay Button (Desktop) */}
                    <div className="absolute inset-0 bg-[#06163c]/75 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-all duration-300 hidden sm:flex items-center justify-center gap-2.5 p-4 z-20">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(product);
                        }}
                        className="btn-shimmer-sweep group/btn1 px-3.5 py-2 bg-white text-[#06163c] text-xs font-extrabold rounded-xl shadow-lg hover:bg-blue-50 hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 group-hover/btn1:scale-115 transition-transform" />
                        <span>Details & Pricing</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenCustomizerWithProduct(
                            product,
                            product.availableColors[0]?.hex || '#06163c'
                          );
                        }}
                        className="btn-shimmer-sweep group/btn2 px-3.5 py-2 bg-[#021a34] hover:bg-blue-900 text-white text-xs font-extrabold rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 group-hover/btn2:rotate-12 transition-transform" />
                        <span>Mockup</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      {/* Available Color Swatches & SKU tag */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          {product.availableColors.map((color) => (
                            <button
                              key={color.name}
                              type="button"
                              title={color.name}
                              onClick={(e) => {
                                e.stopPropagation();
                                onSelectProduct(product);
                              }}
                              className={`w-4 h-4 rounded-full border border-slate-200 hover:scale-140 hover:ring-2 hover:ring-blue-500 hover:ring-offset-1 hover:shadow-md transition-all duration-200 active:scale-90 cursor-pointer ${color.bgClass}`}
                              style={{ backgroundColor: color.hex }}
                            />
                          ))}
                          <span className="text-[10px] text-slate-400 ml-1 font-medium">
                            {product.availableColors.length} colors
                          </span>
                        </div>
                        {product.sku && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/80 shrink-0">
                            <Tag className="w-2.5 h-2.5 text-slate-400" />
                            <span>{product.sku}</span>
                          </span>
                        )}
                      </div>

                      {/* Title & Tagline */}
                      <h3 className="font-bold text-slate-900 text-base font-['Outfit',sans-serif] group-hover:text-blue-900 transition-colors duration-200 leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {product.tagline || ''}
                      </p>
                    </div>

                    {/* Fabric highlight pills */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                      <span className="font-medium text-slate-500 truncate max-w-[150px]">
                        {product.fabric?.weight || ''} • {(product.fabric?.composition || '').split('/')[0]}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        MOQ: {product.minOrder}
                      </span>
                    </div>

                    {/* Price & Primary CTA */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                          Bulk from
                        </span>
                        <span className="text-base sm:text-lg font-black text-[#06163c] font-['Outfit',sans-serif]">
                          Ksh {product.basePrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400">/unit</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(product);
                        }}
                        className="btn-shimmer-sweep group/cfg inline-flex items-center gap-1.5 px-4 py-2 text-xs font-extrabold text-white bg-[#06163c] hover:bg-blue-900 hover:shadow-md rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                      >
                        <span>Configure</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover/cfg:translate-x-1 transition-transform duration-200" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </section>
  );
};
