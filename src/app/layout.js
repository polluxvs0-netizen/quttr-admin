import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'QUTTR Admin | Manage Your Empire',
  description: 'QUTTR Admin Panel — Manage shops, users, and analytics',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen bg-dark-900 text-white">
        {children}

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              borderRadius: '12px',
              padding: '14px 18px',
              fontSize: '14px',
              fontWeight: 600,
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
            },
            success: {
              iconTheme: {
                primary: '#00d9a3',
                secondary: '#fff',
              },
              style: {
                border: '1px solid rgba(0, 217, 163, 0.3)',
              },
            },
            error: {
              iconTheme: {
                primary: '#e63946',
                secondary: '#fff',
              },
              style: {
                border: '1px solid rgba(230, 57, 70, 0.3)',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
