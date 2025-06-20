'use client'

import { useState } from 'react'

const planos = [
  {
    nome: 'Plano Básico',
    preco: '$8,00/mês',
    priceId: 'price_1RYaxMDGX3huEh4zJhiwZNSH',
    descricao: 'Ideal para pequenos negócios que estão começando.'
  },
  {
    nome: 'Plano Profissional',
    preco: '$12,00/mês',
    priceId: 'price_1RYaxNDGX3huEh4zt1pNbM9k',
    descricao: 'Recomendado para empresas com presença consolidada.'
  }
]

export default function PaginaPrecos() {
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const iniciarCheckout = async (priceId: string) => {
    setLoadingId(priceId)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ priceId })
      })

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Erro ao redirecionar para o Stripe.')
      }
    } catch (error) {
      console.error(error)
      alert('Erro ao iniciar checkout.')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10">Escolha seu plano</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {planos.map((plano) => (
          <div
            key={plano.priceId}
            className="border rounded-xl p-6 shadow-md bg-white flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-semibold mb-2">{plano.nome}</h2>
              <p className="text-gray-700 mb-4">{plano.descricao}</p>
              <p className="text-xl font-bold">{plano.preco}</p>
            </div>
            <button
              onClick={() => iniciarCheckout(plano.priceId)}
              disabled={loadingId === plano.priceId}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
            >
              {loadingId === plano.priceId ? 'Processando...' : 'Assinar'}
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}
