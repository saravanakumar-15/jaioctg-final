import React, { useState } from 'react';

export type LogoVariant = 
  | 'header-desktop'
  | 'header-tablet'
  | 'header-mobile'
  | 'header-auto'
  | 'footer'
  | 'mobile-menu'
  | 'auth'
  | 'about'
  | 'contact'
  | 'splash'
  | 'card'
  | 'inline';

export interface BrandLogoProps {
  variant?: LogoVariant;
  showText?: boolean;
  showTagline?: boolean;
  onClick?: () => void;
  className?: string;
  imgClassName?: string;
  textClassName?: string;
  theme?: 'dark' | 'light' | 'auto';
}

/**
 * BrandLogo component provides automatically responsive logo sizing & aspect-ratio fitting
 * across all sections: Header (Desktop/Tablet/Mobile), Footer, Mobile Menu, Auth Pages,
 * About section, Contact section, Loading/Splash screens, and custom containers.
 *
 * Guarantees:
 * - Automatically scales according to available container space
 * - Maintains original aspect ratio at all times (object-contain, w-auto, h-auto)
 * - Zero cropping, zero distortion, zero overflow
 * - Never forces square 1:1 or fixed static box constraints
 */
export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'header-auto',
  showText = true,
  showTagline = true,
  onClick,
  className = '',
  imgClassName = '',
  textClassName = '',
  theme = 'dark'
}) => {
  const [imgError, setImgError] = useState(false);

  // Responsive dimensions per variant context
  const variantStyles = {
    'header-desktop': {
      container: 'h-12 max-w-[280px]',
      img: 'h-10 sm:h-12 w-auto max-w-[140px] max-h-12 object-contain shrink-0',
      title: 'text-lg sm:text-xl font-black tracking-tight',
      tagline: 'text-[9px] sm:text-[10px] tracking-wide font-medium',
      badge: 'text-[9px] sm:text-[10px] px-1.5 py-0.5',
    },
    'header-tablet': {
      container: 'h-10 max-w-[240px]',
      img: 'h-9 sm:h-10 w-auto max-w-[120px] max-h-10 object-contain shrink-0',
      title: 'text-base sm:text-lg font-black tracking-tight',
      tagline: 'text-[9px] tracking-wide font-medium',
      badge: 'text-[8px] sm:text-[9px] px-1.5 py-0.5',
    },
    'header-mobile': {
      container: 'h-9 max-w-[200px]',
      img: 'h-8 sm:h-9 w-auto max-w-[100px] max-h-9 object-contain shrink-0',
      title: 'text-sm sm:text-base font-extrabold tracking-tight',
      tagline: 'hidden',
      badge: 'text-[8px] px-1 py-0.5',
    },
    'header-auto': {
      // Responsive header that automatically switches sizing across breakpoints
      container: 'h-9 sm:h-11 lg:h-12 max-w-full',
      img: 'h-8 sm:h-10 lg:h-12 w-auto max-w-[90px] sm:max-w-[120px] lg:max-w-[150px] max-h-8 sm:max-h-10 lg:max-h-12 object-contain shrink-0',
      title: 'text-sm sm:text-lg lg:text-xl font-black tracking-tight',
      tagline: 'hidden sm:block text-[8px] sm:text-[9px] lg:text-[10px] tracking-wide font-medium',
      badge: 'text-[8px] sm:text-[9px] px-1.5 py-0.5',
    },
    'footer': {
      container: 'h-12 sm:h-14 lg:h-16 max-w-full',
      img: 'h-10 sm:h-12 lg:h-14 w-auto max-w-[120px] sm:max-w-[160px] lg:max-w-[180px] max-h-14 object-contain shrink-0',
      title: 'text-base sm:text-xl lg:text-2xl font-black tracking-tight',
      tagline: 'text-[9px] sm:text-[10px] lg:text-xs tracking-wide font-medium',
      badge: 'text-[9px] sm:text-[10px] px-2 py-0.5',
    },
    'mobile-menu': {
      container: 'h-10 sm:h-12 max-w-full',
      img: 'h-9 sm:h-11 w-auto max-w-[110px] sm:max-w-[140px] max-h-11 object-contain shrink-0',
      title: 'text-base sm:text-lg font-black tracking-tight',
      tagline: 'text-[9px] tracking-wide font-medium',
      badge: 'text-[9px] px-1.5 py-0.5',
    },
    'auth': {
      container: 'h-14 sm:h-16 md:h-20 max-w-full justify-center',
      img: 'h-12 sm:h-16 md:h-20 w-auto max-w-[160px] sm:max-w-[200px] md:max-w-[240px] max-h-20 object-contain shrink-0',
      title: 'text-xl sm:text-2xl font-black tracking-tight',
      tagline: 'text-[10px] sm:text-xs tracking-wide font-medium',
      badge: 'text-[9px] sm:text-[10px] px-2 py-0.5',
    },
    'about': {
      container: 'h-12 sm:h-16 md:h-20 max-w-full',
      img: 'h-12 sm:h-16 md:h-20 w-auto max-w-[150px] sm:max-w-[200px] md:max-w-[260px] max-h-20 object-contain shrink-0',
      title: 'text-lg sm:text-2xl font-black tracking-tight',
      tagline: 'text-[10px] sm:text-xs tracking-wide font-medium',
      badge: 'text-[9px] sm:text-[10px] px-2 py-0.5',
    },
    'contact': {
      container: 'h-10 sm:h-12 lg:h-14 max-w-full',
      img: 'h-10 sm:h-12 lg:h-14 w-auto max-w-[120px] sm:max-w-[150px] lg:max-w-[180px] max-h-14 object-contain shrink-0',
      title: 'text-base sm:text-xl font-black tracking-tight',
      tagline: 'text-[9px] sm:text-[10px] tracking-wide font-medium',
      badge: 'text-[9px] px-2 py-0.5',
    },
    'splash': {
      container: 'h-16 sm:h-24 md:h-28 max-w-full justify-center',
      img: 'h-16 sm:h-24 md:h-28 w-auto max-w-[200px] sm:max-w-[280px] md:max-w-[340px] max-h-28 object-contain shrink-0',
      title: 'text-2xl sm:text-3xl font-black tracking-tight',
      tagline: 'text-xs sm:text-sm tracking-widest font-semibold',
      badge: 'text-xs px-2.5 py-1',
    },
    'card': {
      container: 'h-8 sm:h-10 max-w-full',
      img: 'h-8 sm:h-10 w-auto max-w-[100px] sm:max-w-[130px] max-h-10 object-contain shrink-0',
      title: 'text-sm sm:text-base font-extrabold tracking-tight',
      tagline: 'text-[8px] sm:text-[9px] tracking-wide font-medium',
      badge: 'text-[8px] px-1.5 py-0.5',
    },
    'inline': {
      container: 'h-8 max-w-full',
      img: 'h-8 w-auto max-w-[100px] max-h-8 object-contain shrink-0',
      title: 'text-sm font-bold tracking-tight',
      tagline: 'hidden',
      badge: 'text-[8px] px-1 py-0.5',
    }
  };

  const currentStyle = variantStyles[variant] || variantStyles['header-auto'];

  // Direct render with exact /public/logo.svg asset and resilient fallback
  const renderLogoImage = () => {
    if (!imgError) {
      return (
        <img
          src="/logo.svg"
          alt="JAI OCTG Inspection Services Pte Ltd Logo"
          onError={() => setImgError(true)}
          className={`block object-contain shrink-0 transition-all duration-200 ${currentStyle.img} ${imgClassName}`}
          loading="eager"
        />
      );
    }

    // Direct exact SVG render fallback matching /public/logo.svg exactly
    return (
      <svg
        viewBox="0 0 240 200"
        width="240"
        height="200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`block object-contain shrink-0 transition-all duration-200 ${currentStyle.img} ${imgClassName}`}
      >
        <defs>
          <linearGradient id="jai-blue-grad-fallback" x1="120" y1="20" x2="120" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00AEEF"/>
            <stop offset="40%" stopColor="#0072CE"/>
            <stop offset="100%" stopColor="#1B2B85"/>
          </linearGradient>
          
          <linearGradient id="jai-ship-grad-fallback" x1="20" y1="120" x2="220" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#88C100"/>
            <stop offset="100%" stopColor="#6B9B00"/>
          </linearGradient>

          <linearGradient id="jai-wave-grad-fallback" x1="10" y1="170" x2="230" y2="195" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00C3FF"/>
            <stop offset="50%" stopColor="#0092E0"/>
            <stop offset="100%" stopColor="#0066C0"/>
          </linearGradient>

          <filter id="subtle-shadow-fallback" x="-5%" y="-5%" width="110%" height="110%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.15"/>
          </filter>
        </defs>

        <g id="waves-fallback">
          <path d="M 12 178 C 50 166, 90 190, 135 178 C 170 168, 200 184, 228 175 C 210 183, 175 175, 135 186 C 90 198, 45 174, 12 178 Z" fill="url(#jai-wave-grad-fallback)" />
          <path d="M 22 188 C 65 176, 105 198, 150 187 C 185 178, 212 191, 235 184 C 215 192, 180 184, 148 194 C 105 206, 58 184, 22 188 Z" fill="url(#jai-wave-grad-fallback)" opacity="0.85" />
          <path d="M 40 196 C 80 186, 120 204, 160 195 C 190 188, 215 198, 232 194 C 210 200, 180 194, 155 201 C 115 210, 75 193, 40 196 Z" fill="url(#jai-wave-grad-fallback)" opacity="0.6" />
        </g>

        <g id="vessel-fallback" filter="url(#subtle-shadow-fallback)">
          <path d="M 25 168 C 23 162, 28 152, 40 152 L 70 152 C 72 144, 76 138, 76 132 L 80 132 C 80 138, 80 144, 80 152 L 140 152 C 142 140, 145 125, 150 118 C 158 118, 168 122, 170 132 L 170 152 L 195 142 C 208 136, 218 133, 228 136 C 220 152, 195 168, 175 172 C 120 174, 60 173, 25 168 Z" fill="url(#jai-ship-grad-fallback)" />
          <path d="M 72 135 L 72 122 L 62 126 L 72 130 Z" fill="#6B9B00" />
          <circle cx="50" cy="159" r="1.8" fill="#FFFFFF" opacity="0.9" />
          <circle cx="58" cy="159" r="1.8" fill="#FFFFFF" opacity="0.9" />
          <circle cx="66" cy="159" r="1.8" fill="#FFFFFF" opacity="0.9" />
          <circle cx="180" cy="153" r="2" fill="#FFFFFF" opacity="0.9" />
          <circle cx="190" cy="149" r="2" fill="#FFFFFF" opacity="0.9" />
          <circle cx="200" cy="145" r="2" fill="#FFFFFF" opacity="0.9" />
          <circle cx="210" cy="142" r="1.8" fill="#FFFFFF" opacity="0.9" />
        </g>

        <g id="letter-j-fallback" filter="url(#subtle-shadow-fallback)">
          <circle cx="128" cy="32" r="15" fill="url(#jai-blue-grad-fallback)" />
          <path d="M 112 76 C 104 80, 108 73, 116 71 C 128 68, 142 66, 142 66 L 142 120 C 142 142, 125 158, 100 158 C 82 158, 70 146, 68 130 C 80 130, 92 122, 95 110 C 85 115, 72 122, 68 130 C 66 115, 82 98, 95 90 C 88 102, 92 118, 102 122 C 114 126, 126 118, 126 102 L 126 76 C 120 76, 115 76, 112 76 Z" fill="url(#jai-blue-grad-fallback)" />
          <path d="M 115 71 C 105 73, 102 80, 112 76 L 126 76 L 126 112 C 126 132, 112 146, 92 146 C 76 146, 68 136, 68 126 C 78 126, 88 118, 92 108 C 82 114, 72 120, 68 126 C 66 112, 80 96, 95 88 C 88 100, 92 114, 100 118 C 110 122, 120 114, 120 100 L 120 71 Z" fill="url(#jai-blue-grad-fallback)" />
        </g>
      </svg>
    );
  };

  const isDark = theme === 'dark' || theme === 'auto';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center space-x-2.5 sm:space-x-3 group select-none ${onClick ? 'cursor-pointer' : ''} ${currentStyle.container} ${className}`}
    >
      {/* Logo Graphic Container - clean white background behind logo only */}
      <div className="relative flex items-center justify-center shrink-0 bg-white p-1 sm:p-1.5 rounded-xl shadow-xs border border-white/80">
        {renderLogoImage()}
      </div>

      {/* Brand Text Block */}
      {showText && (
        <div className={`flex flex-col justify-center min-w-0 ${textClassName}`}>
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-wrap">
            <span className={`${currentStyle.title} ${isDark ? 'text-white' : 'text-slate-900'}`}>
              JAI OCTG
            </span>
            <span className={`font-black uppercase tracking-widest rounded-md border shadow-xs ${currentStyle.badge} ${
              isDark 
                ? 'bg-amber-400/20 text-amber-300 border-amber-300/40' 
                : 'bg-amber-500/20 text-amber-700 border-amber-500/40'
            }`}>
              INSPECTION
            </span>
          </div>

          {showTagline && (
            <p className={`mt-0.5 truncate uppercase tracking-wider ${currentStyle.tagline} ${
              isDark ? 'text-blue-100/90' : 'text-slate-600'
            }`}>
              Quality Assurance & NDT Services
            </p>
          )}
        </div>
      )}
    </div>
  );
};
