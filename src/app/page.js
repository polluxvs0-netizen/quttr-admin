'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        // Verify token is still valid
        const result = await authService.verifyToken();
        if (result.valid) {
          router.push('/dashboard');
        } else {
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="text-center animate-fade-in">
        {/* Logo */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-full bg-gradient-gold animate-pulse-glow"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-red flex items-center justify-center border-2 border-gold-500">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Brand */}
        <h1 className="text-4xl font-black text-gradient-gold tracking-widest mb-2">
          QUTTR
        </h1>
        <p className="text-xs font-bold text-white/50 tracking-[0.3em] mb-8">
          ADMIN PANEL
        </p>

        {/* Loader */}
        <div className="w-8 h-8 border-3 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-white/40 text-sm mt-4">Loading...</p>
      </div>
    </div>
  );
}
