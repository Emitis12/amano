import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react'

import { event, schedule } from '../data/event.js'
import { useRegistrationModal } from '../context/RegistrationModalContext.jsx'

const included = [
  'Full access to all sessions and workshops',
  'Networking breaks and refreshments',
  'Convention welcome pack',
  'Certificate of attendance',
]

export default function Convention() {
  const { open: openRegistration } = useRegistrationModal()

  return (
    <div>
      {/* HERO */}
      <section className="bg-navy-900 text-white pt-32 pb-16 md:pt-36 md:pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold-400 font-semibold text-sm mb-3">
            <span className="eyebrow-rule" />
            The Convention
          </p>

          <h1 className="text-4xl md:text-5xl font-bold max-w-2xl">
            {event.name}{' '}
            <span className="text-gold-500">{event.year}</span>
          </h1>

          <div className="mt-5 max-w-xl">
            <span className="inline-block bg-white text-navy-900 text-xs font-bold tracking-wide px-3 py-1 rounded-full mb-3">
              THEME
            </span>

            <p className="font-display text-xl font-semibold text-gold-400">
              {event.themeIntro}:
            </p>

            <p className="font-display text-lg text-navy-100 leading-snug">
              {event.theme}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-8">
            {/* Date */}
            <div className="flex items-center gap-3">
              <Calendar size={22} className="text-gold-500" />

              <div>
                <p className="font-semibold">{event.date}</p>

                <p className="text-xs text-navy-200">
                  {event.dateNote}
                </p>
              </div>
            </div>

            {/* Venues */}
            <div className="flex items-start gap-3">
              <MapPin
                size={22}
                className="text-gold-500 mt-0.5 shrink-0"
              />

              <div className="space-y-3">
                {/* Oriental Hotels */}
                <div>
                  <a
                    href={schedule[1].venue.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-white hover:text-gold-400 transition-colors"
                  >
                    {schedule[1].venue.name}
                  </a>

                  <p className="text-xs text-navy-200">
                    {schedule[1].venue.area}
                  </p>

                  <p className="text-xs text-gold-400 mt-0.5">
                    Days 2 & 3 · Stakeholder Engagement & Gala and Award Night
                  </p>
                </div>

                {/* Eko Hotels */}
                <div>
                  <a
                    href={schedule[0].venue.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-white hover:text-gold-400 transition-colors"
                  >
                    {schedule[0].venue.name}
                  </a>

                  <p className="text-xs text-navy-200">
                    {schedule[0].venue.area}
                  </p>

                  <p className="text-xs text-gold-400 mt-0.5">
                    Day 1 · {schedule[0].venue.activity}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCHEDULE + REGISTRATION */}
      <section className="section-pad bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.4fr_1fr] gap-12">

          {/* Convention Schedule */}
          <div>
            <p className="text-gold-600 font-semibold text-sm mb-3">
              <span className="eyebrow-rule" />
              Schedule
            </p>

            <h2 className="text-3xl font-bold text-navy-900 mb-8">
              Convention Schedule{' '}
              <span className="text-base font-normal text-navy-400">
                ({event.dateNote} on Day 1)
              </span>
            </h2>

            <ol className="relative border-l-2 border-navy-100 pl-8 space-y-8">

              {schedule.map((s) => (
                <li
                  key={s.day}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <span className="absolute -left-[41px] top-0.5 w-5 h-5 rounded-full bg-gold-500 border-4 border-white" />

                  {/* Day & Date */}
                  <p className="flex items-center gap-2 text-sm text-navy-500 mb-1">
                    <Clock size={14} />

                    {s.day} &middot; {s.date}
                  </p>

                  {/* Activity */}
                  <p className="font-semibold text-navy-900 text-lg">
                    {s.activity}
                  </p>

                  {/* Venue */}
                  <a
                    href={s.venue.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-navy-500 hover:text-gold-600 transition-colors mt-2 group"
                  >
                    <MapPin
                      size={15}
                      className="text-gold-500 group-hover:text-gold-600 transition-colors"
                    />

                    <span className="underline-offset-4 group-hover:underline">
                      {s.venue.name}
                    </span>
                  </a>

                  {/* Venue Area */}
                  <p className="text-xs text-navy-400 mt-1 ml-5">
                    {s.venue.area}
                  </p>
                </li>
              ))}

            </ol>
          </div>

          {/* Registration Card */}
          <div className="lg:sticky lg:top-28 h-fit">
            <div className="bg-navy-900 text-white rounded-2xl p-8">

              <p className="text-gold-400 font-semibold text-xs tracking-wide mb-3">
                REGISTRATION
              </p>

              <h3 className="text-2xl font-bold mb-1">
                Secure Your Spot
              </h3>

              <h3 className="text-2xl font-bold text-gold-500 mb-5">
                Today!
              </h3>

              <p className="text-navy-200 text-sm mb-6">
                {event.registration}
              </p>

              <ul className="space-y-3 mb-8">
                {included.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-navy-100"
                  >
                    <CheckCircle2
                      size={16}
                      className="text-gold-500 mt-0.5 shrink-0"
                    />

                    {item}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={openRegistration}
                className="inline-flex w-full items-center justify-center gap-2 bg-gold-500 text-navy-900 font-semibold px-6 py-3.5 rounded-full hover:bg-gold-400 transition-colors"
              >
                Register Now
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Audience */}
            <div className="mt-6 flex items-start gap-3 text-sm text-navy-600">
              <Users
                size={18}
                className="mt-0.5 shrink-0 text-navy-700"
              />

              <p>
                Open to AMANO alumni, industry professionals, students and all
                well-wishers.
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}