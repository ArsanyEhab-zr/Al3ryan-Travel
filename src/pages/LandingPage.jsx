import { useState } from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import BookingSection from '../components/BookingSection'
import TourismGallery from '../components/TourismGallery'
import ClientMoments from '../components/ClientMoments'
import ReviewsSection from '../components/ReviewsSection'
import Footer from '../components/Footer'
import TrackRequestModal from '../components/TrackRequestModal'
import { useSettings } from '../hooks/useSupabaseData'

export default function LandingPage() {
  const { settings } = useSettings()
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false)

  return (
    <div className="bg-[#131313] text-[#e5e2e1] min-h-screen relative overflow-x-hidden font-cairo">
      {/* Floating Navbar */}
      <Navbar settings={settings} onOpenTrackModal={() => setIsTrackModalOpen(true)} />

      {/* Hero Section with Video Background */}
      <HeroSection />

      {/* Dynamic Booking Section */}
      <BookingSection settings={settings} onOpenTrackModal={() => setIsTrackModalOpen(true)} />

      {/* Tourism Gallery Section */}
      <TourismGallery />

      {/* Client Moments (Social Proof) */}
      <ClientMoments />

      {/* Reviews & Feedback Section */}
      <ReviewsSection />

      {/* Footer */}
      <Footer settings={settings} />

      {/* Request Tracker Modal */}
      <TrackRequestModal
        isOpen={isTrackModalOpen}
        onClose={() => setIsTrackModalOpen(false)}
      />
    </div>
  )
}
