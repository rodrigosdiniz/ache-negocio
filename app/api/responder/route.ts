// app/api/responder/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const form = await req.formData()
  const avaliacao_id = form.get('avaliacao_id') as string
  const resposta = form.get('resposta') as string

  if (!avaliacao_id || !resposta) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const supabase = createClient(cookies())
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  // Verifica se o usuário é dono da empresa da avaliação
  const { data: avaliacao } = await supabase.from('avaliacoes').select('empresa_id').eq('id', avaliacao_id).single()
  if (!avaliacao) {
    return NextResponse.json({ error: 'Avaliação não encontrada' }, { status: 404 })
  }

  const { data: empresa } = await supabase.from('empresas').select('user_id').eq('id', avaliacao.empresa_id).single()
  if (!empresa || empresa.user_id !== user.id) {
    return NextResponse.json({ error: 'Permissão negada' }, { status: 403 })
  }

  const { error: updateError } = await supabase
    .from('avaliacoes')
    .update({ resposta })
    .eq('id', avaliacao_id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  const response = NextResponse.redirect(`/empresa/${avaliacao.empresa_id}`, { status: 303 })
  response.cookies.set('toast', 'Resposta enviada com sucesso!', { path: '/', maxAge: 5 })
  return response
}
