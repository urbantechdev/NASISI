import React, { useState, useMemo } from 'react';
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

  // Only show published products on storefront catalog
  const liveProducts = useMemo(() => {
    return products.filter((p) => p.published !== false);
  }, [products]);

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
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.fabric?.composition || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.idealFor || []).some((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [liveProducts, selectedCategory, searchQuery]);

  return (
    <section id="catalog" className="py-8 sm:py-12 bg-slate-50 border-b border-slate-200">
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
                        ? 'bg-[#032345] text-white shadow-sm'
                        : 'bg-white text-slate-600 hover:text-[#032345] hover:bg-blue-50/70 border border-slate-200'
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

            {/* Search Box */}
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search blazers, scrubs, polos, fabrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#032345] focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
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
              className="px-4 py-2 text-xs font-bold text-[#032345] bg-blue-50 rounded-lg hover:bg-blue-100"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                {/* Image & Badges */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
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
                  <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#032345] text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-sm uppercase tracking-wider">
                    {product.categoryLabel}
                  </span>

                  {product.badge && (
                    <span className="absolute top-3 right-3 bg-[#032345] text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow-sm">
                      {product.badge}
                    </span>
                  )}

                  {/* Quick Customizer Hover Overlay Button */}
                  <div className="absolute inset-0 bg-[#032345]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 p-4">
                    <button
                      onClick={() => onSelectProduct(product)}
                      className="px-3.5 py-2 bg-white text-[#032345] text-xs font-bold rounded-lg shadow-lg hover:bg-blue-50 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details & Pricing</span>
                    </button>
                    <button
                      onClick={() =>
                        onOpenCustomizerWithProduct(
                          product,
                          product.availableColors[0]?.hex || '#032345'
                        )
                      }
                      className="px-3.5 py-2 bg-[#021a34] text-white text-xs font-bold rounded-lg shadow-lg hover:bg-[#01152a] transition-colors flex items-center gap-1.5"
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
                        <span
                          key={color.name}
                          title={color.name}
                          className={`w-3 h-3 rounded-full border border-slate-200 ${color.bgClass}`}
                          style={{ backgroundColor: color.hex }}
                        />
                      ))}
                      <span className="text-[10px] text-slate-400 ml-1">
                        {product.availableColors.length} colors
                      </span>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="font-bold text-slate-900 text-base font-['Outfit',sans-serif] group-hover:text-[#032345] transition-colors leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {product.tagline}
                    </p>
                  </div>

                  {/* Fabric highlight pills */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="font-medium text-slate-500 truncate max-w-[150px]">
                      {product.fabric.weight} • {product.fabric.composition.split('/')[0]}
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
                      <span className="text-base sm:text-lg font-black text-[#032345] font-['Outfit',sans-serif]">
                        Ksh {product.basePrice.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400">/unit</span>
                    </div>

                    <button
                      onClick={() => onSelectProduct(product)}
                      className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-bold text-white bg-[#032345] hover:bg-[#021a34] rounded-xl shadow-sm transition-colors active:scale-95"
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
