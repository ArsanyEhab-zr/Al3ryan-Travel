import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Search, ShieldCheck, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Navbar({ onOpenTrackModal, settings }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('al3ryan_lang', lng);
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    setLangDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: t('nav.home'), href: '#home' },
    { label: t('nav.book'), href: '#booking' },
    { label: t('nav.gallery'), href: '#gallery' },
    { label: t('nav.reviews'), href: '#reviews' },
    { label: t('nav.contact'), href: '#contact' },
  ]

  const languages = [
    { code: 'ar', label: 'العربية', flag: '🇪🇬' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' }
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <nav
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-6xl rounded-full z-50 transition-all duration-500 ${
          scrolled ? 'liquid-glass-strong py-2 md:py-3 shadow-2xl border-[#f4bd70]/30' : 'liquid-glass py-2 md:py-4'
        }`}
      >
        <div className="px-6 md:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#home"
            onClick={(e) => scrollToSection(e, '#home')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="flex items-center gap-2 select-none group-hover:scale-105 transition-transform">
              {/* Custom Luxury Logo */}
              <img src="/favicon.svg?v=2" alt="Al3ryan Travel" className="w-6 h-6 md:w-10 md:h-10 object-contain drop-shadow-[0_0_8px_rgba(244,189,112,0.4)]" />
              <div className="flex flex-col">
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#f4bd70] to-yellow-200 bg-clip-text text-transparent tracking-wider" style={{ fontFamily: "'Cinzel', serif, sans-serif" }}>
                  Al3ryan Travel
                </span>
                <span className="text-[8px] md:text-[9px] text-gray-400 tracking-[0.3em] uppercase mt-[-4px]">
                  {t('nav.brandSubtitle')}
                </span>
              </div>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-sm font-medium text-[#e5e2e1] hover:text-[#f4bd70] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#f4bd70] hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="text-[#d4c4b3] hover:text-[#f4bd70] p-2 transition-colors flex items-center gap-1"
              >
                <Globe className="w-5 h-5" />
              </button>
              
              {langDropdownOpen && (
                <div className="absolute top-full mt-2 w-32 bg-[#131313] border border-[#f4bd70]/30 rounded-xl overflow-hidden shadow-xl" style={{ [document.documentElement.dir === 'rtl' ? 'left' : 'right']: 0 }}>
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => changeLanguage(l.code)}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-[#f4bd70]/10 transition-colors ${i18n.language === l.code ? 'text-[#f4bd70] font-bold' : 'text-[#e5e2e1]'}`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onOpenTrackModal}
              className="liquid-glass text-[#f4bd70] border border-[#f4bd70]/30 hover:border-[#f4bd70] px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all hover:bg-[#f4bd70]/10 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              {t('nav.trackOrder')}
            </button>

            <a
              href="#booking"
              onClick={(e) => scrollToSection(e, '#booking')}
              className="bg-gradient-to-r from-[#d4a056] to-[#f4bd70] text-[#131313] font-bold px-5 py-2 rounded-full text-xs hover:shadow-[0_0_15px_rgba(244,189,112,0.4)] hover:scale-105 transition-all cursor-pointer"
            >
              {t('nav.bookNow')}
            </a>

            <Link
              to="/admin"
              className="p-2 text-[#d4c4b3] hover:text-[#f4bd70] transition-colors"
              title={t('nav.admin')}
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="text-[#f4bd70] p-1 relative"
            >
              <Globe className="w-6 h-6" />
              {langDropdownOpen && (
                <div className="absolute top-full mt-2 w-32 bg-[#131313] border border-[#f4bd70]/30 rounded-xl overflow-hidden shadow-xl left-1/2 -translate-x-1/2 z-50">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => changeLanguage(l.code)}
                      className={`w-full text-center px-4 py-2 text-sm flex justify-center gap-2 hover:bg-[#f4bd70]/10 transition-colors ${i18n.language === l.code ? 'text-[#f4bd70] font-bold' : 'text-[#e5e2e1]'}`}
                    >
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#f4bd70] p-1 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#131313]/95 backdrop-blur-xl flex flex-col pt-28 px-6 md:hidden">
          <div className="flex flex-col gap-4 text-center">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-lg font-semibold text-[#e5e2e1] hover:text-[#f4bd70] py-2 border-b border-[#504538]/30"
              >
                {link.label}
              </a>
            ))}

            <div className="flex flex-col gap-3 mt-4">
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  onOpenTrackModal()
                }}
                className="w-full liquid-glass text-[#f4bd70] border border-[#f4bd70]/40 py-3 rounded-full font-bold flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                {t('nav.trackOrder')}
              </button>

              <a
                href="#booking"
                onClick={(e) => scrollToSection(e, '#booking')}
                className="w-full text-center bg-[#d4a056] text-[#131313] py-3 rounded-full font-bold shadow-lg"
              >
                {t('nav.bookNow')}
              </a>

              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center text-xs text-[#d4c4b3] py-2 flex items-center justify-center gap-1"
              >
                <ShieldCheck className="w-4 h-4" />
                {t('nav.admin')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
