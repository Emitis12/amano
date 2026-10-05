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
import { motion } from 'framer-motion'
import { event, speakers, schedule } from '../data/event.js'
import Countdown from '../components/Countdown.jsx'
import WelcomeNote from "../components/WelcomeNote";
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

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 35,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const fadeIn = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const staggerFast = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

export default function Home() {
  const { open: openRegistration } = useRegistrationModal()

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-navy-900 text-white overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          <img
            src="/hero-bg.jpg"
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/85 to-navy-900/30" />
        </motion.div>

        <motion.div
          className="relative max-w-7xl mx-auto px-6 md:px-10 pt-28 pb-20 md:pt-32 md:pb-28"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.p
            variants={fadeUp}
            className="text-gold-400 font-semibold tracking-wide mb-4 text-sm"
          >
            CONNECT &nbsp;|&nbsp; NETWORK &nbsp;|&nbsp; BUILD &nbsp;|&nbsp; ADVANCE
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] max-w-3xl"
          >
            {event.name}{' '}
            <span className="text-gold-500">{event.year}</span>
          </motion.h1>

          <motion.div
            variants={fadeUp}
            className="mt-6 max-w-xl"
          >
            <span className="inline-block bg-white text-navy-900 text-xs font-bold tracking-wide px-3 py-1 rounded-full mb-3">
              THEME
            </span>

            <p className="font-display text-xl md:text-2xl font-semibold text-gold-400">
              {event.themeIntro}:
            </p>

            <p className="font-display text-lg md:text-xl text-navy-100 leading-snug">
              {event.theme}
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap gap-8"
          >
            <div className="flex items-center gap-3">
              <Calendar size={22} className="text-gold-500" />

              <div>
                <p className="font-semibold">{event.date}</p>
                <p className="text-xs text-navy-200">{event.dateNote}</p>
              </div>
            </div>

            {/* ORIENTAL HOTELS FIRST */}
            <motion.a
              href={schedule[1].venue.map}
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeUp}
              className="flex items-center gap-3 group transition-all duration-300 hover:translate-x-1"
            >
              <MapPin
                size={22}
                className="text-gold-500 shrink-0 transition-transform duration-300 group-hover:scale-110"
              />

              <div>
                <p className="font-semibold group-hover:text-gold-400 transition-colors">
                  {schedule[1].venue.name}
                </p>

                <p className="text-xs text-navy-200 group-hover:text-white transition-colors">
                  Days 2 & 3 · Stakeholder Engagement & Gala
                </p>
              </div>
            </motion.a>

            {/* EKO HOTELS SECOND */}
            <motion.a
              href={schedule[0].venue.map}
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeUp}
              className="flex items-center gap-3 group transition-all duration-300 hover:translate-x-1"
            >
              <MapPin
                size={22}
                className="text-gold-500 shrink-0 transition-transform duration-300 group-hover:scale-110"
              />

              <div>
                <p className="font-semibold group-hover:text-gold-400 transition-colors">
                  {schedule[0].venue.name}
                </p>

                <p className="text-xs text-navy-200 group-hover:text-white transition-colors">
                  Day 1 · {schedule[0].venue.activity}
                </p>
              </div>
            </motion.a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center gap-5"
          >
            <motion.button
              type="button"
              onClick={openRegistration}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 bg-gold-500 text-navy-900 font-semibold px-7 py-3.5 rounded-full hover:bg-gold-400 transition-colors"
            >
              Register Now <ArrowRight size={18} />
            </motion.button>

            <p className="text-sm text-navy-200 flex items-center gap-2">
              <MapPin size={14} className="text-gold-500" />
              {event.registration}
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* COUNTDOWN */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeUp}
      >
        <Countdown />
      </motion.div>

      {/* WELCOME NOTE */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeUp}
      >
        <WelcomeNote />
      </motion.div>

      {/* ABOUT */}
      <motion.section
        className="section-pad bg-navy-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeUp}
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-[1fr_1.2fr] gap-12">
          <motion.div variants={fadeUp}>
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
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-4 gap-6"
            variants={staggerContainer}
          >
            {pillars.map(({ icon: Icon, title, body }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.25 }}
              >
                <span className="w-12 h-12 rounded-full bg-navy-100 flex items-center justify-center mb-4">
                  <Icon size={20} className="text-navy-800" />
                </span>

                <h3 className="font-semibold text-navy-900 mb-1.5">
                  {title}
                </h3>

                <p className="text-sm text-navy-600 leading-snug">
                  {body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* KEY HIGHLIGHTS */}
      <motion.section
        className="section-pad bg-navy-900 text-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeUp}
      >
        <Anchor
          size={340}
          className="absolute -right-16 -bottom-16 text-navy-800 opacity-40"
        />

        <div className="relative max-w-7xl mx-auto">
          <motion.div variants={fadeUp}>
            <p className="text-gold-400 font-semibold text-sm mb-3">
              <span className="eyebrow-rule" />Key Highlights
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mb-12">
              What to Expect
            </h2>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10"
            variants={staggerContainer}
          >
            {highlights.map(({ icon: Icon, title, body }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <span className="w-14 h-14 rounded-full border-2 border-gold-500 flex items-center justify-center mb-5">
                  <Icon size={22} className="text-gold-500" />
                </span>

                <h3 className="font-semibold mb-2">{title}</h3>

                <p className="text-sm text-navy-200 leading-relaxed">
                  {body}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* SPEAKERS PREVIEW */}
      <motion.section
        className="section-pad bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeUp}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex items-end justify-between flex-wrap gap-4 mb-2"
            variants={fadeUp}
          >
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
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-navy-600 mb-10"
          >
            Engaging minds. Transforming the maritime industry.
          </motion.p>

          <motion.div
            className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-6"
            variants={staggerFast}
          >
            {speakers.map((s) => (
              <motion.div
                key={s.name}
                variants={fadeUp}
                whileHover={{ y: -7 }}
                transition={{ duration: 0.25 }}
                className="text-center"
              >
                <div className="aspect-square rounded-xl bg-navy-100 mb-4 overflow-hidden">
                  <motion.img
                    src={s.image}
                    alt={s.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>

                <h3 className="font-semibold text-navy-900 text-sm leading-snug">
                  {s.name}
                </h3>

                <p className="text-xs text-navy-500 mb-2">
                  {s.role}
                </p>

                <span className="inline-block text-[11px] font-medium bg-navy-800 text-white px-3 py-1 rounded-full">
                  {s.tag}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* EVENT DETAILS / REGISTRATION / VENUE */}
      <motion.section
        className="section-pad bg-navy-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.12 }}
        variants={fadeUp}
      >
        <motion.div
          className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8"
          variants={staggerContainer}
        >
          {/* Event Details */}
          <motion.div variants={fadeUp}>
            <p className="text-gold-600 font-semibold text-sm mb-4">
              <span className="eyebrow-rule" />Event Details
            </p>

            <ul className="space-y-6">
              <li className="flex gap-4">
                <Calendar
                  size={20}
                  className="text-navy-700 mt-0.5 shrink-0"
                />

                <div>
                  <p className="font-semibold text-navy-900">
                    Date
                  </p>

                  <p className="text-navy-600 text-sm">
                    {event.date}
                  </p>

                  <p className="text-navy-400 text-xs">
                    {event.dateNote}
                  </p>
                </div>
              </li>

              {/* VENUES */}
              <li className="flex gap-4">
                {/* <MapPin
                  size={20}
                  className="text-navy-700 mt-0.5 shrink-0"
                /> */}

                <div>
                  {/* <p className="font-semibold text-navy-900 mb-2">
                    Venues
                  </p> */}

                  {/* DAY 1 */}
                  {/* <div className="mb-3">
                    <p className="text-xs font-semibold text-navy-500">
                      Day 1 · 12 Nov
                    </p>

                    <a
                      href={schedule[0].venue.map}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-navy-600 text-sm font-medium hover:text-gold-600 transition-colors"
                    >
                      {schedule[0].venue.name}
                    </a>

                    <p className="text-navy-400 text-xs">
                      {schedule[0].venue.activity}
                    </p>
                  </div> */}

                  {/* DAYS 2 & 3 */}
                  {/* <div>
                    <p className="text-xs font-semibold text-navy-500">
                      Days 2 & 3 · 13–14 Nov
                    </p>

                    <a
                      href={schedule[1].venue.map}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-navy-600 text-sm font-medium hover:text-gold-600 transition-colors"
                    >
                      {schedule[1].venue.name}
                    </a>

                    <p className="text-navy-400 text-xs">
                      Stakeholder Engagement & Gala
                    </p>
                  </div> */}
                </div>
              </li>

              <li className="flex gap-4">
                <Users
                  size={20}
                  className="text-navy-700 mt-0.5 shrink-0"
                />

                <div>
                  <p className="font-semibold text-navy-900">
                    Who Should Attend?
                  </p>

                  <p className="text-navy-600 text-sm">
                    AMANO Alumni, industry professionals, students and all
                    well-wishers.
                  </p>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Registration */}
          <motion.div
            variants={fadeUp}
            className="bg-navy-900 text-white rounded-2xl p-8 flex flex-col justify-between"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.25 }}
          >
            <div>
              <p className="text-gold-400 font-semibold text-xs tracking-wide mb-3">
                REGISTRATION
              </p>

              <h3 className="text-2xl font-bold mb-1">
                Secure Your Spot
              </h3>

              <h3 className="text-2xl font-bold text-gold-500 mb-4">
                Today!
              </h3>

              <p className="text-navy-200 text-sm">
                {event.registration}
              </p>
            </div>

            <motion.button
              type="button"
              onClick={openRegistration}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 inline-flex items-center justify-center gap-2 bg-gold-500 text-navy-900 font-semibold px-6 py-3 rounded-full hover:bg-gold-400 transition-colors"
            >
              Register Now <ArrowRight size={16} />
            </motion.button>
          </motion.div>

          {/* Venue & Schedule */}
          <motion.div variants={fadeUp}>
            {/* <p className="text-gold-600 font-semibold text-sm mb-4">
              <span className="eyebrow-rule" />Venue &amp; Schedule
            </p> */}

            <div className="flex gap-4 mb-6">
              {/* <MapPin
                size={20}
                className="text-navy-700 mt-0.5 shrink-0"
              /> */}

              <div>
                {/* <p className="font-semibold text-navy-900">
                  Convention Venues
                </p> */}

                {/* DAY 1 VENUE */}
                {/* <div className="mt-2">
                  <p className="text-xs font-semibold text-navy-500">
                    Day 1 · Meet and Greet
                  </p>

                  <a
                    href={schedule[0].venue.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-navy-600 text-sm hover:text-gold-600 transition-colors"
                  >
                    {schedule[0].venue.name}
                  </a>

                  <p className="text-navy-400 text-xs">
                    {schedule[0].venue.area}
                  </p>

                  <a
                    href={schedule[0].venue.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-gold-600 hover:text-gold-700"
                  >
                    View on Google Maps →
                  </a>
                </div> */}

                {/* DAYS 2 & 3 VENUE */}
                {/* <div className="mt-4">
                  <p className="text-xs font-semibold text-navy-500">
                    Days 2 &amp; 3
                  </p>

                  <a
                    href={schedule[1].venue.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-navy-600 text-sm hover:text-gold-600 transition-colors"
                  >
                    {schedule[1].venue.name}
                  </a>

                  <p className="text-navy-400 text-xs">
                    {schedule[1].venue.area}
                  </p>

                  <a
                    href={schedule[1].venue.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-1 text-[11px] font-semibold text-gold-600 hover:text-gold-700"
                  >
                    View on Google Maps →
                  </a>
                </div> */}
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              <Clock
                size={20}
                className="text-navy-700 mt-0.5 shrink-0"
              />

              <div>
                <p className="font-semibold text-navy-900">
                  Convention Schedule
                </p>

                <p className="text-navy-400 text-xs mb-3">
                  {event.dateNote} on Day 1
                </p>
              </div>
            </div>

            <motion.ul
              className="space-y-4 pl-9 text-sm"
              variants={staggerContainer}
            >
              {schedule.map((s) => (
                <motion.li
                  key={s.day}
                  variants={fadeUp}
                  className="border-b border-navy-100 pb-3 last:border-0"
                >
                  <div className="grid grid-cols-[auto_1fr] gap-3">
                    <span className="text-navy-500 whitespace-nowrap">
                      {s.date}
                    </span>

                    <div>
                      <p className="text-navy-800 font-medium">
                        {s.activity}
                      </p>

                      <a
                        href={s.venue.map}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-1 text-xs text-navy-500 hover:text-gold-600 transition-colors"
                      >
                        <MapPin size={12} />
                        {s.venue.name}
                      </a>

                      <p className="text-[11px] text-navy-400">
                        {s.venue.area}
                      </p>

                      <a
                        href={s.venue.map}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-1 text-[11px] font-semibold text-gold-600 hover:text-gold-700"
                      >
                        View on Google Maps →
                      </a>
                    </div>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  )
}