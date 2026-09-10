import React from 'react';

interface NasisiLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'compact' | 'icon-only' | 'white';
  showTagline?: boolean;
  tagline?: string;
}

export const NasisiLogo: React.FC<NasisiLogoProps> = ({
  className = '',
  size = 'md',
  variant = 'full',
  showTagline = true,
  tagline = 'We stitch it, You wear it, We print it, you represent.',
}) => {
  const isWhite = variant === 'white';
  const primaryBlue = isWhite ? '#FFFFFF' : '#06163c';
  const darkBlue = isWhite ? '#E0ECFF' : '#02162B';
  const lightBlue = isWhite ? '#93C5FD' : '#0E447B';

  const getDimensions = () => {
    switch (size) {
      case 'sm':
        return {
          iconSize: 36,
          textSize: 'text-lg',
          subSize: 'text-[9px]',
          taglineSize: 'text-[7px]',
          taglineMaxW: 'max-w-[180px]',
        };
      case 'lg':
        return {
          iconSize: 64,
          textSize: 'text-3xl',
          subSize: 'text-xs',
          taglineSize: 'text-[9px] sm:text-[10px]',
          taglineMaxW: 'max-w-[280px] sm:max-w-none',
        };
      case 'xl':
        return {
          iconSize: 96,
          textSize: 'text-3xl sm:text-4xl',
          subSize: 'text-xs sm:text-sm',
          taglineSize: 'text-[10px] sm:text-xs',
          taglineMaxW: 'max-w-[320px] sm:max-w-none',
        };
      case '2xl':
        return {
          iconSize: 128,
          textSize: 'text-4xl sm:text-5xl',
          subSize: 'text-sm sm:text-base',
          taglineSize: 'text-xs sm:text-sm',
          taglineMaxW: 'max-w-none',
        };
      case 'md':
      default:
        return {
          iconSize: 48,
          textSize: 'text-2xl',
          subSize: 'text-[10px]',
          taglineSize: 'text-[7.5px] sm:text-[8px]',
          taglineMaxW: 'max-w-[225px] xs:max-w-[280px] sm:max-w-none',
        };
    }
  };

  const { iconSize, textSize, subSize, taglineSize, taglineMaxW } = getDimensions();

  // SVG Icon representing the NASISI Monogram N with needle, thread, stitch, t-shirt, and screen print squeegee
  const LogoIcon = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0 transition-transform duration-300 hover:scale-105"
    >
      <defs>
        <linearGradient id={`n-grad-${variant}`} x1="30" y1="20" x2="170" y2="180" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isWhite ? '#FFFFFF' : '#143175'} />
          <stop offset="60%" stopColor={isWhite ? '#BFDBFE' : '#06163c'} />
          <stop offset="100%" stopColor={isWhite ? '#93C5FD' : '#020a1c'} />
        </linearGradient>
        <linearGradient id={`tshirt-grad-${variant}`} x1="100" y1="20" x2="160" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={isWhite ? '#FFFFFF' : '#104A8B'} />
          <stop offset="60%" stopColor={isWhite ? '#93C5FD' : '#06163c'} />
          <stop offset="100%" stopColor={isWhite ? '#DBEAFE' : '#020a1c'} />
        </linearGradient>
      </defs>

      {/* Outer circular badge guide */}
      <circle
        cx="100"
        cy="100"
        r="88"
        stroke={isWhite ? '#FFFFFF' : primaryBlue}
        strokeWidth="4"
        strokeDasharray="180 20 60 15"
        className="opacity-90"
      />

      {/* Monogram 'N' Main Silhouette */}
      {/* Left Column of N (Needle & Stitched Column) */}
      <path
        d="M 52 148 L 52 48 C 52 40, 68 40, 68 48 L 68 148 C 68 152, 52 152, 52 148 Z"
        fill={`url(#n-grad-${variant})`}
      />

      {/* Needle Eye & Thread looping over top */}
      <circle cx="60" cy="38" r="4.5" fill={isWhite ? '#06163c' : '#FFFFFF'} />
      <path
        d="M 60 38 C 30 30, 26 65, 46 72 C 58 76, 75 70, 92 84"
        stroke={isWhite ? '#FFFFFF' : primaryBlue}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Vertical Stitches on Left Column */}
      <line x1="60" y1="55" x2="60" y2="65" stroke={isWhite ? '#93C5FD' : '#FFFFFF'} strokeWidth="2.5" strokeDasharray="3 3" />
      <line x1="60" y1="72" x2="60" y2="142" stroke={isWhite ? '#93C5FD' : '#FFFFFF'} strokeWidth="2.5" strokeDasharray="5 4" strokeLinecap="round" />

      {/* Diagonal Bar of N */}
      <path
        d="M 66 50 L 138 154 L 122 154 L 52 50 Z"
        fill={`url(#n-grad-${variant})`}
      />

      {/* Knit Ribbed Texture lines on diagonal */}
      <path
        d="M 78 68 L 126 142"
        stroke={isWhite ? '#DBEAFE' : '#93C5FD'}
        strokeWidth="2"
        strokeDasharray="4 3"
      />

      {/* Right Column / T-shirt Silhouette & Screen Printing Press */}
      {/* T-Shirt Top Right */}
      <path
        d="M 112 36 C 122 42, 138 42, 148 36 L 165 48 L 152 64 L 140 56 L 140 100 L 118 100 L 118 48 Z"
        fill={`url(#tshirt-grad-${variant})`}
      />
      {/* T-shirt Collar cutout */}
      <path
        d="M 120 36 C 126 44, 134 44, 140 36"
        stroke={isWhite ? '#06163c' : '#FFFFFF'}
        strokeWidth="2"
        fill="none"
      />

      {/* Screen Printing Squeegee / Press Block at Bottom Right */}
      <rect x="114" y="112" width="38" height="12" rx="2" fill={isWhite ? '#FFFFFF' : darkBlue} />
      <path d="M 126 104 L 140 104 L 140 112 L 126 112 Z" fill={isWhite ? '#93C5FD' : lightBlue} />
      {/* Squeegee handle */}
      <rect x="130" y="96" width="6" height="8" rx="1.5" fill={isWhite ? '#FFFFFF' : primaryBlue} />

      {/* Pixel / Screen Print Dispersion Dots */}
      <rect x="156" y="114" width="4" height="4" fill={isWhite ? '#FFFFFF' : primaryBlue} />
      <rect x="162" y="118" width="4" height="4" fill={isWhite ? '#FFFFFF' : primaryBlue} />
      <rect x="156" y="124" width="4" height="4" fill={isWhite ? '#FFFFFF' : primaryBlue} />
      <rect x="164" y="128" width="4" height="4" fill={isWhite ? '#FFFFFF' : primaryBlue} />
      <rect x="170" y="122" width="3" height="3" fill={isWhite ? '#FFFFFF' : primaryBlue} />
    </svg>
  );

  if (variant === 'icon-only') {
    return <div className={`inline-flex items-center ${className}`}>{LogoIcon}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-3 sm:gap-3.5 select-none ${className}`}>
      {LogoIcon}
      
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-['Outfit',sans-serif] font-black tracking-wider ${textSize} leading-none ${
              isWhite ? 'text-white' : 'text-[#06163c]'
            }`}
          >
            NASISI
          </span>
        </div>
        
        <span
          className={`font-semibold tracking-[0.2em] uppercase ${subSize} mt-1 ${
            isWhite ? 'text-blue-200' : 'text-slate-700'
          }`}
        >
          Knitwear & Graphics
        </span>

        {showTagline && (
          <div className={`flex items-center mt-1 pt-1 border-t border-blue-100/40 ${taglineMaxW}`}>
            <span
              className={`${taglineSize} tracking-tight sm:tracking-normal font-medium ${
                isWhite ? 'text-blue-100/90' : 'text-blue-900/80'
              } truncate sm:overflow-visible sm:whitespace-nowrap`}
              title={tagline}
            >
              {tagline}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
