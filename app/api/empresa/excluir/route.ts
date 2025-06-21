import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const supabase = createClient(cookies())
  const body = await req.json()
  const { id } = body

  if (!id) {
    return NextResponse.json({ error: 'ID da empresa não informado.' }, { status: 400 })
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 })
  }

  // Verifica se a empresa pertence ao usuário autenticado
  const { data: empresa, error: fetchError } = await supabase
    .from('empresas')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !empresa) {
    return NextResponse.json({ error: 'Empresa não encontrada ou acesso negado.' }, { status: 404 })
  }

  // Remove avaliações relacionadas (opcional — ajuste conforme integridade do banco)
  await supabase.from('avaliacoes').delete().eq('empresa_id', id)

  // Exclui a empresa
  const { error: deleteError } = await supabase.from('empresas').delete().eq('id', id)
  if (deleteError) {
    return NextResponse.json({ error: 'Erro ao excluir a empresa.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
