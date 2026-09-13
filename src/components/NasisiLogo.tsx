import React from 'react';
import { useERP } from '../context/ERPContext';

interface NasisiLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'white' | 'dark' | 'full';
  showTagline?: boolean;
  tagline?: string;
  className?: string;
  isFooter?: boolean;
}

export const NasisiLogo: React.FC<NasisiLogoProps> = ({
  size = 'md',
  variant = 'dark',
  showTagline = false,
  tagline = 'We stitch it, You wear it, We print it, you represent.',
  className = '',
  isFooter = false,
}) => {
  const { businessProfile } = useERP();
  const [imageError, setImageError] = React.useState(false);

  const customLogoUrl = isFooter
    ? (businessProfile?.footerLogoUrl || businessProfile?.logoUrl)
    : businessProfile?.logoUrl;

  React.useEffect(() => {
    setImageError(false);
  }, [customLogoUrl]);

  const isWhite = variant === 'white' && !isFooter;

  const sizeClasses = {
    sm: { text: 'text-base', sub: 'text-[9px]', icon: 'w-6 h-6', gap: 'gap-2' },
    md: { text: 'text-xl', sub: 'text-[10px]', icon: 'w-8 h-8', gap: 'gap-2.5' },
    lg: { text: 'text-2xl', sub: 'text-[11px]', icon: 'w-10 h-10', gap: 'gap-3' },
    xl: { text: 'text-3xl', sub: 'text-xs', icon: 'w-11 h-11', gap: 'gap-3' },
  }[size];

  return (
    <div className={`flex items-center ${sizeClasses.gap} select-none ${className}`}>
      {/* Brand Monogram Badge / Crest or Custom Platform Logo from Admin */}
      {customLogoUrl && !imageError ? (
        <div className={`${sizeClasses.icon} relative flex items-center justify-center shrink-0 overflow-hidden`}>
          <img
            src={customLogoUrl}
            alt={businessProfile?.companyName || 'Nasisi'}
            onError={() => setImageError(true)}
            className="w-full h-full object-contain drop-shadow-sm rounded-lg"
          />
        </div>
      ) : (
        <div
          className={`${sizeClasses.icon} rounded-xl ${
            isWhite ? 'bg-white text-[#06163c]' : 'bg-[#06163c] text-white'
          } flex items-center justify-center font-black shadow-md shrink-0 border ${
            isWhite ? 'border-white/90' : 'border-[#06163c]'
          }`}
        >
          <span className="font-extrabold tracking-tighter text-sm sm:text-base">N</span>
        </div>
      )}

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight ${sizeClasses.text} ${
              isWhite ? 'text-white' : 'text-[#06163c]'
            }`}
          >
            NASISI
          </span>
          <span
            className={`font-bold tracking-wider uppercase text-[10px] sm:text-xs px-1.5 py-0.5 rounded ${
              isWhite
                ? 'bg-white/20 text-cyan-200'
                : 'bg-blue-50 text-[#06163c] border border-blue-200/60'
            }`}
          >
            KNITWEAR
          </span>
        </div>

        {showTagline && (
          <span
            className={`mt-0.5 ${sizeClasses.sub} font-medium tracking-normal ${
              isWhite ? 'text-blue-200/90' : 'text-slate-500'
            }`}
          >
            {businessProfile?.slogan || tagline}
          </span>
        )}
      </div>
    </div>
  );
};
