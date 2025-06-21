// app/api/empresa/excluir/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const supabase = createClient(cookies())
  const body = await req.json()
  const empresaId = body.id

  if (!empresaId) {
    return NextResponse.json({ error: 'ID da empresa não fornecido' }, { status: 400 })
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 })
  }

  // Verifica se a empresa pertence ao usuário autenticado
  const { data: empresa, error: fetchError } = await supabase
    .from('empresas')
    .select('id')
    .eq('id', empresaId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !empresa) {
    return NextResponse.json({ error: 'Empresa não encontrada ou não pertence ao usuário' }, { status: 403 })
  }

  const { error: deleteError } = await supabase
    .from('empresas')
    .delete()
    .eq('id', empresaId)

  if (deleteError) {
    return NextResponse.json({ error: 'Erro ao excluir empresa' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
