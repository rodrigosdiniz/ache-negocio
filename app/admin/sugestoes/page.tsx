'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Check, X, Loader2 } from 'lucide-react'

const EMAIL_ADMIN = 'contato@achenegocio.com.br'

export default function AdminSugestoesPage() {
  const supabase = createClientComponentClient()
  const [sugestoes, setSugestoes] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [verificando, setVerificando] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState<'pendente' | 'aprovado' | 'rejeitado'>('pendente')

  useEffect(() => {
    const verificarAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const email = session?.user?.email
      setIsAdmin(email === EMAIL_ADMIN)
      setVerificando(false)
    }
    verificarAdmin()
  }, [])

  const carregarSugestoes = async () => {
    setCarregando(true)
    const { data } = await supabase
      .from('sugestoes')
      .select('*')
      .eq('status', filtroStatus)
      .order('criado_em', { ascending: false })
    setSugestoes(data || [])
    setCarregando(false)
  }

  useEffect(() => {
    if (isAdmin) carregarSugestoes()
  }, [isAdmin, filtroStatus])

  const aprovarSugestao = async (sugestao: any) => {
    const tabela = sugestao.tipo === 'cidade' ? 'cidades' : 'categorias'
    await supabase.from(tabela).insert({ nome: sugestao.valor })
    await supabase.from('sugestoes').update({ status: 'aprovado' }).eq('id', sugestao.id)
    carregarSugestoes()
  }

  const rejeitarSugestao = async (id: string) => {
    await supabase.from('sugestoes').update({ status: 'rejeitado' }).eq('id', id)
    carregarSugestoes()
  }

  if (verificando) return <div className="p-8">Verificando permissões...</div>
  if (!isAdmin) return <div className="p-8 text-red-600 font-semibold">Acesso restrito.</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sugestões</h1>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setFiltroStatus('pendente')} className={`px-3 py-1 rounded ${filtroStatus === 'pendente' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
          Pendentes
        </button>
        <button onClick={() => setFiltroStatus('aprovado')} className={`px-3 py-1 rounded ${filtroStatus === 'aprovado' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}>
          Aprovadas
        </button>
        <button onClick={() => setFiltroStatus('rejeitado')} className={`px-3 py-1 rounded ${filtroStatus === 'rejeitado' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>
          Rejeitadas
        </button>
      </div>

      {carregando ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin w-6 h-6 text-gray-600" />
        </div>
      ) : sugestoes.length === 0 ? (
        <p className="text-gray-600">Nenhuma sugestão encontrada.</p>
      ) : (
        <ul className="divide-y">
          {sugestoes.map((s) => (
            <li key={s.id} className="py-4 flex justify-between items-center">
              <div>
                <p className="font-semibold text-sm">{s.valor}</p>
                <p className="text-xs text-gray-500">{s.tipo} — sugerido em {new Date(s.criado_em).toLocaleDateString()}</p>
              </div>
              {filtroStatus === 'pendente' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => aprovarSugestao(s)}
                    className="text-green-600 hover:text-green-800"
                    aria-label="Aprovar"
                  >
                    <Check />
                  </button>
                  <button
                    onClick={() => rejeitarSugestao(s.id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Rejeitar"
                  >
                    <X />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
