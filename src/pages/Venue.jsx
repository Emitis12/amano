import { MapPin, Clock, Car, Plane, ArrowRight } from 'lucide-react'
import { event, schedule } from '../data/event.js'
import { useRegistrationModal } from '../context/RegistrationModalContext.jsx'

const gettingThere = [
  {
    icon: Plane,
    title: 'By air',
    body: 'Served by Murtala Muhammed International Airport, Lagos — allow extra time for traffic on airport transfers.',
  },
  {
    icon: Car,
    title: 'By road',
    body: 'Located in Lagos, Nigeria, with on-site parking available for guests.',
  },
]

export default function Venue() {
  const { open: openRegistration } = useRegistrationModal()

  return (
    <div>
      <section className="bg-navy-900 text-white pt-32 pb-16 md:pt-36 md:pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold-400 font-semibold text-sm mb-3">
            <span className="eyebrow-rule" />Venue &amp; Schedule
          </p>
          <h1 className="text-4xl md:text-5xl font-bold max-w-2xl">
            {event.venueName}
          </h1>
          <p className="mt-4 flex items-center gap-2 text-navy-200">
            <MapPin size={18} className="text-gold-500" /> {event.venueArea}
          </p>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-8">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1400&auto=format&fit=crop"
                alt={`${event.venueName}, ${event.venueArea}`}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Getting there</h2>
            <div className="space-y-6">
              {gettingThere.map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-4">
                  <span className="w-11 h-11 rounded-full bg-navy-100 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-navy-800" />
                  </span>
                  <div>
                    <p className="font-semibold text-navy-900">{title}</p>
                    <p className="text-navy-600 text-sm">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy-900 mb-2">
              Convention Schedule
            </h2>
            <p className="text-navy-400 text-sm mb-8">{event.dateNote} on Day 1</p>
            <ol className="relative border-l-2 border-navy-100 pl-8 space-y-8">
              {schedule.map((s) => (
                <li key={s.day} className="relative">
                  <span className="absolute -left-[41px] top-0.5 w-5 h-5 rounded-full bg-gold-500 border-4 border-white" />
                  <p className="flex items-center gap-2 text-sm text-navy-500 mb-1">
                    <Clock size={14} /> {s.day} &middot; {s.date}
                  </p>
                  <p className="font-semibold text-navy-900">{s.activity}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section-pad bg-navy-50 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mb-4">
            See you at {event.venueName}
          </h2>
          <button
            type="button"
            onClick={openRegistration}
            className="inline-flex items-center gap-2 bg-gold-500 text-navy-900 font-semibold px-7 py-3.5 rounded-full hover:bg-gold-400 transition-colors"
          >
            Register Now <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  )
}
