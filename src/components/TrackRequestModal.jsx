import { useState } from 'react'
import { useTripRequests } from '../hooks/useSupabaseData'
import { X, Search, Clock, CheckCircle2, XCircle, Car, MapPin, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function TrackRequestModal({ isOpen, onClose }) {
  const { t } = useTranslation()
  const { searchRequestsByPhone } = useTripRequests()
  const [phoneInput, setPhoneInput] = useState('')
  const [results, setResults] = useState(null)
  const [searching, setSearching] = useState(false)

  if (!isOpen) return null

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!phoneInput.trim()) return
    setSearching(true)
    const res = await searchRequestsByPhone(phoneInput)
    setResults(res)
    setSearching(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#131313]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="liquid-glass-strong rounded-3xl w-full max-w-lg border border-[#f4bd70]/30 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-6 border-b border-[#504538]/40 flex justify-between items-center bg-[#131313]/50">
          <div className="flex items-center gap-2 text-[#f4bd70]">
            <Search className="w-5 h-5" />
            <h3 className="font-bold text-lg text-[#e5e2e1] font-cairo">{t('track.title')}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#d4c4b3] hover:text-[#f4bd70] p-1 rounded-full hover:bg-[#1c1b1b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <form onSubmit={handleSearch} className="space-y-3">
            <label className="text-xs text-[#d4c4b3] block">{t('track.phoneLabel')}</label>
            <div className="flex gap-2">
              <input
                type="tel"
                dir="ltr"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="+20 10X XXX XXXX"
                className="w-full bg-[#1c1b1b] border border-[#504538] rounded-xl px-4 py-2.5 text-left text-[#e5e2e1] text-sm focus:outline-none focus:border-[#f4bd70]"
              />
              <button
                type="submit"
                disabled={searching}
                className="bg-[#f4bd70] text-[#131313] font-bold px-5 py-2.5 rounded-xl text-sm hover:brightness-110 transition-all shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : t('track.search')}
              </button>
            </div>
          </form>

          {/* Results List */}
          {results !== null && (
            <div className="space-y-4 max-h-80 overflow-y-auto no-scrollbar pt-2">
              {results.length === 0 ? (
                <div className="text-center py-8 text-[#d4c4b3] text-sm bg-[#1c1b1b]/50 rounded-2xl p-4">
                  {t('track.empty')}
                </div>
              ) : (
                results.map((req) => (
                  <div
                    key={req.id}
                    className="liquid-glass rounded-2xl p-4 border border-[#504538]/40 space-y-3 text-right"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-[#d4c4b3]">
                        {t('track.date')} {new Date(req.created_at).toLocaleDateString('en-GB')}
                      </span>
                      {req.status === 'accepted' ? (
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {t('track.accepted')}
                        </span>
                      ) : req.status === 'rejected' ? (
                        <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> {t('track.rejected')}
                        </span>
                      ) : (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {t('track.pending')}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-[#e5e2e1]">
                      <MapPin className="w-4 h-4 text-[#f4bd70] shrink-0" />
                      <span>{t('track.destination')} <strong className="text-[#f4bd70]">{req.destination}</strong></span>
                    </div>

                    {req.cars && (
                      <div className="flex items-center gap-2 text-xs text-[#d4c4b3]">
                        <Car className="w-3.5 h-3.5 text-[#f4bd70] shrink-0" />
                        <span>{t('track.car')} {req.cars.name}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
