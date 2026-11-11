
import { useEffect, useState } from 'react'
import {
  CalendarClock,
  CheckCircle2,
  Youtube,
  Radio,
  PlayCircle,
} from 'lucide-react'
import { event } from '../data/event.js'

const YOUTUBE_VIDEO_ID = 'IOf1s217MqI'

const YOUTUBE_EMBED_URL =
  `https://www.youtube-nocookie.com/embed/${YOUTUBE_VIDEO_ID}`

function getTimeParts(targetIso) {
  const diff = new Date(targetIso).getTime() - Date.now()

  if (diff <= 0) return null

  const totalSeconds = Math.floor(diff / 1000)

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

const units = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
]

export default function Countdown() {
  const [parts, setParts] = useState(() =>
    getTimeParts(event.startDateTime)
  )

  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const updateCountdown = () => {
      const currentTime = Date.now()

      setNow(currentTime)
      setParts(getTimeParts(event.startDateTime))
    }

    updateCountdown()

    const id = setInterval(updateCountdown, 1000)

    return () => clearInterval(id)
  }, [])

  const hasStarted = parts === null

  const hasEnded =
    hasStarted &&
    new Date(event.endDateTime).getTime() <= now

  return (
    <section className="bg-white border-b border-navy-100">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-12">

        {/* BEFORE THE EVENT */}
        {!hasStarted && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-full bg-navy-100 flex items-center justify-center shrink-0">
                <CalendarClock size={20} className="text-navy-800" />
              </span>

              <div>
                <p className="font-semibold text-navy-900">
                  Counting down to {event.shortName}
                </p>

                <p className="text-sm text-navy-500">
                  {event.date} &middot; {event.venueName}, {event.venueArea}
                </p>
              </div>
            </div>

            <div
              className="flex gap-3 sm:gap-4"
              role="timer"
              aria-live="off"
            >
              {units.map(({ key, label }) => (
                <div
                  key={key}
                  className="w-16 sm:w-20 text-center bg-navy-900 text-white rounded-xl py-3"
                >
                  <span className="block font-display text-2xl sm:text-3xl font-bold tabular-nums">
                    {String(parts[key]).padStart(2, '0')}
                  </span>

                  <span className="block text-[10px] sm:text-xs text-navy-300 tracking-wide mt-1">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DURING THE EVENT */}
        {hasStarted && !hasEnded && (
          <div className="space-y-6">

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Radio size={20} className="text-green-600" />
                </span>

                <div>
                  <p className="font-semibold text-navy-900">
                    {event.shortName} is happening now
                  </p>

                  <p className="text-sm text-navy-500">
                    {event.date} &middot; {event.venueName}, {event.venueArea}
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-2 bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-full text-xs font-bold tracking-wide w-fit">
                <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                LIVE STREAM
              </span>
            </div>

            {/* YOUTUBE LIVESTREAM PLAYER */}
            <div className="max-w-5xl mx-auto w-full">
              <div className="bg-navy-950 rounded-2xl overflow-hidden shadow-xl">

                <div className="flex items-center justify-between gap-3 px-4 md:px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Youtube size={23} className="text-red-500" />

                    <span className="text-white font-semibold text-sm md:text-base">
                      AMANO Convention 2026
                    </span>
                  </div>

                  <span className="flex items-center gap-2 text-red-400 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    LIVE NOW
                  </span>
                </div>

                <div className="relative w-full aspect-video bg-black">
                  <iframe
                    src={`${YOUTUBE_EMBED_URL}?autoplay=1&rel=0`}
                    title="AMANO National Convention 2026 Live Stream"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>

                <div className="px-4 md:px-6 py-4 text-center">
                  <p className="text-white font-semibold text-sm md:text-base">
                    CONNECT | NETWORK | BUILD | ADVANCE
                  </p>

                  <p className="text-navy-300 text-xs mt-2">
                    Join us live from Lagos, Nigeria.
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* AFTER THE EVENT */}
        {hasEnded && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <CheckCircle2 size={20} className="text-gray-600" />
              </span>

              <div>
                <p className="font-semibold text-navy-900">
                  {event.shortName} has concluded
                </p>

                <p className="text-sm text-navy-500">
                  Thank you for being part of AMANO 2026!
                </p>
              </div>
            </div>

            <a
              href="/gallerie"
              className="inline-flex items-center justify-center gap-3 bg-navy-900 hover:bg-navy-800 text-white rounded-xl px-5 py-4 transition-colors group"
            >
              <PlayCircle size={22} className="text-yellow-400" />

              <span>
                <span className="block font-bold text-sm">
                  Relive the Moments
                </span>

                <span className="block text-xs text-navy-200 mt-1">
                  Explore the convention gallery
                </span>
              </span>

              <span className="text-yellow-400 text-lg transition-transform group-hover:translate-x-1">
                →
              </span>
            </a>

          </div>
        )}

      </div>
    </section>
  )
}
