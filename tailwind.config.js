/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ─── QUTTR Brand Colors ────────
        primary: {
          50: '#e6e9f5',
          100: '#c4cae6',
          200: '#9ea9d5',
          300: '#7887c4',
          400: '#5c6eb7',
          500: '#3f56aa',
          600: '#374e9f',
          700: '#2d4491',
          800: '#233a83',
          900: '#12296a',
        },
        secondary: {
          50: '#fee7ea',
          100: '#fdc3ca',
          200: '#fb9ba7',
          300: '#f97383',
          400: '#f75568',
          500: '#e63946',
          600: '#d43241',
          700: '#bf2a39',
          800: '#aa2331',
          900: '#c1121f',
        },
        gold: {
          50: '#fffbe6',
          100: '#fff5c0',
          200: '#ffee97',
          300: '#ffe66d',
          400: '#ffde4a',
          500: '#ffd700',
          600: '#ffc700',
          700: '#ffb400',
          800: '#ffa000',
          900: '#ff8000',
        },
        // ─── Dark Theme Colors ─────────
        dark: {
          50: '#3a3a3a',
          100: '#333333',
          200: '#2b2b2b',
          300: '#242424',
          400: '#1e1e1e',
          500: '#181818',
          600: '#141414',
          700: '#101010',
          800: '#0a0a0a',
          900: '#050505',
          950: '#000000',
        },
        // ─── Status Colors ─────────────
        success: {
          light: '#00d9a3',
          DEFAULT: '#00a87e',
          dark: '#008866',
        },
        error: {
          light: '#ff6b6b',
          DEFAULT: '#e63946',
          dark: '#c1121f',
        },
        warning: {
          light: '#ffb84d',
          DEFAULT: '#ff9500',
          dark: '#cc7700',
        },
        info: {
          light: '#4dabf7',
          DEFAULT: '#1976d2',
          dark: '#0d47a1',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-gold': 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        'gradient-red': 'linear-gradient(135deg, #E63946 0%, #C1121F 100%)',
        'gradient-blue': 'linear-gradient(135deg, #1a237e 0%, #3f56aa 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
        'mesh': 'radial-gradient(at 20% 30%, rgba(230, 57, 70, 0.08) 0px, transparent 50%), radial-gradient(at 80% 70%, rgba(255, 215, 0, 0.05) 0px, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(255, 215, 0, 0.6)',
          },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'gold': '0 4px 20px rgba(255, 215, 0, 0.3)',
        'gold-lg': '0 10px 40px rgba(255, 215, 0, 0.4)',
        'red': '0 4px 20px rgba(230, 57, 70, 0.3)',
        'red-lg': '0 10px 40px rgba(230, 57, 70, 0.5)',
        'glow': '0 0 30px rgba(255, 215, 0, 0.2)',
        'dark-lg': '0 20px 60px rgba(0, 0, 0, 0.5)',
        'inner-dark': 'inset 0 2px 10px rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
};
