// middleware.ts

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Cria um cliente Supabase no contexto do middleware (server-side)
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Tenta obter o usuário atual com base no cookie de sessão
  const {
    data: { user }
  } = await supabase.auth.getUser()

  // Protege qualquer rota que comece com /dashboard
  if (!user && req.nextUrl.pathname.startsWith('/dashboard')) {
    // Redireciona para a página de login, mantendo a URL atual
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Se estiver autenticado (ou for rota pública), segue normalmente
  return res
}

// Define quais rotas o middleware deve interceptar
export const config = {
  matcher: ['/dashboard/:path*'] // Protege todas as rotas dentro de /dashboard
}
