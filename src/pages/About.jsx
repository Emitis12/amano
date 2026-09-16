import { Anchor, Target, Eye, HeartHandshake, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    body: 'To unite graduates of the Maritime Academy of Nigeria, Oron in a lifelong network that advances careers, shares expertise, and strengthens the Nigerian maritime industry.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    body: 'A maritime sector where every AMANO alumnus, wherever they serve, has the connections and support to lead with confidence and integrity.',
  },
  {
    icon: HeartHandshake,
    title: 'Our Community',
    body: 'Thousands of captains, engineers, logistics leaders and educators who trained at Oron and continue to look out for one another long after graduation.',
  },
]

export default function About() {
  return (
    <div>
      <section className="bg-navy-900 text-white pt-32 pb-16 md:pt-36 md:pb-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-gold-400 font-semibold text-sm mb-3">
            <span className="eyebrow-rule" />About AMANO
          </p>
          <h1 className="text-4xl md:text-5xl font-bold max-w-2xl">
            The alumni network behind Nigeria's maritime industry
          </h1>
          <p className="mt-5 max-w-2xl text-navy-200 leading-relaxed">
            AMANO — the Alumni of Maritime Academy of Nigeria, Oron — connects
            graduates across every era of the Academy, from captains and chief
            engineers to logistics executives and maritime educators.
          </p>
        </div>
      </section>

      <section className="section-pad bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {values.map(({ icon: Icon, title, body }) => (
            <div key={title} className="p-8 rounded-2xl bg-navy-50 border border-navy-100">
              <span className="w-12 h-12 rounded-full bg-navy-800 flex items-center justify-center mb-5">
                <Icon size={20} className="text-gold-500" />
              </span>
              <h2 className="text-xl font-bold text-navy-900 mb-3">{title}</h2>
              <p className="text-navy-600 leading-relaxed text-sm">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-pad bg-navy-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gold-600 font-semibold text-sm mb-3">
              <span className="eyebrow-rule" />Why the Academy Matters
            </p>
            <h2 className="text-3xl font-bold text-navy-900 mb-4">
              A legacy of seafaring excellence
            </h2>
            <p className="text-navy-700 leading-relaxed mb-4">
              Since its founding, the Maritime Academy of Nigeria, Oron has
              trained generations of officers, engineers and maritime
              professionals who now serve on vessels, in ports, and across the
              logistics and energy sectors — both in Nigeria and abroad.
            </p>
            <p className="text-navy-700 leading-relaxed">
              AMANO exists to keep that legacy connected: helping alumni find
              each other, mentor students still at the Academy, and speak with
              one voice on the issues that shape Nigerian maritime policy.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-navy-900 flex items-center justify-center">
            <Anchor size={120} className="text-gold-500/70" />
          </div>
        </div>
      </section>

      <section className="section-pad bg-navy-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Be part of the reconnection</h2>
          <p className="text-navy-200 mb-8">
            Join fellow alumni at the AMANO National Convention this November
            in Lagos.
          </p>
          <Link
            to="/convention"
            className="inline-flex items-center gap-2 bg-gold-500 text-navy-900 font-semibold px-7 py-3.5 rounded-full hover:bg-gold-400 transition-colors"
          >
            See Convention Details <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
