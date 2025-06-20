// app/api/avaliar/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const form = await req.formData()
  const empresa_id = form.get('empresa_id') as string
  const nota = Number(form.get('nota'))
  const comentario = form.get('comentario') as string

  if (!empresa_id || isNaN(nota) || nota < 1 || nota > 5 || !comentario) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const supabase = createClient(cookies())
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const { error: insertError } = await supabase.from('avaliacoes').insert({
    empresa_id,
    nota,
    comentario,
    user_id: user.id
  })

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  const response = NextResponse.redirect(`/empresa/${empresa_id}`, { status: 303 })
  response.cookies.set('toast', 'Avaliação enviada com sucesso!', { path: '/', maxAge: 5 })
  return response
}
