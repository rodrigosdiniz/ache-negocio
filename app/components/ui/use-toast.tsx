'use client'

import { useState, useCallback } from 'react'

type ToastType = 'success' | 'error' | 'info'

export function useToast() {
  const [message, setMessage] = useState<string | null>(null)
  const [type, setType] = useState<ToastType>('info')
  const [isVisible, setIsVisible] = useState(false)

  const showToast = useCallback((msg: string, toastType: ToastType = 'info') => {
    setMessage(msg)
    setType(toastType)
    setIsVisible(true)

    setTimeout(() => {
      setIsVisible(false)
    }, 3000)
  }, [])

  const ToastComponent = () => {
    if (!isVisible) return null

    return (
      <div
        className={`fixed bottom-5 right-5 px-4 py-2 rounded text-white shadow-lg z-50 ${
          type === 'success'
            ? 'bg-green-600'
            : type === 'error'
            ? 'bg-red-600'
            : 'bg-blue-600'
        }`}
      >
        {message}
      </div>
    )
  }

  return { showToast, ToastComponent }
}
