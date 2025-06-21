'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Star } from 'lucide-react'

export default function AdminAvaliacoesPage() {
  const supabase = createClientComponentClient()
  const [avaliacoes, setAvaliacoes] = useState<any[]>([])

  useEffect(() => {
    const carregar = async () => {
      const { data } = await supabase
        .from('avaliacoes')
        .select('*, empresas(nome)')
        .order('created_at', { ascending: false })

      setAvaliacoes(data || [])
    }

    carregar()
  }, [])

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Todas as Avaliações</h1>

      <div className="space-y-4">
        {avaliacoes.map((a) => (
          <div key={a.id} className="border p-4 rounded-md shadow-sm bg-white">
            <div className="text-sm text-gray-500 mb-1">{new Date(a.created_at).toLocaleString()}</div>
            <div className="font-semibold">{a.nome_usuario} avaliou <strong>{a.empresas?.nome}</strong></div>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={16} className={i <= a.nota ? 'text-yellow-500' : 'text-gray-300'} />
              ))}
            </div>
            <p>{a.comentario}</p>
            {a.resposta_dono && (
              <div className="mt-2 text-sm text-blue-700 bg-blue-50 border-l-4 border-blue-500 p-2">
                Resposta do dono: {a.resposta_dono}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
