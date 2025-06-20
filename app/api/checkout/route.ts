// app/api/checkout/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

const PRICE_IDS: Record<string, string> = {
  essencial: 'price_1RcCKyDGX3huEh4zYgQhU6NO',
  profissional: 'price_1RcCLiDGX3huEh4zhyRY9DEo',
  elite: 'price_1RcCaRDGX3huEh4zsgJOYkV4',
}

export async function POST(req: Request) {
  const { plano, user_id, empresa_id } = await req.json()

  if (!plano || !PRICE_IDS[plano]) {
    return NextResponse.json({ error: 'Plano inválido' }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: PRICE_IDS[plano],
          quantity: 1,
        },
      ],
      success_url: `${process.env.BASE_URL}/dashboard?sucesso=1`,
      cancel_url: `${process.env.BASE_URL}/dashboard?cancelado=1`,
      metadata: {
        user_id,
        empresa_id,
        plano,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
