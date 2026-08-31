import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useClientMoments } from '../hooks/useSupabaseData';

export default function ClientMoments() {
  const { t } = useTranslation();
  const { clientMoments, loading } = useClientMoments();

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (clientMoments.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % clientMoments.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(timer);
  }, [clientMoments.length]);

  if (!loading && clientMoments.length === 0) {
    return null; // Gracefully handle empty state
  }

  return (
    <section className="py-20 bg-[#0a0a0a] relative border-t border-white/5">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <span className="inline-block py-1 px-3 rounded-full bg-[#f4bd70]/10 border border-[#f4bd70]/20 text-[#f4bd70] text-sm font-bold tracking-wider mb-4">
            {t('moments.badge')}
          </span>
          <h2 dir="auto" className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('moments.titlePart1')} <span className="text-[#f4bd70]">{t('moments.titleHighlight')}</span>
          </h2>
          <p dir="auto" className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            {t('moments.description')}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl shadow-[#f4bd70]/5 border border-white/10 group">
          
          {clientMoments.map((moment, index) => (
            <div
              key={moment.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* 1. Ambient Blurred Background (Fills the empty space elegantly) */}
              <img
                src={moment.image_url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110"
              />
              
              {/* 2. Main Foreground Image (100% visible, never cropped) */}
              <img
                src={moment.image_url}
                alt="Client Moment"
                className="absolute inset-0 w-full h-full object-contain p-4 md:p-8 drop-shadow-2xl"
              />
            </div>
          ))}

          {/* Dark gradient overlay for elegance */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-20 pointer-events-none" />

          {/* Dots Navigation */}
          <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center gap-3">
            {clientMoments.map((moment, index) => (
              <button
                key={moment.id}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex 
                    ? 'w-8 h-2 bg-[#f4bd70]' 
                    : 'w-2 h-2 bg-white/50 hover:bg-white'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
