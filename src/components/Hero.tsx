import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      aria-label="Hero Visual Banner"
      className="relative w-full h-56 sm:h-72 md:h-88 lg:h-[400px] overflow-hidden bg-[#032345]"
    >
      {/* Background Visual: Tailoring, Fabric & Uniform Craftsmanship */}
      <img
        src="https://j4m9t8n5.delivery.rocketcdn.me/wp-content/uploads/2020/05/Maxcool_1.jpg.webp"
        alt="Tailoring and Uniform Craftsmanship"
        className="w-full h-full object-cover object-center opacity-90"
        loading="eager"
        referrerPolicy="no-referrer"
        onError={(e) => {
          // Fallback to local hero asset or high-res tailoring textile image if needed
          e.currentTarget.src = "/assets/images/hero-banner.jpg";
        }}
      />
      {/* Subtle brand blue depth overlay - strictly no text, no items */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#032345]/50 via-transparent to-[#032345]/20 pointer-events-none" />

      {/* Curved Bottom Edge Single Wave Design */}
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
            fill="rgba(3, 35, 69, 0.2)"
            className="blur-[2px]"
          />
          {/* Single wave shape blending seamlessly into page canvas (#F8FAFC) */}
          <path
            d="M0,30 C500,80 940,-10 1440,45 L1440,80 L0,80 Z"
            fill="#F8FAFC"
          />
          {/* Soft luminous wave crest rim line */}
          <path
            d="M0,30 C500,80 940,-10 1440,45"
            stroke="rgba(255, 255, 255, 0.45)"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>
    </section>
  );
};

