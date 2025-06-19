import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-04-10'
})

export async function POST(req: Request) {
  try {
    const { priceId } = await req.json()

    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      success_url: `${process.env.BASE_URL}/dashboard?success=true`,
      cancel_url: `${process.env.BASE_URL}/precos?canceled=true`
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Erro no checkout:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
