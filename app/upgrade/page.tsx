'use client'

import { useEffect, useState } from 'react'
import { createCheckoutLink } from '@/lib/stripe/client'
import { Loader2 } from 'lucide-react'

interface PlanoStripe {
  nome: string
  preco: string
  descricao: string[]
  priceId: string
}

const planos: PlanoStripe[] = [
  {
    nome: 'Essencial',
    preco: 'R$ 29/mês',
    priceId: 'price_1RXeTCDGX3huEh4zJhMxUuZb',
    descricao: [
      'Até 3 empresas cadastradas',
      'Destaque nas buscas locais',
      'Suporte prioritário via email'
    ]
  },
  {
    nome: 'Profissional',
    preco: 'R$ 59/mês',
    priceId: 'price_1RXeTpDGX3huEh4zFFeRPeUv',
    descricao: [
      'Até 10 empresas cadastradas',
      'Logo personalizado',
      'Página exclusiva com link do WhatsApp'
    ]
  },
  {
    nome: 'Elite',
    preco: 'R$ 119/mês',
    priceId: 'price_1RXeUFDGX3huEh4zZnLg8dE2',
    descricao: [
      'Empresas ilimitadas',
      'Top destaque nas categorias',
      'Campanhas e impulsionamentos sob demanda'
    ]
  }
]

export default function UpgradePage() {
  const [userId, setUserId] = useState('')
  const [carregando, setCarregando] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await fetch('/api/user').then(res => res.json())
      if (data?.id) setUserId(data.id)
    }
    getUser()
  }, [])

  const assinarPlano = async (priceId: string) => {
    if (!userId) return alert('Usuário não autenticado')
    setCarregando(priceId)
    const { url } = await createCheckoutLink({ priceId, userId })
    window.location.href = url
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Escolha seu plano</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {planos.map((plano) => (
          <div key={plano.priceId} className="border rounded-xl p-6 bg-white shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-2 text-center">{plano.nome}</h2>
            <p className="text-center text-blue-600 font-bold text-lg mb-4">{plano.preco}</p>
            <ul className="mb-6 text-sm text-gray-700 space-y-1">
              {plano.descricao.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
            <button
              disabled={carregando === plano.priceId}
              onClick={() => assinarPlano(plano.priceId)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              {carregando === plano.priceId && <Loader2 className="w-4 h-4 animate-spin" />}
              Assinar
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}
