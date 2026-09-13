import React, { useState, useEffect } from 'react';
import { useERP } from '../context/ERPContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Hero: React.FC = () => {
  const { heroSlides, heroConfig } = useERP();
  const activeSlides = (heroSlides || []).filter((s) => s.isActive);
  const [currentIndex, setCurrentIndex] = useState(0);

  const displaySlides = activeSlides.length > 0 ? activeSlides : heroSlides;

  useEffect(() => {
    if (!heroConfig?.autoPlay || displaySlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displaySlides.length);
    }, heroConfig.autoPlayIntervalMs || 5000);
    return () => clearInterval(timer);
  }, [heroConfig?.autoPlay, heroConfig?.autoPlayIntervalMs, displaySlides.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % displaySlides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
  };

  const heightClasses = {
    compact: 'h-[320px] sm:h-[400px] lg:h-[460px]',
    standard: 'h-[380px] sm:h-[480px] lg:h-[540px]',
    tall: 'h-[440px] sm:h-[560px] lg:h-[640px]',
  }[heroConfig?.heightPreset || 'standard'];

  return (
    <div className={`relative w-full overflow-hidden bg-slate-950 select-none ${heightClasses}`}>
      {displaySlides.map((slide, index) => {
        const isCurrent = index === currentIndex;
        return (
          <div
            key={slide.id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.src}
              alt={slide.alt || slide.title || 'Nasisi Uniforms Showcase'}
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-7000 ease-out"
              referrerPolicy="no-referrer"
            />
            {heroConfig?.showOverlayGradients && (
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-slate-950/40 pointer-events-none" />
            )}
          </div>
        );
      })}

      {/* Top Edge White Gradient Overlay */}
      <div
        className="absolute top-0 left-0 right-0 h-20 sm:h-28 md:h-36 bg-gradient-to-b from-white via-white/50 to-transparent pointer-events-none z-[15]"
        aria-hidden="true"
      />

      {/* Nav Controls if multiple slides */}
      {displaySlides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white/90 flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-black/70 text-white/90 flex items-center justify-center backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Indicator dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {displaySlides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-8 bg-white shadow-md' : 'w-2.5 bg-white/45 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Optional wave divider */}
      {heroConfig?.showWaveDivider && (
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none pointer-events-none z-10">
          <svg
            className="relative block w-full h-8 sm:h-12 text-white fill-current"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,40 L1200,120 L0,120 Z" />
          </svg>
        </div>
      )}
    </div>
  );
};
