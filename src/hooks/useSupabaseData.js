import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

// 1. Settings Hook
export function useSettings() {
  const [settings, setSettings] = useState({
    phone: '+201001234567',
    whatsapp: '+201001234567',
    address: 'شبرا مصر',
    hero_video_url: 'https://assets.mixkit.co/videos/preview/mixkit-car-driving-on-a-road-in-the-middle-of-a-4061-large.mp4',
    cs_whatsapp_number: '201000000000'
  })
  const [loading, setLoading] = useState(true)

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('settings').select('*').limit(1).single()
      const { data: csData, error: csError } = await supabase.from('site_settings').select('cs_whatsapp_number').eq('id', 1).single()
      
      if (!error && data) {
        setSettings(prev => ({ ...prev, ...data }))
      }
      if (!csError && csData) {
        setSettings(prev => ({ ...prev, cs_whatsapp_number: csData.cs_whatsapp_number }))
      }
    } catch {
      // Silently use defaults on fetch failure
    } finally {
      setLoading(false)
    }
  }, [])

  const updateSettings = async (newSettings) => {
    const { data, error } = await supabase
      .from('settings')
      .update(newSettings)
      .eq('id', settings.id)
      .select()
    if (!error && data?.[0]) {
      setSettings(data[0])
      return { success: true }
    }
    return { success: false, error }
  }

  const updateCSNumber = async (newNumber) => {
    const { data, error } = await supabase
      .from('site_settings')
      .update({ cs_whatsapp_number: newNumber })
      .eq('id', 1)
      .select()
    if (!error && data?.[0]) {
      setSettings(prev => ({ ...prev, cs_whatsapp_number: data[0].cs_whatsapp_number }))
      return { success: true }
    }
    return { success: false, error }
  }

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return { settings, loading, refetch: fetchSettings, updateSettings, cs_whatsapp_number: settings.cs_whatsapp_number, updateCSNumber }
}

// 2. Cars Hook
export function useCars(onlyActive = true) {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCars = useCallback(async () => {
    try {
      setLoading(true)
      let query = supabase.from('cars').select('*').order('max_passengers', { ascending: true })
      if (onlyActive) {
        query = query.eq('is_active', true)
      }
      const { data, error } = await query
      if (error) throw error
      setCars(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [onlyActive])

  useEffect(() => {
    fetchCars()
  }, [fetchCars])

  const addCar = async (carData) => {
    const { data, error } = await supabase.from('cars').insert([carData]).select()
    if (!error && data) {
      fetchCars()
      return { success: true, car: data[0] }
    }
    return { success: false, error }
  }

  const toggleCarActive = async (id, isActive) => {
    const { error } = await supabase.from('cars').update({ is_active: !isActive }).eq('id', id)
    if (!error) {
      fetchCars()
      return { success: true }
    }
    return { success: false, error }
  }

  const deleteCar = async (id) => {
    const { error } = await supabase.from('cars').delete().eq('id', id)
    if (!error) {
      fetchCars()
      return { success: true }
    }
    return { success: false, error }
  }

  const updateCar = async (id, carData) => {
    const { data, error } = await supabase.from('cars').update(carData).eq('id', id).select()
    if (!error && data) {
      fetchCars()
      return { success: true, car: data[0] }
    }
    return { success: false, error }
  }

  return { cars, loading, error, refetch: fetchCars, addCar, updateCar, toggleCarActive, deleteCar }
}

// 3. Reviews Hook
export function useReviews(onlyApproved = true) {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      let query = supabase.from('reviews').select('*').order('created_at', { ascending: false })
      if (onlyApproved) {
        query = query.eq('is_approved', true)
      }
      const { data, error } = await query
      if (!error) setReviews(data || [])
    } catch {
      // Silently handle fetch failure
    } finally {
      setLoading(false)
    }
  }, [onlyApproved])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const submitReview = async (review) => {
    const { data, error } = await supabase
      .from('reviews')
      .insert([{ ...review, is_approved: false }])
      .select()
    if (!error && data) {
      return { success: true }
    }
    return { success: false, error }
  }

  const approveReview = async (id) => {
    const { error } = await supabase.from('reviews').update({ is_approved: true }).eq('id', id)
    if (!error) {
      fetchReviews()
      return { success: true }
    }
    return { success: false, error }
  }

  const deleteReview = async (id) => {
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (!error) {
      fetchReviews()
      return { success: true }
    }
    return { success: false, error }
  }

  return { reviews, loading, refetch: fetchReviews, submitReview, approveReview, deleteReview }
}

// 5. Trip Requests Hook
export function useTripRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAllRequests = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('trip_requests')
      .select('*, cars(name, max_passengers, image_url)')
      .order('created_at', { ascending: false })
    if (!error) setRequests(data || [])
    setLoading(false)
  }, [])

  const submitTripRequest = async (bookingData) => {
    const { data, error } = await supabase
      .from('trip_requests')
      .insert([bookingData])
      .select()
    if (!error && data) {
      return { success: true, request: data[0] }
    }
    return { success: false, error: error?.message || 'فشل في حفظ الطلب', rawError: error }
  }

  const searchRequestsByPhone = async (phone) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('trip_requests')
      .select('*, cars(name, image_url)')
      .ilike('client_phone', `%${phone.trim()}%`)
      .order('created_at', { ascending: false })
    setLoading(false)
    if (!error) return data || []
    return []
  }

  const updateStatus = async (id, status) => {
    const { error } = await supabase.from('trip_requests').update({ status }).eq('id', id)
    if (!error) {
      fetchAllRequests()
      return { success: true }
    }
    return { success: false, error }
  }

  return {
    requests,
    loading,
    fetchAllRequests,
    submitTripRequest,
    searchRequestsByPhone,
    updateStatus
  }
}

// 6. Landmarks Hook
export function useLandmarks() {
  const [landmarks, setLandmarks] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchLandmarks = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('landmarks').select('*')
      if (!error) setLandmarks(data || [])
    } catch {
      // Silently handle fetch failure
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLandmarks()
  }, [fetchLandmarks])

  const addLandmark = async (landmarkData) => {
    const { data, error } = await supabase.from('landmarks').insert([landmarkData]).select()
    if (!error && data) {
      fetchLandmarks()
      return { success: true, landmark: data[0] }
    }
    return { success: false, error }
  }

  const updateLandmark = async (id, landmarkData) => {
    const { data, error } = await supabase.from('landmarks').update(landmarkData).eq('id', id).select()
    if (!error && data) {
      fetchLandmarks()
      return { success: true, landmark: data[0] }
    }
    return { success: false, error }
  }

  const deleteLandmark = async (id) => {
    const { error } = await supabase.from('landmarks').delete().eq('id', id)
    if (!error) {
      fetchLandmarks()
      return { success: true }
    }
    return { success: false, error }
  }

  return { landmarks, loading, refetch: fetchLandmarks, addLandmark, updateLandmark, deleteLandmark }
}

// 7. Client Moments Hook
export function useClientMoments() {
  const [clientMoments, setClientMoments] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchClientMoments = useCallback(async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('client_moments')
        .select('*')
        .order('created_at', { ascending: false })
      if (!error) setClientMoments(data || [])
    } catch {
      // Silently handle fetch failure
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchClientMoments()
  }, [fetchClientMoments])

  const addClientMoment = async (imageUrl) => {
    const { data, error } = await supabase
      .from('client_moments')
      .insert([{ image_url: imageUrl }])
      .select()
    if (!error && data) {
      fetchClientMoments()
      return { success: true, moment: data[0] }
    }
    return { success: false, error }
  }

  const deleteClientMoment = async (id) => {
    const { error } = await supabase.from('client_moments').delete().eq('id', id)
    if (!error) {
      fetchClientMoments()
      return { success: true }
    }
    return { success: false, error }
  }

  return { clientMoments, loading, refetch: fetchClientMoments, addClientMoment, deleteClientMoment }
}
