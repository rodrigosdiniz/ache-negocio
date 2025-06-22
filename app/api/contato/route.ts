// app/api/contato/route.ts
import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { nome, email, mensagem } = await req.json()

  try {
    const data = await resend.emails.send({
      from: 'contato@seudominio.com.br',
      to: 'voce@seudominio.com.br',
      subject: `Nova mensagem de contato - ${nome}`,
      html: `
        <h1>Nova mensagem do formulário de contato</h1>
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensagem:</strong><br/>${mensagem}</p>
      `,
    })

    return NextResponse.json({ status: 'ok', data })
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return NextResponse.json({ status: 'erro', message: 'Falha ao enviar e-mail' }, { status: 500 })
  }
}
