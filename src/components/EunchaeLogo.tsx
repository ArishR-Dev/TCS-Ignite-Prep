import React, { useState } from 'react';

export const EUNCHAE_LOGO_URL =
  'https://res.cloudinary.com/rmhgrc2t/image/upload/f_auto,q_auto/f28cc299-7070-41fb-8a03-b708197c4e37';

interface EunchaeLogoProps {
  size?: number;
  className?: string;
  showSparkle?: boolean;
  glow?: boolean;
  alt?: string;
}

/**
 * Official Eunchae Avatar & Logo Component
 * High-resolution anime companion avatar with soft glowing cyan/indigo border ring
 * and optional live sparkle status badge.
 */
export const EunchaeLogo: React.FC<EunchaeLogoProps> = ({
  size = 32,
  className = '',
  showSparkle = false,
  glow = false,
  alt = 'Eunchae AI Companion',
}) => {
  const [hasError, setHasError] = useState(false);

  // Calculate proportional sparkle badge size
  const badgeSize = Math.max(11, Math.round(size * 0.38));

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Optional ambient radiant glow */}
      {glow && (
        <div
          className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md pointer-events-none transform scale-125"
          aria-hidden="true"
        />
      )}

      {/* Main Avatar Circular Frame */}
      <div
        className="w-full h-full rounded-full overflow-hidden border border-cyan-400/70 bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-950 shadow-md shadow-cyan-950/80 flex items-center justify-center relative ring-1 ring-cyan-500/30"
        style={{ width: size, height: size }}
      >
        {!hasError ? (
          <img
            src={EUNCHAE_LOGO_URL}
            alt={alt}
            referrerPolicy="no-referrer"
            loading="eager"
            onError={() => setHasError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-200 group-hover:scale-105 pointer-events-none"
          />
        ) : (
          /* Graceful fallback if image is unreachable */
          <div className="w-full h-full bg-gradient-to-tr from-cyan-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
            E✦
          </div>
        )}
      </div>

      {/* Live Sparkle / Active Companion Badge */}
      {showSparkle && (
        <div
          className="absolute -bottom-0.5 -right-0.5 rounded-full bg-gradient-to-tr from-cyan-500 via-sky-400 to-indigo-500 border border-slate-950 flex items-center justify-center text-white font-bold shadow-sm shadow-cyan-500/60 pointer-events-none select-none animate-pulse"
          style={{
            width: badgeSize,
            height: badgeSize,
            fontSize: Math.max(7, Math.round(badgeSize * 0.65)),
          }}
          title="Active Assistant"
        >
          ✦
        </div>
      )}
    </div>
  );
};
