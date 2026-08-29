import { useState } from 'react'
import { useReviews } from '../hooks/useSupabaseData'
import { Star, MessageSquarePlus, CheckCircle, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function ReviewsSection() {
  const { t } = useTranslation()
  const { reviews, loading, submitReview } = useReviews(true)

  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [hoverRating, setHoverRating] = useState(0)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedSuccess, setSubmittedSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    if (!name.trim()) {
      setErrorMsg(t('reviews.errName'))
      return
    }
    if (!comment.trim()) {
      setErrorMsg(t('reviews.errComment'))
      return
    }

    setIsSubmitting(true)
    const res = await submitReview({
      client_name: name,
      rating,
      comment,
    })
    setIsSubmitting(false)

    if (res.success) {
      setSubmittedSuccess(true)
      setName('')
      setComment('')
      setRating(5)
    } else {
      setErrorMsg(t('reviews.errGeneric'))
    }
  }

  return (
    <section id="reviews" className="py-20 px-4 max-w-6xl mx-auto relative z-10">
      <div className="text-center mb-12">
        <span className="text-[#f4bd70] text-xs font-bold uppercase tracking-widest bg-[#f4bd70]/10 px-4 py-1.5 rounded-full border border-[#f4bd70]/20 inline-block mb-3">
          {t('reviews.badge')}
        </span>
        <h2 className="text-3xl md:text-5xl font-bold font-cairo text-[#e5e2e1] mb-4">
          {t('reviews.titlePart1')} <span className="text-[#f4bd70]">{t('reviews.titleHighlight')}</span>
        </h2>
        <p className="text-[#d4c4b3] text-sm md:text-base max-w-xl mx-auto">
          {t('reviews.subtitle')}
        </p>
      </div>

      {/* Reviews Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[1, 2, 3].map((i) => (
            <div key={i} className="liquid-glass h-48 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="liquid-glass rounded-2xl p-8 text-center text-[#d4c4b3] mb-12">
          {t('reviews.empty')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-white/5 border border-[#504538]/30 rounded-2xl p-6 flex flex-col relative overflow-hidden backdrop-blur-sm hover:border-[#f4bd70]/40 transition-colors duration-300">
              
              {/* 1. Header: Quote Icon & Stars (Flexbox prevents overlap) */}
              <div className="flex justify-between items-start mb-4 w-full">
                <svg className="w-8 h-8 text-[#f4bd70] opacity-40 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < rev.rating ? 'text-[#f4bd70]' : 'text-[#504538]'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>

              {/* 2. Body: Content with dynamic direction */}
              <div dir="auto" className="flex flex-col flex-grow">
                <p className="text-[#e5e2e1] text-sm leading-relaxed text-start mb-6 font-cairo">
                  "{rev.comment}"
                </p>

                {/* 3. Footer: Author Info */}
                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-[#504538]/30">
                  <div className="w-10 h-10 rounded-full bg-[#f4bd70]/20 flex items-center justify-center text-[#f4bd70] font-bold shrink-0 text-sm border border-[#f4bd70]/40">
                    {rev.client_name?.charAt(0) || 'ع'}
                  </div>
                  <div className="flex flex-col text-start overflow-hidden">
                    <span className="text-sm font-bold text-[#e5e2e1] truncate">{rev.client_name}</span>
                    <span className="text-[10px] text-[#d4c4b3] opacity-70 flex items-center gap-1">
                      {t('reviews.trustedCustomer')}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Add Review Form */}
      <div className="liquid-glass-strong rounded-3xl p-6 md:p-10 border border-[#f4bd70]/20 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#f4bd70]/10 border border-[#f4bd70]/30 flex items-center justify-center text-[#f4bd70]">
            <MessageSquarePlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#e5e2e1] font-cairo">{t('reviews.addReview')}</h3>
            <p className="text-xs text-[#d4c4b3]">{t('reviews.addReviewDesc')}</p>
          </div>
        </div>

        {submittedSuccess ? (
          <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-2 text-emerald-300">
            <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <h4 className="font-bold text-lg text-emerald-200">{t('reviews.successTitle')}</h4>
            <p className="text-xs">{t('reviews.successDesc')}</p>
            <button
              onClick={() => setSubmittedSuccess(false)}
              className="mt-4 text-xs text-[#f4bd70] underline cursor-pointer"
            >
              {t('reviews.addAnother')}
            </button>
          </div>
        ) : (
          <form onSubmit={handleReviewSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-[#f4bd70] block mb-1">{t('reviews.nameLabel')}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('reviews.namePlaceholder')}
                  className="w-full bg-[#1c1b1b]/80 border border-[#504538] rounded-xl px-4 py-2.5 text-[#e5e2e1] text-sm focus:outline-none focus:border-[#f4bd70]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#f4bd70] block mb-1">{t('reviews.ratingLabel')}</label>
                <div className="flex items-center gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 transition-all ${
                          star <= (hoverRating || rating)
                            ? 'fill-[#f4bd70] text-[#f4bd70] scale-110'
                            : 'text-[#504538]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#f4bd70] mr-2">({rating} / 5)</span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#f4bd70] block mb-1">{t('reviews.commentLabel')}</label>
              <textarea
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t('reviews.commentPlaceholder')}
                className="w-full bg-[#1c1b1b]/80 border border-[#504538] rounded-xl px-4 py-2.5 text-[#e5e2e1] text-sm focus:outline-none focus:border-[#f4bd70] resize-none"
              ></textarea>
            </div>

            {errorMsg && <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded-lg">{errorMsg}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#d4a056] to-[#f4bd70] text-[#131313] font-bold py-3 rounded-xl hover:scale-[1.01] transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('reviews.submittingReview')}
                </>
              ) : (
                t('reviews.submitReview')
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
