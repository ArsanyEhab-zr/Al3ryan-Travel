import { useState, useEffect, useCallback, useMemo } from 'react'
import { useCars, useTripRequests, useLandmarks } from '../hooks/useSupabaseData'
import { Users, MapPin, Phone, Car, CheckCircle2, MessageSquare, AlertCircle, ArrowLeft, Search, Loader2, Navigation, X, Map as MapIcon, Plus, Minus, Compass, Star } from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useTranslation } from 'react-i18next'

// Fix Leaflet's default icon path issues in React
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
})

const getTranslated = (item, field, lang) => {
  if (lang === 'ar' || !item.translations || !item.translations[lang] || !item.translations[lang][field]) {
    return item[field];
  }
  return item.translations[lang][field];
};


const CAR_FALLBACK_IMG = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=800'

// Concise reverse geocoding: returns suburb/neighborhood + city only
const reverseGeocode = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
    )
    const data = await res.json()
    const addr = data.address || {}
    // Build a concise address: suburb/neighbourhood, city/town, state
    const parts = [
      addr.suburb || addr.neighbourhood || addr.village || addr.hamlet || '',
      addr.city || addr.town || addr.county || '',
      addr.state || ''
    ].filter(Boolean)
    return parts.length > 0 ? parts.join('، ') : data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`
  }
}

// Component to handle map clicks
function MapClickHandler({ onLocationSelected }) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } = e.latlng
      const address = await reverseGeocode(lat, lng)
      onLocationSelected({ lat, lng, address })
    }
  })
  return null
}

export default function BookingSection({ settings, onOpenTrackModal }) {
  const { t, i18n } = useTranslation()
  const { cars, loading: carsLoading } = useCars(true)
  const { submitTripRequest } = useTripRequests()
  const { landmarks, loading: landmarksLoading } = useLandmarks()

  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [passengersCount, setPassengersCount] = useState(1)
  const [selectedCarId, setSelectedCarId] = useState(null)
  const [clientPhone, setClientPhone] = useState('')
  const [selectedLandmark, setSelectedLandmark] = useState(null)
  const [needsGuide, setNeedsGuide] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [gpsLoading, setGpsLoading] = useState(false)
  const [gpsError, setGpsError] = useState('')
  const [submittedData, setSubmittedData] = useState(null)
  const [successAnimating, setSuccessAnimating] = useState(false)

  // Map modal state - supports both pickup and destination
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [mapTarget, setMapTarget] = useState('destination') // 'pickup' or 'destination'
  const [mapPin, setMapPin] = useState(null)

  // Dynamic cars from Supabase with capacity filtering
  const filteredCars = cars.filter((car) => car.capacity >= Number(passengersCount))
  const selectedCar = cars.find((c) => c.id === selectedCarId)

  // Filter landmarks locally
  const filteredLandmarks = useMemo(() => {
    if (!searchQuery) return landmarks
    const lowerQuery = searchQuery.toLowerCase()
    return landmarks.filter(l => 
      l.name.toLowerCase().includes(lowerQuery) || 
      l.city.toLowerCase().includes(lowerQuery)
    )
  }, [landmarks, searchQuery])

  // Dynamic max passengers from selected car
  const maxPassengers = selectedCar?.max_passengers || 5

  // Passenger stepper handlers (1 to maxPassengers)
  const incrementPassengers = () => {
    setPassengersCount((prev) => {
      const limit = selectedCar?.max_passengers || 5
      const next = Math.min(Number(prev) + 1, limit)
      return next
    })
  }
  const decrementPassengers = () => {
    setPassengersCount((prev) => {
      const next = Math.max(Number(prev) - 1, 1)
      return next
    })
  }

  // When car selection changes, clamp passenger count to new max
  useEffect(() => {
    if (selectedCar) {
      const carMax = selectedCar.max_passengers || 5
      if (passengersCount > carMax) {
        setPassengersCount(carMax)
      }
    }
  }, [selectedCarId, selectedCar])

  // GPS handler for pickup
  const handleGetLocation = () => {
    setGpsError('')
    if (!navigator.geolocation) {
      setGpsError(t('booking.gpsNotSupported'))
      return
    }
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const address = await reverseGeocode(latitude, longitude)
        setPickup(address)
        setGpsLoading(false)
      },
      () => {
        setGpsError(t('booking.gpsError'))
        setGpsLoading(false)
      }
    )
  }

  // Open map modal for a specific field
  const openMapFor = (target) => {
    setMapTarget(target)
    setMapPin(null)
    setIsMapModalOpen(true)
  }

  // Handle location selection on map
  const handleMapLocationSelected = useCallback((data) => {
    setMapPin([data.lat, data.lng])
    if (mapTarget === 'pickup') {
      setPickup(data.address)
    } else {
      setDestination(data.address)
    }
    setTimeout(() => setIsMapModalOpen(false), 600)
  }, [mapTarget])

  const handleSubmitBooking = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!pickup.trim()) {
      setErrorMessage(t('booking.errPickup'))
      return
    }
    if (!destination.trim()) {
      setErrorMessage(t('booking.errDestination'))
      return
    }
    if (!selectedCarId) {
      setErrorMessage(t('booking.errCar'))
      return
    }
    if (!clientPhone.trim() || clientPhone.length < 8) {
      setErrorMessage(t('booking.errPhone'))
      return
    }

    setIsSubmitting(true)
    const payload = {
      pickup_location: pickup,
      destination: destination,
      passengers_count: Number(passengersCount),
      client_phone: clientPhone,
      car_id: selectedCar?.id || null,
      status: 'pending',
      landmark: selectedLandmark?.name || null,
      needs_guide: needsGuide
    }
    const result = await submitTripRequest(payload)
    setIsSubmitting(false)

    if (result.success) {
      setSubmittedData({
        pickup,
        destination,
        car: selectedCar,
        phone: clientPhone,
        landmark: selectedLandmark,
        needsGuide,
        passengers: passengersCount,
        request: result.request,
      })
      setSuccessAnimating(true)
      handleResetFormFields()
    } else {
      setErrorMessage(t('booking.errGeneric'))
    }
  }

  const handleResetFormFields = () => {
    setPickup('')
    setDestination('')
    setSelectedCarId(null)
    setClientPhone('')
    setPassengersCount(1)
    setMapPin(null)
    setSelectedLandmark(null)
    setNeedsGuide(false)
    setSearchQuery('')
  }

  const handleResetForm = () => {
    setSubmittedData(null)
    setSuccessAnimating(false)
    handleResetFormFields()
  }

  // Build WhatsApp message with new fields
  const buildWhatsAppUrl = () => {
    if (!submittedData) return '#'
    const landmarkText = submittedData.landmark ? getTranslated(submittedData.landmark, 'name', i18n.language) : t('booking.unspecified')
    const guideText = submittedData.needsGuide ? t('booking.yes').replace(' ✓', '') : t('booking.no')
    const message = t('booking.waMessageTemplate', {
      pickup: submittedData.pickup,
      destination: submittedData.destination,
      landmark: landmarkText,
      car: submittedData.car?.name || t('booking.unspecified'),
      passengers: submittedData.passengers,
      guide: guideText
    })
    return `https://wa.me/201223901660?text=${encodeURIComponent(message)}`
  }

  return (
    <section id="booking" className="py-20 px-4 max-w-5xl mx-auto relative z-10">
      <div className="text-center mb-12">
        <span className="text-[#f4bd70] text-xs font-bold uppercase tracking-widest bg-[#f4bd70]/10 px-4 py-1.5 rounded-full border border-[#f4bd70]/20 inline-block mb-3">
          {t('booking.badge')}
        </span>
        <h2 className="text-3xl md:text-5xl font-bold font-cairo text-[#e5e2e1] mb-4">
          {t('booking.titlePart1')} <span className="text-[#f4bd70]">{t('booking.titleHighlight')}</span>
        </h2>
      </div>

      {/* ======= MAP MODAL (Full-Screen Overlay, z-[9999]) ======= */}
      {isMapModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1c1b1b] border border-[#f4bd70]/30 rounded-2xl w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-white/10">
              <h3 className="text-[#f4bd70] font-bold text-lg flex items-center gap-2 font-cairo">
                <MapPin className="w-5 h-5" />
                {mapTarget === 'pickup' ? t('booking.mapPickupTitle') : t('booking.mapDestTitle')}
              </h3>
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="text-[#d4c4b3] hover:text-red-400 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Map */}
            <div className="flex-1 relative">
              <MapContainer
                key={mapTarget}
                center={[30.0444, 31.2357]}
                zoom={7}
                style={{ width: '100%', height: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <MapClickHandler onLocationSelected={handleMapLocationSelected} />
                {mapPin && <Marker position={mapPin} />}
              </MapContainer>
            </div>
            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-white/10 text-center">
              <button
                onClick={() => setIsMapModalOpen(false)}
                className="text-sm text-[#d4c4b3] hover:text-[#f4bd70] transition-colors"
              >
                {t('booking.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {submittedData ? (
        /* ======= SUCCESS STATE (Animated) ======= */
        <div className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-10 border border-white/20 text-center shadow-2xl max-w-3xl mx-auto transition-all duration-700 ${successAnimating ? 'animate-[fadeInUp_0.7s_ease-out]' : ''}`}>
          {/* Animated Success Checkmark */}
          <div className="relative mx-auto mb-6 w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.4)] animate-[bounceIn_0.6s_ease-out]">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
          </div>

          <h3 className="text-2xl md:text-3xl font-bold text-[#e5e2e1] mb-2 font-cairo animate-[fadeIn_0.8s_ease-out_0.3s_both]">
            {t('booking.successTitle')}
          </h3>
          <p className="text-[#d4c4b3] text-lg mb-8 animate-[fadeIn_0.8s_ease-out_0.5s_both]">
            {t('booking.successDesc')}
          </p>

          {/* Booking Summary Card */}
          <div className="bg-[#1c1b1b]/60 rounded-xl border border-[#504538]/50 p-5 mb-8 text-right space-y-2 animate-[fadeIn_0.8s_ease-out_0.6s_both]">
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#f4bd70] font-bold">📍 {t('booking.summaryFrom')}</span>
              <span className="text-[#e5e2e1]">{submittedData.pickup}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#f4bd70] font-bold">🎯 {t('booking.summaryTo')}</span>
              <span className="text-[#e5e2e1]">{submittedData.destination}</span>
            </div>
            {submittedData.landmark && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#f4bd70] font-bold">🏛️ {t('booking.summaryLandmark')}</span>
                <span className="text-[#e5e2e1]">{getTranslated(submittedData.landmark, 'name', i18n.language)}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#f4bd70] font-bold">🚗 {t('booking.summaryCar')}</span>
              <span className="text-[#e5e2e1]">{submittedData.car?.name || '—'}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#f4bd70] font-bold">👥 {t('booking.summaryPassengers')}</span>
              <span className="text-[#e5e2e1]">{submittedData.passengers}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-[#f4bd70] font-bold">🗣️ {t('booking.summaryGuide')}</span>
              <span className="text-[#e5e2e1]">{submittedData.needsGuide ? t('booking.yes') : t('booking.no')}</span>
            </div>
          </div>

          {/* Action Buttons: WhatsApp + Call */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 animate-[fadeIn_0.8s_ease-out_0.8s_both]">
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-3 transition-all shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02]"
            >
              <MessageSquare className="w-6 h-6" />
              <span className="text-lg">{t('booking.waConfirm')}</span>
            </a>
            <a
              href="tel:01223901660"
              className="bg-[#131313] border-2 border-[#f4bd70]/50 text-[#f4bd70] hover:bg-[#f4bd70]/10 font-bold py-4 rounded-xl flex justify-center items-center gap-3 transition-all hover:scale-[1.02]"
            >
              <Phone className="w-6 h-6" />
              <span className="text-lg">{t('booking.callNow')}</span>
            </a>
          </div>

          <button
            onClick={handleResetForm}
            className="text-sm text-[#d4c4b3] hover:text-[#f4bd70] underline flex items-center justify-center gap-2 mx-auto transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('booking.newRequest')}
          </button>
        </div>
      ) : (
        /* ======= BOOKING FORM ======= */
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl">
          <form onSubmit={handleSubmitBooking} className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ---- Pickup Location ---- */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-[#f4bd70] flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {t('booking.pickupLabel')}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    placeholder={t('booking.pickupPlaceholder')}
                    className="flex-1 w-full sm:w-auto bg-[#131313]/50 border border-white/20 rounded-xl px-4 py-3 text-[#e5e2e1] focus:outline-none focus:border-[#f4bd70] transition-colors"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={gpsLoading}
                      className="flex-1 sm:flex-none justify-center bg-[#1c1b1b] border border-[#f4bd70]/40 text-[#f4bd70] hover:bg-[#f4bd70]/20 px-3 py-3 rounded-xl flex items-center gap-1.5 font-bold transition-all whitespace-nowrap text-sm disabled:opacity-50 w-full sm:w-auto"
                    >
                      {gpsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                      {t('booking.myLocation')}
                    </button>
                    <button
                      type="button"
                      onClick={() => openMapFor('pickup')}
                      className="flex-1 sm:flex-none justify-center bg-[#1c1b1b] border border-[#f4bd70]/40 text-[#f4bd70] hover:bg-[#f4bd70]/20 px-3 py-3 rounded-xl flex items-center gap-1.5 font-bold transition-all whitespace-nowrap text-sm w-full sm:w-auto"
                    >
                      <MapIcon className="w-4 h-4" /> {t('booking.map')}
                    </button>
                  </div>
                </div>
                {gpsError && <p className="text-red-400 text-xs mt-1">{gpsError}</p>}
              </div>

              {/* ---- Passengers Stepper ---- */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#f4bd70] flex items-center gap-2">
                  <Users className="w-4 h-4" /> {t('booking.passengersLabel')}
                </label>
                <div className="flex items-center gap-0 bg-[#131313]/50 border border-white/20 rounded-xl overflow-hidden h-[48px]">
                  <button
                    type="button"
                    onClick={decrementPassengers}
                    disabled={passengersCount <= 1}
                    className="w-12 h-full flex items-center justify-center text-[#f4bd70] hover:bg-[#f4bd70]/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-l border-white/10"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <div className="flex-1 text-center font-bold text-xl text-[#e5e2e1] select-none">
                    {passengersCount}
                  </div>
                  <button
                    type="button"
                    onClick={incrementPassengers}
                    disabled={passengersCount >= maxPassengers}
                    className="w-12 h-full flex items-center justify-center text-[#f4bd70] hover:bg-[#f4bd70]/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed border-r border-white/10"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-[10px] text-[#d4c4b3] text-center opacity-70">
                  {t('booking.maxPassengers', { max: maxPassengers, car: selectedCar ? `(${selectedCar.name})` : '' })}
                </p>
              </div>

              {/* ---- Destination ---- */}
              <div className="space-y-2 md:col-span-3">
                <label className="text-sm font-semibold text-[#f4bd70] flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {t('booking.destinationLabel')}
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder={t('booking.destinationPlaceholder')}
                    className="flex-1 w-full sm:w-auto bg-[#131313]/50 border border-white/20 rounded-xl px-4 py-3 text-[#e5e2e1] focus:outline-none focus:border-[#f4bd70] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => openMapFor('destination')}
                    className="justify-center bg-[#1c1b1b] border border-[#f4bd70]/40 text-[#f4bd70] hover:bg-[#f4bd70]/20 px-4 py-3 rounded-xl flex items-center gap-2 font-bold transition-all whitespace-nowrap text-sm w-full sm:w-auto"
                  >
                    <MapIcon className="w-4 h-4" /> {t('booking.map')}
                  </button>
                </div>
              </div>
            </div>

            {/* ---- Egyptian Landmarks Visual Selector ---- */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-[#f4bd70] flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  {t('booking.landmarkLabel')}
                </label>
                {selectedLandmark && (
                  <button
                    type="button"
                    onClick={() => setSelectedLandmark(null)}
                    className="text-xs text-[#d4c4b3] hover:text-red-400 transition-colors flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> {t('booking.cancelSelection')}
                  </button>
                )}
              </div>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d4c4b3]" />
                <input
                  type="text"
                  placeholder={t('booking.searchLandmark')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1c1b1b] border border-[#504538] rounded-xl pr-10 pl-4 py-2 text-sm text-[#e5e2e1] focus:outline-none focus:border-[#f4bd70] transition-colors"
                />
              </div>

              {landmarksLoading ? (
                <div className="text-center py-8 text-[#d4c4b3] flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-[#f4bd70]" />
                  {t('booking.loadingLandmarks')}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[22rem] overflow-y-auto p-2 custom-scrollbar">
                  {filteredLandmarks.map((landmark) => {
                    const isSelected = selectedLandmark?.id === landmark.id
                    return (
                      <div
                        key={landmark.id}
                        onClick={() => {
                          setSelectedLandmark(isSelected ? null : landmark)
                          if (!isSelected) {
                            setDestination(landmark.name)
                          }
                        }}
                        className={`
                          relative flex flex-col h-44 rounded-2xl overflow-hidden cursor-pointer
                          transition-all duration-300 group
                          ${isSelected
                            ? 'ring-2 ring-[#f4bd70] scale-[1.03] shadow-[0_0_25px_rgba(244,189,112,0.3)]'
                            : 'hover:scale-[1.02] hover:shadow-xl'
                          }
                        `}
                        style={{
                          border: isSelected ? '1.5px solid #f4bd70' : '1px solid rgba(255,255,255,0.12)',
                        }}
                      >
                        {/* Unified Blurred Background & Overlay */}
                        <div className="absolute inset-0 z-0">
                          <img
                            src="https://images.unsplash.com/photo-1539667468225-eebb663053e6?auto=format&fit=crop&q=80"
                            alt="Background"
                            className="w-full h-full object-cover blur-sm scale-110"
                          />
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 p-4 flex flex-col h-full justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-1 gap-2">
                              <h4 dir="auto" className="text-sm font-bold text-[#f4bd70] leading-tight text-start">{getTranslated(landmark, 'name', i18n.language)}</h4>
                              {landmark.rating && (
                                <div className="flex items-center gap-1 bg-black/40 px-1.5 py-0.5 rounded text-[10px] text-white shrink-0 flex-shrink-0">
                                  <Star className="w-3 h-3 text-[#f4bd70] fill-[#f4bd70]" />
                                  <span>{landmark.rating}</span>
                                </div>
                              )}
                            </div>
                            <p dir="auto" className="text-[11px] text-gray-400 text-start">{getTranslated(landmark, 'city', i18n.language)}</p>
                          </div>
                          
                          {landmark.description && (
                            <p dir="auto" className="text-xs text-gray-200 line-clamp-4 mt-2 leading-relaxed text-start" title={getTranslated(landmark, 'description', i18n.language)}>
                              {getTranslated(landmark, 'description', i18n.language)}
                            </p>
                          )}
                        </div>

                        {/* Selection badge */}
                        {isSelected && (
                          <div className="absolute top-2 left-2 z-20 w-6 h-6 bg-[#f4bd70] rounded-full flex items-center justify-center shadow-lg animate-[bounceIn_0.3s_ease-out]">
                            <CheckCircle2 className="w-4 h-4 text-[#131313]" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* ---- Tour Guide Toggle ---- */}
            <div className="pt-4 border-t border-white/10">
              <div
                onClick={() => setNeedsGuide(!needsGuide)}
                className={`
                  flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-300
                  ${needsGuide
                    ? 'bg-[#f4bd70]/10 border-2 border-[#f4bd70]/60 shadow-[0_0_15px_rgba(244,189,112,0.15)]'
                    : 'bg-[#131313]/50 border border-white/15 hover:border-[#f4bd70]/30'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${needsGuide ? 'bg-[#f4bd70]/20 text-[#f4bd70]' : 'bg-white/5 text-[#d4c4b3]'}`}>
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#e5e2e1] block">{t('booking.guideTitle')}</span>
                    <span className="text-[11px] text-[#d4c4b3]">{t('booking.guideDesc')}</span>
                  </div>
                </div>

                {/* Toggle Switch */}
                <div className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${needsGuide ? 'bg-[#f4bd70]' : 'bg-[#504538]'}`}>
                  <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-300 ${needsGuide ? 'left-[calc(100%-1.625rem)]' : 'left-0.5'}`} />
                </div>
              </div>
            </div>

            {/* ---- Cars Selection (Dynamic from Supabase) ---- */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-[#f4bd70] flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  {t('booking.carLabel')}
                </label>
                <span className="text-xs text-[#d4c4b3]">
                  {t('booking.availableCars', { count: filteredCars.length })}
                </span>
              </div>

              {carsLoading ? (
                <div className="text-center py-8 text-[#d4c4b3] flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-[#f4bd70]" />
                  {t('booking.loadingCars')}
                </div>
              ) : filteredCars.length === 0 ? (
                <div className="text-center py-6 text-[#d4c4b3] bg-[#131313]/30 rounded-xl border border-white/5">
                  {t('booking.noCars', { count: passengersCount })}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCars.map((car) => {
                    const isSelected = car.id === selectedCarId
                    return (
                      <div
                        key={car.id}
                        onClick={() => setSelectedCarId(car.id)}
                        className={`bg-[#131313]/60 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border ${
                          isSelected
                            ? 'border-[#f4bd70] ring-2 ring-[#f4bd70]/50 scale-[1.02] shadow-xl'
                            : 'border-white/10 hover:border-[#f4bd70]/50'
                        }`}
                      >
                        <div className="h-40 relative bg-[#1c1b1b]">
                          <img
                            src={car.image_url}
                            alt={car.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = CAR_FALLBACK_IMG
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#131313]/60 via-transparent to-transparent" />
                          <div className="absolute top-2 left-2 bg-black/70 text-[#f4bd70] text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 border border-[#f4bd70]/30">
                            <Users className="w-3 h-3" /> {t('booking.capacity', { count: car.max_passengers || car.capacity })}
                          </div>
                        </div>
                        <div className="p-4 flex items-center justify-between">
                          <h4 className="font-bold text-[#e5e2e1] text-lg">{car.name}</h4>
                          <span
                            className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${
                              isSelected
                                ? 'bg-[#f4bd70] text-[#131313]'
                                : 'bg-[#1c1b1b] text-[#f4bd70] border border-[#f4bd70]/30'
                            }`}
                          >
                            {isSelected ? t('booking.selected') : t('booking.select')}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* ---- Phone & Submit ---- */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <label className="text-sm font-semibold text-[#f4bd70] flex items-center gap-2">
                <Phone className="w-4 h-4" /> {t('booking.phoneLabel')}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="tel"
                    dir="ltr"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+20 10X XXX XXXX"
                    className="w-full bg-[#131313]/50 border border-white/20 rounded-xl px-4 py-3 text-left text-[#e5e2e1] focus:outline-none focus:border-[#f4bd70]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#f4bd70] hover:bg-[#e0a85c] text-[#131313] font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : t('booking.confirmBooking')}
                </button>
              </div>

              {errorMessage && (
                <div className="bg-red-500/10 border border-red-500/40 text-red-300 p-3 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

          </form>

          {/* Quick Track Request Banner */}
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={onOpenTrackModal}
              className="text-xs text-[#d4c4b3] hover:text-[#f4bd70] transition-colors flex items-center justify-center gap-1 mx-auto"
            >
              <Search className="w-3.5 h-3.5" />
              {t('booking.trackPrevious')}
            </button>
          </div>
        </div>
      )}

      {/* Keyframe animations injected via style tag */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.08); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(244,189,112,0.5); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(244,189,112,0.8); }
      `}</style>
    </section>
  )
}
