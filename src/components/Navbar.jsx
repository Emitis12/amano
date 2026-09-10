import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Anchor, Menu, X, ArrowRight } from 'lucide-react'
import { useRegistrationModal } from '../context/RegistrationModalContext.jsx'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/convention', label: 'Convention' },
  { to: '/speakers', label: 'Speakers' },
  { to: '/venue', label: 'Venue' },
  { to: '/faqs', label: 'FAQs' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { open: openRegistration } = useRegistrationModal()

  return (
    <header className="sticky top-0 z-50 bg-navy-800 text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 shrink-0" onClick={() => setOpen(false)}>
          <img src="/amano-logo.png" alt="AMANO logo" className="w-11 h-11 object-contain" />
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold tracking-wide">AMANO</span>
            <span className="block text-[10px] tracking-wider text-navy-200">
              Alumni of Maritime Academy<br />of Nigeria, Oron
            </span>
          </span>
        </NavLink>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors pb-1 border-b-2 ${
                  isActive
                    ? 'text-gold-400 border-gold-400'
                    : 'text-navy-100 border-transparent hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          onClick={openRegistration}
          className="hidden lg:inline-flex items-center gap-2 bg-gold-500 text-navy-900 font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-gold-400 transition-colors"
        >
          Register Now <ArrowRight size={16} />
        </button>

        <button
          className="lg:hidden text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-navy-700 bg-navy-800 px-6 py-4 flex flex-col gap-4">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `text-base font-medium ${isActive ? 'text-gold-400' : 'text-navy-100'}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false)
              openRegistration()
            }}
            className="inline-flex items-center justify-center gap-2 bg-gold-500 text-navy-900 font-semibold text-sm px-5 py-3 rounded-full mt-2"
          >
            Register Now <ArrowRight size={16} />
          </button>
        </nav>
      )}
    </header>
  )
}
