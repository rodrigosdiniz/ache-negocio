// context/ToastContext.tsx
'use client'

import { createContext, useContext, useState } from 'react'

type ToastContextType = {
  show: (message: string, type?: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextType>({
  show: () => {},
})

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('')
  const [visible, setVisible] = useState(false)
  const [type, setType] = useState<'success' | 'error' | 'info'>('info')

  const show = (msg: string, t: 'success' | 'error' | 'info' = 'info') => {
    setMessage(msg)
    setType(t)
    setVisible(true)
    setTimeout(() => setVisible(false), 3000)
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {visible && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded text-white shadow-md z-50
          ${type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}>
          {message}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
