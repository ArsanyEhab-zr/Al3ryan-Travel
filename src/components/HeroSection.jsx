import { useEffect, useRef } from 'react'
import { ChevronDown, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function HeroSection() {
  const videoRef = useRef(null)
  const { t } = useTranslation()

  const scrollToBooking = (e) => {
    e.preventDefault()
    const bookingElement = document.querySelector('#booking')
    if (bookingElement) {
      bookingElement.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true
      videoRef.current.play().catch(() => {})
    }
  }, [])

  return (
    <section
      id="home"
      className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
    >
      {/* 1. Video Background (z-0) */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80"
        className="absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000"
      >
        <source src="https://assets.mixkit.co/videos/preview/mixkit-driving-a-luxury-car-on-a-highway-42867-large.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 2. Overlay for Readability (z-10) */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* 3. Hero Content (z-20, Centered) */}
      <div className="relative z-20 max-w-4xl mx-auto text-center px-4 pt-28 pb-16 flex flex-col items-center justify-center">
        {/* Subtle Luxury Badge */}
        <div className="liquid-glass text-[#f4bd70] px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-2 mb-6 border border-[#f4bd70]/30 shadow-lg">
          <Sparkles className="w-4 h-4 text-[#f4bd70]" />
          <span>{t('hero.badge')}</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-cairo text-[#f4bd70] leading-tight tracking-tight mb-6 drop-shadow-md">
          <span className="bg-gradient-to-r from-[#f4bd70] via-[#ffe0b2] to-[#d4a056] bg-clip-text text-transparent">
            {t('hero.title')}
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="text-lg sm:text-2xl font-cairo text-white max-w-2xl mb-10 leading-relaxed font-normal drop-shadow">
          {t('hero.subtitle')}
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#booking"
            onClick={scrollToBooking}
            className="bg-[#f4bd70] hover:bg-[#e0a85c] text-[#131313] font-bold text-lg px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(244,189,112,0.4)] hover:shadow-[0_0_30px_rgba(244,189,112,0.7)] cursor-pointer border border-[#f4bd70]/50"
          >
            {t('hero.cta')}
          </a>
        </div>
      </div>

      {/* Scroll Indicator (z-20) */}
      <a
        href="#booking"
        onClick={scrollToBooking}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[#f4bd70] hover:text-white transition-colors duration-300 animate-bounce p-2 cursor-pointer z-20"
        aria-label="Scroll to booking section"
      >
        <ChevronDown className="w-8 h-8 drop-shadow-md" />
      </a>
    </section>
  )
}
