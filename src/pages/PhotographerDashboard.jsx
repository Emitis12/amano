
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Camera,
  CheckCircle2,
  CloudUpload,
  LogOut,
  ShieldCheck,
  Image as ImageIcon,
  Eye,
  RefreshCw,
  Trash2,
  Pencil,
  X,
  Hotel,
  Landmark,
  ClipboardList,
  Plus,
  Save,
  Building2,
  CalendarDays,
  LockKeyhole,
  FileText,
  ExternalLink,
} from 'lucide-react'
import { supabase } from '../lib/supabase.js'

const EVENT_DAYS = [
  { value: 'day1', label: 'Day 1 — 12 November — Meet & Greet' },
  { value: 'day2', label: 'Day 2 — 13 November — Convention' },
  { value: 'day3', label: 'Day 3 — 14 November — Convention & Gala' },
]

const CATEGORIES = [
  { value: 'speakers', label: 'Speakers' },
  { value: 'networking', label: 'Networking' },
  { value: 'audience', label: 'Audience' },
  { value: 'meet_greet', label: 'Meet & Greet' },
  { value: 'gala', label: 'Gala' },
  { value: 'awards', label: 'Awards' },
  { value: 'venue', label: 'Venue' },
  { value: 'general', label: 'General' },
]

const HOTEL_SECTIONS = [
  { id: 'photos', label: 'Photo Management', icon: ImageIcon },
  { id: 'hotels', label: 'Hotels & Rooms', icon: Hotel },
  { id: 'bank', label: 'Bank Settings', icon: Landmark },
  { id: 'bookings', label: 'Hotel Bookings', icon: ClipboardList },
]

const emptyHotelForm = {
  name: '',
  slug: '',
  description: '',
  address: '',
  latitude: '',
  longitude: '',
  distance_to_venue_km: '',
  amenities: '',
  photo_urls: '',
  contact_phone: '',
  contact_email: '',
  is_published: false,
}

const emptyRoomForm = {
  hotel_id: '',
  room_name: '',
  description: '',
  price_per_night: '',
  max_guests: '2',
  total_rooms: '1',
  amenities: '',
  photo_urls: '',
  is_available: true,
}

const emptyBankForm = {
  bank_name: '',
  account_name: '',
  account_number: '',
  transfer_instructions: '',
}

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm outline-none focus:border-[#002B5C] focus:ring-1 focus:ring-[#002B5C]'

const buttonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-[#002B5C] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#003B7A] disabled:cursor-not-allowed disabled:opacity-50'

function splitLines(value) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
}

function toLines(value) {
  return Array.isArray(value) ? value.join('\n') : ''
}

function makeSlug(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)
}

function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString()
}

function Notice({ children, type = 'success' }) {
  if (!children) return null

  const styles =
    type === 'error'
      ? 'border-red-200 bg-red-50 text-red-700'
      : 'border-green-200 bg-green-50 text-green-800'

  return (
    <div
      role={type === 'error' ? 'alert' : 'status'}
      className={`mb-4 whitespace-pre-line rounded-lg border p-4 text-sm ${styles}`}
    >
      {children}
    </div>
  )
}

export default function PhotographerDashboard() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [staff, setStaff] = useState(null)
  const [checkingAccess, setCheckingAccess] = useState(true)
  const [activeSection, setActiveSection] = useState('photos')

  const [files, setFiles] = useState([])
  const [eventDay, setEventDay] = useState('day1')
  const [category, setCategory] = useState('general')
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  // Existing photo administration
  const [photos, setPhotos] = useState([])
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [reviewNotice, setReviewNotice] = useState('')
  const [reviewError, setReviewError] = useState('')
  const [processingPhotoId, setProcessingPhotoId] = useState(null)
  const [editingPhotoId, setEditingPhotoId] = useState(null)
  const [editForm, setEditForm] = useState({
    event_day: 'day1',
    category: 'general',
    caption: '',
  })
  const [savingEdit, setSavingEdit] = useState(false)

  // Hotel and room administration
  const [hotels, setHotels] = useState([])
  const [rooms, setRooms] = useState([])
  const [loadingHotels, setLoadingHotels] = useState(false)
  const [hotelForm, setHotelForm] = useState(emptyHotelForm)
  const [editingHotelId, setEditingHotelId] = useState(null)
  const [savingHotel, setSavingHotel] = useState(false)
  const [hotelNotice, setHotelNotice] = useState('')
  const [hotelError, setHotelError] = useState('')
  const [roomForm, setRoomForm] = useState(emptyRoomForm)
  const [editingRoomId, setEditingRoomId] = useState(null)
  const [savingRoom, setSavingRoom] = useState(false)
  const [roomNotice, setRoomNotice] = useState('')
  const [roomError, setRoomError] = useState('')

  // Bank settings
  const [bankForm, setBankForm] = useState(emptyBankForm)
  const [activeBankId, setActiveBankId] = useState(null)
  const [loadingBank, setLoadingBank] = useState(false)
  const [savingBank, setSavingBank] = useState(false)
  const [bankNotice, setBankNotice] = useState('')
  const [bankError, setBankError] = useState('')

  // Hotel bookings
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const [bookingNotice, setBookingNotice] = useState('')
  const [bookingReceipts, setBookingReceipts] = useState([])
  const [loadingReceipts, setLoadingReceipts] = useState(false)
  const [processingBookingId, setProcessingBookingId] = useState(null)

  const isAdmin =
    staff?.staff_role === 'admin' ||
    staff?.staff_role === 'super_admin'

  const isSuperAdmin =
    staff?.staff_role === 'super_admin' &&
    staff?.is_active === true

  // Verify the signed-in staff account.
  useEffect(() => {
    let active = true

    async function checkAccess() {
      try {
        const {
          data: { user: currentUser },
          error: authError,
        } = await supabase.auth.getUser()

        if (authError || !currentUser) {
          navigate('/photographer/login', { replace: true })
          return
        }

        const { data: access, error: accessError } = await supabase
          .from('photographer_access')
          .select('staff_role, is_active')
          .eq('user_id', currentUser.id)
          .maybeSingle()

        if (accessError) throw accessError

        if (
          !access ||
          !access.is_active ||
          !['photographer', 'admin', 'super_admin'].includes(
            access.staff_role
          )
        ) {
          await supabase.auth.signOut()
          navigate('/photographer/login', { replace: true })
          return
        }

        if (active) {
          setUser(currentUser)
          setStaff(access)
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Could not verify staff access.')
        }
      } finally {
        if (active) setCheckingAccess(false)
      }
    }

    checkAccess()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (
        event === 'SIGNED_OUT' ||
        (!session && event !== 'INITIAL_SESSION')
      ) {
        navigate('/photographer/login', { replace: true })
      }
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [navigate])

  // Load all gallery photos for administrators.
  const loadManagedPhotos = useCallback(async () => {
    if (!isAdmin) return

    setLoadingPhotos(true)
    setReviewError('')

    try {
      const { data, error: queryError } = await supabase
        .from('gallery_photos')
        .select('*')
        .order('created_at', { ascending: false })

      if (queryError) throw queryError

      const photosWithUrls = await Promise.all(
        (data || []).map(async (photo) => {
          const { data: signedData, error: signedError } =
            await supabase.storage
              .from('amano-photos')
              .createSignedUrl(photo.storage_path, 3600)

          return {
            ...photo,
            previewUrl: signedError ? null : signedData?.signedUrl,
            previewError: signedError?.message || '',
          }
        })
      )

      setPhotos(photosWithUrls)
    } catch (err) {
      setReviewError(err.message || 'Could not load gallery photos.')
    } finally {
      setLoadingPhotos(false)
    }
  }, [isAdmin])

  useEffect(() => {
    if (isAdmin) {
      loadManagedPhotos()
    } else {
      setPhotos([])
    }
  }, [isAdmin, loadManagedPhotos])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/photographer/login', { replace: true })
  }

  // Existing photo upload workflow.
  async function handleUpload(event) {
    event.preventDefault()
    setError('')
    setNotice('')

    if (!user || !staff?.is_active) {
      setError('Your staff access could not be verified.')
      return
    }

    if (!files.length) {
      setError('Please select at least one image.')
      return
    }

    const invalidFile = files.find(
      (file) =>
        !file.type.startsWith('image/') ||
        file.size > 20 * 1024 * 1024
    )

    if (invalidFile) {
      setError(
        'Choose image files only. Each image must be no larger than 20 MB.'
      )
      return
    }

    setUploading(true)
    let successful = 0
    const failures = []

    try {
      for (let index = 0; index < files.length; index += 1) {
        const file = files[index]

        setProgress(
          `Uploading ${index + 1} of ${files.length}: ${file.name}`
        )

        const safeName = file.name
          .normalize('NFKD')
          .replace(/[^a-zA-Z0-9._-]/g, '_')

        const storagePath =
          `${user.id}/${Date.now()}-${index}-${safeName}`

        const { error: storageError } = await supabase.storage
          .from('amano-photos')
          .upload(storagePath, file, {
            contentType: file.type,
            upsert: false,
          })

        if (storageError) {
          failures.push(`${file.name}: ${storageError.message}`)
          continue
        }

        const { error: recordError } = await supabase
          .from('gallery_photos')
          .insert({
            file_name: file.name,
            storage_path: storagePath,
            event_day: eventDay,
            category,
            caption: caption.trim() || null,
            uploaded_by: user.id,
            is_published: isAdmin,
          })

        if (recordError) {
          failures.push(
            `${file.name}: Image uploaded, but saving its gallery record failed: ${recordError.message}`
          )
          continue
        }

        successful += 1
      }

      if (successful > 0) {
        setNotice(
          isAdmin
            ? `${successful} photo(s) uploaded and published successfully.`
            : `${successful} photo(s) uploaded and are awaiting administrator review.`
        )

        setFiles([])
        setCaption('')

        const input = document.getElementById('gallery-photo-files')
        if (input) input.value = ''

        if (isAdmin) await loadManagedPhotos()
      }

      if (failures.length) setError(failures.join('\n'))
    } catch (err) {
      setError(err.message || 'An unexpected upload error occurred.')
    } finally {
      setUploading(false)
      setProgress('')
    }
  }

  function startEditingPhoto(photo) {
    setEditingPhotoId(photo.id)
    setEditForm({
      event_day: photo.event_day || 'day1',
      category: photo.category || 'general',
      caption: photo.caption || '',
    })
    setReviewError('')
    setReviewNotice('')
  }

  async function handleSavePhotoDetails(photo) {
    setSavingEdit(true)
    setReviewError('')
    setReviewNotice('')

    try {
      const { data, error: updateError } = await supabase
        .from('gallery_photos')
        .update({
          event_day: editForm.event_day,
          category: editForm.category,
          caption: editForm.caption.trim() || null,
        })
        .eq('id', photo.id)
        .select('id, event_day, category, caption')

      if (updateError) throw updateError
      if (!data?.length) {
        throw new Error(
          'No changes were saved. Check administrator permissions.'
        )
      }

      setPhotos((current) =>
        current.map((item) =>
          item.id === photo.id ? { ...item, ...data[0] } : item
        )
      )
      setEditingPhotoId(null)
      setReviewNotice(`Details updated for "${photo.file_name}".`)
    } catch (err) {
      setReviewError(err.message || 'Could not update photo details.')
    } finally {
      setSavingEdit(false)
    }
  }

  async function handleApprovePhoto(photo) {
    setReviewError('')
    setReviewNotice('')
    setProcessingPhotoId(photo.id)

    try {
      const { data, error: updateError } = await supabase
        .from('gallery_photos')
        .update({ is_published: true })
        .eq('id', photo.id)
        .eq('is_published', false)
        .select('id')

      if (updateError) throw updateError
      if (!data?.length) {
        throw new Error(
          'Photo not approved. Refresh the list and check your permissions.'
        )
      }

      setReviewNotice(`"${photo.file_name}" is now published.`)
      await loadManagedPhotos()
    } catch (err) {
      setReviewError(err.message || 'Could not approve this photo.')
    } finally {
      setProcessingPhotoId(null)
    }
  }

  async function handleRejectPhoto(photo) {
    if (photo.is_published) return

    const confirmed = window.confirm(
      `Reject "${photo.file_name}"? This will remove its gallery record and stored image.`
    )
    if (!confirmed) return

    setReviewError('')
    setReviewNotice('')
    setProcessingPhotoId(photo.id)

    try {
      const { data, error: deleteError } = await supabase
        .from('gallery_photos')
        .delete()
        .eq('id', photo.id)
        .eq('is_published', false)
        .select('id')

      if (deleteError) throw deleteError
      if (!data?.length) {
        throw new Error(
          'Photo not rejected. Refresh the list and check your permissions.'
        )
      }

      setPhotos((current) =>
        current.filter((item) => item.id !== photo.id)
      )

      if (editingPhotoId === photo.id) setEditingPhotoId(null)

      const { error: storageError } = await supabase.storage
        .from('amano-photos')
        .remove([photo.storage_path])

      setReviewNotice(
        storageError
          ? 'Submission rejected, but the stored file could not be deleted. Check Storage permissions.'
          : `"${photo.file_name}" has been rejected and removed.`
      )
    } catch (err) {
      setReviewError(err.message || 'Could not reject this photo.')
    } finally {
      setProcessingPhotoId(null)
    }
  }

  // All hotel administration functions require a verified super admin.
  const loadHotels = useCallback(async () => {
    if (!isSuperAdmin) return

    setLoadingHotels(true)
    setHotelError('')
    setRoomError('')

    try {
      const [
        { data: hotelData, error: hotelsQueryError },
        { data: roomData, error: roomsQueryError },
      ] = await Promise.all([
        supabase
          .from('hotel_listings')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('hotel_rooms')
          .select('*')
          .order('created_at', { ascending: false }),
      ])

      if (hotelsQueryError) throw hotelsQueryError
      if (roomsQueryError) throw roomsQueryError

      setHotels(hotelData || [])
      setRooms(roomData || [])
    } catch (err) {
      setHotelError(
        err.message ||
          'Could not load hotels. Check the hotel tables and Supabase permissions.'
      )
    } finally {
      setLoadingHotels(false)
    }
  }, [isSuperAdmin])

  const loadBankSettings = useCallback(async () => {
    if (!isSuperAdmin) return

    setLoadingBank(true)
    setBankError('')
    setBankNotice('')

    try {
      const { data, error: queryError } = await supabase
        .from('hotel_bank_settings')
        .select(
          'id, bank_name, account_name, account_number, transfer_instructions, is_active'
        )
        .eq('is_active', true)
        .maybeSingle()

      if (queryError) throw queryError

      if (data) {
        setActiveBankId(data.id)
        setBankForm({
          bank_name: data.bank_name || '',
          account_name: data.account_name || '',
          account_number: data.account_number || '',
          transfer_instructions: data.transfer_instructions || '',
        })
      } else {
        setActiveBankId(null)
        setBankForm(emptyBankForm)
      }
    } catch (err) {
      setBankError(
        err.message ||
          'Could not load bank settings. Check the super-admin RLS policies.'
      )
    } finally {
      setLoadingBank(false)
    }
  }, [isSuperAdmin])

  const loadBookings = useCallback(async () => {
    if (!isSuperAdmin) return

    setLoadingBookings(true)
    setBookingError('')

    try {
      const [
        { data: bookingData, error: bookingsQueryError },
        { data: hotelData, error: hotelsQueryError },
        { data: roomData, error: roomsQueryError },
      ] = await Promise.all([
        supabase
          .from('hotel_bookings')
          .select(
            'id, booking_reference, guest_name, guest_email, guest_phone, hotel_id, room_id, check_in, check_out, guest_count, room_count, number_of_nights, total_amount, booking_status, payment_status, created_at, admin_notes'
          )
          .order('created_at', { ascending: false })
          .limit(100),
        supabase.from('hotel_listings').select('id, name'),
        supabase.from('hotel_rooms').select('id, hotel_id, room_name'),
      ])

      if (bookingsQueryError) throw bookingsQueryError
      if (hotelsQueryError) throw hotelsQueryError
      if (roomsQueryError) throw roomsQueryError

      setBookings(bookingData || [])
      setHotels(hotelData || [])
      setRooms(roomData || [])
    } catch (err) {
      setBookingError(
        err.message ||
          'Could not load bookings. Check the super-admin RLS policies.'
      )
    } finally {
      setLoadingBookings(false)
    }
  }, [isSuperAdmin])

  const loadBookingReceipts = useCallback(async () => {
    if (!isSuperAdmin) return

    setLoadingReceipts(true)
    setBookingError('')

    try {
      const { data, error: receiptsQueryError } = await supabase
        .from('hotel_payment_receipts')
        .select(
          'id, booking_id, storage_path, original_filename, content_type, file_size_bytes, uploaded_at'
        )
        .order('uploaded_at', { ascending: false })

      if (receiptsQueryError) throw receiptsQueryError

      const receiptsWithUrls = await Promise.all(
        (data || []).map(async (receipt) => {
          const { data: signedData, error: signedError } = await supabase.storage
            .from('amano-hotel-receipts')
            .createSignedUrl(receipt.storage_path, 3600)

          return {
            ...receipt,
            previewUrl: signedError ? null : signedData?.signedUrl || null,
            previewError: signedError?.message || '',
          }
        })
      )

      setBookingReceipts(receiptsWithUrls)
    } catch (err) {
      setBookingError(
        `${err.message || 'Could not load payment receipts.'} Ensure the hotel_payment_receipts table and private bucket policies allow active super administrators to read receipts.`
      )
    } finally {
      setLoadingReceipts(false)
    }
  }, [isSuperAdmin])

  async function reviewHotelBooking(booking, action) {
    if (!isSuperAdmin || !booking?.id) return

    let adminNotes = ''
    if (action === 'reject_payment' || action === 'reject_booking') {
      adminNotes = window.prompt(
        action === 'reject_payment'
          ? 'Reason for rejecting this payment receipt:'
          : 'Reason for rejecting this booking:'
      )
      if (adminNotes === null) return
      adminNotes = adminNotes.trim()
      if (!adminNotes) {
        setBookingError('Please provide a reason before rejecting.')
        return
      }
    } else if (action === 'verify_payment') {
      const confirmed = window.confirm(
        `Confirm that you have checked the actual bank account statement and verified the transfer for ${booking.booking_reference} (${formatMoney(booking.total_amount)}). Do not verify based only on the uploaded receipt.`
      )
      if (!confirmed) return
      adminNotes = window.prompt(
        'Optional note or bank transfer reference (leave blank if none):'
      )
      if (adminNotes === null) return
      adminNotes = adminNotes.trim()
    } else if (action === 'confirm_booking') {
      if (booking.payment_status !== 'verified') {
        setBookingError('Verify the payment before confirming this booking.')
        return
      }
      if (
        !window.confirm(
          `Confirm booking ${booking.booking_reference}? Confirm only after payment has been verified and room availability has been checked.`
        )
      ) return
    }

    setProcessingBookingId(booking.id)
    setBookingError('')
    setBookingNotice('')

    try {
      const { data, error: functionError } = await supabase.functions.invoke(
        'admin-hotel-booking-action',
        {
          body: {
            bookingId: booking.id,
            action,
            reason: adminNotes || '',
          },
        }
      )

      if (functionError) {
        let message = functionError.message || 'The review request failed.'
        try {
          const context = functionError.context
          if (context && typeof context.json === 'function') {
            const body = await context.json()
            if (body?.error) message = body.error
          }
        } catch {
          // Keep the original function error when no JSON response is available.
        }
        throw new Error(
          message.includes('Failed to send a request')
            ? 'Could not reach the admin-hotel-booking-action Edge Function. Deploy that function and confirm its permissions before using these actions.'
            : message
        )
      }

      if (data?.error) throw new Error(data.error)

      const actionMessages = {
        verify_payment: 'Payment marked as verified. Confirm the booking separately after checking room availability.',
        reject_payment: 'Payment receipt rejected.',
        confirm_booking: 'Booking confirmed.',
        reject_booking: 'Booking rejected.',
      }
      setBookingNotice(data?.message || actionMessages[action] || 'Booking updated.')
      await Promise.all([loadBookings(), loadBookingReceipts()])
    } catch (err) {
      setBookingError(err.message || 'Could not review this booking.')
    } finally {
      setProcessingBookingId(null)
    }
  }

  // Permanently delete a booking and its stored payment receipts securely on the server.
  async function handleDeleteHotelBooking(booking) {
    if (!isSuperAdmin || !booking?.id) return

    const confirmed = window.confirm(
      `PERMANENTLY DELETE booking ${booking.booking_reference} for ${booking.guest_name}?\n\n` +
        'This removes the booking, its payment receipt records, and stored receipt files. This action cannot be undone.'
    )

    if (!confirmed) return

    setProcessingBookingId(booking.id)
    setBookingError('')
    setBookingNotice('')

    try {
      const { data, error: functionError } = await supabase.functions.invoke(
        'admin-hotel-booking-action',
        {
          body: {
            action: 'delete_booking',
            bookingId: booking.id,
          },
        }
      )

      if (functionError) {
        let message = functionError.message || 'The booking deletion request failed.'

        try {
          const response = functionError.context
          if (response && typeof response.json === 'function') {
            const details = await response.json()
            if (details?.error) message = details.error
          }
        } catch {
          // Keep the original error if no JSON response is available.
        }

        throw new Error(message)
      }

      if (data?.error) throw new Error(data.error)

      setBookingNotice(
        data?.message || `Booking ${booking.booking_reference} deleted successfully.`
      )

      await Promise.all([loadBookings(), loadBookingReceipts()])
    } catch (err) {
      setBookingError(err.message || 'Could not delete this hotel booking.')
    } finally {
      setProcessingBookingId(null)
    }
  }

  useEffect(() => {
    if (!isSuperAdmin) return

    if (activeSection === 'hotels') loadHotels()
    if (activeSection === 'bank') loadBankSettings()
    if (activeSection === 'bookings') {
      loadBookings()
      loadBookingReceipts()
    }
  }, [
    activeSection,
    isSuperAdmin,
    loadHotels,
    loadBankSettings,
    loadBookings,
    loadBookingReceipts,
  ])

  function startEditingHotel(hotel) {
    setEditingHotelId(hotel.id)
    setHotelForm({
      name: hotel.name || '',
      slug: hotel.slug || '',
      description: hotel.description || '',
      address: hotel.address || '',
      latitude: hotel.latitude ?? '',
      longitude: hotel.longitude ?? '',
      distance_to_venue_km: hotel.distance_to_venue_km ?? '',
      amenities: toLines(hotel.amenities),
      photo_urls: toLines(hotel.photo_urls),
      contact_phone: hotel.contact_phone || '',
      contact_email: hotel.contact_email || '',
      is_published: Boolean(hotel.is_published),
    })
    setHotelNotice('')
    setHotelError('')
  }

  function resetHotelForm() {
    setEditingHotelId(null)
    setHotelForm(emptyHotelForm)
  }

  async function handleSaveHotel(event) {
    event.preventDefault()
    if (!isSuperAdmin || !user) return

    setSavingHotel(true)
    setHotelNotice('')
    setHotelError('')

    try {
      const name = hotelForm.name.trim()
      if (!name) throw new Error('Enter the hotel name.')

      const payload = {
        name,
        slug: makeSlug(hotelForm.slug || name),
        description: hotelForm.description.trim() || null,
        address: hotelForm.address.trim() || null,
        latitude:
          hotelForm.latitude === '' ? null : Number(hotelForm.latitude),
        longitude:
          hotelForm.longitude === '' ? null : Number(hotelForm.longitude),
        distance_to_venue_km:
          hotelForm.distance_to_venue_km === ''
            ? null
            : Number(hotelForm.distance_to_venue_km),
        amenities: splitLines(hotelForm.amenities),
        photo_urls: splitLines(hotelForm.photo_urls),
        contact_phone: hotelForm.contact_phone.trim() || null,
        contact_email: hotelForm.contact_email.trim() || null,
        is_published: Boolean(hotelForm.is_published),
      }

      for (const field of [
        'latitude',
        'longitude',
        'distance_to_venue_km',
      ]) {
        if (payload[field] !== null && !Number.isFinite(payload[field])) {
          throw new Error(`Enter a valid value for ${field.replaceAll('_', ' ')}.`)
        }
      }

      const result = editingHotelId
        ? await supabase
            .from('hotel_listings')
            .update(payload)
            .eq('id', editingHotelId)
            .select()
        : await supabase
            .from('hotel_listings')
            .insert(payload)
            .select()

      if (result.error) throw result.error
      if (!result.data?.length) {
        throw new Error(
          'No hotel changes were saved. Check your permissions.'
        )
      }

      setHotelNotice(
        editingHotelId ? 'Hotel details updated.' : 'Hotel created.'
      )
      resetHotelForm()
      await loadHotels()
    } catch (err) {
      setHotelError(err.message || 'Could not save the hotel.')
    } finally {
      setSavingHotel(false)
    }
  }

  async function handleDeleteHotel(hotel) {
    if (!isSuperAdmin) return

    const confirmed = window.confirm(
      `Delete "${hotel.name}"? This may be blocked if the hotel has existing room or booking records.`
    )
    if (!confirmed) return

    setHotelError('')
    setHotelNotice('')

    try {
      const { error: deleteError } = await supabase
        .from('hotel_listings')
        .delete()
        .eq('id', hotel.id)

      if (deleteError) throw deleteError

      setHotelNotice('Hotel deleted.')
      await loadHotels()
    } catch (err) {
      setHotelError(
        err.message ||
          'Could not delete the hotel. Hotels with existing bookings should generally be unpublished instead.'
      )
    }
  }

  function startEditingRoom(room) {
    setEditingRoomId(room.id)
    setRoomForm({
      hotel_id: room.hotel_id || '',
      room_name: room.room_name || '',
      description: room.description || '',
      price_per_night: String(room.price_per_night ?? ''),
      max_guests: String(room.max_guests ?? 2),
      total_rooms: String(room.total_rooms ?? 1),
      amenities: toLines(room.amenities),
      photo_urls: toLines(room.photo_urls),
      is_available: Boolean(room.is_available),
    })
    setRoomNotice('')
    setRoomError('')
  }

  function resetRoomForm() {
    setEditingRoomId(null)
    setRoomForm({
      ...emptyRoomForm,
      hotel_id: hotels[0]?.id || '',
    })
  }

  async function handleSaveRoom(event) {
    event.preventDefault()
    if (!isSuperAdmin) return

    setSavingRoom(true)
    setRoomNotice('')
    setRoomError('')

    try {
      if (!roomForm.hotel_id) {
        throw new Error('Select a hotel for this room.')
      }
      if (!roomForm.room_name.trim()) {
        throw new Error('Enter the room name.')
      }

      const price = Number(roomForm.price_per_night)
      const maxGuests = Number(roomForm.max_guests)
      const totalRooms = Number(roomForm.total_rooms)

      if (!Number.isFinite(price) || price < 0) {
        throw new Error('Enter a valid room price.')
      }
      if (!Number.isInteger(maxGuests) || maxGuests < 1) {
        throw new Error('Maximum guests must be at least 1.')
      }
      if (!Number.isInteger(totalRooms) || totalRooms < 0) {
        throw new Error('Total rooms must be zero or greater.')
      }

      const payload = {
        hotel_id: roomForm.hotel_id,
        room_name: roomForm.room_name.trim(),
        description: roomForm.description.trim() || null,
        price_per_night: price,
        max_guests: maxGuests,
        total_rooms: totalRooms,
        amenities: splitLines(roomForm.amenities),
        photo_urls: splitLines(roomForm.photo_urls),
        is_available: Boolean(roomForm.is_available),
      }

      const result = editingRoomId
        ? await supabase
            .from('hotel_rooms')
            .update(payload)
            .eq('id', editingRoomId)
            .select()
        : await supabase
            .from('hotel_rooms')
            .insert(payload)
            .select()

      if (result.error) throw result.error
      if (!result.data?.length) {
        throw new Error(
          'No room changes were saved. Check your permissions.'
        )
      }

      setRoomNotice(
        editingRoomId ? 'Room details updated.' : 'Room created.'
      )
      resetRoomForm()
      await loadHotels()
    } catch (err) {
      setRoomError(err.message || 'Could not save the room.')
    } finally {
      setSavingRoom(false)
    }
  }

  async function handleDeleteRoom(room) {
    if (!isSuperAdmin) return

    if (
      !window.confirm(
        `Delete "${room.room_name}"? Existing bookings may prevent deletion.`
      )
    ) {
      return
    }

    setRoomError('')
    setRoomNotice('')

    try {
      const { error: deleteError } = await supabase
        .from('hotel_rooms')
        .delete()
        .eq('id', room.id)

      if (deleteError) throw deleteError

      setRoomNotice('Room deleted.')
      await loadHotels()
    } catch (err) {
      setRoomError(
        err.message ||
          'Could not delete the room. Consider marking it unavailable instead.'
      )
    }
  }

  async function handleSaveBank(event) {
    event.preventDefault()
    if (!isSuperAdmin || !user) return

    setSavingBank(true)
    setBankNotice('')
    setBankError('')

    try {
      const bankName = bankForm.bank_name.trim()
      const accountName = bankForm.account_name.trim()
      const accountNumber = bankForm.account_number.replace(/\s/g, '')

      if (!bankName || !accountName || !accountNumber) {
        throw new Error(
          'Bank name, account name and account number are required.'
        )
      }

      if (!/^\d{8,20}$/.test(accountNumber)) {
        throw new Error(
          'Enter an account number containing 8–20 digits, without letters.'
        )
      }

      const payload = {
        bank_name: bankName,
        account_name: accountName,
        account_number: accountNumber,
        transfer_instructions:
          bankForm.transfer_instructions.trim() || null,
        is_active: true,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      }

      // Update the active row in place to avoid violating the
      // one-active-bank-account unique constraint.
      const result = activeBankId
        ? await supabase
            .from('hotel_bank_settings')
            .update(payload)
            .eq('id', activeBankId)
            .eq('is_active', true)
            .select('id')
        : await supabase
            .from('hotel_bank_settings')
            .insert(payload)
            .select('id')

      if (result.error) throw result.error
      if (!result.data?.length) {
        throw new Error(
          'Bank settings were not saved. Refresh and check super-admin permissions.'
        )
      }

      setActiveBankId(result.data[0].id)
      setBankNotice('Hotel payment bank details saved and activated.')
    } catch (err) {
      setBankError(
        err.message ||
          'Could not save bank settings. Check the table permissions and constraints.'
      )
    } finally {
      setSavingBank(false)
    }
  }

  const pendingCount = photos.filter(
    (photo) => !photo.is_published
  ).length

  if (checkingAccess) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
        <p className="text-gray-600">Verifying staff access...</p>
      </div>
    )
  }

  if (!staff || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-6">
        <p className="text-center text-gray-600">
          {error || 'Redirecting to staff login...'}
        </p>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <header className="bg-[#002B5C] px-5 py-8 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
          <div>
            <p className="mb-2 text-xs pt-16 font-semibold uppercase tracking-[0.2em] text-amber-400">
              AMANO National Convention 2026
            </p>
            <h1 className="text-2xl font-bold sm:text-3xl">
              AMANO Administration Dashboard
            </h1>
            <div className="mt-3 flex items-center gap-2 text-sm text-blue-100">
              <ShieldCheck size={17} />
              <span>
                {isSuperAdmin
                  ? 'Super Administrator'
                  : isAdmin
                    ? 'Administrator'
                    : 'Photographer'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-4 py-2.5 text-sm font-medium transition hover:bg-white/10"
          >
            <LogOut size={17} />
            Sign Out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <nav
          aria-label="Dashboard sections"
          className="mb-8 flex gap-2 overflow-x-auto rounded-xl border border-gray-200 bg-white p-2"
        >
          {HOTEL_SECTIONS.filter(
            (section) =>
              section.id === 'photos' || isSuperAdmin
          ).map((section) => {
            const Icon = section.icon
            const selected = activeSection === section.id

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => {
                  setActiveSection(section.id)
                  setError('')
                  setNotice('')
                }}
                aria-current={selected ? 'page' : undefined}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                  selected
                    ? 'bg-[#002B5C] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={17} />
                {section.label}
              </button>
            )
          })}
        </nav>

        {!isSuperAdmin && activeSection !== 'photos' && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            <LockKeyhole className="mb-2" size={22} />
            This section is restricted to active super administrators.
          </div>
        )}

        {/* PHOTO MANAGEMENT */}
        {activeSection === 'photos' && (
          <>
            <div className="mb-8 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 shrink-0 text-[#002B5C]" />
                <div>
                  <p className="font-semibold text-[#002B5C]">
                    {isAdmin
                      ? 'Administrator access'
                      : 'Photographer upload access'}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-gray-700">
                    {isAdmin
                      ? 'Upload and publish photos, review photographer submissions, edit photo details, and manage pending approvals.'
                      : 'Upload photographs for administrator review. Your submissions remain unpublished until approved.'}
                  </p>
                </div>
              </div>
            </div>

            <Notice type="success">{notice}</Notice>
            <Notice type="error">{error}</Notice>

            <form
              onSubmit={handleUpload}
              className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"
            >
              <div className="flex items-center gap-2">
                <Camera size={21} className="text-[#002B5C]" />
                <h2 className="text-xl font-bold text-[#002B5C]">
                  Upload Photographs
                </h2>
              </div>

              <div>
                <label
                  htmlFor="gallery-photo-files"
                  className="mb-2 block font-semibold text-gray-800"
                >
                  Select photographs
                </label>
                <input
                  id="gallery-photo-files"
                  type="file"
                  accept="image/*"
                  multiple
                  required
                  disabled={uploading}
                  onChange={(event) =>
                    setFiles(Array.from(event.target.files || []))
                  }
                  className="block w-full rounded-lg border border-gray-300 p-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-medium file:text-[#002B5C]"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Select multiple images. Maximum file size: 20 MB per image.
                </p>
                {files.length > 0 && (
                  <p className="mt-2 text-sm font-medium text-gray-700">
                    {files.length} image(s) selected
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="event-day"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Convention day
                </label>
                <select
                  id="event-day"
                  value={eventDay}
                  disabled={uploading}
                  onChange={(event) => setEventDay(event.target.value)}
                  className={inputClass}
                >
                  {EVENT_DAYS.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="photo-category"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Photo category
                </label>
                <select
                  id="photo-category"
                  value={category}
                  disabled={uploading}
                  onChange={(event) => setCategory(event.target.value)}
                  className={inputClass}
                >
                  {CATEGORIES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="photo-caption"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Caption <span className="font-normal text-gray-500">(optional)</span>
                </label>
                <textarea
                  id="photo-caption"
                  rows={3}
                  value={caption}
                  disabled={uploading}
                  onChange={(event) => setCaption(event.target.value)}
                  placeholder="Add a description for these photographs..."
                  className={inputClass}
                />
              </div>

              {uploading && (
                <div
                  role="status"
                  aria-live="polite"
                  className="rounded-lg bg-blue-50 p-3 text-sm text-[#002B5C]"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <CloudUpload size={18} />
                    <span className="font-medium">{progress}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-blue-100">
                    <div className="h-full w-1/2 animate-pulse rounded-full bg-[#008BE0]" />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading || files.length === 0}
                className={`${buttonClass} w-full`}
              >
                <CloudUpload size={19} />
                {uploading ? 'Uploading photographs...' : 'Upload photographs'}
              </button>
            </form>

            {isAdmin && (
              <section className="mt-12">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <ImageIcon size={22} className="text-[#002B5C]" />
                      <h2 className="text-xl font-bold text-[#002B5C] sm:text-2xl">
                        Photo Management
                      </h2>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      Approve submissions and edit pending or published photos.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={loadManagedPhotos}
                    disabled={loadingPhotos}
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                  >
                    <RefreshCw
                      size={16}
                      className={loadingPhotos ? 'animate-spin' : ''}
                    />
                    Refresh
                  </button>
                </div>

                <Notice>{reviewNotice}</Notice>
                <Notice type="error">{reviewError}</Notice>

                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Awaiting approval
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Only published photos appear in the public gallery.
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-200 px-3 py-1 text-sm font-bold text-amber-900">
                    {pendingCount} pending
                  </span>
                </div>

                {loadingPhotos ? (
                  <div className="rounded-xl border bg-white p-10 text-center">
                    <RefreshCw
                      className="mx-auto mb-3 animate-spin text-[#002B5C]"
                      size={28}
                    />
                    Loading gallery photos...
                  </div>
                ) : photos.length === 0 ? (
                  <div className="rounded-xl border border-dashed bg-white p-10 text-center">
                    <CheckCircle2
                      className="mx-auto mb-3 text-green-600"
                      size={36}
                    />
                    <h3 className="font-semibold text-gray-800">
                      No gallery photos found
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Uploaded photos will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {photos.map((photo) => (
                      <article
                        key={photo.id}
                        className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                      >
                        <div className="relative aspect-[4/3] bg-gray-100">
                          {photo.previewUrl ? (
                            <img
                              src={photo.previewUrl}
                              alt={photo.caption || photo.file_name}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <div className="flex h-full flex-col items-center justify-center px-5 text-center text-gray-500">
                              <ImageIcon size={36} className="mb-2" />
                              Image preview unavailable
                              {photo.previewError && (
                                <p className="mt-2 text-xs">
                                  {photo.previewError}
                                </p>
                              )}
                            </div>
                          )}
                          <span
                            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                              photo.is_published
                                ? 'bg-green-600 text-white'
                                : 'bg-amber-400 text-gray-900'
                            }`}
                          >
                            {photo.is_published ? 'Published' : 'Pending review'}
                          </span>
                        </div>

                        <div className="space-y-4 p-4">
                          <div>
                            <h3 className="break-words font-semibold text-gray-900">
                              {photo.file_name}
                            </h3>
                            {photo.caption && (
                              <p className="mt-1 text-sm text-gray-600">
                                {photo.caption}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1 text-xs text-gray-500">
                            <p>
                              <strong>Day:</strong>{' '}
                              {EVENT_DAYS.find(
                                (day) => day.value === photo.event_day
                              )?.label || photo.event_day}
                            </p>
                            <p>
                              <strong>Category:</strong>{' '}
                              {CATEGORIES.find(
                                (item) => item.value === photo.category
                              )?.label || photo.category}
                            </p>
                            <p>
                              <strong>Uploaded:</strong>{' '}
                              {photo.created_at
                                ? new Date(photo.created_at).toLocaleString()
                                : 'Date unavailable'}
                            </p>
                            <p className="break-all">
                              <strong>Uploader ID:</strong>{' '}
                              {photo.uploaded_by || 'Unknown'}
                            </p>
                          </div>

                          {photo.previewUrl && (
                            <a
                              href={photo.previewUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 text-sm font-medium text-[#002B5C] underline"
                            >
                              <Eye size={16} />
                              View full image
                            </a>
                          )}

                          {editingPhotoId === photo.id ? (
                            <div className="space-y-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="font-semibold text-[#002B5C]">
                                  Edit Photo Details
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => setEditingPhotoId(null)}
                                  disabled={savingEdit}
                                  aria-label="Close editor"
                                  className="rounded p-1 text-gray-500 hover:bg-blue-100"
                                >
                                  <X size={18} />
                                </button>
                              </div>

                              <label className="block text-sm font-medium text-gray-700">
                                Convention day
                                <select
                                  value={editForm.event_day}
                                  onChange={(event) =>
                                    setEditForm((current) => ({
                                      ...current,
                                      event_day: event.target.value,
                                    }))
                                  }
                                  disabled={savingEdit}
                                  className={`${inputClass} mt-1`}
                                >
                                  {EVENT_DAYS.map((day) => (
                                    <option key={day.value} value={day.value}>
                                      {day.label}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <label className="block text-sm font-medium text-gray-700">
                                Category
                                <select
                                  value={editForm.category}
                                  onChange={(event) =>
                                    setEditForm((current) => ({
                                      ...current,
                                      category: event.target.value,
                                    }))
                                  }
                                  disabled={savingEdit}
                                  className={`${inputClass} mt-1`}
                                >
                                  {CATEGORIES.map((item) => (
                                    <option key={item.value} value={item.value}>
                                      {item.label}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <label className="block text-sm font-medium text-gray-700">
                                Caption
                                <textarea
                                  rows={3}
                                  value={editForm.caption}
                                  onChange={(event) =>
                                    setEditForm((current) => ({
                                      ...current,
                                      caption: event.target.value,
                                    }))
                                  }
                                  disabled={savingEdit}
                                  className={`${inputClass} mt-1`}
                                />
                              </label>

                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleSavePhotoDetails(photo)}
                                  disabled={savingEdit}
                                  className={`${buttonClass} flex-1`}
                                >
                                  {savingEdit ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingPhotoId(null)}
                                  disabled={savingEdit}
                                  className="rounded-lg border bg-white px-3 py-2 text-sm"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => startEditingPhoto(photo)}
                              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#002B5C] px-4 py-2.5 text-sm font-semibold text-[#002B5C] hover:bg-blue-50"
                            >
                              <Pencil size={16} />
                              Edit Details
                            </button>
                          )}

                          {!photo.is_published && (
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                type="button"
                                onClick={() => handleApprovePhoto(photo)}
                                disabled={
                                  processingPhotoId !== null || savingEdit
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-3 py-3 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                              >
                                <CheckCircle2 size={17} />
                                {processingPhotoId === photo.id
                                  ? 'Processing...'
                                  : 'Approve'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRejectPhoto(photo)}
                                disabled={
                                  processingPhotoId !== null || savingEdit
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                              >
                                <Trash2 size={17} />
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}
          </>
        )}

        {/* HOTEL AND ROOM MANAGEMENT */}
        {activeSection === 'hotels' && isSuperAdmin && (
          <section className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#002B5C]">
                Hotels & Rooms
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Add accommodation options and manage room pricing and availability.
                Publishing a hotel or room makes it eligible to appear on the public booking page.
              </p>
            </div>

            <Notice>{hotelNotice}</Notice>
            <Notice type="error">{hotelError}</Notice>

            <form
              onSubmit={handleSaveHotel}
              className="space-y-5 rounded-2xl border bg-white p-5 shadow-sm sm:p-8"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-[#002B5C]">
                  {editingHotelId ? 'Edit Hotel' : 'Add Hotel'}
                </h3>
                {editingHotelId && (
                  <button
                    type="button"
                    onClick={resetHotelForm}
                    className="text-sm text-gray-600 underline"
                  >
                    Cancel editing
                  </button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium">
                  Hotel name *
                  <input
                    required
                    value={hotelForm.name}
                    onChange={(event) =>
                      setHotelForm((current) => ({
                        ...current,
                        name: event.target.value,
                        slug: editingHotelId
                          ? current.slug
                          : makeSlug(event.target.value),
                      }))
                    }
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="text-sm font-medium">
                  URL slug
                  <input
                    value={hotelForm.slug}
                    onChange={(event) =>
                      setHotelForm((current) => ({
                        ...current,
                        slug: makeSlug(event.target.value),
                      }))
                    }
                    placeholder="hotel-name"
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="text-sm font-medium sm:col-span-2">
                  Address
                  <input
                    value={hotelForm.address}
                    onChange={(event) =>
                      setHotelForm((current) => ({
                        ...current,
                        address: event.target.value,
                      }))
                    }
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="text-sm font-medium">
                  Distance to convention venue (km)
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={hotelForm.distance_to_venue_km}
                    onChange={(event) =>
                      setHotelForm((current) => ({
                        ...current,
                        distance_to_venue_km: event.target.value,
                      }))
                    }
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="text-sm font-medium">
                  Contact phone
                  <input
                    value={hotelForm.contact_phone}
                    onChange={(event) =>
                      setHotelForm((current) => ({
                        ...current,
                        contact_phone: event.target.value,
                      }))
                    }
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="text-sm font-medium">
                  Contact email
                  <input
                    type="email"
                    value={hotelForm.contact_email}
                    onChange={(event) =>
                      setHotelForm((current) => ({
                        ...current,
                        contact_email: event.target.value,
                      }))
                    }
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="text-sm font-medium">
                  Latitude
                  <input
                    type="number"
                    step="any"
                    value={hotelForm.latitude}
                    onChange={(event) =>
                      setHotelForm((current) => ({
                        ...current,
                        latitude: event.target.value,
                      }))
                    }
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="text-sm font-medium">
                  Longitude
                  <input
                    type="number"
                    step="any"
                    value={hotelForm.longitude}
                    onChange={(event) =>
                      setHotelForm((current) => ({
                        ...current,
                        longitude: event.target.value,
                      }))
                    }
                    className={`${inputClass} mt-1`}
                  />
                </label>
              </div>

              <label className="block text-sm font-medium">
                Description
                <textarea
                  rows={3}
                  value={hotelForm.description}
                  onChange={(event) =>
                    setHotelForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  className={`${inputClass} mt-1`}
                />
              </label>

              <label className="block text-sm font-medium">
                Amenities (one per line)
                <textarea
                  rows={3}
                  value={hotelForm.amenities}
                  onChange={(event) =>
                    setHotelForm((current) => ({
                      ...current,
                      amenities: event.target.value,
                    }))
                  }
                  placeholder={'Wi-Fi\nAir conditioning\nRestaurant'}
                  className={`${inputClass} mt-1`}
                />
              </label>

              <label className="block text-sm font-medium">
                Photo URLs (one URL per line)
                <textarea
                  rows={3}
                  value={hotelForm.photo_urls}
                  onChange={(event) =>
                    setHotelForm((current) => ({
                      ...current,
                      photo_urls: event.target.value,
                    }))
                  }
                  placeholder="Paste publicly accessible image URLs here"
                  className={`${inputClass} mt-1`}
                />
              </label>

              <label className="flex items-center gap-3 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={hotelForm.is_published}
                  onChange={(event) =>
                    setHotelForm((current) => ({
                      ...current,
                      is_published: event.target.checked,
                    }))
                  }
                  className="h-4 w-4"
                />
                Publish hotel on the public booking page
              </label>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={savingHotel}
                  className={buttonClass}
                >
                  <Save size={17} />
                  {savingHotel
                    ? 'Saving...'
                    : editingHotelId
                      ? 'Save Hotel Changes'
                      : 'Create Hotel'}
                </button>
                {editingHotelId && (
                  <button
                    type="button"
                    onClick={resetHotelForm}
                    className="rounded-lg border border-gray-300 px-4 py-3 text-sm"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-8">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-[#002B5C]">
                  Hotel Listings
                </h3>
                <button
                  type="button"
                  onClick={loadHotels}
                  disabled={loadingHotels}
                  className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm disabled:opacity-50"
                >
                  <RefreshCw
                    size={16}
                    className={loadingHotels ? 'animate-spin' : ''}
                  />
                  Refresh
                </button>
              </div>

              {loadingHotels ? (
                <p className="py-6 text-sm text-gray-500">Loading hotels...</p>
              ) : hotels.length === 0 ? (
                <p className="py-6 text-sm text-gray-500">
                  No hotels have been added yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {hotels.map((hotel) => (
                    <article
                      key={hotel.id}
                      className="flex flex-wrap items-start justify-between gap-4 rounded-xl border p-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold">{hotel.name}</h4>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                              hotel.is_published
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {hotel.is_published ? 'Published' : 'Unpublished'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {hotel.address || 'No address provided'}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {rooms.filter((room) => room.hotel_id === hotel.id).length} room type(s)
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setRoomForm((current) => ({
                              ...current,
                              hotel_id: hotel.id,
                            }))
                            setRoomNotice('')
                            setRoomError('')
                          }}
                          className="rounded-lg border px-3 py-2 text-sm"
                        >
                          Add Room
                        </button>
                        <button
                          type="button"
                          onClick={() => startEditingHotel(hotel)}
                          className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteHotel(hotel)}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <Notice>{roomNotice}</Notice>
            <Notice type="error">{roomError}</Notice>

            <form
              onSubmit={handleSaveRoom}
              className="space-y-5 rounded-2xl border bg-white p-5 shadow-sm sm:p-8"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-bold text-[#002B5C]">
                  {editingRoomId ? 'Edit Room' : 'Add Room'}
                </h3>
                {editingRoomId && (
                  <button
                    type="button"
                    onClick={resetRoomForm}
                    className="text-sm text-gray-600 underline"
                  >
                    Cancel editing
                  </button>
                )}
              </div>

              <label className="block text-sm font-medium">
                Hotel *
                <select
                  required
                  value={roomForm.hotel_id}
                  onChange={(event) =>
                    setRoomForm((current) => ({
                      ...current,
                      hotel_id: event.target.value,
                    }))
                  }
                  className={`${inputClass} mt-1`}
                >
                  <option value="">Select a hotel</option>
                  {hotels.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium">
                  Room name *
                  <input
                    required
                    value={roomForm.room_name}
                    onChange={(event) =>
                      setRoomForm((current) => ({
                        ...current,
                        room_name: event.target.value,
                      }))
                    }
                    placeholder="Standard Room"
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="text-sm font-medium">
                  Price per night (₦) *
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={roomForm.price_per_night}
                    onChange={(event) =>
                      setRoomForm((current) => ({
                        ...current,
                        price_per_night: event.target.value,
                      }))
                    }
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="text-sm font-medium">
                  Maximum guests *
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={roomForm.max_guests}
                    onChange={(event) =>
                      setRoomForm((current) => ({
                        ...current,
                        max_guests: event.target.value,
                      }))
                    }
                    className={`${inputClass} mt-1`}
                  />
                </label>
                <label className="text-sm font-medium">
                  Total rooms *
                  <input
                    type="number"
                    min="0"
                    step="1"
                    required
                    value={roomForm.total_rooms}
                    onChange={(event) =>
                      setRoomForm((current) => ({
                        ...current,
                        total_rooms: event.target.value,
                      }))
                    }
                    className={`${inputClass} mt-1`}
                  />
                </label>
              </div>

              <label className="block text-sm font-medium">
                Room description
                <textarea
                  rows={3}
                  value={roomForm.description}
                  onChange={(event) =>
                    setRoomForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  className={`${inputClass} mt-1`}
                />
              </label>

              <label className="block text-sm font-medium">
                Amenities (one per line)
                <textarea
                  rows={3}
                  value={roomForm.amenities}
                  onChange={(event) =>
                    setRoomForm((current) => ({
                      ...current,
                      amenities: event.target.value,
                    }))
                  }
                  className={`${inputClass} mt-1`}
                />
              </label>

              <label className="block text-sm font-medium">
                Photo URLs (one URL per line)
                <textarea
                  rows={3}
                  value={roomForm.photo_urls}
                  onChange={(event) =>
                    setRoomForm((current) => ({
                      ...current,
                      photo_urls: event.target.value,
                    }))
                  }
                  className={`${inputClass} mt-1`}
                />
              </label>

              <label className="flex items-center gap-3 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={roomForm.is_available}
                  onChange={(event) =>
                    setRoomForm((current) => ({
                      ...current,
                      is_available: event.target.checked,
                    }))
                  }
                  className="h-4 w-4"
                />
                Room type is available for booking
              </label>

              <button
                type="submit"
                disabled={savingRoom || hotels.length === 0}
                className={buttonClass}
              >
                <Save size={17} />
                {savingRoom
                  ? 'Saving...'
                  : editingRoomId
                    ? 'Save Room Changes'
                    : 'Create Room'}
              </button>
            </form>

            <div className="rounded-2xl border bg-white p-5 shadow-sm sm:p-8">
              <h3 className="mb-5 text-lg font-bold text-[#002B5C]">
                Existing Rooms
              </h3>
              {rooms.length === 0 ? (
                <p className="text-sm text-gray-500">No rooms have been added.</p>
              ) : (
                <div className="space-y-3">
                  {rooms.map((room) => {
                    const parentHotel = hotels.find(
                      (hotel) => hotel.id === room.hotel_id
                    )
                    return (
                      <article
                        key={room.id}
                        className="flex flex-wrap items-start justify-between gap-4 rounded-xl border p-4"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold">{room.room_name}</h4>
                          <p className="text-sm text-gray-600">
                            {parentHotel?.name || 'Hotel'}
                          </p>
                          <p className="mt-1 text-sm font-medium text-[#002B5C]">
                            {formatMoney(room.price_per_night)} / night
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            Max guests: {room.max_guests} · Rooms: {room.total_rooms} ·{' '}
                            {room.is_available ? 'Available' : 'Unavailable'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEditingRoom(room)}
                            className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRoom(room)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-700"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </article>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* BANK SETTINGS */}
        {activeSection === 'bank' && isSuperAdmin && (
          <section className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center gap-3">
              <Landmark size={28} className="text-[#002B5C]" />
              <div>
                <h2 className="text-2xl font-bold text-[#002B5C]">
                  Hotel Payment Bank Settings
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  These details are intended for guests making bank transfers for hotel bookings.
                </p>
              </div>
            </div>

            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Only enter an official AMANO-approved account. Saving this form
              activates the details used by the booking system. Verify every
              digit before saving.
            </div>

            <Notice>{bankNotice}</Notice>
            <Notice type="error">{bankError}</Notice>

            {loadingBank ? (
              <div className="rounded-xl border bg-white p-8 text-center">
                <RefreshCw className="mx-auto mb-3 animate-spin" size={26} />
                Loading bank settings...
              </div>
            ) : (
              <form
                onSubmit={handleSaveBank}
                className="space-y-5 rounded-2xl border bg-white p-5 shadow-sm sm:p-8"
              >
                <label className="block text-sm font-medium">
                  Bank name *
                  <input
                    required
                    value={bankForm.bank_name}
                    onChange={(event) =>
                      setBankForm((current) => ({
                        ...current,
                        bank_name: event.target.value,
                      }))
                    }
                    placeholder="Enter official bank name"
                    className={`${inputClass} mt-1`}
                  />
                </label>

                <label className="block text-sm font-medium">
                  Account name *
                  <input
                    required
                    value={bankForm.account_name}
                    onChange={(event) =>
                      setBankForm((current) => ({
                        ...current,
                        account_name: event.target.value,
                      }))
                    }
                    placeholder="Enter account holder name"
                    className={`${inputClass} mt-1`}
                  />
                </label>

                <label className="block text-sm font-medium">
                  Account number *
                  <input
                    required
                    inputMode="numeric"
                    autoComplete="off"
                    value={bankForm.account_number}
                    onChange={(event) =>
                      setBankForm((current) => ({
                        ...current,
                        account_number: event.target.value,
                      }))
                    }
                    placeholder="Enter account number"
                    className={`${inputClass} mt-1`}
                  />
                </label>

                <label className="block text-sm font-medium">
                  Transfer instructions
                  <textarea
                    rows={4}
                    value={bankForm.transfer_instructions}
                    onChange={(event) =>
                      setBankForm((current) => ({
                        ...current,
                        transfer_instructions: event.target.value,
                      }))
                    }
                    placeholder="Explain how guests should submit transfer receipts and booking references."
                    className={`${inputClass} mt-1`}
                  />
                </label>

                <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-800">
                  {activeBankId
                    ? 'An active bank account is configured. Saving updates these details in place.'
                    : 'No active bank account is configured yet.'}
                </div>

                <button
                  type="submit"
                  disabled={savingBank}
                  className={`${buttonClass} w-full`}
                >
                  <Save size={18} />
                  {savingBank
                    ? 'Saving bank settings...'
                    : 'Save and Activate Bank Details'}
                </button>
              </form>
            )}
          </section>
        )}

        {/* HOTEL BOOKINGS */}
        {activeSection === 'bookings' && isSuperAdmin && (
          <section>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#002B5C]">
                  Hotel Bookings
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Review submitted hotel reservations and their payment status.
                </p>
              </div>
              <button
                type="button"
                onClick={loadBookings}
                disabled={loadingBookings}
                className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-3 text-sm font-semibold disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={loadingBookings ? 'animate-spin' : ''}
                />
                Refresh Bookings
              </button>
            </div>

            <Notice>{bookingNotice}</Notice>
            <Notice type="error">{bookingError}</Notice>

            {loadingBookings ? (
              <div className="rounded-xl border bg-white p-10 text-center">
                <RefreshCw
                  size={28}
                  className="mx-auto mb-3 animate-spin text-[#002B5C]"
                />
                Loading hotel bookings...
              </div>
            ) : bookings.length === 0 ? (
              <div className="rounded-xl border border-dashed bg-white p-10 text-center">
                <CalendarDays
                  size={34}
                  className="mx-auto mb-3 text-gray-400"
                />
                <h3 className="font-semibold text-gray-800">
                  No hotel bookings found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  New reservations will appear here once submitted.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  const hotel = hotels.find(
                    (item) => item.id === booking.hotel_id
                  )
                  const room = rooms.find(
                    (item) => item.id === booking.room_id
                  )

                  return (
                    <article
                      key={booking.id}
                      className="rounded-xl border bg-white p-5 shadow-sm"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Booking reference
                          </p>
                          <h3 className="mt-1 break-all text-lg font-bold text-[#002B5C]">
                            {booking.booking_reference}
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                            Booking: {booking.booking_status || 'pending'}
                          </span>
                          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                            Payment: {booking.payment_status || 'pending'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                        <div>
                          <p className="text-gray-500">Guest</p>
                          <p className="font-semibold">{booking.guest_name}</p>
                          <p className="break-all text-gray-600">{booking.guest_email}</p>
                          <p className="text-gray-600">{booking.guest_phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Accommodation</p>
                          <p className="font-semibold">
                            {hotel?.name || 'Hotel record'}
                          </p>
                          <p className="text-gray-600">
                            {room?.room_name || 'Room record'}
                          </p>
                          <p className="text-gray-600">
                            {booking.room_count} room(s), {booking.guest_count} guest(s)
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Stay</p>
                          <p>
                            {formatDate(booking.check_in)} – {formatDate(booking.check_out)}
                          </p>
                          <p className="text-gray-600">
                            {booking.number_of_nights} night(s)
                          </p>
                          <p className="mt-1 font-bold text-[#002B5C]">
                            {formatMoney(booking.total_amount)}
                          </p>
                        </div>
                      </div>

                      <p className="mt-4 text-xs text-gray-500">
                        Submitted: {formatDate(booking.created_at)}
                      </p>

                      <div className="mt-5 border-t pt-4">
                        <h4 className="mb-3 flex items-center gap-2 font-semibold text-[#002B5C]">
                          <FileText size={18} />
                          Payment receipt
                        </h4>
                        {(() => {
                          const receipt = bookingReceipts.find(
                            (item) => item.booking_id === booking.id
                          )

                          if (!receipt) {
                            return (
                              <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                                {loadingReceipts
                                  ? 'Checking for uploaded receipt...'
                                  : 'No payment receipt has been uploaded for this booking.'}
                              </p>
                            )
                          }

                          return (
                            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3">
                              <div className="min-w-0">
                                <p className="break-all text-sm font-medium text-gray-800">
                                  {receipt.original_filename || 'Payment receipt'}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                  Uploaded: {formatDate(receipt.uploaded_at)}
                                  {receipt.file_size_bytes
                                    ? ` · ${(receipt.file_size_bytes / (1024 * 1024)).toFixed(2)} MB`
                                    : ''}
                                </p>
                                {receipt.previewError && (
                                  <p className="mt-1 text-xs text-red-600">
                                    Preview unavailable: {receipt.previewError}
                                  </p>
                                )}
                              </div>
                              {receipt.previewUrl ? (
                                <a
                                  href={receipt.previewUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-2 rounded-lg border border-[#002B5C] px-3 py-2 text-sm font-semibold text-[#002B5C] hover:bg-blue-50"
                                >
                                  <ExternalLink size={15} />
                                  View receipt
                                </a>
                              ) : (
                                <span className="text-xs text-gray-500">
                                  Receipt link unavailable
                                </span>
                              )}
                            </div>
                          )
                        })()}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {booking.payment_status !== 'verified' &&
                          booking.payment_status !== 'rejected' && (
                            <button
                              type="button"
                              onClick={() => reviewHotelBooking(booking, 'verify_payment')}
                              disabled={processingBookingId !== null}
                              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                            >
                              <CheckCircle2 size={16} />
                              {processingBookingId === booking.id
                                ? 'Processing...'
                                : 'Verify Payment'}
                            </button>
                          )}

                        {booking.payment_status !== 'verified' &&
                          booking.payment_status !== 'rejected' && (
                            <button
                              type="button"
                              onClick={() => reviewHotelBooking(booking, 'reject_payment')}
                              disabled={processingBookingId !== null}
                              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                            >
                              Reject Receipt
                            </button>
                          )}

                        {booking.payment_status === 'verified' &&
                          booking.booking_status !== 'confirmed' &&
                          booking.booking_status !== 'rejected' && (
                            <button
                              type="button"
                              onClick={() => reviewHotelBooking(booking, 'confirm_booking')}
                              disabled={processingBookingId !== null}
                              className="inline-flex items-center gap-2 rounded-lg bg-[#002B5C] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#003B7A] disabled:opacity-50"
                            >
                              <CheckCircle2 size={16} />
                              {processingBookingId === booking.id
                                ? 'Processing...'
                                : 'Confirm Booking'}
                            </button>
                          )}

                        {booking.booking_status !== 'confirmed' &&
                          booking.booking_status !== 'rejected' && (
                            <button
                              type="button"
                              onClick={() => reviewHotelBooking(booking, 'reject_booking')}
                              disabled={processingBookingId !== null}
                              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                            >
                              Reject Booking
                            </button>
                          )}

                        <button
                          type="button"
                          onClick={() => handleDeleteHotelBooking(booking)}
                          disabled={processingBookingId !== null}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                          {processingBookingId === booking.id
                            ? 'Processing...'
                            : 'Delete Booking'}
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}

           
<div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
  <div className="font-semibold">Important: Verify Payments Carefully</div>
  <p className="mt-1">
    A receipt is not proof that payment has been received.
    Confirm the transaction against the bank account statement
    before verifying payment.
  </p>
</div>

          </section>
        )}
      </div>
    </section>
  )
}
