import { Users, ArrowRight } from 'lucide-react'
import { speakers, event } from '../data/event.js'
import { useRegistrationModal } from '../context/RegistrationModalContext.jsx'

export default function Speakers() {
  const { open: openRegistration } = useRegistrationModal()

  return (
    <div>
      <section className="bg-navy-900 text-white section-pad">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold-400 font-semibold text-sm mb-3">
            <span className="eyebrow-rule" />Featured Speakers
          </p>
          <h1 className="text-4xl md:text-5xl font-bold max-w-2xl">
            Engaging minds. Transforming the maritime industry.
          </h1>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {speakers.map((s) => (
            <div
              key={s.name}
              className="rounded-2xl border border-navy-100 bg-navy-50 p-7 flex flex-col"
            >
              <div className="aspect-square w-24 rounded-xl bg-navy-100 mb-5 flex items-center justify-center">
                <Users size={36} className="text-navy-300" />
              </div>
              <span className="inline-block w-fit text-[11px] font-medium bg-navy-800 text-white px-3 py-1 rounded-full mb-3">
                {s.tag}
              </span>
              <h2 className="font-bold text-navy-900 text-lg leading-snug">{s.name}</h2>
              <p className="text-sm text-gold-600 font-medium mb-3">{s.role}</p>
              <p className="text-navy-600 text-sm leading-relaxed">{s.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad bg-navy-50 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mb-4">
            Hear from all of them in person
          </h2>
          <p className="text-navy-600 mb-8">
            {event.date} {event.dateNote} &middot; {event.venueName}, {event.venueArea}
          </p>
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
