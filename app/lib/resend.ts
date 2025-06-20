import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function enviarEmail(to: string, subject: string, html: string) {
  return await resend.emails.send({
    from: 'Ache Negócio <no-reply@achenegocio.com.br>',
    to,
    subject,
    html,
  })
}
