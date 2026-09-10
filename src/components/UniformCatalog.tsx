import React, { useState, useMemo, useEffect, useRef } from 'react';
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
      id: 'school',
      label: 'School Uniforms',
      count: liveProducts.filter((p) => p.category === 'school').length,
      icon: GraduationCap,
    },
    {
      id: 'healthcare',
      label: 'Healthcare & Scrubs',
      count: liveProducts.filter((p) => p.category === 'healthcare').length,
      icon: Stethoscope,
    },
    {
      id: 'hospitality',
      label: 'Hospitality & Culinary',
      count: liveProducts.filter((p) => p.category === 'hospitality').length,
      icon: ChefHat,
    },
    {
      id: 'service',
      label: 'Corporate & Service Polos',
      count: liveProducts.filter((p) => p.category === 'service').length,
      icon: Briefcase,
    },
    {
      id: 'workwear',
      label: 'Workwear & Industrial',
      count: liveProducts.filter((p) => p.category === 'workwear').length,
      icon: HardHat,
    },
    {
      id: 'knitwear',
      label: 'Custom Knitwear & Fleece',
      count: liveProducts.filter((p) => p.category === 'knitwear').length,
      icon: Scissors,
    },
  ];

  const filteredProducts = useMemo(() => {
    return liveProducts.filter((product) => {
      if (!product) return false;
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
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
        
        {/* Filter Controls & Search */}
        <div className="space-y-4 mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                      selectedCategory === cat.id
                        ? 'bg-[#06163c] text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:text-[#06163c] hover:bg-blue-50/70 border border-slate-200'
                    }`}
                  >
                    <IconComponent className={`w-3.5 h-3.5 ${selectedCategory === cat.id ? 'text-white' : 'text-slate-500'}`} />
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                        selectedCategory === cat.id
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Box with Live Auto-Popup on Typing */}
            <div ref={searchContainerRef} className="relative min-w-[280px] sm:min-w-[340px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Type a product (e.g. blazer, scrub, polo)..."
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                  setHighlightedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                className="w-full pl-9 pr-14 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#06163c] focus:border-transparent transition-all shadow-xs"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchFocused(false);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-700 px-1 py-0.5"
                  >
                    Clear
                  </button>
                ) : (
                  <span className="hidden sm:inline text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-mono border border-slate-200">
                    ↵ Enter
                  </span>
                )}
              </div>

              {/* Instant Search Matches Floating Popup */}
              {isSearchFocused && searchQuery.trim().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 z-50 animate-fadeIn">
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
                      {typedMatches.map((product, idx) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            onSelectProduct(product);
                            setIsSearchFocused(false);
                          }}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          className={`flex items-center gap-3 p-2 rounded-xl transition-all cursor-pointer ${
                            highlightedIndex === idx
                              ? 'bg-blue-50/80 border border-blue-200/80'
                              : 'hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-11 h-11 rounded-lg object-cover bg-slate-100 border border-slate-200 shrink-0"
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=400&q=80';
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-xs font-bold text-slate-900 truncate">
                                {product.name}
                              </h4>
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded shrink-0">
                                {product.categoryLabel}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {product.tagline || ''}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-extrabold text-[#06163c] block">
                              ${product.price?.base ? product.price.base.toFixed(2) : (product.basePrice ? product.basePrice.toFixed(2) : '0.00')}
                            </span>
                            <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-0.5 justify-end mt-0.5">
                              <Eye className="w-3 h-3" />
                              <span>Open popup</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
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
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                role="button"
                tabIndex={0}
                onClick={() => onSelectProduct(product)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectProduct(product);
                  }
                }}
                className="group bg-white rounded-2xl border border-[#D1E0FF] overflow-hidden shadow-[0_10px_28px_-4px_rgba(209,224,255,0.4),0_4px_14px_rgba(209,224,255,0.2)] hover:shadow-[0_20px_42px_-4px_rgba(209,224,255,0.6),0_8px_22px_rgba(209,224,255,0.3)] transition-all duration-300 flex flex-col hover:-translate-y-1.5 active:scale-[0.99] cursor-pointer touch-manipulation focus:outline-none focus:ring-2 focus:ring-[#D1E0FF]"
              >
                {/* Image & Badges */}
                <div className="relative aspect-[4/3] bg-gradient-to-br from-[#D1E0FF]/30 via-slate-50 to-[#D1E0FF]/15 overflow-hidden shadow-[inset_0_0_24px_rgba(209,224,255,0.25)] border-b border-[#D1E0FF]/40">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  
                  {/* Category Tag */}
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#06163c] text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">
                    {product.categoryLabel}
                  </span>

                  {product.badge && (
                    <span className="absolute top-3 right-3 bg-[#06163c] text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm">
                      {product.badge}
                    </span>
                  )}

                  {/* Quick Customizer Hover Overlay Button (Desktop) */}
                  <div className="absolute inset-0 bg-[#06163c]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-center justify-center gap-2 p-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      className="px-3.5 py-2 bg-white text-[#06163c] text-xs font-bold rounded-lg shadow-lg hover:bg-blue-50 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
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
                      className="px-3.5 py-2 bg-[#021a34] text-white text-xs font-bold rounded-lg shadow-lg hover:bg-[#01152a] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Mockup</span>
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Available Color Swatches */}
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
                          className={`w-3.5 h-3.5 rounded-full border border-slate-200 hover:scale-125 transition-transform ${color.bgClass}`}
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                      <span className="text-[10px] text-slate-400 ml-1">
                        {product.availableColors.length} colors
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="font-bold text-slate-900 text-base font-['Outfit',sans-serif] group-hover:text-[#06163c] transition-colors leading-snug">
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
                      className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-bold text-white bg-[#06163c] hover:bg-[#021a34] rounded-xl shadow-sm transition-colors active:scale-95 cursor-pointer"
                    >
                      <span>Configure</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
