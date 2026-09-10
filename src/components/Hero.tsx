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
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
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

      {/* Hero image is completely clear without gradient overlays on pristine white background */}

      {/* Left / Right Navigation Buttons (Visible on hover & touch) */}
      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous banner"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-800 hover:text-[#06163c] border border-slate-200/80 shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-sm"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next banner"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-800 hover:text-[#06163c] border border-slate-200/80 shadow-lg transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-sm"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Minimalist Progress Indicators & Playback Controls */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 right-4 sm:right-8 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 shadow-md">
          {heroConfig.autoPlay && (
            <>
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                aria-label={isPaused ? 'Resume auto-play' : 'Pause auto-play'}
                className="text-slate-600 hover:text-slate-900 transition-colors p-0.5 cursor-pointer"
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
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
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeBanner === idx
                    ? 'bg-[#06163c] w-5 shadow-xs'
                    : 'bg-slate-300 hover:bg-slate-400 w-1.5'
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


