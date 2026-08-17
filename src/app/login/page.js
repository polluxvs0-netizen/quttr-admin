'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  Shield,
  Phone,
  Lock,
  ArrowRight,
  Loader2,
  ShieldCheck,
  KeyRound,
  ChevronLeft,
  Eye,
  EyeOff,
} from 'lucide-react';
import { authService } from '../../services/auth';

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: phone, 2: otp, 3: password
  const [loading, setLoading] = useState(false);

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [devOTP, setDevOTP] = useState(null);

  const otpRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Redirect if already logged in
  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  // Resend OTP timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Auto-focus first OTP box when moving to step 2
  useEffect(() => {
    if (step === 2 && otpRefs[0].current) {
      setTimeout(() => otpRefs[0].current?.focus(), 300);
    }
  }, [step]);

  // ─── Step 1: Send OTP ─────────────────────────
  const handleSendOTP = async (e) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);

    if (cleanPhone.length !== 10) {
      toast.error('Enter valid 10-digit phone number');
      return;
    }

    setLoading(true);
    const result = await authService.sendOTP(cleanPhone);
    setLoading(false);

    if (result.success) {
      toast.success('OTP sent to your phone');
      setStep(2);
      setResendTimer(60);
      setDevOTP(result.devOTP);
    } else {
      toast.error(result.message);
    }
  };

  // ─── OTP Input Handler ────────────────────────
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-advance
    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }

    // Auto-submit when complete
    if (index === 3 && value && newOtp.every((d) => d)) {
      handleVerifyOTP(newOtp.join(''));
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted.length === 4) {
      setOtp(pasted.split(''));
      handleVerifyOTP(pasted);
    }
  };

  // ─── Step 2: Verify OTP ───────────────────────
  const handleVerifyOTP = async (otpCode) => {
    const code = otpCode || otp.join('');
    if (code.length !== 4) {
      toast.error('Enter complete 4-digit OTP');
      return;
    }

    setLoading(true);
    const result = await authService.verifyOTP(phone, code);
    setLoading(false);

    if (result.success) {
      toast.success('OTP verified');
      setStep(3);
    } else {
      toast.error(result.message);
      setOtp(['', '', '', '']);
      otpRefs[0].current?.focus();
    }
  };

  // ─── Step 3: Verify Password + Login ─────────
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      toast.error('Enter your admin password');
      return;
    }

    setLoading(true);
    const result = await authService.login(phone, password);
    setLoading(false);

    if (result.success) {
      toast.success(`Welcome back, ${result.admin.name}!`);
      setTimeout(() => router.push('/dashboard'), 500);
    } else {
      toast.error(result.message);
      setPassword('');
    }
  };

  // ─── Resend OTP ───────────────────────────────
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    setLoading(true);
    const result = await authService.sendOTP(phone);
    setLoading(false);

    if (result.success) {
      toast.success('New OTP sent');
      setResendTimer(60);
      setOtp(['', '', '', '']);
      setDevOTP(result.devOTP);
    } else {
      toast.error(result.message);
    }
  };

  // ─── Back button ──────────────────────────────
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setOtp(['', '', '', '']);
    } else if (step === 3) {
      setStep(2);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* ─── Animated Background ───────────────── */}
      <div className="absolute inset-0 bg-mesh"></div>

      <div className="absolute top-0 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl animate-pulse"></div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      ></div>

      {/* ─── Main Card ─────────────────────────── */}
      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gold-500/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-red border-2 border-gold-500 flex items-center justify-center shadow-red-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-black text-gradient-gold tracking-widest mt-4">
            QUTTR
          </h1>
          <p className="text-xs font-bold text-white/50 tracking-[0.3em] mt-1">
            ADMIN PANEL
          </p>
        </div>

        {/* ─── Card ──────────────────────────── */}
        <div className="card p-8">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    step >= s
                      ? 'bg-gradient-gold text-dark-900 shadow-gold'
                      : 'bg-dark-400 text-white/40 border border-white/10'
                  }`}
                >
                  {step > s ? '✓' : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-8 h-0.5 transition-all ${
                      step > s ? 'bg-gold-500' : 'bg-white/10'
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          {/* Back button */}
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-white/50 hover:text-white text-sm mb-4 transition-colors"
              disabled={loading}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {/* ═══════════════════════════════════════
              STEP 1: PHONE NUMBER
              ═══════════════════════════════════════ */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="animate-fade-in">
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center mb-3">
                  <Phone className="w-6 h-6 text-gold-500" />
                </div>
                <h2 className="text-2xl font-black text-white">Admin Access</h2>
                <p className="text-white/50 text-sm mt-1">
                  Enter your registered admin phone
                </p>
              </div>

              <label className="label">
                <Phone className="w-3 h-3 inline mr-1" />
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <span className="text-gold-500 font-bold">+91</span>
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                  placeholder="9580133593"
                  className="input pl-14 text-lg tracking-wider font-semibold"
                  maxLength={10}
                  autoFocus
                  disabled={loading}
                />
              </div>
              <p className="label-hint">Only registered admin phones allowed</p>

              <button
                type="submit"
                disabled={loading || phone.length !== 10}
                className="btn-gold w-full mt-6 h-14 text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ═══════════════════════════════════════
              STEP 2: OTP VERIFICATION
              ═══════════════════════════════════════ */}
          {step === 2 && (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-6 h-6 text-gold-500" />
                </div>
                <h2 className="text-2xl font-black text-white">Verify OTP</h2>
                <p className="text-white/50 text-sm mt-1">
                  Enter 4-digit code sent to
                </p>
                <p className="text-gold-500 font-bold mt-1">+91 {phone}</p>
              </div>

              {/* Dev OTP display */}
              {devOTP && (
                <div className="bg-gold-500/10 border border-gold-500/30 rounded-xl p-3 mb-4 text-center">
                  <p className="text-xs text-gold-500 font-bold">
                    DEV MODE — OTP: <span className="tracking-widest">{devOTP}</span>
                  </p>
                </div>
              )}

              {/* OTP Boxes */}
              <div className="flex gap-3 justify-center mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={otpRefs[index]}
                    type="text"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={index === 0 ? handleOtpPaste : undefined}
                    disabled={loading}
                    className="w-16 h-16 text-center text-2xl font-black bg-dark-500 border border-white/10 rounded-xl text-white focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20 transition-all"
                    maxLength={1}
                  />
                ))}
              </div>

              <button
                onClick={() => handleVerifyOTP()}
                disabled={loading || otp.some((d) => !d)}
                className="btn-gold w-full h-14 text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify OTP
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>

              {/* Resend timer */}
              <div className="text-center mt-4">
                {resendTimer > 0 ? (
                  <p className="text-white/40 text-sm">
                    Resend OTP in{' '}
                    <span className="text-gold-500 font-bold">
                      {resendTimer}s
                    </span>
                  </p>
                ) : (
                  <button
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-gold-500 text-sm font-semibold hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════
              STEP 3: PASSWORD
              ═══════════════════════════════════════ */}
          {step === 3 && (
            <form onSubmit={handleLogin} className="animate-fade-in">
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center mb-3">
                  <KeyRound className="w-6 h-6 text-gold-500" />
                </div>
                <h2 className="text-2xl font-black text-white">
                  Enter Password
                </h2>
                <p className="text-white/50 text-sm mt-1">
                  Final step to access admin panel
                </p>
              </div>

              <label className="label">
                <Lock className="w-3 h-3 inline mr-1" />
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="input pr-12"
                  autoFocus
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !password}
                className="btn-gold w-full mt-6 h-14 text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login to Admin Panel
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>

              {/* Security note */}
              <div className="mt-6 p-3 bg-info/10 border border-info/20 rounded-xl">
                <p className="text-xs text-info-light flex items-center gap-2">
                  <Shield className="w-3 h-3 flex-shrink-0" />
                  Your session will expire in 24 hours
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-white/30">
            © 2024 QUTTR • Admin Panel v1.0.0
          </p>
          <p className="text-xs text-white/20 mt-1">
            Protected by 3-step verification
          </p>
        </div>
      </div>
    </div>
  );
}
