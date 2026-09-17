import { Link } from 'react-router-dom'
import {
  Anchor,
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  Lightbulb,
  TrendingUp,
  Mic,
  MessageSquare,
  GraduationCap,
  Star,
  Clock,
} from 'lucide-react'
import { event, speakers, schedule } from '../data/event.js'
import Countdown from '../components/Countdown.jsx'
import { useRegistrationModal } from '../context/RegistrationModalContext.jsx'

const pillars = [
  {
    icon: Users,
    title: 'Reconnect',
    body: 'Build stronger bonds with fellow alumni across generations.',
  },
  {
    icon: Lightbulb,
    title: 'Share Ideas',
    body: 'Engage in insightful discussions and industry trends.',
  },
  {
    icon: TrendingUp,
    title: 'Create Opportunities',
    body: 'Explore partnerships, mentorship and career advancement.',
  },
  {
    icon: Anchor,
    title: 'Drive Impact',
    body: 'Contribute to the growth of AMANO and the maritime sector.',
  },
]

const highlights = [
  {
    icon: Users,
    title: 'Networking Sessions',
    body: 'Connect with alumni, industry leaders and potential partners.',
  },
  {
    icon: Mic,
    title: 'Inspiring Speakers',
    body: 'Get insights from seasoned professionals and thought leaders.',
  },
  {
    icon: MessageSquare,
    title: 'Panel Discussions',
    body: 'Engage in meaningful conversations on the future of the maritime industry.',
  },
  {
    icon: GraduationCap,
    title: 'Career & Business Opportunities',
    body: 'Discover new pathways for growth and collaboration.',
  },
  {
    icon: Star,
    title: 'Recognition & Awards',
    body: 'Celebrating excellence and outstanding contributions.',
  },
]

export default function Home() {
  const { open: openRegistration } = useRegistrationModal()

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/hero-bg.jpg"
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/85 to-navy-900/30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-28 pb-20 md:pt-32 md:pb-28">
          <p className="text-gold-400 font-semibold tracking-wide mb-4 text-sm">
            CONNECT &nbsp;|&nbsp; NETWORK &nbsp;|&nbsp; BUILD &nbsp;|&nbsp; ADVANCE
          </p>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] max-w-3xl">
            {event.name}{' '}
            <span className="text-gold-500">{event.year}</span>
          </h1>

          <div className="mt-6 max-w-xl">
            <span className="inline-block bg-white text-navy-900 text-xs font-bold tracking-wide px-3 py-1 rounded-full mb-3">
              THEME
            </span>
            <p className="font-display text-xl md:text-2xl font-semibold text-gold-400">
              {event.themeIntro}:
            </p>
            <p className="font-display text-lg md:text-xl text-navy-100 leading-snug">
              {event.theme}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-8">
            <div className="flex items-center gap-3">
              <Calendar size={22} className="text-gold-500" />
              <div>
                <p className="font-semibold">{event.date}</p>
                <p className="text-xs text-navy-200">{event.dateNote}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin size={22} className="text-gold-500" />
              <div>
                <p className="font-semibold">{event.venueName}</p>
                <p className="text-xs text-navy-200">{event.venueArea}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <button
              type="button"
              onClick={openRegistration}
              className="inline-flex items-center gap-2 bg-gold-500 text-navy-900 font-semibold px-7 py-3.5 rounded-full hover:bg-gold-400 transition-colors"
            >
              Register Now <ArrowRight size={18} />
            </button>
            <p className="text-sm text-navy-200 flex items-center gap-2">
              <MapPin size={14} className="text-gold-500" />
              {event.registration}
            </p>
          </div>
        </div>
      </section>

      <Countdown />

      {/* ABOUT */}
      <section className="section-pad bg-navy-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_1.2fr] gap-12">
          <div>
            <p className="text-gold-600 font-semibold text-sm mb-3">
              <span className="eyebrow-rule" />About the Event
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
              The AMANO National Convention
            </h2>
            <p className="text-navy-700 leading-relaxed">
              The AMANO National Convention is a premier gathering of Maritime
              Academy of Nigeria (Oron) alumni, bringing together
              professionals, industry leaders, innovators and change-makers to
              network, share ideas, and chart a stronger future for the AMANO
              community.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {pillars.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <span className="w-12 h-12 rounded-full bg-navy-100 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-navy-800" />
                </span>
                <h3 className="font-semibold text-navy-900 mb-1.5">{title}</h3>
                <p className="text-sm text-navy-600 leading-snug">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEY HIGHLIGHTS */}
      <section className="section-pad bg-navy-900 text-white relative overflow-hidden">
        <Anchor size={340} className="absolute -right-16 -bottom-16 text-navy-800 opacity-40" />
        <div className="relative max-w-7xl mx-auto">
          <p className="text-gold-400 font-semibold text-sm mb-3">
            <span className="eyebrow-rule" />Key Highlights
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-12">What to Expect</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
            {highlights.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <span className="w-14 h-14 rounded-full border-2 border-gold-500 flex items-center justify-center mb-5">
                  <Icon size={22} className="text-gold-500" />
                </span>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-navy-200 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SPEAKERS PREVIEW */}
      <section className="section-pad bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-2">
            <div>
              <p className="text-gold-600 font-semibold text-sm mb-3">
                <span className="eyebrow-rule" />Featured Speakers & Top Personnels
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900">
                Meet Our Speakers & Dignitories
              </h2>
            </div>
            <Link
              to="/speakers"
              className="inline-flex items-center gap-1.5 text-navy-800 font-semibold hover:text-gold-600 transition-colors"
            >
              View All Dignitories <ArrowRight size={16} />
            </Link>
          </div>
          <p className="text-navy-600 mb-10">Engaging minds. Transforming the maritime industry.</p>

          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {speakers.map((s) => (
              <div key={s.name} className="text-center">
                <div className="aspect-square rounded-xl bg-navy-100 mb-4 overflow-hidden">
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="font-semibold text-navy-900 text-sm leading-snug">{s.name}</h3>
                <p className="text-xs text-navy-500 mb-2">{s.role}</p>
                <span className="inline-block text-[11px] font-medium bg-navy-800 text-white px-3 py-1 rounded-full">
                  {s.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENT DETAILS / REGISTRATION / VENUE */}
      <section className="section-pad bg-navy-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div>
            <p className="text-gold-600 font-semibold text-sm mb-4">
              <span className="eyebrow-rule" />Event Details
            </p>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <Calendar size={20} className="text-navy-700 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-navy-900">Date</p>
                  <p className="text-navy-600 text-sm">{event.date}</p>
                  <p className="text-navy-400 text-xs">{event.dateNote}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <MapPin size={20} className="text-navy-700 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-navy-900">Venue</p>
                  <p className="text-navy-600 text-sm">{event.venueName}</p>
                  <p className="text-navy-400 text-xs">{event.venueArea}</p>
                </div>
              </li>
              <li className="flex gap-4">
                <Users size={20} className="text-navy-700 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-navy-900">Who Should Attend?</p>
                  <p className="text-navy-600 text-sm">
                    AMANO Alumni, industry professionals, students and all
                    well-wishers.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Registration */}
          <div className="bg-navy-900 text-white rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <p className="text-gold-400 font-semibold text-xs tracking-wide mb-3">
                REGISTRATION
              </p>
              <h3 className="text-2xl font-bold mb-1">Secure Your Spot</h3>
              <h3 className="text-2xl font-bold text-gold-500 mb-4">Today!</h3>
              <p className="text-navy-200 text-sm">{event.registration}</p>
            </div>
            <button
              type="button"
              onClick={openRegistration}
              className="mt-8 inline-flex items-center justify-center gap-2 bg-gold-500 text-navy-900 font-semibold px-6 py-3 rounded-full hover:bg-gold-400 transition-colors"
            >
              Register Now <ArrowRight size={16} />
            </button>
          </div>

          {/* Venue & Schedule */}
          <div>
            <p className="text-gold-600 font-semibold text-sm mb-4">
              <span className="eyebrow-rule" />Venue &amp; Schedule
            </p>
            <div className="flex gap-4 mb-6">
              <MapPin size={20} className="text-navy-700 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-navy-900">{event.venueName}</p>
                <p className="text-navy-600 text-sm">{event.venueArea}</p>
              </div>
            </div>
            <div className="flex gap-4 mb-4">
              <Clock size={20} className="text-navy-700 mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-navy-900">Convention Schedule</p>
                <p className="text-navy-400 text-xs mb-3">{event.dateNote} on Day 1</p>
              </div>
            </div>
            <ul className="space-y-2 pl-9 text-sm">
              {schedule.map((s) => (
                <li key={s.day} className="grid grid-cols-[auto_1fr] gap-3">
                  <span className="text-navy-500 whitespace-nowrap">{s.date}</span>
                  <span className="text-navy-800 font-medium">{s.activity}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}