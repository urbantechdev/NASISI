import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { INITIAL_HERO_SLIDES } from '../data/heroData';

export const Hero: React.FC = () => {
  const { heroSlides, heroConfig } = useERP();

  // Active slides sorted by order, fallback to default if empty
  const banners = useMemo(() => {
    const active = heroSlides
      .filter((s) => s.isActive !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return active.length > 0 ? active : INITIAL_HERO_SLIDES;
  }, [heroSlides]);

  const [activeBanner, setActiveBanner] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Keep index within bounds if slides count changes
  useEffect(() => {
    if (activeBanner >= banners.length) {
      setActiveBanner(0);
    }
  }, [banners.length, activeBanner]);

  const nextSlide = useCallback(() => {
    setActiveBanner((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    setActiveBanner((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  // Auto-play slideshow according to heroConfig
  useEffect(() => {
    if (isPaused || !heroConfig.autoPlay || banners.length <= 1) return;
    const intervalMs = heroConfig.autoPlayIntervalMs || 5500;
    const interval = setInterval(() => {
      nextSlide();
    }, intervalMs);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, heroConfig.autoPlay, heroConfig.autoPlayIntervalMs, banners.length]);

  const heightClass =
    heroConfig.heightPreset === 'compact'
      ? 'h-64 sm:h-72 md:h-[340px] lg:h-[380px]'
      : heroConfig.heightPreset === 'tall'
      ? 'h-80 sm:h-96 md:h-[500px] lg:h-[560px]'
      : 'h-72 sm:h-88 md:h-[420px] lg:h-[480px]';

  const currentSlide = banners[activeBanner] || banners[0];

  return (
    <section
      id="hero"
      aria-label="Hero Visual Banner"
      onMouseEnter={() => {
        if (heroConfig.pauseOnHover !== false) setIsPaused(true);
      }}
      onMouseLeave={() => {
        if (heroConfig.pauseOnHover !== false) setIsPaused(false);
      }}
      className={`relative w-full ${heightClass} overflow-hidden bg-white group select-none transition-all duration-300`}
    >
      {/* Animated Background Banner with Ken Burns Effect */}
      <AnimatePresence mode="sync">
        <motion.div
          key={currentSlide.id || activeBanner}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1.08 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.0, ease: 'easeInOut' },
            scale: { duration: 6.5, ease: 'easeOut' },
          }}
          className="absolute inset-0 w-full h-full bg-white"
        >
          <img
            src={currentSlide.src}
            alt={currentSlide.alt || currentSlide.title}
            className="w-full h-full object-cover object-center brightness-100 contrast-100"
            loading="eager"
            referrerPolicy="no-referrer"
          />
        </motion.div>
      </AnimatePresence>

      {/* Slight White Gradient Overlay on top of the hero image */}
      <div
        className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 ${
          heroConfig.showOverlayText
            ? 'bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent'
            : 'bg-gradient-to-b from-white/70 via-white/20 to-transparent'
        }`}
        aria-hidden="true"
      />

      {/* Optional Storefront Slide Caption Overlay if enabled by Banner Settings */}
      {heroConfig.showOverlayText && (
        <div
          className={`absolute inset-0 z-15 flex flex-col justify-center px-6 sm:px-12 md:px-20 pointer-events-none ${
            heroConfig.textAlignment === 'center' ? 'items-center text-center' : 'items-start text-left'
          }`}
        >
          <div className="max-w-2xl">
            {heroConfig.showBadges !== false && currentSlide.badge && (
              <motion.span
                key={`badge-${currentSlide.id || activeBanner}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-sky-300 border border-sky-400/30 text-xs font-black uppercase tracking-wider mb-2"
              >
                {currentSlide.badge}
              </motion.span>
            )}

            <motion.h2
              key={`title-${currentSlide.id || activeBanner}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-lg font-['Outfit']"
            >
              {currentSlide.title}
            </motion.h2>

            {currentSlide.subtitle && (
              <motion.p
                key={`sub-${currentSlide.id || activeBanner}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xs sm:text-sm md:text-base text-slate-100 mt-2 max-w-xl drop-shadow line-clamp-2"
              >
                {currentSlide.subtitle}
              </motion.p>
            )}

            {heroConfig.showActionButtons && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`flex flex-wrap gap-3 mt-4 pointer-events-auto ${
                  heroConfig.textAlignment === 'center' ? 'justify-center' : 'justify-start'
                }`}
              >
                <a
                  href="#catalog"
                  className="px-5 py-2.5 rounded-xl bg-[#06163c] text-white font-bold text-xs shadow-lg hover:bg-blue-900 transition-all cursor-pointer"
                >
                  Explore Catalog
                </a>
                <a
                  href="#contact"
                  className="px-5 py-2.5 rounded-xl bg-white/90 text-slate-900 font-bold text-xs shadow-lg hover:bg-white transition-all cursor-pointer backdrop-blur-md"
                >
                  Request Quote
                </a>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Left / Right Navigation Buttons (Visible on hover & touch) */}
      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous banner"
            className="group/arrow absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-[#06163c] border border-slate-200 shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-115 hover:shadow-2xl hover:border-blue-300 active:scale-90 cursor-pointer backdrop-blur-md"
          >
            <ChevronLeft className="w-5 h-5 transition-transform duration-200 group-hover/arrow:-translate-x-0.5" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next banner"
            className="group/arrow absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/95 hover:bg-white text-slate-800 hover:text-[#06163c] border border-slate-200 shadow-xl transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-115 hover:shadow-2xl hover:border-blue-300 active:scale-90 cursor-pointer backdrop-blur-md"
          >
            <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover/arrow:translate-x-0.5" />
          </button>
        </>
      )}

      {/* Minimalist Progress Indicators & Playback Controls */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 right-4 sm:right-8 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-200 shadow-md hover:shadow-lg transition-shadow duration-300">
          {heroConfig.autoPlay && (
            <>
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                aria-label={isPaused ? 'Resume auto-play' : 'Pause auto-play'}
                className="text-slate-600 hover:text-slate-900 hover:scale-115 active:scale-90 transition-all duration-200 p-0.5 cursor-pointer"
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>

              <div className="h-2.5 w-px bg-slate-200" />
            </>
          )}

          <div className="flex items-center gap-1.5">
            {banners.map((b, idx) => (
              <button
                key={b.id || idx}
                type="button"
                onClick={() => setActiveBanner(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeBanner === idx
                    ? 'bg-[#06163c] w-6 shadow-xs scale-105'
                    : 'bg-slate-300 hover:bg-slate-500 hover:scale-125 w-2'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Curved Bottom Edge Single Wave Design blending into white page canvas */}
      {heroConfig.showWaveDivider !== false && (
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10">
          <svg
            className="relative block w-full h-8 sm:h-12 md:h-16 lg:h-20"
            viewBox="0 0 1440 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            {/* Subtle wave shadow for realistic depth */}
            <path
              d="M0,28 C500,78 940,-12 1440,43 L1440,80 L0,80 Z"
              fill="rgba(3, 35, 69, 0.04)"
              className="blur-[2px]"
            />
            {/* Single wave shape blending seamlessly into white page canvas (#ffffff) */}
            <path
              d="M0,30 C500,80 940,-10 1440,45 L1440,80 L0,80 Z"
              fill="#ffffff"
            />
            {/* Soft luminous wave crest rim line */}
            <path
              d="M0,30 C500,80 940,-10 1440,45"
              stroke="rgba(226, 232, 240, 0.8)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </div>
      )}
    </section>
  );
};


