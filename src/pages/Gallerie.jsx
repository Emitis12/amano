import { useEffect, useMemo, useState } from 'react'
import { Camera, Download, Eye, Images, RefreshCw, X } from 'lucide-react'
import { supabase } from '../lib/supabase.js'

const DAY_TABS = [
  { label: 'All Photos', value: 'all' },
  { label: 'Day 1 — Meet & Greet', value: 'day1' },
  { label: 'Day 2 — Convention', value: 'day2' },
  { label: 'Day 3 — Gala', value: 'day3' },
]

const CATEGORIES = [
  { label: 'All Categories', value: 'all' },
  { label: 'Speakers', value: 'speakers' },
  { label: 'Networking', value: 'networking' },
  { label: 'Audience', value: 'audience' },
  { label: 'Meet & Greet', value: 'meet_greet' },
  { label: 'Gala', value: 'gala' },
  { label: 'Awards', value: 'awards' },
  { label: 'Venue', value: 'venue' },
  { label: 'General', value: 'general' },
]

const CATEGORY_LABELS = Object.fromEntries(
  CATEGORIES.filter((category) => category.value !== 'all').map(
    (category) => [category.value, category.label]
  )
)

const DAY_LABELS = {
  day1: 'Day 1 · 12 November 2026',
  day2: 'Day 2 · 13 November 2026',
  day3: 'Day 3 · 14 November 2026',
}

export default function Gallerie() {
  const [activeTab, setActiveTab] = useState('all')
  const [activeCategory, setActiveCategory] = useState('all')
  const [photos, setPhotos] = useState([])
  const [selectedPhoto, setSelectedPhoto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)

  async function loadPhotos() {
    setLoading(true)
    setError('')

    try {
      const { data, error: queryError } = await supabase
        .from('gallery_photos')
        .select(
          'id, file_name, storage_path, event_day, category, caption, view_count, created_at'
        )
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (queryError) throw queryError

      const results = await Promise.all(
        (data || []).map(async (photo) => {
          const { data: imageData, error: imageError } =
            await supabase.storage
              .from('amano-photos')
              .createSignedUrl(photo.storage_path, 3600)

          return {
            ...photo,
            imageUrl: imageError ? null : imageData?.signedUrl,
          }
        })
      )

      setPhotos(results)
    } catch (err) {
      setError(
        err.message ||
          'Unable to load convention photographs. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPhotos()
  }, [])

  useEffect(() => {
    if (!selectedPhoto) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setSelectedPhoto(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedPhoto])

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      const matchesDay =
        activeTab === 'all' || photo.event_day === activeTab

      const matchesCategory =
        activeCategory === 'all' ||
        photo.category === activeCategory

      return matchesDay && matchesCategory
    })
  }, [photos, activeTab, activeCategory])

  async function openPhoto(photo) {
    setSelectedPhoto(photo)

    try {
      const { data, error: viewError } = await supabase.rpc(
        'increment_gallery_photo_view',
        { p_photo_id: photo.id }
      )

      if (viewError) throw viewError

      if (typeof data === 'number') {
        const updatedPhoto = { ...photo, view_count: data }

        setPhotos((current) =>
          current.map((item) =>
            item.id === photo.id
              ? { ...item, view_count: data }
              : item
          )
        )

        setSelectedPhoto(updatedPhoto)
      }
    } catch (err) {
      console.error(
        'Could not update photo view count:',
        err.message
      )
    }
  }

  async function downloadPhoto(photo) {
    if (!photo?.imageUrl || downloading) return

    setDownloading(true)

    try {
      const response = await fetch(photo.imageUrl)

      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = photo.file_name || `amano-photo-${photo.id}.jpg`

      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Could not download photo:', err.message)
      // Fallback: open the image so it can be saved manually.
      window.open(photo.imageUrl, '_blank', 'noopener,noreferrer')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <section className="min-h-screen bg-gray-50">
      {/* Gallery Header */}
      <div className="bg-[#002B5C] px-5 py-12 text-center text-white sm:px-6 sm:py-16">
        <p className="mb-4 text-xs pt-12 uppercase tracking-[0.25em] text-amber-400 sm:text-sm sm:tracking-[0.3em]">
          AMANO National Convention 2026
        </p>

        <h1 className="mb-4 text-3xl font-bold sm:text-4xl md:text-5xl">
          Convention Gallery
        </h1>

        <p className="mx-auto max-w-2xl text-sm leading-7 text-gray-200 sm:text-base">
          Relive the moments, connections, and memories of our convention.
          Explore photographs from every day of the event.
        </p>

        <div className="mt-7 flex items-center justify-center gap-2 text-sm text-blue-100">
          <Images size={18} />
          <span>
            {photos.length} published{' '}
            {photos.length === 1 ? 'photo' : 'photos'}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Event Day Filters */}
        <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3">
          {DAY_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-full px-4 py-2.5 text-xs font-medium transition-all duration-200 sm:px-5 sm:text-sm ${
                activeTab === tab.value
                  ? 'bg-[#002B5C] text-white shadow-md'
                  : 'border border-gray-200 bg-white text-gray-700 hover:border-[#002B5C]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <label
            htmlFor="gallery-category"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Browse by category
          </label>

          <select
            id="gallery-category"
            value={activeCategory}
            onChange={(event) => setActiveCategory(event.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#002B5C] focus:ring-2 focus:ring-[#002B5C]/10 sm:max-w-xs"
          >
            {CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={loadPhotos}
              className="mt-3 inline-flex items-center gap-2 font-semibold underline"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        )}

        {/* Loading State and Photo Grid */}
        {loading ? (
          <div className="py-20 text-center text-gray-500">
            <RefreshCw
              className="mx-auto mb-4 animate-spin"
              size={30}
            />
            Loading convention photographs...
          </div>
        ) : filteredPhotos.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {filteredPhotos.map((photo) => (
              <button
                key={photo.id}
                type="button"
                onClick={() => openPhoto(photo)}
                disabled={!photo.imageUrl}
                className="group overflow-hidden rounded-2xl border border-gray-200/80 bg-white text-left shadow-[0_3px_12px_rgba(0,43,92,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] disabled:cursor-not-allowed sm:rounded-2xl sm:shadow-sm"
                aria-label={`View ${photo.file_name}, ${photo.view_count} views`}
              >
                {/* Photo Thumbnail */}
                <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 sm:aspect-[4/3]">
                  {photo.imageUrl ? (
                    <img
                      src={photo.imageUrl}
                      alt={photo.caption || photo.file_name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 group-active:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 px-2 text-center text-xs text-gray-500 sm:text-sm">
                      <Camera size={28} />
                      Image temporarily unavailable
                    </div>
                  )}

                  {/* Category Badge */}
                  <span className="absolute left-2 top-2 max-w-[calc(100%-1rem)] truncate rounded-full bg-[#002B5C]/95 px-2.5 py-1 text-[10px] font-semibold text-white shadow-md sm:left-3 sm:top-3 sm:px-3 sm:text-xs">
                    {CATEGORY_LABELS[photo.category] || 'General'}
                  </span>

                  {/* View Counter */}
                  <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-[10px] font-medium text-white shadow-md sm:bottom-3 sm:right-3 sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-xs">
                    <Eye
                      size={12}
                      className="sm:h-[14px] sm:w-[14px]"
                    />
                    {photo.view_count ?? 0} views
                  </span>
                </div>

                {/* Photo Caption */}
                <div className="p-2.5 sm:p-4">
                  <p className="mb-1.5 text-[9px] font-semibold uppercase leading-relaxed tracking-wide text-amber-700 sm:mb-2 sm:text-xs">
                    {DAY_LABELS[photo.event_day] || photo.event_day}
                  </p>

                  <p className="line-clamp-2 text-xs font-semibold leading-relaxed text-gray-800 sm:text-sm">
                    {photo.caption || photo.file_name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white px-5 py-16 text-center sm:px-6">
            <Camera
              className="mx-auto mb-5 text-gray-400"
              size={42}
            />

            <h2 className="mb-3 text-xl font-semibold text-gray-800">
              {photos.length === 0
                ? 'The memories are coming'
                : 'No photos in this selection'}
            </h2>

            <p className="mx-auto max-w-lg text-sm leading-7 text-gray-500 sm:text-base">
              {photos.length === 0
                ? 'Published photographs from the AMANO National Convention will appear here as they become available.'
                : 'Try selecting another event day or category to explore more photographs.'}
            </p>

            {photos.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('all')
                  setActiveCategory('all')
                }}
                className="mt-5 rounded-lg bg-[#002B5C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003B7A]"
              >
                View all photos
              </button>
            )}
          </div>
        )}
      </div>

      {/* Full-Screen Photo Viewer */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Photograph viewer"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            aria-label="Close photo viewer"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
          >
            <X size={24} />
          </button>

          <div
            className="max-h-full w-full max-w-5xl"
            onClick={(event) => event.stopPropagation()}
          >
            {selectedPhoto.imageUrl && (
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.caption || selectedPhoto.file_name}
                className="mx-auto max-h-[75vh] max-w-full rounded-lg object-contain"
              />
            )}

            <div className="mt-4 text-center text-white">
              <p className="font-semibold">
                {selectedPhoto.caption || selectedPhoto.file_name}
              </p>

              <p className="mt-2 text-sm text-gray-300">
                {DAY_LABELS[selectedPhoto.event_day] ||
                  selectedPhoto.event_day}{' '}
                · {CATEGORY_LABELS[selectedPhoto.category] || 'General'} ·{' '}
                {selectedPhoto.view_count ?? 0} views
              </p>

              {selectedPhoto.imageUrl && (
                <button
                  type="button"
                  onClick={() => downloadPhoto(selectedPhoto)}
                  disabled={downloading}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-[#002B5C] transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Download size={16} />
                  {downloading ? 'Downloading...' : 'Download photo'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}