'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Star, Pencil, Trash2, Plus, Search, ArrowDownUp } from 'lucide-react'

interface Empresa {
  id: string
  nome: string
  cidade: string
  categoria: string
  nota_media: number | null
}

interface Plano {
  plano: string
  atualizado_em: string
}

export default function DashboardPerfil() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [plano, setPlano] = useState<Plano | null>(null)
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('')
  const [ordenacao, setOrdenacao] = useState<'nome' | 'nota'>('nome')

  useEffect(() => {
    const carregar = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return setLoading(false)

      const [empresasRes, planoRes] = await Promise.all([
        supabase
          .from('empresas')
          .select('id, nome, cidade, categoria, nota_media')
          .eq('user_id', user.id),

        supabase
          .from('usuarios_planos')
          .select('plano, atualizado_em')
          .eq('user_id', user.id)
          .single()
      ])

      if (empresasRes.data) setEmpresas(empresasRes.data)
      if (planoRes.data) setPlano(planoRes.data)
      setLoading(false)
    }

    carregar()
  }, [])

  const excluirEmpresa = async (id: string, nome: string) => {
    const confirmar = confirm(`Deseja realmente excluir a empresa "${nome}"? Essa ação não poderá ser desfeita.`)
    if (!confirmar) return

    const res = await fetch('/api/empresa/excluir', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (res.ok) {
      alert('Empresa excluída com sucesso.')
      setEmpresas((empresas) => empresas.filter((e) => e.id !== id))
    } else {
      alert('Erro ao excluir a empresa.')
    }
  }

  const empresasFiltradas = empresas
    .filter((e) => e.nome.toLowerCase().includes(filtro.toLowerCase()))
    .sort((a, b) => {
      if (ordenacao === 'nome') {
        return a.nome.localeCompare(b.nome)
      } else {
        return (b.nota_media || 0) - (a.nota_media || 0)
      }
    })

  if (loading) {
    return <p className="text-center text-sm text-gray-600 py-10">Ca
