
import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import RegistrationModal from './components/RegistrationModal.jsx'
import { RegistrationModalProvider } from './context/RegistrationModalContext.jsx'

import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Convention from './pages/Convention.jsx'
import Speakers from './pages/Speakers.jsx'
import Venue from './pages/Venue.jsx'
import FAQs from './pages/FAQs.jsx'
import Gallerie from './pages/Gallerie.jsx'
import PhotographerLogin from './pages/PhotographerLogin.jsx'
import PhotographerDashboard from './pages/PhotographerDashboard.jsx'
import HotelBooking from './pages/HotelBooking.jsx'

import WelcomeNote from './components/WelcomeNote'

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default function App() {
  const location = useLocation()

  const isPhotographerLogin =
    location.pathname === '/photographer/login'

  return (
    <RegistrationModalProvider>
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />

        {!isPhotographerLogin && <Navbar />}

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/convention" element={<Convention />} />
            <Route path="/speakers" element={<Speakers />} />
            <Route path="/venue" element={<Venue />} />
            <Route path="/faqs" element={<FAQs />} />

            {/* Existing gallery — unchanged */}
            <Route path="/gallerie" element={<Gallerie />} />

            {/* Public hotel booking portal */}
            <Route path="/hotels" element={<HotelBooking />} />

            <Route
              path="/photographer/login"
              element={<PhotographerLogin />}
            />
            <Route
              path="/photographer/dashboard"
              element={<PhotographerDashboard />}
            />
          </Routes>
        </main>

        {!isPhotographerLogin && <Footer />}
      </div>

      <RegistrationModal />
    </RegistrationModalProvider>
  )
}
