import {
  MapPin,
  Clock,
  Plane,
  Bus,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'

import { event, schedule } from '../data/event.js'
import { useRegistrationModal } from '../context/RegistrationModalContext.jsx'
import ConventionMap from '../components/ConventionMap.jsx'

const gettingThere = [
  {
    icon: Plane,
    title: 'From Murtala Muhammed International Airport',
    body:
      'Murtala Muhammed International Airport (LOS) is the closest major airport to the convention venues. From the airport, take a taxi, ride-hailing service or arranged airport transfer toward Victoria Island.',
    direction:
      'Follow the airport road toward Lagos Island and Victoria Island. Continue toward Victoria Island and follow signs for Eko Hotels & Suites.',
    map: 'https://www.google.com/maps/dir/?api=1&origin=Murtala+Muhammed+International+Airport+Lagos&destination=Eko+Hotels+%26+Suites+Victoria+Island+Lagos',
  },
  {
    icon: Bus,
    title: 'From Obalende Motor Park',
    body:
      'Obalende is one of the closest major transport points to Victoria Island. From the motor park, take a bus, taxi or ride-hailing service heading toward Victoria Island, Eko Hotel or Bar Beach.',
    direction:
      'Head from Obalende toward Victoria Island and continue toward Eko Hotel Roundabout. Eko Hotels & Suites is located on Adetokunbo Ademola Street.',
    map: 'https://www.google.com/maps/dir/?api=1&origin=Obalende+Bus+Park+Lagos&destination=Eko+Hotels+%26+Suites+Victoria+Island+Lagos',
  },
]

const venues = [
  {
    name: 'Eko Hotels & Suites',
    area: 'Victoria Island, Lagos',
    activity: 'Day 1 · Meet and Greet',
    map: 'https://www.google.com/maps/search/?api=1&query=Eko+Hotel+%26+Suites+Victoria+Island+Lagos',
  },
  {
    name: 'Oriental Hotels & Suites',
    area: 'Victoria Island, Lagos',
    activity:
      'Days 2 & 3 · Stakeholder Engagement & Gala and Award Night',
    map: 'https://www.google.com/maps/search/?api=1&query=Oriental+Hotel+Victoria+Island+Lagos',
  },
]

export default function Venue() {
  const { open: openRegistration } = useRegistrationModal()

  return (
    <div>
      {/* HERO */}
      <section className="bg-navy-900 text-white pt-32 pb-16 md:pt-36 md:pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold-400 font-semibold text-sm mb-3">
            <span className="eyebrow-rule" />
            Venue &amp; Schedule
          </p>

          <h1 className="text-4xl md:text-5xl font-bold max-w-3xl">
            AMANO National Convention 2026
          </h1>

          <p className="mt-4 flex items-center gap-2 text-navy-200">
            <MapPin size={18} className="text-gold-500" />
            Victoria Island, Lagos, Nigeria
          </p>

          <p className="mt-5 text-navy-200 max-w-2xl leading-relaxed">
            The 2026 AMANO National Convention will take place across two
            premium venues in Victoria Island, Lagos.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="section-pad bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">

          {/* LEFT COLUMN */}
          <div>
            {/* EKO HOTEL IMAGE */}
            <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-8">
              <img
                src="https://www.ekohotels.com/assets/img/gallery_img8.jpg"
                alt="Eko Hotels & Suites swimming pool"
                className="w-full h-full object-cover"
              />
            </div>

            {/* FEATURED VENUE */}
            <div>
              <p className="text-gold-600 font-semibold text-sm mb-3">
                <span className="eyebrow-rule" />
                Day 1 Venue
              </p>

              <h2 className="text-2xl font-bold text-navy-900 mb-2">
                Eko Hotels &amp; Suites
              </h2>

              <p className="text-navy-500 text-sm flex items-center gap-2">
                <MapPin size={15} className="text-gold-500" />
                Victoria Island, Lagos
              </p>

              <p className="text-navy-600 text-sm leading-relaxed mt-4">
                Day 1 of the convention, the Meet and Greet, will be hosted
                at Eko Hotels &amp; Suites.
              </p>

              <a
                href={venues[0].map}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-navy-900 hover:text-gold-600 transition-colors"
              >
                <MapPin size={16} className="text-gold-500" />
                View Eko Hotel on Google Maps
                <ExternalLink size={14} />
              </a>
            </div>

            {/* GETTING THERE */}
            <div className="mt-12">
              <p className="text-gold-600 font-semibold text-sm mb-3">
                <span className="eyebrow-rule" />
                Getting There
              </p>

              <h2 className="text-2xl font-bold text-navy-900 mb-6">
                How to get to the venue
              </h2>

              <div className="space-y-7">
                {gettingThere.map(
                  ({ icon: Icon, title, body, direction, map }) => (
                    <div
                      key={title}
                      className="flex gap-4"
                    >
                      <span className="w-11 h-11 rounded-full bg-navy-100 flex items-center justify-center shrink-0">
                        <Icon
                          size={18}
                          className="text-navy-800"
                        />
                      </span>

                      <div>
                        <p className="font-semibold text-navy-900">
                          {title}
                        </p>

                        <p className="text-navy-600 text-sm leading-relaxed mt-1">
                          {body}
                        </p>

                        <div className="mt-3 p-3 rounded-lg bg-navy-50 border border-navy-100">
                          <p className="text-xs font-semibold text-navy-900 mb-1">
                            Directions
                          </p>

                          <p className="text-xs text-navy-600 leading-relaxed">
                            {direction}
                          </p>
                        </div>

                        <a
                          href={map}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-3 text-xs font-semibold text-navy-800 hover:text-gold-600 transition-colors"
                        >
                          <MapPin
                            size={14}
                            className="text-gold-500"
                          />

                          Open directions in Google Maps

                          <ExternalLink size={12} />
                        </a>
                        
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          

          {/* RIGHT COLUMN */}
          <div>
            <p className="text-gold-600 font-semibold text-sm mb-3">
              <span className="eyebrow-rule" />
              Convention Programme
            </p>

            <h2 className="text-2xl font-bold text-navy-900 mb-2">
              Convention Schedule
            </h2>

            <p className="text-navy-400 text-sm mb-8">
              {event.dateNote} on Day 1
            </p>

            {/* SCHEDULE */}
            <ol className="relative border-l-2 border-navy-100 pl-8 space-y-10">
              {schedule.map((s) => (
                <li
                  key={s.day}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <span className="absolute -left-[41px] top-0.5 w-5 h-5 rounded-full bg-gold-500 border-4 border-white" />

                  {/* Day */}
                  <p className="flex items-center gap-2 text-sm text-navy-500 mb-2">
                    <Clock size={14} />

                    {s.day} &middot; {s.date}
                  </p>

                  {/* Activity */}
                  <p className="font-semibold text-navy-900 text-lg">
                    {s.activity}
                  </p>

                  {/* Venue + Map */}
                  <a
                    href={s.venue.map}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 text-sm font-medium text-navy-600 hover:text-gold-600 transition-colors"
                  >
                    <MapPin
                      size={16}
                      className="text-gold-500 shrink-0"
                    />

                    <span className="underline-offset-4 hover:underline">
                      {s.venue.name}
                    </span>

                    <ExternalLink
                      size={13}
                      className="opacity-60"
                    />
                  </a>

                  {/* Area */}
                  <p className="text-xs text-navy-400 mt-1 ml-6">
                    {s.venue.area}
                  </p>
                </li>
              ))}
            </ol>

            {/* VENUE CARDS */}
            <div className="mt-12 space-y-4">
              {venues.map((venue) => (
                <div
                  key={venue.name}
                  className="rounded-xl border border-navy-100 bg-navy-50 p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                      <MapPin
                        size={18}
                        className="text-gold-600"
                      />
                    </span>

                    <div className="flex-1">
                      <h3 className="font-bold text-navy-900">
                        {venue.name}
                      </h3>

                      <p className="text-xs text-navy-500 mt-1">
                        {venue.area}
                      </p>

                      <p className="text-xs text-gold-600 font-medium mt-2">
                        {venue.activity}
                      </p>

                      <a
                        href={venue.map}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-navy-800 hover:text-gold-600 transition-colors"
                      >
                        <MapPin size={13} />
                        Get directions
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
<div className="mt-10">
  <div className="mb-5">
    <p className="text-gold-600 font-semibold text-sm mb-2">
      <span className="eyebrow-rule" />
      Interactive Map
    </p>

    <h3 className="text-2xl font-bold text-navy-900">
      Find Your Way to AMANOCON 2026
    </h3>

    <p className="text-sm text-navy-500 mt-2 max-w-2xl">
      Explore the convention locations and key arrival points across Lagos.
      Use the map to understand the route before you travel.
    </p>
  </div>

  <ConventionMap />
</div>
        </div>
      </section>

      {/* ARRIVING IN LAGOS */}
      <section className="section-pad bg-navy-50">
        <div className="max-w-7xl mx-auto">

          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-gold-600 font-semibold text-sm mb-3">
              <span className="eyebrow-rule" />
              Plan Your Journey
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-navy-900">
              Arriving in Lagos?
            </h2>

            <p className="text-navy-500 text-sm mt-3">
              Whether you are flying into Lagos or arriving by road,
              plan your journey ahead of the convention.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {/* AIRPORT */}
            <div className="bg-white rounded-2xl p-6 border border-navy-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-11 h-11 rounded-full bg-navy-100 flex items-center justify-center">
                  <Plane
                    size={19}
                    className="text-navy-800"
                  />
                </span>

                <div>
                  <h3 className="font-bold text-navy-900">
                    Murtala Muhammed International Airport
                  </h3>

                  <p className="text-xs text-navy-400">
                    LOS · Lagos
                  </p>
                </div>
              </div>

              <p className="text-sm text-navy-600 leading-relaxed">
                From Murtala Muhammed International Airport, travel
                toward Lagos Island and Victoria Island. Allow extra
                travel time because Lagos traffic conditions can vary.
              </p>

              <a
                href="https://www.google.com/maps/dir/?api=1&origin=Murtala+Muhammed+International+Airport+Lagos&destination=Eko+Hotels+%26+Suites+Victoria+Island+Lagos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-navy-900 hover:text-gold-600 transition-colors"
              >
                <MapPin
                  size={15}
                  className="text-gold-500"
                />

                Get airport directions

                <ArrowRight size={15} />
              </a>
            </div>

            {/* MOTOR PARK */}
            <div className="bg-white rounded-2xl p-6 border border-navy-100">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-11 h-11 rounded-full bg-navy-100 flex items-center justify-center">
                  <Bus
                    size={19}
                    className="text-navy-800"
                  />
                </span>

                <div>
                  <h3 className="font-bold text-navy-900">
                    Obalende Motor Park
                  </h3>

                  <p className="text-xs text-navy-400">
                    Obalende, Lagos Island
                  </p>
                </div>
              </div>

              <p className="text-sm text-navy-600 leading-relaxed">
                From Obalende, take a bus, taxi or ride-hailing
                service toward Victoria Island, Eko Hotel or Bar Beach.
                Continue toward Eko Hotel Roundabout.
              </p>

              <a
                href="https://www.google.com/maps/dir/?api=1&origin=Obalende+Bus+Park+Lagos&destination=Eko+Hotels+%26+Suites+Victoria+Island+Lagos"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-navy-900 hover:text-gold-600 transition-colors"
              >
                <MapPin
                  size={15}
                  className="text-gold-500"
                />

                Get directions from Obalende

                <ArrowRight size={15} />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad bg-navy-900 text-center">
        <div className="max-w-2xl mx-auto">

          <p className="text-gold-400 font-semibold text-sm mb-3">
            AMANOCON 2026
          </p>

          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            See you in Lagos
          </h2>

          <p className="text-navy-200 text-sm leading-relaxed mb-7">
            Join AMANO alumni, maritime professionals, students and
            well-wishers for three days of connection, engagement and
            celebration.
          </p>

          <button
            type="button"
            onClick={openRegistration}
            className="inline-flex items-center gap-2 bg-gold-500 text-navy-900 font-semibold px-7 py-3.5 rounded-full hover:bg-gold-400 hover:-translate-y-0.5 transition-all duration-300"
          >
            Register Now
            <ArrowRight size={18} />
          </button>

        </div>
      </section>
    </div>
  )
}