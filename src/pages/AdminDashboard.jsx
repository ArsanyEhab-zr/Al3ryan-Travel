import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import {
  useTripRequests,
  useCars,
  useReviews,
  useLandmarks,
  useSettings,
} from '../hooks/useSupabaseData'
import {
  ShieldCheck,
  PackageCheck,
  Car,
  Image,
  Star,
  Settings as SettingsIcon,
  Check,
  X,
  Plus,
  Trash2,
  Lock,
  LogOut,
  Home,
  RefreshCw,
  CheckCircle,
  Edit2,
} from 'lucide-react'

export default function AdminDashboard() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(true)

  const [activeTab, setActiveTab] = useState('orders') // 'orders' | 'cars' | 'reviews' | 'gallery' | 'settings'

  // Hooks
  const { requests, fetchAllRequests, updateStatus } = useTripRequests()
  const { cars, addCar, updateCar, toggleCarActive, deleteCar } = useCars(false)
  const { reviews: unapprovedReviews, approveReview, deleteReview, refetch: refetchReviews } = useReviews(false)
  const { landmarks, addLandmark, updateLandmark, deleteLandmark } = useLandmarks()
  const { settings, updateSettings } = useSettings()

  // Form States for Content Tab
  const [newCar, setNewCar] = useState({ name: '', max_passengers: 4, image_url: '' })
  const [editingCarId, setEditingCarId] = useState(null)
  const [newLandmark, setNewLandmark] = useState({ name: '', city: '', description: '', rating: 5.0, image_url: '' })
  const [editingLandmarkId, setEditingLandmarkId] = useState(null)
  const [settingsForm, setSettingsForm] = useState({
    phone: '',
    whatsapp: '',
    address: 'شبرا مصر',
    hero_video_url: '',
  })
  const [settingsSuccess, setSettingsSuccess] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) {
      fetchAllRequests()
    }
  }, [session, fetchAllRequests])

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        phone: settings.phone || '+201001234567',
        whatsapp: settings.whatsapp || '+201001234567',
        address: settings.address || 'شبرا مصر',
        hero_video_url: settings.hero_video_url || '',
      })
    }
  }, [settings])

  const handleLogin = async (e) => {
    e.preventDefault()
    setAuthError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setAuthError('بيانات الدخول غير صحيحة')
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  // Handle New Car Submit
  const handleAddCar = async (e) => {
    e.preventDefault()
    if (!newCar.name || !newCar.image_url) return
    
    if (editingCarId) {
      const res = await updateCar(editingCarId, newCar)
      if (res.success) {
        setNewCar({ name: '', max_passengers: 4, image_url: '' })
        setEditingCarId(null)
      }
    } else {
      const res = await addCar({ ...newCar, is_active: true })
      if (res.success) {
        setNewCar({ name: '', max_passengers: 4, image_url: '' })
      }
    }
  }

  const handleEditClick = (car) => {
    setNewCar({ name: car.name, max_passengers: car.max_passengers || 4, image_url: car.image_url })
    setEditingCarId(car.id)
  }

  const cancelEdit = () => {
    setNewCar({ name: '', max_passengers: 4, image_url: '' })
    setEditingCarId(null)
  }

  // Handle New Landmark Submit
  const handleAddLandmark = async (e) => {
    e.preventDefault()
    if (!newLandmark.name || !newLandmark.city || !newLandmark.image_url) return
    
    if (editingLandmarkId) {
      const res = await updateLandmark(editingLandmarkId, newLandmark)
      if (res.success) {
        setNewLandmark({ name: '', city: '', description: '', rating: 5.0, image_url: '' })
        setEditingLandmarkId(null)
      }
    } else {
      const res = await addLandmark(newLandmark)
      if (res.success) {
        setNewLandmark({ name: '', city: '', description: '', rating: 5.0, image_url: '' })
      }
    }
  }

  const handleEditLandmarkClick = (lm) => {
    setNewLandmark({ 
      name: lm.name, 
      city: lm.city, 
      description: lm.description || '', 
      rating: lm.rating || 5.0, 
      image_url: lm.image_url 
    })
    setEditingLandmarkId(lm.id)
  }

  const cancelEditLandmark = () => {
    setNewLandmark({ name: '', city: '', description: '', rating: 5.0, image_url: '' })
    setEditingLandmarkId(null)
  }

  // Handle Settings Save
  const handleSaveSettings = async (e) => {
    e.preventDefault()
    const res = await updateSettings(settingsForm)
    if (res.success) {
      setSettingsSuccess(true)
      setTimeout(() => setSettingsSuccess(false), 3000)
    }
  }

  if (authLoading) {
    return <div className="min-h-screen bg-[#131313] flex items-center justify-center text-[#f4bd70]">جاري التحميل...</div>
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex items-center justify-center p-4 font-cairo">
        <div className="liquid-glass-strong rounded-3xl p-8 max-w-md w-full border border-[#f4bd70]/30 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-full bg-[#f4bd70]/20 border border-[#f4bd70] flex items-center justify-center text-[#f4bd70] mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="text-2xl font-bold text-[#e5e2e1] mb-2 font-cairo">
            لوحة تحكم Al3ryan Travel
          </h2>
          <p className="text-xs text-[#d4c4b3] mb-6">
            تسجيل الدخول لإدارة طلبات الرحلات، السيارات، والمعالم السياحية
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-right">
            <div>
              <label className="text-xs text-[#f4bd70] block mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@al3ryan.com"
                className="w-full bg-[#1c1b1b] border border-[#504538] rounded-xl px-4 py-3 text-right text-[#e5e2e1] text-sm focus:outline-none focus:border-[#f4bd70]"
              />
            </div>
            <div>
              <label className="text-xs text-[#f4bd70] block mb-1">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل كلمة المرور"
                className="w-full bg-[#1c1b1b] border border-[#504538] rounded-xl px-4 py-3 text-center text-[#e5e2e1] text-sm focus:outline-none focus:border-[#f4bd70]"
              />
            </div>

            {authError && <p className="text-xs text-red-400 text-center">{authError}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#d4a056] to-[#f4bd70] text-[#131313] font-bold py-3 rounded-xl hover:brightness-110 transition-all cursor-pointer text-sm"
            >
              دخول لوحة التحكم
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#504538]/30">
            <Link to="/" className="text-xs text-[#d4c4b3] hover:text-[#f4bd70] flex items-center justify-center gap-1">
              <Home className="w-3.5 h-3.5" /> العودة للموقع الرئيسي
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-cairo">
      {/* Top Admin Header */}
      <header className="liquid-glass-strong border-b border-[#504538]/40 sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#f4bd70]/20 text-[#f4bd70] flex items-center justify-center border border-[#f4bd70]/40">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-[#f4bd70] leading-none">لوحة الإدارة (Admin Panel)</h1>
            <span className="text-[10px] text-[#d4c4b3] opacity-80">Al3ryan Travel Management System</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="liquid-glass text-xs font-semibold text-[#e5e2e1] px-3.5 py-2 rounded-full flex items-center gap-1.5 hover:text-[#f4bd70] transition-colors"
          >
            <Home className="w-4 h-4" /> عرض الموقع
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs px-3.5 py-2 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> خروج
          </button>
        </div>
      </header>

      {/* Admin Content Area */}
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-4 mb-8 border-b border-[#504538]/30">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'orders'
                ? 'bg-[#f4bd70] text-[#131313] shadow-lg'
                : 'liquid-glass text-[#d4c4b3] hover:text-[#f4bd70]'
              }`}
          >
            <PackageCheck className="w-4 h-4" />
            طلب الرحلات ({requests.length})
          </button>

          <button
            onClick={() => setActiveTab('cars')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'cars'
                ? 'bg-[#f4bd70] text-[#131313] shadow-lg'
                : 'liquid-glass text-[#d4c4b3] hover:text-[#f4bd70]'
              }`}
          >
            <Car className="w-4 h-4" />
            إدارة أسطول السيارات ({cars.length})
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'reviews'
                ? 'bg-[#f4bd70] text-[#131313] shadow-lg'
                : 'liquid-glass text-[#d4c4b3] hover:text-[#f4bd70]'
              }`}
          >
            <Star className="w-4 h-4" />
            مراجعة التقييمات ({unapprovedReviews.length})
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'gallery'
                ? 'bg-[#f4bd70] text-[#131313] shadow-lg'
                : 'liquid-glass text-[#d4c4b3] hover:text-[#f4bd70]'
              }`}
          >
            <Image className="w-4 h-4" />
            المعالم السياحية ({landmarks.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'settings'
                ? 'bg-[#f4bd70] text-[#131313] shadow-lg'
                : 'liquid-glass text-[#d4c4b3] hover:text-[#f4bd70]'
              }`}
          >
            <SettingsIcon className="w-4 h-4" />
            إعدادات التواصل والفيديو
          </button>
        </div>

        {/* TAB 1: ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-[#e5e2e1]">طلبات الرحلات الواردة من العملاء</h2>
              <button
                onClick={fetchAllRequests}
                className="liquid-glass text-xs text-[#f4bd70] px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-[#f4bd70]/10"
              >
                <RefreshCw className="w-3.5 h-3.5" /> تحديث القائمة
              </button>
            </div>

            {requests.length === 0 ? (
              <div className="liquid-glass rounded-2xl p-12 text-center text-[#d4c4b3]">
                لا توجد طلبات رحلات مسجلة حالياً.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="liquid-glass rounded-2xl p-5 border border-[#504538]/40 flex flex-col md:flex-row justify-between md:items-center gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-lg text-[#f4bd70]">{req.destination}</span>
                        <span className="text-xs bg-[#1c1b1b] border border-[#504538] px-2.5 py-0.5 rounded-full text-[#d4c4b3]">
                          👥 {req.passengers_count} ركاب
                        </span>
                      </div>

                      <div className="text-xs text-[#d4c4b3] flex flex-wrap items-center gap-4 pt-1">
                        <span>📱 الهاتف: <strong className="text-[#e5e2e1]" dir="ltr">{req.client_phone}</strong></span>
                        {req.cars && <span>🚗 السيارة: <strong className="text-[#e5e2e1]">{req.cars.name}</strong></span>}
                        {req.landmark && <span>🏛️ المعلم: <strong className="text-[#e5e2e1]">{req.landmark}</strong></span>}
                        <span>📅 التاريخ: {new Date(req.created_at).toLocaleString('ar-EG')}</span>
                        {req.needs_guide && <span className="text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 font-bold">🗣️ مرشد سياحي مطلوب</span>}
                      </div>
                    </div>

                    {/* Status Actions */}
                    <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#504538]/30">
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-full ${req.status === 'accepted'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : req.status === 'completed'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                              : req.status === 'rejected'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                      >
                        {req.status === 'accepted'
                          ? 'مقبول ✓'
                          : req.status === 'completed'
                            ? 'مكتمل 🏁'
                            : req.status === 'rejected'
                              ? 'مرفوض ✗'
                              : 'قيد المراجعة 🟡'}
                      </span>

                      <button
                        onClick={() => updateStatus(req.id, 'accepted')}
                        className="bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 border border-emerald-500/40 p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="قبول الطلب"
                      >
                        <Check className="w-4 h-4" /> قبول
                      </button>

                      <button
                        onClick={() => updateStatus(req.id, 'completed')}
                        className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 border border-blue-500/40 p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="إكمال الرحلة"
                      >
                        <CheckCircle className="w-4 h-4" /> إكمال
                      </button>

                      <button
                        onClick={() => updateStatus(req.id, 'rejected')}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/40 p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                        title="رفض الطلب"
                      >
                        <X className="w-4 h-4" /> رفض
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CARS */}
        {activeTab === 'cars' && (
          <div className="space-y-8">
            {/* Add Car Form */}
            <div className="liquid-glass-strong rounded-2xl p-6 border border-[#f4bd70]/30">
              <h3 className="font-bold text-base text-[#f4bd70] mb-4 flex items-center gap-2">
                {editingCarId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />} 
                {editingCarId ? 'تعديل بيانات السيارة' : 'إضافة سيارة جديدة للأسطول'}
              </h3>
              <form onSubmit={handleAddCar} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="text-xs text-[#d4c4b3] block mb-1">اسم السيارة والموديل</label>
                  <input
                    type="text"
                    value={newCar.name}
                    onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
                    placeholder="مثال: مرسيدس S-Class 2025"
                    className="w-full bg-[#1c1b1b] border border-[#504538] rounded-xl px-3 py-2 text-xs text-[#e5e2e1]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#d4c4b3] block mb-1">سعة الركاب (أقصى عدد)</label>
                  <input
                    type="number"
                    value={newCar.max_passengers}
                    onChange={(e) => setNewCar({ ...newCar, max_passengers: Number(e.target.value) })}
                    className="w-full bg-[#1c1b1b] border border-[#504538] rounded-xl px-3 py-2 text-xs text-[#e5e2e1]"
                  />
                </div>
                <div>
                  <label className="text-xs text-[#d4c4b3] block mb-1">رابط صورة السيارة (Image URL)</label>
                  <input
                    type="url"
                    value={newCar.image_url}
                    onChange={(e) => setNewCar({ ...newCar, image_url: e.target.value })}
                    placeholder="أدخل رابط الصورة (مثال: Unsplash)"
                    className="w-full bg-[#1c1b1b] border border-[#504538] rounded-xl px-3 py-2 text-xs text-[#e5e2e1]"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#f4bd70] text-[#131313] font-bold py-2 px-4 rounded-xl text-xs hover:brightness-110 transition-all cursor-pointer"
                  >
                    {editingCarId ? 'حفظ التعديلات' : 'إضافة السيارة'}
                  </button>
                  {editingCarId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-red-500/20 text-red-300 font-bold py-2 px-4 rounded-xl text-xs hover:bg-red-500/30 transition-all cursor-pointer"
                    >
                      إلغاء
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Cars List */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cars.map((car) => (
                <div
                  key={car.id}
                  className="liquid-glass rounded-2xl overflow-hidden border border-[#504538]/40 p-4 space-y-3"
                >
                  <img src={car.image_url} alt={car.name} className="w-full h-40 object-cover rounded-xl" />
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-[#e5e2e1] text-sm">{car.name}</h4>
                    <span className="text-xs text-[#f4bd70]">👥 {car.max_passengers} ركاب</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#504538]/30">
                    <button
                      onClick={() => toggleCarActive(car.id, car.is_active)}
                      className={`text-xs px-3 py-1 rounded-full font-bold cursor-pointer ${car.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}
                    >
                      {car.is_active ? 'نشطة للمستخدمين ✓' : 'معطلة ✗'}
                    </button>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditClick(car)}
                        className="text-blue-400 hover:text-blue-300 p-1.5 rounded-lg hover:bg-blue-500/10 transition-colors"
                        title="تعديل السيارة"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCar(car.id)}
                        className="text-red-400 hover:text-red-300 p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="حذف السيارة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h3 className="font-bold text-lg text-[#e5e2e1]">إدارة وموافقة التقييمات الواردة</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unapprovedReviews.map((rev) => (
                <div key={rev.id} className="liquid-glass rounded-2xl p-5 border border-[#504538]/40 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm text-[#f4bd70]">{rev.client_name}</h4>
                    <div className="flex text-amber-400 text-xs">{'★'.repeat(rev.rating)}</div>
                  </div>
                  <p className="text-xs text-[#e5e2e1]">{rev.comment}</p>

                  <div className="flex justify-between items-center pt-2 border-t border-[#504538]/30">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${rev.is_approved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}
                    >
                      {rev.is_approved ? 'معروض بالموقع ✓' : 'في انتظار موافقتك'}
                    </span>

                    <div className="flex gap-2">
                      {!rev.is_approved && (
                        <button
                          onClick={() => approveReview(rev.id)}
                          className="bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 text-xs px-3 py-1 rounded-lg cursor-pointer"
                        >
                          موافقة للنشر
                        </button>
                      )}
                      <button
                        onClick={() => deleteReview(rev.id)}
                        className="bg-red-500/20 hover:bg-red-500/40 text-red-300 text-xs px-3 py-1 rounded-lg cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: LANDMARKS */}
        {activeTab === 'gallery' && (
          <div className="space-y-8">
            {/* Add Landmark Form */}
            <div className="liquid-glass-strong rounded-2xl p-6 border border-[#f4bd70]/30">
              <h3 className="font-bold text-base text-[#f4bd70] mb-4 flex items-center gap-2">
                {editingLandmarkId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />} 
                {editingLandmarkId ? 'تعديل بيانات المعلم' : 'إضافة معلم أو وجهة سياحية جديدة'}
              </h3>
              <form onSubmit={handleAddLandmark} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-[#d4c4b3] block mb-1">اسم المعلم / الوجهة</label>
                    <input
                      type="text"
                      value={newLandmark.name}
                      onChange={(e) => setNewLandmark({ ...newLandmark, name: e.target.value })}
                      placeholder="مثال: أهرامات الجيزة"
                      className="w-full bg-[#1c1b1b] border border-[#504538] rounded-xl px-3 py-2 text-xs text-[#e5e2e1]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#d4c4b3] block mb-1">المحافظة / المدينة</label>
                    <input
                      type="text"
                      value={newLandmark.city}
                      onChange={(e) => setNewLandmark({ ...newLandmark, city: e.target.value })}
                      placeholder="مثال: الجيزة"
                      className="w-full bg-[#1c1b1b] border border-[#504538] rounded-xl px-3 py-2 text-xs text-[#e5e2e1]"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-xs text-[#d4c4b3] block mb-1">نبذة (Description)</label>
                    <input
                      type="text"
                      value={newLandmark.description}
                      onChange={(e) => setNewLandmark({ ...newLandmark, description: e.target.value })}
                      placeholder="وصف قصير للمعلم..."
                      className="w-full bg-[#1c1b1b] border border-[#504538] rounded-xl px-3 py-2 text-xs text-[#e5e2e1]"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-[#d4c4b3] block mb-1">التقييم (Rating)</label>
                    <input
                      type="number"
                      step="0.1"
                      max="5"
                      min="1"
                      value={newLandmark.rating}
                      onChange={(e) => setNewLandmark({ ...newLandmark, rating: Number(e.target.value) })}
                      className="w-full bg-[#1c1b1b] border border-[#504538] rounded-xl px-3 py-2 text-xs text-[#e5e2e1]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#d4c4b3] block mb-1">رابط الصورة (Image URL)</label>
                  <input
                    type="url"
                    value={newLandmark.image_url}
                    onChange={(e) => setNewLandmark({ ...newLandmark, image_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#1c1b1b] border border-[#504538] rounded-xl px-3 py-2 text-xs text-[#e5e2e1]"
                    required
                  />
                </div>
                
                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-[#f4bd70] text-[#131313] font-bold py-2.5 px-4 rounded-xl text-xs hover:brightness-110 transition-all cursor-pointer"
                  >
                    {editingLandmarkId ? 'حفظ التعديلات' : 'إضافة المعلم'}
                  </button>
                  {editingLandmarkId && (
                    <button
                      type="button"
                      onClick={cancelEditLandmark}
                      className="bg-red-500/20 text-red-300 font-bold py-2.5 px-4 rounded-xl text-xs hover:bg-red-500/30 transition-all cursor-pointer"
                    >
                      إلغاء
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Landmarks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {landmarks.map((lm) => (
                <div key={lm.id} className="liquid-glass rounded-2xl overflow-hidden relative flex flex-col border border-[#504538]/40 h-64">
                  <img src={lm.image_url} alt={lm.name} className="w-full h-32 object-cover" />
                  <div className="absolute top-2 left-2 bg-[#131313]/80 backdrop-blur text-amber-400 text-[10px] px-2 py-1 rounded-lg font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400" /> {lm.rating}
                  </div>
                  
                  <div className="p-4 flex flex-col flex-grow justify-between bg-gradient-to-t from-[#131313] to-[#1c1b1b]">
                    <div>
                      <h4 className="text-sm font-bold text-[#f4bd70] mb-1">{lm.name}</h4>
                      <p className="text-[10px] text-[#d4c4b3] flex items-center gap-1 opacity-80 mb-2">📍 {lm.city}</p>
                      <p className="text-[10px] text-[#e5e2e1] line-clamp-2">{lm.description}</p>
                    </div>

                    <div className="flex gap-2 justify-end mt-4 pt-3 border-t border-[#504538]/30">
                      <button
                        onClick={() => handleEditLandmarkClick(lm)}
                        className="bg-blue-500/20 text-blue-300 p-1.5 rounded-lg hover:bg-blue-500/40 transition-colors"
                        title="تعديل المعلم"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteLandmark(lm.id)}
                        className="bg-red-500/20 text-red-300 p-1.5 rounded-lg hover:bg-red-500/40 transition-colors"
                        title="حذف المعلم"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="liquid-glass-strong rounded-2xl p-8 max-w-2xl border border-[#f4bd70]/30 space-y-6">
            <h3 className="font-bold text-lg text-[#f4bd70] flex items-center gap-2">
              <SettingsIcon className="w-5 h-5" /> تعديل إعدادات التواصل والموقع
            </h3>

            {settingsSuccess && (
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> تم حفظ الإعدادات الجديدة بنجاح!
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="text-xs text-[#d4c4b3] block mb-1">رقم هاتف الاتصال المباشر</label>
                <input
                  type="text"
                  dir="ltr"
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full bg-[#1c1b1b] border border-[#504538] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1]"
                />
              </div>

              <div>
                <label className="text-xs text-[#d4c4b3] block mb-1">رقم الواتساب للتفاوض مباشر</label>
                <input
                  type="text"
                  dir="ltr"
                  value={settingsForm.whatsapp}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                  className="w-full bg-[#1c1b1b] border border-[#504538] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1]"
                />
              </div>

              <div>
                <label className="text-xs text-[#d4c4b3] block mb-1">العنوان الرئيسي المعتمد (الافتراضي: شبرا مصر)</label>
                <input
                  type="text"
                  value={settingsForm.address}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  className="w-full bg-[#1c1b1b] border border-[#504538] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1]"
                />
              </div>

              <div>
                <label className="text-xs text-[#d4c4b3] block mb-1">رابط فيديو خلفية الصفحة الرئيسية (Hero Video MP4 URL)</label>
                <input
                  type="url"
                  dir="ltr"
                  value={settingsForm.hero_video_url}
                  onChange={(e) => setSettingsForm({ ...settingsForm, hero_video_url: e.target.value })}
                  className="w-full bg-[#1c1b1b] border border-[#504538] rounded-xl px-4 py-2.5 text-xs text-[#e5e2e1]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#d4a056] to-[#f4bd70] text-[#131313] font-bold py-3 rounded-xl hover:brightness-110 transition-all cursor-pointer text-xs"
              >
                حفظ التغييرات
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
