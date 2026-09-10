import { useEffect, useRef } from 'react'
import { X, ExternalLink } from 'lucide-react'
import { useRegistrationModal } from '../context/RegistrationModalContext.jsx'
import { event } from '../data/event.js'

// Derive Luma's iframe-embed URL from the public event link, e.g.
// https://luma.com/0c8i64qw -> https://lu.ma/embed/event/0c8i64qw/simple
function getLumaEmbedUrl(url) {
  const slug = url.split('/').filter(Boolean).pop()
  return `https://lu.ma/embed/event/${slug}/simple`
}

export default function RegistrationModal() {
  const { isOpen, close } = useRegistrationModal()
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKeyDown)

    dialogRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, close])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      <div className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm" />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Register for ${event.shortName}`}
        tabIndex={-1}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-navy-100 shrink-0">
          <div>
            <p className="text-xs font-semibold text-gold-600 tracking-wide">REGISTRATION</p>
            <h2 className="font-display font-bold text-navy-900 leading-tight">
              {event.shortName}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close registration"
            className="w-9 h-9 rounded-full flex items-center justify-center text-navy-500 hover:bg-navy-100 hover:text-navy-900 transition-colors shrink-0"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 min-h-[520px] bg-navy-50">
          <iframe
            src={getLumaEmbedUrl(event.lumaUrl)}
            title={`Register for ${event.shortName}`}
            className="w-full h-full min-h-[520px] border-0"
            loading="lazy"
            allow="fullscreen; payment"
          />
        </div>

        <div className="px-5 py-3 border-t border-navy-100 text-center shrink-0">
          <a
            href={event.lumaUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-navy-400 hover:text-navy-700 transition-colors"
          >
            Trouble loading? Open registration page directly <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  )
}
