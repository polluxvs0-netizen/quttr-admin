'use client';

export default function DownloadButton({ variant = 'customer', onClick }) {
  const isCustomer = variant === 'customer';

  const packageName = isCustomer 
    ? process.env.NEXT_PUBLIC_CUSTOMER_APP_PACKAGE || 'com.quttr.customer'
    : process.env.NEXT_PUBLIC_BUSINESS_APP_PACKAGE || 'com.quttr.business';

  const playStoreUrl = isCustomer
    ? process.env.NEXT_PUBLIC_CUSTOMER_APP_URL || `https://play.google.com/store/apps/details?id=${packageName}`
    : process.env.NEXT_PUBLIC_BUSINESS_APP_URL || `https://play.google.com/store/apps/details?id=${packageName}`;

  const handleClick = () => {
    if (onClick) onClick();

    // Try to open Play Store app directly (native app)
    const marketUrl = `market://details?id=${packageName}`;
    
    // Fallback timer
    const fallbackTimer = setTimeout(() => {
      window.location.href = playStoreUrl;
    }, 500);

    // Try opening Play Store app first
    try {
      window.location.href = marketUrl;
      
      // If user comes back to page, cancel fallback
      window.addEventListener('blur', () => clearTimeout(fallbackTimer), { once: true });
    } catch (e) {
      clearTimeout(fallbackTimer);
      window.location.href = playStoreUrl;
    }
  };

  const gradientClass = isCustomer 
    ? 'from-brand-500 via-brand-600 to-brand-700'
    : 'from-business-500 via-business-700 to-business-900';

  const shadowClass = isCustomer 
    ? 'shadow-brand-xl'
    : 'shadow-business-lg';

  const glowColor = isCustomer 
    ? 'rgba(230, 57, 70, 0.6)'
    : 'rgba(26, 35, 126, 0.6)';

  return (
    <div className="relative w-full">
      
      {/* Animated glow behind button */}
      <div 
        className="absolute inset-0 rounded-2xl blur-2xl opacity-70 animate-pulse-glow"
        style={{ background: glowColor }}
      />

      {/* Main Button */}
      <button
        onClick={handleClick}
        className={`
          relative w-full 
          bg-gradient-to-br ${gradientClass}
          rounded-2xl p-1
          ${shadowClass}
          transform transition-all duration-300
          hover:scale-105 active:scale-95
          group
        `}
      >
        {/* Inner button content */}
        <div className="bg-surface-100/80 backdrop-blur-xl rounded-2xl px-6 py-5 flex items-center justify-center gap-4">
          
          {/* Play Store Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-accent-500 blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
            <svg 
              className="w-12 h-12 relative z-10 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]"
              viewBox="0 0 512 512"
            >
              <defs>
                <linearGradient id="playGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#FFAA00" />
                </linearGradient>
              </defs>
              <path
                d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.544 81.544 67.266-37.637c16.117-9.03 25.749-25.834 25.749-44.907s-9.631-35.877-25.749-44.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"
                fill="url(#playGradient)"
              />
            </svg>
          </div>

          {/* Text */}
          <div className="text-left">
            <div className="text-2xs text-white/60 uppercase tracking-widest font-semibold mb-0.5">
              GET IT ON
            </div>
            <div className="text-2xl font-black text-white leading-tight">
              Google Play
            </div>
          </div>
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </button>

      {/* CTA Text Below */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-500/10 border border-accent-500/30">
          <span className="text-2xl animate-bounce">👆</span>
          <span className="text-accent-500 font-bold text-sm">
            {isCustomer ? 'Tap to Download Quttr' : 'Tap to Download Quttr BUSINESS'}
          </span>
        </div>
      </div>
    </div>
  );
}
