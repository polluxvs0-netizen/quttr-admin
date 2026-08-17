'use client';

import { Suspense, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

/* ======================================================================
   QUTTR — GET APP LANDING PAGE
   src/app/get/page.js
   Single-file Next.js 14 (App Router) component.
   ====================================================================== */

const CUSTOMER_PKG_FALLBACK = 'com.quttr.customer';
const BUSINESS_PKG_FALLBACK = 'com.quttr.business';

/* ---------- tiny utilities ---------- */

function useRevealOnScroll() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      el.classList.add('qr-visible');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('qr-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -60px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function makeSessionId() {
  if (typeof window === 'undefined') return '';
  try {
    if (window.crypto && window.crypto.randomUUID) return window.crypto.randomUUID();
  } catch (e) {}
  return 'sess_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/* ---------- root export ---------- */

export default function Page() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <LandingContent />
    </Suspense>
  );
}

/* ---------- loading state ---------- */

function LoadingScreen() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050507]">
      <div className="relative flex flex-col items-center gap-6">
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-2 border-[#FFD700]/30 qr-spin-slow" />
          <div className="absolute inset-2 rounded-full border-2 border-[#E63946]/50 qr-spin-slow-rev" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl">✂️</span>
          </div>
        </div>
        <p className="text-[#FFD700]/70 text-sm tracking-[0.3em] uppercase">Quttr</p>
      </div>
    </div>
  );
}

/* ---------- main content ---------- */

function LandingContent() {
  const searchParams = useSearchParams();
  const qrId = searchParams.get('qr') || '';
  const sid = searchParams.get('sid') || '';

  const [sessionId, setSessionId] = useState('');
  const [particles, setParticles] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const trackedPageView = useRef(false);

  useEffect(() => {
    setSessionId(sid || makeSessionId());

    setParticles(
      Array.from({ length: 70 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2.6 + 1,
        delay: Math.random() * 10,
        duration: Math.random() * 10 + 10,
        opacity: Math.random() * 0.5 + 0.25,
      }))
    );

    setSparkles(
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 6,
        duration: Math.random() * 2.5 + 2.5,
      }))
    );
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

  const handleHeroMouseMove = useCallback((e) => {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: Math.max(-1, Math.min(1, -dy)) * 8, y: Math.max(-1, Math.min(1, dx)) * 8 });
  }, []);

  const openStore = useCallback(
    (pkg, eventName) => {
      trackEvent(eventName);
      const marketUrl = `market://details?id=${pkg}`;
      const webUrl = `https://play.google.com/store/apps/details?id=${pkg}`;
      const start = Date.now();
      let didHide = false;
      const onHide = () => {
        didHide = true;
      };
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
    CUSTOMER_PKG_FALLBACK;
  const businessPkg =
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_BUSINESS_APP_PACKAGE) ||
    BUSINESS_PKG_FALLBACK;

  const handleCustomerDownload = () => openStore(customerPkg, 'customer_download_click');
  const handleBusinessDownload = () => openStore(businessPkg, 'business_download_click');

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800;900&display=swap"
      />

      <main className="relative min-h-screen w-full overflow-x-hidden bg-[#000000] text-white qr-font-body">
        <HeroSection
          heroRef={heroRef}
          particles={particles}
          sparkles={sparkles}
          tilt={tilt}
          onMouseMove={handleHeroMouseMove}
          onDownload={handleCustomerDownload}
        />
        <SocialStrip />
        <FeaturesSection />
        <BarberSection onDownload={handleBusinessDownload} />
        <FooterSection />
      </main>

      <GlobalStyles />
    </>
  );
}

function HeroSection({ heroRef, particles, sparkles, tilt, onMouseMove, onDownload }) {
  return (
    <section
      ref={heroRef}
      onMouseMove={onMouseMove}
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-5 pb-16 pt-24 text-center"
    >
      <div className="pointer-events-none absolute inset-0 bg-[#050507]" />
      <div className="pointer-events-none absolute inset-0 qr-grid opacity-[0.06]" />
      <div className="pointer-events-none absolute -left-1/4 top-[-10%] h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle,rgba(230,57,70,0.35)_0%,transparent_70%)] blur-2xl qr-aurora-1" />
      <div className="pointer-events-none absolute -right-1/4 bottom-[-15%] h-[75vh] w-[75vh] rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.22)_0%,transparent_70%)] blur-2xl qr-aurora-2" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[50vh] w-[50vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(176,24,36,0.25)_0%,transparent_70%)] blur-3xl qr-aurora-3" />

      <div className="pointer-events-none absolute inset-0">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute rounded-full bg-[#FFD700] qr-particle"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
        {sparkles.map((s) => (
          <span
            key={`sp-${s.id}`}
            className="absolute text-[#FFDE4A] qr-sparkle"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
              fontSize: '10px',
            }}
            aria-hidden="true"
          >
            ✦
          </span>
        ))}
      </div>

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        <div
          className="relative mb-8 flex h-[240px] w-[240px] items-center justify-center sm:h-[300px] sm:w-[300px]"
          style={{
            transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: 'transform 120ms ease-out',
          }}
        >
          <div className="absolute inset-0 rounded-full qr-ring-outer" />
          <div className="absolute inset-[18px] rounded-full qr-ring-middle" />
          <div className="absolute inset-[36px] rounded-full qr-ring-inner" />

          <div className="absolute inset-[46px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#FFDE4A_0%,#E63946_45%,#B01824_100%)] qr-core-glow" />

          <svg
            viewBox="0 0 64 64"
            className="relative h-16 w-16 sm:h-20 sm:w-20 qr-scissors-glow"
            fill="none"
            role="img"
            aria-label="Scissors icon"
          >
            <circle cx="18" cy="46" r="7" stroke="#FFD700" strokeWidth="3" />
            <circle cx="18" cy="18" r="7" stroke="#FFD700" strokeWidth="3" />
            <path d="M23 22L54 52" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
            <path d="M23 42L54 12" stroke="#FFD700" strokeWidth="3" strokeLinecap="round" />
          </svg>

          <span className="absolute -left-3 top-6 text-2xl qr-float-a" aria-hidden="true">💈</span>
          <span className="absolute -right-4 top-10 text-xl qr-float-b" aria-hidden="true">⭐</span>
          <span className="absolute -left-5 bottom-8 text-xl qr-float-c" aria-hidden="true">💇</span>
          <span className="absolute -right-3 bottom-4 text-2xl qr-float-a" aria-hidden="true">✂️</span>
        </div>

        <h1 className="qr-font-display qr-text-gradient qr-appear select-none text-[4.2rem] font-extrabold leading-none tracking-tight sm:text-[6.5rem] md:text-[8.5rem]">
          Quttr
        </h1>
        <div className="mt-3 h-[3px] w-24 rounded-full bg-gradient-to-r from-transparent via-[#FFD700] to-transparent qr-underline-glow" />

        <div className="mt-8 flex flex-col items-center gap-2 qr-appear qr-delay-1">
          <p className="qr-font-hindi text-[1.9rem] font-bold text-[#FFD700] sm:text-[2.5rem]">
            अब नो वेटिंग, बस बुकिंग
          </p>
          <p className="text-base font-light text-white/80 sm:text-xl">
            Skip the Wait. Walk in Fresh.
          </p>
        </div>

        <div className="mt-10 flex w-full flex-col items-center qr-appear qr-delay-2">
          <button
            onClick={onDownload}
            aria-label="Google Play पर Quttr डाउनलोड करें"
            className="qr-cta-btn group relative flex w-full max-w-md items-center justify-center gap-4 overflow-hidden rounded-2xl px-6 py-4 sm:py-5"
            style={{ minHeight: '68px' }}
          >
            <span className="qr-cta-shine" aria-hidden="true" />
            <svg viewBox="0 0 512 512" className="h-10 w-10 shrink-0 drop-shadow-[0_0_8px_rgba(255,215,0,0.8)] sm:h-12 sm:w-12" aria-hidden="true">
              <path fill="#FFD700" d="M99 8c-6 3-11 9-13 17v462c2 8 7 14 13 17l255-248L99 8z" />
              <path fill="#FFDE4A" d="M354 256l-72-72L99 8c-4 2-8 5-10 9l188 239 77-0z" />
              <path fill="#FFD700" d="M99 504c2 4 6 7 10 9l183-176-77-81L99 504z" />
              <path fill="#FFDE4A" d="M354 256l83-48c11-6 11-22 0-28l-83-48-77 76 77 48z" />
            </svg>
            <span className="flex flex-col items-start text-left">
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#FFDE4A]">
                Get it on
              </span>
              <span className="text-2xl font-bold text-white sm:text-3xl">Google Play</span>
            </span>
          </button>
          <p className="mt-4 qr-font-hindi text-base font-semibold text-white/90 qr-bounce-down">
            अभी डाउनलोड करें 👇
          </p>
        </div>

        <div className="mt-8 flex flex-col items-center gap-1 qr-appear qr-delay-3">
          <p className="qr-font-hindi text-sm font-semibold text-white/90 sm:text-base">
            ⭐ 10,000+ लोगों का भरोसा
          </p>
          <p className="text-xs text-white/50">100% Free • No Hidden Charges</p>
        </div>
      </div>
    </section>
  );
}

function SocialStrip() {
  const ref = useRevealOnScroll();
  const links = [
    {
      key: 'instagram',
      href: 'https://instagram.com/quttrofficial',
      hindi: 'इंस्टाग्राम पर फॉलो करें',
      sub: '@quttrofficial',
      classes: 'from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" stroke="white" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="4" stroke="white" strokeWidth="1.8" />
          <circle cx="17.2" cy="6.8" r="1.1" fill="white" />
        </svg>
      ),
    },
    {
      key: 'whatsapp',
      href: 'https://wa.me/919519953149',
      hindi: 'व्हाट्सएप पर बात करें',
      sub: '+91 95199 53149',
      classes: 'from-[#25D366] to-[#128C7E]',
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="white" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.1 8.1 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 20.2 12 8.2 8.2 0 0 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.9 1-.3.2-.6.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.2a.4.4 0 0 0 0-.4c-.1-.1-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.6 1.1 2.8s1.7 2.6 4.1 3.6a13.6 13.6 0 0 0 1.4.5 3.3 3.3 0 0 0 1.5.1c.5-.1 1.5-.6 1.7-1.2s.2-1.1.1-1.2-.2-.2-.4-.3Z" />
        </svg>
      ),
    },
    {
      key: 'email',
      href: 'mailto:support@quttrr.com',
      hindi: 'ईमेल करें',
      sub: 'support@quttrr.com',
      classes: 'from-[#3949AB] to-[#1A237E]',
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="white" strokeWidth="1.8" />
          <path d="M4 7l8 6 8-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      key: 'call',
      href: 'tel:+919519953149',
      hindi: 'अभी कॉल करें',
      sub: '+91 95199 53149',
      classes: 'from-[#FFD700] to-[#B08900]',
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
          <path
            d="M6.6 10.8c1.4 2.7 3.9 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1.1.5 1.1 1.1V20c0 .6-.5 1.1-1.1 1.1C10.6 21.1 2.9 13.4 2.9 3.3 2.9 2.7 3.4 2.2 4 2.2h3.3c.6 0 1.1.5 1.1 1.1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1L6.6 10.8Z"
            stroke="#050507"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section ref={ref} className="qr-reveal relative bg-[#050507] px-5 py-16 sm:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="qr-font-hindi text-3xl font-bold text-white sm:text-4xl">हमसे जुड़ें</h2>
        <p className="mt-1 text-sm text-white/50 sm:text-base">Connect With Us</p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {links.map((l) => (
            <a
              key={l.key}
              href={l.href}
              target={l.key === 'whatsapp' || l.key === 'instagram' ? '_blank' : undefined}
              rel={l.key === 'whatsapp' || l.key === 'instagram' ? 'noopener noreferrer' : undefined}
              className={`qr-social-btn group flex min-h-[72px] items-center gap-4 rounded-2xl bg-gradient-to-br ${l.classes} px-5 py-4 text-left shadow-lg`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-black/20">
                {l.icon}
              </span>
              <span className="flex flex-col">
                <span className="qr-font-hindi text-sm font-bold text-white sm:text-base">
                  {l.hindi}
                </span>
                <span className="text-xs text-white/80">{l.sub}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const ref = useRevealOnScroll();
  const features = [
    { emoji: '⚡', hi: 'बुकिंग सेकंडों में', en: 'Book in seconds — no app-loading wait' },
    { emoji: '🚫', hi: 'भीड़ में इंतज़ार नहीं', en: 'No more waiting in crowded shops' },
    { emoji: '💈', hi: 'अपना पसंदीदा बार्बर चुनें', en: 'Choose your favorite barber' },
    { emoji: '📍', hi: 'लाइव क्यू ट्रैकिंग', en: 'Real-time queue with GPS tracking' },
    { emoji: '⭐', hi: 'रेट और रिव्यू करें', en: 'Rate & review after every service' },
    { emoji: '🎁', hi: 'हर विजिट पर रिवॉर्ड्स', en: 'Earn rewards on every visit' },
  ];

  return (
    <section ref={ref} className="qr-reveal relative bg-black px-5 py-20 sm:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(230,57,70,0.15)_0%,transparent_70%)] blur-3xl" />
      <div className="relative mx-auto max-w-6xl text-center">
        <h2 className="qr-font-hindi qr-text-gradient text-3xl font-extrabold sm:text-5xl">
          Quttr में क्या है खास?
        </h2>
        <p className="mt-2 text-sm text-white/50 sm:text-base">What makes Quttr special</p>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="qr-feature-card group relative flex flex-col items-center rounded-2xl border border-white/5 bg-[#0F0F11] px-4 py-8 text-center sm:px-6"
            >
              <span className="mb-4 text-5xl sm:text-6xl">{f.emoji}</span>
              <h3 className="qr-font-hindi text-base font-bold text-white sm:text-lg">{f.hi}</h3>
              <p className="mt-2 text-xs text-white/60 sm:text-sm">{f.en}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BarberSection({ onDownload }) {
  const ref = useRevealOnScroll();
  const benefits = [
    { emoji: '📱', hi: 'डिजिटल बुकिंग मैनेजमेंट', en: 'Manage all appointments digitally' },
    { emoji: '💰', hi: 'रियल-टाइम कमाई ट्रैकिंग', en: 'Track your earnings in real-time' },
    { emoji: '👥', hi: 'कस्टमर बेस बढ़ाएं', en: 'Grow your customer base' },
    { emoji: '⭐', hi: 'रेप्युटेशन बनाएं', en: 'Build your reputation with reviews' },
    { emoji: '📊', hi: 'बिज़नेस एनालिटिक्स', en: 'Insights to grow your business faster' },
  ];

  return (
    <section
      ref={ref}
      className="qr-reveal relative overflow-hidden px-5 py-20 sm:py-28"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(57,73,171,0.25) 0%, #050507 55%)',
      }}
    >
      <div className="relative mx-auto max-w-6xl text-center">
        <span className="qr-font-hindi inline-block rounded-full border border-[#3949AB]/50 bg-[#1A237E]/30 px-4 py-1.5 text-xs font-semibold text-[#8FA3FF] sm:text-sm">
          बार्बर के लिए
        </span>

        <h2 className="qr-font-hindi mt-5 text-3xl font-extrabold text-white sm:text-5xl md:text-6xl">
          क्या आप एक Barber हैं?
        </h2>
        <p className="mt-1 text-sm text-white/50 sm:text-base">Are You a Barber?</p>

        <p className="qr-font-hindi mt-5 text-xl font-bold text-[#FFD700] sm:text-2xl">
          अपना बिज़नेस बढ़ाएं
        </p>
        <p className="mt-1 text-sm text-white/70 sm:text-base">
          Manage Your Empire. Grow Your Business.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="qr-barber-card flex flex-col items-center rounded-2xl border border-[#3949AB]/30 bg-gradient-to-b from-[#12153A] to-[#0B0D24] px-4 py-7 text-center"
            >
              <span className="mb-3 text-4xl">{b.emoji}</span>
              <h3 className="qr-font-hindi text-sm font-bold text-white sm:text-base">{b.hi}</h3>
              <p className="mt-2 text-xs text-white/60">{b.en}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center">
          <button
            onClick={onDownload}
            aria-label="Quttr Business डाउनलोड करें"
            className="qr-cta-btn-blue group relative flex w-full max-w-md items-center justify-center gap-4 overflow-hidden rounded-2xl px-6 py-4 sm:py-5"
            style={{ minHeight: '68px' }}
          >
            <span className="qr-cta-shine" aria-hidden="true" />
            <svg viewBox="0 0 512 512" className="h-9 w-9 shrink-0 drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]" aria-hidden="true">
              <path fill="#FFD700" d="M99 8c-6 3-11 9-13 17v462c2 8 7 14 13 17l255-248L99 8z" />
              <path fill="#FFDE4A" d="M354 256l-72-72L99 8c-4 2-8 5-10 9l188 239 77-0z" />
              <path fill="#FFD700" d="M99 504c2 4 6 7 10 9l183-176-77-81L99 504z" />
              <path fill="#FFDE4A" d="M354 256l83-48c11-6 11-22 0-28l-83-48-77 76 77 48z" />
            </svg>
            <span className="qr-font-hindi text-lg font-bold text-white sm:text-xl">
              Quttr BUSINESS डाउनलोड करें
            </span>
          </button>
        </div>

        <div className="mt-14 border-t border-white/10 pt-10">
          <p className="qr-font-hindi text-lg font-bold text-white sm:text-xl">
            रजिस्टर करने में मदद चाहिए?
          </p>
          <p className="mt-1 text-sm text-white/50">Need help registering?</p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="https://wa.me/919519953149"
              target="_blank"
              rel="noopener noreferrer"
              className="qr-font-hindi flex min-h-[52px] w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] px-6 font-semibold text-white shadow-lg transition-transform hover:scale-105 sm:w-auto"
            >
              व्हाट्सएप पर संपर्क करें
            </a>
            <a
              href="tel:+919519953149"
              className="qr-font-hindi flex min-h-[52px] w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#B08900] px-6 font-semibold text-[#0B0D24] shadow-lg transition-transform hover:scale-105 sm:w-auto"
            >
              अभी कॉल करें +91 9519953149
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="relative bg-[#050507] px-5 py-14 text-center">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[240px] w-[240px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,215,0,0.12)_0%,transparent_70%)] blur-2xl" />
      <div className="relative mx-auto max-w-2xl">
        <p className="qr-font-display qr-text-gradient text-3xl font-extrabold sm:text-4xl">
          Quttr
        </p>
        <p className="qr-font-hindi mt-3 text-sm font-medium text-white/70 sm:text-base">
          स्किप द वेट, वॉक इन फ्रेश
        </p>
        <p className="mt-5 text-xs text-white/50 sm:text-sm">
          <a href="mailto:support@quttrr.com" className="hover:text-[#FFD700]">
            support@quttrr.com
          </a>
          <span className="mx-2">|</span>
          <a href="tel:+919519953149" className="hover:text-[#FFD700]">
            +91 9519953149
          </a>
        </p>
        <p className="mt-6 text-xs text-white/30">© 2025 Quttr • Made with ❤️ in India</p>
      </div>
    </footer>
  );
}

function GlobalStyles() {
  return (
    <style jsx global>{`
      .qr-font-body {
        font-family: 'Poppins', 'Noto Sans Devanagari', system-ui, sans-serif;
      }
      .qr-font-display {
        font-family: 'Poppins', system-ui, sans-serif;
      }
      .qr-font-hindi {
        font-family: 'Noto Sans Devanagari', 'Poppins', system-ui, sans-serif;
      }
      html { scroll-behavior: smooth; }
      .qr-text-gradient {
        background: linear-gradient(90deg, #e63946, #ffd700, #e63946);
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        text-shadow: 0 0 40px rgba(230, 57, 70, 0.35);
        animation: qr-gradient-x 6s ease-in-out infinite;
      }
      @keyframes qr-gradient-x {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      .qr-underline-glow { box-shadow: 0 0 12px 2px rgba(255, 215, 0, 0.7); }
      .qr-grid {
        background-image: linear-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.6) 1px, transparent 1px);
        background-size: 42px 42px;
      }
      .qr-aurora-1 { animation: qr-aurora-a 16s ease-in-out infinite; }
      .qr-aurora-2 { animation: qr-aurora-b 20s ease-in-out infinite; }
      .qr-aurora-3 { animation: qr-aurora-c 14s ease-in-out infinite; }
      @keyframes qr-aurora-a {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(6%, 8%) scale(1.15); }
      }
      @keyframes qr-aurora-b {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(-6%, -8%) scale(1.1); }
      }
      @keyframes qr-aurora-c {
        0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
        50% { transform: translate(-50%, -50%) scale(1.25); opacity: 0.9; }
      }
      .qr-particle {
        animation-name: qr-particle-drift;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
        box-shadow: 0 0 6px 1px rgba(255, 215, 0, 0.7);
      }
      @keyframes qr-particle-drift {
        0% { transform: translate(0, 0); }
        25% { transform: translate(8px, -18px); }
        50% { transform: translate(-6px, -30px); }
        75% { transform: translate(-10px, -12px); }
        100% { transform: translate(0, 0); }
      }
      .qr-sparkle {
        animation-name: qr-sparkle-twinkle;
        animation-timing-function: ease-in-out;
        animation-iteration-count: infinite;
      }
      @keyframes qr-sparkle-twinkle {
        0%, 100% { opacity: 0; transform: scale(0.3); }
        50% { opacity: 1; transform: scale(1.2); }
      }
      .qr-ring-outer {
        border: 2px solid rgba(255, 215, 0, 0.55);
        box-shadow: 0 0 24px rgba(255, 215, 0, 0.25) inset;
        animation: qr-spin-slow 14s linear infinite;
      }
      .qr-ring-middle {
        border: 2px solid rgba(230, 57, 70, 0.65);
        box-shadow: 0 0 24px rgba(230, 57, 70, 0.3) inset;
        animation: qr-spin-slow-rev 10s linear infinite;
      }
      .qr-ring-inner {
        border: 2px solid rgba(255, 222, 74, 0.7);
        animation: qr-spin-slow 7s linear infinite;
      }
      .qr-spin-slow { animation: qr-spin-slow 12s linear infinite; }
      .qr-spin-slow-rev { animation: qr-spin-slow-rev 9s linear infinite; }
      @keyframes qr-spin-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes qr-spin-slow-rev {
        from { transform: rotate(360deg); }
        to { transform: rotate(0deg); }
      }
      .qr-core-glow {
        box-shadow: 0 0 40px 8px rgba(230, 57, 70, 0.55), 0 0 90px 26px rgba(255, 215, 0, 0.28);
        animation: qr-pulse-glow 3.2s ease-in-out infinite;
      }
      @keyframes qr-pulse-glow {
        0%, 100% { box-shadow: 0 0 40px 8px rgba(230, 57, 70, 0.5), 0 0 90px 24px rgba(255, 215, 0, 0.25); }
        50% { box-shadow: 0 0 60px 16px rgba(230, 57, 70, 0.75), 0 0 130px 40px rgba(255, 215, 0, 0.4); }
      }
      .qr-scissors-glow { filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.9)); }
      .qr-float-a { animation: qr-float 5s ease-in-out infinite; }
      .qr-float-b { animation: qr-float 6s ease-in-out infinite 0.6s; }
      .qr-float-c { animation: qr-float 5.5s ease-in-out infinite 1.2s; }
      @keyframes qr-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-14px); }
      }
      .qr-appear {
        animation: qr-appear-anim 0.9s cubic-bezier(0.19, 1, 0.22, 1) both;
      }
      .qr-delay-1 { animation-delay: 0.15s; }
      .qr-delay-2 { animation-delay: 0.3s; }
      .qr-delay-3 { animation-delay: 0.45s; }
      @keyframes qr-appear-anim {
        from { opacity: 0; transform: translateY(24px) rotate(-1deg); }
        to { opacity: 1; transform: translateY(0) rotate(0); }
      }
      .qr-bounce-down { animation: qr-bounce-down-anim 1.6s ease-in-out infinite; }
      @keyframes qr-bounce-down-anim {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(6px); }
      }
      .qr-reveal {
        opacity: 0;
        transform: translateY(48px);
        transition: opacity 0.9s cubic-bezier(0.19, 1, 0.22, 1),
          transform 0.9s cubic-bezier(0.19, 1, 0.22, 1);
      }
      .qr-visible { opacity: 1; transform: translateY(0); }
      .qr-cta-btn {
        background: linear-gradient(135deg, #e63946 0%, #b01824 100%);
        box-shadow: 0 0 0 1px rgba(255, 215, 0, 0.25), 0 20px 50px -10px rgba(230, 57, 70, 0.65),
          0 0 60px rgba(255, 215, 0, 0.2);
        animation: qr-btn-pulse 2.6s ease-in-out infinite;
        transition: transform 0.2s ease;
      }
      .qr-cta-btn:hover { transform: scale(1.035); }
      .qr-cta-btn:active { transform: scale(0.98); }
      .qr-cta-btn-blue {
        background: linear-gradient(135deg, #3949ab 0%, #1a237e 100%);
        box-shadow: 0 0 0 1px rgba(255, 215, 0, 0.25), 0 20px 50px -10px rgba(26, 35, 126, 0.7),
          0 0 60px rgba(57, 73, 171, 0.25);
        transition: transform 0.2s ease;
      }
      .qr-cta-btn-blue:hover { transform: scale(1.035); }
      @keyframes qr-btn-pulse {
        0%, 100% {
          box-shadow: 0 0 0 1px rgba(255, 215, 0, 0.25), 0 20px 50px -10px rgba(230, 57, 70, 0.6),
            0 0 50px rgba(255, 215, 0, 0.18);
        }
        50% {
          box-shadow: 0 0 0 1px rgba(255, 215, 0, 0.4), 0 24px 60px -8px rgba(230, 57, 70, 0.85),
            0 0 80px rgba(255, 215, 0, 0.35);
        }
      }
      .qr-cta-shine {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          100deg,
          transparent 20%,
          rgba(255, 255, 255, 0.35) 50%,
          transparent 80%
        );
        transform: translateX(-150%) skewX(-20deg);
        animation: qr-shine-move 3.2s ease-in-out infinite;
      }
      @keyframes qr-shine-move {
        0% { transform: translateX(-150%) skewX(-20deg); }
        60%, 100% { transform: translateX(200%) skewX(-20deg); }
      }
      .qr-social-btn { transition: transform 0.25s ease, box-shadow 0.25s ease; }
      .qr-social-btn:hover {
        transform: translateY(-4px) scale(1.03);
        box-shadow: 0 16px 34px -8px rgba(0, 0, 0, 0.55);
      }
      .qr-feature-card {
        transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease,
          background 0.3s ease;
      }
      .qr-feature-card:hover {
        transform: translateY(-6px);
        border-color: rgba(255, 215, 0, 0.5);
        box-shadow: 0 20px 40px -14px rgba(230, 57, 70, 0.35);
        background: #141417;
      }
      .qr-barber-card {
        transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
      }
      .qr-barber-card:hover {
        transform: translateY(-6px);
        border-color: rgba(255, 215, 0, 0.5);
        box-shadow: 0 20px 40px -14px rgba(57, 73, 171, 0.5);
      }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.001ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.001ms !important;
        }
      }
    `}</style>
  );
}
