import { useState } from 'react'
import { ChevronDown, ArrowRight } from 'lucide-react'
import { faqs, event } from '../data/event.js'
import { useRegistrationModal } from '../context/RegistrationModalContext.jsx'

function FaqItem({ q, a, isOpen, onToggle }) {
  return (
    <div className="border-b border-navy-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 py-6 text-left"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-navy-900">{q}</span>
        <ChevronDown
          size={20}
          className={`text-gold-600 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <p className="text-navy-600 leading-relaxed pb-6 pr-8 -mt-2">{a}</p>
      )}
    </div>
  )
}

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState(0)
  const { open: openRegistration } = useRegistrationModal()

  return (
    <div>
      <section className="bg-navy-900 text-white section-pad">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold-400 font-semibold text-sm mb-3">
            <span className="eyebrow-rule" />FAQs
          </p>
          <h1 className="text-4xl md:text-5xl font-bold max-w-2xl">
            Frequently asked questions
          </h1>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="max-w-3xl mx-auto">
          {faqs.map((f, i) => (
            <FaqItem
              key={f.q}
              q={f.q}
              a={f.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </section>

      <section className="section-pad bg-navy-50 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-navy-900 mb-4">
            Still have questions?
          </h2>
          <p className="text-navy-600 mb-8">
            Reach the convention committee at {event.email} or {event.phone},
            or go ahead and reserve your spot.
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
