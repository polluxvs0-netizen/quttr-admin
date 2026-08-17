'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Hero3D from '../../components/landing/Hero3D';
import DownloadButton from '../../components/landing/DownloadButton';
import Features from '../../components/landing/Features';
import BarberSection from '../../components/landing/BarberSection';
import SocialLinks from '../../components/landing/SocialLinks';

function LandingContent() {
  const searchParams = useSearchParams();
  const qrId = searchParams.get('qr');
  const sessionId = searchParams.get('sid');

  useEffect(() => {
    // Track page view
    if (qrId) {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'page_view',
          qr_id: qrId,
          session_id: sessionId,
        }),
      }).catch(err => console.log('Track error:', err));
    }
  }, [qrId, sessionId]);

  const trackClick = (eventName) => {
    if (qrId) {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: eventName,
          qr_id: qrId,
          session_id: sessionId,
        }),
      }).catch(err => console.log('Track error:', err));
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 text-white overflow-x-hidden mesh-bg-landing">
      
      {/* ═══════════════════════════════════════════════ */}
      {/* HERO SECTION — 3D Animation + Download Button   */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-8">
        
        {/* Background Glow Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* 3D Hero Animation */}
        <div className="relative z-10 w-full max-w-md h-[350px] md:h-[450px]">
          <Hero3D />
        </div>

        {/* App Name */}
        <h1 className="relative z-10 text-6xl md:text-8xl font-black mt-4 text-gradient tracking-tight animate-slide-up">
          Quttr
        </h1>

        {/* Tagline */}
        <p className="relative z-10 text-lg md:text-2xl mt-4 text-center text-white/80 font-light animate-slide-up max-w-md" style={{ animationDelay: '0.3s' }}>
          Skip the Wait.{' '}
          <span className="text-gradient-gold font-semibold">Walk in Fresh.</span>
        </p>

        {/* BIG DOWNLOAD BUTTON */}
        <div className="relative z-10 mt-10 w-full max-w-sm animate-scale-in" style={{ animationDelay: '0.6s' }}>
          <DownloadButton
            variant="customer"
            onClick={() => trackClick('customer_download_click')}
          />
        </div>

        {/* Trust Badge */}
        <div className="relative z-10 mt-8 flex items-center gap-2 text-white/50 text-sm">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Trusted by 10,000+ users
          </span>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2 text-white/40 text-xs animate-bounce">
          <span>Scroll for more</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* SOCIAL MEDIA STRIP                              */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-12 border-y border-white/[0.06] bg-surface-100/50 backdrop-blur-xl">
        <SocialLinks trackClick={trackClick} />
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* WHAT WE OFFER                                   */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-20 px-4 relative">
        <Features />
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* DIVIDER                                         */}
      {/* ═══════════════════════════════════════════════ */}
      <div className="divider max-w-4xl mx-auto" />

      {/* ═══════════════════════════════════════════════ */}
      {/* BARBER SECTION                                  */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="py-20 px-4 mesh-bg-business relative">
        <BarberSection
          onBarberDownloadClick={() => trackClick('business_download_click')}
        />
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/* FOOTER                                          */}
      {/* ═══════════════════════════════════════════════ */}
      <footer className="py-12 px-4 border-t border-white/[0.06] bg-surface-100/30 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl font-black text-gradient">Quttr</span>
            <span className="text-white/30">·</span>
            <span className="text-sm text-white/50">Since 2025</span>
          </div>
          <p className="text-white/50 text-sm mb-2">
            Skip the Wait. Walk in Fresh.
          </p>
          <p className="text-white/30 text-xs mb-4">
            support@quttrr.com · +91 9519953149
          </p>
          <p className="text-white/20 text-xs">
            © 2025 Quttr. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-accent-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LandingContent />
    </Suspense>
  );
}
