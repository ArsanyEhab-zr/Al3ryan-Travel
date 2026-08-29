import { useState } from 'react'
import { useLandmarks } from '../hooks/useSupabaseData'
import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const getTranslated = (item, field, lang) => {
  if (lang === 'ar' || !item.translations || !item.translations[lang] || !item.translations[lang][field]) {
    return item[field];
  }
  return item.translations[lang][field];
};

export function SmartFallbackImage({ primarySrc, city, alt, className }) {
  // Robust backup arrays. We check keywords to avoid exact Arabic spelling strictness
  const getFallbacks = (cityName) => {
    if (cityName.includes('قاهر')) return [
      'https://images.unsplash.com/photo-1553907725-cb78bc895514?q=80&w=800',
      'https://picsum.photos/seed/cairo/800/1000'
    ];
    if (cityName.includes('قصر')) return [
      'https://images.unsplash.com/photo-1600520611035-84227091917f?q=80&w=800',
      'https://picsum.photos/seed/luxor/800/1000'
    ];
    if (cityName.includes('فيوم')) return [
      'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?q=80&w=800',
      'https://picsum.photos/seed/fayoum/800/1000'
    ];
    if (cityName.includes('قنا')) return [
      'https://images.unsplash.com/photo-1589801327179-8255b6a37452?q=80&w=800',
      'https://picsum.photos/seed/qena/800/1000'
    ];
    // General Fallbacks
    return [
      'https://images.unsplash.com/photo-1539667468225-eebb663053e6?q=80&w=800',
      'https://picsum.photos/seed/egypt/800/1000'
    ];
  };

  const sources = [primarySrc, ...getFallbacks(city || '')].filter(Boolean);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <img
      src={sources[currentIndex]}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        if (currentIndex < sources.length - 1) {
          setCurrentIndex(prev => prev + 1);
        }
      }}
    />
  );
}

export default function TourismGallery() {
  const { t, i18n } = useTranslation()
  const { landmarks, loading } = useLandmarks()

  // Duplicate landmarks for seamless infinite scrolling
  const scrollItems = [...landmarks, ...landmarks]

  return (
    <section id="gallery" className="py-24 relative overflow-hidden bg-[#131313] z-10 border-t border-white/5">
      {/* Map Journey Aesthetic / Topographic Background */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.83v58.34l-.83.83H5.373l-.83-.83V.83l.83-.83h49.254zm-1.66 1.66H7.033v56.68h45.934V1.66zM24 16c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0-2c0-.552-.448-1-1-1s-1 .448-1 1 .448 1 1 1 1-.448 1-1zm30 14c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0-2c0-.552-.448-1-1-1s-1 .448-1 1 .448 1 1 1 1-.448 1-1zm-40 24c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0-2c0-.552-.448-1-1-1s-1 .448-1 1 .448 1 1 1 1-.448 1-1zM36 46c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0-2c0-.552-.448-1-1-1s-1 .448-1 1 .448 1 1 1 1-.448 1-1z' fill='%23f4bd70' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}
      />

      <div className="text-center mb-16 relative z-10 px-4 max-w-4xl mx-auto">
        <motion.span 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#f4bd70] text-xs font-bold uppercase tracking-widest bg-[#f4bd70]/10 px-4 py-1.5 rounded-full border border-[#f4bd70]/20 inline-block mb-4 shadow-[0_0_15px_rgba(244,189,112,0.15)]"
        >
          {t('gallery.badge')}
        </motion.span>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold font-cairo text-[#e5e2e1] mb-6 leading-tight"
        >
          {t('gallery.titlePart1')} <span className="text-[#f4bd70]">{t('gallery.titleHighlight')}</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-[#d4c4b3] text-sm md:text-lg max-w-2xl mx-auto leading-relaxed"
        >
          {t('gallery.description')}
        </motion.p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="w-12 h-12 animate-spin text-[#f4bd70]" />
        </div>
      ) : landmarks.length === 0 ? (
        <div className="text-center text-[#d4c4b3] py-20 text-lg">
          {t('gallery.empty')}
        </div>
      ) : (
        <div className="relative w-full overflow-hidden flex items-center h-[550px] md:h-[600px] mt-10">
          
          {/* Faded Edges for the cinematic marquee effect */}
          <div className="absolute top-0 left-0 w-24 md:w-64 h-full bg-gradient-to-r from-[#131313] to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-24 md:w-64 h-full bg-gradient-to-l from-[#131313] to-transparent z-20 pointer-events-none" />
          
          {/* Decorative Path Line Behind Cards (The Journey Route) */}
          <div className="absolute w-full h-0.5 top-1/2 -translate-y-1/2 left-0 border-t-[3px] border-dashed border-[#f4bd70]/20 z-0 pointer-events-none" />

          {/* Marquee Track container - LTR context ensures consistent scroll direction */}
          <div dir="ltr" className="flex items-center w-full h-full overflow-hidden">
            <div className="flex gap-6 animate-marquee hover:[animation-play-state:paused] w-max px-6">
              {scrollItems.map((landmark, index) => (
                <motion.div
                  key={`${landmark.id}-${index}`}
                  dir="rtl" // Inner content back to RTL
                  whileHover={{ scale: 1.03, y: -10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative w-[280px] md:w-[320px] min-h-[350px] aspect-[3/4] rounded-2xl overflow-hidden shrink-0 group border border-white/10 bg-slate-900 shadow-2xl cursor-pointer"
                >
                  {/* Blurred Background Image */}
                  <SmartFallbackImage 
                    primarySrc={landmark.image_url} 
                    city={landmark.city}
                    alt={landmark.city}
                    className="absolute inset-0 w-full h-full object-cover blur-[3px] scale-110 transition-transform duration-700 group-hover:scale-125 group-hover:blur-[1px]"
                  />
                  
                  {/* Heavy Dark Overlay for text readability */}
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-500" />
                  
                  {/* Content Layer */}
                  <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 text-center">
                    <h3 dir="auto" className="text-2xl font-bold text-[#f4bd70] mb-3 drop-shadow-md">
                      {getTranslated(landmark, 'name', i18n.language)}
                    </h3>
                    
                    <div className="flex items-center justify-center gap-3 mb-4">
                       <span className="text-gray-200 text-sm flex items-center gap-1">
                         📍 {getTranslated(landmark, 'city', i18n.language)}
                       </span>
                       {landmark.rating && (
                         <span className="text-yellow-400 text-sm flex items-center gap-1">
                           ⭐ {landmark.rating}
                         </span>
                       )}
                    </div>
                    
                    {landmark.description && (
                      <p dir="auto" className="text-gray-300 text-sm leading-relaxed line-clamp-4">
                        {getTranslated(landmark, 'description', i18n.language)}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* CSS Animation for Infinite Marquee */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 120s linear infinite;
        }
        /* Extra styling for smoother renders */
        .animate-marquee > div {
          will-change: transform;
        }
      `}</style>
    </section>
  )
}
