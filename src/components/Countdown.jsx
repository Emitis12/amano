import { useEffect, useState } from 'react'
import { CalendarClock } from 'lucide-react'
import { event } from '../data/event.js'

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
  const [parts, setParts] = useState(() => getTimeParts(event.startDateTime))

  useEffect(() => {
    const id = setInterval(() => {
      setParts(getTimeParts(event.startDateTime))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const hasStarted = parts === null
  const hasEnded = hasStarted && new Date(event.endDateTime).getTime() < Date.now()

  return (
    <section className="bg-white border-b border-navy-100">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-11 h-11 rounded-full bg-navy-100 flex items-center justify-center shrink-0">
              <CalendarClock size={20} className="text-navy-800" />
            </span>
            <div>
              <p className="font-semibold text-navy-900">
                {hasEnded
                  ? `${event.shortName} has concluded`
                  : hasStarted
                    ? `${event.shortName} is happening now`
                    : `Counting down to ${event.shortName}`}
              </p>
              <p className="text-sm text-navy-500">
                {event.date} &middot; {event.venueName}, {event.venueArea}
              </p>
            </div>
          </div>

          {!hasStarted && (
            <div className="flex gap-3 sm:gap-4" role="timer" aria-live="off">
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
          )}
        </div>
      </div>
    </section>
  )
}
