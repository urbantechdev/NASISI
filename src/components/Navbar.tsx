import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { NasisiLogo } from './NasisiLogo';
import { useERP } from '../context/ERPContext';
import {
  ShoppingBag,
  Menu,
  X,
  Sparkles,
  FileText,
  Ruler,
  ChevronDown,
  Scissors,
  Printer,
  Layers,
  ShieldCheck,
  SlidersHorizontal,
  ArrowRight,
  Building2,
  Search,
  Eye,
  Tag,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { QuoteItem, UniformProduct } from '../types';

interface NavbarProps {
  quoteItems: QuoteItem[];
  onOpenQuoteModal: () => void;
  onOpenCustomizer: () => void;
  onOpenSizeGuide: () => void;
  onOpenAdminERP?: () => void;
  onSelectProduct?: (product: UniformProduct) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  quoteItems,
  onOpenQuoteModal,
  onOpenCustomizer,
  onOpenSizeGuide,
  onOpenAdminERP,
  onSelectProduct,
}) => {
  const { products } = useERP();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Navbar Quick Search state
  const [navSearchQuery, setNavSearchQuery] = useState('');
  const [isNavSearchOpen, setIsNavSearchOpen] = useState(false);
  const [navHighlightedIndex, setNavHighlightedIndex] = useState(0);
  const navSearchRef = useRef<HTMLDivElement>(null);

  const liveProducts = useMemo(() => {
    return products.filter((p) => p.published !== false);
  }, [products]);

  const matchingNavProducts = useMemo(() => {
    if (!navSearchQuery.trim()) return [];
    const q = navSearchQuery.toLowerCase().trim();
    return liveProducts
      .filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          (p.fabric?.composition || '').toLowerCase().includes(q) ||
          (p.idealFor || []).some((item) => item.toLowerCase().includes(q))
        );
      })
      .slice(0, 5);
  }, [liveProducts, navSearchQuery]);

  // Click outside to close navbar search
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navSearchRef.current && !navSearchRef.current.contains(e.target as Node)) {
        setIsNavSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Lock body scroll when full-screen mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (matchingNavProducts.length > 0) {
        const selected = matchingNavProducts[navHighlightedIndex] || matchingNavProducts[0];
        onSelectProduct?.(selected);
        setIsNavSearchOpen(false);
        setNavSearchQuery('');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setNavHighlightedIndex((prev) => (prev + 1) % Math.max(1, matchingNavProducts.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setNavHighlightedIndex((prev) => (prev - 1 + matchingNavProducts.length) % Math.max(1, matchingNavProducts.length));
    } else if (e.key === 'Escape') {
      setIsNavSearchOpen(false);
    }
  };

  const totalItemsCount = quoteItems.reduce((sum, item) => sum + item.totalQuantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setServicesDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 180);
  };

  const serviceSubDomains = [
    {
      id: 'embroidery',
      title: 'Precision Industrial Embroidery',
      description: 'Multi-needle automated Tajima embroidery, 3D puff stitch, metallic threads & crest patches.',
      icon: Scissors,
      badge: 'Signature',
      href: '#catalog',
      isCustomizerAction: false,
    },
    {
      id: 'screen-printing',
      title: 'Screen Printing & DTF Transfers',
      description: 'High-opacity plastisol, eco waterbase inks & photographic Direct-to-Film apparel prints.',
      icon: Printer,
      badge: 'High Volume',
      href: '#catalog',
      isCustomizerAction: false,
    },
    {
      id: 'knitwear',
      title: 'Bespoke Knitwear & Manufacturing',
      description: 'Anti-pill school v-necks, cardigans, custom jacquard trims & pantone dye-matched fabrics.',
      icon: Layers,
      badge: 'In-House',
      href: '#catalog',
      isCustomizerAction: false,
    },
    {
      id: 'outfitting',
      title: 'Institutional Uniform Programs',
      description: 'Complete turn-key apparel supply for schools, hospitals, hospitality & corporate teams.',
      icon: ShieldCheck,
      badge: 'End-to-End',
      href: '#catalog',
      isCustomizerAction: false,
    },
    {
      id: 'mockup-studio',
      title: 'Live Mockup & Digitization Studio',
      description: 'Interactive garment visualizer with multi-location embroidery and vector proof generator.',
      icon: SlidersHorizontal,
      badge: 'Interactive',
      href: '#',
      isCustomizerAction: true,
    },
  ];

  return (
    <motion.header
      id="main-navbar"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 bg-[#032345] shadow-[0_4px_20px_rgba(255,255,255,0.15)] ${
        isScrolled
          ? 'bg-[#032345]/95 backdrop-blur-md py-4 sm:py-5'
          : 'bg-[#032345] py-6 sm:py-7 md:py-8'
      }`}
    >
      {/* Dynamic Balanced Shiny Scanner Ray sweeping Left-to-Right */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Luminous Angled Sheen Light Beam */}
        <div className="absolute top-0 bottom-0 -left-1/4 w-1/3 bg-gradient-to-r from-transparent via-white/18 via-cyan-100/15 to-transparent animate-scanner-ray pointer-events-none" />
        
        {/* Medium-Soft Gloss Laser Bar with Cyan Glow */}
        <div className="absolute top-0 bottom-0 left-0 w-28 sm:w-40 bg-gradient-to-r from-transparent via-cyan-300/25 via-white/45 via-cyan-200/25 to-transparent blur-[3px] animate-scanner-laser pointer-events-none" />

        {/* Crisp Specular Core Line */}
        <div className="absolute top-0 bottom-0 left-0 w-[1.5px] bg-gradient-to-b from-transparent via-white/90 via-cyan-100/80 to-transparent shadow-[0_0_8px_#ffffff,0_0_16px_#38bdf8] animate-scanner-laser pointer-events-none" />

        {/* Top Rim Shiny Light Runner */}
        <div className="absolute top-0 left-0 w-48 sm:w-64 h-[1.5px] bg-gradient-to-r from-transparent via-white/60 to-cyan-300/70 shadow-[0_0_6px_#38bdf8] animate-scanner-laser-delayed pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo in White / Brand Light Variant */}
          <a href="#" className="focus:outline-none flex items-center group" aria-label="NASISI Home">
            <NasisiLogo size="md" variant="white" />
          </a>

          {/* Desktop Navigation Links: Home, Services (with sub domains dropdown), Products, About, Contact */}
          <nav className="hidden lg:flex items-center gap-7">
            {/* 1. Home */}
            <a
              href="#"
              className="text-sm font-semibold text-blue-100 hover:text-white transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-300 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              Home
            </a>

            {/* 2. Services (with Sub Domains Dropdown) */}
            <div
              className="relative py-2"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors py-1 cursor-pointer ${
                  servicesDropdownOpen ? 'text-white' : 'text-blue-100 hover:text-white'
                }`}
                aria-expanded={servicesDropdownOpen}
                aria-haspopup="true"
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    servicesDropdownOpen ? 'rotate-180 text-white' : 'text-blue-300'
                  }`}
                />
              </button>

              {/* Mega Dropdown Menu */}
              {servicesDropdownOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 w-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 transition-all animate-fadeIn z-50 mt-1"
                  role="menu"
                >
                  <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between mb-2">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      What We Do • Core Capabilities
                    </span>
                    <a
                      href="#catalog"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="text-xs font-bold text-[#032345] hover:underline flex items-center gap-1"
                    >
                      <span>Explore all capabilities</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5">
                    {serviceSubDomains.map((sub) => {
                      const IconComp = sub.icon;
                      if (sub.isCustomizerAction) {
                        return (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => {
                              setServicesDropdownOpen(false);
                              onOpenCustomizer();
                            }}
                            className="w-full text-left flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-100 transition-all group cursor-pointer"
                            role="menuitem"
                          >
                            <div className="w-9 h-9 rounded-lg bg-blue-100/70 group-hover:bg-[#032345] text-[#032345] group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors mt-0.5">
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#032345] transition-colors">
                                  {sub.title}
                                </h4>
                                {sub.badge && (
                                  <span className="px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide uppercase bg-slate-100 group-hover:bg-blue-200/80 text-slate-700 group-hover:text-[#032345] rounded">
                                    {sub.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 leading-snug mt-0.5 line-clamp-1">
                                {sub.description}
                              </p>
                            </div>
                          </button>
                        );
                      }
                      return (
                        <a
                          key={sub.id}
                          href={sub.href}
                          onClick={() => setServicesDropdownOpen(false)}
                          className="flex items-start gap-3.5 p-2.5 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-100 transition-all group"
                          role="menuitem"
                        >
                          <div className="w-9 h-9 rounded-lg bg-blue-100/70 group-hover:bg-[#032345] text-[#032345] group-hover:text-white flex items-center justify-center flex-shrink-0 transition-colors mt-0.5">
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#032345] transition-colors">
                                {sub.title}
                              </h4>
                              {sub.badge && (
                                <span className="px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide uppercase bg-slate-100 group-hover:bg-blue-200/80 text-slate-700 group-hover:text-[#032345] rounded">
                                  {sub.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug mt-0.5 line-clamp-1">
                              {sub.description}
                            </p>
                          </div>
                        </a>
                      );
                    })}
                  </div>

                  {/* Bottom Footer inside Dropdown */}
                  <div className="mt-3 pt-3 border-t border-slate-100 bg-slate-50 -mx-4 -mb-4 p-3.5 px-5 rounded-b-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Sparkles className="w-3.5 h-3.5 text-[#032345]" />
                      <span>Free digital artwork proof on all bulk inquiries</span>
                    </div>
                    <button
                      onClick={() => {
                        setServicesDropdownOpen(false);
                        onOpenQuoteModal();
                      }}
                      className="text-xs font-bold text-[#032345] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Request Quote</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Products */}
            <a
              href="#catalog"
              className="text-sm font-semibold text-blue-100 hover:text-white transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-300 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              Products
            </a>

            {/* 4. Contact */}
            <a
              href="#contact"
              className="text-sm font-semibold text-blue-100 hover:text-white transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-300 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              Contact
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              id="navbar-size-guide-btn"
              onClick={onOpenSizeGuide}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-100 hover:text-white hover:bg-blue-900/60 rounded-lg transition-colors border border-blue-400/30 cursor-pointer"
              title="View Size Chart and Fabric Specifications"
            >
              <Ruler className="w-3.5 h-3.5 text-blue-300" />
              <span>Size Guide</span>
            </button>

            {/* Customizer Quick Link */}
            <button
              id="navbar-live-mockup-btn"
              type="button"
              onClick={onOpenCustomizer}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-blue-700/60 hover:bg-blue-600/70 border border-blue-400/40 rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Live Mockup</span>
            </button>

            {/* Admin ERP Suite Portal Link */}
            {onOpenAdminERP && (
              <button
                id="navbar-admin-erp-btn"
                type="button"
                onClick={onOpenAdminERP}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-200 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 rounded-lg transition-colors shadow-sm cursor-pointer"
                title="Open Kenyan Enterprise ERP & Invoicing Suite (Ksh)"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin ERP (Ksh)</span>
              </button>
            )}

            {/* Quote Request / Cart Button (Crisp White with Brand Blue Accent) */}
            <button
              id="navbar-quote-cart-btn"
              onClick={onOpenQuoteModal}
              className="relative flex items-center gap-2 px-4 py-2 text-xs font-extrabold text-[#032345] bg-white hover:bg-blue-50 rounded-lg shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#032345]" />
              <span>Quote Cart</span>
              {totalItemsCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1 text-[11px] font-black bg-[#032345] text-white rounded-full shadow">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-quote-btn"
              onClick={onOpenQuoteModal}
              className="relative p-2.5 text-[#032345] bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200/90 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
              aria-label="View Quote Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#032345]" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black bg-[#032345] text-white rounded-full border-2 border-white shadow-xs">
                  {totalItemsCount}
                </span>
              )}
            </button>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-[#032345] bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200/90 rounded-xl shadow-sm focus:outline-none transition-all active:scale-95 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#032345]" /> : <Menu className="w-5 h-5 text-[#032345]" />}
            </button>
          </div>
        </div>

        {/* Full Screen White Background Mobile Hamburger Window */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[100] bg-white text-slate-900 flex flex-col overflow-hidden animate-fadeIn">
            {/* Mobile Header Bar with curved wave accent */}
            <div className="relative bg-white/95 backdrop-blur-md shrink-0 shadow-xs border-b border-slate-100">
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <NasisiLogo className="h-8 w-auto" />
                  <span className="px-2 py-0.5 bg-blue-50 text-[#032345] text-[10px] font-black uppercase rounded-md tracking-wider border border-blue-200">
                    Menu
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenQuoteModal();
                    }}
                    className="relative p-2.5 text-[#032345] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    aria-label="View Quote Cart"
                  >
                    <ShoppingBag className="w-5 h-5 text-[#032345]" />
                    {totalItemsCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black bg-[#032345] text-white rounded-full">
                        {totalItemsCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-colors cursor-pointer"
                    aria-label="Close Mobile Menu"
                  >
                    <X className="w-5 h-5 text-slate-800" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 overscroll-contain">
              {/* Mobile Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search uniforms, workwear, scrubs, badges..."
                  value={navSearchQuery}
                  onChange={(e) => {
                    setNavSearchQuery(e.target.value);
                    setIsNavSearchOpen(true);
                  }}
                  className="w-full pl-10 pr-9 py-3 text-xs text-slate-900 placeholder-slate-400 bg-slate-100/80 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#032345] focus:bg-white transition-all shadow-2xs"
                />
                {navSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setNavSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 p-1"
                  >
                    ✕
                  </button>
                )}

                {/* Mobile Search Results */}
                {navSearchQuery.trim().length > 0 && (
                  <div className="mt-2 bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 p-2 space-y-1 max-h-64 overflow-y-auto">
                    <div className="text-[10px] font-black uppercase text-slate-400 px-2 py-1 border-b border-slate-100 flex items-center justify-between">
                      <span>Matching Uniforms</span>
                      <span className="text-[#032345] font-bold">{matchingNavProducts.length} items</span>
                    </div>
                    {matchingNavProducts.length === 0 ? (
                      <div className="py-3 text-center text-xs text-slate-500">
                        No products found for "{navSearchQuery}"
                      </div>
                    ) : (
                      matchingNavProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            onSelectProduct?.(p);
                            setMobileMenuOpen(false);
                            setNavSearchQuery('');
                          }}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-blue-50/80 border border-transparent hover:border-blue-200 cursor-pointer transition-colors"
                        >
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-11 h-11 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-100"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <h6 className="text-xs font-bold text-slate-900 truncate">{p.name}</h6>
                            <span className="text-[10px] text-slate-500 block truncate">{p.categoryLabel}</span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-extrabold text-[#032345] block">
                              ${p.price.base.toFixed(2)}
                            </span>
                            <span className="text-[9px] text-emerald-600 font-bold uppercase">Ready</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Featured Quick Action Cards */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCustomizer();
                  }}
                  className="p-3.5 rounded-2xl bg-gradient-to-tr from-[#032345] to-[#024177] text-white flex flex-col justify-between items-start text-left shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  <div className="p-2 rounded-xl bg-white/15 text-cyan-300 mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">3D Mockup Studio</span>
                    <span className="text-[10px] text-blue-200">Custom crests & colors</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQuoteModal();
                  }}
                  className="p-3.5 rounded-2xl bg-slate-900 text-white flex flex-col justify-between items-start text-left shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  <div className="p-2 rounded-xl bg-white/15 text-emerald-400 mb-3">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Instant Quote Cart</span>
                    <span className="text-[10px] text-slate-300">{totalItemsCount} items ready</span>
                  </div>
                </button>
              </div>

              {/* Main Navigation Links */}
              <div className="space-y-1 border-t border-slate-100 pt-3">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-3 mb-1 block">
                  Factory Navigation
                </span>

                <a
                  href="#"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 text-sm font-bold text-slate-800 hover:text-[#032345] hover:bg-slate-100/80 rounded-xl transition-colors"
                >
                  <span>Home</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </a>

                {/* Services Expandable Accordion */}
                <div className="rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="w-full flex items-center justify-between px-3.5 py-3 text-sm font-bold text-slate-800 hover:text-[#032345] hover:bg-slate-100/80 rounded-xl transition-colors cursor-pointer"
                  >
                    <span>Manufacturing Services</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                        mobileServicesOpen ? 'rotate-180 text-[#032345]' : ''
                      }`}
                    />
                  </button>

                  {mobileServicesOpen && (
                    <div className="bg-slate-50 p-2 space-y-1 rounded-xl my-1 border border-slate-100">
                      {serviceSubDomains.map((sub) => {
                        const SubIcon = sub.icon;
                        if (sub.isCustomizerAction) {
                          return (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setMobileServicesOpen(false);
                                onOpenCustomizer();
                              }}
                              className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#032345] hover:bg-white rounded-lg transition-colors cursor-pointer"
                            >
                              <SubIcon className="w-4 h-4 text-[#032345]" />
                              <span>{sub.title}</span>
                            </button>
                          );
                        }
                        return (
                          <a
                            key={sub.id}
                            href={sub.href}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setMobileServicesOpen(false);
                            }}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-[#032345] hover:bg-white rounded-lg transition-colors"
                          >
                            <SubIcon className="w-4 h-4 text-[#032345]" />
                            <span>{sub.title}</span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>

                <a
                  href="#catalog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 text-sm font-bold text-slate-800 hover:text-[#032345] hover:bg-slate-100/80 rounded-xl transition-colors"
                >
                  <span>Uniform Catalog</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </a>

                <a
                  href="#portfolio"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 text-sm font-bold text-slate-800 hover:text-[#032345] hover:bg-slate-100/80 rounded-xl transition-colors"
                >
                  <span>Client Portfolio & Gallery</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSizeGuide();
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-3 text-sm font-bold text-slate-800 hover:text-[#032345] hover:bg-slate-100/80 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-[#032345]" />
                    <span>Size & Fabric Standards</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>

                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 text-sm font-bold text-slate-800 hover:text-[#032345] hover:bg-slate-100/80 rounded-xl transition-colors"
                >
                  <span>Contact Factory</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </a>
              </div>

              {/* Admin ERP Direct Access */}
              {onOpenAdminERP && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdminERP();
                    }}
                    className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 border border-emerald-300 text-emerald-950 flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div className="text-left">
                        <span className="text-xs font-black block">Factory ERP & Invoicing Center</span>
                        <span className="text-[10px] text-emerald-800 font-mono">
                          M-Pesa STK, Quotations & Receipts (Ksh)
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-emerald-700" />
                  </button>
                </div>
              )}

              {/* Direct WhatsApp & Hotline Quick Bar */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Factory Desk Direct
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Online
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:0728102929"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-[#032345] shadow-2xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#032345]" />
                    <span className="font-mono">0728102929</span>
                  </a>

                  <a
                    href="https://wa.me/254728102929?text=Hello%20NASISI%20Uniforms%2C%20I%20would%20like%20to%20inquire%20about%20an%20order."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs font-bold text-white shadow-2xs transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wave Curve on the Bottom Edge with Visible White Border, White Glow, Smoke Motion & Shiny Scanner Ray */}
      <motion.div
        className="absolute top-full left-0 right-0 w-full overflow-hidden leading-none pointer-events-none -mt-[1px] filter drop-shadow-[0_6px_14px_rgba(255,255,255,0.65)]"
        animate={{
          y: [0, 3, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {/* Left-to-Right Flowing Ambient Smoke Effect along Header Bottom */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 -left-48 w-[400px] sm:w-[550px] h-10 bg-gradient-to-r from-transparent via-cyan-300/20 to-sky-200/15 rounded-full blur-xl animate-smoke-l2r-1" />
          <div className="absolute top-1 -left-64 w-[500px] sm:w-[650px] h-12 bg-gradient-to-r from-transparent via-blue-400/15 to-indigo-300/10 rounded-full blur-2xl animate-smoke-l2r-2" />
          
          {/* Balanced Gloss Sheen Traveling along Wave Edge */}
          <div className="absolute top-0 bottom-0 left-0 w-32 sm:w-56 bg-gradient-to-r from-transparent via-cyan-200/25 via-white/55 via-cyan-100/30 to-transparent blur-[3px] animate-scanner-wave pointer-events-none" />
        </div>

        <svg
          className="w-full h-7 sm:h-9 md:h-10 lg:h-12 block relative z-10"
          viewBox="0 0 1440 60"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Luminous Balanced Gloss Gradient for Wave Edge */}
            <linearGradient id="waveScannerGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#7dd3fc" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Main wave fill */}
          <path
            d="M0,0 L1440,0 L1440,20 C1040,56 400,-6 0,36 Z"
            fill="#032345"
          />
          {/* Glowing White Bottom Wave Contour Edge */}
          <path
            d="M0,36 C400,-6 1040,56 1440,20"
            stroke="url(#waveScannerGlow)"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Secondary crisp white highlight line for depth */}
          <path
            d="M0,33 C400,-8 1040,54 1440,18"
            stroke="rgba(255, 255, 255, 0.35)"
            strokeWidth="1.3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </motion.div>
    </motion.header>
  );
};
