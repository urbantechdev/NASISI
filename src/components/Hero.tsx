import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      aria-label="Hero Visual Banner"
      className="relative w-full h-52 sm:h-72 md:h-88 lg:h-[380px] overflow-hidden bg-[#032345] border-b border-slate-200"
    >
      {/* Background Visual: Tailoring, Fabric & Uniform Craftsmanship */}
      <img
        src="/assets/images/hero-banner.jpg"
        alt="Tailoring and Uniform Craftsmanship"
        className="w-full h-full object-cover object-center opacity-85"
        loading="eager"
        referrerPolicy="no-referrer"
        onError={(e) => {
          // Fallback to high-res tailoring textile image if needed
          e.currentTarget.src = "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1600&q=80";
        }}
      />
      {/* Subtle brand blue depth overlay - strictly no text, no items */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#032345]/50 via-transparent to-[#032345]/20 pointer-events-none" />
    </section>
  );
};

