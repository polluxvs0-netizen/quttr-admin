'use client';

import DownloadButton from './DownloadButton';

const benefits = [
  { icon: '📱', title: 'Digital Bookings', desc: 'Manage all appointments in one place' },
  { icon: '💰', title: 'Track Earnings', desc: 'Real-time income and payment tracking' },
  { icon: '👥', title: 'Grow Customer Base', desc: 'Reach more customers in your area' },
  { icon: '⭐', title: 'Build Reputation', desc: 'Get genuine reviews from customers' },
  { icon: '📊', title: 'Business Analytics', desc: 'Insights to help you grow faster' },
];

export default function BarberSection({ onBarberDownloadClick }) {
  return (
    <div className="max-w-6xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center mb-16">
        
        {/* Business Logo/Icon */}
        <div className="inline-block mb-6">
          <div className="relative w-24 h-24 mx-auto">
            {/* Glow */}
            <div className="absolute inset-0 bg-business-500 rounded-full blur-2xl opacity-60 animate-pulse" />
            
            {/* Logo Container */}
            <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-business-500 via-business-700 to-business-900 flex items-center justify-center shadow-business-lg">
              <span className="text-4xl">💼</span>
            </div>
          </div>
        </div>

        <div className="inline-block mb-4">
          <span className="chip bg-business-500/10 text-business-400 border border-business-500/30">
            💈 FOR BARBERS
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-black mb-4">
          Are You a <span className="text-gradient-business">Barber?</span>
        </h2>
        
        <p className="text-2xl md:text-3xl text-gradient-gold font-bold mb-3">
          Manage Your Empire. Grow Your Business.
        </p>
        
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Join thousands of barbers already growing with Quttr BUSINESS
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {benefits.map((benefit, index) => (
          <div
            key={benefit.title}
            className="card p-6 border-business-500/20 hover:border-accent-500/50 transition-all duration-300 group animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-business-500 to-business-800 flex items-center justify-center mb-4 shadow-business group-hover:scale-110 transition-transform">
              <span className="text-3xl">{benefit.icon}</span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold mb-2 text-white">
              {benefit.title}
            </h3>

            {/* Description */}
            <p className="text-white/60">
              {benefit.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Business App Download Button */}
      <div className="max-w-sm mx-auto mb-8">
        <DownloadButton
          variant="business"
          onClick={onBarberDownloadClick}
        />
      </div>

      {/* Registration Help */}
      <div className="text-center">
        <p className="text-white/60 mb-6 text-lg">
          Need help getting started?
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://wa.me/919519953149?text=Hi%2C%20I%20want%20to%20register%20as%20a%20barber%20on%20Quttr"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brand"
            style={{ 
              background: 'linear-gradient(to bottom, #25D366, #20BA5A)',
              boxShadow: '0 8px 32px rgba(37, 211, 102, 0.3)'
            }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            WhatsApp Us to Register
          </a>
          
          <a
            href="tel:+919519953149"
            className="btn-outline border-accent-500/50 text-accent-500 hover:bg-accent-500 hover:text-surface-100"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.59l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1zM19 12h2a9 9 0 00-9-9v2c3.87 0 7 3.13 7 7zm-4 0h2c0-2.76-2.24-5-5-5v2c1.66 0 3 1.34 3 3z"/>
            </svg>
            Call Us
          </a>
        </div>
      </div>
    </div>
  );
}
