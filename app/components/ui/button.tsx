'use client'

import { ButtonHTMLAttributes } from 'react'

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ${props.className || ''}`}
    />
  )
}
