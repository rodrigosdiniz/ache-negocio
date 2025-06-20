// /app/api/contato/route.ts
import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { nome, email, mensagem } = await req.json()

  if (!nome || !email || !mensagem) {
    return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
  }

  try {
    const data = await resend.emails.send({
      from: 'Ache Negócio <contato@achenegocio.com.br>',
      to: 'seu-email@seudominio.com',
      subject: 'Nova mensagem de contato no Ache Negócio',
      html: `
        <p><strong>Nome:</strong> ${nome}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${mensagem.replace(/\n/g, '<br />')}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error)
    return NextResponse.json({ error: 'Erro ao enviar e-mail' }, { status: 500 })
  }
}
