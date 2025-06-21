'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

const PLANOS = [
  { nome: 'Essencial', preco: 'R$29/mês', stripePriceId: 'price_1SAESSD29', beneficios: ['3 empresas', 'Suporte por e-mail'] },
  { nome: 'Profissional', preco: 'R$59/mês', stripePriceId: 'price_1SAPROD59', beneficios: ['10 empresas', 'Suporte prioritário'] },
  { nome: 'Elite', preco: 'R$119/mês', stripePriceId: 'price_1SAELITE119', beneficios: ['Empresas ilimitadas', 'Suporte premium'] },
]

export default function UpgradePage() {
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const carregarUser = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      if (data.user) setUserId(data.user.id)
    }
    carregarUser()
  }, [])

  const iniciarCheckout = async (priceId: string) => {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId, userId })
    })
    const { url } = await res.json()
    window.location.href = url
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Escolha seu Plano</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {PLANOS.map((plano) => (
          <div key={plano.nome} className="border rounded-xl p-6 shadow hover:shadow-md">
            <h2 className="text-xl font-bold mb-2">{plano.nome}</h2>
            <p className="text-2xl text-blue-600 mb-4">{plano.preco}</p>
            <ul className="mb-4 list-disc list-inside text-sm">
              {plano.beneficios.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
            <button
              onClick={() => iniciarCheckout(plano.stripePriceId)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
            >
              Assinar
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}
