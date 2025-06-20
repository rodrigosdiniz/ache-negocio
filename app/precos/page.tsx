// app/precos/page.tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const planos = [
  {
    nome: 'Plano Gratuito',
    preco: 'R$ 0,00',
    descricao: 'Para começar sem custo.',
    priceId: null
  },
  {
    nome: 'Plano Básico',
    preco: 'R$ 8,00/mês',
    descricao: 'Ideal para pequenos negócios.',
    priceId: 'price_1RYaxMDGX3huEh4zJhiwZNSH'
  },
  {
    nome: 'Plano Profissional',
    preco: 'R$ 12,00/mês',
    descricao: 'Mais vendido. Recomendado para empresas.',
    priceId: 'price_1RYaxNDGX3huEh4zt1pNbM9k',
    destaque: true
  }
]

export default function PaginaPrecos() {
  const [loading, setLoading] = useState(false)

  const iniciarCheckout = async (priceId: string | null) => {
    if (!priceId) return window.location.href = '/cadastro'
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
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
      setLoading(false)
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10">Escolha seu plano</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {planos.map((plano, i) => (
          <motion.div
            key={plano.nome}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="relative border rounded-xl p-6 shadow-md bg-white flex flex-col justify-between"
          >
            {plano.destaque && (
              <div className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-bl-xl">
                Mais vendido
              </div>
            )}
            <div>
              <h2 className="text-2xl font-semibold mb-2">{plano.nome}</h2>
              <p className="text-gray-700 mb-4">{plano.descricao}</p>
              <p className="text-xl font-bold">{plano.preco}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => iniciarCheckout(plano.priceId)}
              disabled={loading}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50"
            >
              {plano.priceId ? 'Assinar' : 'Começar grátis'}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </main>
  )
}
