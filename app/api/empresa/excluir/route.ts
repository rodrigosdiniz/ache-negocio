// app/api/empresa/excluir/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  const supabase = createClient()
  const { id, user_id } = await req.json()

  if (!id || !user_id) {
    return NextResponse.json({ error: 'ID da empresa ou usuário não informado.' }, { status: 400 })
  }

  const { data: empresa, error: fetchError } = await supabase
    .from('empresas')
    .select('id, user_id')
    .eq('id', id)
    .single()

  if (fetchError || !empresa || empresa.user_id !== user_id) {
    return NextResponse.json({ error: 'Empresa não encontrada ou não autorizada.' }, { status: 403 })
  }

  const { error: deleteError } = await supabase.from('empresas').delete().eq('id', id)

  if (deleteError) {
    return NextResponse.json({ error: 'Erro ao excluir a empresa.' }, { status: 500 })
  }

  return NextResponse.json({ message: 'Empresa excluída com sucesso.' })
}
