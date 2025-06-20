import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { enviarEmail } from '@/lib/resend'

export async function POST(req: NextRequest) {
  const body = await req.json()

  const { empresa_id, user_id, nota, comentario } = body

  if (!empresa_id || !user_id || !nota) {
    return NextResponse.json({ erro: 'Dados incompletos.' }, { status: 400 })
  }

  // 1. Inserir avaliação
  const { data: novaAvaliacao, error: erroInsercao } = await supabase
    .from('avaliacoes')
    .insert([{ empresa_id, user_id, nota, comentario }])
    .select()
    .single()

  if (erroInsercao) {
    return NextResponse.json({ erro: 'Erro ao inserir avaliação.' }, { status: 500 })
  }

  // 2. Calcular nova média da empresa
  const { data: avaliacoes } = await supabase
    .from('avaliacoes')
    .select('nota')
    .eq('empresa_id', empresa_id)

  const media = (
    avaliacoes?.reduce((acc, a) => acc + a.nota, 0) / (avaliacoes?.length || 1)
  ).toFixed(2)

  await supabase
    .from('empresas')
    .update({ nota_media: parseFloat(media) })
    .eq('id', empresa_id)

  // 3. Buscar e-mail do dono da empresa
  const { data: empresa } = await supabase
    .from('empresas')
    .select('nome, email')
    .eq('id', empresa_id)
    .single()

  if (empresa?.email) {
    await enviarEmail(
      empresa.email,
      'Sua empresa recebeu uma nova avaliação!',
      `
        <p>Olá,</p>
        <p>A empresa <strong>${empresa.nome}</strong> recebeu uma nova avaliação:</p>
        <p><strong>Nota:</strong> ${nota}</p>
        <p><strong>Comentário:</strong> ${comentario || 'Nenhum comentário.'}</p>
        <p><a href="https://achenegocio.com.br/empresas/${empresa_id}">Clique aqui para ver no site</a>.</p>
      `
    )
  }

  return NextResponse.json({ sucesso: true })
}
