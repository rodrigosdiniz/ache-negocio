'use client'

import { useState } from 'react'

interface CheckoutButtonProps {
  priceId: string
}

export default function CheckoutButton({ priceId }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ priceId })
      })

      const data = await res.json()

      if (data?.url) {
        window.location.href = data.url // redireciona para o Stripe Checkout
      } else {
        alert('Erro ao criar sessão de checkout.')
      }
    } catch (err) {
      console.error('Erro ao redirecionar:', err)
      alert('Erro inesperado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {loading ? 'Redirecionando...' : 'Assinar agora'}
    </button>
  )
}
