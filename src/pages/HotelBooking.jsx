
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CalendarDays,
  MapPin,
  Users,
  BedDouble,
  Wifi,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  ArrowRight,
  Building2,
  RefreshCw,
  Upload,
  FileCheck2,
  Landmark,
  Copy,
} from 'lucide-react'
import { supabase } from '../lib/supabase'

const RECEIPT_BUCKET = 'amano-hotel-receipts'
const MAX_RECEIPT_SIZE = 10 * 1024 * 1024

const ALLOWED_RECEIPT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]

function getLocalDate() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0

  const start = new Date(`${checkIn}T00:00:00`)
  const end = new Date(`${checkOut}T00:00:00`)

  return Math.round((end - start) / (1000 * 60 * 60 * 24))
}

function formatMoney(amount) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 2,
  }).format(Number(amount) || 0)
}

function formatFileSize(bytes) {
  if (!bytes) return '0 B'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function getFirstValue(record, keys) {
  if (!record) return ''

  for (const key of keys) {
    const value = record[key]

    if (value !== null && value !== undefined && String(value).trim()) {
      return value
    }
  }

  return ''
}

function getBookingId(result) {
  return (
    result?.booking_id ||
    result?.booking?.id ||
    result?.booking?.booking_id ||
    result?.id ||
    ''
  )
}

function getBookingReference(result) {
  return (
    result?.booking_reference ||
    result?.booking?.booking_reference ||
    ''
  )
}

function getBookingTotal(result) {
  return result?.total_amount ?? result?.booking?.total_amount ?? null
}

async function getFunctionErrorMessage(error, fallback) {
  let message = error?.message || fallback

  if (typeof error?.context?.json === 'function') {
    try {
      const details = await error.context.json()
      message =
        details?.error ||
        details?.message ||
        details?.details ||
        message
    } catch {
      // Keep the original error message.
    }
  }

  return message
}

function Photo({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 text-slate-400 ${className}`}
      >
        <Building2 size={36} />
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  )
}

export default function HotelBooking() {
  const [hotels, setHotels] = useState([])
  const [rooms, setRooms] = useState([])
  const [bankSettings, setBankSettings] = useState(null)

  const [loadingHotels, setLoadingHotels] = useState(true)
  const [loadingRooms, setLoadingRooms] = useState(false)
  const [loadingBankSettings, setLoadingBankSettings] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [uploadingReceipt, setUploadingReceipt] = useState(false)

  const [pageError, setPageError] = useState('')
  const [bookingError, setBookingError] = useState('')
  const [receiptError, setReceiptError] = useState('')
  const [receiptSuccess, setReceiptSuccess] = useState('')
  const [bookingResult, setBookingResult] = useState(null)
  const [receiptFile, setReceiptFile] = useState(null)

  const [form, setForm] = useState({
    hotel_id: '',
    room_id: '',
    check_in: '2026-11-12',
    check_out: '2026-11-14',
    guest_count: '2',
    room_count: '1',
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    guest_notes: '',
  })

  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === form.room_id),
    [rooms, form.room_id]
  )

  const nights = calculateNights(form.check_in, form.check_out)

  const estimatedTotal =
    selectedRoom && nights > 0
      ? Number(selectedRoom.price_per_night) *
        nights *
        Number(form.room_count)
      : 0

  const loadHotels = useCallback(async () => {
    setLoadingHotels(true)
    setPageError('')

    try {
      const { data, error } = await supabase
        .from('hotel_listings')
        .select(
          'id, name, slug, description, address, distance_to_venue_km, amenities, photo_urls'
        )
        .eq('is_published', true)
        .order('name', { ascending: true })

      if (error) throw error

      setHotels(data || [])
    } catch (error) {
      console.error('Hotel listings load error:', error)
      setPageError('We could not load hotels right now. Please try again.')
      setHotels([])
    } finally {
      setLoadingHotels(false)
    }
  }, [])

  const loadRooms = useCallback(async (hotelId) => {
    if (!hotelId) {
      setRooms([])
      setLoadingRooms(false)
      return
    }

    setLoadingRooms(true)
    setBookingError('')

    try {
      const { data, error } = await supabase
        .from('hotel_rooms')
        .select(
          'id, hotel_id, room_name, description, price_per_night, max_guests, total_rooms, amenities, photo_urls'
        )
        .eq('hotel_id', hotelId)
        .eq('is_available', true)
        .order('price_per_night', { ascending: true })

      if (error) throw error

      setRooms(data || [])
    } catch (error) {
      console.error('Hotel rooms load error:', error)
      setRooms([])
      setBookingError('We could not load rooms for this hotel. Please retry.')
    } finally {
      setLoadingRooms(false)
    }
  }, [])

  const loadBankSettings = useCallback(async () => {
    setLoadingBankSettings(true)

    try {
      const { data, error } = await supabase
        .from('hotel_bank_settings')
        .select('*')
        .limit(20)

      if (error) throw error

      const rows = data || []

      const activeSetting = rows.find((row) => {
        const activeValue = getFirstValue(row, [
          'is_active',
          'is_enabled',
          'active',
          'enabled',
        ])

        if (activeValue === '') return false

        return (
          activeValue === true ||
          activeValue === 1 ||
          String(activeValue).toLowerCase() === 'true'
        )
      })

      const hasActiveFlag = rows.some((row) =>
        ['is_active', 'is_enabled', 'active', 'enabled'].some((key) =>
          Object.prototype.hasOwnProperty.call(row, key)
        )
      )

      setBankSettings(
        activeSetting || (!hasActiveFlag ? rows[0] || null : null)
      )
    } catch (error) {
      console.error('Hotel bank settings load error:', error)
      setBankSettings(null)
    } finally {
      setLoadingBankSettings(false)
    }
  }, [])

  useEffect(() => {
    loadHotels()
    loadBankSettings()
  }, [loadHotels, loadBankSettings])

  useEffect(() => {
    loadRooms(form.hotel_id)
  }, [form.hotel_id, loadRooms])

  useEffect(() => {
    if (form.room_id && !rooms.some((room) => room.id === form.room_id)) {
      setForm((current) => ({ ...current, room_id: '' }))
    }
  }, [rooms, form.room_id])

  const updateForm = (event) => {
    const { name, value } = event.target

    setForm((current) => {
      const next = { ...current, [name]: value }

      if (name === 'hotel_id') {
        next.room_id = ''
      }

      if (name === 'room_id') {
        next.room_count = '1'
      }

      return next
    })

    setBookingError('')
    setBookingResult(null)
    setReceiptFile(null)
    setReceiptError('')
    setReceiptSuccess('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setBookingError('')
    setBookingResult(null)
    setReceiptFile(null)
    setReceiptError('')
    setReceiptSuccess('')

    const today = getLocalDate()
    const roomCount = Number(form.room_count)
    const guestCount = Number(form.guest_count)

    if (!form.hotel_id || !form.room_id) {
      setBookingError('Please select a hotel and room type.')
      return
    }

    if (!form.check_in || !form.check_out) {
      setBookingError('Please select your check-in and check-out dates.')
      return
    }

    if (form.check_in < today) {
      setBookingError('Check-in cannot be in the past.')
      return
    }

    if (calculateNights(form.check_in, form.check_out) < 1) {
      setBookingError('Check-out must be at least one day after check-in.')
      return
    }

    if (!selectedRoom) {
      setBookingError('Please select an available room type.')
      return
    }

    if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 50) {
      setBookingError('Please enter a valid number of guests.')
      return
    }

    if (
      !Number.isInteger(roomCount) ||
      roomCount < 1 ||
      roomCount > Number(selectedRoom.total_rooms)
    ) {
      setBookingError(
        `Please choose between 1 and ${selectedRoom.total_rooms} rooms.`
      )
      return
    }

    if (guestCount > Number(selectedRoom.max_guests) * roomCount) {
      setBookingError(
        `This selection accommodates up to ${
          Number(selectedRoom.max_guests) * roomCount
        } guests. Increase the room quantity or select another room type.`
      )
      return
    }

    if (form.guest_name.trim().length < 2) {
      setBookingError('Please enter the guest’s full name.')
      return
    }

    if (!form.guest_email.trim() || !form.guest_phone.trim()) {
      setBookingError('Please provide your email address and phone number.')
      return
    }

    setSubmitting(true)

    try {
      const { data, error } = await supabase.functions.invoke(
        'create-hotel-booking',
        {
          body: {
            hotel_id: form.hotel_id,
            room_id: form.room_id,
            check_in: form.check_in,
            check_out: form.check_out,
            guest_count: guestCount,
            room_count: roomCount,
            guest_name: form.guest_name.trim(),
            guest_email: form.guest_email.trim(),
            guest_phone: form.guest_phone.trim(),
            guest_notes: form.guest_notes.trim(),
          },
        }
      )

      if (error) {
        throw new Error(
          await getFunctionErrorMessage(error, 'Booking submission failed.')
        )
      }

      if (!data || data.success === false) {
        throw new Error(
          data?.error || data?.message || 'Booking could not be completed.'
        )
      }

      setBookingResult(data)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      console.error('Hotel booking submission error:', error)

      setBookingError(
        error.message ||
          'Something went wrong while submitting your booking. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleReceiptSelection = (event) => {
    const file = event.target.files?.[0] || null

    setReceiptError('')
    setReceiptSuccess('')
    setReceiptFile(null)

    if (!file) return

    if (!ALLOWED_RECEIPT_TYPES.includes(file.type)) {
      setReceiptError(
        'Unsupported file type. Upload a JPG, PNG, WebP image, or PDF.'
      )
      event.target.value = ''
      return
    }

    if (file.size <= 0 || file.size > MAX_RECEIPT_SIZE) {
      setReceiptError('The receipt must be larger than 0 bytes and not exceed 10 MB.')
      event.target.value = ''
      return
    }

    setReceiptFile(file)
  }

  // Secure guest receipt flow:
  // 1. Request a signed upload URL from the Edge Function.
  // 2. Upload using the signed URL.
  // 3. Ask the Edge Function to verify the object and record its metadata.
  // The browser never inserts directly into hotel_payment_receipts.
  const handleReceiptUpload = async (event) => {
    event.preventDefault()
    setReceiptError('')
    setReceiptSuccess('')

    if (!bookingResult) {
      setReceiptError('Submit your booking before uploading a receipt.')
      return
    }

    const bookingId = getBookingId(bookingResult)
    const bookingReference = getBookingReference(bookingResult)
    const bookingEmail =
      form.guest_email.trim() ||
      bookingResult?.guest_email ||
      bookingResult?.booking?.guest_email ||
      ''

    if (!bookingId && !bookingReference) {
      setReceiptError(
        'We could not identify your booking. Keep your booking details and contact the organisers.'
      )
      return
    }

    if (!bookingEmail) {
      setReceiptError(
        'The booking email could not be found. Please contact the organisers for assistance.'
      )
      return
    }

    if (!receiptFile) {
      setReceiptError('Please select your payment receipt first.')
      return
    }

    if (!ALLOWED_RECEIPT_TYPES.includes(receiptFile.type)) {
      setReceiptError(
        'Unsupported file type. Upload a JPG, PNG, WebP image, or PDF.'
      )
      return
    }

    if (receiptFile.size <= 0 || receiptFile.size > MAX_RECEIPT_SIZE) {
      setReceiptError('The receipt must be larger than 0 bytes and not exceed 10 MB.')
      return
    }

    setUploadingReceipt(true)

    let uploadedStoragePath = ''
    let fileUploaded = false

    try {
      // STEP 1: The server validates the booking and generates a signed URL.
      const { data: uploadDetails, error: prepareError } =
        await supabase.functions.invoke('create-hotel-booking', {
          body: {
            action: 'prepare_receipt_upload',
            booking_id: bookingId || undefined,
            booking_reference: bookingReference || undefined,
            guest_email: bookingEmail,
            original_filename: receiptFile.name,
            content_type: receiptFile.type,
            file_size_bytes: receiptFile.size,
          },
        })

      if (prepareError) {
        throw new Error(
          await getFunctionErrorMessage(
            prepareError,
            'Could not prepare the receipt upload.'
          )
        )
      }

      if (!uploadDetails || uploadDetails.success === false) {
        throw new Error(
          uploadDetails?.error ||
            uploadDetails?.message ||
            'The server could not prepare your receipt upload.'
        )
      }

      const storagePath = uploadDetails.storage_path
      const uploadToken = uploadDetails.token
      const resolvedBookingId = uploadDetails.booking_id || bookingId

      if (!storagePath || !uploadToken || !resolvedBookingId) {
        throw new Error(
          'The server returned incomplete upload details. Please check the create-hotel-booking Edge Function.'
        )
      }

      uploadedStoragePath = storagePath

      // STEP 2: Upload to the private bucket using the signed upload token.
      // This does not require a public Storage upload policy.
      const { error: storageError } = await supabase.storage
        .from(RECEIPT_BUCKET)
        .uploadToSignedUrl(storagePath, uploadToken, receiptFile, {
          contentType: receiptFile.type,
          upsert: false,
        })

      if (storageError) {
        throw new Error(
          `Receipt file upload failed: ${storageError.message}`
        )
      }

      fileUploaded = true

      // STEP 3: Server verifies the object and inserts receipt metadata
      // using its service-role client. Never insert this table from the browser.
      const { data: recordResult, error: recordError } =
        await supabase.functions.invoke('create-hotel-booking', {
          body: {
            action: 'record_receipt_upload',
            booking_id: resolvedBookingId,
            booking_reference: bookingReference || undefined,
            guest_email: bookingEmail,
            storage_path: storagePath,
            original_filename: receiptFile.name,
            content_type: receiptFile.type,
            file_size_bytes: receiptFile.size,
          },
        })

      if (recordError) {
        throw new Error(
          await getFunctionErrorMessage(
            recordError,
            'The file uploaded, but its receipt record could not be saved.'
          )
        )
      }

      if (!recordResult || recordResult.success === false) {
        throw new Error(
          recordResult?.error ||
            recordResult?.message ||
            'The file uploaded, but the receipt record could not be confirmed.'
        )
      }

      setReceiptSuccess(
        'Your receipt was uploaded successfully and submitted for administrator review. Your booking is not confirmed until payment is verified.'
      )

      setReceiptFile(null)

      const input = document.getElementById('payment-receipt')
      if (input) input.value = ''
    } catch (error) {
      console.error('Hotel payment receipt upload error:', error)

      if (fileUploaded) {
        setReceiptError(
          `${error.message || 'The receipt record could not be confirmed.'} The file may already be stored. Please contact the organisers before retrying to avoid duplicate uploads.`
        )
      } else {
        setReceiptError(
          error.message ||
            'We could not upload your receipt. Please try again.'
        )
      }
    } finally {
      setUploadingReceipt(false)
    }
  }

  const bankName = getFirstValue(bankSettings, [
    'bank_name',
    'bank',
    'name_of_bank',
  ])

  const accountName = getFirstValue(bankSettings, [
    'account_name',
    'account_holder',
    'beneficiary_name',
    'account_holder_name',
  ])

  const accountNumber = getFirstValue(bankSettings, [
    'account_number',
    'account_no',
    'bank_account_number',
  ])

  const bankCode = getFirstValue(bankSettings, [
    'bank_code',
    'sort_code',
  ])

  const paymentInstructions = getFirstValue(bankSettings, [
    'instructions',
    'payment_instructions',
    'transfer_instructions',
    'notes',
  ])

  const bookingReference = bookingResult
    ? getBookingReference(bookingResult) || 'Submitted successfully'
    : ''

  const bookingTotal = bookingResult
    ? getBookingTotal(bookingResult)
    : null

  const copyText = async (value) => {
    try {
      await navigator.clipboard.writeText(String(value))
    } catch (error) {
      console.error('Clipboard copy failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <section className="bg-[#002B5C] px-5 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-amber-300">
            AMANO National Convention 2026
          </p>

          <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
            Find your stay. Enjoy the convention.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
            Explore accommodation options around Eko Hotel and Oriental Hotels
            in Lagos, and submit your room booking request.
          </p>

          <div className="mt-7 flex flex-wrap gap-4 text-sm text-blue-100">
            <span className="flex items-center gap-2">
              <CalendarDays size={18} />
              12–14 November 2026
            </span>
            <span className="flex items-center gap-2">
              <MapPin size={18} />
              Lagos, Nigeria
            </span>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-14">
        {bookingResult && (
          <section
            aria-live="polite"
            className="mb-8 rounded-2xl border border-green-200 bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="flex items-start gap-4">
              <CheckCircle2
                className="mt-1 shrink-0 text-green-600"
                size={30}
              />

              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-slate-900">
                  Booking request received
                </h2>

                <p className="mt-2 leading-7 text-slate-600">
                  Your booking request has been submitted. Keep your booking
                  reference for future enquiries. Your accommodation is not
                  confirmed until payment has been verified and an administrator
                  confirms the booking.
                </p>

                <div className="mt-5 rounded-xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Booking reference</p>

                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <p className="break-all text-xl font-bold tracking-wide text-[#002B5C]">
                      {bookingReference}
                    </p>

                    <button
                      type="button"
                      onClick={() => copyText(bookingReference)}
                      className="rounded-md p-2 text-slate-500 hover:bg-slate-200"
                      aria-label="Copy booking reference"
                      title="Copy booking reference"
                    >
                      <Copy size={16} />
                    </button>
                  </div>

                  {bookingTotal != null && (
                    <p className="mt-3 text-sm text-slate-600">
                      Booking total: <strong>{formatMoney(bookingTotal)}</strong>
                    </p>
                  )}
                </div>

                <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-5">
                  <div className="flex items-start gap-3">
                    <Landmark
                      size={24}
                      className="mt-0.5 shrink-0 text-[#002B5C]"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-[#002B5C]">
                        Official bank transfer details
                      </h3>

                      {loadingBankSettings ? (
                        <p className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                          <LoaderCircle className="animate-spin" size={17} />
                          Loading payment instructions...
                        </p>
                      ) : bankSettings && (bankName || accountName || accountNumber) ? (
                        <div className="mt-4 space-y-3">
                          {bankName && (
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Bank
                              </p>
                              <p className="mt-1 font-semibold text-slate-900">
                                {bankName}
                              </p>
                            </div>
                          )}

                          {accountName && (
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Account name
                              </p>
                              <p className="mt-1 font-semibold text-slate-900">
                                {accountName}
                              </p>
                            </div>
                          )}

                          {accountNumber && (
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Account number
                              </p>

                              <div className="mt-1 flex flex-wrap items-center gap-2">
                                <p className="break-all font-bold tracking-wide text-slate-900">
                                  {accountNumber}
                                </p>

                                <button
                                  type="button"
                                  onClick={() => copyText(accountNumber)}
                                  className="rounded-md p-2 text-slate-500 hover:bg-blue-100"
                                  aria-label="Copy account number"
                                  title="Copy account number"
                                >
                                  <Copy size={16} />
                                </button>
                              </div>
                            </div>
                          )}

                          {bankCode && (
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Bank code / sort code
                              </p>
                              <p className="mt-1 font-semibold text-slate-900">
                                {bankCode}
                              </p>
                            </div>
                          )}

                          {paymentInstructions && (
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                Payment instructions
                              </p>
                              <p className="mt-1 whitespace-pre-line text-sm leading-6 text-slate-700">
                                {paymentInstructions}
                              </p>
                            </div>
                          )}

                          {bookingTotal != null && (
                            <div className="rounded-lg border border-blue-200 bg-white p-4">
                              <p className="text-sm text-slate-500">
                                Amount shown for this booking
                              </p>
                              <p className="mt-1 text-2xl font-bold text-[#002B5C]">
                                {formatMoney(bookingTotal)}
                              </p>
                            </div>
                          )}

                          <p className="text-xs leading-5 text-slate-600">
                            Use your booking reference as the transfer
                            narration where possible. Transfer only to the
                            official account details shown here.
                          </p>
                        </div>
                      ) : (
                        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
                          <p className="text-sm leading-6 text-amber-900">
                            Official bank details are not currently available.
                            Please contact the convention organisers before
                            transferring any money.
                          </p>

                          <button
                            type="button"
                            onClick={loadBankSettings}
                            className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#002B5C]"
                          >
                            <RefreshCw size={15} />
                            Reload bank details
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-slate-200 p-5">
                  <div className="flex items-start gap-3">
                    <Upload
                      size={23}
                      className="mt-0.5 shrink-0 text-[#008BE0]"
                    />

                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-[#002B5C]">
                        Upload payment receipt
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        After completing your bank transfer, upload the
                        transfer receipt below. Accepted formats are JPG,
                        PNG, WebP and PDF, up to 10 MB.
                      </p>

                      <form
                        onSubmit={handleReceiptUpload}
                        className="mt-4 space-y-4"
                      >
                        <div>
                          <label
                            htmlFor="payment-receipt"
                            className="mb-2 block text-sm font-semibold text-slate-700"
                          >
                            Payment receipt file
                          </label>

                          <input
                            id="payment-receipt"
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
                            onChange={handleReceiptSelection}
                            disabled={uploadingReceipt || Boolean(receiptSuccess)}
                            className="block w-full rounded-lg border border-slate-300 bg-white p-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:font-semibold file:text-[#002B5C] hover:file:bg-blue-100 disabled:opacity-60"
                          />

                          {receiptFile && (
                            <div className="mt-3 flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                              <FileCheck2
                                size={22}
                                className="shrink-0 text-green-600"
                              />

                              <div className="min-w-0 flex-1">
                                <p className="break-all text-sm font-semibold text-slate-800">
                                  {receiptFile.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {formatFileSize(receiptFile.size)}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setReceiptFile(null)
                                  const input = document.getElementById(
                                    'payment-receipt'
                                  )
                                  if (input) input.value = ''
                                }}
                                disabled={uploadingReceipt}
                                className="text-sm font-semibold text-red-600 disabled:opacity-50"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>

                        {receiptError && (
                          <div
                            role="alert"
                            className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                          >
                            <AlertCircle size={18} className="mt-0.5 shrink-0" />
                            <span>{receiptError}</span>
                          </div>
                        )}

                        {receiptSuccess && (
                          <div
                            role="status"
                            className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm leading-6 text-green-800"
                          >
                            <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                            <span>{receiptSuccess}</span>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={
                            uploadingReceipt ||
                            !receiptFile ||
                            Boolean(receiptSuccess)
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#008BE0] px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {uploadingReceipt ? (
                            <>
                              <LoaderCircle className="animate-spin" size={19} />
                              Uploading receipt...
                            </>
                          ) : receiptSuccess ? (
                            <>
                              <CheckCircle2 size={19} />
                              Receipt submitted
                            </>
                          ) : (
                            <>
                              <Upload size={19} />
                              Upload payment receipt
                            </>
                          )}
                        </button>

                        <p className="text-xs leading-5 text-slate-500">
                          Your receipt is submitted for administrator review.
                          Uploading a receipt does not itself verify payment
                          or confirm your accommodation.
                        </p>
                      </form>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setBookingResult(null)
                    setReceiptFile(null)
                    setReceiptError('')
                    setReceiptSuccess('')
                    setForm((current) => ({
                      ...current,
                      guest_name: '',
                      guest_email: '',
                      guest_phone: '',
                      guest_notes: '',
                    }))
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#002B5C] px-5 py-3 font-semibold text-white transition hover:bg-blue-900"
                >
                  Make another booking
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </section>
        )}

        {pageError && (
          <div
            role="alert"
            className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <span>{pageError}</span>
            <button
              type="button"
              onClick={loadHotels}
              className="inline-flex shrink-0 items-center gap-2 font-semibold"
            >
              <RefreshCw size={15} />
              Retry
            </button>
          </div>
        )}

        <div className="grid items-start gap-10 lg:grid-cols-[1fr_0.9fr]">
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#002B5C] sm:text-3xl">
                Available accommodation
              </h2>
              <p className="mt-2 text-slate-600">
                Choose a hotel to see its available room options.
              </p>
            </div>

            {loadingHotels ? (
              <div className="flex items-center gap-3 rounded-xl bg-white p-8 text-slate-500 shadow-sm">
                <LoaderCircle className="animate-spin" size={22} />
                Loading accommodation...
              </div>
            ) : hotels.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-7">
                <Building2 size={32} className="text-slate-400" />
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Accommodation listings are being prepared
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  No published hotels are available yet. Please check back
                  later or contact the convention organisers for assistance.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {hotels.map((hotel) => {
                  const selected = form.hotel_id === hotel.id
                  const coverPhoto = hotel.photo_urls?.[0]

                  return (
                    <article
                      key={hotel.id}
                      className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition ${
                        selected
                          ? 'border-[#008BE0] ring-2 ring-blue-100'
                          : 'border-slate-200'
                      }`}
                    >
                      <Photo
                        src={coverPhoto}
                        alt={hotel.name}
                        className="h-52 w-full sm:h-64"
                      />

                      <div className="p-5 sm:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-xl font-bold text-[#002B5C]">
                              {hotel.name}
                            </h3>

                            <p className="mt-2 flex items-start gap-2 text-sm text-slate-500">
                              <MapPin size={17} className="mt-0.5 shrink-0" />
                              <span>{hotel.address}</span>
                            </p>

                            {hotel.distance_to_venue_km != null && (
                              <p className="mt-2 text-sm text-slate-500">
                                {hotel.distance_to_venue_km} km from the
                                designated convention area
                              </p>
                            )}
                          </div>

                          {selected && (
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                              Selected
                            </span>
                          )}
                        </div>

                        {hotel.description && (
                          <p className="mt-4 text-sm leading-6 text-slate-600">
                            {hotel.description}
                          </p>
                        )}

                        {hotel.amenities?.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {hotel.amenities.map((amenity) => (
                              <span
                                key={amenity}
                                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setForm((current) => ({
                              ...current,
                              hotel_id: hotel.id,
                              room_id: '',
                            }))
                            setBookingError('')
                            setBookingResult(null)
                            setReceiptFile(null)
                            setReceiptError('')
                            setReceiptSuccess('')
                          }}
                          className={`mt-5 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition ${
                            selected
                              ? 'bg-blue-50 text-[#002B5C]'
                              : 'bg-[#002B5C] text-white hover:bg-blue-900'
                          }`}
                        >
                          {selected ? 'Hotel selected' : 'View room options'}
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>

          <section
            id="booking-form"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
          >
            <h2 className="text-2xl font-bold text-[#002B5C]">
              Request a booking
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Enter your stay details and contact information. Your booking
              remains pending until payment is verified and the booking is
              confirmed by the administrator.
            </p>

            {bookingError && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                <AlertCircle size={19} className="mt-0.5 shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="hotel_id"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Selected hotel
                </label>
                <select
                  id="hotel_id"
                  name="hotel_id"
                  value={form.hotel_id}
                  onChange={updateForm}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 outline-none focus:border-[#008BE0] focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Choose a hotel</option>
                  {hotels.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.name}
                    </option>
                  ))}
                </select>
              </div>

              {form.hotel_id && (
                <div>
                  <label
                    htmlFor="room_id"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Room type
                  </label>

                  {loadingRooms ? (
                    <div className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
                      <LoaderCircle className="animate-spin" size={18} />
                      Loading room options...
                    </div>
                  ) : rooms.length === 0 ? (
                    <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                      No room options are currently listed for this hotel.
                    </p>
                  ) : (
                    <select
                      id="room_id"
                      name="room_id"
                      value={form.room_id}
                      onChange={updateForm}
                      required
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-3 outline-none focus:border-[#008BE0] focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="">Choose a room type</option>
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.room_name} — {formatMoney(room.price_per_night)} / night
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {selectedRoom && (
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  {selectedRoom.photo_urls?.[0] && (
                    <Photo
                      src={selectedRoom.photo_urls[0]}
                      alt={selectedRoom.room_name}
                      className="h-36 w-full"
                    />
                  )}

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          {selectedRoom.room_name}
                        </h3>
                        {selectedRoom.description && (
                          <p className="mt-1 text-sm leading-5 text-slate-600">
                            {selectedRoom.description}
                          </p>
                        )}
                      </div>

                      <BedDouble
                        size={22}
                        className="shrink-0 text-[#008BE0]"
                      />
                    </div>

                    <p className="mt-3 font-bold text-[#002B5C]">
                      {formatMoney(selectedRoom.price_per_night)}
                      <span className="font-normal text-slate-500"> / night</span>
                    </p>

                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                      <Users size={16} />
                      Up to {selectedRoom.max_guests} guest(s) per room
                    </p>

                    {selectedRoom.amenities?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedRoom.amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                          >
                            <Wifi size={12} />
                            {amenity}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="check_in"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Check-in
                  </label>
                  <input
                    id="check_in"
                    name="check_in"
                    type="date"
                    value={form.check_in}
                    min={getLocalDate()}
                    onChange={updateForm}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-[#008BE0] focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="check_out"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Check-out
                  </label>
                  <input
                    id="check_out"
                    name="check_out"
                    type="date"
                    value={form.check_out}
                    min={form.check_in || getLocalDate()}
                    onChange={updateForm}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-[#008BE0] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="guest_count"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Number of guests
                  </label>
                  <input
                    id="guest_count"
                    name="guest_count"
                    type="number"
                    min="1"
                    max="50"
                    value={form.guest_count}
                    onChange={updateForm}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-[#008BE0] focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="room_count"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Number of rooms
                  </label>
                  <input
                    id="room_count"
                    name="room_count"
                    type="number"
                    min="1"
                    max={selectedRoom?.total_rooms || 1}
                    value={form.room_count}
                    onChange={updateForm}
                    required
                    className="w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-[#008BE0] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="border-t border-slate-200 pt-5">
                <h3 className="font-bold text-slate-900">
                  Guest contact details
                </h3>

                <div className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor="guest_name"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Full name
                    </label>
                    <input
                      id="guest_name"
                      name="guest_name"
                      type="text"
                      autoComplete="name"
                      value={form.guest_name}
                      onChange={updateForm}
                      minLength={2}
                      maxLength={120}
                      required
                      placeholder="Enter your full name"
                      className="w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-[#008BE0] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="guest_email"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Email address
                    </label>
                    <input
                      id="guest_email"
                      name="guest_email"
                      type="email"
                      autoComplete="email"
                      value={form.guest_email}
                      onChange={updateForm}
                      maxLength={254}
                      required
                      placeholder="you@example.com"
                      className="w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-[#008BE0] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="guest_phone"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Phone / WhatsApp number
                    </label>
                    <input
                      id="guest_phone"
                      name="guest_phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.guest_phone}
                      onChange={updateForm}
                      maxLength={30}
                      required
                      placeholder="+234..."
                      className="w-full rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-[#008BE0] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="guest_notes"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Special requests (optional)
                    </label>
                    <textarea
                      id="guest_notes"
                      name="guest_notes"
                      rows={3}
                      maxLength={1000}
                      value={form.guest_notes}
                      onChange={updateForm}
                      placeholder="Any additional information for the organisers"
                      className="w-full resize-y rounded-lg border border-slate-300 px-3 py-3 outline-none focus:border-[#008BE0] focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-5">
                <h3 className="font-bold text-slate-900">
                  Estimated booking total
                </h3>

                <div className="mt-3 space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between gap-3">
                    <span>Night(s)</span>
                    <span>{Math.max(nights, 0)}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Room(s)</span>
                    <span>{Number(form.room_count) || 0}</span>
                  </div>
                  <div className="flex justify-between gap-3">
                    <span>Price per room / night</span>
                    <span>
                      {selectedRoom
                        ? formatMoney(selectedRoom.price_per_night)
                        : '—'}
                    </span>
                  </div>
                </div>

                <div className="mt-4 border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-700">
                      Estimated total
                    </span>
                    <span className="text-xl font-bold text-[#002B5C]">
                      {formatMoney(estimatedTotal)}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  This is a preview only. The server calculates the final
                  amount and checks booking rules. Submitting this form does
                  not confirm a room or verify payment.
                </p>
              </div>

              <button
                type="submit"
                disabled={
                  submitting ||
                  loadingHotels ||
                  loadingRooms ||
                  hotels.length === 0
                }
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#002B5C] px-5 py-4 font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="animate-spin" size={20} />
                    Submitting request...
                  </>
                ) : (
                  <>
                    Submit booking request
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="text-center text-xs leading-5 text-slate-500">
                After your booking request is submitted, official payment
                instructions and the receipt-upload option will appear above.
                Payment must be verified by the administrator.
              </p>
            </form>
          </section>
        </div>
      </main>
    </div>
  )
}
