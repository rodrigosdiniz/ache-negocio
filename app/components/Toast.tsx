// components/Toast.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

interface ToastProps {
  message: string
  type?: 'success' | 'error'
  onClose: () => void
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          className={`fixed bottom-5 right-5 px-4 py-2 rounded shadow-md text-white text-sm z-50 flex items-center gap-2
            ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
        >
          {type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <XCircle className="w-5 h-5" />
          )}
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
