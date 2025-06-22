'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type ToastContextType = {
  show: (msg: string) => void
  message: string | null
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)

  const show = (msg: string) => {
    setMessage(msg)
  }

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  return (
    <ToastContext.Provider value={{ show, message }}>
      {children}
      {message && (
        <div className="fixed bottom-4 right-4 bg-black text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
