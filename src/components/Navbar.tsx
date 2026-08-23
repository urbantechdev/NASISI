import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { NasisiLogo } from './NasisiLogo';
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
} from 'lucide-react';
import { QuoteItem } from '../types';

interface NavbarProps {
  quoteItems: QuoteItem[];
  onOpenQuoteModal: () => void;
  onOpenCustomizer: () => void;
  onOpenSizeGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  quoteItems,
  onOpenQuoteModal,
  onOpenCustomizer,
  onOpenSizeGuide,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              className="relative p-2 text-white bg-blue-900/60 hover:bg-blue-800/80 border border-blue-400/30 rounded-lg"
              aria-label="View Quote"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-black bg-white text-[#032345] rounded-full">
                  {totalItemsCount}
                </span>
              )}
            </button>

            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:text-blue-200 bg-blue-900/60 hover:bg-blue-800/80 border border-blue-400/30 rounded-lg focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 pb-4 border-t border-blue-900/60 bg-[#021b36] rounded-xl shadow-2xl px-4 space-y-3 animate-fadeIn">
            <div className="grid grid-cols-1 gap-1">
              {/* Mobile Home */}
              <a
                href="#"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-bold text-white hover:bg-blue-900/60 rounded-lg transition-colors"
              >
                Home
              </a>

              {/* Mobile Services Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-white hover:bg-blue-900/60 rounded-lg transition-colors"
                >
                  <span>Services</span>
                  <ChevronDown
                    className={`w-4 h-4 text-blue-300 transition-transform ${
                      mobileServicesOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>

                {mobileServicesOpen && (
                  <div className="ml-3 pl-3 border-l-2 border-blue-500/50 space-y-1 my-1">
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
                            className="w-full text-left flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-blue-200 hover:text-white hover:bg-blue-900/40 rounded-md transition-colors cursor-pointer"
                          >
                            <SubIcon className="w-3.5 h-3.5 text-blue-300" />
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
                          className="flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-blue-200 hover:text-white hover:bg-blue-900/40 rounded-md transition-colors"
                        >
                          <SubIcon className="w-3.5 h-3.5 text-blue-300" />
                          <span>{sub.title}</span>
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Mobile Products */}
              <a
                href="#catalog"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-bold text-white hover:bg-blue-900/60 rounded-lg transition-colors"
              >
                Products
              </a>

              {/* Mobile Contact */}
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-bold text-white hover:bg-blue-900/60 rounded-lg transition-colors"
              >
                Contact
              </a>
            </div>

            <div className="pt-3 border-t border-blue-900/60 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCustomizer();
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-white bg-blue-700/80 hover:bg-blue-600 rounded-lg border border-blue-400/40 shadow-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-blue-200" />
                <span>Live Uniform Mockup Studio</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSizeGuide();
                }}
                className="flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold text-blue-100 bg-blue-900/60 hover:bg-blue-800 rounded-lg border border-blue-400/30"
              >
                <Ruler className="w-4 h-4 text-blue-300" />
                <span>View Sizing & Fabric Chart</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuoteModal();
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-[#032345] bg-white hover:bg-blue-50 rounded-lg shadow"
              >
                <FileText className="w-4 h-4 text-[#032345]" />
                <span>Instant Quote Request ({totalItemsCount} items)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Wave Curve on the Bottom Edge with Visible White Border, White Glow & Motion */}
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
        <svg
          className="w-full h-6 sm:h-8 md:h-10 lg:h-12 block"
          viewBox="0 0 1440 60"
          fill="none"
          preserveAspectRatio="none"
        >
          {/* Main wave fill */}
          <path
            d="M0,0 L1440,0 L1440,28 C1080,58 360,2 0,38 Z"
            fill="#032345"
          />
          {/* Glowing White Bottom Wave Contour Edge */}
          <path
            d="M0,38 C360,2 1080,58 1440,28"
            stroke="rgba(255, 255, 255, 0.95)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          {/* Secondary subtle soft white highlight line for depth */}
          <path
            d="M0,36 C360,1 1080,56 1440,26"
            stroke="rgba(255, 255, 255, 0.35)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </motion.div>
    </motion.header>
  );
};
