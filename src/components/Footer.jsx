
import { NavLink } from 'react-router-dom'
import {
  Anchor,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Hotel,
} from 'lucide-react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/convention', label: 'Convention' },
  { to: '/speakers', label: 'Speakers' },
  { to: '/venue', label: 'Venue' },
  { to: '/faqs', label: 'FAQs' },
  { to: '/hotels', label: 'Hotel Booking', icon: Hotel },
]

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-navy-100">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 flex flex-col md:flex-row md:items-start md:justify-between gap-10">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/amano-logo.png"
            alt="AMANO logo"
            className="w-11 h-11 object-contain shrink-0"
          />

          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold text-white">
              AMANO
            </span>

            <span className="block text-[10px] tracking-wider">
              Alumni of Maritime Academy
              <br />
              of Nigeria, Oron
            </span>
          </span>
        </div>

        {/* Footer Navigation */}
        <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {links.map((link) => {
            const Icon = link.icon

            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? 'text-gold-400'
                      : 'hover:text-white'
                  }`
                }
              >
                {Icon && <Icon size={15} />}
                {link.label}
              </NavLink>
            )
          })}
        </nav>

        {/* Social Links and Tagline */}
        <div className="flex flex-col gap-3 md:items-end">
          <div className="flex items-center gap-4">
            <span className="text-sm">Follow Us</span>

            {[Facebook, Instagram, Linkedin, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 rounded-full bg-navy-700 flex items-center justify-center hover:bg-gold-500 hover:text-navy-900 transition-colors"
                aria-label="Social link"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>

          <p className="font-display italic text-gold-400 text-sm">
            Converging For Excellence
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-navy-800 py-5 text-center text-xs text-navy-300">
        © 2026 AMANO. All rights reserved.
      </div>
    </footer>
  )
}
