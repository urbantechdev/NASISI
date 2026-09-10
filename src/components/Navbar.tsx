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
  GraduationCap,
  HeartPulse,
  HardHat,
  UtensilsCrossed,
  Shirt,
  Palette,
  CheckCircle2,
  Truck,
  Award,
  Clock,
  ExternalLink,
  Factory,
  Zap,
  Check,
} from 'lucide-react';
import { QuoteItem, UniformProduct } from '../types';

interface NavbarProps {
  quoteItems: QuoteItem[];
  onOpenQuoteModal: () => void;
  onOpenCustomizer: () => void;
  onOpenSizeGuide: () => void;
  onOpenAdminERP?: () => void;
  onSelectProduct?: (product: UniformProduct) => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenTerms?: () => void;
  onOpenCookies?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  quoteItems,
  onOpenQuoteModal,
  onOpenCustomizer,
  onOpenSizeGuide,
  onOpenAdminERP,
  onSelectProduct,
  onOpenPrivacyPolicy,
  onOpenTerms,
  onOpenCookies,
}) => {
  const { products, currentUser, isAuthenticated } = useERP();
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
    return (products || []).filter((p) => p && p.published !== false);
  }, [products]);

  const matchingNavProducts = useMemo(() => {
    if (!navSearchQuery.trim()) return [];
    const q = navSearchQuery.toLowerCase().trim();
    return liveProducts
      .filter((p) => {
        if (!p) return false;
        return (
          (p.name || '').toLowerCase().includes(q) ||
          (p.categoryLabel || '').toLowerCase().includes(q) ||
          (p.tagline || '').toLowerCase().includes(q) ||
          (p.fabric?.composition || '').toLowerCase().includes(q) ||
          (p.idealFor || []).some((item) => (item || '').toLowerCase().includes(q))
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

  // Lock body scroll and listen for Escape key when navigation drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
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

  // Mega Expansive Services Taxonomy
  const megaManufacturingServices = [
    {
      id: 'academic',
      title: 'Academic & Schoolwear Outfitting',
      description: 'Custom tailored blazers, anti-pill v-neck sweaters, pleated pinafores, sports tracksuits & pique polos.',
      icon: GraduationCap,
      badge: 'Bestseller',
      href: '#catalog',
    },
    {
      id: 'medical',
      title: 'Pro-Flex Healthcare & Medical Scrubs',
      description: 'Antimicrobial 4-way stretch scrub sets, lab coats, theatre tunics & doctor monogramming.',
      icon: HeartPulse,
      badge: 'ISO Grade',
      href: '#catalog',
    },
    {
      id: 'workwear',
      title: 'Heavy Industrial & Hi-Vis Safety Gear',
      description: 'Triple-stitched boiler suits, reflective utility vests, mechanic overalls & security uniforms.',
      icon: HardHat,
      badge: 'Heavy Duty',
      href: '#catalog',
    },
    {
      id: 'hospitality',
      title: 'Hospitality, Culinary & Barista Wear',
      description: 'Executive double-breasted chef jackets, heavy canvas barista aprons & front-desk attire.',
      icon: UtensilsCrossed,
      badge: 'Premium',
      href: '#catalog',
    },
  ];

  const megaBrandingTechniques = [
    {
      id: 'embroidery',
      title: 'Tajima Industrial Embroidery',
      description: '15-needle computerized embroidery, 3D puff stitching, metallic gold thread & crest patches.',
      icon: Scissors,
      badge: 'Signature',
      href: '#services',
    },
    {
      id: 'screen-printing',
      title: 'Plastisol & Screen Printing',
      description: 'High-opacity vibrant prints, eco-waterbase inks, sports numbers & high-volume bulk runs.',
      icon: Printer,
      badge: 'High Volume',
      href: '#services',
    },
    {
      id: 'dtf-transfers',
      title: 'Direct-to-Film (DTF) & Badges',
      description: 'Full-color photographic gradients, ultra-crisp micro crests & flexible activewear transfers.',
      icon: Sparkles,
      badge: 'Photo Crisp',
      href: '#services',
    },
    {
      id: 'labels-crests',
      title: 'Woven Crests & Bullion Badges',
      description: 'Laser-cut damask neck labels, blazer pocket bullion crests & custom metallic badges.',
      icon: Layers,
      badge: 'Custom',
      href: '#services',
    },
  ];

  const megaDigitalAndTurnkey = [
    {
      id: 'mockup-studio',
      title: '3D Interactive Mockup Studio',
      description: 'Live 3D garment visualizer, custom pantone picker, multi-crest placement & vector proofs.',
      icon: SlidersHorizontal,
      badge: 'Interactive',
      isCustomizer: true,
    },
    {
      id: 'quote-estimator',
      title: 'Wholesale Quote & Price Matrix',
      description: 'Instant tiered volume pricing, custom branding calculation & Kenyan PDF invoicing.',
      icon: FileText,
      badge: 'Instant KSh',
      isQuote: true,
    },
    {
      id: 'size-guide',
      title: 'Technical Specs & Size Grading',
      description: 'Detailed GSM fabric compositions, shrinkage tolerances & standard sizing charts.',
      icon: Ruler,
      badge: 'Specs',
      isSizeGuide: true,
    },
    {
      id: 'institutional-contracts',
      title: 'Turn-Key School & Corporate Supply',
      description: 'Annual intake fulfillment, scheduled buffer stock storage & dedicated account managers.',
      icon: ShieldCheck,
      badge: 'End-to-End',
      href: '#contact',
    },
  ];

  return (
    <motion.header
      id="main-navbar"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 shadow-[0_4px_25px_rgba(6,22,60,0.6)] ${
        isScrolled
          ? 'bg-[#06163c]/98 backdrop-blur-md py-4 sm:py-5'
          : 'bg-[#06163c] py-6 sm:py-7 md:py-8'
      }`}
    >
      {/* Subtle Luminous Ambient Sheen across Header Bar */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Soft Angled Sheen Light Beam */}
        <div className="absolute top-0 bottom-0 -left-1/4 w-1/3 bg-gradient-to-r from-transparent via-white/8 via-cyan-100/8 to-transparent animate-scanner-ray pointer-events-none" />
        
        {/* Soft Specular Runner */}
        <div className="absolute top-0 left-0 w-48 sm:w-64 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-cyan-300/40 shadow-[0_0_6px_#38bdf8] animate-scanner-laser-delayed pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between">
          {/* Logo in White / Brand Light Variant - Enlarged with restored subtitle & slogan */}
          <a href="#" className="focus:outline-none flex items-center group shrink-0" aria-label="NASISI Home">
            <NasisiLogo
              size="xl"
              variant="white"
              showTagline={true}
              tagline="We stitch it, You wear it, We print it, you represent."
              className="scale-90 sm:scale-100 origin-left transition-transform"
            />
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

              {/* Mega Expansive Dropdown Menu */}
              {servicesDropdownOpen && (
                <div
                  className="absolute top-full -left-52 md:-left-64 lg:-left-72 xl:-left-80 w-[960px] lg:w-[1040px] xl:w-[1140px] max-w-[94vw] bg-white rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.28)] border border-slate-200/90 p-6 transition-all animate-fadeIn z-50 mt-2 text-slate-900 overflow-hidden ring-1 ring-black/5"
                  role="menu"
                >
                  {/* Top Mega Menu Header */}
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#06163c] flex items-center justify-center font-bold">
                        <Factory className="w-4 h-4 text-[#06163c]" />
                      </div>
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                          NASISI Industrial Manufacturing & Embellishment Atelier
                        </h3>
                        <p className="text-[11px] text-slate-500">
                          Nairobi Factory • In-House Computerized Embroidery, Screen Printing & Bespoke Uniform Outfitting
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setServicesDropdownOpen(false);
                          onOpenCustomizer();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#06163c] text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        <span>Launch 3D Studio</span>
                      </button>
                      <a
                        href="#catalog"
                        onClick={() => setServicesDropdownOpen(false)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                      >
                        <span>All Uniforms</span>
                        <ArrowRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* 4-Column Mega Grid */}
                  <div className="grid grid-cols-12 gap-5">
                    {/* Column 1: Garment Manufacturing */}
                    <div className="col-span-3 space-y-2.5">
                      <div className="flex items-center gap-1.5 px-1">
                        <Shirt className="w-3.5 h-3.5 text-[#06163c]" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-[#06163c]">
                          Garment Manufacturing
                        </span>
                      </div>
                      <div className="space-y-1">
                        {megaManufacturingServices.map((item) => {
                          const Icon = item.icon;
                          return (
                            <a
                              key={item.id}
                              href={item.href}
                              onClick={() => setServicesDropdownOpen(false)}
                              className="group flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/80 transition-all"
                            >
                              <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-[#06163c] text-[#06163c] group-hover:text-white flex items-center justify-center shrink-0 transition-colors mt-0.5">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-slate-900 group-hover:text-[#06163c] transition-colors leading-tight">
                                    {item.title}
                                  </span>
                                  {item.badge && (
                                    <span className="px-1 py-0.2 text-[8px] font-extrabold uppercase tracking-wide bg-blue-50 text-[#06163c] rounded">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10.5px] text-slate-500 leading-snug line-clamp-2 mt-0.5">
                                  {item.description}
                                </p>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>

                    {/* Column 2: Industrial Branding & Embellishment */}
                    <div className="col-span-3 space-y-2.5">
                      <div className="flex items-center gap-1.5 px-1">
                        <Palette className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-blue-700">
                          Branding & Printing
                        </span>
                      </div>
                      <div className="space-y-1">
                        {megaBrandingTechniques.map((item) => {
                          const Icon = item.icon;
                          return (
                            <a
                              key={item.id}
                              href={item.href}
                              onClick={() => setServicesDropdownOpen(false)}
                              className="group flex items-start gap-2.5 p-2 rounded-xl hover:bg-blue-50/50 border border-transparent hover:border-blue-100 transition-all"
                            >
                              <div className="w-7 h-7 rounded-lg bg-blue-100/70 group-hover:bg-[#06163c] text-[#06163c] group-hover:text-white flex items-center justify-center shrink-0 transition-colors mt-0.5">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-slate-900 group-hover:text-[#06163c] transition-colors leading-tight">
                                    {item.title}
                                  </span>
                                  {item.badge && (
                                    <span className="px-1 py-0.2 text-[8px] font-extrabold uppercase tracking-wide bg-amber-100 text-amber-900 rounded">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10.5px] text-slate-500 leading-snug line-clamp-2 mt-0.5">
                                  {item.description}
                                </p>
                              </div>
                            </a>
                          );
                        })}
                      </div>
                    </div>

                    {/* Column 3: Turn-Key Institutional & Digital */}
                    <div className="col-span-3 space-y-2.5">
                      <div className="flex items-center gap-1.5 px-1">
                        <Zap className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700">
                          Digital & Turn-Key
                        </span>
                      </div>
                      <div className="space-y-1">
                        {megaDigitalAndTurnkey.map((item) => {
                          const Icon = item.icon;
                          const handleClick = () => {
                            setServicesDropdownOpen(false);
                            if (item.isCustomizer) onOpenCustomizer();
                            else if (item.isQuote) onOpenQuoteModal();
                            else if (item.isSizeGuide) onOpenSizeGuide();
                          };

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={handleClick}
                              className="w-full text-left group flex items-start gap-2.5 p-2 rounded-xl hover:bg-emerald-50/50 border border-transparent hover:border-emerald-200 transition-all cursor-pointer"
                            >
                              <div className="w-7 h-7 rounded-lg bg-emerald-100/70 group-hover:bg-emerald-700 text-emerald-800 group-hover:text-white flex items-center justify-center shrink-0 transition-colors mt-0.5">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-900 transition-colors leading-tight">
                                    {item.title}
                                  </span>
                                  {item.badge && (
                                    <span className="px-1 py-0.2 text-[8px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-800 rounded">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10.5px] text-slate-500 leading-snug line-clamp-2 mt-0.5">
                                  {item.description}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Column 4: Premium Spotlight & Quick Action Card */}
                    <div className="col-span-3 flex flex-col justify-between p-4 rounded-2xl bg-gradient-to-b from-[#06163c] via-[#022c57] to-[#011b36] text-white shadow-md relative overflow-hidden">
                      {/* Subtle decorative glow */}
                      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-28 h-28 rounded-full bg-cyan-400/20 blur-xl pointer-events-none" />
                      <div className="relative z-10 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full bg-white/15 text-[#D1E0FF] text-[10px] font-extrabold tracking-wide uppercase">
                            Factory Direct
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            Active Lines
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-black text-white leading-snug">
                            Bulk Tenders & Institutional Supply
                          </h4>
                          <p className="text-[11px] text-blue-200/90 mt-1 leading-relaxed">
                            Serving 150+ schools, hospitals & corporate brands across Kenya with zero outsourcing.
                          </p>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center gap-1.5 text-[10.5px] text-blue-100">
                            <Check className="w-3 h-3 text-cyan-300 shrink-0" />
                            <span>5–7 Days Fast-Track Sampling</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10.5px] text-blue-100">
                            <Check className="w-3 h-3 text-cyan-300 shrink-0" />
                            <span>Anti-Pill & Colorfast Guaranteed</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10.5px] text-blue-100">
                            <Check className="w-3 h-3 text-cyan-300 shrink-0" />
                            <span>Custom Crest Digitization</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons inside Spotlight Card */}
                      <div className="relative z-10 space-y-2 pt-3 border-t border-white/15 mt-3">
                        <button
                          type="button"
                          onClick={() => {
                            setServicesDropdownOpen(false);
                            onOpenCustomizer();
                          }}
                          className="w-full py-2 px-3 bg-[#D1E0FF] hover:bg-[#b8d0ff] text-[#06163c] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Open 3D Mockup Studio</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setServicesDropdownOpen(false);
                            onOpenQuoteModal();
                          }}
                          className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-200" />
                          <span>Instant Price Matrix (KSh)</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Mega Menu Footer */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 bg-slate-50 -mx-6 -mb-6 p-4 px-6 rounded-b-3xl flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                    <div className="flex flex-wrap items-center gap-5">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Award className="w-3.5 h-3.5 text-[#06163c]" />
                        <span><strong>50,000+</strong> Monthly Production</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-emerald-600" />
                        <span><strong>48-Hour</strong> Free Digital Proofs</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        <Truck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Countrywide Delivery Across Kenya</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 text-[11px]">Factory Hotline:</span>
                      <a
                        href="tel:0728102929"
                        className="font-mono font-bold text-[#06163c] hover:underline flex items-center gap-1 text-xs"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#06163c]" />
                        <span>0728102929</span>
                      </a>
                    </div>
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

          {/* Action CTAs - Four Right-Side Icon Buttons */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-2.5">
            {/* 1. Size Guide Icon Button */}
            <div className="relative group">
              <button
                id="navbar-size-guide-btn"
                onClick={onOpenSizeGuide}
                className="btn-shimmer-sweep relative flex items-center justify-center w-10 h-10 rounded-xl text-blue-100 hover:text-white bg-blue-950/60 hover:bg-blue-900/90 border border-blue-400/30 hover:border-cyan-400/80 transition-all duration-200 shadow-sm hover:shadow-[0_0_16px_rgba(56,189,248,0.35)] hover:scale-110 hover:-translate-y-0.5 active:scale-90 cursor-pointer"
                aria-label="Size Guide & Fabric Specifications"
                title="Size Guide"
              >
                <Ruler className="w-5 h-5 text-blue-200 group-hover:text-cyan-300 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
              </button>
              {/* Floating Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 bg-slate-950/95 text-white text-[11px] font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none shadow-xl border border-slate-700/70 z-50">
                <span>Size Guide</span>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-950 rotate-45 border-l border-t border-slate-700/70" />
              </div>
            </div>

            {/* 2. Live Mockup Studio Icon Button */}
            <div className="relative group">
              <button
                id="navbar-live-mockup-btn"
                type="button"
                onClick={onOpenCustomizer}
                className="btn-shimmer-sweep relative flex items-center justify-center w-10 h-10 rounded-xl text-white bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-500 hover:to-indigo-600 border border-blue-300/40 hover:border-cyan-300/80 transition-all duration-200 shadow-sm hover:shadow-[0_0_18px_rgba(59,130,246,0.5)] hover:scale-110 hover:-translate-y-0.5 active:scale-90 cursor-pointer"
                aria-label="Launch 3D Live Mockup Studio"
                title="Live 3D Mockup Studio"
              >
                <Sparkles className="w-5 h-5 text-cyan-200 group-hover:text-white group-hover:rotate-45 group-hover:scale-120 transition-all duration-300" />
              </button>
              {/* Floating Tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 bg-slate-950/95 text-white text-[11px] font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none shadow-xl border border-slate-700/70 z-50">
                <span>3D Live Mockup</span>
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-950 rotate-45 border-l border-t border-slate-700/70" />
              </div>
            </div>

            {/* 3. Admin ERP Suite Portal Icon Button */}
            {onOpenAdminERP && (
              <div className="relative group">
                <button
                  id="navbar-admin-erp-btn"
                  type="button"
                  onClick={onOpenAdminERP}
                  className={`btn-shimmer-sweep relative flex items-center justify-center h-10 rounded-xl transition-all duration-200 shadow-sm hover:scale-110 hover:-translate-y-0.5 active:scale-90 cursor-pointer ${
                    isAuthenticated && currentUser
                      ? 'px-2.5 gap-2 bg-blue-950/80 hover:bg-blue-900 border border-blue-400/50 hover:border-blue-300 text-white hover:shadow-[0_0_16px_rgba(56,189,248,0.3)]'
                      : 'w-10 text-emerald-200 hover:text-emerald-100 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 hover:border-emerald-400/80 hover:shadow-[0_0_16px_rgba(16,185,129,0.4)]'
                  }`}
                  aria-label={isAuthenticated ? `Admin: ${currentUser?.name}` : 'Open Enterprise Admin ERP (Ksh)'}
                  title={isAuthenticated ? `Admin: ${currentUser?.name} (${currentUser?.role})` : 'Admin Login & ERP (Ksh)'}
                >
                  {isAuthenticated && currentUser ? (
                    <>
                      <div className="relative shrink-0">
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="w-6 h-6 rounded-full object-cover border border-sky-400"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#06163c]" />
                      </div>
                      <span className="text-xs font-bold text-sky-200 hidden xl:inline max-w-[90px] truncate">
                        {currentUser.name.split(' ')[0]}
                      </span>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-5 h-5 text-emerald-400 group-hover:text-emerald-200 group-hover:scale-115 transition-all duration-200" />
                      {/* Live Active Status Indicator Dot */}
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
                    </>
                  )}
                </button>
                {/* Floating Tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1 bg-slate-950/95 text-white text-[11px] font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none shadow-xl border border-slate-700/70 z-50">
                  <span>
                    {isAuthenticated && currentUser
                      ? `Admin: ${currentUser.name} (${currentUser.role})`
                      : 'Admin Login & ERP (Ksh)'}
                  </span>
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-950 rotate-45 border-l border-t border-slate-700/70" />
                </div>
              </div>
            )}

            {/* 4. Quote Request / Cart Icon Button */}
            <div className="relative group">
              <button
                id="navbar-quote-cart-btn"
                onClick={onOpenQuoteModal}
                className="btn-shimmer-sweep relative flex items-center justify-center w-10 h-10 rounded-xl bg-white hover:bg-blue-50 text-[#06163c] border border-white/90 shadow-md hover:shadow-[0_0_18px_rgba(255,255,255,0.5)] hover:scale-110 hover:-translate-y-0.5 active:scale-90 transition-all duration-200 cursor-pointer"
                aria-label="View Quote Cart"
                title="Quote Cart"
              >
                <ShoppingBag className="w-5 h-5 text-[#06163c] group-hover:scale-115 group-hover:-rotate-12 transition-transform duration-200" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-5 px-1 text-[11px] font-black bg-[#06163c] text-white rounded-full border-2 border-white shadow-md animate-scaleIn">
                    {totalItemsCount}
                  </span>
                )}
              </button>
              {/* Floating Tooltip */}
              <div className="absolute top-full right-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 px-2.5 py-1 bg-slate-950/95 text-white text-[11px] font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none shadow-xl border border-slate-700/70 z-50">
                <span>Quote Cart {totalItemsCount > 0 ? `(${totalItemsCount})` : ''}</span>
                <div className="absolute -top-1 right-3 sm:left-1/2 sm:-translate-x-1/2 w-2 h-2 bg-slate-950 rotate-45 border-l border-t border-slate-700/70" />
              </div>
            </div>

            {/* 5. Desktop Hamburger Menu Toggle Button */}
            <div className="relative group">
              <button
                id="navbar-desktop-hamburger-btn"
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`btn-shimmer-sweep relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 shadow-sm hover:scale-110 hover:-translate-y-0.5 active:scale-90 cursor-pointer ${
                  mobileMenuOpen
                    ? 'bg-white text-[#06163c] border border-white shadow-md'
                    : 'bg-white/10 hover:bg-white text-white hover:text-[#06163c] border border-white/20 hover:border-white hover:shadow-[0_0_16px_rgba(255,255,255,0.4)]'
                }`}
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                title="Navigation Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 transition-transform duration-200 group-hover:rotate-90" />
                ) : (
                  <Menu className="w-5 h-5 transition-transform duration-200 group-hover:scale-115" />
                )}
              </button>
              {/* Floating Tooltip */}
              <div className="absolute top-full right-0 mt-2 px-2.5 py-1 bg-slate-950/95 text-white text-[11px] font-bold rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none shadow-xl border border-slate-700/70 z-50">
                <span>{mobileMenuOpen ? 'Close Menu' : 'Navigation & Quick Links'}</span>
                <div className="absolute -top-1 right-3.5 w-2 h-2 bg-slate-950 rotate-45 border-l border-t border-slate-700/70" />
              </div>
            </div>
          </div>

          {/* Mobile menu toggle button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              id="mobile-quote-btn"
              onClick={onOpenQuoteModal}
              className="relative p-2.5 text-[#06163c] bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200/90 rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
              aria-label="View Quote Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#06163c]" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black bg-[#06163c] text-white rounded-full border-2 border-white shadow-xs">
                  {totalItemsCount}
                </span>
              )}
            </button>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-[#06163c] bg-white hover:bg-slate-100 active:bg-slate-200 border border-slate-200/90 rounded-xl shadow-sm focus:outline-none transition-all active:scale-95 cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#06163c]" /> : <Menu className="w-5 h-5 text-[#06163c]" />}
            </button>
          </div>
        </div>

        {/* Responsive Hamburger Navigation Drawer (Full screen on mobile, right slide-over on desktop) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop for desktop with blur and click-to-close */}
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-fadeIn"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-over Drawer Panel */}
            <div className="relative z-10 w-full sm:w-[500px] lg:w-[540px] h-full bg-white text-slate-900 flex flex-col shadow-2xl overflow-hidden animate-slide-in-right">
              {/* Header Bar with logo & close */}
              <div className="relative bg-white/95 backdrop-blur-md shrink-0 shadow-xs border-b border-slate-200/80">
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <NasisiLogo size="lg" showTagline={true} tagline="We stitch it, You wear it, We print it, you represent." />
                    <span className="px-2 py-0.5 bg-blue-50 text-[#06163c] text-[10px] font-black uppercase rounded-md tracking-wider border border-blue-200">
                      Menu
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenQuoteModal();
                      }}
                      className="relative p-2.5 text-[#06163c] bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                      aria-label="View Quote Cart"
                      title="Quote Cart"
                    >
                      <ShoppingBag className="w-5 h-5 text-[#06163c]" />
                      {totalItemsCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black bg-[#06163c] text-white rounded-full">
                          {totalItemsCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-colors cursor-pointer"
                      aria-label="Close Menu"
                      title="Close Menu (Esc)"
                    >
                      <X className="w-5 h-5 text-slate-800" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Scrollable Body */}
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
                  className="w-full pl-10 pr-9 py-3 text-xs text-slate-900 placeholder-slate-400 bg-slate-100/80 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#06163c] focus:bg-white transition-all shadow-2xs"
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
                      <span className="text-[#06163c] font-bold">{matchingNavProducts.length} items</span>
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
                            <span className="text-xs font-extrabold text-[#06163c] block">
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
                  className="p-3.5 rounded-2xl bg-gradient-to-tr from-[#06163c] to-[#024177] text-white flex flex-col justify-between items-start text-left shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
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
                  className="flex items-center justify-between px-3.5 py-3 text-sm font-bold text-slate-800 hover:text-[#06163c] hover:bg-slate-100/80 rounded-xl transition-colors"
                >
                  <span>Home</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </a>

                {/* Services Expandable Accordion */}
                <div className="rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="w-full flex items-center justify-between px-3.5 py-3 text-sm font-bold text-slate-800 hover:text-[#06163c] hover:bg-slate-100/80 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Factory className="w-4 h-4 text-[#06163c]" />
                      <span>Manufacturing Services</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                        mobileServicesOpen ? 'rotate-180 text-[#06163c]' : ''
                      }`}
                    />
                  </button>

                  {mobileServicesOpen && (
                    <div className="bg-slate-50 p-3 space-y-3 rounded-xl my-1 border border-slate-200/80">
                      {/* Section 1: Garment Manufacturing */}
                      <div>
                        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-black uppercase text-[#06163c] tracking-wider">
                          <Shirt className="w-3 h-3 text-[#06163c]" />
                          <span>Garment Manufacturing</span>
                        </div>
                        <div className="space-y-1 mt-1">
                          {megaManufacturingServices.map((sub) => {
                            const SubIcon = sub.icon;
                            return (
                              <a
                                key={sub.id}
                                href={sub.href}
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  setMobileServicesOpen(false);
                                }}
                                className="flex items-start gap-2.5 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-[#06163c] hover:bg-white rounded-lg transition-colors"
                              >
                                <SubIcon className="w-4 h-4 text-[#06163c] mt-0.5 shrink-0" />
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-900 leading-tight">{sub.title}</div>
                                  <div className="text-[10px] text-slate-500 line-clamp-1">{sub.description}</div>
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      </div>

                      {/* Section 2: Branding & Printing */}
                      <div className="border-t border-slate-200/60 pt-2">
                        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-black uppercase text-blue-700 tracking-wider">
                          <Palette className="w-3 h-3 text-blue-600" />
                          <span>Industrial Branding</span>
                        </div>
                        <div className="space-y-1 mt-1">
                          {megaBrandingTechniques.map((sub) => {
                            const SubIcon = sub.icon;
                            return (
                              <a
                                key={sub.id}
                                href={sub.href}
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  setMobileServicesOpen(false);
                                }}
                                className="flex items-start gap-2.5 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-[#06163c] hover:bg-white rounded-lg transition-colors"
                              >
                                <SubIcon className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-900 leading-tight">{sub.title}</div>
                                  <div className="text-[10px] text-slate-500 line-clamp-1">{sub.description}</div>
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      </div>

                      {/* Section 3: Digital & Tools */}
                      <div className="border-t border-slate-200/60 pt-2">
                        <div className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-black uppercase text-emerald-700 tracking-wider">
                          <Zap className="w-3 h-3 text-emerald-600" />
                          <span>Digital Studio & Pricing</span>
                        </div>
                        <div className="space-y-1 mt-1">
                          {megaDigitalAndTurnkey.map((sub) => {
                            const SubIcon = sub.icon;
                            const handleClick = () => {
                              setMobileMenuOpen(false);
                              setMobileServicesOpen(false);
                              if (sub.isCustomizer) onOpenCustomizer();
                              else if (sub.isQuote) onOpenQuoteModal();
                              else if (sub.isSizeGuide) onOpenSizeGuide();
                            };
                            return (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={handleClick}
                                className="w-full text-left flex items-start gap-2.5 px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-800 hover:bg-white rounded-lg transition-colors cursor-pointer"
                              >
                                <SubIcon className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                                <div className="min-w-0">
                                  <div className="font-bold text-slate-900 leading-tight">{sub.title}</div>
                                  <div className="text-[10px] text-slate-500 line-clamp-1">{sub.description}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <a
                  href="#catalog"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 text-sm font-bold text-slate-800 hover:text-[#06163c] hover:bg-slate-100/80 rounded-xl transition-colors"
                >
                  <span>Uniform Catalog</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </a>

                <a
                  href="#portfolio"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 text-sm font-bold text-slate-800 hover:text-[#06163c] hover:bg-slate-100/80 rounded-xl transition-colors"
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
                  className="w-full flex items-center justify-between px-3.5 py-3 text-sm font-bold text-slate-800 hover:text-[#06163c] hover:bg-slate-100/80 rounded-xl transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-2">
                    <Ruler className="w-4 h-4 text-[#06163c]" />
                    <span>Size & Fabric Standards</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>

                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 text-sm font-bold text-slate-800 hover:text-[#06163c] hover:bg-slate-100/80 rounded-xl transition-colors"
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
                    className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer ${
                      isAuthenticated && currentUser
                        ? 'bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-100 border-blue-300 text-blue-950'
                        : 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 border-emerald-300 text-emerald-950'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isAuthenticated && currentUser ? (
                        <div className="relative shrink-0">
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-10 h-10 rounded-xl object-cover border border-blue-400"
                          />
                          <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs">
                          <Building2 className="w-5 h-5" />
                        </div>
                      )}
                      <div className="text-left">
                        <span className="text-xs font-black block">
                          {isAuthenticated && currentUser
                            ? `${currentUser.name} (Admin)`
                            : 'Factory ERP & Invoicing Center'}
                        </span>
                        <span className="text-[10px] text-slate-600 font-mono">
                          {isAuthenticated && currentUser
                            ? `${currentUser.role} • Tap to enter ERP`
                            : 'M-Pesa STK, Quotations & Receipts (Ksh)'}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-700" />
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
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-xs font-bold text-[#06163c] shadow-2xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#06163c]" />
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

                {/* Mobile Legal Policy Links */}
                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-around text-[11px] text-slate-500 font-medium">
                  {onOpenPrivacyPolicy && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenPrivacyPolicy();
                      }}
                      className="hover:text-[#06163c] hover:underline"
                    >
                      Privacy
                    </button>
                  )}
                  <span>•</span>
                  {onOpenTerms && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenTerms();
                      }}
                      className="hover:text-[#06163c] hover:underline"
                    >
                      Terms
                    </button>
                  )}
                  <span>•</span>
                  {onOpenCookies && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenCookies();
                      }}
                      className="hover:text-[#06163c] hover:underline"
                    >
                      Cookies
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Clean Wave Curve on the Bottom Edge matching the header bar color */}
      <div className="absolute top-full left-0 right-0 w-full overflow-hidden leading-none pointer-events-none -mt-[1px]">
        <svg
          className="w-full h-7 sm:h-9 md:h-10 lg:h-12 block relative z-10"
          viewBox="0 0 1440 60"
          fill="none"
          preserveAspectRatio="none"
        >
          {/* Main wave fill matching header bar color (#06163c) */}
          <path
            d="M0,0 L1440,0 L1440,20 C1040,56 400,-6 0,36 Z"
            fill="#06163c"
          />
        </svg>
      </div>
    </motion.header>
  );
};
