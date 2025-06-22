// app/api/contato/route.ts
import { NextResponse } from 'next/server'
import { resend } from '@/lib/resend' // 🔁 Usa o helper centralizado

export async function POST(req: Request) {
  try {
    const { nome, email, mensagem } = await req.json()

    if (!nome || !email || !mensagem) {
      return NextResponse.json(
        { status: 'erro', message: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    const data = await resend.emails.send({
      from: 'contato@seudominio.com.br', // deve estar verificado na Resend
      to: 'voce@seudominio.com.br',
      subject: `Nova mensagem de contato - ${nome}`,
      html: `
        <div style="font-family: sans-serif; font-size: 16px;">
          <h2>Mensagem de contato</h2>
          <p><strong>Nome:</strong> ${nome}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Mensagem:</strong><br/>${mensagem}</p>
        </div>
      `,
      headers: {
        'Reply-To': email
      }
    })

    return NextResponse.json({ status: 'ok', data })
  } catch (error: any) {
    console.error('[CONTATO ERROR]', error)
    return NextResponse.json(
      { status: 'erro', message: 'Falha ao enviar e-mail' },
      { status: 500 }
    )
  }
}
