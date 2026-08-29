import { MapPin, Phone, MessageSquare, Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Footer({ settings }) {
  const { t } = useTranslation()
  const phone = settings?.phone || '+201001234567'
  const whatsapp = settings?.whatsapp || '+201001234567'
  // Address MUST be hardcoded as "شبرا مصر"
  const address = 'شبرا مصر'

  return (
    <footer id="contact" className="bg-[#0e0e0e] text-[#e5e2e1] pt-16 pb-8 border-t border-[#504538]/30 relative z-10">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Col 1: Brand Info */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2 select-none mb-2">
            {/* Custom Luxury Logo */}
            <img src="/favicon.svg?v=2" alt="Al3ryan Travel" className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(244,189,112,0.4)]" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#f4bd70] to-yellow-200 bg-clip-text text-transparent tracking-wider" style={{ fontFamily: "'Cinzel', serif, sans-serif" }}>
                Al3ryan Travel
              </span>
              <span className="text-[9px] text-gray-400 tracking-[0.3em] uppercase mt-[-4px]">
                {t('nav.brandSubtitle')}
              </span>
            </div>
          </div>
          <p className="text-xs text-[#d4c4b3] leading-relaxed">
            {t('footer.description')}
          </p>
        </div>

        {/* Col 2: Navigation Links */}
        <div>
          <h4 className="text-sm font-bold text-[#f4bd70] mb-4 uppercase tracking-wider font-cairo">
            {t('footer.quickLinks')}
          </h4>
          <ul className="space-y-2 text-xs text-[#d4c4b3]">
            <li><a href="#home" className="hover:text-[#f4bd70] transition-colors">{t('nav.home')}</a></li>
            <li><a href="#booking" className="hover:text-[#f4bd70] transition-colors">{t('nav.book')}</a></li>
            <li><a href="#gallery" className="hover:text-[#f4bd70] transition-colors">{t('nav.gallery')}</a></li>
            <li><a href="#reviews" className="hover:text-[#f4bd70] transition-colors">{t('nav.reviews')}</a></li>
          </ul>
        </div>

        {/* Col 3: Contact & Address (HARDCODED شبرا مصر) */}
        <div>
          <h4 className="text-sm font-bold text-[#f4bd70] mb-4 uppercase tracking-wider font-cairo">
            {t('footer.contact')}
          </h4>
          <ul className="space-y-3 text-xs text-[#d4c4b3]">
            <li className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#f4bd70] shrink-0" />
              <span>{t('footer.hq')} <strong className="text-[#e5e2e1] font-bold">{address}</strong></span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#f4bd70] shrink-0" />
              <a href={`tel:${phone}`} dir="ltr" className="hover:text-[#f4bd70] transition-colors">
                {phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#f4bd70] shrink-0" />
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9+]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="hover:text-[#f4bd70] transition-colors"
              >
                {t('footer.whatsapp')} {whatsapp}
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Quality Guarantee */}
        <div>
          <h4 className="text-sm font-bold text-[#f4bd70] mb-4 uppercase tracking-wider font-cairo">
            {t('footer.guarantee')}
          </h4>
          <div className="liquid-glass p-4 rounded-2xl space-y-2 border border-[#f4bd70]/20">
            <div className="flex items-center gap-2 text-xs font-bold text-[#e5e2e1]">
              <Shield className="w-4 h-4 text-[#f4bd70]" />
              {t('footer.guaranteeTitle')}
            </div>
            <p className="text-[11px] text-[#d4c4b3]">
              {t('footer.guaranteeDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto px-4 pt-6 border-t border-[#504538]/30 flex flex-col sm:flex-row justify-between items-center text-xs text-[#d4c4b3] gap-2">
        <p>{t('footer.copyright')}</p>
        <p className="flex items-center gap-1">
          {t('footer.addressTitle')} <span className="text-[#f4bd70] font-bold">{address}</span>
        </p>
      </div>
    </footer>
  )
}
