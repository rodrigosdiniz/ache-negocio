'use client'

import { createContext, useContext } from 'react'
import { useToast } from '@/components/ui/use-toast'

type ToastContextType = {
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
})

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const { showToast } = useToast()

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToastContext = () => useContext(ToastContext)
