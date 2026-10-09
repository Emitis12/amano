
import { useState } from 'react'

export default function Gallerie() {
  const [activeTab, setActiveTab] = useState('all')

  const tabs = [
    { label: 'All Photos', value: 'all' },
    { label: 'Day 1 — Meet & Greet', value: 'day1' },
    { label: 'Day 2 — Convention', value: 'day2' },
    { label: 'Day 3 — Gala', value: 'day3' },
  ]

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="bg-[#002B5C] text-white py-16 px-6 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-400 mb-4">
          AMANO National Convention 2026
        </p>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Convention Gallery
        </h1>

        <p className="max-w-2xl mx-auto text-gray-200">
          Relive the moments, connections, and memories of our convention.
          Event photographs will appear here as they are uploaded.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
                activeTab === tab.value
                  ? 'bg-[#002B5C] text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-[#002B5C]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white py-20 px-6 text-center">
          <div className="text-5xl mb-5" aria-hidden="true">
            📸
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            The memories are coming
          </h2>

          <p className="text-gray-500 max-w-lg mx-auto">
            Photographs from the AMANO National Convention will appear here.
            Check back during the event to view newly uploaded pictures.
          </p>
        </div>
      </div>
    </section>
  )
}