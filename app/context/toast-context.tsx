// app/context/toast-context.tsx
'use client'

import { createContext, useContext } from 'react'
import { useToast } from '@/components/ui/use-toast'

const ToastContext = createContext<ReturnType<typeof useToast> | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toast = useToast()

  return (
    <ToastContext.Provider value={toast}>
      {toast.ToastComponent()}
      {children}
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext deve ser usado dentro do ToastProvider')
  }
  return context
}
