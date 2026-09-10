import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const RegistrationModalContext = createContext(null)

export function RegistrationModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close])

  return (
    <RegistrationModalContext.Provider value={value}>
      {children}
    </RegistrationModalContext.Provider>
  )
}

export function useRegistrationModal() {
  const ctx = useContext(RegistrationModalContext)
  if (!ctx) {
    throw new Error('useRegistrationModal must be used within a RegistrationModalProvider')
  }
  return ctx
}
