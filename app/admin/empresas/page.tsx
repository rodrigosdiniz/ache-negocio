'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

const EMAIL_ADMIN = 'contato@achenegocio.com.br'

export default function AdminEmpresasPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [sessionChecked, setSessionChecked] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [empresas, setEmpresas] = useState<any[]>([])

  useEffect(() => {
    const checarAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const email = session?.user?.email
      setIsAdmin(email === EMAIL_ADMIN)
      setSessionChecked(true)
    }
    checarAdmin()
  }, [])

  const carregarEmpresas = async () => {
    const { data } = await supabase
      .from('empresas')
      .select('*')
      .order('created_at', { ascending: false })

    setEmpresas(data || [])
  }

  useEffect(() => {
    if (isAdmin) carregarEmpresas()
  }, [isAdmin])

  const excluirEmpresa = async (id: string) => {
    const confirmar = confirm('Deseja realmente excluir esta empresa?')
    if (!confirmar) return
    await supabase.from('empresas').delete().eq('id', id)
    await carregarEmpresas()
  }

  if (!sessionChecked) return <div className="p-8">Verificando permissão...</div>
  if (!isAdmin) return <div className="p-8 text-red-600 font-semibold">Acesso restrito.</div>

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Empresas Cadastradas</h1>

      {empresas.length === 0 && (
        <p className="text-gray-500">Nenhuma empresa cadastrada.</p>
      )}

      <div className="space-y-4">
        {empresas.map((empresa) => (
          <div key={empresa.id} className="border p-4 rounded-xl bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-blue-700">{empresa.nome}</h2>
                <p className="text-sm text-gray-600">
                  {empresa.categoria} • {empresa.cidade}
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/empresa/${empresa.id}`}
                  target="_blank"
                  className="text-sm text-green-600 hover:underline"
                >
                  Ver página
                </Link>
                <button
                  onClick={() => excluirEmpresa(empresa.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
