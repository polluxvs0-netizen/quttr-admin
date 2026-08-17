'use client';

import { useEffect, useRef, useState } from 'react';

export default function Hero3D() {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 30;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * 30;
        setMousePos({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center perspective-1000"
    >
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-accent-500 rounded-full animate-float opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Outer Ring */}
      <div 
        className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full border border-accent-500/20 animate-spin-slow"
        style={{
          transform: `rotateX(${mousePos.y * 0.3}deg) rotateY(${mousePos.x * 0.3}deg)`,
          transition: 'transform 0.3s ease-out',
        }}
      />

      {/* Middle Ring */}
      <div 
        className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full border-2 border-brand-500/30"
        style={{
          transform: `rotateX(${mousePos.y * 0.5}deg) rotateY(${mousePos.x * 0.5}deg)`,
          transition: 'transform 0.3s ease-out',
          animation: 'spin 30s linear infinite reverse',
        }}
      />

      {/* Glowing Logo Container */}
      <div 
        className="relative preserve-3d animate-float"
        style={{
          transform: `rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`,
          transition: 'transform 0.2s ease-out',
        }}
      >
        {/* Glow behind logo */}
        <div className="absolute inset-0 bg-brand-500 rounded-full blur-3xl opacity-50 animate-pulse-glow" />
        
        {/* Logo Circle */}
        <div className="relative w-40 h-40 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 flex items-center justify-center shadow-brand-xl">
          
          {/* Inner Circle */}
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-surface-100 flex items-center justify-center relative overflow-hidden">
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent-500/20 via-transparent to-brand-500/20 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
            
            {/* Scissors Icon (Q logo style) */}
            <svg 
              className="w-20 h-20 md:w-28 md:h-28 text-accent-500 relative z-10 drop-shadow-[0_0_20px_rgba(255,215,0,0.8)]"
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="6" cy="6" r="3"/>
              <circle cx="6" cy="18" r="3"/>
              <line x1="20" y1="4" x2="8.12" y2="15.88"/>
              <line x1="14.47" y1="14.48" x2="20" y2="20"/>
              <line x1="8.12" y1="8.12" x2="12" y2="12"/>
            </svg>
          </div>

          {/* Rotating Border Highlight */}
          <div className="absolute inset-0 rounded-full">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-accent-500 rounded-full shadow-glow-md" 
                 style={{ 
                   animation: 'spin 4s linear infinite',
                   transformOrigin: '0 100px',
                 }} 
            />
          </div>
        </div>

        {/* Q letter accent below */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-6xl md:text-7xl font-black text-accent-500/20">
          Q
        </div>
      </div>

      {/* Floating Barber Tools around logo */}
      <div className="absolute top-8 right-8 text-4xl animate-float opacity-70" style={{ animationDelay: '0.5s' }}>
        💈
      </div>
      <div className="absolute bottom-8 left-8 text-4xl animate-float opacity-70" style={{ animationDelay: '1.5s' }}>
        ✂️
      </div>
      <div className="absolute top-8 left-8 text-3xl animate-float opacity-70" style={{ animationDelay: '2.5s' }}>
        💇
      </div>
      <div className="absolute bottom-8 right-8 text-3xl animate-float opacity-70" style={{ animationDelay: '3.5s' }}>
        ⭐
      </div>
    </div>
  );
}
