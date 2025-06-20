import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

export async function POST(req: Request) {
  const rawBody = await req.text()
  const sig = headers().get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('Assinatura Stripe ausente ou chave secreta não definida.')
    return NextResponse.json({ error: 'Configuração inválida do webhook' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Erro ao verificar webhook:', err)
    return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 })
  }

  const supabase = createClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.user_id
      const plano = session.metadata?.plano

      if (!userId || !plano) {
        console.error('Metadata ausente na sessão Stripe:', session)
        break
      }

      console.log(`✔️ Pagamento confirmado: ${userId} assinou o plano ${plano}`)

      await supabase
        .from('usuarios_planos')
        .upsert({
          user_id: userId,
          plano,
          atualizado_em: new Date().toISOString(),
        })

      break
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice
      console.log(`Fatura paga: ${invoice.id} para o cliente ${invoice.customer}`)
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      console.log(`Assinatura atualizada: ${subscription.id} → status: ${subscription.status}`)
      break
    }

    default:
      console.log(`⚠️ Evento não tratado: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
