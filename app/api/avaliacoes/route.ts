// app/api/avaliacoes/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { resend } from '@/lib/resend'

export async function POST(req: Request) {
  const supabase = createClient()

  try {
    const { empresa_id, autor, nota, comentario } = await req.json()

    if (!empresa_id || !autor || !nota || !comentario) {
      return NextResponse.json(
        { status: 'erro', message: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase.from('avaliacoes').insert([
      {
        empresa_id,
        autor,
        nota,
        comentario
      }
    ])

    if (error) {
      console.error('[SUPABASE ERROR]', error)
      return NextResponse.json(
        { status: 'erro', message: 'Erro ao salvar avaliação' },
        { status: 500 }
      )
    }

    // (Opcional) Envia notificação por e-mail
    await resend.emails.send({
      from: 'contato@seudominio.com.br',
      to: 'admin@seudominio.com.br',
      subject: `Nova avaliação para empresa ${empresa_id}`,
      html: `
        <div style="font-family: sans-serif; font-size: 16px;">
          <h2>Nova avaliação recebida</h2>
          <p><strong>Autor:</strong> ${autor}</p>
          <p><strong>Nota:</strong> ${nota}</p>
          <p><strong>Comentário:</strong><br/>${comentario}</p>
        </div>
      `
    })

    return NextResponse.json({ status: 'ok', data })
  } catch (error: any) {
    console.error('[AVALIACAO ERROR]', error)
    return NextResponse.json(
      { status: 'erro', message: 'Erro inesperado no servidor' },
      { status: 500 }
    )
  }
}
