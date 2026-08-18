'use client';

import { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

const CUSTOMER_PKG = 'com.quttr.customer';
const BUSINESS_PKG = 'com.quttr.business';

function makeSessionId() {
  if (typeof window === 'undefined') return '';
  try {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  } catch (e) {}
  return 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -80px 0px', ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <LandingContent />
    </Suspense>
  );
}

function LoadingScreen() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black">
      <div className="relative flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-2 border-[#E63946]/30 border-t-[#FFD700] rounded-full animate-spin" />
        <p className="text-[#FFD700]/60 text-xs tracking-[0.3em] uppercase font-bold">Quttr</p>
      </div>
      <GlobalStyles />
    </div>
  );
}

function LandingContent() {
  const searchParams = useSearchParams();
  const qrId = searchParams.get('qr') || '';
  const sid = searchParams.get('sid') || '';
  const [sessionId, setSessionId] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const trackedPageView = useRef(false);

  useEffect(() => {
    setSessionId(sid || makeSessionId());
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const trackEvent = useCallback(
    (event) => {
      try {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ event, qr_id: qrId, session_id: sessionId }),
          keepalive: true,
        }).catch(() => {});
      } catch (e) {}
    },
    [qrId, sessionId]
  );

  useEffect(() => {
    if (!sessionId || trackedPageView.current) return;
    trackedPageView.current = true;
    trackEvent('page_view');
  }, [sessionId, trackEvent]);

  const openStore = useCallback(
    (pkg, eventName) => {
      trackEvent(eventName);
      const marketUrl = `market://details?id=${pkg}`;
      const webUrl = `https://play.google.com/store/apps/details?id=${pkg}`;
      const start = Date.now();
      let didHide = false;
      const onHide = () => { didHide = true; };
      document.addEventListener('visibilitychange', onHide, { once: true });
      window.location.href = marketUrl;
      setTimeout(() => {
        document.removeEventListener('visibilitychange', onHide);
        if (!didHide && Date.now() - start < 2000) {
          window.location.href = webUrl;
        }
      }, 900);
    },
    [trackEvent]
  );

  const customerPkg =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_CUSTOMER_APP_PACKAGE) ||
    CUSTOMER_PKG;
  const businessPkg =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BUSINESS_APP_PACKAGE) ||
    BUSINESS_PKG;

  const downloadCustomer = () => openStore(customerPkg, 'customer_download_click');
  const downloadBusiness = () => openStore(businessPkg, 'business_download_click');

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+Devanagari:wght@400;500;600;700;800;900&display=swap"
      />

      <StickyHeader scrolled={scrolled} onDownload={downloadCustomer} />

      <main className="bg-black text-white antialiased overflow-x-hidden">
        <HeroSection onDownload={downloadCustomer} />
        <FeatureOne />
        <FeatureTwo />
        <FeatureThree />
        <FeatureFour />
        <HowItWorks />
        <TestimonialsSection />
        <BarberSection onDownload={downloadBusiness} />
        <FinalCTASection onDownload={downloadCustomer} />
        <FooterSection />
      </main>

      <GlobalStyles />
    </>
  );
}

/* STICKY HEADER */
function StickyHeader({ scrolled, onDownload }) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-black/85 backdrop-blur-xl border-b border-[#FFD700]/[0.15]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative w-9 h-9">
            <Image src="/quttr-logo.png" alt="Quttr" width={36} height={36} className="object-contain" />
          </div>
          <span className="text-[17px] font-black tracking-tight">
            Quttr<span className="text-[#FFD700]">.</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-[13px] text-white/70 font-semibold">
          <a href="#features" className="hover:text-[#FFD700] transition-colors">Features</a>
          <a href="#barbers" className="hover:text-[#FFD700] transition-colors">For Barbers</a>
          <a href="#download" className="hover:text-[#FFD700] transition-colors">Download</a>
        </nav>

        <button
          onClick={onDownload}
          className="qr-hindi text-[13px] font-bold bg-gradient-to-r from-[#E63946] to-[#B01824] text-white px-5 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(230,57,70,0.6)] transition-all"
        >
          डाउनलोड
        </button>
      </div>
    </header>
  );
}

/* HERO SECTION — SPACING COMPACTED so button visible without scroll */
function HeroSection({ onDownload }) {
  const [ref, inView] = useInView();

  return (
    <section
      ref={ref}
      className="relative flex items-center justify-center px-6 pt-20 md:pt-24 pb-10 md:pb-16 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#E63946]/[0.18] rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#FFD700]/[0.1] rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#B01824]/[0.12] rounded-full blur-[110px]" />
      </div>

      <div className={`relative z-10 max-w-5xl mx-auto text-center transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* BIG LOGO — smaller top margin, tighter bottom margin */}
        <div className="flex justify-center mb-4 md:mb-6">
          <div className="relative w-28 h-28 md:w-36 md:h-36 qr-logo-float">
            <div className="absolute inset-0 bg-[#E63946]/50 blur-3xl rounded-full qr-logo-pulse" />
            <Image
              src="/quttr-logo.png"
              alt="Quttr Logo"
              fill
              className="object-contain relative z-10 drop-shadow-[0_0_50px_rgba(230,57,70,0.7)]"
              priority
            />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 mb-3 md:mb-4">
          <span className="qr-hindi text-[11px] md:text-[12px] font-black tracking-[0.25em] text-[#FFD700] uppercase px-4 py-2 rounded-full border border-[#FFD700]/40 bg-[#FFD700]/[0.08]">
            ✂️ भारत का #1 बार्बर ऐप
          </span>
        </div>

        <h1 className="qr-hero-title text-[42px] sm:text-[54px] md:text-[90px] font-black leading-[1.02] tracking-[-0.04em] text-white mb-3 md:mb-4">
          <span className="qr-hindi qr-gold-red-gradient block">इंतज़ार खत्म।</span>
          <span className="qr-hindi text-white block mt-1 md:mt-2">Fresh लुक शुरू।</span>
        </h1>

        <p className="text-[18px] md:text-[26px] font-bold text-white/70 mb-2 md:mb-3 tracking-tight">
          Skip the Wait. Walk in Fresh.
        </p>

        <p className="qr-hindi text-[16px] md:text-[22px] text-[#FFD700] mb-2 md:mb-3 font-bold">
          बुकिंग सेकंडों में। बार्बर आपकी पसंद का।
        </p>

        <p className="qr-hindi text-[14px] md:text-[18px] text-white/60 max-w-2xl mx-auto leading-relaxed mb-6 md:mb-8">
          अब लाइन में लगने की जरूरत नहीं। घर बैठे बुक करें,
          <br className="hidden md:block" />
          अपनी बारी पर पहुंचे, और fresh look के साथ निकलें।
        </p>

        {/* MEGA DOWNLOAD BUTTON — reduced padding */}
        <div className="flex flex-col items-center gap-4 mb-4">
          <button
            onClick={onDownload}
            className="qr-mega-btn group relative inline-flex items-center gap-3 text-white text-[18px] md:text-[22px] font-black px-8 md:px-12 py-4 md:py-5 rounded-full transition-all duration-300 overflow-hidden"
          >
            <span className="qr-btn-shine" />
            <div className="relative z-10 flex items-center gap-3">
              <svg viewBox="0 0 512 512" className="w-8 h-8 md:w-10 md:h-10 drop-shadow-[0_0_10px_rgba(255,215,0,0.9)]">
                <path fill="#FFD700" d="M99 8c-6 3-11 9-13 17v462c2 8 7 14 13 17l255-248L99 8z" />
                <path fill="#FFDE4A" d="M354 256l-72-72L99 8c-4 2-8 5-10 9l188 239 77-0z" />
                <path fill="#FFD700" d="M99 504c2 4 6 7 10 9l183-176-77-81L99 504z" />
                <path fill="#FFDE4A" d="M354 256l83-48c11-6 11-22 0-28l-83-48-77 76 77 48z" />
              </svg>
              <div className="flex flex-col items-start text-left">
                <span className="text-[9px] md:text-[11px] font-black text-[#FFD700] tracking-[0.25em] leading-none">
                  GET IT ON
                </span>
                <span className="text-[20px] md:text-[28px] font-black leading-tight mt-0.5">
                  Google Play
                </span>
              </div>
            </div>
          </button>

          <div className="flex flex-col items-center gap-0.5">
            <p className="qr-hindi text-[15px] md:text-[18px] font-black text-[#FFD700] qr-bounce-down">
              👇 अभी डाउनलोड करें
            </p>
            <p className="qr-hindi text-[12px] text-white/50 font-semibold">
              100% Free · कोई छिपा हुआ शुल्क नहीं
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 md:pt-6 border-t border-white/10 max-w-2xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="flex text-[#FFD700]">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="text-[13px] font-bold text-white/80">4.8 Rating</span>
          </div>
          <div className="w-px h-4 bg-white/20 hidden sm:block" />
          <p className="qr-hindi text-[13px] font-bold text-white/80">
            ⭐ 10,000+ लोग जुड़ चुके हैं
          </p>
        </div>
      </div>

      {/* Scroll indicator removed on mobile to save vertical space; kept only on md+ */}
      <div className="hidden md:block absolute bottom-6 left-1/2 -translate-x-1/2 opacity-40">
        <div className="w-5 h-8 border border-[#FFD700]/40 rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-[#FFD700]/60 rounded-full qr-scroll-dot" />
        </div>
      </div>
    </section>
  );
}

/* FEATURE ONE */
function FeatureOne() {
  const [ref, inView] = useInView();

  return (
    <section ref={ref} id="features" className="min-h-screen flex items-center px-6 py-24 md:py-32 border-t border-white/[0.06] relative overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#E63946]/[0.12] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="qr-hindi text-[13px] font-black tracking-[0.3em] text-[#FFD700] uppercase mb-6">
              ⚡ स्पीड · SPEED
            </p>
            <h2 className="qr-hindi text-[48px] md:text-[80px] font-black leading-[1.02] tracking-[-0.03em] mb-2 text-white">
              15 सेकंड में
            </h2>
            <h2 className="qr-hindi text-[48px] md:text-[80px] font-black leading-[1.02] tracking-[-0.03em] text-white/40 mb-6">
              बुकिंग हो जाए।
            </h2>
            <p className="text-[20px] md:text-[26px] font-bold text-[#FFD700] mb-4">
              Book in seconds. Not minutes.
            </p>
            <p className="qr-hindi text-[17px] md:text-[20px] text-white/70 leading-relaxed mb-4 font-medium">
              फोन कॉल भूल जाइए। इंतज़ार भूल जाइए। बस टैप करें, समय चुनें, और बुकिंग हो गई।
            </p>
            <p className="text-[16px] md:text-[18px] text-white/50 leading-relaxed">
              Your favorite barber is just one tap away.
            </p>
          </div>

          <div className={`transition-all duration-1000 delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-[#E63946]/25 via-[#FFD700]/15 to-transparent rounded-3xl border border-[#FFD700]/25" />
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="qr-gold-red-gradient text-[120px] md:text-[220px] font-black tracking-[-0.04em] leading-none">
                    15
                  </div>
                  <div className="qr-hindi text-[26px] md:text-[32px] font-black text-white/80 mt-2">सेकंड</div>
                  <div className="text-[15px] text-white/40 mt-1">seconds only</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ... rest of your file continues unchanged (FeatureTwo, FeatureThree, FeatureFour, HowItWorks, TestimonialsSection, BarberSection, FinalCTASection, FooterSection, GlobalStyles) ... */