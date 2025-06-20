// components/BotaoUpgrade.tsx
'use client'

import { useState } from 'react'

interface Props {
  planoAtual: string
  userId: string
  empresaId: string
}

const opcoes = [
  { nome: 'essencial', preco: 'R$29/mês' },
  { nome: 'profissional', preco: 'R$59/mês' },
  { nome: 'elite', preco: 'R$119/mês' },
]

export default function BotaoUpgrade({ planoAtual, userId, empresaId }: Props) {
  const [carregando, setCarregando] = useState('')

  const handleUpgrade = async (plano: string) => {
    setCarregando(plano)
    const resposta = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plano, user_id: userId, empresa_id: empresaId })
    })
    const { url } = await resposta.json()
    if (url) window.location.href = url
    else alert('Erro ao redirecionar para pagamento')
    setCarregando('')
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Plano atual: <strong>{planoAtual}</strong></p>
      {opcoes.map(({ nome, preco }) => (
        <button
          key={nome}
          disabled={nome === planoAtual || carregando === nome}
          onClick={() => handleUpgrade(nome)}
          className={`px-4 py-2 rounded text-white w-full ${
            nome === planoAtual ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {carregando === nome ? 'Carregando...' : `Assinar plano ${nome} (${preco})`}
        </button>
      ))}
    </div>
  )
}
