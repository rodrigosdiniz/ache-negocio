// context/toast-context.tsx
'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import Toast from '@/components/Toast'

interface ToastContextProps {
  showToast: (message: string, type?: 'success' | 'error') => void
}

const ToastContext = createContext<ToastContextProps>({
  showToast: () => {}
})

export const useToast = () => useContext(ToastContext)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('')
  const [type, setType] = useState<'success' | 'error'>('success')

  const showToast = (msg: string, tipo: 'success' | 'error' = 'success') => {
    setMessage(msg)
    setType(tipo)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message && <Toast message={message} type={type} onClose={() => setMessage('')} />}
    </ToastContext.Provider>
  )
}
