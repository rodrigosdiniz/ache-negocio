'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const EMAIL_ADMIN = 'contato@achenegocio.com.br'

export default function AdminCidadesPage() {
  const supabase = createClientComponentClient()
  const [sessionChecked, setSessionChecked] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [cidades, setCidades] = useState<any[]>([])
  const [novaCidade, setNovaCidade] = useState('')
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [novoNome, setNovoNome] = useState('')

  useEffect(() => {
    const checarAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const email = session?.user?.email
      setIsAdmin(email === EMAIL_ADMIN)
      setSessionChecked(true)
    }
    checarAdmin()
  }, [])

  const carregarCidades = async () => {
    const { data } = await supabase.from('cidades').select('*').order('nome')
    setCidades(data || [])
  }

  useEffect(
