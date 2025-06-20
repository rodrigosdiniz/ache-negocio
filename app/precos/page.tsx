'use client'

import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

const planos = [
  {
    nome: 'Plano Básico',
    preco: '$8,00/mês',
    priceId: 'price_1RYaxMDGX3huEh4zJhiwZNSH',
    destaque: false,
    descricao: 'Ideal para pequenos negócios que estão começando.',
    beneficios: [
      'Cadastro de até 10 produtos',
      'Suporte por e-mail',
      'Aparece nas buscas locais'
    ]
  },
  {
    nome: 'Plano Profissional',
    preco: '$12,00/mês',
    priceId: 'price_1RYaxNDGX3huEh4zt1pNbM9k',
    destaque: true,
    descricao: 'Recomendado para empresas com presença consolidada.',
    beneficios: [
      'Cadastro ilimitado de produtos',
      'Suporte via WhatsApp',
      'Anúncio em destaque',
      'Integração com redes sociais'
    ]
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
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">Escolha seu plano</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {planos.map((plano) => (
          <div
            key={plano.priceId}
            className={`rounded-2xl border p-6 shadow-md flex flex-col justify-between transition-all ${
              plano.destaque
                ? 'border-blue-600 bg-blue-50'
                : 'bg-white'
            }`}
          >
            <div>
              <h2 className="text-2xl font-bold mb-2">{plano.nome}</h2>
              <p className="text-gray-700 mb-4">{plano.descricao}</p>
              <p className="text-3xl font-extrabold text-blue-600 mb-4">{plano.preco}</p>

              <ul className="space-y-2 mb-6">
                {plano.beneficios.map((beneficio, i) => (
                  <li key={i} className="flex items-center text-gray-800">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    {beneficio}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => iniciarCheckout(plano.priceId)}
              disabled={loadingId === plano.priceId}
              className={`mt-4 w-full py-3 px-6 text-white rounded-xl font-semibold transition-all ${
                plano.destaque
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-700 hover:bg-gray-800'
              } ${loadingId === plano.priceId ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loadingId === plano.priceId ? 'Processando...' : 'Assinar'}
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}
