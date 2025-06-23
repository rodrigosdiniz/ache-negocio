'use client'

import { createContext, useContext, useState, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info'

interface ToastContextType {
  showToast: (msg: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)
  const [type, setType] = useState<ToastType>('info')
  const [isVisible, setIsVisible] = useState(false)

  const showToast = useCallback((msg: string, toastType: ToastType = 'info') => {
    setMessage(msg)
    setType(toastType)
    setIsVisible(true)
    setTimeout(() => setIsVisible(false), 3000)
  }, [])

  const bgColor =
    type === 'success'
      ? 'bg-green-600'
      : type === 'error'
      ? 'bg-red-600'
      : 'bg-blue-600'

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {isVisible && (
        <div className={`fixed bottom-5 right-5 px-4 py-2 rounded text-white shadow-lg z-50 ${bgColor}`} role="alert">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast deve ser usado dentro de ToastProvider')
  }
  return context
}
