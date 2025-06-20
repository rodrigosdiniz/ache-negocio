import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const body = await req.json()
  const { nome, email, mensagem } = body

  if (!email || !mensagem) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando.' }, { status: 400 })
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Ache Negócio <contato@emails.achenegocio.com.br>',
      to: ['contato@achenegocio.com.br'],
      subject: `Nova mensagem de ${nome || 'Visitante'}`,
      reply_to: email,
      html: `
        <p><strong>Nome:</strong> ${nome || 'Não informado'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${mensagem.replace(/\n/g, '<br />')}</p>
      `
    })

    if (error) {
      console.error(error)
      return NextResponse.json({ error: 'Erro ao enviar e-mail.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Erro inesperado.' }, { status: 500 })
  }
}
