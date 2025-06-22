'use client'

import { TextareaHTMLAttributes } from 'react'

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full border border-gray-300 rounded px-3 py-2 ${props.className || ''}`}
    />
  )
}
