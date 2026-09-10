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

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <RegistrationModalProvider>
      <div className="min-h-screen flex flex-col">
        <ScrollToTop />
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/convention" element={<Convention />} />
            <Route path="/speakers" element={<Speakers />} />
            <Route path="/venue" element={<Venue />} />
            <Route path="/faqs" element={<FAQs />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <RegistrationModal />
    </RegistrationModalProvider>
  )
}
